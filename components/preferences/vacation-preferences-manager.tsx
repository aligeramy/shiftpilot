'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
// import { VacationPreferenceForm } from './vacation-preference-form'
import { NotificationPanel } from './notification-panel'

interface Radiologist {
  id: string
  name: string
  email: string
  radiologistProfile: {
    subspecialty: {
      name: string
      code: string
    }
    ftePercent: number
  }
  vacationPreferences: VacationPreference[]
}

interface VacationPreference {
  id: string
  year: number
  month: number
  rank: number
  weekNumber: number
  weekStartDate: string
  weekEndDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export function VacationPreferencesManager() {
  const [radiologists, setRadiologists] = useState<Radiologist[]>([])
  const [selectedRadiologist, setSelectedRadiologist] = useState<Radiologist | null>(null)
  const [loading, setLoading] = useState(true)
  const [targetYear, setTargetYear] = useState(new Date().getFullYear())
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1)
  const [query, setQuery] = useState('')

  useEffect(() => {
    loadRadiologists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRadiologists = async () => {
    try {
      const response = await fetch('/api/preferences/radiologists')
      if (response.ok) {
        const data = await response.json()
        const list = data.radiologists || []
        setRadiologists(list)
        if (!selectedRadiologist && list.length) {
          setSelectedRadiologist(list[0])
        }
      } else {
        toast.error('Failed to load radiologists')
      }
    } catch (error) {
      console.error('Error loading radiologists:', error)
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  const generateAllPreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/preferences/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          year: targetYear,
          month: targetMonth
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        toast.success(`Generated preferences for ${result.count} radiologists`)
        loadRadiologists() // Refresh data
      } else {
        toast.error('Failed to generate preferences')
      }
    } catch (error) {
      console.error('Error generating preferences:', error)
      toast.error('Error generating preferences')
    } finally {
      setLoading(false)
    }
  }

  const generateSelectedPreferences = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/preferences/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          year: targetYear,
          month: targetMonth,
          userId
        })
      })
      if (response.ok) {
        toast.success('Generated preferences for user')
        loadRadiologists()
      } else {
        toast.error('Failed to generate for user')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error generating for user')
    } finally {
      setLoading(false)
    }
  }

  const clearAllPreferences = async () => {
    if (!confirm('Are you sure you want to clear all vacation preferences?')) {
      return
    }
    
    try {
      const response = await fetch('/api/preferences/clear-all', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('All preferences cleared')
        loadRadiologists()
      } else {
        toast.error('Failed to clear preferences')
      }
    } catch (error) {
      console.error('Error clearing preferences:', error)
      toast.error('Error clearing preferences')
    }
  }

  const getPreferenceStatus = (radiologist: Radiologist) => {
    const preferences = radiologist.vacationPreferences || []
    const currentPrefs = preferences.filter(p => 
      p.year === targetYear && p.month === targetMonth
    )
    
    if (currentPrefs.length === 0) return { status: 'No Preferences', color: 'bg-gray-500' }
    if (currentPrefs.length < 3) return { status: 'Incomplete', color: 'bg-yellow-500' }
    
    // Check if any preference was approved (granted)
    const approved = currentPrefs.find(p => p.status === 'APPROVED')
    if (approved) {
      return { status: `Granted P${approved.rank}`, color: 'bg-green-500' }
    }
    
    // Check if all are rejected (schedule was generated but none granted)
    const allRejected = currentPrefs.length === 3 && currentPrefs.every(p => p.status === 'REJECTED')
    if (allRejected) {
      return { status: 'None Granted', color: 'bg-red-500' }
    }
    
    return { status: 'Complete', color: 'bg-blue-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading radiologists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-sm font-medium">Year</label>
          <select
            className="ml-2 rounded border px-2 py-1 text-sm bg-white/10 backdrop-blur-md"
            value={targetYear}
            onChange={(e) => setTargetYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Month</label>
          <select
            className="ml-2 rounded border px-2 py-1 text-sm bg-white/10 backdrop-blur-md"
            value={targetMonth}
            onChange={(e) => setTargetMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(2024, m - 1).toLocaleDateString('en-US', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <Button onClick={generateAllPreferences} disabled={loading}>
          🎲 Auto‑Generate All
        </Button>
        <Button variant="outline" onClick={clearAllPreferences} disabled={loading}>
          🗑️ Clear All
        </Button>
      </div>

      {/* Glassmorphic two‑pane layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-4">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base">Radiologists</CardTitle>
              <CardDescription>Pick a user to view/set 3 vacation choices</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="mb-3 w-full rounded border bg-white/10 px-3 py-2 text-sm backdrop-blur-md"
              />
              <div className="max-h-[50vh] overflow-auto space-y-2 pr-1">
                {radiologists
                  .filter(r => !query || r.name?.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase()))
                  .map(r => {
                    const status = getPreferenceStatus(r)
                    const active = selectedRadiologist?.id === r.id
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRadiologist(r)}
                        className={`w-full text-left rounded px-3 py-2 border transition ${active ? 'bg-primary/20 border-primary/40' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium leading-tight">{r.name}</div>
                            <div className="text-xs text-muted-foreground">{r.radiologistProfile?.subspecialty?.name} • {r.radiologistProfile?.ftePercent}%</div>
                          </div>
                          <Badge className={`${status.color} text-white`}>{status.status}</Badge>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail pane */}
        <div className="md:col-span-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base">Vacation Preferences</CardTitle>
              {selectedRadiologist && (
                <CardDescription>
                  {selectedRadiologist.name} ({selectedRadiologist.email}) — {selectedRadiologist.radiologistProfile?.subspecialty?.name}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedRadiologist ? (
                <div className="text-sm text-muted-foreground">Select a radiologist on the left.</div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => generateSelectedPreferences(selectedRadiologist.id)} disabled={loading}>
                      🎲 Generate for {selectedRadiologist.name?.split(' ')[0] || 'User'}
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {(selectedRadiologist.vacationPreferences || [])
                      .filter(p => p.year === targetYear && p.month === targetMonth)
                      .sort((a, b) => a.rank - b.rank)
                      .map(pref => (
                        <div key={pref.id} className={`flex items-center justify-between rounded border px-3 py-2 ${pref.status === 'APPROVED' ? 'bg-green-50 border-green-200' : pref.status === 'REJECTED' ? 'bg-red-50 border-red-200' : 'bg-white/5'}`}>
                          <div>
                            <div className="font-medium">Choice #{pref.rank}</div>
                            <div className="text-xs text-muted-foreground">Week {pref.weekNumber} — {new Date(pref.weekStartDate).toLocaleDateString()} to {new Date(pref.weekEndDate).toLocaleDateString()}</div>
                          </div>
                          <Badge 
                            className={pref.status === 'APPROVED' ? 'bg-green-600 text-white' : pref.status === 'REJECTED' ? 'bg-red-600 text-white' : ''}
                            variant={pref.status === 'PENDING' ? 'outline' : 'default'}
                          >
                            {pref.status === 'APPROVED' ? '✓ GRANTED' : pref.status === 'REJECTED' ? '✗ REJECTED' : 'PENDING'}
                          </Badge>
                        </div>
                      ))}
                    {(!selectedRadiologist.vacationPreferences || selectedRadiologist.vacationPreferences.filter(p => p.year === targetYear && p.month === targetMonth).length === 0) && (
                      <div className="text-sm text-muted-foreground">No preferences yet for this month. Click Generate.</div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications (optional, stays below) */}
      <div className="grid">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader><CardTitle className="text-base">Notifications (Simulated)</CardTitle></CardHeader>
          <CardContent>
            <NotificationPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
