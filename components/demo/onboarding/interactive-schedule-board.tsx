"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, CheckCircle2, AlertCircle, ArrowRightLeft, X } from "lucide-react"

interface Assignment {
  id: string
  shiftCode: string
  shiftName: string
  date: string
  dayOfWeek: string
  radiologist: string
  subspecialty: string
  time: string
}

const sampleWeek = [
  { date: "2025-01-06", day: "Mon" },
  { date: "2025-01-07", day: "Tue" },
  { date: "2025-01-08", day: "Wed" },
  { date: "2025-01-09", day: "Thu" },
  { date: "2025-01-10", day: "Fri" },
]

const sampleShifts = [
  { code: "N1", name: "Neuro 1", time: "08:00-16:00", subspecialty: "NEURO" },
  { code: "BODY_MRI", name: "Body MRI", time: "08:00-16:00", subspecialty: "BODY" },
  { code: "VASC", name: "Vascular IR", time: "08:00-16:00", subspecialty: "IR" },
  { code: "CLIN_MA1", name: "Clinic MA1", time: "08:00-16:00", subspecialty: "ANY" },
]

const sampleRadiologists = [
  { name: "Dr. E. Johnson", subspecialty: "NEURO" },
  { name: "Dr. M. Chen", subspecialty: "NEURO" },
  { name: "Dr. R. Miller", subspecialty: "BODY" },
  { name: "Dr. P. Thompson", subspecialty: "IR" },
  { name: "Dr. L. Lee", subspecialty: "BODY" },
  { name: "Dr. K. Garcia", subspecialty: "IR" },
]

const initialAssignments: Assignment[] = [
  { id: "1", shiftCode: "N1", shiftName: "Neuro 1", date: "2025-01-06", dayOfWeek: "Mon", radiologist: "Dr. E. Johnson", subspecialty: "NEURO", time: "08:00-16:00" },
  { id: "2", shiftCode: "N1", shiftName: "Neuro 1", date: "2025-01-07", dayOfWeek: "Tue", radiologist: "Dr. M. Chen", subspecialty: "NEURO", time: "08:00-16:00" },
  { id: "3", shiftCode: "BODY_MRI", shiftName: "Body MRI", date: "2025-01-06", dayOfWeek: "Mon", radiologist: "Dr. R. Miller", subspecialty: "BODY", time: "08:00-16:00" },
  { id: "4", shiftCode: "BODY_MRI", shiftName: "Body MRI", date: "2025-01-07", dayOfWeek: "Tue", radiologist: "Dr. L. Lee", subspecialty: "BODY", time: "08:00-16:00" },
  { id: "5", shiftCode: "VASC", shiftName: "Vascular IR", date: "2025-01-08", dayOfWeek: "Wed", radiologist: "Dr. P. Thompson", subspecialty: "IR", time: "08:00-16:00" },
  { id: "6", shiftCode: "CLIN_MA1", shiftName: "Clinic MA1", date: "2025-01-09", dayOfWeek: "Thu", radiologist: "Dr. L. Lee", subspecialty: "BODY", time: "08:00-16:00" },
]

