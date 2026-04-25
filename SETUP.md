# Fuel Log — Setup Guide

## Project Structure

```
fuel-log/
├── app.jsx              ← EDIT THIS. Full source, JSX + ES6.
├── app.js               ← Built output. Never edit directly.
├── babel.config.json    ← Babel config (preset-react + preset-env modules:false).
├── index.html           ← HTML shell. Loads vendored deps + app.js.
├── manifest.json        ← PWA manifest.
├── sw.js                ← Service worker. Bump CACHE version on each deploy.
├── icon-192.png         ← App icon.
├── icon-512.png         ← App icon.
├── cloudflare-worker.js ← Paste into Cloudflare to proxy AI requests.
├── dev-server.js        ← Local dev server (node dev-server.js).
├── preview.html         ← Mobile preview harness (localhost:3000/preview.html).
├── seed-data.js         ← Dev-only: populates 6 months of realistic test data.
├── vendor/              ← Vendored JS bundles (React, ReactDOM, PropTypes, Recharts).
├── features/
│   └── fuel-log.feature ← Gherkin specs. Update before implementing any feature change.
├── __tests__/
│   └── logic.test.js    ← Jest unit tests for all pure logic.
├── package.json         ← Dev deps + scripts.
├── DOCS.md              ← Full product documentation.
└── SETUP.md             ← You're reading it.
```

---

## One-Time Setup

### 1. Install Node.js
Download from https://nodejs.org — get the LTS version.

### 2. Install dependencies
```bash
npm install
```

---

## Build

```bash
npm run build
# or directly:
npx babel app.jsx --out-file app.js
```

`babel.config.json` handles the presets. The output `app.js` is plain browser JS — no ES module syntax, no CommonJS exports.

---

## Run Tests

```bash
npm test
```

44 tests covering all pure logic functions. No browser required.

---

## Local Preview

```bash
node dev-server.js
```

Then open **http://localhost:3000/preview.html** in your browser for a phone-frame preview with device size switchers (iPhone 14, Pixel 7, iPhone SE).

The preview uses the same `localStorage` as the main page, so test data persists.

### Dev panel controls

| Control | What it does |
|---|---|
| **▶ Progress Day** | Advances the simulated date by one day (increments `dev_date_offset`). Use this to test streak logic without waiting a real day. |
| **↺ Reset to Today** | Clears the date offset and returns to real today. |
| **Update Coach Tip** | Sets a simulated hour for the Coach Tip time-of-day logic without reloading the page. |
| **Use real time** | Clears the simulated hour and reverts to the system clock. |
| **⚡ Seed Data** | Populates 6 months of realistic food logs, weigh-ins, and workouts via `seed-data.js`. |

---

## Every Deploy

1. Edit `app.jsx`
2. Run `npm run build`
3. Bump `CACHE = "fuel-log-vN"` in `sw.js` (increment N by 1)
4. Push these files to GitHub:
   - `app.js`
   - `sw.js`
   - Any other changed files (`index.html`, `manifest.json`, icons)
5. GitHub Pages deploys automatically within ~1 minute

**Important:** Always bump the service worker cache version. If you skip this, users' phones will keep serving the old cached version.

---

## Cloudflare Worker Setup (AI Features)

All AI features (AI Meal Log, Coach Tip, Workout Parser) route through a Cloudflare Worker that adds your Anthropic API key server-side. Your key never appears in client code.

### Steps

