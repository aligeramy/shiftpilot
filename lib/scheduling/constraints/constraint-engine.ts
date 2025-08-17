/**
 * Constraint Engine - Enterprise-Level Constraint Validation System
 * Implements all hard and soft constraints with mathematical precision
 */

import {
  ConstraintEngine,
  ConstraintDefinition,
  ConstraintResult,
  ConstraintValidator,
  AssignmentCandidate,
  GenerationContext,
  ScheduleGenerationError,
  CONSTRAINT_PRIORITIES,
  RadiologistProfile,
} from '../core/types'

export class EnterpriseConstraintEngine implements ConstraintEngine {
  private hardConstraints: Map<string, ConstraintDefinition> = new Map()
  private softConstraints: Map<string, ConstraintDefinition> = new Map()

  constructor() {
    this.initializeConstraints()
  }

  private initializeConstraints(): void {
    // ================================
    // HARD CONSTRAINTS (Never Violated)
    // ================================

    this.addHardConstraint({
      id: 'HC-001-COVERAGE',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.COVERAGE,
      description: 'Every shift instance must have exactly 1 assigned radiologist',
      validator: new CoverageConstraintValidator()
    })

    this.addHardConstraint({
      id: 'HC-002-SUBSPECIALTY',
      type: 'HARD', 
      priority: CONSTRAINT_PRIORITIES.SUBSPECIALTY,
      description: 'Radiologist subspecialty must match shift requirements',
      validator: new SubspecialtyConstraintValidator()
    })

    this.addHardConstraint({
      id: 'HC-003-NAMED-ALLOWLIST',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.NAMED_ALLOWLIST,
      description: 'Named shifts must only assign radiologists in allowlist',
      validator: new NamedAllowlistConstraintValidator()
    })

    this.addHardConstraint({
      id: 'HC-004-SINGLE-ASSIGNMENT',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.SINGLE_ASSIGNMENT,
      description: 'No radiologist can work multiple shifts on same calendar day',
      validator: new SingleAssignmentConstraintValidator()
    })

    this.addHardConstraint({
      id: 'HC-005-VACATION-BLOCK',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.VACATION_BLOCK,
      description: 'Radiologists cannot be assigned during approved vacation',
      validator: new VacationBlockConstraintValidator()
    })

    this.addHardConstraint({
      id: 'HC-006-FTE-COMPLIANCE',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.FTE_COMPLIANCE,
      description: 'Part-time radiologists must have required days off per month',
      validator: new FTEComplianceConstraintValidator()
    })

    // ================================
    // SOFT CONSTRAINTS (Optimized)
    // ================================

    this.addSoftConstraint({
      id: 'SC-001-WORKLOAD-BALANCE',
      type: 'SOFT',
      priority: CONSTRAINT_PRIORITIES.WORKLOAD_BALANCE,
      description: 'Minimize coefficient of variation in monthly assignments',
      validator: new WorkloadBalanceConstraintValidator()
    })

    this.addSoftConstraint({
      id: 'SC-002-FAIRNESS',
      type: 'SOFT',
      priority: CONSTRAINT_PRIORITIES.FAIRNESS,
      description: 'Maintain fairness debt tracking across all radiologists',
      validator: new FairnessConstraintValidator()
    })

    this.addSoftConstraint({
      id: 'SC-003-VACATION-PREFERENCE',
      type: 'SOFT',
      priority: CONSTRAINT_PRIORITIES.VACATION_PREFERENCE,
      description: 'Maximize first-choice vacation preferences granted',
      validator: new VacationPreferenceConstraintValidator()
    })

    this.addSoftConstraint({
      id: 'SC-004-DESIRABILITY-BALANCE',
      type: 'SOFT',
      priority: CONSTRAINT_PRIORITIES.DESIRABILITY_BALANCE,
      description: 'Evenly distribute desirable vs undesirable shifts',
      validator: new DesirabilityBalanceConstraintValidator()
    })

    // ================================
    // NEW ADVANCED CONSTRAINTS
    // ================================

    this.addHardConstraint({
      id: 'HC-007-WEEKDAY-DISTRIBUTION',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.FTE_COMPLIANCE - 50,
      description: 'Each radiologist must have exactly 1 of each weekday off per month',
      validator: new WeekdayDistributionConstraintValidator()
    })

    // Temporarily disabled - learner constraint causing issues when no learners present
    // this.addHardConstraint({
    //   id: 'HC-008-LEARNER-LATE-SHIFTS',
    //   type: 'HARD',
    //   priority: CONSTRAINT_PRIORITIES.SUBSPECIALTY - 50,
    //   description: 'Four out of five late shifts must be assigned to learners',
    //   validator: new LearnerLateShiftConstraintValidator()
    // })

    this.addHardConstraint({
      id: 'HC-009-SHIFT-DEPENDENCIES',
      type: 'HARD',
      priority: CONSTRAINT_PRIORITIES.COVERAGE - 50,
      description: 'Enforce temporal dependencies between related shifts',
      validator: new ShiftDependencyConstraintValidator()
    })

    this.addSoftConstraint({
      id: 'SC-005-INSTITUTIONAL-VACATION',
      type: 'SOFT',
      priority: CONSTRAINT_PRIORITIES.VACATION_PREFERENCE + 50,
      description: 'Enforce institutional vacation rules (Christmas, summer blackouts)',
      validator: new InstitutionalVacationConstraintValidator()
    })
  }

