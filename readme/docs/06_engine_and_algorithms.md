# 06_engine_and_algorithms.md
**Radiology Scheduling Platform — Engine & Algorithms**  
Prepared: August 13, 2025 · Owner: Ali · Audience: Backend, Optimization, QA

> This document specifies how the scheduling engine builds year-long, constraint‑aware schedules; how fairness and preferences are modeled; how swaps/giveaways are reconciled; and how the solver is tuned for speed and stability.

---

## 0) Approach Summary

**Primary method: CP‑SAT (Constraint Programming over integers) via Google OR‑Tools.**  
We formulate the schedule as a mixed integer (binary) model with hard constraints (coverage, eligibility, one‑shift‑per‑person‑per‑day, vacations, PT days) and soft goals (fairness, preference satisfaction, late/early patterns, etc.). CP‑SAT excels on large discrete scheduling/assignment problems and is the state‑of‑the‑art in OR‑Tools. citeturn0search0turn0search13

**Why not heuristics‑only?** Heuristics (greedy, local search) are fast but brittle on edge cases and give no optimality guarantees. CP‑SAT still uses powerful search, cutting planes, and presolve, and supports hybrid patterns like Large Neighborhood Search (LNS) and warm‑starts so we get robust performance without sacrificing quality. citeturn0search22turn0search4

**Feasibility explainability:** When a model is infeasible, we rely on CP‑SAT's *assumptions / unsat core* capability to extract a minimal (or near‑minimal) set of conflicting assumptions to surface actionable causes to the admin. citeturn0search14turn0search8

---

## 1) Scope & Inputs

- **Time horizon**: 12 months (supports rolling windows such as 2‑month drafts).  
- **Granularity**: per‑day *shift instances* (materialized from the tenant's JSON config; late blocks and calls are separate instances).  
- **Roster**: users with subspecialty, FTE %, fellow flag, away/PT windows.  
- **Policies**: vacation policy, FTE→PT mapping, equivalence sets, dollar values, holidays.  
- **Preferences**: per‑month ranked vacation week options (P1/P2/P3), optional daily “away”/PT picks when enabled.

> Input artifacts are stored in Postgres (`config_versions`, `shift_types`, `holidays`, `rad_profiles`, `vacation_prefs`, `avail_windows`) and materialized into `shift_instances` for the run window. See **05_data_model_and_schema.md**.

---

## 2) Decision Variables (binary unless noted)

Let `R` be radiologists, `D` be dates in the window, `I` be shift instances, and `T` be shift types.

- **Assignment**: `x[r, i] ∈ {{0,1}}` — user *r* works shift instance *i*.  
- **Vacation week selection**: `v[r, m, k] ∈ {{0,1}}` — user *r* receives rank *k* vacation in month *m* (k∈{{P1,P2,P3}}).  
- **PT-day assignments** (optional mode): `p[r, d] ∈ {{0,1}}` — day *d* is a part‑time day off for user *r*.  
- **Load accumulators** (int):  
  - `C[r, t]` — total count of shift type *t* assigned to *r* in the horizon.  
  - `C_eq[r, e]` — total count over an equivalence set *e* for fairness.  
- **Fairness deviation** (int):  
  - `Δ[r, e] ≥ 0` with target `μ[e]` — absolute deviation of `C_eq[r,e]` from the group average for set *e*.

All variables are integer (binary or small non‑negative integers) to comply with CP‑SAT’s integer-only modeling. citeturn0search0

---

## 3) Hard Constraints

1) **Coverage** — every shift instance meets staffing:  
   `∀i: Σ_r x[r,i] = required_staff[i]` (or ≥ with penalty if we allow under‑coverage in draft mode).  
2) **Eligibility** — a user can be assigned only if they meet one of:  
   - `requiredSubspecialty` matches their subspecialty  
   - `allowAny` is true  
   - user is in a `named` allowlist (e.g., MA1, Coiling)  
   Encoded by setting `x[r,i] ≤ eligible[r,i]`.  
3) **No overlap / one shift per day** — for any user/day, `Σ_{{i on day d}} x[r,i] ≤ 1`. Calls that are all‑day count as a shift and conflict with other daily shifts unless explicitly modeled as compatible.  
4) **Rest / late‑early rules** (toggleable): forbid incompatible patterns such as `NEURO_18_21` followed by a `08:00` start next day (enforced with cross‑day precedence forbids).  
5) **Vacations**:  
   - Each month, `Σ_k v[r,m,k] = 1` (one week off per month).  
   - For the chosen vacation week, `Σ_{{i ∈ that week for r}} x[r,i] = 0`.  
   - **Max consecutive weeks per year** ≤ policy cap (e.g., 2).  
