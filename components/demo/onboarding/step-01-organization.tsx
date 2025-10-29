"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Globe, Calendar } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function Step01Organization() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[#007bff] to-[#65c1f4] text-white">
          Step 1 of 17
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight">Organization DNA</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Set up your organization's core identity. This information will be used throughout the platform.
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto">
        <Card className="border-white/20 bg-white/80 backdrop-blur dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-500" />
              Organization Details
            </CardTitle>
            <CardDescription>
              Basic information about your radiology practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                defaultValue="Hamilton Radiology Group"
                className="text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground">
                The name of your radiology clinic or hospital
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-slug">Organization Slug</Label>
              <Input
                id="org-slug"
                defaultValue="hamilton-radiology-group"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier for your organization (auto-generated from name)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/80 backdrop-blur dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-500" />
              Regional Settings
            </CardTitle>
            <CardDescription>
              Configure timezone and scheduling preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="America/Toronto">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Toronto">Eastern Time (Toronto)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (New York)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (Chicago)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (Denver)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (Los Angeles)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All schedules and reports will use this timezone
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="week-start">Week Start Day</Label>
              <Select defaultValue="MONDAY">
                <SelectTrigger id="week-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONDAY">Monday</SelectItem>
                  <SelectItem value="SUNDAY">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Which day your scheduling week begins
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Calendar className="h-5 w-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Organization</p>
                <p className="font-semibold">Hamilton Radiology Group</p>
              </div>
              <div>
                <p className="text-muted-foreground">Timezone</p>
                <p className="font-semibold">America/Toronto (EST/EDT)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Week Starts</p>
                <p className="font-semibold">Monday</p>
              </div>
              <div>
                <p className="text-muted-foreground">Slug</p>
                <p className="font-mono text-xs">hamilton-radiology-group</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

