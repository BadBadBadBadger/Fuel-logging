# Playwright UI Test Plan — Fuel Log

**Created:** 2026-08-11 (session 16) · **Owner:** QA hat · **Suite:** `e2e/`

Live status of the browser-level test suite: what exists, what passes, what's next. This is a
**working document** — the status column is updated as items land, so it always answers "where are
we". Durable behaviour lives in `ENERGY_MODEL.md` / `DOCS.md`; the specs themselves are the contract.

**Current:** 57 tests · 57 passing · runtime ~29s · last updated 2026-08-11
**Plan items 15–29 are all complete.** Jest 220/220 alongside, unchanged.

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

**Screenshots capture the phone, not the page.** `shot(page, name)` targets the `.phone` element,
stretches `#app-shell` so nothing is clipped at 844px, then measures where the content actually ends
and crops to it. Measuring *every* element instead of only the ones that paint something doesn't
work: the empty log container expands to fill whatever height it's given, so the crop never tightens.

---

## Why this layer exists

`__tests__/logic.test.js` does not import `app.jsx`. It **re-implements** the logic as mirrors, which
is fine for arithmetic and structurally blind to rendering. Both bugs that reached a real device last
session were render bugs: the harness had no theme CSS, and the break bar announced a break on an
empty install. 213 green unit tests said nothing about either.

| Layer | Owns | Where |
|---|---|---|
| Jest mirrors | thresholds, `calcTargets`, drain arithmetic | `__tests__/logic.test.js` (220) |
| **Playwright** | **does the right card appear, saying the right words** | `e2e/` (57) |
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

**No cloud from the harness. Ever.** A faked clock and a real account together corrupt live data:
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

### Suite: `no-cloud-from-harness.spec.js` — preview.html reaches no cloud

| # | Scenario | Status |
|---|---|---|
| 1 | No Supabase client and no Google Identity script on the page | ✅ |
| 2 | A faked future date issues no network calls to Supabase at all | ✅ |
| 3a | With a real clock, a sync genuinely fires — the recorder captures it | ✅ |
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

### Suite: `adaptive-guardrails.spec.js` — DEVICE-TEST B5 + B6

| # | Scenario | Status |
|---|---|---|
| 17a | The card explains the gain, and says the target was left alone | ✅ |
| 17b | It offers a body-fat update, and carries no mode buttons | ✅ |
| 18a | At Maintain it stays silent — there the evidence is clean | ✅ |
| 18b | A scale going the right way says nothing at all | ✅ |
| 19a | Three flat weeks while cutting offers a break, blamelessly | ✅ |
| 19b | The stall outranks the plain week-count copy — one message, not two | ✅ |
| 19c | A moving scale is not a stall | ✅ |

> **The stall check needs 30 days of weigh-ins, not 24.** It reads a 21-day span, and
> `weighRollingAvg` returns `null` unless at least THREE entries predate `today − 21`. On 24 days
> it silently evaluates to "no data" — the card never shows, which reads as a broken feature, and
> a *negative* test written on 24 days passes without proving anything.

### Suite: `quick-add.spec.js` — the v68 fix

| # | Scenario | Status |
|---|---|---|
| 20 | The "Reset to defaults" button is gone | ✅ |
| 21a | A custom meal list renders, and delete removes it for good | ✅ |
| 21b | Deleting a meal asks the cloud to delete that exact row | ✅ |
| 22a | Renaming a meal deletes the row under the old name | ✅ |
| 22b | Editing *without* renaming deletes nothing | ✅ |
| 23a | The revive rebuilds from logged history when there's no cloud copy | ✅ |
| 23b | It marks itself done and never runs a second time | ✅ |

> ### What 21b and 22a do NOT prove
> They assert the app **asks** for the right thing: a `delete` against `meal_library`, filtered by
> `user_id` and by the meal's name. They cannot prove Supabase **honours** it — schema, column names
> and RLS are not observable from a test harness, by any means. An earlier version of 21b recorded
> only which *tables* were touched, which would have passed had the code called `select()` where
> `delete()` was meant; `installSbRecorder` now captures the full call chain with arguments.
>
> The remaining mile is a one-time manual check: **`DEVICE-TEST.md` Part B2**. Any test that claims
> more than this is lying, and a hand-written fake would only ever confirm my own model of the schema.

### Suite: `weigh-ins.spec.js` — two months of weigh-ins (item 28)

