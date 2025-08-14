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
      
      {/* Main content area with glassmorphic scrollable container */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-y-auto">
          <div className="p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}