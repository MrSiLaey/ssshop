import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: typeof cartItems[number]) => {
      return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    return NextResponse.json({
      items: cartItems,
      itemCount: cartItems.length,
      subtotal,
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await req.json()

    // Check product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check stock for physical products
    if (product.productType === 'PHYSICAL' && product.trackInventory) {
      if (product.quantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await req.json()

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    // Check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.productType === 'PHYSICAL' && product.trackInventory) {
      if (product.quantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      data: { quantity },
      include: {
        product: true,
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear cart or remove item
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (productId) {
      // Remove specific item
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      })
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })
    }

    return NextResponse.json({ message: 'Cart updated successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
