import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const assignmentId = url.searchParams.get('assignmentId')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'assignmentId is required' },
        { status: 400 }
      )
    }

    // Get the assignment details
    const assignment = await prisma.scheduleAssignment.findFirst({
      where: {
        id: assignmentId,
        instance: {
          organizationId: session.user.organizationId
        }
      },
      include: {
        instance: {
          include: {
            shiftType: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            radiologistProfile: {
              select: {
                subspecialty: true
              }
            }
          }
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found or unauthorized' },
        { status: 404 }
      )
    }

    const shiftDate = assignment.instance.date
    const shift = assignment.instance.shiftType

    // Get all shift types that are equivalent to this one (for swap purposes)
    // For now, we'll consider shifts with the same subspecialty requirement as equivalent
    const equivalentShiftTypes = await prisma.shiftType.findMany({
      where: {
        organizationId: session.user.organizationId,
        OR: [
          { id: shift.id }, // Same shift type
          { 
            AND: [
              { requiredSubspecialtyId: shift.requiredSubspecialtyId },
              { requiredSubspecialtyId: { not: null } }
            ]
          }, // Same subspecialty requirement
          { allowAny: true } // Any shift that allows any subspecialty
        ]
      }
    })

    const equivalentShiftTypeIds = equivalentShiftTypes.map(st => st.id)

    // Find all assignments on the same date that could potentially be swapped
    const potentialSwaps = await prisma.scheduleAssignment.findMany({
      where: {
        instance: {
          organizationId: session.user.organizationId,
          date: shiftDate,
          shiftTypeId: { in: equivalentShiftTypeIds }
        },
        userId: { not: assignment.userId }, // Exclude the requester
        user: {
          radiologistProfile: {
            isNot: null // Only radiologists
          }
        }
      },
      include: {
        instance: {
          include: {
            shiftType: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            radiologistProfile: {
              select: {
                subspecialty: true
              }
            }
          }
        }
      }
    })

    // Filter eligible partners and check for conflicts
    const eligiblePartners = []

    for (const potentialSwap of potentialSwaps) {
      const targetShift = potentialSwap.instance.shiftType
      const targetUser = potentialSwap.user
      
      // Check if it's the same shift type
      const isSameShiftType = shift.id === targetShift.id

      // Check if they're equivalent (same subspecialty requirement)
      const isEquivalentType = shift.requiredSubspecialtyId === targetShift.requiredSubspecialtyId

      // Check if the requester can work the target shift
      const canRequesterWorkTarget = await checkEligibility(
        assignment.user,
        targetShift
      )

      // Check if the target user can work the requester's shift
      const canTargetWorkRequester = await checkEligibility(
        targetUser,
        shift
      )

      // Check for time conflicts for both users
      const requesterConflicts = await checkTimeConflicts(
        assignment.userId,
        shiftDate,
        targetShift,
        session.user.organizationId,
        [potentialSwap.id] // Exclude the swap target assignment
      )

      const targetConflicts = await checkTimeConflicts(
        targetUser.id,
        shiftDate,
        shift,
        session.user.organizationId,
        [assignment.id] // Exclude the original assignment
      )

      const hasConflicts = requesterConflicts.length > 0 || targetConflicts.length > 0

      if ((isSameShiftType || isEquivalentType) && 
          canRequesterWorkTarget && 
          canTargetWorkRequester) {
        eligiblePartners.push({
          assignment: potentialSwap,
          swapType: isSameShiftType ? 'SAME_TYPE' : 'EQUIVALENT_TYPE',
          canSwap: !hasConflicts,
          conflicts: {
            requester: requesterConflicts,
            target: targetConflicts
          },
          eligibilityChecks: {
            canRequesterWorkTarget,
            canTargetWorkRequester,
            isSameShiftType,
            isInEquivalenceSet: isEquivalentType
          }
        })
      }
    }

    return NextResponse.json({
      originalAssignment: assignment,
      eligiblePartners,
      totalFound: eligiblePartners.length
    })
  } catch (error) {
    console.error('Error finding eligible swap partners:', error)
    return NextResponse.json(
      { error: 'Failed to find eligible swap partners' },
      { status: 500 }
    )
  }
}

async function checkTimeConflicts(
  userId: string,
  date: Date,
  shift: any,
  organizationId: string,
  excludeAssignmentIds: string[] = []
): Promise<any[]> {
  // Find all assignments for this user on the same date
  const userAssignments = await prisma.scheduleAssignment.findMany({
    where: {
      userId,
      instance: {
        date,
        organizationId
      },
      id: {
        notIn: excludeAssignmentIds
      }
    },
    include: {
      instance: {
        include: {
          shiftType: {
            select: {
              name: true,
              startTime: true,
              endTime: true
            }
          }
        }
      }
    }
  })

  const conflicts = []
  const shiftStart = new Date(`1970-01-01T${shift.startTime}`)
  const shiftEnd = new Date(`1970-01-01T${shift.endTime}`)

  for (const assignment of userAssignments) {
    const assignmentStart = new Date(`1970-01-01T${assignment.instance.shiftType.startTime}`)
    const assignmentEnd = new Date(`1970-01-01T${assignment.instance.shiftType.endTime}`)

    // Check if times overlap
    if (shiftStart < assignmentEnd && shiftEnd > assignmentStart) {
      conflicts.push({
        assignmentId: assignment.id,
        shiftName: assignment.instance.shiftType.name,
        startTime: assignment.instance.shiftType.startTime,
        endTime: assignment.instance.shiftType.endTime
      })
    }
  }

  return conflicts
}

async function checkEligibility(
  user: any,
  shift: any
): Promise<boolean> {
  // Check eligibility based on shift requirements
  if (shift.allowAny) {
    return true
  }

  if (shift.requiredSubspecialtyId) {
    // Check if user has the required subspecialty
    const userSubspecialty = user.radiologistProfile?.subspecialty
    return userSubspecialty?.id === shift.requiredSubspecialtyId
  }

  if (shift.namedAllowlist) {
    const allowedEmails = shift.namedAllowlist.split(',').map((email: string) => email.trim())
    return allowedEmails.includes(user.email)
  }

  return true
}