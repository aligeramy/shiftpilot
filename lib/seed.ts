/**
 * Database seeding functions for testing and development
 * Populates DB with real-world radiology scheduling data
 */
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import {
  REAL_ORGANIZATION,
  REAL_SUBSPECIALTIES, 
  REAL_RADIOLOGISTS,
  REAL_SHIFT_TYPES,
  TEST_ADMIN
} from './seed-data'

export async function seedDatabase() {
  console.log('[SEED] Starting database seeding...')
  
  try {
    // Check if org already exists to prevent duplicate seeding
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: REAL_ORGANIZATION.slug }
    })
    
    if (existingOrg) {
      console.log(`[SEED] Organization already exists: ${existingOrg.id}`)
      return {
        organizationId: existingOrg.id,
        adminUserId: 'existing',
        radiologistCount: 0,
        shiftTypeCount: 0,
        subspecialtyCount: 0
      }
    }
    
    // Clear existing data only if we need to create new org
    await clearDatabase()
    
    // 1. Create test organization
    console.log('[SEED] Creating organization...')
    const org = await prisma.organization.create({
      data: {
        name: REAL_ORGANIZATION.name,
        slug: REAL_ORGANIZATION.slug,
        timezone: REAL_ORGANIZATION.timezone,
        weekStart: REAL_ORGANIZATION.weekStart,
        onboardingComplete: true,
        onboardingStep: 4
      }
    })
    console.log(`[SEED] Created organization: ${org.id}`)
    
    // 2. Create test admin user (upsert to prevent duplicates)
    console.log('[SEED] Creating admin user...')
    const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, 10)
    const admin = await prisma.user.upsert({
      where: { email: TEST_ADMIN.email },
      update: {
        organizationId: org.id
      },
      create: {
        name: TEST_ADMIN.name,
        email: TEST_ADMIN.email,
        password: hashedPassword,
        role: TEST_ADMIN.role,
        organizationId: org.id
      }
    })
    console.log(`[SEED] Created admin: ${admin.email}`)
    
    // 3. Create subspecialties
    console.log('[SEED] Creating subspecialties...')
    const subspecialties = await Promise.all(
      REAL_SUBSPECIALTIES.map(sub => 
        prisma.subspecialty.create({
          data: {
            code: sub.code,
            name: sub.name,
            organizationId: org.id
          }
        })
      )
    )
    console.log(`[SEED] Created ${subspecialties.length} subspecialties`)
    
    // Create subspecialty lookup map
    const subspecialtyMap = new Map(
      subspecialties.map(sub => [sub.code, sub])
    )
    
    // 4. Create shift types
    console.log('[SEED] Creating shift types...')
    const shiftTypes = await Promise.all(
      REAL_SHIFT_TYPES.map(shift => {
        const [startTime, endTime] = shift.hours.split('-')
        const isAllDay = startTime === endTime
        
        return prisma.shiftType.create({
          data: {
            code: shift.code,
            name: shift.name,
            startTime,
            endTime,
            isAllDay,
            organizationId: org.id,
            requiredSubspecialtyId: shift.subspecialty ? 
              subspecialtyMap.get(shift.subspecialty)?.id : null,
            allowAny: !shift.subspecialty && !shift.named,
            namedAllowlist: shift.named ? shift.named.join(',') : null,
            // Recurrence - default to weekdays
            monday: shift.recurrence === "WEEKDAYS" || shift.recurrence === "ALL",
            tuesday: shift.recurrence === "WEEKDAYS" || shift.recurrence === "ALL", 
            wednesday: shift.recurrence === "WEEKDAYS" || shift.recurrence === "ALL",
            thursday: shift.recurrence === "WEEKDAYS" || shift.recurrence === "ALL",
            friday: shift.recurrence === "WEEKDAYS" || shift.recurrence === "ALL",
            saturday: shift.recurrence === "WEEKENDS" || shift.recurrence === "ALL",
            sunday: shift.recurrence === "WEEKENDS" || shift.recurrence === "ALL"
          }
        })
      })
    )
    console.log(`[SEED] Created ${shiftTypes.length} shift types`)
    
    // 5. Create radiologist users and profiles  
    console.log('[SEED] Creating radiologists...')
    const radiologists = await Promise.all(
      REAL_RADIOLOGISTS
        .map(async rad => {
        const hashedPassword = await bcrypt.hash('password123', 10)
        
        const user = await prisma.user.create({
          data: {
            name: rad.name,
            email: rad.email,
            password: hashedPassword,
            role: 'RADIOLOGIST',
            organizationId: org.id
          }
        })
        
        const subspecialty = subspecialtyMap.get(rad.subspecialty)
        if (!subspecialty) {
          throw new Error(`Subspecialty ${rad.subspecialty} not found for ${rad.name}`)
        }
        
        await prisma.radiologyProfile.create({
          data: {
            userId: user.id,
            subspecialtyId: subspecialty.id,
            ftePercent: rad.fte,
            isFellow: rad.isFellow || false,
            isResident: false
          }
        })
        
        return user
      })
    )
    console.log(`[SEED] Created ${radiologists.length} radiologists`)
    
    // 6. Create some sample vacation preferences for testing
    console.log('[SEED] Creating sample vacation preferences...')
    const currentMonth = new Date()
    currentMonth.setDate(1) // First of current month
    
    // Create vacation preferences for a few users
    const sampleVacationPrefs = []
    for (let i = 0; i < Math.min(5, radiologists.length); i++) {
      const user = radiologists[i]
      for (let month = 0; month < 3; month++) {
        const targetMonth = new Date(currentMonth)
        targetMonth.setMonth(currentMonth.getMonth() + month)
        
        for (let rank = 1; rank <= 3; rank++) {
          const weekStart = new Date(targetMonth)
          weekStart.setDate(rank * 7) // Different weeks
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          
          sampleVacationPrefs.push(
            prisma.vacationPreference.create({
              data: {
                userId: user.id,
                year: targetMonth.getFullYear(),
                month: targetMonth.getMonth() + 1,
                rank,
                weekNumber: rank,
                weekStartDate: weekStart,
                weekEndDate: weekEnd,
                status: 'PENDING'
              }
            })
          )
        }
      }
    }
    await Promise.all(sampleVacationPrefs)
    console.log(`[SEED] Created vacation preferences for ${Math.min(5, radiologists.length)} users`)
    
    console.log('[SEED] Database seeding completed successfully!')
    return {
      organizationId: org.id,
      adminUserId: admin.id,
      radiologistCount: radiologists.length,
      shiftTypeCount: shiftTypes.length,
      subspecialtyCount: subspecialties.length
    }
    
  } catch (error) {
    console.error('[SEED] Seeding failed:', error)
    throw error
  }
}

