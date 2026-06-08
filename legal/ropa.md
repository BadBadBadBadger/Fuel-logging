# Records of Processing Activities (RoPA) — Fuel Log

> **INTERNAL DOCUMENT — not published.** Kept under UK GDPR Art. 30. The small-org exemption
> (Art. 30(5)) does **not** apply because Fuel Log processes special-category health data.
> Version 1.0 · Last updated 8 June 2026 · Closes risk **R8** in `LEGAL_ROADMAP.md`.

## Controller
- **Name:** Adrian Richards, trading as Fuel Log (individual sole trader, United Kingdom).
- **Contact:** fuellogadmin@gmail.com
- **DPO:** Not required (no large-scale/systematic monitoring at scale); none appointed.

## Purposes of processing
- Provide a fitness/nutrition tracking app and sync user data across devices.
- Estimate calories/nutrition from meal and workout descriptions.
- Manage premium entitlement (when payments are introduced — not yet live).

## Categories of data subjects
- Adult app users (18+), distributed to the UK and EEA only.

## Categories of personal data
- **Account identifiers:** Google account email and OAuth account identifier.
- **Special-category health data (Art. 9):** weight, body-fat %, sex, weigh-in history.
- **Activity & app data:** food/water/workout logs, goals, settings, badges, history snapshots.
- **Technical:** minimal connection/server logs. No analytics, advertising, or tracking SDKs.

## Lawful bases
- Health data → **explicit consent** (Art. 9(2)(a)), captured before first cloud sync.
- Account / app functionality → **contract** (Art. 6(1)(b)) and/or consent.

## Recipients / processors
| Processor | Role | Location |
|---|---|---|
| Supabase | DB & auth hosting | EU |
| Cloudflare | App delivery & API worker | Global edge (UK/EEA serving) |
| Google | Sign-in (OAuth) | Global |
| Anthropic, PBC | AI nutrition/calorie estimation | United States |

## International transfers
- US transfer to **Anthropic** for AI estimation. Data sent **without identifiers**.
- Safeguard: appropriate safeguards under Anthropic's DPA (SCCs / UK IDTA where applicable).
  **[HUMAN-REVIEW]** — verify the exact mechanism and cite it.

## Retention
- Kept while the account is active.
- Deleted within **30 days** of a deletion request.
- Accounts inactive (no sign-in) for **24 months** are flagged and deleted.
- Deletion performed via database cascading delete (`ON DELETE CASCADE` from `auth.users`).

## Technical & organisational security measures (Art. 32)
- **Pseudonymisation** of health data (GUID-keyed; identity logically separated) — also Art. 25 by-design.
- **Row-level security (RLS)** so each user can access only their own rows.
- **JWT-based authentication**; server-side (service-role) entitlement checks.
- **No identifiers** transmitted to the AI sub-processor.

## Data breach notes
- ICO notification within 72 hours where the breach is likely to risk individuals' rights.
- Lowered severity due to pseudonymisation and no-identifier AI path.
