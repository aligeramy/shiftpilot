"use client"

import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Users, 
  Clock, 
  Shield, 
  Brain, 
  Target, 
  ArrowRightLeft,
  Settings,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from "lucide-react"

export default function DocumentationPage() {
  return (
    <DashboardPage>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            ShiftPilot Schedule System Documentation
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to the intelligent scheduling engine, features, and algorithms
          </p>
        </div>

      {/* Core Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>
            ShiftPilot is an AI-powered radiology scheduling system designed to automate complex shift assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Smart Assignment
              </h4>
              <p className="text-sm text-muted-foreground">
                AI-driven algorithm that considers subspecialty requirements, FTE limits, vacation preferences, and workload fairness
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Robust Constraints
              </h4>
              <p className="text-sm text-muted-foreground">
                Multiple layers of validation prevent conflicts and ensure schedules meet all organizational requirements
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Dynamic Swapping
              </h4>
              <p className="text-sm text-muted-foreground">
                Built-in shift exchange system allows radiologists to trade shifts with automated approval workflows
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Algorithm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Intelligent Scheduling Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Assignment Process</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <strong>Instance Prioritization</strong>
                  <p className="text-sm text-muted-foreground">
                    Shifts are sorted by difficulty (most constrained first): subspecialty-restricted shifts, named allowlists, then general shifts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <strong>Candidate Filtering</strong>
                  <p className="text-sm text-muted-foreground">
                    Eligible radiologists are filtered by subspecialty, vacation conflicts, part-time days, and daily assignment limits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <strong>Scoring & Assignment</strong>
                  <p className="text-sm text-muted-foreground">
                    Remaining candidates are scored based on workload fairness, subspecialty match, and FTE status, then the best match is selected
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <div>
                  <strong>Conflict Prevention</strong>
                  <p className="text-sm text-muted-foreground">
                    Each assignment is tracked to prevent duplicates, daily conflicts, and maintain workload limits
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Scoring Formula</h4>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <div className="space-y-2">
                <div><strong>Base Score:</strong> 1.0</div>
                <div><strong>Fairness Bonus:</strong> +(average_workload - current_workload) × 0.5</div>
                <div><strong>Subspecialty Match:</strong> +0.4 (if perfect match)</div>
                <div><strong>FTE Preference:</strong> +0.2 (for higher FTE radiologists)</div>
                <div><strong>Randomization:</strong> ±0.1 (for variety)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Shift Types & Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Reading Shifts (8-Hour Blocks)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Body Reading (B1-B4)</span>
                  <Badge variant="outline">BODY</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Neuro Reading (N1-N4)</span>
                  <Badge variant="outline">NEURO</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">MSK Procedures</span>
                  <Badge variant="outline">MSK</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IR/Vascular</span>
                  <Badge variant="outline">IR</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Specialty & On-Call</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekend Reader</span>
                  <Badge variant="secondary">On-Call</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Call Rotations</span>
                  <Badge variant="secondary">On-Call</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">MA1 Clinic</span>
                  <Badge variant="destructive">Named Only</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Late Blocks (16-18, 18-21)</span>
                  <Badge variant="outline">Extended</Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Eligibility Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <strong className="text-sm">Subspecialty Required</strong>
                <p className="text-xs text-muted-foreground">
                  Only radiologists with matching subspecialty can be assigned (e.g., NEURO shifts → NEURO subspecialty)
                </p>
              </div>
              <div className="space-y-2">
                <strong className="text-sm">Named Allowlist</strong>
                <p className="text-xs text-muted-foreground">
                  Specific shifts limited to pre-approved radiologists (e.g., MA1 clinic has 7 eligible doctors)
                </p>
              </div>
              <div className="space-y-2">
                <strong className="text-sm">Allow Any</strong>
                <p className="text-xs text-muted-foreground">
                  General shifts available to all radiologists regardless of subspecialty (e.g., Stoney Creek)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constraints & Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Scheduling Constraints & Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Hard Constraints (Cannot be violated)
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">No Duplicate Assignments</strong>
                    <p className="text-xs text-muted-foreground">Each shift instance gets exactly one radiologist</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">One Shift Per Day</strong>
                    <p className="text-xs text-muted-foreground">Radiologists cannot work multiple shifts on the same day</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Subspecialty Eligibility</strong>
                    <p className="text-xs text-muted-foreground">Must match required subspecialty or allowlist</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Vacation Blocking</strong>
                    <p className="text-xs text-muted-foreground">Cannot assign shifts during approved vacation periods</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Soft Constraints (Optimized when possible)
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Workload Fairness</strong>
                    <p className="text-xs text-muted-foreground">Distribute shifts evenly based on FTE percentages</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Part-Time Day Respect</strong>
                    <p className="text-xs text-muted-foreground">Avoid scheduling on calculated PT days when possible</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Preference Priority</strong>
                    <p className="text-xs text-muted-foreground">Higher priority vacation requests get better consideration</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Variety Distribution</strong>
                    <p className="text-xs text-muted-foreground">Rotate assignments to prevent repetitive patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FTE & Part-Time Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            FTE & Part-Time Day Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Automatic PT Day Calculation</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-md">
                <div className="font-bold text-green-700">100% FTE</div>
                <div className="text-sm text-green-600">0 PT days</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-md">
                <div className="font-bold text-blue-700">90% FTE</div>
                <div className="text-sm text-blue-600">2 PT days</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-md">
                <div className="font-bold text-yellow-700">80% FTE</div>
                <div className="text-sm text-yellow-600">4 PT days</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-md">
                <div className="font-bold text-orange-700">70% FTE</div>
                <div className="text-sm text-orange-600">6 PT days</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-md">
                <div className="font-bold text-red-700">60% FTE</div>
                <div className="text-sm text-red-600">8 PT days</div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">PT Day Distribution Strategy</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">Even</Badge>
                <div>
                  <strong>Balanced Weekday Distribution</strong>
                  <p className="text-sm text-muted-foreground">
                    PT days are spread evenly across Monday-Friday to prevent clustering on Fridays/Mondays
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">Flexible</Badge>
                <div>
                  <strong>Soft Constraint Implementation</strong>
                  <p className="text-sm text-muted-foreground">
                    PT days block assignments when possible, but critical shifts can override if no alternatives exist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vacation System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Vacation Preference System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Priority-Based Award System</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Badge className="bg-red-500">P1 - High Priority</Badge>
                <p className="text-sm text-muted-foreground">
                  Family events, medical appointments, pre-booked trips. Always awarded when possible.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-yellow-500">P2 - Medium Priority</Badge>
                <p className="text-sm text-muted-foreground">
                  School holidays, desired time off. Awarded based on seniority and fairness points.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-500">P3 - Low Priority</Badge>
                <p className="text-sm text-muted-foreground">
                  Flexible requests. Awarded if capacity allows after higher priorities.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Vacation Blocking Logic</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Week-Based Blocking</strong>
                  <p className="text-sm text-muted-foreground">
                    Approved vacation dates block the entire work week to ensure meaningful time off
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <strong>Proactive Prevention</strong>
                  <p className="text-sm text-muted-foreground">
                    Vacation conflicts are detected during assignment phase, not after schedule generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Swapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Shift Exchange System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Swap Request Workflow</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <strong>Request Creation</strong>
                  <p className="text-sm text-muted-foreground">
                    Radiologist selects shift to give away, system finds eligible partners based on subspecialty and availability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <strong>Partner Matching</strong>
                  <p className="text-sm text-muted-foreground">
                    System identifies radiologists who can cover the shift and optionally offers reciprocal trades
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <strong>Automated Approval</strong>
                  <p className="text-sm text-muted-foreground">
                    Valid swaps that meet all constraints are automatically approved and integrated into schedule
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Swap Validation Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <strong className="text-sm">Eligibility Checks</strong>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Subspecialty qualification match</li>
                  <li>• No daily conflicts for either party</li>
                  <li>• Named allowlist compliance</li>
                  <li>• Vacation conflict prevention</li>
                </ul>
              </div>
              <div className="space-y-2">
                <strong className="text-sm">Fairness Preservation</strong>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Workload balance maintenance</li>
                  <li>• FTE limit respect</li>
                  <li>• Fair distribution impact assessment</li>
                  <li>• System integrity validation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced System Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Generation & Export</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Fast Generation</strong>
                    <p className="text-xs text-muted-foreground">Complete month schedule in ~6 seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">ICS Export</strong>
                    <p className="text-xs text-muted-foreground">Standard calendar format for all platforms</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Detailed Analytics</strong>
                    <p className="text-xs text-muted-foreground">Comprehensive generation reports and metrics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quality Assurance</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Automated Validation</strong>
                    <p className="text-xs text-muted-foreground">Multi-layer constraint checking</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Conflict Detection</strong>
                    <p className="text-xs text-muted-foreground">Real-time identification of scheduling issues</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Comprehensive Testing</strong>
                    <p className="text-xs text-muted-foreground">Extensive test suite ensures reliability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Performance & Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-md">
              <div className="text-2xl font-bold text-green-700">0%</div>
              <div className="text-sm text-green-600">Duplicate Assignments</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-md">
              <div className="text-2xl font-bold text-blue-700">100%</div>
              <div className="text-sm text-blue-600">Subspecialty Compliance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-md">
              <div className="text-2xl font-bold text-purple-700">~6s</div>
              <div className="text-sm text-purple-600">Generation Time</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-md">
              <div className="text-2xl font-bold text-orange-700">95%+</div>
              <div className="text-sm text-orange-600">Coverage Success</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardPage>
  )
}
