# Fuel Log — Architecture & Security Review

**Reviewer role:** Professional software architect
**Date:** 2026-06-06
**Scope:** Full application — `app.jsx` (3,080 lines), `cloudflare-worker.js`, `index.html`, `sw.js`, Supabase schema, build/deploy workflow.
**Lens:** "What changes if this becomes a paid product people trust with their data and their money?"

---

## 1. Executive summary

Fuel Log is a well-built **solo-developer PWA** with genuinely good instincts: the API key is kept server-side, real Supabase auth sessions back row-level security, pure calculation logic is unit-tested, and the offline-first model is solid. As a free hobby app, the architecture is defensible and even smart — minimal build complexity, ships straight to GitHub Pages.

As a **paid** app, three things must change before you charge anyone:

1. **The AI proxy is open to the world.** Anyone can run Claude on your Anthropic key for free, with an unbounded bill. This is the single most important issue.
2. **"Premium" is enforced only in the browser.** The paywall protects no revenue today — the voucher code ships in the bundle and the gate is a localStorage flag.
3. **You're handling health data (weight, body fat, sex) with no privacy policy, consent, export, or delete.** That's a legal requirement in the UK/EU, not a nicety.

None of these are hard to fix, but they reorder the existing roadmap: **the security gate must come before payments, not after.** See §6 for the remediation plan.

**Risk verdict:** 🟢 fine to keep testing with the voucher · 🔴 **not safe to charge money or run paid ads until §6 Phase A is done.**

---

## 2. What's good (keep doing this)

These are real strengths — worth stating so the criticism below lands in context.

| Strength | Why it matters |
|---|---|
| **API key kept server-side** in the Cloudflare Worker | The right instinct — the Anthropic key never reaches the browser. |
| **Real Supabase auth** via `signInWithIdToken` | `auth.uid()` is a true verified identity, so RLS actually enforces. Many apps get this wrong and fake it client-side. |
| **Row-Level Security correctly scoped** to `auth.uid()` on every table | This is what makes the public anon key safe. The policies are complete and consistent. |
| **Pure logic extracted & unit-tested** (`__tests__/logic.test.js`, 446 lines) | TDEE / macro / streak math is separated from UI and tested — the highest-value thing to test. |
| **Offline-first**: SW + localStorage + offline queue + graceful degradation | A proper PWA. Falls back cleanly when Google/Supabase are unavailable. |
| **Schema migration scaffold** (`SCHEMA_VERSION` / `runMigrations`) | Forward-thinking; you can evolve stored data safely. |
| **`ErrorBoundary`** + no `dangerouslySetInnerHTML` / `eval` | React's auto-escaping plus no raw HTML injection means AI output rendering is XSS-safe. |
| **Thorough docs** (`DOCS.md`, 62 KB) | Rare for a solo project; lowers the bus-factor risk. |

---

## 3. Security findings (ranked)

Severity reflects impact **if this were a paid app**.

### 🔴 SEC-1 — Open, unauthenticated AI proxy (financial DoS / free-Claude-for-everyone)
**`cloudflare-worker.js`**

The worker accepts **any POST from any origin** (`Access-Control-Allow-Origin: *`), with **no authentication, no rate limit, and no input validation**. It forwards the *entire* request body to Anthropic on your key:

```js
const body = await request.json();          // fully attacker-controlled
const response = await fetch("https://api.anthropic.com/v1/messages", {
  headers: { "x-api-key": env.ANTHROPIC_KEY, ... },
  body: JSON.stringify(body),               // model, max_tokens, messages — all theirs
});
```

The endpoint URL ships in `app.js` to every browser, so it is public knowledge. Consequences:

- Anyone can point their own app/script at your worker and use **Claude for free on your dime**.
- An attacker controls `model` and `max_tokens`, so they can pick the most expensive model, max out tokens, and loop → **unbounded Anthropic bill overnight**.
- The client-side "premium" gate (§SEC-2) does nothing to protect this — the endpoint is reachable directly with `curl`.

**This is the reason a paid launch is currently unsafe.** Your roadmap has the auth gate as *Phase 7, after payments* — that ordering is backwards from a risk standpoint.

**Fix (all of):**
1. Verify a Supabase JWT in the worker before proxying (`SUPABASE_JWT_SECRET` secret). Reject anonymous calls.
2. **Server-side allowlist** for `model`; **cap** `max_tokens`; ignore client-supplied values you don't trust.
3. **Per-user rate limit** (Cloudflare KV / Durable Object / Turnstile).
4. Lock CORS to your own origin instead of `*`.
5. Set a **billing alert + hard budget cap / kill-switch** on the Anthropic account as a backstop.

### 🔴 SEC-2 — Premium entitlement is client-side only
**`app.jsx`** — `VOUCHER_CODE = "FreeFoodTips2026"`, `auth_state` in localStorage.

