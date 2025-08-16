/**
 * API route to manually save vacation preferences for a specific radiologist
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

interface PreferenceData {
  rank: number
  weekNumber: number
  weekStartDate: string
  weekEndDate: string
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, year, month, preferences } = body

    if (!userId || !year || !month || !preferences) {
      return NextResponse.json({ 
        error: 'userId, year, month, and preferences are required' 
      }, { status: 400 })
    }

    if (!Array.isArray(preferences) || preferences.length !== 3) {
      return NextResponse.json({ 
        error: 'Exactly 3 preferences are required' 
      }, { status: 400 })
    }

    // Validate preferences structure
    const validatedPreferences: PreferenceData[] = preferences.map((pref, index) => {
      if (!pref.weekNumber || !pref.weekStartDate || !pref.weekEndDate) {
        throw new Error(`Preference ${index + 1} missing required fields`)
      }
      return {
        rank: index + 1, // Force rank to be 1, 2, 3
        weekNumber: parseInt(pref.weekNumber),
        weekStartDate: pref.weekStartDate,
        weekEndDate: pref.weekEndDate
      }
    })

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Verify the target radiologist is in the same organization
    const targetRadiologist = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetRadiologist || targetRadiologist.organizationId !== user.organizationId) {
      return NextResponse.json({ 
        error: 'Radiologist not found or not in your organization' 
      }, { status: 404 })
    }

    // Clear existing preferences for this period
    await prisma.vacationPreference.deleteMany({
      where: {
        userId,
        year: parseInt(year),
        month: parseInt(month)
      }
    })

    // Create new preferences
    const preferencesToCreate = validatedPreferences.map(pref => ({
      userId,
      year: parseInt(year),
      month: parseInt(month),
      rank: pref.rank,
      weekNumber: pref.weekNumber,
      weekStartDate: new Date(pref.weekStartDate),
      weekEndDate: new Date(pref.weekEndDate),
      status: 'PENDING' as const
    }))

    await prisma.vacationPreference.createMany({
      data: preferencesToCreate
    })

    return NextResponse.json({
      success: true,
      message: `Saved 3 vacation preferences for ${targetRadiologist.name}`,
      preferences: preferencesToCreate
    })
    
  } catch (error) {
    console.error('[API] Failed to save preferences:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save preferences'
    }, { status: 500 })
  }
}
