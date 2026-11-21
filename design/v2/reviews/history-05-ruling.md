# 05: Ruling. History v2

Chair: Critical Thinking hat. Every `app.jsx` line cited was re-read at `82feb19`.

## 1. The complaint, and what release 1 must show

The screenshot shows 7 emoji, pill chips, rainbow macros, amber figures and 15 controls before any data. All hats agree on the cure: Today's grammar, zero emoji. **RULING: the first v2 slice the owner sees must replace the whole list screen in one go: header, range, readout, weight chart and day list.**

## 2. Fact check

| Claim (hat) | Verdict | Lines read |
|---|---|---|
| Editing **today** from History is lost (Eng 1) | **CONFIRMED** | `updateDay` (9901) writes `hist` only. The snapshot effect (10094–10117) rebuilds today from live `logs`/`water`/`workouts` on the next change, `training` from `workouts.length` (10102). `addLog` spreads stale `logs` (9676). Today's foods, water and training stay editable (6369, 6484, 6557); only the mode was made read-only (6346). |
| "Set target" does nothing (Eng 2) | **CONFIRMED** | The `tgt == null` branch returns early (6402–6411). The input renders only in the other branch (6427). The spec checks visibility only (`history-day-edit.spec.js:175`). |
| Delete removes every id-less entry (Eng 3) | **PARTLY** | The logic is real: `l.id !== log.id && l !== log` (6557) drops every entry with `id` undefined, **and also every entry sharing a duplicate `id`** (`id: Date.now()`, 6292/9677). Every current write path sets an id (9677, 6292, 1861), so only legacy or duplicate-id rows hit it. Fix anyway: edit (6543) matches differently. |
| `rc()` can't see `.ui-v2` tokens (Eng 4) | **CONFIRMED** | `cssVar` reads `document.documentElement` (14). The v2 tokens live on `.ui-v2` (7080–7082), so `rc("var(--ink)")` returns the raw `var()`. Resolved per render, so a theme flip goes stale. |
| `weightTrendKg`/ROLLING never show for sparse weigh-ins (Coach) | **CONFIRMED** | ROLLING needs ≥3 readings in 7 calendar days (772–779). `weightTrendKg` needs ≥2 in **each** of two 7-day windows (787–797). A weekly weigher never qualifies. The owner's 6 readings in 30 days give raw dots plus the apology note (6766–6772). |
| Amber "Under-eaten" on Maintain days (Coach, D19) | **CONFIRMED, and wider** | `calorieDayScore` Maintain returns amber (525–527) and Bulk returns amber/red (`bulkCalorieScore`, 513). The Day view paints that dot (6415–6421). `V2Last7` only stays neutral because its lamp style ignores the colour on non-cut days (8146). |
| Macro tiles use mode colours (Coach) | **CONFIRMED** | `MM` 6085–6088, pie 6206–6209. |
| The smoothed curve invents a dip (Design; Coach "swoop that never happened") | **WRONG** | `type="monotone"` (6690) is monotone-cubic and cannot overshoot between points. The 97.5 low on 28/10 is a real dot. The real faults: raw noise as the headline, no trend line (ROLLING null), and an `auto` Y domain stretching 2.6 kg to full height. The remedy stands. |
| D18 not built (Coach) | **CONFIRMED** | The snapshot stores the chosen `mode` (10097). `features/dashboard/` stops at 07; there is no 08. |

## 3. Shape of the screen

**Tabs (v1) vs no tabs and weeks (Coach) vs a 5-range segment (Design) vs 4 controls (Consultant).**

**RULING: one scrolling screen with one range control and a day list, no week list.** The day list is what the owner uses and what FL-010 corrections need. Week rows duplicate Last 7 and add a tap before any day; Coach's real point (never disagree with Last 7) is met in §5.

- **Ranges: `7D · 30D · 3M · ALL`** in `V2SSeg`, default 30D, neutral on-state. **Day** stops being a range: it is the Day screen. **Year** goes; at phone width it draws nearly the same picture as ALL.
- **Line/bar toggle: cut.** Intake is bars and body is a line.
- **Per-macro charts: cut** from v2 (owner Q2). The intake chart is kcal bars against the stored-target step line. Protein lives in the readout.
- **Daily averages: readout, not tiles.** Four ink columns (KCAL Num 22; PRO, CARB, FAT Num 15) under `Daily average · {dates}`. FL-001/008 logic untouched. Cutting carbs/fat (Coach) saves no space.
- **CSV: moves to Settings › Account & data, beside Download my data · JSON** (SettingsV2 9261). It stays in v1 History until v1 is deleted (owner Q3).
- **Body fat % and Tape: off the main screen.** A single quiet row under the weight panel, `Body fat & tape · N readings`, opens a Measurements sub-view with the existing two charts restyled. Two chips go without deleting a feature 31 tests cover.

## 4. Weight trend for sparse data

**RULING, concrete, as a new pure `weightTrend(weighIns, toKey)` in Jest:**

