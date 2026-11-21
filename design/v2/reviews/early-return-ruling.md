# 05: Ruling. Going back to Cut before the break has drained

Chair: Critical Thinking hat. Every `app.jsx` line cited was re-read at `b229d45`.

## 1. The core rule stays. The build does not deliver it.

All four hats agree and it held under attack. The build fails it:

- **The confirm is not "one" today.** After "Cut anyway" the nudge appears straight away, and the red card can too (bugs a and b).
- **New hole: the first day of a break is unguarded.** `breakLoad` is set only on the first rest day (`1325`). `cutGuardFor` reads `block.breakLoad || 0` (`1456`). So tapping Cut on the day the break started skips the confirm. Fine as an undo; the spec should say so.
- **No copy may state a percentage recovered** (`02`'s "recharged about 20%"): pro-rata is bookkeeping, and spec 02 forbids load on screen.

## 2. Forecast or no forecast

**Coach's case:** the person most at risk reads "3 weeks" as permission, and "instead of 12" turns rest into a debt.

**Design, consultant and eng's case:** a confirm showing only the benefit isn't informed consent.

**RULING: a forecast goes in the confirm sheet only, never on the tape afterwards.** Before the choice it is a fact; after it, a countdown is the debt framing the coach rightly rejects.

Honesty requires four things; every draft failed one:

1. **Use the cut target.** Eng's formula uses `targets.kcal`. During a break that is maintenance, so `dayCutLoad` is 0 and the forecast is infinite.
2. **Forecast the reminder the user will actually see: the soft nudge.** That is `(th.soft − load)/dayLoad`, compared with `th.soft/dayLoad`, not the hard threshold's 12 weeks.
3. **Say "in a few days" instead of a number when a prompt level is already met.** That is any time load ≥ soft, or `bigLoss` (`startWeight` survives the break). Worked example, 84 load at a 20% deficit:
   - Back on day 3: load is 66, already past soft. The honest answer is "a few days", not `02`'s ~5 weeks or `03`'s ~4.
   - Back on day 10: load is 24, so about 5 weeks against about 8.
4. **Label it an estimate:** "about", whole weeks, "at your cut target", computed at render, never stored.

## 3. The repeat overrider

**One factual line, always shown, with no counter.** It needs no new state, because `block.start` is already synced.

A count is not a symptom: the app cannot tell a sport schedule from fear of maintenance. Signpost copy belongs with file 05's self-report check, where spec 03 already moved symptom-linked copy.

## 4. The loopholes

**Accept them, and hand them to the coach and the owner.**

- **Weekend Maintain** settles at load 35: pro-rata as designed, and bounded, because the block never closes so the stall and 5% checks still fire. Both need weigh-ins, so **the real gap is a weekend-off user who never weighs in: never prompted.**
- **Eng's fix (drain only from the second consecutive rest day)** changes a locked figure: 3 rest days from 84 would leave 72, not 66. That makes it the owner's call (Q1).

## 5. Bugs

| | Verdict | Line read |
|---|---|---|
| (a) | **CONFIRMED** | `7823`: `saveCutBlock({ ...cutBlock, nudgeAt: null, snoozeAt: null })`. "Cut anyway" (`4394`) only calls `setMode("cut")`. Back on day 3, load 66 ≥ soft, so the nudge reappears at once. |
| (b) | **CONFIRMED** | `1400-1402`: `cutting` gates only `stalled`, and `level` reads load regardless. The card renders at `4669`/`4714` with no mode check. Straight after tapping "Start a 2-week break", load is still 84, so "TIME FOR A DIET BREAK" stays on screen. |
| (c) | **CONFIRMED** | `1819-1822`: `{ ...localBlock, start, load, breakLoad, offRun, lastBreakEnd }` keeps a stale local `lastAccrued`. `syncCutBlock` (`1606-1618`) never writes it, so `accrueCutBlock` (`1338-1346`) counts days the cloud load already holds. |
| (d) | **CONFIRMED** | `7645-7647`: a `customKcal` below maintenance makes the mode "cut". `saveCustomKcal` (`7326`) has no guard. |

**(a) and (b) are one root cause seen from two sides:** clearing the snoozes, plus a level check that never asks about `cutting`. They still need **two** fixes, because after "Cut anyway" `cutting` is true:

- **(b):** return null at `1402` when `!cutting`.
- **(a):** "Cut anyway" sets `nudgeAt = snoozeAt = now`. The hard card then returns after 3 days, as its own contract says.
- **(c):** sync `last_accrued` (column first). **(d):** `requestMode`, below.

**Settings (the owner's decision):** every mode change goes through one guarded `requestMode(m)`. That covers the lamps, Settings, and committing a custom target that starts a cut.  A static test, in the `styles.test.js` pattern, should fail if anything else calls `handleSetMode`/`saveMode`.

**The risk the owner accepts:** spec 03 decision 3 and the comment at `4360` must be amended, and any future Settings edit calling `saveMode` directly silently reopens (d); only that test would catch it.

## 6. Final copy

**Confirm sheet**

- **Headline:** Back to cutting already? (spec 03's locked copy)
- **Sentence, below threshold:** About 4 more rest days would finish this break, and if you cut now the next break reminder is likely in about 5 weeks at your cut target.
- **Sentence, at threshold:** About 11 more rest days would finish this break, and if you cut now the break reminder will be back in a few days.
- **Factual line:** This block began on 14 Jul.
- **Buttons:** [Keep resting] (primary), [Cut anyway]

**Tape after "Cut anyway":** CUTTING · WEEK 13. No forecast or caption. The fill resumes at its true level, amber at once if ≥ soft. The fill is the cost.

The week count includes rest days (`start` is never reset, `1419`); say so in the spec.

## Questions only the owner can answer

1. Should a single rest day drain at all? Draining from the second rest day closes the weekend gap but changes the locked "84 → 66".
2. Do you accept a forecast in the confirm sheet, under §2's four conditions, over the coach's objection that any number becomes an allowance?
3. Build file 05's self-report check first, so the signpost has a home, or leave it queued?
