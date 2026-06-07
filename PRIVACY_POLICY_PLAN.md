# Fuel Log — Privacy Policy & Data-Rights Plan (Phase B)

**Purpose:** A complete, build-ready plan for the privacy policy, consent, sub-processor
disclosure, and data-subject-rights work required by **Phase B** of `SECURITY_ROADMAP.md`
(closes threat **T5**). This is the *blueprint*; the next step is turning §6–§9 into published
pages and app features.

**Date:** 2026-06-07
**Status:** Plan agreed (drafted with the "privacy-counsel" persona — `personas/privacy-counsel.md`).
**Companion docs:** `SECURITY_ROADMAP.md` (Phase B), `ARCHITECTURE_REVIEW.md`, `setup/supabase-schema.sql`.

> ⚠️ **Not legal advice.** This plan was prepared to a pragmatic, defensible standard for a
> solo developer pre-launch. Two items are flagged **[HUMAN-REVIEW]** for a jurisdiction-admitted
> solicitor before publishing: the **Art. 9 explicit-consent wording** and the **Anthropic
> international-transfer mechanism**.

---

## 1. Scope decisions (locked 2026-06-07)

| Decision | Value | Effect |
|---|---|---|
| **Audience** | **18+ only** | Removes UK Children's Code, GDPR Art. 8, US COPPA work. |
| **Distribution** | **UK + EEA only** (via Play Console country selection) | One regime: **UK GDPR + EU GDPR** (near-identical; one policy covers both). |
| **Controller** | **Individual (sole trader)** — Adrian Richards | Controller name + contact must appear in policy & ICO register. |
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
| R2 | No Art. 9 explicit consent for health data | High | Req | Consent checkpoint before first cloud sync | App + policy (§7) **[HUMAN-REVIEW]** |
| R3 | Anthropic sub-processor undisclosed + transfer mechanism | High | Req | Name in policy; accept Anthropic DPA; confirm US transfer safeguard | Policy (§8) **[HUMAN-REVIEW]** for transfer |
| R4 | No data export (Art. 15/20) | Med-High | Req | "Download my data" → JSON | App feature |
| R5 | No account deletion (Art. 17) | High | Req | In-app delete → `ON DELETE CASCADE`; web instructions page | App + GitHub Pages |
| R6 | No 18+ age gate | High | Req | Sign-up affirmation + Terms line | App |
| R7 | ICO data-protection fee unpaid | Med | Req | Register + pay (~£40/yr, *verify*) | Admin |
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
6. **International transfers** — data processed in the US by Anthropic under [mechanism — **[HUMAN-REVIEW]**: Anthropic DPA SCCs / UK IDTA / DPF].
7. **Retention** (R11) — how long data is kept; deletion purges all rows via `ON DELETE CASCADE`.
8. **Your rights** — access, rectification, erasure, portability/export, withdraw consent, complain to the **ICO** (UK) / lead DPA (EEA). How to exercise each (link to in-app export/delete).
9. **Security** — pseudonymisation (§2.1), RLS, JWT auth, no AI identifiers (Art. 32 measures).
10. **Children** — service is 18+; not directed at children.
11. **Changes & date** — versioned, last-updated date.

---

## 7. Consent plan (R2) — Art. 9 explicit consent **[HUMAN-REVIEW]**

- **Trigger:** before the **first cloud sync** of any health data (weight/body-fat/sex). Today sign-in syncs silently — that must change.
- **Mechanism:** an explicit, unticked, affirmative action (not pre-checked) — e.g. a checkbox + "I consent to Fuel Log storing my health data (weight, body fat, sex) to provide the service" with a link to the policy.
- **Record:** store consent timestamp + policy version (new column/table, service-role or user-owned with RLS).
- **Withdrawable:** withdrawing consent = stop cloud sync and offer deletion (ties to R5).
- **Separate from** the 18+ affirmation (R6) and any marketing consent (none currently).

---

## 8. Anthropic sub-processor disclosure (R3)

A short public page (linked from the policy) stating:
- **Processor:** Anthropic (Claude API), United States.
- **What is sent:** meal/workout descriptions and body metrics (weight, body-fat %) for nutrition/calorie estimation.
- **What is NOT sent:** no name, email, account ID, or other identifier (verified — §2.3).
- **Purpose & basis:** service functionality; covered by the Art. 9 consent (§7).
- **Transfer mechanism:** **[HUMAN-REVIEW]** — accept Anthropic's DPA; confirm the US transfer safeguard (SCCs / UK IDTA / EU-US DPF) and cite it. *Do not assert Anthropic's certification status without verifying their current DPA.*

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

- [ ] **Controller contact address** — home / PO box / future Ltd? (§5)
- [ ] **[HUMAN-REVIEW]** Art. 9 consent wording (§7) and Anthropic transfer mechanism (§6.6/§8).
- [ ] **Verify** ICO fee amount and that no exemption applies (R7).
- [ ] **Verify** Google Play's current account-deletion policy wording (R5).
- [ ] **Confirm** no analytics/tracking SDKs ship in the bundle before the policy claims "none" (§6.2).
- [ ] Retention period values (how long after last activity / after deletion request).

---

## 11. Definition of done (Phase B)

A user can **export** and **delete** everything; the **privacy policy** is published and accurately
names what's collected, that **Anthropic** processes meal/workout data in the US (no identifiers),
and that health data is held under **explicit consent**; the **Play Data Safety form** matches
reality; the **ICO fee** is paid; an **18+ gate** and **UK/EEA distribution** are in place.
