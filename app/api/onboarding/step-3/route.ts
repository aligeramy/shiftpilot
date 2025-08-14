import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.organizationId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // TODO: Implement shift types creation
    // For now, just update the step
    await prisma.organization.update({
      where: { id: user.organizationId },
      data: { onboardingStep: 4 }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Step 3 error:', error)
    return NextResponse.json(
      { error: 'Failed to save shift types' },
      { status: 500 }
    )
  }
}
