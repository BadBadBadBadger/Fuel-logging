# Fuel Log — Setup Guide

## Project Structure

```
fuel-log-src/
├── app.jsx              ← EDIT THIS. Full source, no line limit.
├── app.js               ← Built output. Never edit directly.
├── index.html           ← HTML shell. Only loads app.js.
├── manifest.json        ← PWA manifest.
├── sw.js                ← Service worker. Bump CACHE version on each deploy.
├── icon-192.png         ← App icon.
├── icon-512.png         ← App icon.
├── build.sh             ← Run this to build.
├── cloudflare-worker.js ← Paste into Cloudflare to proxy AI requests.
└── SETUP.md             ← You're reading it.
```

---

## One-Time Setup (Laptop)

### 1. Install Node.js
Download from https://nodejs.org — get the LTS version.

### 2. First build
```bash
cd fuel-log-src
chmod +x build.sh
./build.sh
```

This installs Babel, transpiles `app.jsx` → `app.js`, and tells you what to push.

---

## Every Deploy

```bash
./build.sh
```

Then push these files to GitHub:
- `index.html`
- `app.js`
- `manifest.json`
- `sw.js` (bump `CACHE = "fuel-log-vN"` each time)
- `icon-192.png`
- `icon-512.png`

---

## Cloudflare Worker Setup (AI Features)

The AI Log and Daily Coach Tip need the Anthropic API. On the live PWA, requests must go through a Cloudflare Worker so your API key is never exposed in client code.

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
2. Find this line near the top:
   ```javascript
   const AI_ENDPOINT = "https://api.anthropic.com/v1/messages";
   ```
3. Replace with your worker URL:
   ```javascript
   const AI_ENDPOINT = "https://fuellog.YOUR-SUBDOMAIN.workers.dev";
   ```
4. Run `./build.sh`
5. Push to GitHub

---

## Making Changes

1. Edit `app.jsx`
2. Run `./build.sh`
3. Push `app.js` (and any other changed files) to GitHub
4. Done — no other steps

---

## Storage Keys Reference

All data in localStorage, flat single-user keys:

| Key | Value |
|---|---|
| `profile` | JSON: body stats |
| `meals` | JSON: meal library |
| `history` | JSON: all daily snapshots |
| `badges` | JSON: earned badge keys |
| `logs__YYYY-MM-DD` | JSON: food entries |
| `water__YYYY-MM-DD` | Integer string |
| `train__YYYY-MM-DD` | `"true"` / `"false"` |
| `mode__YYYY-MM-DD` | `"cut"` / `"maintain"` / `"bulk"` |
| `session__YYYY-MM-DD` | JSON: session type/duration/intensity |
| `coach__YYYY-MM-DD` | JSON: AI tip + refresh count |

---

## Troubleshooting

**Black screen on phone**
→ Check `app.js` exists in GitHub repo root
→ Check browser console for errors (desktop Chrome F12)

**AI features not working**
→ Check Cloudflare Worker is deployed
→ Check `ANTHROPIC_KEY` secret is set
→ Check `AI_ENDPOINT` in `app.jsx` points to worker URL

**Old version showing after push**
→ Bump `CACHE = "fuel-log-vN"` in `sw.js` to force service worker refresh
→ Hard reload in Chrome: hold refresh button → "Hard Reload"
