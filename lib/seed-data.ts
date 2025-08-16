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
  { code: "XRUS", name: "X-Ray & Ultrasound" },
  { code: "ANY", name: "General/Any" }
]

// Real radiologists from rads_fte.csv - exact data from your roster
export const REAL_RADIOLOGISTS = [
  { name: "Arun Mensinkai", email: "amensinkai@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "Basma Al-Arnawoot", email: "balnawoot@test.com", subspecialty: "BODY", fte: 80, canWorkMA1: true },
  { name: "Craig Coblentz", email: "ccoblentz@test.com", subspecialty: "XRUS", fte: 80 },
  { name: "Crystal Fong", email: "cfong@test.com", subspecialty: "NEURO", fte: 70 },
  { name: "Danielle Walker", email: "dwalker@test.com", subspecialty: "CHEST", fte: 80, canWorkMA1: true },
  { name: "David Koff", email: "dkoff@test.com", subspecialty: "XRUS", fte: 80 },
  { name: "Gord Yip", email: "gyip@test.com", subspecialty: "IR", fte: 100 },
  { name: "Hema Choudur", email: "hchoudur@test.com", subspecialty: "MSK", fte: 60, canWorkMA1: true },
  { name: "Ian Moffatt", email: "imoffatt@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "David Landry", email: "dlandry@test.com", subspecialty: "CHEST", fte: 100 },
  { name: "Meg Chiavaras", email: "mchiavaras@test.com", subspecialty: "MSK", fte: 80, canWorkMA1: true },
  { name: "Mike Colapinto", email: "mcolapinto@test.com", subspecialty: "BODY", fte: 80 },
  { name: "Nazir Khan", email: "nkhan@test.com", subspecialty: "NEURO", fte: 70 },
  { name: "Nida Syed", email: "nsyed@test.com", subspecialty: "CHEST", fte: 60 },
  { name: "Ramiro Larrazabal", email: "rlarrazabal@test.com", subspecialty: "NEURO", fte: 90 }, // Also INR certified
  { name: "Santosh Reddy", email: "sreddy@test.com", subspecialty: "MSK", fte: 100, canWorkMA1: true },
  { name: "Shauna Kennedy", email: "skennedy@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "Charlotte Gallienne", email: "cgallienne@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "Saba Moghimi", email: "smoghimi@test.com", subspecialty: "NEURO", fte: 80 },
  { name: "Will Warnicka", email: "wwarnicka@test.com", subspecialty: "BODY", fte: 80 },
  { name: "Khunsa Faiz", email: "kfaiz@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "Euan Zhang", email: "ezhang@test.com", subspecialty: "NEURO", fte: 60 },
  { name: "Shamis Hasan", email: "shasan@test.com", subspecialty: "NEURO", fte: 80 },
  { name: "Mahsa Kamali", email: "mkamali@test.com", subspecialty: "MSK", fte: 80, canWorkMA1: true },
  { name: "Zain Badar", email: "zbadar@test.com", subspecialty: "IR", fte: 80 },
  { name: "Milita Romonas", email: "mromonas@test.com", subspecialty: "NEURO", fte: 80 },
  { name: "Evan Wilson", email: "ewilson@test.com", subspecialty: "NEURO", fte: 80 }
]

export const REAL_SHIFT_TYPES = [
  // Exact shifts from shifts.csv with proper day patterns
  { code: "N1", name: "Neuro 1 (CT STAT, on site)", hours: "08:00-16:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "N2", name: "Neuro 2 (MRI STAT, on site)", hours: "08:00-16:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "VASC", name: "Vascular (on site)", hours: "08:00-16:00", subspecialty: "IR", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "XR_GEN", name: "General (XR+GI to 1600, on site)", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "CTUS", name: "CT/US (ER+IP to1600, on site)", hours: "08:00-16:00", subspecialty: "BODY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "MSK", name: "MSK (on site)", hours: "08:00-16:00", subspecialty: "MSK", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "N3", name: "Neuro 3 (CT volume support)", hours: "08:00-16:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "N4", name: "Neuro 4 (MR volume support)", hours: "08:00-16:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "BODY_VOL", name: "Body volume support", hours: "08:00-16:00", subspecialty: "BODY", 
    days: { mon: true, tue: true, wed: false, thu: true, fri: true, sat: false, sun: false } },
  { code: "BODY_MRI", name: "Body MRI", hours: "08:00-16:00", subspecialty: "BODY", 
    days: { mon: false, tue: false, wed: false, thu: true, fri: false, sat: false, sun: false } },
  { code: "STONEY", name: "Stoney Creek", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "MA1", name: "MA1 (spec msk, GI Tues/Thr/Fri)", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    named: [
      "balnawoot@test.com",  // Basma Al-Arnawoot
      "dwalker@test.com",    // Danielle Walker  
      "hchoudur@test.com",   // Hema Choudur
      "mchiavaras@test.com", // Meg Chiavaras
      "sreddy@test.com",     // Santosh Reddy
      "mkamali@test.com"     // Mahsa Kamali
    ] },
  { code: "SPEERS", name: "Speers", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "WALKERS", name: "Walker's Line", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "WH_OTHER", name: "WH other", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "BRANT", name: "Brant (mammo)", hours: "08:00-16:00", subspecialty: "ANY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "COILING", name: "Coiling", hours: "08:00-16:00", subspecialty: "INR", 
    days: { mon: false, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false },
    named: ["rlarrazabal@test.com"] },
  { code: "CARDIAC", name: "Cardiac CT/MRI", hours: "08:00-16:00", subspecialty: "CHEST", 
    days: { mon: false, tue: true, wed: true, thu: true, fri: false, sat: false, sun: false } },
  { code: "MSK_PROC", name: "MSK Procedures", hours: "08:00-16:00", subspecialty: "MSK", 
    days: { mon: false, tue: false, wed: false, thu: true, fri: false, sat: false, sun: false } },
  { code: "BODY_16_18", name: "Body 1600-1800", hours: "16:00-18:00", subspecialty: "BODY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "BODY_18_21", name: "Body 1800-2100", hours: "18:00-21:00", subspecialty: "BODY", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "NEURO_16_18", name: "Neuro 1600-1800", hours: "16:00-18:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } },
  { code: "NEURO_18_21", name: "Neuro 1800-2100", hours: "18:00-21:00", subspecialty: "NEURO", 
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false } }
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

// Real-world complexity factors based on actual CSV data
export const COMPLEXITY_FACTORS = {
  TOTAL_SHIFT_TYPES: 23,    // Exact count from shifts.csv
  NEURO_RADIOLOGISTS: 14,   // Largest subspecialty group (from rads_fte.csv)
  IR_RADIOLOGISTS: 2,       // IR subspecialty group
  BODY_RADIOLOGISTS: 3,     // Body subspecialty group
  MSK_RADIOLOGISTS: 3,      // MSK subspecialty group
  CHEST_RADIOLOGISTS: 3,    // Chest subspecialty group
  XRUS_RADIOLOGISTS: 2,     // XRUS subspecialty group
  TOTAL_RADIOLOGISTS: 27,   // Total from rads_fte.csv
  MA1_ELIGIBLE: 6,          // Radiologists who can work MA1
  WEEKDAYS_PER_MONTH: 22,   // Approximate
  VACATION_WEEKS_PER_MONTH: 1,
  MAX_CONSECUTIVE_VACATION_WEEKS: 2,
}

// Equivalence sets for swaps and fairness - updated to match CSV data
export const EQUIVALENCE_SETS = [
  { code: "NEURO_DAY", members: ["N1", "N2", "N3", "N4"] },
  { code: "BODY_DAY", members: ["CTUS", "BODY_VOL", "BODY_MRI"] },
  { code: "CLINICS", members: ["STONEY", "MA1", "SPEERS", "WALKERS", "WH_OTHER", "BRANT"] },
  { code: "NEURO_LATE", members: ["NEURO_16_18", "NEURO_18_21"] },
  { code: "BODY_LATE", members: ["BODY_16_18", "BODY_18_21"] }
]
