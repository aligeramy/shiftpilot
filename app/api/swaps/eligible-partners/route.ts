import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const assignmentId = url.searchParams.get('assignmentId')
    const equivalenceCode = url.searchParams.get('equivalenceCode')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'assignmentId is required' },
        { status: 400 }
      )
    }

    // Get the assignment details
    const assignment = await db.scheduleAssignment.findFirst({
      where: {
        id: assignmentId,
        userId: session.user.id,
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
          include: {
            radiologistProfile: {
              include: {
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
    const shiftType = assignment.instance.shiftType

    // Find all assignments on the same date
    const potentialSwaps = await db.scheduleAssignment.findMany({
      where: {
        instance: {
          organizationId: session.user.organizationId,
          date: shiftDate
        },
        userId: { not: session.user.id }, // Exclude current user
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
            email: true
          },
          include: {
            radiologistProfile: {
              include: {
                subspecialty: true
              }
            }
          }
        }
      }
    })

    // Filter eligible partners based on:
    // 1. Same shift type (exact match)
    // 2. Equivalence set (if specified)
    // 3. Eligibility rules (can the requester work the target shift?)
    const eligiblePartners = []

    for (const potentialSwap of potentialSwaps) {
      const targetShiftType = potentialSwap.instance.shiftType
      const targetUser = potentialSwap.user
      
      // Check if it's the same shift type
      const isSameShiftType = shiftType.id === targetShiftType.id

      // Check if they're in the same equivalence set (if specified)
      let isInEquivalenceSet = false
      if (equivalenceCode) {
        // This would need to be implemented based on your equivalence set logic
        // For now, we'll assume equivalence sets are defined in configuration
        isInEquivalenceSet = await checkEquivalenceSet(
          session.user.organizationId,
          shiftType.code,
          targetShiftType.code,
          equivalenceCode
        )
      }

      // Check if the requester can work the target shift
      const canRequesterWorkTarget = await checkEligibility(
        assignment.user,
        targetShiftType
      )

      // Check if the target user can work the requester's shift
      const canTargetWorkRequester = await checkEligibility(
        targetUser,
        shiftType
      )

      if ((isSameShiftType || isInEquivalenceSet) && 
          canRequesterWorkTarget && 
          canTargetWorkRequester) {
        eligiblePartners.push({
          assignment: potentialSwap,
          swapType: isSameShiftType ? 'SAME_TYPE' : 'EQUIVALENT_TYPE',
          canSwap: true
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

async function checkEquivalenceSet(
  organizationId: string,
  shiftType1: string,
  shiftType2: string,
  equivalenceCode: string
): Promise<boolean> {
  // This is a placeholder - you'll need to implement based on your equivalence set configuration
  // For now, we'll use some hardcoded equivalence sets based on your manual calendars
  const equivalenceSets: Record<string, string[]> = {
    'NEURO_DAY': ['N1', 'N2', 'N3', 'N4'],
    'BODY_DAY': ['CTUS', 'MSK', 'BODY_VOL', 'BODY_MRI', 'XR_GEN'],
    'CLINIC': ['CLIN_STONEY', 'CLIN_MA1', 'CLIN_SPEERS', 'CLIN_WALKERS', 'CLIN_WH_OTHER', 'CLIN_BRANT'],
    'NEURO_LATE': ['NEURO_16_18', 'NEURO_18_21'],
    'BODY_LATE': ['BODY_16_18', 'BODY_18_21']
  }

  const equivalenceSet = equivalenceSets[equivalenceCode]
  if (!equivalenceSet) return false

  return equivalenceSet.includes(shiftType1) && equivalenceSet.includes(shiftType2)
}

async function checkEligibility(
  user: any,
  shiftType: any
): Promise<boolean> {
  // Check eligibility based on shift type requirements
  if (shiftType.allowAny) {
    return true
  }

  if (shiftType.requiredSubspecialtyId) {
    return user.radiologistProfile?.subspecialty?.id === shiftType.requiredSubspecialtyId
  }

  if (shiftType.namedAllowlist) {
    const allowedEmails = shiftType.namedAllowlist.split(',').map((email: string) => email.trim())
    return allowedEmails.includes(user.email)
  }

  return true
}
