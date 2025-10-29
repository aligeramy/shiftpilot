"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, SkipForward, Building2, Users, Calendar, Shield, DollarSign, CheckCircle2 } from "lucide-react"
import { Step01Organization } from "@/components/demo/onboarding/step-01-organization"
import { Step02Subspecialties } from "@/components/demo/onboarding/step-02-subspecialties"
import { Step03ShiftCatalog } from "@/components/demo/onboarding/step-03-shift-catalog"
import { Step04Roster } from "@/components/demo/onboarding/step-04-roster"
import { Step05VacationPolicy } from "@/components/demo/onboarding/step-05-vacation-policy"
import { Step06FtePolicy } from "@/components/demo/onboarding/step-06-fte-policy"
import { Step07ConstraintStudio } from "@/components/demo/onboarding/step-07-constraint-studio"
import { Step08EquivalenceSets } from "@/components/demo/onboarding/step-08-equivalence-sets"
import { Step09GiveawayPolicy } from "@/components/demo/onboarding/step-09-giveaway-policy"
import { Step10DollarValues } from "@/components/demo/onboarding/step-10-dollar-values"
import { Step11GenerationPreview } from "@/components/demo/onboarding/step-11-generation-preview"
import { 
  Step12ReviewOverride, 
  Step13SwapsGiveaways, 
  Step14CalendarIntegration, 
  Step15ReportsAnalytics,
  Step16AuditCompliance,
  Step17LaunchReadiness 
} from "@/components/demo/onboarding/step-12-17-remaining"

const TOTAL_STEPS = 17

const stepComponents = [
  Step01Organization,
  Step02Subspecialties,
  Step03ShiftCatalog,
  Step04Roster,
  Step05VacationPolicy,
  Step06FtePolicy,
  Step07ConstraintStudio,
  Step08EquivalenceSets,
  Step09GiveawayPolicy,
  Step10DollarValues,
  Step11GenerationPreview,
  Step12ReviewOverride,
  Step13SwapsGiveaways,
  Step14CalendarIntegration,
  Step15ReportsAnalytics,
  Step16AuditCompliance,
  Step17LaunchReadiness,
]

const stepTitles = [
  "Organization DNA",
  "Subspecialties",
  "Shift Catalog",
  "Roster Import",
  "Vacation Policy",
  "FTE/PT Policy",
  "Constraint Studio",
  "Equivalence Sets",
  "Giveaway Policy",
  "Dollar Values",
  "Generation Preview",
  "Review & Override",
  "Swaps & Giveaways",
  "Calendar Integration",
  "Reports & Analytics",
  "Audit & Compliance",
  "Launch Readiness",
]

const stepSections = [
  { name: "Setup", steps: [0, 1, 2, 3] },
  { name: "Policies", steps: [4, 5] },
  { name: "Constraints", steps: [6] },
  { name: "Workflows", steps: [7, 8, 9] },
  { name: "Generation", steps: [10, 11] },
  { name: "Post-Launch", steps: [12, 13, 14, 15] },
  { name: "Launch", steps: [16] },
]

