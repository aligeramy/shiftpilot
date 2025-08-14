"use client"

import { useState } from 'react'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  testName: string
  passed: boolean
  details: string
  metrics?: Record<string, number>
  issues?: string[]
  recommendations?: string[]
}

interface TestSuite {
  suiteName: string
  results: TestResult[]
  summary: {
    total: number
    passed: number
    failed: number
    score: number
  }
}

interface TestResponse {
  success: boolean
  timestamp: string
  testSuites: TestSuite[]
  overallSummary: {
    totalSuites: number
    totalTests: number
    totalPassed: number
    totalFailed: number
    score: number
    suiteScores: { name: string; score: number }[]
  }
  recommendations: string[]
  systemHealth: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL'
}

export default function TestingPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResponse | null>(null)
  const [selectedSuite, setSelectedSuite] = useState<string>('')

  const runComprehensiveTests = async () => {
    setIsRunning(true)
    setTestResults(null)
    
    try {
      toast.info('Starting comprehensive test suite...')
      
      const response = await fetch('/api/test/comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTestResults(data)
        toast.success(`Tests completed! Overall score: ${data.overallSummary.score.toFixed(1)}%`)
      } else {
        toast.error(`Test suite failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Test execution failed:', error)
      toast.error('Failed to run test suite')
    } finally {
      setIsRunning(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'HEALTHY': return 'text-green-600 bg-green-50'
      case 'NEEDS_ATTENTION': return 'text-yellow-600 bg-yellow-50'
      case 'CRITICAL': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'HEALTHY': return <CheckCircle className="h-5 w-5" />
      case 'NEEDS_ATTENTION': return <AlertTriangle className="h-5 w-5" />
      case 'CRITICAL': return <XCircle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  return (
    <DashboardPage
      customBreadcrumbs={[
        { label: "Dashboard", href: "/home" },
        { label: "System Testing" }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Comprehensive System Testing</h1>
            <p className="text-muted-foreground">
              Test all calendar features: schedule generation, fairness, preferences, constraints, and performance.
            </p>
          </div>
          
          <Button 
            onClick={runComprehensiveTests} 
            disabled={isRunning}
            size="lg"
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>

        {/* Test Results Overview */}
        {testResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 p-2 rounded-md ${getHealthColor(testResults.systemHealth)}`}>
                  {getHealthIcon(testResults.systemHealth)}
                  <span className="font-medium">{testResults.systemHealth.replace('_', ' ')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.overallSummary.score.toFixed(1)}%
                </div>
                <Progress value={testResults.overallSummary.score} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {testResults.overallSummary.totalPassed}
                </div>
                <p className="text-sm text-muted-foreground">
                  of {testResults.overallSummary.totalTests} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Test Suites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testResults.overallSummary.totalSuites}
                </div>
                <p className="text-sm text-muted-foreground">
                  Completed suites
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Results */}
        {testResults && (
          <Tabs value={selectedSuite || testResults.testSuites[0]?.suiteName} onValueChange={setSelectedSuite}>
            <TabsList className="grid w-full grid-cols-6">
              {testResults.testSuites.map((suite) => (
                <TabsTrigger key={suite.suiteName} value={suite.suiteName} className="text-xs">
                  <div className="flex items-center gap-2">
                    {suite.suiteName === 'Schedule Generation' && <Calendar className="h-3 w-3" />}
                    {suite.suiteName === 'Fairness System' && <TrendingUp className="h-3 w-3" />}
                    {suite.suiteName === 'Vacation Preferences' && <Users className="h-3 w-3" />}
                    {suite.suiteName === 'Constraint Validation' && <CheckCircle className="h-3 w-3" />}
                    {suite.suiteName === 'Edge Cases' && <AlertTriangle className="h-3 w-3" />}
                    {suite.suiteName === 'Performance' && <Zap className="h-3 w-3" />}
                    <span className="hidden sm:inline">{suite.suiteName.split(' ')[0]}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {testResults.testSuites.map((suite) => (
              <TabsContent key={suite.suiteName} value={suite.suiteName}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{suite.suiteName}</CardTitle>
                      <Badge variant={suite.summary.score >= 80 ? "default" : suite.summary.score >= 60 ? "secondary" : "destructive"}>
                        {suite.summary.score.toFixed(1)}% ({suite.summary.passed}/{suite.summary.total})
                      </Badge>
                    </div>
                    <CardDescription>
                      {suite.summary.passed} passed, {suite.summary.failed} failed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suite.results.map((result, index) => (
                        <Card key={index} className={result.passed ? "border-green-200" : "border-red-200"}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {result.testName}
                              </CardTitle>
                              {result.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-3">
                              {result.details}
                            </p>
                            
                            {result.metrics && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                {Object.entries(result.metrics).map(([key, value]) => (
                                  <div key={key} className="bg-gray-50 p-2 rounded">
                                    <div className="font-medium">{key}</div>
                                    <div className="text-muted-foreground">
                                      {typeof value === 'number' ? value.toFixed(1) : value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {result.issues && (
                              <div className="mt-3">
                                <h4 className="text-xs font-medium text-red-600 mb-1">Issues:</h4>
                                <ul className="text-xs text-red-600 space-y-1">
                                  {result.issues.map((issue, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span>•</span>
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {result.recommendations && (
                              <div className="mt-3">
                                <h4 className="text-xs font-medium text-yellow-600 mb-1">Recommendations:</h4>
                                <ul className="text-xs text-yellow-600 space-y-1">
                                  {result.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span>•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* System Recommendations */}
        {testResults && testResults.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                System Recommendations
              </CardTitle>
              <CardDescription>
                Suggested improvements based on test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {testResults.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Test History / Metadata */}
        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle>Test Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Timestamp</div>
                  <div className="text-muted-foreground">
                    {new Date(testResults.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Total Suites</div>
                  <div className="text-muted-foreground">{testResults.overallSummary.totalSuites}</div>
                </div>
                <div>
                  <div className="font-medium">Total Tests</div>
                  <div className="text-muted-foreground">{testResults.overallSummary.totalTests}</div>
                </div>
                <div>
                  <div className="font-medium">System Health</div>
                  <div className="text-muted-foreground">{testResults.systemHealth}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPage>
  )
}
