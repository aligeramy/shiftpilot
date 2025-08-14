"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface ShiftTypesSetupProps {
  organizationId: string
  onComplete: (data: any) => void
  onBack: () => void
  isLoading?: boolean
}

export function ShiftTypesSetup({ 
  organizationId, 
  onComplete, 
  onBack,
  isLoading 
}: ShiftTypesSetupProps) {
  const handleSubmit = () => {
    // TODO: Implement shift types setup
    onComplete({ shiftTypes: [] })
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Shift types configuration will be implemented here.
      </p>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  )
}