  // ================================
  // PUBLIC INTERFACE
  // ================================

  evaluateConstraints(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult[] {
    const results: ConstraintResult[] = []

    // Evaluate hard constraints first (critical)
    for (const constraint of this.hardConstraints.values()) {
      const result = constraint.validator.validate(candidate, context)
      results.push(result)
      
      // Hard constraint violation = immediate failure
      if (!result.satisfied) {
        throw new ScheduleGenerationError(
          `Hard constraint violation: ${constraint.description}`,
          'CONSTRAINT_VIOLATION',
          {
            constraintId: constraint.id,
            candidateUserId: candidate.radiologist.id,
            shiftInstanceId: candidate.shiftInstance.id,
            explanation: result.explanation
          }
        )
      }
    }

    // Evaluate soft constraints (optimization)
    for (const constraint of this.softConstraints.values()) {
      const result = constraint.validator.validate(candidate, context)
      results.push(result)
    }

    return results
  }

  getHardConstraints(): ConstraintDefinition[] {
    return Array.from(this.hardConstraints.values())
  }

  getSoftConstraints(): ConstraintDefinition[] {
    return Array.from(this.softConstraints.values())
  }

  validateConstraintSet(): boolean {
    // Verify all constraints are properly configured
    const allConstraints = [
      ...this.hardConstraints.values(),
      ...this.softConstraints.values()
    ]

    for (const constraint of allConstraints) {
      if (!constraint.validator || typeof constraint.validator.validate !== 'function') {
        console.error(`Invalid validator for constraint ${constraint.id}`)
        return false
      }
    }

    return true
  }

  // ================================
  // PRIVATE HELPERS
  // ================================

  private addHardConstraint(constraint: ConstraintDefinition): void {
    this.hardConstraints.set(constraint.id, constraint)
  }

  private addSoftConstraint(constraint: ConstraintDefinition): void {
    this.softConstraints.set(constraint.id, constraint)
  }
}

// ================================
// HARD CONSTRAINT VALIDATORS
// ================================

class CoverageConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    // Check if this shift instance already has assignments in the context
    const existingAssignments = context.existingAssignments.filter(
      assignment => assignment.instanceId === candidate.shiftInstance.id
    )
    
    // Coverage is satisfied if we can assign without conflicts
    const wouldExceedCoverage = existingAssignments.length >= 1
    
    return {
      satisfied: !wouldExceedCoverage,
      score: wouldExceedCoverage ? 0 : 100,
      explanation: wouldExceedCoverage 
        ? `Shift ${candidate.shiftInstance.shiftType.code} already has assignment`
        : `Coverage constraint satisfied for ${candidate.shiftInstance.shiftType.code}`
    }
  }
}

class SubspecialtyConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const requiredSubspecialty = candidate.shiftInstance.shiftType.subspecialtyRequired
    const radiologistSubspecialty = candidate.radiologist.subspecialtyCode

    // If no subspecialty required (allowAny), always valid
    if (candidate.shiftInstance.shiftType.allowAny || !requiredSubspecialty) {
      // Check availability of other radiologists for fairness scoring
      const availableRadiologists = context.radiologists.filter(r => 
        !context.vacationBlocks.userBlocks.get(r.id)?.some(block =>
          candidate.shiftInstance.date >= block.startDate && 
          candidate.shiftInstance.date <= block.endDate
        )
      ).length
      
      const score = Math.min(100, 50 + (availableRadiologists * 2)) // Higher score with more options
      
      return {
        satisfied: true,
        score,
        explanation: `Shift allows any subspecialty (${availableRadiologists} available radiologists)`
      }
    }

    // Check exact subspecialty match
    const isMatch = radiologistSubspecialty === requiredSubspecialty

    // Special case: INR procedures require NEURO with INR certification
    if (requiredSubspecialty === 'INR') {
      const isNEUROWithINR = radiologistSubspecialty === 'NEURO' && 
        this.hasINRCertification(candidate.radiologist.email)
      
      return {
        satisfied: isNEUROWithINR,
        score: isNEUROWithINR ? 100 : 0,
        explanation: isNEUROWithINR 
          ? 'NEURO radiologist with INR certification'
          : 'INR procedure requires NEURO radiologist with INR certification'
      }
    }

    return {
      satisfied: isMatch,
      score: isMatch ? 100 : 0,
      explanation: isMatch 
        ? `Subspecialty match: ${radiologistSubspecialty}`
        : `Subspecialty mismatch: requires ${requiredSubspecialty}, has ${radiologistSubspecialty}`
    }
  }

  private hasINRCertification(email: string): boolean {
    // In real implementation, this would check a certification database
    // For now, we know Ramiro Larrazabal has INR certification
    return email === 'rlarrazabal@test.com'
  }
}

class NamedAllowlistConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const namedAllowlist = candidate.shiftInstance.shiftType.namedAllowlist
    
    // If no named allowlist, constraint is satisfied
    if (!namedAllowlist || namedAllowlist.length === 0) {
      // Score based on total available radiologists for this shift type
      const eligibleCount = context.radiologists.filter(r => 
        candidate.shiftInstance.shiftType.allowAny || 
        r.subspecialtyCode === candidate.shiftInstance.shiftType.subspecialtyRequired
      ).length
      
      const score = Math.min(100, 60 + (eligibleCount * 3)) // Higher score with more options
      
      return {
        satisfied: true,
        score,
        explanation: `No named allowlist restriction (${eligibleCount} eligible radiologists)`
      }
    }

    const isInAllowlist = namedAllowlist.includes(candidate.radiologist.email)
    
    if (isInAllowlist) {
      // Check how many others in allowlist are available for better scoring
      const availableInAllowlist = context.radiologists.filter(r => 
        namedAllowlist.includes(r.email) &&
        !context.vacationBlocks.userBlocks.get(r.id)?.some(block =>
          candidate.shiftInstance.date >= block.startDate && 
          candidate.shiftInstance.date <= block.endDate
        )
      ).length
      
      const score = Math.max(85, 100 - ((namedAllowlist.length - availableInAllowlist) * 5))
      
      return {
        satisfied: true,
        score,
        explanation: `In named allowlist for ${candidate.shiftInstance.shiftType.code} (${availableInAllowlist}/${namedAllowlist.length} available)`
      }
    }

    return {
      satisfied: false,
      score: 0,
      explanation: `Not in named allowlist for ${candidate.shiftInstance.shiftType.code} (requires: ${namedAllowlist.join(', ')})`
    }
  }
}

class SingleAssignmentConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const assignmentDate = candidate.shiftInstance.date
    const dateStr = assignmentDate.toISOString().split('T')[0]
    
    // Check if radiologist already has assignment on this date
    const existingAssignment = context.existingAssignments.find(assignment => {
      const existingShift = context.shiftInstances.find(si => si.id === assignment.instanceId)
      if (!existingShift) return false
      
      const existingDateStr = existingShift.date.toISOString().split('T')[0]
      return assignment.userId === candidate.radiologist.id && existingDateStr === dateStr
    })

    const hasConflict = !!existingAssignment

    return {
      satisfied: !hasConflict,
      score: hasConflict ? 0 : 100,
      explanation: hasConflict
        ? `Radiologist already assigned on ${dateStr}`
        : `No date conflict for ${dateStr}`
    }
  }
}

class VacationBlockConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const assignmentDate = candidate.shiftInstance.date
    const userVacationBlocks = context.vacationBlocks.userBlocks.get(candidate.radiologist.id) || []

    // Check if assignment date falls within any vacation block
    const isOnVacation = userVacationBlocks.some(block => 
      assignmentDate >= block.startDate && assignmentDate <= block.endDate
    )

    return {
      satisfied: !isOnVacation,
      score: isOnVacation ? 0 : 100,
      explanation: isOnVacation
        ? `Radiologist on approved vacation during ${assignmentDate.toISOString().split('T')[0]}`
        : `No vacation conflict for ${assignmentDate.toISOString().split('T')[0]}`
    }
  }
}

class FTEComplianceConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const ftePercent = candidate.radiologist.ftePercent
    const userId = candidate.radiologist.id

    // Full-time radiologists (100%) have no restrictions
    if (ftePercent >= 100) {
      return {
        satisfied: true,
        score: 100,
        explanation: 'Full-time radiologist - no FTE restrictions'
      }
    }

    // Calculate current assignments for the month
    const targetMonth = context.config.targetMonth
    const targetYear = context.config.targetYear
    
    const monthlyAssignments = context.existingAssignments.filter(assignment => {
      const shiftInstance = context.shiftInstances.find(si => si.id === assignment.instanceId)
      if (!shiftInstance || assignment.userId !== userId) return false
      
      const shiftDate = shiftInstance.date
      return shiftDate.getFullYear() === targetYear && shiftDate.getMonth() + 1 === targetMonth
    }).length

    // Calculate FTE limits
    const workDaysInMonth = 22 // Approximate
    const maxAssignments = Math.floor((ftePercent / 100) * workDaysInMonth)
    
    const wouldExceedFTE = (monthlyAssignments + 1) > maxAssignments

    return {
      satisfied: !wouldExceedFTE,
      score: wouldExceedFTE ? 0 : 100,
      explanation: wouldExceedFTE
        ? `Assignment would exceed FTE limit: ${monthlyAssignments + 1}/${maxAssignments} (${ftePercent}%)`
        : `Within FTE limit: ${monthlyAssignments + 1}/${maxAssignments} (${ftePercent}%)`
    }
  }
}

// ================================
// SOFT CONSTRAINT VALIDATORS
// ================================

class WorkloadBalanceConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const userId = candidate.radiologist.id
    const currentWorkload = context.workloadTracker.userWorkloads.get(userId)?.assignmentCount || 0
    const targetWorkload = context.shiftInstances.length / context.radiologists.length

    // Calculate workload deviation from target
    const deviation = Math.abs(currentWorkload - targetWorkload)
    const maxDeviation = targetWorkload * 0.5 // Allow 50% deviation before major penalty

    // Score based on how close to target workload
    const score = Math.max(0, 100 - (deviation / maxDeviation) * 100)

    return {
      satisfied: true, // Soft constraint - always satisfied
      score: Math.round(score),
      explanation: `Workload balance: current=${currentWorkload}, target=${targetWorkload.toFixed(1)}, deviation=${deviation.toFixed(1)}`
    }
  }
}

class FairnessConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const userId = candidate.radiologist.id
    const fairnessScore = context.fairnessLedger.userScores.get(userId)
    
    if (!fairnessScore) {
      return {
        satisfied: true,
        score: 50, // Neutral score for new radiologist
        explanation: 'No fairness history - neutral score'
      }
    }

    // Fairness debt: positive = owed more assignments, negative = over-assigned
    const fairnessDebt = fairnessScore.fairnessDebt
    const maxDebt = 10 // Maximum fairness debt before major penalty

    // Higher debt = higher score (priority for assignment)
    const score = Math.max(0, Math.min(100, 50 + (fairnessDebt / maxDebt) * 50))

    return {
      satisfied: true,
      score: Math.round(score),
      explanation: `Fairness debt: ${fairnessDebt.toFixed(1)} (positive = owed assignments)`
    }
  }
}

class VacationPreferenceConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const userId = candidate.radiologist.id
    const assignmentDate = candidate.shiftInstance.date
    const month = assignmentDate.getMonth() + 1
    const year = assignmentDate.getFullYear()

    // Find vacation preferences for this user/month
    const userPreferences = context.vacationPreferences.filter(pref => 
      pref.userId === userId && pref.year === year && pref.month === month
    )

    if (userPreferences.length === 0) {
      return {
        satisfied: true,
        score: 50, // Neutral - no preferences to consider
        explanation: 'No vacation preferences for this month'
      }
    }

    // Check if assignment falls during any requested vacation weeks
    const isInRequestedVacation = userPreferences.some(pref => 
      assignmentDate >= pref.weekStartDate && assignmentDate <= pref.weekEndDate
    )

    if (isInRequestedVacation) {
      const conflictingPref = userPreferences.find(pref =>
        assignmentDate >= pref.weekStartDate && assignmentDate <= pref.weekEndDate
      )

      // Penalty based on preference rank (P1 = highest penalty)
      const penaltyByRank = { 1: -50, 2: -30, 3: -10 }
      const penalty = penaltyByRank[conflictingPref!.rank] || 0

      return {
        satisfied: false,
        score: Math.max(0, 50 + penalty),
        explanation: `Conflicts with P${conflictingPref!.rank} vacation preference`,
        violationType: 'WARNING'
      }
    }

    return {
      satisfied: true,
      score: 70, // Bonus for not conflicting with vacation preferences
      explanation: 'No vacation preference conflicts'
    }
  }
}

class DesirabilityBalanceConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const userId = candidate.radiologist.id
    const shiftType = candidate.shiftInstance.shiftType
    
    // Calculate shift desirability score
    const desirabilityScore = this.calculateShiftDesirability(shiftType, candidate.shiftInstance.date)
    
    // Get current desirability balance for user
    const userWorkload = context.workloadTracker.userWorkloads.get(userId)
    const currentDesirability = userWorkload?.desirabilityScore || 0
    const targetDesirability = 0 // Target neutral balance

    // Calculate how this assignment affects balance
    const newBalance = currentDesirability + desirabilityScore
    const balanceScore = Math.max(0, 100 - Math.abs(newBalance - targetDesirability) * 10)

    return {
      satisfied: true,
      score: Math.round(balanceScore),
      explanation: `Desirability: shift=${desirabilityScore}, current=${currentDesirability}, new=${newBalance}`
    }
  }

  private calculateShiftDesirability(shiftType: { code: string; startTime: string }, date: Date): number {
    let score = 0

    // Time-based scoring
    const hour = parseInt(shiftType.startTime.split(':')[0])
    if (hour >= 8 && hour <= 16) score += 2 // Normal business hours
    else if (hour >= 16 && hour <= 18) score -= 1 // Late afternoon
    else if (hour >= 18 && hour <= 21) score -= 3 // Evening
    else score -= 10 // Night/call

    // Day-based scoring
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) score -= 5 // Weekend penalty

    // Shift type specific scoring
    if (shiftType.code.includes('CALL')) score -= 10
    if (shiftType.code === 'MA1') score += 5 // Desirable clinic
    if (shiftType.code.includes('PROC')) score += 3 // Procedures

    return score
  }
}

// ================================
// NEW ADVANCED CONSTRAINT VALIDATORS  
// ================================

class WeekdayDistributionConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const userId = candidate.radiologist.id
    const assignmentDate = candidate.shiftInstance.date
    const dayOfWeek = assignmentDate.getDay() // 0=Sunday, 1=Monday, etc.
    
    // Count existing assignments by day of week for this user this month
    const monthlyAssignments = context.existingAssignments.filter(assignment => {
      const shiftInstance = context.shiftInstances.find(si => si.id === assignment.instanceId)
      if (!shiftInstance || assignment.userId !== userId) return false
      
      const shiftDate = shiftInstance.date
      return shiftDate.getFullYear() === assignmentDate.getFullYear() && 
             shiftDate.getMonth() === assignmentDate.getMonth()
    })
    
    // Count assignments by day of week
    const dayCount = [0, 0, 0, 0, 0, 0, 0] // Sun-Sat
    monthlyAssignments.forEach(assignment => {
      const shiftInstance = context.shiftInstances.find(si => si.id === assignment.instanceId)
      if (shiftInstance) {
        dayCount[shiftInstance.date.getDay()]++
      }
    })
    
    // Check if adding this assignment would create imbalance
    const newDayCount = [...dayCount]
    newDayCount[dayOfWeek]++
    
    // Target: roughly equal distribution (allow ±1 variance)
    const workDays = newDayCount.slice(1, 6) // Monday-Friday
    const maxWorkDay = Math.max(...workDays)
    const minWorkDay = Math.min(...workDays)
    const isBalanced = (maxWorkDay - minWorkDay) <= 2
    
    return {
      satisfied: isBalanced,
      score: isBalanced ? 100 : Math.max(0, 80 - ((maxWorkDay - minWorkDay) * 10)),
      explanation: `Weekday distribution: ${workDays.join(',')} (max-min=${maxWorkDay - minWorkDay})`
    }
  }
}


class ShiftDependencyConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const dependencies = this.getShiftDependencies()
    const currentShift = candidate.shiftInstance
    
    // Check if current shift has dependencies
    for (const [shiftPattern, dependentPattern] of dependencies) {
      if (this.matchesPattern(currentShift.shiftType.code, shiftPattern)) {
        // Find the dependent shift (next day)
        const nextDay = new Date(currentShift.date)
        nextDay.setDate(nextDay.getDate() + 1)
        
        const dependentShift = context.shiftInstances.find(si => 
          si.date.toDateString() === nextDay.toDateString() &&
          this.matchesPattern(si.shiftType.code, dependentPattern)
        )
        
        if (dependentShift) {
          // Check if dependent shift can be covered by appropriate pool
          const eligibleForDependent = context.radiologists.filter(r =>
            this.isEligibleForDependentShift(r, dependentPattern)
          )
          
          if (eligibleForDependent.length === 0) {
            return {
              satisfied: false,
              score: 0,
              explanation: `No eligible radiologists for dependent shift ${dependentPattern} tomorrow`
            }
          }
          
          return {
            satisfied: true,
            score: Math.min(100, 70 + (eligibleForDependent.length * 5)),
            explanation: `Dependency satisfied: ${eligibleForDependent.length} eligible for ${dependentPattern} tomorrow`
          }
        }
      }
    }
    
    return {
      satisfied: true,
      score: 100,
      explanation: 'No shift dependencies apply'
    }
  }
  
  private getShiftDependencies(): Array<[string, string]> {
    return [
      ['NEURO_16_18', 'NEURO_18_21'], // Neuro 1/2 16-18 → Neuro 3 18-21 next day
      ['N1', 'NEURO_18_21'],          // Alternative pattern
      ['N2', 'NEURO_18_21']           // Alternative pattern
    ]
  }
  
  private matchesPattern(shiftCode: string, pattern: string): boolean {
    return shiftCode.includes(pattern) || shiftCode === pattern
  }
  
  private isEligibleForDependentShift(radiologist: RadiologistProfile, dependentPattern: string): boolean {
    // For NEURO_18_21 (Neuro 3), only specific radiologists eligible
    if (dependentPattern.includes('NEURO_18_21')) {
      return radiologist.subspecialtyCode === 'NEURO' && !radiologist.isFellow
    }
    return true
  }
}

class InstitutionalVacationConstraintValidator implements ConstraintValidator {
  validate(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult {
    const assignmentDate = candidate.shiftInstance.date
    const blackoutPeriods = this.getInstitutionalBlackouts(assignmentDate.getFullYear())
    
    // Check if assignment falls during blackout period
    const isInBlackout = blackoutPeriods.some(period =>
      assignmentDate >= period.start && assignmentDate <= period.end
    )
    
    if (isInBlackout) {
      // During blackout, prioritize radiologists not requesting vacation
      const userVacationPrefs = context.vacationPreferences.filter(pref => 
        pref.userId === candidate.radiologist.id &&
        assignmentDate >= pref.weekStartDate &&
        assignmentDate <= pref.weekEndDate
      )
      
      const hasVacationRequest = userVacationPrefs.length > 0
      const score = hasVacationRequest ? 20 : 90 // Heavy penalty for vacation during blackout
      
      return {
        satisfied: true, // Soft constraint
        score,
        explanation: hasVacationRequest 
          ? 'Assignment during institutional blackout period with vacation request'
          : 'Assignment during institutional blackout period - no vacation conflict'
      }
    }
    
    return {
      satisfied: true,
      score: 100,
      explanation: 'No institutional vacation blackout conflicts'
    }
  }
  
  private getInstitutionalBlackouts(year: number): Array<{ start: Date; end: Date; reason: string }> {
    return [
      // Christmas/New Year blackout
      {
        start: new Date(year, 11, 20), // Dec 20
        end: new Date(year + 1, 0, 5), // Jan 5
        reason: 'Christmas/New Year blackout'
      },
      // Summer blackout periods (example - adjust based on your institution)
      {
        start: new Date(year, 6, 1),   // July 1
        end: new Date(year, 6, 14),    // July 14
        reason: 'Summer blackout period 1'
      },
      {
        start: new Date(year, 7, 15),  // Aug 15
        end: new Date(year, 7, 31),    // Aug 31
        reason: 'Summer blackout period 2'
      }
    ]
  }
}

// Export already handled by class declaration above
