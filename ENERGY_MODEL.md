# Fuel Log — Energy-Model Design & Build Plan

**Purpose:** Fix the root cause behind the energy-safety workstream: the app estimates TDEE too low (no lifestyle/NEAT term), so any physiological safety floor bolted on top misreads the under-count as "you're starving." This doc is the **single source of truth** for the target-energy model and the ordered plan to close the gap between what a real person expects and what the app can currently deliver.
**Date:** 2026-08-07
**Start here:** `START-HERE.md` (one-screen "where are we"), then this for the energy-model detail.
**Companion docs:** `features/energy-safety/*.feature` (the five `@draft` specs this plan re-sequences), `DOCS.md` (product behaviour + changelog), `SECURITY_ROADMAP.md` / `LEGAL_ROADMAP.md` (unrelated phases).
**Decided:** 2026-08-07, in a coach + launch-consultant + design-lead review. Model locked to **seed → calibrate** (see §3).

> **Division of labour:** this doc owns the **energy/target model and the ordering of the energy-safety
> features**. The individual `.feature` files own their scenario detail; `__tests__/logic.test.js` owns the
> exact arithmetic (the NUMBERS CONTRACT). Where they overlap, they point here for *why* and *when*.

---

## 0. TL;DR

- The app models everyone as **sedentary (TDEE = BMR × 1.2)** and only adds **logged workouts** on top. It captures **no NEAT** (non-exercise activity — walking, standing, job, steps), the single most variable term in human expenditure (300–800+ kcal/day between similar bodies). So it **systematically under-estimates TDEE for anyone who isn't truly desk-bound.**
- The **energy-availability (EA) floor** (file 01: hard 30 / target 45 kcal/kg FFM) is good science aimed at the **wrong layer**. Layered on an under-counted TDEE it fires on *everyone*: maintenance reads ≈ EA 32 (permanent amber "Low fuel"), and a "Cut" gets floored to a **~160 kcal deficit — not a cut.**
- **Fix the model first, then the floor.** Locked design: **seed → calibrate** — ask one coarse activity question for a believable day-one target, then let a strengthened adaptive TDEE become the source of truth. NEAT-only multiplier; keep "earn to eat" for logged training but **smoothed across days**.
- **Re-sequenced build:** activity input → stronger adaptive TDEE → smoothed earn-to-eat → energy floor (01) → sustainability (02/03/04) → LEA symptom check (05).
- **⚠️ Updated 2026-08-07 — §§1–3 below record the state of thinking *before* Step 4 was built, where the plan was still to make EA-30 a hard floor once TDEE was corrected. It isn't.** Correcting TDEE helped active users only; a sedentary user's EA-30 floor still lands at ~93% of maintenance. The shipped design is a **rate-of-loss floor** that clamps and an **EA warning** that never touches a number. **§5.1 is the authoritative account** — read it before §3 item 4.

---

## 1. Why the current model breaks

Today's target maths (`calcTargets`, [app.jsx:308](app.jsx#L308)):

```
FFM  = weight × (1 − bodyFat/100)                 // fat-free mass (Katch-McArdle input)
BMR  = 370 + 21.6 × FFM
TDEE = BMR × 1.2                                    // FLAT sedentary — the problem
kcal = TDEE + modeAdj(cut −500 / maintain 0 / bulk +500) + loggedWorkoutKcal
       + adaptive tdeeAdj (clamped ±150, needs ≥8 weigh-ins)
```

Two structural faults:

| # | Fault | Consequence |
|---|---|---|
| M1 | **Activity is event-based only** — a flat ×1.2 baseline plus logged workouts. **NEAT is never counted.** | Maintenance is under-estimated by ~300–800 kcal for active/on-feet users. The gym audience (the whole target market) sees targets that look obviously low. |
| M2 | **Adaptive TDEE can't rescue it** — clamped **±150** ([app.jsx:392](app.jsx#L392)), needs **≥8 weigh-ins** to start ([app.jsx:366](app.jsx#L366)). | The one mechanism that could learn the true TDEE is too small (±150 can't close a 500 gap) and too slow. |

### 1.1 The collision that stopped file 01

> This diagnosis still stands — it is *why* EA-30 could never be the floor. What changed at the Step 4
> build is the conclusion drawn from it: correcting TDEE doesn't rescue the EA floor, because the
> collision persists for every sedentary user. See **§5.1**.

Target energy availability = (target intake − training) ÷ FFM. Because the app *adds* logged workouts to the target and EA *subtracts* them, **the workout term cancels** and:

