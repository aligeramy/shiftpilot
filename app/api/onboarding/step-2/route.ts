import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const subspecialtySchema = z.object({
  code: z.string().min(1).regex(/^[A-Z0-9_]+$/),
  name: z.string().min(1)
})

const requestSchema = z.object({
  subspecialties: z.array(subspecialtySchema).min(1)
})

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.organizationId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = requestSchema.parse(body)
    
    // Create subspecialties in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing subspecialties (in case of re-running)
      await tx.subspecialty.deleteMany({
        where: { organizationId: user.organizationId! }
      })

      // Create new subspecialties
      await tx.subspecialty.createMany({
        data: validatedData.subspecialties.map(sub => ({
          code: sub.code,
          name: sub.name,
          organizationId: user.organizationId!
        }))
      })

      // Update onboarding step
      await tx.organization.update({
        where: { id: user.organizationId! },
        data: { onboardingStep: 3 }
      })
    })
    
    console.log('[API] Subspecialties created:', validatedData.subspecialties.length)
    
    return NextResponse.json({ 
      success: true,
      count: validatedData.subspecialties.length
    })
  } catch (error) {
    console.error('[API] Step 2 error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create subspecialties' },
      { status: 500 }
    )
  }
}
