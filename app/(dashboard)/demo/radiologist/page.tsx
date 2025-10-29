"use client"

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
import {
  CalendarDays,
  ArrowRight,
  Repeat,
  Gift,
  Sparkle,
  Share2,
  ShieldCheck,
  BellRing,
  Sun,
  CloudFog,
  PlaneTakeoff,
  Clock4,
  Trophy,
  ListTodo,
  TimerReset,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  shown: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
}

const weekSchedule = [
  { day: "Mon", date: "Mar 03", shift: "Neuro 1", time: "08:00 – 16:00", tone: "from-sky-500/20 to-sky-500/0" },
  { day: "Tue", date: "Mar 04", shift: "Neuro Late", time: "16:00 – 21:00", tone: "from-violet-500/20 to-violet-500/0" },
  { day: "Wed", date: "Mar 05", shift: "Admin Day", time: "PT – 60%", tone: "from-amber-500/20 to-amber-500/0" },
  { day: "Thu", date: "Mar 06", shift: "Vacation", time: "Key West", tone: "from-emerald-500/20 to-emerald-500/0" },
  { day: "Fri", date: "Mar 07", shift: "Vacation", time: "Key West", tone: "from-emerald-500/20 to-emerald-500/0" },
  { day: "Sat", date: "Mar 08", shift: "Weekend Call", time: "On deck", tone: "from-rose-500/20 to-rose-500/0" },
  { day: "Sun", date: "Mar 09", shift: "Weekend Call", time: "On deck", tone: "from-rose-500/20 to-rose-500/0" },
]

const swapRequests = [
  {
    title: "Late block swap",
    detail: "Mar 12 · 18:00 – 21:00",
    status: "Matching",
    badgeTone: "bg-amber-100 text-amber-700",
    offer: "Offering Vacation points +3",
  },
  {
    title: "Weekend call giveaway",
    detail: "Mar 23",
    status: "Accepted",
    badgeTone: "bg-emerald-100 text-emerald-700",
    offer: "Transfer 4 pts",
  },
]

const vacationBlocks = [
  { season: "Spring Break", dates: "Mar 04 – Mar 10", status: "Approved", tone: "bg-emerald-500/10 text-emerald-600" },
  { season: "Summer", dates: "Jul 08 – Jul 14", status: "Pending", tone: "bg-sky-500/10 text-sky-600" },
  { season: "Fall", dates: "Oct 21 – Oct 27", status: "Draft", tone: "bg-slate-500/10 text-slate-500" },
]

const pointsGlance = [
  { label: "Current", value: "+18", sub: "Fairness ledger", tone: "text-emerald-500" },
  { label: "30-day delta", value: "+6", sub: "Up 50%", tone: "text-sky-500" },
  { label: "Season goal", value: "+24", sub: "To unlock extra PTO", tone: "text-amber-500" },
]

const quickActions = [
  { label: "Request Swap", icon: Repeat, tone: "bg-slate-900 text-white" },
  { label: "Offer Giveaway", icon: Gift, tone: "bg-slate-100 text-slate-800" },
  { label: "Message Admin", icon: Share2, tone: "bg-slate-100 text-slate-800" },
]

const upcoming = [
  { icon: Sun, title: "Sunrise Clinic", detail: "Mar 14 · MA1", tint: "bg-sky-500/10 text-sky-500" },
  { icon: CloudFog, title: "Neuro late block", detail: "Mar 18 · 16:00 – 21:00", tint: "bg-violet-500/10 text-violet-500" },
  { icon: PlaneTakeoff, title: "Summer PTO", detail: "Jul 08 – Jul 14", tint: "bg-emerald-500/10 text-emerald-500" },
]

