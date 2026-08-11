# Playwright UI Test Plan — Fuel Log

**Created:** 2026-08-11 (session 16) · **Owner:** QA hat · **Suite:** `e2e/`

Live status of the browser-level test suite: what exists, what passes, what's next. This is a
**working document** — the status column is updated as items land, so it always answers "where are
we". Durable behaviour lives in `ENERGY_MODEL.md` / `DOCS.md`; the specs themselves are the contract.

**Current:** 18 tests · 18 passing · runtime ~12s · last updated 2026-08-11

| | |
|---|---|
| ✅ | Done — written, run, green |
| ⚠️ | Written but weak — passes without proving anything |
| 🔄 | In progress |
| ⬜ | Planned, not started |
| 🚫 | Out of scope for this layer |

---

## How to run

```bash
npm run test:ui           # headless, all specs
npm run test:ui:headed    # watch it drive the browser
npx playwright test cut-break.spec.js          # one file
npx playwright test --grep "Cut mid-break"     # one scenario
```

Screenshots land in `e2e/screenshots/` (gitignored), one per scenario. Playwright starts
`dev-server.js` itself — nothing to run first.

---

## Why this layer exists

`__tests__/logic.test.js` does not import `app.jsx`. It **re-implements** the logic as mirrors, which
is fine for arithmetic and structurally blind to rendering. Both bugs that reached a real device last
session were render bugs: the harness had no theme CSS, and the break bar announced a break on an
empty install. 213 green unit tests said nothing about either.

| Layer | Owns | Where |
|---|---|---|
| Jest mirrors | thresholds, `calcTargets`, drain arithmetic | `__tests__/logic.test.js` (220) |
| **Playwright** | **does the right card appear, saying the right words** | `e2e/` (14) |
| Real device | iOS Safari, PWA install, SW cycling, haptics, real auth | `DEVICE-TEST.md` |

**Rule: never assert the same thing in two layers.** If a number is already pinned in Jest, the UI
test asserts that it is *displayed*, not that it is *correct*.

### What makes this possible

`preview.html` was already 80% of a test rig before Playwright arrived:

- `window.storage` → `localStorage` bridge, so state is seedable
- **the calendar is a plain `dev_date_offset` integer**, so time-dependent surfaces are reachable
  without weeks of real history — the whole of Part B depends on this
- service workers unregistered, so no stale bundle
- 🔓 Premium toggle, so gated UI needs no sign-in

---

## Hard constraints

**No cloud from the harness. Ever.** A faked clock plus a real account is a data-corruption machine:
signing in for real on the harness while it sat on a future date wrote future-dated `food_logs` to
Supabase, and when the real date caught up the rows were already there and corrupted that day's
logging. Two independent defences, both tested:

1. `preview.html` creates **no** Supabase client and does **not** load Google Identity
2. `app.jsx`'s `sb()` returns `null` whenever `dev_date_offset` is non-zero — this also covers
   `index.html` on localhost, which shares an origin, and therefore the offset, with the harness

Real sign-in and real sync are tested **on a device**, via `DEVICE-TEST.md`. Never here.

**Date keys are local, not UTC.** `todayKey()` (`app.jsx:214`) builds the key from local date parts.
`e2e/harness.js` computes it the same way. Anything using `toISOString().slice(0,10)` will seed the
wrong day under BST between 00:00 and 00:59 and pass against a screen that was never configured.

---

## Status

### Suite: `no-cloud-from-harness.spec.js` — the guardrail

| # | Scenario | Status |
|---|---|---|
| 1 | No Supabase client and no Google Identity script on the page | ✅ |
| 2 | A faked future date issues no network calls to Supabase at all | ✅ |
| 3a | With a real clock, a sync genuinely fires — the probe is wired up | ✅ |
| 3b | With a faked clock, the identical action reaches nothing | ✅ |
| 4 | The harness still runs fully without a cloud client | ✅ |

> **3a/3b are a matched pair, and 3a is the important half.** A live recording client is installed
> and a real sync is triggered (water `+` → `saveWater`, `app.jsx:5209`) in *both* cases; the only
> variable is whether the clock is faked. Premium carries a real-looking `id` on purpose — with
> `id: null` the sync would stop on its own and 3b would pass for the wrong reason. 3a exists so
> that can never happen silently: if the probe stops firing, 3b is worthless and 3a says so.
>
> This replaced a tautological version that re-implemented the offset check in the page and could
> not fail. Writing 3a immediately caught a real bug in the setup — `open()`'s init script calls
> `localStorage.clear()`, so auth seeded by an earlier `addInitScript` was wiped before the app
> read it.

### Suite: `energy-safety.spec.js` — DEVICE-TEST B1 + B2

| # | Scenario | Status |
|---|---|---|
| 5 | The soft nudge appears; starting a break needs no confirmation | ✅ |
| 6 | A fresh install says nothing about breaks at all | ✅ |
| 16a | Mid-cut the bar fills, labelled in real weeks | ✅ |
| 16b | The fill is partial — neither empty nor complete | ✅ |
| 16c | Below the soft threshold the bar carries no advice of its own | ✅ |

> **Week counts are pinned to relative dates** (`daysAgo(70)` → always WEEK 10). A hard-coded start
> would drift by one week every seven days and fail on an arbitrary Tuesday. 16a also asserts the bar
> never shows the two numbers it could plausibly confuse for weeks: the load (20) and the fill (36%).

### Suite: `cut-break.spec.js` — DEVICE-TEST B3 + B4

