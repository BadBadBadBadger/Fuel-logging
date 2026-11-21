# 02 — Coach hat: what History is for

## Recommendation
People open History to answer four questions: **Am I actually losing (or gaining)? Did this week count? What did I eat that day, and is it right? Is the app's number learning me?** The v1 screen answers none of them at a glance. It offers 6 ranges × 7 metrics × 2 chart types (84 views) and leaves the user to build the answer. Replace it with **one scrolling screen and no tabs**:

1. **Trend (top).** One weight line that is smoothed, plotted on true dates, with raw weigh-ins as faint dots and no interpolated curve between them. The headline is a rate in neutral ink: "−0.4 kg a week · last 4 weeks". A second line reads "Maintenance ≈ 2,740 · learning" (or "settled"). That second line answers the TDEE question without a chart.
2. **Weeks (default view, newest first).** Each row is a rolling 7-day block ending yesterday, so **the top row is Today's "Last 7 days" exactly**: the same lamps, the same verdict copy (`V2_WEEK_VERDICT`), and "6 of 7 days logged". Then average kcal, average protein, and that week's average weight. Nothing else.
3. **Tap a week** to open its day rows: date · day type · kcal · ›. **Tap a day** to open the day: meals, plus the day's mode and target, editable (FL-010, `history/02`), plus water.

That's the smallest set: one trend, one weekly read, and one day drill-down. The default is Weeks with the Trend card above it.

**Cut:** range tabs (all 6), metric chips (all 7), the line/bar toggle, the kcal/macro chart, the day pie, the DAILY AVERAGE tiles (the weekly rows replace them), carbs and fat averages, the per-row P/C/F line, and the 💧/⚡/⚖️/📏 glyphs. CSV moves to Settings › Account & data › Download my data, which already exists (§6). Body fat and tape charts move behind the Measurements row; they don't belong in the default view.

## Verification against the code
- **The trend is invisible for the owner.** The `weightTrendKg` (app.jsx:787) needs ≥2 readings in *each* of two 7-day windows. `rollingWeightMean` (:772) needs ≥3 in 7 days to draw the ROLLING line. The owner has 6 weigh-ins in 30 days, so the screenshot shows **only raw readings**, drawn `type="monotone"`. One 100.1 reading on 24/10 carves a 2.6 kg swoop that never happened. The note "6 weigh-ins in view. Two weeks of weigh-ins and this shows which way you're going" sits under 30 days of data. Settings offers a **weekly** weigh-in reminder (§6), so a weekly weigher can never see a trend. That is the single biggest failure. The trend has to work from sparse readings: a line fitted through every reading in the last 4 weeks, shown from 3 readings spanning ≥10 days. The exact method is for Eng.
- **Judgement colours.** The macro tiles reuse mode tokens (protein `--cut` blue, carbs `--warn` amber, fat `--bulk` orange; :6085). Amber is the app's *only* signal colour (Direction), so amber carbs read as a warning. The day detail scores Maintain days with `calorieDayScore` (:6415, :507), which returns amber "Under-eaten" on a Maintain day. That breaks D19 once it's in v2. It is also FL-003's "contradiction" generator.
- **D18 isn't specced or built.** `07-gauge.feature` defers "saved to History as Maintain/Bulk" to `dashboard/08`, which doesn't exist. `v2WeekRead` (:8093) reads `h.mode` as stored. History must show the *saved* type, and the week row must count it the way §7.2 does (rest that drains load).
- **Break days aren't in History.** Banking lives only in the tape (`V2_BANK_FRAC` :8200, :8216). The day rows should reuse the same three states: banked (solid), under (hatched), pending (dashed), with W8/W9 as accessible labels.
- **Keep:** date-named windows (FL-005), averages ending yesterday (FL-001), the date spine (FL-009), past-day mode/target editing (FL-010), and an uncoloured weight figure (FL-002).

## Cases
- **Weekly weigher (the owner):** sees "−0.3 kg a week · last 4 weeks" from 4–5 readings today, instead of a swoop and an apology.
- **Salty Saturday, +1.4 kg on the scale:** a faint dot jumps and the line barely moves. The headline doesn't change. This is the main reason History exists: it shows the trend so the scale can't scare people.
- **D18 day (Cut lit, ate 2,800 against M 2,741):** the day row reads "Maintain". The week verdict comes from the saved types. No red day appears in History, because Today already showed red while it mattered.
- **On a break:** the week row shows its days as banked, hatched or dashed, matching the tape. One under day is neutral. Copy follows W4/W5 priority and History adds no new sentences.
- **Abandoned log (FL-007):** the day shows its kcal at face value. There's no "incomplete?" flag and it isn't dropped from the average. Hiding low days hides under-eating.
- **New user:** Trend reads "Your trend starts after a few weigh-ins over 10 days." Weeks reads "Still filling in." (Today's copy). No 0 kcal, no NaN (FL-008).
- **Mis-set day (FL-003):** the user taps into the day and changes the mode. The week re-reads. No warning banners.

## Never
- Never draw daily weight as the headline or as a curve. Raw readings are dots and the trend is the line.
- Never colour weight change, kcal or macros good/bad. A rise on a bulk is the goal, so colour would lie. Amber is reserved for the cut-day bands already on Today (D17), and Maintain/Bulk stay neutral (D19).
- Never show a streak, a "days missed" count, or a red unlogged day in History. Unlogged is a dashed gap, never a failure.
- Never show a week verdict that disagrees with Today's "Last 7 days" for the same dates.
- Never forecast ("goal by 3 March") or project a rate forward. That turns a trend into a deadline.
- Never chart the TDEE adjustment. A wobbling line invites people to chase it; one line of text is enough.
- Never use emoji (D12), essays or sums (§2.5). Copy is one line per card.
