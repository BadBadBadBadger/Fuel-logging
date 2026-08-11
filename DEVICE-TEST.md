# Device test — the energy-safety release (sw v68)

**One-time checklist for the 2026-08-10 go-live.** Delete this file once it's done; it is not a
living doc. Everything durable lives in `ENERGY_MODEL.md` / `DOCS.md`.

**Live as of:** `main`, service worker **v68** (the Quick Add fix of 2026-08-11 shipped on top of the
energy-safety release). Rollback tag: **`pre-energy-safety`**.

> ### Before anything else
> An installed PWA serves the **old bundle** until the service worker fully cycles. Backgrounding the
> app is not enough. **Fully close it and reopen** (or hard-reload in the browser). If the version
> below doesn't match, you're testing the old code and everything after this is meaningless.
>
> To check: Settings → scroll to the bottom, or in Chrome devtools console:
> `caches.keys().then(console.log)` → expect `fuel-log-v68`.

> ### Part B is now automated — run it before you run it by hand
> `npm run test:ui` covers B1–B6 in about twenty seconds, in a real browser, and re-runs any time.
> **Do that first**: if something is broken it's far cheaper to find it there. What it cannot tell
> you is anything about *this phone* — iOS Safari, PWA install, service-worker cycling, or haptics.
> That is what the checklist below is still for. Status and coverage: `PLAYWRIGHT-PLAN.md`.

---

## What actually changed

Nine months of deficit walked your target down. That's what this release exists to stop.

| # | What you should see | Where |
|---|---|---|
| 1 | Targets built from a **lifestyle activity** answer, not a flat sedentary guess | Profile |
| 2 | Adaptive TDEE that converges instead of sticking at its limit; the app **invites** weigh-ins | Dashboard |
| 3 | A workout's calories **spread over 3 days** instead of unlocking all today | Workout card |
| 4 | *"Eased to a steady pace"* and *"Low on fuel today"* — body-sized protections | Dashboard |
| 5 | A cut measured as **load**, prompting a break at ~24 / 12 / ~9.5 weeks (10 / 20 / 25% deficit) | Dashboard |
| 6 | A **break bar** that fills while cutting and drains while you don't | Dashboard |
| 7 | The app **only lowers its estimate of what you burn when you're not cutting** | invisible, by design |

---

## Part A — normal use, on your phone, today

These need no setup. Work down the list; anything that looks wrong, note the screen and move on.

