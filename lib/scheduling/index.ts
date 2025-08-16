/**
 * Enterprise Schedule Generation System - Main Interface
 * Provides unified access to all scheduling functionality
 */

export * from './core/types'
export * from './core/schedule-generator'
export * from './constraints/constraint-engine'

import { EnterpriseScheduleGenerator } from './core/schedule-generator'
import type { 
  GenerationConfig, 
  GenerationResult, 
  ValidationResult,
  PerformanceEstimate 
} from './core/types'

// ================================
// MAIN INTERFACE
// ================================

/**
 * Main entry point for schedule generation
 * This replaces the legacy schedule-generator.ts file
 */
export class ScheduleGenerationService {
  private generator: EnterpriseScheduleGenerator

  constructor() {
    this.generator = new EnterpriseScheduleGenerator()
  }

  /**
   * Generate schedule for given configuration
   * @param config Generation configuration
   * @returns Complete generation result with metrics and audit trail
   */
  async generateSchedule(config: GenerationConfig): Promise<GenerationResult> {
    return await this.generator.generateSchedule(config)
  }

  /**
   * Validate configuration before generation
   * @returns Validation result with recommendations
   */
  async validateConfiguration(): Promise<ValidationResult> {
    return await this.generator.validateConfiguration()
  }

  /**
   * Estimate performance for given configuration
   * @returns Performance estimate with complexity analysis
   */
  async estimatePerformance(): Promise<PerformanceEstimate> {
    return await this.generator.estimatePerformance()
  }
}

// ================================
// LEGACY COMPATIBILITY
// ================================

/**
 * Legacy interface for backward compatibility
 * This maintains the same interface as the old schedule-generator.ts
 */
export interface LegacyGenerationConfig {
  organizationId: string
  targetYear: number
  targetMonth: number
  seed?: number
}

export interface LegacyGenerationResult {
  success: boolean
  assignmentCount: number
  unassignedCount: number
  coveragePercentage: number
  workloadDistribution: {
    mean: number
    standardDeviation: number
    coefficientOfVariation: number
  }
  fairnessScore: number
  executionTimeMs: number
}

/**
 * Legacy generation function for backward compatibility
 * @deprecated Use ScheduleGenerationService instead
 */
export async function generateOptimizedSchedule(config: LegacyGenerationConfig): Promise<LegacyGenerationResult> {
  const service = new ScheduleGenerationService()
  
  const modernConfig: GenerationConfig = {
    organizationId: config.organizationId,
    targetYear: config.targetYear,
    targetMonth: config.targetMonth,
    seed: config.seed,
    options: {
      maxGenerationTimeMs: 30000,
      enableOptimization: true,
      fairnessWeight: 1.0,
      vacationWeight: 1.0,
      workloadWeight: 1.0,
      enableBacktracking: true,
      debugMode: false
    }
  }

  const result = await service.generateSchedule(modernConfig)

  // Convert to legacy format
  return {
    success: result.success,
    assignmentCount: result.metrics.assignedShifts,
    unassignedCount: result.metrics.unassignedShifts,
    coveragePercentage: result.metrics.coveragePercentage,
    workloadDistribution: {
      mean: result.metrics.workloadDistribution.mean,
      standardDeviation: result.metrics.workloadDistribution.standardDeviation,
      coefficientOfVariation: result.metrics.workloadDistribution.coefficientOfVariation
    },
    fairnessScore: result.metrics.fairnessScore,
    executionTimeMs: result.performance.totalTimeMs
  }
}

// ================================
// CONVENIENCE FUNCTIONS
// ================================

/**
 * Quick generation with default options
 */
export async function generateQuickSchedule(
  organizationId: string, 
  year: number, 
  month: number,
  seed?: number
): Promise<GenerationResult> {
  const service = new ScheduleGenerationService()
  
  const config: GenerationConfig = {
    organizationId,
    targetYear: year,
    targetMonth: month,
    seed,
    options: {
      maxGenerationTimeMs: 10000, // 10 seconds for quick generation
      enableOptimization: false,
      fairnessWeight: 1.0,
      vacationWeight: 1.0,
      workloadWeight: 1.0,
      enableBacktracking: false,
      debugMode: false
    }
  }

  return await service.generateSchedule(config)
}

/**
 * High-quality generation with full optimization
 */
export async function generateOptimalSchedule(
  organizationId: string,
  year: number,
  month: number,
  seed?: number
): Promise<GenerationResult> {
  const service = new ScheduleGenerationService()
  
  const config: GenerationConfig = {
    organizationId,
    targetYear: year,
    targetMonth: month,
    seed,
    options: {
      maxGenerationTimeMs: 60000, // 60 seconds for optimal generation
      enableOptimization: true,
      fairnessWeight: 2.0,
      vacationWeight: 1.5,
      workloadWeight: 2.0,
      enableBacktracking: true,
      debugMode: false
    }
  }

  return await service.generateSchedule(config)
}

// ================================
// DEFAULT EXPORT
// ================================

export default ScheduleGenerationService
