# Response to Mike: ShiftPilot Vacation Scheduling Approach

**Date:** January 10, 2025  
**To:** Mike Colapinto (Lead Scheduler)  
**From:** ShiftPilot Development Team  
**Re:** P1 Vacation Template & AI-Augmented Scheduling

---

Hi Mike,

Thank you for providing the detailed P1 vacation template and the comprehensive notes on your current approach. This is extremely valuable as it captures the nuanced decision-making that currently exists primarily in your expertise.

## What We're Building

ShiftPilot will implement a **hybrid AI-augmented constraint engine** that combines:

1. **Hard-coded business rules** for your non-negotiable constraints
2. **AI-powered decision-making** for subjective judgment calls
3. **Human oversight** (you) for final approval and edge cases

**Our goal:** Achieve **100% vacation coverage** while reducing your workload from 4-6 hours to <5 minutes per scheduling cycle.

---

## How We're Encoding Your Rules

Based on your notes, we've identified and will implement:

### Hard Constraints (Never Violated)
These are **absolute rules** that will block any schedule that violates them:

1. **Subspecialty Coverage Caps (Per Week)**
   - Max 2 Body MRI rads on vacation
   - Max 2 Cardiac rads on vacation
   - Max 1 IR rad on vacation

2. **Mammography Biopsy Coverage (Critical Service)**
   - Minimum 1 mammo Bx rad available (BA, Faiz, SH, NS, WW)
   - Ideally 2+ mammo Bx rads available
   - **NS Special Case:** If NS is the only mammo rad available, must have DL or DW on Tuesdays (cardiac coverage)
   - Aim for 5 total mammo-qualified rads available

3. **Part-Time Status Awareness**
   - Calculate effective FTE when evaluating neuro/body coverage
   - Account for 60-80% FTE radiologists in availability calculations

### Soft Constraints (AI-Optimized)
These are **desirable outcomes** that our AI will optimize for:

1. **Flexible Request Placement**
   - When radiologists indicate flexibility, AI will find the "best fit" based on:
     - Overall schedule balance
     - Subspecialty coverage optimization
     - Fairness to other radiologists
     - Proximity to their preferred dates

2. **Priority Inference**
   - For cases like Saba's chronological ranking, AI will infer true priority based on:
     - Context clues (e.g., "summer vacation important")
     - Historical patterns
     - Seasonal preferences
   - AI will flag low-confidence inferences for your review

3. **Automatic Date Normalization**
   - All vacation weeks normalized to Monday-Sunday automatically
   - Regardless of how they were submitted (Sat-Sun, Sun-Sat, mid-week, etc.)

---

## The AI's Role: Your Digital Assistant

Think of the AI as **your assistant who learns from your decisions**:

### What It Handles Automatically (~95% of cases)
- Applying hard constraints (subspecialty caps, mammo coverage)
- Date normalization and formatting
- Basic conflict detection
- Straightforward request assignments

### What It Flags for Your Review (~5% of cases)
- Flexible requests with multiple good options (AI provides ranked recommendations)
- Ambiguous priority rankings (AI infers priority with confidence score)
- Edge cases that don't fit standard patterns
- Any decision where AI confidence is <90%

### What You Still Control (100% oversight)
- **Final approval** on all AI decisions
- **Manual overrides** for any assignment
- **Policy exceptions** for unique circumstances
- **Review dashboard** showing all AI reasoning

---

## Decision Transparency & Audit Trail

Every AI decision will be **fully auditable** with:

**Example: AI Decision for Flexible Request**
```
Radiologist: Basma Al-Arnawoot (BODY, Mammo-qualified)
Request: Week of Jan 20 (P1), marked "flexible"

AI Analysis:
✗ Original week: 2 BODY rads already assigned, mammo coverage OK
✓ Alternative week: Jan 27 - Only 1 BODY rad, improves mammo coverage
  
Factors Considered:
  • Subspecialty load: -0.15 (original week overloaded)
  • Mammo coverage: +0.30 (alternative improves coverage)
  • Fairness: +0.25 (helps balance across team)
  • Proximity: -0.05 (one week later than requested)
  
AI Decision: Assign week of Jan 27
Confidence: 87% (HIGH)
Recommendation: Auto-approve

Your Action: [Approve] [Override] [Review Details]
```

---

## Path to 100% Coverage

### Phase 1: Rule Implementation (Next 2 Weeks)
- Encode all your hard constraints into the system
- Test against your historical vacation schedules
- Validate 100% compliance with all rules you've provided
- **Expected coverage:** 85%

### Phase 2: AI Integration (Weeks 3-4)
- Train AI on your historical decisions
- Implement flexible request placement
- Deploy priority inference
- **Expected coverage:** 95%

### Phase 3: Human-in-the-Loop (Week 5+)
- Build your review interface
- Deploy with your oversight
- Collect feedback and refine
- **Expected coverage:** 100%

---

## What We Need from You

To build this effectively, we need:

1. **Historical Data (High Priority)**
   - Past 12 months of vacation schedules (if available)
   - Your decisions on flexible requests
   - Any past conflicts and how you resolved them
   - This helps the AI learn your judgment patterns

2. **Edge Case Examples (Medium Priority)**
   - Any unusual scenarios you've handled
   - Policy exceptions you've made
   - Tricky conflicts and your reasoning

3. **Feedback Loop (Ongoing)**
   - After each AI recommendation, quick thumbs up/down
   - Brief note when you override (helps AI learn)
   - Periodic review sessions to refine rules

---

## Handling Special Cases

### Kathy Zhao (Mammo 2x/month)
- **Current:** Sorted on the fly ~1 month before each block
- **ShiftPilot:** We'll flag weeks where she's scheduled and prompt you to confirm mammo coverage is adequate
- **No automation:** This remains manual as it's ad-hoc and context-dependent

### "Many Other Nuances"
- We know there are unwritten rules in your head
- **Our approach:** Start with what you've documented, then learn the rest
- **How:** AI will flag cases where it's uncertain, you teach it, it learns
- **Over time:** AI captures more of your tacit knowledge

---

## Benefits for You

1. **Time Savings:** 4-6 hours → <5 minutes per cycle
2. **Consistency:** All rules applied uniformly
3. **Auditability:** Every decision documented and explainable
4. **Scalability:** Works even if team grows
5. **Knowledge Capture:** Your expertise encoded in the system
6. **Reduced Stress:** No more juggling constraints in your head

---

## Next Steps

1. **This Week:**
   - We'll build the constraint engine with your rules
   - Create test suite with your P1 template
   - Validate all hard constraints work correctly

2. **Next Week:**
   - Demo the rule engine with your data
   - Show you how AI recommendations will look
   - Get your feedback on the interface

3. **Week 3-4:**
   - Integrate AI decision-making
   - Train on any historical data you can provide
   - Build your review dashboard

4. **Week 5:**
   - Pilot with next scheduling cycle
   - You review and approve all AI decisions
   - We refine based on your feedback

---

## Questions?

We're here to support you and make this transition smooth. Your expertise is what makes this system work—we're just encoding it in a way that scales.

Please let us know:
- Any rules we missed or misunderstood
- Concerns about the approach
- Additional constraints we should know about
- Preferences for the review interface

Thanks again for the detailed notes—this is exactly what we need to build something that truly helps.

Best regards,  
**ShiftPilot Development Team**

---

**P.S.** We've created a detailed technical specification document with all the rules encoded. Happy to share if you'd like to see the full implementation details.

