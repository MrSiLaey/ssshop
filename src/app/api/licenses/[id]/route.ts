import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateLicenseKey } from '@/lib/utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/licenses/[id] - Get single license
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

    const license = await prisma.licenseKey.findFirst({
      where: {
        OR: [
          { id },
          { key: id },
        ],
        // Non-admin users can only see their own licenses
        ...(session.user.role !== 'ADMIN' ? { userId: session.user.id } : {}),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
            slug: true,
            digitalAssets: {
              select: {
                id: true,
                name: true,
                fileName: true,
                fileSize: true,
                version: true,
              },
            },
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
            createdAt: true,
          },
        },
        activations: {
          orderBy: { activatedAt: 'desc' },
        },
      },
    })

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(license)
  } catch (error) {
    console.error('Error fetching license:', error)
    return NextResponse.json(
      { error: 'Failed to fetch license' },
      { status: 500 }
    )
  }
}

// PUT /api/licenses/[id] - Update license (Admin only)
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
    const { status, expiresAt, activationsLimit, metadata } = body

    const oldLicense = await prisma.licenseKey.findUnique({
      where: { id },
    })

    if (!oldLicense) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (activationsLimit !== undefined) updateData.activationsLimit = activationsLimit
    if (metadata !== undefined) updateData.metadata = metadata

    const license = await prisma.licenseKey.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'LICENSE_UPDATED',
        entity: 'LicenseKey',
        entityId: license.id,
        oldData: { status: oldLicense.status, expiresAt: oldLicense.expiresAt },
        newData: updateData,
      },
    })

    return NextResponse.json(license)
  } catch (error) {
    console.error('Error updating license:', error)
    return NextResponse.json(
      { error: 'Failed to update license' },
      { status: 500 }
    )
  }
}

// POST /api/licenses/[id]/regenerate - Regenerate license key (Admin only)
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const license = await prisma.licenseKey.findUnique({
      where: { id },
    })

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    // Generate new unique key
    let newKey: string
    let isUnique = false

    do {
      newKey = generateLicenseKey()
      const existing = await prisma.licenseKey.findUnique({
        where: { key: newKey },
      })
      isUnique = !existing
    } while (!isUnique)

    // Update license with new key and reset activations
    const updatedLicense = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Deactivate all current activations
      await tx.licenseActivation.updateMany({
        where: { licenseKeyId: id, isActive: true },
        data: { isActive: false, deactivatedAt: new Date() },
      })

      // Update license key
      return tx.licenseKey.update({
        where: { id },
        data: {
          key: newKey,
          activationsCount: 0,
          machineIds: [],
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'LICENSE_REGENERATED',
        entity: 'LicenseKey',
        entityId: id,
        oldData: { key: license.key },
        newData: { key: newKey },
      },
    })

    return NextResponse.json(updatedLicense)
  } catch (error) {
    console.error('Error regenerating license:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate license' },
      { status: 500 }
    )
  }
}
