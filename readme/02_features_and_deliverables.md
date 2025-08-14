# 02_features_and_deliverables.md
**Radiology Scheduling Platform — Features, Deliverables & Acceptance Criteria**  
Prepared: August 13, 2025 · Owner: Ali · Audience: Engineering, PM, QA

> This document defines *what* we are building end‑to‑end (config‑first, multi‑tenant radiology scheduling) and how we will verify it. It is technology‑agnostic where possible but notes key libraries/services we intend to use.

---

## A. Scope at a Glance (Feature Index)
1. Authentication & RBAC
2. Tenant Configuration (versioned, config‑first)
3. Roster Management
4. Shift Catalog & Eligibility
5. Vacation Intake & Locking
6. FTE/PT Policy & Weekday Balance
7. Schedule Generation Engine (Drafts)
8. Review, Overrides & Publish
9. Notifications & Email
10. Calendar Publishing (Google/ICS)
11. Swaps, Giveaways & Away Windows
12. Dollar Values & Reporting
13. Dashboards, Metrics & Audit Logs
14. Integrations & Webhooks
15. Security, Privacy & Compliance
16. Non‑Functional Requirements (NFRs)
17. Deliverables Checklist

---

## 1) Authentication & RBAC
**Goal:** Secure org‑scoped access for Super Admin, Admin (scheduler), Chief, Radiologist/Fellow/Resident.

**Requirements**
- Email/OAuth sign‑in using **Auth.js (NextAuth)** with session-based RBAC.
- Roles: `SUPER_ADMIN`, `ADMIN`, `CHIEF`, `RAD` (fellows/residents are `RAD` with flags).
- All objects (config, roster, schedules) are **org‑scoped**; enforce on API and DB queries.
- Invite flow: Admin loads roster (name/email/role/subspecialty/FTE), system sends invites.

**Acceptance Criteria**
- Users in different orgs cannot access each other’s data.
- Role gates: only Admin/Chief can publish schedules; only Admin edits tenant config.
- Session revocation and passwordless/OAuth flows operate reliably.
- Audit events are recorded for sign‑in/out, invites, and role changes.

---

## 2) Tenant Configuration (Versioned, Config‑First)
**Goal:** All group rules are declarative and versioned (no hardcoding).

**Config Areas**
- **Org:** timezone, weekStart.
- **Subspecialties:** e.g., NEURO, IR, BODY, CHEST, INR.
- **Shift Types:** code, name, start/end, recurrence (Mon–Sun flags), **eligibility** (`requiredSubspecialty` | `allowAny` | `named[]`), `minStaff`.
- **Vacation Policy:** weeksPerMonth (default 1), rankedOptions (default 3), maxConsecutiveWeeksPerYear (default 2), intake window and lock dates.
- **FTE/PT Policy:** FTE bands → PT days/month; weekday balance cap; whether users may choose PT days.
- **Equivalence Sets (swap‑only):** arrays of shift codes that can substitute for swaps.
- **Giveaway‑Eligible Shifts:** list of shift codes (e.g., weekend call).
- **Dollar Values & Premiums:** default per shift; holiday/weekend/night premiums.
- **Holidays:** region preset (Ontario) + overrides.
- **Notifications:** reminder cadence and templates.

**Versioning**
- Every change produces a **config version** with JSON diff, author, timestamp, and optional note.
- Rollback: Admin can restore an older version (new version created with prior state).

**Acceptance Criteria**
- Schema validation prevents contradictory flags (e.g., `allowAny` + `requiredSubspecialty`).
- Diff view shows exactly what changed; rollback creates a new version entry.
- Test harness validates sample config and reports errors before publish.

---

## 3) Roster Management
**Goal:** Maintain members and their attributes used by the engine and workflows.

**Requirements**
- CSV import & UI create/edit for: name, email, role, subspecialty (one primary), FTE %, fellow/resident flags, Google Calendar address.
- Track leaves/temporary unavailability.

**Acceptance Criteria**
- Upload rejects malformed CSV and pinpoints row/column issues.
- Roster changes immediately affect candidate pools in drafts (after re‑materialization).

---

## 4) Shift Catalog & Eligibility
**Goal:** Precisely model shift types and who may cover them.

**Requirements**
- Define shift types with code/name/hours/recurrence.
- Eligibility modes:
  - **Required subspecialty** (e.g., N1–N4 → NEURO only; VASC → IR only).
  - **Allow any** (e.g., XR general; clinics like MA1, Stoney Creek).
  - **Named allowlist** (e.g., COIL → specific INR person).
- Optional `minStaff` > 1 for multi‑coverage shifts.
- Late blocks (e.g., 16–18, 18–21) modeled as distinct shift types.

**Acceptance Criteria**
- Recurrence renders correct number of instances in a test month.
- Eligibility filters produce the expected candidate pools.
- Empty candidate pools are flagged before generation and after any roster change.

