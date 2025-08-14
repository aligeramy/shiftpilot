import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  const user = {
    name: session.user?.name || "User",
    email: session.user?.email || "",
    avatar: undefined, // Remove image access that doesn't exist
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-main to-brand-main p-4">
      <div className="max-h-[calc(100vh-2rem)] bg-transparent backdrop-blur-sm rounded-2xl shadow-2xl border border-border/20 ring-1 ring-foreground/3 overflow-hidden relative">
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset className="flex flex-col min-h-[calc(100vh-2rem)]">
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}