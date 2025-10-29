import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Zap, 
  CheckCircle2, 
  Scale, 
  Eye,
  Server,
  Database,
  Calendar, 
  Bot,
  Shield, 
  Sparkles,
  Clock,
  Users,
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCheck,
  XCircle,
  ArrowRight,
  Info
} from "lucide-react"

export default function DocumentationPage() {
  return (
    <DashboardPage>
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-blue-500/20">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Sparkles className="h-6 w-6 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-xs">AI-Powered</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              System Documentation
          </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Complete guide to ShiftPilot&apos;s intelligent constraint-based scheduling engine. 
              Learn how we generate fair, optimized schedules in seconds.
          </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-0" />
        </div>

        <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Shifts</span>
          </TabsTrigger>
          <TabsTrigger value="algorithm" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Algorithm</span>
          </TabsTrigger>
          <TabsTrigger value="constraints" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Constraints</span>
          </TabsTrigger>
          <TabsTrigger value="vacation" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Vacation</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Hero Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-blue-200/50 dark:border-blue-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 group-hover:from-blue-500/10 group-hover:to-blue-600/20 transition-all" />
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <Zap className="h-8 w-8 text-blue-500" />
                  <Badge variant="secondary" className="text-xs">Performance</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1.2s</div>
                <p className="text-sm text-muted-foreground mt-1">Generation time for 529 shifts</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-green-200/50 dark:border-green-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 group-hover:from-green-500/10 group-hover:to-green-600/20 transition-all" />
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <Badge variant="secondary" className="text-xs">Coverage</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">91-100%</div>
                <p className="text-sm text-muted-foreground mt-1">Shift coverage rate</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-purple-200/50 dark:border-purple-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 group-hover:from-purple-500/10 group-hover:to-purple-600/20 transition-all" />
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <Scale className="h-8 w-8 text-purple-500" />
                  <Badge variant="secondary" className="text-xs">Fairness</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">94.7%</div>
                <p className="text-sm text-muted-foreground mt-1">Fairness score</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-amber-200/50 dark:border-amber-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 group-hover:from-amber-500/10 group-hover:to-amber-600/20 transition-all" />
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <Eye className="h-8 w-8 text-amber-500" />
                  <Badge variant="secondary" className="text-xs">Transparency</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">100%</div>
                <p className="text-sm text-muted-foreground mt-1">Full audit trail</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">ShiftPilot Scheduling System</CardTitle>
                  <CardDescription className="text-base mt-1">
                    An intelligent, constraint-based scheduling platform for radiology departments
          </CardDescription>
                </div>
              </div>
        </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-6">
              <h3 className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-blue-500" />
                What is ShiftPilot?
              </h3>
              <p className="text-base leading-relaxed">
                ShiftPilot is a next-generation scheduling platform that automates the complex task of creating fair,
                constraint-aware schedules for large medical groups. Unlike manual scheduling (which takes hours),
                ShiftPilot generates complete schedules in seconds while ensuring 100% coverage and fairness.
              </p>

              <div className="not-prose my-6">
                <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Core Problem</h4>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Radiology scheduling is an <strong>NP-hard constraint satisfaction problem</strong> with exponential complexity
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="not-prose grid grid-cols-3 gap-4 my-6">
                <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">227,655</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Possible daily assignments<br />
                    <span className="text-[10px]">(27 rads × 23 shifts × 365 days)</span>
                  </p>
                </Card>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">6+</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Hard constraints<br />
                    <span className="text-[10px]">Coverage, eligibility, FTE limits</span>
                  </p>
                </Card>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5+</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Soft objectives<br />
                    <span className="text-[10px]">Fairness, balance, preferences</span>
                  </p>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Four-Layer Architecture
              </h3>
              <p className="text-base leading-relaxed">ShiftPilot operates in four distinct layers:</p>

              <div className="not-prose space-y-3 my-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">1. Configuration Layer</h4>
              <p className="text-sm text-muted-foreground">
                          Define shift types, subspecialties, eligibility rules, and organizational policies
              </p>
            </div>
                      <Badge variant="outline">Foundation</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </div>

                <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-all group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                        <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">2. Materialization Layer</h4>
              <p className="text-sm text-muted-foreground">
                          Generate concrete shift instances for target period (e.g., 529 shifts for January 2025)
              </p>
            </div>
                      <Badge variant="outline">Generation</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </div>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-all group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">3. Assignment Layer</h4>
              <p className="text-sm text-muted-foreground">
                          Match radiologists to shifts using constraint programming and multi-factor scoring
              </p>
            </div>
                      <Badge variant="outline">Intelligence</Badge>
          </div>
        </CardContent>
      </Card>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </div>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-all group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                        <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">4. Optimization Layer</h4>
                        <p className="text-sm text-muted-foreground">
                          Balance fairness, workload distribution, and vacation preferences across the team
                        </p>
                      </div>
                      <Badge variant="outline">Optimization</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="group hover:shadow-lg transition-all cursor-pointer border-blue-200/50 dark:border-blue-800/50">
        <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Understanding Shifts</CardTitle>
                </div>
        </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn the difference between shift types (templates) and shift instances (occurrences)
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Go to Shifts tab <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all cursor-pointer border-purple-200/50 dark:border-purple-800/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Assignment Algorithm</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Deep dive into the constraint programming algorithm and multi-factor scoring system
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Go to Algorithm tab <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ARCHITECTURE TAB */}
        <TabsContent value="architecture" className="space-y-6 mt-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">System Architecture</CardTitle>
                  <CardDescription className="text-base mt-1">
                    How ShiftPilot is built and how data flows through the system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-6">
              <h3 className="flex items-center gap-2 text-xl">
                <Database className="h-5 w-5 text-blue-500" />
                Technology Stack
              </h3>
              
              <div className="not-prose grid grid-cols-2 gap-6 my-6">
                <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
                  <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-blue-500/10">
                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-base">Frontend Stack</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
            <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Framework</Badge>
                        <span className="text-sm">Next.js 15 + React 19</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Language</Badge>
                        <span className="text-sm">TypeScript</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Styling</Badge>
                        <span className="text-sm">Tailwind CSS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">UI</Badge>
                        <span className="text-sm">shadcn/ui + Radix UI</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Calendar</Badge>
                        <span className="text-sm">FullCalendar</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                  <CardHeader className="bg-green-50/50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-green-500/10">
                        <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-base">Backend Stack</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">API</Badge>
                        <span className="text-sm">Next.js API Routes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">ORM</Badge>
                        <span className="text-sm">Prisma</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Database</Badge>
                        <span className="text-sm">PostgreSQL (Neon)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Auth</Badge>
                        <span className="text-sm">NextAuth.js v5</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">Engine</Badge>
                        <span className="text-sm">Constraint Programming</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Database className="h-5 w-5 text-green-500" />
                Data Model
              </h3>
              <p className="text-base leading-relaxed">The system uses a sophisticated multi-tenant data model:</p>
              
              <div className="not-prose my-6">
                <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/20 border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm font-mono bg-background/80 p-6 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-base font-bold text-blue-600 dark:text-blue-400">
                        📁 Organization <Badge variant="outline" className="ml-2 text-xs">Tenant</Badge>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        ├─ 👥 <strong>Users</strong> 
                        <span className="text-xs text-muted-foreground ml-2">(ADMIN, CHIEF, RADIOLOGIST)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-green-600 dark:text-green-400">
                        ├─ 🏥 <strong>Subspecialties</strong>
                        <span className="text-xs text-muted-foreground ml-2">(NEURO, IR, BODY, MSK, CHEST, INR)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        ├─ 📋 <strong>ShiftTypes</strong>
                        <span className="text-xs text-muted-foreground ml-2">(23+ types with eligibility)</span>
                      </div>
                      <div className="ml-10 text-muted-foreground">│  ├─ requiredSubspecialty</div>
                      <div className="ml-10 text-muted-foreground">│  ├─ allowAny</div>
                      <div className="ml-10 text-muted-foreground">│  └─ namedAllowlist</div>
                      <div className="ml-6 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        ├─ 👨‍⚕️ <strong>RadiologyProfiles</strong>
                        <span className="text-xs text-muted-foreground ml-2">(FTE %, subspecialty assignment)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                        ├─ 🏖️ <strong>VacationPreferences</strong>
                        <span className="text-xs text-muted-foreground ml-2">(ranked P1/P2/P3 choices)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                        ├─ 📅 <strong>ScheduleInstances</strong>
                        <span className="text-xs text-muted-foreground ml-2">(materialized shifts)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-green-600 dark:text-green-400">
                        ├─ ✅ <strong>ScheduleAssignments</strong>
                        <span className="text-xs text-muted-foreground ml-2">(who works what)</span>
                      </div>
                      <div className="ml-6 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        └─ 🔄 <strong>SwapRequests/Offers</strong>
                        <span className="text-xs text-muted-foreground ml-2">(shift exchanges)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Shield className="h-5 w-5 text-purple-500" />
                Multi-Tenant Architecture
              </h3>
              <p className="text-base leading-relaxed">
                ShiftPilot is designed as a multi-tenant SaaS platform where each organization (clinic/hospital)
                operates in complete isolation:
              </p>

              <div className="not-prose grid grid-cols-2 gap-4 my-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                      <CheckCheck className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                        <h4 className="font-semibold mb-1">Data Isolation</h4>
                  <p className="text-sm text-muted-foreground">
                          All database queries scoped by organization ID
                  </p>
                </div>
              </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                      <CheckCheck className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                        <h4 className="font-semibold mb-1">Role-Based Access Control</h4>
                  <p className="text-sm text-muted-foreground">
                          SUPER_ADMIN, ADMIN, CHIEF, RADIOLOGIST roles
                  </p>
                </div>
              </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                      <CheckCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                        <h4 className="font-semibold mb-1">Configuration Isolation</h4>
                  <p className="text-sm text-muted-foreground">
                          Each organization has its own rules and settings
                  </p>
                </div>
              </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                      <CheckCheck className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                        <h4 className="font-semibold mb-1">Complete Audit Trail</h4>
                  <p className="text-sm text-muted-foreground">
                          Full logging per organization with timestamps
                  </p>
                </div>
              </div>
                  </CardContent>
                </Card>
            </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Clock className="h-5 w-5 text-blue-500" />
                Generation Pipeline
              </h3>
              <p className="text-base leading-relaxed mb-4">Six-phase process from configuration to validated schedule:</p>

              <div className="not-prose my-6 space-y-3">
                <Card className="group hover:shadow-md transition-all border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-blue-600 hover:bg-blue-600">1</Badge>
          </div>
                        <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Load Context</h4>
                        <p className="text-sm text-muted-foreground">
                          Fetch radiologists, shift types, vacation preferences from database
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">I/O</Badge>
                          <Badge variant="secondary" className="text-xs">~200ms</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-green-600 hover:bg-green-600">2</Badge>
                        </div>
                        <div className="w-px h-8 bg-gradient-to-b from-green-500/50 to-transparent" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Materialize Shifts</h4>
                        <p className="text-sm text-muted-foreground">
                          Generate concrete shift instances for target period (e.g., 529 for January)
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">CPU</Badge>
                          <Badge variant="secondary" className="text-xs">~50ms</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-purple-600 hover:bg-purple-600">3</Badge>
              </div>
                        <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Process Vacations</h4>
                        <p className="text-sm text-muted-foreground">
                          Resolve conflicts using fairness ledger, approve/reject preferences
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">AI</Badge>
                          <Badge variant="secondary" className="text-xs">~100ms</Badge>
                        </div>
            </div>
          </div>
        </CardContent>
      </Card>

                <Card className="group hover:shadow-md transition-all border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-amber-600 hover:bg-amber-600">4</Badge>
                </div>
                        <div className="w-px h-8 bg-gradient-to-b from-amber-500/50 to-transparent" />
                </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Sort by Difficulty</h4>
                        <p className="text-sm text-muted-foreground">
                          Assign hardest shifts first using constraint satisfaction approach
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Algorithm</Badge>
                          <Badge variant="secondary" className="text-xs">~30ms</Badge>
                </div>
                </div>
              </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all border-pink-200 dark:border-pink-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-pink-600 hover:bg-pink-600">5</Badge>
            </div>
                        <div className="w-px h-8 bg-gradient-to-b from-pink-500/50 to-transparent" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Generate Assignments</h4>
                        <p className="text-sm text-muted-foreground">
                          Match radiologists to shifts using multi-factor scoring algorithm
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Core Logic</Badge>
                          <Badge variant="secondary" className="text-xs">~800ms</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all border-cyan-200 dark:border-cyan-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                          <Badge className="h-6 w-6 flex items-center justify-center bg-cyan-600 hover:bg-cyan-600">6</Badge>
                </div>
                </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-base mb-1">Validate & Optimize</h4>
                        <p className="text-sm text-muted-foreground">
                          Check constraints, calculate metrics, recommend improvements
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Validation</Badge>
                          <Badge variant="secondary" className="text-xs">~120ms</Badge>
                </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary */}
              <div className="not-prose my-6">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                        <div>
                          <h4 className="font-semibold text-lg">Total Pipeline Time</h4>
                          <p className="text-sm text-muted-foreground">Real-world performance</p>
              </div>
            </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">1.2s</div>
                        <p className="text-xs text-muted-foreground">for 529 shifts</p>
          </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SHIFTS TAB */}
        <TabsContent value="shifts" className="space-y-6 mt-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Understanding Shifts</CardTitle>
                  <CardDescription className="text-base mt-1">
                    The difference between shift types (templates) and shift instances (occurrences)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-6">
              
              {/* Visual Comparison */}
              <div className="not-prose grid grid-cols-2 gap-6 my-6">
                <Card className="border-2 border-blue-300 dark:border-blue-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <Badge className="w-fit mb-2 bg-blue-600 hover:bg-blue-600">Template</Badge>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      Shift Type
          </CardTitle>
                    <CardDescription>Reusable blueprint / configuration</CardDescription>
        </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-muted-foreground mb-4">
                      A <strong>Shift Type</strong> is a reusable blueprint that defines the characteristics of a shift.
                      Think of it as a template that can generate many actual shift occurrences.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Defines:</div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Code & Name</li>
                        <li>• Time Window</li>
                        <li>• Recurrence Pattern</li>
                        <li>• Eligibility Rules</li>
                      </ul>
                </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-300 dark:border-green-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <Badge className="w-fit mb-2 bg-green-600 hover:bg-green-600">Instance</Badge>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Shift Instance
                    </CardTitle>
                    <CardDescription>Concrete occurrence / assignment</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-muted-foreground mb-4">
                      A <strong>Shift Instance</strong> is a concrete occurrence of a shift type on a specific date.
                      This is what actually gets assigned to a radiologist.
                    </p>
                    <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Contains:</div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Specific Date</li>
                        <li>• Start/End Times</li>
                        <li>• Shift Type Reference</li>
                        <li>• Assignment Status</li>
                      </ul>
                </div>
                  </CardContent>
                </Card>
                </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Target className="h-5 w-5 text-blue-500" />
                Example: Neuro 1 Shift
              </h3>

              <div className="not-prose my-6 space-y-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-300 dark:border-blue-700">
                  <CardHeader>
                <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Shift Type Definition
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-500/10">Blueprint</Badge>
                </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">CODE</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">N1</div>
              </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">NAME</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded text-xs">Neuro 1 (CT STAT)</div>
            </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">HOURS</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">08:00 - 16:00</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">SUBSPECIALTY</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">NEURO</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">RECURRENCE</div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">Mon</Badge>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">Tue</Badge>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">Wed</Badge>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">Thu</Badge>
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">Fri</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Sat</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Sun</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                    <Badge variant="outline" className="text-xs">Materialization</Badge>
                </div>
                </div>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 border-green-300 dark:border-green-700">
                  <CardHeader>
                <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Shift Instance (Jan 15, 2025)
                      </CardTitle>
                      <Badge variant="outline" className="bg-green-500/10">Concrete</Badge>
                </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">DATE</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">2025-01-15</div>
                </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">DAY</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">Wednesday</div>
              </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">START TIME</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">08:00:00</div>
            </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">END TIME</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded">16:00:00</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">STATUS</div>
                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-300">DRAFT</Badge>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">ASSIGNED TO</div>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">TBD</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Materialization Process
              </h3>
              <p className="text-base leading-relaxed mb-4">
                When generating a schedule for January 2025, ShiftPilot <strong>materializes</strong> shift instances:
              </p>

              <div className="not-prose my-6">
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/10">
                        <Badge className="h-8 w-8 flex items-center justify-center bg-purple-600 hover:bg-purple-600">1</Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">Calculate Days</h4>
                        <p className="text-sm text-muted-foreground">January 2025 has 31 days</p>
                        <div className="mt-2 p-3 bg-muted/50 rounded font-mono text-xs">
                          daysInMonth = 31
                        </div>
            </div>
          </div>

          <Separator />

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/10">
                        <Badge className="h-8 w-8 flex items-center justify-center bg-purple-600 hover:bg-purple-600">2</Badge>
              </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">Iterate Each Day</h4>
                        <p className="text-sm text-muted-foreground">For each day (Jan 1-31), check day of week</p>
                        <div className="mt-2 p-3 bg-muted/50 rounded font-mono text-xs">
                          for (day = 1; day &lt;= 31; day++) &#123;<br />
                          &nbsp;&nbsp;date = new Date(2025, 0, day)<br />
                          &#125;
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/10">
                        <Badge className="h-8 w-8 flex items-center justify-center bg-purple-600 hover:bg-purple-600">3</Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">Check Recurrence</h4>
                        <p className="text-sm text-muted-foreground">
                          If N1 recurs on this day (Mon-Fri), create instance
                        </p>
                        <div className="mt-2 p-3 bg-muted/50 rounded font-mono text-xs">
                          if (shiftType.recurrence[dayOfWeek]) &#123;<br />
                          &nbsp;&nbsp;createInstance(date, shiftType)<br />
                          &#125;
              </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">Result for N1</h4>
                        <p className="text-sm text-muted-foreground">
                          23 instances created (all weekdays in January)
                        </p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {['Jan 2', 'Jan 3', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10'].map(date => (
                            <Badge key={date} variant="secondary" className="text-xs">{date}</Badge>
                          ))}
                          <span className="text-xs text-muted-foreground self-center">... +16 more</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Shield className="h-5 w-5 text-blue-500" />
                Eligibility Rules
              </h3>
              <p className="text-base leading-relaxed mb-4">Shift types have three types of eligibility rules:</p>

              <div className="not-prose grid grid-cols-3 gap-4 my-6">
                <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
                  <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded bg-blue-500/20">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge className="text-xs">Type 1</Badge>
                    </div>
                    <CardTitle className="text-base">Subspecialty Required</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-4">
                    <p className="text-muted-foreground mb-3">
                      Only radiologists with the required subspecialty can work this shift
                    </p>
              <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">N1</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">NEURO only</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">VASC</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">IR only</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">CTUS</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">BODY only</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
                  <CardHeader className="bg-green-50 dark:bg-green-950/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded bg-green-500/20">
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <Badge className="text-xs">Type 2</Badge>
                    </div>
                    <CardTitle className="text-base">Allow Any</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-4">
                    <p className="text-muted-foreground mb-3">
                      Any radiologist can work this shift, regardless of subspecialty
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">XR_GEN</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs bg-green-500/20">Anyone</Badge>
              </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">STONEY</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs bg-green-500/20">Anyone</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">WH_OTHER</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs bg-green-500/20">Anyone</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

                <Card className="border-2 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all group">
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded bg-amber-500/20">
                        <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <Badge className="text-xs">Type 3</Badge>
                    </div>
                    <CardTitle className="text-base">Named Allowlist</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm pt-4">
                    <p className="text-muted-foreground mb-3">
                      Only specific named radiologists can work this shift
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">MA1</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs bg-amber-500/20">6 rads</Badge>
                  </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-xs">COILING</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs bg-amber-500/20">Ramiro only</Badge>
                </div>
                  </div>
                  </CardContent>
                </Card>
                </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Clock className="h-5 w-5 text-purple-500" />
                Day-Specific Patterns
              </h3>
              <p className="text-base leading-relaxed mb-4">Some shifts only occur on specific days of the week:</p>

              <div className="not-prose grid grid-cols-3 gap-4 my-6">
                <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Body MRI</h4>
                        <p className="text-xs text-muted-foreground mb-2">Thursday only</p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs opacity-40">Mon</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Tue</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Wed</Badge>
                          <Badge variant="secondary" className="text-xs bg-purple-500/20">Thu</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Fri</Badge>
                </div>
                  </div>
                </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Coiling</h4>
                        <p className="text-xs text-muted-foreground mb-2">Tuesday & Wednesday</p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs opacity-40">Mon</Badge>
                          <Badge variant="secondary" className="text-xs bg-blue-500/20">Tue</Badge>
                          <Badge variant="secondary" className="text-xs bg-blue-500/20">Wed</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Thu</Badge>
                          <Badge variant="outline" className="text-xs opacity-40">Fri</Badge>
            </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Weekend Call</h4>
                        <p className="text-xs text-muted-foreground mb-2">Weekends only</p>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs bg-orange-500/20">Sat</Badge>
                          <Badge variant="secondary" className="text-xs bg-orange-500/20">Sun</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Real Example: January 2025
              </h3>
              <p className="text-base leading-relaxed mb-4">
                For the <strong>Main Radiology Group</strong> with <strong>23 shift types</strong>,
                materializing January 2025 creates:
              </p>

              <div className="not-prose my-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-300 dark:border-green-700">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/20">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                  <div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">529</div>
                            <p className="text-xs text-muted-foreground">Total shift instances</p>
                  </div>
                </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                  <div>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">27</div>
                            <p className="text-xs text-muted-foreground">Active radiologists</p>
                  </div>
                </div>
                  </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Day-specific patterns (Body MRI Thu only)</span>
                </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Recurrence rules (Mon-Fri, weekends)</span>
                  </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Each instance needs 1 radiologist</span>
                </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Zero hardcoded rules</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALGORITHM TAB */}
        <TabsContent value="algorithm" className="space-y-6 mt-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Assignment Algorithm</CardTitle>
                  <CardDescription className="text-base mt-1">
                    How ShiftPilot matches radiologists to shifts using constraint programming
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-6">
              <div className="not-prose my-6">
                <Card className="border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Algorithm Overview</h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          ShiftPilot uses a <strong>constraint satisfaction approach</strong> combined with
                          <strong> multi-factor optimization</strong> to generate high-quality schedules in 5 phases.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Target className="h-5 w-5 text-blue-500" />
                Phase 1: Sort by Difficulty
              </h3>
              <p className="text-base leading-relaxed mb-4">
                The algorithm starts by sorting all shift instances by <strong>difficulty</strong>,
                assigning the hardest shifts first when there&apos;s maximum flexibility.
              </p>

              <div className="not-prose my-6">
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Difficulty Calculation Formula
          </CardTitle>
        </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 hover:bg-blue-600 flex-shrink-0">1</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Eligible Candidate Count</strong>
                        <div className="bg-muted/50 p-2 rounded font-mono text-[11px]">
                          difficulty += 10 / eligible_count
              </div>
              </div>
              </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 hover:bg-blue-600 flex-shrink-0">2</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Weekend Penalty</strong>
                        <div className="bg-muted/50 p-2 rounded font-mono text-[11px]">
                          if (isWeekend) difficulty += 2
              </div>
              </div>
            </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 hover:bg-blue-600 flex-shrink-0">3</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Named Restriction</strong>
                        <div className="bg-muted/50 p-2 rounded font-mono text-[11px]">
                          if (hasNamedList) difficulty += 3
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 hover:bg-blue-600 flex-shrink-0">4</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Subspecialty Rarity</strong>
                        <div className="bg-muted/50 p-2 rounded font-mono text-[11px]">
                          difficulty += 5 / subspecialty_size
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Shield className="h-5 w-5 text-red-500" />
                Phase 2: Find Eligible Candidates
              </h3>
              <p className="text-base leading-relaxed mb-4">
                For each shift instance, the algorithm filters radiologists based on hard constraints:
              </p>

              <div className="not-prose my-6">
                <Card className="border-2 border-red-200 dark:border-red-800">
                  <CardHeader className="bg-red-50 dark:bg-red-950/30">
                    <CardTitle className="text-base flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Eligibility Filters (Any fail = ineligible)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="flex-shrink-0">✗</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Already assigned today?</strong>
                        <p className="text-xs text-muted-foreground">One shift per day maximum (prevents double-booking)</p>
                </div>
              </div>
                    <Separator />
              <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="flex-shrink-0">✗</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">On vacation?</strong>
                        <p className="text-xs text-muted-foreground">Check approved vacation blocks for this week</p>
                </div>
              </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="flex-shrink-0">✗</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Subspecialty mismatch?</strong>
                        <p className="text-xs text-muted-foreground">Must match required subspecialty (e.g., NEURO for N1)</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="flex-shrink-0">✗</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Not on named allowlist?</strong>
                        <p className="text-xs text-muted-foreground">Must be explicitly listed (e.g., MA1, Coiling)</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="flex-shrink-0">✗</Badge>
                      <div className="flex-1">
                        <strong className="block mb-1 text-sm">Exceeds FTE limit?</strong>
                        <p className="text-xs text-muted-foreground">Part-time rads have monthly assignment caps (60% FTE = 13 shifts/month)</p>
            </div>
          </div>
        </CardContent>
      </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Scale className="h-5 w-5 text-purple-500" />
                Phase 3: Score Candidates
              </h3>
              <p className="text-base leading-relaxed mb-4">
                Eligible candidates are scored using multiple factors to find the best match:
              </p>

              <div className="not-prose grid grid-cols-2 gap-4 my-6">
                <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-600 hover:bg-purple-600 text-xs">Highest Weight</Badge>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3.0×</div>
                </div>
                    <CardTitle className="text-base">Fairness Score</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm relative">
                    <p className="text-muted-foreground mb-2">
                      Prioritizes radiologists who have worked less than their target number of shifts
                    </p>
                    <div className="bg-muted/50 p-2 rounded font-mono text-[10px]">
                      target - current
              </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-600 hover:bg-blue-600 text-xs">High Weight</Badge>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.5×</div>
            </div>
                    <CardTitle className="text-base">Workload Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm relative">
                    <p className="text-muted-foreground mb-2">
                      Ensures even distribution of total hours and assignments across the team
                    </p>
                    <div className="bg-muted/50 p-2 rounded font-mono text-[10px]">
                      std_dev penalty
          </div>
        </CardContent>
      </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-600 hover:bg-green-600 text-xs">Medium Weight</Badge>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.0×</div>
                    </div>
                    <CardTitle className="text-base">Vacation Satisfaction</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm relative">
                    <p className="text-muted-foreground mb-2">
                      Rewards radiologists who had vacation preferences approved or denied
                    </p>
                    <div className="bg-muted/50 p-2 rounded font-mono text-[10px]">
                      pref_debt score
              </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-600 hover:bg-amber-600 text-xs">Lower Weight</Badge>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">1.5×</div>
            </div>
                    <CardTitle className="text-base">Desirability Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm relative">
                    <p className="text-muted-foreground mb-2">
                      Rotates undesirable shifts (weekends, nights) fairly across the team
                    </p>
                    <div className="bg-muted/50 p-2 rounded font-mono text-[10px]">
                      desir balance
              </div>
                  </CardContent>
                </Card>
          </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Sparkles className="h-5 w-5 text-pink-500" />
                Phase 4: Selection with Randomization
              </h3>
              <p className="text-base leading-relaxed mb-4">
                To prevent gaming and predictable patterns, the algorithm uses <strong>weighted random selection</strong>
                from the top candidates:
              </p>

              <div className="not-prose my-6">
                <Card className="border-2 border-pink-200 dark:border-pink-800">
                  <CardHeader className="bg-pink-50 dark:bg-pink-950/30">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Gaming Prevention Algorithm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-600 hover:bg-pink-600">Step 1</Badge>
                        <strong className="text-sm">Take top 3 scored candidates</strong>
              </div>
                      <div className="flex gap-2">
                        <Card className="flex-1 p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800">
                          <div className="text-xs text-muted-foreground mb-1">Candidate A</div>
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">85</div>
                        </Card>
                        <Card className="flex-1 p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
                          <div className="text-xs text-muted-foreground mb-1">Candidate B</div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">82</div>
                        </Card>
                        <Card className="flex-1 p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
                          <div className="text-xs text-muted-foreground mb-1">Candidate C</div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">79</div>
                        </Card>
            </div>
          </div>

          <Separator />

                <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-600 hover:bg-pink-600">Step 2</Badge>
                        <strong className="text-sm">Calculate selection probabilities</strong>
                </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">35%</div>
                          <div className="text-[10px] text-muted-foreground">Candidate A</div>
              </div>
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">33%</div>
                          <div className="text-[10px] text-muted-foreground">Candidate B</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">32%</div>
                          <div className="text-[10px] text-muted-foreground">Candidate C</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-600 hover:bg-pink-600">Step 3</Badge>
                        <strong className="text-sm">Select winner (weighted random)</strong>
                      </div>
                      <Card className="p-3 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-xs text-muted-foreground">
                            <strong>Why randomization?</strong> Prevents &quot;I know I&apos;ll get X shift if I do Y&quot; gaming while still respecting fairness and merit
                  </p>
                </div>
                      </Card>
              </div>
                  </CardContent>
                </Card>
            </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Phase 5: Create Assignment
              </h3>
              <p className="text-base leading-relaxed mb-4">
                Once a candidate is selected, an assignment record is created and the context is updated:
              </p>

              <div className="not-prose my-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Assignment Record Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">ASSIGNMENT ID</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded text-xs">assignment_abc123</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">INSTANCE ID</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded text-xs">instance_n1_2025-01-15</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">RADIOLOGIST</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded text-xs">user_xyz789</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">TYPE</div>
                        <Badge className="bg-green-600 hover:bg-green-600">GENERATED</Badge>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">CONFIDENCE</div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">87%</Badge>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">TIMESTAMP</div>
                        <div className="font-mono bg-background/50 px-2 py-1 rounded text-xs">2025-01-10 14:30</div>
            </div>
          </div>
        </CardContent>
      </Card>
              </div>

              <h3 className="flex items-center gap-2 text-xl mt-8">
                <Zap className="h-5 w-5 text-amber-500" />
                Real-World Performance
              </h3>
              <p className="text-base leading-relaxed mb-4">Results from Main Radiology Group (27 radiologists, 23 shift types):</p>

              <div className="not-prose grid grid-cols-4 gap-4 my-6">
                <Card className="text-center p-4 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
                  <div className="p-2 rounded-lg bg-blue-500/10 w-fit mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">1.2s</div>
                  <p className="text-xs text-muted-foreground">Generation Time</p>
                </Card>
                <Card className="text-center p-4 border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
                  <div className="p-2 rounded-lg bg-green-500/10 w-fit mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">529</div>
                  <p className="text-xs text-muted-foreground">Shifts Generated</p>
                </Card>
                <Card className="text-center p-4 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all group">
                  <div className="p-2 rounded-lg bg-purple-500/10 w-fit mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">91%</div>
                  <p className="text-xs text-muted-foreground">Coverage Rate</p>
                </Card>
                <Card className="text-center p-4 border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
                  <div className="p-2 rounded-lg bg-green-500/10 w-fit mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">0</div>
                  <p className="text-xs text-muted-foreground">Violations</p>
                </Card>
              </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* CONSTRAINTS TAB */}
        <TabsContent value="constraints" className="space-y-6 mt-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Constraint Engine</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Hard constraints that must never be violated and soft objectives that are optimized
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-6">
              <h3 className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-blue-500" />
                Constraint Types
              </h3>
              <p className="text-base leading-relaxed mb-4">ShiftPilot enforces two types of constraints:</p>

              <div className="not-prose grid grid-cols-2 gap-6 my-6">
                <Card className="border-2 border-red-300 dark:border-red-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="bg-red-50 dark:bg-red-950/30 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded bg-red-500/20">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <Badge className="bg-red-600 hover:bg-red-600 text-xs">Critical</Badge>
                    </div>
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">
                      Hard Constraints
                    </CardTitle>
                    <CardDescription className="text-sm">Never violated - blocks schedule if not satisfied</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 pt-4 relative">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>Coverage requirements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>Subspecialty eligibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>Named allowlist restrictions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>Single assignment per day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>Vacation blocks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                      <span>FTE compliance</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-300 dark:border-amber-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/30 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded bg-amber-500/20">
                        <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <Badge className="bg-amber-600 hover:bg-amber-600 text-xs">Optimized</Badge>
                    </div>
                    <CardTitle className="text-xl text-amber-600 dark:text-amber-400">
                      Soft Objectives
                    </CardTitle>
                    <CardDescription className="text-sm">Optimized - relaxed if necessary for feasibility</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 pt-4 relative">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber-500" />
                      <span>Fairness distribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      <span>Workload balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-500" />
                      <span>Vacation satisfaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      <span>Desirability balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Randomization</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3>Hard Constraint Details</h3>

              <div className="not-prose space-y-4 my-4">
      <Card>
        <CardHeader>
                    <CardTitle className="text-base">1. Coverage Requirements</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Every shift instance must have exactly 1 radiologist assigned.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      IF shift_instance.assigned_count != 1<br />
                      THEN CONSTRAINT_VIOLATION
                </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
                    <CardTitle className="text-base">2. Subspecialty Eligibility</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Radiologists can only work shifts that match their subspecialty, unless the shift allows any.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      IF shift.requiredSubspecialty AND<br />
                      &nbsp;&nbsp;radiologist.subspecialty != shift.requiredSubspecialty<br />
                      THEN INELIGIBLE
              </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">3. Named Allowlist</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Some procedure shifts (e.g., Coiling, MA1) are restricted to specific named radiologists.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      IF shift.namedAllowlist.length &gt; 0 AND<br />
                      &nbsp;&nbsp;radiologist.email NOT IN shift.namedAllowlist<br />
                      THEN INELIGIBLE
                </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
                    <CardTitle className="text-base">4. Single Assignment Per Day</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Radiologists cannot be assigned to multiple shifts on the same day.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      IF radiologist.assignments.includes(date)<br />
                      THEN INELIGIBLE
              </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">5. Vacation Blocks</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Approved vacation creates absolute unavailability for that week.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      IF date BETWEEN vacation.start AND vacation.end<br />
                      THEN INELIGIBLE
                </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">6. FTE Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Part-time radiologists (60-90% FTE) have monthly assignment caps based on their FTE percentage.
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      max_assignments = (FTE / 100) * 22 work days<br />
                      IF current_assignments &gt;= max_assignments<br />
                      THEN INELIGIBLE
              </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Examples: 60% FTE = 13 shifts/month, 80% FTE = 18 shifts/month
            </div>
                  </CardContent>
                </Card>
          </div>

              <h3>Vacation-Specific Constraints</h3>
              <p>Additional constraints apply when processing vacation preferences:</p>

              <div className="not-prose space-y-4 my-4">
                <Card className="border-purple-200 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle className="text-base">Subspecialty Coverage Caps (Per Week)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                <div>
                        <strong>Body MRI:</strong><br />
                        Max 2 on vacation
              </div>
                      <div>
                        <strong>Cardiac:</strong><br />
                        Max 2 on vacation
              </div>
                <div>
                        <strong>IR:</strong><br />
                        Max 1 on vacation
            </div>
          </div>
        </CardContent>
      </Card>

                <Card className="border-purple-200 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle className="text-base">Mammography Coverage</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">Critical service coverage requirements:</p>
                    <ul className="space-y-1 ml-4">
                      <li>✓ Minimum 1 mammo Bx rad available (absolute)</li>
                      <li>✓ Ideally 2+ mammo Bx rads available</li>
                      <li>✓ Aim for 5 total mammo-qualified rads available</li>
                      <li>✓ Special: If NS is only mammo rad, need DL or DW on Tuesdays</li>
                    </ul>
                  </CardContent>
                </Card>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* VACATION TAB */}
        <TabsContent value="vacation" className="space-y-6">
      <Card>
        <CardHeader>
              <CardTitle>Vacation Preference System</CardTitle>
              <CardDescription>
                How vacation requests are collected, processed, and optimized for fairness
              </CardDescription>
        </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h3>Vacation Collection Process</h3>

              <div className="not-prose my-4">
                <Card>
                  <CardContent className="pt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge>1</Badge>
                  <div>
                        <div className="font-semibold">Submission Window Opens</div>
                        <div className="text-muted-foreground">
                          Each radiologist submits ranked vacation preferences (P1, P2, P3) for each month
                  </div>
                </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Badge>2</Badge>
                  <div>
                        <div className="font-semibold">Preferences Collected</div>
                        <div className="text-muted-foreground">
                          System stores preferences with status: PENDING
                  </div>
                </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Badge>3</Badge>
                  <div>
                        <div className="font-semibold">Conflict Resolution</div>
                        <div className="text-muted-foreground">
                          AI + Fairness Ledger resolves overlapping requests
                  </div>
                </div>
              </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Badge>4</Badge>
                      <div>
                        <div className="font-semibold">Approval/Rejection</div>
                        <div className="text-muted-foreground">
                          Preferences marked APPROVED or REJECTED based on capacity and fairness
          </div>
                      </div>
                    </div>
          <Separator />
                    <div className="flex items-center gap-3">
                      <Badge>5</Badge>
                      <div>
                        <div className="font-semibold">Schedule Generation</div>
                        <div className="text-muted-foreground">
                          Approved vacation blocks create unavailability for shift assignments
              </div>
              </div>
            </div>
                  </CardContent>
                </Card>
            </div>

              <h3>Preference Ranking System</h3>
              <p>Each radiologist submits up to 3 ranked choices per month:</p>

              <div className="not-prose grid grid-cols-3 gap-4 my-4">
                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader>
                    <CardTitle className="text-base">P1 (First Choice)</CardTitle>
                    <CardDescription>Highest priority</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Fairness penalty if denied: +3 points<br />
                      Goal: Grant 60%+ of P1 requests
                    </p>
        </CardContent>
      </Card>

                <Card className="border-yellow-200 dark:border-yellow-900">
                  <CardHeader>
                    <CardTitle className="text-base">P2 (Second Choice)</CardTitle>
                    <CardDescription>Medium priority</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Fairness penalty if denied: +2 points<br />
                      Fallback if P1 unavailable
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 dark:border-orange-900">
                  <CardHeader>
                    <CardTitle className="text-base">P3 (Third Choice)</CardTitle>
                    <CardDescription>Lower priority</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Fairness penalty if denied: +1 point<br />
                      Last resort option
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Fairness Ledger</h3>
              <p>
                The fairness ledger tracks each radiologist&apos;s &quot;vacation debt&quot; to ensure equitable distribution
                of vacation preferences across the year:
              </p>

              <div className="not-prose my-4">
      <Card>
        <CardHeader>
                    <CardTitle className="text-base">How the Fairness Ledger Works</CardTitle>
        </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                  <div>
                      <strong>Initial State:</strong> All radiologists start at 0 points
                  </div>
                    <Separator />
                    <div>
                      <strong>Preference Granted:</strong><br />
                      <div className="ml-4 text-muted-foreground">
                        • P1 granted: -3 points (they &quot;owe&quot; less vacation priority)<br />
                        • P2 granted: -2 points<br />
                        • P3 granted: -1 point
                </div>
                    </div>
                    <Separator />
                  <div>
                      <strong>Preference Denied:</strong><br />
                      <div className="ml-4 text-muted-foreground">
                        • Any preference denied: +2 points (they are &quot;owed&quot; priority)<br />
                  </div>
                </div>
                    <Separator />
                  <div>
                      <strong>Conflict Resolution:</strong><br />
                      <div className="ml-4 text-muted-foreground">
                        When multiple radiologists want the same week, person with highest
                        fairness debt (most points) gets priority
                  </div>
                </div>
                    <Separator />
                    <div>
                      <strong>Temporal Decay:</strong><br />
                      <div className="ml-4 text-muted-foreground">
                        Points gradually decrease over time (-1 per month) to prevent
                        permanent penalties from old denials
              </div>
            </div>
                  </CardContent>
                </Card>
            </div>

              <h3>Capacity Management</h3>
              <p>System enforces maximum vacation capacity per week to maintain coverage:</p>

              <div className="not-prose my-4">
                <Card>
                  <CardContent className="pt-6 space-y-2 text-sm">
                  <div>
                      <strong>Maximum Approval Rate:</strong> 30% of radiologists per week<br />
                      <span className="text-muted-foreground">
                        With 27 radiologists, max 8 can be on vacation any given week
                      </span>
                  </div>
                    <Separator />
                  <div>
                      <strong>Processing Order:</strong><br />
                      <div className="ml-4 text-muted-foreground">
                        1. All P1 requests by fairness debt (highest first)<br />
                        2. All P2 requests by fairness debt<br />
                        3. All P3 requests by fairness debt
                  </div>
                </div>
                    <Separator />
                  <div>
                      <strong>Week Capacity Tracking:</strong><br />
                      <span className="text-muted-foreground">
                        Each week tracks approved_count / max_capacity to prevent oversubscription
                      </span>
          </div>
        </CardContent>
      </Card>
                </div>

              <h3>AI-Augmented Decision Making</h3>
              <p>
                For complex scenarios, AI assists with decisions that require judgment:
              </p>

              <div className="not-prose space-y-4 my-4">
      <Card>
        <CardHeader>
                    <CardTitle className="text-base">Flexible Request Placement</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-2">
                      When radiologists indicate flexibility, AI finds optimal placement considering:
                    </p>
                    <ul className="space-y-1 ml-4 text-muted-foreground">
                      <li>• Overall schedule balance</li>
                      <li>• Subspecialty coverage optimization</li>
                      <li>• Fairness to other radiologists</li>
                      <li>• Proximity to preferred dates</li>
                    </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
                    <CardTitle className="text-base">Priority Inference</CardTitle>
        </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-2">
                      When rankings are ambiguous (e.g., chronological instead of by priority), AI infers true intent:
                    </p>
                    <ul className="space-y-1 ml-4 text-muted-foreground">
                      <li>• Context clues (&quot;summer vacation important&quot;)</li>
                      <li>• Historical patterns from past submissions</li>
                      <li>• Seasonal preferences analysis</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Conflict Resolution Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-2">
                      When hard choices must be made between equally-ranked requests:
                    </p>
                    <ul className="space-y-1 ml-4 text-muted-foreground">
                      <li>• AI evaluates multi-factor tradeoffs</li>
                      <li>• Proposes alternatives that satisfy more requests</li>
                      <li>• Flags low-confidence decisions for human review</li>
                    </ul>
                  </CardContent>
                </Card>
            </div>

              <h3>Audit Trail</h3>
              <p>
                Every vacation decision is fully auditable with complete transparency:
              </p>

              <div className="not-prose my-4">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="text-base">Example Audit Entry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs font-mono">
                    <div><strong>Timestamp:</strong> 2025-01-10T14:30:00Z</div>
                    <div><strong>Radiologist:</strong> Basma Al-Arnawoot</div>
                    <div><strong>Request:</strong> P1, Week of Jan 20-26, marked &quot;flexible&quot;</div>
                    <Separator />
                    <div><strong>AI Decision:</strong> Assigned Week of Jan 27-Feb 2</div>
                    <div><strong>Confidence:</strong> 87% (HIGH)</div>
                    <div><strong>Reasoning:</strong><br />
                      - Original week: 2 BODY rads already assigned<br />
                      - Alternative week: Only 1 BODY rad<br />
                      - Improves mammo coverage (+0.30)<br />
                      - Improves fairness balance (+0.25)
            </div>
                    <Separator />
                    <div><strong>Outcome:</strong> APPROVED by Admin</div>
                  </CardContent>
                </Card>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardPage>
  )
}


