"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Check, X, Settings } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

const shiftTypes = [
  { code: 'WEEKEND_CALL', name: 'Weekend Call', eligible: true, reason: 'Traditionally sharable' },
  { code: 'NEURO_LATE_18_21', name: 'Neuro Late 18-21', eligible: false, reason: 'Requires sub-specialty' },
  { code: 'BODY_LATE_18_21', name: 'Body Late 18-21', eligible: false, reason: 'Requires sub-specialty' },
  { code: 'XR_GEN', name: 'General X-Ray', eligible: true, reason: 'Any radiologist eligible' },
  { code: 'CLINIC_MA1', name: 'Clinic - MA1', eligible: true, reason: 'Any radiologist eligible' },
  { code: 'COIL', name: 'Coiling', eligible: false, reason: 'Named eligibility only' },
]

export function Step09GiveawayPolicy() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 9 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Giveaway Policy</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Configure which shift types can be given away (offered to eligible pool) vs. swapped (targeted exchange).
        </p>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto">
        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-pink-500" />
              Shift Giveaway Eligibility
            </CardTitle>
            <CardDescription>
              Toggle which shift types can be offered to the general pool vs. requiring direct swaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shiftTypes.map((shift, index) => (
                <motion.div
                  key={shift.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    shift.eligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                      : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{shift.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{shift.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {shift.code}
                    </Badge>
                    {shift.eligible ? (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span className="text-xs font-medium">Giveaway OK</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-500">
                        <X className="h-4 w-4" />
                        <span className="text-xs font-medium">Swap Only</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-sm font-medium">Require owner approval</span>
                  <Badge className="bg-emerald-500 text-white">Enabled</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Original shift owner must approve the giveaway before it's offered to the pool
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-sm font-medium">Sequential offers</span>
                  <Badge className="bg-emerald-500 text-white">Enabled</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Offer to eligible pool one-by-one; first acceptance wins
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Pool Filtering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-sm font-medium">Respect eligibility rules</span>
                  <Badge className="bg-emerald-500 text-white">Enabled</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only offer to radiologists who meet subspecialty/eligibility requirements
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-sm font-medium">Exclude away/vacation</span>
                  <Badge className="bg-emerald-500 text-white">Enabled</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Skip radiologists marked as away or on vacation during that period
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
              <Settings className="h-5 w-5" />
              Giveaway vs. Swap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">Giveaway (Unilateral)</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>Owner offers shift to eligible pool</li>
                  <li>No exchange required</li>
                  <li>First eligible acceptance wins</li>
                  <li>Good for weekend call, general coverage</li>
                  <li>Fairness points may apply to acceptor</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-blue-600 dark:text-blue-400">Swap (Bilateral)</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>Owner targets specific radiologists</li>
                  <li>Exchange of shifts required</li>
                  <li>Must be same type or in equivalence set</li>
                  <li>Good for subspecialty-specific shifts</li>
                  <li>Both parties must agree</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

