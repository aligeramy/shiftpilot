# 🏥 ShiftPilot Schedule Generation - Constraints Specification

## 📋 Document Overview

**Document**: Constraints Specification v2.0  
**Owner**: Engineering Team  
**Last Updated**: 2025-01-17  
**Status**: Production Ready  

This document defines ALL constraints, rules, and algorithms used in ShiftPilot's schedule generation engine. Every constraint is categorized, prioritized, and mathematically defined for deterministic behavior.

---

## 🎯 Constraint Categories

### **HARD CONSTRAINTS** (Never Violated - System Failure if Broken)
Hard constraints are **mathematically enforced** and cause generation failure if unsatisfiable.

### **SOFT CONSTRAINTS** (Optimized - Balanced Against Each Other) 
Soft constraints are **optimization objectives** scored and balanced to find best solution.

### **BUSINESS RULES** (Configurable - Defined Per Organization)
Business rules are **tenant-specific** and defined in organization configuration.

---

## 🔴 **HARD CONSTRAINTS** (Priority: CRITICAL)

### **HC-001: Shift Coverage Requirement**
```
RULE: Every shift instance MUST have exactly 1 assigned radiologist
ENFORCEMENT: Generation fails if any shift remains unassigned
VALIDATION: COUNT(assignments per instance) = 1 FOR ALL instances
```

**Implementation Logic**:
- ✅ Every `ScheduleInstance` must have exactly one `ScheduleAssignment`
- ✅ Zero assignments = coverage failure (CRITICAL ERROR)
- ✅ Multiple assignments = constraint violation (CRITICAL ERROR)

### **HC-002: Subspecialty Eligibility**
```
RULE: Radiologist subspecialty MUST match shift requirements
ENFORCEMENT: Only eligible radiologists can be assigned to subspecialty shifts
VALIDATION: assignment.user.subspecialty = instance.shiftType.requiredSubspecialty
```

**Subspecialty Matrix**:
| Shift Type | Eligible Subspecialties | 
|------------|------------------------|
| `NEURO_*` | NEURO only |
| `IR_*`, `VASC` | IR only |
| `BODY_*`, `CTUS` | BODY only |
| `MSK_*` | MSK only |
| `CHEST_*`, `CARDIAC` | CHEST only |
| `INR_*`, `COILING` | NEURO with INR certification |
| `ANY_*`, `CLINICS` | All subspecialties |

### **HC-003: Named Eligibility (Procedure Shifts)**
```
RULE: Named shifts MUST only assign radiologists in allowlist
ENFORCEMENT: Check against shift.namedAllowlist before assignment
VALIDATION: assignment.user.email IN shift.namedAllowlist
```

**Named Shift Matrix**:
| Shift Code | Named Allowlist (by email) |
|------------|----------------------------|
| `MA1` | balnawoot@test.com, dwalker@test.com, hchoudur@test.com, mchiavaras@test.com, sreddy@test.com, mkamali@test.com |
| `COILING` | rlarrazabal@test.com |

### **HC-004: Single Assignment Per Day**
```
RULE: No radiologist can work multiple shifts on same calendar day
ENFORCEMENT: Check existing assignments for date before assigning
VALIDATION: COUNT(assignments per user per date) <= 1
```

**Date Conflict Prevention**:
- ✅ Check `ScheduleAssignment` table for existing assignments on target date
- ✅ Exclude radiologist from candidate pool if already assigned
- ✅ Handle timezone properly for date boundaries

### **HC-005: Vacation Block Compliance**
```
RULE: Radiologists CANNOT be assigned during approved vacation
ENFORCEMENT: Check VacationPreference.status = APPROVED for date range
VALIDATION: assignment.date NOT IN user.approvedVacationDates
```

**Vacation Integration**:
- ✅ Load all `APPROVED` vacation preferences before generation
- ✅ Create exclusion calendar for each radiologist
- ✅ Remove from candidate pool during vacation periods

### **HC-006: FTE Compliance (Part-Time Requirements)**
```
RULE: Part-time radiologists MUST have required days off per month
ENFORCEMENT: Calculate monthly assignments vs FTE percentage
VALIDATION: monthlyAssignments <= (FTE% × totalWorkDays)
```

**FTE Calculation Matrix**:
| FTE Percentage | Days Off Per Month | Max Assignments (22 work days) |
|----------------|-------------------|-------------------------------|
| 60% | 8-9 | 13-14 |
| 70% | 6-7 | 15-16 |
| 80% | 4-5 | 17-18 |
| 90% | 2-3 | 19-20 |
| 100% | 0 | 22 |

---

## 🟡 **SOFT CONSTRAINTS** (Priority: OPTIMIZE)

### **SC-001: Workload Distribution Fairness**
```
OBJECTIVE: Minimize coefficient of variation in monthly assignments
TARGET: CV < 15% (excellent), CV < 25% (acceptable)
SCORING: Penalize assignments that increase workload inequality
```

