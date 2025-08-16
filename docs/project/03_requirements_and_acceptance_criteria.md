# 03_requirements_and_acceptance_criteria.md
**Radiology Scheduling Platform — System Requirements, Acceptance Criteria & Definition of Done (DoD)**  
Prepared: August 13, 2025 · Owner: Ali · Audience: Engineering, PM, QA

> This document operationalizes the project into *testable requirements* and a *Definition of Done*. It complements `01_project_overview.md` and `02_features_and_deliverables.md` and is the single source of truth for QA sign‑off.

---

## 0) Scope & Dependencies
- **Scope:** Multi‑tenant, config‑first scheduling for medical groups (radiology focus), year‑long generation, swaps/giveaways, vacation/FTE policies, reports, Google/ICS publishing, email notifications, and full auditability.
- **Core dependencies (planned):** Next.js, Postgres, Auth.js (RBAC), email provider (Resend/SendGrid), Google Calendar API + ICS generator, OR‑Tools CP‑SAT engine, Vercel AI SDK (optional AI rule‑builder agent).

---

## 1) Functional Requirements & Acceptance Criteria (by area)

### 1.1 Authentication & RBAC
**Requirements**
1. Users authenticate via Auth.js providers and are scoped to exactly one org (tenant).  
2. Roles: `SUPER_ADMIN`, `ADMIN`, `CHIEF`, `RAD` (fellows/residents flagged under `RAD`).  
3. Only `ADMIN` can edit tenant configuration; `ADMIN`/`CHIEF` can publish; `RAD` cannot view other users’ private data beyond what a published schedule reveals.  
4. Invitation flow creates pending users and emails invite links.

**Acceptance Criteria**
- Attempting to access another org’s resources returns 403 and is logged.  
- Role‑gated endpoints and pages are hidden/disabled for unauthorized roles.  
- Audit entries exist for sign‑in/out, invites, role changes (actor, target, IP).

---

### 1.2 Tenant Configuration (Versioned, Config‑First)
**Requirements**
1. Config schema covers: org, subspecialties, shift types (code, hours, recurrence), eligibility (`requiredSubspecialty`/`allowAny`/`named[]`), min staff, vacation policy, FTE→PT mapping & weekday cap, equivalence sets (swap‑only), giveaway‑eligible, dollar values/premiums, holidays, notifications.  
2. Changes create a new **version** with JSON diff and comment.  
3. Validation:  
   - Mutually exclusive flags (e.g., `allowAny` cannot co‑exist with `requiredSubspecialty`).  
   - All `named[]` members must exist in roster and be active.  
   - Recurrence must produce ≥1 instance per active period or warn.  
   - `minStaff` ≥1 and ≤ size of eligible pool.
4. Rollback: restoring past config creates a new version that equals the restored state.

**Acceptance Criteria**
- Invalid submissions surface per‑field messages and block save.  
- Diff view exactly lists changed keys & values.  
- Restored version appears at the top of the history with a backlink to the source.  
- Engine cannot run unless the latest config passes validation.

---

### 1.3 Roster Management
**Requirements**
1. CSV import (name, email, role, subspecialty, FTE%, flags for fellow/resident, calendar email).  
2. UI add/edit/remove; soft‑delete for leavers with effective dates.  
3. Temporary unavailability windows (beyond vacations).

**Acceptance Criteria**
- CSV importer shows row/column errors and sample fixes; partial import allowed with user confirmation.  
- Removing a member who holds future assignments forces reassignment or marks as a warning.  
- Unavailability windows exclude members from candidate pools and swap targets.

---

### 1.4 Shift Catalog & Eligibility
**Requirements**
1. Define shift types with time window and day‑of‑week recurrence (Mon–Sun flags).  
2. Eligibility modes supported: required subspecialty, allow any, named allowlist.  
3. Multi‑coverage via `minStaff` (e.g., 2 IR on certain days).  
4. Late blocks (e.g., 16:00–18:00, 18:00–21:00) modeled as separate shift types.

**Acceptance Criteria**
- Calendar preview shows correct number of instances for a given month.  
- Candidate pool for a shift (given roster) matches eligibility and availability filters.  
- Empty candidate pools are flagged pre‑generation with specific causes and remedies.

---

