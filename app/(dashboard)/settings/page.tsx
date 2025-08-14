"use client"

import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { EditableSettings } from '@/components/settings/editable-settings'

export default function SettingsPage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: 'Dashboard', href: '/home' },
        { label: 'Settings' }
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization, subspecialties, shift types, staff, and system configuration.
          </p>
        </div>
        
        <EditableSettings />
      </div>
    </DashboardPage>
  )
}


