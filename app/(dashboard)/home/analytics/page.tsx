import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default function AnalyticsPage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Analytics" }
      ]}
    >
      <MainContentArea 
        title="Analytics Dashboard"
        subtitle="Detailed insights into your radiology scheduling performance."
      />
    </DashboardPage>
  )
}