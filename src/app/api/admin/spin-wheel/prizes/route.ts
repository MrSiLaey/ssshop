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

// GET - ดึงรางวัลทั้งหมดของ wheel
export async function GET(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const wheelId = searchParams.get('wheelId')

    if (!wheelId) {
      return NextResponse.json({ error: 'Wheel ID is required' }, { status: 400 })
    }

    const prizes = await prisma.spinPrize.findMany({
      where: { wheelId },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json(prizes)
  } catch (error) {
    console.error('Error fetching prizes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - สร้างรางวัลใหม่
export async function POST(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { wheelId, ...prizeData } = body

    if (!wheelId) {
      return NextResponse.json({ error: 'Wheel ID is required' }, { status: 400 })
    }

    // หา position สูงสุด
    const maxPosition = await prisma.spinPrize.findFirst({
      where: { wheelId },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const prize = await prisma.spinPrize.create({
      data: {
        wheelId,
        name: prizeData.name,
        description: prizeData.description,
        type: prizeData.type || 'DISCOUNT_FIXED',
        value: prizeData.value,
        maxValue: prizeData.maxValue,
        color: prizeData.color || '#FF6B00',
        textColor: prizeData.textColor || '#FFFFFF',
        icon: prizeData.icon,
        probability: prizeData.probability,
        totalQuantity: prizeData.totalQuantity,
        dailyLimit: prizeData.dailyLimit,
        validDays: prizeData.validDays || 7,
        minPurchase: prizeData.minPurchase,
        isActive: prizeData.isActive ?? true,
        position: (maxPosition?.position ?? -1) + 1,
      },
    })

    return NextResponse.json(prize)
  } catch (error) {
    console.error('Error creating prize:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - อัพเดทรางวัล
export async function PATCH(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Prize ID is required' }, { status: 400 })
    }

    const prize = await prisma.spinPrize.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(prize)
  } catch (error) {
    console.error('Error updating prize:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - ลบรางวัล
export async function DELETE(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Prize ID is required' }, { status: 400 })
    }

    await prisma.spinPrize.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prize:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - อัพเดทลำดับรางวัล
export async function PUT(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prizes } = body // Array of { id, position }

    if (!prizes || !Array.isArray(prizes)) {
      return NextResponse.json({ error: 'Prizes array is required' }, { status: 400 })
    }

    // อัพเดทลำดับทั้งหมด
    await Promise.all(
      prizes.map((p: { id: string; position: number }) =>
        prisma.spinPrize.update({
          where: { id: p.id },
          data: { position: p.position },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering prizes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
