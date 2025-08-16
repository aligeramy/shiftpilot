'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { toast } from 'sonner'
import type { RawScheduleItem } from '@/lib/types/api'

interface ScheduleAssignment {
  id: string
  instance: {
    date: string
    startTime: string
    endTime: string
    shiftType: {
      code: string
      name: string
      requiredSubspecialty: {
        name: string
        code: string
      } | null
    }
  }
  user: {
    name: string
    email: string
    radiologistProfile: {
      subspecialty: {
        name: string
        code: string
      }
    } | null
  }
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  extendedProps: {
    shiftCode: string
    radiologist: string
    subspecialty: string
    email: string
  }
}

const SUBSPECIALTY_COLORS = {
  NEURO: '#3b82f6', // blue
  BODY: '#10b981', // emerald
  MSK: '#f59e0b', // amber
  IR: '#ef4444', // red
  INR: '#8b5cf6', // violet
  CHEST: '#06b6d4', // cyan
  XRUS: '#84cc16' // lime
}

export function ScheduleCalendar() {
  const [assignments, setAssignments] = useState<ScheduleAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterSubspecialty, setFilterSubspecialty] = useState<string>('all')
  const [filterRadiologist, setFilterRadiologist] = useState<string>('all')
  const [orgId, setOrgId] = useState<string | null>(null)

  const loadSchedule = useCallback(async () => {
    setLoading(true)
    try {
      // Ensure we have an organization; seed if not present in state
      let currentOrgId = orgId
      if (!currentOrgId) {
        const seedResponse = await fetch('/api/test/seed', { method: 'POST' })
        if (!seedResponse.ok) {
          toast.error('Failed to initialize data')
          return
        }
        const seedData = await seedResponse.json()
        currentOrgId = seedData.data?.organizationId
        setOrgId(currentOrgId)
      }

      // Generate schedule for the selected period
      const generateResponse = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrgId,
          year: selectedYear,
          month: selectedMonth,
          seed: 42 // Consistent results
        })
      })

      if (!generateResponse.ok) {
        toast.error('Failed to generate schedule')
        return
      }

      // Fetch the schedule data
      const scheduleResponse = await fetch(`/api/test/schedule/${currentOrgId}/${selectedYear}/${selectedMonth}`)
      
      if (scheduleResponse.ok) {
        const data = await scheduleResponse.json()
        const scheduleData = data.data?.rawSchedule || []
        
        // Transform to assignments format
        const assignmentData = scheduleData
          .filter((item: RawScheduleItem) => item.assignedTo && item.assignedTo.length > 0)
          .flatMap((item: RawScheduleItem) => 
            item.assignedTo.map((assignment) => ({
              id: `${item.date}-${item.shiftCode}-${assignment.email}`,
              instance: {
                date: item.date,
                startTime: item.shiftTime.split('-')[0] || '08:00',
                endTime: item.shiftTime.split('-')[1] || '16:00',
                shiftType: {
                  code: item.shiftCode,
                  name: item.shiftName,
                  requiredSubspecialty: assignment.subspecialty ? {
                    name: assignment.subspecialty,
                    code: assignment.subspecialty.split(' ')[0]?.toUpperCase() || 'OTHER'
                  } : null
                }
              },
              user: {
                name: assignment.name,
                email: assignment.email,
                radiologistProfile: {
                  subspecialty: {
                    name: assignment.subspecialty || 'General',
                    code: assignment.subspecialty?.split(' ')[0]?.toUpperCase() || 'OTHER'
                  }
                }
              }
            }))
          )

        setAssignments(assignmentData)
        toast.success(`Loaded ${assignmentData.length} assignments`)
      } else {
        toast.error('Failed to load schedule data')
      }
    } catch (error) {
      console.error('Error loading schedule:', error)
      toast.error('Error loading schedule')
    } finally {
      setLoading(false)
    }
  }, [orgId, selectedYear, selectedMonth])

  useEffect(() => {
    loadSchedule()
  }, [selectedYear, selectedMonth, loadSchedule])

  const exportICS = async () => {
    try {
      // If no org yet, seed first to retrieve it
      let currentOrgId = orgId
      if (!currentOrgId) {
        const seedResponse = await fetch('/api/test/seed', { method: 'POST' })
        if (!seedResponse.ok) {
          toast.error('Failed to initialize data')
          return
        }
        const seedData = await seedResponse.json()
        currentOrgId = seedData.data?.organizationId
        setOrgId(currentOrgId)
      }

      const url = `/api/test/schedule/${currentOrgId}/${selectedYear}/${selectedMonth}/ics`
      const res = await fetch(url)
      if (!res.ok) {
        toast.error('Failed to export ICS')
        return
      }
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `schedule_${selectedYear}-${String(selectedMonth).padStart(2,'0')}.ics`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
      toast.success('ICS downloaded')
    } catch (e) {
      console.error('ICS export failed', e)
      toast.error('ICS export failed')
    }
  }

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const evts = assignments
      .filter(assignment => {
        if (filterSubspecialty !== 'all' && 
            assignment.user.radiologistProfile?.subspecialty.code !== filterSubspecialty) {
          return false
        }
        if (filterRadiologist !== 'all' && assignment.user.email !== filterRadiologist) {
          return false
        }
        return true
      })
      .map(assignment => {
        const subspecialtyCode = assignment.user.radiologistProfile?.subspecialty.code || 'OTHER'
        const color = SUBSPECIALTY_COLORS[subspecialtyCode as keyof typeof SUBSPECIALTY_COLORS] || '#6b7280'
        
        const startDateTime = `${assignment.instance.date}T${assignment.instance.startTime}`
        const endDateTime = `${assignment.instance.date}T${assignment.instance.endTime}`

        return {
          id: assignment.id,
          title: `${assignment.instance.shiftType.code}: ${assignment.user.name}`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            shiftCode: assignment.instance.shiftType.code,
            radiologist: assignment.user.name,
            subspecialty: assignment.user.radiologistProfile?.subspecialty.name || 'General',
            email: assignment.user.email
          }
        }
      })
    // Expose to weekly matrix via window for the schedule page weekly tab
    if (typeof window !== 'undefined') {
      ;(window as Window & { __scheduleAssignments?: typeof assignments }).__scheduleAssignments = assignments
    }
    return evts
  }, [assignments, filterSubspecialty, filterRadiologist])

  const uniqueSubspecialties = useMemo(() => {
    const subspecialties = new Set(
      assignments.map(a => a.user.radiologistProfile?.subspecialty.code).filter(Boolean)
    )
    return Array.from(subspecialties).sort()
  }, [assignments])

  const uniqueRadiologists = useMemo(() => {
    const radiologists = assignments.map(a => ({
      name: a.user.name,
      email: a.user.email
    }))
    const unique = radiologists.filter((rad, index, self) => 
      self.findIndex(r => r.email === rad.email) === index
    )
    return unique.sort((a, b) => a.name.localeCompare(b.name))
  }, [assignments])

  const generateNewSchedule = async () => {
    await loadSchedule()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 items-center">
          <label htmlFor="year" className="text-sm font-medium">Year:</label>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <label htmlFor="month" className="text-sm font-medium">Month:</label>
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generateNewSchedule} disabled={loading}>
          🔄 Regenerate Schedule
        </Button>
        <Button variant="secondary" onClick={exportICS} disabled={loading}>
          📅 Export ICS
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Filter by Subspecialty:</label>
          <Select value={filterSubspecialty} onValueChange={setFilterSubspecialty}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subspecialties</SelectItem>
              {uniqueSubspecialties.filter(sub => sub).map(sub => (
                <SelectItem key={sub} value={sub!}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Filter by Radiologist:</label>
          <Select value={filterRadiologist} onValueChange={setFilterRadiologist}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Radiologists</SelectItem>
              {uniqueRadiologists.map(rad => (
                <SelectItem key={rad.email} value={rad.email}>{rad.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">Total Assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{uniqueRadiologists.length}</div>
            <p className="text-xs text-muted-foreground">Radiologists</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{uniqueSubspecialties.length}</div>
            <p className="text-xs text-muted-foreground">Subspecialties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{calendarEvents.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Calendar</CardTitle>
          <CardDescription>
            Interactive calendar showing shift assignments. Colors represent different subspecialties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              height="auto"
              eventClick={(info) => {
                const props = info.event.extendedProps
                toast.info(
                  `${props.shiftCode}: ${props.radiologist} (${props.subspecialty})`
                )
              }}
              eventMouseEnter={(info) => {
                info.el.title = `${info.event.extendedProps.radiologist} - ${info.event.extendedProps.subspecialty}`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Subspecialty Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SUBSPECIALTY_COLORS).map(([code, color]) => (
              <Badge
                key={code}
                variant="outline"
                style={{ backgroundColor: color, color: 'white', borderColor: color }}
              >
                {code}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
