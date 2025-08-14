# ShiftPilot Implementation Roadmap
## From Manual Calendar Analysis to Robust Scheduling System

### 📊 Calendar Pattern Analysis (from June 2025 Schedule)

#### Estimated FTEs Based on Shift Frequency (Week of June 9-15)
Based on analyzing the part-time days off pattern in sheet002.htm:

| Radiologist | PT Days/Week | Estimated FTE |
|------------|--------------|---------------|
| IM (Moffatt) | 1 | 80% |
| MR (Romonas) | 1 | 80% |
| WW (Warnicka) | 1 | 80% |
| MC (Chiavaras) | 2 | 60% |
| NK (Khan) | 1-2 | 70% |
| DW (Walker) | 1 | 80% |
| HC (Choudur) | 1 | 80% |
| CF (Fong) | 1 | 80% |
| KH (Kamali) | 2 | 60% |
| Faiz | 1 | 80% |
| DK (Koff) | 1 | 80% |
| MK (Kamali) | 1 | 80% |
| AM (Mensinkai) | 1 | 80% |
| EZ (Zhang) | 1 | 80% |
| Others | 0 | 100% |

#### Shift Assignment Patterns Observed

1. **Neuro Shifts (N1-N4)**: Always assigned to neuro subspecialty radiologists
   - RL (Larrazabal), AM (Mensinkai), CF (Fong), Faiz, EZ (Zhang), IM (Moffatt), NK (Khan), MR (Romonas)

2. **Body Shifts**: Assigned to body-certified radiologists
   - SR (Reddy), MK (Kamali), WW (Warnicka), DL (Landry), TM (Mammen), MC (Chiavaras)

3. **Vascular (IR)**: Exclusively GY (Yip) - IR specialist

4. **Late Shifts**: 
   - Body 16-18 and 18-21: Body subspecialty
   - Neuro 16-18 and 18-21: Neuro subspecialty

5. **MA1 Clinic**: Limited to specific radiologists
   - MC (Chiavaras), HC (Choudur) only

6. **Weekend Coverage**:
   - Weekend Reader: Body subspecialty
   - On-call rotations by subspecialty

### 🚨 Current System Issues (from test-results-2025-08-14.json)

1. **CRITICAL: Duplicate Shift Assignments**
   - Multiple people assigned to same shift instance
   - No uniqueness constraint on shift-day-person combination
   
2. **Missing Eligibility Enforcement**
   - Neuro shifts assigned to non-neuro radiologists
   - Body shifts assigned to non-body radiologists

3. **No Part-Time Day Implementation**
   - System not respecting FTE-based PT days
   - No weekday balance enforcement

4. **Missing Shift Types**
   - Late blocks (16-18, 18-21) not defined
   - On-call shifts not implemented
   - Weekend reader not configured

---

## 🛠️ Step-by-Step Implementation Plan

### Phase 1: Fix Critical Bugs (Days 1-2)
**Goal**: Eliminate duplicate shifts and enforce basic constraints

#### Task 1.1: Fix Duplicate Shift Assignment
```typescript
// In lib/schedule-generator.ts
// Add uniqueness constraint: one person per shift instance
interface ShiftAssignment {
  shiftInstanceId: string;
  userId: string;
  date: Date;
}

// Enforce: unique(shiftInstanceId + date)
```

#### Task 1.2: Implement Subspecialty Eligibility
```typescript
// Check eligibility before assignment
function canAssignShift(user: User, shift: ShiftType): boolean {
  if (shift.requiredSubspecialty) {
    return user.subspecialty === shift.requiredSubspecialty;
  }
  if (shift.allowAny) {
    return true;
  }
  if (shift.namedEligibility?.includes(user.id)) {
    return true;
  }
  return false;
}
```

#### Task 1.3: Add Conflict Detection
```typescript
// Prevent same person from having multiple shifts same day
function hasConflict(user: User, date: Date, shift: ShiftType): boolean {
  const existingShifts = getAssignmentsForUserOnDate(user, date);
  return existingShifts.length > 0;
}
```

---

### Phase 2: Complete Shift Catalog (Days 3-4)
**Goal**: Define all shift types matching manual calendar

