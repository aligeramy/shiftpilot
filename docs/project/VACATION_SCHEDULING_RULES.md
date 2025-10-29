# Vacation Scheduling Rules & AI-Augmented Approach

**Document Version:** 1.0  
**Last Updated:** January 10, 2025  
**Author:** ShiftPilot Development Team  
**Stakeholder Approval:** Mike Colapinto (Lead Scheduler)

---

## Executive Summary

This document formalizes the vacation scheduling rules and constraints currently applied manually by the administrative team. ShiftPilot will implement these rules through a **hybrid AI-augmented constraint engine** that combines:

1. **Hard-coded business rules** for non-negotiable constraints
2. **AI-powered decision-making** for subjective judgment calls
3. **Human oversight** for final approval and edge case handling

**Goal:** Achieve **100% vacation coverage** while maintaining clinical service requirements and fairness across all subspecialties.

---

## Current Manual Process (Baseline)

### Overview
The current process involves manual review and placement of P1 (first-priority) vacation requests, with the scheduler (Mike) applying domain expertise to balance:

- Individual radiologist preferences and flexibility
- Clinical coverage requirements per subspecialty
- Fairness across the team
- Special cases and edge conditions

### Pain Points Addressed by ShiftPilot
1. **Time-intensive:** Manual review and conflict resolution takes hours per scheduling cycle
2. **Implicit knowledge:** Many rules exist in the scheduler's head, not documented
3. **Difficult to audit:** Hard to explain why certain decisions were made
4. **Scalability:** Current process doesn't scale beyond current team size
5. **Fairness tracking:** Manual tracking of who got preferences in past cycles

---

## Hard Constraints (Never Violated)

These are **absolute rules** that must be satisfied in every schedule. ShiftPilot's constraint engine will reject any vacation assignment that violates these.

### 1. Subspecialty Coverage Caps (Per Week)

| Subspecialty | Max Radiologists on Vacation | Rationale |
|--------------|------------------------------|-----------|
| **Body MRI** | 2 | Limited pool of Body specialists |
| **Cardiac (CHEST)** | 2 | Specialized cardiac imaging coverage |
| **IR (Interventional)** | 1 | Only 2 IR rads total; need 1 available |

**Implementation:**
```typescript
// Constraint: Body MRI Coverage
if (countRadiologistsOnVacation(week, 'BODY') > 2) {
  return CONSTRAINT_VIOLATION
}

// Constraint: Cardiac Coverage
if (countRadiologistsOnVacation(week, 'CHEST') > 2) {
  return CONSTRAINT_VIOLATION
}

// Constraint: IR Coverage
if (countRadiologistsOnVacation(week, 'IR') > 1) {
  return CONSTRAINT_VIOLATION
}
```

---

### 2. Mammography Biopsy Coverage (Critical Service)

**Minimum Requirements (Per Week):**
- **At least 1** mammo Bx rad available (absolute minimum)
- **Ideally 2+** mammo Bx rads available (quality target)
- **Aim for 5** total mammo-qualified rads available (optimal)

**Mammo Bx Qualified Radiologists:**
- **BA** (Basma Al-Arnawoot)
- **Faiz** (Khunsa Faiz)
- **SH** (Shamis Hasan)
- **NS** (Nida Syed) - *Special constraint: Also cardiac rad*
- **WW** (Will Warnicka)

**Extended Mammo Coverage Pool (9 rads):**
- BA, MNC (Meg Chiavaras), Faiz, SH, DL (David Landry), IM (Ian Moffatt), MR (Milita Romonas), NS, DW (Danielle Walker)

**Special Case: NS (Nida Syed)**
- NS is qualified for both **mammography** and **cardiac imaging**
- If NS is the **only** breast Bx rad available in a week:
  - Must have **DL (David Landry)** OR **DW (Danielle Walker)** available on **Tuesdays**
  - This ensures cardiac coverage while NS performs biopsies

