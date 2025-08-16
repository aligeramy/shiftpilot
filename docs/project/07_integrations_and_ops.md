# 07_integrations_and_ops.md
**Radiology Scheduling Platform — Integrations, Platform & Operations**  
Prepared: August 14, 2025 · Owner: Ali · Audience: Backend, Infra/Ops, Security, QA

> Scope: Authentication/SSO, email & notifications, Google Calendar & ICS feeds, AI agent (Vercel AI SDK + MCP), payments, hosting/deploys, observability, backups, security, and operational playbooks. The platform is **multi‑tenant** and **config‑first**; integrations must be idempotent and auditable.

---

## 0) Non‑goals (to stay focused)
- No bi‑directional calendar sync (we are **one‑way** publisher).  
- No phone/SMS paging in v1 (can be added later).  
- No mobile app store clients in v1 (mobile‑responsive web).

---

## 1) Authentication & RBAC

### 1.1 AuthN
- **Primary**: OAuth login with Google (provider: NextAuth/Auth.js). Minimal scopes: `openid email profile` for user identity, and **separate consent** for Calendar (see §3).  
- **Fallback**: Passwordless email link (magic link), configurable per tenant.  
- **Session**: JWT session (stateless) or database sessions if you need server invalidation. Recommended: JWT with short TTL + refresh via silent reauth.

### 1.2 AuthZ (RBAC)
- Roles: `SUPER_ADMIN`, `ADMIN`, `CHIEF`, `RAD` (fellow is a profile flag).  
- **Policy**: Use **Row‑Level Security** (RLS) in Postgres (see 05_schema) + server‑side guards. All DB queries are tenant‑scoped.  
- **Least privilege**: Calendar and email tokens are **per‑user** (for Calendar) and **per‑system** (for email provider).

### 1.3 SSO / Enterprise
- If a tenant uses Google Workspace, Admins can enable domain‑restricted signup.  
- Add `allowed_domains[]` in tenant config to auto‑promote to `RAD` on first login.

---

## 2) Email, Templates & Notifications

### 2.1 Providers
- Start with **Postmark** (simple, predictable deliverability). Keep an abstraction layer for **SendGrid** templates if needed by the customer.  
- Maintain **Message Streams**: `outbound`, `broadcast` (for policy changes), and `system` (invites, reset).

### 2.2 Templates (must‑have)
- **Invite to organization** (admin → rad).  
- **Vacation window open / reminder / closing soon**.  
- **Draft schedule ready** (per‑user slice).  
- **Swap request** (targeted offers), **Swap accepted/declined**, **Giveaway accepted**, **Request expired**.  
- **Publication** notice with links to ICS / Google event changes.  
- **Payment** receipts (if Stripe enabled) and **failed payment** alerts (to admins).

### 2.3 Email semantics
- **Idempotency key** on queue items to avoid dupes.  
- Do **not** email the entire group for swaps; we send **sequential targeted offers** based on eligibility + availability + fairness priority.  
- Store **rendered payload JSON** with the email record for audit/replay.

---

## 3) Calendar Integrations (Google) & ICS Feeds

### 3.1 One‑way Google publishing
- Per‑user OAuth consent for Calendar scope.  
- Each **assignment** maps to one Google event in the user’s **primary** calendar.  
- Track `external_id` (Google `eventId`) and a **content hash**; on publish we upsert via `insert` or `patch`. `patch` avoids clobbering user‑edits to other fields.  
- Use **private extendedProperties** to persist immutable metadata (`tenantId`, `assignmentId`, `hash`, `source`).

### 3.2 ICS feeds
- Provide **master ICS** (org‑wide) and **per‑user ICS** endpoints.  
- ICS events contain: UID, DTSTART/DTEND with tz, SUMMARY (`{SHIFT_CODE} — {Subspecialty} ({User})`), and DESCRIPTION with internal links.  
- Each user has a **private token** embedded in their ICS URL; rotating the token invalidates old URLs.

### 3.3 Timezones & DST
- Tenant default tz (e.g., `America/Toronto`) applied when building instances and ICS.  
- For all‑day on‑call, use `DATE` (no time) semantics; for timed shifts, always include `TZID` and observe DST rules.

---

## 4) AI Agent for Rule Capture (Vercel AI SDK + MCP)

### 4.1 Goal
A guided **Rule Builder** where admins **describe** scheduling rules in natural language; the agent generates or updates the **tenant config JSON**, then asks clarifying questions until constraints are complete. The agent runs **inside the app**, not as a separate product.

### 4.2 Design
- UI: a chat pane + a structured diff preview of the config JSON.  
- **Tool calls** the agent can invoke:
  - `getTenantConfig()` → returns latest config JSON.
  - `proposeConfigPatch(patch)` → returns a JSON patch diff.
  - `validateConfig(config)` → runs schema validation & sanity checks.
  - `saveConfig(config)` → persists as new `config_versions` row.
  - `dryRunSolve(window)` → quick CP‑SAT feasibility ping with high‑level diagnostics.
- **Knowledge**: imbue the agent with an **instructions system prompt** and a set of canonical **rule recipes** (eligibility, equivalence, vacation policies, PT balancing).  
- Optional: adopt **MCP** to standardize tool surfaces if you later want the same agent in IDEs/desktops.