```
EA_target = (TDEE + modeAdj) / FFM = (BMR×1.2 + modeAdj) / FFM
```

For a sedentary baseline that lands ≈ **25.9 + 444/FFM ≈ 30–33** at maintenance — *already* at/near the EA-30 hard floor before any cut. Worked on the harm-report profile (98.5 kg / 30% BF, FFM ≈ 69):

| Mode | Target maths | EA of target | Result |
|---|---|---|---|
| Maintain | 2231 | 2231 ÷ 69 ≈ **32.4** | Amber "Low fuel" — at *maintenance* |
| Cut (−500) | wants 1731, EA floor raises to **2070** | 30.0 | Deficit collapses **500 → ~160** |

And it's not an edge case — algebra says a sedentary −500 cut lands below EA 30 for **every** body, so the EA floor would cap **all** cuts to ~150–180 kcal and paint **most** maintainers amber. That is the churn/harm outcome that halted the build.

---

## 2. Expected behaviour vs. current capability — the gap

| A real person expects… | Today the app can… | Gap |
|---|---|---|
| A target that fits how active I actually am | Assume sedentary + count only logged workouts | **No NEAT/lifestyle model** → under-counts TDEE |
| "Cut" to lose fat at a sane rate (~0.5–1%/wk) | Nominal −500, but EA floor caps to ~−160 on the low base | **Cut is fake** once the floor lands on a low TDEE |
| Warnings only when I'm genuinely under-fuelling | Fire "Low fuel" at maintenance for nearly everyone | **Warning constant & false** → noise + harm framing |
| To get more accurate the more I log | Adaptive TDEE clamped ±150, needs 8 weigh-ins, slow | **Too weak/slow** to close a 300–800 kcal gap |
| To not be allowed to starve myself | Flat `SAFE_MIN` 1400/1200, ignores body size | Right instinct, **wrong mechanism** — ✅ **closed at Step 4** by the body-sized steady-loss floor (not by the EA floor this row originally credited; §5.1) |

---

## 3. The locked model — "seed → calibrate"

> **Decision (2026-08-07):** start every user on a believable estimate from a coarse activity input,
> then let a strengthened adaptive TDEE become the **source of truth** and correct the seed within a
> couple of weeks. Belt and suspenders — because self-reported activity is unreliable *and* a brand-new
> user has no data yet.

1. **Seed TDEE from a coarse activity input.** One 4-option lifestyle question → a **NEAT-only** multiplier on Katch-McArdle BMR, *replacing* the flat ×1.2. Asked at onboarding, editable in Profile, framed honestly as *"a starting point — we fine-tune this automatically as you log."*
2. **Keep event-based "earn to eat" for logged training — but smoothed across days**, not a same-day unlock (kills compensatory "burn-to-eat" patterns; handles rest-day clusters). See [[project_workout_smoothing_idea]].
3. **Adaptive TDEE is the truth.** Widen the ±150 clamp into a **rate-limited convergence** (can move far over weeks, never lurch per update), engage sooner, and show an honest "still learning" confidence state.
4. ~~**EA floor (file 01) sits on the corrected TDEE** — hard *cut boundary* at EA 30, green at 45, `SAFE_MIN` retained only as the body-fat-unset backstop.~~ **SUPERSEDED at the Step 4 build (2026-08-07):** correcting TDEE was not enough to make EA-30 usable as a floor — see **§5.1**. What shipped: a **steady-loss floor** (75% of believable maintenance) clamps; **EA-30 warns only**, for lean bodies on training days; EA-45 dropped; `SAFE_MIN` kept as the absolute backstop *and* the body-fat-unset fallback.

### 3.1 Multiplier values — NEAT-only, proposed (coach-owned, to verify)

Standard activity factors (1.2–1.725) are meant to be **whole-day incl. exercise**. Because we keep workouts as a separate add-on, the lifestyle multiplier must be **NEAT-only** and therefore *lower*, or training double-counts:

| Chip | Who | NEAT multiplier |
|---|---|---|
| Sedentary | Desk job, < ~5k steps | 1.20 |
| Lightly active | Some walking, ~5–8k steps | 1.35 |
| Active | On feet often, ~8–12k steps | 1.45 |
| Very active | Manual job / ~12k+ steps | 1.55 |

