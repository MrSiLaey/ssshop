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

// GET - ดึงสถิติและประวัติการหมุน
export async function GET(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const wheelId = searchParams.get('wheelId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (wheelId) {
      where.wheelId = wheelId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // ดึงประวัติ
    const [history, total] = await Promise.all([
      prisma.spinHistory.findMany({
        where,
        include: {
          wheel: {
            select: { name: true },
          },
          prize: {
            select: { name: true, type: true, value: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.spinHistory.count({ where }),
    ])

    // สถิติรวม
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const [
      totalSpins,
      totalWins,
      todaySpins,
      todayWins,
      weekSpins,
      monthSpins,
      couponUsageRate,
      prizeDistribution,
    ] = await Promise.all([
      prisma.spinHistory.count({ where }),
      prisma.spinHistory.count({ where: { ...where, isWin: true } }),
      prisma.spinHistory.count({ where: { ...where, createdAt: { gte: today } } }),
      prisma.spinHistory.count({ where: { ...where, isWin: true, createdAt: { gte: today } } }),
      prisma.spinHistory.count({ where: { ...where, createdAt: { gte: thisWeek } } }),
      prisma.spinHistory.count({ where: { ...where, createdAt: { gte: thisMonth } } }),
      prisma.spinHistory.count({ where: { ...where, couponUsed: true } }),
      prisma.spinHistory.groupBy({
        by: ['prizeId'],
        where: { ...where, prizeId: { not: null } },
        _count: true,
      }),
    ])

    // ดึงชื่อรางวัลสำหรับ distribution
    const prizeIds = prizeDistribution.map((p: any) => p.prizeId).filter(Boolean) as string[]
    const prizes = await prisma.spinPrize.findMany({
      where: { id: { in: prizeIds } },
      select: { id: true, name: true, type: true },
    })

    const prizeDistributionWithNames = prizeDistribution.map((p: any) => {
      const prize = prizes.find((pr: any) => pr.id === p.prizeId)
      return {
        prizeId: p.prizeId,
        name: prize?.name || 'Unknown',
        type: prize?.type || 'UNKNOWN',
        count: p._count,
      }
    })

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalSpins,
        totalWins,
        winRate: totalSpins > 0 ? ((totalWins / totalSpins) * 100).toFixed(2) : 0,
        todaySpins,
        todayWins,
        weekSpins,
        monthSpins,
        couponUsageRate: totalWins > 0 ? ((couponUsageRate / totalWins) * 100).toFixed(2) : 0,
        prizeDistribution: prizeDistributionWithNames,
      },
    })
  } catch (error) {
    console.error('Error fetching spin history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
