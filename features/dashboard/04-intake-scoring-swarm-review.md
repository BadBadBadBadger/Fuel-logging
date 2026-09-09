# Swarm review — `04-intake-scoring.feature`

**Date:** 2026-08-27. **Companion file:** `04-intake-scoring.feature` (same relationship the
original handover doc used — this is the review record, the `.feature` file is the spec).

Full transcript of the adversarial multi-agent review run before handing the spec back to the
founder for his own proof pass. Two fresh agents — a QA-automation persona and a brand-new
Critical-Thinking persona (`personas/critical-thinking.md`) — each reviewed the file cold and
independently, were then given each other's report and asked to respond, and the surviving
findings were applied directly to the spec. An Anti-Metaphor Hero pass followed for wording only,
then one final Critical-Thinker sign-off. Nothing here was fabricated or summarised in place of
the real output — this is the agents' own words, unedited except for removing internal tool
metadata.

---

## Round 1 — QA-automation review (independent, cold start)

# QA Review — `features/dashboard/04-intake-scoring.feature`

*(Reviewed as: senior QA/test-automation engineer, BDD/Gherkin. Persona loaded from `personas/qa-automation.md`.)*

## Verdict

**Not ready for sign-off.** This is a strong first draft — the header comments are unusually disciplined about citing exactly what's reused (and every citation I checked against `app.jsx` was accurate), the Cut/Bulk mirror and the 3×3 selected-vs-reads-as matrix are well-built Outlines, and the `@draft` tag plus inline `# OPEN` markers are honest about what's undecided. But there are **two internal contradictions in core scenarios** (not just open questions — actual disagreements between a table and its own prose, or between two adjacent scenarios), and the "supersedes 02 entirely" claim has real gaps once checked against what `02` actually covered. Founder should resolve the Blockers before this comes off `@draft`; the rest can ride alongside.

Citation spot-checks (all accurate): `FAT_FLOOR_PER_KG = 0.6` at `app.jsx:283` ✓, `EATING_WINDOW_H = 14` at `app.jsx:433` ✓, `paceVerdict`'s "never closes an unlogged day" behaviour at `app.jsx:435-436` ✓ (elapsed hardcoded to 0 when `firstMealHour == null`), `TREND_CUT_RATE`/`gainWhileCutting` at `app.jsx:574`/`636` ✓, `MODES` deltas (cut −500/maintain 0/bulk +500) at `app.jsx:37-39` ✓, `kcal = TDEE + modeAdj` in `ENERGY_MODEL.md:33` ✓. Dashboard/01's 100/200/500 bands are reproduced byte-for-byte in the Cut Examples table (lines 89-94) — that reuse claim is clean.

## Blocker

**1. The hero priority-order table contradicts the reasoning comment directly above it.**
The comment says: *"the health floor outranks everything because it is a real problem regardless of the goal."* The table then ranks calories **above** fat-below-floor for both listed goals. If the floor really outranks everything, both rows are wrong. If calories is meant to outrank the floor on Cut/Bulk specifically, the comment overstates the rule. Needs an explicit founder call: does the floor beat calories, or not?

**2. Protein's red threshold is ungated in the Outline but close-gated in the very next scenario.**
The Outline ("Protein under target is graded by how far short") shows `50% → red` with no time-of-day precondition at all. The scenario immediately after it is titled *"Protein well under **at day close**..."* and its `Given` explicitly requires `the day has closed`. Two adjacent scenarios can be read as giving different preconditions for the same outcome.

## Should-fix

3. "Supersedes 02" silently drops 02's per-macro colour identity (blue/orange/red-orange).
4. No standalone scenario for carbs-under-target at day close.
5. `dashboard/01` isn't updated to reflect it's being re-scoped — its bands are really only right for Cut/partial-Maintain, wrong for Bulk.
6. Missing scenario: carbs over target *and* calories also over target — what colour does the carb bar itself show?
7. Fat-floor-breach table starts at 1g, breaking the contiguous-band convention used everywhere else.
8. "Fat shows green or neutral" is not a real assertion.
9. Maintain's daily calorie score never escalates to red at any magnitude, unflagged as OPEN unlike everything else.
10. Terminology drift: Bulk's Outline claims to be "the exact mirror" of Cut's but uses a different field name and casing convention.
11. "hero" is used as a load-bearing term with no definition anywhere.
12. The two-ring dial has zero prior art or code citation, breaking the file's otherwise disciplined reuse-citation habit.
13. Missing edge case: a user with less than 7 days of history.

