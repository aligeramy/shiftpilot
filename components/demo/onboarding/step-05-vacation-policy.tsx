"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, TrendingUp, AlertCircle } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.5 }
  })
}

const fairnessPoints = [
  { choice: '1st', points: '+0', description: 'First choice granted - no penalty', color: 'from-emerald-400/30 via-emerald-500/20' },
  { choice: '2nd', points: '+1', description: 'Second choice granted - minor penalty', color: 'from-sky-400/30 via-sky-500/20' },
  { choice: '3rd', points: '+2', description: 'Third choice granted - moderate penalty', color: 'from-amber-400/30 via-amber-500/20' },
  { choice: 'None', points: '+3', description: 'No choice granted - maximum penalty', color: 'from-rose-400/30 via-rose-500/20' },
]

export function Step05VacationPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 5 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Vacation Policy</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Configure how vacation preferences are collected and allocated with transparent fairness scoring.
        </p>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Weeks per Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-5xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">
                    Each radiologist can request one vacation week per calendar month
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-purple-500" />
                  Ranked Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-5xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">
                    Submit 1st, 2nd, and 3rd choice weeks to maximize flexibility
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Max Consecutive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-5xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum consecutive two-week vacation runs per year (Chief override available)
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Fairness Ledger Formula
            </CardTitle>
            <CardDescription>
              Transparent point system balancing vacation wins across the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fairnessPoints.map((item, index) => (
                <motion.div
                  key={item.choice}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="relative rounded-2xl border border-white/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/50 h-full">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} to-transparent pointer-events-none`} />
                    <div className="relative space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">{item.choice} Choice</span>
                        <span className={`text-2xl font-bold ${
                          item.choice === '1st' ? 'text-emerald-600' :
                          item.choice === '2nd' ? 'text-sky-600' :
                          item.choice === '3rd' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {item.points}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    How Fairness Works
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    When multiple radiologists request the same week, the system awards it to the person with the <strong>lowest fairness score</strong>. 
                    Each month, everyone's score decays by 1 point (minimum 0) to prevent permanent disadvantage. 
                    This ensures vacation equity across the entire year.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#c9e7f6] bg-gradient-to-br from-[#c9e7f6]/30 to-white dark:from-[#007bff]/10 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-400">Example Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white mt-0.5">Month 1</Badge>
                <p>Dr. Johnson (score: 2) and Dr. Smith (score: 5) both request July 10-16 as their 1st choice. Dr. Johnson wins (lower score). Dr. Smith gets their 2nd choice and receives +1 point.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white mt-0.5">Month 2</Badge>
                <p>Both request Aug 7-13. Dr. Johnson's score decayed to 1, Dr. Smith's is now 6. Dr. Johnson wins again. The system flags this pattern for Chief review.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white mt-0.5">Result</Badge>
                <p>By December, score variance typically converges to ±1 points across all radiologists, ensuring long-term fairness.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