- [ ] App opens, dashboard renders, no blank screen
- [ ] **Light / dark / system** switcher works, and survives a reload
- [ ] Profile → the four **lifestyle chips** are there, and changing one moves your target
- [ ] Your target looks **believable** — not hundreds of calories off what you'd expect
- [ ] Log a food item — lands in today's list, macros update
- [ ] Log a workout — check the copy says the calories are **spread forward**, not all added today
- [ ] Weigh in — accepted, trend updates, no scary messaging
- [ ] Switch **Cut → Maintain → Bulk** — target moves sensibly each time, no confirm interrupts you
- [ ] Nothing mentions breaks, recharging or stalls **at all** (you've no cut history yet — silence is correct)
- [ ] **"Below your resting metabolism"** — see the open question at the bottom of this file
- [ ] **Profile → "Start clean"** — if your adaptive adjustment is non-zero, the reset button is there, asks "are you sure", and works

### AI capture (still outstanding from v6.7)
- [ ] Voice/photo capture → the optional follow-up questions flow
- [ ] **⚐ Report wrong** opens a prefilled email
- [ ] **+ Log all** puts everything into today's food

---

## Part B — the time-dependent ones (Chrome, seeded)

Cut blocks, the drain and the stall need **weeks** of history. You'll never see them in normal use
today, so seed them in Chrome and look.

> ### ⚠️ Sign out first, or use an incognito window
> If you're signed in as premium, seeded block state **syncs to Supabase** and overwrites your real
> `profiles` row. Sign out, or use incognito, and none of this touches your data.

Open the live site, F12 → Console, paste, and the page reloads itself.

> ### ⚠️ Paste this ONCE first, before any snippet below
> The app keys each day from **local** date parts (`app.jsx:214`), not `toISOString()`, which is UTC.
> Under BST the two disagree between **00:00 and 00:59** — a snippet using the UTC key writes
> yesterday's `mode__`, the app reads today's, and you get a screen that was never configured, with
> no error to tell you. Define the correct key helper once per console session:
>
> ```js
> window.k = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") +
>                 "-" + String(d.getDate()).padStart(2,"0");
> ```
>
> Every snippet below uses `k()`. If you skip this you get a loud `k is not defined` rather than a
> quiet wrong answer — which is the point.

**B1 — the bar filling, mid-cut**
```js
const t = k(new Date());
localStorage.setItem('cut_block', JSON.stringify({ start:'2026-06-01', load:20, startWeight:98.5,
  offRun:0, breakLoad:0, lastAccrued:t, lastBreakEnd:null, rechargedOn:null, nudgeAt:null, snoozeAt:null }));
localStorage.setItem('mode__'+t, 'cut'); location.reload();
```
- [ ] A bar labelled **"CUTTING · WEEK n"**, part filled, showing **real weeks** — never a load number

**B2 — the soft nudge (a break would help)**
```js
const t = k(new Date());
localStorage.setItem('cut_block', JSON.stringify({ start:'2026-05-01', load:56, startWeight:98.5,
  offRun:0, breakLoad:0, lastAccrued:t, lastBreakEnd:null, rechargedOn:null, nudgeAt:null, snoozeAt:null }));
localStorage.setItem('mode__'+t, 'cut'); location.reload();
```
- [ ] Amber card, **"You've been cutting for n weeks"**, with a **"Start a 2-week break"** button
- [ ] Tapping it switches you to Maintain, shows a toast, and **no confirm dialog** interrupts
- [ ] The **"Why?"** toggle reads sensibly and doesn't promise a metabolic reset

**B3 — mid-break: the bar draining, and the one guarded action**
```js
const t = k(new Date());
localStorage.setItem('cut_block', JSON.stringify({ start:'2026-05-01', load:42, startWeight:98.5,
  offRun:7, breakLoad:84, lastAccrued:t, lastBreakEnd:null, rechargedOn:null, nudgeAt:null, snoozeAt:null }));
localStorage.setItem('mode__'+t, 'maintain'); location.reload();
```
- [ ] Bar reads **"ON A BREAK · DAY 7"** with *about 7 days to fully recharged*
- [ ] Switch to **Bulk** → changes immediately, **no confirm**, bar keeps draining identically
- [ ] Switch to **Cut** → a gentle *"Back to cutting already?"* confirm appears
- [ ] **"Cut anyway"** is honoured on the spot, no second question

**B4 — recharged, then silence**
```js
const t = k(new Date());
localStorage.setItem('cut_block', JSON.stringify({ start:null, load:0, startWeight:null, offRun:0,
  breakLoad:0, lastAccrued:t, lastBreakEnd:t, rechargedOn:t, nudgeAt:null, snoozeAt:null }));
localStorage.setItem('mode__'+t, 'maintain'); location.reload();
```
- [ ] One dismissible **"Recharged"** card, **no mode buttons** on it
- [ ] Dismissing it silences it immediately, and nothing about breaks returns

**B5 — weight up while cutting (the auto-lowering fix, made visible)**
```js
const t = new Date();
const w = []; for (let i = 20; i >= 0; i--) {
  const d = new Date(t); d.setDate(d.getDate() - i); w.push({ date: k(d), weight: 98 + (20 - i) * 0.05 });
}
localStorage.setItem('weighins', JSON.stringify(w));
localStorage.setItem('mode__' + k(t), 'cut'); location.reload();
```
- [ ] **"Weight up while eating less than maintenance"** card appears
- [ ] It says water / glycogen / muscle, states your target **hasn't been lowered**, and never says eat less
- [ ] It has **no mode buttons**, and offers an optional body-fat update link

**B6 — the stall nudge** (same weigh-ins as B5 but flat, plus an older block)

> **30 days of weigh-ins, not 25.** The stall check reads a 21-day span, and the rolling average
> returns `null` unless at least **three** entries predate `today − 21`. The old 25-day series
> supplied exactly three — trim one, or leave a gap, and the check silently evaluates to "no data"
> and the card never appears. That looks like a broken feature; it's an under-seeded fixture.

```js
const t = new Date();
const w = []; for (let i = 29; i >= 0; i--) { const d = new Date(t); d.setDate(d.getDate() - i); w.push({ date:k(d), weight:98 }); }
localStorage.setItem('weighins', JSON.stringify(w));
localStorage.setItem('cut_block', JSON.stringify({ start:'2026-07-01', load:20, startWeight:98,
  offRun:0, breakLoad:0, lastAccrued:k(t), lastBreakEnd:null, rechargedOn:null, nudgeAt:null, snoozeAt:null }));
localStorage.setItem('mode__' + k(t), 'cut'); location.reload();
```
- [ ] **"Your loss has stalled"** card, offering a break
- [ ] The wording never implies you did anything wrong, and never suggests eating less

**Reset to clean between tests**
```js
['cut_block','weighins','history','tdee_adj','tdee_adj_log'].forEach(k => localStorage.removeItem(k));
location.reload();
```

---

> **Already known, don't re-report:** at very low weights (~50 kg) the flat safe minimum overrides the
> body-sized floor and a cut collapses to almost no deficit — a 50 kg man gets 16 kcal. Real, understood,
> and **deliberately shelved** because the only user is 98.5 kg. `ARCHITECTURE_REVIEW.md` §4.I.

## Part B2 — the one thing no test can check: does the cloud actually obey?

The UI suite proves the app *asks* Supabase to delete the right row — the right table, filtered by
your user and by the meal's name. It cannot prove Supabase **honours** it. Schema, column names and
row-level security are not observable from a test harness, by any means. This is that check, and it
takes about a minute. **Signed in, on your phone.**

- [ ] Quick Add → add a meal called **Rename me**
- [ ] Edit it (✏️) and rename it to **Renamed** → save
- [ ] Force a fresh pull: fully close the app and reopen it
- [ ] **Exactly one** entry — *Renamed*. Two means the delete didn't reach the table.
- [ ] Delete it (🗑️), fully close and reopen
- [ ] It is **gone**, not back

> If a deleted or renamed meal reappears, the local write worked and the cloud one didn't — look at
> `syncMealDelete` (`app.jsx`) and the `meal_library` RLS policy, in that order. Before v68 this was
> broken by design: sync only ever upserted, so deletes never propagated at all.

---

## Part C — the small body case

The steady-loss floor only visibly bites on smaller bodies. Temporarily set a **~60 kg** profile
(Profile → weight 60) and check:

- [ ] A cut shows **"Eased to a steady pace"** rather than an alarming number
- [ ] Set weight back to your real figure afterwards

---

## When something looks wrong

Note the screen, then reproduce it in Chrome with the matching snippet above and we'll work through it
together. Reproducing beats describing — the harness bug and the "starting today" nonsense were both
found in about a minute that way.

**Rollback, if it comes to it:** `git checkout pre-energy-safety` and redeploy.

---

## Open question left deliberately unresolved

**"Below your resting metabolism"** currently shows for **every sedentary cutter, permanently** — a
standard 500-calorie cut lands under BMR for almost anyone, so the card never goes away. It is true,
but a warning that's always on is wallpaper, and it teaches you to stop reading amber cards.

Live with it for a few days and decide: leave it, or make it a one-time **"Got it"** like the
aggressive-cut acknowledgement already in the app.

## Still outstanding, not part of this release

- **`RATE_LIMIT` KV namespace is unbound** — the daily AI spend cap is a no-op until it is
  (worker → Settings → Bindings → KV, variable `RATE_LIMIT`). Keep the Anthropic Console cap on.
- Stale `@draft` / `@wip` tags on the feature files — clear them once this passes.
