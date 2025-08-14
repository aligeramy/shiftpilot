"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MainContentArea } from "@/components/dashboard/main-content-area"
import { Skeleton } from "@/components/ui/skeleton"

export function HomePageClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkOrganizationStatus()
  }, [])

  const checkOrganizationStatus = async () => {
    try {
      console.log('[HomePageClient] Checking organization status...')
      
      const response = await fetch('/api/onboarding/status')
      const data = await response.json()
      
      console.log('[HomePageClient] Organization status:', data)
      
      // If user has no organization or onboarding is incomplete, redirect to onboarding
      if (!data.organization || !data.organization.onboardingComplete) {
        console.log('[HomePageClient] Redirecting to onboarding')
        router.push('/onboarding')
        return
      }
      
      console.log('[HomePageClient] Organization setup complete, showing dashboard')
      setIsLoading(false)
    } catch (error) {
      console.error('[HomePageClient] Error checking organization status:', error)
      // On error, assume we need onboarding
      router.push('/onboarding')
    }
  }

  // Show loading state while checking organization status
  if (isLoading) {
    return (
      <DashboardPage
        customBreadcrumbs={[
          { label: "Dashboard", href: "/home" },
          { label: "Loading..." }
        ]}
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardPage>
    )
  }

  // Show the actual dashboard once organization is verified
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

