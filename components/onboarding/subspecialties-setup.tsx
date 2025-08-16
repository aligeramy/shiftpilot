"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, X, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Subspecialty {
  code: string
  name: string
}

interface SubspecialtiesSetupProps {
  organizationId: string
  onComplete: (data: { subspecialties: Subspecialty[] }) => void
  onBack: () => void
  isLoading?: boolean
}

// Default subspecialties based on the real data
const DEFAULT_SUBSPECIALTIES: Subspecialty[] = [
  { code: 'NEURO', name: 'Neuroradiology' },
  { code: 'BODY', name: 'Body Imaging' },
  { code: 'MSK', name: 'Musculoskeletal' },
  { code: 'IR', name: 'Interventional Radiology' },
  { code: 'CHEST', name: 'Chest/Cardiac' },
  { code: 'INR', name: 'Interventional Neuroradiology' },
]

export function SubspecialtiesSetup({ 
  onComplete, 
  onBack,
  isLoading 
}: SubspecialtiesSetupProps) {
  const [subspecialties, setSubspecialties] = useState<Subspecialty[]>(DEFAULT_SUBSPECIALTIES)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const validateSubspecialties = () => {
    const validationErrors: string[] = []
    
    if (subspecialties.length === 0) {
      validationErrors.push('At least one subspecialty is required')
    }
    
    // Check for duplicates
    const codes = subspecialties.map(s => s.code)
    const uniqueCodes = new Set(codes)
    if (codes.length !== uniqueCodes.size) {
      validationErrors.push('Duplicate subspecialty codes found')
    }
    
    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const handleAddSubspecialty = () => {
    if (!newCode || !newName) {
      toast.error('Please fill in both code and name')
      return
    }

    // Validate code format
    if (!/^[A-Z0-9_]+$/.test(newCode)) {
      toast.error('Code must contain only uppercase letters, numbers, and underscores')
      return
    }

    // Check for duplicates
    if (subspecialties.some(s => s.code === newCode)) {
      toast.error('Subspecialty code already exists')
      return
    }

    setSubspecialties([...subspecialties, { code: newCode, name: newName }])
    setNewCode('')
    setNewName('')
    setErrors([])
  }

  const handleRemoveSubspecialty = (code: string) => {
    setSubspecialties(subspecialties.filter(s => s.code !== code))
    setErrors([])
  }

  const handleSubmit = () => {
    console.log('[SubspecialtiesSetup] Submitting:', subspecialties)
    
    if (!validateSubspecialties()) {
      return
    }

    onComplete({ subspecialties })
  }

  const handleQuickFill = () => {
    setSubspecialties(DEFAULT_SUBSPECIALTIES)
    setErrors([])
    toast.success('Default subspecialties loaded')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Define the medical subspecialties in your radiology department. These will be used to assign radiologists and configure shift eligibility.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFill}
            className="mb-4"
          >
            Load Default Subspecialties
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current subspecialties */}
      <div className="space-y-2">
        <Label>Current Subspecialties</Label>
        {subspecialties.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                No subspecialties added yet. Add at least one to continue.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {subspecialties.map((subspecialty) => (
              <Card key={subspecialty.code}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-medium">{subspecialty.code}</span>
                      <span className="mx-2">-</span>
                      <span className="text-sm">{subspecialty.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubspecialty(subspecialty.code)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add new subspecialty */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Subspecialty Code</Label>
              <Input
                id="code"
                placeholder="e.g., NEURO, BODY, MSK"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubspecialty()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use uppercase letters, numbers, and underscores only
              </p>
            </div>
            <div>
              <Label htmlFor="name">Subspecialty Name</Label>
              <Input
                id="name"
                placeholder="e.g., Neuroradiology, Body Imaging"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubspecialty()
                  }
                }}
              />
            </div>
            <Button
              onClick={handleAddSubspecialty}
              variant="outline"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Subspecialty
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
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
          disabled={isLoading || subspecialties.length === 0}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  )
}