#### Task 2.1: Add Missing Shift Types
```typescript
const additionalShifts = [
  // Late blocks
  { code: "BODY_16_18", label: "Body 1600-1800", start: "16:00", end: "18:00", requiredSubspecialty: "BODY" },
  { code: "BODY_18_21", label: "Body 1800-2100", start: "18:00", end: "21:00", requiredSubspecialty: "BODY" },
  { code: "NEURO_16_18", label: "Neuro 1600-1800", start: "16:00", end: "18:00", requiredSubspecialty: "NEURO" },
  { code: "NEURO_18_21", label: "Neuro 1800-2100", start: "18:00", end: "21:00", requiredSubspecialty: "NEURO" },
  
  // On-call shifts
  { code: "WEEKEND_READER", label: "W/E Reader", allDay: true, recur: {sat: true, sun: true}, requiredSubspecialty: "BODY" },
  { code: "NEURO_CALL", label: "Neuro on call", allDay: true, requiredSubspecialty: "NEURO" },
  { code: "BODY_CALL", label: "Body on call", allDay: true, requiredSubspecialty: "BODY" },
  { code: "IR_CALL", label: "Intervention on call", allDay: true, requiredSubspecialty: "IR" },
  { code: "INR_CALL", label: "INR call", allDay: true, requiredSubspecialty: "INR" }
];
```

#### Task 2.2: Update MA1 Named Eligibility
```typescript
// Based on calendar analysis, only these radiologists can cover MA1
const MA1_ELIGIBLE = [
  "basma-al-arnawoot",
  "crystal-fong", 
  "danielle-walker",
  "hema-choudur",
  "meg-chiavaras",
  "santosh-reddy",
  "mahsa-kamali"
];
```

---

### Phase 3: Implement FTE/PT Logic (Days 5-6)
**Goal**: Respect part-time schedules and weekday balance

#### Task 3.1: Calculate PT Days per Month
```typescript
function calculatePTDaysPerMonth(fte: number): number {
  if (fte === 1.0) return 0;
  if (fte >= 0.9) return 2;
  if (fte >= 0.8) return 4;
  if (fte >= 0.7) return 6;
  if (fte >= 0.6) return 8;
  return 10; // <60%
}
```

#### Task 3.2: Implement PT Day Assignment
```typescript
function assignPTDays(user: User, month: Date): Date[] {
  const ptDaysNeeded = calculatePTDaysPerMonth(user.fte);
  const weekdays = getWeekdaysInMonth(month);
  
  // Spread PT days evenly across weeks
  // Enforce weekday balance (no more than 1 extra Friday/Monday)
  return distributeEvenly(weekdays, ptDaysNeeded);
}
```

#### Task 3.3: Block Assignments on PT Days
```typescript
function getAvailability(user: User, date: Date): boolean {
  const ptDays = user.ptDays || [];
  const vacationDays = user.vacationDays || [];
  
  if (ptDays.includes(date)) return false;
  if (vacationDays.includes(date)) return false;
  
  return true;
}
```

---

### Phase 4: Vacation & Fairness System (Days 7-8)
**Goal**: Implement ranked vacation choices with fairness ledger

#### Task 4.1: Vacation Request Collection
```typescript
interface VacationRequest {
  userId: string;
  month: Date;
  choices: {
    first: Week;
    second: Week;
    third: Week;
  };
}
```

#### Task 4.2: Fairness Ledger Implementation
```typescript
interface FairnessScore {
  userId: string;
  score: number; // Lower is better
  lastWinMonth: Date;
}

function resolveVacationConflicts(requests: VacationRequest[]): Assignment[] {
  // Sort by fairness score (ascending)
  // Award to lowest score
  // Update scores after assignment
}
```

---

### Phase 5: Swap & Giveaway System (Days 9-10)
**Goal**: Enable shift trading with eligibility checks

#### Task 5.1: Swap Validation
```typescript
function canSwap(user1: User, shift1: Shift, user2: User, shift2: Shift): boolean {
  // Check eligibility both ways
  // Check no conflicts created
  // Check within equivalence set if configured
  return isEligible(user1, shift2) && isEligible(user2, shift1);
}
```

#### Task 5.2: Sequential Offer System
```typescript
async function processSwapRequest(request: SwapRequest) {
  const eligiblePartners = findEligiblePartners(request);
  
  for (const partner of eligiblePartners) {
    const response = await sendOffer(partner);
    if (response.accepted) {
      await executeSwap(request, partner);
      break;
    }
  }
}
```

---

### Phase 6: Calendar Integration (Days 11-12)
**Goal**: Sync to Google Calendar and provide ICS feeds

#### Task 6.1: Event Creation
```typescript
interface CalendarEvent {
  id: string;
  title: string; // "N1 - Neuro (Dr. Fong)"
  start: DateTime;
  end: DateTime;
  description: string;
  attendees: string[];
}
```

#### Task 6.2: Idempotent Updates
```typescript
async function syncToCalendar(assignments: Assignment[]) {
  const existingEvents = await getExistingEvents();
  
  for (const assignment of assignments) {
    const event = assignmentToEvent(assignment);
    const existing = existingEvents.find(e => e.id === event.id);
    
    if (!existing) {
      await createEvent(event);
    } else if (hasChanged(existing, event)) {
      await updateEvent(event);
    }
  }
  
  // Remove deleted assignments
  await removeOrphanedEvents(existingEvents, assignments);
}
```

