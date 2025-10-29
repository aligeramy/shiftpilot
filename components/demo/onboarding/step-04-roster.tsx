"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Upload, CheckCircle2, TrendingUp, UserPlus, Download } from "lucide-react"
import { DEMO_RADIOLOGISTS, DEMO_SUBSPECIALTIES, type Radiologist } from "@/lib/demo-data/onboarding-data"
import { AddEmployeeDialog } from "./add-employee-dialog"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function Step04Roster() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [radiologists, setRadiologists] = useState<Radiologist[]>(DEMO_RADIOLOGISTS)

  const handleAddEmployee = (newEmployee: { 
    name: string
    email: string
    subspecialty: string
    fte: number
    role: string
  }) => {
    const employee: Radiologist = {
      id: `r${radiologists.length + 1}`,
      name: newEmployee.name,
      email: newEmployee.email,
      subspecialty: newEmployee.subspecialty,
      fte: newEmployee.fte,
      role: newEmployee.role as 'RAD' | 'FELLOW' | 'RESIDENT'
    }
    setRadiologists([...radiologists, employee])
  }

  const handleDownloadTemplate = () => {
    const csvContent = [
      ['Name', 'Email', 'Subspecialty', 'FTE %', 'Role'].join(','),
      ['Dr. John Doe', 'jdoe@hospital.com', 'NEURO', '100', 'RAD'].join(','),
      ['Dr. Jane Smith', 'jsmith@hospital.com', 'BODY', '80', 'RAD'].join(','),
      ['Dr. Bob Johnson', 'bjohnson@hospital.com', 'IR', '100', 'FELLOW'].join(','),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roster_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const subspecialtyCounts = radiologists.reduce((acc, rad) => {
    acc[rad.subspecialty] = (acc[rad.subspecialty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const fteDistribution = {
    '60-69%': radiologists.filter(r => r.fte >= 60 && r.fte < 70).length,
    '70-79%': radiologists.filter(r => r.fte >= 70 && r.fte < 80).length,
    '80-89%': radiologists.filter(r => r.fte >= 80 && r.fte < 90).length,
    '90-99%': radiologists.filter(r => r.fte >= 90 && r.fte < 100).length,
    '100%': radiologists.filter(r => r.fte === 100).length,
  }

  const fellowsCount = radiologists.filter(r => r.role === 'FELLOW').length
  const residentsCount = radiologists.filter(r => r.role === 'RESIDENT').length
  const radsCount = radiologists.filter(r => r.role === 'RAD').length
  const avgFte = Math.round(radiologists.reduce((sum, r) => sum + r.fte, 0) / radiologists.length)

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
            Step 4 of 17
          </Badge>
          <h2 className="text-4xl font-semibold tracking-tight">Roster Import</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your team has been imported! CSV validation passed with auto-tagging of subspecialties and FTE analysis.
          </p>
          <Button
            variant="link"
            onClick={handleDownloadTemplate}
            className="text-[#007bff] hover:text-[#0069d9]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Import Successful
                </CardTitle>
                <CardDescription>{radiologists.length} radiologists validated and ready</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Re-upload CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Radiologists</p>
                <p className="text-2xl font-bold">{radsCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fellows</p>
                <p className="text-2xl font-bold">{fellowsCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Residents</p>
                <p className="text-2xl font-bold">{residentsCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg FTE</p>
                <p className="text-2xl font-bold">{avgFte}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Distribution by Subspecialty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_SUBSPECIALTIES.map(subspecialty => {
                  const count = subspecialtyCounts[subspecialty.code] || 0
                  const percentage = (count / radiologists.length) * 100
                  return (
                    <div key={subspecialty.code} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{subspecialty.name}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#007bff] to-[#65c1f4] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                FTE Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(fteDistribution).map(([range, count]) => {
                  const percentage = (count / radiologists.length) * 100
                  return (
                    <div key={range} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{range}</span>
                        <span className="text-muted-foreground">{count} staff ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle>Sample Team Members</CardTitle>
            <CardDescription>First 8 members from your roster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {radiologists.slice(0, 8).map((rad, index) => (
                <motion.div
                  key={rad.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-white/60 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <p className="font-semibold text-sm">{rad.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {rad.subspecialty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rad.fte}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>

    <AddEmployeeDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onAdd={handleAddEmployee}
    />
  </>
  )
}

