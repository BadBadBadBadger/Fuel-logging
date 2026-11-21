# Fuel Log v2 UI/UX Handover

**Status:** design signed off for Today and Settings, both themes. Ready for Phase 0 (safety net) and Phase 1 (removals). A few decisions are still open (§11); they must be closed before v2 becomes the default.
**Baseline:** live app v110, `main` @ `b229d45`. No app code was changed during design.
**Direction:** "Instrument", chosen from three candidates. A fuel gauge, slate panels, amber as the single signal colour, no emoji, no glow.
**Review page (all mockups side by side):** https://claude.ai/artifact/R5rswSyztDfN1maPEYsyZ6 (private to the owner).

Folder contents:

| Path | What it is |
|---|---|
| `HANDOVER.md` | This file: the source of truth for build. |
| `mockups/a2.html` / `.png` | Today v2, dark |
| `mockups/a2-light.html` / `.png` | Today v2, light |
| `mockups/a2-over.html` / `.png` | Gauge: colour bands and the over-target states |
| `mockups/a2-break.html` / `.png` | Diet break: the cut-load tape, break due, the decision sheet, during a break |
| `mockups/a2-break2.html` / `.png` | Diet break: banked days and the final wording W1–W10 |
| `mockups/settings.html` / `-light` | Settings v2: the top level plus Body & goal |
| `mockups/icons.html` / `.png` | Emoji → icon audit and the 15-icon set |
| `review-page.html` | The full comparison page, all rounds (open in a browser; needs now-*.png beside it) |
| `reviews/` | Diagnosis, settings inventory, QA and Eng coverage reviews, the early-return swarm and its ruling |

Every mockup is static HTML. Each one's CSS is scoped under its own root class (`.mock-a2`, `.mock-a2l`, …) and can be read for exact values.

---

## 1. Decisions log

Every item here is decided by the owner. Don't re-open any of them without the owner.

| # | Decision |
|---|---|
| D1 | Direction A, "Instrument", in **dark and light** themes. |
| D2 | **Gauge:** the big number is calories left, with a small "kcal" after it and **"still to go"** underneath. The tank **fills as you eat**, from E towards F. |
| D3 | Under the gauge, **TARGET** and **EATEN** are centred. No "target − eaten = left" sum anywhere: sums on screen are patronising. |
| D4 | **Tapping TARGET overrides it inline**, as today (spec `targets/02`): a dashed underline, no pencil. An edit state shows "Auto would be N · Use auto". |
| D5 | **No glow** anywhere: no text-shadow halos or glow box-shadows. |
| D6 | **Removed:** the protein/fat hint sentence, the AI coach card, all diet/allergy/dislike settings, and the safe-minimum explanation notice. The safety floor itself **stays**; only the notice goes. |
| D7 | **LOG FOOD** (keeps its "AI" chip) and **QUICK ADD** sit **above** the meal list. |
| D8 | **Meal rows have no per-row buttons.** Tapping a row expands it into an inline editor with **Save · Save to Quick Add · Delete**, plus **"Re-estimate from name"** (PRO, no "AI" label) on its own row at the bottom. There is **no Re-log**: it never existed, and the live ⚡ button is Save to Quick Add. |
| D9 | **Measurements** are a permanent row on Today with a **due** state (amber dot plus "DUE"), never a pop-up. Settings keeps only the reminder preference. |
| D10 | **Mode** (CUT / MAINTAIN / BULK) can be changed from the **Today lamps and from Settings › Body & goal**. Both must go through the same guarded path (§7.6). |
| D11 | **Settings:** 4 groups and a footer (§8). 30 items → 19. |
| D12 | **Emoji** are replaced by a 15-icon line set. They stay only on Achievement badges. |
| D13 | The **signed-in Google chip** stays at the end of the header (round, initial fallback) and opens Account. |
| D14 | **A diet break is Maintain mode.** There is no BREAK mode and no BREAK label. A **cut-load tape** under the lamps shows progress (§7). |
| D15 | **Break days must be real:** a break day is **banked** only if intake ≥ **90 % of maintenance**. Under days don't count and show as gaps. Unlogged days are pending. |
| D16 | **Going back to Cut early:** one gentle confirm, then the choice is respected. Partial rest counts pro rata. No second confirm, no cooldown, no "why?" form. |
| D17 | **Over target, CUT only:** the line is green up to target, amber up to +250, red beyond. The arc is **100 % full** at or over target, with **no extension past F**. Colour alone shows how the day went. The readout says "N over". |
| D18 | Over target, **today still looks like a cut day**, but a day eaten at maintenance or above is **saved to History as Maintain** (or **Bulk** at maintenance + 500). The chosen mode never changes. |
| D19 | **Maintain and Bulk modes are neutral:** no colour coding at all. |

