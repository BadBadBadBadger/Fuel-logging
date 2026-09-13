# Swarm review — `features/body/02`, 2026-09-11

Six persona passes, run in order, each reading every earlier report and answering it before
adding its own findings. The brief: spec **and build** `features/body/02` — body data on the
History day rows and day detail, feedback when a measurement is saved, body data in the CSV
export. Presentation and feedback only. No new database column, no new field in any sync
payload; everything is a join by date over `weighIns[]` and `bodyMeasurements[]`.

The founder's four decisions of the same morning (`02-founder-decisions.md`) are the brief's
spine. Only **decision 4** is in scope: *every site change is shown immediately, at any size,
coloured, visual language consistent with the weight graph* — which overruled a proposed 1cm
noise threshold.

Two findings below only exist because a later hat argued with an earlier one. They are marked
**[cross-examination]**.

---

## Pass 1 — Design Lead

*Read first: the brief, `02-founder-decisions.md`, `body/01`, the three code sites.*

### What works today

The day row has a real hierarchy already: date + mode chip on top, a macro/water sub-line
under it, calories right-aligned as the one big number. That is a good list row. The day
detail is a stack of single-purpose cards (macro pie, water, foods) with consistent titles.
Nothing here needs redesigning; it needs one more thing said without the row falling over.

### What doesn't

