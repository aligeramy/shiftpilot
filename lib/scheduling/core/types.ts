/**
 * Core Types for Schedule Generation System
 * Enterprise-level type definitions with complete interface contracts
 */

import type {
  Organization as DbOrganization,
} from '@prisma/client'

// ================================
// CORE DOMAIN TYPES
// ================================

export interface RadiologistProfile {
  id: string
  name: string
  email: string
  subspecialtyCode: string
  ftePercent: number
  isFellow: boolean
  isResident: boolean
  canWorkMA1: boolean
  organizationId: string
}

export interface ShiftTypeDefinition {
  id: string
  code: string
  name: string
  startTime: string
  endTime: string
  isAllDay: boolean
  subspecialtyRequired?: string
  allowAny: boolean
  namedAllowlist: string[]
  recurrence: DayPattern
  organizationId: string
}

export interface DayPattern {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface VacationPreferenceData {
  id: string
  userId: string
  year: number
  month: number
  weekNumber: number
  rank: 1 | 2 | 3
  weekStartDate: Date
  weekEndDate: Date
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface ShiftInstance {
  id: string
  organizationId: string
  shiftTypeId: string
  date: Date
  startTime: Date
  endTime: Date
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  shiftType: ShiftTypeDefinition
}

// ================================
// GENERATION CONFIGURATION
// ================================

export interface GenerationConfig {
  organizationId: string
  targetYear: number
  targetMonth: number
  seed?: number
  options: GenerationOptions
}

export interface GenerationOptions {
  maxGenerationTimeMs: number
  enableOptimization: boolean
  fairnessWeight: number
  vacationWeight: number
  workloadWeight: number
  enableBacktracking: boolean
  debugMode: boolean
}

export interface FTEPolicy {
  ftePercent: number
  maxAssignmentsPerMonth: number
  preferredDaysOff: number[]
  eligibleShiftTypes?: string[]
}

// ================================
// CONSTRAINT DEFINITIONS
// ================================

export interface ConstraintDefinition {
  id: string
  type: 'HARD' | 'SOFT'
  priority: number
  description: string
  validator: ConstraintValidator
}

export interface ConstraintValidator {
  validate(assignment: AssignmentCandidate, context: GenerationContext): ConstraintResult
}

export interface ConstraintResult {
  satisfied: boolean
  score: number
  explanation: string
  violationType?: 'CRITICAL' | 'WARNING' | 'INFO'
}

export interface AssignmentCandidate {
  radiologist: RadiologistProfile
  shiftInstance: ShiftInstance
  confidence: number
  constraintScores: Map<string, ConstraintResult>
}

// ================================
// GENERATION CONTEXT & STATE
// ================================

export interface GenerationContext {
  config: GenerationConfig
  organization: DbOrganization
  radiologists: RadiologistProfile[]
  shiftTypes: ShiftTypeDefinition[]
  shiftInstances: ShiftInstance[]
  vacationPreferences: VacationPreferenceData[]
  existingAssignments: AssignmentRecord[]
  fairnessLedger: FairnessLedger
  workloadTracker: WorkloadTracker
  vacationBlocks: VacationBlockMap
  eligibilityMatrix: EligibilityMatrix
}

export interface AssignmentRecord {
  id: string
  instanceId: string
  userId: string
  assignmentType: 'GENERATED' | 'MANUAL' | 'SWAPPED'
  confidence: number
  constraintsSatisfied: string[]
  createdAt: Date
}

export interface FairnessLedger {
  userScores: Map<string, FairnessScore>
  lastUpdated: Date
}

export interface FairnessScore {
  userId: string
  currentAssignments: number
  targetAssignments: number
  fairnessDebt: number
  vacationPreferencesGranted: {
    P1: number
    P2: number  
    P3: number
  }
  desirabilityBalance: number
  lastAssignment?: Date
}

export interface WorkloadTracker {
  userWorkloads: Map<string, WorkloadData>
  statistics: WorkloadStatistics
}

export interface WorkloadData {
  userId: string
  assignmentCount: number
  totalHours: number
  weekendCount: number
  callShiftCount: number
  desirabilityScore: number
  fteCompliance: boolean
}

export interface WorkloadStatistics {
  mean: number
  median: number
  standardDeviation: number
  coefficientOfVariation: number
  min: number
  max: number
  fairnessScore: number
}

export interface VacationBlockMap {
  userBlocks: Map<string, DateRange[]>
}

export interface DateRange {
  startDate: Date
  endDate: Date
  reason: string
}

export interface EligibilityMatrix {
  matrix: Map<string, Map<string, boolean>> // userId -> shiftInstanceId -> eligible
  subspecialtyFilters: Map<string, string[]> // shiftTypeId -> eligible subspecialties
  namedFilters: Map<string, string[]> // shiftTypeId -> eligible user emails
}

// ================================
// GENERATION RESULTS & METRICS
// ================================

export interface GenerationResult {
  success: boolean
  assignments: AssignmentRecord[]
  metrics: GenerationMetrics
  validation: ValidationResult
  auditTrail: AuditRecord[]
  performance: PerformanceMetrics
  recommendations: string[]
}

export interface GenerationMetrics {
  totalShifts: number
  assignedShifts: number
  unassignedShifts: number
  coveragePercentage: number
  constraintViolations: number
  fairnessScore: number
  workloadDistribution: WorkloadStatistics
  vacationSatisfaction: VacationSatisfactionMetrics
}

export interface VacationSatisfactionMetrics {
  totalPreferences: number
  P1Granted: number
  P2Granted: number
  P3Granted: number
  noneGranted: number
  P1Percentage: number
  P2Percentage: number
  P3Percentage: number
}

export interface ValidationResult {
  isValid: boolean
  hardConstraintViolations: ConstraintViolation[]
  softConstraintIssues: ConstraintViolation[]
  warnings: ValidationWarning[]
  recommendations: string[]
}

export interface ConstraintViolation {
  constraintId: string
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  description: string
  affectedAssignments: string[]
  suggestedFix?: string
}

export interface ValidationWarning {
  type: 'FAIRNESS' | 'COVERAGE' | 'QUALITY' | 'PERFORMANCE'
  message: string
  details: Record<string, unknown>
}

export interface AuditRecord {
  timestamp: Date
  phase: GenerationPhase
  action: string
  details: Record<string, unknown>
  decision?: string
  reasoning?: string
}

export type GenerationPhase = 
  | 'INITIALIZATION'
  | 'DATA_LOADING'
  | 'DATA_CLEANUP'
  | 'DATA_PERSISTENCE'
  | 'VACATION_PROCESSING'
  | 'FTE_CALCULATION'
  | 'CONSTRAINT_PREPROCESSING'
  | 'DIFFICULTY_SORTING'
  | 'ASSIGNMENT_GENERATION'
  | 'OPTIMIZATION'
  | 'VALIDATION'
  | 'PERSISTENCE'
  | 'COMPLETION'
  | 'ERROR'

export interface PerformanceMetrics {
  totalTimeMs: number
  phaseTimings: Map<GenerationPhase, number>
  memoryUsageMB: number
  databaseQueries: number
  constraintEvaluations: number
  assignmentAttempts: number
  optimizationPasses: number
}

// ================================
// ERROR HANDLING
// ================================

export class ScheduleGenerationError extends Error {
  constructor(
    message: string,
    public code: ScheduleErrorCode,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ScheduleGenerationError'
  }
}

export type ScheduleErrorCode =
  | 'INSUFFICIENT_RADIOLOGISTS'
  | 'IMPOSSIBLE_CONSTRAINTS'
  | 'TIMEOUT_EXCEEDED'
  | 'DATA_INTEGRITY_ERROR'
  | 'CONFIGURATION_INVALID'
  | 'CONSTRAINT_VIOLATION'
  | 'OPTIMIZATION_FAILED'
  | 'PERSISTENCE_ERROR'

// ================================
// ALGORITHM INTERFACES
// ================================

export interface ScheduleGeneratorInterface {
  generateSchedule(config: GenerationConfig): Promise<GenerationResult>
  validateConfiguration(config: GenerationConfig): Promise<ValidationResult>
  estimatePerformance(config: GenerationConfig): Promise<PerformanceEstimate>
}

export interface PerformanceEstimate {
  estimatedTimeMs: number
  estimatedMemoryMB: number
  complexityScore: number
  feasibilityScore: number
  warnings: string[]
}

export interface ConstraintEngine {
  evaluateConstraints(candidate: AssignmentCandidate, context: GenerationContext): ConstraintResult[]
  getHardConstraints(): ConstraintDefinition[]
  getSoftConstraints(): ConstraintDefinition[]
  validateConstraintSet(): boolean
}

export interface FairnessEngine {
  calculateFairnessScore(userId: string, context: GenerationContext): number
  updateFairnessLedger(assignment: AssignmentRecord, context: GenerationContext): void
  getRecommendedAssignments(shiftInstance: ShiftInstance, context: GenerationContext): string[]
}

export interface OptimizationEngine {
  optimizeSchedule(assignments: AssignmentRecord[], context: GenerationContext): Promise<AssignmentRecord[]>
  performLocalSearch(assignments: AssignmentRecord[], context: GenerationContext): Promise<AssignmentRecord[]>
  detectOptimizationOpportunities(context: GenerationContext): OptimizationOpportunity[]
}

export interface OptimizationOpportunity {
  type: 'WORKLOAD_BALANCE' | 'FAIRNESS_IMPROVEMENT' | 'PREFERENCE_SATISFACTION'
  description: string
  estimatedImprovement: number
  complexity: 'LOW' | 'MEDIUM' | 'HIGH'
  suggestedAction: string
}

// ================================
// UTILITY TYPES
// ================================

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface FilterOptions {
  subspecialty?: string[]
  shiftType?: string[]
  dateRange?: DateRange
  fteRange?: [number, number]
  assignmentType?: string[]
}

export interface ExportOptions {
  format: 'JSON' | 'CSV' | 'ICS' | 'PDF'
  includeAuditTrail: boolean
  includeMetrics: boolean
  dateRange?: DateRange
}

// ================================
// TYPE GUARDS & UTILITIES
// ================================

export function isValidFTEPercent(value: number): value is FTEPercent {
  return value >= 60 && value <= 100 && value % 10 === 0
}

export type FTEPercent = 60 | 70 | 80 | 90 | 100

export function isHardConstraint(constraint: ConstraintDefinition): boolean {
  return constraint.type === 'HARD'
}

export function isSoftConstraint(constraint: ConstraintDefinition): boolean {
  return constraint.type === 'SOFT'
}

// ================================
// CONSTANTS
// ================================

export const GENERATION_CONSTANTS = {
  MAX_GENERATION_TIME_MS: 30000, // 30 seconds
  MIN_FAIRNESS_SCORE: 0.7, // 70%
  MAX_WORKLOAD_CV: 0.15, // 15%
  MIN_VACATION_P1_SATISFACTION: 0.6, // 60%
  MAX_CONSECUTIVE_ASSIGNMENTS: 7,
  RANDOMIZATION_FACTOR_RANGE: 0.1, // ±10%
} as const

export const SHIFT_DESIRABILITY_SCORES = {
  WEEKDAY_DAY: 2,
  WEEKEND_DAY: -5,
  HOLIDAY: -8,
  EVENING: -3,
  NIGHT: -10,
  CALL: -10,
  PRIME_CLINIC: 5,
  PROCEDURE: 3,
} as const

export const CONSTRAINT_PRIORITIES = {
  COVERAGE: 1000,
  SUBSPECIALTY: 900,
  NAMED_ALLOWLIST: 850,
  SINGLE_ASSIGNMENT: 800,
  VACATION_BLOCK: 750,
  FTE_COMPLIANCE: 700,
  WORKLOAD_BALANCE: 500,
  FAIRNESS: 400,
  VACATION_PREFERENCE: 300,
  DESIRABILITY_BALANCE: 200,
} as const
