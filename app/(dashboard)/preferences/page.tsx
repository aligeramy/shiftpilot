/**
 * Vacation Preferences Page - Admin interface for managing vacation requests
 * Simulates notifications to radiologists for their top 3 vacation picks
 */
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { VacationPreferencesManager } from '@/components/preferences/vacation-preferences-manager'

export default function PreferencesPage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Vacation Preferences" }
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Vacation Preferences</h1>
          <p className="text-muted-foreground">
            Collect vacation preferences from radiologists. For MVP demo, preferences are simulated through admin interface.
          </p>
        </div>
        
        <VacationPreferencesManager />
      </div>
    </DashboardPage>
  )
}
