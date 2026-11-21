# 03 — App consultant: going back to Cut early

**Verdict: the one-confirm rule is right. Keep it, and add no more friction. Show the cost as honest numbers on the tape. One gap is a blocker for v2: Settings must go through the same guard.**

Verified in the repo: `cutGuardFor` (app.jsx ~1453) and the mode-picker handler (~4366). Spec 03 L361-369 says "Cut anyway" is respected with no further friction. Spec 02 L42-46 has a **weight-trend backstop**: a falling 7-day average counts as a cut day whatever mode is set. That matters below.

## Why stronger friction loses

- **The casual user** never sees the guard, because a short cut sits under the soft threshold. That's correct. Leave it alone.
- **The athlete with a deadline** (weigh-in, holiday, photoshoot) has a real reason the app can't see. A second confirm, a cooldown or a "why?" form treats an informed adult as a suspect. That is the moment a paying user stops trusting the app. These are your most engaged premium-tier users, and the ones most likely to post "this app nags" in a review.
- **The habitual overrider** (break 3 days, cut, break 3 days) is the case that tempts escalation. Escalation doesn't change what they do, though. It only changes **what they tell you**. They have two cheap ways round it, and both are worse than an override:
  1. **Lie to it.** Sit on Maintain while still eating at a deficit. The backstop catches a falling trend, so load still accrues. But the drain, the tape and the "ON A BREAK" copy become fiction, and the coach is now advising someone who is gaming it.
  2. **Delete it.** A calorie tracker is one of the easiest apps there is to replace. Losing a user to friction costs you their data, their sub and any future chance to protect them.

An honest override keeps the user inside the model, where the next hard prompt (84) can still reach them. That's the safety argument for respecting the choice, as well as the retention one.

## How comparable products handle "user overrides the advice"

**Confident:**
- **Garmin** (recovery time, Training Status "Overreaching"/"Strained") and **WHOOP** recovery are advisory only. You can start a workout regardless, and the label just stays honest afterwards.
- **MyFitnessPal** warns when you close a diary day very low in calories. It doesn't block you.
- **MacroFactor** markets itself as "adherence-neutral": no shaming and no friction for going off plan. The user picks the goal and the rate.

**Unsure (verify before quoting):**
- Whether **Carbon** or **RP Diet** put a confirm or lock on starting a new deficit phase early. Both do recommend maintenance phases.
- **Noom**'s handling of this specific case. I have no reliable knowledge of it.

The pattern I'm sure of is **advise, record, show the consequence, never block**. I know of no mainstream fitness app that locks a goal change, though I can't rule one out.

## Store and liability angle

Friction doesn't reduce liability. **A clear warning plus the user's acknowledgment does**, and you already have that with one confirm. Stacked dialogs add nothing defensible. A hard lock is risky in its own way: it amounts to the app making a medical decision, and you've framed it as general wellness. The wellness framing is what keeps you clear of medical-device territory. Verify this against current Play Health apps policy and Apple guideline 1.4.1, and pass the wording to privacy-counsel. **The guard should be free-tier**, because safety copy must never sit behind a paywall. Premium can sell richer history of past blocks, never the warning itself.

## The ONE recommendation

**One confirm per break, for life. After "Cut anyway", the tape shows the cost in numbers, with no further friction. Settings uses the same guard.**

1. **Confirm sheet, unchanged in shape.** Add one factual line: "Cutting now: next break due in ~4 weeks instead of ~12", computed from the remaining load. The user decides with the trade in view.
2. **Tape after the override.** The fill resumes from the *undrained* level, not from empty. A small caption reads "Resumed with 60% load · break due ~4 wks" for 3 days, then goes quiet. No icon of shame, no counter of overrides.
3. **Habitual overrider.** No escalation and no cooldown. The honest numbers already escalate: load barely drains, so BREAK DUE and the hard prompt come back fast. The tape *is* the second warning.
4. **Launch blocker for v2:** the Body & goal mode control in Settings must call the same guard, or be made read-only and link to the picker. Otherwise the guard is decorative, and spec 03's "only surface" claim is false. Acceptance check: tapping Cut from Settings mid-break past the soft threshold shows the identical sheet.

**Trade-offs.** Some users will override and under-recover, and you accept that. You gain truthful data, a backstop that still works, no lying incentive, no review-bait, and a defensible warning trail. The extra cost is one computed number and the Settings wiring. A "why?" prompt sounds caring, but in practice it's a form, so skip it. If you ever want the context, let the coach ask in chat, where it's optional.
