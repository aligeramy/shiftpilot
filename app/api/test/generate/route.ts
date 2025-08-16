/**
 * Test API endpoint for schedule generation - Enterprise Version 2.0
 * Uses new enterprise scheduling system with full constraint programming
 */
import { NextResponse } from 'next/server'
import { ScheduleGenerationService, type GenerationConfig } from '@/lib/scheduling'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[TEST API] Generate schedule request:', body)
    
    // Validate input
    const { organizationId, year, month, seed, maxIterations } = body
    
    if (!organizationId || !year || !month) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: organizationId, year, month'
      }, { status: 400 })
    }

    // Verify organization exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!org) {
      return NextResponse.json({
        success: false,
        error: 'Organization not found'
      }, { status: 404 })
    }

    // Enforce presence of vacation preferences before generation
    const prefCount = await prisma.vacationPreference.count({
      where: { year: parseInt(year), month: parseInt(month) }
    })
    if (prefCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'No vacation preferences for this period. Generate preferences first.'
      }, { status: 400 })
    }

    const config: GenerationConfig = {
      organizationId,
      targetYear: parseInt(year),
      targetMonth: parseInt(month),
      seed: seed ? parseInt(seed) : undefined,
      options: {
        maxGenerationTimeMs: maxIterations ? maxIterations * 10 : 30000, // Convert iterations to time limit
        enableOptimization: true,
        fairnessWeight: 2.0,
        vacationWeight: 1.5,
        workloadWeight: 2.0,
        enableBacktracking: true,
        debugMode: false
      }
    }

    console.log('[TEST API] Starting enterprise generation with config:', config)
    
    const generationService = new ScheduleGenerationService()
    const result = await generationService.generateSchedule(config)
    
    return NextResponse.json({
      success: true,
      message: 'Schedule generation completed',
      config,
      result
    })
    
  } catch (error) {
    console.error('[TEST API] Generation failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test/generate',
    method: 'POST',
    description: 'Generates a schedule for the specified month',
    parameters: {
      organizationId: 'string (required)',
      year: 'number (required)',
      month: 'number (required)',
      seed: 'number (optional, for deterministic results)',
      maxIterations: 'number (optional, default 1000)'
    },
    example: {
      organizationId: 'org_123',
      year: 2025,
      month: 1,
      seed: 42
    },
    usage: 'curl -X POST http://localhost:3001/api/test/generate -H "Content-Type: application/json" -d \'{"organizationId":"org_123","year":2025,"month":1}\''
  })
}