> ✅ **LOCKED 2026-08-07 — believability gate passed** (see §4). Values live in `app.jsx` `ACTIVITY` +
> mirrored in `logic.test.js`. Sedentary stays **1.20** (== the old flat baseline, so unset/desk users
> and the BMR×1.2 maintenance floor are unchanged). The top end was **widened from the proposed 1.45 to
> 1.55**: the gate's manual-worker persona came out ~13% below MyFitnessPal at 1.45 (and has no logged
> workouts to add back), which would under-fuel exactly the person we're trying to protect. Still below
> the textbook whole-day 1.725 because formal training is added separately.
>
> **Gate results (day-one seed, male; Fuel Log Katch-McArdle vs MFP Mifflin × textbook factor):**
> sedentary office worker **2102 vs 2091 (+0.5%)** · active lifter **2720 vs 2790 (−2.5%)** · on-feet
> manual worker **2793 vs 3017 (−7.4%)**. All within ~7.5% → plausible. Reproduce: the node snippet in
> the session that shipped Step 1.

---

## 4. Design principles & guardrails (bind every step)

- **Rare + true.** A warning that fires constantly is wallpaper. Every calorie-facing warning must be uncommon and genuinely earned, or it loses force *and* becomes noise.
- **Safeguarding first (ED vector).** A persistent "you're not eating enough" banner is not neutral on a calorie tracker. Supportive, factual copy; never alarmist, never celebrating a low number, never shaming. Symptom-level concerns always route to *"see a healthcare professional"* (file 05).
- **Believability gate (launch).** Before any step ships, the day-one seeded target for **three canonical personas — sedentary office worker · active lifter · on-feet manual worker** — must look plausible next to MyFitnessPal for the same inputs. If it doesn't, the multipliers are wrong; fix before ship.
- **Minimise taps.** One activity question, four chips (not a slider — sliders imply false precision). Never gate the primary log/save action behind it.
- **Numbers are estimates, named as such.** No fabricated science. Anchors: EA 30/45 (IOC RED-S consensus, already cited in file 01), activity factors (standard Mifflin/Harris-Benedict ranges), 0.5–1%/wk loss-rate ceiling.

---

## 5. The multistep plan

