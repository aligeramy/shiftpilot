import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true, name: true, email: true },
  })

  const user = {
    name: dbUser?.name || session.user?.name || "User",
    email: dbUser?.email || session.user?.email || "",
    avatar: dbUser?.image || undefined,
  }

  // User is fetched server-side and passed to sidebar and pages via props/components

  return (
    <div className="min-h-screen bg-gradient-to-tr from-brand-main to-brand-light p-4">
      <div className="h-[calc(100vh-2rem)] bg-transparent backdrop-blur-sm rounded-2xl shadow-2xl border border-border/20 ring-1 ring-foreground/3 relative flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset className="flex flex-col flex-1 opacity-100">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}