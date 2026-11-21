# 02 — Engineering hat, Round 1: functionality coverage, v110 vs v2

Verdict: v2 can be built behind a flag without corrupting stored data, because App owns every write path. As mocked, though, it drops roughly a dozen live safety and explanation surfaces. Part of the "removal" plan also deletes a live allergy safeguard, and the plan treats that as tidying when it is not. Everything below was checked by grep at b229d45.

## Top 5 risks

1. **Twelve conditional cards have no home in v2.** Dashboard renders them at app.jsx:4381-4790, and a2.html has none of them. The worst losses are the diet-break hard prompt (4714; snoozable, "never permanently dismissable"), low fuel (4544), the red aggressive-cut card with its acknowledgement (4420-4433), and the safe-minimum explanation shown for a custom target (4451). Cut-block accrual (7770) keeps running underneath, so the data stays correct but nobody is ever told.
2. **Today's derived logic lives inside Dashboard, not App.** targetWarning (4289), the whole intake score, week score and day colours (4181-4274), the kcal status bands (4159-4170) and the `askCutGuard` state (4150) all sit in Dashboard. TodayV2 would have to copy them, and Settings v2's mode and target controls (decision 9, "Daily target: Set my own") would skip both the cut guard and the target warnings.
3. **Removing diet also removes the allergen warning on AI-logged items** (`ItemRow` 5489, rendered 5531-5533). For anyone with allergies stored, that is a safety regression. Their `profile.dietary` also stays on the device, invisible and impossible to edit, and still appears in the export.
4. **The Jest copy will stay green after the deletions.** logic.test.js still runs 18 assertions on `scanAllergens` and `dietaryPromptBlock` (818, 851), and those keep passing once the app code is gone. The copy has already drifted (see §3). There is a coach-removal trap too: `paceVerdict` and `EATING_WINDOW_H` sit under the "Coach pacing" heading (435-440) but intake scoring uses them (4186, 4192).
5. **Two settings changes create write paths that sync can't handle.** (a) "Undo" for the aggressive-cut acknowledgement: the flag only ever latches on. Pull sets it only when it is truthy (1843, 7199, 7416), local load reads "1" (7156), and every `syncSettings` call pushes the device's own copy (1668). An undo on one phone gets re-pushed as `true` by the next. (b) Bumping `POLICY_VERSION` puts every premium user in front of the retroactive consent modal (7179 → 7898).

## 1. Today inventory → v2

App passes Dashboard 47 props (7905-7926). The status column says where each item ends up: **C** = Covered, **M** = Moved, **R** = Removed by decision, **NH** = NO HOME, **U** = Undesigned screen.