1. **The sub-line is at its limit.** `P:180g · C:200g · F:70g · 💧6` is about 30 characters at
   11px. The phone is 400px wide inside a 500px card. Adding weight and a body-fat reading
   takes it to roughly 50 characters, which wraps. Wrapping is acceptable **only if the second
   line reads as a continuation rather than as a new, unlabelled fact.** My fix: give the body
   values the colours the History charts already use for those two series — weight in
   `--cut` (the weight line's colour), body fat in the neutral `--text-mid` (the body-fat
   line's colour). The colour change groups them, so a wrap reads as "and here is the body
   part of this day".
   Note this colour is **identification, not valence**. Neither number is a change; neither
   gets a good/bad colour. That distinction matters two passes from now.
2. **The absent case is the design problem, not the present one.** Six days in seven have no
   tape reading. If absence renders as a dash, an em-dash, a greyed "—%", or even a trailing
   separator, then the great majority of rows will read as *missing data*. They are not
   missing data; nothing was measured, which is the normal and correct state of a weekly
   measurement. **Absence renders as nothing at all** — no marker, no separator, no
   placeholder. Same rule one level down: the day detail gets **no body card** on a day with
   no body data, not an empty card explaining that there is no measurement.
3. **The save moment is under-designed, and it is the highest-attention moment in the whole
   feature.** Someone has just held a tape measure against their own body. Today they get one
   grey line: *"Estimated body fat: 22.2%"*. That is the number the app cares about and not
   the thing the person wants to know, which is *did anything move*.

### Proposal (Safe / Modern / Differentiated)

- **Safe** — append weight and body fat to the sub-line as plain text in the row colour. One
  line of code, reads as more of the same grey.
- **Modern (recommended, and what I'd build)** — the same, in the two chart-series colours,
  using the app's own `⚖️` and `📏` markers so the row's vocabulary matches the toggles above
  it. The save feedback becomes a three-line block: the estimate, then the per-site changes,
  then the longer-window body-fat figure when one exists.
- **Differentiated** — a miniature sparkline per row. Rejected: it needs a chart per row on a
  screen that already draws one chart, and it says less than the number does.

### First-use and non-happy states

- **First ever reading:** there is no previous reading, so there is nothing to compare. Say
  that in one plain line — *"First reading — your next one will show what has changed."* It
  sets the expectation instead of silently showing less than the second save will.
- **A day with body data and no food:** the History day list walks history snapshots, so that
  day has no row to hang anything on. Flagged, not solved here — engineering's problem.
- **Range switches:** the "since last month" card should not change meaning because the chart
  above it is set to 7 days.

### Scores for what I'm proposing

Genericity **4** · Delight **5** · Cognitive load **4** · Visual distinctiveness **5**.
This is a record-keeping screen. Restraint is the correct answer and a higher delight score
here would mean I had added something the screen did not need.

### Handoffs

The colour of a *change* is a health-copy question, not a visual one. → coach.

---

## Pass 2 — Nutrition Coach

*Read first: design-lead's report.*

### Response to design

Agreed on all three findings, and design's own distinction — *identification, not valence* —
is the one I want to hold them to. The moment a number becomes a **change**, colouring it is
an act of coaching, and that is mine. Two vetoes.

### Veto 1 — neck's change gets no direction colour

Design's "match the weight graph" is right for waist and wrong for neck, and the reason is in
the formula. The Navy equation computes body fat from `log10(waist − neck)` for men: a
**bigger** neck produces a **leaner** result. So "leaner is accent-green" applied uniformly
paints a *shrinking* neck red and a *growing* neck green.

For a man in a deficit that is backwards twice over. A shrinking neck during a cut is most
likely lost lean tissue or a tape sitting a centimetre higher than last week. Neither is a
result to colour red — one is a measurement artefact, the other is bad news the app should not
deliver as a colour on a Tuesday. And colouring a growing neck green is the app rewarding a
number that flatters its own estimate.

Waist is different, and so is hip under the female formula: those are fat-storage sites, and
smaller is the direction this app exists to help with. They take the weight trend's own
colours.

**So: every site's change is shown, at any size, exactly as decision 4 requires. Waist (and
hip, female formula) carries direction colour. Neck carries the number and no valence.** This
does not reverse decision 4 — decision 4 answered *"threshold or no threshold"*, and it
answered it correctly. It did not ask which sites have a meaningful direction.

### Veto 2 — no reading-to-reading body-fat change

The founder's own arithmetic is the argument. Half a centimetre of tape slip at both sites
moves the estimate ±0.67 points. A full week of genuine fat loss moves it 0.40. So a
between-readings body-fat figure is **majority noise, with the sign decided by a coin flip.**

The failure mode is not "it's a bit inaccurate". It is: a good week reads as a gain, and the
person cuts harder. That is the exact path this app exists to interrupt, and I have watched it
happen to real clients with real scales. The tape numbers themselves are a different matter —
they are the raw measurement, not an estimate compounded from two noisy inputs, and the
founder has decided they are shown honestly. I have no objection to that.

### Copy rules (standing veto on health copy)

- Never *"you lost fat" / "you gained fat"* from one reading. The site and the number:
  *"Waist -0.5cm"*. The user draws the conclusion; the app does not draw it for them.
- No praise, no celebration, no emoji reaction at save time. `body/01` already decided the
  body-fat trend is never colour-coded, and for the same reason.
- Keep the word **"Estimated"**. It is a population regression (Hodgdon & Beckett, 1984) with
  real error bars on an individual. *"Body fat: 22.2%"* would be a claim the method cannot
  support.
- When a window figure is shown, the copy must name the window. *"since last month"*, not
  *"down 0.8"*.

### Final position

Approve the feature. Two vetoes above are non-negotiable from this hat; both are one line of
code to reverse if the founder disagrees, and both are named in the spec header so he can.

---

## Pass 3 — Engineering

*Read first: design-lead, nutrition-coach.*

### Response to the two earlier hats

Design's proposal is buildable as described with no new state and no new stored field. The
coach's veto 1 is a pure-function change (`fatDirectionSites`) and veto 2 is a
*deletion* — cheaper than the thing it replaces. No objection to either. One correction to
design: the *"since last month"* figure it wants range-independent is **already** in the code,
inline in `History` as `bodyFatChangeSinceLastMonth`, and it has a bug. See finding 5.

### Data-integrity risk

1. **The join must read the FULL arrays, not the range-filtered ones.** `filteredWeighIns`
   and `filteredBodyMeasurements` compute their cutoff with
   `new Date(...).toISOString().split("T")[0]` — a **UTC** date string — while the day keys
   they would be matched against come from `todayKey()`, which uses **local** date parts.
   Under British Summer Time those disagree between 00:00 and 00:59. A row only ever exists
   for a date already in `filtered`, so reading the unfiltered arrays cannot add rows; what
   it does is make the lookup incapable of disagreeing with the list it decorates. This is the
   same class of bug the Playwright harness already carries a comment about.
2. **Nothing may be carried forward.** Measurements are weekly, rows are daily. A Tuesday must
   never inherit Sunday's reading — not on the row, not in the detail, and above all not in
   the CSV, which is the archival record. Rendering must be absence-first: the common case is
   that there is nothing.
3. **`hip` is `null`, not missing,** on every male-formula row. A truthiness check would be
   right by accident (a 0cm hip cannot exist); an explicit `!= null` check is right on
   purpose, and it is what makes a reading taken under the *other* formula still report its
   neck and waist changes.
4. **The previous reading must be captured before the save, and must exclude the same date.**
   `onMeasurement` upserts by date, so re-saving today **replaces** today's row. Comparing
   against the row being replaced would report the size of the typo the user is correcting.
   Compare against the most recent row with `date < todayKey()`.
5. **`bodyFatChangeSinceLastMonth` has a live defect** (`History`, pre-existing): it takes
   `first` from the newest reading at or before the 30-day mark and `last` from the newest
   reading overall. If **every** reading is older than 30 days those are the same row, and it
   reports a change of **0** — which reads as "your body fat has not moved in a month" when
   the truth is that nothing has been measured in a month. Replacing it with a shared function
   used by both surfaces fixes it and removes a second definition of the same window.

### Missing case

6. **CSV: the row set must be the union of history, weigh-in and measurement dates.** Today
   the export iterates `history` only. A date can have body rows and no snapshot — and this is
   not hypothetical: the two upserts are separate calls, and on **2026-09-11, in this repo, the
   history upsert failed silently while the body-measurement upsert succeeded.** An export
   that drops those dates is exactly the "lesser record" the brief warns about.
7. **Empty cells stay empty.** `0` in a `Waist(cm)` column is a measurement of zero
   centimetres. Also note today's export writes `d.water` raw, so a snapshot missing `water`
   prints the string `undefined` into the file. Fixed in passing.
8. **Units in the export.** `wChartNum` is a display concern. A column whose meaning flips
   with a UI preference is not an archive: export kilograms and centimetres as stored, and put
   the unit in the heading. The screen follows the preference; the file follows the storage.
9. **`bodyFatWindowChange` needs a formula filter,** for the same reason `bodyFatRollingAvg`
   has one: a sex change switches regressions and the two numbers are not comparable. That
   means `History` needs the profile sex, which it does not currently receive — one prop from
   `App`, no stored field. `WeighInWidget` already takes `sex` the same way.

### Needless complexity — avoided

No new state variable for "the last reading" (derive it), no memo, no storage key, no
`useEffect`. Four small pure functions and two `Object.fromEntries` lookups is the whole
feature. Anything with a date window or a formula filter goes in a pure function so
`logic.test.js` owns it; anything else stays inline in JSX where it is read.

### Cost, honestly

Correct and cheap. The only thing that is not free is the discipline: the history snapshot
must stay body-free forever, because the failure mode of adding a column is a **silent 400 on
the entire upsert**, not a visible error.

---

## Pass 4 — QA Automation

*Read first: design-lead, nutrition-coach, engineering.*

### Response

Engineering's finding 5 is a **Blocker** by my severity scale, not a nice-to-have: it is
shipped code that states something false about a real person's body. It needs a unit test
naming the case, not just a fix.

The coach's veto 2 creates a spec contradiction that must be resolved *in writing*, not by
implementation choice — `body/01` says *"any copy describing the change refers to a window,
never a single most-recent-reading delta"*, while this brief says *"show what changed vs the
last reading"*. Whichever way it lands, one of the two documents has to say why. Handing that
to Critical Thinking.

### Testability findings

1. **"Degrades quietly" is not an assertion.** It has to be restated as something observable:
   *on a day with no measurement the row renders no marker and no separator standing in for
   one, and the day detail renders no body card at all.* Both are `toHaveCount(0)`.
2. **The CSV cannot be asserted through the UI.** It is an `<a href="data:...">` click; this
   harness cannot open the result. That is a reason to change the **implementation**: extract
   the row building into a pure `csvRows(history, weighIns, bodyMeasurements)` and let
   `logic.test.js` own the shape — header, cell-by-cell, union, empties. Playwright then
   asserts only that the button exists, which is all it can honestly claim. *(Adopted.)*
3. **Colour is assertable, and this one must be asserted.** Decision 4 says *coloured*; the
   coach says *not neck*. Both are load-bearing and both are invisible to a text assertion.
   Resolve `--accent` in the page, then assert the waist span equals it and the neck span does
   not. That single test pins a founder decision and a coach veto together. It needs a stable
   hook on the spans — a `data-site` attribute, which is cheaper and more durable than a class
   name or an nth-child path. *(Adopted.)*
4. **Atomicity.** One behaviour per scenario: "weight on the row" and "measurement on the row"
   are two scenarios, not one with two Thens. The three sizes of change are one Scenario
   Outline, not three scenarios. The male/female site list is an Outline.
5. **Tag `@wip`.** Built and covered in a real browser, but not seen on a phone — the same
   state `body/01` is in. Untagging is a device-test job.
6. **Don't duplicate the arithmetic into Gherkin.** `-0.5cm` belongs in `logic.test.js`. The
   feature file says *"the change is shown with its sign"*; the unit test says what the number
   is.

### Coverage the Playwright layer needs

Day row with a weigh-in · day row with a reading · a row with neither showing neither ·
day detail card present · day detail card absent on the neighbouring day · a female reading
listing hip · a save reporting site changes and the gap · a sub-centimetre change surviving ·
waist coloured / neck not · the first-ever reading · no body-fat change at one week · a
body-fat change once a 30-day-old reading exists · the export button. **Thirteen.**

---

## Pass 5 — Critical Thinking

*Read first: all four.*

### Load-bearing claims, and whether they hold

**Claim A — "everything `02` needs is a join by date."** Held. I looked for a requirement that
needs something not in `weighIns[]`/`bodyMeasurements[]`: the gap in days comes from `date`,
the formula filter from `formula`, the estimate from `computed_bf`, the sites from
`neck/waist/hip`. Nothing is missing. Fine.

**Claim B — "absence reads as nothing measured."** Held, with one check. `📏` now appears in
three places: the weigh-in widget's status line, the History chart toggle, and now the day
row. Three uses, one meaning ("tape reading"). It is a marker, not a sentence. Fine.

### Contradiction 1 **[cross-examination]** — the brief vs `body/01`

The brief says *"when a measurement is saved, show what changed vs the last reading."*
`body/01` says *"any copy describing the change refers to a window, never a single
most-recent-reading delta."* These are not compatible as written, and the coach arrived at the
right answer for a reason that is weaker than the one available.

The coach argued from noise. Good, but it reads as this hat's judgement overriding the brief.
The stronger argument is that **the founder already decided this**, in `body/01`, and the
decisions document's own arithmetic is the evidence for why that decision was right. So the
resolution is not "the coach overrules the brief" — it is that the two documents are about
**different quantities**:

- **the tape numbers** — the raw measurement, per-reading, shown honestly at any size. This is
  decision 4, explicitly, in the founder's own words.
- **the body-fat estimate** — computed, compounded from two noisy sites, and the number that
  feeds the calorie target. Window only. This is `body/01`, already decided.

I pushed on whether that asymmetry is self-serving: a waist delta is exactly as
noise-prone as a body-fat delta (±0.5cm either way). What makes them different is not
precision, it is that the body-fat figure **compounds two** slips and is the value the app
acts on. That is a real difference, not a rationalisation. The asymmetry stands.

### Contradiction 2 — the coach's neck veto against decision 4's wording

Named, not resolved by me, because it is the founder's to resolve. Decision 4's heading says
*"every site change is shown immediately, at any size"* and its body says *"sub-centimetre
changes are shown straight away, coloured, with no special neutral treatment."* The contrast
class in that sentence is **small versus large**, not **neck versus waist** — so the coach's
rule answers a question decision 4 did not ask. But it is close enough to the founder's own
words that burying it would be wrong. It belongs in the spec header, in plain sight, marked as
a swarm decision rather than a founder one. *(Done.)*

### Unstated case 1 **[cross-examination]** — the gap is not stated

Nobody in the first four passes said how long ago the comparison reading was. Design
specified the block, engineering specified the comparison, QA specified how to assert it —
and all three would have shipped *"Waist -4.0cm"* with no indication of whether that was
since last Sunday or since the spring. `body/01`'s own header flags long-gap protocol drift as
genuinely open; stating the gap is the mitigation that is available today and costs one
clause. **The report must say how old the reading it compares against is.**

### Unstated case 2 — a change of exactly zero

Decision 4 says every change is shown at any size. Zero is not a change. Rendering `+0.0cm` is
a lie about the sign, and omitting the site silently would be a threshold at zero. The honest
rendering is the words **"no change"**, uncoloured, because no change has no direction. Note
this is *not* the threshold decision 4 overruled: that was a band of changes too small to
mention; this is the boundary between a change and no change.

### Unstated case 3 — a stale set of readings

I interrogated engineering's finding 5 rather than accepting the fix, and the fix as first
described was incomplete. Requiring "a reading at or before the window start" is not enough:
you must **also** require the newest reading to be inside the window, or the newest row is
compared with itself. Both conditions, or the bug survives in a different shape.

### Unstated case 4 — a day with body data and no history snapshot

Engineering fixed this for the CSV and left the day list unfixed, correctly (the list walks
snapshots; giving it a second row source is a bigger change than `02` justifies). But "left
unfixed" must be **stated** in the spec, not discovered later by someone comparing the screen
with the file. *(Now in the header's "deliberately not in this file".)*

### Boundary checks

Rounding: `95.3 − 94.8 = 0.5000000000000071`. Without rounding to 0.1 the screen shows
`+0.5000000000000071cm`. Load-bearing, and it needs its own unit test naming the case, not
a general "rounds correctly" test.

The 30-day window against weekly readings: the newest reading at or before day −30 will
typically be 30–36 days old, so the reported span is "about a month", which is what the copy
says. Fine.

### Fine

I tried to break the join-by-date premise and could not. I tried to find a case where the
weekly/daily mismatch produces a wrong row and could not, given the no-carry-forward rule. The
design is sound; the four findings above are all at its edges.

---

## Pass 6 — Anti-Metaphor

*Read first: all five, plus the freshly written spec, code comments and on-screen copy.*

### Ban-list sweep

| Term | Where | Verdict |
|---|---|---|
| clamp | not present in any new text | clean |
| gate (verb) | not present in any new text | clean |
| floor / ceiling | not present in any new on-screen string | clean (identifiers only, elsewhere) |

`SYNC_GATE` and `BF_SYNC_STEP_CAP` appear in the spec header only as the names of existing
constants that `02` deliberately does not touch. That is the noun form naming a specific
mechanism, with its meaning adjacent. Acceptable.

### Corrections made to this round's own output

- **"delta"** — removed throughout the spec, the code and the copy. The function is
  `measurementSiteChanges`, not `measurementDelta`; the prose says *change*.
- **"the join"** as a bare noun — replaced with what it does: *looked up by the date being
  rendered*. The header defines it in full at first use before the phrase is used again.
- **"degrades quietly"** (from the brief) — never enters the spec as a term. Restated as the
  observable condition: *no marker, no separator, no placeholder*.
- **"site"** — kept. It is established anthropometry vocabulary, it is the founder's own word
  in `02-founder-decisions.md`, and the spec's `Background` defines it adjacent at first use:
  *"a tape site" means one of neck, waist, or hip*.
- **"window"** — kept, and never travels bare: every use is *"the 30-day window"* or *"since
  last month"*, and the on-screen copy always names the span.
- **"valence"** — appears in this review and in one code comment. Removed from the code
  comment (replaced with *"colour that says whether the change is good or bad"*); left in this
  review, which is a discussion document, not a spec.

### On-screen copy, checked literally

- *"Estimated body fat: 22.2%"* — states what it is and that it is an estimate. Keep.
- *"Since your last reading, 7 days ago: Neck +0.2cm · Waist -0.5cm"* — a condition, two
  input/output pairs. Testable as written.
- *"no change"* — literal.
- *"First reading — your next one will show what has changed."* — a statement about what
  happens next, not a metaphor for it.
- *"▼0.8 pts of body fat since last month"* — names the quantity, the size and the span.

### One question rather than a rewrite (rule 5)

The day row shows `📏22.2%` with no word attached. I could not state literally, from the code
alone, that a reader will know that percentage is body fat and not something else. The
argument for leaving it is that the same `📏` marker sits directly above it on the chart
toggle, labelled *"Body Fat %"*, on the same screen. I am flagging rather than rewriting: if
the founder reads a bare `22.2%` on a row and has to think about it, the fix is a `bf` prefix,
not a redesign.

---

## Final thoughts, one from each

**Design Lead.** The thing I would defend hardest is the empty case. Six rows in seven show
nothing, and that has to look deliberate rather than broken. Everything else here is one line
of text on a list row, and it should stay that unglamorous.

**Nutrition Coach.** The neck colour is the finding I would not trade. Everything else in this
file is presentation; that one is the app telling someone in a deficit whether a change in
their body was good news. It is a small thing that says something about the product's
character, and it costs one line to get right.

**Engineering.** The discipline to hold is that the history snapshot stays body-free. Every
convenience this feature could ever want is available by date already, and the day someone
adds `waist` to the snapshot to save a lookup is the day the entire upsert starts failing
silently. The comment is at the write site, where the person about to do it will read it.

**QA Automation.** Two of my findings changed the implementation rather than the tests —
pulling `csvRows` out into a pure function, and putting a `data-site` hook on the change
spans. That is the right direction of travel: if a behaviour is important enough to decide, it
should be cheap enough to assert. Thirteen browser tests and twenty-six unit tests, with the
numbers owned by Jest and the wording owned by Playwright.

**Critical Thinking.** The most dangerous sentence in the brief was the most reasonable-looking
one: *"show what changed vs the last reading."* Applied uniformly it would have shipped a
number that is majority noise, next to a number that is not, with nothing to tell them apart.
The fix was not to argue with the brief but to notice the two quantities inside it.

**Anti-Metaphor.** The copy is short and literal and I had little to do, which is the outcome
I want. The one thing I would watch is `📏22.2%` — a bare percentage on a row is a small
reconstruction job for a future reader, and those are the ones that drift.

---

## Synthesis — what was built

| # | Finding | Hat | Outcome |
|---|---|---|---|
| 1 | Absence renders as nothing — no dash, no separator, no empty card | Design | Built; asserted `toHaveCount(0)` |
| 2 | Body values in the chart-series colours, `⚖️`/`📏` reused | Design | Built |
| 3 | Neck's change carries no direction colour | Coach (veto) | Built; `fatDirectionSites`, unit-tested, colour-asserted in the browser |
| 4 | No reading-to-reading body-fat change, window only | Coach (veto) | Built; `bodyFatWindowChange` |
| 5 | Join reads the full arrays, not the range-filtered ones | Engineering | Built |
| 6 | Previous reading captured pre-save, excluding today | Engineering | Built |
| 7 | `bodyFatChangeSinceLastMonth` reports a false zero on stale data | Engineering + Critical Thinking | **Pre-existing bug, fixed**; both conditions, unit-tested |
| 8 | CSV rows are the union of all three date sources | Engineering | Built; unit-tested |
| 9 | CSV empties stay empty; `undefined` no longer printable | Engineering | Built |
| 10 | CSV in stored units, named in the heading | Engineering | Built |
| 11 | `csvRows` extracted as a pure function so the shape is testable | QA | Built |
| 12 | `data-site` hook so the colour rule is assertable | QA | Built |
| 13 | The report states how long ago the comparison reading was | Critical Thinking | Built |
| 14 | A change of exactly zero says "no change", uncoloured | Critical Thinking | Built |
| 15 | Rounding to 0.1cm is load-bearing, with its own test | Critical Thinking | Built |
| 16 | The day list's snapshot-only limitation is stated, not silently accepted | Critical Thinking | In the spec header |
| 17 | Wording sweep; "delta" removed; `📏22.2%` flagged | Anti-Metaphor | Done; one open question |

**Decision 4 is implemented exactly as written:** every site change is shown, immediately, at
whatever size it is, in the weight graph's own colour vocabulary. No threshold was
reintroduced anywhere, in code or in copy.

**Two calls were made by this review and not by the founder** — neck's colour, and confining
the body-fat change to the 30-day window. Both are in the spec header under a heading that
says so, and both are one line of code to reverse.

**One question left open by the Anti-Metaphor pass:** whether `📏22.2%` on a day row needs a
`bf` prefix. Not guessed at; it is a founder call that takes one look at a phone.

---

# Follow-up pass — the tape chart and the tooltip, 2026-09-11

A design-lead pass with the founder, after the above was built, agreed two additions: a
`📐 Tape` chart chip, and turning the body fat % tooltip into a diagnostic. Same boundaries —
a lookup by date at render time, no stored field, no sync-payload field, no change to
`SYNC_GATE` / `TREND_MIN_POINTS` / `BF_SYNC_STEP_CAP` / the conditions note.

Design-lead and anti-metaphor were the required passes; engineering and critical-thinking were
pulled in because the brief contained an instruction that could not be followed literally, and
because the first screenshot showed something that looked like a defect.

## Pass 1 — Design Lead

### The chip row, first, because it is the constraint

Counted before designing: the controls are Kcal · Protein · Carbs · Fat · ⚖️ Weight ·
📏 Body Fat % plus the line/bar pair — six chips and two icon buttons, already wrapping to two
rows at phone width. **A seventh chip fits on the existing second row; an eighth would not**,
and once the controls take three rows they start competing with the 200px chart they control.
So this had to be one chip, and the founder's reasoning makes that the right shape anyway
rather than a compromise: the Navy formula reads waist *minus* neck, so the gap between those
two lines is the formula's own input. Splitting them across two charts would hide the one
thing that makes a reading interpretable.

Verified on a rendered phone screenshot rather than assumed: second row reads
`📏 Body Fat %` · `📐 Tape` · line/bar, with room to spare.

### The shared axis

Waist ~95, neck ~40, hip ~102 sit in three separated bands on one automatic centimetre scale.
No normalising and no second axis — either would make the distance between the lines
arbitrary, and that distance is the point. Checked against the rendered chart: the three bands
are clearly separated and nothing overlaps.

### Series colours

Waist `--accent`, neck `--text-mid`, hip `--cut`. These identify a series; they are not
direction colours, and the coach's veto still holds — nothing here says whether a change was
good or bad. Neck's neutral grey happens to read as the quietest line on the chart, which is
the correct emphasis anyway.

### What the first screenshot showed, and what it actually was

The first rendered tape chart showed three tiny stubs at the left edge and nothing else. That
looked like a real defect. It was the screenshot catching Recharts' line animation at its
first frame — the existing kcal chart screenshots in this repo have the same artefact, which
is how it was identified rather than chased. Two changes to the test, none to the app:
screenshot without the harness's full-page stretch (which triggers a resize and restarts the
animation) and wait for the animation to settle. The chart is correct.

### One honest consequence, stated not hidden

With exactly `TREND_MIN_POINTS` readings, a rolling average has a single point, and a single
point with `dot={false}` draws nothing. So at four readings you see raw lines and no average
line at all. **I am not fixing this here**, for two reasons: the weight chart and the body
fat % chart already behave identically, and founder decision 3 (average line from the second
reading, labelled with what it is built from) removes the situation entirely. It is in the
spec as a stated consequence with a pointer to that decision.

### Scores

Genericity **4** · Delight **5** · Cognitive load **5** (three lines and a tooltip is more to
read than the rest of this feature, and it is a screen you go to deliberately) · Visual
distinctiveness **6** — the three-band tape chart is the first thing in this feature that
looks like nothing else in the app, and it earns that by showing the formula's own input.

## Pass 2 — Engineering (pulled in)

The brief said: *"follow whatever body/01 and the Body Fat % chart already do, and stay
consistent with founder decision 3 (a line from the 2nd reading, labelled with what it's built
from)."* **Those two halves cannot both be satisfied today.** The body fat % chart draws its
average once `TREND_MIN_POINTS` (4) readings exist; decision 3 lowers that to 2 — and
`TREND_MIN_POINTS` is on the do-not-touch list in the same brief.

Resolved by splitting the instruction into the part that is available now and the part that
is not:

- **Available now** — *labelled with what it is built from.* Each chart row carries `avgN`,
  the number of readings its average is actually made of, and the tooltip prints `avg of
  last 4:` rather than implying a fixed count. That is decision 3's transparency principle,
  applied without touching its constant.
- **Not available now** — *from the second reading.* That is the constant itself. Both charts
  read the same `TREND_MIN_POINTS`, so when decision 3 lands it is one edit and both follow.

The other implementation note: one row builder, `measurementChartRows`, feeds the body fat %
chart, the tape chart and the tooltip. Two builders would eventually disagree about which
readings are plotted or what an average covers, and the disagreement would be invisible.

One data-integrity detail worth naming: a site's rolling average is withheld while **any**
reading in the window lacks that site. Without that, a sex change mid-window would compute a
hip average from two readings while claiming the window's count. Unit-tested by name.

## Pass 3 — Critical Thinking (pulled in)

**Hip: drawn on "the formula is female", or on "these readings have a hip"?** The brief says
the former. I argued for the latter and it was built that way. Counter-example: a user changes
sex in Profile after six months of female-formula readings. Under the brief's literal wording
the hip line disappears from readings that genuinely carry a hip measurement — history
rewritten by a profile setting. Driving it from the data (`filteredBodyMeasurements.some(m =>
m.hip != null)`) shows what was actually measured, which is what a history screen is for. This
is a deviation from the brief's wording, in service of the brief's intent; named here rather
than buried.

**"Never covers the point being inspected" is not assertable as written.** Recharts offsets
the tooltip from the cursor and flips it near the right edge, so the hovered point stays
visible — confirmed on the rendered screenshot. What a test *can* hold is the thing that
causes the problem: the card's height. Keeping the sites on one line and omitting every empty
row is the real mechanism, and both are asserted.

**Boundary check on the interval.** `readingIntervalDays` returns null for same-day and for
out-of-order dates, not 0 — so a corrected same-day entry says nothing rather than "0 days
later". And a BST→GMT crossing week is 7 days, not 7.04 rounded to 7 by luck: the unit test
names that case.

## Pass 4 — QA (pulled in)

Two of the four tooltip tests were initially **vacuous** and I caught it by reading my own
assertions: `expect(page.getByText(/days later/)).toHaveCount(0)` passes just as well when the
tooltip never appeared at all. Both now assert the card *is* showing (`Body fat 23%`) before
asserting the row is missing from it.

Hovering by a fraction of the container width also failed, for a real reason worth recording:
the chart's left margin is negative, so a fraction near the left edge lands outside the plot
area and activates nothing. The tests now hover the plotted point itself —
`.recharts-line-dot`, which on that chart is exactly the readings, oldest first.

## Pass 5 — Anti-Metaphor

Ban-list sweep over the new code, comments, spec text and on-screen copy: **clean**. No
"clamp", no "gate" as a verb, no "floor"/"ceiling" in any on-screen string.

Corrections made in this pass:

- **"diagnostic"** — kept, and defined adjacent at first use in both the spec and the code
  comment: *the raw sites behind that point, and how long since the previous reading*. It is
  not left to travel bare.
- **"valence"** — caught again in a new code comment and replaced with *"never says whether
  the change was good or bad"*.
- **"series"** — kept. It is Recharts' own vocabulary for a line on a chart and it appears
  beside `TAPE_SERIES`, the identifier it names.
- On-screen copy checked literally: `waist 93 · neck 40` (two input/output pairs),
  `avg of last 4: 22.4%` (states its own input count), `7 days later` (a measured interval).
  Nothing describes what anything is *like*.

One thing I will not call clean: **`avg of last 4:` does not say "readings"**. It is four
words shorter, which matters in a card that must stay short, and the row sits directly under
the reading it averages. I could not state from the code alone that a reader will supply
"readings" rather than "days" or "weeks". Flagging rather than rewriting — if it reads
ambiguously on a phone, `avg of last 4 readings:` is the fix and it costs one line wrap.

## Final thoughts

**Design Lead.** The chip row budget was the real constraint and it is the kind that gets
discovered too late. It is written into the spec so the next person adding a chart knows the
row is now full.

**Engineering.** The instruction that could not be followed literally was the most useful
thing in the brief, because resolving it forced both charts onto one constant and one row
builder. When decision 3 lands, this is one edit.

**Critical Thinking.** Driving hip off the readings rather than the profile is a small change
that stops a history screen rewriting history. It is the same principle as the no-carry-forward
rule from the first round: show what was measured.

**QA.** I wrote two vacuous assertions and caught them on re-reading. Worth recording, because
a test that passes when the feature is missing is worse than no test.

**Anti-Metaphor.** Two flagged, neither rewritten: `📏22.2%` from the first round, and
`avg of last 4:` from this one. Both are one-look-at-a-phone calls.

## Synthesis — the follow-up

| # | Finding | Hat | Outcome |
|---|---|---|---|
| 18 | One chip, one chart, shared centimetre axis — the gap between the lines is the formula's input | Founder + Design | Built |
| 19 | Chip row is full at seven; recorded in the spec | Design | Documented |
| 20 | Per-site raw line + dashed rolling average, same window and same rule as the other body charts | Design | Built |
| 21 | "Follow the existing chart" and "decision 3's line from the 2nd reading" cannot both hold today | Engineering | Split: `avgN` label built now, the constant untouched |
| 22 | One row builder for both charts and the tooltip | Engineering | Built (`measurementChartRows`) |
| 23 | A site's average is withheld while any reading in the window lacks that site | Engineering | Built, unit-tested |
| 24 | Hip is drawn from the readings, not the profile's current sex | Critical Thinking | Built — a deliberate deviation from the brief's wording |
| 25 | Interval is null for same-day and out-of-order dates, not 0 | Critical Thinking | Built, unit-tested incl. a BST boundary |
| 26 | Two vacuous tooltip assertions | QA | Fixed — both now prove the card is showing first |
| 27 | Fraction-based hovering lands outside a negative-margin plot area | QA | Fixed — hover the plotted point |
| 28 | The "stub at the left edge" screenshot was the animation's first frame, not a defect | Design | Test-only fix; app unchanged |
| 29 | `avg of last 4:` may not read as "readings" | Anti-Metaphor | Flagged, not rewritten |

**Still not built, on purpose:** the per-reading conditions note in the tooltip. It is the
strongest line the tooltip could carry — it is what separates a real change from a protocol
difference — and it needs decision 2's `note TEXT` column against the live database first.
Named in the feature file's tooltip section so it is not lost. Nothing in this round reads or
writes a note field.
