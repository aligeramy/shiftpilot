# 05_data_model_and_schema.md
**Radiology Scheduling Platform — Data Model & Database Schema (PostgreSQL)**  
Prepared: August 13, 2025 · Owner: Ali · Audience: Backend, Infra, QA

> Goal: a **config‑first**, **multi‑tenant**, **auditable** schema that supports year‑long schedule generation, fairness & vacation logic, swaps/giveaways, $‑tally reporting, and calendar/email integrations — while enforcing **row‑level tenant isolation** and deterministic engine replays.

---

## 0) Design Principles
- **Multi‑tenant isolation by default**: every row carries `tenant_id`; all queries are scoped; enable **RLS** (Row‑Level Security) with restrictive default policies.  
- **Config‑first**: tenant‑versioned JSON config drives shift catalog, eligibility, fairness targets, and policy knobs (no hardcoding).  
- **Immutability & auditability**: append‑only *events* for critical operations (config versions, engine runs, publications, swaps). Edits create new versions rather than overwriting.  
- **Solver‑friendly**: separate *static catalogs* (shift types, equivalence) from *materialized instances* (per date), and keep all constraints, costs, and availability resolvable to integer domains for CP‑SAT.  
- **Idempotent publishing**: external side‑effects (Google Calendar, ICS, email) store durable correlation keys to compute diffs safely.  
- **Performance**: narrow hot paths with covering indexes; pre‑materialize shift instances for the run window; avoid CROSS JOIN explosions; prefer INT / SMALLINT for dense FK columns.

---

## 1) Entity Overview (ER — high level)
- **tenants** ⟶ own many **users**, **config_versions**, **shift_types**, **equivalence_sets**, **holidays**, **engine_runs**, **publications**, **reports**.  
- **users** (incl. admins/chief/rads/fellows) ⟶ one **rad_profile** (FTE, subspecialty), many **vacation_prefs**, **avail_windows**, **assignments**, **swap_requests**.  
- **shift_types** ⟶ many **shift_instances** (materialized by date) ⟶ many **assignments**.  
- **equivalence_sets** ⟶ many **equivalence_members** (shift type codes).  
- **engine_runs** produce **drafts** ⟶ **publications** snapshot to calendars & reports.  
- **calendar_links** map internal assignments to external event IDs.  
- **audit_log** captures who/what/when for sensitive actions.

---

## 2) Tables (DDL‑style spec)

> Notation: PK 🔑, FK 🔗, IX(index), C(check), U(unique), RLS(row‑level security). Types are PostgreSQL.

### 2.1 tenancy & users
```sql
CREATE TABLE tenants (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Toronto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('SUPER_ADMIN','ADMIN','CHIEF','RAD');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email CITEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'RAD',
  calendar_email CITEXT,                     -- target for Google/ICS
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)                  -- one account per tenant/email
);
CREATE INDEX ix_users_tenant_role ON users(tenant_id, role);
```

### 2.2 roster & specialty
```sql
CREATE TYPE subspecialty AS ENUM ('NEURO','IR','BODY','MSK','CHEST','INR');

CREATE TABLE rad_profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  subspecialty subspecialty NOT NULL,
  fte_percent SMALLINT NOT NULL,             -- 60..100
  is_fellow BOOLEAN NOT NULL DEFAULT FALSE,
  is_resident BOOLEAN NOT NULL DEFAULT FALSE,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to   DATE
);
```

### 2.3 tenant config (versioned, JSON)
```sql
CREATE TABLE config_versions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  version_no INT NOT NULL,                   -- 1,2,3...
  author_user_id BIGINT REFERENCES users(id),
  payload JSONB NOT NULL,                    -- authoritative config JSON
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, version_no)
);
```

