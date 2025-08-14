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
export const REAL_RADIOLOGISTS = [
  // Full-time senior staff (100% FTE) - consistently appear without part-time indicators
  { name: "Arun Mensinkai", email: "amensinkai@test.com", subspecialty: "NEURO", fte: 100 }, // AM
  { name: "Shauna Kennedy", email: "skennedy@test.com", subspecialty: "NEURO", fte: 100 }, // SK - very frequent
  { name: "Crystal Fong", email: "cfong@test.com", subspecialty: "NEURO", fte: 100 }, // CF - very frequent  
  { name: "Khunsa Faiz", email: "kfaiz@test.com", subspecialty: "NEURO", fte: 100 }, // Faiz - consistent
  { name: "Santosh Reddy", email: "sreddy@test.com", subspecialty: "MSK", fte: 100 }, // SR - very frequent
  { name: "Hema Choudur", email: "hchoudur@test.com", subspecialty: "MSK", fte: 100 }, // HC - frequent
  
  // Add more IR radiologists to cover VASC shifts
  { name: "Gord Yip", email: "gyip@test.com", subspecialty: "IR", fte: 100 }, // GY
  { name: "Zain Badar", email: "zbadar@test.com", subspecialty: "IR", fte: 100 }, // ZB
  { name: "Ramiro Larrazabal", email: "rlarrazabal@test.com", subspecialty: "IR", fte: 100 }, // RL
  { name: "Dr. Rajan", email: "rajan@test.com", subspecialty: "IR", fte: 100 }, // IR Fellow
  
  // Add more BODY radiologists to cover CTUS, BODY_VOL, BODY_MRI shifts
  { name: "Basma Al-Arnawoot", email: "balnawoot@test.com", subspecialty: "BODY", fte: 100 }, // BA
  { name: "Will Warnicka", email: "wwarnicka@test.com", subspecialty: "BODY", fte: 100 }, // WW
  { name: "Mike Colapinto", email: "mcolapinto@test.com", subspecialty: "BODY", fte: 100 }, // MC
  { name: "MNC", email: "mnc@test.com", subspecialty: "BODY", fte: 100 }, // MNC
  { name: "FG", email: "fg@test.com", subspecialty: "BODY", fte: 100 }, // FG
  { name: "KH", email: "kh@test.com", subspecialty: "BODY", fte: 100 }, // KH
  { name: "KZ", email: "kz@test.com", subspecialty: "BODY", fte: 100 }, // KZ
  
  // Add more CHEST radiologists to cover CARDIAC shifts
  { name: "David Landry", email: "dlandry@test.com", subspecialty: "CHEST", fte: 100 }, // DL
  { name: "Danielle Walker", email: "dwalker@test.com", subspecialty: "CHEST", fte: 100 }, // DW
  { name: "Nida Syed", email: "nsyed@test.com", subspecialty: "CHEST", fte: 100 }, // NS
  
  // Senior staff with some part-time patterns (80-95% FTE)
  { name: "Ian Moffatt", email: "imoffatt@test.com", subspecialty: "NEURO", fte: 90 }, // IM - frequent but in part-time lists
  { name: "Nazir Khan", email: "nkhan@test.com", subspecialty: "NEURO", fte: 80 }, // NK - in part-time lists
  { name: "Evan Wilson", email: "ewilson@test.com", subspecialty: "NEURO", fte: 90 }, // EW - frequent
  { name: "Euan Zhang", email: "ezhang@test.com", subspecialty: "NEURO", fte: 90 }, // EZ - frequent
  { name: "Shamis Hasan", email: "shasan@test.com", subspecialty: "NEURO", fte: 90 }, // SH - frequent
  { name: "Meg Chiavaras", email: "mchiavaras@test.com", subspecialty: "MSK", fte: 85 }, // MC - in part-time lists
  { name: "David Koff", email: "dkoff@test.com", subspecialty: "XRUS", fte: 90 }, // DK - frequent
  { name: "Craig Coblentz", email: "ccoblentz@test.com", subspecialty: "XRUS", fte: 85 }, // CC - in part-time lists
  
  // Additional MSK staff to cover MSK_PROC shifts
  { name: "Mahsa Kamali", email: "mkamali@test.com", subspecialty: "MSK", fte: 85 }, // MK
  { name: "TM", email: "tm@test.com", subspecialty: "MSK", fte: 85 }, // TM
  { name: "Dr. Karikalan", email: "karikalan@test.com", subspecialty: "MSK", fte: 80, isFellow: true }, // MSK Fellow
  { name: "Dr. Vyphuis", email: "vyphuis@test.com", subspecialty: "MSK", fte: 70, isFellow: true }, // MSK Fellow
  
  // Additional NEURO staff for better coverage
  { name: "Milita Romonas", email: "mromonas@test.com", subspecialty: "NEURO", fte: 90 }, // MR - frequent
  { name: "BD", email: "bd@test.com", subspecialty: "NEURO", fte: 80 }, // BD - frequent in schedules
  { name: "Charlotte Gallienne", email: "cgallienne@test.com", subspecialty: "NEURO", fte: 75, isFellow: true }, // Neuro Fellow
  { name: "Al Hatmi", email: "ahatmi@test.com", subspecialty: "NEURO", fte: 60, isFellow: true }, // Neuro Fellow (Pain Clinic)
  { name: "Al Malki", email: "amalki@test.com", subspecialty: "NEURO", fte: 70, isFellow: true }, // Neuro Fellow
  { name: "Karanwal", email: "karanwal@test.com", subspecialty: "NEURO", fte: 60, isFellow: true }, // Neuro Fellow
  { name: "Dr. Metelo-Liquito", email: "metelo@test.com", subspecialty: "NEURO", fte: 60, isFellow: true }, // New Neuro Fellow
  { name: "Dr. Al Sharji", email: "alsharji@test.com", subspecialty: "NEURO", fte: 60, isFellow: true }, // New Neuro Fellow
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
  { code: "MA1", name: "MA1 (spec msk, GI Tues/Thu/Fri)", hours: "08:00-16:00", subspecialty: null, recurrence: "WEEKDAYS", named: ["rlarrazabal@test.com"] },
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
