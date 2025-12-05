import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber, generateLicenseKey } from '@/lib/utils'

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')

    const where: any = { userId: session.user.id }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnail: true,
                  slug: true,
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              method: true,
              status: true,
              paidAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create order from cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { shippingAddress, billingAddress, couponCode, customerNote } = body

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock and calculate totals
    let subtotal = 0
    let hasPhysicalProducts = false
    const orderItems: any[] = []

    for (const item of cartItems) {
      const product = item.product

      // Check stock for physical products
      if (product.productType === 'PHYSICAL') {
        hasPhysicalProducts = true
        if (product.trackInventory && product.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}` },
            { status: 400 }
          )
        }
      }

      const itemTotal = Number(product.price) * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        isDigital: product.productType === 'DIGITAL',
      })
    }

    // Apply coupon if provided
    let discount = 0
    let coupon = null

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
      })

      if (coupon) {
        // Check usage limits
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return NextResponse.json(
            { error: 'Coupon usage limit reached' },
            { status: 400 }
          )
        }

        // Check minimum purchase
        if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
          return NextResponse.json(
            { error: `Minimum purchase of ${coupon.minPurchase} required` },
            { status: 400 }
          )
        }

        // Calculate discount
        if (coupon.discountType === 'PERCENTAGE') {
          discount = subtotal * (Number(coupon.discountValue) / 100)
        } else {
          discount = Number(coupon.discountValue)
        }

        // Apply max discount if set
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
          discount = Number(coupon.maxDiscount)
        }
      }
    }

    // Calculate shipping (simplified - can be extended)
    const shippingCost = hasPhysicalProducts ? 50 : 0 // 50 THB flat rate

    // Calculate tax (7% VAT)
    const taxableAmount = subtotal - discount
    const tax = taxableAmount * 0.07

    // Calculate total
    const total = subtotal - discount + tax + shippingCost

    // Create order with transaction
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          subtotal,
          discount,
          tax,
          shippingCost,
          total,
          couponId: coupon?.id,
          couponCode: coupon?.code,
          shippingAddress: hasPhysicalProducts ? shippingAddress : null,
          billingAddress,
          customerNote,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Update product stock for physical products
      for (const item of cartItems) {
        if (item.product.productType === 'PHYSICAL' && item.product.trackInventory) {
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          })
        }
      }

      // Update coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usageCount: {
              increment: 1,
            },
          },
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      return newOrder
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ORDER_CREATED',
        entity: 'Order',
        entityId: order.id,
        newData: { orderNumber: order.orderNumber, total: order.total },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
