import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardBreadcrumb } from "./dashboard-breadcrumb"
import { signOut } from "@/lib/auth"

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
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DashboardBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="ml-auto flex items-center gap-4 px-4">
        <span className="text-muted-foreground text-sm">
          Welcome, {userName || userEmail}
        </span>
        <ThemeToggle />
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/auth/login" })
          }}
        >
          <Button type="submit" variant="outline" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}