### 1.5 Vacation Intake & Locking
**Requirements**
1. Per month, each user may submit up to **3 ranked vacation weeks** (1st/2nd/3rd).  
2. Intake window, reminders, and **lock**; submissions blocked post‑lock unless reopened.  
3. Chief override for exceptions (e.g., >2 consecutive weeks/year).  
4. **Fairness Ledger**: default scoring 1st=+0, 2nd=+1, 3rd=+2, none=+3 with monthly decay −1 (floor 0).

**Acceptance Criteria**
- After lock, new/edited preferences are rejected unless Admin reopens.  
- Engine audit includes: conflicts, tie‑breaks, who got which choice, and current ledger scores.  
- Year‑to‑date report shows distribution of 1st‑choice wins per user and variance band vs. target.

---

### 1.6 FTE/PT Policy & Weekday Balance
**Requirements**
1. FTE bands → PT days/month (e.g., 60–69→8, 70–79→6, 80–89→4, 90–99→2, 100→0).  
2. **Weekday balance cap**: Mon/Fri PT cannot exceed any other weekday by >1 per month.  
3. Optionally allow users to propose PT days; system enforces cap and remaining budget.

**Acceptance Criteria**
- UI shows remaining PT day budget and prevents over‑allocation.  
- Balance cap is enforced; violations show actionable hints (e.g., “Pick Tue/Thu to restore balance”).  
- Availability derived from vacations + PT + unavailability windows is correct in drafts.

---

### 1.7 Schedule Generation Engine (Drafts)
**Requirements**
1. Materialize all shift instances for selected window (month or year).  
2. **Hard constraints (never auto‑broken):** coverage (min staff), eligibility (required/named), availability (vacation/PT/away/unavailability).  
3. **Soft objectives:**  
   - Even distribution per shift type among eligible pool (minimize variance).  
   - Maximize satisfaction of 1st‑choice vacations subject to fairness ledger.  
   - Optional penalties: consecutive late nights/weekend concentration, etc.  
4. **Solver:** CP‑SAT back‑end with deterministic seeds and time/optimality cap.  
5. **Repair pass:** heuristic suggestions if infeasible; surface causes (e.g., empty pools).  
6. **Audit:** persist seed, objective values, and decision notes per conflict.

**Acceptance Criteria**
- Drafts for 2 months (30+ rads, 20–30 shift types) produce under the performance SLOs (see §3).  
- Published schedules contain **no** violations of hard constraints.  
- Fairness metrics per shift type fall within configured thresholds; exceptions require Chief waiver and are logged.

---

### 1.8 Review, Overrides & Publish
**Requirements**
1. Board view with filters by date, shift type, subspecialty, person.  
2. Drag‑drop/manual override with real‑time re‑validation.  
3. Publish requires Admin and (optionally) Chief confirmation.  
4. Unpublish & republish support with diffs and rollback.

**Acceptance Criteria**
- Illegal overrides are blocked (unless Admin forces with memo); forced overrides get a red audit flag.  
- Diff view highlights additions/removals/moves; republish updates calendars consistently.  
- All publish/unpublish actions are timestamped and attributed.

---

### 1.9 Notifications & Email
**Requirements**
1. Transactional email: invites, reminders, swap/giveaway offers, accept/decline, digest.  
2. Sequential offer logic: contact targets one‑by‑one until acceptance/timeout.  
3. Throttling and daily digest preferences per user.

**Acceptance Criteria**
- Personalization tokens rendered correctly; bounces & failures logged.  
- Once a recipient accepts, all other pending offers auto‑close with a courtesy note.  
- Admin can adjust cooldowns; logs show the exact sequence of offers and outcomes.

---

### 1.10 Calendar Publishing (Google + ICS)
**Requirements**
1. **Google (one‑way):** create/update/delete events on each user’s calendar (OAuth or group calendar) and store event IDs for diffs.  
2. **ICS feeds:** master + per‑user read‑only feeds; immediate reflection after publish.  
3. Timezone correctness and DST handling; holiday tags if configured.

**Acceptance Criteria**
- Event lifecycle (create/update/delete) is idempotent; no orphaned events after republish.  
- ICS validates as RFC‑5545; major clients (Google/Apple/Outlook) display correctly.  
- Users can disconnect Google and still use ICS; reconnect resumes deltas (no duplicates).

