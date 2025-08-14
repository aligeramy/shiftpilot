import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const offerId = params.offerId
    const body = await request.json()
    const { response, notes } = body // response: 'ACCEPTED' | 'DECLINED'

    if (!['ACCEPTED', 'DECLINED'].includes(response)) {
      return NextResponse.json(
        { error: 'Invalid response. Must be ACCEPTED or DECLINED' },
        { status: 400 }
      )
    }

    // Find the offer and verify it belongs to the current user
    const offer = await prisma.swapOffer.findFirst({
      where: {
        id: offerId,
        targetUserId: session.user.id,
        status: 'PENDING'
      },
      include: {
        swapRequest: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            assignment: {
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
                  }
                }
              }
            }
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

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found or already responded to' },
        { status: 404 }
      )
    }

    // Start a transaction to handle the swap
    const result = await prisma.$transaction(async (tx) => {
      // Update the offer
      const updatedOffer = await tx.swapOffer.update({
        where: { id: offerId },
        data: {
          status: response as any,
          respondedAt: new Date(),
          response: notes
        }
      })

      if (response === 'ACCEPTED') {
        // Execute the swap
        const originalAssignment = offer.swapRequest.assignment
        const targetAssignment = offer.targetAssignment

        if (targetAssignment) {
          // Bilateral swap - exchange assignments
          await tx.scheduleAssignment.update({
            where: { id: originalAssignment.id },
            data: {
              userId: session.user.id,
              assignmentType: 'SWAPPED'
            }
          })

          await tx.scheduleAssignment.update({
            where: { id: targetAssignment.id },
            data: {
              userId: offer.swapRequest.requesterId,
              assignmentType: 'SWAPPED'
            }
          })
        } else {
          // Unilateral swap - just transfer the assignment
          await tx.scheduleAssignment.update({
            where: { id: originalAssignment.id },
            data: {
              userId: session.user.id,
              assignmentType: 'SWAPPED'
            }
          })
        }

        // Update swap request status
        await tx.swapRequest.update({
          where: { id: offer.swapRequestId },
          data: { status: 'ACCEPTED' }
        })

        // Cancel all other pending offers for this swap request
        await tx.swapOffer.updateMany({
          where: {
            swapRequestId: offer.swapRequestId,
            id: { not: offerId },
            status: 'PENDING'
          },
          data: { status: 'CANCELLED' }
        })
      }

      return updatedOffer
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error responding to swap offer:', error)
    return NextResponse.json(
      { error: 'Failed to respond to swap offer' },
      { status: 500 }
    )
  }
}
