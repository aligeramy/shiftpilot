"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Building, Clock, Users, Settings, ArrowLeft, Shuffle } from "lucide-react"

interface OrganizationData {
  organization: {
    id: string
    name: string
    timezone: string
    weekStart: string
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
    recurrence: {
      mon: boolean
      tue: boolean
      wed: boolean
      thu: boolean
      fri: boolean
      sat: boolean
      sun: boolean
    }
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
  equivalenceSets?: Array<{
    id: string
    code: string
    name: string
    shiftCodes: string[]
  }>
}

export function OrganizationOverview() {
  const [data, setData] = useState<OrganizationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubspecialty, setSelectedSubspecialty] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'subspecialty'>('overview')

  // Color mapping for subspecialties and shift types
  const subspecialtyColors = {
    'NEURO': 'bg-blue-100 text-blue-800 border-blue-200',
    'IR': 'bg-red-100 text-red-800 border-red-200', 
    'BODY': 'bg-green-100 text-green-800 border-green-200',
    'MSK': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'CHEST': 'bg-purple-100 text-purple-800 border-purple-200',
    'INR': 'bg-pink-100 text-pink-800 border-pink-200',
    'XRUS': 'bg-gray-100 text-gray-800 border-gray-200',
    'ANY': 'bg-slate-100 text-slate-800 border-slate-200'
  }

  const getShiftColor = (shift: any) => {
    if (shift.eligibility.allowAny) return subspecialtyColors['ANY']
    if (shift.eligibility.requiredSubspecialty) {
      return subspecialtyColors[shift.eligibility.requiredSubspecialty.code as keyof typeof subspecialtyColors] || subspecialtyColors['ANY']
    }
    if (shift.eligibility.namedAllowlist?.length > 0) return 'bg-orange-100 text-orange-800 border-orange-200'
    return subspecialtyColors['ANY']
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/settings/overview')
        const result = await response.json()
        if (result.success) {
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch organization data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500 py-8">
        Failed to load organization data
      </div>
    )
  }

  const getDaysOfWeek = (recurrence: any) => {
    const days = []
    if (recurrence.mon) days.push('Mon')
    if (recurrence.tue) days.push('Tue')
    if (recurrence.wed) days.push('Wed')
    if (recurrence.thu) days.push('Thu')
    if (recurrence.fri) days.push('Fri')
    if (recurrence.sat) days.push('Sat')
    if (recurrence.sun) days.push('Sun')
    return days.join(', ')
  }

  const getEligibilityText = (eligibility: any) => {
    if (eligibility.allowAny) return 'Any radiologist'
    if (eligibility.requiredSubspecialty) return eligibility.requiredSubspecialty.name
    if (eligibility.namedAllowlist?.length > 0) return `Named: ${eligibility.namedAllowlist.length} people`
    return 'Not configured'
  }

  const handleSubspecialtyClick = (subspecialtyCode: string) => {
    setSelectedSubspecialty(subspecialtyCode)
    setViewMode('subspecialty')
  }

  const handleBackToOverview = () => {
    setSelectedSubspecialty(null)
    setViewMode('overview')
  }

  const getFilteredData = () => {
    if (!data || !selectedSubspecialty) return data

    const filteredStaff = data.staff.filter(member => member.subspecialty === selectedSubspecialty)
    const filteredShifts = data.shiftTypes.filter(shift => 
      shift.eligibility.requiredSubspecialty?.code === selectedSubspecialty ||
      shift.eligibility.allowAny
    )
    const relevantEquivalenceSets = data.equivalenceSets?.filter(set => 
      set.shiftCodes.some(code => 
        filteredShifts.some(shift => shift.code === code)
      )
    ) || []

    return {
      ...data,
      staff: filteredStaff,
      shiftTypes: filteredShifts,
      equivalenceSets: relevantEquivalenceSets
    }
  }

  const displayData = getFilteredData()
  
  // Group staff by subspecialty
  const staffBySubspecialty = displayData?.staff.reduce((acc, member) => {
    if (!acc[member.subspecialty]) {
      acc[member.subspecialty] = []
    }
    acc[member.subspecialty].push(member)
    return acc
  }, {} as Record<string, typeof displayData.staff>) || {}

  const selectedSubspecialtyInfo = data?.subspecialties.find(s => s.code === selectedSubspecialty)

  return (
    <div className="space-y-6">
      {/* Header with back button when in subspecialty view */}
      {viewMode === 'subspecialty' && selectedSubspecialtyInfo && (
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToOverview}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedSubspecialtyInfo.name} Details</h2>
            <p className="text-slate-600">Viewing staff and shifts for {selectedSubspecialtyInfo.code}</p>
          </div>
        </div>
      )}

      {/* Color Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Color Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(subspecialtyColors).map(([code, colorClass]) => (
              <Badge key={code} className={`${colorClass} border`}>
                {code === 'ANY' ? 'Any Subspecialty' : code}
              </Badge>
            ))}
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 border">
              Named Only
            </Badge>
          </div>
        </CardContent>
      </Card>
      {/* Organization Info - only show in overview mode */}
      {viewMode === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium text-slate-800">Name</h4>
                <p className="text-slate-600">{data.organization.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Timezone</h4>
                <p className="text-slate-600">{data.organization.timezone}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Week Start</h4>
                <p className="text-slate-600">{data.organization.weekStart}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subspecialties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Subspecialties ({data.subspecialties.length})
              {viewMode === 'subspecialty' && (
                <span className="text-sm font-normal text-slate-500">
                  - Filtered for {selectedSubspecialtyInfo?.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.subspecialties.map((subspecialty) => {
                const colorClass = subspecialtyColors[subspecialty.code as keyof typeof subspecialtyColors] || subspecialtyColors['ANY']
                const isSelected = selectedSubspecialty === subspecialty.code
                return (
                  <Badge 
                    key={subspecialty.id} 
                    className={`${colorClass} border cursor-pointer hover:opacity-80 transition-opacity ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleSubspecialtyClick(subspecialty.code)}
                  >
                    {subspecialty.code} - {subspecialty.name}
                  </Badge>
                )
              })}
            </div>
            {viewMode === 'overview' && (
              <p className="text-xs text-slate-500 mt-2">
                Click on a subspecialty to view detailed information
              </p>
            )}
          </CardContent>
        </Card>

        {/* Staff by Subspecialty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff by Subspecialty ({data.staff.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(staffBySubspecialty).map(([subspecialty, members]) => (
                <div key={subspecialty} className="flex justify-between items-center">
                  <span className="font-medium">{subspecialty}</span>
                  <Badge variant="outline">{members.length} members</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Shift Types ({data.shiftTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Code</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Hours</th>
                  <th className="text-left p-2">Days</th>
                  <th className="text-left p-2">Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {data.shiftTypes.map((shift) => (
                  <tr key={shift.id} className="border-b hover:bg-slate-50">
                    <td className="p-2 font-mono text-xs">{shift.code}</td>
                    <td className="p-2">{shift.name}</td>
                    <td className="p-2 font-mono text-xs">
                      {shift.isAllDay ? 'All Day' : `${shift.startTime}-${shift.endTime}`}
                    </td>
                    <td className="p-2 text-xs">{getDaysOfWeek(shift.recurrence)}</td>
                    <td className="p-2 text-xs">
                      <Badge 
                        variant={shift.eligibility.allowAny ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {getEligibilityText(shift.eligibility)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
