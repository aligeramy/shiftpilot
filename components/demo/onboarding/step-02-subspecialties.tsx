"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Heart, Bone, Syringe, Stethoscope, Activity, Plus } from "lucide-react"
import { DEMO_SUBSPECIALTIES, type Subspecialty } from "@/lib/demo-data/onboarding-data"
import { AddSubspecialtyDialog } from "./add-subspecialty-dialog"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.5 }
  })
}

const iconMap: Record<string, any> = {
  NEURO: Brain,
  BODY: Activity,
  MSK: Bone,
  IR: Syringe,
  CHEST: Heart,
  INR: Stethoscope,
}

export function Step02Subspecialties() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [subspecialties, setSubspecialties] = useState<Subspecialty[]>(DEMO_SUBSPECIALTIES)

  const handleAddSubspecialty = (newSubspecialty: { code: string; name: string; description: string }) => {
    const subspecialtyWithColor: Subspecialty = {
      ...newSubspecialty,
      color: 'from-indigo-400/30 via-indigo-500/20 to-transparent'
    }
    setSubspecialties([...subspecialties, subspecialtyWithColor])
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
            Step 2 of 17
          </Badge>
          <h2 className="text-4xl font-semibold tracking-tight">Subspecialties</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Define the medical subspecialties in your radiology department. These will be used for shift eligibility and workload distribution.
          </p>
        </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {subspecialties.map((subspecialty, index) => {
          const Icon = iconMap[subspecialty.code] || Activity
          return (
            <motion.div
              key={subspecialty.code}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="relative overflow-hidden border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 hover:shadow-lg transition-shadow">
                <div className={`absolute inset-0 bg-gradient-to-br ${subspecialty.color} pointer-events-none`} />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full border border-white/60 bg-white/90 p-3 shadow-sm dark:bg-slate-900">
                      <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {subspecialty.code}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{subspecialty.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {subspecialty.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Radiologists</span>
                    <span className="font-semibold">
                      {subspecialty.code === 'NEURO' ? '7' :
                       subspecialty.code === 'BODY' ? '9' :
                       subspecialty.code === 'MSK' ? '3' :
                       subspecialty.code === 'IR' ? '4' :
                       subspecialty.code === 'CHEST' ? '4' : '2'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )
          })}

          {/* Add Subspecialty Card */}
          <motion.div
            custom={subspecialties.length}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="relative overflow-hidden border-dashed border-2 border-[#65c1f4] bg-[#c9e7f6]/20 backdrop-blur dark:border-[#007bff] dark:bg-[#007bff]/10 hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <div className="text-center space-y-3">
                  <div className="rounded-full border-2 border-dashed border-[#65c1f4] dark:border-[#007bff] bg-white/90 dark:bg-slate-900 p-4 mx-auto w-fit">
                    <Plus className="h-8 w-8 text-[#007bff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Add Subspecialty</p>
                    <p className="text-sm text-muted-foreground">
                      Define a custom subspecialty for your practice
                    </p>
                  </div>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    variant="outline"
                    className="border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <AddSubspecialtyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddSubspecialty}
      />
    </>
  )
}

