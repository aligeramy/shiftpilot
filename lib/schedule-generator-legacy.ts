/**
 * Schedule Generation Engine
 * Implements constraint-aware scheduling algorithms for radiology department
 */
import { prisma } from '@/lib/db'
import { generateShiftInstances } from '@/lib/seed'
import type {
  ScheduleInstance as DbScheduleInstance,
  ShiftType as DbShiftType,
  Subspecialty as DbSubspecialty,
  User as DbUser,
  RadiologyProfile as DbRadiologyProfile,
  VacationPreference as DbVacationPreference,
  ScheduleAssignment as DbScheduleAssignment,
} from '@prisma/client'

type ShiftTypeWithEligibility = DbShiftType & {
  requiredSubspecialty: DbSubspecialty | null
  namedAllowlist: string | null
  allowAny: boolean
}

type InstanceWithShift = DbScheduleInstance & {
  shiftType: ShiftTypeWithEligibility
}

type RadiologistWithProfile = DbUser & {
  radiologistProfile: (DbRadiologyProfile & { subspecialty: DbSubspecialty }) | null
  vacationPreferences: DbVacationPreference[]
}

type LoadedData = {
  instances: InstanceWithShift[]
  radiologists: RadiologistWithProfile[]
  existingAssignments: DbScheduleAssignment[]
}

export interface GenerationConfig {
  organizationId: string
  year: number
  month: number
  seed?: number // For deterministic generation
  maxIterations?: number
  fairnessWeight?: number
  preferenceWeight?: number
}

export interface AssignmentResult {
  instanceId: string
  userId: string
  confidence: number // How good the match is (0-1)
  constraints: string[] // Which constraints were satisfied
}

export interface GenerationResult {
  success: boolean
  assignments: AssignmentResult[]
  metrics: {
    totalInstances: number
    assignedInstances: number
    unassignedInstances: number
    fairnessScore: number
    preferenceScore: number
    constraintViolations: string[]
  }
  executionTimeMs: number
}

// In-memory lock to prevent concurrent generations for the same period
const generationLocks = new Map<string, Promise<GenerationResult>>()

export class ScheduleGenerator {
  private organizationId: string
  private config: GenerationConfig
  private randomSeed: number
  private awardedVacationsByUser: Map<string, DbVacationPreference | null> = new Map()

  constructor(config: GenerationConfig) {
    this.config = config
    this.organizationId = config.organizationId
    this.randomSeed = config.seed || Math.floor(Math.random() * 1000000)
  }

  // Seeded random number generator for deterministic results
  private seededRandom(): number {
    const x = Math.sin(this.randomSeed++) * 10000
    return x - Math.floor(x)
  }

  async generateSchedule(): Promise<GenerationResult> {
    const lockKey = `${this.organizationId}-${this.config.year}-${this.config.month}`
    
    // Check if generation is already in progress for this period
    if (generationLocks.has(lockKey)) {
      console.log(`[GENERATOR] Generation already in progress for ${lockKey}, waiting...`)
      return await generationLocks.get(lockKey)!
    }

    // Create and store the generation promise
    const generationPromise = this._doGeneration()
    generationLocks.set(lockKey, generationPromise)

    try {
      const result = await generationPromise
      return result
    } finally {
      // Clean up the lock when done
      generationLocks.delete(lockKey)
    }
  }

