/**
 * API endpoints for individual staff member management
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
    const { name, email, subspecialtyId, ftePercent } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Verify staff member exists and belongs to user's organization
    const existingStaff = await prisma.user.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId,
        role: 'RADIOLOGIST'
      },
      include: {
        radiologistProfile: true
      }
    })

    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })
    }

    // Check if new email conflicts with another user (excluding current one)
    if (email !== existingStaff.email) {
      const emailConflict = await prisma.user.findFirst({
        where: {
          email,
          id: { not: params.id }
        }
      })

      if (emailConflict) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
      }
    }

    // Validate subspecialty if provided
    let validSubspecialtyId = null
    if (subspecialtyId) {
      const subspecialty = await prisma.subspecialty.findFirst({
        where: {
          organizationId: user.organizationId,
          code: subspecialtyId
        }
      })
      if (!subspecialty) {
        return NextResponse.json({ error: 'Invalid subspecialty code' }, { status: 400 })
      }
      validSubspecialtyId = subspecialty.id
    }

    // Update user
    await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email
      }
    })

    // Update or create radiologist profile (only if subspecialty is provided since it's required)
    if (validSubspecialtyId) {
      if (existingStaff.radiologistProfile) {
        await prisma.radiologyProfile.update({
          where: { userId: params.id },
          data: {
            subspecialtyId: validSubspecialtyId,
            ftePercent: Math.max(10, Math.min(100, ftePercent || 100))
          }
        })
      } else {
        await prisma.radiologyProfile.create({
          data: {
            userId: params.id,
            subspecialtyId: validSubspecialtyId,
            ftePercent: Math.max(10, Math.min(100, ftePercent || 100))
          }
        })
      }
    } else if (existingStaff.radiologistProfile) {
      // If no subspecialty provided but profile exists, just update FTE
      await prisma.radiologyProfile.update({
        where: { userId: params.id },
        data: {
          ftePercent: Math.max(10, Math.min(100, ftePercent || 100))
        }
      })
    }

    // Get updated data with subspecialty info
    const updatedStaff = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        radiologistProfile: {
          include: {
            subspecialty: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      staff: {
        id: updatedStaff!.id,
        name: updatedStaff!.name,
        email: updatedStaff!.email,
        subspecialty: updatedStaff!.radiologistProfile?.subspecialty?.code || null,
        subspecialtyName: updatedStaff!.radiologistProfile?.subspecialty?.name || null,
        ftePercent: updatedStaff!.radiologistProfile?.ftePercent || 100
      }
    })

  } catch (error) {
    console.error('[API] Failed to update staff member:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update staff member'
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

    // Verify staff member exists and belongs to user's organization
    const existingStaff = await prisma.user.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId,
        role: 'RADIOLOGIST'
      }
    })

    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })
    }

    // Check if staff member has any schedule assignments
    const hasAssignments = await prisma.scheduleAssignment.count({
      where: { userId: params.id }
    })

    if (hasAssignments > 0) {
      return NextResponse.json({ 
        error: `Cannot delete staff member: they have ${hasAssignments} schedule assignment(s). Remove assignments first.` 
      }, { status: 409 })
    }

    // Check if staff member has vacation preferences
    const hasPreferences = await prisma.vacationPreference.count({
      where: { userId: params.id }
    })

    // Delete related data first
    if (hasPreferences > 0) {
      await prisma.vacationPreference.deleteMany({
        where: { userId: params.id }
      })
    }

    // Delete radiologist profile if it exists
    await prisma.radiologyProfile.deleteMany({
      where: { userId: params.id }
    })

    // Delete user
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully'
    })

  } catch (error) {
    console.error('[API] Failed to delete staff member:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete staff member'
    }, { status: 500 })
  }
}