---

## 2. Visual system

### 2.1 Colour tokens

Take the token names from the mockups. Build them as CSS custom properties on `:root[data-theme]`, which replaces the current 61-per-theme set (18 of them reds).

| Token | Dark | Light | Use |
|---|---|---|---|
| `--stage` | `#0d1114` | `#c5ced4` | Page behind the app (desktop/PWA frame) |
| `--panel` | `#1c2327` | `#e6ebee` | App ground |
| `--panel-2` | `#232c31` | `#f8fafb` | Raised groups (light: plus a soft 1px shadow; no heavy borders) |
| `--well` | `#11171a` | `#dce2e6` | Recessed areas: gauge well, inputs (light: `inset 0 1px 2px rgba(25,40,52,.14)`) |
| `--ink` | `#dbe2df` | `#1e2529` | Primary text (light about 15:1) |
| `--dim` | `#7f8c8e` | `#56626a` | Quiet labels (light ≥ 4.3:1) |
| `--faint` | `#3a464c` | `#b3bec4` | Ticks, unfilled tape, dividers |
| `--hair` | `#2c363b` | `#d2d9dd` | Hairlines |
| `--amber` | `#ffb23e` | `#ffb23e` | **Fills only** (LOG FOOD, Save, lit lamp, badge count). Always with dark text `#1d1406`. |
| `--amber-ink` | `#ffb23e` | `#9a5a00` | Amber **text** (light 5.2:1) |
| `--amber-mark` | `#ffb23e` | `#b86e00` | Amber **marks**: pointer, tape pointers, DUE dot, thin outlines |
| `--amber-bg` / `--amber-edge` | `#2a2012` / `#4d3714` | `#fff1d9` / `#e9c58c` | Lit-lamp tint and outline, Quick Add button |
| `--rust` | `#c9836f` | `#b0412e` | Destructive (Delete), light 5.5:1 |
| `--teal` | `#7cbfb4` | **to derive** | Diet break / rest (tape fill, positive break line W10). bg `#15302d`, edge `#275049` |
| `--good` | `#8cc47a` | **to derive** | CUT gauge line ≤ target |
| `--over` | `#e8604c` | **to derive** | CUT gauge line > +250. It must differ from `--rust` |

**Rules**
- Amber means "needs attention" or "primary action". Never decorate with it.
- `--good`, `--amber` (as the gauge line) and `--over` appear **only on the CUT gauge**. Maintain and Bulk use `--dim` / `--ink`.
- Macros carry no good/bad colour. The tapes are neutral, with an amber pointer.
- **Light values for `--teal`, `--good` and `--over` are not designed yet.** Derive each one to ≥ 3:1 as a mark and ≥ 4.5:1 as text on `--panel-2`, and check them with the owner.

### 2.2 Typography

Google Fonts: **Barlow Condensed** 500/600/700 (labels, wordmark, buttons), **Barlow** 400/500/600 (body), **JetBrains Mono** 400/500/600/700 (every number, tapes and micro-labels). Always use `font-variant-numeric: tabular-nums` for figures.

| Role | Spec |
|---|---|
| Gauge readout | Mono 600 68px/1; the "kcal" suffix is mono about 15px on the same baseline |
| Wordmark "FUEL/LOG" | Condensed 700 26px, the slash in amber |
| Primary button label | Condensed 700 22px (LOG FOOD), 15px (QUICK ADD) |
| Figures (TARGET/EATEN, kcal) | Mono 500 15–22px |
| Body / meal names | Barlow 400–600 13–15px |
| Micro-labels | Mono 600 9–11px, letter-spacing .12–.16em, uppercase **set by CSS, not typed into the text** |

Use at most 3 weights per family on a screen. The live app's 28 font sizes and 165 bold-weight uses go.