  private async _doGeneration(): Promise<GenerationResult> {
    const startTime = Date.now()
    console.log(`[GENERATOR] Starting schedule generation for ${this.config.year}-${this.config.month}`)

    try {
      // 1. Generate shift instances for the month
      await generateShiftInstances(this.organizationId, this.config.year, this.config.month)

      // 2. Load all necessary data
      const data = await this.loadSchedulingData()
      console.log(`[GENERATOR] Loaded data: ${data.instances.length} instances, ${data.radiologists.length} radiologists`)

      // 3. Apply constraint-based assignment algorithm
      const assignments = await this.assignShifts(data)
      
      // 4. Calculate metrics
      const metrics = this.calculateMetrics(data.instances, assignments)
      
      // 5. Save assignments to database
      await this.saveAssignments(assignments)

      const executionTime = Date.now() - startTime
      console.log(`[GENERATOR] Generation completed in ${executionTime}ms`)

      return {
        success: true,
        assignments,
        metrics,
        executionTimeMs: executionTime
      }

    } catch (error) {
      console.error('[GENERATOR] Generation failed:', error)
      return {
        success: false,
        assignments: [],
        metrics: {
          totalInstances: 0,
          assignedInstances: 0,
          unassignedInstances: 0,
          fairnessScore: 0,
          preferenceScore: 0,
          constraintViolations: [error instanceof Error ? error.message : 'Unknown error']
        },
        executionTimeMs: Date.now() - startTime
      }
    }
  }

  private async loadSchedulingData(): Promise<LoadedData> {
    // Load shift instances for the month
    const firstDay = new Date(this.config.year, this.config.month - 1, 1)
    const lastDay = new Date(this.config.year, this.config.month, 0)

    const instances = await prisma.scheduleInstance.findMany({
      where: {
        organizationId: this.organizationId,
        date: {
          gte: firstDay,
          lte: lastDay
        }
      },
      include: {
        shiftType: {
          include: {
            requiredSubspecialty: true
          }
        }
      }
    }) as unknown as InstanceWithShift[]

    // Load radiologists with profiles
    const radiologists = await prisma.user.findMany({
      where: {
        organizationId: this.organizationId,
        role: 'RADIOLOGIST'
      },
      include: {
        radiologistProfile: {
          include: {
            subspecialty: true
          }
        },
        vacationPreferences: {
          where: {
            year: this.config.year,
            month: this.config.month
          }
        }
      }
    }) as unknown as RadiologistWithProfile[]

    // Load existing assignments to avoid conflicts
    const existingAssignments = await prisma.scheduleAssignment.findMany({
      where: {
        instance: {
          organizationId: this.organizationId,
          date: {
            gte: firstDay,
            lte: lastDay
          }
        }
      }
    })

    return {
      instances,
      radiologists,
      existingAssignments
    }
  }

  private async assignShifts(data: LoadedData): Promise<AssignmentResult[]> {
    const assignments: AssignmentResult[] = []
    const radiologistWorkload = new Map<string, number>() // Track assignments per radiologist
    const { blocks: vacationBlocks } = this.calculateAwardedVacations(data.radiologists)
    
    // CRITICAL FIX: Track which instances have been assigned
    const assignedInstances = new Set<string>()
    
    // CRITICAL FIX: Track daily assignments per radiologist to prevent double-booking
    const dailyAssignments = new Map<string, Set<string>>() // userId -> Set of dates (ISO string)
    
    // NEW: Calculate part-time days for each radiologist
    const ptDaysMap = this.calculatePTDays(data.radiologists)
    
    console.log(`[GENERATOR] Starting assignment for ${data.instances.length} instances`)
    console.log(`[GENERATOR] Calculated PT days for ${ptDaysMap.size} radiologists`)

    // Initialize workload tracking
    data.radiologists.forEach((rad) => {
      radiologistWorkload.set(rad.id, 0)
      dailyAssignments.set(rad.id, new Set())
    })

    // Sort instances by difficulty (hardest constraints first)
    const sortedInstances = data.instances.sort((a, b) => {
      return this.calculateInstanceDifficulty(b, data.radiologists) -
             this.calculateInstanceDifficulty(a, data.radiologists)
    })

    // Assign each instance
    for (const instance of sortedInstances) {
      // CRITICAL FIX: Skip if this instance is already assigned
      if (assignedInstances.has(instance.id)) {
        console.log(`[GENERATOR] Instance ${instance.id} already assigned, skipping`)
        continue
      }
      
      const candidates = this.findEligibleCandidates(instance, data.radiologists, vacationBlocks, dailyAssignments, ptDaysMap)
      
      if (candidates.length === 0) {
        console.warn(`[GENERATOR] No eligible candidates for ${instance.shiftType.code} on ${instance.date}`)
        continue
      }

      // Score candidates based on multiple factors
      const scoredCandidates = candidates.map(rad => ({
        radiologist: rad,
        score: this.calculateAssignmentScore(rad, instance, radiologistWorkload)
      }))

      // Sort by score (highest first)
      scoredCandidates.sort((a, b) => b.score - a.score)

      // Add some randomness to prevent always picking the same person
      const topCandidates = scoredCandidates.slice(0, Math.min(3, scoredCandidates.length))
      const selectedCandidate = topCandidates[Math.floor(this.seededRandom() * topCandidates.length)]

      // Make assignment
      assignments.push({
        instanceId: instance.id,
        userId: selectedCandidate.radiologist.id,
        confidence: selectedCandidate.score,
        constraints: this.getConstraintsSatisfied(selectedCandidate.radiologist, instance)
      })

      // CRITICAL FIX: Mark instance as assigned
      assignedInstances.add(instance.id)
      
      // CRITICAL FIX: Mark date as occupied for this radiologist
      const dateStr = new Date(instance.date).toISOString().split('T')[0]
      dailyAssignments.get(selectedCandidate.radiologist.id)?.add(dateStr)

      // Update workload
      const currentWorkload = radiologistWorkload.get(selectedCandidate.radiologist.id) || 0
      radiologistWorkload.set(selectedCandidate.radiologist.id, currentWorkload + 1)
    }

    console.log(`[GENERATOR] Generated ${assignments.length} assignments`)
    return assignments
  }