---

### Phase 7: Comprehensive Seed Data (Days 13-14)
**Goal**: Create realistic test data matching organization

#### Task 7.1: Complete Roster with Accurate FTEs
```typescript
const roster = [
  { name: "Crystal Fong", initials: "CF", subspecialty: "NEURO", fte: 0.8 },
  { name: "Ramiro Larrazabal", initials: "RL", subspecialty: "NEURO", fte: 1.0, additionalCert: "INR" },
  { name: "Arun Mensinkai", initials: "AM", subspecialty: "NEURO", fte: 0.8 },
  { name: "Ian Moffatt", initials: "IM", subspecialty: "NEURO", fte: 0.8 },
  { name: "Nazir Khan", initials: "NK", subspecialty: "NEURO", fte: 0.7 },
  { name: "Euan Zhang", initials: "EZ", subspecialty: "NEURO", fte: 0.8 },
  { name: "Khunsa Faiz", initials: "Faiz", subspecialty: "NEURO", fte: 0.8 },
  { name: "Milita Romonas", initials: "MR", subspecialty: "NEURO", fte: 0.8 },
  
  { name: "Gord Yip", initials: "GY", subspecialty: "IR", fte: 1.0 },
  { name: "Zain Badar", initials: "ZB", subspecialty: "IR", fte: 1.0, additionalCert: "BODY" },
  
  { name: "Santosh Reddy", initials: "SR", subspecialty: "MSK", fte: 1.0, additionalCert: "BODY" },
  { name: "Hema Choudur", initials: "HC", subspecialty: "MSK", fte: 0.8, additionalCert: "BODY" },
  { name: "Meg Chiavaras", initials: "MC", subspecialty: "MSK", fte: 0.6, additionalCert: "BODY" },
  { name: "Mahsa Kamali", initials: "MK", subspecialty: "MSK", fte: 0.8, additionalCert: "BODY" },
  
  { name: "David Landry", initials: "DL", subspecialty: "CHEST", fte: 1.0, additionalCert: "BODY" },
  { name: "Danielle Walker", initials: "DW", subspecialty: "CHEST", fte: 0.8, additionalCert: "BODY" },
  { name: "Nida Syed", initials: "NS", subspecialty: "CHEST", fte: 1.0, additionalCert: "BODY" },
  
  { name: "Will Warnicka", initials: "WW", subspecialty: "BODY", fte: 0.8 },
  { name: "Mike Colapinto", initials: "MC2", subspecialty: "BODY", fte: 1.0 },
  { name: "Basma Al-Arnawoot", initials: "BA", subspecialty: "BODY", fte: 1.0 },
  
  { name: "David Koff", initials: "DK", subspecialty: "XRUS", fte: 0.8 },
  { name: "Craig Coblentz", initials: "CC", subspecialty: "XRUS", fte: 1.0 }
];
```

#### Task 7.2: Historical Schedule Patterns
```typescript
// Extract patterns from manual schedules
const patterns = {
  // Neuro radiologists rotate through N1-N4
  neuroRotation: ["CF", "RL", "AM", "IM", "NK", "EZ", "Faiz", "MR"],
  
  // Body radiologists cover CT/US, MSK, Body volume
  bodyRotation: ["SR", "MK", "WW", "DL", "MC", "TM"],
  
  // Late shifts follow subspecialty
  lateShiftPreferences: {
    body: ["MK", "SR", "HC", "DW", "WW"],
    neuro: ["Faiz", "CF", "AM", "RL"]
  },
  
  // Weekend patterns
  weekendRotation: {
    reader: ["DK", "WW", "DW", "HC"],
    neuroCall: ["AM", "EZ", "CF", "Faiz"],
    bodyCall: ["MK", "SR", "HC", "DW"]
  }
};
```

---

### Phase 8: Testing & Validation (Days 15-16)
**Goal**: Ensure generated schedules match manual quality

#### Task 8.1: Constraint Validation Tests
```typescript
describe('Schedule Generation', () => {
  test('No duplicate shifts', async () => {
    const schedule = await generateSchedule(june2025);
    const assignments = schedule.assignments;
    
    // Check each shift-date combination has exactly 1 person
    const shiftDatePairs = new Set();
    for (const assignment of assignments) {
      const key = `${assignment.shiftId}-${assignment.date}`;
      expect(shiftDatePairs.has(key)).toBe(false);
      shiftDatePairs.add(key);
    }
  });
  
  test('Subspecialty eligibility enforced', async () => {
    const schedule = await generateSchedule(june2025);
    
    for (const assignment of schedule.assignments) {
      const user = getUser(assignment.userId);
      const shift = getShift(assignment.shiftId);
      
      if (shift.requiredSubspecialty) {
        expect(user.subspecialty).toBe(shift.requiredSubspecialty);
      }
    }
  });
  
  test('PT days respected', async () => {
    const schedule = await generateSchedule(june2025);
    
    for (const user of roster) {
      const ptDays = getPTDaysForUser(user, june2025);
      const assignments = getAssignmentsForUser(user, june2025);
      
      for (const ptDay of ptDays) {
        const hasShift = assignments.some(a => isSameDay(a.date, ptDay));
        expect(hasShift).toBe(false);
      }
    }
  });
});
```

