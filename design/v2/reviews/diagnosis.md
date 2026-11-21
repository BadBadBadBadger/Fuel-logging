# Fuel Log: why it reads as "AI slop" (ranked)

Evidence: `cur2/dark-today.png`, `light-today.png`, `dark-stats.png`; `app.jsx` (7,945 lines); `index.html`.

## 1. Emoji used as the icon system and as decoration. Confidence: high
**Scale:** 141 emoji in total, 62 different ones (arrows excluded; about 15 sit in code comments). Most used: ⚠8 ⚡8 ✓7 🏆7 🤖5 ✨5 📏5 🔄5 ✎5 ⚖5 📷4 🖼4 🔥3 💧3 ⭐3 ✅3 📊3 👑2. One-offs include 🪈 🟤 ⚪ 🟡 🔵 💎 🚀 👋 💡 ⛽ 🔋 💤.

**Structural use (emoji doing an icon's job):**
- Header buttons 🔥 ⚙️ 📊 🏆 (`4336-4347`)
- Food-entry tiles 🤖 AI LOG / ⚡ QUICK ADD (`4920-21`)
- Re-log button ⚡ that changes to ✓ (`4969`); edit ✏️ and delete 🗑️ (`6018-20`)
- Theme switch 🌙 ☀️ 🖥 (`2981`); voice and photo buttons 🎤 📷 🖼 (`5785-88`)
- Chart switch 📈 📊 (`6632`); metric chips ⚖️ 📏 📐 (`6601-28`); 📥 CSV (`6304`)
- Badge tiers 🟤 ⚪ 🟡 🔵 💎 👑 (`60`)

**Decorative use (emoji sprinkled through copy):**
- 🔄 at the start of the calibration paragraph (`3847-49`)
- 👍 in target warnings (`4304`, `4306`); 💡 Tip (`3652`); 👋 HI (`2249`); Start Free Trial 🚀 (`2132`)
- 🤖 DAILY COACH (`2844`); ⚖️ WEIGHT labels (`6763`, `6775`); ACHIEVEMENTS 🏆 (`6862`)
- ⚡ ANALYSING (`5807`); ⚡ TRAINING / 💤 REST (`6368`)
- 💧 ⚖️ 📏 inside every History row (`6821-26`)
- 36-40px emoji standing in for empty-state and modal art: 🔐 🔓 🔏 ⌛ 🍽️ 📊 🏆 (`2210`, `2316`, `2349`, `2514`, `4982`, `6311`, `6896`)
- A column of 15px notice icons ⚠️ 🛡️ ⛽ 💧 🔋 🔄 (`4454-4756`)

**Why this reads as generated:**
- **They look different on every device.** Android, iOS and Windows each draw emoji in their own style, so the brand's icons are really Google's, Apple's or Microsoft's. The variation selector (the invisible character that forces colour emoji) is used inconsistently: `"🖼️"` at `5788`, but a bare 🖼 elsewhere. Emoji sizes are chosen one by one: 10, 15, 18, 32, 36 and 40px.
- **They clash with the type and ignore the theme.** Glossy full-colour glyphs sit next to 800-weight monochrome caps. CSS colour cannot change an emoji, so all 141 skip the token system. The blue 📊 and grey 🤖 do not belong to the warm cream palette and look the same in light and dark mode.
- **They compete for attention.** On Today the header's four emoji are the most saturated pixels near the top. On History, 💧 and ⚖️ repeat on each of the 22 rows, which makes about 44 colour glyphs and more visual noise than the kcal numbers.
- **One meaning, several emoji, and one emoji, several meanings.** Done is ✓, ✅, 👍 or "✓ Added". Edit is ✎ ×5 or ✏️ ×2. AI is 🤖 or ✨. ⚡ means quick add, re-log, training day (`4774`, `6807`), analysing and workout count (`3904`). 🔓 means both "unlocked" (`2316`) and "Sign out" (`2464`). A real icon set has one glyph per meaning.
- **Premium has no single mark.** ⭐ appears in "Paste log ⭐" (`3964`), in "premium ⭐" (`4920`) and as the gate's default icon (`2099`). That is only 3 uses in the code, but two of them are on the first Today screen. Premium is also signalled with ✨ (AI estimate gates), 👑, 💎 and 🚀.

**Fix:**
- Swap every structural emoji for one stroke icon set (Lucide or Phosphor), drawn in `currentColor`, at 20/24px, with aria labels. Use one glyph per meaning.
- Delete the decorative emoji from copy. Status becomes a coloured dot or a word.
- Use one premium mark everywhere, for example a small "Plus" pill.
- Keep emoji only where they carry feeling: badges on the Achievements screen, and perhaps the 🔥 streak.

## 2. Every section sits in the same box, so nothing leads. Confidence: high
- Today is 10 stacked cards with the same surface, border and gap.
- The string ``background:CARD, border:`1px solid ${BD}` `` is copy-pasted 26 times, with radii of 10/12/14/16/18/20.
- **Fix:** keep one hero surface (calories plus macros) and lay the rest out as plain sections without boxes.

## 3. The main job, logging food, is buried. Confidence: high
- The AI and Quick Add tiles sit about 1,350px down. A workout form with three dropdowns is the first thing on screen (`4407`).
- **Fix:** a Log button anchored at the bottom, and workouts collapsed to one row.

## 4. All-caps, letter-spaced micro-labels everywhere. Confidence: high
- The caps are typed into the strings. There are 93 `letterSpacing` values at 0.06-0.12em, and the 11px/0.12em/800 recipe repeats (`3764`, `4805`, `4845`, `4858`).
- **Fix:** sentence-case titles at 15-17px semibold.

## 5. Everything is heavy, so no number stands out. Confidence: high
- `fontWeight` counts are 800×87, 900×78 and 400×7. There are 28 font sizes, including 10.5/11.5/12.5/14.5, and no `tabular-nums`.
- **Fix:** a 5-step type scale. Only the hero number gets 800+.

## 6. System font only, and no "fuel" motif. Confidence: high
- The only font is `-apple-system…` (`index.html:210`), with no webfont.
- **Fix:** one display or numeric face, and turn the calorie bar into a fuel gauge (E to F, needle) used across the app.

## 7. Stock traffic-light colours, with red meaning two things. Confidence: medium-high
- The same `--over` red marks "short of a minimum" (protein 65/169) and "over budget".
- The dark-theme semantic colours are stock values: `#4ade80` is Tailwind's green-400, and `#ff5555` is a stock red.
- The pacing logic itself (`proteinDayScore`, `465`) is careful.
- **Fix:** show "not yet" as an unfilled track, and tune the semantic colours to the warm palette.

## 8. Two rings that say little. Confidence: medium-high
- The two ring cards take about 240px to say "FAT" and "CUT", and the Today ring repeats the macro bars below it.
- **Fix:** merge them into one status line.

## 9. Long explanatory copy. Confidence: high
- The body-weight card carries a 50-word paragraph (`3847`).
- **Fix:** one line plus an ⓘ that opens the detail.

## 10. Too many near-duplicate colour tokens. Confidence: high (affects the code more than the looks)
- There are 61 tokens per theme. 18 are reds or red tints, and there are 11 mid/low text greys; `--text-mid-2` and `--text-mid-4` are the same hex.
- **Fix:** about 20 tokens, each named for its role.

## 11. History repeats one row. Confidence: medium
- Every row reads "P:170g · C:190g · F:65g · 💧6 · ⚖️98.7kg". The identical values come from seed data, but the format is the problem.
- The chart's y-axis starts at 0, which flattens the line.
- **Fix:** each row shows the date, kcal and a small bar against target, with macros on expand. Group rows by week, and set the axis to roughly the target ±600.

## 12. Little motion. Confidence: low-medium
- There are only bar transitions and two celebration animations (`6934`, `6968`).
- **Fix:** the gauge needle moves when food is logged. Keep it quiet, per the disordered-eating guardrail.

**Dropped after checking:**
- "Generic black and blue palette": the neutrals are a deliberate warm cream/paper set.
- "Gradient overuse": there are only 2 gradients.

## Keep
1. The warm cream and paper neutrals in both themes.
2. The pacing logic (`465-560`), which never shows red mid-day and keeps disordered-eating risk in mind.
3. The consumed/remaining hero, including the honest "est. budget · 80%".
4. The dense log rows, with one-tap re-log and delete.
5. History's range and metric chips plus CSV export.