**Fairness Algorithm**:
```typescript
fairnessScore = -Math.abs(currentWorkload - targetWorkload) * 10
targetWorkload = totalShifts / totalRadiologists
```

### **SC-002: Vacation Preference Satisfaction**
```
OBJECTIVE: Maximize first-choice vacation preferences granted
SCORING: P1 = +3 points, P2 = +2 points, P3 = +1 point
TARGET: >60% P1 satisfaction, >80% P1+P2 satisfaction
```

**Preference Distribution Algorithm**:
```typescript
vacationScore = {
  P1_GRANTED: +3,
  P2_GRANTED: +2, 
  P3_GRANTED: +1,
  NO_PREFERENCE: 0,
  PREFERENCE_DENIED: -2
}
```

### **SC-003: Shift Desirability Balance**
```
OBJECTIVE: Evenly distribute desirable vs undesirable shifts
SCORING: Offset undesirable assignments with future desirable ones
```

**Shift Desirability Matrix**:
| Shift Pattern | Desirability Score | Reasoning |
|---------------|-------------------|-----------|
| 08:00-16:00 Weekdays | +2 | Normal hours |
| 16:00-18:00 | -1 | Late start |
| 18:00-21:00 | -3 | Evening hours |
| Weekend shifts | -5 | Weekend work |
| Holiday shifts | -8 | Holiday work |
| Call shifts | -10 | On-call burden |
| Prime clinics (MA1) | +5 | Desirable procedures |

### **SC-004: Consecutive Work Limits**
```
OBJECTIVE: Prevent burnout by limiting consecutive assignments
SOFT_LIMIT: 5 consecutive days (warning)
HARD_LIMIT: 7 consecutive days (blocked)
```

### **SC-005: Geographic Distribution (Multi-Site)**
```
OBJECTIVE: Minimize travel between sites on consecutive days
SCORING: Penalize site switches, prefer consistent locations
```

---

## ⚙️ **BUSINESS RULES** (Priority: CONFIGURABLE)

### **BR-001: Organization-Specific Subspecialties**
```
CONFIGURATION: tenant.subspecialties[]
EXAMPLE: ["NEURO", "IR", "BODY", "MSK", "CHEST", "INR", "XRUS"]
```

### **BR-002: Shift Type Catalog**
```
CONFIGURATION: tenant.shiftTypes[]
INCLUDES: code, name, times, recurrence, eligibility, minStaff
```

### **BR-003: Vacation Policy**
```
CONFIGURATION: tenant.vacationPolicy
INCLUDES: weeksPerMonth, maxConsecutive, preferencesRequired
```

### **BR-004: FTE Bands & Part-Time Policy**  
```
CONFIGURATION: tenant.fteBands[]
INCLUDES: minFTE, maxFTE, ptDaysPerMonth, eligibleShifts
```

### **BR-005: Equivalence Sets (Swapping)**
```
CONFIGURATION: tenant.equivalenceSets[]
PURPOSE: Define which shifts can be swapped with each other
EXAMPLE: ["NEURO_DAY": ["N1", "N2", "N3", "N4"]]
```

---

## 🧮 **MATHEMATICAL FORMULATION**

### **Decision Variables**
```
x[i,s,d] = Binary variable (0/1)
  i = radiologist index
  s = shift instance index  
  d = date index
  
x[i,s,d] = 1 if radiologist i is assigned to shift s on date d
x[i,s,d] = 0 otherwise
```

### **Objective Function**
```
Maximize: Σ(fairnessScore[i,s,d] * x[i,s,d]) 
        + Σ(vacationScore[i,d] * x[i,s,d])
        + Σ(desirabilityScore[s] * x[i,s,d])

Subject to all hard constraints HC-001 through HC-006
```

### **Hard Constraint Formulations**

**HC-001 (Coverage)**:
```
Σ(x[i,s,d]) = 1  ∀s,d
```

**HC-002 (Subspecialty)**:
```
x[i,s,d] = 0  if subspecialty[i] ≠ required[s]
```

**HC-004 (Single Assignment)**:
```
Σ(x[i,s,d]) ≤ 1  ∀i,d
```

**HC-005 (Vacation)**:
```
x[i,s,d] = 0  if vacation[i,d] = APPROVED
```

---

## 🔄 **GENERATION ALGORITHM FLOW**

### **Phase 1: Initialization**
1. Load organization data (radiologists, shifts, preferences)
2. Generate shift instances for target period  
3. Build constraint matrices and eligibility maps
4. Initialize fairness tracking and workload counters

### **Phase 2: Constraint Preprocessing** 
1. Apply vacation blocks (remove unavailable radiologists)
2. Filter subspecialty eligibility per shift
3. Apply named allowlists for procedure shifts
4. Calculate FTE-based availability windows

