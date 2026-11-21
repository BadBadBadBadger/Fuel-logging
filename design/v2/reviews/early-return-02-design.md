# 02 · Design lead: going back to Cut mid-break

**Position.** The rule is right: ask once, then respect the choice. The weak part is what happens *after* the confirm. The real cost (a shorter next block) is invisible today, so the confirm has to do all the persuading, and that is where nagging starts. Move the honesty onto the tape, which is always visible, and the confirm can stay small. Don't ask "why?": it's a form, it judges, and a holiday or a weigh-in needs no defence.

**Audience.** Day 3: most load still held, so the cost is large. Day 10: about 71% drained, so the cost is small. The copy should scale with the real number, not with a fixed amount of guilt.

## Options

**Safe: keep today's inline confirm** (app.jsx ~4381). Amber "BACK TO CUTTING ALREADY?" card under the lamps, "Keep resting" / "Cut anyway". It works, but it pushes the workout card down, it's amber when this isn't a warning, and the cost stays abstract ("9 more rest days").

**Modern: compact bottom sheet, same grammar as the break sheet.** Kicker `ON A BREAK · DAY 3 OF 14` in teal mono. Title "Back to cutting?". Body: "You've recharged about 20%. If you cut now, your next break is due in about **5 weeks** instead of 12." Primary (teal fill) **Keep resting**; secondary (slate outline) **Cut now**. Footer: "Your target moves to your cut target, about 2,241 kcal." No close X; a swipe down counts as Keep resting. *Trade-off:* it's a modal, but it's one the user started and it uses one tap.

**Differentiated: no dialog, the tape previews it.** Tapping CUT arms the lamp: CUT outline pulses amber once (no glow), and the tape shows the outcome before you commit, with a ghost fill and the label `CUTTING NOW · BREAK DUE IN ~5 WK`. A second tap on CUT (or on the inline label "Cut now") commits. The lamp disarms after 4 s. *Trade-off:* it's beautiful and teaches the tape, but two-tap arming is hard to discover, needs extra TalkBack wording, and a stray tap looks broken. It's a sketch until we test it.

## Recommendation: Modern sheet plus an honest tape after

**After "Cut now"** the CUT lamp lights. The tape stays put and **resumes from its partly drained level**: amber-grey fill at 80%, plus a **ghost marker**, a hairline teal tick at the level a full break would have left (0), labelled `IF RESTED` in 9px mono beneath. Right label: `BREAK DUE IN ~5 WK`, an estimate at the current deficit, recomputed daily. It replaces the plain week count only while undrained load remains. The ghost marker disappears once the fill passes the nudge point; the comparison has done its job by then. A toast, once: "Cutting. Next break due in about 5 weeks." That's it, with no badge, no red, and nothing on later days.

**Repeat offender** (break 3 days, cut, break 3 days, cut...). No second confirm, no cooldown, no escalating copy. Friction that grows with each use teaches people to ignore it or to leave the app. The honesty grows instead: the sheet body adds one factual line when this is the third early return in 8 weeks, "Short breaks haven't cleared your load since 12 Oct." The tape's label shortens naturally (`~2 WK`), and at full the existing hard prompt does its job. Hand off to the coach on whether a 3rd-return line should mention the risk; I'd want to test the wording.

**Gaming it** (a 1-day Maintain to reset): pro-rata credit already defeats it. The tape shows 93% and the user can see it didn't work. No design needed.

**Settings path.** Settings › Body & goal must not have its own mode chips. Spec 03 says the mode picker is the only control, and a second one means two guards to keep in sync. Replace the chips with a read-only row: `MODE   MAINTAIN · ON A BREAK  ›`. Tapping it closes Settings and moves the focus ring to the lamps. Goal weight, pace and activity stay editable there.

**States to mock up.** (1) Day 3 sheet. (2) Day 10 sheet ("about 70% recharged... due in ~10 weeks instead of 12"). (3) The tape after Cut now, with ghost tick and `BREAK DUE IN ~5 WK`. (4) The 3rd-return sheet line. (5) The Settings read-only row. Below the soft-nudge level there's no sheet, as today.

**Accessibility.** The sheet's buttons are at least 48dp and sit in the thumb zone. The tape's label is the screen-reader text ("Cut load 80 percent, break due in about 5 weeks"). Check teal #7cbfb4 against the slate surface for 3:1 as a UI element; the ghost tick relies on its label, not its colour.
