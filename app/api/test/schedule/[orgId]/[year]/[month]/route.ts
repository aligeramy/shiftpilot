/**
 * Test API endpoint to view generated schedules
 * This bypasses authentication for testing purposes
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    orgId: string
    year: string
    month: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orgId, year, month } = await params
    console.log(`[TEST API] Fetching schedule for org: ${orgId}, ${year}-${month}`)
    
    const yearNum = parseInt(year)
    const monthNum = parseInt(month)
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json({
        success: false,
        error: 'Invalid year or month'
      }, { status: 400 })
    }

    // Get the date range for the month
    const firstDay = new Date(yearNum, monthNum - 1, 1)
    const lastDay = new Date(yearNum, monthNum, 0)

    // Fetch schedule data
    const scheduleData = await prisma.scheduleInstance.findMany({
      where: {
        organizationId: orgId,
        date: {
          gte: firstDay,
          lte: lastDay
        }
      },
      include: {
        shiftType: {
          include: {
            requiredSubspecialty: true
          }
        },
        assignments: {
          include: {
            user: {
              include: {
                radiologistProfile: {
                  include: {
                    subspecialty: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { shiftType: { code: 'asc' } }
      ]
    })

    // Transform into a more readable format
    const schedule = scheduleData.map(instance => ({
      date: instance.date.toISOString().split('T')[0],
      shiftCode: instance.shiftType.code,
      shiftName: instance.shiftType.name,
      shiftTime: instance.shiftType.isAllDay ? 
        'All Day' : 
        `${instance.shiftType.startTime}-${instance.shiftType.endTime}`,
      requiredSubspecialty: instance.shiftType.requiredSubspecialty?.name || 
                           (instance.shiftType.allowAny ? 'Any' : 'Named'),
      assignedTo: instance.assignments.map(assignment => ({
        name: assignment.user.name,
        email: assignment.user.email,
        subspecialty: assignment.user.radiologistProfile?.subspecialty.name,
        fte: assignment.user.radiologistProfile?.ftePercent,
        assignmentType: assignment.assignmentType
      })),
      status: instance.status
    }))

    // Calculate summary statistics
    const stats = {
      totalInstances: scheduleData.length,
      assignedInstances: scheduleData.filter(i => i.assignments.length > 0).length,
      unassignedInstances: scheduleData.filter(i => i.assignments.length === 0).length,
      uniqueShiftTypes: [...new Set(scheduleData.map(i => i.shiftType.code))].length,
      assignmentsByUser: {} as Record<string, number>
    }

    // Count assignments per user
    scheduleData.forEach(instance => {
      instance.assignments.forEach(assignment => {
        const userName = assignment.user.name || assignment.user.email
        stats.assignmentsByUser[userName] = (stats.assignmentsByUser[userName] || 0) + 1
      })
    })

    // Group schedule by date for easier viewing
    const scheduleByDate = schedule.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = []
      }
      acc[item.date].push(item)
      return acc
    }, {} as Record<string, typeof schedule>)

    return NextResponse.json({
      success: true,
      data: {
        organizationId: orgId,
        period: `${year}-${month.padStart(2, '0')}`,
        stats,
        schedule: scheduleByDate,
        rawSchedule: schedule
      }
    })
    
  } catch (error) {
    console.error('[TEST API] Failed to fetch schedule:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch schedule'
    }, { status: 500 })
  }
}

// Helper endpoint to get organization info
export async function OPTIONS(request: Request, { params }: RouteParams) {
  const { orgId } = params
  
  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        users: {
          where: { role: 'RADIOLOGIST' },
          include: {
            radiologistProfile: {
              include: {
                subspecialty: true
              }
            }
          }
        },
        subspecialties: true,
        shiftTypes: {
          include: {
            requiredSubspecialty: true
          }
        }
      }
    })

    if (!org) {
      return NextResponse.json({
        success: false,
        error: 'Organization not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      organization: {
        id: org.id,
        name: org.name,
        radiologistCount: org.users.length,
        subspecialtyCount: org.subspecialties.length,
        shiftTypeCount: org.shiftTypes.length,
        subspecialties: org.subspecialties.map(s => s.code),
        radiologists: org.users.map(u => ({
          name: u.name,
          email: u.email,
          subspecialty: u.radiologistProfile?.subspecialty.code,
          fte: u.radiologistProfile?.ftePercent
        }))
      }
    })
    
  } catch (error) {
    console.error('[TEST API] Failed to fetch org info:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organization'
    }, { status: 500 })
  }
}
