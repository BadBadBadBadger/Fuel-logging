# 04 — App consultant: how much History does v2 actually need?

**Verdict: half the current controls should go. History v2 is one weight trend, one intake summary and a day list, with one range control. Release 1 is a reskin that only removes things. Release 2 is a weight chart done properly. Everything else gets deferred or moved, and stays there until someone other than the founder asks for it.**

Verified in the repo: the v1 screen (app.jsx ~6081–6865) has **6 range chips, 7 metric chips, a line/bar toggle and a CSV button**: 15 controls before any data. The screenshot (`now-history-v113.png`) uses 7 emojis (📥 ⚖️ 📏 📐 📈 📊 💧 ⚡). The bug report names the founder as **the sole user**, so "used vs vanity" can't be measured. I've answered it from category norms, and I'd rather the chair ruled on that than on anyone's taste.

## How strong trackers do it (from memory; no web check)

**Confident:**
- **MacroFactor** splits it up. Weight trend gets its own view: raw points faint, a smoothed trend line bold, and a single headline for "trend change over period". Intake gets a separate weekly view. The ranges are a short list (1W/1M/3M/6M/1Y/All) in **one** control. There are no chart-type toggles.
- **Happy Scale** is the reference for weight alone: one smoothed line, one or two headline numbers (trend and rate per week), and a range control. It is calm because it does only that.
- **Cronometer** is the counter-example. Charts and trends are powerful but buried in a separate Trends/Reports area, and many reviewers find it dense. That is what our v1 looks like.

**Unsure:** how Carbon lays out its history and check-in screens. I don't recall it well enough to cite.

What the good ones share: **weight is shown as a trend, not as raw readings.** Each screen gets one range control, has no chart-type switch, and leaves export in settings.

## Feature by feature

| Feature | Call | Why |
|---|---|---|
| 7 Days / 30 Days / 3 Months | **Keep**, as one segmented control in the a2 style (like the mode lamps) | They cover nearly every question a dieter asks |
| Year / All Time | **Cut both to one "All".** "Day" goes too, since it duplicates tapping a row | The 1Y and All charts are nearly the same picture at phone width |
| Kcal / Protein / Carbs / Fat chips | **Replace** with one intake summary (the existing average card, restyled in v2 type) plus one kcal bar strip against target | The four averages are the thing the user wants. Four charts aren't |
| Line / bar toggle | **Delete** | Pure vanity. Kcal is bars and weight is a line. Settle it once |
| Weight | **Keep, and make it the hero** of release 2: faint dots, smoothed line, one headline (01 L200 "two whole weeks") | It's the only chart that gives an answer |
| Body Fat % / Tape tabs | **Move.** They belong behind the Measurements row on Today (a2 already has "Neck 40 · Waist 95 · Log"). Tapping it opens the measurement history | Weekly tape data is too sparse to warrant a top-level tab, and it's niche |
| CSV | **Move** to Settings › Account & data, next to "Download my data · JSON" (app.jsx 9261), as a second format | Export is a once-a-year action, and it shouldn't take the header's best slot |
| Daily averages | **Keep.** It's the core number (FL-001) | The FL-001/008 fixes must survive the reskin untouched |
| Past-day mode chips and target (02 feature) | **Keep**, in the row's detail sheet | It's real correction work, and it isn't decoration |

## Release plan

**Release 1 (removal and reskin, no new charts):** v2 header with back arrow and title, no CSV. One range control (7D/30D/3M/All). The averages card in v2 type. The existing weight line restyled, with no emoji labels. The day list as a2 meal-style rows: date, mode as a text label, kcal on the right, macros in the small line, no 💧 or ⚡. Body Fat %/Tape go behind the Measurements row, and CSV moves to Settings. This is mostly **deletion**, so it's cheap, and it answers "terrible, not in keeping, too many emojis" directly.

**Release 2 (only if release 1 sticks):** a proper weight hero (trend, rate per week, raw dots faint) and the kcal bars against the target line.

**Deferred with no date:** macro-by-macro charts, Year range, body-fat trend on History, comparing periods, anything "insight"-flavoured.

## Fold into Today?

**Partly, and it's already done.** Today's "Last 7 days" strip (app.jsx ~8083) *is* the glanceable history. Make the whole card a tap target that opens History at 7D, and drop nothing from Today. **Don't** fold any more in. Today is already long (a2 runs to 10+ sections), and a weight chart on Today would compete with the gauge. Keep the History icon in the header. A separate screen is right for a deliberate "how am I doing" check, which is a weekly habit, not a daily one.

## What the other hats will gold-plate

- **Design** will want a bespoke gauge-like chart ("instrument" weight dial, tape-style bars). Don't. Plain bars and one line in v2 tokens are enough for release 1.
- **Coach** will want body fat, rate warnings and week-over-week insight cards on History. Those belong to the coach and Today, not to a log.
- **Eng** will want a chart-library swap or a shared chart component first. Restyle the existing SVG. A rewrite isn't a prerequisite.

**Trade-offs.** Power users lose Year, macro charts and the bar/line choice. CSV is one more tap away. In return you get a screen with about 4 controls instead of 15, no emojis, a visual match with Today, and a release-1 diff that is mostly red. If a real user asks for macro charts after launch, that's a demand signal. Until then they're a founder's itch.
