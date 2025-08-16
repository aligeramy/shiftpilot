'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RadiologistForPreferences, VacationPreference } from '@/lib/types/api'

interface VacationPreferenceFormProps {
  radiologist: RadiologistForPreferences
  onUpdate: () => void
  onClose: () => void
}

export function VacationPreferenceForm({ radiologist, onUpdate, onClose }: VacationPreferenceFormProps) {
  const [loading, setLoading] = useState(false)

  const generatePreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/preferences/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          userId: radiologist.id
        })
      })
      
      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error generating preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Vacation Preferences</CardTitle>
        <CardDescription>
          {radiologist.name} ({radiologist.email})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Preferences</p>
            <p className="text-sm text-muted-foreground">
              {radiologist.vacationPreferences?.length || 0} preferences set
            </p>
          </div>
          <Badge variant="outline">
            {radiologist.radiologistProfile?.subspecialty?.name}
          </Badge>
        </div>

        {(radiologist.vacationPreferences?.length ?? 0) > 0 && (
          <div className="space-y-2">
            {radiologist.vacationPreferences?.map((pref: VacationPreference) => (
              <div key={pref.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Choice #{pref.rank}</p>
                  <p className="text-sm text-muted-foreground">
                    Week {pref.weekNumber} - {new Date(pref.weekStartDate).toLocaleDateString()} to {new Date(pref.weekEndDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">{pref.status}</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={generatePreferences} disabled={loading}>
            {loading ? '...' : '🎲 Generate Random Preferences'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
