# 01 — Coach hat: back to Cut before the break drains

## Recommendation
**Keep the rule: one gentle confirm, respect the choice, pro-rata credit.** Add three changes. (1) Make "Cut anyway" actually quiet. (2) Reword the copy around what the rest has earned. (3) No second confirm, no cooldown, no "why?". If someone keeps returning early within one block, change the *copy* once. Don't add friction.

## Verification
The brief matches `stepCutBlock` app.jsx:1298 (pro-rata from `breakLoad`, which resets on any cut day), `cutGuardFor` :1453, the chip guard :4366, and spec 03 lines 57–61 and 362–388. It misses two things:
- **Double-ask bug.** `startDietBreak` clears `nudgeAt` and `snoozeAt` (:7823). Break at 84, return on day 3: load is 66, still at or above the soft threshold of 56. So the amber nudge reappears straight after "Cut anyway". `block.start` survives the break, so a block that hit `BLOCK_LOSS_TRIGGER` brings back the **hard** prompt too. That breaks spec 03's "no further friction". Fix: "Cut anyway" sets `nudgeAt = snoozeAt = now`.
- **The Settings mode control.** Take mode out of Settings, so there is one surface and one truth.

## What a partial break really does
- **Well-established:** long, deep restriction drives adaptation. MATADOR (Byrne 2018) used **2-week** maintenance blocks: better fat loss, less adaptive thermogenesis. The subjects were men with obesity. It says nothing about 3 days.
- **Reasonable:** shorter rests help too. ICECAP (Peos 2021) used 1-week breaks, and 1–3-day refeeds (e.g. Campbell 2020) show modest benefits for lean mass, mood and training. Glycogen and mood bounce back within days. NEAT and hormones probably recover more slowly.
- **Unknown:** the shape of the recovery curve. A straight line is bookkeeping, not biology, and probably over-credits 3 days slightly.

**Is pro-rata honest?** Yes as accounting, provided copy never claims "21% recovered" as physiology. Withholding credit makes short rests feel worthless, and that teaches people to skip maintenance. I once told a client a short break "doesn't count". She never took another. Pro-rata also limits itself: a 4-days-cut, 3-days-rest pattern settles well below the nudge. That's sensible intermittent dieting, not a loophole.

## Cases
- **3 days:** a real dent, but most of the load remains. One confirm, then silence. The next nudge arrives sooner because that's what happened, not as a penalty.
- **10 days:** load is ~24. Acknowledge the work: "4 more days would finish it."
- **Repeated:** the maths copes. The risk is psychological. Fleeing maintenance again and again can signal fear of eating at maintenance, a recognised disordered-eating pattern. On the **third** early return in one block the confirm's copy changes to a signpost: same buttons, same weight.
- **Real reasons:** a holiday or an event are an adult's call. Making weight for a sport (dehydration, acute restriction) is not something the app should optimise. The signpost covers it.
- **Gaming:** there's nothing to win. The load stays honest.

## Never
Shame ("you broke your break"), block, put a timer on the Cut chip, nag after "Cut anyway", ask *why* (it's interrogation), or forecast loss ("next break in 4 weeks instead of 12"). That turns rest into debt.

## Copy
**Standard confirm:**
> **Back to cutting already?**
> Your 3 rest days count and they're banked. About 11 more would recharge you fully. Your call.
> [Keep resting] [Cut anyway]

**10+ days:** "You're nearly there. 4 more rest days would finish this break. Your call."

**Third early return in a block:**
> **Maintenance feeling hard?**
> That's common, and worth noticing. Short breaks still count. If eating at maintenance feels stressful, a registered dietitian can really help.
> [Keep resting] [Cut anyway]

**Toast:** "Cutting again. Your rest is banked."

**Tape:** fills from the residual in the normal colour. For 3 days it shows "CUT LOAD · 3 REST DAYS BANKED". No amber below the nudge threshold, no cost forecast.

## Trade-offs
- **Gains:** respects autonomy, keeps "nothing to fail at", gives honest credit, and adds a safeguarding net without punishment.
- **Costs:** short breaks are slightly over-credited. One per-block counter is needed (local-only is fine). Some users will never rest fully. Even so, a rest someone actually takes beats an ideal one they skip.