Two 60-day runs differing only in what the scale did. **B is the important one** — it is the shape of
the original harm: a long deficit walking the target down.

| # | Scenario | Status |
|---|---|---|
| 28a | Losing steadily reads as ordinary progress, nothing alarming said | ✅ |
| 28b | A fresh weigh-in is accepted and the trend takes it | ✅ |
| 28c | Two flat months: a break is recommended, blamelessly | ✅ |
| 28d | The target is **not** ground down by two months of disappointment | ✅ |
| 28e | The target stays above the safe floor, not merely unchanged | ✅ |
| 28f | At Maintain the same evidence **is** acted on — the control | ✅ |

> **28f is what makes 28d mean anything.** An adjustment that never fires looks identical to one
> deliberately refused. Both seed the same 60 days of eating ~500 kcal under maintenance against a
> scale that never moves; only the declared mode differs. At Maintain the adjustment must move
> **down** — proving the cutting case is runCalibration returning refused:true, and not it returning
> null or an adjustment too small to apply.
>
> Getting there needed a real `historySpec`: `runCalibration` returns `null` unless at least four of
> the last seven days carry logged intake (`app.jsx:489`), so an earlier version of 28d ran with no
> food history, never invoked the loop at all, and passed while proving nothing.

### Suite: `ai-followups.spec.js` — which questions get asked, and in what units

| # | Scenario | Status |
|---|---|---|
| 30a | A condiment too small to matter is never asked about | ✅ |
| 30b | An item big enough to matter still gets asked | ✅ |
| 30c | The cooking-fat question is not asked about a drink | ✅ |
| 31a | Solid food is asked in hand sizes | ✅ |
| 31b | A drink is asked in glasses, never in fists | ✅ |
| 31c | A sauce is asked in spoons, never in fists | ✅ |
| 31d | An unrecognised food falls back to hand sizes | ✅ |
| 31e | Answering a drink's portion rescales it by the glass factor | ✅ |

> ### What these do NOT prove
> The model's response is a **hardcoded fixture**, returned by `page.route`. These tests exercise
> everything that runs *after* a response arrives — which items are worth a question, and the units
> the question uses. They say nothing about whether the real model returns sensible `ask` codes or
> good kcal, and they would stay green if it started returning nonsense.
>
> Two stubs are needed to reach that code, and neither contacts anything: a fake session token
> (`callAI` refuses without one, `app.jsx:1269`) and the worker response itself. **This is not a
> sign-in** — no real account, no request leaves the machine, and the no-cloud rule holds.
>
> Open Food Facts must be aborted in these tests. It runs in parallel and replaces an item when it
> returns more confident, clearing `ask` as it does (`app.jsx:4062`) — left live it silently deletes
> the follow-up under test.

### Suite: `smoke.spec.js` — Part A

| # | Scenario | Status |
|---|---|---|
| 24a | The dashboard comes up, not a blank screen | ✅ |
| 24b | It survives all three device widths | ✅ |
| 25a | Light resolves its colour variables, and survives a reload | ✅ |
| 25b | Dark resolves its colour variables, and survives a reload | ✅ |
| 25c | Light and dark are actually different | ✅ |
| 26 | Logging a meal lands it in today's list and moves the macros | ✅ |
| 27 | A logged workout says its calories are spread forward | ✅ |
| 29 | Switching mode moves the target, with no confirm in the way | ✅ |

> **25 asserts the variables RESOLVE**, not merely that a class is applied. That is what catches
> the session-15 failure, where every `var()` resolved to nothing and the UI flattened while every
> DOM assertion still passed.

---

## Planned

Worked **one at a time**, in this order. Each lands green before the next starts.

### Complete

| # | Scenario | Maps to | Status |
|---|---|---|---|
| 15 | Rework #3 into a genuine differential sync test | no-cloud | ✅ 2026-08-11 |
| 16 | Mid-cut the bar fills, labelled in real weeks | B1 | ✅ 2026-08-11 |
| 17 | Weight up while cutting: the target is **not** lowered | B5 | ✅ 2026-08-11 |
| 18 | At Maintain the explanation stays silent | §5.4 | ✅ 2026-08-11 |
| 19 | The stall nudge, blameless, outranking the week count | B6 | ✅ 2026-08-11 |
| 20–23 | Quick Add v68: no reset button, delete sticks, revive runs once | v68 | ✅ 2026-08-11 |
| 24–27, 29 | Part A smoke: render, theme, log meal, log workout, mode switch | A | ✅ 2026-08-11 |