### 2.3 Shape and spacing
- Phone gutter 20px; groups separated by tone, with radius 14–18px on panels and 8–10px on controls.
- Tap targets ≥ 36px (header buttons are 36px; rows are full width).
- One shared `Panel` component replaces the 26 pasted card styles. Use a border only where tone can't separate two things.

### 2.4 Icons (D12)
- **15 line icons**, one family: a 24px grid, 1.75px stroke, round caps and joins, `currentColor`, drawn in a slightly hand-made style. Exact SVGs are in `mockups/icons.html` (the table and before/after strip).
- The set: settings, history, trophy (badges), AI sparkle, bookmark (Quick Add; filled when saved), warning, check, pencil (only where no row-tap exists), x, camera, photos, mic, lock, flame, water.
- **One meaning per icon.** Today ⚡ carries 3 meanings, "done" is ✓/✅/👍, and premium is ⭐/🔐/🔏/🔓. All of that goes.
- 118 visible emoji become 54 icon uses, 13 words, 20 colour/shape states and 31 deletions. Emoji stay **only** on Achievement badges.
- Leave out any icon whose label already says it.

### 2.5 Copy rules
- Plain, short and blameless. No sums, no lecturing, no essays. A one-line "Why?" link leads to an explanation.
- Coach-style sentences only where they carry a decision (diet break). No decorative copy.
- No "AI" label on estimates. The AI chip appears only on the LOG FOOD entry point.

---

## 3. Today screen (top → bottom)

Reference: `mockups/a2.png` (dark) and `a2-light.png`.

1. **Header (sticky):** "FUEL/LOG", and under it "FRI 20 NOV · DAY 1 STREAK" (the streak is text; no 🔥 chip). On the right: History, Badges (count bubble when new), Settings, and the **avatar chip** (round, Google photo with a letter fallback; signed in only; opens Account). OFFLINE and sync status go in the date line (§11, open).
2. **Mode lamps:** CUT / MAINTAIN / BULK. One lit; none lit when a custom target is set (as today, `targets/01`). Tapping goes through `requestMode` (§7.6).
3. **Cut-load tape:** shown only while cutting or while load remains (§7).
4. **Gauge** (§4): E→F arc, readout and "still to go" / "over".
5. **TARGET · EATEN:** centred. TARGET has a dashed underline and opens the inline override (D4).
6. **Macro tapes:** PRO · CARB · FAT on one row. Each shows the figure and target (`65/169`) above a tick tape with a neutral fill and amber pointer.
7. **LOG FOOD | QUICK ADD:** LOG FOOD is the amber fill, with camera · mic · text glyphs and the "AI" chip. QUICK ADD has an amber outline and "saved meals" underneath.
8. **EATEN TODAY · N items · kcal**, then the meal rows (§5). Under the last row: "Tap a meal to edit."
9. **Water:** − / 8-segment strip / +, "0 / 8 GLASSES".
10. **Weight | Est. TDEE:** kg input + LOG | "~2,741 kcal", LEARNING, "Settles as you weigh in".
11. **Measurements:** "Neck 40 · Waist 95 cm", "Last logged 8 days ago · weekly", Log. A due state shows the amber dot + DUE. Hip appears for women.
12. **Workout:** "Legs · 45 min · moderate · 486 kcal", Log workout, and "PASTE LOG · PRO".
13. **Last 7 days:** seven day lamps plus "A real cut. 7 of 7 days logged."

**There is no AI coach card.**

---

## 4. Gauge rules

Reference: `mockups/a2-over.png`. Cut target T (e.g. 2,241), maintenance M (2,741), bulk B (3,241).

| Mode | Eaten | Arc | Readout | Saved to History as |
|---|---|---|---|---|
| CUT | ≤ T | fill ∝ eaten/T, `--good` | "N kcal / still to go", number in `--ink` | Cut |
| CUT | T+1 … T+250 | **100 % full**, `--amber` | "N kcal / over", amber | Cut |
| CUT | T+251 … M−1 | 100 % full, `--over` | "N kcal / over", red | Cut |
| CUT | M … B−1 | 100 % full, `--over` | as above; **CUT stays lit** | **Maintain** |
| CUT | ≥ B | 100 % full, `--over` | as above | **Bulk** |
| MAINTAIN / BULK | any | fill ∝ eaten/target, neutral (`--dim`) | "still to go" / "N over" in `--ink` | as chosen |

