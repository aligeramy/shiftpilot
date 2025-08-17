'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { EditableItem } from '@/lib/types/api'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building2, 
  Star, 
  Clock, 
  Users,
  GraduationCap,
  UserCheck
} from 'lucide-react'

interface SettingsData {
  success: boolean
  organization?: {
    id: string
    name: string
    timezone: string
    weekStart: string
  }
  subspecialties?: Array<{
    id: string
    code: string
    name: string
  }>
  shiftTypes?: Array<{
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
      requiredSubspecialty: { code: string; name: string } | null
      allowAny: boolean
      namedAllowlist: string[]
    }
  }>
  staff?: Array<{
    id: string
    name: string | null
    email: string
    subspecialty: string | null
    subspecialtyName: string | null
    ftePercent: number | null
    isFellow: boolean
    isResident: boolean
  }>
}

interface EditState {
  type: 'subspecialty' | 'shiftType' | 'staff' | null
  mode: 'add' | 'edit' | null
  item: EditableItem | null
}

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' }
]

export function EditableSettings() {
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editState, setEditState] = useState<EditState>({ type: null, mode: null, item: null })
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const loadData = async () => {
    try {
      const res = await fetch('/api/settings/overview')
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (type: EditState['type'], mode: EditState['mode'], item?: EditableItem) => {
    setEditState({ type, mode, item: item ?? null })
    
    if (mode === 'add') {
      switch (type) {
        case 'subspecialty':
          setFormData({ code: '', name: '' })
          break
        case 'shiftType':
          setFormData({
            code: '',
            name: '',
            startTime: '08:00',
            endTime: '16:00',
            isAllDay: false,
            recurrence: {
              mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false
            },
            eligibilityType: 'any',
            requiredSubspecialtyId: '',
            namedAllowlist: ''
          })
          break
        case 'staff':
          setFormData({ name: '', email: '', subspecialtyId: '', ftePercent: 100, isFellow: false, isResident: false })
          break
      }
    } else if (mode === 'edit' && item) {
      switch (type) {
        case 'subspecialty':
          setFormData({ ...item })
          break
        case 'shiftType':
          setFormData({
            ...item,
            eligibilityType: 'any',
            requiredSubspecialtyId: '',
            namedAllowlist: ''
          })
          break
        case 'staff':
          setFormData({ 
            ...item, 
            subspecialtyId: '',
            ftePercent: 100,
            isFellow: item.isFellow || false,
            isResident: item.isResident || false
          })
          break
      }
    }
  }

  const handleSave = async () => {
    if (!editState.type) return

    try {
      const endpoint = `/api/settings/${editState.type}${editState.mode === 'edit' ? `/${editState.item?.id}` : ''}`
      const method = editState.mode === 'add' ? 'POST' : 'PUT'
      
      // Transform form data based on type
      let payload = { ...formData } as Record<string, unknown>
      
      if (editState.type === 'shiftType') {
        // Transform shift type data
        const shiftFormData = payload as Record<string, unknown>
        payload = {
          ...payload,
          namedAllowlist: typeof shiftFormData.namedAllowlist === 'string' ? shiftFormData.namedAllowlist.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          eligibility: {
            allowAny: shiftFormData.eligibilityType === 'any',
            requiredSubspecialtyId: shiftFormData.eligibilityType === 'subspecialty' ? shiftFormData.requiredSubspecialtyId : null,
            namedAllowlist: shiftFormData.eligibilityType === 'named' ? (typeof shiftFormData.namedAllowlist === 'string' ? shiftFormData.namedAllowlist.split(',').map((s: string) => s.trim()).filter(Boolean) : []) : []
          }
        }
        delete payload.eligibilityType
        delete payload.requiredSubspecialtyId
      }
      
      if (editState.type === 'staff') {
        const staffFormData = payload as Record<string, unknown>
        // Ensure FTE is a number and within valid range
        payload.ftePercent = Math.max(10, Math.min(100, Number(staffFormData.ftePercent) || 100))
        // Convert empty subspecialtyId to null
        if (!staffFormData.subspecialtyId) {
          payload.subspecialtyId = null
        }
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(`${editState.type} ${editState.mode === 'add' ? 'created' : 'updated'} successfully`)
        await loadData()
        setEditState({ type: null, mode: null, item: null })
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to save')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save')
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      const res = await fetch(`/api/settings/${type}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`${type} deleted successfully`)
        await loadData()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete')
    }
  }

  const renderSubspecialties = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" />
            <CardTitle>Subspecialties</CardTitle>
          </div>
          <Button size="sm" onClick={() => handleEdit('subspecialty', 'add')}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <CardDescription>Medical specialty areas</CardDescription>
      </CardHeader>
      <CardContent>
        {editState.type === 'subspecialty' && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={String(formData.code || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. NEURO"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={String(formData.name || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Neuroradiology"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditState({ type: null, mode: null, item: null })}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data?.subspecialties?.map((subspecialty) => (
            <div 
              key={subspecialty.id} 
              className="group relative bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="font-semibold text-sm">{subspecialty.code}</div>
                <div className="text-xs text-muted-foreground">{subspecialty.name}</div>
              </div>
              
              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white shadow-sm" 
                  onClick={() => handleEdit('subspecialty', 'edit', subspecialty)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white hover:text-red-600 shadow-sm" 
                  onClick={() => handleDelete('subspecialty', subspecialty.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderShiftTypes = () => (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <CardTitle>Shift Types</CardTitle>
          </div>
          <Button size="sm" onClick={() => handleEdit('shiftType', 'add')}>
            <Plus className="h-4 w-4 mr-1" />
            Add Shift
          </Button>
        </div>
        <CardDescription>Define shift patterns and eligibility rules</CardDescription>
      </CardHeader>
      <CardContent>
        {editState.type === 'shiftType' && (
          <Card className="mb-6 bg-purple-50 border-purple-200">
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shift-code">Code</Label>
                  <Input
                    id="shift-code"
                    value={String(formData.code || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. N1"
                  />
                </div>
                <div>
                  <Label htmlFor="shift-name">Name</Label>
                  <Input
                    id="shift-name"
                    value={String(formData.name || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Neuro 1 (CT STAT, on site)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={String(formData.startTime || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={String(formData.endTime || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="all-day"
                    checked={Boolean(formData.isAllDay || false)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isAllDay: e.target.checked }))}
                    className="mr-2"
                  />
                  <Label htmlFor="all-day">All Day</Label>
                </div>
              </div>

              <div>
                <Label>Days of Week</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {DAYS.map((day) => (
                    <div key={day.key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={day.key}
                        checked={Boolean((formData.recurrence as Record<string, boolean>)?.[day.key] || false)}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                            recurrence: { ...(prev.recurrence as Record<string, boolean>), [day.key]: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <Label htmlFor={day.key} className="text-sm">{day.label.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility</Label>
                <Select
                  value={String(formData.eligibilityType || 'any')}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, eligibilityType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allowAny">Allow Any Radiologist</SelectItem>
                    <SelectItem value="subspecialty">Required Subspecialty</SelectItem>
                    <SelectItem value="named">Named Allowlist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.eligibilityType === 'subspecialty' && (
                <div>
                  <Label htmlFor="required-subspecialty">Required Subspecialty</Label>
                  <Select
                    value={String(formData.requiredSubspecialtyId || '')}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, requiredSubspecialtyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subspecialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.subspecialties?.map((sub) => (
                        <SelectItem key={sub.id} value={sub.code}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.eligibilityType === 'named' && (
                <div>
                  <Label htmlFor="named-allowlist">Named Allowlist (comma-separated emails)</Label>
                  <Input
                    id="named-allowlist"
                    value={String(formData.namedAllowlist || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, namedAllowlist: e.target.value }))}
                    placeholder="email1@test.com, email2@test.com"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditState({ type: null, mode: null, item: null })}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Hours</th>
                <th className="text-left p-2">Days</th>
                <th className="text-left p-2">Eligibility</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.shiftTypes?.map((shift) => (
                <tr key={shift.id} className="border-b hover:bg-slate-50">
                  <td className="p-2 font-mono text-xs">{shift.code}</td>
                  <td className="p-2">{shift.name}</td>
                  <td className="p-2 font-mono text-xs">
                    {shift.isAllDay ? 'All Day' : `${shift.startTime}-${shift.endTime}`}
                  </td>
                  <td className="p-2 text-xs">
                    {['mon','tue','wed','thu','fri','sat','sun']
                      .filter(k => shift.recurrence[k as keyof typeof shift.recurrence])
                      .join(', ').toUpperCase()}
                  </td>
                  <td className="p-2 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {shift.eligibility.allowAny ? 'Any' : 
                       shift.eligibility.requiredSubspecialty ? shift.eligibility.requiredSubspecialty.code : 
                       `Named (${shift.eligibility.namedAllowlist.length})`}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit('shiftType', 'edit', shift)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete('shiftType', shift.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  const renderStaff = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-pink-600" />
            <CardTitle>Staff ({data?.staff?.length || 0})</CardTitle>
          </div>
          <Button size="sm" onClick={() => handleEdit('staff', 'add')}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <CardDescription>Team members and their details</CardDescription>
      </CardHeader>
      <CardContent>
        {editState.type === 'staff' && (
          <Card className="mb-4 bg-pink-50 border-pink-200">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="staff-name">Name</Label>
                  <Input
                    id="staff-name"
                    value={String(formData.name || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={String(formData.email || '')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. jsmith@test.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="staff-subspecialty">Subspecialty</Label>
                    <Select
                      value={String(formData.subspecialtyId || '')}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, subspecialtyId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subspecialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Subspecialty</SelectItem>
                        {data?.subspecialties?.map((sub) => (
                          <SelectItem key={sub.id} value={sub.code}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="staff-fte">FTE Percentage</Label>
                    <Input
                      id="staff-fte"
                      type="number"
                      min="10"
                      max="100"
                      step="5"
                      value={String(formData.ftePercent || '')}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ftePercent: parseInt(e.target.value) || 100 }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                
                {/* Learner Status Section */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-3 block">Learner Status</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="staff-fellow"
                        checked={Boolean(formData.isFellow)}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isFellow: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="staff-fellow" className="flex items-center gap-2 cursor-pointer">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        Fellow
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="staff-resident"
                        checked={Boolean(formData.isResident)}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isResident: e.target.checked }))}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <Label htmlFor="staff-resident" className="flex items-center gap-2 cursor-pointer">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        Resident
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditState({ type: null, mode: null, item: null })}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data?.staff?.map((person) => (
            <div
              key={person.id}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-pink-50 to-red-50 p-3 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="bg-white rounded-full p-2 border">
                <Users className="h-4 w-4 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{person.name || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground truncate">{person.email}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {person.subspecialtyName || 'No Subspecialty'}
                  </Badge>
                  <span>{person.ftePercent || 100}% FTE</span>
                  {person.isFellow && (
                    <Badge className="text-xs bg-purple-100 text-purple-800 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Fellow
                    </Badge>
                  )}
                  {person.isResident && (
                    <Badge className="text-xs bg-green-100 text-green-800 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      Resident
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white shadow-sm" 
                  onClick={() => handleEdit('staff', 'edit', person)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white hover:text-red-600 shadow-sm" 
                  onClick={() => handleDelete('staff', person.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {(!data?.staff || data.staff.length === 0) && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No staff members yet. Click &quot;Add&quot; to create your first team member.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!data?.success) {
    return <div className="text-red-600">Failed to load settings data</div>
  }

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <CardTitle>Organization</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Name</Label>
              <div className="font-semibold">{data.organization?.name}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Timezone</Label>
              <div className="font-semibold">{data.organization?.timezone}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Week Start</Label>
              <div className="font-semibold">{data.organization?.weekStart}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {renderSubspecialties()}
{renderStaff()}
      </div>

      {renderShiftTypes()}
    </div>
  )
}
