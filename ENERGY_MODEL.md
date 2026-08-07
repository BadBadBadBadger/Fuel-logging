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
- **Re-sequenced build:** activity input → stronger adaptive TDEE → smoothed earn-to-eat → EA floor (01) → sustainability (02/03/04) → LEA symptom check (05).

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
| To not be allowed to starve myself | Flat `SAFE_MIN` 1400/1200, ignores body size | Right instinct, **wrong mechanism** (EA floor fixes it — once seeded correctly) |

---

## 3. The locked model — "seed → calibrate"

> **Decision (2026-08-07):** start every user on a believable estimate from a coarse activity input,
> then let a strengthened adaptive TDEE become the **source of truth** and correct the seed within a
> couple of weeks. Belt and suspenders — because self-reported activity is unreliable *and* a brand-new
> user has no data yet.

1. **Seed TDEE from a coarse activity input.** One 4-option lifestyle question → a **NEAT-only** multiplier on Katch-McArdle BMR, *replacing* the flat ×1.2. Asked at onboarding, editable in Profile, framed honestly as *"a starting point — we fine-tune this automatically as you log."*
2. **Keep event-based "earn to eat" for logged training — but smoothed across days**, not a same-day unlock (kills compensatory "burn-to-eat" patterns; handles rest-day clusters). See [[project_workout_smoothing_idea]].
3. **Adaptive TDEE is the truth.** Widen the ±150 clamp into a **rate-limited convergence** (can move far over weeks, never lurch per update), engage sooner, and show an honest "still learning" confidence state.
4. **EA floor (file 01) sits on the corrected TDEE** — hard *cut boundary* at EA 30, green at 45, `SAFE_MIN` retained only as the body-fat-unset backstop.

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
| **4** | **EA floor (file 01), re-seated.** Hard cut boundary @ EA 30; green @ 45; `SAFE_MIN` backstop only when body-fat unset; rare/true, supportive warnings. | coach (numbers), design (copy/UX), QA | On the corrected TDEE the floor fires only for genuine under-fuelling; amber uncommon. |
| **5** | **Sustainability system** — cut-cycling (02), diet break (03), no-auto-lower-on-gain (04-rest). Meaningful only once a cut is a real deficit. | coach + QA | Per-feature specs green. |
| **6** | **LEA symptom check (file 05).** Sex-neutral → *"see a healthcare professional."* | coach + design | Per-spec; no diagnosis. |

**Cross-cutting:** design runs an ED-safety review on every calorie-facing warning; consultant runs the believability gate before each deploy; the **BMR×1.2 maintenance floor already live** (file 04a, `bmrFloorApplied`) stays as-is — it's a harmless subset of this model.

---

## 6. Still-open decisions (before/inside each step)

1. **Exact NEAT multipliers** (§3.1) — set at Step 1 against the believability gate.
2. **Adaptive-TDEE convergence shape** (Step 2) — per-update rate limit vs. absolute cap; how early to engage; confidence tiers.
3. **Earn-to-eat smoothing curve** (Step 3) — window length, decay, rest-day handling. Ties to the activity-model review.
4. **Whether the activity multiplier is ever auto-suggested** from logged-workout frequency, or stays purely user-set (revisit after Step 2 lands).

---

## 7. Changelog

| Date | Change |
|---|---|
| 2026-08-07 | **Step 3 built** (smooth earn-to-eat). A logged workout's kcal are spread forward across a 3-day window as an energy-conserving weighted average (`SMOOTH_WEIGHTS = [0.5, 0.3, 0.2]`, Σ=1) instead of a full same-day unlock — damps the same-day spike, still fuels the day after a hard session, averages back-to-back days. `priorWorkoutKcal` state loads the prior 2 days from `workouts__<date>`; `smoothedBonus` feeds `calcTargets`; workout-card copy reworked. New `07-smoothed-earn-to-eat.feature` (@draft). sw v59, Jest 125. Step 4 (EA floor, file 01, re-seated on the corrected TDEE) is next. Device-test still batched. |
| 2026-08-07 | **Step 2 built** (adaptive-TDEE convergence) + **weigh-in engagement (file 06)**. Dead-time compensation + confidence-scaled steps replace the flat ±150 integrator; engages at 6 weigh-ins. Simulation: 500 kcal gap closed by day 19, no cap-pinning. Engagement = invite/progress/cadence-picker/7-day nudge (Coach+Design+QA). sw v58, Jest 117. New `06-weigh-in-engagement.feature` (@draft). Step 3 (smooth earn-to-eat) is next. Device-test still batched. |
| 2026-08-07 | **Step 1 shipped** (activity input + seeded NEAT multiplier). Multipliers LOCKED 1.20/1.35/1.45/1.55 (top widened from 1.45 after the believability gate); sedentary == old flat baseline. Activity local-only (no DB column yet). sw v57, Jest 108. Device-test batched (Next-up 2). Step 2 (adaptive-TDEE strengthening) is now next. |
| 2026-08-07 | Doc created. Model locked to seed→calibrate; energy-safety features re-sequenced behind the activity model + adaptive-TDEE fix. Supersedes the earlier "build 01 next" ordering in `START-HERE.md`. |