- **No over-zone past F.** The pointer stops at F.
- The existing tolerance (≤ 100 over is ok, `app.jsx:4157`) is **replaced** by the bands above, for CUT. Update `dashboard/01` and `calorie-card-label.spec.js` (whose "OVER BY" becomes "over").

---

## 5. Meal rows and the inline editor (D8)

- **Collapsed row:** time (mono, left gutter) · name · `P 14 · C 72 · F 8` (P emphasised) · kcal (right). Hairline between rows. No buttons.
- **Tap → expanded in place** (`mockups/a2.png`, "Chicken and rice"), with a header showing the time in amber and "EDITING", then:
  - NAME input (full width)
  - KCAL · PROTEIN · CARBS · FAT inputs
  - **Save** (amber fill) · **Save to Quick Add** · **Delete** (rust text, right-aligned)
  - a divider, then **Re-estimate from name** (amber outline, full width) with **PRO** beside it. It re-runs `AI_REESTIMATE_PROMPT` on the name as typed; while working it shows "Re-estimating…", then "Updated". Free users get the premium gate.
- Only one row is open at a time.
- **Open, issue 3:** Cancel/collapse. QA found there is no way out without saving; spec `logging/01:20` requires one. Proposal: tapping the row header or outside collapses it and discards changes. Also restore the Quick Add "saved" state, which used to be ⚡ turning into ✓ with a re-blink (`logging/03`). It becomes a filled bookmark plus a "Saved to Quick Add" button label.

---

## 6. Settings (D11)

References: `mockups/settings.png` and `settings-light.png`. Full inventory in `reviews/settings-ia.md`.

- **Top screen:** identity row (avatar, name, "Signed in with Google", email, PREMIUM), then a read-only readout (daily target, mode, weight, height, body fat, activity), then the groups.
- **You**
  1. **Body & goal:** Goal (CUT/MAINTAIN/BULK, which goes through `requestMode`) · Daily target (Auto N / Set my own) · Weight · Height · Body fat (with the 25 % ♂ / 30 % ♀ hint) · Sex · Activity (plain labels with step ranges) · Reminders: Weigh-ins (daily / few a week / weekly / off), Measurements (weekly / off). **No sum row.**
  2. **Units & look:** weight unit, height unit, theme (dark / light / system).
- **App**
  3. **Account & data**, for everyone: Premium status or Upgrade, Download my data, Sign out, Delete account. Signed-out users see Sign in.
  4. **Advanced:** how the target is worked out, Reset learned adjustment, aggressive-cut status (see the open issue in §11).
- **Footer:** Privacy · Terms · Who handles my data · consent date · "Fuel Log v110 · updated 20 Nov 2026".

---

## 7. Diet break

References: `mockups/a2-break.png` and `a2-break2.png`. Rules live in `features/energy-safety/02` and `03`; update them as listed in §10.

### 7.1 Cut-load tape
- A thin instrument tape under the lamps, labelled **CUT LOAD** on the left with the status on the right. Ticks run 0–84, with a taller mark at the nudge point (56, lean-adjusted per `cutThresholds`) and at the end (84). It is captioned 0 · NUDGE · BREAK.
- It shows while cutting (from `CUT_BAR_MIN_LOAD`) and while load remains in any mode. It is hidden otherwise.
- **Cutting:** the fill is neutral grey up to the nudge, then amber. The right label is "N WEEKS" (real weeks, never load units); at full it reads **"BREAK DUE · N WEEKS"** in amber.
- **Tapping it at or above the nudge** opens the decision sheet (§7.4).
- **On a break (MAINTAIN lit):** the tape drains right to left in teal, labelled **"ON A BREAK · N OF 14 DAYS BANKED"**. Banked days fill solid. Unbanked days show as **hatched gaps**: neutral for one, amber at two or more. An unlogged day is a **dashed pending gap**.

### 7.2 Banking (D15)
- A break day (Maintain or Bulk mode, load > 0) is **banked** when intake ≥ **90 % of maintenance** (exact: `0.9 × M`, e.g. 2,467; display rounding is fine). Eating over counts as banked. Each banked day drains 1/14 of `loadAtBreakStart` (pro rata, as now).
- A day is judged **after it ends**. Today is "in progress".
- An **under** day is not banked and the counter holds.
- An **unlogged** day is not banked yet; logging it later can bank it.
- A **CUT-mode day eaten at ≥ M** (D18) counts as rest and drains like a banked day. It doesn't accrue load.
- This changes spec 02's principle "load is not read from food logs". The log is read **only to grant break credit**. Record that in the spec.

