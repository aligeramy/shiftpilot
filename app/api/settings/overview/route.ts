import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    // Resolve organization context
    let organizationId: string | null = null
    if (session?.user?.email) {
      const me = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
      })
      organizationId = me?.organizationId || null
    }
    if (!organizationId) {
      const anyOrg = await prisma.organization.findFirst({ select: { id: true } })
      organizationId = anyOrg?.id || null
    }
    if (!organizationId) {
      return NextResponse.json({ success: false, error: 'No organization found' }, { status: 404 })
    }

    // Fetch settings slices
    const [org, subspecialties, shiftTypes, staff] = await Promise.all([
      prisma.organization.findUnique({ where: { id: organizationId } }),
      prisma.subspecialty.findMany({ where: { organizationId }, orderBy: { code: 'asc' } }),
      prisma.shiftType.findMany({
        where: { organizationId },
        include: { requiredSubspecialty: true },
        orderBy: { code: 'asc' }
      }),
      prisma.user.findMany({
        where: { organizationId, role: 'RADIOLOGIST' },
        include: { radiologistProfile: { include: { subspecialty: true } } },
        orderBy: { name: 'asc' }
      })
    ])

    // Build response
    return NextResponse.json({
      success: true,
      organization: { id: org?.id, name: org?.name, timezone: org?.timezone, weekStart: org?.weekStart },
      subspecialties: subspecialties.map(s => ({ id: s.id, code: s.code, name: s.name })),
      shiftTypes: shiftTypes.map(st => ({
        id: st.id,
        code: st.code,
        name: st.name,
        startTime: st.startTime,
        endTime: st.endTime,
        isAllDay: st.isAllDay,
        recurrence: {
          mon: st.monday, tue: st.tuesday, wed: st.wednesday, thu: st.thursday, fri: st.friday, sat: st.saturday, sun: st.sunday
        },
        eligibility: {
          requiredSubspecialty: st.requiredSubspecialty ? { code: st.requiredSubspecialty.code, name: st.requiredSubspecialty.name } : null,
          allowAny: st.allowAny,
          namedAllowlist: st.namedAllowlist ? st.namedAllowlist.split(',').filter(Boolean) : []
        }
      })),
      staff: staff.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        subspecialty: u.radiologistProfile?.subspecialty?.code || null,
        subspecialtyName: u.radiologistProfile?.subspecialty?.name || null,
        ftePercent: u.radiologistProfile?.ftePercent || null
      }))
    })
  } catch (error) {
    console.error('[Settings] overview failed', error)
    return NextResponse.json({ success: false, error: 'Failed to load settings' }, { status: 500 })
  }
}


