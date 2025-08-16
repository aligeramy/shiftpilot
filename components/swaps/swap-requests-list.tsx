'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, User, Calendar, ArrowRightLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import type { SwapRequestFromApi } from '@/lib/types/api'

interface SwapRequest {
  id: string
  status: 'OPEN' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED'
  notes?: string
  createdAt: string
  requester: {
    id: string
    name: string
    email: string
  }
  assignment: {
    id: string
    date: string
    shift: {
      name: string
      startTime: string
      endTime: string
      subspecialty: string
    }
  }
  offers: Array<{
    id: string
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
    notes?: string
    targetUser: {
      id: string
      name: string
      email: string
    }
    targetAssignment: {
      id: string
      date: string
      shift: {
        name: string
        startTime: string
        endTime: string
        subspecialty: string
      }
    }
  }>
}

interface SwapRequestsListProps {
  organizationId: string
  showAll?: boolean
}

export function SwapRequestsList({ showAll = false }: SwapRequestsListProps) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSwapRequests = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (!showAll) {
        params.append('status', 'OPEN')
      }
      
      const response = await fetch(`/api/swaps?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load swap requests')
      
      const data = await response.json()
      console.log('Raw swap data:', data) // Debug log
      
      // Transform the data to match our interface
      const transformedRequests = (data.swapRequests || []).map((request: SwapRequestFromApi) => ({
        id: request.id,
        status: request.status,
        notes: request.notes,
        createdAt: request.createdAt,
        requester: request.requester,
        assignment: {
          id: request.assignment.id,
          date: request.assignment.instance.date,
          shift: {
            name: request.assignment.instance.shiftType.name,
            startTime: request.assignment.instance.shiftType.startTime,
            endTime: request.assignment.instance.shiftType.endTime,
            subspecialty: 'General'
          }
        },
        offers: (request.offers || []).map((offer) => ({
          id: offer.id,
          status: offer.status,
          notes: offer.notes,
          targetUser: offer.targetUser,
          targetAssignment: {
            id: offer.targetAssignment?.id || '',
            date: offer.targetAssignment?.instance?.date || '',
            shift: {
              name: offer.targetAssignment?.instance?.shiftType?.name || '',
              startTime: offer.targetAssignment?.instance?.shiftType?.startTime || '',
              endTime: offer.targetAssignment?.instance?.shiftType?.endTime || '',
              subspecialty: 'General'
            }
          }
        }))
      }))
      
      setSwapRequests(transformedRequests)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load swap requests')
    } finally {
      setLoading(false)
    }
  }, [showAll])

  useEffect(() => {
    loadSwapRequests()
  }, [loadSwapRequests])

  const respondToOffer = async (offerId: string, response: 'ACCEPTED' | 'DECLINED', notes?: string) => {
    try {
      setLoading(true)
      
      const res = await fetch(`/api/swaps/offers/${offerId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, notes })
      })
      
      if (!res.ok) throw new Error('Failed to respond to offer')
      
      // Reload the swap requests
      await loadSwapRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to offer')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Open</Badge>
      case 'ACCEPTED':
        return <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      case 'CANCELLED':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      case 'EXPIRED':
        return <Badge variant="outline" className="text-red-600 border-red-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
      case 'DECLINED':
        return <Badge variant="outline" className="text-red-600 border-red-600">Declined</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading swap requests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (swapRequests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{showAll ? 'No swap requests found' : 'No pending swap requests'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {swapRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Swap Request
              </CardTitle>
              {getStatusBadge(request.status)}
            </div>
            <CardDescription>
              Created {format(new Date(request.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Requester Info */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 mt-0.5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{request.requester.name} wants to swap:</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-blue-700">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(request.assignment.date), 'MMM dd, yyyy')} - 
                    {request.assignment.shift.name} 
                    ({request.assignment.shift.startTime}-{request.assignment.shift.endTime})
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Subspecialty: {request.assignment.shift.subspecialty || 'General'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {request.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{request.notes}</p>
                </div>
              )}

              {/* Offers */}
              {request.offers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Swap Offers:</h4>
                  {request.offers.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{offer.targetUser.name}</span>
                          {getStatusBadge(offer.status)}
                        </div>
                        
                        {offer.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => respondToOffer(offer.id, 'ACCEPTED')}
                              disabled={loading}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => respondToOffer(offer.id, 'DECLINED')}
                              disabled={loading}
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(offer.targetAssignment.date), 'MMM dd, yyyy')} - 
                          {offer.targetAssignment.shift.name} 
                          ({offer.targetAssignment.shift.startTime}-{offer.targetAssignment.shift.endTime})
                        </div>
                        <p className="mt-1">
                          Subspecialty: {offer.targetAssignment.shift.subspecialty || 'General'}
                        </p>
                      </div>

                      {offer.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          {offer.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
