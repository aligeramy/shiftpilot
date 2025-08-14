import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { MainContentArea } from "@/components/dashboard/main-content-area"

export default function SchedulingPage() {
  return (
    <DashboardPage>
      <MainContentArea 
        title="Scheduling Management"
        subtitle="Create and manage radiology shift schedules."
      />
    </DashboardPage>
  )
}