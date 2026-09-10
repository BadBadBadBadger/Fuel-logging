# Swarm review — `01-measurement-tracking.feature`

**Date:** 2026-09-09. **Companion file:** `01-measurement-tracking.feature` (same relationship
`dashboard/04`'s review doc used — this is the review record, the `.feature` file is the spec).

This is a shaping pass, not the adversarial review `dashboard/04` got. Two fresh agents — a
Design-Lead persona and a Nutrition-Coach persona (`personas/design-lead.md`,
`personas/nutrition-coach.md`) — each read the founder's handover cold and independently, blind
to each other's output, and were asked to turn an open brief into a concrete design. Neither saw
the other's answer before writing their own. A synthesis pass (main session, not an agent)
reconciled both into the spec. Nothing here was fabricated or summarised in place of the real
output — this is the agents' own words, unedited except for removing internal tool metadata.

---

## The handover (verbatim, as given to both agents)

> Body Measurement & Body Fat Estimation Tracking
>
> Idea: Add weekly body measurement tracking to Fuel Log, feeding a body-fat percentage estimate
> calculated from tape measurements plus height — no scan or caliper required.
>
> Method: US Navy method — the calculation uses height, neck circumference, waist circumference,
> and (for males) no additional measurement beyond those three; hip circumference is only
> required for the female formula. Chosen for being well-established and validated relative to
> other tape-based approaches.
>
> Use case: Adrian is 15 months into a strength-training-led body recomposition, currently on a
> slow, deliberate caloric cut (~0.42kg/week loss) to preserve muscle gained from a very low
> baseline. Scale weight alone is a poor signal on a recomp — muscle gain and fat loss can offset
> each other, making progress invisible on the scale for weeks at a time even while real change
> is happening. He's already tracking weight and macros in Fuel Log under a "weekly-average truth
> layer" philosophy to smooth out day-to-day noise. He now wants the same philosophy applied to
> body composition: a weekly tape-measurement routine (fixed time of day, fixed conditions, fixed
> spot) that estimates BF% using the Navy method and trends it over time, so the trend line can
> surface the recomposition story that the scale hides — especially useful when visible fat (e.g.
> around the midsection) hasn't caught up yet with muscle already developing underneath it.
>
> Handover note: Data model, exact measurement input flow, calculation implementation, and UI
> placement are left open for the swarm to drive.

Both agents were pointed at the same prior art before writing anything: `bmrOf`/`ffmOf`/
`computeMacros` (`app.jsx:280-390`, the direct consumers of `p.bodyFat`), `weighRollingAvg` and
`runCalibration` (`app.jsx:657-716`, the actual code behind the "weekly-average truth layer"),
`features/profile/04-weight-sync.feature` (weigh-in auto-syncs `p.weight`, no confirm), and
`features/profile/02-body-fat-guidance.feature` (today's static manual body-fat guess).

---

## Round 1 — Design-Lead review (independent, cold start)

*(Reviewed as: senior Mobile Product Designer/UX Strategist. Persona loaded from
`personas/design-lead.md`.)*

# Body Measurement & Navy-Method Body-Fat Tracking — Design Recommendation

## Step 1–2: Interrogation and right-to-exist challenge

Before designing anything, three things the brief doesn't fully settle, resolved by reading the
code rather than guessing:

1. **Founder's claim on which sex needs which inputs is correct.** Standard US Navy method: men
   need neck + waist + height (log10(waist − neck)); women need neck + waist + hip + height
   (log10(waist + hip − neck)). Hip is female-only. Confirmed, not just trusted.
2. **Height is already collected and currently unused.** `p.height` sits in `DEF_PROFILE` and the
   Profile screen's `MeasureField`, but nothing in `bmrOf`, `ffmOf`, or `computeMacros` reads it —
   Katch-McArdle doesn't need it. The Navy method is the *first* consumer of a field that's been
   sitting idle. That's a point in this feature's favour, not incidental trivia.
3. **Does this deserve a new screen?** No. Challenged and rejected — see Layout below. Every
   piece of this fits into surfaces that already exist (WeighInWidget, Profile, History) with
   zero new `view` states. "The best screen is often no screen" holds here.

One assumption in the brief I'm pushing back on: treating this as a "new weekly number" is only
half true. It's a new **input**, but the founder's own framing ("weekly-average truth layer,"
mirroring `weighRollingAvg`) means the *displayed* number should never be a single reading — same
discipline the app already applies to weight and to the weekly intake score. I've designed the
sync and chart around that, not around "show the newest tape reading."

## Safe / Modern / Differentiated

**Safe** — A static "BODY MEASUREMENTS" card on the Profile screen only (sibling to BODY STATS /
WEIGH-INS). Neck/waist/hip inputs, computed BF% shown on save, no dashboard presence, no
engagement layer, no auto-sync — purely informational until the founder decides to wire it up.
Closest to how `bodyFat` works today. Lowest risk, lowest build cost, but has no mechanism to
actually get measured weekly — relies entirely on the user remembering to visit a settings
screen, exactly the adherence problem the founder is trying to solve with weight in the first
place (hence why `WeighInWidget` exists on the dashboard instead of living only in Profile).

**Modern** — What I'm recommending below: the log action rides on the *existing* weigh-in moment
(habit-stacking, not a new habit), the trend lives in History next to weight using the pattern
that already exists there, and the sync into `p.bodyFat` reuses the app's own rolling-average
machinery rather than inventing new UX. Zero new screens, zero new header icons, reuses four
components that already exist.

**Differentiated** — Everything in Modern, plus a one-time **"your protocol"** capture: the first
time the user logs a measurement, the app stores a short freeform note of their own conditions
(e.g. "mornings, fasted, before shower") and echoes it back at the top of the expandable
measurement form every week. This directly targets the dominant real-world source of Navy-method
noise — tape *placement and tension* drift week to week, not the formula — which is exactly the
discipline the founder's brief explicitly asked for. Text-only, cheap, not a diagram/camera
system (over-engineering for an n=1 tool with no such infrastructure today).

**My recommendation: ship Modern, with the Differentiated protocol-note folded in.** It's a few
lines of copy and one stored string — near-free, and it answers the founder's own stated
requirement better than Modern alone does.

## The four questions, answered decisively

### 1. Input flow

**Fields:** Neck (cm), Waist (cm), Hip (cm, **female only**). Height reused from profile, not
re-asked.

- Neck: "just below the larynx"
- Waist: "at the navel, standing relaxed" — the Navy method's own defined landmark
- Hip: "at the widest point" (shown only when `p.sex === "female"`)

If `p.sex` is unset, defaults to the 3-field male shape (matches the existing null-sex-defaults-
to-male convention elsewhere in the codebase), plus a one-line prompt to set sex in Profile.
Never blocks entry.

**Where it lives — reuse `MeasureField` + `UnitSwitch`.** No new screen, no header icon. Two
surfaces:

- **Action, inside `WeighInWidget`.** A collapsed secondary row below the weigh-in input. If
  measured within 7 days, a quiet confirmation ("📏 Measured 3 days ago"). Past 7 days, a
  visible but non-blocking prompt: "📏 Also log this week's measurements." Tapping expands the
  fields inline, same card, nothing navigates away. Saving the weigh-in is never gated on this.
- **Configuration + fallback, in Profile.** A "BODY MEASUREMENTS" card, sibling to WEIGH-INS,
  showing latest readings, last-logged date, and a "Log now" fallback.

**Measurement discipline without nagging:** the one-time "your protocol" note (above), echoed
back each week. No diagrams, no camera guidance.

### 2. Display

- **No new dashboard card.** A slow-moving, noise-prone weekly number sitting on a daily-visit
  screen invites daily checking — the guardrail argues against it. The only dashboard surface is
  the optional expandable input inside `WeighInWidget`, which is input, not display.
- **Profile's "CALCULATED STATS" card gets one new row:** "Body Fat % (measured)" showing the
  current synced, smoothed value with a freshness tag.
- **History gets a "SHOW BODY FAT %" toggle**, mirroring the existing "SHOW WEIGHT" toggle and
  chart. Raw readings as points, a rolling line once enough readings exist. Empty state mirrors
  History's existing copy pattern.
- Framing is **change-over-a-window, never single-reading deltas** — same discipline the weekly
  intake score already applies.

### 3. The sync question — decisive

**Yes, sync automatically, no confirm — but sync the smoothed rolling average, never the raw new
reading. This is the crux of doing this safely.**

The precedent that makes raw weight-sync safe doesn't transfer directly:
- `p.weight` syncs raw because it's re-measured *daily* and self-corrects within a day —
  Katch-McArdle recalculates fresh every render, so one noisy reading has a one-day blast radius.
  The TDEE-*calibration* layer never touches raw weight at all — it runs on `weighRollingAvg`,
  the 7-day smoothed figure. Raw-sync is safe for weight specifically because the load-bearing
  calculation downstream is already smoothed elsewhere.
- Tape measurement error is structurally larger than scale error, and it sits inside a `log10` in
  the formula, so it doesn't average out the way scale noise does. Worse, the cadence is weekly,
  not daily — one bad reading doesn't get corrected for seven days, not one.
- Unlike weight, `bodyFat` *is* the thing Katch-McArdle consumes directly — no smoothing layer
  sits between this field and the calorie target the way there is for weight/TDEE calibration.

**Recommendation, concretely:**
- A `BF_MIN_READINGS = 3` gate (mirroring the codebase's existing "n≥3 before a rolling figure
  shows" convention) — `p.bodyFat` is not touched by tape data until 3 readings exist.
- Once engaged, every new reading recomputes BF% and re-syncs `p.bodyFat` to the rolling average
  of the last 3 readings by count, not by calendar week (same gap-tolerance as `weighRollingAvg`)
  — a skipped week doesn't break or reset anything.
- Still immediate, still no confirm dialog — the *existing* smoothing pattern applied to a new
  input, not a new gate invented for this feature.
- The manual `bodyFat` field on Profile stays freely hand-editable, same as `weight` — the next
  synced reading supersedes a manual edit, exactly as the next weigh-in supersedes a manual
  weight edit.

**The trade-off, named honestly:** the first 2–3 weeks, `p.bodyFat` keeps running on whatever's
there today while tape data quietly accumulates — a genuine cold-start, not a bug. And smoothing
protects against *one* bad week, not a *sustained* bad protocol (tape creeping looser over
months) — which is exactly why the "your protocol" echo-back isn't decoration, it's the actual
mitigation smoothing alone can't provide.

**One safety gap I'm not willing to leave silent:** a rising BF% (lower LBM) lowers calculated
BMR/protein — during a cut, that's the same hazard category the app already built asymmetric
protection against on the weight side (`runCalibration`'s refusal to lower the TDEE estimate off
a bad-looking signal while cutting; the 💧 "WEIGHT UP WHILE EATING LESS THAN MAINTENANCE" card
exists to explain this without alarming). I am **not** recommending suppressing a genuine rising
reading — hiding real data is worse than a stale number. Instead: **the existing 💧 card's copy
must change**, because it currently says "updating your body-fat % in your profile keeps your
targets tracking your real lean mass" as a call-to-action — once auto-sync exists, that line is
actively wrong (the app now does this itself). Update it from a CTA to a status line that also
covers "your tape-measured body fat moved up" as a cause alongside water/glycogen/muscle, and
repoint its button from the raw field to the new Body Measurements section. This is a required
copy change as part of this work, not a follow-up.

Not proposing a symmetric guard for a rising BF% during a bulk — normal and expected during a
surplus, not the disordered-eating-adjacent direction the app's existing asymmetric design is
scoped to protect against. A deliberate scope decision, not an oversight.

### 4. Empty state and gaps

- **First-use, Profile card:** short one-time explainer in the body-fat-guidance voice. First
  reading computes and displays immediately (honest feedback, not withheld), captioned "2 more
  before this starts updating your targets automatically" — reusing the existing countdown
  microcopy pattern.
- **First-use, History toggle:** matches the screen's existing empty-history copy exactly.
- **Gaps in weekly cadence:** rolling average is last-3-*readings*, gap-tolerant by construction.
  **No streak, ever** — matching the explicit existing guardrail that weigh-ins are never
  gamified. No escalating reminder, no red badge, no "you missed a week" framing.

## Layout / Visual / Interaction / Accessibility (condensed)

Zero new `view` states — reuses `WeighInWidget`, `ProfileScreen`, `History`. No header icon (the
header is already at capacity per this persona's own standing note). No new colours; reuse
`CARD`/`BD`/`A`/existing CSS vars. Deliberately **no directional colour-coding** on the BF% trend
— stronger restraint than even the weight trend gets, because this is a newer, noisier, more
sensitive number. Inline expand-in-place, on-focus helper text, numeric keypad, `UnitSwitch`.
`aria-label` per field, `inputMode="numeric"`, `aria-live="polite"` on the computed result (a
genuine accessibility gap to close, not currently covered elsewhere for this class of result),
≥44px touch targets.

## Questions before finalising — founder's call, not mine

1. `BF_MIN_READINGS = 3` — matches the app's existing "n≥3" convention, but may want tuning.
2. Rolling-window size vs. the founder's actual intended cadence, if not exactly weekly.
3. Exact copy for the updated 💧 nudge card — a coach-hat/copy pass, not a pure UX call.

---

## Round 1 — Nutrition-Coach review (independent, cold start)

*(Reviewed as: nutritional scientist/physique coach. Persona loaded from
`personas/nutrition-coach.md`. Cross-referenced `app.jsx`, both existing feature specs,
`setup/supabase-schema.sql`, and `START-HERE.md`'s v74 changelog entry.)*

## Bottom line

**Build it, but not as described.** The method is legitimate and accurately described. The
specific person/context clears the safeguarding bar — **fine, with conditions**, not a hard stop.
But the auto-sync question is the one place the handover reaches for the wrong precedent: **do
not mirror weigh-in→weight sync.** A single tape-derived BF% reading is categorically noisier
than a single scale weight, and it feeds a formula (`bmrOf`, `app.jsx:324`) that directly sets how
much this person is told to eat. It needs the same discipline `runCalibration` (`app.jsx:684`)
already applies to weight — minimum sample size, damping, capped step — not the zero-friction
instant overwrite `features/profile/04-weight-sync.feature` uses.

## 1. Validating the method

**Accurately described — well-established tier for the formula itself, but two things need
separating: technician accuracy vs. self-measurement accuracy, which the handover doesn't
distinguish.**

- Structure is right: male formula = height + neck + waist only; female adds hip. Matches the
  handover exactly. The published form (Hodgdon & Beckett, 1984, Naval Health Research Center) is
  a log-log regression against waist-minus-neck (and waist-plus-hip-minus-neck for women) — not
  handing you exact coefficients from memory to two decimal places; verify against the primary
  source or an established calculator implementation before coding it.
- **Well-established:** against hydrostatic weighing, technician-measured Navy-method accuracy is
  the standard validated figure cited across sports-science sources (~3–4 percentage points
  standard error of estimate) — a *trained person, standardized landmarks* number.
- **We genuinely don't know (don't let anyone hand you a number here):** there is no equivalent
  published figure for a lone self-measurer with a cloth tape at home. Won't invent one. The
  formula's own sensitivity: moving waist by 1cm alone shifts the output by roughly 0.5–1
  percentage point of body fat, before compounding independent neck-reading error too. Several
  points of week-to-week noise from technique alone is a defensible expectation even without a
  citable self-measurement SEE.
- **Compared to other tape-based methods:** skinfold calipers have similar technician-level
  accuracy but are *worse* for self-measurement (several sites are nearly impossible to pinch on
  yourself). Navy's all-circumference protocol is comparably more self-administrable — a
  reasonable-but-individual-tier point in its favour, not a certified one.
- **One caveat worth flagging plainly:** the Navy method is well-documented to run high on
  muscular/athletic builds — a thick, well-developed neck reads as "more fat." Fifteen months
  into a strength-training recomp, that bias matters more as he gets leaner, not less. Worth a
  line of UI copy eventually; not a reason to withhold the feature now.

## 2. Safeguarding read

**Fine, with conditions — not a real risk for this person, but the number itself needs deliberate
design to stay that way.**

Against the persona's hard-line list (`personas/nutrition-coach.md:83-95`): not a recovery
context, not chasing a standing sub-15%/sub-23% goal, 0.42kg/week is well inside the sustained-
loss ceiling — none of the listed hard lines are crossed. He's also already demonstrating the
exact behaviour pattern (weekly-average thinking over reactive daily checking) the app's weight
feature was built to encourage — a real, not hypothetical, protective factor.

But plainly: **body fat % is a more loaded number than scale weight for most people** — it reads
as "how lean/fat I am" rather than "how heavy I am," and precision-looking output ("22.4%")
invites more confidence than the number deserves given the error bars above. That's the mechanism
that turns an occasional guess into a fixation, not the weekly cadence itself (weekly is the
right cadence — same philosophy already protecting his weight tracking).

Conditions to keep this on the "fine" side:
- **Trend framing only, never a hero single-reading number** — same principle as
  `weighRollingAvg`, applied to this metric.
- **Show the method's real error margin next to the number**, not buried in help text.
- **No colour-coded pass/fail styling** on the BF% figure — it's descriptive, not a target.
- If cadence ever creeps past weekly, or the tape gets pulled tighter chasing a lower number,
  that's the signal to pull the feature — same standard applied to any fitness number that turns
  into ritual.

## 3. The auto-sync question — my view, safety/accuracy side

**No. Do not auto-write a single weekly reading into `p.bodyFat`.** The handover reaches for the
wrong precedent here.

Weight-sync is instant because scale weight, on its own, is already a low-noise signal — and even
so, the app doesn't trust a single scale reading to move *targets*: `runCalibration` requires
`CAL_MIN_WEIGHINS = 6` raw weigh-ins before it acts at all, `weighRollingAvg` refuses a value with
fewer than 3 points, the adjustment is damped (`CAL_GAIN = 0.8`), capped per run by confidence
tier (`CAL_STEP_CAP = {low:100, medium:150, high:200}`), and bounded overall (`ADJ_CAP = 600`).
That's a lot of engineered caution around a signal that's already fairly clean, applied to an
adaptive *adjustment*, not a full BMR recompute.

A tape-derived BF% is noisier on a single reading than a single scale weight (three independent
circumference errors compounding through a sensitive log-log formula), and it doesn't feed an
adjustment — it feeds `bmrOf` directly, replacing a number the whole target calculation is built
on. Letting one noisy weekly reading silently overwrite `p.bodyFat` fails the trust bar scale
weight itself needed 6 readings and a damped integrator to clear.

What I'd want instead, using `runCalibration`'s own standard:
1. **Log raw measurements + computed BF% to their own history**, same shape as `weigh_ins` — the
   raw inputs shouldn't disappear once they're through a formula.
2. **Gate on a minimum sample before anything touches `p.bodyFat`** — N≈4 weekly readings (a
   month), more than `weighRollingAvg`'s 3-point minimum because this signal is noisier, averaged
   across them, not the latest.
3. **Cap how far one update can move the stored value** — mirroring `CAL_STEP_CAP`/`ADJ_CAP`'s
   damping logic.
4. **Surface it as a one-tap suggestion, not a silent write** — "Your tape trend suggests
   updating body fat to X% — apply?" A deliberate departure from both today's manual-instant-save
   profile field and weight-sync's silent auto-write: a human typing a number they've mentally
   vetted is a different trust category from a formula overwriting that number off inputs that
   could include one bad measuring day.

## 4. What else I'd insist on before ship

**Input-flow guardrails:**
- Fixed conditions matter more here than for weight: morning, fasted/pre-water where possible,
  relaxed normal stance — not "sucked in."
- Exact landmark instructions in the UI, not just "measure your waist": neck just below the
  larynx tilted slightly down; waist at navel level, standing relaxed.
- Take the reading twice per site and flag/re-prompt if the two disagree by more than a small
  tolerance — a cheap, well-established anthropometry practice, costs one extra tap.
- **Hard input validation, not just output plausibility:** the formula divides by
  `log10(waist − neck)` — if waist ≤ neck (a plausible typo), the calculation breaks or returns
  nonsense. Validate `waist > neck` at entry, before computing anything. The existing 4–50%
  output plausibility check should also apply here.

**Interaction with the existing safeguarding surface — flagging this hardest:** `isLeanBody`
(`app.jsx:379`) gates the EA low-fuel warning off a threshold (`LEAN_BF`: 15% male / 23% female).
If a raw weekly BF% reading — not a smoothed one — feeds that classification, someone near the
boundary could flip in and out of "lean" week to week purely on tape noise, making the low-fuel
warning flicker with no real underlying change. That is exactly the failure mode that just got a
card removed in v74 ("it warned about a non-event... and had trained its only user past amber
entirely"). Whatever feeds `isLeanBody` must be the same smoothed value discussed above, not the
latest raw reading — otherwise this feature reopens the precise problem the app just spent a
release fixing.

**Minor aside, not load-bearing:** the handover and `personas/nutrition-coach.md:116` both
describe protein as "1.6–2.2 g/kg LBM by mode/sex." Current code (`computeMacros`,
`app.jsx:282-306`) is a flat 2.2 male / 2.0 female regardless of mode, deliberately fixed this way
per its own comment. Both the prompt and the persona file describe a since-superseded version —
worth an Admin-hat doc fix at some point, doesn't affect this review's conclusions.

---

## Synthesis — reconciliation applied to the spec (main session, not an agent)

Both agents converged, independently, on several things without being asked to: fold logging into
the weigh-in moment rather than a new screen; smooth before anything touches a target-affecting
field; never colour-code the trend; validate `waist > neck` at entry; the existing 💧 nudge card
needs a copy change either way. Those are applied directly, no reconciliation needed.

**Where they genuinely disagree — the sync mechanism** — is not resolved by picking a side.
Design lead wants silent auto-sync (matches the weight-sync and no-confirm-dialog precedents);
the coach wants a one-tap "apply?" suggestion (matches nothing else in the app, introduced
specifically because the risk profile is different from weight). Reconciliation, applied to the
spec below and flagged `@founder-blocking` rather than picked silently:

- **Keep the no-confirm-dialog convention** — both `weight-sync` and `runCalibration` already
  move a number without asking; inventing a third, confirm-gated pattern nothing else in this app
  uses would be its own kind of inconsistency, and the coach's actual objection is to the
  *statistical looseness*, not to the absence of a dialog specifically.
- **Adopt the coach's stricter numbers on top of that**: a 4-reading gate (not 3), and a capped
  per-sync step mirroring `CAL_STEP_CAP`/`ADJ_CAP`'s shape — the exact percentage-point cap is
  not invented here, the same way `CAL_STEP_CAP`'s kcal values weren't invented in this document;
  it gets picked at implementation against real data, the way the existing constant was.
- **The `isLeanBody`/EA flicker risk is treated as a correctness requirement, not a preference**
  — every scenario touching that classification asserts it reads the gated/smoothed value, never
  a raw reading below the gate. This is the coach's sharpest, most concrete catch and isn't
  treated as optional in the spec.
- **The double-measurement tap-cost disagreement (design's friction principle vs. coach's
  anthropometry practice)** is also not picked silently — encoded as a soft, dismissible tip
  rather than a forced second entry, flagged `@founder-blocking` alongside the sync mechanism,
  because it's a real principle-vs-evidence tension and the coach's evidence is not weak.

Both `@founder-blocking` items are proposed directions, not blanks, matching how `dashboard/04`
handled its own two top-priority items — encoded with full reasoning so the founder is deciding
between two named positions, not filling in an empty spec.

## Outcome (round 1)

`features/body/01-measurement-tracking.feature`: new file, `@draft`, two scenarios tagged
`@founder-blocking`. Not yet through an adversarial QA/Critical-Thinking review pass the way
`dashboard/04` got one after its first draft — this round was shaping, not pressure-testing. That
pass is the natural next step if the founder wants the same scrutiny applied before build.

---

# Round 2 — Critical-Thinking pass, then a QA/Eng/Design-Lead debate, 2026-09-09

Founder's ask: pressure-test the shaped spec properly. First a solo Critical-Thinking pass (cold,
independent) on the spec as written. Then a three-way debate — QA, a new Engineering persona
(`personas/engineering.md`, created for this round — no implementation-feasibility hat existed
yet), and Design-Lead — each forming an independent position informed by the Critical-Thinking
findings, then reading each other's positions, then Critical Thinking moderating an actual debate
between the three rather than a synthesis vote. Target: a final spec that is simple, intuitive,
and gives accurate, supportive recomposition reads — not just internally consistent.

## Round 2, Pass 1 — Critical-Thinking review (independent, cold start)

*(Reviewed as: senior reasoning auditor. Persona loaded from `personas/critical-thinking.md`.
Cross-checked against `app.jsx:62,282-390,657-716,3708-3743,790-802`,
`features/profile/04-weight-sync.feature`, `features/profile/02-body-fat-guidance.feature`,
`features/energy-safety/06-weigh-in-engagement.feature`.)*

### Verdict

Self-consistent in most of its individual scenarios, but the spec's one genuinely load-bearing
promise — *"isLeanBody/bmrOf never reads an ungated raw reading"* — is only proven for the
pre-gate window (fewer than 4 measurements) and is silent on the entire post-gate life of the
feature, which is most of a user's actual usage. On top of that, one explicit cross-file precedent
claim ("7 days mirrors the existing weigh-in nudge cadence") is directly contradicted by the file
it cites, the sex-symmetry of the hard-block validation is asserted but only tested for the male
path, and the step-cap borrowed from `runCalibration` is applied without addressing that its
precedent is a two-tier system (per-step *and* accumulated) correcting a known-good starting
point, not a single undifferentiated cap correcting a possibly-fictional default guess. These are
all fixable, but none of them are polish — they're places where the spec's own safety argument
doesn't currently close.

### Contradiction

**1. Background's "sex is set" premise is falsified by the file's own next scenario.**
Background (lines 104-108) asserts `Given my profile has a sex and a height set` as the standing
precondition for every scenario in the file (standard Gherkin semantics — Background applies to
all). Scenario "An unset sex defaults to the male field set without blocking entry" (lines
121-126) opens with `Given my profile sex is not set`, directly contradicting the Background it
inherits. This isn't pedantry: it means a reader can't actually rely on "sex is set" when
reasoning about any *other* scenario in the file either (e.g. the waist>neck block, or the
measurement-fields Outline) — the file never says which scenarios the Background's guarantee
actually covers.

**2. The measurement-status day-7/8 boundary contradicts the precedent it names.**
Scenario Outline "The weigh-in widget shows my measurement status" (lines 169-180) puts day 7 in
the "quiet confirmation" bucket and day 8 in the "visible, non-blocking prompt" bucket, with a
comment claiming *"7 days mirrors the existing weigh-in nudge cadence (energy-safety/06)"* (line
174). But `features/energy-safety/06-weigh-in-engagement.feature`'s own Examples table (lines
101-107, `NUDGE_GAP_DAYS = 7` at line 39) puts day 7 in the *shown* bucket, not the quiet one — the
nudge fires *at* 7 days, not 8. The two features share a widget and a stated "mirrors"
relationship, and land on opposite sides of the same day-count. Either this file has an off-by-one,
or the cited precedent does, or "mirrors" was never actually checked against the Examples table it's
citing.

### Unstated case

**3. Post-gate ongoing sync is never scenario-tested — only the 4th reading is.**
"Reaching the sync gate syncs a smoothed reading" (218-225) is titled and worded around a single
event: *my 4th measurement*. "A sync step is capped" (227-233) and "Gaps in my weekly cadence..."
(242-247) both talk about "my synced body-fat %" in the present tense, which *implies* an ongoing
recompute-on-every-reading mechanism (consistent with how `runCalibration` behaves once past its
own threshold), but no scenario in the file actually walks through a 5th, 6th, or 10th measurement
re-triggering a sync. This matters concretely: the safeguarding scenario "The lean-body/low-fuel
classification never reads an ungated raw reading" (251-257) is scoped *only* to `Given I have
logged fewer than 4 measurements` — it says nothing about what feeds `isLeanBody` at reading #5
onward. If ongoing sync isn't actually implemented (only the gate-crossing event is), a manual
edit made after the gate could persist indefinitely with no scenario forbidding or confirming
that. The spec's central safety claim is unverified for most of the feature's operating life.

**4. Female hard-block coverage doesn't exist — only the male path is pressure-tested.**
"Waist must be greater than neck before anything is calculated" (134-141) is the file's only
hard-block scenario, and its own justifying comment is written strictly in male terms: *"The
formula divides by log10(waist − neck)"*. The design-lead's own round-1 text confirms the female
formula's domain-guard quantity is `log10(waist + hip − neck)`, a different expression. Under the
stated `waist > neck` rule, the female case happens to stay in-domain *only if* hip is guaranteed
positive — but the file never states a hip-positivity or hip-required-nonzero rule, and there's no
Examples row (unlike the sex-conditioned "Measurement fields match my sex" Outline, which *does*
give male and female rows) exercising the female block case at all. Male coverage is deliberate
and explicit; female coverage is an unstated, unverified inference from a rule that was reasoned
about only for males.

**5. Sex changed mid-tracking silently mixes two different formulas into one rolling average.**
"An unset sex defaults to the male field set without blocking entry" (121-126) lets a user log
measurements with only neck+waist (no hip) while sex is unset. If that user later sets `sex =
female` in Profile — which the app already supports and the file itself nudges toward — their
earlier readings have no hip value and were computed with the 3-field male formula. "Gaps in my
weekly cadence" (242-247) says the rolling average is "last 4 actual readings, regardless of
calendar gaps," with no carve-out for readings computed under a structurally different formula.
Nothing in the file says whether those pre-correction readings get excluded, backfilled,
recomputed, or silently averaged in as if commensurable with female-formula readings — a real
collision between the "unset sex defaults to male" convention and the "last 4 actual readings"
averaging rule.

**6. An outlier that trips the file's own plausibility warning still gets full weight in the
average that silently overwrites `p.bodyFat`.**
"An implausible computed reading shows the existing gentle warning and still saves" (189-193)
means a reading the system itself already flagged as suspect (outside 4-50%) is saved unmodified
and, per "Every raw measurement... is stored... whether or not the reading is recent enough to
affect targets" (203-208), is eligible to be one of the "last 4" the rolling average draws from.
With n=4, that's 25% weight on a value the app already told the user to double-check, feeding
directly into a profile field (`p.bodyFat`) that `bmrOf`/`computeMacros` consume with no further
smoothing. The spec never asks whether a plausibility-flagged reading should be excluded,
down-weighted, or held back from the average pending confirmation.

**7. No opt-out for the measurement prompt, unlike its closest precedent for the same widget.**
`features/energy-safety/06-weigh-in-engagement.feature` builds an explicit autonomy mechanism for
the *exact same widget* — a cadence picker including `"I'd rather not"` that "mutes the ask
entirely," a dismiss-and-cooldown flow, and a header principle that *"a 'rather not' choice must
fully mute the ask (autonomy — recovery/scale-avoidant users are first-class)"*. This file's own
measurement-status Outline (169-180) has the `never` row producing a "visible, non-blocking
prompt" forever, with no snooze, no dismiss, no cadence setting, and no reference to
`weighCadence` at all. The nutrition-coach's own round-1 review states BF% is *"a more loaded
number than scale weight for most people"* — if anything this metric needed the opt-out at least
as much as weight did, and the file doesn't carry the mechanism over.

### Weak justification

**8. The step cap "mirrors CAL_STEP_CAP/ADJ_CAP" but collapses a two-tier system into one, and
doesn't address correcting a known-rough starting value.**
"A sync step is capped" (227-233) cites `CAL_STEP_CAP`/`ADJ_CAP` (app.jsx:679,682) as its
precedent. But that precedent is deliberately two mechanisms: a *per-run* cap (confidence-tiered
100-200 kcal) and a *separate* accumulated-adjustment ceiling (600 kcal) bounding total drift from
the original TDEE estimate — and critically, it corrects a baseline (seeded TDEE) that's already
believable by construction. This spec's cap is a single undifferentiated "the update is capped,"
applied to a starting `p.bodyFat` that is very plausibly a rough guess —
`features/profile/02-body-fat-guidance.feature` literally instructs users to "use 25% for men or
30% for women as a starting estimate" when unsure. Capping the *first* sync the same way you'd cap
the fifth conflates "protect against one noisy measurement" with "slow-walk away from an
admittedly-invented placeholder," which are different problems.

**9. "Gap-tolerant, last 4 by count" is justified by resemblance to `weighRollingAvg`, but the
situations aren't alike on the dimension that matters.**
"Gaps in my weekly cadence don't reset the sync gate or break the rolling average" (242-247)
explicitly treats a gap of days and a gap of months identically. A once-a-week, multi-field,
no-scale-required tape routine is materially easier to lapse on for months than a dashboard weight
widget. At a 3-month gap, a large jump in the new reading is at least as plausibly *real*
recomposition as it is noise — the entire rationale for capping (protecting against single-reading
noise) assumes recency, which the spec explicitly disclaims mattering.

**10. Whether "4" in the Numbers Contract is settled or still `@founder-blocking` is internally
inconsistent.** Lines 52-53 list `SYNC_GATE = 4 measurements` under "POLICY CONSTANTS (the only
literals...)" — phrasing that reads as decided. But `@founder-blocking` item 1 explicitly says the
sync mechanism, including its numbers, is a *proposed reconciliation* awaiting founder
confirmation. Separately, "Too few readings for a trend line yet" independently re-derives the
same literal `4` for a conceptually different purpose (chart trend-line sufficiency vs.
safe-to-touch-BMR sufficiency) without saying whether these are meant to be the same constant.

### Fine

- **Waist>neck boundary itself is clean** — `waist == neck` is unambiguously blocked.
- **Unset-sex-defaults-to-male is consistent with the rest of the codebase**
  (`isLeanBody`/`computeMacros` already treat unset sex as male).
- **The 💧 card scenarios are correctly scoped without needing a new guard** — `showGainWhileCutting`
  is already cutting-only, so no separate bulk-context guard was needed and the file correctly
  doesn't invent one.
- **Pre-gate manual-edit behavior is internally consistent, taken in isolation** — the genuine gap
  is downstream (finding 3: what happens *after* the gate), not a contradiction here.

## Round 2, Pass 2 — QA, Engineering, and Design-Lead independent positions

Three agents, each given the spec, the review doc so far (including Pass 1's findings), and the
two original `@founder-blocking` items — each blind to the other two, forming an independent
position before any cross-reading. `personas/engineering.md` (implementation/data-integrity
reviewer) is new, created for this round — no buildability-focused hat existed in this project
before now.

### QA-Automation (independent position)

**Verdict:** Six of the ten findings are Blockers from a testability standpoint. Findings 8, 9 are
Should-fix. Findings 1, 2, 10 are mechanical. The "Sync to targets" section (210-257) isn't a
coverage gap fixable with more Examples rows — it's missing design.

Per-finding: (1) delete "sex is set" from Background. (2) Move day 7 into the visible-prompt row,
matching `NUDGE_GAP_DAYS = 7` exactly. (3) The safety claim needs an ongoing-resync scenario plus a
general invariant, not just a pre-gate-scoped one. (4) Turn the hard-block into a Scenario Outline
with sex in Examples, add explicit hip-positive validation. (5) Tag each reading with the formula
it was computed under, define the sync window as "last 4 readings under my *current* formula" —
needs Coach+Engineering sign-off, QA won't invent the resolution. (6) `runCalibration` already
excludes low-confidence inputs (`.filter(x => x.w >= 0.5)`) — same move should exclude a
plausibility-flagged reading from the sync window. (7) Reuse `weighCadence`'s existing "off" mute
— the file is currently *less* autonomy-respecting than the feature it piggybacks on. (8) Split
Examples into first-sync-from-placeholder vs. Nth-sync-from-established-value. (9) Add a scenario
on whether a multi-month gap should be trusted the same as a one-week gap. (10) Name two constants
even if they share a value; pick one settled-vs-proposed framing consistently.

**Item 1 (sync mechanism):** Silent is right, but not yet *earned* — conditional on finding 3's
scenarios actually being written before build (not before founder sign-off). **Item 2
(tap-cost):** Soft tip stands, but treated as a package with finding 7 — self-selection once a
real opt-out exists strengthens the coach's case for the tip. **File shape:** stays one file;
"Sync to targets" needs one more design round, not more scenario-writing, before QA would draft
it.

### Engineering (independent position)

**Verdict:** Buildable. Finding 3 matters most — the spec describes two mechanisms (gate-crossing,
ongoing sync) and specifies only one; the fix is to collapse to one function, not add scenarios.
Finding 5 needs one schema column, no migration (new table). Finding 6: disagree a new mechanism
is needed — the step cap already covers it, no precedent anywhere in the codebase for exclusion
machinery.

Concrete fix for finding 3 — one function, called unconditionally on every save, mirroring
`onWeighIn` calling `runCalibration` on every weigh-in:
```js
const bodyFatRollingAvg = (measurements, currentSex, beforeDate, n = SYNC_GATE) => {
  const formula = currentSex === "female" ? "female" : "male";
  const subset = measurements.filter(m => m.formula === formula && m.date < beforeDate).slice(-n);
  if (subset.length < n) return null;
  return subset.reduce((a, m) => a + m.computed_bf, 0) / subset.length;
};
```
Below gate: null, untouched. At/above gate: always recomputes from last-4-same-formula rows,
capped write. Makes `isLeanBody`'s safety property hold *structurally* (one writer, no code path
for a raw reading to reach it) rather than by scenario enumeration. Also re-triggers on edits to
past measurements, not just new-date saves.

Finding 4: `waist > neck` stays correct, just insufficient alone — add hip-required-positive for
female mode. Finding 5: add a `formula` column, filter by current formula before slicing — a sex
change ages out other-formula rows with zero migration/reset code. Finding 7: reuse
`weighCadence`/`shouldNudgeWeighIn`, don't build a parallel system. Finding 8: one flat step-cap
constant, no confidence tiers — `CAL_STEP_CAP`'s tiers exist because weigh-in history grows
unboundedly; this window is fixed at "last 4" forever, no analogous axis. Wouldn't special-case
the first sync either — bounded delay from a placeholder is fine. Finding 9: cheap either way,
deferring the *should* to coach. Finding 10: agreed, name two constants, one framing.

**Items 1/2:** Full buildable design given for item 1 (table + trigger + flat cap, no confirm
dialog). Item 2 is cheap either way — no engineering preference. **Would simplify:** drop finding
6's exclusion mechanism, flatten the step cap, collapse gate-crossing/ongoing-sync into one
function, don't treat the new table as a migration.

### Design-Lead (independent position)

**Bottom line:** Finding 7 is the sharpest catch and lands squarely on the design-lead's own Round
1 spec — an engagement mechanism with exactly the "asks forever, no way out" defect
`energy-safety/06` was built to not have. The fix is cheap and closes finding 2 for free — both
trace back to the same root cause: a hand-authored, weaker nudge system instead of reusing the one
that already exists.

**Finding 7:** Reuse `weighCadence: off` as master mute (one-line change) plus exactly one new,
independent boolean for body composition specifically ("Don't ask me for these," in the BODY
MEASUREMENTS card) — explicitly rejecting a parallel cadence taxonomy. Architecture recommendation:
reuse `shouldNudgeWeighIn` itself, called a second time with its own dismissal-timestamp key.

**Finding 2:** Not just a renumber — the deeper defect is treating "quiet confirmation" and
"visible prompt" as two copy variants in one day-count Outline, when the precedent has a static
status line *plus* a separately-gated, dismissible nudge layered on top. That structural gap is
exactly why finding 7 had nowhere to attach a dismiss/cooldown.

**Items 1/2, informed by finding 7:** Holding silent auto-sync — finding 7 makes this *more*
confident, not less: the real autonomy risk is upstream (whether asked at all), not at a completed
calculation the user already saw computed and displayed on save. A confirm dialog on the profile
field protects nothing and adds friction with no safety benefit. Framed as a package with finding
7 — ship together or not at all. Tap-cost (item 2): unaffected by finding 7, different axis
(data-quality nudge vs. emotional-safety nudge) — holding soft, dismissible tip.

**Finding 6:** A UX call — proposed a save-time choice ("save as-is, or check your measurements
first?") reusing the existing non-blocking plausibility-warning moment; if saved anyway it counts
at full weight, no silent exclusion. **Finding 5:** Also a UX call — changing sex restarts the
sync-gate count under the new formula, with one line of inline honesty at the moment of change;
wanted Engineering to confirm this is cheap.

## Round 2, Pass 3 — cross-reading and response

Each of the three was given the other two's full Pass 2 positions and specific tension points,
run in parallel (each still blind to what the *other two* would say in their own response round).

### QA responds

**Finding 3:** Persuaded by Engineering's single-function design — it's the better architecture —
but holds that a spec still needs the behavior stated in prose regardless of how clean the
implementation is ("spec before code"). Narrows the ask from potential per-reading-count coverage
down to **one** Outline: every save/edit at or above the gate re-syncs identically, whether the
4th, 5th, or 40th reading, including edits to past measurements.

**Finding 6:** Concedes the `runCalibration` citation was a mismatch (confidence-of-capture, not
plausibility-of-value) once Engineering corrects it. Does not land on Engineering's cap-only
position either — adopts **Design's Pass-2 confirm-or-remeasure proposal as the primary
mechanism, with Engineering's cap as a backstop underneath it** — reasoning that "rely on the cap"
isn't independently testable as an observable user-facing Gherkin scenario, while a capture-time
choice is.

**Item 2 (tap-cost):** Concedes fully — re-examined its own Pass-2 argument and found it conflated
"opted into this week's form" (already true every week, independent of any durable opt-out) with
"has a durable off switch" (finding 7's territory). These don't depend on each other. **Soft,
dismissible tip stands on its own merits, independent of finding 7's outcome.**

**Finding 7:** Drafts three concrete scenarios (mute-via-weighCadence, dedicated opt-out boolean,
dismiss/cooldown mirroring the weigh-in nudge) — flags one open branch: does the dedicated opt-out
also hide the Profile card's manual "Log now" fallback, or does that stay available as a
deliberate-visit entry point regardless of nudge state? Proposes keeping the fallback available
either way (a visit, not a push) but wants Design to confirm rather than assume.

**Also revises:** finding 2 — adopts Design's structural fix (status line + separately-gated
nudge) over its own original mechanical renumber. Finding 5 — calls it fully converged, no
residual disagreement. **Item 1 — upgrades from "conditional, pending scenario-writing" to
resolved**, on the strength of three independently-arrived-at, differently-reasoned confirmations
(Design's upstream-consent argument, Engineering's buildability, QA's own scenario coverage).

### Engineering responds

**Finding 3:** No real dispute with QA — reads QA's "reword to a general invariant" as exactly
compatible with (not redundant with) the single-function design: the function closes the *design*
gap, one invariant-style scenario closes the *regression-proofing* gap (protection against a
future refactor accidentally reintroducing a special case). Explicitly does not want per-reading-
count scenarios (#5, #6, #10 individually) — one Outline is correct, and reads QA as already
having said the same thing.

**Finding 6:** Retracts the flat claim that no exclusion-from-averaging precedent exists —
`intakeConfidence`'s `.filter(x => x.w >= 0.5)` is real, QA was right that it exists. Reconciles
precisely rather than conceding the whole point: that filter excludes on **capture-confidence**
(how sure the AI parse was), a signal with no equivalent for a tape measurement (there's no
independent "how sure are we this reading was taken correctly" number) — it doesn't transfer to
excluding on **value-plausibility** (the 4-50% check) without inventing a new signal from nothing.
Holds cap-over-exclusion as the bottom line, but retracts "no precedent at all" as the wrong way to
have said it.

**On Design's save-time confirm-or-remeasure specifically:** this is a different shape than what
Engineering originally objected to — no stored field, no averaging branch, touches zero schema.
"If they save anyway, it's written and counted, same as any other row." No buildability objection
to this version. Ranks preferences explicitly: **cap-only (first choice) → Design's confirm-time
copy (accept without a fight) → QA's stored-exclusion (objects to this one specifically)**.

**Finding 5:** Confirms Design's "gate restarts" and its own stateless-filter proposal produce the
same *outcome*, but argues they are not the same *design* and the difference matters: "restarts"
implies a stored counter/reset event with real failure modes (a failed write, a race with a
same-moment measurement save, a second code path that changes `p.sex` without wiring the reset).
The stateless filter needs no reset event at all — changing `p.sex` doesn't trigger anything, the
next function call simply sees a different matching set. Asks that the final spec describe the
*outcome*, not "gate restarts," so an implementer doesn't build unnecessary reset-state machinery.

### Design-Lead responds

**Finding 3:** Fully confirmed, upgraded from its own earlier conditional stance — matches exactly
what was assumed, and closes two things not previously considered (structural safety, edited past
measurements). Notes the freshness-caption copy from Round 1 (display layer) needs no changes
under continuous resync — it was designed compatibly with this mechanism by coincidence, not
foresight. **Item 1 (sync mechanism) — graduates to confirmed**, matching QA's parallel upgrade.

**Finding 6 — reverses, conceding to Engineering.** Re-examines its own proposal and finds the
"confirmed" flag it wanted to store would either be decorative (if it doesn't affect averaging) or
exactly the exclusion machinery Engineering correctly says has no precedent (if it does) — "I was
solving an agency problem with a data-model answer, which is the wrong layer." **Downgrades to:
the cap is numerically sufficient; the only remaining piece is one line of copy on the existing
plausibility warning, reusing the double-measurement tip's soft, non-blocking affordance** — zero
effect on storage or averaging, not a new mechanism.

**Item 2:** Grants QA's self-selection argument is real but holds the actual call is unaffected —
the reason for soft-tip-over-hard-gate was never population tolerance, it's the house rule against
gating a primary action at all, which doesn't weaken because the remaining audience opted in.
Commits to a real answer to QA's conditional: if finding 7 *doesn't* ship, strengthen the tip's
visibility (e.g. more prominent on early entries) rather than convert it to a gate.

**Finding 8:** Concedes no separate code path is needed for the first sync, but holds one question
open rather than fully signing off: the existing pre-gate copy ("2 more before this starts
updating automatically") doesn't cover the *post-gate convergence period* under a uniform cap — if
four consistent readings compute to 14% but the profile still shows 19% while the cap walks it
there gradually, that's an uncovered UX moment. Wants one number from Engineering (how many sync
cycles to close a full placeholder-to-true gap, worst case) before calling this fully closed — if
short, existing copy suffices; if not, one more copy state ("trending toward NN%...") is needed.

**Finding 5, finding 7, finding 2, finding 10:** unchanged from Pass 2, no residual disagreement
from either other reviewer.

## Round 2 — where this leaves the debate before Critical-Thinking closes it out

Fully converged, no residual disagreement: findings 1, 2, 4, 5, 7, 10; `@founder-blocking` item 1
(silent sync, packaged with finding 7); item 2 (soft, dismissible tip, unconditionally).

**Finding 6 has a sequencing problem, not just a disagreement**, worth flagging explicitly rather
than silently resolved: QA's Pass 3 response adopts *Design's Pass 2* confirm-or-remeasure
proposal as its own final position — but Design's own Pass 3 response, written in the same round
and blind to QA's, **retracted that exact proposal** and conceded to Engineering's cap-only
position (plus a copy-only, no-new-mechanism addition). QA's stated final position is therefore
built on a version of Design's view that Design itself abandoned in the same round. Not a live
three-way split — a stale cross-reference that needs reconciling, not averaging.

**Finding 8** has one genuinely open sub-question (does the post-gate convergence period need its
own copy state — contingent on a cap-magnitude number nobody has picked yet) that no one on this
panel can close without an implementation-time number.

**Finding 9** (gap-tolerance over a multi-month lapse) was never claimed by anyone on this panel —
all three explicitly deferred the *should* to Coach, who isn't part of this round.

## Round 3 — Critical-Thinking moderates the close-out, 2026-09-09

Given the full transcript above (its own Pass 1 findings, then all of Round 2's positions and
cross-responses), Critical Thinking was asked to verify the claimed convergences rather than
rubber-stamp them, resolve finding 6's sequencing problem, rule on findings 8 and 9's remaining
open pieces, and — the check no single specialist was positioned to make — sanity-test the whole
reconciled design against the founder's actual success criterion: simple, intuitive, and accurate,
supportive recomposition reads.

### Findings 1–5, 7, 10 — verified, not just rubber-stamped

**1, 2, 4:** confirmed by independent re-derivation, not just re-reading the panel's claims —
including doing the domain-guard algebra for finding 4 that the panel asserted but never actually
worked through (`waist > neck` already forces `waist + hip − neck > hip`, so `hip > 0` alone
completes the female guard; nothing further is needed).

**3:** confirmed, plus one thing the panel hadn't quite finished — the "fewer than 4 measurements"
phrasing throughout the pre-gate scenario needs to become "fewer than 4 measurements under my
current formula" once finding 5's fix lands, or the two fixes contradict each other post-sex-change.

**5:** confirmed on the design (stateless formula-filter, no reset event) — but flagged as
converged-in-reasoning, not yet converged-in-spec-text: the file's current prose still needs the
edit, it isn't done by the debate agreeing what it should say.

**7:** the rare case in this debate where "reuse" was actually verified against the real function
signature (`shouldNudgeWeighIn`, `app.jsx:1018-1025`, confirmed parameterized exactly the way
Design assumed) rather than claimed by resemblance alone.

**10:** confirmed, and sharpened — the fix isn't just naming hygiene; conflating a display
threshold with a BMR-input safety gate risks someone tuning one and silently weakening the other
later. Name two constants even though they share a value today.

### `@founder-blocking` item 1 — confirmed, with a correction to the reasoning

Silent sync stands. But Design's stated justification ("the user already saw the number on save")
was imprecise and shouldn't be written into the final spec as-is: what the user sees on save is a
single raw reading, not the four-reading rolling average that's actually written to `p.bodyFat`.
The real reason silent sync is safe is that the Profile's synced-value row makes the *written*
number immediately visible after every sync — the same transparency property that already makes
weight-sync safe. Conclusion unchanged; stated reasoning corrected before it goes in the spec.

### `@founder-blocking` item 2 — confirmed

Soft, dismissible tip, unconditional. One clarification for the rewrite: it reuses finding 6's
*copy pattern*, not the same literal UI instance — item 2 fires at input time regardless of
values; finding 6's copy fires at result time, only when a reading is flagged. Keep them as two
separate, small pieces of copy, not one merged component.

### Finding 6 — the sequencing problem, resolved

QA's stated final position (adopt Design's confirm-or-remeasure mechanism, cap as backstop) rests
on a version of Design's view that Design itself retracted in the same round, conceding to
Engineering's cap-only position. Re-applying QA's own underlying objection (a scenario needs an
*observable* `Then` to assert, "trust the cap" has none) against Design's *actual* final proposal
— cap-only plus one line of copy on the existing warning — the objection no longer holds: a copy
addition is exactly as testable as every other copy assertion already in this file. QA doesn't
need the abandoned mechanism to get something to write a scenario against.

Independent reason nobody on the panel invoked: this project's own standing rule (never gate a
primary action behind an optional step) already argues against a save-time fork, and the existing
plausibility scenario already hard-states "saving is not blocked." A confirm-or-remeasure choice
sits in tension with a rule the app has already committed to elsewhere.

**Ruling: cap-only, plus one line of copy on the existing plausibility warning.** No stored
exclusion flag, no confirm/remeasure fork.

### Finding 8 — closeable now as a decision rule, not a number

Nobody has the cap magnitude (deferred to implementation, same treatment `CAL_STEP_CAP` itself
got) — not inventing one. But the *rule* that governs Design's sign-off condition doesn't depend
on the number: "if closing a full placeholder-to-true gap would take more than N sync cycles under
the chosen cap, add a post-gate 'trending toward NN%' copy state; otherwise the existing pre-gate
countdown copy is sufficient — Engineering reports N against the real cap value at implementation."
Same deferred-constant treatment the rest of this file already uses.

### Finding 9 — split into a closed half and a genuinely open half

**Closed by reasoning, not science:** whether the cap should apply the same after a 3-month gap as
after a 1-week gap doesn't need a nutrition answer — the cap's entire job is bounding how far one
update can move a target-feeding value in one step, regardless of *why* the new reading differs.
If a change is real and sustained, later readings keep confirming it and the value converges over
a few cycles (finding 8's own question); if it was noise, the cap did its job either way. Being
gap-agnostic is the *correct* engineering answer here, not merely a resemblance to
`weighRollingAvg`.

**Stays open, correctly deferred:** whether a reading taken after a multi-month lapse deserves
*less trust in the first place* — protocol drift (different season, forgotten routine, different
tape) is a real-world measurement-reliability question, not an averaging-math question, and none
of QA/Engineering/Design/Critical-Thinking is positioned to answer it. Correctly left for
founder/coach. One existing mitigation worth noting so it's not decided from zero: the "your
protocol note is echoed back every week" scenario already re-surfaces the routine regardless of
gap length.

### Check 5 — the success-criterion sanity test (the one no specialist could make alone)

**Simple/intuitive:** holds. Most of the debate's "moving parts" are the same existing UI/logic
called a second time (`weighCadence`, `shouldNudgeWeighIn`, `MeasureField`/`UnitSwitch`, the
plausibility warning) — verified reuse, not new concepts for the user to learn. One five-minute
gap to close explicitly in the rewrite: whether the always-on status line and the separately-gated
nudge (finding 2's fix) coexist or the nudge replaces the status line past the threshold.

**Accurate/supportive — a real gap none of the three specialists caught:** the converged design
has `bmrOf`, `computeMacros`, and `isLeanBody` all reading the same capped, lagged `p.bodyFat`
value, and a *symmetric* cap makes the lag direction-blind. Traced through: if measured BF% is
**falling** (a real recomposition — exactly what this feature exists to surface) while capped,
`p.bodyFat` stays artificially **high** relative to the true drop, computing a **lower** BMR/
protein floor than his real body warrants (tighter effective deficit than intended) and **delaying
`isLeanBody` tripping at exactly the point it's supposed to fire** — for the person 15 months into
a cutting recomp, the person most likely to be crossing that threshold *right now*. A symmetric cap
makes the app's own safety check slower to notice, not faster, in the one direction that matters
most for this user. This reproduces — through a pathway nobody on the panel was checking — the
same harm category the app's existing asymmetric `runCalibration` logic already exists to prevent
for weight (`wasCutting` refusal, `app.jsx:718-739`).

**Fix, reusing an existing pattern rather than inventing one:** mirror `runCalibration`'s asymmetry
for this variable. A sync that *lowers* `p.bodyFat` (a leaner reading) applies promptly, undamped.
A sync that *raises* `p.bodyFat` while the user is cutting is the risky direction and gets the
capped/damped treatment, reading the same declared-mode signal `runCalibration` already reads. This
also simplifies finding 6 in passing: a spurious high outlier logged mid-cut is now structurally
damped by the asymmetry regardless of the plausibility flag, on top of (not instead of) the flat
cap.

**Bottom line:** the reconciled design is simple and intuitive for the user, and mostly coherent —
but inherited a symmetric-cap assumption that, traced through to `isLeanBody` and the effective
deficit, would leave the exact person this app is built for under-protected in the exact direction
its own energy-safety workstream exists to guard against. Fixable by reusing
`runCalibration`'s own asymmetry, not by adding new machinery — folded into the finalized spec
below as a required fix, not a nice-to-have.

## Outcome (round 3 — finalized)

`01-measurement-tracking.feature`: 28 → 33 scenarios, still `@draft` (unbuilt), no longer carrying
`@founder-blocking` — both original items resolved through the debate with reasoning a future
reader can check, not silently decided. Applied directly to the spec: findings 1, 2, 4, 5, 7, 10
fixed as ruled; finding 3 replaced the single gate-crossing scenario with a general-invariant
Outline; finding 6 resolved to cap-only plus one line of copy, no new mechanism; finding 8 closed
as a decision rule rather than a guessed number; finding 9 split into a closed half (the cap is
correctly gap-agnostic) and a genuinely open half (multi-month measurement-trust, deferred to
founder/coach); the asymmetric-cap fix from Critical Thinking's own success-criterion check was
folded in as a required scenario, not a follow-up. `personas/engineering.md` is a new, reusable
persona for future swarms needing an implementation/data-integrity lens. `features/README.md`
updated: 35 files / 333 scenarios.

Next steps, not done in this round: an Anti-Metaphor Hero wording pass over the finalized spec,
and a UI mockup of the three touched surfaces (WeighInWidget's measurement row, the Profile Body
Measurements card, the History body-fat toggle).

---

# Implementation, 2026-09-10

Built directly from the finalized spec above — no further product decisions made along the way;
where the spec deferred an exact number (`BF_SYNC_STEP_CAP`), one was picked and stated plainly in
the code and the spec's own header rather than left as a silent guess.

- **`app.jsx`**: `navyBodyFat`/`bodyMeasurementFormula`/`bodyFatRollingAvg`/`syncedBodyFat` (the
  asymmetric-cap fix from the debate's own success-criterion check, implemented exactly as
  specified — lowering applies uncapped, raising while cutting is capped); `body_measurements`
  local storage + Supabase sync/pull, mirroring `weighRollingAvg`/`weigh_ins` throughout; a new
  `MeasurementRow` component reused identically inside both `WeighInWidget` and `ProfileScreen`
  (the same form, not two implementations of it, per the spec's own requirement); the History
  toggle and chart; the required 💧-card copy change.
- **`setup/supabase-schema.sql`**: `body_measurements` table, RLS policy, index — the `formula`
  column closing finding 5 exactly as Engineering specified.
- **`__tests__/logic.test.js`**: 19 new tests, including the asymmetric-cap behaviour the debate
  found (a leaner reading applies in full while cutting; a fatter reading is capped) and the
  formula-filtering that closes the sex-change collision.
- **`e2e/body-measurements.spec.js`**: 10 new Playwright tests against the real running app —
  the hard-block validation, the male/female field sets, the sync-gate-gated Profile row, the
  History toggle, and the opt-out. One existing spec (`adaptive-guardrails.spec.js`) updated for
  the intentional 💧-card copy change, not a regression.
- Full regression: **Jest 323/323 · Playwright 88/88.**

**One thing confirmed, not assumed, during implementation**: the sync only recomputes on a save/
edit event (matching `runCalibration`'s own event-triggered design, not a reactive recompute on
every render/load) — verified directly in the browser, not just reasoned about. Data arriving any
other way (a multi-device Supabase pull) still gets the correct synced value, because it travels
on the `profiles.body_fat` column itself, written at the moment the *originating* device crossed
the sync gate — the same mechanism that already makes weight-sync safe across devices.

`personas/engineering.md` was used for the first time end-to-end, from review through to writing
the code it specified — its `bodyFatRollingAvg` sketch and table shape shipped close to verbatim.