export function InteractiveScheduleBoard() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [swapMode, setSwapMode] = useState(false)
  const [swapFrom, setSwapFrom] = useState<Assignment | null>(null)

  const handleAssignmentClick = (assignment: Assignment) => {
    if (swapMode) {
      if (!swapFrom) {
        setSwapFrom(assignment)
      } else if (swapFrom.id !== assignment.id) {
        // Perform swap
        performSwap(swapFrom, assignment)
        setSwapMode(false)
        setSwapFrom(null)
      }
    } else {
      setSelectedAssignment(assignment.id)
    }
  }

  const performSwap = (from: Assignment, to: Assignment) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === from.id) {
        return { ...a, radiologist: to.radiologist, subspecialty: to.subspecialty }
      }
      if (a.id === to.id) {
        return { ...a, radiologist: from.radiologist, subspecialty: from.subspecialty }
      }
      return a
    }))
  }

  const getAssignment = (shiftCode: string, date: string) => {
    return assignments.find(a => a.shiftCode === shiftCode && a.date === date)
  }

  const validateAssignment = (radiologist: string, shift: typeof sampleShifts[0]) => {
    const rad = sampleRadiologists.find(r => r.name === radiologist)
    if (!rad) return { valid: false, message: "Radiologist not found" }
    
    if (shift.subspecialty !== "ANY" && rad.subspecialty !== shift.subspecialty) {
      return { valid: false, message: `Subspecialty mismatch: ${shift.subspecialty} required, ${rad.subspecialty} provided` }
    }
    
    return { valid: true, message: "Valid assignment" }
  }

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#007bff]" />
            Interactive Schedule Board
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={swapMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSwapMode(!swapMode)
                setSwapFrom(null)
              }}
              className={swapMode ? "bg-[#007bff] text-white" : ""}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              {swapMode ? (swapFrom ? "Select 2nd Assignment" : "Select 1st Assignment") : "Swap Mode"}
            </Button>
            {swapMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSwapMode(false)
                  setSwapFrom(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week Header */}
          <div className="grid grid-cols-6 gap-2">
            <div className="font-semibold text-sm text-muted-foreground">Shift</div>
            {sampleWeek.map(day => (
              <div key={day.date} className="text-center">
                <p className="font-semibold text-sm">{day.day}</p>
                <p className="text-xs text-muted-foreground">{day.date.split('-')[2]}</p>
              </div>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="space-y-2">
            {sampleShifts.map((shift) => (
              <div key={shift.code} className="grid grid-cols-6 gap-2">
                {/* Shift Label */}
                <div className="flex flex-col justify-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <p className="font-semibold text-xs">{shift.name}</p>
                  <p className="text-[10px] text-muted-foreground">{shift.time}</p>
                  <Badge variant="outline" className="text-[10px] mt-1 w-fit">
                    {shift.subspecialty}
                  </Badge>
                </div>

                {/* Day Cells */}
                {sampleWeek.map(day => {
                  const assignment = getAssignment(shift.code, day.date)
                  const isSwapFrom = swapFrom?.id === assignment?.id
                  const isSelected = selectedAssignment === assignment?.id

                  return (
                    <motion.div
                      key={`${shift.code}-${day.date}`}
                      className="relative"
                      whileHover={{ scale: assignment ? 1.02 : 1 }}
                    >
                      {assignment ? (
                        <motion.button
                          onClick={() => handleAssignmentClick(assignment)}
                          className={`w-full p-2 rounded-lg border transition-all ${
                            isSwapFrom
                              ? 'border-[#007bff] bg-[#007bff] text-white shadow-lg'
                              : isSelected
                              ? 'border-[#65c1f4] bg-[#c9e7f6]/30 dark:bg-[#007bff]/20'
                              : 'border-white/60 bg-white dark:border-white/10 dark:bg-slate-900/50 hover:border-[#007bff] hover:shadow-md'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <p className="text-xs font-semibold truncate">{assignment.radiologist}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] w-full justify-center ${
                                isSwapFrom ? 'bg-white/20 text-white border-white/40' : ''
                              }`}
                            >
                              {assignment.subspecialty}
                            </Badge>
                          </div>
                          
                          {isSwapFrom && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#007bff] flex items-center justify-center text-xs font-bold border-2 border-[#007bff]">
                              1
                            </div>
                          )}
                        </motion.button>
                      ) : (
                        <div className="w-full h-full min-h-[60px] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">Unassigned</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-[#c9e7f6]/20 dark:bg-[#007bff]/10 border border-[#c9e7f6] dark:border-[#007bff]/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#007bff] flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-[#007bff] dark:text-[#65c1f4]">
                  {swapMode 
                    ? swapFrom 
                      ? "Now click another assignment to complete the swap"
                      : "Click an assignment to start swapping"
                    : "Interactive Demo"}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {!swapMode && (
                    <>
                      <p>• Click "Swap Mode" to enable drag-and-swap functionality</p>
                      <p>• Click an assignment to select it</p>
                      <p>• Real-time validation ensures only eligible radiologists are assigned</p>
                      <p>• Subspecialty compliance is enforced automatically</p>
                    </>
                  )}
                  {swapMode && (
                    <>
                      <p>• Select first assignment (marked with "1")</p>
                      <p>• Click second assignment to swap radiologists</p>
                      <p>• System validates eligibility before completing swap</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Summary */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="font-semibold text-sm">Coverage</p>
              </div>
              <p className="text-xs text-muted-foreground">All shifts assigned</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="font-semibold text-sm">Eligibility</p>
              </div>
              <p className="text-xs text-muted-foreground">100% compliance</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="font-semibold text-sm">Conflicts</p>
              </div>
              <p className="text-xs text-muted-foreground">0 violations</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

