# 03: Engineering: how to build History v2

**Verdict:** go hybrid (c). Extract a `useHistoryModel` hook plus pure helpers, then build a separate `HistoryV2` view behind `UI_V2`. Do not reskin in place. Fix two bugs in v1 first.

## What History is today (verified)

- **Mount.** app.jsx:6081–6861, rendered for every UI (10342). There is no `HistComp` swap like `DashComp`/`ProfComp` (10215), so v2 shows v1 chrome on the `.ui-v2` ground.
- **State.** Ten hooks (6091–6100):
  - `range` (6 values) and `metrics` (at least 1, 6105)
  - three exclusive body toggles, plus `chartType`
  - `dayIdx` (an index into `history`), `addCtx`, `editId`, `tgtDraft`
- **Derived data, inline in render (6112–6212).**
  - It covers the row and average windows, the day spine, four chart datasets, tape hip, BF change and the lookups by date.
  - `rangeWindow`, `avgRowsOf`, `weightTrendKg`, `csvRows`, `measurementChartRows` and `bodyFatWindowChange` are already pure and Jest-tested.
  - `daySpine`, `onDaySpine` and `bodyFatWindowRows` are pure but untested.
- **Day editor.**
  - `patch` (6214) recomputes totals and calls App's `updateDay` (9901).
  - `setDayMode` and `setDayTarget` (6260, 6274) re-target from that day's body (6248).
  - It also has the score line (6401), water, the BODY card (6500), foods with `EntryEditor`, and three add buttons. The add buttons swap the whole screen to v1 QuickAdd/MealForm/AILog (6299–6301).
- **Charts.** Recharts Pie (6453) and Line/Bar ×4 (6660–6706). SVG colours go through `rc()` (15). `BodyFatTooltip` (6062) is HTML.

## Bugs found

1. **BUG (data loss): editing TODAY from History.**
   - Water, training and foods are all editable on today (6369, 6484, 6294, 6557).
   - `updateDay` writes `hist`, but App's live `logs`/`water`/`workouts` state is never told. The next live change re-snapshots today and overwrites the edit (10094–10117).
   - The next Today `addLog` spreads the stale `logs` (9676), so a food added from History is lost.
   - Training is always reset to `workouts.length > 0` (10102).
   - Fix: make today read-only here ("Edit on Today"), or route its edits to `addLog`/`setWater`.
2. **BUG: "Set target" does nothing.** It sets `tgtDraft` (6408), but the input renders only in the `tgt != null` branch (6427). The e2e test checks only that the button is visible (history-day-edit.spec.js:175).
3. **Delete removes every log with no id.** The filter is `l.id !== log.id && l !== log` (6557). Edit matches by `(l.id || l)` (6543), so the two rules disagree.
4. **`rc()` reads `:root` (14–15).**
   - It cannot see tokens scoped to `.ui-v2`, or `V2_AILOG_VARS`-style re-pointing. It returns the v1 value or a raw `var()`.
   - It does not react to an OS theme flip.
5. **Minor.**
   - Body Fat and Tape chips gate on all readings (6610, 6627) while Weight gates on the window (6600), so a chip can open an empty chart.
   - The line/bar toggle has no effect on the body charts.
   - Tooltips print raw `KCAL` with no unit (6698).
   - `dayIdx` goes stale when a pull inserts older days (6097).
   - The comment at 6198 still says UTC.
   - AILog in History closes after the first item (6296), unlike on Today.

## Options

| | Cost | Risk to v1 e2e | Notes |
|---|---|---|---|
| (a) Reskin in place: `v2` prop plus re-pointed vars | Low, then grows | **High** | Removing emoji breaks about 33 emoji lines unless every change is forked. About 40 `v2 ? :` forks across 780 lines. Re-pointing cannot reach the charts (bug 4). AILog `inline` worked because it is one small panel |
| (b) New `HistoryV2` that copies the logic | High | None | Copies FL-001/009/010 logic, the drift class this repo just paid to fix |
| **(c) Hybrid** | Medium | **None** | One model, two views. Reuses `V2SHeader` 8765, `V2SSeg` 8808, `Panel`/`Label`/`Num`, `V2MealRow` 7450, `V2Water` 7671, and `V2LogButtons` 7401 (takes `onAddLog`) |

