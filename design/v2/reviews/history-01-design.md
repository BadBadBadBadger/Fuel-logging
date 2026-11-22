# 01 · Design lead: History v2

**Position.** History looks bad because it is the only screen still in v1's language: pill chips, glyphs where words should be, a categorical rainbow on the macros, and amber on every number. The fix is the Today grammar applied to the past. Every element maps to a primitive that already ships (`Panel`, `Label`, `Num`, `V2SSeg`, `V2SHeader`, `V2MealRow`, `V2Water`, `V2Macros`). All History logic (windows, averages, `weightTrendKg`, `patch`, `setDayMode`, `setDayTarget`) stays.

## Recommendation: one chart, one list, a Day screen that edits like Today

**Layout, top to bottom**
1. **Header** (`V2SHeader`): back, `HISTORY`, meta line `22 Oct – 20 Nov · 26 days logged`. On the right, a quiet text button `CSV` with no glyph.
2. **Range**: `V2SSeg` with five segments: `7D · 30D · 3M · 1Y · ALL`. They fit at 360px, so the clipped scroll goes. **Day is removed as a range**, because it was never a range: it is the Day screen (below).
3. **Series**: one radio group split into two labelled rows. `INTAKE`: KCAL · PRO · CARB · FAT. `BODY`: WEIGHT · BODY FAT · TAPE. **Single select.** Today's multi-select draws kcal and grams on one axis, which means nothing.
4. **Chart** in a `Panel well`, about 180px tall (spec below).
5. **Readout** (no tiles). `Label` `Daily average · 22 Oct – 20 Nov`, then four columns in the Settings-readout style: `KCAL 2,640` (Num 22) · `PRO 158 g` · `CARB 285 g` · `FAT 91 g` (Num 15, unit dim 11). All in `--ink`.
   Under a hairline: `WEIGHT · WEEK ON WEEK   99.0 → 98.6 kg   −0.4 kg`, uncoloured. Before 14 days the row reads `6 weigh-ins · trend after two weeks`.
6. **Day by day**: a `Panel` list in the meal-row grammar. Under it, once: "Tap a day to open."

**Element audit**

| Now | Verdict | v2 |
|---|---|---|
| `📥 CSV` (amber outline) | change | quiet text `CSV`; it differs from Account › Download my data, so it stays |
| Range pills, cream fill, scroll | change | `V2SSeg`, neutral on-state (never amber), 5 segments |
| Kcal/Protein/Carbs/Fat chips | change | INTAKE segment, single select |
| ⚖️ Weight / 📏 Body Fat % / 📐 Tape | change | BODY segment, words only (§2.4: the label says it) |
| 📈 / 📊 toggles | **cut** | the series picks the form: intake = bars, body = line |
| Blue/amber/red macro colours | **cut** | ink only (§2.1: macros carry no colour) |
| Coloured tiles | **cut** | readout columns |
| ⚖️ weight note, 2-line essay | change | one mono row, as above |
| Row date `Sat, 21 Nov 2026` | change | mono gutter `SAT 21` |
| `MAINTAIN` on every row | change | dim micro-label, shown **only where the mode changes** from the row above; neutral (D19) |
| `⚡` training on rows | **cut** | lives on the Day screen as `TRAINING · REST` |
| `💧 6` on rows | **cut** | Day screen (`V2Water`) |
| `⚖️98.2kg` in blue | change | mono dim `98.2 kg` under the kcal, right-aligned |
| Amber kcal figures | change | `Num 17` ink |
| `›` chevrons | **cut** | Today rows have none |
| Empty-state `📊` | **cut** | text only: "Nothing yet. Days save as you log." |

**Chart treatment (instrument)**
- Horizontal hairline grid only (`--hair`), three or four lines on **round steps** (0.5 kg, 500 kcal, 25 g). No more `99.45 / 98.15`. Y labels mono 10 `--dim`, inside the left edge. X: three or four labels (`24 Oct`), mono 10.
- **Intake = bars**, one per spine day, `--faint` fill and 2px radius. Unlogged days are a gap, not zero. Where the day stored a target (`targetKcal`, `targetProtein`), a dashed `--dim` **step line** marks it. No pass/fail colour on bars.
- **Body = line.** Raw readings are 3px `--dim` dots, joined by nothing. The **7-day trend** (`ROLLING`) is the line: 2px `--ink`, **linear, not `monotone`**. The current spline invents a valley between six points. Tape: one trend per site, told apart by dash pattern.
- **One amber pointer** (`--amber-mark`): a 1px vertical hairline plus a small triangle on the x axis at the latest day, or at the selected one. A pinned readout sits top-left of the well: `THU 19 NOV · 2,542 KCAL` (mono, the value in ink). It replaces the Recharts tooltip box.
- Tapping or dragging on the chart moves the pointer. **Tapping a bar or point again opens that day.**

**Tap a day (D8 consistency)**
A row tap opens a **Day screen**. It is the existing `range === "DAY"` branch with a `V2SHeader` (`THU 19 NOV`, back to History, ‹ › in the header). Contents, top to bottom:
1. **Past days only:** mode `V2SSeg` CUT / MAINTAIN / BULK (→ `setDayMode`), and `Scored against CUT · target 2,241 · 301 over` where the **target has the dashed underline and edits inline** (D4 grammar → `setDayTarget`; the `✎` goes).
2. `TRAINING · REST` segment.
3. The day's kcal (Num 40) plus **`V2Macros` tapes** against that day's stored targets. **The pie chart is cut.**
4. Foods: **the same `V2MealList`/`V2MealRow` as Today.** Tap a row to edit in place, with Save · Save to Quick Add · Delete. The `×` per row goes.
5. LOG FOOD | QUICK ADD, the same pair as Today (D7). `🤖 AI LOG` / `＋ MANUAL` go.
6. `V2Water`, then a body readout row (`WEIGHT 98.2 kg · BODY FAT 22 %`).

**Today's row goes to Today, not to the Day screen.** Its snapshot is rewritten from live state (see `isPastDay`).

## Never
- No emoji or glyph-as-word. Icons come from the 15-set, and none is needed on this screen except `water` inside `V2Water`.
- No categorical macro colours. Amber appears only as the pointer and the primary button.
- No good/bad colour on weight change, on bars, or on Maintain/Bulk rows.
- No glow, no Recharts default tooltip, no spline smoothing.
- No chart-type toggle and no multi-metric overlay.
- No scrolling tab strip.

## Open questions (for the chair)
1. **CUT-day grading on rows.** `V2Last7` grades CUT days in amber/over. Should a row carry the same small lamp in its gutter, only for amber or red days? My lean: yes, matching Last7 exactly.
2. **Today's meals edited from History.** Do they survive the snapshot rewrite? If not, routing today's row to Today is mandatory, not stylistic. **Eng to confirm.**
3. **CSV placement.** Keep the header text button, or fold it into Account & data next to the JSON download?
4. **Target step line for carbs.** Only protein and fat targets are stored per day. Draw no line for carbs, or derive one?