Premium status is a localStorage string (`auth_state = "premium"`) and the voucher code is **hardcoded in the shipped bundle**. Anyone can:
- read the bundle and find the voucher, or
- open DevTools and set `auth_state = premium` directly.

Combined with SEC-1, the paywall protects **zero revenue**. Even once real payments land, entitlement must be **verified server-side** (the worker, on every AI call), never trusted from the client.

**Fix:** Treat the client flag as UI-only. The worker is the source of truth: it checks the JWT → looks up the user's entitlement (Supabase row set by your payment webhook) → allows or refuses. Move the voucher to a server-checked table, not a constant in the bundle.

### 🟠 SEC-3 — No cost ceiling per user even once authenticated
Auth alone stops *anonymous* abuse but not a single malicious/automated paid (or trial) account hammering AI. You need **per-user quotas** (e.g. N AI calls/day) plus the **global budget cap** from SEC-1. Without this, one bad actor on a 30-day free trial = a surprise bill.

### 🟠 SEC-4 — Health data handled with no privacy/consent/export/delete (compliance)
Weight, body fat %, and sex are **special-category health data under UK GDPR (Art. 9)** — a higher bar than ordinary PII. Currently:
- No privacy policy or consent flow.
- Meal descriptions (and coach context) are sent to **Anthropic, a third-party processor**, undisclosed.
- `handleSignOut` clears local keys but **leaves Supabase rows in place** — there is no account/data deletion UI and no data export.

For a paid app on the Play Store this is both a legal requirement and a store-review requirement.

