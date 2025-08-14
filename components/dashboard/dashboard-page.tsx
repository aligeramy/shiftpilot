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
    <>
      <DashboardHeader 
        breadcrumbItems={breadcrumbs}
        userName={session?.user?.name || undefined}
        userEmail={session?.user?.email || undefined}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
      </div>
    </>
  )
}