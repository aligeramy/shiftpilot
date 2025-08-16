import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

type Params = {
  params: { year: string; month: string }
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1)
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month, 0)
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const me = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!me?.organizationId) {
      return NextResponse.json({ success: false, error: 'No organization' }, { status: 400 })
    }

    // Admin/Chief only
    if (me.role !== 'ADMIN' && me.role !== 'CHIEF' && me.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const awaitedParams = await params
    const year = parseInt(awaitedParams.year, 10)
    const month = parseInt(awaitedParams.month, 10)
    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ success: false, error: 'Invalid year/month' }, { status: 400 })
    }

    const orgId = me.organizationId

    // Load all rads
    const rads = await prisma.user.findMany({
      where: { organizationId: orgId, role: 'RADIOLOGIST' },
      select: { id: true, name: true, email: true }
    })

    // Load preferences for current month (for per-month points)
    const monthPrefs = await prisma.vacationPreference.findMany({
      where: { user: { organizationId: orgId }, year, month },
      select: { userId: true, rank: true, weekStartDate: true, weekEndDate: true }
    })

    // Preload assignments for YTD (Jan..month)
    const ytdStart = startOfMonth(year, 1)
    const ytdEnd = endOfMonth(year, month)
    const ytdAssignments = await prisma.scheduleAssignment.findMany({
      where: {
        user: { organizationId: orgId },
        instance: { date: { gte: ytdStart, lte: ytdEnd } }
      },
      select: { userId: true, instance: { select: { date: true } } }
    })

    // Build per-user map of assignment dates
    const assignDatesByUser = new Map<string, Date[]>()
    ytdAssignments.forEach(a => {
      const arr = assignDatesByUser.get(a.userId) || []
      arr.push(new Date(a.instance.date))
      assignDatesByUser.set(a.userId, arr)
    })

    // Helper: did user have zero assignments during a given week window?
    function weekOff(userId: string, start: Date, end: Date) {
      const dates = assignDatesByUser.get(userId) || []
      for (const d of dates) {
        if (d >= start && d <= end) return false
      }
      return true
    }

    // Compute monthly points per user
    type Points = 0 | 1 | 2 | 3
    const byUserMonthly: Record<string, { points: Points; gotRank: 0|1|2|3|null }> = {}
    for (const rad of rads) {
      const prefs = monthPrefs
        .filter(p => p.userId === rad.id)
        .sort((a, b) => a.rank - b.rank)
      let points: Points = 3
      let gotRank: 0|1|2|3|null = null
      for (const p of prefs) {
        if (weekOff(rad.id, new Date(p.weekStartDate), new Date(p.weekEndDate))) {
          // Rank is 1..3 → map to points 0..2
          const candidate = (p.rank - 1) as 0|1|2
          points = candidate
          gotRank = p.rank as 1|2|3
          break
        }
      }
      if (gotRank === null) gotRank = 0 // means none matched; display as 0 (none)
      byUserMonthly[rad.id] = { points, gotRank }
    }

    // Compute YTD totals (sum Jan..month)
    // Strategy: for each prior month m, recompute like above using already-fetched assignments
    // We need preferences for each month; fetch all YTD prefs once
    const ytdPrefs = await prisma.vacationPreference.findMany({
      where: { user: { organizationId: orgId }, year, month: { gte: 1, lte: month } },
      select: { userId: true, rank: true, weekStartDate: true, weekEndDate: true, month: true }
    })

    const ytdByUser: Record<string, number> = {}
    for (const rad of rads) {
      let total = 0
      for (let m = 1; m <= month; m++) {
        const prefs = ytdPrefs
          .filter(p => p.userId === rad.id && p.month === m)
          .sort((a, b) => a.rank - b.rank)
        let pts: Points = 3
        for (const p of prefs) {
          if (weekOff(rad.id, new Date(p.weekStartDate), new Date(p.weekEndDate))) {
            pts = (p.rank - 1) as Points
            break
          }
        }
        total += pts
      }
      ytdByUser[rad.id] = total
    }

    const results = rads.map(r => ({
      userId: r.id,
      name: r.name || r.email,
      email: r.email,
      monthPoints: byUserMonthly[r.id]?.points ?? 3,
      gotRank: byUserMonthly[r.id]?.gotRank ?? 0,
      ytdPoints: ytdByUser[r.id] ?? 0,
    }))

    return NextResponse.json({ success: true, year, month, results })
  } catch (e) {
    console.error('Fairness API error', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}


