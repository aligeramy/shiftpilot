"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

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

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if user has an organization and their onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      const data = await response.json()
      
      if (data.organization) {
        setOrganizationId(data.organization.id)
        setCurrentStep(data.organization.onboardingStep || 1)
        
        if (data.organization.onboardingComplete) {
          router.push('/home')
        }
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
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

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to ShiftPilot</h1>
        <p className="text-muted-foreground">
          Let&apos;s set up your radiology scheduling system in just a few steps.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
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
  )
}
