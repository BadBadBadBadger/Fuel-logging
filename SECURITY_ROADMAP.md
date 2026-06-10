# Fuel Log — Security-Aligned Roadmap

**Purpose:** Re-sequence the product roadmap so security and compliance precede taking money or shipping to the Play Store.
**Date:** 2026-06-06
**Start here:** `START-HERE.md` is the one-screen "where are we / what's next" front door; read it first, then this for the security phase detail.
**Companion docs:** `LEGAL_ROADMAP.md` (the legal/compliance counterpart — owns Phase B in full + the pre-payment commercial prerequisites), `ARCHITECTURE_REVIEW.md` (findings & severities). *(The old `DOCS.md §23` roadmap table is retired — this doc is authoritative for phases.)*

> **Division of labour:** this doc owns the **security** phases (0, A, C-tech, D-tech, E, F).
> `LEGAL_ROADMAP.md` owns the **legal/compliance** track — **Phase B in full detail** and the
> **pre-payment commercial prerequisites** (hosting, domain, business entity). Where the two
> overlap (Phase B, and the go-live gate), this doc points there rather than duplicating, so they
> can't drift.

---

## 0. Why the current roadmap is unsafe

The documented plan (`DOCS.md §23`) is sequenced **payments first, security last**:

| Current Phase | What it is | Problem |
|---|---|---|
| 3 (up next) | **Real payments** | Charges money while the AI endpoint is wide open |
| 4 | AI Chef | Adds *more* calls to an unprotected, unmetered endpoint |
| 5 (last) | **Worker auth gate** | The one control that makes the cost model safe — scheduled dead last |

And the "before going live" checklist lists only *"Phase 3 (real payments)"* — **no security gate, no privacy policy, no data-rights work.**

Two reframings change the whole plan:

1. **The worker is live and open *right now*** (`fuellog.adriandavidrichards.workers.dev`). Abuse does **not** require a Play Store launch — anyone who reads your shipped `app.js` can hit it today. So hardening it is **this week's work, independent of launch.**
2. **Security decisions cannot live in the browser.** Everything shipped to the client is readable and editable. The only places a security decision is trustworthy are the **Cloudflare Worker** and **Supabase RLS**. Re-sequencing follows from that one rule.

---

## 1. Guiding principle

> **Trust nothing from the client.** Identity, entitlement, quotas, and payment status are decided and enforced on the server (Worker + Supabase). The client may *display* state, never *grant* it.

---

## 2. Threat model — what we are defending against

| # | Threat | Today's exposure | Controlled in |
|---|--------|------------------|---------------|
| T1 | Anonymous attacker calls the open worker → free Claude / unbounded bill | **Wide open** | Worker (Phase 0) |
| T2 | User flips `auth_state=premium` / reads the voucher from the bundle | **Wide open** | Server entitlement (Phase A) |
| T3 | A valid trial/paid user automates high-volume AI calls | **Unmetered** | Per-user quota (Phase 0/A) |
| T4 | One user reads another user's data | Contained by RLS | Supabase RLS (ongoing) |
| T5 | Health data mishandled (no consent/export/delete) | **Unstarted** | Compliance (Phase B) |
| T6 | Fake/replayed purchase receipts grant premium | N/A yet | Payment verification (Phase D) |
| T7 | Token/session mishandling, account takeover | Low (Google+Supabase) | Auth hygiene (Phase E) |

---

## 3. The re-sequenced roadmap

```
       Phase 0  Lock the live worker            ✅ DEPLOYED (2026-06-07)
       Phase A  Server-authoritative entitlement ✅ DEPLOYED (the real paywall)
NOW ─► Phase B  Compliance & data rights         ➜ see LEGAL_ROADMAP.md (plan agreed)
       Phase C  Resilience & trust               (data you won't silently lose)
       Phase D  Payments                         (gated by LEGAL_ROADMAP §12 commercial prereqs)
       Phase E  Pre-launch hardening + go-live gate
       Phase F  Monitoring & incident readiness  (post-launch, ongoing)

Feature track (AI Chef, planned items, etc.) runs in parallel but must
respect the Phase 0 gate — no feature ships a new unauthenticated AI path.
```

---

### Phase 0 — Lock the live worker *(do now; blocks nothing, protects everything)*

**Goal:** the AI endpoint can only be driven by an authenticated, entitled, rate-limited user — and even a worst case can't bankrupt you.

**Status: ✅ DEPLOYED & validated end-to-end on localhost (2026-06-07).** Worker is live on Cloudflare with JWT auth, model allowlist, and token cap enforced. Remaining items are **optional backstops**: bind the `RATE_LIMIT` KV namespace (per-user quota) and set the Anthropic Console spend cap. See `DOCS.md §34`.