| 22 | Renaming a meal deletes the row under the old name | v68 | ✅ 2026-08-11 |

### Still open

| # | Scenario | Status |
|---|---|---|
| 28 | Two months of weigh-ins: losing vs stalled, and the target holds | ✅ 2026-08-11 (6 tests) |

### Needs a human, not a test

| Check | Why no test can do it | Where |
|---|---|---|
| Does Supabase actually delete the row on delete/rename? | Schema, column names and RLS are not observable from a harness | `DEVICE-TEST.md` Part B2 |
| iOS Safari rendering · PWA install · SW cycling · haptics | Chromium, no service worker, no vibration API | `DEVICE-TEST.md` Parts A/C |

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

## Findings from the first full run (2026-08-11)

**No production bugs found.** Every failure was either the harness misrepresenting the app, a
documentation defect, or a fault in the tests themselves. Details for review:

### F1 · Harness never applied a saved theme — **fixed**

`preview.html` borrowed `index.html`'s `<style>` block but **not** its flash-free theme-init script,
so `data-theme` was never set on load. The switcher appeared to work, then silently forgot on
reload, and the harness showed theme behaviour the real app does not have. Production
(`index.html`) was never affected.

Same failure family as session 15's missing theme CSS — the harness borrowed half the mechanism.
Fixed by adding the bootstrap to `preview.html`, plus `__fuelSyncChrome` stubbed since `applyTheme()`
calls it and there is no browser chrome here to tint. Caught by tests 25a–c.

### F2 · `DEVICE-TEST.md` seeds the wrong day — **open**

Its snippets use `new Date().toISOString().slice(0,10)` (**UTC**); `todayKey()` (`app.jsx:214`) uses
**local** date parts. Under BST they disagree between **00:00 and 00:59**, so `mode__<key>` lands on
yesterday and B1/B2/B3/B6 render a screen that was never configured — silently, with no error.

### F3 · `DEVICE-TEST.md` B6 clears its threshold by one entry — **open**

B6 seeds 25 weigh-ins. The stall check needs at least three predating `today − 21`, and 25 supplies
exactly three. Any trimming, or a gap in the series, drops it to "no data" and the card never
appears — which reads as a broken feature rather than an under-seeded fixture. Recommend 30.

### Test-authoring traps hit while writing this suite

Recorded because they cost time and will recur:

- **`addInitScript` re-runs on every navigation.** Its `localStorage.clear()` fired again on
  `page.reload()`, re-seeding state and undoing whatever the test had just done — which made "does
  it survive a reload?" impossible to ask. Latched with `sessionStorage`, which `clear()` doesn't
  touch.
- **Unscoped locators catch the harness.** `/Reset/i` matched the dev panel's "Reset to Today", and
  `/\d+ kcal/` matched the workout's burn figure before the target chip. Scope to `#root`.
- **`getByPlaceholder` substring-matches.** `getByPlaceholder("0")` matched the meal-name field,
  whose placeholder is `"e.g. Chicken breast (150g)"` — so a test that meant to edit the calories
  renamed the meal to "700" instead, and then "failed" on a delete that was entirely correct. Pass
  `{ exact: true }`. Caught only because a control test asserted the delete should *not* fire.
- **A negative test on insufficient data passes vacuously.** See F3: "a moving scale is not a stall"
  was green while the stall check was returning `null` for want of history. Every negative assertion
  needs a positive control proving the mechanism fires at all.

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

Building this only saves the tedious half — manufacturing the states and capturing them. Someone
still has to look at every screenshot and judge it. (The lint pass above is the exception: it's
pass/fail and needs no reviewer.) Not scheduled — revisit when the functional suite below is done.

---

## Known limitations

- **Chromium only.** Target is a Chrome PWA on Android. Real Safari is not simulable here.
- **Absence assertions use a fixed wait.** Proving a card *isn't* there has no event to wait on, so
  `waitForTimeout` is used. Pragmatic, not clean; it is the one timing smell in the suite.
- **Screenshots are not compared.** They are written for a human to look at, not diffed. Visual
  regression would need a baseline commitment nobody has asked for at n=1.
- **This does not retire `DEVICE-TEST.md`.** It removes the *repeat* cost of regression checking. The
  one-time go-live device test still stands on its own.
