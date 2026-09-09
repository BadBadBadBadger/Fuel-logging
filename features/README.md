# Feature specs — index

**Updated:** 2026-09-04. **34 files · 300 scenarios.** Replaces the single
`features/fuel-log.feature` (1,065 lines, 25 Features), split one file per Feature on 2026-08-16.

> **These specs are documentation, not tests.** Nothing executes them — there is no Cucumber runner
> in `package.json`. They are the **source of truth for UX decisions** (colour thresholds, warning
> copy, animation timing, safety rules), and are updated *before* an implementation change.
> The executable coverage lives in `__tests__/logic.test.js` (Jest) and `e2e/` (Playwright).

## Conventions

- **One `Feature:` per file.** Filenames are `NN-short-name.feature`, numbered within their folder.
- **Comment headers are load-bearing.** The `#` block above each `Feature:` carries the build date,
  the decisions and which hat made them, and the "removed by design" notes. Read it before the
  scenarios; it explains why the scenarios say what they say.
- **Tags:** `@wip` = built, device-verification pending. `@draft` = specified, not built.
  Untagged = built and verified. `@founder-blocking` (introduced `dashboard/04`, 2026-08-27) =
  a specific scenario, not a whole file, needs an explicit founder decision before it's real —
  more precise than isolating an entire section in its own `@draft` file when only a couple of
  scenarios in it actually block.
- **Numbers contract** (`energy-safety/`, `08` included): every kcal figure shown against a body is
  *derived*, never hardcoded. Exact arithmetic is owned by `__tests__/logic.test.js`.

## profile/ — who you are and how it's shown

| File | Feature | Scen |
|---|---|---|
| [01-sex-setting](profile/01-sex-setting.feature) | Sex setting on profile screen | 5 |
| [02-body-fat-guidance](profile/02-body-fat-guidance.feature) | Body fat % guidance on profile screen | 2 |
| [03-display-units](profile/03-display-units.feature) | Independent metric / imperial display units | 17 |
| [04-weight-sync](profile/04-weight-sync.feature) | Weight input sync — weigh-in updates profile weight | 1 |

## targets/ — what the daily numbers are

| File | Feature | Scen |
|---|---|---|
| [01-daily-target-modes](targets/01-daily-target-modes.feature) | Flexible daily calorie target with auto mode detection | 13 |
| [02-tap-to-override](targets/02-tap-to-override.feature) | Tap to override daily calorie target | 5 |
| [03-macro-floors](targets/03-macro-floors.feature) | Macro targets hold their floors instead of scaling | 7 |
| [04-safe-minimum-backstop](targets/04-safe-minimum-backstop.feature) | Safe minimum calorie guard (last-resort backstop) | 5 |

> `04` is the flat `SAFE_MIN` (1,400 male / 1,200 female) — the **last-resort backstop only**, not the
> primary protection. The floors that actually protect a body are in `energy-safety/01` and `/08`.

## energy-safety/ — the protections that move a number

Sequenced by `ENERGY_MODEL.md` §5. `01`–`07` are the original workstream; **`08` joined on
2026-08-16**, moved out of `fuel-log.feature` where it sat apart from the work it belongs to.

| File | Feature | Scen | |
|---|---|---|---|
| [01-energy-availability-floor](energy-safety/01-energy-availability-floor.feature) | A body-sized floor replaces the flat calorie floor | 12 | built |
| [02-cut-cycle-blocks](energy-safety/02-cut-cycle-blocks.feature) | Cut runs as load-weighted blocks | 14 | built |
| [03-diet-break-intervention](energy-safety/03-diet-break-intervention.feature) | A break is time not cutting | 22 | built |
| [04-adaptive-tdee-guardrails](energy-safety/04-adaptive-tdee-guardrails.feature) | The app's own guess can't talk you into under-eating | 10 | built |
| [05-low-energy-availability-flags](energy-safety/05-low-energy-availability-flags.feature) | LEA symptom check and signposting | 11 | **shelved** (§5.5) |
| [06-weigh-in-engagement](energy-safety/06-weigh-in-engagement.feature) | Encouraging weigh-ins without pressure | 11 | built |
| [07-smoothed-earn-to-eat](energy-safety/07-smoothed-earn-to-eat.feature) | Spreading earned workout calories across days | 8 | built |
| [08-maintenance-bmr-floor](energy-safety/08-maintenance-bmr-floor.feature) | Maintenance never floored below sedentary TDEE (BMR × 1.2) | 5 | built |

## dashboard/ — how the day reads at a glance

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-calorie-tolerance](dashboard/01-calorie-tolerance.feature) | Calorie tolerance — forgiving colour logic | 5 | |
| [02-macro-tolerance](dashboard/02-macro-tolerance.feature) | Macro tolerance — forgiving colour logic | 4 | **superseded** |
| [03-budget-confidence](dashboard/03-budget-confidence.feature) | Calorie-budget confidence (Separated model) | 4 | |
| [04-intake-scoring](dashboard/04-intake-scoring.feature) | Daily and weekly intake scoring (red / amber / green) | 38 | `@draft` |
| [05-intake-score-card-layout](dashboard/05-intake-score-card-layout.feature) | Intake score card layout — both timeframes visible, no swipe | 2 | `@draft` |

