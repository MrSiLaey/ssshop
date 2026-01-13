import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/orders/[id] - Get single order
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id },
        ],
        // Non-admin users can only see their own orders
        ...(session.user.role !== 'ADMIN' ? { userId: session.user.id } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
                slug: true,
                productType: true,
              },
            },
          },
        },
        payments: true,
        licenseKeys: {
          select: {
            id: true,
            key: true,
            status: true,
            expiresAt: true,
            productId: true,
          },
        },
        coupon: {
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { status, trackingNumber, shippingCarrier, adminNote } = body

    const oldOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!oldOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'SHIPPED') {
        updateData.shippedAt = new Date()
      } else if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date()
      }
    }

    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (shippingCarrier) updateData.shippingCarrier = shippingCarrier
    if (adminNote) updateData.adminNote = adminNote

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        payments: true,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ORDER_UPDATED',
        entity: 'Order',
        entityId: order.id,
        oldData: { status: oldOrder.status },
        newData: updateData,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