**Implementation:**
```typescript
// Hard Constraint: Minimum 1 Mammo Bx Rad
const mammoBxRads = ['BA', 'Faiz', 'SH', 'NS', 'WW']
const availableCount = mammoBxRads.filter(rad => !isOnVacation(rad, week)).length

if (availableCount < 1) {
  return CRITICAL_VIOLATION // Blocks schedule generation
}

// Soft Constraint: Ideally 2+ Mammo Bx Rads
if (availableCount < 2) {
  return WARNING // Flags for review but doesn't block
}

// NS Special Case: Cardiac Coverage on Tuesdays
if (availableCount === 1 && onlyAvailable === 'NS') {
  const tuesdayCardiacCoverage = isAvailable('DL', week) || isAvailable('DW', week)
  if (!tuesdayCardiacCoverage) {
    return CONSTRAINT_VIOLATION
  }
}
```

**Note on Kathy Zhao:**
- Kathy Zhao performs biopsies **2x per month** (ad-hoc scheduling)
- Not included in automated constraint checking
- Handled manually ~1 month before each 2-month block

---

### 3. Part-Time (PT) Status Awareness

**Rule:** Must be cognizant of PT radiologists when calculating total neuro and body coverage.

**Context:** While total numbers of neuro/body rads may look sufficient, part-time status reduces effective FTE coverage.

**PT Radiologists (from real roster):**
- **60% FTE:** Arun Mensinkai (NEURO), Ian Moffatt (NEURO), Shauna Kennedy (NEURO), Charlotte Gallienne (NEURO), Khunsa Faiz (NEURO), Euan Zhang (NEURO), Hema Choudur (MSK), Nida Syed (CHEST)
- **70% FTE:** Crystal Fong (NEURO), Nazir Khan (NEURO)
- **80% FTE:** Multiple rads across subspecialties

**Implementation:**
```typescript
// Effective FTE Calculation
function calculateEffectiveFTE(radiologists: Radiologist[]): number {
  return radiologists.reduce((total, rad) => {
    return total + (rad.ftePercent / 100)
  }, 0)
}

// Constraint: Minimum Effective Neuro FTE Available
const availableNeuroRads = getAvailableRadiologists(week, 'NEURO')
const effectiveNeuroFTE = calculateEffectiveFTE(availableNeuroRads)

if (effectiveNeuroFTE < MINIMUM_NEURO_FTE_REQUIRED) {
  return CONSTRAINT_VIOLATION
}
```

---

## Soft Constraints (Optimized by AI)

These are **desirable outcomes** that the AI will optimize for, but can be relaxed if necessary to achieve feasibility.

### 1. Request Flexibility Interpretation

**Scenario:** Some radiologists indicate flexibility in their requests.

**Current Manual Approach:**
- Scheduler (Mike) uses judgment to place flexible requests where they "best fit"
- Balances individual preference with overall schedule optimization
- Aims to grant flexible requests while satisfying rigid requests

**AI-Augmented Approach:**
```typescript
// AI Decision Point: Flexible Request Placement
const aiDecision = await aiAgent.evaluateFlexibleRequest({
  radiologist: 'Basma Al-Arnawoot',
  preferredWeeks: [1, 2, 3], // P1, P2, P3 choices
  flexibility: 'high',
  constraints: {
    subspecialty: 'BODY',
    mammoCoverage: true,
    currentVacationLoad: weeklyVacationCount
  }
})

// AI considers:
// - Which week has most capacity for BODY rads
// - Impact on mammo coverage (BA is mammo-qualified)
// - Fairness to other radiologists with rigid requests
// - Overall schedule balance
```

**Rationale:** This is inherently a multi-factor optimization problem that benefits from AI's ability to evaluate complex tradeoffs.

---

### 2. Priority Inference from Request Patterns

**Scenario:** Some radiologists rank requests chronologically instead of by priority.

**Example (Saba Moghimi):**
- Submitted weeks 1, 2, 3 in chronological order (Jan, Feb, Mar)
- **Intent:** Wanted summer vacation, not necessarily in priority order

