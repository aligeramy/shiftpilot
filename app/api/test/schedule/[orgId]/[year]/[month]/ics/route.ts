import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    orgId: string
    year: string
    month: string
  }
}

function formatDateAsICS(dt: Date, allDay: boolean, tz?: string) {
  if (allDay) {
    // For all-day, use DATE (no time)
    const y = dt.getFullYear().toString().padStart(4, '0')
    const m = (dt.getMonth() + 1).toString().padStart(2, '0')
    const d = dt.getDate().toString().padStart(2, '0')
    return `${y}${m}${d}`
  }
  // Use floating time with TZID where provided
  const y = dt.getFullYear().toString().padStart(4, '0')
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt.getDate().toString().padStart(2, '0')
  const hh = dt.getHours().toString().padStart(2, '0')
  const mm = dt.getMinutes().toString().padStart(2, '0')
  const ss = '00'
  const base = `${y}${m}${d}T${hh}${mm}${ss}`
  if (tz) return { text: base, tz }
  return base
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orgId, year, month } = params
    const yearNum = parseInt(year)
    const monthNum = parseInt(month)
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json({ success: false, error: 'Invalid year or month' }, { status: 400 })
    }

    const firstDay = new Date(yearNum, monthNum - 1, 1)
    const lastDay = new Date(yearNum, monthNum, 0)

    const org = await prisma.organization.findUnique({ where: { id: orgId } })
    if (!org) {
      return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
    }
    const tz = org.timezone || 'America/Toronto'

    const instances = await prisma.scheduleInstance.findMany({
      where: {
        organizationId: orgId,
        date: { gte: firstDay, lte: lastDay }
      },
      include: {
        shiftType: true,
        assignments: {
          include: {
            user: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { shiftType: { code: 'asc' } }
      ]
    })

    const lines: string[] = []
    lines.push('BEGIN:VCALENDAR')
    lines.push('VERSION:2.0')
    lines.push('PRODID:-//ShiftPilot//Schedule//EN')
    lines.push('CALSCALE:GREGORIAN')

    const dtStamp = new Date()
    const stampY = dtStamp.getUTCFullYear().toString().padStart(4, '0')
    const stampM = (dtStamp.getUTCMonth() + 1).toString().padStart(2, '0')
    const stampD = dtStamp.getUTCDate().toString().padStart(2, '0')
    const stampH = dtStamp.getUTCHours().toString().padStart(2, '0')
    const stampMin = dtStamp.getUTCMinutes().toString().padStart(2, '0')
    const stampS = dtStamp.getUTCSeconds().toString().padStart(2, '0')
    const DTSTAMP = `${stampY}${stampM}${stampD}T${stampH}${stampMin}${stampS}Z`

    for (const inst of instances) {
      for (const asg of inst.assignments) {
        const uid = `${asg.id}@shiftpilot`
        const allDay = inst.shiftType.isAllDay
        const start = new Date(inst.startTime)
        const end = new Date(inst.endTime)

        lines.push('BEGIN:VEVENT')
        lines.push(`UID:${uid}`)
        lines.push(`DTSTAMP:${DTSTAMP}`)
        if (allDay) {
          // For all-day, DTSTART/DTEND are DATE values; DTEND is exclusive next day
          const startDate = formatDateAsICS(start, true) as string
          const endExclusive = new Date(end)
          endExclusive.setDate(endExclusive.getDate() + 1)
          const endDate = formatDateAsICS(endExclusive, true) as string
          lines.push(`DTSTART;VALUE=DATE:${startDate}`)
          lines.push(`DTEND;VALUE=DATE:${endDate}`)
        } else {
          const startFmt = formatDateAsICS(start, false, tz) as { text: string; tz: string } | string
          const endFmt = formatDateAsICS(end, false, tz) as { text: string; tz: string } | string
          if (typeof startFmt === 'string') {
            lines.push(`DTSTART:${startFmt}`)
            lines.push(`DTEND:${endFmt}`)
          } else {
            lines.push(`DTSTART;TZID=${startFmt.tz}:${startFmt.text}`)
            if (typeof endFmt !== 'string') {
              lines.push(`DTEND;TZID=${endFmt.tz}:${endFmt.text}`)
            } else {
              lines.push(`DTEND:${endFmt}`)
            }
          }
        }
        const summaryParts = [inst.shiftType.code, asg.user.name || asg.user.email]
        lines.push(`SUMMARY:${summaryParts.join(' — ')}`)
        const desc = `Shift: ${inst.shiftType.name}\\nOrg: ${org.name}\\nSource: ShiftPilot`
        lines.push(`DESCRIPTION:${desc}`)
        lines.push('END:VEVENT')
      }
    }

    lines.push('END:VCALENDAR')

    const icsContent = lines.join('\r\n')
    const filename = `schedule_${org.slug || org.id}_${year}-${month.padStart(2, '0')}.ics`
    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('[ICS] Failed to build ICS:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate ICS' }, { status: 500 })
  }
}


