"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface RosterImportProps {
  organizationId: string
  onComplete: (data: any) => void
  onBack: () => void
  isLoading?: boolean
}

export function RosterImport({ 
  organizationId, 
  onComplete, 
  onBack,
  isLoading 
}: RosterImportProps) {
  const handleSubmit = () => {
    // TODO: Implement roster import
    onComplete({ roster: [] })
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Roster import will be implemented here.
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
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
