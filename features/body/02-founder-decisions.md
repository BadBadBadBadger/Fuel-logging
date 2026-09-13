# Founder decisions — body measurements, 2026-09-11

Taken directly with the founder, one at a time, after a week of real use surfaced the problem
these all circle: **a half-centimetre of tape wobble is worth more than a week of real progress.**

## The number that drove all four

Worked against the app's own `navyBodyFat`, at height 178cm, neck 40cm, waist 95cm:

| What happened | Body fat reads | Change |
|---|---|---|
| Baseline | 22.23% | — |
| Waist tape sits 0.5cm low | 22.57% | +0.34 pts |
| Neck tape sits 0.5cm high | 22.57% | +0.34 pts |
| Both slip, opposite ways | 22.90% | **+0.67 pts** |
| Both slip, same way | 21.55% | **−0.68 pts** |

**A full week of genuine fat loss — half a kilo of actual fat — moves body fat 0.40 points.** So a
single sloppy session manufactures more apparent change than a week of real progress, and it is a
coin flip which way it points. A month of real change is 1.61 points, which clears the ±0.67 noise
band comfortably — which is why the existing 30-day window on the History card was the right choice.

The founder independently observed this in use ("I also saw the noise with half cm differences
today") before being shown the arithmetic. Lived evidence first, numbers second.

---

## DECIDED 1 — the first measurement is believed in full

**Applies from reading one, both directions, no easing in.** `BF_SYNC_STEP_CAP` resumes from the
second reading onward, once there is a genuinely measured prior worth defending.

Reasoning, in the founder's own terms: the number being replaced was only ever a guess, so there is
nothing to protect. Costs, measured against the calorie target at 98.5kg:

| What the app works from | Body fat | Daily target | Error vs measured |
|---|---|---|---|
| Clean measurement | 22.2% | ~2785 | — |
| Measurement with both tapes slipped ½cm | 22.9% | ~2764 | **21 kcal/day** |
| Default guess for a man (18%) | 18.0% | ~2908 | **123 kcal/day** |
| The app's own "use 25% to start" hint | 25.0% | ~2703 | **82 kcal/day** |
| A properly botched reading (tape 5cm out) | 25.5% | ~2688 | **97 kcal/day** |

`SYNC_GATE = 4` was spending four weeks preserving a guess wrong by 82–123 kcal/day, specifically
to avoid a measurement wrong by 21. Even a badly botched first reading costs about what the guess
already cost. There is no version where waiting wins.

A sex change re-enters this path cleanly: old-formula readings age out, `bodyFatRollingAvg` returns
null, and the next reading is treated as a first one again.

## DECIDED 2 — the conditions note is saved with each measurement

Per-reading, **autofilled from the previous reading, fully overwritable**. Leaving it untouched is
an implicit "same conditions as last time" at zero cost; changing it is a real signal.

Found because the founder could not change it at all: the field renders and saves only when
`isFirstEver`, then displays read-only as *"You usually measure: …"* forever.

Why per-reading rather than one editable standing note: the founder measured at lunch one day and
after a fasted gym session the next. Fed-and-hydrated versus fasted-and-depleted is very plausibly
the half-centimetre. **The note is the diagnostic that separates a real change from a protocol
difference** — which only works if it travels with the reading it describes.

**Needs a database column first** (`note TEXT` on `body_measurements`) — nullable, additive. Also
worth capturing time of day automatically; the table stores `date` but not time, and it is a real
correlate for exactly this.

## DECIDED 3 — the average line draws from the second reading

`TREND_MIN_POINTS` drops so the line appears the moment one can exist (two dots), and steadies as
readings accumulate. **It must state what it is built from** — "avg of last 2", "avg of last 3" —
never claiming four readings when it has two.

Consistent with the founder's own call on the weekly intake summary two days earlier: transparency
over suppression, "based on 5 of 7 days logged" rather than hiding a thin week.

Note the asymmetry with weight: the weight chart's 3-reading minimum costs three *days*, because
weigh-ins are daily. The same rule on weekly measurements costs three *weeks*.

## DECIDED 4 — every site change is shown immediately, at any size

**Founder overruled the proposed 1cm threshold.** Sub-centimetre changes are shown straight away,
coloured, with no special neutral treatment.

Founder's reasoning, verbatim: *"even sub cm measurements count, just show it straight away because
the average line will cut through the noise. keep ui consistent with weight graph."*

This is the better rule and it supersedes the threshold proposal. The raw number is the raw number
and is shown honestly; **the average line is the thing that says whether it is real.** Splitting
that job across two places — a threshold hiding small numbers *and* an average smoothing them —
would have done the same work twice and made measurements behave unlike weight for no reason.

Visual language matches the weight graph throughout: raw points plus an average line on the chart,
accent colour for the good direction.

---

## Scope boundary for `features/body/02`

`02` is **presentation and feedback only**, the same split `dashboard/04` (logic) and `dashboard/05`
(card layout) already established:

- weight and measurements on the History day rows and in the day detail
- what changed, shown when a measurement is logged
- body data carried into the CSV export

**Decisions 1–3 are NOT in `02`'s scope.** They change `body/01`'s engine and its stored shape, and
decision 2 needs a database column run before any code writes it. They are decided and recorded
here; they are separate work.

**No new database columns for `02`.** Weight lives in `weighIns[]`, measurements in
`bodyMeasurements[]`, both keyed by `date`, and the history snapshot carries neither. Everything
`02` needs is a join by date at render time — no migration, no new sync payload fields.