1. Go to https://dash.cloudflare.com
2. Workers & Pages → Create Worker
3. Delete the default code, paste the entire contents of `cloudflare-worker.js`
4. Click **Deploy**
5. Go to **Settings → Variables and Secrets**
6. Add a new **Secret** named exactly: `ANTHROPIC_KEY`
7. Value: your Anthropic API key (from https://console.anthropic.com)
8. Save

### Connect to app

1. Open `app.jsx`
2. Find this line near the top and set your worker URL:
   ```javascript
   const AI_ENDPOINT = "https://YOUR-WORKER.workers.dev";
   ```
3. Run `npm run build`
4. Push to GitHub

### Add to service worker bypass list

If you change the worker subdomain, also update `sw.js`:
```javascript
if (e.request.url.includes("workers.dev") || ...)
```
The service worker must bypass all AI and external API calls, otherwise POST responses get incorrectly cached and features silently break.

---

## Making Changes

1. Update `features/fuel-log.feature` if the change affects user-visible behaviour
2. Edit `app.jsx`
3. Run `npm run build`
4. Push `app.js` (and any other changed files) to GitHub
5. Done — no other steps

---

## Storage Keys Reference

All data in `localStorage`, flat single-user keys:

| Key | Value |
|---|---|
| `profile` | JSON: `{weight, height, bodyFat, sex}` — `sex` is `"male"`, `"female"`, or `null` |
| `meals` | JSON: meal library array |
| `history` | JSON: all daily snapshots sorted by date |
| `badges` | JSON: earned badge key array |
| `weighins` | JSON: `[{date, weight}]` — daily body weight log |
| `tdee_adj` | Integer string: cumulative TDEE calibration offset (kcal, can be negative) |
| `logs__YYYY-MM-DD` | JSON: food entries for that day |
| `water__YYYY-MM-DD` | Integer string (glasses) |
| `workouts__YYYY-MM-DD` | JSON: `[{id, type, duration, intensity, kcal, time, notes?}]` |
| `mode__YYYY-MM-DD` | `"cut"` / `"maintain"` / `"bulk"` |
| `coach__YYYY-MM-DD` | JSON: `{tip, r}` — AI tip + refresh count |
| `target_kcal` | Integer string: custom daily calorie target (absent = use preset mode) |
| `aggressive_cut_acked` | `"1"` when user has acknowledged the red aggressive-cut warning |
| `streak_anim__YYYY-MM-DD` | `"1"` — prevents streak celebration replaying on the same day |
| `dev_date_offset` | Integer string: days ahead of real today (preview harness only) |
| `dev_time_hour` | Integer string: simulated hour 0–23 (preview harness only) |

---

## Adaptive TDEE — How to Use

1. Log your weight every morning from the **Body Weight** card on the dashboard
2. After 7 days, confidence shows as **Estimating**
3. After 14 days, calibration activates — targets start adjusting to your real metabolism
4. After 28 days, confidence shows as **Calibrated**
5. The Profile screen shows your formula TDEE, the current adjustment, and the effective TDEE

The adjustment is capped at ±150 kcal per calibration run and ±600 kcal lifetime. It resets if you change your profile weight significantly.

---

## Troubleshooting

**Black screen**
→ Open browser DevTools (F12) → Console tab — the actual error will be shown
→ Check `app.js` exists in GitHub repo root
→ Hard refresh: Ctrl+Shift+R (desktop) or hold refresh → Hard Reload (mobile)

**AI features not working**
→ Check Cloudflare Worker is deployed and `ANTHROPIC_KEY` secret is set
→ Check `AI_ENDPOINT` in `app.jsx` points to your worker URL
→ Check `workers.dev` is in the bypass list in `sw.js`

**Food Search returns no results**
→ Try a simpler search term (brand name or generic food)
→ Open Food Facts coverage varies by region — UK/EU products have better data

**Old version showing after push**
→ Bump `CACHE = "fuel-log-vN"` in `sw.js` to force service worker refresh
→ On mobile: hold the refresh button → Hard Reload

**Weigh-in not triggering calibration**
→ Need at least 8 weigh-ins total and 4 food-log days in the last 7 days
→ Calibration runs automatically on each weigh-in once thresholds are met

**Streak not incrementing in preview harness**
→ Use the **▶ Progress Day** button to advance the simulated date, then log food
→ The streak celebration plays on the first log of each simulated day
→ To replay today's animation: clear `streak_anim__YYYY-MM-DD` from localStorage
