/**
 * API endpoints for subspecialty management
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

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
    const { code, name } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    // Check if code already exists in this organization
    const existing = await prisma.subspecialty.findFirst({
      where: {
        organizationId: user.organizationId,
        code: code.toUpperCase()
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Subspecialty code already exists' }, { status: 409 })
    }

    // Create subspecialty
    const subspecialty = await prisma.subspecialty.create({
      data: {
        code: code.toUpperCase(),
        name,
        organizationId: user.organizationId
      }
    })

    return NextResponse.json({
      success: true,
      subspecialty: {
        id: subspecialty.id,
        code: subspecialty.code,
        name: subspecialty.name
      }
    })

  } catch (error) {
    console.error('[API] Failed to create subspecialty:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subspecialty'
    }, { status: 500 })
  }
}
