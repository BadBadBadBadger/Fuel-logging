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
| `auth_state` | `"anonymous"` or `"premium"` — persists across reloads |
| `auth_user` | JSON: `{name, email, picture, grantedBy, subExpiry, since}` — null/absent when anonymous |

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

---

## 7. Components

| Component | Key props | Notes |
|---|---|---|
| `Dashboard` | `...existing... authState, authUser, onPremiumGate, onSignOut` | Shows all today's data; derives `isPremium = authState === "premium"`; gates AI LOG button and CoachCard; shows account avatar when premium |
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

### In progress — Auth & Premium (candidate branch)
| Phase | Description | Status |
|---|---|---|
| Phase 1 | Auth skeleton: anonymous/premium states, PremiumModal, Google Sign In, voucher code | **Done** |
| Phase 2 | Supabase cloud sync, data migration, offline queue, conflict resolution | **Done** |
| Phase 3 | Real payments: Google Play Billing (Android TWA), Stripe (web/Apple) | Up next |
| Phase 4 | AI Chef: AI-powered recipe suggestions and meal planning | Pending Phase 3 |
| Phase 5 | Cloudflare Worker auth gate: verify Supabase JWT before proxying AI | Pending Phase 3 |

### Other backlog
| Feature | Notes |
|---|---|
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

When `isPremium` is true, the dashboard header shows a 34×34 button to the right of 🏆:
- If `authUser.picture` is set: renders `<img>` of Google profile photo
- Otherwise: renders first letter of `authUser.name` in green

Tapping this button calls `onSignOut` → sets `showSignOut = true` → `SignOutModal` opens.

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

### Before going live checklist
- [x] Run cleanup SQL to wipe test data from Supabase (harness + desktop test sessions)
- [x] Test sign-in on phone (Chrome browser, not installed PWA)
- [x] Confirm data migrates from phone localStorage to Supabase on first sign-in
- [x] Reinstall PWA on phone after confirming browser flow works
- [ ] Phase 3 (real payments) before public launch
