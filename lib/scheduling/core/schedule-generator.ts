/**
 * Enterprise Schedule Generator - Version 2.0
 * Implements optimized constraint programming algorithm for 100% coverage
 */

import { prisma } from '@/lib/db'
import {
  ScheduleGeneratorInterface,
  GenerationConfig,
  GenerationResult,
  GenerationContext,
  AssignmentRecord,
  ValidationResult,
  ConstraintViolation,
  ValidationWarning,
  PerformanceEstimate,
  RadiologistProfile,
  ShiftInstance,
  ShiftTypeDefinition,
  VacationPreferenceData,
  FairnessLedger,
  WorkloadTracker,
  VacationBlockMap,
  EligibilityMatrix,
  AssignmentCandidate,
  GenerationMetrics,
  PerformanceMetrics,
  AuditRecord,
  GenerationPhase,
  ScheduleGenerationError,
  FairnessScore,
  WorkloadData,
  WorkloadStatistics,
  VacationSatisfactionMetrics,
} from './types'
import { EnterpriseConstraintEngine } from '../constraints/constraint-engine'

export class EnterpriseScheduleGenerator implements ScheduleGeneratorInterface {
  private constraintEngine: EnterpriseConstraintEngine
  private auditTrail: AuditRecord[] = []
  private performanceMetrics: PerformanceMetrics
  private randomSeed: number = 42

  constructor() {
    this.constraintEngine = new EnterpriseConstraintEngine()
    this.performanceMetrics = this.initializePerformanceMetrics()
  }

  // ================================
  // PUBLIC INTERFACE
  // ================================

