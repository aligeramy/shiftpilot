import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ArrowRightLeft } from "lucide-react"

export default function SwapsPage() {
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

        {/* Swap Request Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Request a Swap
            </CardTitle>
            <CardDescription>
              Create a new shift swap request with another radiologist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Swap request functionality is coming soon.</p>
              <p className="text-sm">
                For now, swap visualization is available in the Schedule Calendar.
                Swapped shifts are shown with dashed borders and ↔︎ indicators.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Swaps */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Swap Requests</CardTitle>
            <CardDescription>
              Review and respond to incoming swap requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending swap requests</p>
            </div>
          </CardContent>
        </Card>

        {/* Swap History */}
        <Card>
          <CardHeader>
            <CardTitle>Swap History</CardTitle>
            <CardDescription>
              View completed and cancelled swap requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No swap history available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
