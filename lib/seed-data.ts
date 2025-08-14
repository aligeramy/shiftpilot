/**
 * Seed data based on real-world radiology group
 * This replicates the actual data structure from resources/
 */

export const REAL_ORGANIZATION = {
  name: "Main Radiology Group",
  slug: "main-radiology-group", 
  timezone: "America/Toronto",
  weekStart: "MONDAY" as const
}

export const REAL_SUBSPECIALTIES = [
  { code: "NEURO", name: "Neuroradiology" },
  { code: "BODY", name: "Body Imaging" }, 
  { code: "MSK", name: "Musculoskeletal" },
  { code: "IR", name: "Interventional Radiology" },
  { code: "CHEST", name: "Chest/Cardiac" },
  { code: "INR", name: "Interventional Neuroradiology" },
  { code: "XRUS", name: "X-Ray & Ultrasound" }
]

// Real radiologists from People.csv mapped to initials in schedule data with realistic FTE
// FTE estimates based on June 2025 part-time day patterns from manual calendar
export const REAL_RADIOLOGISTS = [
  // Full-time senior staff (100% FTE) - consistently appear without part-time indicators
  { name: "Arun Mensinkai", email: "amensinkai@test.com", subspecialty: "NEURO", fte: 100 }, // AM - no PT days
  { name: "Shauna Kennedy", email: "skennedy@test.com", subspecialty: "NEURO", fte: 100 }, // SK - frequent
  { name: "Ramiro Larrazabal", email: "rlarrazabal@test.com", subspecialty: "NEURO", fte: 100 }, // RL - frequent, INR certified
  { name: "Khunsa Faiz", email: "kfaiz@test.com", subspecialty: "NEURO", fte: 90 }, // Faiz - some PT days
  { name: "Santosh Reddy", email: "sreddy@test.com", subspecialty: "MSK", fte: 100 }, // SR - very frequent  
  { name: "David Landry", email: "dlandry@test.com", subspecialty: "CHEST", fte: 100 }, // DL - frequent
  
  // IR radiologists to cover VASC shifts  
  { name: "Gord Yip", email: "gyip@test.com", subspecialty: "IR", fte: 100 }, // GY - covers most VASC
  { name: "Zain Badar", email: "zbadar@test.com", subspecialty: "IR", fte: 90 }, // ZB - in PT lists
  { name: "Dr. Rajan", email: "rajan@test.com", subspecialty: "IR", fte: 80, isFellow: true }, // IR Fellow
  
  // BODY radiologists based on calendar frequency
  { name: "Basma Al-Arnawoot", email: "balnawoot@test.com", subspecialty: "BODY", fte: 100 }, // BA
  { name: "Will Warnicka", email: "wwarnicka@test.com", subspecialty: "BODY", fte: 80 }, // WW - in PT lists  
  { name: "Mike Colapinto", email: "mcolapinto@test.com", subspecialty: "BODY", fte: 100 }, // MC
  { name: "TM Mammen", email: "tm@test.com", subspecialty: "BODY", fte: 85 }, // TM - frequent in calendar
  
  // CHEST radiologists 
  { name: "Danielle Walker", email: "dwalker@test.com", subspecialty: "CHEST", fte: 80 }, // DW - in PT lists
  { name: "Nida Syed", email: "nsyed@test.com", subspecialty: "CHEST", fte: 100 }, // NS - maternity leave noted
  
  // Part-time staff based on PT day patterns in June 2025 calendar
  { name: "Ian Moffatt", email: "imoffatt@test.com", subspecialty: "NEURO", fte: 80 }, // IM - 1 PT day/week
  { name: "Nazir Khan", email: "nkhan@test.com", subspecialty: "NEURO", fte: 70 }, // NK - 1-2 PT days
  { name: "Euan Zhang", email: "ezhang@test.com", subspecialty: "NEURO", fte: 80 }, // EZ - 1 PT day
  { name: "Crystal Fong", email: "cfong@test.com", subspecialty: "NEURO", fte: 80 }, // CF - 1 PT day 
  { name: "Shamis Hasan", email: "shasan@test.com", subspecialty: "NEURO", fte: 80 }, // SH - in PT lists
  { name: "Milita Romonas", email: "mromonas@test.com", subspecialty: "NEURO", fte: 80 }, // MR - 1 PT day
  { name: "Meg Chiavaras", email: "mchiavaras@test.com", subspecialty: "MSK", fte: 60 }, // MC - 2 PT days
  { name: "Hema Choudur", email: "hchoudur@test.com", subspecialty: "MSK", fte: 80 }, // HC - 1 PT day
  { name: "Mahsa Kamali", email: "mkamali@test.com", subspecialty: "MSK", fte: 60 }, // MK - 2 PT days
  { name: "David Koff", email: "dkoff@test.com", subspecialty: "XRUS", fte: 80 }, // DK - 1 PT day
  { name: "Craig Coblentz", email: "ccoblentz@test.com", subspecialty: "XRUS", fte: 100 }, // CC
  
  // Fellows
  { name: "Dr. Karikalan", email: "karikalan@test.com", subspecialty: "MSK", fte: 80, isFellow: true }, // MSK Fellow
  { name: "Charlotte Gallienne", email: "cgallienne@test.com", subspecialty: "NEURO", fte: 75, isFellow: true }, // Neuro Fellow  
  { name: "Al Malki", email: "amalki@test.com", subspecialty: "NEURO", fte: 70, isFellow: true } // Neuro Fellow
]

