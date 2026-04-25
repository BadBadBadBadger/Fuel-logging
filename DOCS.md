# FUEL LOG — Product Documentation
**Version:** 6.0 (Flexible targets, sex-aware calculations, streak celebration)
**Last Updated:** April 2026

---

## 1. Product Overview

Fuel Log is a gym-focused calorie and macro tracking PWA. Targets are personalised from body composition and auto-adjust based on goal (cut/maintain/bulk), training day, and actual session type. From week 2 onwards, targets self-calibrate to the user's real metabolism using a weekly feedback loop comparing expected vs actual weight change.

**Target users:** Anyone struggling to stay on top of daily food intake while working toward a body composition goal — cutting fat, building muscle, or maintaining. Built for people who understand macros and want a clean, fast tool without bloat or paywalls.

---

## 2. Tech Stack

| Layer | Detail |
|---|---|
| UI | React 18 UMD (vendored — no CDN dependency) |
| JSX | Babel CLI (`@babel/preset-react` + `@babel/preset-env modules:false`) |
| Charts | Recharts 2.12.7 (vendored) |
| Styling | Inline React styles only |
| Storage | `localStorage` via `window.storage` bridge in `index.html` |
| Food API | Open Food Facts (free, no key required) |
| AI API | Anthropic `claude-sonnet-4-6` via Cloudflare Worker proxy |
| Hosting | GitHub Pages |
| Android | PWABuilder.com → APK |

**Build command:**
```bash
npx babel app.jsx --out-file app.js   # babel.config.json handles presets
```

**Critical constraints:**
- `app.jsx` must **not** use `export default` — loaded as a plain `<script>` tag, not an ES module.
- No colons in storage keys — use `__` double-underscores only.
- No `<form>` tags — use `<div>` + onClick.
- `BackHdr` must be `position:sticky` so back button stays visible on scroll.
- All AI calls must go through `callAI` / `callAIJson` helpers — never call `fetch(AI_ENDPOINT)` directly.
- Service worker bypasses `workers.dev`, `unpkg.com`, and `openfoodfacts.org`. Any new external API must be added to the bypass list in `sw.js`, otherwise POST responses get cached incorrectly and the feature silently returns HTML instead of JSON.
- Only `useState` and `useEffect` are destructured from React as globals. `useMemo`, `useCallback`, etc. are **not** available as globals — access them via `React.useMemo(...)` if needed, or use the `useState` initialiser pattern for stable values.

---

## 3. Calorie Calculation (Katch-McArdle)

```
LBM    = weight × (1 − bodyFat / 100)
BMR    = 370 + (21.6 × LBM)
TDEE   = (BMR × 1.2) + tdeeAdj        ← fixed baseline; adaptive engine adjusts tdeeAdj over time
Target = TDEE + mode adjustment + workout kcal
```

Activity multipliers were removed in v5.1. The fixed ×1.2 (sedentary baseline) is intentionally conservative — any real activity above sedentary shows up as logged workout kcal, and the adaptive TDEE engine corrects the remainder within 2 weeks of weigh-ins.

### Mode adjustments
| Mode | Adjustment |
|---|---|
| CUT | −500 kcal |
| MAINTAIN | 0 kcal |
| BULK | +500 kcal |

### Workout kcal
Logged workouts add to the calorie target for the day. Each workout entry is stored and persists; multiple per day supported.

```javascript
// MET-based estimate per workout:
kcal = Math.round(MET[type][intensity] × weight × (LBM/70) × (duration/60))

// Target = TDEE + mode adj + sum of all workout kcal today
```

### MET values
| Type | Light | Moderate | Heavy |
|---|---|---|---|
| Legs | 4.0 | 6.0 | 8.0 |
| Push | 3.5 | 5.5 | 7.0 |
| Pull | 3.5 | 5.5 | 7.0 |
| Full Body | 4.5 | 6.5 | 9.0 |
| Cardio | 5.0 | 7.0 | 10.0 |

### Sex-aware protein targets

