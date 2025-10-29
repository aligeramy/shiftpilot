"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Users,
  FileSpreadsheet,
  Puzzle,
  Workflow,
  ShieldCheck,
  Sparkles,
  GaugeCircle,
  ArrowRight,
  CloudUpload,
  Download,
  Link2,
  Palette,
  Binary,
  CheckCircle2,
  LineChart,
  Wrench,
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.07,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
}

const setupMilestones = [
  {
    title: "Organization DNA",
    subtitle: "Name, timezone, week cadence, contract settings",
    icon: Building2,
    accent: "from-sky-400/30 via-sky-500/20 to-transparent",
  },
  {
    title: "Team & Roles",
    subtitle: "Roster import, subspecialties, FTE profiles",
    icon: Users,
    accent: "from-teal-400/30 via-emerald-500/20 to-transparent",
  },
  {
    title: "Shift Catalog",
    subtitle: "Patterns, eligibility, equivalence groups",
    icon: Puzzle,
    accent: "from-purple-400/30 via-fuchsia-500/20 to-transparent",
  },
  {
    title: "Constraint Canvas",
    subtitle: "Coverage caps, fairness rules, mammography guardrails",
    icon: ShieldCheck,
    accent: "from-amber-400/30 via-orange-500/20 to-transparent",
  },
  {
    title: "Experience Rules",
    subtitle: "Notifications, points, publish flows",
    icon: Workflow,
    accent: "from-rose-400/30 via-pink-500/20 to-transparent",
  },
]

const constraintBlocks = [
  {
    title: "Coverage Guardrails",
    description: "Hard caps by subspecialty with context-aware warnings.",
    chips: ["≤2 Body MRI", "≤2 Cardiac", "≤1 IR", "NS Tuesday rule"],
    gradient: "from-sky-400/30 via-blue-500/20 to-transparent",
  },
  {
    title: "Fairness Ledger",
    description: "Rolling points engine balancing vacation wins & undesirable shifts.",
    chips: ["P1 granted: +0", "P2 granted: -1", "Weekend call: +2"],
    gradient: "from-violet-400/30 via-purple-500/20 to-transparent",
  },
  {
    title: "Part-time Awareness",
    description: "Visual sliders align FTE bands with weekday balance caps.",
    chips: ["60% → 8 PT days", "No Friday stacking", "Auto ledger decay"],
    gradient: "from-amber-400/30 via-yellow-500/20 to-transparent",
  },
]

const pointsMatrix = [
  {
    label: "Swap Accepted",
    context: "Takes undesirable late block for teammate",
    delta: "+5",
    tone: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "Swap Offered",
    context: "Initiates compliant giveaway with full notice",
    delta: "+2",
    tone: "text-sky-500 bg-sky-500/10",
  },
  {
    label: "Vacation Win",
    context: "P1 granted in peak season",
    delta: "0",
    tone: "text-slate-500 bg-slate-500/10",
  },
  {
    label: "Late Decline",
    context: "Drops shift <24h without coverage",
    delta: "-6",
    tone: "text-rose-500 bg-rose-500/10",
  },
]

const automations = [
  {
    title: "CSV upload → Schema validation",
    detail: "Instant feedback, inline fixes, and smart defaults for subspecialty tags.",
  },
  {
    title: "Constraint studio → AI preview",
    detail: "See infeasibility risk, OR-Tools hints, and sample week coverage in real time.",
  },
  {
    title: "Publish → Calendars & Points",
    detail: "Google sync, ICS feeds, fairness ledger updates, and notifications in one pulse.",
  },
]

