# Playwright UI Test Plan — Fuel Log

**Created:** 2026-08-11 (session 16) · **Owner:** QA hat · **Suite:** `e2e/`

Live status of the browser-level test suite: what exists, what passes, what's next. This is a
**working document** — the status column is updated as items land, so it always answers "where are
we". Durable behaviour lives in `ENERGY_MODEL.md` / `DOCS.md`; the specs themselves are the contract.

**Current:** 150 tests · 150 passing · runtime ~90s · last updated 2026-09-16 (session 24)
**Plan items 15–43 are all complete.** Jest 437/437 alongside.

> ### 🔖 Shelved — one open item, needing a decision rather than more investigation
>
> **Everything this suite has found is now fixed — `F4` closed 2026-08-26: [Findings](#open-findings).**
> The AI re-estimate on a logged entry can write a silent `NaN` and then save the meal as **0 kcal**.
> Diagnosed and reproduced; the fix is four lines `MealForm` already has. Nothing else is
> outstanding — F1–F3 are all fixed, and the suite is green.

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
| Jest mirrors | thresholds, `calcTargets`, drain arithmetic | `__tests__/logic.test.js` (236) |
| **Playwright** | **does the right card appear, saying the right words** | `e2e/` (63) |
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
> Open Food Facts used to have to be aborted here: it ran in parallel and replaced an item when it
> returned more confident, clearing `ask` as it did — left live it silently deleted the follow-up
> under test. That cross-check is gone (2026-09-15, `features/logging/07`); the route now stays as a
> tripwire, counting requests, and an `afterEach` fails any test that made one.

### Suite: `entry-editor.spec.js` — correcting an entry after the fact

Covers all five scenarios of **Feature: Edit a logged entry in place** (`features/logging/01-edit-entry.feature`).
This is the one surface where a wrong number can be fixed later, so what matters is that the
correction lands in all three places — the row, the day's totals, and `logs__<key>` on disk.

| # | Scenario | Status |
|---|---|---|
| 32a | Tapping an entry opens an editor in place, pre-filled on every field | ✅ |
| 32b | Saving updates the row, the totals, and the stored record — and survives a reload | ✅ |
| 32c | Cancel discards, in the row and in the totals alike | ✅ |
| 32d | Premium: re-estimate refills the macros and keeps the corrected name | ✅ |
| 32e | Premium: a low-confidence AI answer is still the answer — Open Food Facts is never asked | ✅ |
| 32f | Anonymous: the gate is raised, and manual editing still works after dismissal | ✅ |

> **32e was inverted on 2026-09-15.** It used to assert that OFF's 415-kcal lasagne *won* over a
> 60-confidence AI answer — i.e. it pinned the behaviour that `features/logging/07` removed after it
> was found swapping "Butter, 30g" for a peanut-butter biscuit. Both re-estimate tests now serve
> OFF the same bait product, count every request to it, and assert the count is **0** and the AI's
> 815 stands after a one-second grace. `ai-followups.spec.js` carries the same tripwire in an
> `afterEach`.
>
> **The row is REPLACED by the editor while editing** (`app.jsx:3605`), so "not saved yet" cannot
> be asserted against the row — it isn't on screen. 32d checks the day's total and reads
> `logs__<key>` directly instead.
>
> Same stubs and same limits as `ai-followups.spec.js`: the model response is a fixture, so these
> say nothing about whether the real model returns sensible numbers.

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

### Suite: `history-averages.spec.js` — the History screen (session 22)

| # | Scenario | Status |
|---|---|---|
| 35a | Seven complete days average 2,510 kcal, not 2,196 | ✅ |
| 35b | Fat averages 78g, not 68g | ✅ |
| 35c | The average holds still once today is logged | ✅ |
| 35d | A past day the app was only opened is not averaged in as a zero | ✅ |
| 36a | No header states a day count, so there is nothing to reconcile | ✅ |
| 36b | No footnote under the numbers — the dates carry it *(inverted 2026-09-16: was "the card says what it is built from"; the two lines it asserted are gone, see DOCS §37 v6.9.2)* | ✅ |
| 36c | The one row the average excludes is marked TODAY | ✅ |
| 36d | The day list still runs to today — the fix narrows the average, not the rows | ✅ |
| 37a | A brand-new account says the average starts once today has finished | ✅ |
| 37b | A 30-day window with no complete day does not report 0 KCAL | ✅ |
| 38a | A flat fortnight is not reported as a gain | ✅ |
| 38b | The figure carries no caption *(inverted 2026-09-16: was "says these are averages and can still swing")* | ✅ |
| 38c | A missing weigh-in takes up its own space instead of collapsing | ✅ |
| 38d | Too few weigh-ins says so instead of guessing a direction | ✅ |

> **This suite exists because Jest could not have caught any of it.** `__tests__/logic.test.js` has
> **zero `require` of `app.jsx`** — it is a hand-retyped mirror — so the History cutoffs were never
> covered and 370 green tests said nothing about a divide-by-8 on the app's headline number. The
> arithmetic now lives in `__tests__/history.test.js` and the UTC day-key idiom is guarded
> statically by `__tests__/datekeys.test.js`; this file owns what the *screen* says.
>
> **It proved its worth immediately.** Mid-build, an edit dropped one `const` inside
> `runCalibration` and the app crashed to a blank screen on load. Jest stayed 400/400, because the
> mirror still had the line. Only the browser suite failed. Diagnosing it needed the console error
> from *inside* the harness iframe — `page.on("pageerror")` on the main frame reports nothing, and
> the first diagnostic run was a false negative because the fixture shape had been guessed rather
> than copied from the real spec.
>
> **Two traps worth knowing before adding to this file.** Selecting a day row by its kcal is unsafe
> when the seeded days share a value — the averages card carries that number too, so a text match
> hits the chip, not a row; select by the mode chip inside the row instead. And `page.evaluate` does
> not auto-wait, so measuring chart geometry needs an explicit wait for a dot to be visible first.
> Both cost a debugging cycle here.

### Suite: `history-day-edit.spec.js` — correcting a past day (session 22)

| # | Scenario | Status |
|---|---|---|
| 39a | A past day's mode is three chips, and one tap changes it — no confirm | ✅ |
| 39b | Changing the mode re-targets the day for that mode | ✅ |
| 39c | The re-targeting is stored, so going back and forth lands on the same number | ✅ |
| 39d | A typed target survives until the mode is changed again | ✅ |
| 39e | Today is not editable here — its own control is on the dashboard | ✅ |
| 40a | The target can be set by hand, and the day is regraded against it | ✅ |
| 40b | The safety floor still holds on a typed number | ✅ |
| 40c | Cancelling leaves the stored target alone | ✅ |
| 40d | A day saved before targets were stored says so, rather than pretending | ✅ |

> **39c is the load-bearing one.** The target is computed once when the mode is tapped and stored;
> it is never re-derived on read, so it cannot drift as the adaptive TDEE moves on. Tapping
> CUT → BULK → CUT must land on the same number it did the first time.

### Suite: `stated-totals.spec.js` — typed totals are the meal (session 23)

Contract: `features/logging/06-stated-totals.feature`. The recogniser's edge cases are Jest's
(`__tests__/ai-log.test.js` lifts the real regexes out of `app.jsx`); this suite asks what the
screen shows and what gets stored.

| # | Scenario | Status |
|---|---|---|
| 41a | The founder's crumpets line → one row, at once, exact figures, 100%, no questions, **0 worker calls** | ✅ |
| 41b | `LOG ALL AS ONE ENTRY` stores 539 / 9.2 / 66.5 / 25.8 at conf 100, named after the food — not 942 | ✅ |
| 41c | A description without a totals line still goes to the model (1 worker call) | ✅ |

> **The stub is the tell.** The worker fixture answers with 942 kcal — the wrong number from the
> bug report — so if the model were asked after all, the wrong figure would be on screen and the
> test would say so. 41b counts worker calls *before* leaving the AI Log: the dashboard has worker
> calls of its own (the coach) that are not what the test is about.

### Suite: `calorie-card-label.spec.js` — the card says over when you are over (session 23)

Contract: `features/dashboard/01-calorie-tolerance.feature`, the three scenarios added 2026-09-15.
The target is pinned by seeding `target_kcal` (the ✎ pill's key), so the cases are the report's
exact numbers.

| # | Scenario | Status |
|---|---|---|
| 42a | 2,366 against 2,319 reads **OVER BY 47**, still blue — the founder's case | ✅ |
| 42b | 2,272 reads REMAINING 47 | ✅ |
| 42c | 2,319 reads REMAINING 0 | ✅ |
| 42d | 150 over is amber and reads OVER BY — no "JUST OVER" anywhere on the dashboard | ✅ |

### Suite: `duplicate-total-row.spec.js` — a hallucinated meal-total row is dropped (session 24, cloud)

Written in a cloud session (`a178e03`, PR #2) against the founder's 16 Sep lunch: six real foods
plus a trailing estimate block that the model returned as a seventh row equal to the sum of the
other six. Contract: `features/logging/06-stated-totals.feature`, the 2026-09-16 block — written
after this suite, on the founder's instruction, and its header says so. The function's edge cases
(a lone stated-totals row, two equal items, a kcal-only coincidence) are Jest's, in
`__tests__/ai-log.test.js`.

| # | Scenario | Status |
|---|---|---|
| 43a | Only the six real items are shown — the summary row never renders | ✅ |
| 43b | The TOTAL card sums the six real items only — not double | ✅ |
| 43c | `LOG ALL AS ONE ENTRY` writes the true total, not double | ✅ |

> The worker stub returns the exact seven-row reply from the bug, so the assertion is on the
> screen after the guard, not on the guard in isolation — 744 on the card, not 1488.

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
| 28 | Two months of weigh-ins: losing vs stalled, and the target holds | B5/B6 | ✅ 2026-08-11 (6 tests) |
| 30–31 | AI follow-ups: which items get asked, and in what units | v6.7 | ✅ 2026-08-11 (8 tests) |
| 32 | Edit a logged entry in place, incl. re-estimate and the gate | `logging/01-edit-entry` | ✅ 2026-08-16 (6 tests) |
| 33 | An unreadable AI estimate is refused, not saved as a zero (F4 regression) | `logging/01-edit-entry` | ✅ 2026-08-26 (1 test) |

### Still open

**Nothing planned is outstanding, and nothing is carried.** Every item 15–33 is written and green,
and F4 — the one bug the suite found in the app — was fixed on 2026-08-26. What remains is the
human-only checks below, which no test can reach.

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

## Findings

Everything the suite has turned up. **This is the only list** — findings are not tracked anywhere
else. Nothing is open: F4, the last one, was fixed on 2026-08-26.

<a id="open-findings"></a>

### Open findings

**None.** Everything this suite has found has been fixed.

| # | Fixed | |
|---|---|---|
| **F4** | **AI re-estimate wrote a silent `NaN`, saving the entry as 0 kcal** — the only finding that was a bug in the app rather than in a test or a doc | ✅ `app.jsx`, sw v73 |
| F1 | Harness never applied a saved theme | ✅ `preview.html` |
| F2 | `DEVICE-TEST.md` seeded a UTC day key against a local one | ✅ `DEVICE-TEST.md:94` |
| F3 | `DEVICE-TEST.md` B6 cleared the stall threshold by one entry | ✅ `DEVICE-TEST.md:164`, now 30 days |

---

### F4 · AI re-estimate can silently zero an entry — **✅ FIXED 2026-08-26 (sw v73)**

**The only finding so far that is a bug in the app rather than in a test or a doc.**

`EntryEditor.reestimate` fills the macro fields straight from the AI response with no validity
check (`app.jsx:2839`). `MealForm` guards exactly this case four lines of code away
(`app.jsx:2462` — *"never claim 'Filled' with blank fields"*); the guard was never copied to the
editor. Confirmed by probe, not by reading:

| AI returns | Fields show | Button says | On Save |
|---|---|---|---|
| JSON with no numeric `kcal` | `NaN` in all four | **"✓ Updated — re-estimate again"** | **stores 0 kcal, 0 macros** |
| unparseable text | unchanged (620) | unchanged | — (handled, via the `catch`) |

The second row is why this is narrow but real: a thrown parse error is already handled. The failure
is the *parsed-but-empty* response — the app reports success, shows `NaN`, and
`Math.round(Number("NaN") || 0)` (`app.jsx:2852`) resolves to **0**. A user who taps re-estimate,
reads "✓ Updated", and taps Save loses that meal's calories and macros with no error shown.

**Fixed 2026-08-26 by porting the `MealForm` guard.** `EntryEditor.reestimate` now refuses a
response whose `kcal` is not finite, showing *"Couldn't estimate that — try rephrasing the name."* —
the same honest message `MealForm` has shown since v6.7 — and leaves the fields at the values they
already had. The seventh test exists: *"premium: an empty AI response is refused, not saved as a
silent zero"* in `entry-editor.spec.js`, whose load-bearing assertion is the stored record, not the
message. Suite is **68**.

`searchOFT` was checked and deliberately left unguarded: it coerced every field with `|| 0`,
so the Open Food Facts path could not produce a `NaN` and needed no equivalent. (Moot since
2026-09-15 — `searchOFT` no longer exists; see suite 32e above and `features/logging/07`.)

---

### From the first full run (2026-08-11) — all three since fixed

**No production bugs were found on the first run.** Every failure then was either the harness
misrepresenting the app, a documentation defect, or a fault in the tests themselves. F4 above came
later, from reading the source while writing `entry-editor.spec.js`.

### F1 · Harness never applied a saved theme — **fixed**

`preview.html` borrowed `index.html`'s `<style>` block but **not** its flash-free theme-init script,
so `data-theme` was never set on load. The switcher appeared to work, then silently forgot on
reload, and the harness showed theme behaviour the real app does not have. Production
(`index.html`) was never affected.

Same failure family as session 15's missing theme CSS — the harness borrowed half the mechanism.
Fixed by adding the bootstrap to `preview.html`, plus `__fuelSyncChrome` stubbed since `applyTheme()`
calls it and there is no browser chrome here to tint. Caught by tests 25a–c.

### F2 · `DEVICE-TEST.md` seeded the wrong day — **fixed**

Its snippets used `new Date().toISOString().slice(0,10)` (**UTC**); `todayKey()` (`app.jsx:214`) uses
**local** date parts. Under BST they disagree between **00:00 and 00:59**, so `mode__<key>` landed on
yesterday and B1/B2/B3/B6 rendered a screen that was never configured — silently, with no error.
Fixed: the snippets now build the key from local parts via `window.k` (`DEVICE-TEST.md:94`).

### F3 · `DEVICE-TEST.md` B6 cleared its threshold by one entry — **fixed**

B6 seeded 25 weigh-ins. The stall check needs at least three predating `today − 21`, and 25 supplied
exactly three. Any trimming, or a gap in the series, dropped it to "no data" and the card never
appeared — which reads as a broken feature rather than an under-seeded fixture. Fixed: the fixture is
now 30 days, with the reasoning kept beside it (`DEVICE-TEST.md:164`).

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
evidence. (The `DEVICE-TEST.md` open question about whether *"Below your resting metabolism"* was
permanent wallpaper got settled the other way, on 2026-08-26 — three weeks of real use answered it
and the card was removed. A contact sheet would have shown the same thing sooner.)

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
