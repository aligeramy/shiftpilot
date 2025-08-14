import { WithDashboardLayout } from "@/components/dashboard/with-dashboard-layout"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default async function AnalyticsPage() {
  const analyticsStats = {
    activeShifts: 32,
    staffOnline: 24,
    coverageRate: "97%"
  }

  return (
    <WithDashboardLayout
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
    </WithDashboardLayout>
  )
}