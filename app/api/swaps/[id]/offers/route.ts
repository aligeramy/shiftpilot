import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const swapRequestId = params.id
    const body = await request.json()
    const { targetUserIds, targetAssignmentIds } = body

    // Verify the swap request exists and is open
    const swapRequest = await db.swapRequest.findFirst({
      where: {
        id: swapRequestId,
        status: 'OPEN',
        requester: {
          organizationId: session.user.organizationId
        }
      },
      include: {
        assignment: {
          include: {
            instance: {
              include: {
                shiftType: true
              }
            }
          }
        }
      }
    })

    if (!swapRequest) {
      return NextResponse.json(
        { error: 'Swap request not found or not open' },
        { status: 404 }
      )
    }

    // Only the requester or admin can create offers
    if (swapRequest.requesterId !== session.user.id && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'CHIEF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create offers for each target user
    const offers = []
    for (let i = 0; i < targetUserIds.length; i++) {
      const targetUserId = targetUserIds[i]
      const targetAssignmentId = targetAssignmentIds?.[i]

      // Verify target user exists and is in same organization
      const targetUser = await db.user.findFirst({
        where: {
          id: targetUserId,
          organizationId: session.user.organizationId
        }
      })

      if (!targetUser) {
        continue // Skip invalid users
      }

      // If target assignment specified, verify it belongs to target user
      let validTargetAssignment = null
      if (targetAssignmentId) {
        validTargetAssignment = await db.scheduleAssignment.findFirst({
          where: {
            id: targetAssignmentId,
            userId: targetUserId,
            instance: {
              organizationId: session.user.organizationId
            }
          }
        })
      }

      const offer = await db.swapOffer.create({
        data: {
          swapRequestId,
          targetUserId,
          targetAssignmentId: validTargetAssignment?.id,
          status: 'PENDING',
          sentAt: new Date()
        },
        include: {
          targetUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          targetAssignment: {
            include: {
              instance: {
                include: {
                  shiftType: true
                }
              }
            }
          }
        }
      })

      offers.push(offer)
    }

    return NextResponse.json(offers, { status: 201 })
  } catch (error) {
    console.error('Error creating swap offers:', error)
    return NextResponse.json(
      { error: 'Failed to create swap offers' },
      { status: 500 }
    )
  }
}
