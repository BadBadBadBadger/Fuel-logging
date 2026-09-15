# Feature specs — index

**Updated:** 2026-09-15. **44 files · 457 scenarios.** Replaces the single
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

## body/ — measuring composition, not just weight

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-measurement-tracking](body/01-measurement-tracking.feature) | Weekly body measurements and Navy-method body-fat % tracking | 33 | `@wip` |
| [02-measurement-feedback-and-history](body/02-measurement-feedback-and-history.feature) | Body measurements in History, and what a save reports back | 37 | `@wip` |

> **`02` is new, 2026-09-11 — presentation and feedback only**, the same logic-vs-presentation
> split `dashboard/04` and `05` already established. `01` stores weekly tape readings and charts
> them; nothing else in the app knew they existed. `02` puts the weight and the day's reading on
> the History day rows and in the day detail, reports what moved when a measurement is saved, and
> carries body data into the CSV export. **Every value is a lookup by date over `weighIns[]` and
> `bodyMeasurements[]` — no new database column and no new sync-payload field**, because a column
> that does not exist in Postgres makes the whole upsert fail with no visible error, which is what
> cost this repo its own history sync the same morning.
>
> It carries **founder decision 4 of four taken on 2026-09-11**
> ([`02-founder-decisions.md`](body/02-founder-decisions.md), which also holds the arithmetic
> behind all four): every site change is shown immediately, at any size, coloured, with the weight
> graph's own visual language — a proposed 1cm noise threshold was overruled outright, because the
> raw number should be reported honestly and the average line over several readings is the thing
> that says whether it is real. **Decisions 1–3 change `01`'s engine and its stored shape and are
> NOT in `02`'s scope** — `SYNC_GATE`, `TREND_MIN_POINTS`, `BF_SYNC_STEP_CAP` and the conditions
> note are untouched; decision 2 needs a database column run before any code writes it.
>
> A six-persona swarm (design-lead → nutrition-coach → engineering → qa-automation →
> critical-thinking → anti-metaphor, each answering every earlier report) made two calls the
> founder did not, both named in the feature's own header so he can reverse them in one line:
> **neck's change is shown at full size but carries no direction colour** (under the Navy formula
> a bigger neck computes a *leaner* result, so the waist rule applied to neck would paint a
> shrinking neck as the bad news — for a lifter in a deficit, backwards); and **the body-fat
> figure gets no reading-to-reading change, only the 30-day one**, which is what `01` had already
> decided and what the founder's own arithmetic argues for (±0.67 points of tape slip against 0.40
> points for a real week). The review also found a **live defect in shipped code**: History's
> "since last month" body-fat card compared the newest reading against itself when every reading
> was older than a month, reporting a change of 0 — "your body fat has not moved in a month" when
> nothing had been measured in a month. Fixed, with a test naming the case.
>
> **A design-lead follow-up the same day added two more surfaces**, both inside the same
> boundary: a **`📐 Tape` chip** drawing neck and waist (and hip when the readings have one) as
> separate lines on one shared centimetre axis — one chip and one chart, because the Navy
> formula reads waist *minus* neck, so the distance between those lines is the formula's own
> input and two separate charts would hide it; and the **body fat % tooltip becomes a
> diagnostic**, carrying the raw tape sites behind that point (waist first) and how long since
> the previous reading. Every row that has nothing to say is omitted outright — no average
> before one exists, no hip on a male reading, no interval on the first reading, and never a
> dash in their place. The per-reading conditions note would be the strongest line in that
> tooltip and is deliberately **not** built: it needs decision 2's `note TEXT` column first,
> and the feature file names it as the next step so it isn't lost. Full transcript:
> [`02-swarm-review.md`](body/02-swarm-review.md). Jest 370/370, Playwright 113/113, sw v81.

> **`01`** was new 2026-09-09, through three rounds: (1) a design-lead + nutrition-coach shaping pass, each
> reviewing the founder's handover cold and blind to the other; (2) a solo Critical-Thinking pass
> on the resulting spec, finding real gaps beyond the two items already flagged; (3) a QA +
> Engineering (`personas/engineering.md`, new — created for this round) + Design-Lead debate,
> each forming an independent position, cross-reading the other two, then Critical Thinking
> moderating the close-out. The feature computes a body-fat % estimate from weekly tape
> measurements (US Navy method — height, neck, waist, +hip for female) and trends it the same way
> weight already gets a rolling-average "truth layer" (`weighRollingAvg`, app.jsx:657). Both
> original `@founder-blocking` items (the sync mechanism, the tap-cost of double-measuring) were
> resolved through the debate rather than left for the founder to pick blind — silent sync, no
> confirm dialog, because the synced value is transparently visible on Profile after every write;
> soft, dismissible tip. The debate's own sanity-check against the founder's success criterion
> (simple, intuitive, accurate and supportive) surfaced a gap none of the three specialists caught
> on their own: a symmetric sync cap would have delayed the app's own lean-body safety check
> exactly when a real recomposition (falling body fat) is happening — fixed by reusing
> `runCalibration`'s existing cutting-aware asymmetry rather than inventing new machinery. One
> item stays genuinely open, correctly deferred rather than guessed: whether a reading taken after
> a multi-month gap deserves less trust going in (a measurement-protocol question, not an
> averaging-math one). Full transcript, all three rounds:
> [`01-measurement-tracking-swarm-review.md`](body/01-measurement-tracking-swarm-review.md).

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
| [09-adaptive-tdee-raise-safeguards](energy-safety/09-adaptive-tdee-raise-safeguards.feature) | A raise needs fresh evidence, and can undo its own recent mistake while cutting | 9 | built |
| [10-workout-burn-calibration-credit](energy-safety/10-workout-burn-calibration-credit.feature) | Calibration credits real training burn instead of reading it as a higher metabolism | 5 | built |
| [11-intake-window-and-cut-evidence](energy-safety/11-intake-window-and-cut-evidence.feature) | The calibration intake window, and the evidence that gates a lowering | 8 | built |

