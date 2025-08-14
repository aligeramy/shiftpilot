import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { GradientBackground } from "@/components/ui/gradient-background"

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
    <GradientBackground>
      <div className="h-[calc(100vh-2rem)] bg-background/30 backdrop-blur-sm rounded-2xl shadow-2xl 
      border border-border/20 ring-1 ring-foreground/3 relative flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar user={user} className="z-1 relative" />
          <SidebarInset className="flex flex-col flex-1 opacity-100 z-10 relative">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </GradientBackground>
  );
}