Protein ratios vary by sex and mode:

| Mode | Male | Female |
|---|---|---|
| CUT | 2.2 g/kg LBM | 2.0 g/kg LBM |
| MAINTAIN | 1.8 g/kg LBM | 1.6 g/kg LBM |
| BULK | 2.0 g/kg LBM | 1.8 g/kg LBM |

Fat targets:

| Mode | Male | Female |
|---|---|---|
| CUT | 0.8 g/kg BW | 0.7 g/kg BW |
| MAINTAIN/BULK | 1.0 g/kg BW | 0.9 g/kg BW |

If `sex` is not set, male ratios are used as the default.

### Safe minimum calorie floors

| Sex | Safe minimum |
|---|---|
| Male | 1,400 kcal |
| Female | 1,200 kcal |

If a calculated or user-set target falls below the safe minimum it is **clamped** to that floor and a banner warning is shown on the dashboard linking to the profile screen.

`calcTargets` signature: `calcTargets(profile, mode, totalWorkoutKcal=0, tdeeAdj=0)`
Returns `{kcal, protein, carbs, fat, tdee, bmr, lbm, bonus, safeMinApplied}`.

---

## 4. Adaptive TDEE Engine

Fuel Log treats TDEE as a variable to be learned, not a fixed formula output. After the first week of weigh-ins, a calibration loop adjusts the TDEE estimate based on real results.

### How it works

**Week 1 — Baseline (Estimating)**
Targets come purely from the Katch-McArdle formula. The app collects daily weigh-ins to build a baseline.

**Week 2 — Learning**
On each new weigh-in, `runCalibration` compares:
- **Expected weight change** = (TDEE_estimate − avg_daily_kcal_last_7_days) × 7 / 7700
- **Actual weight change** = 7-day rolling average now − 7-day rolling average one week ago

If you lost more than expected, your real TDEE is higher than the formula → adjustment increases.
If you lost less than expected, your real TDEE is lower → adjustment decreases.

**Week 4+ — Calibrated**
With 28+ weigh-ins the confidence level reaches "Calibrated" and the adjustment is reliable.

### Calibration algorithm
```javascript
discrepancy    = actualChange - expectedChange        // kg
rawAdj         = -discrepancy × 7700 / 7             // kcal
adj            = clamp(round(rawAdj / 50) × 50, -150, +150)   // rounded to 50, capped per run
cumulativeAdj  = clamp(cumulativeAdj + adj, -600, +600)        // lifetime cap
```

### Noise safeguards
- Requires ≥ 8 weigh-ins before calibration runs (ensures rolling averages are meaningful)
- Requires ≥ 4 food-log days in the last 7 days (sparse logging → skip calibration)
- 7-day rolling average on both ends of the comparison (filters water weight)
- Per-run cap of ±150 kcal (prevents overreaction to one odd week)
- Lifetime cap of ±600 kcal (prevents runaway drift)
- Adjustments rounded to nearest 50 kcal (avoids false precision)

### Confidence levels
| Weigh-ins | Label | Meaning |
|---|---|---|
| 0–6 | — | No calibration yet |
| 7–13 | Estimating | Collecting baseline, no adjustment yet |
| 14–27 | Learning | Calibration active, low-confidence adjustments |
| 28+ | Calibrated | Reliable — adjustment reflects real metabolism |

### Storage
| Key | Value |
|---|---|
| `weighins` | JSON array: `[{date, weight}, ...]` sorted by date ascending |
| `tdee_adj` | String integer: cumulative TDEE adjustment in kcal (can be negative) |

---

## 5. Storage Keys