---

## 5) Vacation Intake & Locking
**Goal:** Collect ranked week preferences and enforce fair allocation.

**Requirements**
- For each month, each user can submit up to **3 ranked weeks**.
- Intake window with email reminders; Admin can lock.
- Chief can approve exceptions (e.g., >2 consecutive weeks total per year).

**Fairness Ledger (policy default)**
- Scoring: 1st=+0, 2nd=+1, 3rd=+2, none=+3; decay −1 next month (floors at 0).
- Tie‑breaks: lower score wins; if tied, seeded random; ledger recorded.

**Acceptance Criteria**
- Submissions are blocked after lock, unless Admin reopens.
- Engine respects locked preferences and ledger logic; audit shows winners/losers per conflict.
- Reports show parity of 1st‑choice wins by year‑end.

---

## 6) FTE/PT Policy & Weekday Balance
**Goal:** Automatic PT day accounting mapped from FTE, with weekday distribution guardrails.

**Requirements**
- FTE bands (e.g., 60–69, 70–79, 80–89, 90–99, 100) map to PT days/month (e.g., 8,6,4,2,0).
- Weekday balance cap (e.g., Mon/Fri PT cannot exceed other weekdays by >1 per month).
- Option to let users propose PT days; system enforces caps.

**Acceptance Criteria**
- Monthly PT day budget per user is enforced and visible.
- Balance cap violations are prevented or require Admin override.
- Availability derived from vacations + PT days is correctly applied in drafts.

---

## 7) Schedule Generation Engine (Drafts)
**Goal:** Materialize shift instances and assign eligible, available users fairly and consistently.

**Requirements**
- Materialize all instances for the target window (month or year).
- **Hard constraints (never auto‑broken):**
  - Coverage for each instance; eligibility rules (required/named); user availability (vacation/PT/away).
- **Soft objectives:**
  - Fairness by shift type (even distribution among eligible pool).
  - Vacation preference satisfaction (favor 1st choices).
  - Minimize consecutive undesirable shifts if configured.
- **Engine architecture:**
  - Default **combinatorial optimization (CP‑SAT)** back‑end.
  - Heuristic/repair pass to suggest fixes for infeasible cases.
- Deterministic seeds and full audit of decisions.

**Acceptance Criteria**
- For a realistic month (20–30 shift types, 30+ users): draft created under target time (see NFRs).
- No hard‑constraint violations in a published schedule (coverage/eligibility/availability).
- Fairness variance stays within configured thresholds (per shift type).

---

## 8) Review, Overrides & Publish
**Goal:** Keep humans in the loop; enable safe edits and publishing with traceability.

**Requirements**
- Draft board view: filter by date, shift type, subspecialty, person.
- Drag‑and‑drop/manual override with immediate re‑validation.
- Publish flow with Chief confirmation (if enabled).
- Unpublish & republish with diffs; downstream calendars and notifications update.

**Acceptance Criteria**
- Overrides are validated (eligibility/availability) and blocked if illegal, unless Admin forces with reason.
- Diff shows exactly what changed since last publish.
- Audit stores who overrode what and why (free‑text memo).

---

## 9) Notifications & Email
**Goal:** Transactional communications for invites, reminders, and swap/giveaway offers.

**Requirements**
- Pluggable provider (Resend/SendGrid). Templates per event with variable interpolation.
- Sequential offers: for swaps/giveaways, notify targets one‑by‑one until acceptance or timeout.
- Email throttling; daily digest for pending actions (optional).

**Acceptance Criteria**
- Emails deliver with correct personalization; bounces logged.
- Sequential offer logic stops once a recipient accepts; others auto‑close with a courtesy note.
- Admin‑configurable cooldowns and retries.

---

## 10) Calendar Publishing (Google/ICS)
**Goal:** Master and personal calendars always reflect the latest published schedule.

**Requirements**
- **Google Calendar (one‑way):** create/update/delete events on each user’s calendar with user consent (OAuth) or to a group‑owned calendar; store event IDs for future updates.
- **ICS feeds:** per‑user and master ICS URLs (read‑only); reflect changes immediately on republish; include holiday markers if configured.

**Acceptance Criteria**
- Event creates/updates/deletes propagate correctly; orphaned events are cleaned up on republish.
- ICS downloads validate as RFC‑5545; major clients can subscribe and display updates.
- Users who disconnect Google stop receiving updates but keep ICS access if enabled.

---

## 11) Swaps, Giveaways & Away Windows
**Goal:** Reduce email chaos; make swaps safe, auditable, and eligibility‑aware.

**Requirements**
- **Swap**: requester picks one or multiple compatible instances (same shift type or same **equivalence set**); targeted recipients receive sequential offers; owner approval required.
- **Giveaway**: only for configured shift types (e.g., weekend call); eligibility enforced; owner approval optional per policy.
- **Away**: users set dates to suppress inbound offers.

