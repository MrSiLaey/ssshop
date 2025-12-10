import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

// POST /api/licenses/validate - Validate a license key
// This is a public API for external applications to validate licenses
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { licenseKey, machineId, machineName, productId } = body

    if (!licenseKey) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'License key is required' 
        },
        { status: 400 }
      )
    }

    // Find license
    const license = await prisma.licenseKey.findUnique({
      where: { key: licenseKey },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        activations: {
          where: { isActive: true },
        },
      },
    })

    // License not found
    if (!license) {
      return NextResponse.json({
        valid: false,
        error: 'License key not found',
      })
    }

    // Check if license is for the correct product
    if (productId && license.productId !== productId) {
      return NextResponse.json({
        valid: false,
        error: 'License key is not valid for this product',
      })
    }

    // Check license status
    if (license.status !== 'ACTIVE') {
      return NextResponse.json({
        valid: false,
        error: `License is ${license.status.toLowerCase()}`,
        status: license.status,
      })
    }

    // Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // Auto-update status to expired
      await prisma.licenseKey.update({
        where: { id: license.id },
        data: { status: 'EXPIRED' },
      })

      return NextResponse.json({
        valid: false,
        error: 'License has expired',
        status: 'EXPIRED',
        expiresAt: license.expiresAt,
      })
    }

    // If machineId is provided, check/register activation
    if (machineId) {
      const existingActivation = license.activations.find(
        (a: typeof license.activations[number]) => a.machineId === machineId
      )

      if (existingActivation) {
        // Already activated on this machine
        return NextResponse.json({
          valid: true,
          license: {
            key: license.key,
            product: license.product,
            status: license.status,
            expiresAt: license.expiresAt,
            activationsCount: license.activationsCount,
            activationsLimit: license.activationsLimit,
          },
          activation: {
            machineId: existingActivation.machineId,
            machineName: existingActivation.machineName,
            activatedAt: existingActivation.activatedAt,
          },
        })
      }

      // Check activation limit
      if (license.activationsCount >= license.activationsLimit) {
        return NextResponse.json({
          valid: false,
          error: 'Activation limit reached',
          activationsCount: license.activationsCount,
          activationsLimit: license.activationsLimit,
        })
      }

      // Create new activation
      const ipAddress = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown'

      const activation = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create activation record
        const newActivation = await tx.licenseActivation.create({
          data: {
            licenseKeyId: license.id,
            machineId,
            machineName: machineName || null,
            ipAddress: ipAddress as string,
          },
        })

        // Update license
        const currentMachineIds = (license.machineIds as unknown as string[]) || []
        const newMachineIds = [...currentMachineIds, machineId]

        await tx.licenseKey.update({
          where: { id: license.id },
          data: {
            activationsCount: { increment: 1 },
            machineIds: newMachineIds,
            lastActivatedAt: new Date(),
          },
        })

        return newActivation
      })

      return NextResponse.json({
        valid: true,
        license: {
          key: license.key,
          product: license.product,
          status: license.status,
          expiresAt: license.expiresAt,
          activationsCount: license.activationsCount + 1,
          activationsLimit: license.activationsLimit,
        },
        activation: {
          machineId: activation.machineId,
          machineName: activation.machineName,
          activatedAt: activation.activatedAt,
          isNew: true,
        },
      })
    }

    // Just validate without activation
    return NextResponse.json({
      valid: true,
      license: {
        key: license.key,
        product: license.product,
        status: license.status,
        expiresAt: license.expiresAt,
        activationsCount: license.activationsCount,
        activationsLimit: license.activationsLimit,
      },
    })
  } catch (error) {
    console.error('Error validating license:', error)
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/licenses/validate - Deactivate a license on a machine
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { licenseKey, machineId } = body

    if (!licenseKey || !machineId) {
      return NextResponse.json(
        { error: 'License key and machine ID are required' },
        { status: 400 }
      )
    }

    const license = await prisma.licenseKey.findUnique({
      where: { key: licenseKey },
      include: {
        activations: {
          where: { machineId, isActive: true },
        },
      },
    })

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    const activation = license.activations[0]

    if (!activation) {
      return NextResponse.json(
        { error: 'No active activation found for this machine' },
        { status: 404 }
      )
    }

    // Deactivate
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.licenseActivation.update({
        where: { id: activation.id },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
        },
      })

      // Update license
      const currentMachineIds = (license.machineIds as unknown as string[]) || []
      const updatedMachineIds = currentMachineIds.filter(
        (id: string) => id !== machineId
      )

      await tx.licenseKey.update({
        where: { id: license.id },
        data: {
          activationsCount: { decrement: 1 },
          machineIds: updatedMachineIds,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'License deactivated successfully',
    })
  } catch (error) {
    console.error('Error deactivating license:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate license' },
      { status: 500 }
    )
  }
}