**Test exposure.** The four History specs hold 54 tests:

| Spec | Tests | Emoji lines |
|---|---|---|
| history-averages | 14 | 2 |
| history-day-edit | 9 | 5 |
| body-history | 21 | 21 |
| body-measurements | 10 | 5 |

- About 160 more locators match copy.
- The emoji they hit:
  - the entry point `button:has-text("📊")`
  - `"📥 CSV"`, `"⚖️ Weight"`, `"📏 Body Fat %"`, `"📐 Tape"`
  - `"⚖️98.5kg"`, `/📏\d/` and `"✎"`
- They also use `.recharts-line` counts and `svg circle` x positions.
- None of them runs with `?ui=v2`. So (c) leaves them untouched, while (a) breaks them on day one.
- Keep Recharts in v2, so the chart specs port with only new locators.

**Recharts theming.**
- Add `rcIn(ref, v)`, which runs `getComputedStyle(ref.current)` on the chart container. Re-render it on `matchMedia` and `data-theme` changes.
- Style axis ticks with CSS (`.ui-v2 .recharts-cartesian-axis-tick text { fill: var(--dim) }`).
- Tooltips are HTML, so they inherit `.ui-v2` as they are. `BodyFatTooltip` only needs `CARD`/`BD` swapped for `--panel-2`/`--hair`.
- Series colours are identification only, with no macro valence (§2.1, matching 6043).

## What to extract first (pure, Jest-owned)

1. **`historyView({history, weighIns, bodyMeasurements, range, todayK, wPref})`:** the windows, the spine, the 4 datasets, `avgRows`/`avgWin`, the per-macro averages and `tapeHasHip` (6112–6204, 6737).
2. **`withDayTotals(day, patch)`** (6214–6220).
3. **`retargetPastDay` and `pastDayTargetPatch`**, with `bodyOnDate` (6248–6282).
4. **`dayBodyRows`** (6502–6509).
5. **Tests for `daySpine` and `onDaySpine`.**

`useHistoryModel` then holds the state and these helpers. v1 becomes a pure view of it, with no visible change.

## Slice plan (one PR each)

1. **S0.** Do the extraction above.
   - Add `data-testid`s to v1: `history-range-*`, `history-body-*`, `history-csv`, `history-row-<date>`, `history-day-prev/next`, `history-avg`.
   - Move the 4 specs off emoji.
2. **S1.** Fix bugs 1–3 in v1. The Set-target test must save a value and see it scored.
3. **S2.** Add `HistComp = UI_V2 ? HistoryV2 : History`.
   - Build the header (an icon button for CSV), a range `V2SSeg`, the average panel in `Num`, and the weight trend.
   - Day-by-day rows carry no emoji ("98.5 kg · 22.2%"). Include the empty states.
4. **S3.** Charts: `rcIn`, metric chips, the weight/BF/tape switch, tooltip tokens and the BF change line. Drop the line/bar toggle unless the owner wants it.
5. **S4.** Day editor:
   - Mode lamps, the score line with a pencil icon, `V2Water`, BODY, `V2MealRow` foods, and `V2LogButtons onAddLog={addEntry}`.
   - Quick Add and the manual form stay v1 until O9.
6. **S5.** `v2-history.spec.js` on the S0 testids. Bump `sw.js` and `APP_VERSION` together.

**Trade-offs:**
- (c) adds one refactor PR with no visible change before any pixels move.
- In return there is no v1 test churn, one copy of the window and re-target logic, and charts that really take v2 colours.