export default function DemoRadiologistPage() {
  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Demo", href: "/demo/organization" },
        { label: "Radiologist Experience" },
      ]}
    >
      <div className="relative overflow-hidden">
        

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-3xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6 max-w-md">
              <Badge className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg">
                Radiologist Workspace Preview
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Schedules, swaps, and fairness—beautifully unified.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-200/80">
                Clinicians land on a single page that explains their week, their upcoming vacations, their fairness
                balance, and the exact steps to request a swap in under 30 seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Explore my schedule
                </Button>
                <Button variant="outline" className="border-white/50">
                  <BellRing className="mr-2 h-4 w-4" />
                  Notification preferences
                </Button>
              </div>
            </div>
            <Card className="w-full border-white/50 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700">
                  Week at a glance
                </CardTitle>
                <CardDescription>Mar 03 – Mar 09</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-7 gap-2 text-center text-xs">
                {weekSchedule.map(day => (
                  <div
                    key={day.day}
                    className="rounded-xl border border-white/50 bg-white p-2 shadow-inner dark:border-white/10 dark:bg-slate-900/70"
                  >
                    <div className="text-[11px] font-semibold text-slate-500">{day.day}</div>
                    <div className="text-[10px] text-slate-400">{day.date}</div>
                    <div className={`mt-2 rounded-lg bg-gradient-to-br ${day.tone} px-2 py-3 text-[11px] font-medium text-slate-700 dark:text-white/80`}>
                      <p>{day.shift}</p>
                      <p className="text-[10px] text-slate-500 dark:text-white/60">{day.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]"
        >
          <Card className="border-white/30 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Repeat className="h-5 w-5 text-slate-500" />
                Swap & Giveaway Center
              </CardTitle>
              <CardDescription>
                Instant eligibility, fairness awareness, and suggested partners—no back-and-forth email chains.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {quickActions.map(action => (
                  <Button
                    key={action.label}
                    className={`${action.tone} rounded-full px-5 py-2 text-sm font-semibold shadow`}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {swapRequests.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    initial="hidden"
                    animate="shown"
                    custom={index}
                    className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.badgeTone}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{item.offer}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="h-4 w-4" />
                      Constraint compliant • 3 matching peers
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                View swap history
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/30 bg-white/70 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkle className="h-5 w-5 text-amber-500" />
                Vacation Ledger
              </CardTitle>
              <CardDescription>
                See approvals, flex windows, and fairness impact in one glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {vacationBlocks.map(block => (
                <div
                  key={block.season}
                  className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-inner dark:border-white/10 dark:bg-slate-900/60"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{block.season}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{block.dates}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${block.tone}`}>
                    {block.status}
                  </span>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">
                Submit new vacation request
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]"
        >
          <Card className="border-white/30 bg-white/70 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-emerald-500" />
                Fairness & Points
              </CardTitle>
              <CardDescription>
                Transparent scoring keeps rotations equitable and rewards teamwork.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {pointsGlance.map(tile => (
                  <div
                    key={tile.label}
                    className="rounded-2xl border border-white/60 bg-white/80 p-4 text-center shadow-inner dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{tile.label}</p>
                    <p className={`mt-2 text-xl font-semibold ${tile.tone}`}>{tile.value}</p>
                    <p className="text-[11px] text-slate-400">{tile.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Ledger Insight</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-3xl font-semibold">Balanced</p>
                  <Badge variant="outline" className="border-white/50 text-white">
                    92nd percentile
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-white/80">
                  You’re pacing ahead—one more weekend relief earns a bonus flex day.
                </p>
              </div>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                View fairness history
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/30 bg-white/70 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ListTodo className="h-5 w-5 text-slate-500" />
                Upcoming Highlights
              </CardTitle>
              <CardDescription>
                High-signal rem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map(item => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-inner dark:border-white/10 dark:bg-slate-900/60"
                >
                  <div className={`rounded-full p-2 ${item.tint}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                Sync with calendar
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 rounded-3xl border border-white/20 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.55)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-white/10 text-white/80">Concierge actions</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">
                Uniform experience. Zero guesswork.
              </h2>
              <p className="text-white/70">
                Daily reminders arrive with swap prompts, fairness snapshots, and a single approve button for chiefs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-slate-900 hover:bg-white/90">
                <TimerReset className="mr-2 h-4 w-4" />
                Preview daily digest
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <ArrowRight className="mr-2 h-4 w-4" />
                Try radiologist mode
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </DashboardPage>
  )
}

