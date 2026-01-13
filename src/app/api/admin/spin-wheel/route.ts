import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Middleware ตรวจสอบสิทธิ์ Admin
async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN') {
    return false
  }
  return true
}

// GET - ดึงรายการ wheels ทั้งหมด (สำหรับ Admin)
export async function GET() {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wheels = await prisma.spinWheel.findMany({
      include: {
        prizes: {
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            spins: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // ดึงสถิติเพิ่มเติม
    const wheelsWithStats = await Promise.all(
      wheels.map(async (wheel: any) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [todaySpins, todayWins, totalWins] = await Promise.all([
          prisma.spinHistory.count({
            where: {
              wheelId: wheel.id,
              createdAt: { gte: today },
            },
          }),
          prisma.spinHistory.count({
            where: {
              wheelId: wheel.id,
              isWin: true,
              createdAt: { gte: today },
            },
          }),
          prisma.spinHistory.count({
            where: {
              wheelId: wheel.id,
              isWin: true,
            },
          }),
        ])

        return {
          ...wheel,
          stats: {
            totalSpins: wheel._count.spins,
            todaySpins,
            todayWins,
            totalWins,
          },
        }
      })
    )

    return NextResponse.json(wheelsWithStats)
  } catch (error) {
    console.error('Error fetching wheels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - สร้าง wheel ใหม่
export async function POST(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      isActive, 
      spinsPerDay, 
      cooldownHours,
      showOnPopup,
      popupDelay,
      backgroundColor,
      textColor,
      prizes 
    } = body

    // ถ้าสร้าง wheel ใหม่เป็น active ให้ปิด wheel อื่นก่อน
    if (isActive) {
      await prisma.spinWheel.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })
    }

    const wheel = await prisma.spinWheel.create({
      data: {
        name,
        description,
        isActive: isActive ?? true,
        spinsPerDay: spinsPerDay ?? 1,
        cooldownHours: cooldownHours ?? 24,
        showOnPopup: showOnPopup ?? true,
        popupDelay: popupDelay ?? 3,
        backgroundColor,
        textColor,
        prizes: prizes ? {
          create: prizes.map((prize: any, index: number) => ({
            name: prize.name,
            description: prize.description,
            type: prize.type || 'DISCOUNT_FIXED',
            value: prize.value,
            maxValue: prize.maxValue,
            color: prize.color || '#FF6B00',
            textColor: prize.textColor || '#FFFFFF',
            icon: prize.icon,
            probability: prize.probability,
            totalQuantity: prize.totalQuantity,
            dailyLimit: prize.dailyLimit,
            validDays: prize.validDays || 7,
            minPurchase: prize.minPurchase,
            isActive: prize.isActive ?? true,
            position: index,
          })),
        } : undefined,
      },
      include: {
        prizes: true,
      },
    })

    return NextResponse.json(wheel)
  } catch (error) {
    console.error('Error creating wheel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - อัพเดท wheel
export async function PATCH(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Wheel ID is required' }, { status: 400 })
    }

    // ถ้าเปลี่ยนเป็น active ให้ปิด wheel อื่นก่อน
    if (updateData.isActive) {
      await prisma.spinWheel.updateMany({
        where: { 
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      })
    }

    const wheel = await prisma.spinWheel.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        isActive: updateData.isActive,
        spinsPerDay: updateData.spinsPerDay,
        cooldownHours: updateData.cooldownHours,
        showOnPopup: updateData.showOnPopup,
        popupDelay: updateData.popupDelay,
        backgroundColor: updateData.backgroundColor,
        textColor: updateData.textColor,
      },
      include: {
        prizes: true,
      },
    })

    return NextResponse.json(wheel)
  } catch (error) {
    console.error('Error updating wheel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - ลบ wheel
export async function DELETE(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Wheel ID is required' }, { status: 400 })
    }

    await prisma.spinWheel.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wheel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
