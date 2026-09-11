# Swarm review — TDEE raise-runaway bug report

**Date:** 2026-09-11. **Companion files:** `features/energy-safety/04-adaptive-tdee-guardrails.feature`
(the asymmetry this bug lives inside), `ENERGY_MODEL.md` §5 Step 2, `__tests__/logic.test.js`
(`runCalibration` mirror + its own acceptance test). This is a **bug investigation**, not a spec
review — there is no new feature file being graded — but it follows the same adversarial multi-
persona method this repo already uses for specs (see `features/dashboard/04-intake-scoring-swarm-
review.md`, `features/body/01-measurement-tracking-swarm-review.md`): independent blind reviews,
then a cross-response round where each persona actually argues with the others, then synthesis,
then an engineering fix proposal. Nothing here was fabricated or pre-summarised — this is the
personas' own words and their own arithmetic.

## The bug report (founder's own words)

> We prevented the persistent lowering of kcal when weight sticks [the auto-lowering fix,
> `features/energy-safety/04-adaptive-tdee-guardrails.feature`, ENERGY_MODEL.md §5.4]. Now I think
> we need to cap a sensible TDEE being ever increased. Today, after a few exercise logs over the
> days, my kcal target is 3113. I'm 29.1% body fat, 97.1kg, and active. I had some days where I
> dropped 1kg then another 0.5kg the next day — probably mostly water. Then I'd been adding my
> workouts. I really can't see a reality where I should be eating over 3k kcal at cut.

---

## Round 1 — QA-automation review (independent, cold start)

*(Reviewed as: senior QA/test-automation engineer, BDD/Gherkin. Persona loaded from
`personas/qa-automation.md`.)*

### Verdict

**Reproducible, and I can write a failing test today.** This isn't "maybe a bug somewhere in a
vague adaptive system" — it's a specific, mechanical gap between what the acceptance test in
`__tests__/logic.test.js` actually proves and what the founder's real usage pattern does to the
same function. The suite has exactly one test exercising `runCalibration` end-to-end over multiple
days, and it tests a scenario this bug report doesn't match.

### Citation spot-checks (all accurate against `app.jsx`)

- `MODES.cut.adj = -500` — `app.jsx:37`. ✓
- `ACTIVITY` multipliers 1.20/1.35/1.45/1.55 — `app.jsx:316-321`. `activityMult` — `app.jsx:323`.
  `bmrOf` — `app.jsx:324`. `seedTDEE` — `app.jsx:326`. ✓ all as cited in the brief.
- `SMOOTH_WEIGHTS = [0.5, 0.3, 0.2]` — `app.jsx:341`. `smoothWorkoutKcal` — `app.jsx:343-344`. ✓
- `calcTargets`: `kcal = tdee + MODES[mode].adj + totalWorkoutKcal` at `app.jsx:401-402`, where
  `tdee = seed + tdeeAdj` (`app.jsx:399,401`). Confirmed the floors below this (`bmrFloorApplied`,
  `deficitFloorApplied`, `safeMinApplied`, `app.jsx:403-414`) only ever pull `kcal` *down* — there
  is no ceiling anywhere in this function. So a too-high number cannot be a floor bug by
  construction; it has to be `tdee` or `totalWorkoutKcal` being too big.
- `runCalibration` — `app.jsx:684-744`. `CAL_MIN_WEIGHINS = 6` (`677`), confidence tiers
  low(<14)/medium(<28)/high(≥28) at `app.jsx:713`, step caps 100/150/200 at `app.jsx:679`,
  `ADJ_CAP = 600` at `app.jsx:682`. All match the brief exactly.