### 7.3 Final wording (owner-approved)

| # | Where | Text |
|---|---|---|
| W1 | Tape label, on track | ON A BREAK · 5 OF 14 DAYS BANKED |
| W2 | Tape label (pattern) | ON A BREAK · {banked} OF 14 DAYS BANKED |
| W3 | Under the tape, today | Today {eaten} of {0.9×M} to bank it |
| W4 | One recent under day (neutral) | Yesterday was under maintenance, so it didn't count towards your break. *(open: owner offered "Yesterday was under maintenance.")* |
| W5 | Two or more under days (amber) | You're not taking an effective break. Eat at maintenance. |
| W6 | Yesterday unlogged | Yesterday wasn't logged. |
| W7 | Action after W6 | Log it |
| W8 | Screen reader, hatched gap | Not banked, under maintenance |
| W9 | Screen reader, dashed gap | Not banked yet, not logged |
| W10 | Positive streak (teal), from 2 consecutive banked days; resets quietly | {n} for {n}. This is what a break looks like. |

Only one status line shows under the tape, in priority order **W5 > W4 > W6 > W10**. W3 sits beneath whichever line is showing.

### 7.4 Break-due decision sheet
- A bottom sheet over a dimmed screen. Eyebrow: "CUT LOAD FULL · {n} WEEKS IN A DEFICIT".
- Headline: **Time for a diet break**. Body: "{n} weeks is a long stretch in a deficit. Let's spend a couple of weeks at maintenance."
- Primary button: **Start a 2-week break** (sets Maintain, one tap, no confirm). Secondary: **Remind me in 3 days**. **No close and no "never ask again"**: the firm prompt can be snoozed but never dismissed.
- Footnote: "Your target moves to maintenance, about {M} kcal."
- The soft nudge (56–83) offers "Start a 2-week break" / "Not yet" (hides it for 7 days), per spec 02.

### 7.5 Going back to Cut early (D16, ruling in `reviews/early-return-ruling.md`)
- Tapping CUT while load > 0 **and** `loadAtBreakStart ≥ soft threshold` (also on the break's first day; see bug B5) opens a confirm:
  - **Headline:** "Back to cutting already?"
  - **Line, below threshold:** "About {d} more rest days would finish this break, and if you cut now the next break reminder is likely in about {w} weeks at your cut target."
  - **Line, at or above threshold:** "About {d} more rest days would finish this break, and if you cut now the break reminder will be back in a few days."
  - **Factual line** (always): "This block began on {date}."
  - **Buttons:** **Keep resting** (primary) · **Cut anyway** (respected immediately, no further friction).
- The forecast is computed from the remaining load at the **cut** target's deficit (not today's maintenance target, which gives infinity). It appears **only in this sheet**, never on the tape afterwards.
- After "Cut anyway": the tape reads "CUTTING · WEEK {n}" and the fill resumes at its true level (amber at once if ≥ soft). There's no caption and no percentage recharged. **Both snoozes are set** (bug B1).
- Bulk is never guarded, and a short casual cut never sees the guard.
- Accepted loophole: alternating Cut and Maintain days without weighing in can keep load under the nudge. The banking rule (§7.2) now limits it, because Maintain days below 90 % don't drain.

### 7.6 One guarded mode path
- Every mode change goes through a single `requestMode(mode, source)` covering: Today lamps, Settings › Body & goal, the custom-target path (bug B4) and the break sheet.
- Add a **static test** that fails if any code writes the mode outside `requestMode`.

---

## 8. Removals (Phase 1, a separate release before any visual work)

