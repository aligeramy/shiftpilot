import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default function SchedulingPage() {
  const schedulingStats = {
    activeShifts: 28,
    staffOnline: 16,
    coverageRate: "89%"
  }

  return (
    <DashboardPage>
      <StatsGrid stats={schedulingStats} />
      <MainContentArea 
        title="Scheduling Management"
        subtitle="Create and manage radiology shift schedules."
      />
    </DashboardPage>
  )
}