---

### 1.11 Swaps, Giveaways & Away Windows
**Requirements**
1. **Swap:** request one/many compatible instances (same shift type or within an **equivalence set**); sequential offers; owner approval required.  
2. **Giveaway:** allowed only for configured shift types (e.g., weekend call); eligibility enforced; owner approval optional by policy.  
3. **Away:** users set dates to suppress inbound offers; system honors this for targeting.

**Acceptance Criteria**
- Ineligible or unavailable targets are never contacted.  
- First acceptance wins; schedule and calendars update; pending offers close.  
- Full audit trail shows requester, recipients (ordered), acceptor, timestamps, and any approvals.

---

### 1.12 Dollar Values & Reporting
**Requirements**
1. Map $ per shift type and optional premiums (holiday/weekend/night).  
2. Monthly and YTD per‑user summaries; group roll‑ups; CSV (PDF optional).  
3. Manual adjustment entries (positive/negative) with memo; adjustments are auditable.

**Acceptance Criteria**
- Reports reconcile to the published schedule after swaps/giveaways.  
- CSV columns are stable, documented, and timezone consistent.  
- Any adjustment is visible in per‑user history and roll‑ups with who/why/when.

---

### 1.13 Dashboards, Metrics & Audit
**Requirements**
1. Submission progress (vacations/PT), fairness variance, shift distribution, empty‑pool warnings.  
2. Engine run logs: seed, runtime, objective values, infeasibility reasons.  
3. Immutable audit for config versions, roster edits, overrides, publish/unpublish, swaps/giveaways, calendar sync events.

**Acceptance Criteria**
- Admin can export metrics; audit entries are searchable by actor, entity, and date range.  
- No privileged action lacks an audit record.

---

## 2) Non‑Functional Requirements (NFRs)

### 2.1 Performance
- 2‑month draft (30+ rads, 20–30 shift types): **≤ 2 minutes**.  
- Year‑long generation: **≤ 5 minutes** or early stop at optimality cap with “best‑found so far”.  
- Calendar publish for a typical month: **≤ 60 seconds** to reconcile deltas for 30+ users.

### 2.2 Reliability & Resilience
- Publish is idempotent; reruns converge to the same external state (Google + ICS).  
- Email provider is abstracted; switching providers requires no code changes beyond config.  
- Backups daily; restore tested monthly; engine jobs resumable after process crash.

### 2.3 Security & Privacy
- Org isolation in every query; least‑privilege service keys; all secrets encrypted at rest.  
- PII minimized (name, email, role, subspecialty, FTE, schedules); **no imaging/PHI** stored.  
- OAuth scopes only for necessary calendar permissions; user‑level revocation respected.  
- Immutable audit log with tamper‑evident checksums.

### 2.4 Usability
- Config screens provide inline validation, examples, and preview of materialized instances.  
- Warnings are explanatory and suggest concrete next steps.  
- Diff previews before destructive actions; undo where feasible.

---

## 3) Definition of Done (DoD)

### 3.1 Config & Roster
- Schema validation with full error surfacing; versioning & rollback work end‑to‑end.  
- Roster import supports CSV with robust error reporting; unavailability honored in engine.

### 3.2 Engine
- Deterministic seeds produce reproducible drafts (given same inputs).  
- No hard‑constraint violations in published schedules; fairness targets met or waived by Chief with reason.  
- Repair pass explains infeasibilities with actionable hints for Admin.

### 3.3 Workflows
- Vacation intake/lock, PT day budgeting, swaps/giveaways/away windows—each has positive & negative tests in QA.  
- Sequential offer logic proven with simulated inboxes; first acceptance cancels others.

### 3.4 Publishing
- Google and ICS paths validated with create/update/delete and republish cycles; no duplicate or orphaned events.  
- Timezone & DST correctness tested with synthetic events around transition boundaries.

### 3.5 Reporting
- Monthly & YTD CSVs reconcile to assignments; adjustment entries update totals immediately and are fully auditable.

### 3.6 Observability
- Dashboards show KPIs; run logs and audits searchable; alerts for empty pools and failing emails.

### 3.7 Docs & Runbooks
- Admin and User guides published; Incident runbook covers failed engine jobs, email bounces, and calendar sync errors.

