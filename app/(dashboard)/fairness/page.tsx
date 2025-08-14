"use client"

import { useEffect, useMemo, useState } from 'react'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type Row = {
  userId: string
  name: string
  email: string
  monthPoints: 0|1|2|3
  gotRank: 0|1|2|3
  ytdPoints: number
}

export default function FairnessPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const months = useMemo(() => [
    { v: 1, n: 'Jan' }, { v: 2, n: 'Feb' }, { v: 3, n: 'Mar' }, { v: 4, n: 'Apr' },
    { v: 5, n: 'May' }, { v: 6, n: 'Jun' }, { v: 7, n: 'Jul' }, { v: 8, n: 'Aug' },
    { v: 9, n: 'Sep' }, { v: 10, n: 'Oct' }, { v: 11, n: 'Nov' }, { v: 12, n: 'Dec' }
  ], [])

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const resp = await fetch(`/api/fairness/${year}/${month}`)
      const json = await resp.json()
      if (!resp.ok || !json.success) throw new Error(json.error || 'Failed to load')
      setRows(json.results as Row[])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const years = [year - 1, year, year + 1]

  return (
    <DashboardPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fairness (Admin)</h1>
          <p className="text-muted-foreground">Monthly points: 0=P1, 1=P2, 2=P3, 3=None; lower is better. YTD = sum Jan..month.</p>
        </div>
        
        <Card className="backdrop-blur bg-white/60 dark:bg-neutral-900/40 border border-white/30 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Fairness Ledger</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={String(year)} onValueChange={value => setYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(month)} onValueChange={value => setMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.v} value={String(m.v)}>{m.n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Radiologist</th>
                  <th className="py-2 pr-4">This Month</th>
                  <th className="py-2 pr-4">Got</th>
                  <th className="py-2 pr-4">YTD Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.userId} className="border-t border-border/50">
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4 font-medium">{r.monthPoints}</td>
                    <td className="py-2 pr-4">{r.gotRank ? `P${r.gotRank}` : 'None'}</td>
                    <td className="py-2 pr-4 font-semibold">{r.ytdPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardPage>
  )
}


