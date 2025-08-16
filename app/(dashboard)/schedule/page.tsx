/**
 * Schedule Page - Display generated schedules with FullCalendar
 */
"use client"

import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { WeeklyMatrix } from '@/components/calendar/weekly-matrix'
import { Card, CardContent } from '@/components/ui/card'
import { useSchedule } from '@/hooks/use-schedule'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, Plus } from 'lucide-react'
import { useState } from 'react'

export default function SchedulePage() {
  const [viewYear] = useState(new Date().getFullYear())
  const [viewMonth] = useState(new Date().getMonth() + 1)
  
  const { assignments, loading, error, generateSchedule, loadSchedule } = useSchedule(viewYear, viewMonth)
  

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Schedule Calendar" }
      ]}
    >
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">Schedule Calendar</h2>
            <p className="text-muted-foreground">
              View and manage generated schedules. Generate new schedules or view existing ones.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => loadSchedule()}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => generateSchedule()}
              disabled={loading}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Generate Schedule
            </Button>
          </div>
        </div>

       

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error: {error}</p>
              <Button 
                onClick={() => loadSchedule()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Loading schedule...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Content */}
        {!loading && !error && assignments.length > 0 && (
          <>
          
         
                              <CardContent className="pt-6">
                  <WeeklyMatrix
                    assignments={assignments}
                    year={viewYear}
                    month={viewMonth}
                  />
                </CardContent>
         
          </>
        )}

        {/* Empty State */}
        {!loading && !error && assignments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Schedule Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a schedule for {monthNames[viewMonth - 1]} {viewYear} to get started.
                </p>
                <Button onClick={() => generateSchedule()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPage>
  )
}
