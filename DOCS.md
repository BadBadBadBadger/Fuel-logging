# FUEL LOG — Product Documentation
**Version:** 4.0 (Phase 2)
**Last Updated:** April 2026

---

## 1. Product Overview

Fuel Log is a gym-focused calorie and macro tracking PWA. Targets are personalised from body composition and auto-adjust based on goal (cut/maintain/bulk), training day, and actual session type.

**Target users:** Anyone struggling to stay on top of daily food intake while working toward a body composition goal — cutting fat, building muscle, or maintaining. Built for people who understand macros and want a clean, fast tool without bloat or paywalls.

---

## 2. Tech Stack

| Layer | Detail |
|---|---|
| UI | React 18 UMD via unpkg CDN |
| JSX | Babel Standalone (in-browser, no build) |
| Charts | Recharts 2.12.7 |
| Styling | Inline React styles only |
| Storage | `window.storage` (artifact) / `localStorage` wrapper (PWA) |
| Food API | Open Food Facts (free, no key) — UI built, not yet surfaced in production PWA |
| AI API | Anthropic `claude-sonnet-4-20250514` via Cloudflare Worker |
| Hosting | GitHub Pages |
| Android | PWABuilder.com → APK |

**Critical constraints:**
- Babel Standalone crashes above ~900 lines (black screen). Keep files under 900 lines.
- No colons in storage keys — use `__` double-underscores only.
- No `<form>` tags — use `<div>` + onClick.
- `BackHdr` must be `position:sticky` so back button stays visible on scroll.

---

## 3. Calorie Calculation (Katch-McArdle)

```
LBM    = weight × (1 − bodyFat / 100)
BMR    = 370 + (21.6 × LBM)
TDEE   = BMR × activity multiplier
Target = TDEE + mode adjustment + training bonus
```

### Activity multipliers
| Key | Multiplier |
|---|---|
| sedentary | 1.2 |
| light (default) | 1.375 |
| moderate | 1.55 |
| active | 1.725 |
| very | 1.9 |

### Mode adjustments
| Mode | Adjustment |
|---|---|
| CUT | −500 kcal |
| MAINTAIN | 0 kcal |
| BULK | +500 kcal |

### Training bonus (Phase 2 — profile-aware)
```javascript
// Default (no session logged):
bonus = Math.round(weight × 2.8)   // 80kg → 224, 100kg → 280, 150kg → 420

// When session logged (MET-based):
const MET = {
  legs:     { light:4.0, moderate:6.0, heavy:8.0 },
  push:     { light:3.5, moderate:5.5, heavy:7.0 },
  pull:     { light:3.5, moderate:5.5, heavy:7.0 },
  fullbody: { light:4.5, moderate:6.5, heavy:9.0 },
  cardio:   { light:5.0, moderate:7.0, heavy:10.0 },
};
bonus = Math.round(MET[type][intensity] × weight × (LBM/70) × (duration/60))
```

calcTargets signature: `calcTargets(profile, mode, isTraining, sessKcal=null)`
Returns `{kcal, protein, carbs, fat, tdee, bmr, lbm, bonus}`.

---

## 4. Storage Keys (v4.0 — flat, single user)

| Key | Value |
|---|---|
| `profile` | JSON: `{weight, height, bodyFat, activity}` |
| `meals` | JSON: meal library array |
| `history` | JSON: snapshot array (sorted date asc) |
| `badges` | JSON: array of earned badge keys e.g. `["streak_0","logger_0"]` |
| `logs__YYYY-MM-DD` | JSON: food log entries |
| `water__YYYY-MM-DD` | Integer string |
| `train__YYYY-MM-DD` | `"true"` / `"false"` |
| `mode__YYYY-MM-DD` | `"cut"` / `"maintain"` / `"bulk"` |
| `session__YYYY-MM-DD` | JSON: `{type, duration, intensity}` |
| `coach__YYYY-MM-DD` | JSON: `{tip, r}` (tip text + refresh count) |

---

## 5. State Architecture

All state in Root. `meals` lifted to Root so `addToQA` (Dashboard) and `QuickAdd` share the same array.

| State | Type | Notes |
|---|---|---|
| `view` | string | Current screen |
| `logs` | array | Today's food entries |
| `water` | number | Glasses today |
| `train` | boolean | Training day toggle |
| `mode` | string | cut/maintain/bulk |
| `prof` | object/null | Body profile |
| `hist` | array | All historical snapshots |
| `meals` | array | Meal library — shared with QuickAdd |
| `session` | object | `{type, duration, intensity}` |
| `earnedBdgs` | array | Earned badge keys |
| `newBadge` | object/null | Currently celebrating badge tier |
| `ready` | boolean | Data loaded |

---

## 6. Components

| Component | Key props | Notes |
|---|---|---|
| `Dashboard` | `streak, session, onSession, sessionKcal` | Shows streak, session selector, coach card |
| `CoachCard` | `mode, totals, targets, streak, water` | Auto-generates when 200+ kcal logged |
| `ProfileScreen` | `onSave` | Auto-saves, 600ms debounce, ✓ SAVED flash |
| `AILog` | `onAdd` | Branded product-aware prompt |
| `QuickAdd` | `meals, setMeals` | Shared state from Root |
| `FoodSearch` | `onAdd` | Open Food Facts — built in artifact preview only, not in current PWA build |
| `History` | `history, onUpdateDay` | Charts, day edit, CSV |
| `TestRunner` | `onBack` | 37 tests, auto-runs on mount |