| Key | Value |
|---|---|
| `profile` | JSON: `{weight, height, bodyFat, sex}` — `sex` is `"male"`, `"female"`, or `null` |
| `meals` | JSON: meal library array |
| `history` | JSON: snapshot array (sorted date asc) |
| `badges` | JSON: array of earned badge keys e.g. `["streak_0","logger_0"]` |
| `weighins` | JSON: `[{date, weight}, ...]` — daily body weight log |
| `tdee_adj` | Integer string: cumulative TDEE calibration offset (kcal) |
| `logs__YYYY-MM-DD` | JSON: food log entries |
| `water__YYYY-MM-DD` | Integer string |
| `workouts__YYYY-MM-DD` | JSON: `[{id, type, duration, intensity, kcal, time, notes?}]` |
| `mode__YYYY-MM-DD` | `"cut"` / `"maintain"` / `"bulk"` |
| `coach__YYYY-MM-DD` | JSON: `{tip, r}` (AI tip text + refresh count) |
| `target_kcal` | Integer string: user's custom daily calorie target (null/absent = use preset) |
| `aggressive_cut_acked` | `"1"` when user has acknowledged the red aggressive-cut warning |
| `streak_anim__YYYY-MM-DD` | `"1"` — set after the streak celebration plays, prevents replay same day |

---

## 6. State Architecture

All state in Root. `meals` lifted to Root so `addToQA` (Dashboard) and `QuickAdd` share the same array.

| State | Type | Notes |
|---|---|---|
| `view` | string | Current screen |
| `logs` | array | Today's food entries |
| `water` | number | Glasses today |
| `workouts` | array | Today's logged workouts `[{id, type, duration, intensity, kcal, time, notes?}]` |
| `mode` | string | cut/maintain/bulk |
| `prof` | object/null | Body profile |
| `hist` | array | All historical snapshots |
| `meals` | array | Meal library — shared with QuickAdd |
| `earnedBdgs` | array | Earned badge keys |
| `newBadge` | object/null | Currently celebrating badge tier |
| `ready` | boolean | Data loaded |
| `weighIns` | array | `[{date, weight}]` — all weigh-ins sorted by date |
| `tdeeAdj` | number | Cumulative TDEE calibration offset in kcal |
| `coachKey` | number | Incremented to force CoachCard remount on dev time reset |
| `streakAnim` | object/null | `{streak, isMilestone}` — triggers `StreakCelebration` overlay |
| `customKcal` | number/null | User-overridden daily calorie target; `null` = use preset |
| `aggressiveCutAcked` | boolean | Whether user has acknowledged the red aggressive-cut warning |

---

## 7. Components

| Component | Key props | Notes |
|---|---|---|
| `Dashboard` | `weighIns, onWeighIn, tdeeAdj, baseTDEE, workouts, onAddWorkout, onRemoveWorkout, customKcal, onSetCustomKcal, isCustomMode, aggressiveCutAcked, onAckAggressiveCut` | Shows all today's data + weigh-in widget + workout logger + target override |
| `WeighInWidget` | `weighIns, onWeighIn, tdeeAdj, baseTDEE` | Daily weight input, trend, confidence, TDEE insight |
| `WorkoutLogger` | `workouts, onAdd, onRemove, prof` | Log/delete multiple workouts; paste Hevy log for AI parse |
| `CoachCard` | `mode, totals, targets, streak, water` | Auto-generates when 200+ kcal logged; uses `callAI` |
| `ProfileScreen` | `tdeeAdj, weighIns, aggressiveCutAcked` | Shows formula TDEE, adjustment, effective TDEE, confidence, sex selector, BF% guidance |
| `StreakCelebration` | `streak, isMilestone, onDone` | Full-screen emoji overlay; Web Audio whoosh+thud; auto-dismisses after 1.5s |
| `AILog` | `onAdd` | AI-powered meal breakdown with confidence scores; uses `callAI`/`callAIJson` |
| `QuickAdd` | `meals, setMeals` | Shared state from Root |
| `FoodSearch` | `onAdd` | Open Food Facts search with robust kcal/serving parsing |
| `History` | `history, onUpdateDay, weighIns` | Charts including weight + 7-day rolling avg, day edit, CSV |
| `Achievements` | `earnedBdgs` | Badge display with tier progression |

---

## 8. Calorie & Macro Tolerance (Forgiving Colour Logic)