| Step | What | Owner(s) | Acceptance |
|---|---|---|---|
| **0** | **Lock the model** — seed→calibrate, NEAT-only + smoothed earn-to-eat. | coach + consultant | ✅ done 2026-08-07 (this doc). |
| **1** | ✅ **DONE 2026-08-07 — Activity input + seeded multiplier.** Flat ×1.2 replaced with a 4-chip NEAT multiplier (`ACTIVITY` in `app.jsx`); Profile selector (= onboarding surface) with "we auto-tune" framing; seed feeds `calcTargets`, calibration base, effective-TDEE display; floor stays sedentary. Activity is **local-only** for now (survives sync pulls; no `profiles` column yet). sw v57, Jest 108. | design (input UX), coach (values), QA (scenarios) | ✅ Believability gate passed (§3.1); Jest green. |
| **2** | ✅ **DONE 2026-08-07 — Strengthen adaptive TDEE.** Flat ±150 integrator → **dead-time-compensated, confidence-scaled** convergence (gain 0.8; per-run cap 100/150/200 by tier; engages at **6** weigh-ins, was 8). Root fix: the old loop slammed to the ±600 cap and pinned there ~10 days (lag overshoot); subtracting the in-flight adjustment kills it. **Plus weigh-in engagement (file 06):** invite (not "log daily"), progress cue, cadence picker, one gentle 7-day nudge with mute — because calibrate needs weigh-ins the seed no longer *requires*. sw v58, Jest 117. | coach + eng + design + QA | ✅ Simulation closes a 500 kcal gap by day 19 (≤3 wk), never pins the cap, max step 100; nudge/cadence unit-tested. |
| **3** | ✅ **DONE 2026-08-07 — Smooth earn-to-eat.** A session's kcal are spread FORWARD across a 3-day window as an energy-conserving weighted average (`SMOOTH_WEIGHTS = [0.5, 0.3, 0.2]` over today/−1d/−2d, Σ=1 — total training energy unchanged, just un-spiked). Same-day bonus halved; a rest day after training still carries fuel; back-to-back days average instead of stacking. Prior-2-days workout kcal loaded from `workouts__<date>` into `priorWorkoutKcal` state; `smoothedBonus` replaces the raw same-day total into `calcTargets`. Workout-card copy reworked ("kcal burned" + "+X added to today, the rest fuels the next couple of days"). New `07-smoothed-earn-to-eat.feature` (@draft). sw v59, Jest 125. | coach (maths) + design | ✅ No same-day full unlock; rest-day fuel sane; back-to-back averaged; 8 unit tests green. |
| **4** | ✅ **DONE 2026-08-07 — Energy floor, re-seated as TWO protections.** The draft's single EA-30 clamp did not survive its own numbers (see §5.1), so it was split: (a) **steady-loss floor** — the hard clamp, all users: a preset target never sits more than `MAX_DEFICIT_FRAC` (0.25) below believable maintenance + the applied training bonus, so it scales with body size and eases rather than blocks; (b) **low-fuel warning** — energy availability `(target − raw burn) ÷ FFM`, **warning only**, shown for a lean body (`LEAN_BF` 15% M / 23% F) on a day it trained when EA < 30. `EA_OK = 45` **dropped** (unreachable by construction). `SAFE_MIN` survives as the absolute backstop + body-fat-unset fallback. Custom targets are warned about, never overridden. sw v60, Jest 142. | coach (numbers), design (copy/UX), QA | ✅ A 98.5 kg cut keeps its full 500 kcal deficit; a 60 kg cut is eased; low-fuel fires only for lean + trained + genuinely low. |
| **5** | **Sustainability system** — cut-cycling (02), diet break (03), **the auto-lowering fix** (file 04's unbuilt half: don't cut the target when weight rises during a deficit; the BMR×1.2 maintain floor half is already live). Meaningful only once a cut is a real deficit. **02 ✅ BUILT 2026-08-07** (see §5.2): a cut is measured as **cut load** — days weighted by deficit depth (`dayLoad = deficitFrac / REFERENCE_DEFICIT`), *not* a flat day count and *not* read from food logs. Thresholds 56 / 84 load-days (lean 42 / 56), so a 10% cut reaches the prompt at ~24 real weeks and a 25% cut at ~9.5. Cards show **real elapsed weeks**. 4 new `profiles` columns run (loads `NUMERIC`); `activity` now syncs too. Jest 172, sw v61. **03 ✅ BUILT 2026-08-09** (see §5.3): a break is simply **not cutting**, and the same load becomes a bar that fills while cutting and **drains** while not — `DIET_BREAK_DAYS` (14) rest days clear any block, 7 clear half, a partial break keeps its dent. Adds the **stall check** (a flat scale for `STALL_WEEKS`) and **removes the rolling-year track**. One new column, `cut_break_load`. Jest 199, sw v62. **The auto-lowering fix (04's second half) is the remaining unbuilt piece of this step.** | coach + QA | 02 ✅ 30 unit tests green; 03 ✅ 27 more; 04 spec pending. |
| **6** | **LEA symptom check (file 05).** Sex-neutral → *"see a healthcare professional."* **Trigger decided 2026-08-07** (spec'd, not built): `LEA_WEEKS_TO_PROMPT` (3) consecutive weeks whose *average* logged intake sits at or below the steady-loss floor, counting only weeks with ≥ `LEA_MIN_LOGGED_DAYS` (4) logged days — unlogged days excluded, never zero-filled — then a 14-day cooldown after "Not now". Explicitly **not** driven by the low-fuel note (lean-body/training-day only, so it would miss the founder's own harm case) and **not** by time spent cutting (that's 02/03). | coach + design | Per-spec; no diagnosis. |

### 5.1 Why Step 4 was re-shaped at build time (2026-08-07)

The draft spec (`features/energy-safety/01`) made EA-30 a hard clamp and EA-45 an "all clear" band.
Run against the three canonical personas plus the founder profile, neither holds:

| Profile | FFM | TDEE (post-Step 1) | Cut target | EA | Draft spec would… |
|---|---|---|---|---|---|
| Founder — 98.5 kg / 30% BF, sedentary | 69 | 2,231 | 1,731 | 25.1 | clamp to 2,070 → **deficit capped at 161 kcal** |
| Lean lifter — 80 kg / 12% BF, active | 70.4 | 2,742 | 2,242 | 31.8 | amber |
| Manual worker — 85 kg / 20% BF, very active | 68 | 2,850 | 2,350 | 34.6 | amber |

1. **EA_OK = 45 is unreachable by construction.** Our multipliers are NEAT-only (max 1.55), training
   is added separately and then subtracted back out of EA. Clearing 45 kcal/kg FFM needs a whole-day
   factor ≈1.68+. Every user would sit amber in every mode — wallpaper, and a direct breach of the
   rare+true guardrail (§4). **Dropped.**
2. **EA_HARD = 30 as a clamp forbids weight loss for anyone carrying fat.** Steps 1–3 raised TDEE for
   *active* users only; a sedentary user's EA-30 floor still lands at ~93% of maintenance. This is the
   §1.1 collision, unresolved by the resequencing. The EA thresholds were derived in lean athletes,
   who have no large fat store to cover the gap — a body with reserves is a different case.

So EA became a **warning gated to the population the evidence is drawn from**, and the hard clamp
became a **rate-of-loss floor**, which is what file 01's stated WHY actually asked for: a floor derived
from the user's own energy instead of a flat number that protects nobody in particular (a 98.5 kg body
floors at 1,673 kcal, a 60 kg body at 1,208 — the flat 1,400 served neither).

### 5.2 How Step 5 measures a cut — "cut load", not days (2026-08-07)

Decided before build, in a founder + coach review against an outside second opinion. Spec:
`features/energy-safety/02-cut-cycle-blocks.feature`.

**The unit is a deficit-weighted day, not a calendar day.** A day adds
`dayLoad = deficitFrac / REFERENCE_DEFICIT`, where `deficitFrac = 1 − (target ÷ believable
maintenance)` and `REFERENCE_DEFICIT = 0.20`. Both terms already exist inside `calcTargets`
(`app.jsx:408-414`), so this is a **weighting of the counter, not a new subsystem**. Bounded at both
ends by Step 4's `MAX_DEFICIT_FRAC`:

| Deficit | Load/day | Hard prompt at |
|---|---|---|
| 10% (gentle) | 0.50 | ~24 real weeks |
| 20% (moderate) | 1.00 | 12 real weeks |
| 25% (Step 4 ceiling) | 1.25 | ~9.5 real weeks |

A gentle cut may therefore run much longer; an aggressive one is cautioned sooner. **That is the
protection** — which is why 02 does *not* also adopt a short calendar default.

**Whether a day counts at all** is read from the **declared daily mode** (already stored per day and
synced), never from food logs — a patchy logger is the exact user this feature exists to protect, and
a log-derived counter goes quiet for them. A **weight-trend backstop** (`TREND_CUT_RATE`) catches
switching to "Maintain" to silence the prompts while still under-eating.

**Load uses the *prescribed* deficit, not the achieved one** — a deliberate simplification: the target
is known every day without logging, and the error runs toward prompting a break *earlier* than
strictly earned, which is the right failure direction here.

**Copy shows real elapsed weeks; only the trigger is load.** Telling a 16-week gentle cutter "you've
been cutting for 8 weeks" because that is their load would be false.

Three things were **rejected**, recorded so they aren't re-litigated:

1. **A ~42-day default cut / ~14-day forced maintenance cycle.** Natural-bodybuilding numbers (Helms),
   whose own advice is to cut shorter and more often *the leaner you are* — so applying them
   universally **inverts** the lean modifier. A general-population user at 32% body fat on a working
   moderate deficit would spend a quarter of the year not losing, with no demonstrated benefit in that
   population. Load-weighting already handles the aggressive cutter.
2. **A GREEN/AMBER/RED traffic light over sleep, fatigue, recovery, hunger and training performance.**
   The app logs none of those — it has weight, deficit size and estimated session calories. Those
   signals belong in file 05 (Step 6), which asks the user directly and is honest about being
   self-report.
3. **Folding training load into the load term.** Step 4 already modulates a protection by training load
   (the low-fuel EA warning, `app.jsx:417-418`). Two protections driven by the same variable would
   contradict each other on screen. Cut load = magnitude × duration; training stays in the EA warning.

**Copy constraint (coach, binding on 02 and 03):** no day count may be presented as the point at which
something happens to the body. There is no threshold at which testosterone falls or metabolism
"breaks"; risk rises with severity × duration of low energy availability, and in people with obesity
weight loss often *improves* testosterone. Likewise a diet break is not a "metabolic reset" — it eases
diet fatigue, aids adherence and re-tests the maintenance estimate.

**Cross-cutting:** design runs an ED-safety review on every calorie-facing warning; consultant runs the believability gate before each deploy; the **BMR×1.2 maintenance floor already live** (file 04a, `bmrFloorApplied`) stays as-is — it's a harmless subset of this model.

### 5.3 What a break is, and why the yearly track was removed (2026-08-09)

Decided in a founder review, with the coach hat on the removal. Spec:
`features/energy-safety/03-diet-break-intervention.feature`.

**A break is simply not cutting.** Switching to Maintain — or Bulk — *is* the break. There is no break
mode, no countdown, no completion card and nothing to fail at. An earlier draft built exactly that
(a tracked 14-day state) and it was rejected outright: a break with a contract is a promise the user
can break, whereas a mode you are merely in cannot be failed.

**One gauge, read in two directions.** 02's cut load becomes a bar. Cutting fills it (toward the
soft-nudge threshold, labelled in real weeks); every non-cut day drains it:

| Rest days | Block left | In words |
|---|---|---|
| 3 | 79% | a real dent, and it stands |
| 7 | 50% | half a break, half the load |
| 14 (`DIET_BREAK_DAYS`) | 0 | block closed, whatever its size |

Remaining load is `loadAtBreakStart × (1 − restDays ÷ 14)`, computed from the original rather than by
repeated subtraction so fourteen days land exactly on zero at any block size (`stepCutBlock`,
`app.jsx:598`). Maintain and Bulk drain **identically** — it's the days not in cut that count, and no
surplus multiplier exists that we could defend.

Two consequences, both accepted knowingly. Rest days genuinely push a break further out, which is the
point — but because each pays a *share* of the current load, one day off cancels roughly four cut days
deep in a block. A 6-on-1-off pattern still climbs to the prompt; a 5-on-2-off pattern settles below
the nudge and never trips it. That is the correct answer for a ~14% average weekly deficit, and the
stall check below is what catches the same pattern when it *isn't* working.

**Nothing ever changes mode automatically.** The three chips are the only mode surface; no card
duplicates them with buttons. The one piece of friction is returning to Cut mid-break, and only where
the block had reached the soft-nudge threshold — friction exactly where advice existed, nowhere else.
Bulk is never guarded. "Cut anyway" is honoured immediately.