| Surface (line) | v2 | If silently dropped |
|---|---|---|
| Header: date, streak, streakPop, badgeGlow (4322-4347) | C (pop/glow animation unspecified) | — |
| Profile/History/Badges navigation | C (icons) | — |
| Premium avatar → Account (4348) | M → Settings › Account & data | — |
| OFFLINE label, `syncMsg` "Syncing your data…" (4329-4330; set 7400/7429) | **NH** | A premium user editing during the post-sign-in pull, or while offline, gets no sign that sync is pending. |
| Mode chips; custom target means no chip is lit (`effectiveMode` 7645, `isCustomMode`) | C | — |
| Cut guard "Back to cutting already?" (4381) | **NH** (lamps unspecified); Settings mode control bypasses it | A user cuts mid-break without the one prompt energy-safety/03 asks for. |
| WorkoutLogger, premium paste (4406) | C | — |
| `!hasProfile` "Set body stats" call to action (4410) | **NH / U** (no onboarding exists) | A new user is silently given targets for `DEF_PROFILE` (80 kg, 18% body fat, sex null, which falls back to male; app.jsx:62). |
| targetWarning red/amber/info + "Yes, I understand" (4289-4307, 4420) | **NH** on Today; Settings Advanced keeps only the status | A user who types an extreme deficit (more than 1,000 under TDEE, or below `deficitFloor`) sees nothing and is never asked to acknowledge it. |
| SAFE MINIMUM APPLIED (4451) | **NH** | The user types 1,000 and TARGET shows 1,200 or 1,400 with no reason, which reads as a broken input. The safety still holds because the number moves. |
| Held at maintenance minimum, `bmrFloorApplied` (4477) | **NH** | The number moves; the explanation and the "diet break beats eating less" advice are lost. |
| Eased to a steady pace, `deficitFloorApplied` (4496) | **NH** | Same. The removal note at 4515-4535 names this card as one of the three that carry real safety weight. |
| LOW ON FUEL, `lowFuel` (4544) | **NH** | A lean user who trained and is under-fuelled is never told to eat more. This is a warning only, so nothing else catches it. |
| Weight up while cutting, `showGainWhileCutting` (4574) | **NH** | The scale rises, the target stays put, and nothing explains why. The likely response is eating less, the exact behaviour the card exists to prevent. |
| Break gauge, `cutBar` (4615) | **NH** | Someone on a break gets no feedback and no "days to recharged". |
| RECHARGED (4647) | **NH** | Harmless; it retires itself after 3 days. |
| Cut prompt soft/hard + "Start a 2-week break" / snooze (4669, 4714) | **NH** | **The diet-break intervention disappears entirely.** Accrual and snooze state keep being written but are never seen. |
| PROTEIN AND FAT KEPT, `floorsExceedKcal` (4753) | **NH** | P/C/F targets add up to more than TARGET with no explanation, which reads as "my numbers are wrong". |
| Calorie card: inline target edit (4776) | C (dashed underline, "Use auto" = `saveCustomKcal(null)`) | — |
| Over-target status bands (amber at 100-500 over, red above 500) and `kcalCardLabel` (4159-4161) | Partly: the gauge has "still to go"; the over-target state is undesigned | The over-target state is undefined in v2. |
| EST. BUDGET · `tdeeConf`% (4806) | C (EST. TDEE LEARNING) | — |
| `intakeShaky` "mostly AI-estimated" (4833) | **NH** | Low-confidence days look exact. |
| IntakeScoreCard hero, todayMiss, week ring (4822) | Week: C (7-day lamps). Today hero and `todayMiss`: NH; tape colour states unspecified | Today's protein/fat-minimum verdict is lost. |
| ScoredBar ×3 | C (tapes) | — |
| CoachCard (4852), `coachKey` | R | see §2 |
| Water (4855) | C | — |
| Weigh nudge + mute → `weighCadence:"off"` (4884; 7661) | M (row state + Settings › Reminders) | — |
| WeighInWidget: `correctionHeld` copy (3847-3849) | **NH** (mock says only "Settles as you weigh in") | The second explanation of a held correction is gone too. |
| Measurement nudge → "DUE" row | M | — |
| AI LOG / QUICK ADD, premium gate (4919-4930) | C, but **the free-tier state of LOG FOOD is U** | — |
| Log list: tap to edit, ⚡ → `addToQA`, × delete (4940-4985) | C (inside edit mode) | `addToQA` saves the stored log, not unsaved draft edits, and does nothing when the name already exists (7363-7365). In v2, "Save to Quick Add" sits next to unsaved fields, so this has to be decided. |
| `onSignOut` prop | dead: passed at 7925, never read | — |

**These still work in v2 as long as TodayV2 mounts under the same App:** the startup pull and the `cloudSettled` gate (7183-7213), cut-block accrual (7770), the history snapshot that records `targetKcal` and `floored` (7720), `runCalibration` with `ADJ_CAP`, `raiseContext` and the raise interval (`onWeighIn` 7540-7590), the custom-target safe-minimum clamp and the macro minimums (7687-7715), and every overlay (consent, lapsed, premium gate, toasts, fanfare; 7872-7903). None of this is in Dashboard. The risk is purely presentational, and that is why item 1 can be fixed.

## 2. Data integrity of the removals

Checking settings-ia.md's unpick list: the line numbers are right to within about 2 lines. Corrections:
- **"cloud pull keeps profile.dietary 1797" is wrong as a sync claim.** `syncProfile` (1588-1596) never uploads `dietary`, and the pull at 1799 merges the *local* blob back in. Dietary data is device-local and has never been in Supabase, so there is no server migration.
- Missing from the list: `ItemRow` allergen render (5531-5533), `FOLLOWUP_BANK.fat` calling `dairyAvoided()` (5367), the coach key write at 7104, `policyVersion` in the export (7500), and the Vegetarian/Vegan follow-up chips (5376), which are not diet-gated and stay.
- **Do not delete:** `paceVerdict` and `EATING_WINDOW_H`. Intake scoring uses them.

Coach (`coach__YYYY-MM-DD`): one key per day, never pruned (2746, 2832). Keep `"coach__"` in the sign-out sweep (7453) even after the code goes. Bump `SCHEMA_VERSION` 1→2 (1917) and have `runMigrations` delete `coach__*` once. Readers can then be removed without risk.