| Remove | Code to unpick (verify the lines) |
|---|---|
| AI coach card | `CoachCard` 2739–~2860, render 4852, `coachKey` 4136/7058/7915, `__devRefreshCoach` 7102–7108, `coach__` storage keys 2746/2832/7453, `features/coach/*` |
| **Keep:** `paceVerdict` | It sits under the coach heading but intake scoring uses it. Move it, don't delete it. |
| Diet, allergies, dislikes | `DIET_SUGGESTIONS` 101, `BIG14_ALLERGENS` 103, `DIETARY` and `normaliseDietary` 106–115, `dietaryPromptBlock` 119, `scanAllergens` 151 (used at 2840 and 5489/5531), `dairyAvoided` 5314, `setDietaryCache` 7132/7189/7282/7406, ProfileScreen `setDiet` 3035–3043, `TagField` 2867 |
| Stored diet data | `profile.dietary` is **on the device only, never cloud-synced** (Eng). Stop writing it; ignore it on read; leave old values harmless. Decide whether Download my data still exports it. |
| Safe-minimum notice | Card at 4451. **The floor logic stays.** |
| Protein/fat hint sentence | Today ring caption |
| Consent and legal | Consent text 2275–2276/2364, `POLICY_VERSION` (bumping it makes **every premium user re-consent**; see §11), `legal/privacy.html`, `terms.html`, `ropa.md`, `play-data-safety.md`, `in-app-copy.md` |
| Tests and specs | `features/coach/03-dietary-requirements.feature`, `features/logging/05` (allergen parts), `__tests__/logic.test.js` and `styles.test.js` (coach/diet parts), `e2e/progress-bars.spec.js` |

⚠️ **Owner sign-off required (issue 5):** removing the diet settings also removes **allergen warnings on AI-estimated items** (5489/5531). A user who has allergies stored today will silently lose those warnings. Confirm this in writing before Phase 1 ships.

---

## 9. Live-app bugs found during design

All four are confirmed in the code by the chair. Fix them on `main` independently of v2, each with a test.

| # | Bug | Where |
|---|---|---|
| B1 | `startDietBreak` clears snoozes, so after "Cut anyway" the nudge or prompt reappears straight away | `app.jsx:7823` |
| B2 | The diet-break card stays on screen during a break (the prompt only checks cutting for the stall). Same root as B1 but a separate fix | `1400–1402` |
| B3 | A second device double-counts accrual days: a stale local `lastAccrued` is combined with the cloud load | `1819–1822` |
| B4 | Setting a custom target bypasses the cut guard | `7645–7647` |
| B5 | Cut is unguarded on the day a break starts (`breakLoad` is still 0) | `1325`, `1456` |
| B6 | Jest tests a hand-copied version of the logic that has already drifted (`cutPromptFor`) | `__tests__/logic.test.js` |

---

## 10. Spec work (write before code, BDD as the repo already does)

New or rewritten `.feature` files:
1. `app-shell/05-today-v2-layout`: element order, LOG FOOD / QUICK ADD above meals, header with the avatar chip, streak as text.
2. `logging/11-tap-row-to-edit`: expand, edit, Save, Save to Quick Add (filled bookmark), Delete, Cancel/collapse, one row open, Re-estimate from name (PRO gate, in-progress, updated).
3. `dashboard/07-gauge`: still-to-go semantics, CUT colour bands, 100 % full when over, neutral Maintain/Bulk, readout "over".
4. `dashboard/08-effective-day-type`: the day is saved as Maintain/Bulk from intake; the chosen mode is unchanged; tomorrow opens in the chosen mode.
5. `energy-safety/03` (update): cut-load tape states, banking at 90 %, under/unlogged days, W1–W10, the decision sheet, early-return copy with forecast, snoozes on Cut anyway, the first-day guard.
6. `energy-safety/02` (update): the log is read only for break credit; the week count includes rest days.
7. `targets/02` (update): no pencil; the dashed underline; the "Use auto" edit state.
8. `body/03-measurements-row`: permanent row, due state, reminder preference in Settings.
9. `profile/05-settings-v2`: groups, the identity row, Account for everyone, no sum.
10. `app-shell/06-mode-guard`: one `requestMode` path from Today, Settings, custom target and sheet.
11. Retire or rewrite: `app-shell/02-premium-avatar` (Account now for everyone), `coach/*`, the allergen scenarios.

---

## 11. Open decisions (close these before v2 becomes the default)

