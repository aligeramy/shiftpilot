import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardPage } from "./dashboard-page"
import { ReactNode } from "react"

interface WithDashboardLayoutProps {
  children: ReactNode
  customBreadcrumbs?: { label: string; href?: string }[]
}

export async function WithDashboardLayout({ 
  children, 
  customBreadcrumbs 
}: WithDashboardLayoutProps) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <DashboardPage
      customBreadcrumbs={customBreadcrumbs}
      userName={session.user?.name || undefined}
      userEmail={session.user?.email || undefined}
    >
      {children}
    </DashboardPage>
  )
}