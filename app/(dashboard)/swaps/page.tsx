import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSwapManager } from "@/components/swaps/admin-swap-manager"
import { SwapRequestsList } from "@/components/swaps/swap-requests-list"

import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export default async function SwapsPage() {
  const session = await auth()
  
  if (!session?.user?.organizationId) {
    redirect('/auth/login')
  }
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Shift Swaps" }
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Shift Swaps</h1>
          <p className="text-muted-foreground">
            Manage shift exchange requests between radiologists.
          </p>
        </div>

        {/* Admin Swap Manager */}
        <AdminSwapManager organizationId={session.user.organizationId} />

        {/* Pending Swaps */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Swap Requests</CardTitle>
            <CardDescription>
              Review and respond to incoming swap requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwapRequestsList organizationId={session.user.organizationId} showAll={false} />
          </CardContent>
        </Card>

        {/* All Swap Requests */}
        <Card>
          <CardHeader>
            <CardTitle>All Swap Requests</CardTitle>
            <CardDescription>
              View all swap requests including completed and cancelled ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwapRequestsList organizationId={session.user.organizationId} showAll={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
