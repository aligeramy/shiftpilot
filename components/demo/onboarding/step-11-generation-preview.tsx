"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Zap, CheckCircle2, BarChart3 } from "lucide-react"
import { GENERATION_STEPS } from "@/lib/demo-data/onboarding-data"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export function Step11GenerationPreview() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentStep < GENERATION_STEPS.length) {
      const step = GENERATION_STEPS[currentStep]
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setProgress(((currentStep + 1) / GENERATION_STEPS.length) * 100)
      }, step.duration)
      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
    }
  }, [currentStep, isComplete])

  const totalTime = GENERATION_STEPS.reduce((sum, step) => sum + step.duration, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] via-[#65c1f4] to-[#c9e7f6] text-white">
          Step 11 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Schedule Generation</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch the CP-SAT solver in action as it generates a fair, constraint-aware schedule in under 2 minutes.
        </p>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto">
        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Generation Engine
                </CardTitle>
                <CardDescription>CP-SAT solver processing 720 shift instances</CardDescription>
              </div>
              {isComplete && (
                <Badge className="bg-emerald-500 text-white">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-muted-foreground text-right">
                Estimated: {(totalTime / 1000).toFixed(1)}s
              </p>
            </div>

            <div className="space-y-3">
              {GENERATION_STEPS.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <AnimatePresence key={step.id} mode="wait">
                    {(isActive || isCompleted) && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0.5 }}
                        className={`p-4 rounded-lg border ${
                          isActive 
                            ? 'border-purple-300 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/30' 
                            : 'border-white/60 bg-white/50 dark:border-white/10 dark:bg-slate-900/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex-shrink-0 ${
                            isCompleted ? 'text-emerald-500' : 
                            isActive ? 'text-purple-500' : 'text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Zap className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{step.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          </div>
                          {isActive && (
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {isComplete && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                  Generation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-900/50">
                    <p className="text-muted-foreground mb-1">Total Instances</p>
                    <p className="text-2xl font-bold">720</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-900/50">
                    <p className="text-muted-foreground mb-1">Coverage</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-900/50">
                    <p className="text-muted-foreground mb-1">Fairness Variance</p>
                    <p className="text-2xl font-bold">±1.8</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-900/50">
                    <p className="text-muted-foreground mb-1">P1 Vacations</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
                  <p className="text-sm text-emerald-900 dark:text-emerald-100">
                    <strong>Success:</strong> All hard constraints satisfied. Draft ready for review and override.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

