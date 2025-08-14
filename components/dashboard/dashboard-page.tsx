"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { DashboardHeader } from "./dashboard-header"
import { generateBreadcrumbs } from "@/lib/utils/navigation"

interface DashboardPageProps {
  children: ReactNode
  // Optional overrides
  customBreadcrumbs?: { label: string; href?: string }[]
  userName?: string
  userEmail?: string
}

export function DashboardPage({ 
  children, 
  customBreadcrumbs,
  userName,
  userEmail 
}: DashboardPageProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from current path if not provided
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname)

  return (
    <>
      <DashboardHeader 
        breadcrumbItems={breadcrumbs}
        userName={userName}
        userEmail={userEmail}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
      </div>
    </>
  )
}