'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Calendar, Save, RotateCcw } from 'lucide-react'

interface VacationWeek {
  weekNumber: number
  startDate: Date
  endDate: Date
  dateRange: string
}

interface ManualVacationSelectorProps {
  radiologistId: string
  radiologistName: string
  year: number
  month: number
  currentPreferences?: Array<{
    rank: number
    weekNumber: number
    weekStartDate: string
    weekEndDate: string
  }>
  onSave: () => void
}

export function ManualVacationSelector({ 
  radiologistId, 
  radiologistName, 
  year, 
  month, 
  currentPreferences = [],
  onSave 
}: ManualVacationSelectorProps) {
  const [availableWeeks, setAvailableWeeks] = useState<VacationWeek[]>([])
  const [selectedWeeks, setSelectedWeeks] = useState<VacationWeek[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const generateAvailableWeeks = useCallback(() => {
    setLoading(true)
    const weeks: VacationWeek[] = []
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    
    // Find all Mondays in the month
    const current = new Date(firstDay)
    
    // Go to the first Monday of the month (or previous month if needed)
    while (current.getDay() !== 1) {
      current.setDate(current.getDate() + 1)
    }
    
    let weekNumber = 1
    while (current <= lastDay) {
      const weekStart = new Date(current)
      const weekEnd = new Date(current)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      weeks.push({
        weekNumber,
        startDate: weekStart,
        endDate: weekEnd,
        dateRange: `${startStr} - ${endStr}`
      })
      
      current.setDate(current.getDate() + 7)
      weekNumber++
    }
    
    setAvailableWeeks(weeks)
    setLoading(false)
  }, [year, month])

  useEffect(() => {
    generateAvailableWeeks()
  }, [year, month, generateAvailableWeeks])

  useEffect(() => {
    // Initialize with current preferences if they exist
    if (currentPreferences.length > 0 && availableWeeks.length > 0) {
      const preSelectedWeeks = currentPreferences.map(pref => {
        const matchingWeek = availableWeeks.find(w => w.weekNumber === pref.weekNumber)
        return matchingWeek
      }).filter(Boolean) as VacationWeek[]
      
      setSelectedWeeks(preSelectedWeeks)
    }
  }, [currentPreferences, availableWeeks])

  const toggleWeekSelection = (week: VacationWeek) => {
    const isSelected = selectedWeeks.some(w => w.weekNumber === week.weekNumber)
    
    if (isSelected) {
      // Remove from selection
      setSelectedWeeks(prev => prev.filter(w => w.weekNumber !== week.weekNumber))
    } else {
      // Add to selection (max 3)
      if (selectedWeeks.length < 3) {
        setSelectedWeeks(prev => [...prev, week].sort((a, b) => a.weekNumber - b.weekNumber))
      } else {
        toast.error('You can only select 3 vacation weeks')
      }
    }
  }

  const handleSave = async () => {
    if (selectedWeeks.length !== 3) {
      toast.error('Please select exactly 3 vacation weeks')
      return
    }

    setSaving(true)
    try {
      const preferences = selectedWeeks.map((week, index) => ({
        rank: index + 1,
        weekNumber: week.weekNumber,
        weekStartDate: week.startDate.toISOString(),
        weekEndDate: week.endDate.toISOString()
      }))

      const response = await fetch('/api/preferences/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: radiologistId,
          year,
          month,
          preferences
        })
      })

      if (response.ok) {
        toast.success(`Saved vacation preferences for ${radiologistName}`)
        onSave() // Refresh parent component
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Error saving preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSelectedWeeks([])
  }

  const getRankBadge = (week: VacationWeek) => {
    const index = selectedWeeks.findIndex(w => w.weekNumber === week.weekNumber)
    if (index === -1) return null
    
    const rankColors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']
    return (
      <Badge className={`${rankColors[index]} text-white ml-2`}>
        P{index + 1}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading weeks...</p>
        </div>
      </div>
    )
  }

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Manual Selection - {monthName} {year}
        </CardTitle>
        <CardDescription>
          Select exactly 3 weeks for {radiologistName}&apos;s vacation preferences (P1, P2, P3)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Status */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            Selected: <strong>{selectedWeeks.length}/3</strong> weeks
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={selectedWeeks.length === 0}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={selectedWeeks.length !== 3 || saving}
            >
              <Save className="h-3 w-3 mr-1" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>

        {/* Week Selection Grid */}
        <div className="grid gap-2">
          {availableWeeks.map(week => {
            const isSelected = selectedWeeks.some(w => w.weekNumber === week.weekNumber)
            return (
              <button
                key={week.weekNumber}
                onClick={() => toggleWeekSelection(week)}
                className={`flex items-center justify-between p-3 rounded border transition ${
                  isSelected 
                    ? 'bg-primary/20 border-primary/40 text-primary-foreground' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">Week {week.weekNumber}</div>
                  <div className="text-xs text-muted-foreground">{week.dateRange}</div>
                </div>
                <div className="flex items-center">
                  {isSelected && (
                    <div className="mr-2 text-xs">Selected</div>
                  )}
                  {getRankBadge(week)}
                </div>
              </button>
            )
          })}
        </div>

        {availableWeeks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No weeks available for this month
          </div>
        )}
      </CardContent>
    </Card>
  )
}
