/**
 * API endpoints for individual shift type management
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
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
    const { 
      code, 
      name, 
      startTime, 
      endTime, 
      isAllDay, 
      recurrence, 
      eligibility 
    } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    // Verify shift type exists and belongs to user's organization
    const existing = await prisma.shiftType.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Shift type not found' }, { status: 404 })
    }

    // Check if new code conflicts with another shift type (excluding current one)
    if (code.toUpperCase() !== existing.code) {
      const codeConflict = await prisma.shiftType.findFirst({
        where: {
          organizationId: user.organizationId,
          code: code.toUpperCase(),
          id: { not: params.id }
        }
      })

      if (codeConflict) {
        return NextResponse.json({ error: 'Shift type code already exists' }, { status: 409 })
      }
    }

    // Process eligibility
    let requiredSubspecialtyId = null
    let allowAny = true
    let namedAllowlist = null

    if (eligibility) {
      if (eligibility.allowAny) {
        allowAny = true
      } else if (eligibility.requiredSubspecialtyId) {
        // Verify subspecialty exists
        const subspecialty = await prisma.subspecialty.findFirst({
          where: {
            organizationId: user.organizationId,
            code: eligibility.requiredSubspecialtyId
          }
        })
        if (!subspecialty) {
          return NextResponse.json({ error: 'Invalid subspecialty code' }, { status: 400 })
        }
        requiredSubspecialtyId = subspecialty.id
        allowAny = false
      } else if (eligibility.namedAllowlist && eligibility.namedAllowlist.length > 0) {
        namedAllowlist = eligibility.namedAllowlist.join(',')
        allowAny = false
      }
    }

    // Update shift type
    const shiftType = await prisma.shiftType.update({
      where: { id: params.id },
      data: {
        code: code.toUpperCase(),
        name,
        startTime: startTime || '08:00',
        endTime: endTime || '16:00',
        isAllDay: Boolean(isAllDay),
        // Recurrence days
        monday: Boolean(recurrence?.mon),
        tuesday: Boolean(recurrence?.tue),
        wednesday: Boolean(recurrence?.wed),
        thursday: Boolean(recurrence?.thu),
        friday: Boolean(recurrence?.fri),
        saturday: Boolean(recurrence?.sat),
        sunday: Boolean(recurrence?.sun),
        // Eligibility
        requiredSubspecialtyId,
        allowAny,
        namedAllowlist
      }
    })

    return NextResponse.json({
      success: true,
      shiftType: {
        id: shiftType.id,
        code: shiftType.code,
        name: shiftType.name,
        startTime: shiftType.startTime,
        endTime: shiftType.endTime,
        isAllDay: shiftType.isAllDay
      }
    })

  } catch (error) {
    console.error('[API] Failed to update shift type:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update shift type'
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

    // Verify shift type exists and belongs to user's organization
    const existing = await prisma.shiftType.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Shift type not found' }, { status: 404 })
    }

    // Check if shift type is being used by any schedule instances
    const usedByInstances = await prisma.scheduleInstance.count({
      where: {
        shiftTypeId: params.id,
        organizationId: user.organizationId
      }
    })

    if (usedByInstances > 0) {
      return NextResponse.json({ 
        error: `Cannot delete shift type: it is used by ${usedByInstances} schedule instance(s). Delete those first.` 
      }, { status: 409 })
    }

    // Delete shift type
    await prisma.shiftType.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Shift type deleted successfully'
    })

  } catch (error) {
    console.error('[API] Failed to delete shift type:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete shift type'
    }, { status: 500 })
  }
}
