/**
 * API endpoints for individual subspecialty management
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const body = await request.json()
    const { code, name } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    // Verify subspecialty exists and belongs to user's organization
    const existing = await prisma.subspecialty.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Subspecialty not found' }, { status: 404 })
    }

    // Check if new code conflicts with another subspecialty (excluding current one)
    if (code.toUpperCase() !== existing.code) {
      const codeConflict = await prisma.subspecialty.findFirst({
        where: {
          organizationId: user.organizationId,
          code: code.toUpperCase(),
          id: { not: params.id }
        }
      })

      if (codeConflict) {
        return NextResponse.json({ error: 'Subspecialty code already exists' }, { status: 409 })
      }
    }

    // Update subspecialty
    const subspecialty = await prisma.subspecialty.update({
      where: { id: params.id },
      data: {
        code: code.toUpperCase(),
        name
      }
    })

    return NextResponse.json({
      success: true,
      subspecialty: {
        id: subspecialty.id,
        code: subspecialty.code,
        name: subspecialty.name
      }
    })

  } catch (error) {
    console.error('[API] Failed to update subspecialty:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update subspecialty'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Verify subspecialty exists and belongs to user's organization
    const existing = await prisma.subspecialty.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Subspecialty not found' }, { status: 404 })
    }

    // Check if subspecialty is being used by any shift types
    const usedByShifts = await prisma.shiftType.count({
      where: {
        requiredSubspecialtyId: params.id,
        organizationId: user.organizationId
      }
    })

    if (usedByShifts > 0) {
      return NextResponse.json({ 
        error: `Cannot delete subspecialty: it is used by ${usedByShifts} shift type(s)` 
      }, { status: 409 })
    }

    // Check if subspecialty is being used by any radiologists
    const usedByStaff = await prisma.radiologyProfile.count({
      where: {
        subspecialtyId: params.id
      }
    })

    if (usedByStaff > 0) {
      return NextResponse.json({ 
        error: `Cannot delete subspecialty: it is assigned to ${usedByStaff} radiologist(s)` 
      }, { status: 409 })
    }

    // Delete subspecialty
    await prisma.subspecialty.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Subspecialty deleted successfully'
    })

  } catch (error) {
    console.error('[API] Failed to delete subspecialty:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete subspecialty'
    }, { status: 500 })
  }
}
