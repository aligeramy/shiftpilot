/**
 * Schedule Page - Display generated schedules with FullCalendar
 */
"use client"

import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { WeeklyMatrix } from '@/components/calendar/weekly-matrix'
import { Card, CardContent } from '@/components/ui/card'


interface Assignment {
  id: string;
  instance: {
    date: string;
    startTime: string;
    endTime: string;
    shiftType: { code: string; name: string };
  };
  user: { name: string; email: string };
  assignmentType?: 'GENERATED' | 'MANUAL' | 'SWAPPED';
}

export default function SchedulePage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "Schedule Calendar" }
      ]}
    >
      <div className="space-y-6">
        <div className="mb-2">
          <h2 className="text-xl font-semibold">Weekly Matrix (sheet‑style)</h2>
          <p className="text-muted-foreground">Rows are shift types; columns are Mon–Fri and Sat/Sun. Colors = subspecialty; dashed + ↔︎ = swapped.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <WeeklyMatrix
              assignments={[]}
              year={new Date().getFullYear()}
              month={new Date().getMonth() + 1}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