### 4.3 UX safeguards
- No destructive writes without a **human‑confirmed diff**.  
- If ambiguity is high (e.g., “MA1 eligibility”), the agent must collect named lists instead of guessing.  
- Version every AI‑assisted change with actor=`AGENT` in the audit log.

---

## 5) Payments (optional, per‑tenant)

- Support **per‑user** or **per‑group** subscriptions.  
- Plans: `Free` (residency programs), `Standard`, `Pro` (adds swap automation & calendar sync).  
- If metered, track active users/month and/or generated shifts/month.  
- Webhooks update tenant status; **grace period** before deactivation.

---

## 6) Hosting & Background Work

- **Web app**: Next.js (app router), deployed to Vercel or Replit v2; edge‑cache public marketing pages only.  
- **Background workers**: queue for email send, calendar publish, and swap offer fan‑out. (e.g., a serverless cron + durable queue.)  
- **Storage**: PostgreSQL (Neon/RDS/Supabase), S3‑compatible object store for exports.  
- **Secrets**: Vercel/hosted secrets; never commit tokens.  
- **Migrations**: SQL files in `db/migrations`, run in CI with linting.

---

## 7) Observability & Ops

- **Logging**: structured JSON logs with correlation IDs (request → engine run → publication).  
- **Metrics**: solver time, constraints satisfied %, emails sent, calendar upserts, swap latency.  
- **Tracing**: propagate trace IDs through worker jobs.  
- **Error reporting**: install SDK (Next.js + Node worker) and tag with `tenant_id` & `engine_run_id`.  
- **Runbooks**: 
  - Calendar re‑publish for a user (clear and rebuild by `assignmentId` set).  
  - Email replay for failed items (respect idempotency keys).  
  - Swap stuck in `PENDING` → auto‑expire and advance to next candidate.

---

## 8) Security, Privacy & Compliance

- **RLS** on every tenant table; default‑deny policies.  
- **PII**: minimal retention; encrypt secrets at rest; rotate OAuth refresh tokens.  
- **Audit trail** for config changes, runs, publishes, and swap actions.  
- **ICS URLs** include an unguessable token; rotate on leak.  
- **Scopes**: Calendar scope requested only at publish‑time (deferred consent).  
- **Backups**: nightly full + PITR; restore drill quarterly.  
- **Data deletion**: deactivate user → keep financial history; anonymize name/email after grace window, if tenant requests.

---

## 9) Idempotency & External Correlation

- **Calendar**: store `external_id` + `external_hash`; publish computes diffs and only patches when the hash changes.  
- **Email**: queue includes `idempotency_key` derived from (template, recipient, assignment/publication).  
- **Payments**: ignore duplicate webhooks by event signature + replay cache.

---

## 10) API Keys & Secrets Inventory (per environment)
- Google OAuth client (AuthN)  
- Google Calendar OAuth client (AuthZ for Calendar)  
- Email provider server token (Postmark / SendGrid)  
- Payments (Stripe) publishable & secret keys  
- Sentry DSN (if used)  
- Database URL (Postgres)  
- ICS HMAC secret for signed feed URLs

---

## 11) Tenant Config knobs (integration section)
```json
{
  "integrations": {
    "calendar": {
      "provider": "google",
      "publishMode": "onPublish",
      "patchStrategy": "hashCompare",
      "useExtendedProperties": true,
      "eventSummaryFormat": "{SHIFT_CODE} — {SUBSPECIALTY} ({USER_SHORT})"
    },
    "email": {
      "provider": "postmark",
      "streams": ["outbound", "system", "broadcast"],
      "swapOfferCadenceMinutes": 30,
      "maxConcurrentOffers": 1
    },
    "payments": {
      "provider": "stripe",
      "plan": "standard",
      "billing": "per_user",
      "metered": false
    },
    "aiAgent": {
      "enabled": true,
      "tooling": "vercel-ai-sdk",
      "usesMCP": false
    }
  }
}
```

---

## 12) QA Checklist (integration behaviors)
- Google publish creates events with correct **TZID** and updates via `patch` without duplicates.  
- ICS feed validates against RFC and imports into Google/Apple/Outlook without warnings.  
- Email queue respects idempotency and never blasts the whole org for swaps.  
- Revoking Calendar permission for a user yields a **graceful** per‑user publish error and QA can re‑consent.  
- Payments off → premium features disabled but data remains intact.  
- Agent cannot save config without human‑accepted diff.

---

## 13) Open Questions
- Should **clinics** ever be all‑day events in calendars, or always timed?  
- Stripe: do we need **group‑level** billing with sub‑accounts?  
- Email provider per‑tenant (bring‑your‑own) vs shared?  
- Slack/MS Teams notifications as an optional integration?

---

## 14) Quick Start Tasks
1. Create Google OAuth creds (Auth) and Calendar creds (separate OAuth app).  
2. Configure Postmark server token; scaffold templates for invites, swap, publish.  
3. Implement ICS feed endpoints (master & per‑user) with signed tokens.  
4. Build calendar publisher with `insert`/`patch` + extended properties + hash.  
5. Drop in Vercel AI SDK; wire agent tools to config versioning; add guardrails.  
6. Turn on Sentry and structured logs; add a `/healthz` endpoint for workers.  
7. Document runbooks and on‑call escalation path.