- **Line:** a time-weighted EWMA over calendar days: `t_i = t_{i-1} + α(w_i − t_{i-1})`, with `α = 1 − 0.9^Δdays`. (Hacker's Diet 10%/day; a 7-day gap moves it ~52%), evaluated at each reading, drawn as straight segments (no spline) in 2px `--ink`. Raw readings are 3px `--dim` dots, not joined.
- **Headline rate:** the least-squares slope through the readings of the **last 28 days**, ×7, rounded to 0.1. It is shown when there are **≥3 readings spanning ≥10 days**: `−0.3 kg a week · last 4 weeks · 5 weigh-ins`, in neutral ink with no colour, and `About level` when |rate| < 0.1. Fixed to 28 days, not the range, so it never changes meaning with the chip (FL-013).
- **Below the minimum:** `{n} weigh-ins · your trend starts after 3 over 10 days`. No figure.
- **Y axis:** round 0.5 kg steps, with a minimum span of 2 kg so noise isn't magnified.
- `rollingWeightMean`/`weightTrendKg` stay for their other callers.

This supersedes founder decision **Q4** (week-on-week, `features/history/01:195`) on this screen, so it is **owner Q1**. If the owner declines, keep the Q4 row and still ship the EWMA line.

## 5. Day list and tap-a-day

**Row:** a mono gutter `SAT 21`, then the mode as a dim micro-label shown only where it changes from the row above (and always on the top row). Then `P 151 · C 329 · F 89` in the meal-row grammar, with kcal on the right in ink `Num 17` and `98.2 kg` dim beneath it on weigh-in days. On a CUT day graded amber or red, a small gutter lamp **identical to `V2Last7`'s** (owner Q4); Maintain and Bulk are never marked (D19). No water, training, chevron, or emoji. Footer: "Tap a day to open."

**RULING: today's row routes to Today.** Bug 1 makes this mandatory, not a matter of style.

**Day screen** (a past day): `V2SHeader` `THU 19 NOV` with ‹ ›, then:

1. The mode `V2SSeg` (→ `setDayMode`).
2. One score line. On CUT days it carries the band lamp from the same grader as Last 7. Maintain/Bulk: plain ink, no dot, no "Under-eaten" (D19). Target edits inline with the D4 dashed underline; with none stored it reads `Set target`.
3. `TRAINING · REST`.
4. Kcal `Num 40` plus `V2Macros` against the stored targets. Carbs target derived as `(targetKcal − 4P − 9F)/4` (carbs absorb the rest in `computeMacros`). Pie cut.
5. `V2MealList`/`V2MealRow` with adapters onto `patch`, then `V2LogButtons` with `onAddLog={addEntry}` and `setView` mapped to `setAddCtx` (its Quick Add calls `setView("quick")`, 7425). Quick Add and the manual form stay v1 until O9.
6. `V2Water`, then a BODY readout.

**Last 7 → History:** the whole V2Last7 card becomes a tap target that opens History at 7D.

**D18/D19:** History displays the **stored** mode; it doesn't derive D18. When `dashboard/08` lands, the snapshot carries the effective type and History follows with no extra work. New question: retroactive reclassification (owner Q5).

## 6. Guardrails

- **Not built:** drag-to-reopen pointer, banked/hatched states in rows (they belong to the tape), week rows, TDEE line, period comparison, chart-library swap.
- **Recharts stays.** Colour via CSS under `.ui-v2` (`.recharts-*`, `currentColor`); Eng's `rcIn` only where an attribute must be literal.

## 7. Build plan

**v1 fixes first** (each its own PR, with a test, `sw.js` + `APP_VERSION` bumped):

- **H1 (today edit loss).** In the Day view, today is read-only: foods, water and training show no controls, plus a link "Edit today on the dashboard". e2e: open today in History, see no edit controls; add on Today, nothing lost.
- **H2 (Set target).** Render the input when `tgtDraft != null` in the no-target branch. e2e: save 2,200 and see "target 2,200" scored.
- **H3 (delete).** Edit and delete both match by index through one pure `replaceLogAt`/`removeLogAt`. Jest: two id-less entries and two duplicate-id entries, delete one, one remains.

**v2 slices behind `?ui=v2`:**

- **S0 (no visible change):** Eng's extraction into `useHistoryModel`, plus `data-testid`s and moving the 4 specs off emoji. Add `weightTrend` with Jest, including the owner's 6 readings.
- **S1, the visible fix:** `HistComp = UI_V2 ? HistoryV2 : History` (10342), plus header, 4-range segment, readout, weight panel (§4), day list (§5), empty states and zero emoji. Row taps open the v1 Day view temporarily; today routes to Today.
- **S2:** the Day screen (§5), including the D19 score line.
- **S3:** kcal bars with the target step line, the Measurements sub-view (BF/tape restyled), and CSV in SettingsV2.
- **S4:** the pointer readout, the Last 7 → History link, and `v2-history.spec.js` on S0's testids.

## Questions only the owner can answer

1. Replace the Q4 week-on-week figure on History with a sparse-friendly rate (`−0.3 kg a week · last 4 weeks`, from 3 readings over 10 days)? **Default: yes.**
2. Drop Year, per-macro charts and the line/bar toggle, and bring them back only on demand? **Default: yes.**
3. Move CSV to Settings › Account & data, next to the JSON download? **Default: yes.**
4. Show CUT-day amber/red lamps on History rows, matching Last 7? **Default: yes, CUT only.**
5. When D18 ships, reclassify past days retroactively? **Default: no, forward only.**

---

## Owner decisions (2026-11-21)

| # | Question | Decision |
|---|---|---|
| Q1 | Sparse smoothed trend + rate replaces week-on-week on History | **Yes** |
| Q2 | Drop Year, per-macro charts, line/bar toggle | **Yes** |
| Q3 | CSV moves to Settings › Account & data | **Yes** |
| Q4 | Amber/red lamps on over-target CUT-day rows only | **Yes, CUT only** |
| Q5 | Reclassify past days when D18 ships | Not asked; chair's default stands: **forward only** |