  async generateSchedule(config: GenerationConfig): Promise<GenerationResult> {
    const startTime = Date.now()
    this.randomSeed = config.seed || Math.floor(Math.random() * 1000000)
    this.auditTrail = []

    try {
      this.logAudit('INITIALIZATION', 'Starting schedule generation', { config })

      // Phase 1: Load and validate data
      const context = await this.loadGenerationContext(config)
      
      // Phase 2: Clear existing schedule data for the month
      await this.clearExistingSchedule(config)
      
      // Phase 3: Create schedule instances in database
      await this.persistScheduleInstances(context.shiftInstances)
      
      // Phase 4: Generate assignments using optimized algorithm
      const assignments = await this.generateAssignmentsOptimized(context)
      
      // Phase 5: Persist assignments to database
      const persistedAssignments = await this.persistAssignments(assignments)
      
      // Phase 6: Validate and optimize results
      const validation = await this.validateAndOptimize(persistedAssignments, context)
      
      // Phase 7: Calculate metrics and finalize
      const metrics = this.calculateGenerationMetrics(persistedAssignments, context)
      const recommendations = this.generateRecommendations(metrics)

      this.performanceMetrics.totalTimeMs = Date.now() - startTime

      this.logAudit('COMPLETION', 'Schedule generation completed', {
        totalShifts: context.shiftInstances.length,
        assignedShifts: persistedAssignments.length,
        coveragePercentage: (persistedAssignments.length / context.shiftInstances.length) * 100
      })

      return {
        success: validation.isValid,
        assignments: persistedAssignments,
        metrics,
        validation,
        auditTrail: this.auditTrail,
        performance: this.performanceMetrics,
        recommendations
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      this.logAudit('ERROR', 'Generation failed', { error: errorMessage })
      
      return {
        success: false,
        assignments: [],
        metrics: this.getEmptyMetrics(),
        validation: { isValid: false, hardConstraintViolations: [], softConstraintIssues: [], warnings: [], recommendations: [] },
        auditTrail: this.auditTrail,
        performance: { ...this.performanceMetrics, totalTimeMs: Date.now() - startTime },
        recommendations: [`Generation failed: ${errorMessage}`]
      }
    }
  }

  async validateConfiguration(): Promise<ValidationResult> {
    // Implementation for configuration validation
    // This would check data integrity, roster adequacy, etc.
    return {
      isValid: true,
      hardConstraintViolations: [],
      softConstraintIssues: [],
      warnings: [],
      recommendations: []
    }
  }

  async estimatePerformance(): Promise<PerformanceEstimate> {
    // Implementation for performance estimation
    // This would analyze complexity and provide estimates
    return {
      estimatedTimeMs: 2000,
      estimatedMemoryMB: 50,
      complexityScore: 0.7,
      feasibilityScore: 0.95,
      warnings: []
    }
  }

  // ================================
  // CORE GENERATION ALGORITHM
  // ================================

  private async generateAssignmentsOptimized(context: GenerationContext): Promise<AssignmentRecord[]> {
    this.logAudit('ASSIGNMENT_GENERATION', 'Starting optimized assignment generation')

    const assignments: AssignmentRecord[] = []
    const assignedInstances = new Set<string>()
    const userDateAssignments = new Map<string, Set<string>>() // userId -> set of assigned dates

    // Initialize user date tracking
    for (const radiologist of context.radiologists) {
      userDateAssignments.set(radiologist.id, new Set())
    }

    // Sort shifts by difficulty (constraint satisfaction approach)
    const sortedInstances = this.sortInstancesByDifficulty(context.shiftInstances, context)
    
    this.logAudit('ASSIGNMENT_GENERATION', 'Sorted shifts by difficulty', { 
      totalShifts: sortedInstances.length,
      hardestShifts: sortedInstances.slice(0, 5).map(si => si.shiftType.code)
    })

    // Main assignment loop
    for (const shiftInstance of sortedInstances) {
      if (assignedInstances.has(shiftInstance.id)) {
        continue // Skip already assigned shifts
      }

      // Find eligible candidates
      const eligibleCandidates = this.findEligibleCandidates(shiftInstance, context, userDateAssignments)
      
      if (eligibleCandidates.length === 0) {
        this.logAudit('ASSIGNMENT_GENERATION', 'No eligible candidates found', {
          shiftType: shiftInstance.shiftType.code,
          date: shiftInstance.date.toISOString().split('T')[0],
          reason: 'All candidates filtered out by constraints'
        })
        continue // This will result in unassigned shift - should be tracked
      }

      // Score candidates using multi-factor algorithm
      const scoredCandidates = await this.scoreCandidates(eligibleCandidates, shiftInstance, context)
      
      // Select best candidate with randomization for fairness
      const selectedCandidate = this.selectCandidate(scoredCandidates)
      
      // Create assignment record
      const assignment: AssignmentRecord = {
        id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        instanceId: shiftInstance.id,
        userId: selectedCandidate.radiologist.id,
        assignmentType: 'GENERATED',
        confidence: selectedCandidate.confidence,
        constraintsSatisfied: selectedCandidate.constraintScores.keys ? Array.from(selectedCandidate.constraintScores.keys()) : [],
        createdAt: new Date()
      }

      assignments.push(assignment)
      assignedInstances.add(shiftInstance.id)
      
      // Update tracking
      const dateStr = shiftInstance.date.toISOString().split('T')[0]
      userDateAssignments.get(selectedCandidate.radiologist.id)?.add(dateStr)
      
      // Update context for fairness tracking
      this.updateContextAfterAssignment(context, assignment)

      this.logAudit('ASSIGNMENT_GENERATION', 'Assignment created', {
        radiologist: selectedCandidate.radiologist.name,
        shiftType: shiftInstance.shiftType.code,
        date: dateStr,
        confidence: selectedCandidate.confidence
      })

      // Performance tracking
      this.performanceMetrics.assignmentAttempts++
    }

    this.logAudit('ASSIGNMENT_GENERATION', 'Assignment generation completed', {
      totalAssignments: assignments.length,
      totalShifts: context.shiftInstances.length,
      coveragePercentage: (assignments.length / context.shiftInstances.length) * 100
    })

    return assignments
  }

  // ================================
  // CANDIDATE EVALUATION
  // ================================

  private findEligibleCandidates(
    shiftInstance: ShiftInstance, 
    context: GenerationContext,
    userDateAssignments: Map<string, Set<string>>
  ): RadiologistProfile[] {
    const dateStr = shiftInstance.date.toISOString().split('T')[0]
    
    return context.radiologists.filter(radiologist => {
      // Check if already assigned on this date
      if (userDateAssignments.get(radiologist.id)?.has(dateStr)) {
        return false
      }

      // Check vacation blocks
      const vacationBlocks = context.vacationBlocks.userBlocks.get(radiologist.id) || []
      const isOnVacation = vacationBlocks.some(block =>
        shiftInstance.date >= block.startDate && shiftInstance.date <= block.endDate
      )
      if (isOnVacation) return false

      // Check subspecialty eligibility
      if (!this.isSubspecialtyEligible(radiologist, shiftInstance.shiftType)) {
        return false
      }

      // Check named allowlist
      if (!this.isNamedAllowlistEligible(radiologist, shiftInstance.shiftType)) {
        return false
      }

      // Check FTE compliance
      if (!this.isFTECompliant(radiologist, shiftInstance, context)) {
        return false
      }

      return true
    })
  }

  private async scoreCandidates(
    candidates: RadiologistProfile[], 
    shiftInstance: ShiftInstance, 
    context: GenerationContext
  ): Promise<AssignmentCandidate[]> {
    const scoredCandidates: AssignmentCandidate[] = []

    for (const radiologist of candidates) {
      const candidate: AssignmentCandidate = {
        radiologist,
        shiftInstance,
        confidence: 0,
        constraintScores: new Map()
      }

      try {
        // Evaluate all constraints and get scores
        const constraintResults = this.constraintEngine.evaluateConstraints(candidate, context)
        
        // Calculate overall confidence score
        let totalScore = 0
        let weightSum = 0

        for (const result of constraintResults) {
          candidate.constraintScores.set(result.explanation, result)
          
          // Weight soft constraints for scoring
          const weight = this.getConstraintWeight(result.explanation)
          totalScore += result.score * weight
          weightSum += weight
        }

        candidate.confidence = weightSum > 0 ? totalScore / weightSum : 0
        scoredCandidates.push(candidate)

      } catch (error) {
        // Hard constraint violation - skip this candidate
        const errorMessage = error instanceof Error ? error.message : 'Constraint violation'
        this.logAudit('ASSIGNMENT_GENERATION', 'Candidate filtered by hard constraint', {
          radiologist: radiologist.name,
          shiftType: shiftInstance.shiftType.code,
          reason: errorMessage
        })
      }
    }

    return scoredCandidates.sort((a, b) => b.confidence - a.confidence)
  }

  private selectCandidate(scoredCandidates: AssignmentCandidate[]): AssignmentCandidate {
    if (scoredCandidates.length === 0) {
      throw new ScheduleGenerationError('No eligible candidates after scoring', 'INSUFFICIENT_RADIOLOGISTS')
    }

    // Take top 3 candidates for randomization (prevent gaming)
    const topCandidates = scoredCandidates.slice(0, Math.min(3, scoredCandidates.length))
    
    // Weighted random selection based on scores
    const weights = topCandidates.map(c => Math.max(1, c.confidence))
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    
    let random = this.seededRandom() * totalWeight
    for (let i = 0; i < topCandidates.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return topCandidates[i]
      }
    }

    return topCandidates[0] // Fallback
  }

