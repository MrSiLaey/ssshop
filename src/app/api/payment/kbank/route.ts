import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import crypto from 'crypto'

// K Bank OPEN API Configuration
interface KBankConfig {
  consumerKey: string
  consumerSecret: string
  merchantId: string
  partnerId: string
  partnerSecret: string
  environment: 'sandbox' | 'production'
}

const KBANK_ENDPOINTS = {
  sandbox: 'https://openapi-sandbox.kasikornbank.com',
  production: 'https://openapi.kasikornbank.com',
}

// Get K Bank configuration from database
async function getKBankConfig(): Promise<KBankConfig | null> {
  const setting = await prisma.setting.findUnique({
    where: { key: 'kbank_payment' },
  })
  
  if (!setting?.value) return null
  
  const config = setting.value as Record<string, unknown>
  
  if (!config.consumerKey || !config.consumerSecret || !config.merchantId) {
    return null
  }
  
  return {
    consumerKey: config.consumerKey as string,
    consumerSecret: config.consumerSecret as string,
    merchantId: config.merchantId as string,
    partnerId: config.partnerId as string || '',
    partnerSecret: config.partnerSecret as string || '',
    environment: (config.environment as 'sandbox' | 'production') || 'sandbox',
  }
}

// Generate QR code for PromptPay via K Bank API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, amount, description } = body

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Order ID and amount are required' }, { status: 400 })
    }

    const config = await getKBankConfig()
    
    if (!config) {
      // Fallback to manual payment if K Bank not configured
      return NextResponse.json({
        success: true,
        paymentMethod: 'manual',
        message: 'K Bank not configured. Please use manual bank transfer.',
        bankInfo: {
          bankName: 'กสิกรไทย (KBANK)',
          accountNumber: 'กรุณาตั้งค่าในหน้า Admin',
          accountName: 'กรุณาตั้งค่าในหน้า Admin',
        },
      })
    }

    const baseUrl = KBANK_ENDPOINTS[config.environment]
    const referenceNo = `ORD-${orderId}-${Date.now()}`
    
    // Generate OAuth token
    const tokenResponse = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenResponse.ok) {
      console.error('Failed to get K Bank token')
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to K Bank API',
        paymentMethod: 'manual',
      })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Create QR payment
    const qrPayload = {
      partnerTxnUid: crypto.randomUUID(),
      partnerId: config.partnerId,
      partnerSecret: config.partnerSecret,
      requestDt: new Date().toISOString(),
      merchantId: config.merchantId,
      terminalId: 'TERM001',
      qrType: '3',  // Thai QR Payment
      txnAmount: amount.toFixed(2),
      txnCurrencyCode: 'THB',
      reference1: referenceNo,
      reference2: orderId,
      reference3: description || 'Payment for order',
      metadata: '',
    }

    const qrResponse = await fetch(`${baseUrl}/v1/qrpayment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-]api-key': config.consumerKey,
      },
      body: JSON.stringify(qrPayload),
    })

    if (!qrResponse.ok) {
      console.error('Failed to generate QR code')
      return NextResponse.json({
        success: false,
        error: 'Failed to generate QR payment',
        paymentMethod: 'manual',
      })
    }

    const qrData = await qrResponse.json()

    // Create payment record
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    
    if (order) {
      await prisma.payment.create({
        data: {
          orderId,
          amount,
          currency: 'THB',
          method: 'PROMPTPAY',
          status: 'PENDING',
          provider: 'kbank',
          providerPaymentId: referenceNo,
          metadata: {
            qrCode: qrData.qrCode,
            referenceNo,
            partnerTxnUid: qrPayload.partnerTxnUid,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      paymentMethod: 'qr',
      qrCode: qrData.qrCode,
      qrImage: qrData.qrImage,
      referenceNo,
      amount,
      expiresIn: 900, // 15 minutes
    })

  } catch (error) {
    console.error('K Bank payment error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}

// GET - Check payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const referenceNo = searchParams.get('referenceNo')

    if (!orderId && !referenceNo) {
      return NextResponse.json({ error: 'Order ID or Reference No is required' }, { status: 400 })
    }

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: referenceNo
        ? { providerPaymentId: referenceNo }
        : { orderId: orderId! },
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // If already completed, return status
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({
        status: 'COMPLETED',
        paidAt: payment.paidAt,
        amount: payment.amount,
      })
    }

    const config = await getKBankConfig()
    
    if (!config) {
      return NextResponse.json({
        status: payment.status,
        message: 'Manual payment verification required',
      })
    }

    // Check with K Bank API
    const baseUrl = KBANK_ENDPOINTS[config.environment]
    
    // Get token
    const tokenResponse = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Inquiry payment status
      const statusResponse = await fetch(`${baseUrl}/v1/qrpayment/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          partnerId: config.partnerId,
          partnerSecret: config.partnerSecret,
          reference1: payment.providerPaymentId,
        }),
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        
        if (statusData.status === 'PAID' || statusData.statusCode === '00') {
          // Update payment and order status
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'COMPLETED',
                paidAt: new Date(),
                providerChargeId: statusData.transactionId,
              },
            }),
            prisma.order.update({
              where: { id: payment.orderId },
              data: {
                paymentStatus: 'COMPLETED',
                status: 'CONFIRMED',
              },
            }),
          ])

          // Activate license keys if digital product
          await prisma.licenseKey.updateMany({
            where: { orderId: payment.orderId },
            data: { status: 'ACTIVE', purchasedAt: new Date() },
          })

          return NextResponse.json({
            status: 'COMPLETED',
            paidAt: new Date(),
            amount: payment.amount,
          })
        }
      }
    }

    return NextResponse.json({
      status: payment.status,
      amount: payment.amount,
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 })
  }
}
