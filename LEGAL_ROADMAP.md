# Fuel Log — Legal & Compliance Roadmap

**Purpose:** The authoritative roadmap for Fuel Log's **legal and compliance** work — the legal
counterpart to `SECURITY_ROADMAP.md`. It owns privacy, data-subject rights, lawful basis,
sub-processors, ICO obligations, age/territory scope, and (later) terms of service and
payment-legal items. Its first and current track is **Phase B** (privacy & data rights, closing
threat **T5**); the immediate deliverables are §6–§9.

**Date:** 2026-06-07 (living document — update as legal scope grows)
**Status:** Phase B plan agreed (drafted with the "privacy-counsel" persona — `personas/privacy-counsel.md`).
**Start here:** `START-HERE.md` is the one-screen "where are we / what's next" front door; read it first, then this for the legal/compliance detail.
**Companion docs:** `SECURITY_ROADMAP.md` (security phases & threat model), `ARCHITECTURE_REVIEW.md`, `setup/supabase-schema.sql`.

> ⚠️ **Not legal advice.** This plan was prepared to a pragmatic, defensible standard for a
> solo developer pre-launch. The **Anthropic international-transfer mechanism is now RESOLVED**
> (2026-06-10 — DPA already in force; see §8). One narrow item remains for optional paid review
> before Play Store submission: the **Art. 9 explicit-consent wording** (§7 tier 7g) — and even that
> is downgradeable to a documented self-assessment + free ICO SME-helpline steer.

---

## 1. Scope decisions (locked 2026-06-07)

| Decision | Value | Effect |
|---|---|---|
| **Audience** | **18+ only** | Removes UK Children's Code, GDPR Art. 8, US COPPA work. |
| **Distribution** | **UK + EEA only** (via Play Console country selection) | One regime: **UK GDPR + EU GDPR** (near-identical; one policy covers both). |
| **Controller** | **Individual (sole trader)** — Adrian Richards, **trading as Fuel Log** | Published name + contact (`fuellogadmin@gmail.com`) appear in policy & must appear on ICO register. |
| **Out of scope while this holds** | US state law (CCPA/CPRA), COPPA, Children's Code | Re-engage only if scope expands. |

**Enforcement of scope:**
- Geo: set Play Console **distribution countries = UK + EEA** (EU27 + Iceland, Liechtenstein, Norway). No geo-IP code needed.
- Age: **in-app 18+ affirmation at sign-up** ("I confirm I am 18 or over") + a Terms line. Token affirmation is defensible for this risk profile — **no ID age-verification required**.
- Caveat: "UK/EEA only" is a distribution + terms position, **not** a technical wall (VPN users can evade). Acceptable — regulators look at who you *target and intend to serve*.

---

## 2. Data-flow findings (verified from code, 2026-06-07)

These facts shape the policy and were confirmed by reading the source, not assumed.

### 2.1 Identifiability — **pseudonymisation, not anonymisation**
- All health tables FK-reference `auth.users(id)`: `profiles.sex/weight/body_fat` (`setup/supabase-schema.sql:8-13`), `weigh_ins.weight` (`:60-67`).
- `auth.users` (Google OAuth identity: email, provider sub) lives in the **same Supabase project** (`hvohicddolqpcgzgrbwc`) as the health data, joined by GUID.
- **Conclusion:** the GUID↔identity separation is **logical (schema-level), not custodial**. You hold both. Under **GDPR Recital 26 + Art. 4(5)** this is *pseudonymisation* — the health data remains **identifiable special-category data** and stays fully in scope (Art. 9 applies).
- **Bankable benefit:** counts as a **security measure** under **Art. 32** and **data-protection-by-design** under **Art. 25**. Record it in the RoPA; it lowers breach severity.

### 2.2 Special-category data held
Weight, body-fat %, and sex are **special-category health data (UK GDPR Art. 9)** in a fitness context. Stored in `profiles` and `weigh_ins`.