**Current Manual Approach:**
- Scheduler infers true priority based on context (e.g., summer months)
- Overrides literal ranking to satisfy inferred intent

**AI-Augmented Approach:**
```typescript
// AI Decision Point: Priority Inference
const aiDecision = await aiAgent.inferRequestPriority({
  radiologist: 'Saba Moghimi',
  submittedRanking: [
    { rank: 1, week: 'Jan 6-12' },
    { rank: 2, week: 'Feb 10-16' },
    { rank: 3, week: 'Mar 3-9' }
  ],
  context: {
    submissionNotes: 'Chronological order',
    seasonalPreferences: 'summer vacation important',
    pastPatterns: analyzeHistoricalRequests('Saba')
  }
})

// AI outputs:
// inferredPriority: {
//   1: 'Mar 3-9' (closest to summer)
//   2: 'Feb 10-16'
//   3: 'Jan 6-12'
// }
// confidence: 0.85
// reasoning: "User mentioned summer preference; March is closer to summer months"
```

**Rationale:** Humans excel at inferring intent from imperfect data. AI can learn these patterns from historical scheduler decisions.

---

### 3. Date Normalization

**Rule:** All vacation requests are normalized to start on **Monday** of the requested week, regardless of how they were submitted.

**Submission Variations:**
- Saturday → Sunday (weekend-start)
- Sunday → Saturday (calendar week)
- Monday → Sunday (work week)
- Mid-week start dates

**Implementation:**
```typescript
// Automatic Normalization
function normalizeVacationWeek(submittedDate: Date): { start: Date, end: Date } {
  const monday = getMondayOfWeek(submittedDate)
  const sunday = addDays(monday, 6)
  
  return {
    start: monday,
    end: sunday
  }
}

// Applied to all requests before constraint evaluation
```

**Rationale:** Standardization simplifies constraint checking and prevents edge cases.

---

## AI-Augmented Decision Framework

ShiftPilot uses a **three-tier decision architecture**:

### Tier 1: Rule Engine (Deterministic)
- Hard constraints (subspecialty caps, mammo coverage)
- Date normalization
- Basic eligibility checking
- **Coverage: ~70% of decisions**

### Tier 2: AI Agent (Probabilistic)
- Flexible request placement
- Priority inference
- Conflict resolution strategies
- Fairness optimization across multiple dimensions
- **Coverage: ~25% of decisions**

### Tier 3: Human Review (Judgment)
- Edge cases flagged by AI
- Policy exceptions
- Final approval
- Manual overrides for unique circumstances
- **Coverage: ~5% of decisions**

---

## Path to 100% Vacation Coverage

