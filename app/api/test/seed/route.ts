/**
 * Test API endpoint to seed the database
 * This bypasses authentication for testing purposes
 */
import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

export async function POST() {
  try {
    console.log('[TEST API] Starting database seed...')
    
    const result = await seedDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result
    })
    
  } catch (error) {
    console.error('[TEST API] Seed failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Seeding failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test/seed',
    method: 'POST',
    description: 'Seeds the database with real radiology scheduling data',
    usage: 'curl -X POST http://localhost:3001/api/test/seed'
  })
}
