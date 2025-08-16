/**
 * API endpoints for shift type management
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
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

    if (!recurrence) {
      return NextResponse.json({ error: 'Recurrence pattern is required' }, { status: 400 })
    }

    // Check if code already exists in this organization
    const existing = await prisma.shiftType.findFirst({
      where: {
        organizationId: user.organizationId,
        code: code.toUpperCase()
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Shift type code already exists' }, { status: 409 })
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

    // Create shift type
    const shiftType = await prisma.shiftType.create({
      data: {
        code: code.toUpperCase(),
        name,
        startTime: startTime || '08:00',
        endTime: endTime || '16:00',
        isAllDay: Boolean(isAllDay),
        organizationId: user.organizationId,
        // Recurrence days
        monday: Boolean(recurrence.mon),
        tuesday: Boolean(recurrence.tue),
        wednesday: Boolean(recurrence.wed),
        thursday: Boolean(recurrence.thu),
        friday: Boolean(recurrence.fri),
        saturday: Boolean(recurrence.sat),
        sunday: Boolean(recurrence.sun),
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
    console.error('[API] Failed to create shift type:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create shift type'
    }, { status: 500 })
  }
}