### 2.3 AI sub-processor transfer (Anthropic) — **minimised, no identifiers**
Verified: the worker forwards **only** `{ model, max_tokens, messages }` — no user_id, token, or email (`cloudflare-worker.js:258-272`). App prompts carry **zero direct identifiers**:

| AI path | Sent to Anthropic | Identifier? | Health data? |
|---|---|---|---|
| Coach tip (`app.jsx:909`) | mode, kcal, protein, water, streak, local hour | None | Aggregate/borderline |
| Workout parse (`app.jsx:1253`) | **weight (kg), body-fat %**, workout text | None | **Yes (special-cat)** |
| Meal parse (`app.jsx:1887`) | free-text meal description (user-typed) | None* | Generally no |
| Re-estimate (`app.jsx:1909`) | a food name | None | No |

\* The meal field is free text — a user *could* type PII into it. Only uncontrolled PII path to the AI (see R10).

- **Conclusion:** special-category data (weight, body-fat) **is** transferred to a **US processor** in the workout path → disclosure + transfer mechanism still required. BUT it goes **unlinked to identity** → strong **data minimisation (Art. 5(1)(c))**, materially lower-risk than a typical integration. Disclosure can accurately say *"limited, pseudonymous health-adjacent data; no identifiers transmitted."*

---

## 3. Phase B risk register (post scope-decision)

Sev = legal/commercial exposure · **Req** = legally required · **BP** = best practice · **NTH** = nice-to-have

| # | Issue | Sev | Class | Fix | Where it lives |
|---|-------|-----|-------|-----|----------------|
| R1 | No privacy policy | High | Req | Publish policy at stable URL | GitHub Pages (§6) |
| R2 | No Art. 9 explicit consent for health data | High | Req | Consent checkpoint before first cloud sync | App + policy (§7); narrow consent-string review before Play (§7 tier 7g) |
| R3 | Anthropic sub-processor undisclosed + transfer mechanism | High | Req | Name in policy; DPA auto-incorporated (in force); cite SCCs Mod 2 + UK Addendum | Policy (§8) — **transfer RESOLVED 2026-06-10** |
| R4 | No data export (Art. 15/20) | Med-High | Req | "Download my data" → JSON | App feature |
| R5 | No account deletion (Art. 17) | High | Req | In-app delete → `ON DELETE CASCADE`; web instructions page | App + GitHub Pages |
| R6 | No 18+ age gate | High | Req | Sign-up affirmation + Terms line | App |
| R7 | ICO data-protection fee unpaid | Med | Req | Register + pay (Tier 1 ~£40/yr, *verify*). **Register with a non-home correspondence address** (PO box / virtual) — the ICO fee-payer register is **public** (name + address). Sole-trader status gives **no exemption** (commercial + special-category data). | Admin |
| R8 | No Records of Processing (RoPA) | Med | Req | One-page internal record (Art. 30) | Internal doc (§9) |
| R9 | Play Data Safety form | High | Req | Complete accurately once R1–R5 exist | Play Console |
| R10 | PII in AI prompts / over-logging | Med | BP+Req | UI hint on meal field; no PII logging | App |
| R11 | No stated retention period | Low-Med | Req | State retention + deletion in policy | Policy (§6) |

**Art. 30(5) note:** the small-org RoPA exemption **does not apply** because you process special-category data — R8 is genuinely required.

---

## 4. Recommended build order

1. **Scope enforcement** (free): Play country selection + 18+ gate (R6).
2. **R5 + R4** — delete & export features (R5 blocks Play launch). Schema `ON DELETE CASCADE` already purges on `auth.users` row deletion.
3. **R1 + R2 + R3 + R11** — policy + consent + Anthropic disclosure + retention (mostly drafting; §6–§8).
4. **R9** — Data Safety form against the now-true state.
5. **R7** — ICO fee + published contact route.
6. **R8, R10** — RoPA + logging hygiene.

---

## 5. Hosting & contact

