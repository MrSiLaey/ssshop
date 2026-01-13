import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber, generateLicenseKey } from '@/lib/utils'
import { Prisma } from '@prisma/client'

// POST /api/orders/checkout - Create order from checkout form
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { 
      items, 
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress, 
      paymentMethod,
      note,
      subtotal 
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'ไม่มีสินค้าในคำสั่งซื้อ' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลติดต่อให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check if physical products need shipping address
    const hasPhysicalProducts = items.some((item: any) => !item.isDigital)
    if (hasPhysicalProducts && !shippingAddress) {
      return NextResponse.json(
        { error: 'กรุณากรอกที่อยู่จัดส่งสินค้า' },
        { status: 400 }
      )
    }

    // Validate products and calculate totals
    let calculatedTotal = 0
    const orderItems: any[] = []
    const digitalItems: any[] = []

    for (const item of items) {
      // Verify product exists and price is correct
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          productType: true,
          trackInventory: true,
          sku: true,
        }
      })

      if (!product) {
        return NextResponse.json(
          { error: `ไม่พบสินค้า: ${item.name}` },
          { status: 400 }
        )
      }

      // Check stock for physical products
      if (product.productType === 'PHYSICAL' && product.trackInventory) {
        if (product.quantity < item.quantity) {
          return NextResponse.json(
            { error: `สินค้า ${product.name} มีไม่เพียงพอ (เหลือ ${product.quantity} ชิ้น)` },
            { status: 400 }
          )
        }
      }

      const itemTotal = Number(product.price) * item.quantity
      calculatedTotal += itemTotal

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        isDigital: product.productType === 'DIGITAL',
      })

      if (product.productType === 'DIGITAL') {
        digitalItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
        })
      }
    }

    // Calculate shipping (free for now, can add logic later)
    const shippingCost = 0
    
    // Calculate tax (optional, 0 for simplicity)
    const tax = 0
    
    // Final total
    const total = calculatedTotal + shippingCost + tax

    // Create order with transaction
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          subtotal: calculatedTotal,
          discount: 0,
          tax,
          shippingCost,
          total,
          shippingAddress: hasPhysicalProducts ? shippingAddress : null,
          customerNote: note,
          status: 'PENDING',
          paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      })

      // Update product stock for physical products
      for (const item of orderItems) {
        if (!item.isDigital) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          })
        }
      }

      // Generate licenses for digital products
      const licenses = []
      for (const digitalItem of digitalItems) {
        for (let i = 0; i < digitalItem.quantity; i++) {
          const license = await tx.licenseKey.create({
            data: {
              key: generateLicenseKey(),
              productId: digitalItem.productId,
              userId: session.user.id,
              orderId: newOrder.id,
              status: 'SUSPENDED', // Will be activated after payment confirmation
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            },
          })
          licenses.push(license)
        }
      }

      return { ...newOrder, licenses }
    })

    // Log the order creation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ORDER_CREATED',
        entity: 'Order',
        entityId: order.id,
        newData: { 
          orderNumber: order.orderNumber, 
          total: order.total,
          paymentMethod,
          itemCount: orderItems.length,
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
