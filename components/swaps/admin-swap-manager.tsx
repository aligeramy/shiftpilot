'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRightLeft, Clock, AlertTriangle, CheckCircle, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface SwapManagerProps {
  organizationId: string
}

interface Assignment {
  id: string
  date: string
  shift: {
    id: string
    name: string
    startTime: string
    endTime: string
    subspecialty: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface EligiblePartner {
  assignment: Assignment
  swapType: 'SAME_TYPE' | 'EQUIVALENT_TYPE'
  canSwap: boolean
  conflicts: {
    requester: any[]
    target: any[]
  }
  eligibilityChecks: {
    canRequesterWorkTarget: boolean
    canTargetWorkRequester: boolean
    isSameShiftType: boolean
    isInEquivalenceSet: boolean
  }
}

export function AdminSwapManager({ organizationId }: SwapManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [eligiblePartners, setEligiblePartners] = useState<EligiblePartner[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load assignments for the current month
  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      
      const response = await fetch(`/api/test/schedule/${organizationId}/${year}/${month}`)
      if (!response.ok) throw new Error('Failed to load assignments')
      
      const data = await response.json()
      
      // Handle the actual data structure from the test schedule API
      const allAssignments: Assignment[] = []
      
      if (data.data?.rawSchedule && Array.isArray(data.data.rawSchedule)) {
        // The test API returns a flat array of schedule items
        data.data.rawSchedule.forEach((scheduleItem: any) => {
          // Each schedule item has assignedTo array
          if (scheduleItem.assignedTo && Array.isArray(scheduleItem.assignedTo)) {
            scheduleItem.assignedTo.forEach((assignedUser: any, index: number) => {
              allAssignments.push({
                id: `${scheduleItem.date}-${scheduleItem.shiftCode}-${index}`, // Generate ID
                date: scheduleItem.date,
                shift: {
                  id: scheduleItem.shiftCode,
                  name: scheduleItem.shiftName,
                  startTime: scheduleItem.shiftTime.includes('-') ? scheduleItem.shiftTime.split('-')[0] : '08:00',
                  endTime: scheduleItem.shiftTime.includes('-') ? scheduleItem.shiftTime.split('-')[1] : '16:00',
                  subspecialty: scheduleItem.requiredSubspecialty || 'General'
                },
                user: {
                  id: assignedUser.email, // Use email as ID
                  name: assignedUser.name,
                  email: assignedUser.email
                }
              })
            })
          }
        })
      } else {
        console.error('Invalid data structure received:', data)
        throw new Error('Invalid data structure received from API')
      }
      
      // Sort by date and then by shift start time
      allAssignments.sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
        if (dateCompare !== 0) return dateCompare
        return a.shift.startTime.localeCompare(b.shift.startTime)
      })
      
      setAssignments(allAssignments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const findEligiblePartners = async (assignment: Assignment) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/swaps/eligible-partners?assignmentId=${assignment.id}`
      )
      
      if (!response.ok) throw new Error('Failed to find eligible partners')
      
      const data = await response.json()
      console.log('Eligible partners data:', data) // Debug log
      
      // The eligible partners API should return actual eligible partners
      // For now, let's handle both potential formats
      if (data.eligiblePartners && Array.isArray(data.eligiblePartners)) {
        setEligiblePartners(data.eligiblePartners)
      } else {
        // If no eligible partners found, show empty list
        console.warn('No eligible partners found or invalid format')
        setEligiblePartners([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find eligible partners')
      setEligiblePartners([])
    } finally {
      setLoading(false)
    }
  }

  const handleAssignmentSelect = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (assignment) {
      setSelectedAssignment(assignment)
      findEligiblePartners(assignment)
    }
  }

  const createSwapRequest = async (targetAssignment: Assignment) => {
    if (!selectedAssignment) return
    
    try {
      setLoading(true)
      
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          notes: `Admin-initiated swap: ${selectedAssignment.user.name} (${selectedAssignment.shift.name}) ↔ ${targetAssignment.user.name} (${targetAssignment.shift.name})`
        })
      })
      
      if (!response.ok) throw new Error('Failed to create swap request')
      
      const swapRequest = await response.json()
      
      // Create offer to target user
      const offerResponse = await fetch(`/api/swaps/${swapRequest.id}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserIds: [targetAssignment.user.id],
          targetAssignmentIds: [targetAssignment.id]
        })
      })
      
      if (!offerResponse.ok) throw new Error('Failed to create swap offer')
      
      alert('Swap request created successfully!')
      
      // Refresh the eligible partners
      findEligiblePartners(selectedAssignment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create swap request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Admin Swap Manager
          </CardTitle>
          <CardDescription>
            Select an assignment to find eligible swap partners and initiate swaps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Assignment to Swap
              </label>
              <Select onValueChange={handleAssignmentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assignment..." />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(assignment.date), 'MMM dd')} - 
                        {assignment.shift.name} ({assignment.shift.startTime}-{assignment.shift.endTime}) - 
                        {assignment.user.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAssignment && (
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>Selected:</strong> {selectedAssignment.user.name} - {selectedAssignment.shift.name} 
                  ({selectedAssignment.shift.startTime}-{selectedAssignment.shift.endTime}) 
                  on {format(new Date(selectedAssignment.date), 'MMMM dd, yyyy')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Finding eligible partners...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {eligiblePartners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eligible Swap Partners ({eligiblePartners.length})</CardTitle>
            <CardDescription>
              These radiologists can potentially swap with the selected assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eligiblePartners.map((partner) => (
                <div
                  key={partner.assignment.id}
                  className={`border rounded-lg p-4 ${
                    partner.canSwap 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{partner.assignment.user.name}</span>
                        <Badge variant={partner.swapType === 'SAME_TYPE' ? 'default' : 'secondary'}>
                          {partner.swapType === 'SAME_TYPE' ? 'Same Shift' : 'Equivalent Shift'}
                        </Badge>
                        {partner.canSwap ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Conflicts
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {partner.assignment.shift.name} ({partner.assignment.shift.startTime}-{partner.assignment.shift.endTime})
                        </div>
                        <div>
                          Subspecialty: {partner.assignment.shift.subspecialty || 'General'}
                        </div>
                      </div>

                      {!partner.canSwap && (
                        <div className="mt-2 text-sm">
                          <p className="text-yellow-700 font-medium">Conflicts:</p>
                          {partner.conflicts.requester.length > 0 && (
                            <p className="text-yellow-600">
                              • {selectedAssignment?.user.name} has conflicts: {
                                partner.conflicts.requester.map(c => c.shiftName).join(', ')
                              }
                            </p>
                          )}
                          {partner.conflicts.target.length > 0 && (
                            <p className="text-yellow-600">
                              • {partner.assignment.user.name} has conflicts: {
                                partner.conflicts.target.map(c => c.shiftName).join(', ')
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => createSwapRequest(partner.assignment)}
                      disabled={!partner.canSwap || loading}
                      size="sm"
                    >
                      Create Swap
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAssignment && eligiblePartners.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No eligible swap partners found for this assignment.</p>
              <p className="text-sm mt-2">
                This could be due to subspecialty requirements, time conflicts, or no matching shifts.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
