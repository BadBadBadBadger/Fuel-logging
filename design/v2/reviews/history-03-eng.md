# 03: Engineering: how to build History v2

**Verdict:** go hybrid (c). Extract one `useHistoryModel` hook plus a few pure helpers, then build a separate `HistoryV2` view behind `UI_V2`. Do not reskin in place. Fix two bugs in v1 first.

## What History is today (verified)

- **Mount.** It lives at app.jsx:6081–6861 and is rendered for every UI at 10342. There is no `HistComp` swap like `DashComp`/`ProfComp` (10215). In v2 it draws v1 chrome on the `.ui-v2` ground (10229).
- **State, 10 hooks (6091–6100).** `range` (6 values, 6082), `metrics` (at least 1, 6105), three mutually exclusive body toggles (`showWeight`/`showBodyFat`/`showTape`), `chartType`, `dayIdx` (an index into `history`), `addCtx`, `editId` and `tgtDraft`.
- **Derived data, all inline in render (6112–6212).** Row window, average window and yesterday (6113–6130). Day spine (6135). Four chart datasets (6144, 6159, 6183). Tape hip (6187). BF change (6194–6196). Lookups by date (6203–6204). Pie data (6208).
  - Already pure and tested: `rangeWindow`, `avgRowsOf`, `hasIntake`, `fmtRange`, `rollingWeightMean`, `weightTrendKg` (history.test.js), plus `csvRows`, `measurementChartRows`, `bodyFatWindowChange`, `calorieDayScore` (logic.test.js).
  - Pure but untested: `daySpine`, `onDaySpine`, `bodyFatWindowRows`.
- **Day editor.**
  - `patch` (6214) recomputes totals and calls `onUpdateDay`, which is App's `updateDay` (9901).
  - `setDayMode` (6260) and `setDayTarget` (6274) re-target a past day from that day's body (`bodyOn`, 6248).
  - It also has the score line (6401), water (6484), the BODY card (6500), foods with `EntryEditor` (6537) and three add buttons (6566–6579).
  - The add buttons replace the whole screen with v1 `QuickAdd`/`MealForm`/`AILog` (6299–6301). `addEntry` closes them after the first item (6296), so AILog's per-item logging (5724) stops after one item.
- **Charts.** Recharts Pie (6453), then Line/Bar ×4 variants (6660–6706). `BodyFatTooltip` (6062) is HTML. Every SVG colour goes through `rc()` (15).
- **Averages and weight card.** At 6727–6796. CSV at 6284.

## Bugs found

1. **BUG (data loss): editing TODAY from History.**
   - Water (6484), training (6369) and foods (6294, 6543, 6557) are all allowed on today. `updateDay` writes `hist` and `logs__today` (9902–9907), but App's live `logs`/`water`/`workouts` state is never told.
   - The next live change re-snapshots today from that stale state (10094–10117), so the History edit is overwritten. A food added there is also dropped by the next Today `addLog`, which spreads the stale `logs` (9674–9677).
   - The training toggle is always overwritten with `workouts.length > 0` (10102).
   - The comment at 6240 excludes today from mode changes only. Fix: make today's day view read-only with a "Edit on Today" link, or route today's edits to `addLog`/`setWater`.
2. **BUG: "Set target" does nothing.** It sets `tgtDraft` (6408), but the input renders only in the `tgt != null` branch (6427). The e2e test asserts only that the button is visible (history-day-edit.spec.js:175), so it passes.
3. **Delete without an id.** `l.id !== log.id && l !== log` (6557) removes every log that has no id, not just the one tapped. Edit matches on `(l.id || l)` (6543), so the two rules disagree.
4. **`rc()` resolves against `:root` (14–15).**
   - Tokens scoped to `.ui-v2`, and any `V2_AILOG_VARS`-style re-pointing on a wrapper, are invisible to it. It returns the v1 value or a raw `var()`.
   - It is also not reactive. An OS theme flip leaves the chart colours stale until something re-renders.
5. **Minor.**
   - Body Fat and Tape chips gate on all measurements (6610, 6627) but Weight gates on the window (6600), so a chip can open an empty chart.
   - The line/bar toggle shows but does nothing on body charts (6637).
   - Line tooltips print raw `KCAL`/`PROTEIN` with no unit (6698).
   - `dayIdx` is captured once (6097), so a pull that inserts older days shifts the day shown.
   - The comment at 6198–6202 still says the window comes from UTC, but `rangeWindow` is local now (691).

## Options