## Polish

14. Citation off-by-one: header says `paceVerdict` at `app.jsx:436`, actually defined at 435.
15. OPEN items flagged only via inline comments, not a scenario tag.
16. "direction doesn't matter" is a holdover phrase from `02`'s framing that no longer applies.
17. The two Guardrail scenarios are written as universal invariants, a different pattern than the rest of the file.

## Bottom line

Numeric/code reuse claims check out cleanly everywhere I verified them against `app.jsx`. The real risk is in the two Blockers plus the "supersedes 02 entirely" claim needing a harder look before `02` gets deleted. A founder-review pass away from solid.

---

## Round 1 — Critical-Thinking review (independent, cold start)

# Critical Thinking Review — `features/dashboard/04-intake-scoring.feature`

## Verdict

The file is well-organized and its authors clearly pressure-tested the *easy* collisions. But it has one genuine, high-stakes contradiction — the unlogged-day guardrail inverts itself for exactly the population this app exists to protect (a person cutting) — plus a second contradiction where the file's own stated reason for redesigning protein's grading is violated two sections later by fat's grading. The weekly 9-cell matrix is compared against a "TDEE" that is a different, unfloored number than the "calorie target" the daily scenarios grade against, so daily-green-every-day does not reliably produce the weekly read the matrix implies it should.

## Contradictions

**C1 — The unlogged-day guardrail inverts for a Cut, the exact case the app exists to protect.**
"Counts as a miss" was never given a value; the only one consistent with "the last 7 days of logged calories" is 0 kcal logged. For a Cut, where under is never a penalty, a 0-kcal day drags the weekly average *further* under TDEE — reading as **more** of a cut, green, "keep going." An honestly-logged binge day pulls the average toward maintain/bulk and reads amber/red. So not logging at all scores better than logging a bad day honestly — the precise inversion the guardrail scenario exists to prevent.

**C2 — Fat's grading reuses the exact flat-gram bands the file just rejected for protein, on a target that scales with bodyweight the same way protein's does.** Being 5g below floor is a 16.7% shortfall for a 50kg body and 8.3% for a 100kg body — under the stated bands both are already in the same category by "5g+."

**C3 — The weekly comparator ("TDEE plus the mode adjustment") is a different number than the daily "calorie target" the rest of the file grades against.** Worked example: a 50kg, 30%-body-fat, sedentary female on a Cut. BMR 1126 → TDEE 1351 → raw cut target 851 → deficit floor 1013 → **SAFE_MIN.female = 1200**. Real daily target = 1200, only 151 kcal under TDEE. Eating exactly to target every day is daily-green throughout, yet the weekly average lands inside the ±250 "maintain" band, triggering "This week hasn't been a cut." She's pinned at the app's own hard safety floor; there is no more to cut.

**C4 — Protein's percentage-band table has no day-open/day-close gating, contradicting the header's own stated reuse of `paceVerdict`,** which exists specifically to pace protein.

## Unstated cases

U1 — Day-close ordering conflict for a late first meal / crossing midnight.
U2 — No daily-ring state defined for a fully unlogged day.
U3 — Carbs' own colour when carbs and calories are simultaneously over is unspecified.
U4 — Protein-floor vs calorie-ceiling mutual achievability on an aggressive cut never tested.
U5 — Maintain's priority tier mixes kcal/grams/percentage with no normalization defined.
U6 — Small unclassified gap just below the fat floor.

## Weak justifications