---

## 7. Phase 2 Features

### 7.1 Profile-Aware Training Bonus
Training bonus now scales with bodyweight. Default: `weight × 2.8` kcal. When session is logged (type + duration + intensity), uses MET formula accounting for lean mass. A 150kg lean person doing a heavy 45-min legs session gets ~680 kcal vs flat +200 previously.

### 7.2 Streak Counter
Calculated dynamically from history (`calcStreak`). Walks back from today counting consecutive days with at least one log entry. Displayed as 🔥N in dashboard header. Feeds into badge system and coach tip prompt.

### 7.3 Daily Coach Tip
`CoachCard` component sits between macros and water on dashboard. Auto-generates when 200+ kcal are logged for the day. Three sentences: honest observation, specific food suggestion for tomorrow, genuine praise. Max 3 refreshes/day (↺ button shows remaining). Stored in `coach__YYYY-MM-DD`. Works via Anthropic API — requires Claude.ai or Cloudflare Worker proxy.

### 7.4 Badge System (×2 Tier Progression)
```javascript
const TIERS      = [3, 6, 12, 24, 48, 96];
const TIER_NAMES = ["Bronze","Silver","Gold","Platinum","Diamond","Elite"];
const TIER_ICONS = ["🟤","⚪","🟡","🔵","💎","👑"];
```

Current badges:
| Badge | Emoji | Metric |
|---|---|---|
| On Fire | 🔥 | Logging streak days |
| Top Recorder | 🪈 | Total days with logs |
| Hydrated | 💧 | Days hitting 8 glasses |

Badge check runs in a `useEffect` watching history. When a new tier is earned, a full-screen celebration modal appears. Earned badges stored as `["streak_0", "logger_0", ...]` — badge ID + tier index. Never shown twice for the same tier.

### 7.5 Training Session Logging
When training toggle ⚡ is ON, a compact session selector appears below the mode row:
- Session type (Legs/Push/Pull/Full Body/Cardio)
- Duration (minutes, input)
- Intensity (Light/Moderate/Heavy)
- Live kcal estimate shown in real time

Session saved to `session__YYYY-MM-DD`. The estimated kcal is passed to `calcTargets` as `sessKcal`, overriding the default weight-based bonus.

---

## 8. AI Prompt (Branded Products)

The AI Log and Coach Tip prompts explicitly handle branded products:

```
IMPORTANT: If this includes any branded or named product (e.g. Magic Spoon,
Quest, Grenade, Halo Top, Weetabix, Oatly, Alpro), use your knowledge of
that product's ACTUAL nutritional profile — do NOT estimate based on generic
category averages.
```

---

## 9. Automated Tests (37 tests)

Access via 🧪 in dashboard header. Auto-runs on mount.

| Group | Count |
|---|---|
| Katch-McArdle | 9 (includes profile-aware bonus + session override) |
| Session Estimation | 3 (weight, duration, intensity scaling) |
| Streak | 2 |
| Food Logging | 5 |
| Mode Switching | 3 |
| Water | 3 |
| History | 4 |
| Badges | 4 (tier values, doubling, earn logic) |
| Quick Add | 4 |
| **Total** | **37** |

---

## 10. Cloudflare Worker Proxy

Required for AI features (Coach Tip + AI Log) on standalone PWA.

```javascript
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    const body = await request.json();
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": env.ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
};
```

Setup: Cloudflare Dashboard → Workers → Create → paste code → Deploy → Settings → Secrets → add `ANTHROPIC_KEY`.

---

## 11. Deployment

### GitHub Pages
1. Unzip `fuel-log-pwa-v4.zip`
2. Upload `index.html`, `manifest.json`, `sw.js`, `DOCS.md` to repo root
3. Settings → Pages → Branch: main → / (root) → Save
4. Bump `CACHE = "fuel-log-vN"` in sw.js on every deploy

### Android APK
1. pwabuilder.com → paste GitHub Pages URL → Package for Android → Download
2. Install APK directly (enable unknown sources)

---

## 12. Roadmap

### Immediate next steps
1. Complete Cloudflare Worker (paste code + `ANTHROPIC_KEY` secret) → test Coach Tip on phone
2. Generate Android APK via PWABuilder → sideload test
3. Beta with friends and gym buddies

### Phase 3 features
| Feature | Notes |
|---|---|
| Multi-user login | Per-device named users with PIN, namespaced storage |
| More badge categories | Protein King, Cut Champion, Bulk Mode, Balanced |
| Serving size multiplier on Food Search | |
| Edit log entry in place | Currently: delete and re-add |
| Weekly weigh-in tracker | Body weight trend over time |
| Food quality indicator | 🟢/🟡/🔴 based on macro ratios |
| Push notifications | Meal + water reminders |
| Cloud sync | Cross-device data |
| Play Store submission | PWABuilder AAB + $25 Google developer account |