> **`04` supersedes `02`.** `02`'s flat "any macro, 5g/15g over = amber/red, under is always
> fine" model treated protein/carbs/fat as interchangeable and is what gave the dashboard its
> arbitrary macro-bar colours in the first place. `04` replaces it with roles (protein = floor,
> calories = master constraint, fat = floor + ceiling, carbs = flex) plus a rolling 7-day weekly
> read. `01`'s calorie bands are kept, not reopened. `04` carries several items the handover
> it's built from deliberately left open — band widths, hero priority order, the day-close
> fallback hour — proposed inline and flagged, awaiting founder sign-off before the `@draft` tag
> comes off. Delete `02` once `04` is built.
>
> **`04` went through two swarm review rounds on 2026-08-27.** Round 1 — an independent
> QA-automation pass and a Critical-Thinking pass (new persona, `personas/critical-thinking.md`),
> each cross-examining the other's findings before a synthesis pass fixed what had a clean
> answer and flagged what didn't. Two items were ranked above everything else in `04`'s header as
> `@founder-blocking`, both pushing toward under-eating for exactly the population this app
> protects: the weekly "reads as" comparator could tell someone pinned at their own safety floor
> they "haven't really cut," and an unlogged day could outscore an honestly-logged bad one on a
> Cut. Round 2 — a third persona (`personas/nutrition-coach.md`) joined QA and Critical-Thinking
> for an atomicity + file-structure pass. The three reviewers landed on three different
> structural opinions (keep one file / split three ways / split a different way) before QA, whom
> the founder tasked with the final call, reconciled them: **`05` was split out for presentation
> only** — ring geometry and card composition — while daily and weekly grading stay permanently
> together in `04`, because the weekly read is only ever correct in reference to the daily floor
> logic that feeds it. Full transcript of both rounds:
> [`04-intake-scoring-swarm-review.md`](dashboard/04-intake-scoring-swarm-review.md).
>
> **Both `@founder-blocking` items were decided 2026-09-04**, tags removed: the weekly baseline
> stays TDEE-based, but a week where a safety floor held the target up on 4+ of 7 days now reads
> as "cut" outright instead of running the band comparison — no lower number was ever on offer.
> An unlogged day is now excluded from the weekly average rather than counted as a favourable
> 0 kcal, and the weekly summary always states how many of the 7 days it's actually built from.
> Raised separately in the same conversation: `SAFE_MIN`'s flat 1400/1200 value is a known,
> previously-shelved flaw (`targets/04-safe-minimum-backstop.feature`,
> `ARCHITECTURE_REVIEW.md` §4.I) — tracked as its own piece of work, not part of this fix.

## logging/ — getting food into the log

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-edit-entry](logging/01-edit-entry.feature) | Edit a logged entry in place | 5 | |
| [02-quick-add-ai-estimate](logging/02-quick-add-ai-estimate.feature) | AI estimate when creating a Quick Add meal | 7 | |
| [03-repeat-add-feedback](logging/03-repeat-add-feedback.feature) | Repeat-add feedback — re-blink and count | 6 | |
| [04-meal-data-integrity](logging/04-meal-data-integrity.feature) | Structured elements are the source of truth | 4 | `@wip` |
| [05-ai-meal-capture](logging/05-ai-meal-capture.feature) | AI meal capture via text, voice, or photo | 23 | `@wip` |

> `05` was promoted from the old `features/ai-capture.feature` on 2026-08-16. That file held the
> richer spec (and the 4-hat design rationale) while calling itself non-authoritative; the condensed
> copy in `fuel-log.feature` was the one labelled canonical. The two are now one file, with the four
> assertions unique to the `fuel-log.feature` copy carried in and marked as such.

## coach/ — what the daily coach is allowed to say

| File | Feature | Scen |
|---|---|---|
| [01-state-aware](coach/01-state-aware.feature) | Coach is state-aware and varies its suggestions | 4 |
| [02-pacing](coach/02-pacing.feature) | Coach paces advice to the time of day | 9 |
| [03-dietary-requirements](coach/03-dietary-requirements.feature) | Dietary requirements and allergies steer every AI suggestion | 11 |

> `02` and `03` carry safeguarding rules from the coach-hat review — the calorie ceiling is never
> paced as "behind", and a declared allergen is filtered twice (prompt + output scan). Don't relax
> either without re-running that review.

## app-shell/ — chrome, platform and appearance

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-top-aligned-nav](app-shell/01-top-aligned-nav.feature) | Pages open at the top | 3 | |
| [02-premium-avatar](app-shell/02-premium-avatar.feature) | Premium account avatar with fallback | 4 | |
| [03-appearance-theme](app-shell/03-appearance-theme.feature) | Light, dark or system theme | 9 | |
| [04-haptics](app-shell/04-haptics.feature) | Haptic feedback on every Create, Update and Delete | 7 | `@wip` |

## engagement/

| File | Feature | Scen |
|---|---|---|
| [01-logging-celebration](engagement/01-logging-celebration.feature) | Quiet daily, fanfare for the rare | 7 |
