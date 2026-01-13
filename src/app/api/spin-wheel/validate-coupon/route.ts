import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST - ตรวจสอบและใช้ coupon จากวงล้อ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { couponCode, cartTotal } = body

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    // หา spin history ที่มี coupon code นี้
    const spinHistory = await prisma.spinHistory.findUnique({
      where: { couponCode },
      include: {
        prize: true,
      },
    })

    if (!spinHistory) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid coupon code' 
      })
    }

    if (spinHistory.couponUsed) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Coupon has already been used' 
      })
    }

    if (spinHistory.couponExpiresAt && new Date() > spinHistory.couponExpiresAt) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Coupon has expired' 
      })
    }

    const prize = spinHistory.prize
    if (!prize) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid prize' 
      })
    }

    // ตรวจสอบ min purchase
    if (prize.minPurchase && cartTotal && Number(cartTotal) < Number(prize.minPurchase)) {
      return NextResponse.json({ 
        valid: false, 
        error: `Minimum purchase of ฿${prize.minPurchase} required`,
        minPurchase: Number(prize.minPurchase),
      })
    }

    // คำนวณส่วนลด
    let discountAmount = 0
    let discountType = prize.type

    switch (prize.type) {
      case 'DISCOUNT_FIXED':
      case 'CASHBACK':
        discountAmount = Number(prize.value)
        break
      case 'DISCOUNT_PERCENT':
        if (cartTotal) {
          discountAmount = (Number(cartTotal) * Number(prize.value)) / 100
          // จำกัด max discount
          if (prize.maxValue && discountAmount > Number(prize.maxValue)) {
            discountAmount = Number(prize.maxValue)
          }
        }
        break
      case 'FREE_SHIPPING':
        discountType = 'FREE_SHIPPING'
        break
    }

    return NextResponse.json({
      valid: true,
      prize: {
        name: prize.name,
        type: prize.type,
        value: Number(prize.value),
        maxValue: prize.maxValue ? Number(prize.maxValue) : null,
      },
      discountAmount,
      discountType,
      expiresAt: spinHistory.couponExpiresAt,
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - ใช้ coupon (mark as used)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { couponCode } = body

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    await prisma.spinHistory.update({
      where: { couponCode },
      data: { couponUsed: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error using coupon:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