6) **PT-days (derived from FTE)**: each user gets the proper number of PT days per month per the FTE band; apply weekday balance if enabled (e.g., no more Fridays than any other weekday + cap by `weekdayBalanceCap`).  
7) **Holidays**: generate instances and apply eligibility as usual; if clinics are closed, instances are not materialized for those days.  
8) **Fellows**: limited to their own shift types/equivalence sets; optionally barred from on‑call.

> The above are standard CP‑SAT constraints for workforce/employee scheduling; OR‑Tools provides examples and patterns we adapt to this domain. citeturn0search1turn0search7

---

## 4) Soft Goals (penalized in the objective)

- **Vacation preference satisfaction**: reward P1, then P2, then P3 (`+w_P1*v[r,m,P1] + w_P2*v[r,m,P2] + ...`).  
- **Fair distribution by equivalence set** (e.g., N1–N4 among neurorads; clinic set among generalists): minimize deviation `Δ[r,e]` from group targets (L1) or minimize squared deviations by linearization (L2 via piecewise).  
- **Shift‑type balance** per subspecialty (e.g., equal share of N1 vs N2 across neurorads).  
- **Pattern hygiene**: discourage late→early transitions, long streaks, excessive weekends, etc.  
- **Call/holiday premiums**: include as positive rewards to bias coverage when needed.

We implement soft goals with linear penalty terms, which CP‑SAT handles directly. citeturn0search0

---

## 5) Objective & Multi‑objective Strategy

**Primary objective**: maximize preference satisfaction and minimize fairness deviations while preserving feasibility.  
Implementation options:

- **Weighted sum** of penalties/rewards with scale separation to prioritize categories (coverage/feasibility violations get huge weights and are typically modeled as *hard*).  
- **Lexicographic**: solve in stages — e.g., (1) maximize vacation P1 count; (2) fix P1 optimum as a constraint; (3) minimize fairness deviations; (4) minimize pattern penalties. This staged approach is common for CP‑SAT when strict priorities are desired. citeturn0search10turn0search5

> CP‑SAT supports linear objectives. When priorities are strict, staged solves (a.k.a. hierarchical/lexicographic via successive runs) are recommended in practice. citeturn0search12

---

## 6) Warm‑starts, LNS & Search Parameters

**Warm‑starts / hints**: seed the solver with last year’s schedule, a previous draft, or an admin’s partial edits. CP‑SAT supports *solution hints* that often speed convergence. (API in `cp_model`/`CpSolver`.) citeturn0search2turn0search19

**Large Neighborhood Search (LNS)**: iteratively relax a neighborhood (e.g., a subspecialty/week slice, or all late blocks) and re‑optimize with other variables fixed, to improve objective while keeping feasibility. Effective on large scheduling instances. citeturn0search4

**Key parameters** (typical):  
- `max_time_in_seconds` — enforce run budget;  
- `num_search_workers` — parallelism;  
- `random_seed` — reproducibility with diversity;  
- `log_search_progress` — for telemetry.  
We keep parameters in tenant‑level config for tunable SLA vs quality. citeturn0search21turn0search14

---

## 7) Complexity & Scaling Notes

Naïve variable count upper bound ~ |R| × |I| (eligible pairs only). With 30 rads, 25 shift types, 365 days, that’s ~273k potential `(r,i)` pairs; eligibility reduces this substantially (e.g., NEURO shifts only for neurorads). CP‑SAT handles models of this size with proper presolve, warm‑starts, and LNS; we also allow rolling windows (e.g., 2‑month drafts) when needed. Employee shift scheduling is a canonical CP‑SAT use‑case. citeturn0search13

---

## 8) Infeasibility Diagnostics & Admin UX

We encode *toggleable* constraints (e.g., “no late→early”, “weekday balance for PT days”) behind Boolean *assumption literals*. On infeasibility, CP‑SAT can return a subset of assumptions explaining the conflict (an **unsat core**). We map that to human messages: e.g., “Too many neurorad vacations in Aug week 2 given N1–N4 coverage requirement”. citeturn0search14turn0search8