> **`09` and `10` are new, 2026-09-11**, both written from a live bug report rather than a planning
> pass: the founder's own adaptive adjustment hit its +600 cap in five days off two days of mostly-
> water weight loss. A QA/Nutrition-Coach/Critical-Thinking/Engineer swarm reproduced `09`'s bug
> exactly against his real Supabase data (`09-tdee-raise-runaway-bug-swarm-review.md`) and found two
> compounding defects in `runCalibration`: a raise can be re-credited off substantially the same
> short-lived swing as new weigh-ins trickle through overlapping 7-day windows (Fix A), and file
> `04`'s own cutting-aware refusal — correct for genuine lowering evidence — had no way to instead
> undo its own recent bad raise (Fix B). `04`'s asymmetry is not reopened; its "Good news still
> arrives at full speed" scenario got a small `REFINED` note pointing here. Both proposed constants
> (`RAISE_MIN_INTERVAL_DAYS`=7, `RAISE_REVERSAL_WINDOW_DAYS`=21) were confirmed by the founder the
> same day. Mid-session the founder raised a THIRD, independent suspicion — the activity multiplier
> and/or logged workouts inflating the estimate — and a Critical-Thinking pass confirmed a real,
> deterministic (not noise) defect: `runCalibration` compared intake against `baseTDEE` alone,
> never crediting the earn-to-eat bonus already baked into the target, so a trained, on-target week
> manufactured a false raise every time, with no bad luck required. That fix, scoped separately on
> the Critical Thinker's own recommendation because it's a different failure class than `09`'s noise
> bug, is `10`. Both built same-day: Jest 329/329, Playwright 92/92, sw v79.

> **`11` is new, 2026-09-13.** Three changes to `runCalibration`, all found while reviewing a
> History bug report and none of them in it. Two are the same off-by-one as FL-001, sitting where
> it moves the **calorie target** rather than a label: the intake window spanned eight keys, so a
> week with four CUT days read as *not* cutting and unlocked a lowering; and a part-finished today
> entered the intake average, more than doubling the apparent estimate error in the lowering
> direction. The third is founder decision **Q3**: "was I cutting" is now measured from what was
> **eaten** (`avgDeficit`, already computed three lines above the refusal) rather than from the
> day's declared mode. The prose above that refusal always said the rule was about *"eating below
> maintenance"* — it just read labels instead. It had to change before
> `history/02` shipped, because a label is now editable and a CUT→MAINTAIN edit could otherwise
> lift the refusal and let a target lowering through at the next weigh-in, fired later and not
> undone by putting the label back. File `04`'s asymmetry itself is untouched.

## history/ — reading back what happened

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-range-windows-and-averages](history/01-range-windows-and-averages.feature) | History range windows, averages and the labels that name them | 21 | built |
| [02-correcting-a-past-day](history/02-correcting-a-past-day.feature) | Correcting a past day's mode and calorie target | 11 | built |

