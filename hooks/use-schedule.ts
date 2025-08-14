'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export type ScheduleAssignment = {
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

type ScheduleState = {
  assignments: ScheduleAssignment[]
  loading: boolean
  error: string | null
  lastGenerated: Date | null
}

export function useSchedule(initialYear?: number, initialMonth?: number) {
  const [state, setState] = useState<ScheduleState>({
    assignments: [],
    loading: false,
    error: null,
    lastGenerated: null
  })

  const [year, setYear] = useState(initialYear || new Date().getFullYear())
  const [month, setMonth] = useState(initialMonth || new Date().getMonth() + 1)
  const [orgId, setOrgId] = useState<string | null>(null)

  // Load organization ID on mount
  useEffect(() => {
    const loadOrgId = async () => {
      try {
        const seedResp = await fetch('/api/test/seed', { method: 'POST' })
        if (seedResp.ok) {
          const seedData = await seedResp.json()
          setOrgId(seedData.data?.organizationId || null)
        }
      } catch (e) {
        console.warn('Failed to load org ID:', e)
      }
    }
    loadOrgId()
  }, [])

  const loadSchedule = useCallback(async (targetYear?: number, targetMonth?: number) => {
    const useYear = targetYear || year
    const useMonth = targetMonth || month
    
    if (!orgId) {
      setState(prev => ({ ...prev, error: 'Organization not found' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Fetch existing schedule from DB
      const schedResp = await fetch(`/api/test/schedule/${orgId}/${useYear}/${useMonth}`)
      if (!schedResp.ok) {
        throw new Error('Failed to load schedule')
      }
      
      const schedJson = await schedResp.json()
      const raw = schedJson.data?.rawSchedule || []
      
      const assignments: ScheduleAssignment[] = raw
        .filter((item: any) => item.assignedTo && item.assignedTo.length > 0)
        .flatMap((item: any) =>
          item.assignedTo.map((a: any) => ({
            id: `${item.date}-${item.shiftCode}-${a.email}`,
            instance: {
              date: item.date,
              startTime: (item.shiftTime?.split('-')[0]) || '08:00',
              endTime: (item.shiftTime?.split('-')[1]) || '16:00',
              shiftType: { code: item.shiftCode, name: item.shiftName },
            },
            user: { name: a.name, email: a.email },
            assignmentType: a.assignmentType,
          }))
        )

      setState(prev => ({
        ...prev,
        assignments,
        loading: false,
        lastGenerated: new Date()
      }))

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load schedule'
      }))
    }
  }, [orgId, year, month])

  const generateSchedule = useCallback(async (targetYear?: number, targetMonth?: number) => {
    const useYear = targetYear || year
    const useMonth = targetMonth || month
    
    if (!orgId) {
      toast.error('Organization not found')
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Ensure preferences exist
      await fetch('/api/preferences/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: useYear, month: useMonth })
      })

      // Generate new schedule
      const genResp = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organizationId: orgId, 
          year: useYear, 
          month: useMonth, 
          seed: 42 
        })
      })

      if (!genResp.ok) {
        const errorData = await genResp.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      // Reload the schedule from DB
      await loadSchedule(useYear, useMonth)
      toast.success('Schedule generated successfully')

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Generation failed'
      setState(prev => ({ ...prev, loading: false, error: errorMsg }))
      toast.error(errorMsg)
    }
  }, [orgId, year, month, loadSchedule])

  const resetSchedule = useCallback(async (targetYear?: number, targetMonth?: number) => {
    const useYear = targetYear || year
    const useMonth = targetMonth || month
    
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const resp = await fetch('/api/test/reset-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: useYear, month: useMonth })
      })

      if (!resp.ok) {
        throw new Error('Reset failed')
      }

      setState(prev => ({ ...prev, assignments: [], loading: false }))
      toast.success('Schedule reset successfully')

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Reset failed'
      setState(prev => ({ ...prev, loading: false, error: errorMsg }))
      toast.error(errorMsg)
    }
  }, [year, month])

  // Auto-load when year/month changes
  useEffect(() => {
    if (orgId) {
      loadSchedule()
    }
  }, [year, month, orgId, loadSchedule])

  return {
    ...state,
    year,
    month,
    orgId,
    setYear,
    setMonth,
    loadSchedule,
    generateSchedule,
    resetSchedule
  }
}
