import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { organizationId } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }

    // Verify user has access to this organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Mark onboarding as complete
    await prisma.organization.update({
      where: { id: organizationId },
      data: { 
        onboardingComplete: true,
        onboardingStep: 4 
      }
    })
    
    console.log('[API] Onboarding completed for org:', organizationId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Complete onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