| | Build cost | Risk to v1 e2e | Notes |
|---|---|---|---|
| (a) Reskin in place: `v2` prop plus token re-pointing | Low at first, high later | **High.** Removing emoji breaks about 33 emoji lines and dozens of copy locators unless every change is forked on the prop | 780 lines with about 40 `v2 ? :` forks. Token re-pointing cannot reach the charts (bug 4). AILog `inline` worked because that is one small panel |
| (b) New `HistoryV2` that duplicates the logic | High | None | Copies the re-targeting and window logic, which is the FL-001/FL-010 drift class this repo just paid to fix |
| **(c) Hybrid** | Medium | **None** | One model, two views. The view gets v2 parts that already exist: `V2SHeader` 8765, `V2SSeg` 8808, `Panel`/`Label`/`Num`, `V2MealRow` 7450, `V2Water` 7671, `V2LogButtons` 7401 (takes `onAddLog`) |

**Test exposure.** The 4 History specs hold 54 tests:

| Spec | Tests | Emoji-bearing lines |
|---|---|---|
| history-averages | 14 | 2 |
| history-day-edit | 9 | 5 |
| body-history | 21 | 21 |
| body-measurements | 10 | 5 |

- The emoji they hit: `button:has-text("📊")` (the entry point, 5 uses), `"📥 CSV"`, `"⚖️ Weight"`, `"📏 Body Fat %"`, `"📐 Tape"`, `"⚖️98.5kg"`, `/📏\d/` and `"✎"`.
- They also lean on `.recharts-line` counts and `svg circle` x positions.
- None of them runs with `?ui=v2`. So (c) changes nothing for them, while (a) breaks them on day one. Keep Recharts in v2, so the chart specs port with only new locators.

**Recharts theming.**
- Add `rcIn(el, v)`, which is `getComputedStyle(el)` on the chart container through a ref. Re-render on a `matchMedia` change or a `data-theme` change.
- Or skip `rc` entirely in v2. Set series colours from a small `V2_CHART` map resolved once from the `.ui-v2` node, and style axis ticks with CSS (`.ui-v2 .recharts-cartesian-axis-tick text { fill: var(--dim) }`).
- Tooltips are HTML and inherit `.ui-v2` vars as they are. `BodyFatTooltip` only needs its `CARD`/`BD` swapped for `--panel-2`/`--hair`.
- Per §2.1, macros carry no valence colour. Series colours are identification only, and that matches `TAPE_SERIES` (6043–6046).

## What to extract first (pure, Jest-owned)

1. **`historyView({history, weighIns, bodyMeasurements, range, todayK, wPref})`.** Returns the filtered sets, the spine, the 4 chart datasets, `avgRows`, `avgWin`, `tapeHasHip` and the per-macro averages. This is lines 6112–6204 plus 6737.
2. **`withDayTotals(day, patch)`** (6214–6220).
3. **`retargetPastDay(day, mode, body, tdeeAdj)` and `pastDayTargetPatch(day, kcal, body)`** (6256–6282), with `bodyOnDate` (6248).
4. **`dayBodyRows(date, weightOnDate, measurementOnDate, wPref)`** (6502–6509).
5. **Tests for `daySpine`/`onDaySpine`.**

`useHistoryModel(props)` then holds the 10 state hooks and these helpers. v1 `History` becomes a pure view of it, with no visible change.

## Slice plan (one PR each)

1. **S0: safety net.**
   - Steps 1–5 above.
   - Add `data-testid`s to v1 History (`history-range-<r>`, `history-metric-<k>`, `history-body-<weight|bf|tape>`, `history-csv`, `history-row-<date>`, `history-day-prev/next`, `history-avg`).
   - Move the 4 specs off emoji.
2. **S1: bugs 1–3 in v1,** each with an e2e test. The Set-target test must type a value and see it scored.
3. **S2: the `HistoryV2` shell.**
   - Add `HistComp = UI_V2 ? HistoryV2 : History`.
   - Build the header (history icon, CSV as an `Icon` button), the range `V2SSeg`, the average panel in mono `Num`, the weight trend line, and a day-by-day list with no emoji ("98.5 kg · 22.2%"). Also the empty states.
4. **S3: v2 charts.** Add `rcIn`/`V2_CHART`, then metric chips, the weight/BF/tape switch, `BodyFatTooltip` tokens and the BF change line. Drop the line/bar toggle unless the owner wants it, since one bar chart fixes the toggle bug in 5.
5. **S4: v2 day editor.**
   - Mode lamps for past days, the score line with ✎ as `Icon pencil`, `V2Water`, the BODY panel, `V2MealRow` for foods, and adding via `V2LogButtons onAddLog={addEntry}`.
   - Quick Add and the manual form stay v1 full-screen until O9 designs them.
6. **S5: a v2 spec file** (`v2-history.spec.js`) that reuses the S0 testids. Bump `sw.js` and `APP_VERSION` together.

**Trade-offs:**
- (c) costs one refactor PR with no visible change before any pixels move.
- It buys zero v1 test churn, one copy of the FL-001/009/010 logic, and charts that actually take v2 colours.