- **Privacy policy + sub-processor disclosure:** host as static pages on the **existing GitHub Pages** site (`badbadbadbadger.github.io`). Requirements met: public, no-login, stable URL. Suggested path: `/privacy`. Custom domain is **NTH**, not required.
- **Deletion (R5):** GitHub Pages can host the *instructions* page, but a static page **cannot delete data** — the delete *action* must live in the app (or a worker route). Plan for both: instructions page **+** in-app "Delete my account" button.
- **Controller contact:** policy + ICO register need a controller name and contact route. As an individual this risks exposing a home address. **Mitigations:** (a) PO box / virtual business address as published contact; (b) incorporate a Ltd later to put a company + registered office on record instead of a personal address. Decision deferred, but *a* name + contact is required before publishing.

---

## 6. Privacy policy — section-by-section outline (to be written)

Plain English, UK/EEA, 18+. Each section maps to a GDPR transparency requirement (Art. 13/14).

1. **Who we are** — controller identity (name), contact route, "intended for users 18+ in the UK and EEA."
2. **What we collect** —
   - Account: Google account email / identifier (via Google OAuth).
   - **Health data (special category):** weight, body-fat %, sex, weigh-in history.
   - Activity: food/water/workout logs, settings, badges, history snapshots.
   - Technical: minimal (no analytics SDKs currently — confirm before claiming).
3. **Why, and our lawful basis** —
   - Health data → **explicit consent (Art. 9(2)(a))**.
   - Account/app function → **performance of a contract (Art. 6(1)(b))** / **consent**.
4. **AI processing & Anthropic** — meal/workout text and body metrics are processed by **Anthropic (US)** to estimate nutrition/calories; **no identifiers are sent**; link to §8.
5. **Who we share with (processors)** — Supabase (hosting/DB), Cloudflare (worker), Google (auth), Anthropic (AI). Link to disclosure (§8).
6. **International transfers** — data processed in the US by Anthropic under its DPA: **EU SCCs Module Two + UK Addendum** (ICO Approved Addendum B.1.0); see §8.
7. **Retention** (R11) — how long data is kept; deletion purges all rows via `ON DELETE CASCADE`.
8. **Your rights** — access, rectification, erasure, portability/export, withdraw consent, complain to the **ICO** (UK) / lead DPA (EEA). How to exercise each (link to in-app export/delete).
9. **Security** — pseudonymisation (§2.1), RLS, JWT auth, no AI identifiers (Art. 32 measures).
10. **Children** — service is 18+; not directed at children.
11. **Changes & date** — versioned, last-updated date.

---

## 7. Consent plan (R2) — Art. 9 explicit consent

> **Review status (updated 2026-06-10):** decomposed below into free vs paid tasks. The only residual
> paid item is a narrow ~1 hr solicitor review of the consent string + the "genuine local-only
> alternative" argument, scheduled **before Play Store submission** — downgradeable to a documented
> self-assessment + free ICO SME-helpline steer if cash isn't there.

- **Trigger:** before the **first cloud sync** of any health data (weight/body-fat/sex). Today sign-in syncs silently — that must change.
- **Mechanism:** an explicit, unticked, affirmative action (not pre-checked) — e.g. a checkbox + "I consent to Fuel Log storing my health data (weight, body fat, sex) to provide the service" with a link to the policy.
- **Record:** store consent timestamp + policy version (new column/table, service-role or user-owned with RLS).
- **Withdrawable:** withdrawing consent = stop cloud sync and offer deletion (ties to R5).
- **Separate from** the 18+ affirmation (R6) and any marketing consent (none currently).

