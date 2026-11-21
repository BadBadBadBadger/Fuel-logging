# 04: Engineering / data integrity: "Cut anyway"

**Verdict:** keep one confirm, with no counter and no cooldown. The guard is mostly sound. The bugs are in the code around it.

## What "Cut anyway" does today (verified)

- **Tap path.** The Cut chip opens the confirm only if `cutGuard` is set (app.jsx:4366). "Cut anyway" calls `setMode("cut")` (4394) and nothing else.
- **When the guard fires.** It checks `breakLoad`, the load **when this break began**, not the block's peak. It fires only if that is ≥ soft (1453-1457).
- **Load.** The next cut day adds to what is left undrained and **zeroes `breakLoad`** (1300-1307). The next break re-reads it from the current load (1315). Credit already earned stays.
- **Block start.** `start` is never reset, so the weeks count includes break days (1419).
- **Snoozes.** "Cut anyway" leaves them alone. `startDietBreak` had cleared them (7823), so a nudge reappears right away if load is ≥ soft.
- **Next prompt.** There is no timer, only live load against the thresholds (1402). Example: 84 load, 3 rest days, leaves 66. That is already past soft, so the nudge shows at once. The hard prompt returns in about 18 days at a 20% deficit, instead of 84.

## Bugs and loopholes

1. **BUG: the prompt shows during the break.** `cutPromptFor` gates only the stall on `cutting` (1400), not the level (1402). After "Start a 2-week break", load is still ≥ hard and the snoozes are cleared, so "TIME FOR A DIET BREAK" stays up on Maintain (4714). With `bigLoss`, `startWeight` survives the break, so the card stays for the whole break. Fix: return null when `!cutting`.
2. **BUG: multi-device double-count.** The pull takes the cloud's `load`, but `lastAccrued` comes from the stale local blob (1817-1822). Accrual then replays days already counted (1336-1347, 7780). A phone idle for 5 days counts those days twice, over-crediting rest or over-filling the cut. Fix: sync `last_accrued`, or set it to today on pull. The guard itself syncs correctly (1811-1817).
3. **Route around the guard: custom target.** A typed target below maintenance (4281-4284) makes `effectiveMode` "cut" (7645-7647) without the guard. The v2 Settings mode control would be a third route. Fix: send every mode change through one guarded `requestMode(m)`.
4. **Loophole: same-day credit.** A day's mode is fixed at its first accrual (1338). So "Maintain at bedtime, open the app, Cut anyway" earns a rest day while eating at a deficit.
5. **Laundering by short breaks.** Each off-day drains `breakLoad/14`, so load settles where `L/14` equals the load added between breaks:
   - Alternating Maintain/Cut day by day settles at about 14. The guard re-fires about 5 times, then the user is never prompted again.
   - Weekday cut plus weekend Maintain settles at about 35, below soft for good, with no gaming at all.

   The trend backstop is implemented: Maintain while losing ≥0.25%/wk counts as cutting (7750-7756). It closes this gap **only for people who weigh in**. Coach's call; one cheap fix is draining only from the 2nd consecutive rest day.

## Options

| Option | Build cost | Risk |
|---|---|---|
| Keep as is | 0 | Ships bugs 1 to 4 |
| Stronger confirm on repeat | Override counter, needs a synced column | Extra state. Repeats already re-fire |
| Cost on the tape | Pure function, nothing stored | Estimate moves with the deficit |
| Cooldown | Timer plus sync | Locks the user out. Spec rejects it |
| No guard | Removes about 10 lines | Loses spec 03:362 |
| Ask why | Stored field nothing reads | Needless. Privacy surface |

## Recommendation

**Keep the single confirm, add an honest cost line, and fix bugs 1 to 3.**

The estimate is `ceil((th.hard − load) / dayCutLoad(targets.kcal, effectiveTDEE) / 7)` weeks, against `th.hard / dayCutLoad / 7` for a full recharge. Label it "at today's deficit". Show "now" when load is ≥ soft. Note that a 5% loss or a stall can bring it sooner. Calculate it every render; never store it.

**Trade-offs:** no migration, and repeat behaviour falls out of `breakLoad`. But the estimate is approximate, and loophole 5 stays open for users who do not weigh in.
