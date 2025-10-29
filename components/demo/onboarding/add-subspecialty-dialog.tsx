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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, AlertCircle } from "lucide-react"

interface AddSubspecialtyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (subspecialty: { code: string; name: string; description: string }) => void
}

const suggestedSubspecialties = [
  { code: 'PEDS', name: 'Pediatric Radiology', description: 'Pediatric imaging and diagnostics' },
  { code: 'BREAST', name: 'Breast Imaging', description: 'Mammography and breast procedures' },
  { code: 'NUCLEAR', name: 'Nuclear Medicine', description: 'Nuclear imaging and PET scans' },
  { code: 'US', name: 'Ultrasound', description: 'Dedicated ultrasound coverage' },
]

export function AddSubspecialtyDialog({ open, onOpenChange, onAdd }: AddSubspecialtyDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const validateAndAdd = () => {
    const newErrors: string[] = []

    if (!code || !/^[A-Z0-9_]+$/.test(code)) {
      newErrors.push("Code must contain only uppercase letters, numbers, and underscores")
    }
    if (!name || name.length < 2) {
      newErrors.push("Name must be at least 2 characters")
    }
    if (!description || description.length < 10) {
      newErrors.push("Description must be at least 10 characters")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd({ code, name, description })
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setCode("")
    setName("")
    setDescription("")
    setErrors([])
  }

  const useSuggestion = (suggestion: typeof suggestedSubspecialties[0]) => {
    setCode(suggestion.code)
    setName(suggestion.name)
    setDescription(suggestion.description)
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Plus className="h-6 w-6 text-blue-500" />
            Add New Subspecialty
          </DialogTitle>
          <DialogDescription>
            Define a new medical subspecialty for your radiology department. This will be used for shift eligibility and workload distribution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-medium">Quick Add (AI Suggestions)</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedSubspecialties.map((suggestion) => (
                <motion.button
                  key={suggestion.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => useSuggestion(suggestion)}
                  className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{suggestion.name}</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {suggestion.code}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Subspecialty Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., PEDS, BREAST"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Uppercase letters, numbers, and underscores only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Subspecialty Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Pediatric Radiology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Full descriptive name
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this subspecialty's focus and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Describe what this subspecialty covers (minimum 10 characters)
              </p>
            </div>
          </div>

          {/* Live Preview */}
          {(code || name) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30"
            >
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">Preview</p>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{name || 'Subspecialty Name'}</span>
                    {code && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {code}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {description || 'Subspecialty description will appear here'}
                  </p>
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
            Add Subspecialty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