// Dynamic stats for each step
const stepStats = [
  // Step 1: Organization
  [
    { label: "Timezone", value: "EST/EDT", icon: Building2 },
    { label: "Week Start", value: "Monday", icon: Calendar },
  ],
  // Step 2: Subspecialties
  [
    { label: "Subspecialties", value: "6", icon: Users },
    { label: "Radiologists", value: "32", icon: Users },
  ],
  // Step 3: Shift Catalog
  [
    { label: "Shift Types", value: "24", icon: Calendar },
    { label: "Weekly Instances", value: "~240", icon: Calendar },
    { label: "Categories", value: "10", icon: Shield },
  ],
  // Step 4: Roster
  [
    { label: "Total Staff", value: "32", icon: Users },
    { label: "Fellows", value: "3", icon: Users },
    { label: "Avg FTE", value: "92%", icon: CheckCircle2 },
  ],
  // Step 5: Vacation Policy
  [
    { label: "Weeks/Month", value: "1", icon: Calendar },
    { label: "Ranked Options", value: "3", icon: Shield },
    { label: "Max Consecutive", value: "2", icon: Calendar },
  ],
  // Step 6: FTE Policy
  [
    { label: "FTE Bands", value: "5", icon: Shield },
    { label: "PT Radiologists", value: "19", icon: Users },
    { label: "Balance Cap", value: "±1", icon: CheckCircle2 },
  ],
  // Step 7: Constraint Studio
  [], // Will be populated dynamically
  // Step 8: Equivalence Sets
  [
    { label: "Swap Sets", value: "4", icon: Shield },
    { label: "Shift Groups", value: "18", icon: Calendar },
  ],
  // Step 9: Giveaway Policy
  [
    { label: "Eligible Types", value: "2", icon: CheckCircle2 },
    { label: "Swap Only", value: "4", icon: Shield },
  ],
  // Step 10: Dollar Values
  [
    { label: "Paid Shifts", value: "5", icon: DollarSign },
    { label: "Holiday Premium", value: "+50%", icon: DollarSign },
    { label: "Weekend Premium", value: "+25%", icon: DollarSign },
  ],
  // Step 11: Generation
  [
    { label: "Instances", value: "720", icon: Calendar },
    { label: "Coverage", value: "100%", icon: CheckCircle2 },
    { label: "P1 Vacations", value: "87%", icon: CheckCircle2 },
  ],
  // Step 12: Review
  [
    { label: "Draft Ready", value: "Yes", icon: CheckCircle2 },
    { label: "Conflicts", value: "0", icon: CheckCircle2 },
  ],
  // Step 13: Swaps
  [
    { label: "Swap Types", value: "2", icon: Shield },
    { label: "Sequential", value: "Yes", icon: CheckCircle2 },
  ],
  // Step 14: Calendar
  [
    { label: "Google Sync", value: "Yes", icon: CheckCircle2 },
    { label: "ICS Feeds", value: "Yes", icon: CheckCircle2 },
  ],
  // Step 15: Reports
  [
    { label: "Monthly", value: "Yes", icon: CheckCircle2 },
    { label: "YTD", value: "Yes", icon: CheckCircle2 },
    { label: "Exports", value: "CSV", icon: DollarSign },
  ],
  // Step 16: Audit
  [
    { label: "Audit Trail", value: "Yes", icon: CheckCircle2 },
    { label: "Immutable", value: "Yes", icon: Shield },
  ],
  // Step 17: Launch
  [
    { label: "Config Complete", value: "100%", icon: CheckCircle2 },
    { label: "Features", value: "17", icon: Shield },
    { label: "Ready", value: "Yes", icon: CheckCircle2 },
  ],
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

export default function OnboardingDemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [configData, setConfigData] = useState({
    subspecialties: 6,
    radiologists: 32,
    shiftTypes: 24,
    constraints: 10,
    equivalenceSets: 4,
  })

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    setDirection(1)
    setCurrentStep(TOTAL_STEPS - 1)
  }

  const getCurrentSection = () => {
    return stepSections.find(section => section.steps.includes(currentStep))?.name || ""
  }

  const StepComponent = stepComponents[currentStep]
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100

  // Get dynamic stats for current step
  const getCurrentStats = () => {
    const baseStats = stepStats[currentStep] || []
    
    // For constraint studio, use dynamic config data
    if (currentStep === 6) {
      return [
        { label: "Total Rules", value: configData.constraints.toString(), icon: Shield },
        { label: "Active", value: configData.constraints.toString(), icon: CheckCircle2 },
        { label: "Feasibility", value: "100%", icon: CheckCircle2 },
      ]
    }
    
    return baseStats
  }

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Demo", href: "/demo/organization" },
        { label: "Onboarding Demo" },
      ]}
    >
      <div className="relative flex flex-col h-full">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 opacity-50" />

        {/* Progress bar with dynamic stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 shadow-sm rounded-t-xl"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{getCurrentSection()}</p>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {TOTAL_STEPS}: {stepTitles[currentStep]}
                </p>
              </div>

              {/* Dynamic Stats */}
              <div className="flex items-center gap-4 mx-8">
                <AnimatePresence mode="wait">
                  {getCurrentStats().map((stat, index) => (
                    <motion.div
                      key={`${currentStep}-${stat.label}`}
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-[#c9e7f6]/40 dark:border-[#007bff]/40"
                    >
                      <stat.icon className="h-4 w-4 text-[#007bff] flex-shrink-0" />
                      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                        <p className="text-xs text-muted-foreground">{stat.label}:</p>
                        <p className="text-sm font-bold">{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 relative min-h-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="min-h-full flex items-center justify-center"
            >
              <div className="w-full">
                <StepComponent />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-t border-white/20 shadow-lg rounded-b-xl"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="min-w-32"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {stepSections.map((section, sectionIndex) => (
                  <div key={section.name} className="flex items-center gap-1">
                    {section.steps.map((stepIndex) => (
                      <button
                        key={stepIndex}
                        onClick={() => {
                          setDirection(stepIndex > currentStep ? 1 : -1)
                          setCurrentStep(stepIndex)
                        }}
                        className={`h-2 rounded-full transition-all ${
                          stepIndex === currentStep
                            ? 'w-8 bg-gradient-to-r from-[#007bff] to-[#65c1f4]'
                            : stepIndex < currentStep
                            ? 'w-2 bg-emerald-500'
                            : 'w-2 bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={`${section.name}: ${stepTitles[stepIndex]}`}
                      />
                    ))}
                    {sectionIndex < stepSections.length - 1 && (
                      <div className="w-4 h-0.5 bg-slate-300 dark:bg-slate-700 mx-1" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStep < TOTAL_STEPS - 1 && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleSkip}
                  >
                    <SkipForward className="mr-2 h-4 w-4" />
                    Skip to End
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={currentStep === TOTAL_STEPS - 1}
                  className={`min-w-32 ${
                    currentStep === TOTAL_STEPS - 1
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-gradient-to-r from-[#007bff] to-[#65c1f4] hover:from-[#0069d9] hover:to-[#5ab8f0]'
                  }`}
                >
                  {currentStep === TOTAL_STEPS - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardPage>
  )
}

