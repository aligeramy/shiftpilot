// Comprehensive demo data for the onboarding showcase

export interface Subspecialty {
  code: string
  name: string
  description: string
  color: string
}

export interface ShiftType {
  code: string
  name: string
  startTime: string
  endTime: string
  recurrence: {
    mon: boolean
    tue: boolean
    wed: boolean
    thu: boolean
    fri: boolean
    sat: boolean
    sun: boolean
  }
  eligibility: {
    type: 'required' | 'allowAny' | 'named'
    subspecialty?: string
    namedUsers?: string[]
  }
  description: string
  category: string
}

export interface Radiologist {
  id: string
  name: string
  email: string
  subspecialty: string
  fte: number
  role: 'RAD' | 'FELLOW' | 'RESIDENT'
}

export interface ConstraintRule {
  id: string
  type: 'coverage' | 'fairness' | 'eligibility' | 'custom'
  title: string
  description: string
  formula?: string
  active: boolean
  category: string
}

export const DEMO_SUBSPECIALTIES: Subspecialty[] = [
  {
    code: 'NEURO',
    name: 'Neuroradiology',
    description: 'Brain, spine, and head & neck imaging',
    color: 'from-blue-400/30 via-blue-500/20 to-transparent'
  },
  {
    code: 'BODY',
    name: 'Body Imaging',
    description: 'Abdominal and thoracic imaging',
    color: 'from-emerald-400/30 via-emerald-500/20 to-transparent'
  },
  {
    code: 'MSK',
    name: 'Musculoskeletal',
    description: 'Bones, joints, and soft tissue',
    color: 'from-purple-400/30 via-purple-500/20 to-transparent'
  },
  {
    code: 'IR',
    name: 'Interventional Radiology',
    description: 'Minimally invasive image-guided procedures',
    color: 'from-amber-400/30 via-amber-500/20 to-transparent'
  },
  {
    code: 'CHEST',
    name: 'Chest/Cardiac',
    description: 'Cardiac CT/MRI and thoracic imaging',
    color: 'from-rose-400/30 via-rose-500/20 to-transparent'
  },
  {
    code: 'INR',
    name: 'Interventional Neuroradiology',
    description: 'Neurovascular interventions',
    color: 'from-sky-400/30 via-sky-500/20 to-transparent'
  },
]

export const DEMO_SHIFT_TYPES: ShiftType[] = [
  // Neuro shifts
  {
    code: 'N1',
    name: 'Neuro 1',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Primary neuroradiology coverage',
    category: 'Neuro'
  },
  {
    code: 'N2',
    name: 'Neuro 2',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Secondary neuroradiology coverage',
    category: 'Neuro'
  },
  {
    code: 'N3',
    name: 'Neuro 3',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Tertiary neuroradiology coverage',
    category: 'Neuro'
  },
  {
    code: 'N4',
    name: 'Neuro 4',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: false, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Additional neuroradiology coverage',
    category: 'Neuro'
  },
  {
    code: 'NEURO_LATE_16_18',
    name: 'Neuro Late 16-18',
    startTime: '16:00',
    endTime: '18:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Evening neuroradiology coverage',
    category: 'Neuro Late'
  },
  {
    code: 'NEURO_LATE_18_21',
    name: 'Neuro Late 18-21',
    startTime: '18:00',
    endTime: '21:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'NEURO' },
    description: 'Night neuroradiology coverage',
    category: 'Neuro Late'
  },
  // Body shifts
  {
    code: 'CT_US',
    name: 'CT/Ultrasound',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'BODY' },
    description: 'CT and ultrasound coverage',
    category: 'Body'
  },
  {
    code: 'BODY_MRI',
    name: 'Body MRI',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'BODY' },
    description: 'Body MRI interpretation',
    category: 'Body'
  },
  {
    code: 'MSK',
    name: 'MSK Imaging',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'BODY' },
    description: 'Musculoskeletal imaging',
    category: 'Body'
  },
  {
    code: 'BODY_LATE_16_18',
    name: 'Body Late 16-18',
    startTime: '16:00',
    endTime: '18:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'BODY' },
    description: 'Evening body imaging',
    category: 'Body Late'
  },
  {
    code: 'BODY_LATE_18_21',
    name: 'Body Late 18-21',
    startTime: '18:00',
    endTime: '21:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'BODY' },
    description: 'Night body imaging',
    category: 'Body Late'
  },
  // IR shifts
  {
    code: 'VASC',
    name: 'Vascular IR',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'IR' },
    description: 'Vascular interventional procedures',
    category: 'IR'
  },
  {
    code: 'COIL',
    name: 'Coiling',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'named', namedUsers: ['Dr. Sarah Chen'] },
    description: 'Neurovascular coiling procedures',
    category: 'INR'
  },
  // Chest/Cardiac
  {
    code: 'CARDIAC_CT_MRI',
    name: 'Cardiac CT/MRI',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'required', subspecialty: 'CHEST' },
    description: 'Cardiac imaging interpretation',
    category: 'Cardiac'
  },
  // General/Clinic shifts
  {
    code: 'XR_GEN',
    name: 'General X-Ray',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'General radiography coverage',
    category: 'General'
  },
  {
    code: 'CLIN_MA1',
    name: 'Clinic - MA1',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Outpatient clinic MA1 location',
    category: 'Clinic'
  },
  {
    code: 'CLIN_STONEY',
    name: 'Clinic - Stoney Creek',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Outpatient clinic Stoney Creek location',
    category: 'Clinic'
  },
  {
    code: 'CLIN_SPEERS',
    name: 'Clinic - Speers',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: false, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Outpatient clinic Speers location',
    category: 'Clinic'
  },
  {
    code: 'CLIN_WALKERS',
    name: 'Clinic - Walkers Line',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: false, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Outpatient clinic Walkers Line location',
    category: 'Clinic'
  },
  // Weekend call
  {
    code: 'WEEKEND_CALL',
    name: 'Weekend Call',
    startTime: '00:00',
    endTime: '23:59',
    recurrence: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: true, sun: true },
    eligibility: { type: 'allowAny' },
    description: '24-hour weekend on-call coverage',
    category: 'Call'
  },
  // Mammography
  {
    code: 'MAMMO_1',
    name: 'Mammography 1',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Primary mammography coverage',
    category: 'Womens'
  },
  {
    code: 'MAMMO_2',
    name: 'Mammography 2',
    startTime: '08:00',
    endTime: '16:00',
    recurrence: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    eligibility: { type: 'allowAny' },
    description: 'Secondary mammography coverage',
    category: 'Womens'
  },
]

