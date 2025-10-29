"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, Shield, Download } from "lucide-react"
import { DEMO_SHIFT_TYPES } from "@/lib/demo-data/onboarding-data"

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: index * 0.05, duration: 0.3 }
  })
}

const categoryColors: Record<string, string> = {
  'Neuro': 'from-blue-400/30 via-blue-500/20 to-transparent',
  'Neuro Late': 'from-indigo-400/30 via-indigo-500/20 to-transparent',
  'Body': 'from-emerald-400/30 via-emerald-500/20 to-transparent',
  'Body Late': 'from-teal-400/30 via-teal-500/20 to-transparent',
  'IR': 'from-amber-400/30 via-amber-500/20 to-transparent',
  'INR': 'from-sky-400/30 via-sky-500/20 to-transparent',
  'Cardiac': 'from-rose-400/30 via-rose-500/20 to-transparent',
  'General': 'from-slate-400/30 via-slate-500/20 to-transparent',
  'Clinic': 'from-purple-400/30 via-purple-500/20 to-transparent',
  'Call': 'from-red-400/30 via-red-500/20 to-transparent',
  'Womens': 'from-pink-400/30 via-pink-500/20 to-transparent',
}

export function Step03ShiftCatalog() {
  const handleDownloadTemplate = () => {
    const csvContent = [
      ['Code', 'Name', 'Start Time', 'End Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Eligibility Type', 'Subspecialty', 'Category'].join(','),
      ['N1', 'Neuro 1', '08:00', '16:00', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'No', 'required', 'NEURO', 'Neuro'].join(','),
      ['WEEKEND_CALL', 'Weekend Call', '00:00', '23:59', 'No', 'No', 'No', 'No', 'No', 'Yes', 'Yes', 'allowAny', '', 'Call'].join(','),
      ['COIL', 'Coiling', '08:00', '16:00', 'No', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'named', 'INR', 'INR'].join(','),
      ['CLIN_MA1', 'Clinic - MA1', '08:00', '16:00', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'No', 'allowAny', '', 'Clinic'].join(','),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shift_catalog_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const groupedShifts = DEMO_SHIFT_TYPES.reduce((acc, shift) => {
    if (!acc[shift.category]) acc[shift.category] = []
    acc[shift.category].push(shift)
    return acc
  }, {} as Record<string, typeof DEMO_SHIFT_TYPES>)

  const getDaysString = (recurrence: any) => {
    const days = []
    if (recurrence.mon) days.push('M')
    if (recurrence.tue) days.push('T')
    if (recurrence.wed) days.push('W')
    if (recurrence.thu) days.push('Th')
    if (recurrence.fri) days.push('F')
    if (recurrence.sat) days.push('Sa')
    if (recurrence.sun) days.push('Su')
    return days.join('-')
  }

  const getEligibilityBadge = (eligibility: any) => {
    if (eligibility.type === 'required') {
      return <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-200">{eligibility.subspecialty}</Badge>
    }
    if (eligibility.type === 'named') {
      return <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-200">Named Only</Badge>
    }
    return <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200">Any</Badge>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 3 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Shift Catalog</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive catalog of shift types with time windows, recurrence patterns, and eligibility rules.
        </p>
        <Button
          variant="link"
          onClick={handleDownloadTemplate}
          className="text-[#007bff] hover:text-[#0069d9]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Shift Catalog CSV Template
        </Button>
      </div>

      <div className="space-y-6 max-w-7xl mx-auto">
        {Object.entries(groupedShifts).map(([category, shifts], categoryIndex) => (
          <Card key={category} className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{category}</CardTitle>
                  <CardDescription>{shifts.length} shift type{shifts.length > 1 ? 's' : ''}</CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                  {shifts.reduce((sum, s) => {
                    const days = [s.recurrence.mon, s.recurrence.tue, s.recurrence.wed, s.recurrence.thu, s.recurrence.fri, s.recurrence.sat, s.recurrence.sun].filter(Boolean).length
                    return sum + days
                  }, 0)} instances/week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {shifts.map((shift, index) => (
                  <motion.div
                    key={shift.code}
                    custom={categoryIndex * 10 + index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <div className="relative rounded-xl border border-white/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${categoryColors[category] || 'from-slate-400/20 via-slate-500/10 to-transparent'} pointer-events-none`} />
                      <div className="relative space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{shift.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{shift.code}</p>
                          </div>
                          {getEligibilityBadge(shift.eligibility)}
                        </div>
                        <p className="text-xs text-muted-foreground">{shift.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{shift.startTime}-{shift.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{getDaysString(shift.recurrence)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