| # | Question | Notes / proposal |
|---|---|---|
| O1 | **The other conditional cards:** aggressive-cut acknowledgement, held at maintenance minimum, eased to a steady pace, LOW ON FUEL, weight up while cutting, protein & fat kept, recharged, "mostly AI-estimated", today's score sentence | Eng **refuses to flip the default** while any safety-weight card has no home (low fuel, aggressive-cut ack, weight-up-while-cutting, eased pace). Proposal on the table: one caution strip under the gauge (highest priority only, "+N more"), plus small tags on TARGET for floors. Not yet approved, and the owner removed the safe-minimum notice as "over-egged", so expect a cull. |
| O2 | Light-theme values for `--teal`, `--good`, `--over` | Derive them to AA and show the owner |
| O3 | W4 shortening | "Yesterday was under maintenance." fits on one line |
| O4 | Is the 90 % banking line final? | Default 90 % |
| O5 | Cancel in the expanded row (issue 3) | Proposal in §5 |
| O6 | Undesigned states (issue 6): free user on LOG FOOD (locked plus gate), empty day, new user with no profile (onboarding), offline/sync in the header | Needed before the flip |
| O7 | Allergen-warning loss sign-off (issue 5) | Required before Phase 1 |
| O8 | Settings side effects (issue 8): the aggressive-cut "Undo" can't sync (the flag only latches on); a `POLICY_VERSION` bump forces premium re-consent | Either drop Undo or make the flag syncable; decide whether removing diet data warrants a policy bump |
| O9 | History, AI Log flow, Quick Add sheet, Badges/celebrations, sign-in/consent | Not designed. Phase 5. Phase 2 basics keep them visually consistent meanwhile |

---

## 12. Implementation plan

Single-file app (`app.jsx`, ~7,945 lines, Babel, no bundler), served from GitHub Pages with a service-worker cache. **Don't overwrite v1.** Build alongside it, behind a flag.

**Phase 0: safety net (no visible change)**
1. **CI:** a GitHub Actions workflow running Jest and Playwright on every PR. There is no `.github/workflows` today. Tag `v110` as the rollback baseline.
2. **Wording-independent e2e:** add a helper file per screen (`e2e/pages/today.js`: `target()`, `eaten()`, `stillToGo()`, `logFood()`, `meal(name).open()`, `water.add()`, …) and add `data-testid`/role hooks to v1. Move the 177 tests onto them. QA's count: **127 tests need only locator changes, 50 need re-asserting, 104 locators hit copy that v2 changes, and 18 specs would fail on v2 for cosmetic reasons alone.**
3. **`logic.js`:** move the pure functions (`calcTargets`, `sumLogs`, confidence, energy safety, cut load, `paceVerdict`, …) into `logic.js`, loaded by both the app and Jest. Delete the hand copy (B6). Move the derived Today logic (target warnings, intake scores, cut guard) out of `Dashboard` into `App` or `logic.js`, so v1 and v2 share it (Eng risk #2).
4. **`requestMode`:** introduce it now, in v1, with the static bypass test (§7.6).
5. **Fix B1–B5** on `main`, each with a test.

**Phase 1: removals (one release).** §8, after O7 sign-off. Bump `sw.js CACHE` and `APP_VERSION` together (the version test enforces it).

**Phase 2: visual basics in the v1 layout (2–3 small releases).** Icons (§2.4), fonts and type scale, token pruning (§2.1), shared `Panel` / `Label` / `Num` components.

**Phase 3: Today v2 behind a flag**
- A `TodayV2` component next to `Dashboard`, enabled by `?ui=v2` or `localStorage.ui_v2` (copy the existing `?dev` pattern). It uses the same `App` state and handlers, so no logic is duplicated.
- Build order: gauge and TARGET override → LOG FOOD/QUICK ADD → meal rows with the editor → water / weight / measurements / workout / 7-day → cut-load tape and break sheet → over-target bands and effective day type.
- Playwright runs **both** v1 and v2 (a project matrix); the helper files differ, the tests don't.
- **Gate to flip the default:** all e2e green on v2; O1 and O6 resolved with their safety cards in place; device test passed (`DEVICE-TEST.md` entry); founder dogfooding for ≥ 1 week. Delete v1 one release later.

**Phase 4: Settings v2,** the same flag pattern.

**Phase 5:** design, then build, the screens in O9. Add Playwright screenshot tests for 4–5 key screens only once the design is stable.

Carry the release discipline through every phase: one PR per slice, specs first, `sw.js` + `APP_VERSION` bumped together, a DEVICE-TEST entry, and START-HERE updated.
