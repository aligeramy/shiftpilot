# 01_project_overview.md
**Radiology Scheduling Platform — Project Overview (Config‑First, Multi‑Tenant)**  
Prepared: August 13, 2025 | Owner: Ali | Audience: AI/Backend/Frontend Engineers, PM, QA

---


## 0) One‑sentence summary
A configurable, multi‑tenant web platform that automatically generates fair, constraint‑aware schedules for medical groups (e.g., 30+ radiologists across 20–30 shift types) by collecting ranked vacation preferences and FTE‑driven part‑time days, enforcing subspecialty and named‑eligibility rules, balancing workload across the year, enabling swap/giveaway workflows with approvals, tallying dollar values for payouts, and publishing master/per‑user calendars (with one‑way Google sync)—all without hardcoding...

---

## 1) Product vision
Scheduling has been done manually—slow, error‑prone, hard to audit, and frustrating for admins and physicians. Our vision is a **config‑first** platform where each tenant (group) defines its own rules: subspecialties, shift catalog, eligibility, vacation/FTE policy, equivalence for swaps, giveaway permissions, and dollar values. The engine then produces high‑quality schedules quickly, fairly, and reproducibly, while giving admins control to review, tweak, publish, and audit.

**Why config‑first?**  
- Every group’s rules vary; we cannot ship custom code per group.  
- Rules evolve (e.g., clinic opens, named eligibility changes).  
- Declarative configuration keeps the engine generic and maintainable.

**North‑star outcomes**  
- Minutes to generate a year‑long schedule that a human could trust.  
- Fairness parity across the year (vacation 1st‑choices and key shifts).  
- Minimal back‑and‑forth emails (structured swaps/giveaways).  
- Finance‑ready exports (monthly and YTD $ tallies).

---

## 2) Problem statement
- Manual scheduling does not scale for 30+ rads × 20–30 shifts/day × 365 days.  
- Vacation conflicts, subspecialty eligibility, and fairness across the year are hard to track by hand.  
- Swap/giveaway requests generate noisy email threads without audit trails.  
- Bookkeepers need clean monthly/YTD shift totals and dollar amounts.  
- Different FTEs (60–100%) require consistent PT (part‑time) day accounting.

Our platform addresses all of the above with a deterministic, auditable generation engine and self‑serve workflows.

---

## 3) Stakeholders & roles
- **Super Admin (platform owner):** create/manage orgs; observe system health; no access to clinical details beyond governance.  
- **Admin (group scheduler):** configure tenant (timezone, week start, subspecialties, shift catalog, eligibility, vacation/FTE policy, equivalence, $ values); import roster; run engine; review/edit; publish; send invites/reminders; export reports.  
- **Chief (medical lead):** approve exceptions and soft‑rule violations (e.g., >2 consecutive vacation weeks), review drafts, publish.  
- **Radiologist/Fellow/Resident (end user):** complete profile (FTE, subspecialty), submit ranked vacation weeks monthly, view personal calendar, request swaps/giveaways, set “away” dates.

> **RBAC** is org‑scoped; routes and APIs enforce role + org boundaries.

---

## 4) Scope (full project)
**Included**
- Multi‑tenant configuration of subspecialties, shift types (hours & recurrence), eligibility (required/named/any), vacation & FTE/PT policy, equivalence sets (swap‑only), giveaway eligibility, and dollar values.  
- Roster management (import CSV of members with roles, subspecialty, FTE).  
- Vacation intake (per month: 1st/2nd/3rd ranked week choices, reminders, lock date).  
- Deterministic generation engine (month or year), drafts, manual edits, publish.  
- Swap/giveaway workflows with sequential offers and approvals; “away” dates.  
- Calendars (master, personal), one‑way Google calendar sync (OAuth; ICS fallback).  
- Reporting: monthly & YTD per‑user shift counts and $ totals; group roll‑ups.  
- Audit logging across config changes, generation runs, swaps, approvals, publish.

**Not included / future**  
- Payroll integrations beyond exports (e.g., direct ACH).  
- Advanced optimization beyond heuristic (will support pluggable solver).  
- Native mobile apps (mobile web responsive is sufficient).

---