**Conditionality note (Art. 7(4) / Recital 43):** consent gates *cloud sync only* — the app runs locally
from cache without it — so consent is **not** a condition of using the product. This materially
strengthens "freely given". *Caveat:* keep local-only a **genuine** alternative (real on-device
persistence / export), or the choice looks illusory. The local/cloud split removes the conditionality
problem but **not** the need for explicit Art. 9(2)(a) consent on the sync path ("necessary for the
contract" is an Art. 6 basis, not an Art. 9 gateway).

**Decomposition — free vs paid:**

| # | Sub-task | Who / cost | Status |
|---|---|---|---|
| 7a–7e | Basis reasoning; consent mechanics (unticked/affirmative/granular/withdrawable); consent record; withdrawal path; screen microcopy | Claude + you · free | Mostly built (§13) |
| 7f | Conditionality steer (Art. 7(4)) | Free — de-risked by local/cloud split; optional ICO SME-helpline confirmation | Much reduced |
| 7g | Narrow sign-off: consent string + local-only "genuine alternative" argument — **before Play submission** | Paid · ~1 hr · or documented self-assessment | The only residual £ |

---

## 8. Anthropic sub-processor disclosure (R3)

A short public page (linked from the policy) stating:
- **Processor:** Anthropic (Claude API), United States.
- **What is sent:** meal/workout descriptions and body metrics (weight, body-fat %) for nutrition/calorie estimation.
- **What is NOT sent:** no name, email, account ID, or other identifier (verified — §2.3).
- **Purpose & basis:** service functionality; covered by the Art. 9 consent (§7).
- **Transfer mechanism — RESOLVED 2026-06-10 (free, no solicitor):** Anthropic's **Data Processing Addendum** (effective 24 Feb 2025) is **auto-incorporated by reference** into the Commercial Terms — accepted when API access was purchased — so it is already in force. Customer = controller, Anthropic = processor. It applies the **EU SCCs Module Two (controller-to-processor)** under Commission Implementing Decision (EU) 2021/914, and for UK transfers the **UK Addendum** built on the ICO's Approved Addendum (template B.1.0, s.119A DPA 2018). Anthropic **does not train on Customer Content** (Commercial Terms §B). *Cited verbatim from the live DPA (`anthropic.com/legal/data-processing-addendum`) in `legal/subprocessors.html`; do not assert EU-US DPF certification — the DPA relies on SCCs + UK Addendum, not DPF.*

**Remaining §8 tasks — all free:**

| # | Sub-task | Who / cost | Status |
|---|---|---|---|
| 8c | Quote live DPA's UK-mechanism wording into `subprocessors.html` | Claude · free | ✅ done 2026-06-10 |
| 8d | Transfer Risk Assessment via ICO free TRA tool (belt-and-braces; low-risk — pseudonymised, no identifiers, no training) | Claude + you · free | Recommended before Play |
| 8e | Fetch **countersigned DPA copy** from Anthropic Privacy Center for the compliance file | You · free · ~5 min | To do |

---

## 9. Records of Processing (RoPA) — internal, not published (R8)

One page, kept internally (Art. 30). Minimum fields:
- Controller name + contact.
- Purposes: fitness tracking, nutrition estimation, premium entitlement.
- Categories of data subjects: adult app users (18+, UK/EEA).
- Categories of data: account identifiers, **special-category health data**, activity logs.
- Recipients/processors: Supabase, Cloudflare, Google, Anthropic.
- Transfers: US (Anthropic) — mechanism per §8.
- Retention: per §6.7.
- Security measures: pseudonymisation, RLS, JWT auth, server-side entitlement, no AI identifiers (§2.1, Art. 32).

---

## 10. Open items / decisions still needed

- [x] **Controller identity** — decided: **Adrian Richards, trading as Fuel Log**; public contact
  **fuellogadmin@gmail.com** — *inbox created 2026-06-08, ready to receive rights requests.*
  *Postal address still required for the ICO register only (not the policy) — PO box / virtual
  address recommended.*
- [x] **Anthropic transfer mechanism** — RESOLVED 2026-06-10 (DPA in force; SCCs Mod 2 + UK Addendum; §6.6/§8).
- [ ] **Art. 9 consent wording** — narrow review (§7 tier 7g) before Play; conditionality de-risked by local/cloud split.
- [ ] **Verify** ICO fee amount and that no exemption applies (R7).
- [ ] **Verify** Google Play's current account-deletion policy wording (R5).
- [x] **Confirm** no analytics/tracking SDKs ship in the bundle (§6.2) — **verified 2026-06-08**: only
  Babel `regenerator-runtime` + vendored recharts/supabase; no analytics/ads/tracking SDKs. Policy may state "none".
- [x] **Retention period values** — decided: keep while active; delete within **30 days** of request;
  flag + delete accounts **inactive 24 months**. *Engineering: needs a scheduled job — see §13.*
- [ ] **Pre-payment commercial prerequisites** — Cloudflare hosting migration, domain, business entity (see §12).

---

## 13. Drafted work product & remaining engineering (added 2026-06-08)

**Policy documents drafted** (in `legal/`, ready to host on GitHub Pages; verify final URL base):
- `legal/privacy.html` (R1, R3, R11) · `legal/terms.html` (R6) · `legal/subprocessors.html` (R3, §8)
- `legal/delete-account.html` (R5 instructions) · `legal/ropa.md` (R8, **internal — do not publish**)
- `legal/play-data-safety.md` (R9 crib sheet) · `legal/in-app-copy.md` (R2/R6/R10 strings + schema)

~~Two **[HUMAN-REVIEW]** placeholders are marked inline (HTML comments): the Anthropic transfer
mechanism and the Art. 9 consent wording.~~ **Transfer mechanism RESOLVED 2026-06-10** (§8;
`subprocessors.html` updated, placeholder removed). The remaining consent-wording review (§7 tier 7g)
is narrow and pre-Play. ~~Set up the `fuellogadmin@gmail.com` inbox before publishing.~~ **Inbox
created 2026-06-08.**

**Admin — do next (R7, cheap, ~½ hour):**
- [ ] **Get a non-home correspondence address** — PO box or virtual business address (~£10–30/yr).
  Needed because the ICO fee-payer register and (later) any formal docs are public; keeps your home
  address private. Decide this *before* registering with the ICO so the right address goes on record.
- [ ] **Register + pay the ICO data-protection fee** (Tier 1 ~£40/yr — verify on ico.org.uk) using
  that correspondence address. No sole-trader exemption applies (commercial + special-category data).
  Run the ICO self-assessment and keep the result.

**Engineering — built 2026-06-08** (code complete; `npm run build` + 44 tests green; deploy/manual-test pending):
- [x] In-app **18+ affirmation** at sign-up (R6) — checkbox gates the Google button; stores `age_confirmed_at`.
- [x] In-app **Art. 9 consent gate before first cloud sync** (R2) — checkbox in sign-in flow + retroactive
  `ConsentModal` for existing users / policy-version bumps; stores `health_consent_at` + `consent_policy_version`.
- [x] **Export** ("Download my data" → JSON) (R4) and **Delete my account** (R5) — new **Account & Privacy**
  screen (tap avatar); delete calls worker `/delete-account` (service-role admin delete → cascade).
- [x] **Retention job:** worker `scheduled()` **24-month dormant sweep** (immediate delete already satisfies
  the 30-day promise, so no soft-delete logic needed). **Cron Trigger still to be configured** in Cloudflare.
- [x] Meal-field **PII hint** added; confirmed worker never logs meal/workout text (R10).
- [x] Policy links surfaced in the Account & Privacy screen.

**Deploy runbook (before this counts as live).** *Pre-flight verified 2026-06-10: `npm test` = 44/44
green; `npm run build` produces no diff (committed `app.js` matches `app.jsx`); `sw.js` cache = `v30`.
Only re-build + bump `sw.js` if you touch `app.jsx` again before deploying.*

- [ ] **0. Push the branch** — needs a fresh GitHub token (old PAT deleted). `git push -u origin phase-b-compliance`,
  paste token when prompted. *Note:* GitHub Pages serves from **`main`** (SETUP.md §"Every Deploy"), so the
  `legal/` pages won't publish until this branch is merged to `main` — see step 5.
- [x] **1. Schema migration** — *done 2026-06-10; 4 consent columns verified on live `profiles`.*
  Supabase Dashboard → SQL Editor → New Query. **On the existing
  (Phase 0/A) DB, run ONLY the four `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS …` lines** from
  `setup/supabase-schema.sql` (lines 22–25: `age_confirmed_at`, `health_consent_at`,
  `consent_policy_version`, `health_consent_withdrawn_at`). **Do NOT paste the whole file** — its
  trailing `CREATE POLICY` statements have no `IF NOT EXISTS` and will error on policies that already
  exist (the full file is for a *fresh* DB only). Verify with
  `SELECT column_name FROM information_schema.columns WHERE table_name='profiles' AND column_name IN (…)`
  → expect 4 rows.
- [x] **2. Worker secret** — *done 2026-06-10; `SUPABASE_SERVICE_ROLE` confirmed present in Cloudflare.*
- [x] **3. Deploy the worker** — *done 2026-06-10; latest `cloudflare-worker.js` deployed via dashboard
  editor (adds `/delete-account` route + `scheduled()` sweep).*
- [ ] **4. Cron Trigger** — ⏳ **DEFERRED 2026-06-10 (optional, not blocking — come back to this).**
  worker → Settings → Triggers → Cron Triggers → Add → **`0 3 * * 0`** (weekly, Sun 03:00). Without it
  `scheduled()` never fires (no harm; on-request deletion still works; nothing is near the 24-month
  cutoff yet — `cloudflare-worker.js:375-382`).
- [ ] **5. Publish `legal/` pages** — merge `phase-b-compliance` → `main`; Pages auto-deploys in ~1 min.
  Then load `privacy.html` / `subprocessors.html` / `terms.html` / `delete-account.html` and confirm the
  in-app `LEGAL.*` links resolve.
- [ ] **6. Manual test** (on the live deploy): 18+ gate blocks until checked → health-consent gate before
  first cloud sync → sign-in syncs → **Account & Privacy** screen: "Download my data" returns JSON →
  "Delete my account" calls `/delete-account`, account + all rows gone, re-sign-in starts clean.

---

## 11. Definition of done (Phase B)

A user can **export** and **delete** everything; the **privacy policy** is published and accurately
names what's collected, that **Anthropic** processes meal/workout data in the US (no identifiers),
and that health data is held under **explicit consent**; the **Play Data Safety form** matches
reality; the **ICO fee** is paid; an **18+ gate** and **UK/EEA distribution** are in place.

---

## 12. Pre-payment commercial prerequisites *(must clear before charging any individual)*

Added 2026-06-07. These are **hard gates on Phase D (payments)** — no money is taken from anyone
until all three are done. Cross-ref `SECURITY_ROADMAP.md` Phase D/E.

- [ ] **Fully on Cloudflare.** Migrate the static frontend off **GitHub Pages** onto **Cloudflare
  Pages** before any payment is taken. *Reason:* GitHub Pages' usage terms discourage hosting a
  primarily-commercial / SaaS product; Cloudflare Pages has no such restriction and co-locates with
  the existing worker. The frontend is static (`index.html` + `app.js`; build = `babel app.jsx
  --out-file app.js`), so migration is low-risk. Bonus: serve the worker under the same domain
  (`/api/*`) to drop the CORS handling. The backend (Worker) and DB (Supabase) are already hosted.
- [ ] **Domain.** Choose + register a custom domain (replaces `badbadbadbadger.github.io`). Needed
  for professional identity, a stable privacy-policy URL, Cloudflare Pages, and the Play Store TWA. *TBD.*
- [ ] **Business entity / trading name.** Decide how to trade outside the personal legal name.
  Affects controller identity in the privacy policy (§5) and ICO registration (R7).

> **Note on UK business setup (verify with an accountant — not legal/tax advice):** A **sole
> trader does NOT register with Companies House** — that's only for **limited companies**. A sole
> trader registers for **Self Assessment with HMRC**; to trade under a non-legal name you simply
> adopt a **business/trading name** (no Companies House filing), subject to Companies Act 2006
> business-names rules (show real name + address on formal docs; avoid "sensitive" words; can't
> imply Ltd). **Companies House registration = forming a limited company** — separate legal entity,
> limited liability, keeps your personal name off the privacy policy / ICO register, but more admin,
> corporation tax, and public director/registered-office records. Fork: *sole trader + trading name*
> (simplest) vs *Ltd* (liability shield + name separation).
