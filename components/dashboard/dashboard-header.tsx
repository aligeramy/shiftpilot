import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardBreadcrumb } from "./dashboard-breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  breadcrumbItems: BreadcrumbItem[]
  userName?: string
  userEmail?: string
}

export function DashboardHeader({ 
  breadcrumbItems, 
  userName, 
  userEmail 
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/20 backdrop-blur bg-background/0">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DashboardBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="ml-auto flex items-center gap-4 px-4">
        <span className="text-foreground/50 text-sm">
          Welcome, {userName || userEmail}
        </span>
      </div>
    </header>
  )
}