  private findEligibleCandidates(
    instance: InstanceWithShift,
    radiologists: RadiologistWithProfile[],
    vacationBlocks: Map<string, Date[]>,
    dailyAssignments: Map<string, Set<string>>,
    ptDaysMap: Map<string, Set<string>>
  ): RadiologistWithProfile[] {
    return radiologists.filter(rad => {
      // Check subspecialty eligibility
      if (instance.shiftType.requiredSubspecialtyId) {
        if (rad.radiologistProfile?.subspecialtyId !== instance.shiftType.requiredSubspecialtyId) {
          return false
        }
      } else if (instance.shiftType.namedAllowlist !== undefined && instance.shiftType.namedAllowlist !== null) {
        // Handle named eligibility
        const allowedEmails = (instance.shiftType as unknown as { namedAllowlist: string | null }).namedAllowlist?.split(',') || []
        if (!allowedEmails.includes(rad.email)) {
          return false
        }
      } else if (!instance.shiftType.allowAny) {
        // No eligibility criteria met
        return false
      }

      // Check vacation conflicts - IMPROVED: block entire vacation weeks
      const vacations = vacationBlocks.get(rad.id) || []
      const instanceDate = new Date(instance.date)
      
      // Check if instance date falls within any vacation week
      for (const vacDate of vacations) {
        if (this.isDateInVacationWeek(instanceDate, vacDate)) {
          console.log(`[GENERATOR] Blocking ${rad.email} from ${instance.shiftType.code} on ${instanceDate.toDateString()} - vacation week`)
          return false
        }
      }
      
      // Also check if instance date exactly matches any vacation day
      const instanceDateStr = instanceDate.toISOString().split('T')[0]
      const vacDateStrs = vacations.map(d => d.toISOString().split('T')[0])
      if (vacDateStrs.includes(instanceDateStr)) {
        console.log(`[GENERATOR] Blocking ${rad.email} from ${instance.shiftType.code} on ${instanceDate.toDateString()} - vacation day`)
        return false
      }

      // CRITICAL FIX: Check for same-day conflicts - one shift per day per person
      const dateStr = new Date(instance.date).toISOString().split('T')[0]
      const userDailyAssignments = dailyAssignments.get(rad.id)
      if (userDailyAssignments?.has(dateStr)) {
        // This radiologist already has a shift on this day
        return false
      }

      // NEW: Check PT day conflicts - block assignments on part-time days
      const userPTDays = ptDaysMap.get(rad.id)
      if (userPTDays?.has(dateStr)) {
        // This radiologist has a part-time day on this date
        return false
      }

      return true
    })
  }