## 5) Guiding principles
1. **Configuration over code** — Everything tenant‑specific is declarative.  
2. **Hard rules first** — Eligibility and required coverage are never auto‑broken.  
3. **Fairness & transparency** — Tie‑breaks and rotations are explainable and logged.  
4. **Determinism** — Seeding produces reproducible results; audit records the seed.  
5. **Progressive complexity** — Heuristic baseline; solver plugin later if needed.  
6. **Human‑in‑the‑loop** — Admins can locally adjust & re‑balance before publishing.

---

## 6) Key concepts (glossary)
- **Subspecialty**: label like NEURO, IR, BODY, CHEST.  
- **Shift Type**: reusable pattern with name/code, time window, recurrence (Mon–Sun flags), and eligibility rules.  
- **Shift Instance**: concrete date + shift type occurrence needing an assignee.  
- **Eligibility**: requiredSubspecialty, allowAny, and/or namedEligibility.  
- **Vacation Prefs**: user’s 1st/2nd/3rd week choices per month.  
- **Fairness Ledger**: per‑person rolling score to equalize wins over the year.  
- **FTE/PT Policy**: maps FTE bands (e.g., 60%, 70%, …) to PT days/month and weekday balance cap.  
- **Equivalence Set**: shift types considered interchangeable for swaps (not for generation).  
- **Dollar Values**: optional $$ per shift type (and premiums) for payout reports.  
- **Away Window**: dates where a user opts out of receiving swap/giveaway requests.

---

## 7) Example: our group’s configuration snapshot
This tenant (27 rads) uses these **rules as configuration** (no hardcoding):
- **Neuro 1–4** → **NEURO only**  
- **Vascular (IR)** → **IR only**  
- **General X‑ray** → **anyone** (culturally covered by BODY, but rule is allowAny)  
- **CT/US**, **MSK**, **Body Volume Support**, **Body MRI** → **BODY only**  
- **Clinic sites** (Stoney Creek, MA1, Speers, Walker’s Line, WH other, Brant) → **anyone** (MA1 may become named‑only)  
- **Coiling** → **INR named person only**  
- **Cardiac CT/MRI** → **CHEST only**  
- **Late blocks** (Body/Neuro 16–18, 18–21) → respective subspecialties  
- **Vacations**: 1 week/month, 3 ranked options, fairness rotation, limit on long consecutive runs.  
- **FTE/PT**: org policy maps FTE bands to PT days/month with weekday balance cap.  
- **Giveaways**: weekend call eligible; others swap‑only.  
- **$ values**: defaults to 0 except configured call amounts; extendable later.

---

## 8) User journeys (end‑to‑end)
### 8.1 Admin onboarding (first‑time setup)
1) Create org: name, timezone, week start.  
2) Define subspecialties.  
3) Build shift catalog: code, name, time window, recurrence (Mon–Sun), eligibility (requiredSubspecialty and/or allowAny and/or named allowlist).  
4) Configure policies: vacation (weeks/month, ranked options, max consecutive), FTE/PT bands and weekday balance cap, equivalence sets (for swaps), giveaway‑eligible shift types, and dollar values.  
5) Import roster (CSV): name, email, subspecialty, role, FTE.  
6) Invite users to complete profiles and submit vacation preferences.

### 8.2 Vacation intake & locking
- The system opens a submission window (e.g., for the next year, collected in Nov–Dec).  
- Each user submits **up to 3 ranked weeks per month**.  
- Reminders are sent until **lock**; once locked, the engine uses those preferences.  
- Chief can approve exceptions (e.g., >2 consecutive weeks).

### 8.3 Generation & review
- Admin chooses a window (month or year) and runs the engine.  
- Draft assignments appear with conflicts, fairness notes, and coverage warnings.  
- Admin manually adjusts any items (drag/drop or select user).  
- Publish → notify users; master and personal calendars reflect the final schedule.

### 8.4 Swap / giveaway / away
- **Swap:** requester selects one or many target instances (same type or within an allowed **equivalence set**); the system contacts targets sequentially; first acceptance wins, others auto‑close; approvals logged.  
- **Giveaway:** only allowed shift types (e.g., weekend call) are offered sequentially to an eligible pool.  
- **Away:** users mark dates they won’t accept offers for; the system excludes them.

### 8.5 Reporting & exports
- Monthly and YTD: per‑user shift counts and $ totals, plus group roll‑ups.  
- Exports: CSV (always), PDF (optional).  
- Audit: every key event (config change, generation seed, override, publish, swap/giveaway approval) is recorded.