Dietary: `saveProf` spreads the profile, and the pull merges local data, so `dietary` survives forever with no UI to change it. That is Art. 9 data the user can no longer see or delete without deleting the account. My recommendation is to strip it with a migration, never to ignore it. Reading it only to keep the allergen backstop working, without a UI, is the worst option: hidden state that changes behaviour.

**Allergy users:** today, an AI-logged item whose name matches a declared allergen shows "⚠️ Contains milk — flagged from your allergies." After the removal, it shows nothing, and the user gets no notice that the protection is gone. That is a safety regression, and the owner must sign it off explicitly. It also needs a one-time notice for affected users, which is a non-empty `dietary.allergens` at migration time. Whether to re-consent and bump `POLICY_VERSION` is privacy counsel's call. Engineering's point is that the bump fires a blocking modal for all premium users (7179), so it should not ship as a side effect of a code cleanup.

## 3. Build path

- **The flag is feasible and cheap.** It is one bundle, classic scripts, `preset-env modules:false`, and `var exports = window.exports || {}` at line 6. The `DEV` flag (24) already reads URLSearchParams, so `UI_V2 = ?ui=v2 || localStorage` follows the same pattern. The e2e harness seeds localStorage with addInitScript (harness.js:46), so a v1/v2 project matrix is trivial.
- **Sharing App state:** yes, with no duplication, *if* Dashboard's derived block (4152-4307) is first lifted into a pure `deriveToday({...})` that both Dashboard and TodayV2 call. The `askCutGuard` flow has to become an App-level `requestMode(m)` so that Settings can't bypass it, and targetWarning has to become App-level for the same reason.
- **The service worker is not a risk while the flag is live.** v1 and v2 ship in the same app.js under one versioned cache (sw.js:1), and `?ui=v2` navigations fall back to index.html (sw.js:37). The real hazard is the prompt-to-reload banner (index.html:296-322): users stay on an old bundle indefinitely, so a localStorage flag can outlive the code that understands it. Unknown values must fall back to v1.
- **Is logic.js realistic?** I compared the 146 symbols present in both files. 131 are identical once comments and whitespace are ignored. `calcTargets` and `sumLogs` are equivalent (`calcTargets` has `bmrOf` inlined), and `intakeConfidence` and `deficitFloorOf` are identical. Real drift: `cutPromptFor` lacks `stallSpanWeeks`/`stallWeeks` (the "about N weeks" copy is untested), `runCalibration` lacks the dev clock, `FOLLOWUP_BANK` is stubbed, `runMigrations` has a different signature, and `ACTIVITY` has a different shape. In the other direction, 63 lower-case app helpers above line 4100 have no copy at all, including `calcStreak`, `seedTDEE` and `weightTrendKg`. A separate logic.js works (top-level `const` is shared across classic scripts), but it touches index.html order, sw.js ASSETS, the build, and the impure dependencies (`getDevDateOffset`, `sg`/`ss`, `INTAKE_FLAG_BELOW`, `DIETARY`). **Cheaper and proven here:** ai-log.test.js:26 and datekeys.test.js already `new Function()` slices of app.jsx. Mark a `// ── LOGIC ──` region, have Jest evaluate it, and delete the copy one function at a time. That needs zero runtime changes.
- No CI exists (there is no `.github/`).

## 4. Phase 0-5 verdict

What's wrong:
- Phase 1 runs before tests read the real source, so the deletions go green on a copy.
- Phase 1 treats allergen removal as cleanup when it is a safety decision.
- Phase 2 restyles a v1 layout that is about to be deleted. Do only the shared icons and tokens there.
- Phase 3 can't flip the default when the conditional surfaces are scheduled for Phase 5.

Missing: `deriveToday` and `requestMode`, the `SCHEMA_VERSION` 2 migration, a design for the warning slot, first-run and offline states, the free-tier LOG FOOD state, the over-target gauge state, and a v1-copy e2e audit. cut-break (23 `getByText`), energy-safety (12) and adaptive-guardrails (12) will fail on v2 by design, and those failures are the coverage gate.

My order:
1. Phase 0: CI, then Jest evaluating the app.jsx region.
2. Lift `deriveToday` and `requestMode`, with tests.
3. Remove the coach, with the migration.
4. Design the warning slot and the undesigned Today states.
5. TodayV2 behind the flag, with e2e on both.
6. Diet removal, only after the owner signs off on allergens, with the notice and migration.
7. Settings v2.
8. Remaining screens.

**I would refuse to flip the default to v2, or delete v1, while any surface in §1 marked NH and carrying safety weight (cut prompt, low fuel, aggressive-cut acknowledgement, safe-minimum explanation, weight-up while cutting) still has no home.**
