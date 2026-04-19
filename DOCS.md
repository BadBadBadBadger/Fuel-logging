# FUEL LOG — Product Documentation
**Version:** 2.0  
**Last Updated:** April 2026  
**Type:** Progressive Web App (PWA) — installable on Android via Chrome  
**Repo format:** 3-file static site (index.html, manifest.json, sw.js)

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Technology Stack](#2-technology-stack)
3. [Feature Reference](#3-feature-reference)
4. [Complete Features](#4-complete-features)
5. [Incomplete / Partial Features](#5-incomplete--partial-features)
6. [Known Limitations](#6-known-limitations)
7. [Data Architecture](#7-data-architecture)
8. [Configuration Reference](#8-configuration-reference)
9. [Deployment](#9-deployment)
10. [Roadmap Considerations](#10-roadmap-considerations)

---

## 1. Product Overview

Fuel Log is a gym-focused calorie and macro tracking Progressive Web App built for daily use during a cutting phase. It is designed to be fast, friction-free, and installable on Android as a home screen app without requiring an app store.

**Primary user:** Male, cutting (calorie deficit), training on a schedule, GMT/BST timezone (UK).

**Core philosophy:**
- Log food with minimum taps
- See your remaining calories and macros at a glance
- Track across days with full history and charts
- Work offline after first load

---

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| UI Framework | React 18 (via CDN) | Hooks-based functional components |
| JSX Transform | Babel Standalone (via CDN) | In-browser transpilation — no build step |
| Charts | Recharts | LineChart, BarChart, PieChart |
| Styling | Inline React styles | No CSS framework — full design control |
| Storage (Claude artifact) | `window.storage` API | Provided by Claude.ai artifact environment |
| Storage (PWA standalone) | `localStorage` | Swapped in for the standalone HTML version |
| Food Database | Open Food Facts API | Free, public, no API key required |
| AI Macro Estimation | Anthropic Claude API (`claude-sonnet-4-20250514`) | Requires API key — only works inside Claude.ai |
| PWA Shell | Custom service worker (`sw.js`) | Caches app shell for offline use |
| PWA Manifest | `manifest.json` | Enables "Add to Home Screen" on Android Chrome |
| Hosting | GitHub Pages | Free static hosting from public repository |
| APK Generation | PWABuilder.com (external tool) | Wraps PWA into a signed Android APK |

---

## 3. Feature Reference

### Dashboard
The main screen. Visible every time the app opens.

| Element | Description |
|---|---|
| Date display | Shows current day in `en-GB` format using device local timezone (GMT/BST auto) |
| Training day toggle | Switches between REST (1,800 kcal) and TRAINING (2,200 kcal) targets. Persisted per day. |
| History button (📊) | Top-right shortcut to the History screen |
| Calorie card | Shows kcal consumed, kcal remaining or over, animated progress bar. Goes red if over target. |
| Macro bars | Protein, Carbs, Fat — each shows consumed vs target with a coloured progress bar |
| Water tracker | Glass counter (0–8+). Increment/decrement buttons. Visual pip display. |
| Add food buttons | Three entry points: AI Log, Quick Add, Food Search |
| Today's log | Scrollable list of all foods logged today. Each entry shows name, time, macros, kcal. Tap × to delete. |

---

### Food Logging — AI Log
Describe a meal in plain English. Claude estimates kcal and macros via the Anthropic API.

**Status:** ✅ Complete — works inside Claude.ai only. Will fail on standalone PWA (no API key available in that context). A clear error message is shown when it fails.

---

### Food Logging — Quick Add
Pre-loaded library of 20 common gym meals. Fully user-editable.

**Status:** ✅ Complete

| Feature | Status |
|---|---|
| Search/filter meals | ✅ |
| One-tap log to today | ✅ |
| Add new custom meal (with all macros) | ✅ |
| Edit any existing meal | ✅ |
| Delete meal | ✅ |
| Reset to default meals | ✅ |
| Custom meals persist across sessions | ✅ |

---

### Food Logging — Food Search
Live search against the Open Food Facts database (~3 million products).

**Status:** ✅ Complete — requires internet connection. Results show per-serving macros. Tap to log.

---

### History & Reporting

**Status:** ✅ Complete

| Feature | Status |
|---|---|
| Auto-save today on every change | ✅ No manual "close day" needed |
| Day view — scroll through individual days | ✅ |
| Day view — macro pie chart | ✅ |
| Day view — full food item list | ✅ |
| Day view — edit past day (add/remove foods) | ✅ |
| Day view — toggle training/rest on past day | ✅ |
| Day view — adjust water on past day | ✅ |
| Range views: 7 Days, 30 Days, 3 Months, 1 Year, All Time | ✅ |
| Line chart with metric toggles (Kcal / Protein / Carbs / Fat) | ✅ |
| Bar chart with metric toggles | ✅ |
| Per-range average summary (Kcal, Protein, Carbs, Fat) | ✅ |
| Day list — tap any row to jump to that day's detail | ✅ |
| CSV export (full history) | ✅ Downloads as `.csv` |

---

### PWA / Installability

**Status:** ✅ Complete

| Feature | Status |
|---|---|
| Manifest with app name, theme colour, icons | ✅ |
| Service worker — offline caching of app shell | ✅ |
| "Add to Home Screen" via Android Chrome | ✅ |
| Runs as standalone app (no browser chrome) | ✅ |
| APK generation via PWABuilder | ✅ (external tool, documented below) |

---

## 4. Complete Features

The following features are fully implemented and tested:

- Dashboard with live calorie/macro tracking
- Rest vs Training day toggle with different calorie targets
- Quick Add with full CRUD (Create, Read, Update, Delete) on meal library
- Food Search via Open Food Facts
- Water tracking with visual display
- Auto-timezone date handling (GMT/BST)
- Full history with Day, Weekly, Monthly, 3-Month, Annual, and All Time views
- Line and bar charts with per-metric toggles
- Past day editing (foods, water, training toggle)
- CSV export of all historical data
- Data persistence across sessions
- PWA manifest + service worker for Android install
- Offline support for app shell

---

## 5. Incomplete / Partial Features

### ❌ AI Log — Not available on standalone PWA
**What it does:** Describes a meal in plain text → Claude estimates macros.  
**Why it's incomplete:** The Anthropic API requires authentication. The API key is injected automatically inside Claude.ai but is not available in the standalone GitHub Pages version.  
**Workaround:** Use Food Search instead on the standalone PWA.  
**Fix path:** Would require a backend proxy (e.g. a small Cloudflare Worker or Node.js server) that holds the API key server-side and forwards requests. Not a trivial addition for a static-site deployment.

---

### ❌ Barcode Scanner — Removed
**Original plan:** Use device camera + BarcodeDetector API to scan food packaging.  
**Why removed:** Camera permissions are blocked in both the Claude.ai artifact environment and on GitHub Pages without HTTPS + explicit permission grants. The BarcodeDetector API also has limited browser support (Chrome Android only, not available in all WebViews).  
**Replaced by:** Food Search (text-based, covers the same use case with less friction and no permissions required).

---

### ⚠️ Macro Targets — Hardcoded
**Current state:** REST day (1,800 kcal / 160g protein / 170g carbs / 53g fat) and TRAINING day (2,200 kcal / 175g protein / 215g carbs / 62g fat) targets are hardcoded in the source.  
**What's missing:** A Settings screen where the user can input their own targets.  
**Impact:** Medium — for anyone other than the original user, these numbers will be wrong.

---

### ⚠️ No User Onboarding / Settings Screen
**Missing:** No way to set body weight, TDEE, custom calorie targets, name, or goal from inside the app.  
**Impact:** Low for single user, high for any multi-user or commercial scenario.

---

### ⚠️ PWA Icons — SVG Placeholders
**Current state:** The manifest uses inline base64-encoded SVG emoji icons.  
**What's missing:** Proper high-resolution PNG icons (192×192 and 512×512).  
**Impact:** The app installs fine but the home screen icon may look low-quality on some Android launchers. PWABuilder may flag this during APK generation.

---

### ⚠️ No Serving Size Multiplier on Food Search
**Current state:** Food Search results show macros per the product's default serving size.  
**What's missing:** A quantity/portion input (e.g. "I had 1.5 servings" or "300g not 100g").  
**Impact:** Users with non-standard portions must mentally adjust or log multiple entries.

---

### ⚠️ History Data Stored Only Locally
**Current state:** All data is in `localStorage` (PWA) or `window.storage` (Claude artifact). It is device-specific and not backed up.  
**What's missing:** Cloud sync / account system.  
**Impact:** Data is lost if the user clears browser storage, changes device, or reinstalls the app.

---

## 6. Known Limitations

| Limitation | Detail |
|---|---|
| Single device only | No cloud sync. Data lives in browser storage on the device it was created on. |
| AI Log requires Claude.ai | Won't work on standalone PWA — by design due to API key constraints. |
| Food Search requires internet | Open Food Facts is an external API. No offline food search. |
| Charts need history data | Until a few days are logged, range charts will be sparse or empty. |
| No push notifications | PWA does not send reminders to log meals or drink water. |
| GitHub Pages URL required for PWA | App must be served from HTTPS for service worker to register. |

---

## 7. Data Architecture

All data is stored as key/value pairs in `localStorage` (standalone PWA) or `window.storage` (Claude.ai artifact).

| Key | Value | Description |
|---|---|---|
| `logs:YYYY-MM-DD` | JSON array of log entries | Today's food log. One key per day. |
| `water:YYYY-MM-DD` | Integer string | Water glass count for the day |
| `train:YYYY-MM-DD` | `"true"` or `"false"` | Training day flag for the day |
| `history` | JSON array of day snapshots | Full historical record. Auto-updated on every change. |
| `all_meals` | JSON array of meal objects | User's custom meal library (Quick Add) |

### Day snapshot object structure
```json
{
  "date": "2026-04-19",
  "kcal": 1742,
  "protein": 158.4,
  "carbs": 163.2,
  "fat": 51.8,
  "water": 6,
  "training": true,
  "logs": [
    {
      "id": 1713528000000,
      "name": "Chicken breast (150g)",
      "kcal": 248,
      "protein": 47,
      "carbs": 0,
      "fat": 5,
      "time": "08:30"
    }
  ]
}
```

### Meal library object structure
```json
{
  "name": "Chicken breast (150g)",
  "kcal": 248,
  "protein": 47,
  "carbs": 0,
  "fat": 5
}
```

---

## 8. Configuration Reference

To change calorie/macro targets, edit these constants at the top of `index.html`:

```javascript
const REST  = { kcal:1800, protein:160, carbs:170, fat:53 };
const TRAIN = { kcal:2200, protein:175, carbs:215, fat:62 };
```

To change the default meal library, edit the `DM` array.

---

## 9. Deployment

### GitHub Pages (current)
1. Files: `index.html`, `manifest.json`, `sw.js` in repo root
2. Settings → Pages → Branch: `main` → Folder: `/ (root)` → Save
3. Live URL: `https://<username>.github.io/<repo-name>`

### Android APK via PWABuilder
1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Paste your GitHub Pages URL
3. Click **Package for Stores** → **Android**
4. Download the generated APK
5. On your Android phone: Settings → Apps → Install unknown apps → allow your browser
6. Open the downloaded APK file to install

---

## 10. Roadmap Considerations

Listed in rough priority order based on user impact:

| Priority | Feature | Complexity |
|---|---|---|
| High | Settings screen (custom calorie/macro targets) | Low |
| High | Serving size multiplier on Food Search results | Low |
| Medium | Proper PNG app icons (192×192, 512×512) | Low |
| Medium | AI Log on standalone PWA via backend proxy | Medium |
| Medium | Meal log editing (edit an existing entry, not just delete) | Medium |
| Medium | Streak / consistency tracking | Medium |
| Low | Push notification reminders | Medium |
| Low | Cloud sync / account system | High |
| Low | Workout logging (sets, reps, weight) | High |
| Low | Meal-to-performance correlation (idea #4) | Very High |
