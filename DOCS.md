# FUEL LOG — Product Documentation
**Version:** 6.1 (Cream-grey UI refresh, WCAG-AA readability, top-aligned navigation)
**Last Updated:** June 2026

> **What's new in 6.1** — The neon-lime palette was replaced with a warm cream-grey
> theme; all text lifted to ≥WCAG-AA contrast; every screen now opens top-aligned;
> the Google avatar is more robust (no-referrer + graceful fallback); and the
> service worker is skipped on `localhost` for friction-free local dev. See
> §35 Design System, §36 Local Development, and §37 Changelog.

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
- Service worker bypasses (current `sw.js` list): `api.anthropic.com`, `workers.dev`, `openfoodfacts.org`, `unpkg.com`, `accounts.google.com`, `googleapis.com`, `supabase.co`. Any new external API must be added to this bypass list, otherwise POST responses get cached incorrectly and the feature silently returns HTML instead of JSON.
- The service worker only registers in **production**. On `localhost`/`127.0.0.1`/`file://` it is skipped and any existing registration is unregistered, so local dev never serves a stale bundle (see §36).
- Only `useState` and `useEffect` are destructured from React as globals. `useMemo`, `useCallback`, etc. are **not** available as globals — access them via `React.useMemo(...)` if needed, or use the `useState` initialiser pattern for stable values.
- Colours come from four central constants (`A`, `BG`, `CARD`, `BD`) plus a hard-coded cream-grey text/surface scale — see §35 before changing any colour.

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
| `auth_state` | `"anonymous"` or `"premium"` — persists across reloads |
| `auth_user` | JSON: `{name, email, picture, grantedBy, subExpiry, since}` — null/absent when anonymous |
| `sync_migrated__<uid>` | `"1"` — set once a signed-in user's local data has been migrated to Supabase, prevents re-migrating on later sign-ins (premium only) |
| `fuel_schema_v` | Integer string: stored data schema version (current `SCHEMA_VERSION = 1`); see §38 |

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
| `authState` | string | `"anonymous"` or `"premium"` |
| `authUser` | object/null | `{name, email, picture, grantedBy, subExpiry, since}` — null when anonymous |
| `premiumGate` | object/null | `{emoji, name}` of the feature that was tapped — drives which modal shows |
| `showSignIn` | boolean | Whether the SignInModal is open |
| `showSignOut` | boolean | Whether the SignOutModal is open |
| `showLapsed` | boolean | Whether the LapsedModal is open (subscription expired on load) |
| `isOnline` | boolean | Live network status (from `online`/`offline` events); drives sync behaviour |
| `syncMsg` | string | Transient cloud-sync status message shown in the header |

**Top-aligned navigation:** an effect in `App` watching `view` resets scroll to the top on every top-level screen change (`window.scrollTo(0,0)` + `document.scrollingElement.scrollTop = 0`), so each page opens at the top rather than inheriting the previous screen's scroll position. Sub-navigation within a screen (e.g. paging days in History) does **not** reset.

---

## 7. Components

| Component | Key props | Notes |
|---|---|---|
| `Dashboard` | `...existing... authState, authUser, onPremiumGate, onSignOut, isOnline, syncMsg` | Shows all today's data; derives `isPremium = authState === "premium"`; gates AI LOG button and CoachCard; renders `<Avatar>` in the header when premium |
| `Avatar` | `user, size = 34` | Google profile pic with graceful fallback. Uses `referrerPolicy="no-referrer"` so `googleusercontent` images don't 403/429, and an `onError` handler that falls back to the user's initial (cream on dark) instead of a broken-image icon |
| `WeighInWidget` | `weighIns, onWeighIn, tdeeAdj, baseTDEE` | Daily weight input, trend, confidence, TDEE insight |
| `WorkoutLogger` | `workouts, onAdd, onRemove, prof, isPremium, onPremiumGate` | Paste log button calls `onPremiumGate` when `isPremium` is false; no UI change otherwise |
| `CoachCard` | `mode, totals, targets, streak, water` | Only rendered when `isPremium` is true — no AI call is made for anonymous users |
| `ProfileScreen` | `tdeeAdj, weighIns, aggressiveCutAcked` | Unchanged |
| `StreakCelebration` | `anim, onDone` | Full-screen emoji overlay; Web Audio whoosh+thud; auto-dismisses after 1.5s |
| `AILog` | `onAdd` | AI-powered meal breakdown; only reachable when premium (view is never set to `"ai"` for anonymous) |
| `QuickAdd` | `meals, setMeals` | Available to all users |
| `FoodSearch` | `onAdd` | Available to all users |
| `History` | `history, onUpdateDay, weighIns` | Available to all users |
| `Achievements` | `earnedBdgs` | Available to all users |
| `PremiumModal` | `feature, onUpgrade, onDismiss` | `feature`: `{emoji, name}` of the locked feature tapped, or `null` for generic. "Start Free Trial" → `onUpgrade`. "Maybe Later" → `onDismiss` |
| `SignInModal` | `onSuccess, onCancel` | Two steps: `"google"` then `"payment"`. When `GOOGLE_CLIENT_ID` is empty, skips straight to `"payment"` (dev mode). `onSuccess(googleUser, grantedBy)` called on successful voucher entry |
| `SignOutModal` | `userName, onConfirm, onCancel` | Warning modal. "Sign Out" → `onConfirm` clears all data. "Stay Signed In" → `onCancel` |
| `LapsedModal` | `onRenew, onDismiss` | Shown on startup when `auth_user.subExpiry` has passed. "Renew Premium" → `onRenew` opens SignInModal. "Continue for Free" → `onDismiss` |

---

## 8. Calorie & Macro Tolerance (Forgiving Colour Logic)

### Calorie display