### 2.4 shift catalog & eligibility
```sql
CREATE TABLE shift_types (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,                        -- e.g., 'N1','XR_GEN'
  label TEXT NOT NULL,
  start_time TIME,                           -- null if all_day
  end_time   TIME,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  recur_mon BOOLEAN NOT NULL DEFAULT FALSE,
  recur_tue BOOLEAN NOT NULL DEFAULT FALSE,
  recur_wed BOOLEAN NOT NULL DEFAULT FALSE,
  recur_thu BOOLEAN NOT NULL DEFAULT FALSE,
  recur_fri BOOLEAN NOT NULL DEFAULT FALSE,
  recur_sat BOOLEAN NOT NULL DEFAULT FALSE,
  recur_sun BOOLEAN NOT NULL DEFAULT FALSE,
  min_staff SMALLINT NOT NULL DEFAULT 1,     -- coverage requirement
  eligibility JSONB NOT NULL,                -- {requiredSubspecialty|allowAny|named[]}
  dollars_cents INT NOT NULL DEFAULT 0,      -- base $ (in cents)
  giveaway_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (tenant_id, code)
);
CREATE INDEX ix_shift_types_tenant ON shift_types(tenant_id);
```

### 2.5 equivalence (for swaps & fairness buckets)
```sql
CREATE TABLE equivalence_sets (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,                        -- e.g., 'NEURO_DAY_EQ'
  label TEXT,
  UNIQUE (tenant_id, code)
);
CREATE TABLE equivalence_members (
  set_id BIGINT NOT NULL REFERENCES equivalence_sets(id) ON DELETE CASCADE,
  shift_code TEXT NOT NULL,                  -- references shift_types.code (by tenant)
  PRIMARY KEY (set_id, shift_code)
);
```

### 2.6 holidays (per tenant)
```sql
CREATE TABLE holidays (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  holiday_date DATE NOT NULL,
  code TEXT NOT NULL,                        -- e.g., 'THANKSGIVING'
  name TEXT NOT NULL,
  PRIMARY KEY (tenant_id, holiday_date)
);
```

### 2.7 policies (vacation, FTE/PT)
```sql
CREATE TABLE fte_bands (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  min_pct SMALLINT NOT NULL,
  max_pct SMALLINT NOT NULL,
  pt_days_per_month SMALLINT NOT NULL,
  PRIMARY KEY (tenant_id, min_pct, max_pct)
);
CREATE TABLE vacation_policy (
  tenant_id BIGINT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  weeks_per_month SMALLINT NOT NULL DEFAULT 1,
  ranked_options SMALLINT NOT NULL DEFAULT 3,
  max_consecutive_weeks_per_year SMALLINT NOT NULL DEFAULT 2
);
```

### 2.8 preferences, availability & fairness
```sql
CREATE TYPE pref_rank AS ENUM ('P1','P2','P3');

CREATE TABLE vacation_prefs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,                       -- first day of month
  week_start DATE NOT NULL,                  -- Monday of chosen week
  rank pref_rank NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id, month, rank)
);

-- General availability windows (away, PT day, other)
CREATE TYPE avail_kind AS ENUM ('AWAY','PT_DAY','OTHER');
CREATE TABLE avail_windows (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at   TIMESTAMPTZ NOT NULL,
  kind avail_kind NOT NULL,
  note TEXT
);

-- Fairness ledger accumulates tie-break disadvantages (lower is better)
CREATE TABLE fairness_ledger (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  score SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, user_id, month)
);
```

### 2.9 materialization & engine runs
```sql
CREATE TABLE shift_instances (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shift_type_id BIGINT NOT NULL REFERENCES shift_types(id) ON DELETE CASCADE,
  on_date DATE NOT NULL,
  start_ts TIMESTAMPTZ,
  end_ts   TIMESTAMPTZ,
  required_staff SMALLINT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'DRAFT',      -- DRAFT|PUBLISHED|CANCELLED
  -- one instance per day/shift type
  UNIQUE (tenant_id, shift_type_id, on_date)
);
CREATE INDEX ix_instances_tenant_date ON shift_instances(tenant_id, on_date);
CREATE INDEX ix_instances_shift ON shift_instances(shift_type_id, on_date);

CREATE TABLE engine_runs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  config_version INT NOT NULL,
  window_start DATE NOT NULL,
  window_end   DATE NOT NULL,
  seed BIGINT NOT NULL,
  solver_seconds INT NOT NULL,
  objective_json JSONB NOT NULL,
  notes TEXT,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.10 assignments, publications & calendars
```sql
CREATE TYPE assign_source AS ENUM ('ENGINE','MANUAL','SWAP','GIVEAWAY');

