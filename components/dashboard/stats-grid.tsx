"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "./stats-card"
import { Clock, Users, TrendingUp, Building } from "lucide-react"

interface OrganizationData {
  subspecialties: Array<{id: string, code: string, name: string}>
  shiftTypes: Array<{id: string, code: string, name: string}>
  staff: Array<{id: string, name: string, email: string, subspecialty: string}>
}

export function StatsGrid() {
  const [data, setData] = useState<OrganizationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/settings/overview')
        const result = await response.json()
        if (result.success) {
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch organization data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-8 bg-slate-200 rounded mb-1"></div>
            <div className="h-3 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500 py-8">
        Failed to load organization data
      </div>
    )
  }

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <StatsCard 
        title="Subspecialties" 
        value={data.subspecialties?.length || 0}
        icon={<Building className="h-6 w-6 text-brand-primary" />}
      />
      <StatsCard 
        title="Shift Types" 
        value={data.shiftTypes?.length || 0}
        icon={<Clock className="h-6 w-6 text-brand-primary" />}
      />
      <StatsCard 
        title="Staff Members" 
        value={data.staff?.length || 0}
        icon={<Users className="h-6 w-6 text-brand-primary" />}
      />
      <StatsCard 
        title="Coverage Rate" 
        value="100%"
        icon={<TrendingUp className="h-6 w-6 text-brand-primary" />}
      />
    </div>
  )
}