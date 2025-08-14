import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { year, month } = body
    if (!year || !month) {
      return NextResponse.json({ success: false, error: 'year and month required' }, { status: 400 })
    }

    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)

    // Delete schedule assignments and instances for the period
    const instances = await prisma.scheduleInstance.findMany({
      where: { date: { gte: firstDay, lte: lastDay } },
      select: { id: true }
    })
    const instanceIds = instances.map(i => i.id)
    await prisma.scheduleAssignment.deleteMany({ where: { instanceId: { in: instanceIds } } })
    await prisma.scheduleInstance.deleteMany({ where: { id: { in: instanceIds } } })

    // Delete vacation preferences for period
    await prisma.vacationPreference.deleteMany({ where: { year, month } })

    return NextResponse.json({ success: true, removedInstances: instanceIds.length })
  } catch (error) {
    console.error('[reset-month] failed', error)
    return NextResponse.json({ success: false, error: 'reset failed' }, { status: 500 })
  }
}


