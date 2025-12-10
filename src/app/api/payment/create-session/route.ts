import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy')

// POST /api/payment/create-session - Create payment session
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
    const { orderId, paymentMethod = 'stripe' } = body

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (paymentMethod === 'stripe') {
      // Create Stripe Checkout Session
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(
        (item: any) => ({
          price_data: {
            currency: 'thb',
            product_data: {
              name: item.productName,
              images: item.product.thumbnail ? [item.product.thumbnail] : [],
            },
            unit_amount: Math.round(Number(item.price) * 100), // Convert to satang
          },
          quantity: item.quantity,
        })
      )

      // Add shipping if applicable
      if (Number(order.shippingCost) > 0) {
        lineItems.push({
          price_data: {
            currency: 'thb',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(Number(order.shippingCost) * 100),
          },
          quantity: 1,
        })
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
        customer_email: order.user.email,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        ...(Number(order.discount) > 0 && {
          discounts: [
            {
              coupon: await getOrCreateStripeCoupon(Number(order.discount)),
            },
          ],
        }),
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          currency: 'THB',
          method: 'CREDIT_CARD',
          provider: 'stripe',
          providerPaymentId: stripeSession.id,
        },
      })

      // Update order payment status
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PROCESSING' },
      })

      return NextResponse.json({
        sessionId: stripeSession.id,
        url: stripeSession.url,
      })
    } else if (paymentMethod === 'promptpay') {
      // For PromptPay via Omise
      // This is a simplified example - implement according to Omise documentation
      return NextResponse.json({
        message: 'PromptPay payment not implemented yet',
        // Implement Omise PromptPay integration here
      })
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating payment session:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

// Helper function to create Stripe coupon for discounts
async function getOrCreateStripeCoupon(amount: number): Promise<string> {
  const couponId = `DISCOUNT_${amount}`

  try {
    await stripe.coupons.retrieve(couponId)
    return couponId
  } catch {
    // Create new coupon
    const coupon = await stripe.coupons.create({
      id: couponId,
      amount_off: Math.round(amount * 100),
      currency: 'thb',
      duration: 'once',
    })
    return coupon.id
  }
}