**The stall check replaces the rolling-year track.** `CUMULATIVE_CUT_ESCALATE` (168 load-days a year)
and `MAINTENANCE_DECAY` are **removed**. The coach case for removal: harm tracks energy availability
(Step 4) and how much bodyweight has come off (`BLOCK_LOSS_TRIGGER`) — not calendar time under a mild
deficit. A year of gentle, working dieting is what slow fat loss looks like, and a third, weaker proxy
for duration earned its place only by looking protective. What replaced it is aimed better: cutting
for `STALL_WEEKS` (3) with the scale flatter than `TREND_CUT_RATE` opens 02's soft nudge with its own
copy. A stall means adherence has drifted, the body has compensated, or water is masking the loss —
and in all three, eating less is the wrong answer while maintenance is the fix.

Two guardrails on it, both binding: the copy is **blameless** (in a calorie tracker the reflex answer
to "you're doing it wrong" is to eat less), and it measures over **three weeks**, because a fortnight
of water retention is not a stall. Too few weigh-ins ⇒ silence, never a guess.

The `cut_load_year` column is left in place, unwritten — dropping a live column can only go wrong.

---

## 6. Still-open decisions (before/inside each step)

1. **Exact NEAT multipliers** (§3.1) — set at Step 1 against the believability gate.
2. **Adaptive-TDEE convergence shape** (Step 2) — per-update rate limit vs. absolute cap; how early to engage; confidence tiers.
3. **Earn-to-eat smoothing curve** (Step 3) — window length, decay, rest-day handling. Ties to the activity-model review.
4. **Whether the activity multiplier is ever auto-suggested** from logged-workout frequency, or stays purely user-set (revisit after Step 2 lands).
5. **`MAX_DEFICIT_FRAC = 0.25`** (Step 4) — set at build time to sit just above the flat −500 preset for
   a ~2,200 kcal maintenance, so it eases small bodies without touching large ones. Worth re-checking
   against real usage once weigh-in data exists: if it binds for a large share of users it is too tight.
6. **`LEAN_BF = 15% M / 23% F`** (Step 4) — the gate deciding who *sees* the low-fuel warning. Informed
   by standard athletic/fitness body-fat ranges, not a clinical cut-off, and it rests on a **self-reported**
   body-fat figure. Over-reporting leanness over-warns (noisy but safe); under-reporting silences the
   warning. Revisit if the warning proves either constant or never seen.
7. **`REFERENCE_DEFICIT = 0.20` and the 56 / 84 load thresholds** (Step 5, §5.2) — guardrails chosen so
   a *moderate* cut behaves like the familiar 8/12-week framing, with gentler and deeper cuts scaling
   off it. No trial fixes any of these three numbers; they are a defensible default, not a finding.
   Re-check the real-week spread they produce once usage data exists.
