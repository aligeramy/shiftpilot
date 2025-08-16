/**
 * API route to auto-generate vacation preferences for all radiologists
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { year, month, userId } = body

    if (!year || !month) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 })
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { organization: true }
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Get target radiologists in the organization (all or one)
    const radiologists = await prisma.user.findMany({
      where: {
        organizationId: user.organizationId,
        role: 'RADIOLOGIST',
        ...(userId ? { id: userId } : {})
      }
    })

    // Generate vacation weeks for the month
    const vacationWeeks = generateVacationWeeks(year, month)
    
    if (vacationWeeks.length < 3) {
      return NextResponse.json({ 
        error: 'Not enough weeks in month to generate 3 preferences' 
      }, { status: 400 })
    }

    let generatedCount = 0

    // Generate preferences for each radiologist
    for (const radiologist of radiologists) {
      // Clear existing preferences for this period
      await prisma.vacationPreference.deleteMany({
        where: {
          userId: radiologist.id,
          year,
          month
        }
      })

      // Generate 3 random preferences
      const selectedWeeks = selectRandomWeeks(vacationWeeks, 3)
      
      const preferences = selectedWeeks.map((week, index) => ({
        userId: radiologist.id,
        year,
        month,
        rank: index + 1,
        weekNumber: week.weekNumber,
        weekStartDate: week.startDate,
        weekEndDate: week.endDate,
        status: 'PENDING' as const
      }))

      await prisma.vacationPreference.createMany({
        data: preferences
      })

      generatedCount++
    }

    return NextResponse.json({
      success: true,
      message: `Generated vacation preferences for ${generatedCount} radiologist(s)`,
      count: generatedCount
    })
    
  } catch (error) {
    console.error('[API] Failed to generate preferences:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate preferences'
    }, { status: 500 })
  }
}

function generateVacationWeeks(year: number, month: number) {
  const weeks = []
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  
  // Find all Mondays in the month
  const current = new Date(firstDay)
  
  // Go to the first Monday of the month (or previous month if needed)
  while (current.getDay() !== 1) {
    current.setDate(current.getDate() + 1)
  }
  
  let weekNumber = 1
  while (current <= lastDay) {
    const weekStart = new Date(current)
    const weekEnd = new Date(current)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    weeks.push({
      weekNumber,
      startDate: weekStart,
      endDate: weekEnd
    })
    
    current.setDate(current.getDate() + 7)
    weekNumber++
  }
  
  return weeks
}

function selectRandomWeeks(weeks: { weekNumber: number; startDate: Date; endDate: Date }[], count: number) {
  const shuffled = [...weeks].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