Fallbacks in the UI:
- Auto‑relax lowest‑priority assumptions first and re‑solve.  
- Surface minimal violating set and let Chief approve a rule override.  
- Offer quick‑fix tools: add a locum, mark a clinic closed, or convert a late‑block to overtime.

---

## 9) Swap/Giveaway Post‑publish Logic

Swaps and giveaways are *post‑solve* operations that preserve hard constraints:

- **Swap**: NV pair (A on i, B on j) → (A on j, B on i) if eligibility holds, no overlap, and fairness caps remain within bounds. We re‑run a *micro‑solve* (tiny CP‑SAT model) if the swap touches fairness caps; otherwise commit directly.  
- **Giveaway**: requester relinquishes an eligible *giveaway* shift (on‑call/weekend) → we search candidates in order (availability + eligibility + fairness) and assign the first acceptor; if timeout, escalate to admin.

Assignments mutated by swaps/giveaways are audited and pushed to calendars via idempotent diffs (see **05**).

---

## 10) Fairness Formulations (examples)

Let `E` be an equivalence set (e.g., `NEURO_DAY_EQ` = {{N1,N2,N3,N4}}). For user `r`:

- **Absolute deviation (L1)**:  
  `Δ[r,E] ≥ C_eq[r,E] − μ[E]` and `Δ[r,E] ≥ μ[E] − C_eq[r,E]`. Minimize `Σ_r Δ[r,E]`.  
- **Squared deviation (approx.)**: linearize with breakpoints `b ∈ B` and extra variables `z[r,E,b]` to approximate `(C_eq[r,E] − μ[E])^2`.  
- **Preference fairness**: maintain a ledger `L[r]` that increments when a user loses a tie‑break; add penalty proportional to `L[r]` to bias future allocations.

These are standard linear encodings compatible with CP‑SAT’s integer objective. citeturn0search0

---

## 11) Vacation Preference Model

For each month m: user selects up to 3 weeks (P1,P2,P3). We enforce exactly one week granted, and reward higher ranks more. Conflicts are broken fairly via the global objective and (optionally) the fairness ledger. This is analogous to CP‑SAT examples that assign people to time slots with preference weights. citeturn0search1

---

## 12) Engine Workflow (end‑to‑end)

1. **Materialize** shift instances for the run window from config (respect recurrence, holidays).  
2. **Build** eligibility and availability masks.  
3. **Assemble** the CP‑SAT model with constraints and objective; inject **solution hint** if any (previous draft). citeturn0search2  
4. **Solve** with a time budget and multi‑objective strategy (weighted or staged).  
5. **Record** `engine_runs` (seed, parameters, objective telemetry) and draft `assignments`.  
6. **Publish** → calendars, dollars, summaries; freeze snapshot for audit.  
7. **Post‑publish**: process swaps/giveaways; reconcile diffs.

---

## 13) Parameter Profiles (examples)

- **Draft (fast)**: `max_time_in_seconds=20`, `num_search_workers=default`, LNS off; prioritize feasibility and vacation P1 hits.  
- **Balanced**: `max_time_in_seconds=60`, enable LNS; add fairness and pattern penalties.  
- **Finalize (highest quality)**: `max_time_in_seconds=180+`, run staged objectives (lexicographic) and multiple seeds; stop when no improvement for N seconds.

Parameters are tenant‑tunable and stored with each run response for reproducibility. citeturn0search21

---

## 14) Extensibility: Learning‑Augmented Search (optional)

We can bias search with learned weights (e.g., predictive availability, typical swap likelihood) to improve initial hints or neighborhood choice. CP‑SAT remains the core solver; ML augments strategy, not feasibility. Literature shows growing interest in combining learning with CP for scheduling. citeturn0search18

---

## 15) References (key)
- OR‑Tools **CP‑SAT** overview & scheduling intro; employee scheduling examples. citeturn0search0turn0search13turn0search1  
- OR‑Tools **Python API** (`cp_model`, `CpSolver`) and examples (shift scheduling). citeturn0search2turn0search12turn0search7  
- **Parameters** and tuning patterns; community notes on string parameters. citeturn0search21  
- **Large Neighborhood Search** with CP‑SAT (primer). citeturn0search4  
- **Assumptions / unsat cores** for infeasibility diagnostics. citeturn0search14turn0search8  
- Background on **CP & fairness** in scheduling (illustrative). citeturn0search11turn0search6