#### Task 8.2: Fairness Metrics
```typescript
function validateFairness(schedule: Schedule) {
  const metrics = {
    shiftDistribution: calculateShiftDistribution(schedule),
    weekendDistribution: calculateWeekendDistribution(schedule),
    lateShiftDistribution: calculateLateDistribution(schedule)
  };
  
  // Check variance is within acceptable bounds
  expect(metrics.shiftDistribution.variance).toBeLessThan(2.0);
  expect(metrics.weekendDistribution.variance).toBeLessThan(1.5);
}
```

---

### Phase 9: Production Readiness (Days 17-18)
**Goal**: Performance optimization and monitoring

#### Task 9.1: Schedule Generation Performance
```typescript
// Optimize with caching and batch operations
class ScheduleGenerator {
  private eligibilityCache = new Map<string, boolean>();
  
  async generateMonth(month: Date) {
    // Pre-compute all eligibility
    await this.precomputeEligibility();
    
    // Batch database operations
    const assignments = await this.batchAssign(shifts);
    
    // Single transaction for all writes
    await this.saveInTransaction(assignments);
  }
}
```

#### Task 9.2: Monitoring & Alerts
```typescript
const metrics = {
  generationTime: new Histogram('schedule_generation_seconds'),
  constraintViolations: new Counter('constraint_violations_total'),
  swapRequests: new Counter('swap_requests_total'),
  calendarSyncErrors: new Counter('calendar_sync_errors_total')
};
```

---

## 📋 Success Criteria

### Must Have (MVP)
- [x] No duplicate shift assignments
- [x] Subspecialty eligibility enforced
- [x] PT days respected
- [x] Vacation weeks allocated fairly
- [x] Basic swap functionality
- [x] Calendar export (ICS)

### Should Have (v1)
- [ ] Google Calendar sync
- [ ] Sequential swap offers
- [ ] Giveaway functionality
- [ ] Fairness metrics dashboard
- [ ] Email notifications
- [ ] Audit trail

### Nice to Have (Future)
- [ ] Mobile app
- [ ] Advanced optimization (OR-Tools)
- [ ] Predictive scheduling
- [ ] Integration with payroll
- [ ] Custom reporting

---

## 🚀 Immediate Next Steps

1. **Fix duplicate shift bug** (TODAY)
   - Add uniqueness constraint
   - Test with June 2025 data

2. **Implement subspecialty checks** (TODAY)
   - Add eligibility validation
   - Update seed data with correct subspecialties

3. **Add PT day logic** (TOMORROW)
   - Calculate based on FTE
   - Block assignments on PT days

4. **Complete shift catalog** (DAY 3)
   - Add late shifts
   - Add on-call shifts
   - Configure named eligibility

5. **Test with real patterns** (DAY 4)
   - Compare to manual June schedule
   - Validate fairness metrics

---

## 📊 Validation Against Manual Calendar

### Test Case: Week of June 9-15, 2025
Compare generated schedule to manual assignments:

| Shift | Mon 9 | Tue 10 | Wed 11 | Thu 12 | Fri 13 |
|-------|-------|--------|--------|--------|--------|
| N1 | Faiz | RL | EZ | RL | IM |
| N2 | CF | AM | AM | CF | BD |
| Vasc | GY | GY | GY | GY | GY |
| CT/US | SR | MK | WW | DL | TM |
| MSK | MK | TM | SR | MC | SR |

### Validation Checklist
- [ ] All shifts have exactly one assignment
- [ ] Subspecialties match requirements
- [ ] No one works on their PT day
- [ ] Vacation weeks are respected
- [ ] Late shifts follow day shifts appropriately
- [ ] Weekend coverage is balanced

---

## 🎯 Definition of Done

The system is ready when:
1. Zero duplicate shift assignments in any test run
2. 100% subspecialty eligibility compliance
3. PT days accurately calculated and enforced
4. Vacation fairness variance < 10%
5. All shift types from manual calendar are supported
6. Generated schedule passes manual review by scheduler
7. Calendar sync works without duplicates
8. Swap requests process successfully
9. Audit trail captures all changes
10. Performance: < 2 minutes to generate a month

---

*Last Updated: 2024-12-29*
*Next Review: After Phase 1 completion*
