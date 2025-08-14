import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default function AnalyticsPage() {
  const analyticsStats = {
    activeShifts: 32,
    staffOnline: 24,
    coverageRate: "97%"
  }

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Analytics" }
      ]}
    >
      <StatsGrid stats={analyticsStats} />
      <MainContentArea 
        title="Analytics Dashboard"
        subtitle="Detailed insights into your radiology scheduling performance."
      />
    </DashboardPage>
  )
}