**Acceptance Criteria**
- System prevents offers to ineligible users or during their away/vacation/PT days.
- First acceptance wins; all pending offers auto‑close with notification.
- Full trail of who requested, who accepted, and when; schedule updates + calendar sync occur automatically.

---

## 12) Dollar Values & Reporting
**Goal:** Produce bookkeeper‑ready outputs: counts and dollar totals per user, monthly and YTD.

**Requirements**
- Per‑shift $ mapping; premiums (holiday/weekend/night) optional.
- Monthly & YTD per‑user summaries; group roll‑ups; CSV export (PDF optional).
- Adjustment entries for manual corrections with memo.

**Acceptance Criteria**
- Reports match the published schedule; totals reconcile after swaps/giveaways.
- CSV columns are stable and documented; timezones handled consistently.
- Any manual adjustment is logged and auditable.

---

## 13) Dashboards, Metrics & Audit Logs
**Goal:** Visibility for admins; explainability for the group.

**Requirements**
- Submission progress (vacations/PT), uncovered/empty‑pool warnings, fairness variance, distribution per shift type.
- Run logs: engine seed, runtime, objective values, infeasibility notes.
- Audit: config versions, roster edits, overrides, publish/unpublish, swap/giveaway actions.

**Acceptance Criteria**
- Key metrics available per month and year; exportable.
- Every impactful action has an audit record with actor, timestamp, payload/diff.

---

## 14) Integrations & Webhooks
**Goal:** Clean boundaries for outbound data.

**Requirements**
- Outbound webhooks on publish, swap accepted, and month‑end close.
- Retries with exponential backoff and signed payloads.
- Admin UI to rotate secrets and view delivery logs.

**Acceptance Criteria**
- Consumers can re‑try idempotently; signature verification examples documented.
- Failed deliveries surface clearly with re‑send controls.

---

## 15) Security, Privacy & Compliance
**Goal:** Least privilege; org isolation; no PHI.

**Requirements**
- Encrypt secrets; rotate keys; scoped API tokens.
- Strict org scoping on every read/write path.
- Backups and tested restores; immutable audit logs.
- PII kept to minimum (name, email, role, subspecialty, FTE, schedules).

**Acceptance Criteria**
- Pen test checklist passes; basic threat model reviewed.
- Backup/restore drills succeed; audit log is tamper‑evident.

---

## 16) Non‑Functional Requirements (NFRs)
**Performance**
- Generate a **2‑month** draft for 30+ rads / 20–30 shift types in **≤ 2 minutes** on our target instance.
- **Year‑long** generation with the same parameters in **≤ 5 minutes** or with an optimality cap (return best‑found).

**Reliability**
- Publish is idempotent; re‑publishing produces consistent calendars/ICS.
- Email provider fails over (switch provider) without code changes.

**Scalability**
- Org data partitioned; background workers for engine runs and calendar updates.
- Pagination and server‑side filtering for large rosters/schedules.

**Usability**
- All destructive actions require confirmation and show a preview/diff.
- Empty‑pool and policy conflict warnings explain the cause and suggest next steps.

---

## 17) Deliverables Checklist
**Backend**
- Postgres schema & migrations for orgs, config versions, roster, shift types, instances, drafts, publishes, swaps/giveaways, reports, audits.
- Engine service (CP‑SAT back‑end + heuristic repair). Seeds, logs, metrics.
- Email provider abstraction (Resend/SendGrid adapters).
- Calendar adapters (Google REST, ICS generator).
- Webhooks service with signature & retries.

**Frontend**
- Admin: config screens, roster import, vacation intake monitor, engine run + draft board, review/override, publish/unpublish.
- User: profile, vacation/PT submissions, swaps/giveaways, away windows, personal calendar.
- Reports UI and CSV export; dashboards & audits.

**QA & Ops**
- Test fixtures for a synthetic tenant (30+ members, 20–30 shift types).
- Load test for engine runtime targets; calendar/ICS validation suite.
- Runbooks for incident response; feature flags for risky paths.

---

## Appendix: Example Config (abbreviated)
```json
{
  "org": {"name":"Main Radiology Group","timezone":"America/Toronto","weekStart":"MONDAY"},
  "subspecialties":[{"code":"NEURO"},{"code":"IR"},{"code":"BODY"},{"code":"CHEST"},{"code":"INR"}],
  "vacationPolicy":{"weeksPerMonth":1,"rankedOptions":3,"maxConsecutiveWeeksPerYear":2},
  "ftePolicy":{"bands":[{"min":60,"max":69,"ptDaysPerMonth":8},{"min":70,"max":79,"ptDaysPerMonth":6},{"min":80,"max":89,"ptDaysPerMonth":4},{"min":90,"max":99,"ptDaysPerMonth":2},{"min":100,"max":100,"ptDaysPerMonth":0}],"weekdayBalanceCap":1},
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
