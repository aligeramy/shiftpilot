'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

type AssignmentInput = {
  id: string
  instance: {
    date: string
    startTime: string
    endTime: string
    shiftType: { code: string; name: string }
  }
  user: { name: string; email: string }
  assignmentType?: 'GENERATED' | 'MANUAL' | 'SWAPPED'
}

type RowDef = { label: string; codes: string[] }

const ROWS: RowDef[] = [
  { label: 'Neuro 1 (CT STAT, on site)', codes: ['N1'] },
  { label: 'Neuro 2 (MRI STAT, on site)', codes: ['N2'] },
  { label: 'Vascular (on site)', codes: ['VASC'] },
  { label: 'General (XR+GI to 1600, on site)', codes: ['XR_GEN'] },
  { label: 'CT/US (ER+IP to 1600, on site)', codes: ['CTUS'] },
  { label: 'MSK (on site)', codes: ['MSK'] },
  { label: 'Neuro 3 (CT volume support)', codes: ['N3'] },
  { label: 'Neuro 4 (MR volume support)', codes: ['N4'] },
  { label: 'Body volume support', codes: ['BODY_VOL'] },
  { label: 'Body MRI', codes: ['BODY_MRI'] },
  { label: 'Stoney Creek', codes: ['STONEY'] },
  { label: 'MA1 (spec msk, GI Tues/Thu/Fri)', codes: ['MA1'] },
  { label: 'Speers', codes: ['SPEERS'] },
  { label: "Walker's Line", codes: ['WALKERS'] },
  { label: 'WH other', codes: ['WH_OTHER'] },
  { label: 'Brant (mammo)', codes: ['BRANT'] },
  { label: 'Coiling', codes: ['COILING'] },
  { label: 'Cardiac CT/MRI', codes: ['CARDIAC'] },
  { label: 'Body 1600–1800', codes: ['BODY_16_18'] },
  { label: 'Body 1800–2100', codes: ['BODY_18_21'] },
  { label: 'Neuro 1600–1800', codes: ['NEURO_16_18'] },
  { label: 'Neuro 1800–2100', codes: ['NEURO_18_21'] },
]

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getMonday(d: Date) {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // 0..6 with Monday=0
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatYmd(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}



function endOfWeek(monday: Date) {
  const d = new Date(monday)
  d.setDate(d.getDate() + 6)
  return d
}

type Props = {
  assignments: AssignmentInput[]
  year: number
  month: number // 1..12
}

export function WeeklyMatrix({ assignments, year, month }: Props) {
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(month || new Date().getMonth() + 1)
  const [localAssignments, setLocalAssignments] = useState<AssignmentInput[]>(assignments || [])
  const [loading, setLoading] = useState(false)
  const [fairness, setFairness] = useState<{ min: number; max: number } | null>(null)

  const [weekStart, setWeekStart] = useState(() => {
    const first = new Date(selectedYear, selectedMonth - 1, 1)
    return getMonday(first)
  })

  useEffect(() => {
    // Only set assignments if they are passed as props
    if (assignments && assignments.length > 0) {
      setLocalAssignments(assignments)
      void loadFairnessData()
    } else {
      // Clear assignments when no data is passed
      setLocalAssignments([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, assignments])

  const loadSchedule = async () => {
    try {
      setLoading(true)
      // Seed (idempotent for dev/demo)
      const seedResp = await fetch('/api/test/seed', { method: 'POST' })
      if (!seedResp.ok) {
        toast.error('Failed to seed data')
        return
      }
      const seedJson = await seedResp.json()
      const orgId = seedJson.data?.organizationId
      if (!orgId) {
        toast.error('No organization found after seed')
        return
      }

      // Ensure preferences exist (auto-generate for all if missing)
      try {
        await fetch('/api/preferences/generate-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year: selectedYear, month: selectedMonth })
        })
        toast.info('Ensured vacation preferences exist for this month')
      } catch {}

      // Generate schedule for month
      const genResp = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, year: selectedYear, month: selectedMonth, seed: 42 })
      })
      if (!genResp.ok) {
        toast.error('Failed to generate schedule')
        return
      }

      // Fetch schedule
      const schedResp = await fetch(`/api/test/schedule/${orgId}/${selectedYear}/${selectedMonth}`)
      if (!schedResp.ok) {
        toast.error('Failed to load schedule')
        return
      }
      const schedJson = await schedResp.json()
      const raw = schedJson.data?.rawSchedule || []
      const mapped: AssignmentInput[] = raw
        .filter((item: unknown) => (item as any).assignedTo && (item as any).assignedTo.length > 0)
        .flatMap((item: unknown) =>
          (item as any).assignedTo.map((a: unknown) => ({
            id: `${(item as any).date}-${(item as any).shiftCode}-${(a as any).email}`,
            instance: {
              date: (item as any).date,
              startTime: ((item as any).shiftTime?.split('-')[0]) || '08:00',
              endTime: ((item as any).shiftTime?.split('-')[1]) || '16:00',
              shiftType: { code: (item as any).shiftCode, name: (item as any).shiftName },
            },
            user: { name: (a as any).name, email: (a as any).email },
            assignmentType: (a as any).assignmentType,
          }))
        )
      setLocalAssignments(mapped)
      toast.success(`Loaded ${mapped.length} assignments`)

      // Load fairness (admin-only API enforces role)
      try {
        const fairResp = await fetch(`/api/fairness/${selectedYear}/${selectedMonth}`)
        if (fairResp.ok) {
          const fairJson = await fairResp.json()
          const ys = (fairJson.results || []).map((r: unknown) => (r as any).ytdPoints)
          if (ys.length > 0) {
            const min = Math.min(...ys)
            const max = Math.max(...ys)
            setFairness({ min, max })
            ;(window as any).__fairness = fairJson.results
          }
        }
      } catch {}
    } catch (e) {
      console.error(e)
      toast.error('Error loading schedule')
    } finally {
      setLoading(false)
    }
  }

  const loadFairnessData = async () => {
    try {
      const fairResp = await fetch(`/api/fairness/${selectedYear}/${selectedMonth}`)
      if (fairResp.ok) {
        const fairJson = await fairResp.json()
        const ys = (fairJson.results || []).map((r: unknown) => (r as any).ytdPoints)
        if (ys.length > 0) {
          const min = Math.min(...ys)
          const max = Math.max(...ys)
          setFairness({ min, max })
          ;(window as any).__fairness = fairJson.results
        }
      }
    } catch {}
  }

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      return d
    })
  }, [weekStart])

  const monthRange = useMemo(() => {
    const start = new Date(selectedYear, selectedMonth - 1, 1)
    const end = new Date(selectedYear, selectedMonth, 0)
    return { start, end }
  }, [selectedYear, selectedMonth])

  const inSelectedMonth = (d: Date) => d >= monthRange.start && d <= monthRange.end

  const byDayAndCode = useMemo(() => {
    const map = new Map<string, Map<string, AssignmentInput[]>>()
    for (const a of localAssignments) {
      const dayMap = map.get(a.instance.date) || new Map<string, AssignmentInput[]>()
      const arr = dayMap.get(a.instance.shiftType.code) || []
      arr.push(a)
      dayMap.set(a.instance.shiftType.code, arr)
      map.set(a.instance.date, dayMap)
    }
    return map
  }, [localAssignments])

  const colorForShift = (code: string): string => {
    const c = code.toUpperCase()
    if (c.startsWith('N') || c.startsWith('NEURO')) return '#3b82f6' // NEURO blue
    if (c.startsWith('BODY') || c === 'CTUS' || c === 'XR_GEN') return '#10b981' // BODY emerald
    if (c.startsWith('MSK')) return '#f59e0b' // MSK amber
    if (c.startsWith('VASC') || c.startsWith('IR')) return '#ef4444' // IR red
    if (c.startsWith('CARDIAC') || c.startsWith('CHEST')) return '#06b6d4' // CHEST cyan
    if (c.startsWith('CLIN') || ['STONEY','MA1','SPEERS','WALKERS','WH_OTHER','BRANT'].includes(c)) return '#64748b' // clinics slate
    return '#6b7280' // default gray
  }

  const renderCell = (d: Date, codes: string[]) => {
    const dayKey = formatYmd(d)
    const dayMap = byDayAndCode.get(dayKey)
    if (!dayMap) return null
    const items: AssignmentInput[] = []
    for (const code of codes) {
      const arr = dayMap.get(code) || []
      for (const a of arr) items.push(a)
    }
    if (items.length === 0) return null
    return (
      <div className="flex flex-wrap items-start justify-center gap-1">
        {items.map((a) => {
          const color = colorForShift(a.instance.shiftType.code)
          const isSwapped = a.assignmentType === 'SWAPPED'
          return (
            <Tooltip key={a.id}>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1 text-xs font-semibold text-white border ${isSwapped ? 'border-dashed' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  title=""
                >
                  {initials(a.user.name || a.user.email)}{isSwapped ? '↔︎' : ''}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {a.user.name || a.user.email} — {a.instance.shiftType.code}{isSwapped ? ' (swapped)' : ''}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    )
  }

  const goPrevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  const goNextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const weekLabel = `${weekStart.toLocaleString('en-US', { month: 'long' })} ${weekStart.getDate()} – ${endOfWeek(weekStart).getDate()}`

  // Clamp rendering to selected month (cells outside month show as empty)
  const visibleDays = weekDays.map(d => (inSelectedMonth(d) ? d : null))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Week of: {weekLabel}
          {fairness && (
            <span className="ml-3 text-sm font-normal text-muted-foreground">Fairness YTD band: {fairness.min}–{fairness.max}</span>
          )}
        </CardTitle>
        <div className="flex gap-2 items-center">
          <select
            className="rounded border px-2 py-1 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(2024, m - 1).toLocaleDateString('en-US', { month: 'long' })}</option>
            ))}
          </select>
          <Button variant="outline" onClick={loadSchedule} disabled={loading}>🔄 Regenerate</Button>
          <Button variant="outline" onClick={goPrevWeek}>◀ Prev</Button>
          <Button variant="outline" onClick={goNextWeek}>Next ▶</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left p-2 border">Week of:</th>
                <th className="p-2 border">Mon</th>
                <th className="p-2 border">Tues</th>
                <th className="p-2 border">Wed</th>
                <th className="p-2 border">Thurs</th>
                <th className="p-2 border">Fri</th>
                <th className="p-2 border">Sat/Sun</th>
              </tr>
              <tr>
                <td className="p-2 border">{weekStart.toLocaleString('en-US', { month: 'long' })}</td>
                <td className="p-2 border text-center">{weekDays[0].getDate()}</td>
                <td className="p-2 border text-center">{weekDays[1].getDate()}</td>
                <td className="p-2 border text-center">{weekDays[2].getDate()}</td>
                <td className="p-2 border text-center">{weekDays[3].getDate()}</td>
                <td className="p-2 border text-center">{weekDays[4].getDate()}</td>
                <td className="p-2 border text-center">{weekDays[5].getDate()}/{weekDays[6].getDate()}</td>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const baseColor = colorForShift(row.codes[0])
                const rowBg = hexToRgba(baseColor, 0.06)
                const mon = visibleDays[0] && renderCell(visibleDays[0]!, row.codes)
                const tue = visibleDays[1] && renderCell(visibleDays[1]!, row.codes)
                const wed = visibleDays[2] && renderCell(visibleDays[2]!, row.codes)
                const thu = visibleDays[3] && renderCell(visibleDays[3]!, row.codes)
                const fri = visibleDays[4] && renderCell(visibleDays[4]!, row.codes)
                const sat = visibleDays[5] && renderCell(visibleDays[5]!, row.codes)
                const sun = visibleDays[6] && renderCell(visibleDays[6]!, row.codes)
                const wknd = [sat, sun].filter(Boolean).join(' / ')
                return (
                  <tr key={row.label} style={{ backgroundColor: rowBg }}>
                    <td className="p-2 border align-top">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: baseColor }} />
                        {row.label}
                      </span>
                    </td>
                    <td className="p-2 border align-top text-center whitespace-pre">{mon || ''}</td>
                    <td className="p-2 border align-top text-center whitespace-pre">{tue || ''}</td>
                    <td className="p-2 border align-top text-center whitespace-pre">{wed || ''}</td>
                    <td className="p-2 border align-top text-center whitespace-pre">{thu || ''}</td>
                    <td className="p-2 border align-top text-center whitespace-pre">{fri || ''}</td>
                    <td className="p-2 border align-top text-center whitespace-pre">{wknd || ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#3b82f6'}}></span> NEURO</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#10b981'}}></span> BODY/GENERAL</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#f59e0b'}}></span> MSK</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#ef4444'}}></span> IR</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#06b6d4'}}></span> CHEST/CARDIAC</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{background:'#64748b'}}></span> CLINICS</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded border border-dashed"></span> Swapped (↔︎)</span>
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  setLoading(true)
                  const resp = await fetch('/api/test/reset-month', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ year: selectedYear, month: selectedMonth })
                  })
                  if (resp.ok) {
                    toast.success('Month reset. Re-generate to rebuild schedule.')
                    setLocalAssignments([])
                  } else {
                    toast.error('Reset failed')
                  }
                } catch (e) {
                  console.error(e)
                  toast.error('Reset error')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
            >
              ♻️ Reset Month (clear prefs & schedule)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


