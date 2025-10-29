"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, Clock } from "lucide-react"
import { DOLLAR_VALUES } from "@/lib/demo-data/onboarding-data"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.5 }
  })
}

export function Step10DollarValues() {
  const shiftValues = Object.entries(DOLLAR_VALUES.byShiftType)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 10 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Dollar Values & Premiums</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Configure compensation values per shift type and premiums for holidays, weekends, and night coverage.
        </p>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Shift Type Values
            </CardTitle>
            <CardDescription>
              Base compensation per shift type (default: ${DOLLAR_VALUES.default})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {shiftValues.map(([shiftType, value], index) => (
                <motion.div
                  key={shiftType}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/60 bg-white/70 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{shiftType}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {shiftType.includes('WEEKEND') ? 'Weekend' : 
                       shiftType.includes('LATE') ? 'Late Block' : 'Procedure'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-amber-500" />
                Holiday Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                +{Math.round((DOLLAR_VALUES.premiums.holiday - 1) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Applied to statutory holidays (Ontario)
              </p>
            </CardContent>
          </Card>

          <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-sky-500" />
                Weekend Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-5xl font-bold text-sky-600 dark:text-sky-400">
                +{Math.round((DOLLAR_VALUES.premiums.weekend - 1) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Applied to Saturday and Sunday shifts
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-indigo-500" />
                Night Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                +{Math.round((DOLLAR_VALUES.premiums.night - 1) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Applied to shifts starting after 6 PM
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
              Example Calculations
            </CardTitle>
            <CardDescription>Real-world scenarios with premiums applied</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900">
                <p className="font-semibold mb-2">Weekend Call on Christmas</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base (WEEKEND_CALL):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend premium (25%):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">+$125</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Holiday premium (50%):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">+$250</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-200 dark:border-emerald-900">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$875</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900">
                <p className="font-semibold mb-2">Neuro Late 18-21 (Weekday)</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base (NEURO_LATE_18_21):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">$150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Night premium (35%):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">+$52.50</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-200 dark:border-emerald-900">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$202.50</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#c9e7f6] bg-gradient-to-br from-[#c9e7f6]/30 to-white dark:from-[#007bff]/10 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-400">Reports & Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Monthly Totals</p>
                <p className="text-xs text-muted-foreground">
                  Per-user shift counts and dollar totals for payroll
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">YTD Summaries</p>
                <p className="text-xs text-muted-foreground">
                  Year-to-date accumulation with adjustments
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Group Roll-ups</p>
                <p className="text-xs text-muted-foreground">
                  Organization-wide financial summaries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