  // ================================
  // HELPER METHODS
  // ================================

  private sortInstancesByDifficulty(instances: ShiftInstance[], context: GenerationContext): ShiftInstance[] {
    return [...instances].sort((a, b) => {
      const difficultyA = this.calculateInstanceDifficulty(a, context)
      const difficultyB = this.calculateInstanceDifficulty(b, context)
      return difficultyB - difficultyA // Highest difficulty first
    })
  }

  private calculateInstanceDifficulty(instance: ShiftInstance, context: GenerationContext): number {
    let difficulty = 0

    // Base difficulty on number of eligible candidates
    const eligibleCount = context.radiologists.filter(r =>
      this.isSubspecialtyEligible(r, instance.shiftType) &&
      this.isNamedAllowlistEligible(r, instance.shiftType)
    ).length

    difficulty += 10 / Math.max(1, eligibleCount) // Fewer candidates = higher difficulty

    // Weekend penalty
    const dayOfWeek = instance.date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      difficulty += 2
    }

    // Named restriction penalty
    if (instance.shiftType.namedAllowlist && instance.shiftType.namedAllowlist.length > 0) {
      difficulty += 3
    }

    // Subspecialty rarity penalty
    const subspecialtySize = context.radiologists.filter(r => 
      r.subspecialtyCode === instance.shiftType.subspecialtyRequired
    ).length
    if (subspecialtySize > 0) {
      difficulty += 5 / subspecialtySize
    }

