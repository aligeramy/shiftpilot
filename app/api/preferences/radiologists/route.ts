/**
 * API route to fetch radiologists with vacation preferences
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Fetch all radiologists in the organization with their preferences
    const radiologists = await prisma.user.findMany({
      where: {
        organizationId: user.organizationId,
        role: 'RADIOLOGIST'
      },
      include: {
        radiologistProfile: {
          include: {
            subspecialty: true
          }
        },
        vacationPreferences: {
          where: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1
          },
          orderBy: { rank: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      radiologists
    })
    
  } catch (error) {
    console.error('[API] Failed to fetch radiologists:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch radiologists'
    }, { status: 500 })
  }
}
