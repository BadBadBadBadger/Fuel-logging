# Fuel Log — Bug Reports

Logged: Tuesday 15 September 2026

---

## Bug 1: AI Log overestimates fat on plain chicken breast

**Area:** AI Log (describe it)
**Severity:** Medium. Macros are wrong, and the user makes food decisions based on the fat left over.

### Summary
The AI estimation gives dry, air-fried chicken breast far more fat than it actually has. This happens even when the input says "zero added fat". Estimates for the same food at different weights also don't scale in proportion.

### Evidence (15 Sept log)

| Input text | Logged P / C / F | kcal | Expected P / C / F |
|---|---|---|---|
| Medium air fried chicken breast 4 sma… | 58 / 4 / 26 | 484 | ~58 / 0 / 3–5 |
| Dry Airfried chicken breast. 250g | 77 / 0 / 9 | 413 | ✅ Reasonable |
| Dry airfried chicken zero added fat 150g | 37 / 0 / 10 | 248 | ~46 / 0 / 5 |

- **Entry 1** overstated fat by about 21g. This hid most of the day's remaining fat allowance.
- **Entry 3** is 60% of the weight of entry 2, but its fat went *up* (9g to 10g) and its protein dropped more than it should (77g to 37g, when 60% of 77g is about 46g). The kcal (248) matches 60% of 413, but the macro split does not add up correctly: 37×4 + 10×9 = 238 kcal.
- The words "zero added fat" and "dry" in the input had no effect.

### Expected behaviour
- Cooked, skinless chicken breast with no added fat comes out at about 3–4g fat per 100g.
- Words like "dry", "zero added fat", or "no oil" in the input mean no cooking fat is added.
- The same food at a different weight scales in proportion.
- The logged kcal matches the macros (P×4 + C×4 + F×9), within a small tolerance.

### Acceptance criteria

```gherkin
Feature: AI Log fat estimation for lean protein

  Scenario: Explicit no-added-fat input
    Given I enter "Dry airfried chicken zero added fat 150g" in AI Log
    When the AI estimation is returned
    Then fat is no more than 6g
    And protein is between 43g and 49g

  Scenario: Same food at different weights scales in proportion
    Given I have logged "Dry airfried chicken breast 250g"
    When I enter "Dry airfried chicken breast 150g"
    Then each macro is 60% of the 250g entry, within ±10%

  Scenario: kcal matches macros
    Given any AI estimation is returned
    Then kcal is within ±5% of (P×4 + C×4 + F×9)
```

---

## Bug 2: User input totals added on top of AI estimated totals

**Area:** AI Log, "Add as one meal"
**Severity:** High. It corrupts the daily total and shows a false "over budget" warning.

### User story
**Given** I am entering a new AI estimation,
**when** I include calorie and macro totals in the text,
**then** the AI assistant should show a single row instead of multiple elements,
**so that** if "Add as one meal" is tapped, the user logged totals are not added on top of the AI assistant estimated totals.

### Actual outcome
When "Add as one meal" is tapped, the individual components of the meal are added to the user input totals. This nearly doubles the calorie estimate that goes into today's log.

### Expected outcome
Adding the meal as logged enters only the values the user typed.

### Evidence (15 Sept log)
**Input totals in the text:**
`3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each) — P: 9.2g C: 66.5g F: 25.8g 539 kcal`

| | P | C | F | kcal |
|---|---|---|---|---|
| User input totals | 9.2 | 66.5 | 25.8 | 539 |
| Logged by app | 15.6 | 101.8 | 51.6 | 942 |
| Difference | +6.4 | +35.3 | +25.8 | **+403** |

- Fat is exactly double what was entered.
- The daily view showed **"Over by 448 kcal"**. The correct figure was about 45 kcal over.
- **Workaround:** edit the entry by hand to match the user input totals.

*To attach: the exact pasted input text, including any component breakdown lines below the totals.*

### Acceptance criteria

```gherkin
Feature: Respect user input totals in AI Log

  Scenario: Text includes calorie and macro totals
    Given I am entering a new AI estimation
    When my text includes calorie and macro totals
    Then the AI assistant shows a single row with those totals
    And no separate component rows are shown

  Scenario: Add as one meal uses user input totals only
    Given my text includes "P: 9.2g C: 66.5g F: 25.8g 539 kcal"
    When I tap "Add as one meal"
    Then today's log gets one entry with P 9.2, C 66.5, F 25.8 and 539 kcal
    And no AI estimated component values are added

  Scenario: Text includes totals and a component breakdown
    Given my text includes totals and a list of components
    When the AI estimation is returned
    Then the user input totals are used for the entry
    And the components are not added to the totals
```

### Notes
- **Suspected cause (not confirmed):** the parser adds up the component estimates and the totals line together, rather than treating a stated total as the final value.
- **Nice to have:** if the component estimates differ from the user input totals by more than ~10%, flag it to the user rather than silently choosing one.

---

## Bug 3: "Remaining" label shown when over budget

**Area:** Daily calorie card (CUT)
**Severity:** Medium. The user is told they have calories left when they are actually over.

### Summary
When consumed calories go slightly over the target, the card still says **REMAINING** and shows how far over the user is as a positive number. The number is correct, but the label is not, so the user reads it as calories still available.

### Evidence (15 Sept log, 13:14)

| | Value |
|---|---|
| Target | 2,319 kcal |
| Consumed | 2,366 kcal |
| Shown | **REMAINING 47 kcal** (blue) |
| Correct | **OVER BY 47 kcal** |

- Earlier the same day, at 448 kcal over, the card correctly showed **OVER BY 448**. So the label switches properly for larger overages but not for small ones.
- In the same state, the Today ring shows **ON TRACK** with "Nice work today."

### Expected behaviour
- If consumed is more than the target, the label reads **OVER BY** and shows consumed minus target.
- If consumed is less than or equal to the target, the label reads **REMAINING** and shows target minus consumed.
- Being close enough to count as on track can still apply to the Today ring, but it must not change the REMAINING/OVER BY label.

### Acceptance criteria

```gherkin
Feature: Correct remaining / over label on the calorie card

  Scenario: Slightly over budget
    Given my calorie target is 2,319 kcal
    And I have consumed 2,366 kcal
    When I view the calorie card
    Then the label reads "OVER BY"
    And the value shown is 47 kcal

  Scenario: Under budget
    Given my calorie target is 2,319 kcal
    And I have consumed 2,272 kcal
    When I view the calorie card
    Then the label reads "REMAINING"
    And the value shown is 47 kcal

  Scenario: Exactly on budget
    Given my calorie target is 2,319 kcal
    And I have consumed 2,319 kcal
    When I view the calorie card
    Then the label reads "REMAINING"
    And the value shown is 0 kcal
```

### Notes
- **Suspected cause (not confirmed):** the label seems to come from the on-track band check rather than from whether consumed is above or below the target, while the value uses the absolute difference.
- **Question to decide:** whether a small overage should still show as ON TRACK on the Today ring. This is logged as a question, not a bug.
