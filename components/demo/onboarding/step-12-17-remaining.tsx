"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, Edit3, ArrowRightLeft, CloudUpload, BarChart3, 
  FileText, CheckCircle2, Rocket, Download, Users, Send 
} from "lucide-react"
import { InteractiveScheduleBoard } from "./interactive-schedule-board"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function Step12ReviewOverride() {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">Step 12 of 17</Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Review & Override</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Human-in-the-loop: review draft assignments, drag-and-drop to override, and validate changes before publishing.
        </p>
      </div>
      <div className="grid gap-6 max-w-7xl mx-auto">
        <InteractiveScheduleBoard />
        
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Edit3 className="h-8 w-8 text-[#007bff] mx-auto" />
                <p className="font-semibold text-sm">Manual Override</p>
                <p className="text-xs text-muted-foreground">Change any assignment with eligibility validation</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <ArrowRightLeft className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="font-semibold text-sm">Smart Swapping</p>
                <p className="text-xs text-muted-foreground">Click-to-swap with automatic validation</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto" />
                <p className="font-semibold text-sm">Real-time Validation</p>
                <p className="text-xs text-muted-foreground">Instant feedback on constraint compliance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export function Step13SwapsGiveaways() {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">Step 13 of 17</Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Swaps & Giveaways</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Structured workflows for shift exchanges with sequential offers, away windows, and complete audit trails.
        </p>
      </div>
      <div className="grid gap-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRightLeft className="h-5 w-5 text-[#007bff]" />
                  Swap Workflow
                </CardTitle>
                <Button variant="outline" size="sm">
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-[#007bff] text-white">1</Badge>
                <p>Requester selects shift and targets specific radiologists</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[#007bff] text-white">2</Badge>
                <p>System validates equivalence and eligibility</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[#007bff] text-white">3</Badge>
                <p>Sequential offers sent one-by-one</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[#007bff] text-white">4</Badge>
                <p>First acceptance wins, others auto-close</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRightLeft className="h-5 w-5 text-emerald-500 rotate-90" />
                  Giveaway Workflow
                </CardTitle>
                <Button variant="outline" size="sm">
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-emerald-500 text-white">1</Badge>
                <p>Owner offers eligible shift to pool</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500 text-white">2</Badge>
                <p>System filters by eligibility and away dates</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500 text-white">3</Badge>
                <p>Sequential offers to eligible candidates</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500 text-white">4</Badge>
                <p>Fairness points awarded to acceptor</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export function Step14CalendarIntegration() {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">Step 14 of 17</Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Calendar Integration</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          One-way Google Calendar sync and ICS feeds ensure schedules are always accessible.
        </p>
      </div>
      <div className="grid gap-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5 text-[#007bff]" />
                Google Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">One-way sync pushes events to user calendars with OAuth consent.</p>
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                <li>Create/update/delete events on publish</li>
                <li>Event IDs tracked for delta updates</li>
                <li>No duplicate events on republish</li>
                <li>Timezone and DST handled correctly</li>
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <CloudUpload className="mr-2 h-4 w-4" />
                Connect Google Calendar
              </Button>
            </CardContent>
          </Card>
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-500" />
                ICS Feeds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">Read-only ICS feeds for master and personal calendars.</p>
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                <li>RFC-5545 compliant format</li>
                <li>Works with all major calendar clients</li>
                <li>Immediate updates on republish</li>
                <li>Optional holiday markers</li>
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Download className="mr-2 h-4 w-4" />
                Generate ICS Feed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export function Step15ReportsAnalytics() {
  const [selectedReports, setSelectedReports] = useState<string[]>(['Monthly Summaries'])

  const reports = [
    { 
      id: 'monthly', 
      title: 'Monthly Summaries', 
      description: 'Per-user shift counts and $ totals',
      icon: BarChart3,
      color: 'text-[#007bff]'
    },
    { 
      id: 'ytd', 
      title: 'YTD Roll-ups', 
      description: 'Year-to-date accumulation',
      icon: BarChart3,
      color: 'text-emerald-500'
    },
    { 
      id: 'fairness', 
      title: 'Fairness Distribution', 
      description: 'Vacation win parity charts',
      icon: BarChart3,
      color: 'text-purple-500'
    },
  ]

  const toggleReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">Step 15 of 17</Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Reports & Analytics</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bookkeeper-ready exports with monthly/YTD shift counts, dollar totals, and fairness metrics.
        </p>
      </div>
      <div className="grid gap-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {reports.map((report) => {
            const isSelected = selectedReports.includes(report.id)
            const Icon = report.icon
            
            return (
              <motion.button
                key={report.id}
                onClick={() => toggleReport(report.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left transition-all ${
                  isSelected
                    ? 'border-2 border-[#007bff] bg-[#c9e7f6]/30 dark:bg-[#007bff]/20 shadow-lg'
                    : 'border-2 border-dashed border-slate-300 dark:border-slate-700 bg-transparent hover:border-[#007bff]/50'
                }`}
              >
                <Card className="border-0 bg-transparent">
                  <CardContent className="pt-6 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? 'text-[#007bff]' : 'text-slate-400'}`} />
                    <p className={`font-semibold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {report.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report.description}
                    </p>
                    {isSelected && (
                      <Badge className="bg-[#007bff] text-white mt-2">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Selected
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.button>
            )
          })}
        </div>
        
        {selectedReports.length > 0 && (
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="font-semibold">Ready to Export</p>
                <p className="text-sm text-muted-foreground">
                  {selectedReports.length} report{selectedReports.length > 1 ? 's' : ''} selected
                </p>
                <Button className="bg-gradient-to-r from-[#007bff] to-[#65c1f4]">
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export function Step16AuditCompliance() {
  const [selectedAuditTypes, setSelectedAuditTypes] = useState<string[]>(['config', 'overrides'])

  const auditTypes = [
    { id: 'config', title: 'Config Versions', icon: FileText },
    { id: 'overrides', title: 'Manual Overrides', icon: Edit3 },
    { id: 'swaps', title: 'Swap Approvals', icon: ArrowRightLeft },
    { id: 'publish', title: 'Publish Events', icon: Send },
  ]

  const toggleAuditType = (typeId: string) => {
    setSelectedAuditTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">Step 16 of 17</Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Audit & Compliance</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Immutable audit logs track every config change, override, swap, and publish action.
        </p>
      </div>
      <div className="grid gap-6 max-w-5xl mx-auto">
        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#007bff]" />
              Select Audit Trail Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-3">
              {auditTypes.map(item => {
                const isSelected = selectedAuditTypes.includes(item.id)
                const Icon = item.icon
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => toggleAuditType(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'border-2 border-[#007bff] bg-[#c9e7f6]/30 dark:bg-[#007bff]/20'
                        : 'border-2 border-dashed border-slate-300 dark:border-slate-700 bg-transparent'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mb-2 mx-auto ${isSelected ? 'text-[#007bff]' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-xs ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.title}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-1 mx-auto" />
                    )}
                  </motion.button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Every action logged with actor, timestamp, payload, and deterministic seed for reproducibility.
            </p>
          </CardContent>
        </Card>

        {selectedAuditTypes.length > 0 && (
          <Card className="border-[#c9e7f6] bg-gradient-to-br from-[#c9e7f6]/30 to-white dark:from-[#007bff]/10 dark:to-slate-900">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="font-semibold">Audit Log Preview</p>
                <p className="text-sm text-muted-foreground">
                  Showing {selectedAuditTypes.length} audit trail type{selectedAuditTypes.length > 1 ? 's' : ''}
                </p>
                <Button className="bg-gradient-to-r from-[#007bff] to-[#65c1f4]">
                  <Download className="mr-2 h-4 w-4" />
                  Export Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export function Step17LaunchReadiness() {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] via-[#65c1f4] to-[#c9e7f6] text-white animate-pulse">
          Step 17 of 17 - Complete!
        </Badge>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-400/20 rounded-full animate-ping" />
          </div>
          <h2 className="text-5xl font-bold tracking-tight relative">
            Launch Ready!
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your organization is fully configured. Review the summary below and launch your scheduling platform.
        </p>
      </div>
      <div className="grid gap-6 max-w-6xl mx-auto">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
              Configuration Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Radiologists', value: '32' },
                { icon: Calendar, label: 'Shift Types', value: '24' },
                { icon: BarChart3, label: 'Constraints', value: '10' },
                { icon: CheckCircle2, label: 'Feasibility', value: '100%' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-4 rounded-lg bg-white dark:bg-slate-900/50">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                <Send className="mr-2 h-4 w-4" />
                Invite Your Team
              </Button>
              <Button variant="outline" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send First Schedule
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">What You've Configured</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  'Organization settings & timezone',
                  '6 subspecialties with 32 radiologists',
                  '24 shift types with eligibility rules',
                  'Vacation & FTE policies with fairness',
                  '10 constraints and guardrails',
                  '4 equivalence sets for swaps',
                  'Dollar values and premiums',
                  'Calendar integrations',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

