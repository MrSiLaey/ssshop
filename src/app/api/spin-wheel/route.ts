import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Decimal } from '@prisma/client/runtime/library'

// GET - ดึงข้อมูลวงล้อที่ active
export async function GET() {
  try {
    const wheel = await prisma.spinWheel.findFirst({
      where: { isActive: true },
      include: {
        prizes: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            value: true,
            color: true,
            textColor: true,
            icon: true,
            // ไม่ส่ง probability ไปให้ client เพื่อป้องกันโกง
          },
        },
      },
    })

    if (!wheel) {
      return NextResponse.json({ error: 'No active wheel found' }, { status: 404 })
    }

    return NextResponse.json(wheel)
  } catch (error) {
    console.error('Error fetching spin wheel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - หมุนวงล้อ
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json().catch(() => ({}))
    const sessionId = body.sessionId || request.headers.get('x-session-id')

    // ดึง wheel ที่ active
    const wheel = await prisma.spinWheel.findFirst({
      where: { isActive: true },
      include: {
        prizes: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!wheel) {
      return NextResponse.json({ error: 'No active wheel found' }, { status: 404 })
    }

    // ตรวจสอบว่าหมุนได้หรือยัง (cooldown)
    const lastSpin = await prisma.spinHistory.findFirst({
      where: {
        wheelId: wheel.id,
        OR: [
          { userId: session?.user?.id },
          { sessionId: sessionId },
        ].filter(Boolean),
      },
      orderBy: { createdAt: 'desc' },
    })

    if (lastSpin) {
      const cooldownTime = wheel.cooldownHours * 60 * 60 * 1000
      const timeSinceLastSpin = Date.now() - lastSpin.createdAt.getTime()
      
      if (timeSinceLastSpin < cooldownTime) {
        const remainingTime = Math.ceil((cooldownTime - timeSinceLastSpin) / 1000)
        return NextResponse.json({ 
          error: 'Please wait before spinning again',
          remainingSeconds: remainingTime,
        }, { status: 429 })
      }
    }

    // ตรวจสอบจำนวนครั้งต่อวัน
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const spinsToday = await prisma.spinHistory.count({
      where: {
        wheelId: wheel.id,
        createdAt: { gte: today },
        OR: [
          { userId: session?.user?.id },
          { sessionId: sessionId },
        ].filter(Boolean),
      },
    })

    if (spinsToday >= wheel.spinsPerDay) {
      return NextResponse.json({ 
        error: 'Maximum spins per day reached',
        maxSpins: wheel.spinsPerDay,
      }, { status: 429 })
    }

    // สุ่มรางวัลตาม probability
    const prize = selectPrize(wheel.prizes)

    // สร้าง coupon code ถ้าถูกรางวัล
    let couponCode: string | null = null
    let couponExpiresAt: Date | null = null
    
    if (prize && prize.type !== 'NO_PRIZE') {
      couponCode = generateCouponCode()
      couponExpiresAt = new Date()
      couponExpiresAt.setDate(couponExpiresAt.getDate() + prize.validDays)
      
      // อัพเดท wonCount
      await prisma.spinPrize.update({
        where: { id: prize.id },
        data: { wonCount: { increment: 1 } },
      })
    }

    // บันทึกประวัติ
    const spinHistory = await prisma.spinHistory.create({
      data: {
        wheelId: wheel.id,
        prizeId: prize?.id,
        userId: session?.user?.id,
        sessionId: !session?.user?.id ? sessionId : null,
        isWin: prize ? prize.type !== 'NO_PRIZE' : false,
        couponCode,
        couponExpiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    // หา index ของรางวัลที่ถูก (สำหรับ animation)
    const prizeIndex = prize ? wheel.prizes.findIndex((p: { id: string }) => p.id === prize.id) : 0

    return NextResponse.json({
      success: true,
      prizeIndex,
      prize: prize ? {
        id: prize.id,
        name: prize.name,
        description: prize.description,
        type: prize.type,
        value: prize.value,
        color: prize.color,
      } : null,
      couponCode,
      couponExpiresAt,
      spinId: spinHistory.id,
    })
  } catch (error) {
    console.error('Error spinning wheel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ฟังก์ชันสุ่มรางวัลตาม probability
function selectPrize(prizes: any[]) {
  if (prizes.length === 0) return null

  // คำนวณ probability รวม
  const totalProbability = prizes.reduce((sum, prize) => {
    return sum + Number(prize.probability)
  }, 0)

  // สุ่มตัวเลข
  const random = Math.random() * totalProbability
  
  let cumulative = 0
  for (const prize of prizes) {
    cumulative += Number(prize.probability)
    if (random <= cumulative) {
      // ตรวจสอบ daily limit
      if (prize.dailyLimit) {
        // ต้อง check daily count ด้วย แต่ตอนนี้ข้ามไปก่อน
      }
      
      // ตรวจสอบ total quantity
      if (prize.totalQuantity && prize.wonCount >= prize.totalQuantity) {
        continue // ข้ามไปรางวัลถัดไป
      }
      
      return prize
    }
  }

  // ถ้าไม่ได้รางวัลอะไรเลย return รางวัลแรก (หรือ NO_PRIZE)
  return prizes.find(p => p.type === 'NO_PRIZE') || prizes[0]
}

// สร้าง coupon code
function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'SPIN-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
