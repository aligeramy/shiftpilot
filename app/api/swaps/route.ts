import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { SwapStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const userId = url.searchParams.get('userId')

    const where = {
      requester: {
        organizationId: session.user.organizationId
      },
      ...(status && { status: status as SwapStatus }),
      ...(userId && { requesterId: userId })
    }

    const swapRequests = await prisma.swapRequest.findMany({
      where,
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
        },
        offers: {
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ swapRequests })
  } catch (error) {
    console.error('Error fetching swap requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swap requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { assignmentId, notes, equivalenceCode } = body

    // Verify the assignment belongs to the requesting user
    const assignment = await prisma.scheduleAssignment.findFirst({
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
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if there's already an open swap request for this assignment
    const existingSwap = await prisma.swapRequest.findFirst({
      where: {
        assignmentId,
        status: 'OPEN'
      }
    })

    if (existingSwap) {
      return NextResponse.json(
        { error: 'Swap request already exists for this assignment' },
        { status: 400 }
      )
    }

    // Create the swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId: session.user.id,
        assignmentId,
        notes,
        equivalenceCode,
        status: 'OPEN'
      },
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
            }
          }
        }
      }
    })

    return NextResponse.json(swapRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating swap request:', error)
    return NextResponse.json(
      { error: 'Failed to create swap request' },
      { status: 500 }
    )
  }
}
