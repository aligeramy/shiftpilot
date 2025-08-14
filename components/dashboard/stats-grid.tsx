import { StatsCard } from "./stats-card"
import { Clock, Users, TrendingUp } from "lucide-react"

interface StatsGridProps {
  stats?: {
    activeShifts: number
    staffOnline: number
    coverageRate: string
  }
}

export function StatsGrid({ 
  stats = {
    activeShifts: 24,
    staffOnline: 18,
    coverageRate: "94%"
  }
}: StatsGridProps) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <StatsCard 
        title="Active Shifts" 
        value={stats.activeShifts}
        icon={<Clock className="h-6 w-6 text-brand-light" />}
      />
      <StatsCard 
        title="Staff Online" 
        value={stats.staffOnline}
        icon={<Users className="h-6 w-6 text-brand-light" />}
      />
      <StatsCard 
        title="Coverage Rate" 
        value={stats.coverageRate}
        icon={<TrendingUp className="h-6 w-6 text-brand-light" />}
      />
    </div>
  )
}