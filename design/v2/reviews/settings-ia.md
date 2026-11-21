# Fuel Log settings: inventory and new IA

## Inventory (today: 30 user-facing items across 4 places)

**Profile screen ("MY PROFILE", ⚙️ at app.jsx:4338 → ProfileScreen 3016)**
1. Intro "Targets use Katch-McArdle" (3080)
2. Weight (3088) 3. Weight unit kg/st+lb/lb (3089)
4. Height (3096) 5. Height unit cm/ft+in/in (3097)
6. Body fat % + focus guidance / implausible warning (3105-3120)
7. Sex male/female (3121)
8. Activity, 4 levels (3144)
9. Weigh-in frequency (3175)
10. Body measurements log form (3198, MeasurementRow)
11. "Don't ask me for these" toggle (3233)
12-14. Diet type, Allergies, Dislikes (3250-3260)
15. Calculated stats: LBM, BMR, formula TDEE, measured BF (3264)
16. Adaptive adjustment + "Start clean" reset with confirm (~3290-3325)
17. Effective TDEE + confidence (~3345)
18. Targets by mode, read-only (3369)
19. Aggressive-cut acknowledged notice (3393)
20. Appearance dark/light/system (3403, ThemeToggle 2979)
21. Version + patch date (3410; APP_VERSION 166)

**Dashboard (Today)**
22. Mode CUT/MAINTAIN/BULK + cut-guard prompt (4366, 4386)
23. Custom kcal target, tap-to-edit pencil (4791)
24. Aggressive-cut "Yes, I understand" (4430)
25. Weigh nudge "Don't remind me" (4901)
26. AI coach card, premium (CoachCard 2739, render 4852)

**Account & Privacy (premium avatar only, 4349 → AccountScreen 2387)**
27. Download my data (JSON)
28. Legal links: privacy, terms, processors + consent record
29. Sign out
30. Delete account and all data (typed confirm)

**Not settings, no change:** haptics are always on and auto-detected (app-shell/04, @wip; no toggle exists, none added). Weight sync is automatic (profile/04). Premium upgrade is only reachable via feature gates (PremiumModal 2098). Dev-only: `window.__devRefreshCoach` (7102) and sign-in `devMode` (2145).

## New IA (4 groups + footer, 19 items)

Top screen: a read-only readout (daily target, mode, weight, height, body fat, activity) then:

**You**
1. **Body & goal**
   - Goal: Cut / Maintain / Bulk (also stays on Today for one-tap switching)
   - Daily target: Auto (2,241) / Set my own
   - Weight, Height, Body fat (with the 25% / 30% hint), Sex
   - Activity (plain labels, step ranges)
   - Reminders: Weigh-ins (daily / few a week / weekly / off), Measurements (weekly / off)
2. **Units & look**: weight unit, height unit, theme (dark / light / system)

**App**
3. **Account & data**: who you are, Premium status or Upgrade, Download my data, Sign out, Delete account. Shown to everyone; signed-out users see Sign in.
4. **Advanced**: how your target is worked out (LBM, BMR, maintenance, learned adjustment, confidence, targets for each mode), Reset learned adjustment, aggressive-cut warning status with Undo.

**Footer**: Privacy · Terms · Who handles my data, consent date, "Fuel Log v110 · updated 20 Nov 2026".

Open decision: the code comment at 4359 says the mode chips are the *only* mode surface. Either accept a second, identical control in Body & goal or make it read-only there.

## Removed
- **AI coach card**: owner decision.
- **Diet type, Allergies, Dislikes**: owner decision. They only steered AI prompts.
- **Katch-McArdle intro**: jargon. Advanced explains the method.
- **Aggressive-cut banner on profile**: a one-off notice, not a setting. Its status moves to Advanced.
- **Emoji on controls** (theme, export, sign out, delete): the labels already say it.

## Moved / merged
- Body measurements form: profile → Today weight panel (logging is not a setting)
- "Don't ask me for these" + weigh-in frequency → Body & goal › Reminders
- Unit toggles beside fields → Units & look (one place; fields show the unit)
- Appearance: bottom of profile → Units & look
- Custom kcal pencil → Body & goal › Daily target (the Today pencil can stay as a shortcut)
- Calculated stats, targets by mode, Start clean → Advanced
- Account & Privacy: premium-only avatar → Account & data, for everyone
- Legal links + consent record → settings footer

## Things to unpick later (no code changed)
- Coach: `CoachCard` 2739-~2860, render 4852, `coachKey` 4136/7058/7915, `__devRefreshCoach` 7102-7108, `coach__` storage keys 2746/2832/7453, features/coach/*.feature, personas/nutrition-coach.md.
- Diet: `DIET_SUGGESTIONS` 101, `BIG14_ALLERGENS` 103, `DIETARY` cache and `normaliseDietary` 106-115, `dietaryPromptBlock` 119 (used in coach prompt 2827), `scanAllergens` 151 (2840, AI item flag 5489), `dairyAvoided` 5314 (cooking-fat prompt), `setDietaryCache` 7132/7189/7282/7406, ProfileScreen `setDiet` 3035-3043, `TagField` 2867 (diet-only), cloud pull keeps `profile.dietary` 1797.
- Copy and legal: consent text 2275-2276 and 2364, `POLICY_VERSION` "1.2" note 174, legal/privacy.html, terms.html, ropa.md, play-data-safety.md, in-app-copy.md.
- Tests and specs: __tests__/logic.test.js, __tests__/styles.test.js, e2e/progress-bars.spec.js, features/coach/03-dietary-requirements.feature, features/logging/05-ai-meal-capture.feature.
- cloudflare-worker.js does not read diet or coach data.