---

## 9) Scheduling policies (high‑level)
### 9.1 Vacations & fairness
- **Quota:** 1 vacation week per calendar month.  
- **Choices:** up to 3 ranked options per month.  
- **Tie‑break:** **Fairness Ledger** (then seeded random).  
- **Fairness scoring (default):** 1st=+0, 2nd=+1, 3rd=+2, none=+3; when a fairness win is granted, the winner’s score decays by 1 next month.  
- **Consecutive limits:** allow two instances of two‑week runs; longer runs need Chief approval.

### 9.2 FTE & PT days
- FTE bands map to PT days/month (e.g., 60–69%→8, 70–79%→6, 80–89%→4, 90–99%→2, 100%→0).  
- **Weekday balance cap**: Mon or Fri PT cannot exceed any other weekday by more than 1 in the same month to prevent “every Friday off”.

### 9.3 Eligibility hierarchy
- **Hard rules** (never auto‑broken): requiredSubspecialty, namedEligibility.  
- **allowAny**: open pool (still respects availability).  
- **Even distribution**: per shift type, balance across eligible pool over the target window.

### 9.4 Coverage & holidays
- Default: every materialized shift instance must be filled; empty pools raise warnings.  
- Holidays: Ontario stats out of the box; premiums optional via config.

---

## 10) Engine overview (deterministic heuristic; solver‑ready)
1) **Materialize** shift instances from catalog & recurrence for the target window.  
2) **Resolve vacations** using Fairness Ledger; mark those weeks as unavailable.  
3) **Compute availability** from vacations, PT days (if enforced), and “away” dates.  
4) For each instance, **filter** by eligibility & availability to get the candidate pool.  
5) **Select assignee** by: lowest count for this shift type → lowest overall assignments → highest fairness score → seeded random.  
6) **Repair pass** to flag empty pools; admin override or config update may be required.  
7) **Audit** everything (including the seed) to allow reproducible re‑runs.

> Later, swap in OR‑Tools / MILP as an alternative “optimizer” backend behind the same API surface; keep heuristics as a fast fallback.

---

## 11) Configuration surface (what is dynamic)
- **Org:** name, timezone, weekStart.  
- **Subspecialties:** codes/names.  
- **Shift types:** code, name, start/end time, recurrence (Mon–Sun flags), eligibility (requiredSubspecialty, allowAny, namedEligibility).  
- **Vacation policy:** weeks/month, ranked options, max consecutive runs.  
- **FTE/PT policy:** bands (min/max FTE → PT days/month), weekday balance cap.  
- **Equivalence sets (swap‑only):** arrays of shift codes considered interchangeable.  
- **Giveaway eligible:** list of shift codes.  
- **Dollar values:** default and per‑shift‑type values, optional holiday/weekend premiums.  
- **Holidays:** region preset + per‑org overrides.  
- **Notifications:** email templates, throttles, reminder cadence.  
- **Calendar publishing:** ICS enablement; Google OAuth toggle per user.

---

## 12) Integrations & delivery
- **Email**: transactional provider (e.g., Resend/SendGrid/SES).  
- **Calendars**: ICS feeds for master/personal; Google Calendar push (one‑way).  
- **Exports**: CSV/PDF; webhooks for publish and swap‑accepted (future).

---

## 13) Security, privacy, and compliance
- **Data minimization**: no imaging or patient PHI—only user identities, roles, preferences, schedules.  
- **Org isolation**: all data scoped by org; APIs enforce RBAC + org boundaries.  
- **Audit**: immutable records for config changes, generation runs, overrides, approvals, publish actions.  
- **Secrets & storage**: encrypted at rest; least‑privilege keys; regular backups and tested restores.

---

## 14) Observability & admin tooling
- **Run logs**: generation seed, counts per shift type, conflicts, empty‑pool warnings.  
- **Dashboards**: submission progress, fill‑rates, fairness trends, workload balance.  
- **Diffs**: show changes between draft vs. published, and pre‑ vs. post‑override.  
- **Alerts**: failed emails, empty pools, missing eligibility, calendar sync errors.

---

