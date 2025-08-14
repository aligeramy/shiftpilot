"use client"

import { useEffect, useState } from 'react'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Overview = {
  success: boolean
  organization?: { id: string; name: string; timezone: string; weekStart: string }
  subspecialties?: { id: string; code: string; name: string }[]
  shiftTypes?: {
    id: string
    code: string
    name: string
    startTime: string
    endTime: string
    isAllDay: boolean
    recurrence: { mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean; sun: boolean }
    eligibility: { requiredSubspecialty: { code: string; name: string } | null; allowAny: boolean; namedAllowlist: string[] }
  }[]
  staff?: { id: string; name: string | null; email: string; subspecialty: string | null; subspecialtyName: string | null; ftePercent: number | null }[]
}

export default function SettingsPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings/overview')
        const json = await res.json()
        setData(json)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: 'Dashboard', href: '/home' },
        { label: 'Settings' }
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">View organization, subspecialties, shift types, and staff at a glance.</p>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : data?.success ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div>Name: {data.organization?.name}</div>
                <div>Timezone: {data.organization?.timezone}</div>
                <div>Week start: {data.organization?.weekStart}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Subspecialties</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-4">
                  {data.subspecialties?.map(s => (
                    <li key={s.id}>{s.code} — {s.name}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Shift Types</CardTitle></CardHeader>
              <CardContent className="text-sm overflow-x-auto">
                <table className="min-w-full border text-xs">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="p-2 border">Code</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Hours</th>
                      <th className="p-2 border">Eligibility</th>
                      <th className="p-2 border">Recurrence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.shiftTypes?.map(st => (
                      <tr key={st.id}>
                        <td className="p-2 border font-mono">{st.code}</td>
                        <td className="p-2 border">{st.name}</td>
                        <td className="p-2 border">{st.isAllDay ? 'All Day' : `${st.startTime}-${st.endTime}`}</td>
                        <td className="p-2 border">
                          {st.eligibility.allowAny ? 'Allow Any' : st.eligibility.requiredSubspecialty ? `Required: ${st.eligibility.requiredSubspecialty.code}` : st.eligibility.namedAllowlist.length ? `Named (${st.eligibility.namedAllowlist.length})` : '—'}
                        </td>
                        <td className="p-2 border">
                          {['mon','tue','wed','thu','fri','sat','sun'].filter((k) => st.recurrence[k as keyof typeof st.recurrence]).join(', ').toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Staff</CardTitle></CardHeader>
              <CardContent className="text-sm overflow-x-auto">
                <table className="min-w-full border text-xs">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Subspecialty</th>
                      <th className="p-2 border">FTE %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.staff?.map(u => (
                      <tr key={u.id}>
                        <td className="p-2 border">{u.name}</td>
                        <td className="p-2 border">{u.email}</td>
                        <td className="p-2 border">{u.subspecialty || '—'}</td>
                        <td className="p-2 border">{u.ftePercent ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-sm text-red-600">Failed to load settings.</div>
        )}
      </div>
    </DashboardPage>
  )
}


