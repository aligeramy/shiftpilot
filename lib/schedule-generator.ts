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
    
    console.log(`[GENERATOR] Starting assignment for ${data.instances.length} instances`)

    // Initialize workload tracking
    data.radiologists.forEach((rad) => {
      radiologistWorkload.set(rad.id, 0)
    })

    // Sort instances by difficulty (hardest constraints first)
    const sortedInstances = data.instances.sort((a, b) => {
      return this.calculateInstanceDifficulty(b, data.radiologists) -
             this.calculateInstanceDifficulty(a, data.radiologists)
    })

    // Assign each instance
    for (const instance of sortedInstances) {
      const candidates = this.findEligibleCandidates(instance, data.radiologists, vacationBlocks)
      
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
    vacationBlocks: Map<string, Date[]>
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

      // Check vacation conflicts
      const vacations = vacationBlocks.get(rad.id) || []
      const instanceDate = new Date(instance.date)
      if (vacations.some(vacDate => this.isSameWeek(vacDate, instanceDate))) {
        return false
      }

      // Check for same-day conflicts (simplified - would need more complex logic)
      // For now, assume one shift per day per person

      return true
    })
  }

  private calculateAssignmentScore(
    radiologist: RadiologistWithProfile,
    instance: InstanceWithShift,
    workload: Map<string, number>
  ): number {
    let score = 1.0

    // Fairness factor - prefer radiologists with lower workload
    const currentWorkload = workload.get(radiologist.id) || 0
    const averageWorkload = Array.from(workload.values()).reduce((a, b) => a + b, 0) / workload.size
    score += (averageWorkload - currentWorkload) * 0.3

    // Subspecialty match bonus
    if (instance.shiftType.requiredSubspecialtyId === radiologist.radiologistProfile?.subspecialtyId) {
      score += 0.4
    }

    // FTE consideration - full-time radiologists get slight preference for more shifts
    if (radiologist.radiologistProfile?.ftePercent === 100) {
      score += 0.1
    }

    // Add some randomness for variety
    score += (this.seededRandom() - 0.5) * 0.2

    return Math.max(0, Math.min(1, score))
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

    // Clear existing assignments for this period
    const firstDay = new Date(this.config.year, this.config.month - 1, 1)
    const lastDay = new Date(this.config.year, this.config.month, 0)

    await prisma.scheduleAssignment.deleteMany({
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
    await prisma.scheduleAssignment.createMany({
      data: assignments.map(assignment => ({
        instanceId: assignment.instanceId,
        userId: assignment.userId,
        assignmentType: 'GENERATED' as const
      }))
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
}
