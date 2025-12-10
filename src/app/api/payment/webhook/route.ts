import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { generateLicenseKey } from '@/lib/utils'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy')

// POST /api/payment/webhook - Handle Stripe webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handlePaymentSuccess(session)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await handlePaymentExpired(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Handle successful payment
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) {
    console.error('No orderId in session metadata')
    return
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    console.error('Order not found:', orderId)
    return
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Update payment record
    await tx.payment.updateMany({
      where: { providerPaymentId: session.id },
      data: {
        status: 'COMPLETED',
        providerChargeId: session.payment_intent as string,
        paidAt: new Date(),
      },
    })

    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
      },
    })

    // Generate license keys for digital products
    for (const item of order.items) {
      if (item.isDigital && item.product.productType === 'DIGITAL') {
        // Generate license for each quantity
        for (let i = 0; i < item.quantity; i++) {
          let key: string
          let isUnique = false

          do {
            key = generateLicenseKey()
            const existing = await tx.licenseKey.findUnique({
              where: { key },
            })
            isUnique = !existing
          } while (!isUnique)

          // Calculate expiry (e.g., 1 year from now)
          const expiresAt = new Date()
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          await tx.licenseKey.create({
            data: {
              key,
              productId: item.productId,
              userId: order.userId,
              orderId: order.id,
              status: 'ACTIVE',
              purchasedAt: new Date(),
              expiresAt,
            },
          })
        }
      }
    }

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: order.userId,
        action: 'PAYMENT_COMPLETED',
        entity: 'Order',
        entityId: order.id,
        newData: {
          orderNumber: order.orderNumber,
          amount: session.amount_total,
          paymentMethod: 'stripe',
        },
      },
    })
  })

  // TODO: Send confirmation email to customer
  console.log(`Payment completed for order ${order.orderNumber}`)
}

// Handle expired payment session
async function handlePaymentExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) return

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.payment.updateMany({
      where: { providerPaymentId: session.id },
      data: { status: 'CANCELLED' },
    })

    await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'CANCELLED' },
    })
  })

  console.log(`Payment session expired for order ${orderId}`)
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  await prisma.payment.updateMany({
    where: { providerPaymentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      errorMessage: paymentIntent.last_payment_error?.message,
    },
  })

  console.log(`Payment failed: ${paymentIntent.id}`)
}

// Handle refund
async function handleRefund(charge: Stripe.Charge) {
  const payment = await prisma.payment.findFirst({
    where: { providerChargeId: charge.id },
    include: { order: true },
  })

  if (!payment) return

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    })

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'REFUNDED',
        paymentStatus: 'REFUNDED',
      },
    })

    // Revoke license keys for this order
    await tx.licenseKey.updateMany({
      where: { orderId: payment.orderId },
      data: { status: 'REVOKED' },
    })

    await tx.auditLog.create({
      data: {
        action: 'PAYMENT_REFUNDED',
        entity: 'Order',
        entityId: payment.orderId,
        newData: { chargeId: charge.id, amount: charge.amount_refunded },
      },
    })
  })

  console.log(`Refund processed for order ${payment.order.orderNumber}`)
}

// Route segment config for Next.js App Router
export const dynamic = 'force-dynamic'