- [x] **Require identity.** `callAI` attaches `Authorization: Bearer <supabase access token>` (via `getAccessToken()` → `sb().auth.getSession()`); worker validates it through Supabase `/auth/v1/user` and rejects anonymous/expired with `401`. *(Token validation via the auth endpoint handles both HS256 and asymmetric signing without needing the JWT secret.)*
- [x] **Server-side `model` allowlist.** Only `claude-sonnet-4-6`; client value ignored/overridden.
- [x] **Cap `max_tokens`** server-side (clamped to 2000).
- [x] **Lock CORS** to the GitHub Pages origin instead of `*`; `Authorization` added to allowed headers.
- [x] **Return generic errors** — no more echoing `err.message`.
- [~] **Per-user rate limit.** Code in place (KV-backed, `DAILY_LIMIT = 100`/user/day → `429`); **activates once a `RATE_LIMIT` KV namespace is bound** (setup steps in the worker file footer). Until then auth is still enforced; only the limit is skipped.
- [ ] **Backstop: Anthropic Console monthly spend cap + billing alert** (manual, in the Anthropic dashboard).

**Deploy order:** push the new **worker** first (so the CORS preflight accepts `Authorization`), then the new **app.js**. Cached clients on the old bundle get `401` until the SW updates (v28).

**Definition of done:** an anonymous `curl` to the worker is rejected; a signed-in user over quota gets `429`; the most expensive possible request is impossible to construct from the client.

---

### Phase A — Server-authoritative entitlement *(this is the actual paywall)*

**Goal:** premium status is a server fact, not a browser flag. Closes T2.

**Status: ✅ DEPLOYED & validated end-to-end on localhost (2026-06-07).** `entitlements` table live, `/redeem` works, AI gated on `tier=premium, status=active`, voucher removed from the bundle. ⚠️ **Known gap (tracked in `LEGAL_ROADMAP.md` R-prep):** the `entitlements` SELECT RLS policy did not actually get created when the schema ran — harmless today (worker reads via service role) but the table must be locked down before launch. Re-run: `ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;` + the `read own entitlement` policy.

- [x] **`entitlements` table** in Supabase: `user_id, tier, status (trial|active|expired), expires_at, source (voucher|play|stripe), created_at, updated_at`.
  - RLS: user may **READ** their own row; **only the service role may WRITE** it. The client can never grant itself premium.
- [x] **Worker checks entitlement** before proxying AI: JWT `sub` → look up entitlement via Supabase REST API. No `tier=premium, status=active` → `403`, no AI.
- [x] **`/redeem` endpoint in worker** — voucher validation server-side, writes entitlement with the service role. **Removed `VOUCHER_CODE` from app.jsx** — voucher no longer readable in the bundle.
- [x] Client `authState` is **display-only**; server entitlement is the source of truth (checked on every AI call).
- [ ] **Apply Supabase schema migration** — run the new `setup/supabase-schema.sql` in the Supabase SQL editor to create the `entitlements` table + RLS policy + index.
- [ ] **Set `SUPABASE_SERVICE_ROLE` secret in Cloudflare** (required for the `/redeem` endpoint to write entitlements). Get it from Supabase Dashboard → Settings → API keys → Copy the "service_role" key.
- [ ] **Deploy the updated worker** (with `/redeem` endpoint and entitlement checking).
- [ ] **Deploy the updated app** (without the voucher code; uses `redeemVoucher()` instead).

**Definition of done:** setting `auth_state=premium` in DevTools unlocks nothing server-side; the voucher string no longer appears anywhere in `app.js`; calling the `/redeem` endpoint successfully writes an `entitlements` row; AI calls without an active entitlement return `403`.

---

### Phase B — Compliance & data rights *(legal prerequisite, also a store requirement)*

> **➜ Owned in full by `LEGAL_ROADMAP.md`.** That doc is the authoritative, detailed plan for
> Phase B (risk register R1–R11, scope decisions, privacy-policy outline, consent plan,
> sub-processor disclosure, RoPA). This section is a **summary + status only** — do not edit the
> detail here; edit `LEGAL_ROADMAP.md` so the two can't drift.

**Goal:** lawfully handle health data and satisfy Play Console's Data Safety review. Closes T5.

**Status: plan agreed (2026-06-07).** Scope locked to **18+, UK/EEA only** → single regime
(UK + EU GDPR). Key code-verified facts: health data is **pseudonymised, not anonymised** (still
in scope); the AI path sends **no identifiers** to Anthropic (strong minimisation). Next:
build export + delete, then publish policy + consent + disclosure.

Summary of the work (full detail in `LEGAL_ROADMAP.md`):
- Privacy policy at a stable URL · Art. 9 explicit consent for health data · Anthropic sub-processor disclosure + transfer mechanism · data **export** + **account deletion** UI · minimise AI-path logging · Play Data Safety form · ICO fee · one-page RoPA.

**Definition of done:** see `LEGAL_ROADMAP.md §11`.

---

### Phase C — Resilience & trust *(so paying users don't silently lose data)*

**Goal:** a paid sync product that doesn't quietly drop data. Supports T4 hygiene and overall trust.

