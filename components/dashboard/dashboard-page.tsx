"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { DashboardHeader } from "./dashboard-header"
import { generateBreadcrumbs } from "@/lib/constants/navigation"

interface DashboardPageProps {
  children: ReactNode
  customBreadcrumbs?: { label: string; href?: string }[]
}

export function DashboardPage({ 
  children, 
  customBreadcrumbs
}: DashboardPageProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Auto-generate breadcrumbs from current path if not provided
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader 
        breadcrumbItems={breadcrumbs}
        userName={session?.user?.name || undefined}
        userEmail={session?.user?.email || undefined}
      />
      
      <div className="flex-1 gap-4 flex flex-col overflow-y-auto min-h-0  p-4">
          {children}
      </div>
    </div>
  )
}