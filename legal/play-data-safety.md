# Google Play — Data Safety form answers (Fuel Log)

> Operational crib sheet for completing the Play Console **Data Safety** section (risk **R9**).
> Fill it in **after** the privacy policy is published and export/delete ship, so every answer is true.
> Version 1.0 · 8 June 2026. **Verify against Play's current form wording when you submit** —
> Google revises labels periodically.

## Top-level declarations
- **Does your app collect or share user data?** → **Yes**.
- **Is all collected data encrypted in transit?** → **Yes** (HTTPS/TLS).
- **Do you provide a way for users to request data deletion?** → **Yes**.
  - Deletion URL: `https://badbadbadbadger.github.io/Fuel-logging/legal/delete-account.html`
    *(update to your final Pages/custom-domain URL)*.
- **Privacy policy URL:** `https://badbadbadbadger.github.io/Fuel-logging/legal/privacy.html`
  *(update to final URL)*.

## Data types — collected / shared

For each: **Collected = Yes**. **Shared** = sent to a third party (Anthropic counts as sharing/processing —
declare conservatively). Purposes: **App functionality** (and **Account management** for identity).
None used for advertising or analytics.

| Play data type | Collected | Shared* | Purpose | Notes |
|---|---|---|---|---|
| Email address | Yes | No | Account management, App functionality | From Google sign-in |
| User IDs | Yes | No | Account management | Google OAuth identifier |
| **Health & fitness** (weight, body fat, sex, weigh-ins, workouts, calories/nutrition) | Yes | **Yes** | App functionality | Weight & body-fat % sent to AI (Anthropic) **without identifiers** |
| App activity / other user-generated content (food/water logs, notes, meal text) | Yes | **Yes** | App functionality | Meal/workout text sent to AI **without identifiers** |
| App info & performance / diagnostics | Minimal | No | App functionality | Server logs only; no analytics SDK |

\* "Shared" here reflects transfer to Anthropic for processing. Confirm how Play wants AI-processor
transfers classified at submission time — if treated as a processor acting on your behalf rather than
independent "sharing," answer accordingly, but **err toward disclosure**.

## Security practices section
- **Data encrypted in transit:** Yes.
- **Users can request deletion:** Yes (in-app + web instructions URL above).
- **Committed to Play Families Policy:** N/A — app is **18+**, not directed at children.
- **Independent security review:** No (do not claim one).

## Consistency checklist (must match before you submit)
- [ ] Every "Yes" above is reflected in the published privacy policy.
- [ ] Health data declared (do not under-declare — common rejection cause).
- [ ] AI/Anthropic transfer reflected in policy §4 and the sub-processor page.
- [ ] Deletion URL and policy URL are live and load without sign-in.
- [ ] No analytics/ads declared (verified: no such SDKs in the bundle).