8. **`DIET_BREAK_DAYS = 14` and the pro-rata drain** (Step 5, §5.3) — there is **no validated formula**
   for how fast a break "pays down" accumulated restriction. 14 is sized to the best-studied break
   length (MATADOR, Byrne 2018), and the drain being *proportional* is a choice, not a finding: it makes
   a rest day worth more the deeper you are, which is why ~2 rest days a week hold the bar below the
   nudge indefinitely. Judged correct (that is a gentle cut) with the stall check as the real backstop —
   but it is the number to re-check first if breaks look too cheap in real usage.
9. **`STALL_WEEKS = 3`** (Step 5, §5.3) — a coaching judgement, not a trial figure. Two weeks is inside
   normal water-weight noise; four would leave someone stuck for a month. Re-check once weigh-in data
   exists: if the nudge fires on people who are in fact losing, the window is too short.
10. **Load uses the prescribed deficit, not the achieved one** (§5.2) — accepted for v1 because it needs
   no logging and errs toward earlier breaks. If it proves noisy (people setting deep targets they
   never eat to), gate it on the weight trend.

---

## 7. Changelog

| Date | Change |
|---|---|
| 2026-08-09 | **Step 5b BUILT — file 03 (the break drain).** A break is **not cutting** — no break mode, no countdown, nothing to fail at (§5.3). 02's cut load becomes a **bar read in two directions**: it fills while cutting (labelled in real weeks) and **drains** while not, by `loadAtBreakStart × (1 − restDays ÷ DIET_BREAK_DAYS)` — 14 rest days clear any block, 7 clear half, a partial break keeps its dent. Maintain and Bulk drain identically. New pure logic in `app.jsx`: the drain inside `stepCutBlock`, plus `cutBarFor` / `cutGuardFor` / `rechargedCardDue` / `trendLossFrac`. One guarded action (back to Cut mid-break, only past the soft threshold); Bulk never guarded; **nothing ever changes mode automatically**. One dismissible "Recharged" card that self-retires after `RECHARGED_CARD_DAYS` (3), then silence. **Adds the stall check** — cutting `STALL_WEEKS` (3) with a flat scale opens 02's soft nudge with blameless copy. **Removes the rolling-year track** (`CUMULATIVE_CUT_ESCALATE` / `MAINTENANCE_DECAY`) as the wrong measure of harm; `cut_load_year` is retired but not dropped. **Two 02 amendments land here:** `BLOCK_END_GRACE` is gone (a block closes only when drained), and the prompt button is now honestly *"Start a 2-week break"*. ⚠️ **Needs one new column before deploy:** `cut_break_load` (`setup/supabase-schema.sql`) — the drain rate, without which a second device resumes at the wrong speed and skips the guard. Jest **199** (27 new), sw **v62**. |
| 2026-08-07 | **Step 5a BUILT — file 02 (cut cycling).** The load model below, implemented: `dayCutLoad` / `stepCutBlock` / `accrueCutBlock` / `cutPromptFor` / `weeklyLossFrac` + `cutThresholds`, block state in `cutBlock` (local blob `cut_block`, four durable fields synced to `profiles`). Soft nudge + non-dismissable hard prompt on the dashboard, both showing **real elapsed weeks**. `syncProfile` now also writes `activity` (its column exists at last). Jest **172** (30 new), sw **v61**. **Deviation from the locked spec:** the primary button reads *"Switch to maintenance"*, not *"Start 2-week diet break"* — file 03 owns the tracked break and isn't built, so promising a 2-week break nothing tracks would have been a lie. Switching to Maintain accrues no load and `BLOCK_END_GRACE` closes the block after a week, so the behaviour is honest in the meantime. Next: 03 (diet break) replaces that button. |
| 2026-08-07 | **Step 5 spec decided for file 02** (spec only — not built). A cut is measured as **cut load**: each day weighted by deficit depth (`dayLoad = deficitFrac / REFERENCE_DEFICIT`, ref 0.20), reusing `kcal`/`effTDEE` already inside `calcTargets` — so a gentle cut runs longer and a deep one is cautioned sooner (~24 / 12 / ~9.5 real weeks at 10 / 20 / 25%). Whether a day counts is read from the **declared daily mode**, never food logs, with a weight-trend backstop; unlogged days don't pause the clock. Thresholds 56 / 84 load-days (lean 42 / 56, reusing Step 4's `isLeanBody`); `MAINTENANCE_DECAY` pays down the yearly total. **Copy shows real elapsed weeks, not load.** Rejected (with reasons, §5.2): a ~42-day universal cut default (bodybuilder cadence — inverts the lean modifier and penalises higher-body-fat users); a GREEN/AMBER/RED traffic light over sleep/fatigue/recovery/hunger (the app logs none of it — belongs in file 05); folding training load into the load term (Step 4's EA warning already owns that interaction). Also rejected the earlier draft's "deficit logged on ≥4 of 7 days" week — it goes quiet for the patchy logger this feature exists to protect. Needs 4 new `profiles` columns before wiring (`setup/supabase-schema.sql`; loads are `NUMERIC`). |
| 2026-08-07 | **Step 6 trigger decided** (spec only — file 05 is still `@draft`, unbuilt). The symptom check is offered after 3 consecutive weeks whose *average* logged intake sits at or below the steady-loss floor, counting only weeks with ≥4 logged days; unlogged days are excluded rather than zero-filled; 14-day cooldown after "Not now". Rejected: triggering off the low-fuel note (lean-body + training-day only — would have missed the 30%-body-fat harm case that started this workstream) and triggering off weeks spent cutting (that's files 02/03; a well-fuelled cut is not a welfare concern). Also resolved the "low fuel" naming collision — that phrase now means only file 01's single-day note; file 05 says "under-eating". |
| 2026-08-07 | **Step 4 built** (energy floor, re-seated). The draft's single EA-30 clamp was **split into two protections** after it failed its own persona numbers (§5.1): a **steady-loss floor** that clamps every preset target at 75% of believable maintenance + the applied training bonus (`MAX_DEFICIT_FRAC = 0.25`; scales with body size; eases, never blocks), and a **low-fuel warning** on energy availability `(target − raw burn) ÷ FFM` that is **warning-only**, gated to lean bodies (`LEAN_BF` 15% M / 23% F) on days they trained, EA < 30. **`EA_OK = 45` dropped** — unreachable given NEAT-only multipliers with training subtracted back out. EA deliberately uses the **raw** burn while the target uses Step 3's smoothed bonus. Custom targets warn, never override. `SAFE_MIN` retained as absolute backstop + body-fat-unset fallback. `01-energy-availability-floor.feature` rewritten to match. sw v60, Jest 142. Step 5 (sustainability: 02 cut-cycling / 03 diet break / the auto-lowering fix) is next. Device-test still batched. |
| 2026-08-07 | **Step 3 built** (smooth earn-to-eat). A logged workout's kcal are spread forward across a 3-day window as an energy-conserving weighted average (`SMOOTH_WEIGHTS = [0.5, 0.3, 0.2]`, Σ=1) instead of a full same-day unlock — damps the same-day spike, still fuels the day after a hard session, averages back-to-back days. `priorWorkoutKcal` state loads the prior 2 days from `workouts__<date>`; `smoothedBonus` feeds `calcTargets`; workout-card copy reworked. New `07-smoothed-earn-to-eat.feature` (@draft). sw v59, Jest 125. Step 4 (EA floor, file 01, re-seated on the corrected TDEE) is next. Device-test still batched. |
| 2026-08-07 | **Step 2 built** (adaptive-TDEE convergence) + **weigh-in engagement (file 06)**. Dead-time compensation + confidence-scaled steps replace the flat ±150 integrator; engages at 6 weigh-ins. Simulation: 500 kcal gap closed by day 19, no cap-pinning. Engagement = invite/progress/cadence-picker/7-day nudge (Coach+Design+QA). sw v58, Jest 117. New `06-weigh-in-engagement.feature` (@draft). Step 3 (smooth earn-to-eat) is next. Device-test still batched. |
| 2026-08-07 | **Step 1 shipped** (activity input + seeded NEAT multiplier). Multipliers LOCKED 1.20/1.35/1.45/1.55 (top widened from 1.45 after the believability gate); sedentary == old flat baseline. Activity local-only (no DB column yet). sw v57, Jest 108. Device-test batched (Next-up 2). Step 2 (adaptive-TDEE strengthening) is now next. |
| 2026-08-07 | Doc created. Model locked to seed→calibrate; energy-safety features re-sequenced behind the activity model + adaptive-TDEE fix. Supersedes the earlier "build 01 next" ordering in `START-HERE.md`. |