  private calculateAssignmentScore(
    radiologist: RadiologistWithProfile,
    instance: InstanceWithShift,
    workload: Map<string, number>
  ): number {
    let score = 0.5 // Start neutral

    // CRITICAL: Strong fairness factor - heavily prefer radiologists with lower workload
    const currentWorkload = workload.get(radiologist.id) || 0
    const allWorkloads = Array.from(workload.values())
    const averageWorkload = allWorkloads.length > 0 ? allWorkloads.reduce((a, b) => a + b, 0) / allWorkloads.length : 0
    const maxWorkload = Math.max(...allWorkloads, 0)
    const minWorkload = Math.min(...allWorkloads, 0)
    
    // Normalized workload difference (0 = average, negative = below average)
    const workloadDiff = currentWorkload - averageWorkload
    const workloadRange = Math.max(maxWorkload - minWorkload, 1)
    
    // Strong penalty for high workload, strong bonus for low workload
    score += (averageWorkload - currentWorkload) * 0.8 // Increased from 0.3
    
    // Additional penalty for being above average
    if (currentWorkload > averageWorkload) {
      score -= (workloadDiff / workloadRange) * 0.5
    }

    // Subspecialty match bonus (but less important than fairness)
    if (instance.shiftType.requiredSubspecialtyId === radiologist.radiologistProfile?.subspecialtyId) {
      score += 0.3 // Reduced from 0.4
    }

    // FTE consideration - scale workload target by FTE
    const ftePercent = radiologist.radiologistProfile?.ftePercent || 100
    const fteMultiplier = ftePercent / 100.0
    const expectedWorkload = averageWorkload * fteMultiplier
    
    // Prefer people who are under their expected workload
    if (currentWorkload < expectedWorkload) {
      score += (expectedWorkload - currentWorkload) * 0.2
    }

    // Reduced randomness for more predictable fairness
    score += (this.seededRandom() - 0.5) * 0.1 // Reduced from 0.2

    return Math.max(0, Math.min(2, score)) // Allow scores up to 2 for very under-worked people
  }

  private calculateInstanceDifficulty(
    instance: InstanceWithShift,
    radiologists: RadiologistWithProfile[]
  ): number {
    // Count how many radiologists are eligible
    let eligibleCount = 0
    
    if (instance.shiftType.allowAny) {
      eligibleCount = radiologists.length
    } else if (instance.shiftType.requiredSubspecialtyId) {
      eligibleCount = radiologists.filter(rad => 
        rad.radiologistProfile?.subspecialtyId === instance.shiftType.requiredSubspecialtyId
      ).length
    }

    // Lower eligible count = higher difficulty
    return eligibleCount > 0 ? 1.0 / eligibleCount : 1.0
  }

  private calculateAwardedVacations(radiologists: RadiologistWithProfile[]): { blocks: Map<string, Date[]> } {
    const vacationMap = new Map<string, Date[]>()
    this.awardedVacationsByUser.clear()

    radiologists.forEach(rad => {
      const prefs = (rad.vacationPreferences || [])
        .filter(p => p.year === this.config.year && p.month === this.config.month)
        .sort((a, b) => a.rank - b.rank)

      // Pick the highest-ranked available preference (P1 → P2 → P3) to honor for this month
      const chosen = prefs[0] || null
      this.awardedVacationsByUser.set(rad.id, chosen || null)

      const vacationDates: Date[] = []
      if (chosen) {
        const startDate = new Date(chosen.weekStartDate)
        const endDate = new Date(chosen.weekEndDate)
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          vacationDates.push(new Date(d))
        }
      }
      vacationMap.set(rad.id, vacationDates)
    })