CREATE TABLE assignments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  instance_id BIGINT NOT NULL REFERENCES shift_instances(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source assign_source NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, instance_id, user_id)
);
CREATE INDEX ix_assignments_tenant_date ON assignments(tenant_id, instance_id);

CREATE TABLE publications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  engine_run_id BIGINT REFERENCES engine_runs(id),
  published_by BIGINT REFERENCES users(id),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

-- External calendar correlation
CREATE TABLE calendar_links (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,                    -- 'google' | 'ics'
  external_id TEXT,                          -- Google eventId
  external_hash TEXT,                        -- hash of fields to detect drifts
  UNIQUE (tenant_id, assignment_id, provider)
);
```

### 2.11 swaps, giveaways & messaging
```sql
CREATE TYPE swap_status AS ENUM ('OPEN','ACCEPTED','CANCELLED','EXPIRED');
CREATE TABLE swap_requests (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requester_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  equivalence_code TEXT,                     -- optional; else same shift_type
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status swap_status NOT NULL DEFAULT 'OPEN'
);

CREATE TYPE offer_status AS ENUM ('PENDING','DECLINED','ACCEPTED','CANCELLED','TIMEOUT');
CREATE TABLE swap_offers (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  swap_id BIGINT NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  target_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status offer_status NOT NULL DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ
);

-- Giveaways use the same offers table; requester relinquishes without return
CREATE TABLE giveaway_flags (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shift_type_id BIGINT NOT NULL REFERENCES shift_types(id) ON DELETE CASCADE,
  PRIMARY KEY (tenant_id, shift_type_id)
);

CREATE TABLE email_queue (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  to_email CITEXT NOT NULL,
  template TEXT NOT NULL,
  payload JSONB NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  last_error TEXT
);
```

### 2.12 dollars & reporting
```sql
CREATE TABLE dollar_values (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shift_type_id BIGINT NOT NULL REFERENCES shift_types(id) ON DELETE CASCADE,
  cents INT NOT NULL,
  PRIMARY KEY (tenant_id, shift_type_id)
);

CREATE TABLE adjustments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  cents INT NOT NULL,                         -- +/-
  memo TEXT,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Precomputed summaries (rebuild on publish or nightly)
CREATE TABLE monthly_user_summary (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  shift_counts JSONB NOT NULL,               -- {"N1":3,"N2":2,...}
  cents INT NOT NULL,
  PRIMARY KEY (tenant_id, user_id, month)
);
```

### 2.13 audit
```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_user_id BIGINT REFERENCES users(id),
  action TEXT NOT NULL,                       -- 'CONFIG_SAVE','RUN','PUBLISH','SWAP_ACCEPT',...
  entity TEXT,                                -- table or domain entity
  entity_id TEXT,
  meta JSONB,
  ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_audit_tenant_time ON audit_log(tenant_id, created_at DESC);
```

---

## 3) Indexing & Constraints (hot path hints)
- **Coverage queries**: `shift_instances(tenant_id, on_date)` + join to `assignments`.  
- **Eligibility**: compute candidate pools in memory (engine) using denormalized roster; keep `eligibility` JSONB in `shift_types` for fast read, not for heavy filtering.  
- **Uniqueness**: `(tenant_id, shift_type_id, on_date)` enforces **one instance per day**; use `required_staff` to allow multiple assignees.  
- **Calendar idempotency**: store provider `external_id` + `external_hash`; re‑publish compares hashes to update/patch only when necessary.  
- **Email throttling**: index `email_queue(tenant_id, scheduled_at)`; add composite `(status, scheduled_at)` for worker pick‑up.

---

## 4) Multi‑tenancy & RLS
- Enable **Row‑Level Security** on all tenant‑scoped tables; default deny; policies allow a session‑bound setting (`app.tenant_id`) to filter rows.  
- Example:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_users
  ON users
  USING (tenant_id::text = current_setting('app.tenant_id', true));
```
- Access paths align with PostgreSQL RLS capabilities (official feature).  
- For pooled/serverless contexts, propagate tenant via session or transaction settings used by RLS policies.