### Current State (Manual Process)
- **Coverage:** ~95% (estimated based on Mike's review)
- **Unresolved conflicts:** Resolved through email/phone discussions
- **Time required:** 4-6 hours per scheduling cycle

### Target State (AI-Augmented ShiftPilot)

#### Phase 1: Rule Implementation (Weeks 1-2)
- [x] Encode hard constraints into constraint engine
- [ ] Test against historical data (past 12 months)
- [ ] Validate 100% compliance with hard rules
- **Expected coverage:** 85%

#### Phase 2: AI Integration (Weeks 3-4)
- [ ] Train AI agent on Mike's historical decisions
- [ ] Implement flexible request placement algorithm
- [ ] Deploy priority inference model
- **Expected coverage:** 95%

#### Phase 3: Human-in-the-Loop (Week 5+)
- [ ] Build review interface for flagged cases
- [ ] Implement approval workflow
- [ ] Add audit trail for all AI decisions
- **Expected coverage:** 100%

---

## Decision Transparency & Audit

Every AI decision will be **fully auditable** with:

1. **Input Context:**
   - Radiologist request
   - Current schedule state
   - Applicable constraints
   
2. **Decision Rationale:**
   - Factors considered
   - Weights applied
   - Alternative options evaluated
   
3. **Confidence Score:**
   - High (>90%): Auto-approve
   - Medium (70-90%): Flag for quick review
   - Low (<70%): Escalate to human
   
4. **Override Mechanism:**
   - Admin can override any AI decision
   - Override reason captured in audit log
   - AI learns from overrides (feedback loop)

**Example Audit Entry:**
```json
{
  "timestamp": "2025-01-15T14:30:00Z",
  "decision_id": "VAC_2025_01_BA_FLEX",
  "radiologist": "Basma Al-Arnawoot",
  "request": {
    "rank": 1,
    "week": "Jan 20-26",
    "flexibility": "high"
  },
  "ai_decision": {
    "assigned_week": "Jan 27-Feb 2",
    "reasoning": "Original week had 2 BODY rads already; shifted by 1 week maintains mammo coverage and improves fairness score",
    "confidence": 0.87,
    "factors": {
      "subspecialty_load": -0.15,
      "mammo_coverage": +0.30,
      "fairness_improvement": +0.25,
      "proximity_to_request": -0.05
    }
  },
  "outcome": "APPROVED",
  "approver": "Mike Colapinto",
  "notes": "AI decision aligns with my judgment"
}
```

---

## Success Metrics

### Quantitative Metrics
1. **Coverage Rate:** 100% of P1 requests assigned
2. **Constraint Compliance:** 0 hard constraint violations
3. **Processing Time:** <5 minutes (vs. 4-6 hours manual)
4. **AI Accuracy:** >95% agreement with historical manual decisions
5. **Fairness Score:** <15% coefficient of variation in vacation distribution

### Qualitative Metrics
1. **Radiologist Satisfaction:** Survey after each cycle
2. **Administrative Confidence:** Scheduler trust in AI recommendations
3. **Transparency:** All decisions explainable and auditable
4. **Flexibility:** System adapts to policy changes without code changes

---

## Next Steps

### Immediate (Next 2 Weeks)
1. ✅ Document all rules from Mike's email
2. [ ] Encode hard constraints in ShiftPilot constraint engine
3. [ ] Build test suite with historical vacation schedules
4. [ ] Validate constraint compliance against known-good schedules

### Short-Term (Weeks 3-6)
1. [ ] Integrate AI agent for flexible request placement
2. [ ] Train priority inference model on historical data
3. [ ] Build admin review interface
4. [ ] Conduct pilot with January 2025 vacation requests

### Medium-Term (Months 2-3)
1. [ ] Deploy to production with human oversight
2. [ ] Collect feedback and refine AI models
3. [ ] Expand to P2 and P3 vacation preferences
4. [ ] Integrate with full schedule generation

---

## Stakeholder Sign-Off

**Prepared by:** ShiftPilot Development Team  
**Reviewed by:** Mike Colapinto (Lead Scheduler)  
**Approved by:** [Pending]

**Questions or Feedback:** Contact development team at [contact info]

---

## Appendix: Rule Quick Reference

### Hard Constraints (MUST SATISFY)
- ✅ Max 2 Body MRI rads per week
- ✅ Max 2 Cardiac rads per week
- ✅ Max 1 IR rad per week
- ✅ Min 1 mammo Bx rad per week (ideally 2+)
- ✅ NS special case: DL or DW available on Tuesdays if NS is only mammo rad
- ✅ PT status considered for effective FTE calculation

### Soft Constraints (OPTIMIZE FOR)
- 🎯 Honor flexible requests while optimizing overall schedule
- 🎯 Infer true priority from context and patterns
- 🎯 Normalize all dates to Monday-Sunday weeks
- 🎯 Aim for 5 total mammo rads available per week
- 🎯 Balance subspecialty loads across time

### AI Decision Points
- 🤖 Flexible request placement
- 🤖 Priority inference from ambiguous input
- 🤖 Conflict resolution strategies
- 🤖 Multi-constraint optimization

---

**Document End**