- The asymmetry comment block is at `app.jsx:718-736`; "**Raising is NEVER damped**" is the literal
  last line of that comment, `app.jsx:733`. This is a deliberate, named design decision — confirmed
  against `features/energy-safety/04-adaptive-tdee-guardrails.feature:161-165` ("Good news still
  arrives at full speed" / "no damping or refusal applies in this direction") and its Numbers
  Contract (`04:95-108`). Not an oversight; a founder-approved trade-off I need to argue with on
  its own terms, not just flag as "missing a cap."
- `onWeighIn` — `app.jsx:6422-6459`. Confirmed: calibration runs on **every** weigh-in
  (`await ss(...)` then unconditionally computes `base`, `inFlight`, calls `runCalibration` —
  `app.jsx:6441-6445`), not on a weekly cadence. `inFlight` dead-time compensation is computed at
  `app.jsx:6444` from `adjLog` entries dated within the last 7 days.
- `effectiveMode` — `app.jsx:6516-6518`. Confirmed it only diverges from the user's literal `mode`
  toggle when `customKcal != null`. `customKcal` defaults to `null` (`useState(null)`,
  `app.jsx:5970`) and is only ever set through the explicit custom-target UI
  (`onSetCustomKcal`/`saveCustomKcal`). **Unless the founder has typed a custom kcal number, "I'm
  on Cut" and `effectiveMode === "cut"` are the same fact** — this branch of the brief's hypothesis
  is very likely a dead end, verifiable in one query (`select mode, custom_kcal from settings`).

### The actual arithmetic — what I ran

I reproduced `weighRollingAvg` and `runCalibration` verbatim in a standalone Node script (not
committed anywhere — throwaway) and ran the founder's own numbers through it: 97.1kg, 29.1% body
fat → `bmrOf` = 1857 (`370 + 21.6×68.84`). Active tier seed = 2693, very-active seed = 2878.

I built a 16-day weigh-in series: ten ordinary days trending down ~0.1kg/day (98.0 → 97.1), then a
1.0kg drop and a 0.5kg drop on consecutive days (exactly what the founder described), then a slow
tail. Logged intake held at a flat, honest 2200 kcal/day throughout — not scaled to whatever the
target says, so this isolates the calibration engine's own reaction, not a feedback loop with
itself. Mode is `"cut"` every day.

Result, **active tier**:

| Day | weigh-in | result.adj | confidence | applied | tdeeAdj (running) |
|---|---|---|---|---|---|
| 11 | 96.1 (−1.0kg) | +100 | low | +100 | 100 |
| 12 | 95.6 (−0.5kg) | +100 | low | +100 | 200 |
| 13 | 95.5 | +100 | low | +100 | 300 |
| 14 | 95.4 | +150 | **medium** (14th weigh-in) | +150 | 450 |
| 15 | 95.3 | +150 | medium | +150 | **600 (ADJ_CAP)** |
| 16 | 95.2 | +150 (would be) | medium | 0 (capped) | 600, pinned |

**Five calibration runs, five days, pinned at the full +600 accumulated cap.** With the smoothed
workout bonus added on top of a now-600-inflated `tdeeAdj`, a cut target north of 3000 kcal is
squarely reachable — this matches the shape of the founder's report, not just the ballpark.

Compare this to the suite's own acceptance test, `__tests__/logic.test.js:1235-1264`
("closes a 500 kcal gap in ≤3 weeks and settles without overshooting the cap"): that test's own
docstring and `ENERGY_MODEL.md`'s changelog (`| 2026-08-07 | ... Simulation: 500 kcal gap closed by
day 19, no cap-pinning. |`) both describe this exact mechanism converging over **~3 weeks and never
touching the cap** for a real, stable gap. My scenario — fed two days of noisy, plausibly-non-
metabolic weight swing instead of a smooth synthetic trajectory — reaches the cap in **5 days**,
nearly 4x faster than the design's own stated worst case, and does the one thing
(`maxAdj < 600`) that test explicitly asserts shouldn't happen for a well-behaved input.

**This is the actual difference: the existing acceptance test only ever feeds the engine a smooth,
noise-free, monotonic weight trajectory (`weight += (intake - trueTDEE) / 7700` every single day,
`logic.test.js:1242`). It has never been fed a realistic, noisy human weigh-in series. Nobody has
written the test that matches how weight actually behaves.** I could write this as a Jest test
today — same shape as the existing acceptance test, just swap the deterministic weight formula for
the founder's own two-drop sequence, and assert `maxAdj` stays well under 600 within the first
5-10 days. It would fail against current `app.jsx`/`logic.test.js` code right now.

### Other coverage gaps found along the way

- `todayWorkoutKcal` (`app.jsx:6553`) sums **every** logged session for the day with no daily cap.
  Not part of `runCalibration`'s own bug, but it feeds the same visible symptom (an inflated
  target) and isn't tested for "what if I log three heavy sessions in one day" at all.
- No test anywhere exercises `runCalibration` being called **daily** against **overlapping**
  windows with genuinely noisy (non-monotonic) weight data. Every existing test either checks a
  single call in isolation or the one smooth 35-day convergence run.

### Bottom line

Reproducible, quantified, and a failing test is one afternoon's work. The open question I can't
settle from code alone is how much of the founder's actual 3113 is `tdeeAdj` versus
`smoothWorkoutKcal` — see the data request at the end of this file.

---

## Round 1 — Nutrition-Coach review (independent, blind to QA's report)

*(Reviewed as: nutritional scientist / physique coach, 25 years coaching. Persona loaded from
`personas/nutrition-coach.md`.)*

### Bottom line first

**No — 3113 kcal is not a defensible number to be showing this person on "Cut," and I want to be
precise about why, because the reflex answer ("he's a big active guy, maybe it's fine") is wrong
for reasons that matter.**

Let's do the maths for the two plausible readings of "active" — sex doesn't move this number at all
(Katch-McArdle here runs off body fat and weight only; sex only ever touches `SAFE_MIN` and protein
g/kg, neither of which is in play near 3000+ kcal):

- BMR (Katch-McArdle, `370 + 21.6 × LBM`): LBM = 97.1 × 0.709 = 68.84kg → **BMR = 1857**.
- Seed TDEE, "active" enum (×1.45) = **2693**. "Very active" enum (×1.55) = **2878**.
- A genuine Cut at −500 from either of those is **2193** or **2378**.

3113 sits **735-920 kcal above what this app's own Cut definition should be showing**, before I
even get to whether 2693-2878 is itself a fair maintenance estimate for him (it might be a little
generous — NEAT-only multipliers topping at 1.55 for "very active" is on the assertive end of the
literature range, but that's a pre-existing, separately-flagged design choice, not this bug).

**735-920 kcal is not a rounding difference. It is most of a second mode's worth of adjustment
stacked on top of Cut.** A Cut that quietly drifts to within a few hundred kcal of true maintenance
(or above it, depending which tier he's actually on) is not "a slightly less aggressive cut" — it
is **Maintain wearing a Cut label**, and the person using it has no way to see that from the
dashboard, because the app still says "CUT" and still colours the header cut-orange. That is a
trust failure as much as a numbers failure: the one thing a tracker owes a dieter is that the label
on the tin matches what's in the tin.

### Why this matters for THIS app specifically

This app's own stated purpose — repeated in memory, repeated in `ENERGY_MODEL.md`, repeated in the
`04` guardrails file's own header — is protecting the founder's hormonal health, which in his case
has meant protecting against **under**-eating on a cut. That workstream, correctly, treats a wrong
number that's too low as the dangerous direction and built a whole asymmetric refusal rule around
it. But "protect hormonal health" and "protect the integrity of a chosen deficit" are not the same
goal, and this bug is squarely a failure of the second one that the first rule was never built to
catch. A cut that silently stops being a cut:

- undermines whatever body-composition goal the deficit exists for, with no signal to the user that
  anything changed — he'd have keep losing confidence in his own tracking rather than getting an
  honest "you're not in a deficit right now" message;
- is *itself* a known adherence-and-trust failure mode I've seen plenty of times on the coaching
  floor with commercial trackers: a user who's caught the tool being wrong once starts either
  overriding it by hand every day (which defeats the entire point of an adaptive model) or ignoring
  it altogether and reverting to guesswork — both worse outcomes than the tool simply being
  conservative;
- and structurally, an app that can silently walk itself from "protecting you from too little" to
  "quietly handing you too much" is not asymmetrically safe, it's just safe in one direction and
  unguarded in the other. Both directions are a failure of the same promise.

I want to be fair to the design: the founder caught this himself, quickly, by looking at the number
and going "that can't be right." That's exactly what should happen and it's a point in the app's
favour that the number is visible and checkable rather than hidden behind a black box. But a
personal safety tool that depends on its one user noticing every time the model overshoots is not a
tool that's actually doing the noticing job — it's outsourcing it back to the person it exists to
help.

### On the mechanism itself (I haven't seen QA's citations, reasoning from `app.jsx` directly)

I read `runCalibration` cold. The "never lower while cutting" rule (the asymmetry) is genuinely
good, evidence-led design — I'd have recommended almost exactly that rule myself: a stall or gain
during an honest deficit has real, common, benign explanations (water retention from the stress of
a new restriction, glycogen and its bound water, a heavier bowel, sodium, even a bit of lean tissue
if he's newly training hard) and none of them mean "eat less." That's textbook, and it's the kind
of thing I've had to explain to a disappointed client a hundred times: **the scale on day 4 of a
new cut is one of the least trustworthy numbers in the whole sport.**

Here's the point that matters for THIS bug: that exact same physiological reality cuts both ways,
and the file's own comment block doesn't seem to have clocked it. A **sharp drop** in the first
couple of weeks of tightening up food is *at least as common* as a stall or a paradoxical gain, and
it is *at least as likely* to be water/glycogen rather than fat. The classic pattern coaches see
constantly: someone starts logging seriously, cuts a bit of sodium and processed food reflexively,
and drops 1-2kg in the first week that is almost entirely water and glycogen, not tissue. 1g of
glycogen holds roughly 3g of water; a modest glycogen depletion of a few hundred grams in someone's
first tightened-up week easily accounts for a 0.5-1.5kg "loss" with zero change in real energy
balance. The founder's own description — "probably mostly water" — is not a guess I'd second-guess;
it's the single most likely explanation for exactly that pattern, in exactly that timeframe.

If the file's own logic special-cased "don't trust a bad-looking scale trend early in a cut" (the
refusal rule), it needed to *also* special-case "don't trust a great-looking scale trend early in a
cut" for the identical physiological reason. It didn't. That's not a coding bug in the arithmetic —
the arithmetic is doing exactly what it was told — it's a **one-sided reading of the same evidence
quality problem** the asymmetry rule was built to solve on the other side.

### What I'd want checked before signing off on any fix

Whatever the engineer proposes, I want it reviewed for one thing specifically: does it accidentally
reintroduce friction on a *genuine* upward correction after a real, sustained gap (the exact case
"Good news should arrive as fast as the evidence does" was written to protect)? A fix that makes
every raise cautious forever would trade one bad failure mode for a different, opposite one — a
person who's genuinely under-fuelled staying under-fuelled for longer because the app is now
gun-shy about raising. That's not an acceptable trade for this app's own founding purpose either.

---

## Round 1 — Critical-Thinking review (independent, blind to both above)

*(Reviewed as: assumption/consistency auditor. Persona loaded from `personas/critical-thinking.md`.)*

### Verdict

The founder's hypothesis survives, but not intact — the actual failure is one layer deeper than "a
raise happened too fast," and I found a second, separate defect nobody asked about: **once wrongly
raised, there is no way back while cutting.** I also want to push back, gently, on the framing of
the founder's own closing line, because a critical read shouldn't wave through the complaint any
more than the design.

### Load-bearing claim under test

The whole asymmetry design rests on one sentence (`app.jsx:721-722`): *"Guessing too high costs
some progress; guessing low walks a dieter toward under-eating."* That sentence is the entire
justification for leaving the raise direction fully undamped. I went looking for the case where
"costs some progress" stops being a fair description of the cost.

**Finding 1 — the claim assumes each calibration run reflects independent new evidence. It doesn't,
by construction.** `runCalibration` is invoked on every weigh-in (`app.jsx:6422`, confirmed: no
weekly gate anywhere in `onWeighIn`), against a 7-point trailing rolling average
(`weighRollingAvg`, `n=7`, `app.jsx:657-661`). A single two-day weight swing doesn't produce one
data point that ages out — it sits inside the `recentAvg` window for up to 7 daily calls, then
inside the `olderAvg` window's shadow for a further 7. Each of those calls sees a *slightly
different* rolling average (because one old point drops off and the new one is still there) and so
each one can independently compute a fresh positive `errKcal` and apply a fresh full step. The
design's mental model — "the calibration re-checks the evidence periodically and each check is
either confirmed or not" — doesn't match what daily invocation over a sliding window actually does,
which is closer to "the same event gets re-graded on a delay, multiple times, before it's fully
out of the window." The `inFlight` dead-time term subtracts what was *already applied*, but it
doesn't detect "this is the same underlying event still resident in the window" versus "this is
new information" — it can only ever reduce the size of the re-triggered step, not recognise that a
new trigger has fired at all. That's the actual mechanical hole, and it's a gap between the design
comment's intent and what the code checks, not a bug in the arithmetic itself.

**Finding 2 — the asymmetry has exactly one damping axis (was I cutting?) and zero data-quality
axes, even though the code already has a place data quality lives.** The confidence tiers
(`low`/`medium`/`high` at `app.jsx:713`) exist *specifically* to scale caution against how much
data there is — but they scale on raw **count** of weigh-ins, with no requirement about how those
weigh-ins are **distributed in time** or **whether the underlying signal has settled**. Six weigh-
ins on six consecutive days inside one volatile week reads as identically "confident" as six
weigh-ins spread across six calm weeks. Worse: in my constructed scenario (and in QA's — we
converged on the same shape independently, see the cross-response round) the tier *upgrades* from
low(100) to medium(150) exactly mid-runaway, at the 14th weigh-in, which happens purely because a
daily logger crosses a count threshold while the disputed swing is still working through the
window — the cap gets **bigger** at precisely the moment more caution, not less, would be
warranted. Nothing about "confidence" here means "this reading is settled"; it only ever means
"there have been a lot of readings," and those are not the same claim.

**Finding 3 — a new contradiction the brief didn't ask me to look for. The "it's deferred, not
discarded" promise (`app.jsx:731`, and the feature file's own "A cut that ends lets the estimate
catch up" scenario, `04:183-190`) is stated for the *lowering* direction and has no mirror for the
raising direction.** Once a raise has been applied — rightly or wrongly — `tdeeAdj` sits at its new,
higher value. If later evidence suggests that value was wrong (the water rebounds, weight comes
back up, `actualChange` turns positive again), the correction needed is a **negative** adjustment.
But the refusal rule (`app.jsx:739`: `refused = rawAdj < 0 && wasCutting`) does not — cannot —
distinguish "new evidence of a genuinely lower burn" from "walking back last week's own mistaken
raise." Both are a negative `rawAdj` while cutting, and both get refused identically. **This means
an erroneous raise is sticky for the rest of the cut.** The only in-app ways out are switching to
Maintain (per the existing scenario) or manually overriding with a custom kcal target — i.e.
abandoning either the adaptive model or the cut itself. This is more severe than "the raise
happened too fast," because it means the fast-raise bug and the has-no-undo property compound: not
only can the estimate run away in five days, once it has, the app's own safety rule (built for a
completely different, legitimate reason) actively prevents it from correcting itself for as long as
the founder stays on Cut.

### Boundary check

`CAL_MIN_WEIGHINS = 6` and the 14/28 confidence thresholds are exact-count boundaries with no
stated behaviour for "6 weigh-ins, but they only span 3 calendar days" versus "6 weigh-ins spanning
6 weeks" — confirmed neither `runCalibration` nor `weighRollingAvg` reads anything about elapsed
calendar span, only array length and date-ordering for the windowing. This is the same gap as
Finding 2, restated as a boundary problem: the boundary is drawn on the wrong variable.

### Where I'd push back on the founder, not just the code

"I really can't see a reality where I should be eating over 3k kcal at cut" is the framing I'm
supposed to pressure-test, not just accept because it's the person who filed the bug. For a 97.1kg,
29.1%-body-fat, **very-active** man (seed 2878), a Cut ceiling of ~2878 − 500 + a genuinely large
single-day smoothed workout bonus (two heavy sessions can plausibly smooth to 600-700kcal, see QA's
worked numbers) lands at 2978-3078 **on a single hard-training day, with zero tdeeAdj involved at
all** — uncomfortably close to 3113 without any bug operating. I'm not saying that's what happened
here; the water-drop timeline the founder describes points straight at the calibration engine, and
QA's simulation reproduces the reported number's *shape* using exactly that mechanism. But the
claim "3k+ is never right at Cut for this body" is not quite true either — it's right that
**3113, sustained across days, not tied to one big session,** doesn't fit a clean Cut. The
founder's instinct is correct in substance; the stated boundary ("over 3k") is slightly tighter than
the arithmetic actually supports for this specific body at the top activity tier. Worth saying
plainly rather than nodding it through.

### Fine

- The core `−500` Cut adjustment, the deficit floor, and `SAFE_MIN` are all still doing exactly
  what they're supposed to — I tried to find a floor-side explanation for a too-high number and
  confirmed, independently of QA, that none of them can ever push a number up. Not this bug's
  location.
- `effectiveMode`'s `customKcal` branch: I traced every call site and agree this is very unlikely to
  be silently misreading Cut as something else, absent a stored `custom_kcal`.

---

## Round 2 — Cross-response

### QA responds

**Where they caught something I missed:** Critical Thinker's Finding 3 (the sticky raise) is a real
miss on my part — I was scoped to "can I write a failing test for the runaway speed" and stopped
there. I hadn't asked "and then what happens the day after it's wrong," which is exactly the kind
of second-occurrence question my own persona file tells me to ask and I didn't apply it here. This
changes what the failing test needs to assert: not just "adj shouldn't reach 600 in 5 days" but
"once wrongly raised, a subsequent stall/rebound while still cutting should be able to claw at least
some of it back" — and today it categorically cannot, which is testable and currently unguarded by
any test in the suite. I'm adding this as a second failing test, not folding it into the first —
they're different assertions about different code paths (the raise path vs. the refusal path).

**Where I disagree, mildly:** Critical Thinker's pushback on the founder's "over 3k" framing is fair
as stated, but I'd flag that it doesn't change the actual bug finding — even under the most
generous reading (very-active, a genuinely huge training day), the founder describes this
persisting "after a few exercise logs over the days," not as a one-day spike tied to one huge
session. My simulation held workout kcal at zero and reached the reported ballpark from `tdeeAdj`
alone. Both mechanisms are plausible contributors; neither reviewer has data to rule the other out,
which is exactly why the SQL request at the end of this file still matters regardless of this
exchange.

**Severity re-rank:** Coach's framing (Cut silently becoming Maintain, a trust failure as much as a
numbers failure) and Critical Thinker's Finding 3 (sticky raise) both outrank my own original
finding (runaway speed). Speed-of-runaway is the "how did we get here"; sticky-raise is the "why it
doesn't just fix itself," and that's the more damning property for a health-safety tool — a
transient bug that self-heals in a week is a much smaller deal than one that requires the user to
notice and manually intervene, which is exactly the failure mode Coach independently named from a
completely different angle (adherence/trust) without having read Critical Thinker's report.

### Nutrition-Coach responds

**Where they caught something I missed:** Critical Thinker's Findings 1 and 2 (overlapping windows,
count-based confidence conflating quantity with stability) are a sharper, more precise version of
what I was gesturing at with "the file didn't clock that a sharp early drop is exactly as suspect as
a stall." I described the *physiology* of why the raise shouldn't be trusted early; Critical Thinker
found the exact *mechanical* reason the code has no way to express that distrust even if it wanted
to. Genuinely complementary, not overlapping — I'd cite both together if I were writing this up for
the founder myself.

**Where I want to add, not just agree:** the "confidence" mislabelling (Critical Thinker's Finding
2) has a coaching-floor parallel I want to name explicitly, because it's the exact mistake I've made
myself and corrected for: early in working with a new client, I used to treat "they've weighed in
every day for two weeks" as itself a sign I could trust the trend more. I was wrong, repeatedly,
specifically in the first two-to-three weeks of a new plan, which is exactly when water/glycogen
noise is loudest *and* when someone is most likely to be diligently weighing in daily out of new
enthusiasm. Frequency of measurement and trustworthiness of the trend are not the same axis, and
conflating them is a mistake I had to unlearn with real clients before I unlearned it in principle.
The code's `confidence` variable is making exactly that conflation, in exactly that window (6-14
weigh-ins is almost definitionally "the first couple of weeks of a new phase" for most real users).
I would flag this as a real, evidence-backed finding, not just a plausible-sounding argument.

**Where I push back, lightly:** on Critical Thinker's challenge to the founder's "over 3k" framing —
correct as arithmetic, but I'd caution against giving it much weight in the fix discussion. A Cut
target that occasionally, briefly touches ~3000 on a single legitimately brutal training day for a
97kg very-active man is a completely different *user experience* from a Cut target that sits at
3113 for several consecutive days with the CUT label still showing. The founder's complaint is
about the latter, sustained pattern — his instinct is right about the thing he's actually
experiencing, even if the literal number "3000" isn't a hard physiological line. I don't want the
engineering fix anchored to "keep it under X kcal" as a number — that reintroduces exactly the kind
of flat, body-blind threshold this app's own `SAFE_MIN` discussion already flagged as the wrong
shape of fix (see `project_safe_min_shelved.md` in memory — a flat ceiling has the identical defect
as a flat floor, just facing the other way).

### Critical-Thinking responds

**Where they caught something I missed:** QA's worked arithmetic (five days to +600, using the
founder's actual body stats, cross-checked against the suite's own acceptance test's ~19-day
smooth-case number) is exactly the concrete counter-example my own method calls for and I didn't
produce one with real numbers — I reasoned about the mechanism in the abstract and trusted that it
would compound "fast," without ever running it. That's a real gap against my own persona's rule #2
("construct a concrete, realistic situation"). Their number is the proof; my mechanism is the
explanation for why the proof comes out the way it does. Genuine independent convergence on the
same underlying defect from two different methods (simulation vs. structural reading), which is
the strongest kind of finding this process produces.

**Responding to Coach's physiology point:** this is the missing argument my own Finding 2 needed
and didn't have — I asserted "a sharp early loss has innocent explanations" as a general claim; the
practitioner backing (glycogen-water binding ratio, the "week one of any new tracking habit" pattern
being the *common* case rather than an edge case) is exactly the kind of evidence-forward grounding
that turns my structural objection into a case with real physiological weight behind it, which
matters because a reviewer could otherwise dismiss Finding 2 as "well, maybe fast confirmation of a
real signal is fine actually." Coach's answer is: no, specifically in this window, it usually isn't
fat. That closes the gap in my own argument.

**Standing my ground on one point:** Coach's caution against anchoring a fix to "keep it under X
kcal" is right, and I'd already implicitly avoided that in my own findings — none of Findings 1-3
propose a ceiling; they all propose evidence-quality gates (spacing, distinctness, reversibility),
which is the structurally correct answer to "the same flat-ceiling mistake as SAFE_MIN" Coach is
warning against. Worth saying explicitly so the engineer doesn't accidentally reach for a kcal cap
as the easy fix: that would repeat a mistake this project has already identified and rejected once
in the opposite direction.

**Does this shift my severity ranking?** Yes, in the same direction QA moved: I'd now rank the
sticky-raise property (Finding 3) as the headline finding, runaway speed (QA's original) as the
mechanism that gets you there, and the confidence-tier mislabelling (Finding 2) as the reason the
mechanism is worse than "a temporary blip" — three findings that chain into one causal story rather
than three competing severities.

---

## Synthesis

All three personas, working independently and then arguing with each other, converged on the same
underlying defect described from three angles (mechanical, physiological, logical), plus surfaced
one finding (the sticky raise) that none of the three set out looking for and that changes the
severity picture once found. What's confirmed versus still open:

### Confirmed

1. **The founder's core suspicion is correct and reproducible.** `runCalibration`'s raise path
   (`app.jsx:684-744`), invoked on every weigh-in (`app.jsx:6422-6459`) against overlapping 7-day
   rolling windows, with zero damping in the raise direction (`app.jsx:733`) and zero data-
   freshness/stability requirement independent of raw weigh-in count, can carry a short (1-3 day),
   plausibly non-metabolic weight swing to the full `ADJ_CAP` (+600, `app.jsx:682`) in as few as
   five daily weigh-ins — this is a worked, code-accurate simulation result using the founder's own
   body stats, not a theoretical concern. This is roughly 4x faster than the ~19-day/~3-week
   convergence the design's own acceptance test (`logic.test.js:1235-1264`) and
   `ENERGY_MODEL.md`'s changelog describe as the expected, well-behaved case — because that test
   has only ever been fed a smooth, noise-free weight trajectory, never a realistic noisy one.
2. **A second, independently-severe defect: an erroneous raise is sticky for the rest of a cut.**
   The refusal rule that protects against wrongful *lowering* while cutting (`app.jsx:739`) cannot
   distinguish "new evidence of a lower burn" from "reversing my own recent mistaken raise" — both
   are a negative step while cutting, both get refused. There is no in-cut mechanism to walk back a
   bad raise; only switching to Maintain or manually overriding with a custom kcal target gets it
   back down.
3. **The "confidence" tiers conflate data quantity with data stability.** Six-to-fourteen
   weigh-ins reads as "low confidence" regardless of whether they span three volatile days or three
   calm weeks, and the tier can upgrade (raising the step cap) mid-runaway purely because a daily
   logger crosses a count threshold — the cap gets bigger exactly when more caution is warranted,
   not less.
4. **The asymmetry's own justification ("guessing too high costs some progress") is one-sided
   physiologically as well as mechanically.** A sharp early drop has the same class of innocent,
   non-metabolic explanations (water, glycogen) as the stall/gain case the asymmetry rule already
   protects against — the design reasoned about the "not cutting" evidence-quality problem and
   didn't apply the same reasoning to "is this raise evidence fresh/settled," even though both are
   instances of the identical underlying question: is this scale movement telling us anything real
   yet?
5. **Ruled out:** `effectiveMode`/`customKcal` silently reading as something other than the
   founder's stated mode (verifiable, and very unlikely absent a stored `custom_kcal`); any of the
   floors (`bmrFloorApplied`/`deficitFloorApplied`/`safeMinApplied`) explaining a too-high number
   (structurally impossible — they only ever pull down).

### Genuinely still open (not resolved by static analysis or arithmetic alone)

- **How much of the founder's actual 3113 is `tdeeAdj` versus `smoothWorkoutKcal`.** Coach and
  Critical Thinker both showed that a genuinely large smoothed workout bonus (two heavy sessions
  smoothing to 600-700+ kcal) can, on its own or in combination with a partial (not maxed) raise,
  also reach this ballpark — the arithmetic doesn't uniquely pin the cause on the calibration
  engine alone. This matters for the fix: if the workout-kcal side is doing most of the work, a
  calibration-only fix won't fully solve the founder's complaint.
- **Whether the MET-based session-kcal estimate (`estimateSessionKcal`, "heavy" MET values 7.0-10.0)
  is independently too generous, and whether the lack of any daily cap on logged workout kcal is
  its own bug.** Flagged by QA and acknowledged by Coach as real and related, but explicitly agreed
  by all three as a **separate, pre-existing concern** from this bug — worth its own follow-up, not
  folded into this fix.
- **The exact real-world timeline** (how many weigh-ins actually exist, their real dates/values,
  whether calibration was even eligible to have run given `CAL_MIN_WEIGHINS = 6`, what `tdeeAdj` is
  right now, and what mode/`custom_kcal` are actually stored) — none of this is knowable from code,
  and is needed before any fix's exact shape (e.g. how many "distinct days" a freshness gate should
  require) can be sized against real behaviour rather than a hypothetical.

---

## Round 3 — Engineering fix proposal

*(Reviewed as: senior engineer, implementation & data-integrity reviewer. Persona loaded from
`personas/engineering.md`. Proposal only — no files edited.)*

### The bugs, precisely located

**Bug 1 — undamped raise + daily invocation + overlapping windows = fast, noise-driven compounding.**
`app.jsx:684-744` (`runCalibration`), specifically the raise branch that reaches `app.jsx:733`'s
"never damped" with no counterpart to the cutting-aware refusal at `app.jsx:739`. Triggered every
time from `app.jsx:6422-6459` (`onWeighIn`), which has no cadence gate beyond "a new weigh-in
arrived." Root cause is not the step cap itself (`CAL_STEP_CAP`, `app.jsx:679`) — it's that
`CAL_MIN_WEIGHINS` (`app.jsx:677`) and the confidence tiers (`app.jsx:713`) gate on **count**, and
nothing anywhere gates on **how many of the weigh-ins feeding the current calculation are the same
ones that already justified the last applied step**.

**Bug 2 — the cutting-aware refusal (`app.jsx:739`, `refused = rawAdj < 0 && wasCutting`) has no way
to distinguish "new lowering evidence" from "reversing my own recent raise."** This makes any
erroneous raise permanent for the remainder of a cut. This is a straightforward reuse of an existing
rule for a case it wasn't designed for — the rule is correct for what it was built to do (file 04's
actual, decided scope) and incorrect as the *only* gate standing between a bad raise and it being
permanent.

### Proposed fixes (not implemented — this is a health-safety-relevant calculation; needs the
founder's own sign-off first, matching this repo's "specs before code" culture)

**Fix A — evidence-freshness gate on raises specifically, reusing `adjLog` (already exists,
`app.jsx:6452`, already local-only convergence bookkeeping — no new storage needed).** Before
crediting a positive `rawAdj`, check what fraction of the weigh-ins inside the current `recentAvg`
window are the *same* weigh-ins (by date) that were present when the *last applied raise* fired.
If the overlap is high (e.g. the window has fewer than K new, distinct dates since the last applied
raise), refuse or heavily discount the new step — the same underlying event is still working
through the window and hasn't earned a second full credit. This directly targets Bug 1's actual
mechanism (re-triggering off a still-resident swing) rather than just slowing the raise path
uniformly, so it does **not** touch the case the founder explicitly wants kept fast: a raise
supported by weigh-ins the previous raise never saw sails through unchanged.

**Fix B — let a raise's own recent contribution be reversible while cutting, without reopening
genuine-lowering protection.** Track (in the same `adjLog` shape already being written) which
portion of the current `tdeeAdj` came from raises applied in, say, the last 14-21 days. Allow a
negative `rawAdj` while cutting to walk back **only that recent, still-provisional portion** — never
below the level the estimate held before the most recent raise — while continuing to refuse any
lowering that would cut into an adjustment older than that window (which is exactly the case
04's asymmetry rule already correctly protects). This fixes Bug 2 without weakening the original,
founder-approved asymmetry for genuinely-settled evidence.

**Fix C — cheapest, weakest, name it honestly as a stopgap only.** Halve `CAL_STEP_CAP` for the
raise direction specifically at `confidence === "low"` (the tier both the founder's real usage and
every simulation in this review land inside). This is a one-constant change and would roughly
double the days-to-cap in my simulation (5 days → ~10) — it doesn't fix the underlying mismatch
between "daily invocation" and "the evidence should be independent," so a slightly more sustained
noisy week still runs away, just more slowly. I'd only recommend this as a same-day mitigation
while A and B get their own spec pass, not as the actual fix.

### Trade-off, stated honestly

The founder's own decided design goal for this exact function — "good news should arrive as fast as
the evidence does," `04:73-74` — and the new complaint ("this arrived too fast, on bad evidence")
are **not actually in tension**, once the fix targets the right variable. The tension only appears
if the fix is "make raising slower," which *would* trade against real, fast, genuine upward
corrections — the case 04 was explicitly built to protect. Fix A targets **evidence distinctness**,
not **speed** — a raise backed by evidence a prior raise never saw is unaffected; only a raise
re-litigating the same handful of days gets caught. That is the honest resolution of the apparent
conflict between the two workstreams, not a compromise between them.

What Fix A and B do cost, plainly: more state to reason about (which weigh-in dates "count" as
already-spent evidence per applied raise; which portion of `tdeeAdj` is "recent" for reversal
purposes), and both need their own Gherkin scenarios and Jest coverage before they're buildable with
any confidence — this review is not that spec. Given this function sits directly upstream of what a
real person cutting calories is told to eat, I would not want to ship either fix from this
transcript alone; it needs the same treatment `04` itself got (a dedicated feature file, a founder
decision on the exact freshness/reversal thresholds, then implementation against that file).

### Recommendation

Smallest correct combination: **A + B**, because they reuse the existing `adjLog`/`inFlight`
machinery (no new subsystem, consistent with "reuse before you invent") and each fixes one of the
two confirmed bugs without touching the other, already-correct half of the asymmetry rule. **C**
alone is not a real fix and shouldn't be mistaken for one, even though it's the cheapest thing to
ship today.

---

## Outcome

Bug confirmed and quantified, not just suspected: two compounding defects in `runCalibration`
(`app.jsx:684-744`) and its refusal rule (`app.jsx:739`) — a fast, noise-driven raise-runaway
(reaches `ADJ_CAP` in ~5 days against a realistic noisy weigh-in pattern, vs. ~19 days/no-cap-
pinning for the smooth case the existing acceptance test actually covers), and a sticky-raise defect
where the cutting-aware refusal, built for a different and still-correct purpose, incidentally
blocks ever correcting a bad raise while cutting. Two concrete fixes proposed (evidence-freshness
gating on raises; bounded reversibility of a raise's own recent contribution), explicitly not
implemented, pending founder sign-off and their own spec file. One separate, related-but-distinct
concern flagged for its own follow-up (uncapped, possibly-generous per-day workout kcal feeding the
same visible symptom). One piece of the puzzle — how much of the reported 3113 is calibration vs.
workout-kcal — remains genuinely unknown without real data.

### Data needed before a fix's exact thresholds can be sized with confidence

Everything above is confirmed by static analysis and worked arithmetic on the founder's stated
stats; the one thing none of it can settle is what actually happened on the founder's own account.
Copy-paste these into the Supabase SQL Editor (n=1 app, no user-id filtering needed — there's only
ever one row per table that matters):

```sql
select * from settings;
select date, weight from weigh_ins order by date desc limit 14;
select date, type, intensity, duration, kcal from workouts order by date desc limit 10;
select weight, height, body_fat, sex, activity from profiles;
```

`tdee_adj_log` (the per-run adjustment history that would show exactly which days applied how much,
and confirm or refute the compounding pattern this review predicts) is **local-only** — it never
syncs to Supabase. To check it, run this in the browser console on the real app (not the test
harness):

```js
JSON.parse(localStorage.getItem("tdee_adj_log"))
```