### Calorie display

| Consumption vs target | Colour | Label |
|---|---|---|
| Any amount under | Green | REMAINING |
| 0–100 kcal over | Green | REMAINING |
| 100–200 kcal over | Amber (#ffb84b) | JUST OVER |
| 200–500 kcal over | Amber (#ffb84b) | OVER BY |
| 500+ kcal over | Red (#ff5555) | OVER BY |

The 100 kcal green buffer prevents punishing small estimation errors.

### Macro display

| Macro vs target | Colour |
|---|---|
| Under by any amount | Own colour (blue/orange/red-orange) |
| Within 5g of target (either direction) | Own colour — counts as hit |
| 5–15g over | Amber (#ffb84b) |
| 15g+ over | Red (#ff5555) |

---

## 9. Flexible Daily Calorie Target

### Preset modes
Three preset buttons on the dashboard — CUT (TDEE−500), MAINTAIN (TDEE), BULK (TDEE+500). Tapping a preset clears any custom override and snaps to that preset's kcal value.

### Custom target (tap-to-override)
The target display has a dashed underline with a small ✎ hint indicating it is tappable. Tapping opens an inline numeric input (no separate modal). Typing a new number and pressing Done/Return saves it. Tapping away without changing preserves the original value. When in edit mode, the underline becomes solid using the mode colour.

### Auto mode detection
When a custom kcal is set, the mode label updates automatically:

| Custom kcal vs TDEE | Mode label colour |
|---|---|
| Below TDEE | CUT (blue) |
| Equal to TDEE | MAINTAIN (green) |
| Above TDEE | BULK (orange) |

Preset buttons appear deselected while a custom target is active.

### Deficit/surplus notes

| Deficit/surplus | Indicator |
|---|---|
| 0–150 kcal below TDEE | Info note: "Deficit is small — progress will be slow but sustainable 👍" |
| 0–150 kcal above TDEE | Info note: "Small surplus — lean gains but slow 👍" |
| 750–1000 kcal below TDEE | Amber warning about aggressive deficit |
| 1000+ kcal below TDEE | Red warning + inline "Yes, I understand →" confirm button |

The red aggressive-cut confirmation is shown once. After the user taps confirm, a flag (`aggressive_cut_acked`) is saved to localStorage and subsequent visits show only an amber reminder.

### Proportional macro scaling
When a custom kcal target is set, all three macros (protein, carbs, fat) are scaled proportionally:
```
scale = customKcal / baseTargets.kcal
protein = round(baseTargets.protein × scale)
carbs   = max(50, round(baseTargets.carbs × scale))
fat     = round(baseTargets.fat × scale)
```
The ratio of macros as a percentage of total calories remains constant.

### Safe minimum enforcement
If a custom target falls below the sex-specific safe minimum (1,400 kcal male / 1,200 kcal female), it is clamped and a contextual banner appears: *"That's below the safe minimum for your body. We've set it to X kcal to keep you safe."*

### Persistence
The custom target persists via `target_kcal` in localStorage and survives page reloads.

---

## 10. Safe Minimum Calorie Guard

| Sex | Safe minimum |
|---|---|
| Male | 1,400 kcal |
| Female | 1,200 kcal |

Applies to both calculated targets (e.g. an aggressive CUT on a low body weight) and manually entered custom targets. When the floor is hit:
- Target is clamped to the safe minimum
- An amber banner appears on the dashboard with a link to the profile screen
- Banner message is context-aware: preset mode vs manual entry shows different wording

---

## 11. Sex Setting (Profile Screen)

The sex selector shows MALE / FEMALE toggle buttons. No default is pre-selected on first use. Helper text: *"Used to calculate your calorie and macro targets"*.

- If sex is not set, male calculations are used as the default, and a prompt on the profile screen reads *"Set your sex for more accurate targets"*.
- When Female is selected, a note appears: *"Targets may need adjusting around your cycle — override anytime"*.
- Changing sex recalculates all targets immediately.

---

## 12. Body Fat % Guidance (Profile Screen)

- When the body fat % input is focused, inline helper text expands below: *"Not sure? Use 25% for men or 30% for women as a starting estimate"* + explanation that a more accurate figure improves targets.
- If the entered value is below 4% or above 50%, an amber inline warning appears: *"That seems unusual — double-check this number as it affects your calorie targets"*. Saving is not blocked.

---

## 13. Streak Celebration Animation

Plays on the first food log of the day when an active streak exists and the animation hasn't already played today.

### Standard celebration
- Full-screen fixed overlay with a large 💪 emoji centred, 🔥 emojis floating around it
- The streak number counts up from the previous value to the new value via `requestAnimationFrame`
- Web Audio API: sawtooth whoosh sweep + noise buffer thud (no audio files)
- Auto-dismisses after 1.5 seconds
- A flag is saved to `streak_anim__YYYY-MM-DD` in localStorage to prevent replay the same day

### Milestone celebration (days 7, 14, 30, 50, 100)
- More flame floaters, 🎉🎊 confetti row
- Milestone number pulses on the arm emoji
- Same 1.5-second auto-dismiss

### Edge cases
| Scenario | Behaviour |
|---|---|
| Animation already played today | No animation — meal logs silently |
| First ever log (no streak) | Animation plays, counts 0 → 1 |
| Missed a day | No animation, streak resets to 1, no punishing message |

---

## 14. Weight Input Sync

Saving a weight from the weigh-in widget on the dashboard updates the profile `weight` field immediately. This means calorie and macro targets recalculate in the same render cycle. The updated weight persists after a page reload.

---

## 15. AI Features

### AI Meal Log (`AILog`)
Describes a meal in plain English. AI breaks it into individual components with:
- Exact kcal/protein/carbs/fat per item
- Confidence score (0–100): 90+ = exact label data, 60–89 = good knowledge, <60 = estimate
- Reasoning explaining the source of data
- Open Food Facts cross-reference (uses label data if higher confidence than AI estimate)
- Individual item or all-at-once logging
- Re-estimate any item by tapping ✏️ and correcting the name

### AI Workout Parser
Paste a workout log (exercises, sets, reps, weights) and Claude estimates:
- Calories burned (MET-based, adjusted for lean mass)
- Session type, intensity, summary
- Overrides the manual session selector

### Daily Coach Tip (`CoachCard`)
Auto-generates when 200+ kcal logged. Three sentences:
1. Honest observation about today
2. Specific food suggestion for tomorrow
3. Genuine praise

Max 3 refreshes/day. Stored in `coach__YYYY-MM-DD`.

### API endpoint
All AI calls route through `AI_ENDPOINT` (Cloudflare Worker proxy at `fuellog.adriandavidrichards.workers.dev`). The worker adds the `ANTHROPIC_KEY` secret and forwards to `api.anthropic.com`. Model: `claude-sonnet-4-6`.

Two shared helpers handle all AI calls — **do not call `fetch(AI_ENDPOINT)` directly**:
```javascript
callAI(prompt, maxTokens)     // → string (raw text response)
callAIJson(prompt, maxTokens) // → parsed object (strips ```json fences automatically)
```

---

## 16. Food Search

Searches Open Food Facts (millions of products, no API key). Parsing:
- Tries `energy-kcal_100g` first, falls back to `energy_100g` ÷ 4.184 (kJ → kcal)
- `serving_size` parsed with `parseFloat` — falls back to 100g if non-numeric or out of range (5–2000g)
- Returns up to 12 results filtered to products with valid kcal data

---

## 17. History & Weight Chart

The History screen supports:
- **Range filters**: Day / 7 Days / 30 Days / 3 Months / 1 Year / All Time
- **Macro charts**: Kcal, Protein, Carbs, Fat (line or bar)
- **Weight chart**: Toggle ⚖️ Weight to see body weight trend. Shows daily readings (blue dots) + 7-day rolling average line (green) to cut through noise. Rolling avg requires ≥3 readings in the window.
- **Weight trend summary**: First → last weight and total change shown in averages card
- **Day view**: Full food log, macro pie chart, water, training toggle, add/remove entries, CSV export

---

## 18. Badge System (×2 Tier Progression)

```javascript
const TIERS      = [3, 6, 12, 24, 48, 96];
const TIER_NAMES = ["Bronze","Silver","Gold","Platinum","Diamond","Elite"];
```

| Badge | Emoji | Metric |
|---|---|---|
| On Fire | 🔥 | Logging streak days |
| Top Recorder | 🪈 | Total days with logs |
| Hydrated | 💧 | Days hitting 8 glasses |

Badge check runs in a `useEffect` watching history. When a new tier is earned, a full-screen celebration modal appears. Never shown twice for the same tier.

---

## 19. Automated Tests

Run with:
```bash
npm test
```

Tests live in `__tests__/logic.test.js`. No browser required — Jest runs them in Node.

| Group | Tests | What's covered |
|---|---|---|
| `calcTargets — Katch-McArdle` | 15 | BMR, TDEE, all modes, training bonus, session override, macros, carb floor, activity multipliers |
| `calcTargets — tdeeAdj` | 3 | Positive/negative adjustments propagate to kcal and tdee fields |
| `estimateSessionKcal` | 6 | MET scaling by type/intensity/weight/duration/body fat, unknown type fallback |
| `calcStreak` | 5 | Consecutive days, gap breaks streak, empty logs, empty history |
| `sumLogs` | 4 | Multi-entry accumulation, empty array, partial fields |
| `weighRollingAvg` | 4 | Average accuracy, cutoff exclusion, insufficient data, empty array |
| `runCalibration` | 3 | Insufficient data guards, positive adjustment when burning more than expected |
| `safeMinimum` | 4 | Sex-specific floors, clamping, safeMinApplied flag |
| **Total** | **44** | |

---

## 20. Gherkin Spec

Feature behaviour is documented as executable Gherkin scenarios in `features/fuel-log.feature`. This file is the source of truth for UX decisions (colour thresholds, warning copy, animation timing, etc.) and should be updated before any implementation change.

Current features covered:
1. Sex setting on profile screen
2. Calorie tolerance — forgiving colour logic
3. Macro tolerance — forgiving colour logic
4. Safe minimum calorie guard
5. Body fat % guidance on profile screen
6. Streak celebration animation
7. Weight input sync
8. Flexible daily calorie target with auto mode detection
9. Tap to override daily calorie target

---

## 21. Cloudflare Worker Proxy

Required for all AI features (Coach Tip, AI Meal Log, Workout Parser).

```javascript
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: {
        "Access-Control-Allow-Origin":  "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }});
    }
    const body = await request.json();
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": env.ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }});
  }
};
```

Setup: Cloudflare Dashboard → Workers → Create → paste code → Deploy → Settings → Secrets → add `ANTHROPIC_KEY`.

---

## 22. Deployment

### GitHub Pages
1. Push `index.html`, `app.js`, `manifest.json`, `sw.js`, icons to repo root
2. Settings → Pages → Branch: main → / (root) → Save
3. **Always bump `CACHE = "fuel-log-vN"` in `sw.js` on every deploy** to force service worker refresh

### Android APK
1. pwabuilder.com → paste GitHub Pages URL → Package for Android → Download
2. Install APK directly (enable unknown sources)

---

## 23. Roadmap

### Phase 3 features
| Feature | Notes |
|---|---|
| Multi-user login | Per-device named users with PIN, namespaced storage |
| More badge categories | Protein King, Cut Champion, Bulk Mode, Balanced |
| Serving size multiplier on Food Search | Currently uses product's default serving size |
| Edit log entry in place | Currently: delete and re-add |
| Weekly weigh-in summary notification | Recap of the week's calibration |
| Push notifications | Meal + water reminders |
| Cloud sync | Cross-device data |
| Play Store submission | PWABuilder AAB + $25 Google developer account |
