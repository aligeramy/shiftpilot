'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function NotificationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification System (Simulated)</CardTitle>
        <CardDescription>
          In a real system, notifications would be sent to radiologists to collect their vacation preferences. 
          For this MVP demo, preferences are simulated through the admin interface.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">📧 Vacation Preference Request</p>
              <p className="text-sm text-muted-foreground">
                Sent to all radiologists - Please submit your top 3 vacation week choices
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Simulated
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">🔔 Schedule Published</p>
              <p className="text-sm text-muted-foreground">
                Monthly schedule has been generated and is ready for review
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Ready
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">⏰ Preference Deadline Reminder</p>
              <p className="text-sm text-muted-foreground">
                Reminder: Submit vacation preferences by end of week
              </p>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Pending
            </Badge>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border">
          <h4 className="font-medium text-blue-900 mb-2">💡 MVP Demo Note</h4>
          <p className="text-sm text-blue-700">
            In the full system, this would integrate with email services (like Resend) to automatically 
            notify radiologists. For now, admins can simulate user responses through the interface above.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
