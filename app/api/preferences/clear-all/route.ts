/**
 * API route to clear all vacation preferences
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE() {
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

    // Clear all vacation preferences for users in this organization
    const result = await prisma.vacationPreference.deleteMany({
      where: {
        user: {
          organizationId: user.organizationId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} vacation preferences`
    })
    
  } catch (error) {
    console.error('[API] Failed to clear preferences:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear preferences'
    }, { status: 500 })
  }
}