| Consumption vs target | Colour | Label |
|---|---|---|
| Any amount under | Accent cream (#e8e2d4) | REMAINING |
| 0–100 kcal over | Accent cream (#e8e2d4) | REMAINING |
| 100–200 kcal over | Amber (#ffb84b) | JUST OVER |
| 200–500 kcal over | Amber (#ffb84b) | OVER BY |
| 500+ kcal over | Red (#ff5555) | OVER BY |

The 100 kcal "in-range" buffer prevents punishing small estimation errors. (Before the 6.1 refresh the in-range colour was neon lime; it is now the cream accent — see §35.)

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
| Equal to TDEE | MAINTAIN (cream accent) |
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
- **Weight chart**: Toggle ⚖️ Weight to see body weight trend. Shows daily readings (blue dots, #4b9fff) + 7-day rolling average line (cream accent, `A`) to cut through noise. Rolling avg requires ≥3 readings in the window.
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
| `calcTargets — Katch-McArdle` | 15 | BMR, TDEE, all modes, training bonus, session override, macros, carb floor, and sex-specific safe-minimum clamping (`safeMinApplied`) |
| `estimateSessionKcal — MET-based` | 6 | MET scaling by type/intensity/weight/duration/body fat, unknown type fallback |
| `calcStreak` | 5 | Consecutive days, gap breaks streak, empty logs, empty history |
| `sumLogs` | 4 | Multi-entry accumulation, empty array, partial fields |
| `calcTargets — tdeeAdj` | 3 | Positive/negative adjustments propagate to kcal and tdee fields |
| `weighRollingAvg` | 4 | Average accuracy, cutoff exclusion, insufficient data, empty array |
| `runCalibration` | 3 | Insufficient data guards, positive adjustment when burning more than expected |
| `runMigrations` | 4 | Stamps schema version when absent, no-op when current, never overwrites user data, applies once across calls |
| **Total** | **44** | |

(Safe-minimum behaviour is verified inside the `calcTargets — Katch-McArdle` group, not a separate suite.)

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
10. Top-aligned navigation — pages open at the top
11. Premium account avatar — Google profile picture with fallback

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

> ⚠️ **Re-sequenced for security (2026-06-06).** The original plan put payments first and
> the worker auth gate last — i.e. charging money through an open AI proxy. The authoritative
> plans are now **`SECURITY_ROADMAP.md`** (security phases) and **`LEGAL_ROADMAP.md`** (legal/
> compliance — Phase B + pre-payment commercial prerequisites), which close the holes *before*
> taking money or shipping to the Play Store. See also `ARCHITECTURE_REVIEW.md` for findings & severities.

### Done
| Phase | Description | Status |
|---|---|---|
| Phase 1 | Auth skeleton: anonymous/premium states, PremiumModal, Google Sign In, voucher code | **Done** |
| Phase 2 | Supabase cloud sync, data migration, offline queue, conflict resolution | **Done** |

### Security-aligned sequence (supersedes the old Phase 3–5 order) — see `SECURITY_ROADMAP.md`
| Phase | Description | Status |
|---|---|---|
| 0 | **Lock the live worker** — JWT auth, model allowlist, max_tokens cap, per-user rate limit, CORS lock, Anthropic spend cap | **✅ Deployed (2026-06-07)** — optional KV quota + spend cap remain |
| A | **Server-authoritative entitlement** — `entitlements` table, server-checked voucher, remove voucher from bundle (the real paywall) | **✅ Deployed (2026-06-07)** — RLS SELECT-policy gap to close |
| B | **Compliance & data rights** — privacy policy, health-data consent, Anthropic sub-processor disclosure, export + delete | **➜ Plan agreed — see `LEGAL_ROADMAP.md`** (18+/UK-EEA) |
| C | **Resilience & trust** — single persistence layer, surface sync failures, CI build/test gate | Parallel with A/B |
| D | **Payments** — Play Billing + Stripe, server-side receipt verification (now safe) | Pending B + `LEGAL_ROADMAP §12` (Cloudflare/domain/entity) |
| E | **Pre-launch hardening + go-live gate** — pen self-test, secrets inventory, key rotation | Pending Phase D |
| F | **Monitoring & incident readiness** — cost/error observability, abuse alerting, kill-switch runbook | Post-launch |

**Feature track (parallel, gated):** AI Chef, planned items, etc. may proceed *only behind the Phase 0 gate* — no feature ships a new unauthenticated AI path.

### Other backlog
| Feature | Notes |
|---|---|
| **Bug: AI coach ignores goals already met/exceeded** | Coach tells you to "drink 2 more glasses" after 10/8, or "eat 25g more protein" after 200/175g. **Cause:** the prompt at `app.jsx` `CoachCard` (~L1180) sends raw `X/Y` ratios but never states over/under, so the model assumes a deficit. **Fix:** compute surplus/deficit per metric and put it in the prompt explicitly (e.g. "protein 200/175g — 25g OVER, goal met ✅"; "water 10/8 — exceeded"), and instruct it not to suggest more of a metric that's already met. Cheap, high-trust win. |
| Multi-user login | Per-device named users with PIN, namespaced storage |
| More badge categories | Protein King, Cut Champion, Bulk Mode, Balanced |
| Serving size multiplier on Food Search | Currently uses product's default serving size |
| Edit log entry in place | Currently: delete and re-add |
| Weekly weigh-in summary notification | Recap of the week's calibration |
| Push notifications | Meal + water reminders |

---

## 24. Phase 1 Auth Implementation (candidate branch — complete)

### What was built
Phase 1 adds the full auth skeleton to `app.jsx` with no external service dependencies. Everything works off `localStorage`. The only external script added is the Google Identity Services library (GIS), which is inert until `GOOGLE_CLIENT_ID` is set.

### New constants (`app.jsx` top of file)

```javascript
const GOOGLE_CLIENT_ID = "";       // Set after Google Cloud setup — see §29
const VOUCHER_CODE     = "FreeFoodTips2026";
```

When `GOOGLE_CLIENT_ID` is an empty string, the sign-in modal skips the Google step entirely and goes straight to the voucher entry screen. This is the expected state until OAuth is configured.

### New helper

```javascript
const parseJwt = token => {
  try { return JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))); }
  catch(e) { return {}; }
};
```

Used to decode the Google Identity Services credential JWT and extract `{name, email, picture}`.

### Auth state startup sequence

Inside the existing `load()` function (on app mount):

```
1. Read auth_state from localStorage
2. If "premium": read auth_user and parse
   a. If subExpiry set and < Date.now(): reset to anonymous, set showLapsed = true
   b. Otherwise: setAuthState("premium"), setAuthUser(user)
3. If absent or "anonymous": remain anonymous (default)
```

### Sign-in success handler (`handleSignInSuccess`)

```javascript
const handleSignInSuccess = async (googleUser, grantedBy) => {
  const user = { name, email, picture, grantedBy, subExpiry: null, since: Date.now() };
  setAuthUser(user); setAuthState("premium");
  await ss("auth_state", "premium");
  await ss("auth_user",  JSON.stringify(user));
  setShowSignIn(false); setPremiumGate(null);
};
```

`subExpiry: null` means no expiry — used for the voucher phase. Real payments (Phase 3) will set this to the renewal timestamp.

`grantedBy` values: `"voucher"` | `"google_play"` | `"stripe"`.

### Sign-out handler (`handleSignOut`)

Clears these specific `localStorage` keys: `auth_state`, `auth_user`, `profile`, `meals`, `history`, `badges`, `weighins`, `tdee_adj`, `target_kcal`, `aggressive_cut_acked`.

Also iterates `localStorage` to clear all keys with prefixes: `logs__`, `water__`, `workouts__`, `mode__`, `coach__`, `streak_anim__`.

Then resets all React state to defaults (`anonymous`, empty logs, default meals, etc.).

### Feature gating

| Feature | Gate mechanism |
|---|---|
| AI LOG button | `onClick`: if `!isPremium` → `onPremiumGate({emoji:"🤖", name:"AI LOG"})`. If premium → `setView("ai")` |
| WorkoutLogger paste button | `onClick`: if `!isPremium` → `onPremiumGate({emoji:"🏋️", name:"Workout AI Parser"})`. If premium → `setHevyMode(true)` |
| CoachCard | Wrapped: `{isPremium && <CoachCard .../>}` — not rendered at all for anonymous |
| Quick Add | No gate — available to all |
| Food Search | No gate — available to all |

`isPremium` is derived locally inside Dashboard: `const isPremium = authState === "premium";`

### Modal render order in App return

```jsx
{premiumGate && !showSignIn && <PremiumModal feature={premiumGate} onUpgrade={() => setShowSignIn(true)} onDismiss={() => setPremiumGate(null)}/>}
{showSignIn  && <SignInModal  onSuccess={handleSignInSuccess} onCancel={() => { setShowSignIn(false); setPremiumGate(null); }}/>}
{showSignOut && <SignOutModal userName={authUser?.name} onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)}/>}
{showLapsed  && <LapsedModal onRenew={() => { setShowLapsed(false); setShowSignIn(true); }} onDismiss={() => setShowLapsed(false)}/>}
```

PremiumModal hides when SignInModal opens (both driven by the same user action) so they don't stack.

### SignInModal internal state

| State | Values | Notes |
|---|---|---|
| `step` | `"google"` \| `"payment"` | Starts at `"payment"` when `GOOGLE_CLIENT_ID` is empty |
| `gUser` | object/null | Google user `{name, email, picture}`; pre-filled as Guest in dev mode |
| `voucher` | string | Current input value |
| `vError` | string | Shown below input on wrong code |

The `useEffect` on step `"google"` calls `google.accounts.id.initialize` + `renderButton` to mount the official GIS button inside `<div id="gsi-btn">`. If GIS library hasn't loaded yet (e.g. offline), the effect silently no-ops.

### Account avatar (premium indicator)

When `isPremium` is true, the dashboard header shows a 34×34 button to the right of 🏆, rendering the `<Avatar user={authUser}/>` component:
- If `authUser.picture` is set: renders `<img>` of the Google profile photo with `referrerPolicy="no-referrer"` (stops `googleusercontent` 403/429 failures)
- On image load failure (`onError`) or no picture: renders the first letter of `authUser.name` in the cream accent

Tapping this button calls `onSignOut` → sets `showSignOut = true` → `SignOutModal` opens.
(As of 6.1 this is the standalone `Avatar` component — see §7 and §35.)

### `index.html` changes

```html
<!-- Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

Added above the vendored React scripts. The `async defer` means it won't block page load and will be available when the user taps sign in.

### `sw.js` changes

- Cache version bumped: `fuel-log-v21` → `fuel-log-v22`
- Three new bypasses added so the service worker never caches these external requests:
  - `accounts.google.com` — GIS auth requests
  - `googleapis.com` — Google API calls
  - `supabase.co` — Phase 2 cloud sync (pre-emptive)

---

## 25. Authentication & Subscription Model

### Two states only

| State | Storage | AI features | Cloud sync | Logging |
|---|---|---|---|---|
| **Anonymous** | `localStorage` only | Hidden | None | Quick Add, Search, History |
| **Premium** | `localStorage` + Supabase (Phase 2) | All | Full | All features |

There is no intermediate "free with limits" state. Either the user is anonymous, or they are premium.

### Pricing
| Plan | Price |
|---|---|
| Monthly | £4.99 / month |
| Annual | £49.99 / year (~£4.17/month) |
| Free trial | 30 days, rolls into monthly if not cancelled |

### Voucher code (Phase 1 — pre-payment)
During Phase 1, subscriptions are not yet wired to payment. Users can access premium by entering the voucher code `FreeFoodTips2026` after Google Sign In. This grants premium with no expiry date until real payments are configured.

### Platform strategy
- **Android (Play Store)**: TWA (Trusted Web Activity) via PWABuilder. Payments via **Google Play Billing** (required by Google policy for digital subscriptions sold inside Android apps). Uses the Digital Goods API.
- **iOS / Safari (web)**: If reached via browser, payments via **Stripe** (web checkout). Apple does not require in-app purchase for web apps accessed via Safari.

### Auth storage keys
| Key | Value |
|---|---|
| `auth_state` | `"anonymous"` \| `"premium"` |
| `auth_user` | JSON: `{name, email, picture, grantedBy, subExpiry, since}` |

`grantedBy`: `"voucher"` \| `"google_play"` \| `"stripe"`. Voucher grants no `subExpiry`. Real subscriptions set `subExpiry` to the renewal timestamp.

---

## 26. Premium Feature Gates

| Feature | Anonymous | Premium |
|---|---|---|
| Quick Add | ✅ | ✅ |
| Food Search | ✅ | ✅ |
| History | ✅ | ✅ |
| Achievements | ✅ | ✅ |
| Profile / targets | ✅ | ✅ |
| Weight log | ✅ | ✅ |
| Adaptive TDEE | ✅ | ✅ |
| **AI Meal Log** | ❌ → PremiumModal | ✅ |
| **Workout AI Parser** (Hevy paste) | ❌ → PremiumModal | ✅ |
| **Daily Coach tip** | ❌ hidden | ✅ |
| **Cloud sync** | ❌ | ✅ (Phase 2) |

### PremiumModal behaviour
- Triggered when an anonymous user taps a locked feature button
- Styled to match the badge celebration modal (same card, same green accent border)
- Shows the feature's emoji and name at the top
- Lists all 4 premium unlocks with emojis
- Shows pricing: £4.99/month · £49.99/year · 30-day free trial
- Two buttons: "Start Free Trial 🚀" → sign in flow | "Maybe Later" → dismiss
- Feels like an invitation, not a paywall — never aggressive

---

## 27. Sign In & Upgrade Flow

```
Anonymous user taps locked feature
  └─ PremiumModal appears
       ├─ "Maybe Later" → dismiss, back to dashboard
       └─ "Start Free Trial" → SignInModal (step: google)
              ├─ GOOGLE_CLIENT_ID not set → skip to payment step (dev mode)
              └─ Google Sign In (GIS popup) → credential parsed → step: payment
                     ├─ "Subscribe" button (disabled until Phase 3)
                     └─ "Enter access code" → voucher input
                            ├─ Wrong code → inline error
                            └─ "FreeFoodTips2026" → premium granted, modal closes
                                   └─ App enters premium state, all AI features unlock
```

### Sign out flow
```
Premium user taps account avatar (top-right of dashboard)
  └─ SignOutModal:
       "Signing out will remove local data.
        Your cloud data is safe and will restore on next login."
       ├─ "Stay Signed In" → cancel
       └─ "Sign Out" → all localStorage cleared, state reset to anonymous
```

### Subscription lapsed flow
```
App opens, auth_state === "premium", subExpiry < Date.now()
  └─ LapsedModal:
       "Your Premium subscription has ended"
       Your data is retained and visible
       ├─ "Renew Premium" → SignInModal (payment step)
       └─ "Continue for Free" → dismiss, app runs as anonymous
```

### Google Sign In implementation
- Library: Google Identity Services (GIS) — loaded in `index.html`
- Script: `https://accounts.google.com/gsi/client`
- Credential callback: `google.accounts.id.initialize({ client_id, callback })`
- Button render: `google.accounts.id.renderButton(el, { theme:"outline", size:"large" })`
- Credential is a JWT — decode with `parseJwt(credential)` to get `{name, email, picture}`
- `GOOGLE_CLIENT_ID` constant in `app.jsx` — set after Google Cloud Console setup (§29)

---

## 28. New Storage Keys (Auth)

Add to the storage key reference table in §5:

| Key | Value |
|---|---|
| `auth_state` | `"anonymous"` or `"premium"` |
| `auth_user` | JSON: `{id, name, email, picture, grantedBy, subExpiry, since}` — `id` is Supabase UUID (null in dev/voucher-only mode) |

---

## 29. Supabase Data Sync (Phase 2 — complete, candidate branch)

**Credentials wired into:**
- `index.html` — Supabase CDN + `window.supabaseClient = supabase.createClient(URL, ANON_KEY)`
- `app.jsx` — `GOOGLE_CLIENT_ID` set; sync helpers use `sb() = window.supabaseClient`

**Schema file:** `setup/supabase-schema.sql` — already run in Supabase SQL Editor.

### Tables
| Table | Purpose |
|---|---|
| `profiles` | Body stats (weight, height, bodyFat, sex) |
| `food_logs` | Food log entries — unique on `(user_id, entry_id)` |
| `water_logs` | Daily water count — unique on `(user_id, date)` |
| `workouts` | Workout entries — unique on `(user_id, entry_id)` |
| `weigh_ins` | Daily body weight — unique on `(user_id, date)` |
| `settings` | Mode, tdeeAdj, customKcal, aggressiveCutAcked |
| `meal_library` | Custom meals — unique on `(user_id, name)` |
| `badges` | Earned badge keys — unique on `(user_id, badge_key)` |
| `history_snapshots` | Daily snapshots — unique on `(user_id, date)` |
| `coach_tips` | Cached AI tip per day |

All tables have `updated_at TIMESTAMPTZ` and Row Level Security.

### Sync architecture
- **Write path:** localStorage first (instant), then fire-and-forget Supabase upsert
- **Read path on startup:** load from localStorage immediately, background-pull Supabase and merge into React state
- **On sign-in:** `migrateLocalToSupabase(uid)` pushes all local data once (guarded by `sync_migrated__<uid>` localStorage flag), then `pullFromSupabase(uid)` merges down any data from other devices
- **Offline:** all syncs check `navigator.onLine` and return early; Dashboard header shows OFFLINE badge; no errors shown to user
- **Conflict resolution:** last-write-wins via upsert with fresh `updated_at` on every save

### Key helpers (app.jsx — after `parseJwt`)
| Helper | Purpose |
|---|---|
| `sb()` | Returns `window.supabaseClient` |
| `syncFoodLogs(uid, date, logs)` | Delete+re-insert all entries for a date |
| `syncWater(uid, date, glasses)` | Upsert water count |
| `syncWorkouts(uid, date, ws)` | Delete+re-insert workouts for a date |
| `syncProfile(uid, p)` | Upsert fitness profile |
| `syncWeighIns(uid, wis)` | Upsert all weigh-in rows |
| `syncSettings(uid, mode, tdeeAdj, customKcal, acked)` | Upsert settings row |
| `syncMeals(uid, meals)` | Upsert meal library |
| `syncBadges(uid, keys)` | Upsert badge rows |
| `syncHistory(uid, hist)` | Upsert history snapshot rows |
| `migrateLocalToSupabase(uid)` | One-time push of all localStorage data |
| `pullFromSupabase(uid)` | Pull all user data and write back to localStorage + React state |

### SignInModal GIS callback (Phase 2)
```javascript
callback: async resp => {
  const { data, error } = await sb().auth.signInWithIdToken({ provider:"google", token:resp.credential });
  // Falls back to parseJwt if Supabase call fails
  setGUser({ id: data.session.user.id, name: ..., email: ..., picture: ... });
  setStep("payment");
}
```

### Sign-out (Phase 2)
`sb().auth.signOut()` called before clearing localStorage. Also clears `sync_migrated__<uid>` keys.

---

## 30. Google OAuth Setup (Step by Step)

**Do this when ready to wire up real Google Sign In.**

1. Go to https://console.cloud.google.com
2. Create a new project (or use an existing one) — name it "Fuel Log"
3. Left sidebar → **APIs & Services → Credentials**
4. **+ Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name: "Fuel Log Web"
7. **Authorised JavaScript origins** — add all URLs the app is served from:
   - `https://YOUR-USERNAME.github.io` (GitHub Pages)
   - `http://localhost:3000` (local dev)
8. **Authorised redirect URIs** — add the same URLs (GIS doesn't always need this but add to be safe)
9. Click **Create** — copy the **Client ID** (looks like `XXXXXXXXXX.apps.googleusercontent.com`)
10. In `app.jsx`, replace the `GOOGLE_CLIENT_ID` placeholder:
    ```javascript
    const GOOGLE_CLIENT_ID = "XXXXXXXXXX.apps.googleusercontent.com";
    ```
11. Also go to **OAuth consent screen**:
    - User type: External
    - App name: Fuel Log
    - User support email: your email
    - Scopes: just `email` and `profile` (default)
    - Add test users while in development
    - Submit for verification when ready for production (required for >100 users)
12. Build and deploy

---

## 31. Supabase Setup (Step by Step — complete)

**Done.** Project: `hvohicddolqpcgzgrbwc.supabase.co`. Schema run. Google OAuth provider linked. Credentials wired into `index.html`.

1. Go to https://supabase.com → **New Project**
2. Name: "fuel-log", region: closest to your users (Europe West for UK)
3. Set a database password — save it somewhere safe
4. Wait ~2 minutes for project to spin up
5. Left sidebar → **SQL Editor → New Query**
6. Paste the entire contents of `setup/supabase-schema.sql` and click **Run**
7. Left sidebar → **Authentication → Providers**
8. Enable **Google** — you'll need the Google OAuth Client ID and Secret from §29
   - Client ID: from Google Cloud Console
   - Client Secret: also from Google Cloud Console (under the same OAuth credential)
9. Left sidebar → **Project Settings → API**
10. Copy two values:
    - **Project URL** (e.g. `https://xyzxyz.supabase.co`)
    - **anon / public key** (long JWT string)
11. In `index.html`, uncomment the Supabase script tag and fill in the values:
    ```html
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    ```
    And in `app.jsx`:
    ```javascript
    const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
    const SUPABASE_ANON_KEY = "eyJ...";
    ```
12. Left sidebar → **Authentication → URL Configuration**
    - Site URL: `https://YOUR-USERNAME.github.io`
    - Redirect URLs: add `https://YOUR-USERNAME.github.io` and `http://localhost:3000`
13. Build and deploy

---

## 32. Cloudflare Worker Auth Gate (Phase 2 — not yet active)

**Do this after Phase 2 Supabase sync is working.**

The current worker has no auth — any request to the worker URL can call the AI.
Phase 2 will lock it so only verified premium users can call the AI.

### How it works
1. Premium users sign in via Supabase (Google OAuth)
2. Supabase issues a JWT access token
3. App sends `Authorization: Bearer <supabase_jwt>` header with every AI request
4. Worker verifies the JWT using `SUPABASE_JWT_SECRET`
5. Only verified, non-expired tokens get proxied to Anthropic

### Updated worker code
The updated `cloudflare-worker.js` (with auth gate) is ready — add these two secrets in Cloudflare Dashboard → Worker → Settings → Variables and Secrets:
- `ANTHROPIC_KEY` — already set
- `SUPABASE_JWT_SECRET` — from Supabase → Project Settings → API → JWT Secret

---

## 33. Play Store Submission (TWA via PWABuilder)

**Target: Google Play Store via Trusted Web Activity (TWA)**

### Prerequisites
1. App live at GitHub Pages URL
2. Google Developer Account ($25 one-time): https://play.google.com/console/signup
3. App icons at 192×192 and 512×512 (already in repo)
4. Privacy policy URL (required by Play Store for apps that handle user data)

### Steps
1. Go to https://www.pwabuilder.com
2. Enter your GitHub Pages URL
3. Click **Package for Stores → Android**
4. Fill in:
   - Package name: `com.fuellog.app` (or similar reverse-domain format)
   - App version: 1.0.0
   - Signing: generate a new keystore (save it — you'll need it for every update)
5. Download the AAB file
6. Google Play Console → Create app → Upload AAB
7. Fill in Store Listing (description, screenshots, privacy policy URL)
8. Content rating questionnaire
9. Submit for review (typically 1–3 days)

### Digital Goods API (for Google Play Billing in Phase 3)
When Google Play Billing is implemented:
- The TWA must declare `billing` permission in the Android manifest (PWABuilder handles this)
- The app uses the Payment Request API with `https://play.google.com/billing` as the payment method
- Products/subscriptions are defined in Play Console → Monetisation → Subscriptions
- Product IDs: `premium_monthly`, `premium_annual`
- 30-day free trial is configured in Play Console per product

---

## 34. Phase 1 & 2 Testing — Troubleshooting Log

A record of every issue hit during Phase 1/2 testing and how each was resolved. Useful reference for future sessions or if any issue recurs.

---

### Issue 1 — `preview.html` missing Supabase and GIS scripts
**Symptom:** Google Sign In button never appeared in the test harness.  
**Cause:** `preview.html` only loaded vendor React/Recharts scripts. Supabase CDN and GIS were only in `index.html`.  
**Fix:** Added both scripts to `preview.html`. Then vendored Supabase JS (see Issue 3).

---

### Issue 2 — Google OAuth `origin_mismatch` on localhost
**Symptom:** `Error 400: origin_mismatch` when trying to sign in via the test harness.  
**Cause:** `http://localhost:3000` was not registered as an Authorised JavaScript Origin in Google Cloud Console.  
**Fix:** Google Cloud Console → APIs & Services → Credentials → Fuel Log OAuth client → Authorised JavaScript origins → added `http://localhost:3000` and `https://badbadbadbadbadger.github.io`. Also added both to Authorised redirect URIs.

---

### Issue 3 — Edge tracking prevention blocking Supabase CDN
**Symptom:** Console showed `Tracking Prevention blocked access to storage for https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`. Supabase auth session could not be stored. Sign-in appeared to work but no data reached Supabase.  
**Cause:** Microsoft Edge treats jsdelivr.net as a third-party tracker and blocks its localStorage access.  
**Fix:** Downloaded Supabase JS and saved to `vendor/supabase.js`. Updated `index.html` and `preview.html` to load from `vendor/supabase.js` instead of CDN. Added to SW ASSETS list. Use Chrome for all local testing — Edge has compatibility issues with Google Sign In locally.

---

### Issue 4 — Google Cloud Console project not found
**Symptom:** User could not find an existing project in Google Cloud Console.  
**Cause:** OAuth credentials were created in a previous session without a named project, or under a different Google account view.  
**Fix:** Found existing credentials by checking all projects in the console. Client ID: `922818167366-5nl6qfteipui307j1oi7asu7d3bkgvat.apps.googleusercontent.com`.

---

### Issue 5 — Google Client Secret lost / hand-typed incorrectly
**Symptom:** Supabase Google provider was not authenticating users (no rows appearing in Authentication → Users).  
**Cause:** Client Secret had been hand-typed from notes and likely had a typo. Google no longer allows viewing existing secrets.  
**Fix:** Created a new Client Secret in Google Cloud Console (same OAuth client → Add client secret). Pasted the new secret directly into Supabase → Authentication → Sign in / Providers → Google.

---

### Issue 6 — Supabase Google provider disabled
**Symptom:** No users appearing in Supabase Authentication → Users after signing in.  
**Cause:** Supabase Google provider was never enabled.  
**Navigation change:** Supabase renamed the menu — it is now under **Authentication → Sign in / Providers** (not "Providers" directly).  
**Fix:** Enabled Google provider, filled in Client ID and Client Secret, saved.

---

### Issue 7 — No data in Supabase after sign-in (auth session not stored)
**Symptom:** Google sign-in appeared to complete, voucher accepted, premium granted — but no rows in any Supabase table.  
**Cause:** Edge tracking prevention (Issue 3) meant Supabase could not store its auth session token. `signInWithIdToken` failed silently, fell back to `parseJwt`, `user.id` was null, and all sync was skipped.  
**Fix:** Same as Issue 3 — vendor Supabase JS. Confirmed working in Chrome.

---

### Issue 8 — QuickAdd meals not syncing to Supabase
**Symptom:** Adding a new meal in Quick Add screen did not create a row in `meal_library` table.  
**Cause:** `QuickAdd` component has its own local `save` function that calls `setMeals` and `ss()` directly, bypassing the `syncMeals` call.  
**Fix:** Created `saveMeals` wrapper in App (sets state + localStorage + fires `syncMeals`). Passed as `setMeals` prop to QuickAdd. Also refactored `addToQA` to use `saveMeals`.

---

### Issue 9 — Data appeared "missing" after sign-in (dev date simulator)
**Symptom:** After signing out and back in, food logs did not appear on the dashboard. Data was confirmed in Supabase.  
**Cause:** Test data had been logged under a simulated future date (2026-05-01) using the dev harness "Progress Day" button. The dashboard shows today's date only, so the data was present but in the History view, not the dashboard.  
**Fix:** Not a bug. Reset date to today in dev panel. Always reset to today before testing sign-out/sign-in restore flow.

---

### Issue 10 — Typo in GitHub Pages URL in Google Cloud Console
**Symptom:** OAuth worked locally but failed on GitHub Pages.  
**Cause:** One of the Authorised JavaScript Origins had `badbadbaddbadger.github.io` (extra `d`) instead of `badbadbadbadbadger.github.io`. Google matched the wrong URL.  
**Fix:** Deleted the duplicate typo entry. The correct URL `https://badbadbadbadbadger.github.io` was already listed.

---

### Issue 11 — OAuth consent screen in Testing mode
**Symptom:** `access_denied` or auth blocked for new users.  
**Cause:** App is in Testing mode in Google Cloud Console (not published). Only explicitly added test users can sign in.  
**Fix:** Google Cloud Console → Google Auth Platform → Audience → Test users → Add `adriandavidrichards@gmail.com`. Publishing to production requires Google verification — not needed until public launch.  
**Note:** Testing mode is fine for personal use and internal testing indefinitely.

---

### Current status (as of 2026-04-27)

| Item | Status |
|---|---|
| Google Sign In → Supabase auth | ✅ Working (Chrome) |
| Food logs syncing to Supabase | ✅ Confirmed |
| Water, history, settings syncing | ✅ Confirmed |
| Meal library syncing | ✅ Fixed (Issue 8) |
| Sign out → sign in → data restores | ✅ Confirmed (Chrome desktop + phone) |
| GitHub Pages deployment | ✅ Deployed (`badbadbadbadger.github.io/Fuel-logging/`) |
| Phone test (GitHub Pages) | ✅ Validated — sign-in, migration, restore all confirmed on device |
| Edge browser support | ⚠️ Works on deployed app; local testing requires Chrome |

**Phase 2 fully validated on real hardware (2026-04-27).** All sync paths confirmed working end-to-end on phone.

**Root cause of phone Google auth failure:** Google Cloud Console had `badbadbadbadbadger.github.io` (4 "bad"s) instead of `badbadbadbadger.github.io` (3 "bad"s + "badger" — matches GitHub username `BadBadBadBadger`). Fixed by correcting all authorized origins and redirect URIs.

### Phase 0 & A Testing — Security Hardening (2026-06-06/07)

Implemented worker auth gate (Phase 0) + server-authoritative entitlement (Phase A).

**Issue 1 — Worker not redeployed with `/redeem` endpoint**
**Symptom:** Voucher redemption returned "failed to fetch".  
**Cause:** The hardened worker with `/redeem` endpoint was written to the repo but not deployed to Cloudflare. The old open worker was still live.  
**Fix:** Cloudflare Dashboard → Worker → Edit code → paste entire new `cloudflare-worker.js` → Deploy.

---

**Issue 2 — `SUPABASE_SERVICE_ROLE` secret missing from Cloudflare**
**Symptom:** Voucher redemption returned "failed to fetch", then 503 Service Unavailable.  
**Cause:** The `/redeem` endpoint requires the service role key to write entitlements, but the secret was not added to Cloudflare. Worker code checks `if (!env.SUPABASE_SERVICE_ROLE)` and returns 503.  
**Fix:** Supabase Dashboard → Settings → API → Copy "service_role secret" → Cloudflare Worker → Settings → Variables and Secrets → Add secret `SUPABASE_SERVICE_ROLE` → Save → Redeploy worker.

---

**Issue 3 — CORS error on localhost testing (403)**
**Symptom:** Voucher redemption returned CORS error: `Access-Control-Allow-Origin` header was `https://badbadbadbadger.github.io`, not `http://localhost:3000`.  
**Cause:** The worker's `ALLOWED_ORIGINS` list only included the production GitHub Pages origin. Local testing on `localhost:3000` was blocked.  
**Fix:** Updated `cloudflare-worker.js` to add `http://localhost:3000` and `http://127.0.0.1:3000` to `ALLOWED_ORIGINS`. Redeployed worker.

---

**Issue 4 — Variable name typo in Cloudflare secret**
**Symptom:** After fixing Issue 2, voucher still returned 503.  
**Cause:** Secret was added with a slightly different variable name (user typo when typing into Cloudflare).  
**Fix:** Verified exact variable name in Cloudflare: `SUPABASE_SERVICE_ROLE` (case-sensitive). Fixed the typo.

---

### Current status (as of 2026-06-07)

| Item | Status |
|---|---|
| Phase 0: Worker auth gate (JWT + model allowlist + token cap + CORS) | ✅ Live |
| Phase A: Server-authoritative entitlement (entitlements table + /redeem endpoint) | ✅ Live |
| Voucher code removed from client bundle | ✅ Done |
| Voucher redemption (server-side) | ✅ Working |
| DevTools `auth_state` flip blocked server-side | ✅ Verified |
| AI features require active entitlement (worker checks Supabase) | ✅ Verified |
| Per-user rate limit (KV) | ⏳ Code ready; KV not bound yet (optional) |

**Phase 0 + A fully validated on localhost (2026-06-07).** Voucher redemption working, server-side entitlement enforced.

### Before going live checklist
- [x] Phase 0 (worker auth gate) deployed and verified
- [x] Phase A (server-authoritative entitlement) deployed and verified
- [ ] Bind RATE_LIMIT KV namespace to worker (per-user daily quota — optional but recommended)
- [ ] Set Anthropic Console billing cap + alert
- [ ] **Phase B (Compliance & data rights) — privacy policy, consent, export/delete**
- [ ] **Phase C (Resilience) — single persistence layer, surface sync failures, CI gate**
- [ ] **Phase D (Payments) — only after B & C are done**
- [ ] **Phase E (Pre-launch gate) — pen self-test, secrets audit, key rotation**

---

## 35. Design System & Visual Theme

Fuel Log uses a **dark, warm cream-grey** theme (introduced in v6.1, replacing the
original neon-lime/black "energy-drink" palette). All styling is inline React
styles — there is no CSS framework. Colours come from four central constants plus
a hard-coded cream-grey scale.

### Core constants (`app.jsx`, top of file)

```javascript
const A = "#e8e2d4", BG = "#0b0d0b", CARD = "#141210", BD = "#24211b";
```

| Constant | Hex | Role |
|---|---|---|
| `A`  | `#e8e2d4` | **Accent** — primary buttons, active tabs, calorie ring, MAINTAIN mode, chart rolling-average line, avatar initial. Cream on dark; dark text (`#0b0d0b`) sits on it for buttons. |
| `BG` | `#0b0d0b` | App background (near-black). Also used as dark text colour on the cream accent. |
| `CARD` | `#141210` | Card / panel surface (warm near-black). |
| `BD` | `#24211b` | Borders and dividers (warm dark). |

### Surface scale (warm dark neutrals)

| Hex | Use |
|---|---|
| `#0b0d0b` | App background (`BG`) |
| `#141210` | Cards (`CARD`), recessed backgrounds |
| `#1c1a15` | Raised buttons / inactive toggles / icon buttons |
| `#24211b` | Borders (`BD`), active/hover state backgrounds |
| `#2c2820` | Disabled button background |
| `#3a352a` | Lighter / active borders |

### Text scale (warm cream-grey)

All text colours target **≥WCAG-AA contrast (4.5:1)** against `BG` `#0b0d0b`, except
placeholders and disabled text which are intentionally lower. Lighter = more
prominent; the hierarchy is by lightness, not hue.

| Hex | Approx contrast | Typical use |
|---|---|---|
| `#ffffff` / `#efeae0` | ~19:1 / ~16:1 | Headings, big stat numbers |
| `#e6e1d7` | ~14:1 | Primary body text, `<select>` text |
| `#c2bcb0` | ~10:1 | Bright secondary text |
| `#b6b0a4` | ~9:1 | Secondary emphasis |
| `#aea79c` / `#a7a197` | ~8:1 / ~7:1 | Secondary text |
| `#9b958b` | ~5.9:1 | Muted labels (most common label colour) |
| `#8b857c` | ~4.9:1 | Captions / hints |
| `#827c73` | ~4.5:1 | Dim captions, inactive states |
| `#6e6960` | ~3.6:1 | **Placeholders** (intentionally below body floor but readable) |
| `#524d46` | ~2.4:1 | **Disabled** text / boundary nav arrows (intentional) |

### Status colours (semantic — unchanged by the refresh)

| Hex | Meaning |
|---|---|
| `#4b9fff` | Blue — CUT mode, water, daily weight dots |
| `#ff7b4b` | Orange — BULK mode |
| `#ffb84b` | Amber — warnings, "just over" calories, mid confidence |
| `#ff5555` | Red — over-limit, errors, destructive (sign-out) |
| `#8a7030` | Dark amber — amber accents on dark backgrounds |

Blue-tinted dark surfaces (e.g. `#131826`, `#0f1c2e`, `#1e2a3a`, `#2a4a7a`) are kept
for the water / CUT-mode sections and are **not** part of the cream-grey scale.

### Rules when changing colours
- Prefer the constants (`A`/`BG`/`CARD`/`BD`); only reach for raw hex when matching
  an existing scale value above.
- Keep body/label text at ≥4.5:1 against `BG`. Use the contrast table as the floor.
- Placeholders are set globally in `index.html` **and** the in-app `<style>` block in
  `app.jsx` — update both. The same applies to the `candidate/index.html` harness.
- The accent is dual-purpose (fill **and** text). If you change `A`, verify both
  dark-text-on-accent (buttons) and accent-text-on-dark (labels, ring) still read well.

---

## 36. Local Development & Service Worker

### Dev server

```bash
node dev-server.js
```

Serves the repo root at **http://localhost:3000** with `Cache-Control: no-store`.
`/` → `index.html` (the real app); `/preview.html` is the phone-frame harness with
the dev panel (date/time simulator, seed data). See SETUP.md for the dev-panel controls.

### Service worker is production-only (v6.1+)

`index.html` registers the service worker **only** when the hostname is not
`localhost`, `127.0.0.1`, or empty (`file://`). On those hosts it instead
*unregisters* any existing service worker:

```javascript
var SW_HOST_OK = !["localhost", "127.0.0.1", ""].includes(location.hostname);
if ("serviceWorker" in navigator && !SW_HOST_OK) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister())).catch(() => {});
}
if ("serviceWorker" in navigator && SW_HOST_OK) { /* register + update banner */ }
```

This permanently fixes the "my change isn't showing on localhost" problem: the SW
can no longer serve a stale cached bundle in local dev. Production (GitHub Pages)
behaviour is unchanged — the SW registers and the "new version ready" banner still
appears after a deploy.

### If a stale bundle ever appears anyway (production / old cache)
1. Reload — production shows the *"A new version of Fuel Log is ready — Reload"* banner; click it.
2. Or DevTools → **Application** → **Storage** → **Clear site data**, then `Ctrl+Shift+R`.
3. During dev, DevTools → Application → Service Workers → tick **Update on reload** + **Bypass for network**.

### Common console noise on localhost (harmless)
- `[GSI_LOGGER]: The given origin is not allowed for the given client ID` / `403` —
  `http://localhost:3000` isn't an authorized JavaScript origin for the Google OAuth
  client. Expected locally; use the voucher code (`FreeFoodTips2026`) to reach premium.
- `Cross-Origin-Opener-Policy policy would block the window.postMessage call` —
  a benign warning from Google's GIS library.
- `chrome-error://chromewebdata/ ... Unsafe attempt to load URL` — Chrome's
  "site can't be reached" page; means the **dev server isn't running** (`node dev-server.js`).

---

## 37. Changelog

### v6.1 — Cream-grey UI refresh & readability (June 2026)
- **Theme:** replaced the neon-lime/black palette with a warm cream-grey theme.
  Accent `#a3ff4b → #e8e2d4`; all green text/labels and green-tinted dark
  surfaces remapped to the cream-grey scale (§35). Blue/orange/amber/red status
  colours retained.
- **Readability:** every muted text colour lifted to ≥WCAG-AA contrast against the
  background; placeholders made legible (were ~1.5:1, now ~3.6:1).
- **Top-aligned navigation:** every top-level screen now opens scrolled to the top
  (effect in `App` watching `view`).
- **Avatar robustness:** new `Avatar` component — `referrerPolicy="no-referrer"`
  fixes Google profile-pic 403/429 failures, and an `onError` fallback shows the
  user's initial instead of a broken-image icon.
- **Local dev:** service worker is now skipped (and auto-unregistered) on
  `localhost`/`127.0.0.1`/`file://` so local testing is never served a stale bundle.
- Files touched: `app.jsx`, `index.html`, `candidate/index.html`, `sw.js`
  (cache → `fuel-log-v27`).

### v6.0 — Flexible targets, sex-aware calculations, streak celebration (April 2026)
- Flexible daily calorie target with tap-to-override and auto mode detection (§9).
- Sex-aware protein/fat targets and safe-minimum calorie guard (§3, §10, §11).
- Body-fat guidance, streak celebration animation, weight-input sync (§12–§14).
- Auth & premium (Phase 1) and Supabase cloud sync (Phase 2) landed on the
  candidate branch (§24–§31).

---

## 38. Data Migrations (schema versioning)

`localStorage` data shape is versioned so future changes can transform existing
users' data safely on upgrade.

```javascript
const SCHEMA_VERSION = 1;

const runMigrations = async () => {
  const v = parseInt(await sg("fuel_schema_v") || "0");
  if (v >= SCHEMA_VERSION) return;
  // v0 → v1: baseline release — no transforms needed, just stamp version.
  // Add future migrations here: if (v < 2) { ... }
  await ss("fuel_schema_v", String(SCHEMA_VERSION));
};
```

- `runMigrations()` runs **once on startup** (early in `load()`), before state is read.
- Stored version lives in `fuel_schema_v`; absent = treated as `0`.
- To add a migration: bump `SCHEMA_VERSION`, add an `if (v < N) { ...transform... }`
  block, then the stamp at the end records the new version. Migrations must be
  idempotent and must never overwrite newer user data (covered by the
  `runMigrations` test group, §19).

Separately, `migrateLocalToSupabase(uid)` is a **one-time per-user** push of existing
local data (profile, weigh-ins, settings, meals, badges, today's logs) to Supabase on
first sign-in. It is guarded by the `sync_migrated__<uid>` key so it never re-runs for
that user. This is cloud-sync onboarding, distinct from the schema migrations above.
