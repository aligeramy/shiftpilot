/**
 * API endpoints for staff management
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, email, subspecialtyId, ftePercent, isFellow, isResident } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    // Validate subspecialty if provided
    let validSubspecialtyId = null
    if (subspecialtyId) {
      const subspecialty = await prisma.subspecialty.findFirst({
        where: {
          organizationId: user.organizationId,
          code: subspecialtyId
        }
      })
      if (!subspecialty) {
        return NextResponse.json({ error: 'Invalid subspecialty code' }, { status: 400 })
      }
      validSubspecialtyId = subspecialty.id
    }

    // Create user with a default password (they should change it on first login)
    const defaultPassword = await bcrypt.hash('changeMe123!', 10)
    
    // Create user first
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: defaultPassword,
        role: 'RADIOLOGIST',
        organizationId: user.organizationId
      }
    })

    // Create radiologist profile only if subspecialty is provided (since it's required)
    if (validSubspecialtyId) {
      await prisma.radiologyProfile.create({
        data: {
          userId: newUser.id,
          subspecialtyId: validSubspecialtyId,
          ftePercent: Math.max(10, Math.min(100, ftePercent || 100)),
          isFellow: Boolean(isFellow),
          isResident: Boolean(isResident)
        }
      })
    }

    // Get final user with profile data
    const finalUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        radiologistProfile: {
          include: {
            subspecialty: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      staff: {
        id: finalUser!.id,
        name: finalUser!.name,
        email: finalUser!.email,
        subspecialty: finalUser!.radiologistProfile?.subspecialty?.code || null,
        subspecialtyName: finalUser!.radiologistProfile?.subspecialty?.name || null,
        ftePercent: finalUser!.radiologistProfile?.ftePercent || 100,
        isFellow: finalUser!.radiologistProfile?.isFellow || false,
        isResident: finalUser!.radiologistProfile?.isResident || false
      }
    })

  } catch (error) {
    console.error('[API] Failed to create staff member:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create staff member'
    }, { status: 500 })
  }
}
