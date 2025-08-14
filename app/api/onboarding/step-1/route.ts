import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const organizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  timezone: z.string(),
  weekStart: z.enum(['MONDAY', 'SUNDAY'])
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

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = organizationSchema.parse(body)
    
    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: validatedData.slug }
    })
    
    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization slug already exists' },
        { status: 400 }
      )
    }
    
    // Create the organization and update user
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          timezone: validatedData.timezone,
          weekStart: validatedData.weekStart,
          onboardingStep: 2, // Move to next step
        }
      })
      
      // Update user with organization and admin role
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          organizationId: organization.id,
          role: 'ADMIN' // First user becomes admin
        }
      })
      
      return organization
    })
    
    console.log('[API] Organization created:', result.id)
    
    return NextResponse.json({ 
      success: true,
      organizationId: result.id 
    })
  } catch (error) {
    console.error('[API] Step 1 error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
}
