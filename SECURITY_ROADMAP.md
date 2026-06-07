# Fuel Log — Security-Aligned Roadmap

**Purpose:** Re-sequence the product roadmap so security and compliance precede taking money or shipping to the Play Store.
**Date:** 2026-06-06
**Companion docs:** `ARCHITECTURE_REVIEW.md` (findings & severities), `DOCS.md §23` (roadmap — being superseded by this).

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
NOW ─► Phase 0  Lock the live worker            (days — do independent of launch)
       Phase A  Server-authoritative entitlement (the real paywall)
       Phase B  Compliance & data rights         (legal prerequisite for store)
       Phase C  Resilience & trust               (data you won't silently lose)
       Phase D  Payments                         (now safe to take money)
       Phase E  Pre-launch hardening + go-live gate
       Phase F  Monitoring & incident readiness  (post-launch, ongoing)

Feature track (AI Chef, planned items, etc.) runs in parallel but must
respect the Phase 0 gate — no feature ships a new unauthenticated AI path.
```

---

### Phase 0 — Lock the live worker *(do now; blocks nothing, protects everything)*

**Goal:** the AI endpoint can only be driven by an authenticated, entitled, rate-limited user — and even a worst case can't bankrupt you.

**Status: code-complete (2026-06-06), pending deploy + KV/spend-cap setup.**

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

- [ ] **`entitlements` table** in Supabase: `user_id, tier, status (trial|active|expired), expires_at, source (voucher|play|stripe), updated_at`.
  - RLS: user may **READ** their own row; **only the service role may WRITE** it. The client can never grant itself premium.
- [ ] **Worker checks entitlement** before proxying AI: JWT `sub` → look up entitlement (service-role query or a short-lived signed claim). No active entitlement → `402/403`, no AI.
- [ ] **Move the voucher server-side.** Add a worker `redeem` endpoint that checks the code and writes the entitlement with the service role. **Remove `VOUCHER_CODE` from the client bundle** — it's currently readable by anyone.
- [ ] Client `authState` becomes **display-only**, derived from the server entitlement on load; never the source of truth.

**Definition of done:** setting `auth_state=premium` in DevTools unlocks nothing server-side; the voucher string no longer appears anywhere in `app.js`.

---

### Phase B — Compliance & data rights *(legal prerequisite, also a store requirement)*

**Goal:** lawfully handle health data and satisfy Play Console's Data Safety review. Closes T5.

- [ ] **Privacy policy** published at a stable URL (Play listing requires the URL anyway).
- [ ] **Treat weight / body-fat / sex as special-category health data (UK GDPR Art. 9).** Add an explicit consent checkpoint before first cloud sync; record lawful basis.
- [ ] **Disclose Anthropic as a sub-processor** — meal descriptions and coach context leave your system for AI processing.
- [ ] **Data export** ("Download my data") and **account deletion** UI. Deletion removes the Supabase `auth.users` row (schema's `ON DELETE CASCADE` purges all tables) and any worker-side logs. *(Today, sign-out leaves all cloud rows in place — that gap must close.)*
- [ ] **Minimise AI-path logging:** don't persist prompt contents containing PII; scrub or hash before any logging.
- [ ] Complete the **Play Console Data Safety form** aligned to the above.

**Definition of done:** a user can export and delete everything; the privacy policy accurately names what's collected and that Anthropic processes meal data.

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

- [ ] **Google Play Billing:** verify purchase tokens **server-side** via the Play Developer API; subscribe to **Real-time Developer Notifications (RTDN)** for renew/cancel/refund/grace; write results into `entitlements` with the service role. Never trust a client claim of purchase.
- [ ] **Stripe (web/Apple):** entitlement set **only** by a signature-verified webhook; client purchase UI grants nothing on its own.
- [ ] Map both sources to the same `entitlements` model from Phase A.

**Definition of done:** a forged or replayed receipt grants no access; a refund/cancel revokes premium automatically via webhook/RTDN.

---

### Phase E — Pre-launch hardening + go-live security gate

**Ship to the Play Store only when every box is checked.** Closes T7 and verifies the rest.

- [ ] Phase 0–D definitions-of-done all met.
- [ ] **Penetration self-test:** confirm anonymous worker call, fake premium, over-quota, oversized `max_tokens`, and cross-user data read all fail.
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
