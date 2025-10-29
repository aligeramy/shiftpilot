"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent, TrendingDown, BarChart3, Shield } from "lucide-react"
import { FTE_POLICY_BANDS } from "@/lib/demo-data/onboarding-data"

const fadeIn = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.1, duration: 0.5 }
  })
}

export function Step06FtePolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 6 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">FTE/PT Policy</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Automatic part-time day accounting mapped from FTE percentages with weekday balance guardrails.
        </p>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-blue-500" />
              FTE Band Mapping
            </CardTitle>
            <CardDescription>
              Each FTE range automatically determines monthly part-time days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {FTE_POLICY_BANDS.map((band, index) => (
                <motion.div
                  key={`${band.min}-${band.max}`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="flex items-center gap-4 rounded-xl border border-white/60 bg-white p-4 dark:border-white/10 dark:bg-slate-900/50">
                    <div className={`h-16 w-16 rounded-lg ${band.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-md tracking-tight font-bold text-white text-center">
                        {band.min === 100 ? '100' : `${band.min}-${band.max}`}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {band.min === 100 ? '100% FTE' : `${band.min}-${band.max}% FTE`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {band.ptDaysPerMonth === 0 
                          ? 'Full-time - no PT days' 
                          : `${band.ptDaysPerMonth} part-time days per month`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{band.ptDaysPerMonth}</p>
                      <p className="text-xs text-muted-foreground">PT days</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
                Weekday Balance Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">±1</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Maximum difference allowed between any two weekdays
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-medium mb-2">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    A radiologist with 8 PT days cannot take 4 Fridays and 0 Tuesdays. 
                    The system will require more balanced distribution like 2 Fridays, 2 Mondays, 2 Tuesdays, 2 Thursdays.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Weekly Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                  const values = [2, 1, 2, 2, 1] // Example balanced distribution
                  return (
                    <div key={day} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{day}</span>
                        <span className="text-muted-foreground">{values[index]} PT days</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(values[index] / 8) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#007bff] to-[#65c1f4] rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
                <p className="text-xs text-muted-foreground pt-2">
                  Example: 8 PT days balanced across weekdays (max difference = 1)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Shield className="h-5 w-5" />
              Automatic Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                <p className="font-semibold mb-1">Budget Tracking</p>
                <p className="text-xs text-muted-foreground">
                  PT day budget automatically calculated and displayed to users based on their FTE
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                <p className="font-semibold mb-1">Balance Validation</p>
                <p className="text-xs text-muted-foreground">
                  System prevents violations of weekday cap and suggests alternatives
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                <p className="font-semibold mb-1">Availability Sync</p>
                <p className="text-xs text-muted-foreground">
                  PT days automatically excluded from candidate pools during generation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

