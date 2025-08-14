/**
 * Test API endpoint to force a complete database reseed
 * This clears all existing data and recreates everything
 */
import { NextResponse } from 'next/server'
import { clearDatabase, seedDatabase } from '@/lib/seed'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    console.log('[TEST API] Starting FORCE reseed - clearing all data...')
    
    // Force clear everything first
    await clearDatabase()
    
    // Then force seed by temporarily removing the organization
    // so seedDatabase doesn't exit early
    const result = await seedDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database force reseeded successfully - all data recreated',
      data: result
    })
    
  } catch (error) {
    console.error('[TEST API] Force reseed failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Force reseeding failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test/force-reseed',
    method: 'POST',
    description: 'Force clears and reseeds the entire database with updated data',
    usage: 'curl -X POST http://localhost:3000/api/test/force-reseed',
    warning: 'This will delete ALL existing data and recreate everything'
  })
}