- [ ] **Single persistence/repository module** — one `save()`/`load()` that writes local + reconciles remote, centralising the offline queue and conflict handling (replaces the ~10 scattered `sync*` call sites; see `ARCHITECTURE_REVIEW.md §4-B`).
- [ ] **Surface sync failures** to the user (reuse `syncMsg` for errors) — stop swallowing them in empty `catch {}` (14 today).
- [ ] **Server-side `updated_at`** (DB default) as the conflict tiebreaker instead of client clocks.
- [ ] **CI gate** (GitHub Action): run `npm test` + `npm run build` on every push so `app.js` can't drift from `app.jsx`.
- [ ] **RLS checklist rule:** every new table ships with a policy *and* a test. Your data isolation depends entirely on this.

---

### Phase D — Payments *(now safe, because A & B are done)*

**Goal:** take money with verified, fraud-resistant entitlement. Closes T6.

> **➜ Commercial prerequisites first (`LEGAL_ROADMAP.md §12`).** Before charging **any**
> individual: (1) **fully on Cloudflare** — migrate the frontend off GitHub Pages onto **Cloudflare
> Pages** (Pages' terms discourage primarily-commercial hosting); (2) a **custom domain**;
> (3) a **business entity / trading name** decided. These are hard gates on this phase.
>
> **Synergy (security ↔ legal):** the Cloudflare Pages move is *also* a security win — serving the
> frontend and worker under **one origin** lets you **drop CORS entirely** (today it's only
> defence-in-depth) and shrinks the attack surface. Do the migration here and simplify Phase 0's
> CORS handling at the same time.

- [ ] **Google Play Billing:** verify purchase tokens **server-side** via the Play Developer API; subscribe to **Real-time Developer Notifications (RTDN)** for renew/cancel/refund/grace; write results into `entitlements` with the service role. Never trust a client claim of purchase.
- [ ] **Stripe (web/Apple):** entitlement set **only** by a signature-verified webhook; client purchase UI grants nothing on its own.
- [ ] Map both sources to the same `entitlements` model from Phase A.

**Definition of done:** a forged or replayed receipt grants no access; a refund/cancel revokes premium automatically via webhook/RTDN; and the commercial prerequisites above are all met.

---

### Phase E — Pre-launch hardening + go-live security gate

**Ship to the Play Store only when every box is checked.** Closes T7 and verifies the rest.

- [ ] Phase 0–D definitions-of-done all met.
- [ ] **`LEGAL_ROADMAP.md` Phase B definition-of-done met** (privacy policy live, consent, export/delete, Data Safety form, ICO fee) **and its §12 commercial prerequisites done** (fully on Cloudflare Pages, domain, business entity).
- [ ] **Penetration self-test:** confirm anonymous worker call, fake premium, over-quota, oversized `max_tokens`, and cross-user data read all fail.
- [ ] **`entitlements` RLS verified** — the SELECT policy actually exists (the Phase A known gap is closed) and a cross-user read of `entitlements` fails.
- [ ] **Auth hygiene:** session tokens never logged; sign-out clears local + revokes Supabase session; token refresh handled.
- [ ] **Dependency review:** pin/verify vendored libs (`vendor/*.js`), confirm no secrets in any tracked file, rotate the Anthropic key once (it predates these controls).
- [ ] **Secrets inventory:** `ANTHROPIC_KEY`, `SUPABASE_JWT_SECRET`, service-role key, Play/Stripe keys — all in Cloudflare/server secrets, none in the bundle.
- [ ] **SW cache versioning** automated (content hash) so launches don't strand users on a stale, possibly-vulnerable bundle.
- [ ] Replace the `DOCS.md §34` "before going live" checklist with **this gate**.

---

### Phase F — Monitoring & incident readiness *(post-launch, ongoing)*

- [ ] **Cost observability:** log per-request token usage (no PII) and the daily Anthropic spend; alert on anomalies.
- [ ] **Error reporting** (e.g. Sentry) for client + worker.
- [ ] **Abuse alerting:** spikes in `429`/`401`, single-user volume outliers.
- [ ] **Incident runbook:** how to flip the AI kill-switch, rotate keys, and revoke a user — written down before you need it.

---

## 4. Feature track (parallel, but gated)

AI Chef, planned items, and other features from the old roadmap can proceed **in parallel**, with one rule: **no feature introduces a new AI call path that bypasses the Phase 0 gate.** Every AI feature goes through the authenticated, entitled, rate-limited worker — no exceptions. Build AI Chef *after* Phase 0 so it's born behind the gate, not retrofitted.

---

## 5. One-line sequence vs. the old plan

| Old (DOCS §23) | New (this doc) |
|---|---|
| Payments → AI Chef → Worker gate | **Worker gate (now) → Entitlement → Compliance → Resilience → Payments → Launch gate → Monitoring** |

The old plan charged money through an open door. The new plan closes the door first, proves the lock, *then* sells tickets.