> See: PostgreSQL RLS overview and policy creation commands in upstream docs. (References in chat)

---

## 5) Engine Data Flow (from config to assignments)
1. **Load** latest validated `config_versions.payload` and **materialize** `shift_instances` for the window (month/year) using recurrence flags and holidays.  
2. **Build candidate pools** per instance from roster + eligibility + availability (vacations, PT, away).  
3. **Solve (CP‑SAT)**: hard constraints (coverage, eligibility, availability); soft objectives (fairness, distribution, penalties). Save `engine_runs` with seed, objective JSON, telemetry.  
4. **Write assignments** with source=`ENGINE`; keep drafts until Admin review.  
5. **Publish**: stamp `publications`, compute deltas, upsert **calendar_links**, queue emails, recompute **monthly_user_summary**.  
6. **Post‑publish**: swaps/giveaways mutate `assignments` with full audit; calendars & summaries reconcile via deltas.

---

## 6) Example Eligibility Encodings
- **Required subspecialty**: `{ "requiredSubspecialty":"NEURO" }`  
- **Allow any**: `{ "allowAny": true }`  
- **Named allowlist** (emails or user IDs in tenant): `{ "named": ["user_123","user_456"] }`  
- **Min staff** handled in `shift_types.min_staff` + multiple `assignments` per instance.

---

## 7) Calendar & ICS Mapping
- Each `assignment` → **one calendar event** with deterministic UID mapping. Keep `calendar_links.external_id` and content hash for **update/patch vs delete** decisions.  
- Provide **ICS feeds** (master/per‑user) generated from `assignments` with correct timezone/DST fields per RFC 5545.

---

## 8) Migration & Data Lifecycle
- **Migrations** via SQL files with reversible steps.  
- **Backups** nightly; retention 30/90 days env‑dependent; PITR recommended.  
- **Redaction**: when a user leaves, keep assignments for financial history; mark profile inactive and block future scheduling.  
- **Archival**: move old `engine_runs`, `audit_log` to partitions or monthly tables if volume dictates.

---

## 9) Seed & Fixtures
- `fixtures/tenant.json` + `fixtures/roster.csv` + `fixtures/shift_types.csv` + `fixtures/config.json`.  
- Scripts to prefill Ontario 2025 holidays, default FTE bands, and example equivalence sets.

---

## 10) Open Questions
- Should `cardiac CT` be `CHEST` subspecialty or **named** allowlist?  
- Confirm $$ for on‑call & holiday premiums, and whether **clinics** carry $ values.  
- For **MA1** and **Coiling**, supply named allowlists.  
- Decide whether PT‑day selection is **user‑driven** with caps or **admin‑assigned** only.

---

## Appendix A — Minimal RLS policy bootstrap
```sql
-- Apply this pattern to all tenant tables.
CREATE OR REPLACE FUNCTION set_tenant(_tenant TEXT) RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.tenant_id', _tenant, TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_tenants
  ON tenants USING (id::text = current_setting('app.tenant_id', true));
```

## Appendix B — Assignment → Google Event mapping (fields)
- Summary: `"{SHIFT_CODE} — {Subspecialty} ({User Short Name})"`  
- Description: engine run, source, links.  
- Start/End: from instance; all‑day for on‑call.  
- Extended properties: `{assignmentId, tenantId, hash}` to make updates idempotent.

---

## Notes for QA
- Validate **no hard‑constraint violations** can be inserted manually (DB constraints + app guards).  
- Verify RLS by attempting cross‑tenant reads with a different `app.tenant_id`.  
- Re‑publish same draft → **no new calendar events**; changes only when assignment diff or hash change.