> **Both are new, 2026-09-13**, written from a ten-item bug report the founder found by eye on his
> own phone — kept verbatim as [`history/00-bug-report.md`](history/00-bug-report.md). A six-persona
> swarm (QA, engineering, nutrition-coach, design-lead, critical-thinking, anti-metaphor) reviewed
> it independently, then a critical-thinking-chaired debate ruled on every conflict; all eight
> reports are in [`history/swarm/`](history/swarm/), and `07-debate.md` is the decisive one.
>
> **His arithmetic verified exactly, all of it** — 17,569/7 = 2,510 against the 2,196 on screen.
> **Two of his diagnoses did not**, and both are recorded as WON'T FIX in `01`'s header with the
> reasoning: no day's mode reaches `weeklyIntakeScore`, so the amber week he reported was correct
> arithmetic rather than a scoring bug (FL-003), and an abandoned log cannot be detected from
> stored data without being wrong on exactly the days `02` now encourages (FL-007).
>
> **The load-bearing idea in `01` is that the screen has three windows, not one** — the rows, the
> average, and the label that names them — and FL-001 happened because one expression tried to be
> all three. Three findings outranked the report itself: the smoothed weight line it asked the
> headline to agree with was *itself* wrong (**FL-013**, Critical — an expanding reading-count
> window drew +0.30 kg on a perfectly flat week); the dashboard's weekly ring counted today as a
> whole day (**FL-011**, now `dashboard/06`); and the same off-by-one sat on the calorie-target
> path (**FL-012**/**FL-014**, now `energy-safety/11`).
>
> **`02` overrides the swarm.** The review refused FL-010 as specified, because recomputing a past
> target needs inputs that were never stored and because a mode edit could unlock a target
> lowering. The founder's answer dissolved both: compute the target once when the mode is tapped
> and **store** it, with a manual override — deterministic because it is never re-derived on read.
> It also needed **no migration**, which was checked rather than assumed: every field it writes is
> already in the `history_snapshots` upsert.
>
> **A note on the swarm reports:** they are frozen at the moment they were written and are not
> maintained. Several of them, and `07-debate.md`, refer to a `history/RESUME.md` — that was a
> mid-session handover written when the usage allowance was about to run out, and it has been
> deleted now the work is done. Its content is superseded by these two spec files, which are the
> canonical home for the decisions. Where a report and a spec disagree, the spec is current. Two
> figures in the reports are also *contingent* and should not be quoted: the report's own
> `+0.87`/`−0.08 kg/week` slopes and the design pass's `+0.4 kg` both depend on five weigh-ins
> nobody has, which the debate flagged.
>
> ⚠️ **The test-suite finding recorded in `01`'s header is the one to carry forward.**
> `__tests__/logic.test.js` has **zero `require` of `app.jsx`** — it is a hand-retyped mirror, so
> logic never copied across cannot be tested and nothing reports the omission. That is how 370
> passing tests said nothing about a divide-by-8 on the app's headline number, and it was
> demonstrated again mid-build when a dropped `const` crashed the app to a blank screen while Jest
> stayed green. `__tests__/datekeys.test.js` now fails the build on the UTC day-key idiom
> statically. Extracting the pure layer into a `logic.js` both `app.jsx` and Jest load is the real
> fix; it touches `build.sh` and is a standing engineering item.

## dashboard/ — how the day reads at a glance

| File | Feature | Scen | Tag |
|---|---|---|---|
| [01-calorie-tolerance](dashboard/01-calorie-tolerance.feature) | Calorie tolerance — forgiving colour logic; the caption states the fact | 8 | |
| [02-macro-tolerance](dashboard/02-macro-tolerance.feature) | Macro tolerance — forgiving colour logic | 4 | **superseded** |
| [03-budget-confidence](dashboard/03-budget-confidence.feature) | Calorie-budget confidence (Separated model) | 4 | |
| [04-intake-scoring](dashboard/04-intake-scoring.feature) | Daily and weekly intake scoring (red / amber / green) | 38 | `@draft` |
| [05-intake-score-card-layout](dashboard/05-intake-score-card-layout.feature) | Intake score card layout — both timeframes visible, no swipe | 2 | `@draft` |
| [06-weekly-window](dashboard/06-weekly-window.feature) | "This week" means the last seven completed days | 8 | built |

> **`06` is new, 2026-09-13, and it AMENDS `04`.** `04`'s Background said *"this week means the
> last 7 days ending today"*; that line is now corrected and points here. Today was counted as a
> whole day against a whole day's target, so with nothing logged the week read amber (2,484 vs
> 2,709), one 400 kcal breakfast flipped it to a green *"keep going"* (2,186), and dinner flipped
> it back (2,486) — a false all-clear, in the morning, with an instruction in it. The founder's
> reason for the call was better than the bug: today's progress is already the hero ring on the
> left, so a segment for it on the right said the same thing twice and disagreed with itself while
> the day was open. The two cards now cover different days, and this is the same window
> `history/01`'s average uses, so the two screens can no longer report different weekly numbers.
> `04` still owns the grading. **Not `isDayClosed`** — it reads as "the day has finished" but means
> "14 hours after the first meal, or 22:00", which would let a part-finished day back in at 20:00.

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
| [06-stated-totals](logging/06-stated-totals.feature) | Totals typed by the user are the meal, not another row | 10 | `@wip` |
| [07-estimate-of-what-you-typed](logging/07-estimate-of-what-you-typed.feature) | The numbers on screen are the AI's estimate of what you typed | 8 | `@wip` |

> **`06` and `07` are the 2026-09-15 bug batch** — the founder's second by-eye report, kept
> verbatim as [`logging/00-bug-report.md`](logging/00-bug-report.md) (its Bug 3 is a dashboard
> fix, in `dashboard/01`). `07` records a finding the report could not have made: the AI's numbers
> were being silently **replaced** by an Open Food Facts free-text hit — a random product's label,
> per that product's serving, at a fixed 98% — whenever OFF happened to answer. "Butter, 30g" became
> a peanut-butter biscuit, live, during triage. No spec had ever described that step; it is removed
> from the AI Log, the meal form and the entry editor (the Food Search screen, where the user picks
> a product from a list, keeps it). `06` makes a full typed totals line the meal outright: one row,
> no model call, no follow-ups, logged exactly as typed.

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