    return { blocks: vacationMap }
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const week1 = this.getWeekStart(date1)
    const week2 = this.getWeekStart(date2)
    return week1.getTime() === week2.getTime()
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday start
    return new Date(d.setDate(diff))
  }

  private isDateInVacationWeek(instanceDate: Date, vacationDate: Date): boolean {
    // Get the vacation week (Monday to Sunday)
    const vacWeekStart = this.getWeekStart(vacationDate)
    const vacWeekEnd = new Date(vacWeekStart)
    vacWeekEnd.setDate(vacWeekStart.getDate() + 6) // Sunday
    
    // Check if instance date falls within this week
    return instanceDate >= vacWeekStart && instanceDate <= vacWeekEnd
  }

  private getConstraintsSatisfied(
    radiologist: RadiologistWithProfile,
    instance: InstanceWithShift
  ): string[] {
    const constraints = []

    if (instance.shiftType.requiredSubspecialtyId === radiologist.radiologistProfile?.subspecialtyId) {
      constraints.push('subspecialty_match')
    }

    if (instance.shiftType.allowAny) {
      constraints.push('allow_any')
    }

    constraints.push('availability')
    return constraints
  }

  private calculateMetrics(instances: InstanceWithShift[], assignments: AssignmentResult[]) {
    const totalInstances = instances.length
    const assignedInstances = assignments.length
    const unassignedInstances = totalInstances - assignedInstances

    // Calculate fairness (how evenly distributed assignments are)
    const workloadDistribution = new Map<string, number>()
    assignments.forEach(assignment => {
      const count = workloadDistribution.get(assignment.userId) || 0
      workloadDistribution.set(assignment.userId, count + 1)
    })

    const workloads = Array.from(workloadDistribution.values())
    const averageWorkload = workloads.length > 0 ? workloads.reduce((a, b) => a + b, 0) / workloads.length : 0
    const variance = workloads.length > 0 ? workloads.reduce((sum, w) => sum + Math.pow(w - averageWorkload, 2), 0) / workloads.length : 0
    const fairnessScore = averageWorkload > 0 ? Math.max(0, 1 - variance / averageWorkload) : 1

    // Calculate average confidence as preference score
    const preferenceScore = assignments.length > 0 ? assignments.reduce((sum, a) => sum + a.confidence, 0) / assignments.length : 0

    return {
      totalInstances,
      assignedInstances,
      unassignedInstances,
      fairnessScore: isNaN(fairnessScore) ? 1 : fairnessScore,
      preferenceScore: isNaN(preferenceScore) ? 0 : preferenceScore,
      constraintViolations: [] // Would track actual violations
    }
  }

  private async saveAssignments(assignments: AssignmentResult[]) {
    if (assignments.length === 0) return

    // Use a transaction to make delete + create atomic
    await prisma.$transaction(async (tx) => {
      // Clear existing assignments for this period
      const firstDay = new Date(this.config.year, this.config.month - 1, 1)
      const lastDay = new Date(this.config.year, this.config.month, 0)

      await tx.scheduleAssignment.deleteMany({
        where: {
          instance: {
            organizationId: this.organizationId,
            date: {
              gte: firstDay,
              lte: lastDay
            }
          }
        }
      })

      // Create new assignments
      await tx.scheduleAssignment.createMany({
        data: assignments.map(assignment => ({
          instanceId: assignment.instanceId,
          userId: assignment.userId,
          assignmentType: 'GENERATED' as const
        })),
        skipDuplicates: true // Skip any duplicates that might exist
      })
    })

    console.log(`[GENERATOR] Saved ${assignments.length} assignments to database`)

    // Update vacation preferences statuses for this month based on awarded selection
    await this.updateVacationPreferenceStatuses()
  }

  private async updateVacationPreferenceStatuses() {
    try {
      // For each user with preferences in this org/month: reject all, then approve the awarded if present
      const year = this.config.year
      const month = this.config.month

      // Find all users in org who have preferences for the month
      const usersWithPrefs = await prisma.vacationPreference.findMany({
        where: {
          user: { organizationId: this.organizationId },
          year,
          month,
        },
        select: { id: true, userId: true }
      })

      const byUser = new Map<string, string[]>()
      usersWithPrefs.forEach(p => {
        const arr = byUser.get(p.userId) || []
        arr.push(p.id)
        byUser.set(p.userId, arr)
      })

      for (const [userId, prefIds] of byUser.entries()) {
        // Reject all
        await prisma.vacationPreference.updateMany({
          where: { id: { in: prefIds } },
          data: { status: 'REJECTED' }
        })
        // Approve awarded if exists
        const awarded = this.awardedVacationsByUser.get(userId)
        if (awarded) {
          await prisma.vacationPreference.update({
            where: { id: awarded.id },
            data: { status: 'APPROVED' }
          })
        }
      }
    } catch (e) {
      console.warn('[GENERATOR] Failed to stamp vacation preference statuses:', e)
    }
  }

  private calculatePTDays(radiologists: RadiologistWithProfile[]): Map<string, Set<string>> {
    const ptDaysMap = new Map<string, Set<string>>()
    const year = this.config.year
    const month = this.config.month
    
    // Get all weekdays in the month
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const weekdays: Date[] = []
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday = 1, Friday = 5
        weekdays.push(new Date(d))
      }
    }
    
    radiologists.forEach(rad => {
      const ptDays = new Set<string>()
      const ftePercent = rad.radiologistProfile?.ftePercent || 100
      
      // Calculate PT days needed per month based on FTE
      const ptDaysNeeded = this.calculatePTDaysNeeded(ftePercent)
      
      if (ptDaysNeeded > 0 && weekdays.length > 0) {
        // Distribute PT days evenly throughout the month
        // Avoid weekday bias (no more than 1 extra Friday/Monday)
        const selectedDays = this.distributePTDaysEvenly(weekdays, ptDaysNeeded)
        selectedDays.forEach(date => {
          ptDays.add(date.toISOString().split('T')[0])
        })
        
        console.log(`[GENERATOR] Assigned ${ptDaysNeeded} PT days to ${rad.email} (FTE: ${ftePercent}%)`)
      }
      
      ptDaysMap.set(rad.id, ptDays)
    })
    
    return ptDaysMap
  }
  
  private calculatePTDaysNeeded(ftePercent: number): number {
    if (ftePercent >= 100) return 0
    if (ftePercent >= 90) return 2
    if (ftePercent >= 80) return 4
    if (ftePercent >= 70) return 6
    if (ftePercent >= 60) return 8
    return 10 // <60%
  }
  
  private distributePTDaysEvenly(weekdays: Date[], ptDaysNeeded: number): Date[] {
    if (ptDaysNeeded === 0 || weekdays.length === 0) return []
    
    const selectedDays: Date[] = []
    const daysByWeekday = new Map<number, Date[]>()
    
    // Group dates by day of week
    weekdays.forEach(date => {
      const day = date.getDay()
      if (!daysByWeekday.has(day)) {
        daysByWeekday.set(day, [])
      }
      daysByWeekday.get(day)!.push(date)
    })
    
    // Distribute days evenly across weekdays to avoid Friday/Monday bias
    const weekdayKeys = Array.from(daysByWeekday.keys()).sort()
    let dayIndex = 0
    
    for (let i = 0; i < ptDaysNeeded && selectedDays.length < ptDaysNeeded; i++) {
      const weekday = weekdayKeys[dayIndex % weekdayKeys.length]
      const daysForWeekday = daysByWeekday.get(weekday) || []
      
      if (daysForWeekday.length > 0) {
        // Select a day from this weekday (spread across weeks)
        const weekIndex = Math.floor(i / weekdayKeys.length)
        if (weekIndex < daysForWeekday.length) {
          selectedDays.push(daysForWeekday[weekIndex])
        }
      }
      
      dayIndex++
    }
    
    return selectedDays.slice(0, ptDaysNeeded)
  }
}
