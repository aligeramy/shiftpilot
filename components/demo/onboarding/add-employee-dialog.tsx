"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, UserPlus, AlertCircle, Sparkles } from "lucide-react"
import { DEMO_SUBSPECIALTIES } from "@/lib/demo-data/onboarding-data"

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (employee: { 
    name: string
    email: string
    subspecialty: string
    fte: number
    role: string
  }) => void
}

const suggestedEmployees = [
  { name: 'Dr. John Anderson', email: 'janderson@demo.com', subspecialty: 'NEURO', fte: 100, role: 'RAD' },
  { name: 'Dr. Maria Garcia', email: 'mgarcia@demo.com', subspecialty: 'BODY', fte: 80, role: 'RAD' },
  { name: 'Dr. Robert Kim', email: 'rkim@demo.com', subspecialty: 'IR', fte: 100, role: 'FELLOW' },
  { name: 'Dr. Lisa Chen', email: 'lchen@demo.com', subspecialty: 'CHEST', fte: 90, role: 'RAD' },
]

export function AddEmployeeDialog({ open, onOpenChange, onAdd }: AddEmployeeDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subspecialty, setSubspecialty] = useState("")
  const [fte, setFte] = useState("100")
  const [role, setRole] = useState("RAD")
  const [errors, setErrors] = useState<string[]>([])

  const validateAndAdd = () => {
    const newErrors: string[] = []

    if (!name || name.length < 3) {
      newErrors.push("Name must be at least 3 characters")
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push("Valid email address required")
    }
    if (!subspecialty) {
      newErrors.push("Subspecialty is required")
    }
    const fteNum = parseInt(fte)
    if (!fte || fteNum < 60 || fteNum > 100) {
      newErrors.push("FTE must be between 60% and 100%")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd({ name, email, subspecialty, fte: fteNum, role })
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setSubspecialty("")
    setFte("100")
    setRole("RAD")
    setErrors([])
  }

  const useSuggestion = (suggestion: typeof suggestedEmployees[0]) => {
    setName(suggestion.name)
    setEmail(suggestion.email)
    setSubspecialty(suggestion.subspecialty)
    setFte(suggestion.fte.toString())
    setRole(suggestion.role)
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-[#007bff]" />
            Add New Employee
          </DialogTitle>
          <DialogDescription>
            Add a radiologist, fellow, or resident to your organization roster.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#007bff]" />
              <Label className="text-sm font-medium">Quick Add (Sample Employees)</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedEmployees.map((suggestion) => (
                <motion.button
                  key={suggestion.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => useSuggestion(suggestion)}
                  className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-[#007bff] dark:hover:border-[#65c1f4] hover:bg-[#c9e7f6]/20 dark:hover:bg-[#007bff]/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{suggestion.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.subspecialty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.email}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">{suggestion.fte}%</Badge>
                    <Badge variant="outline" className="text-xs">{suggestion.role}</Badge>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or create custom</span>
            </div>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
            >
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Dr. Emily Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include title (Dr.) and full name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., ejohnson@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used for login and notifications
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subspecialty">Subspecialty *</Label>
                <Select value={subspecialty} onValueChange={setSubspecialty}>
                  <SelectTrigger id="subspecialty">
                    <SelectValue placeholder="Select subspecialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_SUBSPECIALTIES.map((sub) => (
                      <SelectItem key={sub.code} value={sub.code}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Primary subspecialty training
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fte">FTE Percentage *</Label>
                <Input
                  id="fte"
                  type="number"
                  min="60"
                  max="100"
                  placeholder="100"
                  value={fte}
                  onChange={(e) => setFte(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  60% to 100% (full-time)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RAD">Radiologist</SelectItem>
                  <SelectItem value="FELLOW">Fellow</SelectItem>
                  <SelectItem value="RESIDENT">Resident</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Position type affects scheduling eligibility
              </p>
            </div>
          </div>

          {/* Live Preview */}
          {(name || email) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg border border-[#c9e7f6] dark:border-[#007bff] bg-[#c9e7f6]/20 dark:bg-[#007bff]/10"
            >
              <p className="text-xs font-medium text-[#007bff] dark:text-[#65c1f4] mb-2">Preview</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{name || 'Employee Name'}</span>
                  {subspecialty && (
                    <Badge variant="outline" className="text-xs">
                      {DEMO_SUBSPECIALTIES.find(s => s.code === subspecialty)?.name || subspecialty}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{email || 'email@example.com'}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{fte}% FTE</Badge>
                  <Badge variant="outline" className="text-xs">
                    {role === 'RAD' ? 'Radiologist' : role === 'FELLOW' ? 'Fellow' : 'Resident'}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={validateAndAdd}
            className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] hover:from-[#0069d9] hover:to-[#5ab8f0]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