export const DEMO_RADIOLOGISTS: Radiologist[] = [
  // NEURO specialists
  { id: 'r1', name: 'Dr. Emily Johnson', email: 'ejohnson@demo.com', subspecialty: 'NEURO', fte: 100, role: 'RAD' },
  { id: 'r2', name: 'Dr. Michael Chen', email: 'mchen@demo.com', subspecialty: 'NEURO', fte: 100, role: 'RAD' },
  { id: 'r3', name: 'Dr. Sarah Williams', email: 'swilliams@demo.com', subspecialty: 'NEURO', fte: 80, role: 'RAD' },
  { id: 'r4', name: 'Dr. David Brown', email: 'dbrown@demo.com', subspecialty: 'NEURO', fte: 100, role: 'RAD' },
  { id: 'r5', name: 'Dr. Jessica Davis', email: 'jdavis@demo.com', subspecialty: 'NEURO', fte: 90, role: 'RAD' },
  
  // BODY specialists
  { id: 'r6', name: 'Dr. Robert Miller', email: 'rmiller@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r7', name: 'Dr. Jennifer Wilson', email: 'jwilson@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r8', name: 'Dr. James Moore', email: 'jmoore@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r9', name: 'Dr. Patricia Taylor', email: 'ptaylor@demo.com', subspecialty: 'BODY', fte: 70, role: 'RAD' },
  { id: 'r10', name: 'Dr. Christopher Anderson', email: 'canderson@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r11', name: 'Dr. Linda Thomas', email: 'lthomas@demo.com', subspecialty: 'BODY', fte: 80, role: 'RAD' },
  { id: 'r12', name: 'Dr. Daniel Jackson', email: 'djackson@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  
  // MSK specialists
  { id: 'r13', name: 'Dr. Barbara White', email: 'bwhite@demo.com', subspecialty: 'MSK', fte: 100, role: 'RAD' },
  { id: 'r14', name: 'Dr. Mark Harris', email: 'mharris@demo.com', subspecialty: 'MSK', fte: 100, role: 'RAD' },
  { id: 'r15', name: 'Dr. Nancy Martin', email: 'nmartin@demo.com', subspecialty: 'MSK', fte: 60, role: 'RAD' },
  
  // IR specialists
  { id: 'r16', name: 'Dr. Paul Thompson', email: 'pthompson@demo.com', subspecialty: 'IR', fte: 100, role: 'RAD' },
  { id: 'r17', name: 'Dr. Karen Garcia', email: 'kgarcia@demo.com', subspecialty: 'IR', fte: 100, role: 'RAD' },
  { id: 'r18', name: 'Dr. Steven Martinez', email: 'smartinez@demo.com', subspecialty: 'IR', fte: 90, role: 'RAD' },
  
  // CHEST specialists
  { id: 'r19', name: 'Dr. Betty Robinson', email: 'brobinson@demo.com', subspecialty: 'CHEST', fte: 100, role: 'RAD' },
  { id: 'r20', name: 'Dr. Richard Clark', email: 'rclark@demo.com', subspecialty: 'CHEST', fte: 100, role: 'RAD' },
  { id: 'r21', name: 'Dr. Susan Rodriguez', email: 'srodriguez@demo.com', subspecialty: 'CHEST', fte: 80, role: 'RAD' },
  
  // INR specialists
  { id: 'r22', name: 'Dr. Sarah Chen', email: 'schen@demo.com', subspecialty: 'INR', fte: 100, role: 'RAD' },
  { id: 'r23', name: 'Dr. Thomas Lewis', email: 'tlewis@demo.com', subspecialty: 'INR', fte: 100, role: 'RAD' },
  
  // General radiologists
  { id: 'r24', name: 'Dr. Lisa Lee', email: 'llee@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r25', name: 'Dr. Kevin Walker', email: 'kwalker@demo.com', subspecialty: 'NEURO', fte: 70, role: 'RAD' },
  { id: 'r26', name: 'Dr. Maria Hall', email: 'mhall@demo.com', subspecialty: 'BODY', fte: 100, role: 'RAD' },
  { id: 'r27', name: 'Dr. George Allen', email: 'gallen@demo.com', subspecialty: 'CHEST', fte: 100, role: 'RAD' },
  
  // Fellows
  { id: 'f1', name: 'Dr. Amy Young', email: 'ayoung@demo.com', subspecialty: 'NEURO', fte: 100, role: 'FELLOW' },
  { id: 'f2', name: 'Dr. Brian King', email: 'bking@demo.com', subspecialty: 'BODY', fte: 100, role: 'FELLOW' },
  { id: 'f3', name: 'Dr. Carol Wright', email: 'cwright@demo.com', subspecialty: 'IR', fte: 100, role: 'FELLOW' },
  
  // Residents
  { id: 'res1', name: 'Dr. Daniel Scott', email: 'dscott@demo.com', subspecialty: 'BODY', fte: 100, role: 'RESIDENT' },
  { id: 'res2', name: 'Dr. Emma Green', email: 'egreen@demo.com', subspecialty: 'NEURO', fte: 100, role: 'RESIDENT' },
]

export const DEMO_CONSTRAINTS: ConstraintRule[] = [
  {
    id: 'c1',
    type: 'coverage',
    title: '≤2 Body MRI per week',
    description: 'Maximum 2 Body MRI shifts per radiologist per week',
    formula: 'count(BODY_MRI, user, week) ≤ 2',
    active: true,
    category: 'Coverage Guardrails'
  },
  {
    id: 'c2',
    type: 'coverage',
    title: '≤2 Cardiac per day',
    description: 'Maximum 2 Cardiac CT/MRI shifts per day per radiologist',
    formula: 'count(CARDIAC_CT_MRI, user, day) ≤ 2',
    active: true,
    category: 'Coverage Guardrails'
  },
  {
    id: 'c3',
    type: 'coverage',
    title: '≤1 IR concurrent',
    description: 'No more than 1 IR shift at a time per radiologist',
    formula: 'concurrent(IR_SHIFTS, user) ≤ 1',
    active: true,
    category: 'Coverage Guardrails'
  },
  {
    id: 'c4',
    type: 'coverage',
    title: 'No Tuesday stacking',
    description: 'Neuro staff cannot have >3 shifts on Tuesdays',
    formula: 'count(NEURO_SHIFTS, user, tuesday) ≤ 3',
    active: true,
    category: 'Coverage Guardrails'
  },
  {
    id: 'f1',
    type: 'fairness',
    title: 'P1 granted: +0 points',
    description: 'First choice vacation granted adds no penalty',
    formula: 'vacation_granted(1) → fairness_delta = 0',
    active: true,
    category: 'Fairness Ledger'
  },
  {
    id: 'f2',
    type: 'fairness',
    title: 'P2 granted: +1 point',
    description: 'Second choice vacation granted adds 1 point',
    formula: 'vacation_granted(2) → fairness_delta = +1',
    active: true,
    category: 'Fairness Ledger'
  },
  {
    id: 'f3',
    type: 'fairness',
    title: 'P3 granted: +2 points',
    description: 'Third choice vacation granted adds 2 points',
    formula: 'vacation_granted(3) → fairness_delta = +2',
    active: true,
    category: 'Fairness Ledger'
  },
  {
    id: 'f4',
    type: 'fairness',
    title: 'None granted: +3 points',
    description: 'No vacation choice granted adds 3 points',
    formula: 'vacation_granted(none) → fairness_delta = +3',
    active: true,
    category: 'Fairness Ledger'
  },
  {
    id: 'f5',
    type: 'fairness',
    title: 'Weekend call: +2 points',
    description: 'Weekend call assignment adds 2 fairness points',
    formula: 'assigned(WEEKEND_CALL) → fairness_delta = +2',
    active: true,
    category: 'Fairness Ledger'
  },
  {
    id: 'f6',
    type: 'fairness',
    title: 'Swap accepted: +5 points',
    description: 'Accepting an undesirable swap adds 5 points',
    formula: 'swap_accepted(undesirable) → fairness_delta = +5',
    active: true,
    category: 'Fairness Ledger'
  },
]

export const EQUIVALENCE_SETS = [
  {
    code: 'NEURO_DAY_EQ',
    name: 'Neuro Day Shifts',
    members: ['N1', 'N2', 'N3', 'N4'],
    description: 'All daytime neuro shifts are interchangeable for swaps'
  },
  {
    code: 'NEURO_LATE_EQ',
    name: 'Neuro Late Shifts',
    members: ['NEURO_LATE_16_18', 'NEURO_LATE_18_21'],
    description: 'Neuro evening shifts can be swapped'
  },
  {
    code: 'BODY_LATE_EQ',
    name: 'Body Late Shifts',
    members: ['BODY_LATE_16_18', 'BODY_LATE_18_21'],
    description: 'Body evening shifts can be swapped'
  },
  {
    code: 'CLINIC_EQ',
    name: 'Clinic Shifts',
    members: ['CLIN_MA1', 'CLIN_STONEY', 'CLIN_SPEERS', 'CLIN_WALKERS'],
    description: 'All clinic locations are interchangeable'
  },
]

export const FTE_POLICY_BANDS = [
  { min: 60, max: 69, ptDaysPerMonth: 8, color: 'bg-rose-500' },
  { min: 70, max: 79, ptDaysPerMonth: 6, color: 'bg-orange-500' },
  { min: 80, max: 89, ptDaysPerMonth: 4, color: 'bg-amber-500' },
  { min: 90, max: 99, ptDaysPerMonth: 2, color: 'bg-emerald-500' },
  { min: 100, max: 100, ptDaysPerMonth: 0, color: 'bg-sky-500' },
]

export const DOLLAR_VALUES = {
  default: 0,
  byShiftType: {
    WEEKEND_CALL: 500,
    NEURO_LATE_18_21: 150,
    BODY_LATE_18_21: 150,
    COIL: 300,
    VASC: 200,
  },
  premiums: {
    holiday: 1.5, // 50% premium
    weekend: 1.25, // 25% premium
    night: 1.35, // 35% premium
  }
}

export const GENERATION_STEPS = [
  { id: 1, title: 'Materializing shift instances', description: 'Creating 720 shift instances for the next 2 months...', duration: 1500 },
  { id: 2, title: 'Resolving vacation preferences', description: 'Processing 64 vacation requests with fairness scoring...', duration: 2000 },
  { id: 3, title: 'Computing availability', description: 'Calculating PT days and unavailability windows...', duration: 1200 },
  { id: 4, title: 'Filtering candidate pools', description: 'Applying eligibility rules and subspecialty constraints...', duration: 1800 },
  { id: 5, title: 'Assigning radiologists', description: 'Running CP-SAT solver with fairness objectives...', duration: 3500 },
  { id: 6, title: 'Validating constraints', description: 'Checking all hard constraints and coverage requirements...', duration: 1000 },
  { id: 7, title: 'Computing fairness metrics', description: 'Analyzing distribution and calculating variance...', duration: 800 },
  { id: 8, title: 'Finalizing draft', description: 'Preparing schedule for review...', duration: 500 },
]