W1 — Bulk's mirrored calorie bands, defended only by resemblance to Cut's, not by argument that the consequence is symmetric.
W2 — Weekly ±250 kcal band, justified only by resemblance to the mode deltas.
W3 — Protein pct-band Examples are sample points, not stated boundaries.
W4 — Fat-below-floor shape justified purely as reuse, doubly weak given C2.

## Fine

F1 — The named 3-way collision (calories over + fat under floor + protein under, on a Cut) resolves cleanly via the priority table: calories wins, unambiguous.
F2 — "The layer never changes a logged value" is actually upheld across every `Then` clause.
F3 — Protein-over-target has no boundary to break, clean.
F4 — "Never eat more on a cut" is tested twice, independently, for both calories and fat.

---

## Round 2 — QA responds to the Critical Thinker's report

SAFE_MIN.female = 1200 confirmed at `app.jsx:269`, so their C3 worked example checks out exactly.

**1. Where they caught something I missed:** C1 — agree, real and severe. I took "counts as a miss" at face value without pressure-testing what value it carries into the average. Their chain is right. C2 — agree, and sharper than what I flagged (I only caught the shallow 0–1g boundary gap). C4 is substantially my own Blocker #2, arrived at from a different angle — good independent convergence.

**2. Where I disagree (Blocker #1):** They're right, and I'll adjust. The table itself is a well-formed, unambiguous total order — their 3-way collision test proves it. My objection is entirely that the inline comment ("the health floor outranks everything") overclaims relative to what the table actually encodes. I'd downgrade my framing — documentation/prose-vs-artifact mismatch, not a computability problem — though I'd keep it at Blocker severity: an implementer who trusts the comment over the table ships a real, opposite product decision.

**3. Severity of C1 and C3 relative to my two Blockers:** Both are real, and both are more severe than either of mine. **C3 is the single most important finding across both reviews** — a demonstrated arithmetic failure with a worked example landing exactly on the app's own hard safety backstop. **C1 is close behind, arguably tied** — a guardrail whose own stated purpose is inverted by the interaction of two other rules already in the same file, for exactly the user population this app exists to protect. I'd rank both above my two findings, C3 first by a small margin for having a hard numeric proof rather than a logical chain.

---

## Round 2 — Critical Thinker responds to QA's report

**1. Where they caught something I missed:** Clean miss on my part: **their Blocker #1**. Checking prose-against-table is rule #1 in my own persona file, and I ran it on the wrong pair — I verified the table resolves the 3-way collision correctly, but never cross-checked it against the comment two lines above it. Worse than QA's framing shows: the standalone "fat floor always outranks a ceiling breach" scenario is a *second*, independent contradiction of the same table, not only a prose one. **Adding this as C5.** Also genuine catches I didn't make: #5 (dashboard/01 not re-scoped), #9 (Maintain's calorie band never reaching red, unflagged), #8 ("green or neutral"), #12 (two-ring dial has zero prior-art citation), #13 (no <7-days-history scenario — interacts with my own C1).

**2. Blocker #2 vs my C4:** Same gap, confirmed — not a different one.

**3. The 11 Should-fix/Polish items:** None individually rise to Contradiction. #13 amplifies C1 — a brand-new user's missing days are "account didn't exist yet," not "chose not to log"; if those average as 0-kcal misses under the same mechanism, the weekly card is badly misleading in week one for every user, not just an edge case. Mild pushback on #3 (colour identity) — given the file says 02 should be deleted outright, collapsing the tints reads as plausibly intentional, not an oversight.

**4. Does this shift my severity ranking?** I still rank C1 above C3 above C5 (their B1) above C4 (their B2) — but this is a considered judgment call on a *different axis* than theirs: QA ranks by ambiguity-that-blocks-implementation, I rank by consequence-to-the-dieter-if-shipped-wrong. On that axis: C1 rewards not-logging over honest logging with an encouraging "keep going" on a cut — the exact incentive failure guardrail §6 exists to prevent. C3 can tell someone already pinned at SAFE_MIN that they "haven't really cut." Both actively push toward under-eating. Both rankings are legitimate — this is exactly the kind of judgement call my own boundaries section says to name rather than paper over.

---

## Synthesis — edits applied to the spec (main session, not an agent)

Both agents converged on the same priority list. Applied directly to `04-intake-scoring.feature`:

- **C5 / Blocker #1** — hero priority table reordered so the fat floor genuinely comes first for every goal, matching its own comment and the standalone scenario that already asserted this.
- **C2** — fat's ceiling and floor bands converted from flat grams to percentage, mirroring the fix already applied to protein for the identical bodyweight-scaling reason.
- **C4 / Blocker #2** — protein split into a paced open-day Outline (reusing `paceVerdict`'s ahead/on/behind verdict, never red mid-day) and a separate close-gated Outline for the percentage bands.
- **Should-fix #10** — Bulk's table renamed to match Cut's field name and phrasing convention.
- Missing scenarios added: carbs-over-when-calories-also-over, carbs-under-at-close (always green — carbs is pure flex), a fully unlogged day's own daily-ring state, fewer-than-7-days-of-history, and an explicit citation for the two-ring dial's design provenance (the founder-approved mockup comparison from earlier in the session, not app code).
- **Should-fix #8** — "green or neutral" resolved to a single colour.
- A global boundary-inclusivity rule added to the Background so no banded table leaves its shared edge value ambiguous (closes the boundary gaps both reviewers flagged across every table).
- **Should-fix #11** — "the hero" defined in the Background.
- **Should-fix #5** — a scoping caveat added noting `dashboard/01` needs re-scoping to the Cut role once this file ships.
- Colour-identity drop (#3) — resolved to an explicit statement that collapsing the three brand tints into one green/amber/red is an intentional simplification, flagged for founder confirmation rather than left ambiguous.
- **C1 and C3 were deliberately NOT silently resolved.** Both are flagged TOP PRIORITY at the top of the file's header with the full worked reasoning preserved, each with a proposed direction, both awaiting an explicit founder decision.

---

## Anti-Metaphor Hero — final wording pass

# Anti-Metaphor Review — `features/dashboard/04-intake-scoring.feature`

**Verdict:** The file's own two-agent swarm review already did the hard conceptual work honestly — genuine open questions are correctly flagged as founder questions rather than papered over, exactly what Rule 5 asks for. Found one live ban-list regression (three instances of "gate" in its verb form) and a scattering of coined-and-bare labels ("the layer," "the weight/estimate layer," "the reach target," "guarded," "a flex macro," "the only fence"). 12 edits applied. No product behaviour, thresholds, numbers, or Given/When/Then structure were touched.

## Coined and bare (fixed)

| Term found | What it actually does | Replacement |
|---|---|---|
| "gating" / "close-gated" (×3) | A precondition restricting a rule to a day-state | "precondition" / "restricted to day close" |
| "the layer" (scenario title) | This feature never auto-changes a logged value | "Scoring never changes a logged value" |
| "the weight/estimate layer" (×2) | Bodyweight-trend judgement and estimate-accuracy judgement | "the bodyweight trend and from estimate accuracy" |
| "guarded" | `floorsExceedKcal` detects/flags the conflict, doesn't prevent it | "covered" |
| "the reach target" (×2) | The protein target itself | "the protein target" / "protein's own target" |
| "the floor is the only fence" | The fat health floor is the only bound below target | "the floor is the only limit that applies" |
| "a flex macro" (scenario title) | **Real inconsistency, not just wording** — the Given said "carbs OR calories," but Background defines only carbs as flex; calories is "the master constraint." The collective title mislabelled calories. | Named both macros directly instead of the wrong collective label |
| "master constraint" / "flex remainder" bare at first use | Only ever appeared as bare labels, never inside a defining sentence | Given the same adjacent-definition treatment "the hero" already had |

## Named with definition adjacent (left alone)

"the hero" — already defined at first use. **"the baseline" — FLAGGED, NOT FIXED.** The Given/When/Then states a formula; the comment beneath says that formula is wrong for a SAFE_MIN-pinned user, with three named candidate variables not yet chosen between. Read as Rule 5 correctly applied — flagged to the founder rather than rewritten. "reads as," "guardrail §6," "the coach," "the existing engine," "a fixed lexicographic order" — established or ordinary usage, left alone.

## Established external term (left alone)

BMR, TDEE, `SAFE_MIN`, `floorsExceedKcal`, `paceVerdict`, `EATING_WINDOW_H`, `FAT_FLOOR_PER_KG`, `computeMacros`, `calcTargets`, `gainWhileCutting`, `TREND_CUT_RATE`.

Post-edit grep confirms zero remaining instances of "ratchet," "clamp," "gate" (any form), "layer," "guarded," "reach target," or "flex macro" in the file.

---

## Final sign-off — Critical Thinker reviews the wording pass and the file as a whole

**1. "The baseline" — leave as comment-only tension, or rewrite the Given/When/Then?**
Rewrite it. Compare it to how the file's *other* top-priority item was actually handled — the unlogged-day scenario didn't leave a disputed formula sitting in the `Then` clause with a comment disagreeing underneath; it was rewritten to be true under either candidate mechanism, with the exact mechanism still open. "The baseline" scenario didn't get that treatment: the literal formula the comment demonstrates is wrong is still sitting in the `When` step. Gherkin's Given/When/Then is normally the executable contract; anyone implementing straight off the steps and skipping prose gets exactly the bug C3 described, despite the file demonstrably knowing better. Recommend a small, non-deciding edit — matching the hedge-without-deciding pattern already proven out on the unlogged-day scenario.

**2. Do any of the 12 wording edits change meaning or reopen anything?**
11 of 12: clean, no meaning change. The 12th — the "flex macro" rename — the edit itself is wording-only, but scrutinizing that specific scenario surfaced something **new**: the day-open rule for carbs/calories has no goal condition, and Bulk's own calorie-under Outline also has no day-state precondition (unlike Maintain, which explicitly splits open from closed). On a Bulk, mid-afternoon, 300 kcal under target: the generic rule says green/"On pace"; the Bulk-specific Outline says amber/"MISSING THE BULK." Nothing states which governs. Not in either original review — the rename made it visible by finally naming "calories" explicitly instead of burying it under "a flex macro."

**3. Overall verdict.** Close, not quite there. Both top-priority items are honestly surfaced with proposed directions rather than silently resolved; C5/Blocker#1, C2, and C4/Blocker#2 are genuinely fixed. Before this goes to the founder, add two more small, non-deciding flags — the baseline GWT rewrite, and the Bulk day-state gap. With those two added, this is honestly at the state the header claims for the rest of the file, and ready for the founder's proof pass.

---

## Final fixes applied (main session)

Both of the sign-off pass's findings were applied directly, matching the hedge-without-deciding pattern already established:

- **"The baseline"** — the `When` step no longer asserts "TDEE plus the mode adjustment" as settled; it now states explicitly that this is not yet decided, naming both candidates, mirroring how the unlogged-day scenario already handles its own open question.
- **The Bulk day-state gap** — flagged in both places it appears (Bulk's calorie-under Outline, and the generic day-open "under is on pace" scenario), stating the exact conflict and that it needs the same open/closed split Maintain already has.

## Outcome (round 1)

`features/dashboard/04-intake-scoring.feature`: **29 → 35 scenarios**, still `@draft`. Two items
remain flagged TOP PRIORITY, each with a proposed direction, neither decided — both need the
founder's explicit call before anything else in the file is treated as settled:

1. The weekly comparator can tell a user pinned at their own safety floor that they "haven't
   really cut." Proposed: compare against the average of the user's own real floored daily
   targets, not raw TDEE.
2. An unlogged day could outscore an honestly-logged bad day on a Cut — the exact inversion
   guardrail §6 exists to prevent. Proposed: an unlogged day reduces assessable weekly coverage
   rather than being averaged in as a favourable 0 kcal.

Everything else either has a concrete fix already applied, or is honestly flagged open with a
proposed direction and the reasoning preserved inline.

---

# Round 2 — Atomicity and file-structure review, 2026-08-27

Second swarm, same day. Founder's ask: make sure every scenario is atomic (one functionality,
never two bundled together), and have QA actually **decide** whether the file should split —
not just flag it. Three independent agents this time: QA-automation, Critical-Thinking, and a
new participant, Nutrition-Coach (`personas/nutrition-coach.md`), each blind to how the other two
would answer the structural question. None re-litigated round 1's content (band shapes, the
priority-table order, the two TOP-PRIORITY items) — scope was atomicity and structure only.

## Round 1 of round 2 — three independent verdicts, three different structural answers

**Nutrition Coach: keep the file as one.** The per-macro sectioning was already well atomized —
the bundling problem it found wasn't macro-vs-macro, it was judgment-vs-judgment inside a single
row (the hero-priority table compressing four different *kinds* of urgency — hard safety, goal
protection, goal fit, adherence — into one opaque ranking string; an "every macro well under"
Outline treating protein as interchangeable with the other three, when protein-under-at-close is
independently and unconditionally red). On structure: daily and weekly aren't two different
domains the way intake-scoring and weight-trend are — they're two resolutions of one domain, and
the weekly number only means anything in reference to the daily floor logic that feeds it. The
file's own worst bug (the SAFE_MIN mismatch) is proof: it happened because the weekly baseline
was computed as an idealised, freshly-derived number instead of citing the real daily target a
few hundred lines up. Splitting turns that coupling from a proximity-enforced habit into a
standing cross-file discipline problem. If size is the real issue, a one-directional import
(weekly's Background citing daily's) is safer than a peer split.

**QA: split into three** — `04-daily`, `05-weekly`, `06-layout`. Checked the repo's own
precedent first (`energy-safety/03`, which earns its one-Feature bundling because every section
is a different *view of one state variable*) and found `04` doesn't have that property — daily
and weekly are different computations over different inputs, not two views of one number. Also
found a real atomicity Blocker independently: scenario 33 (the two-ring dial provenance note)
has zero Given/When/Then — prose wearing a `Scenario:` label, not a real scenario. Plus several
genuine bundling issues, including the mechanism behind the already-flagged Bulk day-state
ambiguity: a scenario silently matched "carbs or calories" under one rule when the file's own
rules for those two macros aren't the same.

**Critical Thinker: split, but along a different axis — logic vs. presentation, not
daily/weekly.** Independently distrusted a daily/weekly cut before seeing either other report:
at least five scenarios don't belong to either side under that cut — the two guardrails
(explicitly cross-cutting by their own section header), the three layout scenarios (inherently
*about* the daily/weekly relationship, not belonging to one side), and the weekly section's own
SAFE_MIN worked example (a reasoning chain built entirely from daily-logic facts — scattering it
would make the one chain a reviewer most needs to see harder to follow, not easier). Proposed
instead: one logic file (everything that computes a state/colour/label/hero-text) plus one thin
presentation file (only the ring composition). Also found the day-close Outline's title claims a
"race" between two clocks that its own Examples table never actually tests, and that two
scenarios reach across a subsystem boundary the Background itself draws — a local macro's
scenario silently asserting what the hero says, a fact owned by a different, still-open table
~250 lines away. Proposed a `@founder-blocking` tag on just the two TOP-PRIORITY scenarios as a
way to get release-granularity without fragmenting the file — addressing the one real argument
*for* isolating weekly.

Convergent findings, found independently by more than one reviewer: scenario 33 has no
Given/When/Then (QA + Critical Thinker); a scenario reaching into the still-open hero-priority
table without citing it (QA's Should-fix #3 and Critical Thinker's "Unstated case" #1 — the same
finding, different framing).

## Reconciliation — QA's final decision

Given both counter-arguments, QA revised its own recommendation rather than defending it:

> **Split two ways, along logic vs. presentation — not daily vs. weekly, not three-way, not one
> file.** Adopting Critical Thinker's cut; not adopting the Coach's headline ("keep one file")
> but adopting the mechanism underneath it.
>
> *Against the Coach*: re-checked what the SAFE_MIN bug actually was before accepting the
> "proximity" story. The bug was that the weekly scenario computed its own baseline by hand
> instead of citing `calcTargets` — the same function the daily section also only ever cites,
> never re-derives. The bug happened while daily and weekly sat 300 lines apart in one file, and
> proximity did nothing to catch it — a multi-agent review did. Rejecting the proximity
> mechanism, keeping what's actually right underneath it: the dependency needs to be **named**,
> not assumed. Folded in as a content fix (cite `calcTargets` directly) independent of file
> structure. Where the Coach's instinct wins outright: don't sever weekly from daily — not doing
> that, under this plan or any other.
>
> *Against Critical Thinker's critique of QA's own three-way plan*: correct as levelled, but it
> doesn't recur against Critical Thinker's own proposed cut — the guardrails and the SAFE_MIN
> chain never leave the logic file under that scheme. That's the actual reason to prefer it: not
> a compromise, but the one structure that happens to satisfy the Coach's core objection (daily
> and weekly never separate) as a side effect of solving Critical Thinker's stated problem
> (compute vs. render are different questions).
>
> *One correction to Critical Thinker's own proposal*: they placed the unlogged-day-ring-state
> scenario in the presentation file, but by their own stated rule ("everything that computes a
> state… vs. only the arrangement of already-computed states") it computes a new state and
> belongs in logic. Applied their rule correctly rather than as they placed it.
>
> *Why a tag beats file-isolation*: only 2 of weekly's 6 scenarios are actual blockers — a file
> boundary around "weekly" would have over-blocked the other 4. `@founder-blocking` on exactly
> the 2 scenarios that need it is the more honest signal.

QA then produced a consolidated, 13-item before/after fix list folding in its own findings plus
whatever it agreed with from the other two (full detail lives in the file's own header comment
and the commit itself) — including several genuinely new findings from the Coach and Critical
Thinker that QA's own first pass hadn't caught: the day-close Outline's unproven "race" title,
"visibly diluted" possibly asserting a UI element that doesn't exist anywhere in the spec, two
layout scenarios describing the same spatial fact with drifting wording, and the hero-priority
table's severity-vs-actionability ambiguity around protein's last-place ranking.

## Applied

- **`dashboard/04-intake-scoring.feature`** stays the logic file — daily and weekly grading
  together, permanently. **29/35 → 36 scenarios.** Two scenarios now carry `@founder-blocking`
  (the weekly baseline, the unlogged-day rule) instead of file-level isolation.
- **`dashboard/05-intake-score-card-layout.feature`** — new, 2 scenarios, presentation only. No
  Background needed — nothing in it depends on any term `04` defines, itself evidence this is a
  genuinely separate concern.
- **`features/README.md`** — updated: 34 files / 298 scenarios, `@founder-blocking` added to the
  tag legend, dashboard table and note rewritten to explain both rounds.
- Thirteen concrete before/after fixes applied: the no-GWT "scenario" demoted to a header
  comment; "carbs or calories" split into two scenarios (the direct cause of the Bulk day-state
  ambiguity); the fat-floor hero-copy claim extracted into its own scenario that now cites the
  priority table instead of asserting its output unconditionally; the priority table decomposed
  into pairwise scenarios (surfacing the unresolved severity-vs-actionability question);
  Bulk-over's undefined "unless" branch removed from its `Then`; the day-close Outline retitled
  to match what its table actually tests; the "well under" aggregate scoped to exclude protein;
  a duplicate hero-attribution clause removed from the carbs-over scenario; "visibly diluted"
  reworded to describe the arithmetic, not an unspecified UI element; the two layout scenarios'
  drifting wording reconciled; a Background line added naming the colour-escalates-not-copy
  pattern as deliberate; the weekly baseline scenario's content fix (cite `calcTargets`); and the
  stray `When` left as the one acknowledged style outlier (34-to-1 in the file's own favour).

## Anti-Metaphor Hero — round 2 wording pass

Swept both files after the restructuring, on the theory that fast-written round-2 prose —
synthesizing three agents' reports under real time pressure — is exactly the kind of text most
likely to reintroduce a swept term. It was right to check: found and fixed two live "gate" (verb)
regressions and one bare "engine" promotion, all in freshly-written header/comment prose from
this round, none in the surviving round-1 text.

More valuable: it treated cross-reference integrity as in-scope (asked to, since a restructuring
is exactly when pointers break) and found three real breaks the restructuring had introduced —
not wording bugs, structural ones:

- A footnote pointing at **a scenario title that no longer exists** — the priority-order table it
  referenced was decomposed into three pairwise scenarios in this round, and the pointer was
  never updated. Repointed to the scenario that actually carries the fact.
- A backward reference ("the SAFE_MIN mismatch **above**") that actually pointed at content
  **below** it in the file. Fixed to point the right direction.
- A stale line-number citation, off by the ~55 lines this round's splits added above it. Replaced
  with a scenario-title quote instead of a raw line number, matching how every other cross-
  reference in the file already points — a citation style that survives the next reflow instead
  of breaking on it.

Also strengthened `@founder-blocking`'s in-file definition (it told the reader to act on the tag
without stating what the tag itself meant, relying on the reader having also read
`features/README.md`) so `04` is self-sufficient without needing the README open alongside it.
Verdict: **clean going in on ban-list terms (`ratchet` and `clamp` were already absent; two live
`gate`s found and fixed), and clean now** — no genuine conceptual gap requiring escalation as a
new question; every real unresolved decision the file has is already correctly flagged in its
own voice.

## Outcome (round 2)

`04-intake-scoring.feature`: 36 scenarios (logic, `@draft`, 2× `@founder-blocking`).
`05-intake-score-card-layout.feature`: 2 scenarios (presentation, `@draft`), new. 34 files / 298
scenarios total across `features/`. Structure decided, not left open; atomicity audited by three
independent lenses and reconciled into one fix list; wording and cross-references swept clean
after the restructuring. Ready for the founder's own proof pass, same as round 1's output was.

---

# Founder decision on both TOP-PRIORITY items, 2026-09-04

Reviewed directly with the founder (no agents this round). Both `@founder-blocking` scenarios
decided; tags removed from `04-intake-scoring.feature`.

**Weekly baseline.** Rejected the swarm's own proposed fix (compare against the user's own
floored daily targets instead of TDEE) — worked through, it makes hitting-target always read
"maintain" for everyone, which would have quietly destroyed the mismatch signal the scenario
exists to give. Decided instead: keep the TDEE baseline for everyone, but add a majority-floor
override — a week where a safety floor (sedentary floor, deficit floor, or `SAFE_MIN`) held the
daily target up on 4 or more of the 7 days reads as "cut" outright, skipping the band comparison.
There was never a lower number on offer on those days, so there's nothing honest to compare
against.

**Unlogged days.** Decided as the swarm proposed, with one addition: unlogged days are excluded
from the weekly average outright (never averaged in as a favourable 0 kcal) — no minimum number
of logged days required before a colour verdict is shown. Instead, the founder asked for
transparency over suppression: the weekly summary always states how many of the 7 days it's
actually built from ("based on 5 of 7 days logged"), rather than hiding a thin week behind a
"still filling in" state the way a brand-new account's first week does.

**Raised separately, not part of this fix.** Mid-discussion the founder flagged that the real
underlying flaw isn't in this file at all — it's that `SAFE_MIN` is a flat number (1400 male /
1200 female) rather than calculated per body. This is not new: found and deliberately shelved
2026-08-10 at n=1 (`ARCHITECTURE_REVIEW.md` §4.I, `targets/04-safe-minimum-backstop.feature`),
on the grounds that it never bound at the founder's own bodyweight. The founder is now reopening
it. Both decisions above hold regardless of how `SAFE_MIN` is eventually calculated — the
majority-floor override only checks whether a floor was binding, not what value it used. Tracked
as its own piece of work, not folded into `04`.