// Real shift types from Shift hours.csv with proper eligibility rules
export const REAL_SHIFT_TYPES = [
  // Neuro shifts
  { code: "N1", name: "Neuro 1 (CT STAT, on site)", hours: "08:00-16:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  { code: "N2", name: "Neuro 2 (MRI STAT, on site)", hours: "08:00-16:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  { code: "N3", name: "Neuro 3 (CT volume support)", hours: "08:00-16:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  { code: "N4", name: "Neuro 4 (MR volume support)", hours: "08:00-16:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  
  // IR shifts
  { code: "VASC", name: "Vascular (on site)", hours: "08:00-16:00", subspecialty: "IR", recurrence: "WEEKDAYS" },
  
  // Body shifts
  { code: "CTUS", name: "CT/US (ER+IP to 1600, on site)", hours: "08:00-16:00", subspecialty: "BODY", recurrence: "WEEKDAYS" },
  { code: "BODY_VOL", name: "Body volume support", hours: "08:00-16:00", subspecialty: "BODY", recurrence: "WEEKDAYS" },
  { code: "BODY_MRI", name: "Body MRI", hours: "08:00-16:00", subspecialty: "BODY", recurrence: "WEEKDAYS" },
  
  // MSK shifts  
  { code: "MSK", name: "MSK (on site)", hours: "08:00-16:00", subspecialty: "MSK", recurrence: "WEEKDAYS" },
  { code: "MSK_PROC", name: "MSK Procedures", hours: "08:00-16:00", subspecialty: "MSK", recurrence: "WEEKDAYS" },
  
  // Chest shifts
  { code: "CARDIAC", name: "Cardiac CT/MRI", hours: "08:00-16:00", subspecialty: "CHEST", recurrence: "WEEKDAYS" },
  
  // General shifts (allowAny)
  { code: "XR_GEN", name: "General (XR+GI to 1600, on site)", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  
  // Clinic shifts (allowAny)
  { code: "STONEY", name: "Stoney Creek", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  { code: "MA1", name: "MA1 (spec msk, GI Tues/Thu/Fri)", hours: "08:00-16:00", subspecialty: null, recurrence: "TUE_THU_FRI", 
    named: [
      "balnawoot@test.com",  // Basma Al-Arnawoot
      "cfong@test.com",      // Crystal Fong
      "dwalker@test.com",    // Danielle Walker
      "hchoudur@test.com",   // Hema Choudur
      "mchiavaras@test.com", // Meg Chiavaras
      "sreddy@test.com",     // Santosh Reddy
      "mkamali@test.com"     // Mahsa Kamali
    ] 
  },
  { code: "SPEERS", name: "Speers", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  { code: "WALKERS", name: "Walker's Line", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  { code: "WH_OTHER", name: "WH other", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  { code: "BRANT", name: "Brant (mammo)", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS" },
  
  // Special procedures (named eligibility)
  { code: "COILING", name: "Coiling", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS", named: ["rlarrazabal@test.com"] },
  
  // Late blocks
  { code: "BODY_16_18", name: "Body 1600-1800", hours: "16:00-18:00", subspecialty: "BODY", recurrence: "WEEKDAYS" },
  { code: "BODY_18_21", name: "Body 1800-2100", hours: "18:00-21:00", subspecialty: "BODY", recurrence: "WEEKDAYS" },
  { code: "NEURO_16_18", name: "Neuro 1600-1800", hours: "16:00-18:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  { code: "NEURO_18_21", name: "Neuro 1800-2100", hours: "18:00-21:00", subspecialty: "NEURO", recurrence: "WEEKDAYS" },
  
  // On-call shifts (24-hour coverage)
  { code: "WEEKEND_READER", name: "W/E Reader", hours: "00:00-23:59", subspecialty: "BODY", recurrence: "WEEKENDS" },
  { code: "NEURO_CALL", name: "Neuro on call", hours: "00:00-23:59", subspecialty: "NEURO", recurrence: "ALL_DAYS" },
  { code: "BODY_CALL", name: "Body (diagnostic) on call", hours: "00:00-23:59", subspecialty: "BODY", recurrence: "ALL_DAYS" },
  { code: "IR_CALL", name: "Intervention on call", hours: "00:00-23:59", subspecialty: "IR", recurrence: "ALL_DAYS" },
  { code: "INR_CALL", name: "INR call", hours: "00:00-23:59", subspecialty: "INR", recurrence: "ALL_DAYS" }
]

// Test admin user
export const TEST_ADMIN = {
  name: "Test Administrator",
  email: "admin@test.com",
  password: "password123",
  role: "ADMIN" as const
}

// FTE Policy bands
export const FTE_BANDS = [
  { min: 60, max: 69, ptDaysPerMonth: 8 },
  { min: 70, max: 79, ptDaysPerMonth: 6 },
  { min: 80, max: 89, ptDaysPerMonth: 4 },
  { min: 90, max: 99, ptDaysPerMonth: 2 },
  { min: 100, max: 100, ptDaysPerMonth: 0 }
]

// Real-world complexity factors we need to handle
export const COMPLEXITY_FACTORS = {
  // From analyzing the real schedules:
  TYPICAL_DAILY_SHIFTS: 24, // Based on shift hours.csv
  NEURO_RADIOLOGISTS: 13,   // Largest subspecialty group
  IR_RADIOLOGISTS: 2,       // Smallest subspecialty group
  TOTAL_RADIOLOGISTS: 27,   // Total active rads
  WEEKDAYS_PER_MONTH: 22,   // Approximate
  VACATION_WEEKS_PER_MONTH: 1,
  MAX_CONSECUTIVE_VACATION_WEEKS: 2,
}

// Equivalence sets for swaps and fairness
export const EQUIVALENCE_SETS = [
  { code: "NEURO_DAY", members: ["N1", "N2", "N3", "N4"] },
  { code: "BODY_DAY", members: ["CTUS", "BODY_VOL", "BODY_MRI"] },
  { code: "CLINICS", members: ["STONEY", "SPEERS", "WALKERS", "WH_OTHER", "BRANT"] },
  { code: "NEURO_LATE", members: ["NEURO_16_18", "NEURO_18_21"] },
  { code: "BODY_LATE", members: ["BODY_16_18", "BODY_18_21"] }
]
