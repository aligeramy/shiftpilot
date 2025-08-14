import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    // Get the current user session
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ organization: null })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    let organization = null
    if (user?.organizationId) {
      organization = await prisma.organization.findUnique({
        where: { id: user.organizationId }
      })
    }

    return NextResponse.json({ 
      organization: organization ? {
        ...organization,
        onboardingComplete: organization.onboardingComplete || false
      } : null
    })
  } catch (error) {
    console.error('[API] Onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
}