## 15) KPIs & success criteria
- **Coverage**: 100% of required instances filled or explicitly waived.  
- **Fairness**: variance of key shift counts within target band (configurable).  
- **Vacation parity**: distribution of 1st‑choices approximately even by year‑end.  
- **Ops efficiency**: scheduler time reduced by >80%; swap turnaround reduced by >70%.  
- **Finance**: monthly/YTD payout exports accurate to the dollar given configured values.

---

## 16) Milestones (suggested)
- **M0** – Auth & tenant skeleton; config surface (1–2w).  
- **M1** – Shift catalog + eligibility + roster + vacation intake/lock (1–2w).  
- **M2** – Engine (instances, vacations, heuristic assignment, drafts, audits) (2–3w).  
- **M3** – Publish, emails, calendars, CSV exports (1–2w).  
- **M4** – Swaps/giveaways + away + dashboards (2–3w).  
- **M5** – $ values & payout reports; Google push; polish & QA (2–3w).

Timelines depend on team size and existing scaffolding (Next.js, Postgres, NextAuth baseline).

---

## 17) Risks & mitigations (high‑level)
- **Ambiguous rules** → Maintain a “Knowns/Assumptions/Unknowns” log; defaults must be explicit; require sign‑off before generation.  
- **Empty eligible pools** → Early validation; repair pass with clear warnings; admin override.  
- **Fairness disagreements** → Configurable scoring and decay; reports to visualize parity.  
- **Email fatigue** → Sequential offers (not spray‑and‑pray), throttles, digest options.  
- **Data correctness** → Strong audit, reproducible seeds, idempotent publishing.

---

## 18) Appendix: minimal JSON example (tenant config)
```json
{
  "org": {"name":"Main Radiology Group","timezone":"America/Toronto","weekStart":"MONDAY"},
  "subspecialties":[{"code":"NEURO"},{"code":"IR"},{"code":"BODY"},{"code":"CHEST"}],
  "vacationPolicy":{"weeksPerMonth":1,"rankedOptions":3,"maxConsecutiveWeeksPerYear":2},
  "ftePolicy":{"bands":[{"min":60,"max":69,"ptDaysPerMonth":8},{"min":70,"max":79,"ptDaysPerMonth":6},{"min":80,"max":89,"ptDaysPerMonth":4},{"min":90,"max":99,"ptDaysPerMonth":2},{"min":100,"max":100,"ptDaysPerMonth":0}],"weekdayBalanceCap":1},
  "shiftTypes":[
    {"code":"N1","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"NEURO"},
    {"code":"VASC","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"IR"},
    {"code":"XR_GEN","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"allowAny":true},
    {"code":"CT_US","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"BODY"},
    {"code":"MSK","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"BODY"},
    {"code":"BODY_MRI","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"BODY"},
    {"code":"CLIN_MA1","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"allowAny":true},
    {"code":"CLIN_STONEY","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"allowAny":true},
    {"code":"COIL","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"namedEligibility":["mem_inr_001"]},
    {"code":"CARDIAC_CT_MRI","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"CHEST"},
    {"code":"BODY_LATE_16_18","start":"16:00","end":"18:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"BODY"},
    {"code":"BODY_LATE_18_21","start":"18:00","end":"21:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"BODY"},
    {"code":"NEURO_LATE_16_18","start":"16:00","end":"18:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"NEURO"},
    {"code":"NEURO_LATE_18_21","start":"18:00","end":"21:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"requiredSubspecialty":"NEURO"},
    {"code":"WEEKEND_CALL","start":"00:00","end":"24:00","recur":{"sat":true,"sun":true},"allowAny":true}
  ],
  "equivalenceSets":[
    {"code":"NEURO_DAY_EQ1","members":["N1","N2","N3","N4"]},
    {"code":"NEURO_LATE_EQ1","members":["NEURO_LATE_16_18","NEURO_LATE_18_21"]},
    {"code":"BODY_LATE_EQ1","members":["BODY_LATE_16_18","BODY_LATE_18_21"]},
    {"code":"CLINIC_EQ1","members":["CLIN_MA1","CLIN_STONEY"]}
  ],
  "giveawayEligible":["WEEKEND_CALL"],
  "dollarValues":{"default":0,"byShiftType":{"WEEKEND_CALL":500},"holidayPremiums":{}}
}
```

---

**End of file.**
