"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Sparkles, AlertCircle, Check, TrendingUp } from "lucide-react"
import { DEMO_CONSTRAINTS } from "@/lib/demo-data/onboarding-data"
import { ConstraintAIAgent } from "./constraint-ai-agent"

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: index * 0.08, duration: 0.4 }
  })
}

const typeColors: Record<string, string> = {
  coverage: 'from-sky-400/30 via-sky-500/20',
  fairness: 'from-purple-400/30 via-purple-500/20',
  eligibility: 'from-emerald-400/30 via-emerald-500/20',
  custom: 'from-amber-400/30 via-amber-500/20',
}

export function Step07ConstraintStudio() {
  const [constraints, setConstraints] = useState(DEMO_CONSTRAINTS)
  const [showAIAgent, setShowAIAgent] = useState(false)

  const handleConstraintAdded = (newConstraint: any) => {
    setConstraints(prev => [...prev, { ...newConstraint, active: true }])
  }

  const groupedConstraints = constraints.reduce((acc, constraint) => {
    if (!acc[constraint.category]) acc[constraint.category] = []
    acc[constraint.category].push(constraint)
    return acc
  }, {} as Record<string, typeof DEMO_CONSTRAINTS>)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] via-[#65c1f4] to-[#c9e7f6] text-white">
          Step 7 of 17 - The Showcase
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Constraint Studio</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A visual canvas for the rules that make your group unique. Layer guardrails, fairness objectives, and OR-Tools insights.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-sky-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{constraints.filter(c => c.type === 'coverage').length}</p>
              <p className="text-sm text-muted-foreground">Coverage Rules</p>
            </CardContent>
          </Card>
          <Card className="border-[#c9e7f6] bg-gradient-to-br from-[#c9e7f6]/30 to-white dark:from-[#007bff]/10 dark:to-slate-900">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 text-[#007bff] mx-auto mb-2" />
              <p className="text-2xl font-bold">{constraints.filter(c => c.type === 'fairness').length}</p>
              <p className="text-sm text-muted-foreground">Fairness Rules</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
            <CardContent className="pt-6 text-center">
              <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm text-muted-foreground">Feasibility</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Agent */}
        {!showAIAgent ? (
          <Card className="border-[#007bff]/30 bg-gradient-to-br from-[#c9e7f6]/20 to-white dark:from-[#007bff]/10 dark:to-slate-900">
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-6">
                <div className="rounded-full border-2 border-[#007bff] bg-white dark:bg-slate-900 p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#007bff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI-Powered Constraint Builder</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Describe your scheduling rules in plain English. Our AI will create the constraints for you.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAIAgent(true)}
                  className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] hover:from-[#0069d9] hover:to-[#5ab8f0]"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try AI Rule Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ConstraintAIAgent onConstraintAdded={handleConstraintAdded} />
        )}

        {Object.entries(groupedConstraints).map(([category, constraints], categoryIndex) => (
          <Card key={category} className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{category}</CardTitle>
                  <CardDescription>{constraints.length} active rule{constraints.length > 1 ? 's' : ''}</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {constraints.map((constraint, index) => (
                  <motion.div
                    key={constraint.id}
                    custom={categoryIndex * 10 + index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <div className="relative rounded-2xl border border-white/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/50 group hover:shadow-md transition-shadow">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${typeColors[constraint.type] || 'from-slate-400/20 via-slate-500/10'} to-transparent pointer-events-none`} />
                      <div className="relative space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{constraint.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{constraint.description}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`flex-shrink-0 ${constraint.active ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-slate-500/10 text-slate-600 border-slate-200'}`}
                          >
                            {constraint.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {constraint.formula && (
                          <div className="rounded-lg bg-slate-100 dark:bg-slate-950/50 p-2 mt-2">
                            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                              {constraint.formula}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <div className="rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Add Custom Constraint</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Drag any field, connect to coverage metrics, and preview feasibility instantly with OR-Tools insights.
                </p>
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Coverage Rule
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Fairness Rule
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Custom Logic
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-900 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-500/5 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
                Real-Time Feasibility Preview
              </CardTitle>
              <CardDescription>OR-Tools CP-SAT analysis of your constraint configuration</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <p className="font-semibold text-sm">Hard Constraints</p>
                  </div>
                  <p className="text-xs text-muted-foreground">All coverage and eligibility rules are satisfiable</p>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <p className="font-semibold text-sm">Soft Objectives</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Fairness variance projected at ±2.1 points YTD</p>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <p className="font-semibold text-sm">Optimization Hint</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Consider adding equivalence sets for better swap flexibility</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Configuration Valid</p>
                    <p className="text-sm text-emerald-50">
                      Your constraint set is feasible. Sample week generated in 0.8s with 100% coverage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

