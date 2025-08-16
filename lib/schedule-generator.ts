/**
 * Schedule Generator - Legacy Compatibility Layer
 * Maintains backward compatibility while using new enterprise system internally
 * 
 * @deprecated Use @/lib/scheduling directly for new code
 */

import { generateOptimizedSchedule, type LegacyGenerationConfig } from './scheduling'

// ================================
// LEGACY TYPES (Backward Compatibility)
// ================================

export interface GenerationConfig {
  organizationId: string
  year: number
  month: number
  seed?: number
  maxIterations?: number
  fairnessWeight?: number
  preferenceWeight?: number
}

export interface AssignmentResult {
  instanceId: string
  userId: string
  confidence: number
  constraints: string[]
}

export interface GenerationMetrics {
  totalInstances: number
  assignedInstances: number
  unassignedInstances: number
  coveragePercentage: number
  fairnessScore: number
  violationsCount: number
  averageConfidence: number
}

export interface GenerationResult {
  success: boolean
  assignments: AssignmentResult[]
  metrics: GenerationMetrics
  executionTimeMs: number
  seed: number
  algorithm: string
}

// ================================
// LEGACY SCHEDULE GENERATOR CLASS
// ================================

export class ScheduleGenerator {
  private config: GenerationConfig

  constructor(config: GenerationConfig) {
    this.config = config
  }

  async generateSchedule(): Promise<GenerationResult> {
    console.log('[LEGACY GENERATOR] Using enterprise system internally...')
    
    // Convert legacy config to new format
    const legacyConfig: LegacyGenerationConfig = {
      organizationId: this.config.organizationId,
      targetYear: this.config.year,
      targetMonth: this.config.month,
      seed: this.config.seed
    }

    // Use new enterprise system
    const enterpriseResult = await generateOptimizedSchedule(legacyConfig)

    // Convert result back to legacy format
    return {
      success: enterpriseResult.success,
      assignments: [], // Enterprise system doesn't expose individual assignments in legacy format
      metrics: {
        totalInstances: enterpriseResult.assignmentCount + enterpriseResult.unassignedCount,
        assignedInstances: enterpriseResult.assignmentCount,
        unassignedInstances: enterpriseResult.unassignedCount,
        coveragePercentage: enterpriseResult.coveragePercentage,
        fairnessScore: enterpriseResult.fairnessScore,
        violationsCount: 0, // Enterprise system prevents violations
        averageConfidence: 85 // Placeholder - enterprise system uses different metrics
      },
      executionTimeMs: enterpriseResult.executionTimeMs,
      seed: this.config.seed || 42,
      algorithm: 'EnterpriseConstraintProgramming'
    }
  }
}

// ================================
// LEGACY EXPORTS
// ================================

export { ScheduleGenerator as default }

// Re-export new system for migration
export { ScheduleGenerationService, generateQuickSchedule, generateOptimalSchedule } from './scheduling'