export default function DemoOrganizationPage() {
  const router = useRouter()

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Demo", href: "/demo/organization" },
        { label: "Org Onboarding" },
      ]}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
         
        </div>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/20 bg-white/10 p-10  backdrop-blur-3xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6 max-w-2xl">
              <Badge className="bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg">
                Guided First-Time Setup
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Launch an organization in under 15 minutes.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-200/80">
                Every control is choreographed—drag-and-drop constraints, instant feasibility checks,
                CSV onboarding with live previews, and a fairness engine that feels handcrafted.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  onClick={() => router.push('/demo/onboarding')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Onboarding Demo
                </Button>
                <Button variant="outline" className="backdrop-blur border-white/40">
                  <LineChart className="mr-2 h-4 w-4" />
                  View Constraint Analytics
                </Button>
              </div>
            </div>
            <Card className="w-full max-w-sm bg-white/70 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <GaugeCircle className="h-4 w-4 text-sky-500" />
                  Launch Checklist
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wide text-slate-400">
                  5 phases · 32 smart defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {setupMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.title}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="relative rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${milestone.accent}`}
                    />
                    <div className="relative flex items-start gap-3">
                      <div className="rounded-full border border-white/80 bg-white p-2 text-slate-500 shadow">
                        <milestone.icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {milestone.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {milestone.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 rounded-3xl border border-white/10 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="max-w-xl space-y-4">
              <Badge variant="outline" className="border-sky-200 text-sky-600 dark:border-sky-600/40 dark:text-sky-300">
                Constraint Studio
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                A visual canvas for the rules that make your group unique.
              </h2>
              <p className="text-slate-600 dark:text-slate-200/80">
                Layer guardrails, fairness objectives, and AI suggestions in a tactile board. Every change previews
                the next 8 weeks of coverage with confidence badges and OR-Tools insight.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/60">
                  <Wrench className="mr-2 h-4 w-4" />
                  Build Custom Rule
                </Button>
                <Button className="bg-sky-600 text-white hover:bg-sky-500">
                  <Palette className="mr-2 h-4 w-4" />
                  Save Blueprint
                </Button>
              </div>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {constraintBlocks.map((block, index) => (
                <motion.div
                  key={block.title}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className="relative rounded-3xl border border-white/40 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-slate-900/70"
                >
                  <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${block.gradient}`} />
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-slate-400" />
                      <p className="text-sm font-semibold tracking-tight text-slate-800 dark:text-white">
                        {block.title}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-200/80">
                      {block.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {block.chips.map(chip => (
                        <Badge
                          key={chip}
                          variant="outline"
                          className="border-white/60 bg-white/70 text-[11px] font-medium uppercase tracking-wide dark:border-white/20 dark:bg-slate-900/60"
                        >
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={3}
                className="relative rounded-3xl border border-dashed border-slate-200 bg-white/70 p-5 text-slate-500 shadow-inner dark:border-slate-700/70 dark:bg-transparent"
              >
                <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                  <Binary className="h-6 w-6" />
                  <p className="text-sm font-medium">Add another rule</p>
                  <p className="text-xs">Drag any field, connect to coverage metrics, preview instantly.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]"
        >
          <Card className="relative overflow-hidden border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileSpreadsheet className="h-5 w-5 text-slate-500" />
                Roster, policies, and shift catalog in one motion.
              </CardTitle>
              <CardDescription>
                Upload with confidence—AI cleans, validates, and auto-tags subspecialties before you hit save.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/60 bg-white p-4 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Roster</p>
                  <p className="mt-1 text-lg font-semibold">32 clinicians</p>
                  <p className="text-xs text-slate-500">CSV with live validation + FTE insights.</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white p-4 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Shift Types</p>
                  <p className="mt-1 text-lg font-semibold">24 patterns</p>
                  <p className="text-xs text-slate-500">Eligibility resolved instantly.</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white p-4 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Policies</p>
                  <p className="mt-1 text-lg font-semibold">11 toggles</p>
                  <p className="text-xs text-slate-500">Weekday caps, PT budgets, blackout windows.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
                <Button variant="outline" className="border-white/50">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample
                </Button>
                <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Review import rules
                </Button>
              </div>
              <Separator className="border-dashed border-slate-200 dark:border-slate-700" />
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <Badge variant="outline" className="border-emerald-200 text-emerald-600">
                  Duplicate detection
                </Badge>
                <Badge variant="outline" className="border-sky-200 text-sky-600">
                  Named eligibility lookup
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-600">
                  AI suggestions
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-sky-500" />
                Points & Incentives
              </CardTitle>
              <CardDescription>
                Align swaps, giveaways, and weekend coverage with transparent points.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Live balance preview</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-semibold">+18 pts</p>
                  <Badge variant="outline" className="border-white/60 text-white">
                    Fairness Score v2
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-white/80">
                  Weighted for weekend coverage, radiologist swaps, and late relief.
                </p>
              </div>
              <div className="space-y-3">
                {pointsMatrix.map(row => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-slate-900/50"
                  >
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-100">{row.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{row.context}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.tone}`}>
                      {row.delta}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">
                View fairness formulas
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 rounded-3xl border border-white/30 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <Badge variant="outline" className="border-emerald-200 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-300">
                Automation Spine
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Every action syncs with calendars, fairness, and audit logs—automatically.
              </h2>
              <p className="text-slate-600 dark:text-slate-200/80">
                From the first CSV to your first publish, the platform stays ahead: compliance alerts,
                OR-Tools dry runs, calendar diffs, and immutable audit trails ready for leadership.
              </p>
              <div className="flex gap-3">
                <Button className="bg-emerald-500 hover:bg-emerald-400">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Run Feasibility Preview
                </Button>
                <Button variant="outline" className="border-white/50">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Explore audit log
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid gap-4">
                {automations.map((automation, index) => (
                  <motion.div
                    key={automation.title}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/50"
                  >
                    <div className="rounded-full border border-white/70 bg-white p-2 text-slate-500 shadow">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                        {automation.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {automation.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.55)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-white/10 text-white/80">Final polish</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">
                Ready to publish? Every tenant config becomes a living spec.
              </h2>
              <p className="text-slate-300">
                Roll into production with deterministic seeds, instant rollbacks, and exec-ready reporting.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-slate-900 hover:bg-white/90">
                <ArrowRight className="mr-2 h-4 w-4" />
                Generate sample year
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Sparkles className="mr-2 h-4 w-4" />
                Share interactive tour
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </DashboardPage>
  )
}