---

## 4) Test Data & Fixtures

### 4.1 Synthetic Tenant
- **Roster:** 32 members with subspecialties `{NEURO, IR, BODY, CHEST, INR}`, FTE bands across 60–100%.  
- **Shift catalog:** 24 shift types including day, late blocks, weekend call, clinics, named eligibility (INR).  
- **Policies:** 1 week/month vacations with 3 choices; fairness ledger enabled; PT weekday cap; giveaway only for weekend call.  
- **Dollar values:** weekend call = $500; others = $0; no holiday premiums (baseline).

### 4.2 Files
- `/fixtures/roster.csv`, `/fixtures/shift_types.csv`, `/fixtures/config.json` (passes validation).  
- `/fixtures/vacation_prefs.csv` (3 months) with collisions designed to test tie‑break fairness.

---

## 5) Edge Cases & Error Handling
- Empty candidate pools due to over‑constrained eligibility → pre‑run warnings + suggested fixes.  
- Named eligibility referencing inactive users → validation error with quick‑fix link.  
- Calendar sync errors (403, 404, rate limits) → retry with backoff; surface human‑readable remediation.  
- Email bounces → suppress future sends to that address; notify Admin.  
- Swaps with mid‑flight roster changes → re‑validate before apply; cancel if invalid.

---

## 6) Acceptance Test Matrix (excerpt)
| Area | Scenario | Expected |
|---|---|---|
| Config Validation | `allowAny` + `requiredSubspecialty` set | Block save; show field‑level error |
| Vacation Tie‑break | Two users choose same week as 1st; equal ledger | Seeded random; ledger recorded; audit shows outcome |
| PT Weekday Cap | User picks 3 Fridays, 0 Tue | Block with hint to pick Tue/Thu; show remaining budget |
| Engine Hard Rules | Assign user to N1 (NEURO) but user=BODY | Assignment blocked; repair suggests eligible NEURO |
| Publish Idempotency | Republish same draft | No new Google/ICS events; no duplicates |
| Swap Flow | Requester targets 3 users; 2 decline, 3rd accepts | Auto‑close remaining offers; audit trail complete |

---

## Appendix A — Example Config (abbrev)
```json
{
  "org": {"name":"Main Radiology Group","timezone":"America/Toronto","weekStart":"MONDAY"},
  "subspecialties":[{"code":"NEURO"},{"code":"IR"},{"code":"BODY"},{"code":"CHEST"},{"code":"INR"}],
  "vacationPolicy":{"weeksPerMonth":1,"rankedOptions":3,"maxConsecutiveWeeksPerYear":2},
  "ftePolicy":{"bands":[{"min":60,"max":69,"ptDaysPerMonth":8},{"min":70,"max":79,"ptDaysPerMonth":6},{"min":80,"max":89,"ptDaysPerMonth":4},{"min":90,"max":99,"ptDaysPerMonth":2},{"min":100,"ptDaysPerMonth":0}],"weekdayBalanceCap":1},
  "shiftTypes":[
    {"code":"N1","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"eligibility":{"requiredSubspecialty":"NEURO"}},
    {"code":"VASC","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"eligibility":{"requiredSubspecialty":"IR"}},
    {"code":"XR_GEN","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"eligibility":{"allowAny":true}},
    {"code":"COIL","start":"08:00","end":"16:00","recur":{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true},"eligibility":{"named":["mem_inr_001"]}}
  ],
  "equivalenceSets":[{"code":"NEURO_DAY_EQ","members":["N1","N2","N3","N4"]}],
  "giveawayEligible":["WEEKEND_CALL"],
  "dollarValues":{"default":0,"byShiftType":{"WEEKEND_CALL":500}}
}
```

---

## Appendix B — ICS Event Example (abbrev)
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Radiology Scheduler//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:9f9c4d21-93c8-43c5-8f6a-abc123@example.com
DTSTAMP:20250101T120000Z
DTSTART;TZID=America/Toronto:20250106T080000
DTEND;TZID=America/Toronto:20250106T160000
SUMMARY:N1 — Neuro (E. Johnson)
DESCRIPTION:Shift N1 assigned by Radiology Scheduler
END:VEVENT
END:VCALENDAR
```