export async function clearDatabase() {
  console.log('[SEED] Clearing existing data...')
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.vacationPreference.deleteMany()
  await prisma.scheduleAssignment.deleteMany() 
  await prisma.scheduleInstance.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.radiologyProfile.deleteMany()
  await prisma.shiftType.deleteMany()
  await prisma.subspecialty.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()
  
  console.log('[SEED] Database cleared')
}

// Generate schedule instances for a given month 
export async function generateShiftInstances(organizationId: string, year: number, month: number) {
  console.log(`[SEED] Generating shift instances for ${year}-${month}...`)
  
  const shiftTypes = await prisma.shiftType.findMany({
    where: { organizationId }
  })
  
  const instances = []
  const daysInMonth = new Date(year, month, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, etc.
    
    for (const shiftType of shiftTypes) {
      let shouldCreate = false
      
      // Check recurrence pattern
      switch (dayOfWeek) {
        case 0: shouldCreate = shiftType.sunday; break
        case 1: shouldCreate = shiftType.monday; break
        case 2: shouldCreate = shiftType.tuesday; break
        case 3: shouldCreate = shiftType.wednesday; break
        case 4: shouldCreate = shiftType.thursday; break
        case 5: shouldCreate = shiftType.friday; break
        case 6: shouldCreate = shiftType.saturday; break
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
        
        instances.push({
          organizationId,
          shiftTypeId: shiftType.id,
          date,
          startTime,
          endTime,
          status: 'DRAFT' as const
        })
      }
    }
  }
  
  // Batch create instances
  if (instances.length > 0) {
    await prisma.scheduleInstance.createMany({
      data: instances,
      skipDuplicates: true
    })
  }
  
  console.log(`[SEED] Generated ${instances.length} shift instances`)
  return instances.length
}
