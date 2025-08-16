import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import type { ScheduleInstanceForExport, UserForExport, ShiftTypeForExport } from '@/lib/types/api'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const organizationId = session.user.organizationId

    const url = new URL(request.url)
    const year = parseInt(url.searchParams.get('year') || '2024')
    const month = parseInt(url.searchParams.get('month') || '6')
    const format = url.searchParams.get('format') || 'json' // json, csv, html

    // Get all schedule instances for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const instances = await prisma.scheduleInstance.findMany({
      where: {
        organizationId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        shiftType: {
          select: {
            id: true,
            code: true,
            name: true,
            startTime: true,
            endTime: true,
            isAllDay: true,
            allowAny: true,
            requiredSubspecialtyId: true,
            namedAllowlist: true
          }
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Get all users for the organization
    const users = await prisma.user.findMany({
      where: {
        organizationId,
        radiologistProfile: {
          isNot: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        radiologistProfile: {
          select: {
            subspecialty: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get all shift types for reference
    const shifts = await prisma.shiftType.findMany({
      where: {
        organizationId
      },
      orderBy: [
        { startTime: 'asc' },
        { name: 'asc' }
      ]
    })

    if (format === 'csv') {
      return generateCSV(instances, users, shifts, year, month)
    } else if (format === 'html') {
      return generateHTML(instances, users, shifts, year, month)
    } else {
      // Return JSON format
      return NextResponse.json({
        metadata: {
          year,
          month,
          monthName: new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' }),
          totalDays: instances.length,
          totalAssignments: instances.reduce((sum, instance) => sum + instance.assignments.length, 0),
          generatedAt: new Date().toISOString()
        },
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          subspecialty: user.radiologistProfile?.subspecialty || null
        })),
        shifts: shifts.map(shift => ({
          id: shift.id,
          code: shift.code,
          name: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          isAllDay: shift.isAllDay,
          allowAny: shift.allowAny,
          requiredSubspecialtyId: shift.requiredSubspecialtyId,
          namedAllowlist: shift.namedAllowlist
        })),
        schedule: instances.map(instance => ({
          date: instance.date.toISOString().split('T')[0],
          dayOfWeek: instance.date.toLocaleDateString('en-US', { weekday: 'long' }),
          shiftType: {
            id: instance.shiftType.id,
            code: instance.shiftType.code,
            name: instance.shiftType.name,
            startTime: instance.shiftType.startTime,
            endTime: instance.shiftType.endTime,
            isAllDay: instance.shiftType.isAllDay,
            allowAny: instance.shiftType.allowAny,
            requiredSubspecialtyId: instance.shiftType.requiredSubspecialtyId,
            namedAllowlist: instance.shiftType.namedAllowlist
          },
          assignments: instance.assignments.map(assignment => ({
            id: assignment.id,
            userId: assignment.userId,
            userName: assignment.user.name,
            userEmail: assignment.user.email,
            assignmentType: assignment.assignmentType
          }))
        }))
      })
    }
  } catch (error) {
    console.error('Error exporting calendar:', error)
    return NextResponse.json(
      { error: 'Failed to export calendar' },
      { status: 500 }
    )
  }
}

function generateCSV(instances: ScheduleInstanceForExport[], users: UserForExport[], shifts: ShiftTypeForExport[], year: number, month: number) {
  const lines = []
  
  // Header
  lines.push('Date,Day,Shift Name,Start Time,End Time,Subspecialty,Radiologist,Email,Assignment Type,Equivalence Code')
  
  // Data
  instances.forEach(instance => {
    const dateStr = instance.date.toISOString().split('T')[0]
    const dayOfWeek = instance.date.toLocaleDateString('en-US', { weekday: 'long' })
    
    instance.assignments.forEach((assignment) => {
      lines.push([
        dateStr,
        dayOfWeek,
        `\"${instance.shiftType.name}\"`,
        instance.shiftType.startTime,
        instance.shiftType.endTime,
        `\"${instance.shiftType.requiredSubspecialtyId || ''}\"`,
        `\"${assignment.user.name}\"`,
        assignment.user.email,
        assignment.assignmentType,
        instance.shiftType.code || ''
      ].join(','))
    })
  })
  
  const csv = lines.join('\\n')
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=\"schedule-${year}-${month.toString().padStart(2, '0')}.csv\"`
    }
  })
}

function generateHTML(instances: ScheduleInstanceForExport[], users: UserForExport[], shifts: ShiftTypeForExport[], year: number, month: number) {
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })
  
  let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Schedule Export - ${monthName} ${year}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .metadata { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .day-section { margin-bottom: 30px; border: 1px solid #dee2e6; border-radius: 5px; }
        .day-header { background: #007bff; color: white; padding: 10px; font-weight: bold; }
        .assignments { padding: 10px; }
        .assignment { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee; }
        .assignment:last-child { border-bottom: none; }
        .shift-info { font-weight: bold; }
        .user-info { color: #666; }
        .time-info { font-size: 0.9em; color: #888; }
        .swapped { background-color: #fff3cd; border-left: 4px solid #ffc107; }
        .manual { background-color: #d1ecf1; border-left: 4px solid #17a2b8; }
    </style>
</head>
<body>
    <h1>Schedule Export - ${monthName} ${year}</h1>
    
    <div class=\"metadata\">
        <h3>Summary</h3>
        <p><strong>Total Days:</strong> ${instances.length}</p>
        <p><strong>Total Assignments:</strong> ${instances.reduce((sum, instance) => sum + instance.assignments.length, 0)}</p>
        <p><strong>Total Radiologists:</strong> ${users.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
`

  instances.forEach(instance => {
    const dateStr = instance.date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    html += `
    <div class=\"day-section\">
        <div class=\"day-header\">${dateStr}</div>
        <div class=\"assignments\">
`
    
    if (instance.assignments.length === 0) {
      html += `<div class=\"assignment\">No assignments</div>`
    } else {
      instance.assignments.forEach((assignment) => {
        const cssClass = assignment.assignmentType === 'SWAPPED' ? 'swapped' : 
                        assignment.assignmentType === 'MANUAL' ? 'manual' : ''
        
        html += `
            <div class=\"assignment ${cssClass}\">
                <div>
                    <div class=\"shift-info\">${instance.shiftType.name}</div>
                    <div class=\"time-info\">${instance.shiftType.startTime} - ${instance.shiftType.endTime}</div>
                    ${instance.shiftType.requiredSubspecialtyId ? `<div class=\"time-info\">Subspecialty: ${instance.shiftType.requiredSubspecialtyId}</div>` : ''}
                </div>
                <div>
                    <div class=\"user-info\">${assignment.user.name}</div>
                    <div class=\"time-info\">${assignment.user.email}</div>
                    <div class=\"time-info\">${assignment.assignmentType}</div>
                </div>
            </div>
`
      })
    }
    
    html += `
        </div>
    </div>
`
  })
  
  html += `
</body>
</html>
`
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename=\"schedule-${year}-${month.toString().padStart(2, '0')}.html\"`
    }
  })
}