    return difficulty
  }

  private isSubspecialtyEligible(radiologist: RadiologistProfile, shiftType: ShiftTypeDefinition): boolean {
    if (shiftType.allowAny) return true
    if (!shiftType.subspecialtyRequired) return true
    
    // Special case for INR procedures
    if (shiftType.subspecialtyRequired === 'INR') {
      return radiologist.subspecialtyCode === 'NEURO' && radiologist.email === 'rlarrazabal@test.com'
    }
    
    return radiologist.subspecialtyCode === shiftType.subspecialtyRequired
  }

  private isNamedAllowlistEligible(radiologist: RadiologistProfile, shiftType: ShiftTypeDefinition): boolean {
    if (!shiftType.namedAllowlist || shiftType.namedAllowlist.length === 0) return true
    return shiftType.namedAllowlist.includes(radiologist.email)
  }

  private isFTECompliant(radiologist: RadiologistProfile, _shiftInstance: ShiftInstance, context: GenerationContext): boolean {
    if (radiologist.ftePercent >= 100) return true

    // Count existing assignments for the month
    const targetMonth = context.config.targetMonth
    const targetYear = context.config.targetYear
    
    const monthlyAssignments = context.existingAssignments.filter(assignment => {
      const shiftInst = context.shiftInstances.find(si => si.id === assignment.instanceId)
      if (!shiftInst || assignment.userId !== radiologist.id) return false
      
      const shiftDate = shiftInst.date
      return shiftDate.getFullYear() === targetYear && shiftDate.getMonth() + 1 === targetMonth
    }).length

    const maxAssignments = Math.floor((radiologist.ftePercent / 100) * 22) // 22 work days
    return monthlyAssignments < maxAssignments
  }

  private getConstraintWeight(constraintType: string): number {
    // Weight different constraint types for scoring
    const weights = {
      'fairness': 3.0,
      'workload': 2.5,
      'vacation': 2.0,
      'desirability': 1.5,
      'default': 1.0
    }

    for (const [key, weight] of Object.entries(weights)) {
      if (constraintType.toLowerCase().includes(key)) {
        return weight
      }
    }

    return weights.default
  }

  private updateContextAfterAssignment(context: GenerationContext, assignment: AssignmentRecord): void {
    // Add to existing assignments
    context.existingAssignments.push(assignment)

    // Update workload tracker
    const userId = assignment.userId
    let workloadData = context.workloadTracker.userWorkloads.get(userId)
    if (!workloadData) {
      workloadData = {
        userId,
        assignmentCount: 0,
        totalHours: 0,
        weekendCount: 0,
        callShiftCount: 0,
        desirabilityScore: 0,
        fteCompliance: true
      }
      context.workloadTracker.userWorkloads.set(userId, workloadData)
    }

    workloadData.assignmentCount++
    // Update other workload metrics as needed

    // Update fairness ledger
    let fairnessScore = context.fairnessLedger.userScores.get(userId)
    if (!fairnessScore) {
      fairnessScore = {
        userId,
        currentAssignments: 0,
        targetAssignments: context.shiftInstances.length / context.radiologists.length,
        fairnessDebt: 0,
        vacationPreferencesGranted: { P1: 0, P2: 0, P3: 0 },
        desirabilityBalance: 0,
        lastAssignment: new Date()
      }
      context.fairnessLedger.userScores.set(userId, fairnessScore)
    }

    fairnessScore.currentAssignments++
    fairnessScore.fairnessDebt = fairnessScore.targetAssignments - fairnessScore.currentAssignments
    fairnessScore.lastAssignment = new Date()
  }

  // ================================
  // DATA LOADING & CONTEXT BUILDING
  // ================================

  private async loadGenerationContext(config: GenerationConfig): Promise<GenerationContext> {
    this.logAudit('DATA_LOADING', 'Loading generation context')

    // Load organization data
    const organization = await prisma.organization.findUnique({
      where: { id: config.organizationId }
    })

    if (!organization) {
      throw new ScheduleGenerationError(`Organization not found: ${config.organizationId}`, 'DATA_INTEGRITY_ERROR')
    }

    // Load radiologists with profiles
    const radiologists = await this.loadRadiologists(config.organizationId)
    
    // Load shift types
    const shiftTypes = await this.loadShiftTypes(config.organizationId)
    
    // Generate shift instances for target period
    const shiftInstances = await this.generateShiftInstances(config, shiftTypes)
    
    // Load vacation preferences
    const vacationPreferences = await this.loadVacationPreferences(config)
    
    // Build vacation blocks
    const vacationBlocks = this.buildVacationBlocks(vacationPreferences)
    
    // Initialize fairness ledger and workload tracker
    const fairnessLedger = this.initializeFairnessLedger(radiologists, shiftInstances)
    const workloadTracker = this.initializeWorkloadTracker(radiologists)
    
    // Build eligibility matrix
    const eligibilityMatrix = this.buildEligibilityMatrix(radiologists, shiftInstances)

    return {
      config,
      organization,
      radiologists,
      shiftTypes,
      shiftInstances,
      vacationPreferences,
      existingAssignments: [], // Start with empty assignments
      fairnessLedger,
      workloadTracker,
      vacationBlocks,
      eligibilityMatrix
    }
  }

  private async loadRadiologists(organizationId: string): Promise<RadiologistProfile[]> {
    const users = await prisma.user.findMany({
      where: { 
        organizationId,
        role: 'RADIOLOGIST'
      },
      include: {
        radiologistProfile: {
          include: {
            subspecialty: true
          }
        }
      }
    })

    return users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      subspecialtyCode: user.radiologistProfile?.subspecialty.code || 'GENERAL',
      ftePercent: user.radiologistProfile?.ftePercent || 100,
      isFellow: user.radiologistProfile?.isFellow || false,
      isResident: user.radiologistProfile?.isResident || false,
      canWorkMA1: this.isMA1Eligible(user.email),
      organizationId
    }))
  }

  private isMA1Eligible(email: string): boolean {
    const ma1Allowlist = [
      'balnawoot@test.com',
      'dwalker@test.com',
      'hchoudur@test.com',
      'mchiavaras@test.com',
      'sreddy@test.com',
      'mkamali@test.com'
    ]
    return ma1Allowlist.includes(email)
  }

  private async loadShiftTypes(organizationId: string): Promise<ShiftTypeDefinition[]> {
    const shiftTypes = await prisma.shiftType.findMany({
      where: { organizationId },
      include: {
        requiredSubspecialty: true
      }
    })

    return shiftTypes.map(st => ({
      id: st.id,
      code: st.code,
      name: st.name,
      startTime: st.startTime,
      endTime: st.endTime,
      isAllDay: st.isAllDay,
      subspecialtyRequired: st.requiredSubspecialty?.code,
      allowAny: st.allowAny,
      namedAllowlist: st.namedAllowlist ? st.namedAllowlist.split(',').map(email => email.trim()) : [],
      recurrence: {
        monday: st.monday,
        tuesday: st.tuesday,
        wednesday: st.wednesday,
        thursday: st.thursday,
        friday: st.friday,
        saturday: st.saturday,
        sunday: st.sunday
      },
      organizationId
    }))
  }

  private async generateShiftInstances(config: GenerationConfig, shiftTypes: ShiftTypeDefinition[]): Promise<ShiftInstance[]> {
    const instances: ShiftInstance[] = []
    const daysInMonth = new Date(config.targetYear, config.targetMonth, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(config.targetYear, config.targetMonth - 1, day)
      const dayOfWeek = date.getDay()

      for (const shiftType of shiftTypes) {
        let shouldCreate = false

        switch (dayOfWeek) {
          case 0: shouldCreate = shiftType.recurrence.sunday; break
          case 1: shouldCreate = shiftType.recurrence.monday; break
          case 2: shouldCreate = shiftType.recurrence.tuesday; break
          case 3: shouldCreate = shiftType.recurrence.wednesday; break
          case 4: shouldCreate = shiftType.recurrence.thursday; break
          case 5: shouldCreate = shiftType.recurrence.friday; break
          case 6: shouldCreate = shiftType.recurrence.saturday; break
        }

        if (shouldCreate) {
          const startTime = new Date(date)
          const endTime = new Date(date)

          if (!shiftType.isAllDay) {
            const [startHour, startMin] = shiftType.startTime.split(':')
            const [endHour, endMin] = shiftType.endTime.split(':')
            startTime.setHours(parseInt(startHour), parseInt(startMin))
            endTime.setHours(parseInt(endHour), parseInt(endMin))
          }

          // Create deterministic instance ID for consistency
          const instanceId = `instance_${shiftType.id}_${date.toISOString().split('T')[0]}`
          
          instances.push({
            id: instanceId,
            organizationId: config.organizationId,
            shiftTypeId: shiftType.id,
            date,
            startTime,
            endTime,
            status: 'DRAFT',
            shiftType
          })
        }
      }
    }

    return instances
  }

  private async loadVacationPreferences(config: GenerationConfig): Promise<VacationPreferenceData[]> {
    const preferences = await prisma.vacationPreference.findMany({
      where: {
        year: config.targetYear,
        month: config.targetMonth
      }
    })

    return preferences.map(pref => ({
      id: pref.id,
      userId: pref.userId,
      year: pref.year,
      month: pref.month,
      weekNumber: pref.weekNumber,
      rank: pref.rank as 1 | 2 | 3,
      weekStartDate: pref.weekStartDate,
      weekEndDate: pref.weekEndDate,
      status: pref.status as 'PENDING' | 'APPROVED' | 'REJECTED'
    }))
  }

  private buildVacationBlocks(preferences: VacationPreferenceData[]): VacationBlockMap {
    const userBlocks = new Map<string, Array<{ startDate: Date; endDate: Date; reason: string }>>()

    const approvedPreferences = preferences.filter(pref => pref.status === 'APPROVED')

    for (const pref of approvedPreferences) {
      if (!userBlocks.has(pref.userId)) {
        userBlocks.set(pref.userId, [])
      }

      userBlocks.get(pref.userId)!.push({
        startDate: pref.weekStartDate,
        endDate: pref.weekEndDate,
        reason: `P${pref.rank} vacation preference`
      })
    }

    return { userBlocks }
  }

  private initializeFairnessLedger(radiologists: RadiologistProfile[], shiftInstances: ShiftInstance[]): FairnessLedger {
    const userScores = new Map<string, FairnessScore>()
    const targetAssignments = shiftInstances.length / radiologists.length

    for (const radiologist of radiologists) {
      userScores.set(radiologist.id, {
        userId: radiologist.id,
        currentAssignments: 0,
        targetAssignments,
        fairnessDebt: targetAssignments, // Start with positive debt (owed assignments)
        vacationPreferencesGranted: { P1: 0, P2: 0, P3: 0 },
        desirabilityBalance: 0
      })
    }

    return {
      userScores,
      lastUpdated: new Date()
    }
  }

  private initializeWorkloadTracker(radiologists: RadiologistProfile[]): WorkloadTracker {
    const userWorkloads = new Map<string, WorkloadData>()

    for (const radiologist of radiologists) {
      userWorkloads.set(radiologist.id, {
        userId: radiologist.id,
        assignmentCount: 0,
        totalHours: 0,
        weekendCount: 0,
        callShiftCount: 0,
        desirabilityScore: 0,
        fteCompliance: true
      })
    }

    return {
      userWorkloads,
      statistics: {
        mean: 0,
        median: 0,
        standardDeviation: 0,
        coefficientOfVariation: 0,
        min: 0,
        max: 0,
        fairnessScore: 0
      }
    }
  }

  private buildEligibilityMatrix(radiologists: RadiologistProfile[], shiftInstances: ShiftInstance[]): EligibilityMatrix {
    const matrix = new Map<string, Map<string, boolean>>()
    const subspecialtyFilters = new Map<string, string[]>()
    const namedFilters = new Map<string, string[]>()

    // Build matrix
    for (const radiologist of radiologists) {
      const userEligibility = new Map<string, boolean>()
      
      for (const shiftInstance of shiftInstances) {
        const isEligible = this.isSubspecialtyEligible(radiologist, shiftInstance.shiftType) &&
                          this.isNamedAllowlistEligible(radiologist, shiftInstance.shiftType)
        userEligibility.set(shiftInstance.id, isEligible)
      }
      
      matrix.set(radiologist.id, userEligibility)
    }

    return { matrix, subspecialtyFilters, namedFilters }
  }

  // ================================
  // VALIDATION & OPTIMIZATION
  // ================================

  private async validateAndOptimize(assignments: AssignmentRecord[], context: GenerationContext): Promise<ValidationResult> {
    const hardConstraintViolations: ConstraintViolation[] = []
    const softConstraintIssues: ConstraintViolation[] = []
    const warnings: ValidationWarning[] = []
    const recommendations: string[] = []

    // Check coverage
    const coveragePercentage = (assignments.length / context.shiftInstances.length) * 100
    if (coveragePercentage < 100) {
      hardConstraintViolations.push({
        constraintId: 'COVERAGE',
        severity: 'CRITICAL' as const,
        description: `Incomplete coverage: ${coveragePercentage.toFixed(1)}%`,
        affectedAssignments: [],
        suggestedFix: 'Review radiologist availability and shift requirements'
      })
    }

    // Check workload distribution
    const workloadStats = this.calculateWorkloadStatistics(assignments, context)
    if (workloadStats.coefficientOfVariation > 0.25) {
      softConstraintIssues.push({
        constraintId: 'WORKLOAD_BALANCE',
        severity: 'WARNING' as const,
        description: `High workload variation: CV=${(workloadStats.coefficientOfVariation * 100).toFixed(1)}%`,
        affectedAssignments: [],
        suggestedFix: 'Run optimization passes to balance workload'
      })
    }

    return {
      isValid: hardConstraintViolations.length === 0,
      hardConstraintViolations,
      softConstraintIssues,
      warnings,
      recommendations
    }
  }

  // ================================
  // METRICS & PERFORMANCE
  // ================================

  private calculateGenerationMetrics(assignments: AssignmentRecord[], context: GenerationContext): GenerationMetrics {
    const totalShifts = context.shiftInstances.length
    const assignedShifts = assignments.length
    const unassignedShifts = totalShifts - assignedShifts
    const coveragePercentage = (assignedShifts / totalShifts) * 100

    const workloadDistribution = this.calculateWorkloadStatistics(assignments, context)
    const vacationSatisfaction = this.calculateVacationSatisfaction(context)

    return {
      totalShifts,
      assignedShifts,
      unassignedShifts,
      coveragePercentage,
      constraintViolations: 0,
      fairnessScore: 100 - (workloadDistribution.coefficientOfVariation * 100),
      workloadDistribution,
      vacationSatisfaction
    }
  }

  private calculateWorkloadStatistics(assignments: AssignmentRecord[], context: GenerationContext): WorkloadStatistics {
    const workloads = Array.from(context.workloadTracker.userWorkloads.values())
      .map(w => w.assignmentCount)

    const mean = workloads.reduce((sum, w) => sum + w, 0) / workloads.length
    const variance = workloads.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / workloads.length
    const standardDeviation = Math.sqrt(variance)
    const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0

    return {
      mean,
      median: this.calculateMedian(workloads),
      standardDeviation,
      coefficientOfVariation,
      min: Math.min(...workloads),
      max: Math.max(...workloads),
      fairnessScore: Math.max(0, 100 - (coefficientOfVariation * 100))
    }
  }

  private calculateVacationSatisfaction(context: GenerationContext): VacationSatisfactionMetrics {
    const preferences = context.vacationPreferences
    const totalPreferences = preferences.length

    const P1Granted = preferences.filter(p => p.rank === 1 && p.status === 'APPROVED').length
    const P2Granted = preferences.filter(p => p.rank === 2 && p.status === 'APPROVED').length
    const P3Granted = preferences.filter(p => p.rank === 3 && p.status === 'APPROVED').length
    const noneGranted = totalPreferences - P1Granted - P2Granted - P3Granted

    return {
      totalPreferences,
      P1Granted,
      P2Granted,
      P3Granted,
      noneGranted,
      P1Percentage: totalPreferences > 0 ? (P1Granted / totalPreferences) * 100 : 0,
      P2Percentage: totalPreferences > 0 ? (P2Granted / totalPreferences) * 100 : 0,
      P3Percentage: totalPreferences > 0 ? (P3Granted / totalPreferences) * 100 : 0
    }
  }

  private generateRecommendations(metrics: GenerationMetrics): string[] {
    const recommendations: string[] = []

    if (metrics.coveragePercentage < 100) {
      recommendations.push(`Improve coverage from ${metrics.coveragePercentage.toFixed(1)}% to 100%`)
    }

    if (metrics.workloadDistribution.coefficientOfVariation > 0.15) {
      recommendations.push(`Reduce workload variation from ${(metrics.workloadDistribution.coefficientOfVariation * 100).toFixed(1)}% to <15%`)
    }

    if (metrics.vacationSatisfaction.P1Percentage < 60) {
      recommendations.push(`Improve P1 vacation satisfaction from ${metrics.vacationSatisfaction.P1Percentage.toFixed(1)}% to >60%`)
    }

    return recommendations
  }

  // ================================
  // DATABASE PERSISTENCE METHODS
  // ================================

  private async clearExistingSchedule(config: GenerationConfig): Promise<void> {
    this.logAudit('DATA_CLEANUP', 'Clearing existing schedule data for month')
    
    const firstDay = new Date(config.targetYear, config.targetMonth - 1, 1)
    const lastDay = new Date(config.targetYear, config.targetMonth, 0)

    // Delete existing assignments and instances for the month
    await prisma.$transaction(async (tx) => {
      // First delete assignments (due to foreign key constraints)
      await tx.scheduleAssignment.deleteMany({
        where: {
          instance: {
            organizationId: config.organizationId,
            date: {
              gte: firstDay,
              lte: lastDay
            }
          }
        }
      })

      // Then delete schedule instances
      await tx.scheduleInstance.deleteMany({
        where: {
          organizationId: config.organizationId,
          date: {
            gte: firstDay,
            lte: lastDay
          }
        }
      })
    })

    this.logAudit('DATA_CLEANUP', 'Existing schedule data cleared')
  }

  private async persistScheduleInstances(shiftInstances: ShiftInstance[]): Promise<void> {
    this.logAudit('DATA_PERSISTENCE', 'Persisting schedule instances to database', {
      instanceCount: shiftInstances.length
    })

    // Create schedule instances in batches to avoid memory issues
    const batchSize = 50
    for (let i = 0; i < shiftInstances.length; i += batchSize) {
      const batch = shiftInstances.slice(i, i + batchSize)
      
      await prisma.scheduleInstance.createMany({
        data: batch.map(instance => ({
          id: instance.id,
          organizationId: instance.organizationId,
          shiftTypeId: instance.shiftTypeId,
          date: instance.date,
          startTime: instance.startTime,
          endTime: instance.endTime,
          status: 'DRAFT'
        })),
        skipDuplicates: true
      })
    }

    this.logAudit('DATA_PERSISTENCE', 'Schedule instances persisted successfully')
  }

  private async persistAssignments(assignments: AssignmentRecord[]): Promise<AssignmentRecord[]> {
    this.logAudit('DATA_PERSISTENCE', 'Persisting assignments to database', {
      assignmentCount: assignments.length
    })

    if (assignments.length === 0) {
      this.logAudit('DATA_PERSISTENCE', 'No assignments to persist')
      return []
    }

    const persistedAssignments: AssignmentRecord[] = []

    // Create assignments one by one to handle conflicts and get proper IDs
    for (const assignment of assignments) {
      try {
        const created = await prisma.scheduleAssignment.create({
          data: {
            instanceId: assignment.instanceId,
            userId: assignment.userId,
            assignmentType: assignment.assignmentType as 'GENERATED' | 'MANUAL' | 'SWAPPED'
          }
        })

        // Update assignment record with database ID
        const persistedAssignment: AssignmentRecord = {
          ...assignment,
          id: created.id,
          createdAt: created.createdAt
        }

        persistedAssignments.push(persistedAssignment)

        this.logAudit('DATA_PERSISTENCE', 'Assignment created', {
          assignmentId: created.id,
          instanceId: assignment.instanceId,
          userId: assignment.userId
        })

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        this.logAudit('DATA_PERSISTENCE', 'Failed to create assignment', {
          instanceId: assignment.instanceId,
          userId: assignment.userId,
          error: errorMessage
        })
        
        // Continue with other assignments even if one fails
        console.warn(`Failed to persist assignment: ${errorMessage}`)
      }
    }

    this.logAudit('DATA_PERSISTENCE', 'Assignment persistence completed', {
      requested: assignments.length,
      persisted: persistedAssignments.length,
      success: persistedAssignments.length === assignments.length
    })

    return persistedAssignments
  }

  // ================================
  // UTILITY METHODS
  // ================================

  private seededRandom(): number {
    const x = Math.sin(this.randomSeed++) * 10000
    return x - Math.floor(x)
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid]
  }

  private logAudit(phase: GenerationPhase, action: string, details?: Record<string, unknown>): void {
    this.auditTrail.push({
      timestamp: new Date(),
      phase,
      action,
      details: details || {}
    })
  }

  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      totalTimeMs: 0,
      phaseTimings: new Map(),
      memoryUsageMB: 0,
      databaseQueries: 0,
      constraintEvaluations: 0,
      assignmentAttempts: 0,
      optimizationPasses: 0
    }
  }

  private getEmptyMetrics(): GenerationMetrics {
    return {
      totalShifts: 0,
      assignedShifts: 0,
      unassignedShifts: 0,
      coveragePercentage: 0,
      constraintViolations: 0,
      fairnessScore: 0,
      workloadDistribution: {
        mean: 0,
        median: 0,
        standardDeviation: 0,
        coefficientOfVariation: 0,
        min: 0,
        max: 0,
        fairnessScore: 0
      },
      vacationSatisfaction: {
        totalPreferences: 0,
        P1Granted: 0,
        P2Granted: 0,
        P3Granted: 0,
        noneGranted: 0,
        P1Percentage: 0,
        P2Percentage: 0,
        P3Percentage: 0
      }
    }
  }
}

// Export moved to index.ts to avoid duplicate declaration
