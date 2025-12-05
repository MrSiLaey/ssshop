import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateLicenseKey } from '@/lib/utils'

// GET /api/licenses - Get user's licenses
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
    const productId = searchParams.get('productId')

    const where: any = {}

    // Non-admin users can only see their own licenses
    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id
    }

    if (status) where.status = status
    if (productId) where.productId = productId

    const [licenses, total] = await Promise.all([
      prisma.licenseKey.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
            },
          },
          activations: {
            where: { isActive: true },
            select: {
              id: true,
              machineId: true,
              machineName: true,
              activatedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.licenseKey.count({ where }),
    ])

    return NextResponse.json({
      licenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    )
  }
}

// POST /api/licenses - Create license (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      productId,
      userId,
      orderId,
      expiresAt,
      activationsLimit = 1,
      metadata,
    } = body

    // Check product exists and is digital
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.productType !== 'DIGITAL') {
      return NextResponse.json(
        { error: 'License can only be created for digital products' },
        { status: 400 }
      )
    }

    // Generate unique license key
    let key: string
    let isUnique = false

    do {
      key = generateLicenseKey()
      const existing = await prisma.licenseKey.findUnique({
        where: { key },
      })
      isUnique = !existing
    } while (!isUnique)

    const license = await prisma.licenseKey.create({
      data: {
        key,
        productId,
        userId,
        orderId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        activationsLimit,
        metadata,
        purchasedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'LICENSE_CREATED',
        entity: 'LicenseKey',
        entityId: license.id,
        newData: { key: license.key, productId, userId },
      },
    })

    return NextResponse.json(license, { status: 201 })
  } catch (error) {
    console.error('Error creating license:', error)
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    )
  }
}
