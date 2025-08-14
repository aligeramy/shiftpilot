import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default function HomePage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Overview" }
      ]}
    >
      <StatsGrid />
      <MainContentArea />
 
    </DashboardPage>
  )
}
