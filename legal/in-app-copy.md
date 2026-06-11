# In-app legal copy & UX requirements (for the engineer)

> The user-facing strings and flows the app must implement to make the published policies true.
> Maps to risks **R2** (consent), **R6** (18+ gate), **R10** (PII hint), and supports **R4/R5**.
> Version 1.0 · 8 June 2026. Wire these into `app.jsx`; bump `sw.js` cache version on build.
>
> ⚠️ **[HUMAN-REVIEW — narrow]** the Art. 9 consent wording (§2 below) before **Play submission** —
> see `LEGAL_ROADMAP §7` tier 7g. Conditionality is de-risked (local-only use needs no consent), so this
> is a ~1 hr review or a documented self-assessment + free ICO SME-helpline steer, not open-ended drafting.

---

## 1. 18+ age affirmation (R6) — at sign-up

Shown once, before/at first sign-in. Must be an **affirmative, unticked** action.

> ☐ **I confirm I am 18 years of age or older.**

- Block account creation until checked.
- Store: `age_confirmed_at` (timestamp).
- Pair with a visible line near the sign-in button:
  *"Fuel Log is for adults (18+) in the UK and EEA. By continuing you agree to our
  [Terms](terms.html) and [Privacy Policy](privacy.html)."*

---

## 2. Explicit health-data consent (R2) — before first cloud sync  **[HUMAN-REVIEW — narrow, see header]**

**Trigger:** before the *first* time any health data (weight / body-fat % / sex) is synced to the
cloud. Today sign-in syncs silently — that must change. Local-only use needs no consent; the consent
gate is specifically about cloud storage.

Modal copy (checkbox **unticked** by default):

> **Storing your health data**
>
> To track your progress and give you coaching, Fuel Log needs to store health information —
> your **weight, body fat %, sex, and any dietary requirements and allergies you enter** — in the
> cloud. We also send meal/workout descriptions, body metrics and your dietary needs to our AI
> provider (Anthropic, US) to estimate nutrition and tailor suggestions, **without any information
> that identifies you**. (Some diet choices, e.g. halal/kosher, may reveal religious belief — also
> covered by this consent.)
>
> ☐ **I explicitly consent to Fuel Log storing and processing my health data** as described in the
> [Privacy Policy](privacy.html).
>
> [ Agree & continue ]   [ Not now ]

- "Not now" → keep data local only; do not sync; allow retry later.
- Store on agree: `health_consent_at` (timestamp) **and** `consent_policy_version` (e.g. "1.0").
- **Withdrawable:** a Settings toggle "Withdraw health-data consent" → stop cloud sync + offer
  "Delete my account". Record `health_consent_withdrawn_at`.

**Schema note (add a table or columns):**
```sql
-- consent tracking (service-role written, or user-owned with RLS)
alter table profiles
  add column if not exists age_confirmed_at        timestamptz,
  add column if not exists health_consent_at        timestamptz,
  add column if not exists consent_policy_version   text,
  add column if not exists health_consent_withdrawn_at timestamptz;
```

---

## 3. Meal-field PII hint (R10)

Helper text under the free-text meal description input:

> *Tip: just describe the food (e.g. "two eggs and toast"). No need to include personal details —
> meal text is sent to our AI to estimate nutrition.*

Also: ensure meal/workout text is **not written to server logs** (R10 logging hygiene).

---

## 4. Export — "Download my data" (R4)

Settings → **Download my data** → produces a JSON file of all the user's rows
(profile, weigh-ins, logs, settings, badges, history). Client-side assembly is fine since the data is
already loaded; otherwise a worker route reading via service role scoped to the user.

---

## 5. Delete — "Delete my account" (R5)

Settings → **Delete my account** → confirm → delete the `auth.users` row (cascades to all health/app
tables via `ON DELETE CASCADE`). Show success and sign the user out. Mirror the web instructions at
`legal/delete-account.html`.

---

## 6. Footer / Settings links

Add links to the published pages from Settings and/or the app footer:
[Privacy Policy](privacy.html) · [Terms](terms.html) · [Sub-processors](subprocessors.html) ·
[Delete my account](delete-account.html).