### **Phase 3: Assignment Generation**
1. Sort shifts by difficulty (fewest eligible candidates first)
2. For each shift, score all eligible candidates
3. Select highest-scored candidate (with randomization for ties)
4. Update workload tracking and fairness scores
5. Mark assignment and continue

### **Phase 4: Validation & Optimization**
1. Verify all hard constraints satisfied
2. Calculate soft constraint scores  
3. Run local optimization passes if needed
4. Generate assignment records and audit trail

### **Phase 5: Result Assembly**
1. Create `ScheduleAssignment` records in database
2. Generate performance metrics and coverage reports
3. Log generation statistics and constraint violations
4. Return `GenerationResult` with full transparency

---

## 📊 **SUCCESS CRITERIA & KPIs**

### **Coverage Metrics**
- ✅ **100% shift coverage** (no unassigned shifts)
- ✅ **0 hard constraint violations**
- ✅ **Generation time < 2 seconds** for monthly schedule

### **Fairness Metrics**  
- ✅ **Workload CV < 15%** (coefficient of variation)
- ✅ **>60% P1 vacation satisfaction**
- ✅ **>80% P1+P2 vacation satisfaction**
- ✅ **Desirability balance within ±20%**

### **Quality Metrics**
- ✅ **Subspecialty compliance: 100%**
- ✅ **Named shift compliance: 100%**  
- ✅ **FTE compliance: >95%**
- ✅ **No consecutive day violations**

---

## 🚨 **FAILURE MODES & HANDLING**

### **Generation Failures**
1. **Insufficient Coverage**: Not enough radiologists for required shifts
   - **Response**: Alert administrators, suggest roster expansion
   
2. **Impossible Constraints**: Conflicting hard constraints
   - **Response**: Detailed constraint analysis, suggest rule relaxation
   
3. **Timeout**: Generation exceeds time limit  
   - **Response**: Return best-effort solution, log performance issue

### **Quality Failures**
1. **Poor Fairness**: High workload variation
   - **Response**: Run additional optimization passes
   
2. **Low Vacation Satisfaction**: Too many preference conflicts
   - **Response**: Suggest vacation policy adjustments

### **Data Integrity Failures**
1. **Missing Radiologists**: No eligible candidates
   - **Response**: Validate roster completeness
   
2. **Invalid Shift Types**: Malformed shift configuration
   - **Response**: Validate shift catalog integrity

---

## 🔧 **CONFIGURATION VALIDATION**

### **Pre-Generation Checks**
```typescript
interface ValidationResult {
  isValid: boolean
  errors: ConstraintError[]
  warnings: ConstraintWarning[]
  recommendations: string[]
}
```

### **Required Validations**
1. **Roster Adequacy**: Sufficient radiologists per subspecialty
2. **Shift Type Integrity**: Valid time ranges and recurrence  
3. **Subspecialty Coverage**: At least 1 eligible radiologist per shift type
4. **Named Allowlist Completeness**: All named shifts have valid allowlists
5. **FTE Policy Consistency**: Realistic part-time percentages
6. **Vacation Policy Feasibility**: Achievable preference satisfaction rates

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Algorithm Complexity**
- **Time Complexity**: O(S × R × log(R)) where S=shifts, R=radiologists
- **Space Complexity**: O(S × R) for constraint matrices
- **Target Performance**: <2s for 500 shifts × 50 radiologists

### **Optimization Strategies**
1. **Preprocessing**: Pre-compute eligibility matrices
2. **Pruning**: Early elimination of impossible assignments  
3. **Heuristics**: Sort by constraint difficulty
4. **Caching**: Reuse fairness calculations across iterations
5. **Parallelization**: Independent constraint checking per shift

---

## 🔍 **AUDIT & TRANSPARENCY**

### **Generation Audit Trail**
Every generation produces complete audit log including:
- Input parameters and random seed (reproducibility)
- Constraint evaluation decisions per assignment
- Fairness calculations and score evolution  
- Rejected candidates and reasoning
- Performance metrics and timing breakdown

### **Explainability Requirements**
For every assignment, system must provide:
- Why this radiologist was selected
- What constraints were considered  
- How fairness scores were calculated
- What alternatives were rejected and why

---

## 🎯 **CONCLUSION**

This constraints specification defines the **complete mathematical and logical foundation** for ShiftPilot's schedule generation engine. All constraints are:

- ✅ **Precisely Defined**: Mathematical formulation with validation criteria
- ✅ **Categorized by Priority**: Hard vs Soft vs Business rules
- ✅ **Implementation Ready**: Clear algorithms and data structures
- ✅ **Audit Transparent**: Full explainability and reproducibility
- ✅ **Performance Optimized**: Sub-2-second generation targets

**Next Steps**: Implement enterprise-level generation engine based on this specification.
