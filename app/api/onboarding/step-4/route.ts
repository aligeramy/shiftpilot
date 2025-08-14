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

    // TODO: Implement roster import
    // For now, just mark onboarding as ready to complete
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Step 4 error:', error)
    return NextResponse.json(
      { error: 'Failed to import roster' },
      { status: 500 }
    )
  }
}
