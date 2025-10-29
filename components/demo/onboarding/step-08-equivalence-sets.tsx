"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2, ArrowRightLeft, Plus } from "lucide-react"
import { EQUIVALENCE_SETS } from "@/lib/demo-data/onboarding-data"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.5 }
  })
}

const setColors = [
  'from-blue-400/30 via-blue-500/20 to-transparent',
  'from-purple-400/30 via-purple-500/20 to-transparent',
  'from-emerald-400/30 via-emerald-500/20 to-transparent',
  'from-amber-400/30 via-amber-500/20 to-transparent',
]

export function Step08EquivalenceSets() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 8 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Equivalence Sets</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Define groups of shift types that can substitute for each other during swaps. This flexibility makes trading shifts easier.
        </p>
      </div>

      <div className="grid gap-4 max-w-5xl mx-auto">
        {EQUIVALENCE_SETS.map((set, index) => (
          <motion.div
            key={set.code}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="relative overflow-hidden border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
              <div className={`absolute inset-0 bg-gradient-to-br ${setColors[index % setColors.length]} pointer-events-none`} />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      {set.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{set.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {set.code}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-wrap gap-2">
                  {set.members.map((member, idx) => (
                    <div key={member} className="flex items-center">
                      <Badge className="bg-white/90 text-slate-700 border-white/60 dark:bg-slate-900 dark:text-slate-200">
                        {member}
                      </Badge>
                      {idx < set.members.length - 1 && (
                        <ArrowRightLeft className="h-4 w-4 mx-2 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-white/70 dark:bg-slate-950/50 border border-white/60 dark:border-slate-800">
                  <p className="text-xs text-muted-foreground">
                    <strong>Swap Example:</strong> Dr. Smith has {set.members[0]} on Monday and wants to trade with Dr. Jones. 
                    Dr. Jones can offer any shift from this set ({set.members.join(', ')}) in return.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-3 py-6">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Equivalence Set
              </Button>
              <p className="text-xs text-muted-foreground">
                Define custom groups for your organization's specific swap policies
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-sky-700 dark:text-sky-400">Why Equivalence Sets Matter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <Badge className="bg-sky-500 text-white h-fit">1</Badge>
              <p><strong>Flexibility:</strong> Radiologists can swap between similar shifts without admin approval for each combination</p>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-sky-500 text-white h-fit">2</Badge>
              <p><strong>Fairness:</strong> System ensures swaps are equivalent in workload and desirability</p>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-sky-500 text-white h-fit">3</Badge>
              <p><strong>Efficiency:</strong> Reduces email threads and manual coordination</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