**Fix:** Publish a privacy policy; disclose Anthropic as a processor; add **Export my data** and **Delete my account** (the schema's `ON DELETE CASCADE` on `auth.users` makes deletion clean once you expose a trigger for it); add a consent checkpoint before first cloud sync.

### 🟡 SEC-5 — Worker error passthrough & wildcard CORS (info leak / abuse surface)
The worker returns `err.message` to the client and reflects `ACAO: *`. Minor, but it leaks internal error detail and lets any website call the endpoint. Folds into the SEC-1 fix (lock CORS, return generic errors).

### 🟡 SEC-6 — Last-write-wins sync trusts client-supplied timestamps
Conflict resolution upserts with `updated_at` generated on the client. Clock skew or a tampered client can clobber newer data. RLS contains the blast radius to the user's *own* data, so impact is low — but cross-device users may see silent overwrites. Note it; consider server-side `updated_at` (DB default) as the tiebreaker.

### 🟢 SEC-7 — Supabase anon key in client *(acceptable, but note the dependency)*
Publishing the anon key is by-design for Supabase and is safe **only because RLS is enabled and correct** (it is). The flip side: your entire data-isolation guarantee rests on RLS. A single future table without a policy = a data-exposure incident. **Make "RLS policy + test" a checklist item for every new table.**

---

## 4. Architecture findings (non-security)

### A. The monolith — `app.jsx`, 3,080 lines, ~25 components, one `App` with ~20 `useState`
**Verdict: acceptable today, a growing liability.** The single-file design buys real things — no bundler, no module resolution, drops straight onto GitHub Pages. For a solo dev that's a feature, not a failure. But:
- Navigation, code review, and merge conflicts get harder as it grows.
- No code-splitting; the whole app is one parse.
- A second contributor would struggle.

**Recommendation:** Don't refactor for its own sake. Set a **trigger**: when you add a second developer, or a component crosses ~300 lines, move to a small **Vite** setup that still emits a single static bundle for Pages. You keep the deploy model and gain modules + types.

### B. Dual-write persistence logic is scattered (highest-value refactor)
Every save does "write localStorage, then maybe `syncX` to Supabase," and that pattern is duplicated across ~10 `sync*` functions and inline call sites. This **drift risk** is where data-loss bugs breed.

**Recommendation:** Introduce **one persistence/repository module** — `save(entity, data)` writes local + enqueues remote, `load(entity)` reads local + reconciles. Centralise conflict handling and the offline queue there. This is the single change that most improves correctness and testability.

### C. Silent failure everywhere — 14 empty `catch(e) {}` blocks
Sync and auth failures are swallowed. For a paid app whose promise is "log on any device," a silently failed sync feels like **data loss**.
**Recommendation:** Surface a sync status (you already have `syncMsg` — use it for failures too), and log errors to an observability tool.

### D. No CI / build-and-test gate; committed build artifact can drift
`app.js` (a 247 KB generated file) is committed and served directly, with **nothing enforcing** that it matches `app.jsx`. Tests exist but nothing runs them.
**Recommendation:** Add a GitHub Action: on push, `npm test` + `npm run build`, and either fail if `app.js` is stale or build it in CI. Removes a whole class of "I forgot to rebuild" bugs.

### E. Workflow / file duplication drift
`index.html` **and** `candidate/index.html` must be kept in sync by hand (the design-system note already warns about placeholder colours living in three places). Plus `preview.html`, `seed-data.js`, `features/`, `candidate/` — accumulated scaffolding. Generated `recharts.js` (499 KB) sits beside `vendor/recharts.js`.
**Recommendation:** Single source of truth for `index.html`; delete or clearly quarantine dev-only scaffolding; document which files are canonical.

### F. Manual service-worker cache versioning is a recurring footgun
`sw.js` requires hand-bumping `fuel-log-vN` (currently v27) on every deploy; forgetting it strands users on a stale bundle.
**Recommendation:** Inject a content hash at build time so the cache name changes automatically.

### G. Observability is absent
No error reporting, no AI-cost metric, no worker logs. For a paid product you're blind to failures and spend.
**Recommendation:** Add lightweight error reporting (e.g. Sentry) and log per-request token usage in the worker.

### H. Test breadth
Only pure logic is covered. The Gherkin spec (`features/fuel-log.feature`) appears unwired. Fine for now — the right things are tested first. Add a couple of integration tests around the new persistence layer (B) and the entitlement check (SEC-2) when you build them, since those are the money-and-data paths.

---

## 5. Risk register (one-glance)

| ID | Finding | Severity | Effort | Blocks paid launch? |
|----|---------|----------|--------|---------------------|
| SEC-1 | Open AI proxy → unbounded bill | 🔴 Critical | M | **Yes** |
| SEC-2 | Client-side-only entitlement | 🔴 Critical | M | **Yes** |
| SEC-4 | Health data: no policy/consent/export/delete | 🟠 High | M | **Yes** (legal/store) |
| SEC-3 | No per-user AI quota | 🟠 High | S | Strongly advised |
| SEC-5 | Worker error leak / wildcard CORS | 🟡 Med | S | Bundle with SEC-1 |
| SEC-6 | Client-timestamp last-write-wins | 🟡 Med | S | No |
| SEC-7 | Anon key safety depends on RLS | 🟢 Low | — | No (keep checklist) |
| ARCH-B | Scattered dual-write persistence | 🟠 High | M | No (do before scaling) |
| ARCH-C | Silent `catch {}` failures | 🟡 Med | S | No |
| ARCH-D | No CI; artifact drift | 🟡 Med | S | No |
| ARCH-A | Single-file monolith | 🟢 Low | L | No (set a trigger) |
| ARCH-E/F/G | Duplication / manual SW / no observability | 🟢 Low | S–M | No |

*Effort: S = hours, M = a few days, L = a week+.*

---

## 6. Remediation project plan

This **re-sequences** your existing roadmap so security precedes payments.

### Phase A — "Safe to charge" gate *(do before any real payment or paid ad)*
**Goal: the AI endpoint costs you only what authenticated, entitled, rate-limited users spend.**
- [ ] **SEC-1** Worker: verify Supabase JWT; allowlist `model`; cap `max_tokens`; lock CORS to your origin; return generic errors.
- [ ] **SEC-1** Anthropic account: billing alert + hard monthly budget cap / kill-switch.
- [ ] **SEC-3** Per-user daily AI quota (Cloudflare KV/Durable Object).
- [ ] **SEC-2** Move entitlement server-side: worker checks an `entitlements` row; client flag becomes UI-only; voucher validated server-side.
- *Maps to your existing Phase 7, pulled forward.*

### Phase B — "Legal to charge" gate *(parallel with A)*
- [ ] **SEC-4** Privacy policy; disclose Anthropic as processor; consent before first cloud sync.
- [ ] **SEC-4** Account deletion + data export UI (cascade already in schema).
- [ ] Play Store data-safety form aligned to the above.

### Phase C — Resilience & correctness *(before scaling users)*
- [ ] **ARCH-B** Single persistence/repository module; centralise offline queue + conflict handling.
- [ ] **ARCH-C** Surface sync failures to the user; stop swallowing errors.
- [ ] **ARCH-D** GitHub Action: test + build on push; prevent `app.js` drift.
- [ ] **ARCH-G** Error reporting + per-request token logging.
- [ ] **SEC-6** Use DB-side `updated_at` for conflict resolution.

### Phase D — Then payments (your Phase 6) and the rest of the feature roadmap
- [ ] Google Play Billing / Stripe — now safe because A & B are done.
- [ ] Resume feature work (planned items, AI Chef, etc.).

### Phase E — Maintainability *(opt-in, trigger-based)*
- [ ] **ARCH-A** Move to Vite single-bundle build when a 2nd dev joins or files get unwieldy.
- [ ] **ARCH-E/F** De-duplicate `index.html`; auto-version the SW cache; prune scaffolding.

---

## 7. Bottom line

The engineering instincts here are good and the foundation is sound — this is **not** a rewrite situation. The gap is that the **cost model and the paywall are both open**, and **health-data compliance is unstarted**. Close Phases A and B and you can charge money safely; Phase C makes it trustworthy at scale. The monolith can wait.