| # | Scenario | Status |
|---|---|---|
| 7 | The bar reads as a break in progress, counting days not load | ✅ |
| 8 | Bulk mid-break is never guarded — it switches on the spot | ✅ |
| 9 | Cut mid-break asks once, and takes "Cut anyway" as the answer | ✅ |
| 10 | "Keep resting" leaves the break exactly as it was | ✅ |
| 11 | Recharged: one card, no mode buttons, silence after dismissal | ✅ |

### Suite: `dev-premium.spec.js` — the unlock

| # | Scenario | Status |
|---|---|---|
| 12 | Locked: a gated feature raises the premium modal | ✅ |
| 13 | Unlocked: the same feature opens straight up, no sign-in | ✅ |
| 14 | The unlock never reaches Supabase | ✅ |

---

## Planned

Worked **one at a time**, in this order. Each lands green before the next starts.

### Next up

| # | Scenario | Maps to | Status |
|---|---|---|---|
| 15 | Rework #3 into a genuine differential sync test | guardrail | ✅ **done 2026-08-11** |
| 16 | Mid-cut the bar fills, labelled in real weeks | B1 | ✅ **done 2026-08-11** (3 tests) |
| 17 | Weight up while cutting: the card appears, and the target is **not** lowered | B5 | 🔄 **next** |
| 18 | The same evidence at Maintain **is** acted on | §5.4 | ⬜ |
| 19 | The stall nudge, with blameless copy and no "eat less" | B6 | ⬜ |

### Quick Add (v68) — shipped today, no UI coverage

The `sw v68` fix went live with Jest coverage of the merge logic only. Nothing verifies the UI.

| # | Scenario | Status |
|---|---|---|
| 20 | The "Reset to defaults" button is **gone** from Quick Add | ⬜ |
| 21 | Deleting a meal removes it and it does not return on reload | ⬜ |
| 22 | Renaming a meal retires the old name rather than duplicating it | ⬜ |
| 23 | The revive runs once, unions the list, and never runs again | ⬜ |

### Part A smoke — render and theme

| # | Scenario | Status |
|---|---|---|
| 24 | App renders at all three device sizes, no blank screen | ⬜ |
| 25 | Light / dark / system survives a reload (the theme-CSS bug) | ⬜ |
| 26 | Log a food item — lands in today's list, macros update | ⬜ |
| 27 | Log a workout — copy says calories are spread forward | ⬜ |
| 28 | Weigh in — accepted, trend updates, no scary messaging | ⬜ |
| 29 | Mode switch moves the target sensibly, no confirm | ⬜ |

### Deliberately out of scope

| Area | Why | Where instead |
|---|---|---|
| 🚫 AI capture (voice/photo) | needs a real JWT the worker will accept | `DEVICE-TEST.md` |
| 🚫 Real Google sign-in | forbidden from the harness — see Hard constraints | device only |
| 🚫 Cloud sync / multi-device | same | device only |
| 🚫 iOS Safari behaviour | Chromium only; iPhone descriptors need WebKit | device only |
| 🚫 PWA install, SW cycling | no service worker on the harness by design | device only |
| 🚫 Haptics | no API in headless Chromium | device only |
| 🚫 Threshold arithmetic | already owned by Jest | `__tests__/logic.test.js` |

---

## 🗄️ Shelved — the UI-audit rig (idea, 2026-08-11)

**Parked deliberately, not forgotten.** Idea: reuse `e2e/harness.js` to render a **state matrix** to
disk (`npm run audit:shots`), then review it wearing the design hat — and, separately, the launch hat
for store assets. The value is that the harness can manufacture states no reviewer ever reaches by
hand: week 15 of a cut, on-a-break day 7, recharged, stalled, weight-up-while-cutting, low-fuel,
over-budget, premium vs free, first-run. Reading `app.jsx` is guessing at pixels; a contact sheet is
evidence. It would also settle the `DEVICE-TEST.md` open question about whether *"Below your resting
metabolism"* is permanent wallpaper.

Alongside it, a **machine-checkable lint pass** — contrast against the cream-theme rules, tap targets
under 44px, overflow and clipping, `axe-core` — which is pass/fail and needs no persona at all.

**Three things to re-read before anyone builds this:**

1. **The harness clips the app to a fixed 390px `#app-shell`.** The device buttons resize that div,
   not the browser viewport, so Playwright's device descriptor does **not** drive the app's layout. A
   real responsive audit must point at `index.html` and drive the actual viewport — otherwise it
   audits one width three times while appearing to test three.
2. **Chromium only.** Fine for an Android-first review; actively misleading for App Store assets.
3. **No baselines.** Screenshots are for eyes, not diffed. Visual regression means committing to and
   maintaining a baseline set — likely overkill at n=1.

The rig is the instrument; the personas still do the reading. Not scheduled — revisit when the
functional suite below is done.

---

## Known limitations

- **Chromium only.** Target is a Chrome PWA on Android. Real Safari is not simulable here.
- **Absence assertions use a fixed wait.** Proving a card *isn't* there has no event to wait on, so
  `waitForTimeout` is used. Pragmatic, not clean; it is the one timing smell in the suite.
- **Screenshots are not compared.** They are written for a human to look at, not diffed. Visual
  regression would need a baseline commitment nobody has asked for at n=1.
- **This does not retire `DEVICE-TEST.md`.** It removes the *repeat* cost of regression checking. The
  one-time go-live device test still stands on its own.
