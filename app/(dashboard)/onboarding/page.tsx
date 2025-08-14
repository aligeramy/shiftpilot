"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { 
  Building2, 
  Users, 
  Clock, 
  UserCheck, 
  CheckCircle2,
  Settings,
  Calendar,
  Star,
  Shield
} from 'lucide-react'

// Onboarding step components
import { OrganizationSetup } from '@/components/onboarding/organization-setup'
import { SubspecialtiesSetup } from '@/components/onboarding/subspecialties-setup'
import { ShiftTypesSetup } from '@/components/onboarding/shift-types-setup'
import { RosterImport } from '@/components/onboarding/roster-import'

const ONBOARDING_STEPS = [
  { id: 1, name: 'Organization', description: 'Set up your clinic details' },
  { id: 2, name: 'Subspecialties', description: 'Define medical specialties' },
  { id: 3, name: 'Shift Types', description: 'Configure shift patterns' },
  { id: 4, name: 'Team Roster', description: 'Import your radiologists' }
]

interface OrganizationData {
  organization: {
    id: string
    name: string
    timezone: string
    weekStart: string
    onboardingComplete: boolean
  }
  subspecialties: Array<{
    id: string
    code: string
    name: string
  }>
  shiftTypes: Array<{
    id: string
    code: string
    name: string
    startTime: string
    endTime: string
    isAllDay: boolean
    eligibility: {
      requiredSubspecialty?: { code: string; name: string }
      allowAny: boolean
      namedAllowlist: string[]
    }
  }>
  staff: Array<{
    id: string
    name: string
    email: string
    subspecialty: string
    subspecialtyName: string
    ftePercent: number
  }>
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showShowcase, setShowShowcase] = useState(false)
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null)
  
  // Check if user has an organization and their onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      const data = await response.json()
      
      if (data.organization) {
        setOrganizationId(data.organization.id)
        setCurrentStep(data.organization.onboardingStep || 1)
        
        if (data.organization.onboardingComplete) {
          // Load full organization data for showcase
          await loadOrganizationData()
          setShowShowcase(true)
        }
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
    }
  }

  // Load complete organization data for showcase
  const loadOrganizationData = async () => {
    try {
      const response = await fetch('/api/settings/overview')
      const data = await response.json()
      if (data.success) {
        setOrganizationData(data)
      }
    } catch (error) {
      console.error('Failed to load organization data:', error)
    }
  }

  useEffect(() => {
    checkOnboardingStatus()
  }, [checkOnboardingStatus])

  const handleStepComplete = async (stepData: unknown) => {
    setIsLoading(true)
    
    try {
      // Save step data
      const response = await fetch(`/api/onboarding/step-${currentStep}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save step')
      }
      
      // Update organization ID if we just created it
      if (currentStep === 1 && result.organizationId) {
        setOrganizationId(result.organizationId)
      }
      
      // Move to next step or complete onboarding
      if (currentStep < ONBOARDING_STEPS.length) {
        setCurrentStep(currentStep + 1)
        toast.success(`Step ${currentStep} completed!`)
      } else {
        // Complete onboarding
        await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId })
        })
        
        toast.success('Onboarding completed! Redirecting...')
        setTimeout(() => router.push('/home'), 1500)
      }
    } catch (error) {
      console.error('Error completing step:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to complete step')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / ONBOARDING_STEPS.length) * 100

  // Beautiful onboarding showcase for completed setups
  const renderOnboardingShowcase = () => {
    if (!organizationData) return null

    const subspecialtyColors = {
      'NEURO': 'bg-blue-100 text-blue-800',
      'IR': 'bg-red-100 text-red-800',
      'BODY': 'bg-green-100 text-green-800', 
      'MSK': 'bg-yellow-100 text-yellow-800',
      'CHEST': 'bg-purple-100 text-purple-800'
    }

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-3">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Setup Complete! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your radiology scheduling system is fully configured and ready to use. 
            Here&apos;s everything that&apos;s been set up for your organization.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => router.push('/schedule')} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Calendar className="h-4 w-4 mr-2" />
              Start Scheduling
            </Button>
            <Button variant="outline" onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Settings
            </Button>
          </div>
        </div>

        {/* Onboarding Steps Showcase */}
        <div className="grid gap-8">
          
          {/* Step 1: Organization */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-blue-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Step 1: Organization
                    <Badge className="bg-green-500">Complete</Badge>
                  </CardTitle>
                  <CardDescription>Your clinic details and settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-green-600 mb-2">
                      {organizationData.organization.name}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Timezone:</span>
                        <Badge variant="outline">{organizationData.organization.timezone}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Week Start:</span>
                        <Badge variant="outline">{organizationData.organization.weekStart}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">System Status</h5>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Fully configured and operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Subspecialties */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Step 2: Subspecialties
                    <Badge className="bg-blue-500">Complete</Badge>
                  </CardTitle>
                  <CardDescription>Medical specialties and areas of expertise</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>{organizationData.subspecialties.length}</strong> subspecialties configured
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {organizationData.subspecialties.map((subspecialty) => (
                    <div
                      key={subspecialty.id}
                      className={`p-3 rounded-lg border text-center ${
                        subspecialtyColors[subspecialty.code as keyof typeof subspecialtyColors] || 
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="font-semibold text-sm">{subspecialty.code}</div>
                      <div className="text-xs opacity-75">{subspecialty.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Shift Types */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-pink-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Step 3: Shift Types
                    <Badge className="bg-purple-500">Complete</Badge>
                  </CardTitle>
                  <CardDescription>Shift patterns and scheduling rules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>{organizationData.shiftTypes.length}</strong> shift types configured
                </p>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {organizationData.shiftTypes.slice(0, 8).map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border">
                      <div>
                        <div className="font-semibold text-sm">{shift.code}</div>
                        <div className="text-xs text-muted-foreground">{shift.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono">
                          {shift.isAllDay ? 'All Day' : `${shift.startTime}-${shift.endTime}`}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {shift.eligibility.allowAny 
                            ? 'Any' 
                            : shift.eligibility.requiredSubspecialty?.code 
                            || `Named (${shift.eligibility.namedAllowlist.length})`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {organizationData.shiftTypes.length > 8 && (
                    <div className="text-center text-sm text-muted-foreground">
                      +{organizationData.shiftTypes.length - 8} more shift types
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Staff Roster */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-400 to-red-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Step 4: Team Roster
                    <Badge className="bg-pink-500">Complete</Badge>
                  </CardTitle>
                  <CardDescription>Your radiologist team members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>{organizationData.staff.length}</strong> radiologists imported
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {organizationData.staff.slice(0, 12).map((person) => (
                    <div key={person.id} className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-red-50 p-3 rounded-lg border">
                      <div className="bg-white rounded-full p-2 border">
                        <UserCheck className="h-4 w-4 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{person.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge className={`text-xs ${
                            subspecialtyColors[person.subspecialty as keyof typeof subspecialtyColors] || 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {person.subspecialty}
                          </Badge>
                          <span>{person.ftePercent}% FTE</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {organizationData.staff.length > 12 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{organizationData.staff.length - 12} more team members
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              You&apos;re All Set!
            </CardTitle>
            <CardDescription>
              Your ShiftPilot system is ready to generate intelligent schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Generate Schedules</h4>
                <p className="text-sm text-muted-foreground">Create AI-powered schedules with vacation preferences and fairness</p>
              </div>
              <div className="text-center p-4">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Manage Swaps</div>
                <p className="text-sm text-muted-foreground">Enable shift exchanges between radiologists</p>
              </div>
              <div className="text-center p-4">
                <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Fine-tune System</h4>
                <p className="text-sm text-muted-foreground">Adjust settings, add staff, or modify shift types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrganizationSetup
            onComplete={handleStepComplete}
            isLoading={isLoading}
          />
        )
      case 2:
        return (
          <SubspecialtiesSetup
            organizationId={organizationId!}
            onComplete={handleStepComplete}
            onBack={handlePreviousStep}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <ShiftTypesSetup
            organizationId={organizationId!}
            onComplete={handleStepComplete}
            onBack={handlePreviousStep}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <RosterImport
            organizationId={organizationId!}
            onComplete={handleStepComplete}
            onBack={handlePreviousStep}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // Show showcase if onboarding is complete
  if (showShowcase) {
    return (
      <DashboardPage>
        <div className="space-y-8 max-w-6xl mx-auto">
          {renderOnboardingShowcase()}
        </div>
      </DashboardPage>
    )
  }

  // Show regular onboarding process
  return (
    <DashboardPage>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to ShiftPilot</h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your radiology scheduling system in just a few steps.
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-2">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}
              >
                {step.name}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {ONBOARDING_STEPS[currentStep - 1].name}
            </CardTitle>
            <CardDescription>
              {ONBOARDING_STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
