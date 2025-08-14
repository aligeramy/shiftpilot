import { WithDashboardLayout } from "@/components/dashboard/with-dashboard-layout"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default async function SchedulingPage() {
  const schedulingStats = {
    activeShifts: 28,
    staffOnline: 16,
    coverageRate: "89%"
  }

  return (
    <WithDashboardLayout>
      <StatsGrid stats={schedulingStats} />
      <MainContentArea 
        title="Scheduling Management"
        subtitle="Create and manage radiology shift schedules."
      />
    </WithDashboardLayout>
  )
}