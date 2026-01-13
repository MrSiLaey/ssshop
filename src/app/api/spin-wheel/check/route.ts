import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - ตรวจสอบสถานะการหมุน (หมุนได้หรือยัง)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = request.headers.get('x-session-id')

    // ดึง wheel ที่ active
    const wheel = await prisma.spinWheel.findFirst({
      where: { isActive: true },
    })

    if (!wheel) {
      return NextResponse.json({ 
        canSpin: false, 
        reason: 'No active wheel' 
      })
    }

    // ตรวจสอบ last spin
    const whereCondition: any = {
      wheelId: wheel.id,
    }

    if (session?.user?.id) {
      whereCondition.userId = session.user.id
    } else if (sessionId) {
      whereCondition.sessionId = sessionId
    } else {
      // ไม่มี session id ให้หมุนได้
      return NextResponse.json({
        canSpin: true,
        showPopup: wheel.showOnPopup,
        popupDelay: wheel.popupDelay,
        spinsRemaining: wheel.spinsPerDay,
        wheel: {
          id: wheel.id,
          name: wheel.name,
          description: wheel.description,
        },
      })
    }

    const lastSpin = await prisma.spinHistory.findFirst({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    })

    // ตรวจสอบจำนวนครั้งต่อวัน
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const spinsToday = await prisma.spinHistory.count({
      where: {
        ...whereCondition,
        createdAt: { gte: today },
      },
    })

    const spinsRemaining = Math.max(0, wheel.spinsPerDay - spinsToday)

    // ตรวจสอบ cooldown
    let canSpin = true
    let remainingSeconds = 0
    
    if (lastSpin) {
      const cooldownTime = wheel.cooldownHours * 60 * 60 * 1000
      const timeSinceLastSpin = Date.now() - lastSpin.createdAt.getTime()
      
      if (timeSinceLastSpin < cooldownTime) {
        canSpin = false
        remainingSeconds = Math.ceil((cooldownTime - timeSinceLastSpin) / 1000)
      }
    }

    // ถ้าหมุนหมดแล้ววันนี้
    if (spinsRemaining <= 0) {
      canSpin = false
    }

    return NextResponse.json({
      canSpin,
      showPopup: wheel.showOnPopup && canSpin,
      popupDelay: wheel.popupDelay,
      remainingSeconds,
      spinsRemaining,
      wheel: {
        id: wheel.id,
        name: wheel.name,
        description: wheel.description,
      },
    })
  } catch (error) {
    console.error('Error checking spin status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
