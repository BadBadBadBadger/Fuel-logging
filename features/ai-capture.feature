# ============================================================================
# ✅ BUILT & FOLDED IN (v6.7, 2026-06-25). The executable scenarios now live in
#   features/fuel-log.feature (Feature: "AI meal capture via text, voice, or
#   photo"), which is the source of truth. This file is RETAINED only as the
#   design-rationale record — the 4-hat debate, the architecture sketch, the
#   locked decisions, and the logic-layer notes. Do not treat it as authoritative
#   spec; edit fuel-log.feature instead.
# ============================================================================
# DRAFT SPEC — AI meal capture (text · voice · photo) + confidence follow-ups
# ----------------------------------------------------------------------------
# Status: @wip / @draft — NOT YET BUILT. Kept out of features/fuel-log.feature
#   (the passing source of truth) until built, per QA hat tagging rule.
# Source: 4-hat debate (design · coach · launch · QA), decisions locked
#   2026-06-25 by the owner:
#     - Entry: existing AI logging screen + inline 📷 and 🎤 buttons by Submit.
#     - Voice: on-device Web Speech API; only the transcript leaves the device.
#     - Gating: capture modes AND AI usage are gated via the SAME mechanism the
#       app already uses for free vs premium (server-authoritative entitlement +
#       Worker JWT/allowlist/cap, Phase 0/A). No bespoke gate is introduced. The
#       exact free/premium split is launch's call; the *method* is fixed.
#     - Follow-ups: confidence-gated, any input, MAX 2, chip answers, skippable.
#
# Architecture under test — ONE pipeline, THREE input adapters:
#   [ text | voice→transcript | photo ] → AI parse → estimate + confidence
#     → (confidence < THRESHOLD ? ask ≤2 chip questions : skip)
#     → confirm / adjust (editable elements, portions, fix misID)
#     → SAVE: store elements + macros + answers + source/confidence flags
#     → DISCARD all transient media (image blob, any audio)
#
# Testing seam: the AI response is MOCKED at the Worker boundary so scenarios
#   are deterministic. We assert the CONTRACT (confidence in range, ≤2 typed
#   questions, editable result) — never an exact kcal number. The maths
#   (estimate → log → calibration weighting) belongs in __tests__/logic.test.js
#   (Jest), not here — see the LOGIC-LAYER notes at the foot of this file.
#
# DECISIONS LOCKED 2026-06-25 (coach + launch hats) — were # OPEN:
#   - Confidence THRESHOLD: follow-ups trigger when the meal's kcal-weighted
#       avgConf < 80 — reuses INTAKE_FLAG_BELOW (app.jsx), the same bar
#       intakeConfidence already calls "guess-heavy". No new magic number.
#       Tiers stay confLabel: <=33 Low / <=66 Medium / >66 High.       [coach]
#   - WHICH elements get asked: top 2 by uncertainty IMPACT = kcal*(100-conf),
#       not merely lowest conf. AI returns a per-item `ask` reason code
#       (fat | portion | version | null). Question bank:               [coach]
#         fat     -> "How was the {food} cooked?"   Dry/grilled · Some oil or
#                     butter · Fried/lots of fat · Not sure  (x0.9/x1.0/x1.3)
#         portion -> "Roughly how much {food}?"      Small(<fist) · Medium(fist)
#                     · Large(2 fists+) · Not sure            (x0.7/x1.0/x1.5)
#         version -> "Which version of {food}?"      Standard · Vegetarian ·
#                     Vegan · Not sure               (swap protein/fat profile)
#       "Not sure" = no refinement, meal stays low-confidence. Answering raises
#       that element's conf so refined estimate conf >= previous.
#   - Free/premium split: NONE new. AI Meal Log is already premium-gated at the
#       menu AND the worker (403); all three capture modes inherit that gate.  [launch]
#   - Cap: existing worker DAILY_LIMIT=100/user/day, resets midnight UTC, 429.
#       On 429 the screen keeps captured input + offers manual entry.
#       OPS BLOCKER (not code): bind the RATE_LIMIT KV before launch or the cap
#       is a no-op; keep the Anthropic Console spend cap as backstop.          [launch]
#   - "Report estimate as wrong": low-emphasis link under the result ->
#       mailto:fuellogadmin@gmail.com prefilled with description + numbers only
#       (no account data), user-reviewed before send. Zero backend.   [launch + design]
# ============================================================================

@wip @draft @ai-capture
Feature: AI meal capture via text, voice, or photo with confidence-gated follow-ups
  As someone logging a meal
  I want to type, dictate, or photograph it and answer at most a couple of quick questions
  So that I get an accurate estimate fast, without my photo or voice being stored

  Background:
    Given I am signed in and on the AI logging screen
    And I am within my AI usage allowance (the same cap used across AI features)
    And the AI logging screen shows a meal description field, a Submit button,
      a microphone button, and a photo button inline with Submit

  # --------------------------------------------------------------------------
  # 1. Happy paths — the three adapters converge on one editable estimate
  # --------------------------------------------------------------------------

  @happy
  Scenario Outline: A high-confidence meal estimate is editable and saveable
    Given on-device speech recognition and the camera are available
    When I provide a meal via <input>
    And the AI returns an estimate above the confidence threshold
    Then I see an editable estimate listing each element with its macros
    And no follow-up questions are shown
    And I can adjust a portion or fix an element before saving
    And I can save the meal to my log

    Examples:
      | input                      |
      | typing "chicken and rice"  |
      | dictating "chicken and rice" |
      | photographing the plate    |

  @happy @voice
  Scenario: Dictation transcribes on-device and never sends audio
    Given the browser supports on-device speech recognition
    And I have granted microphone permission
    When I tap the microphone button and say "two eggs and a slice of toast"
    Then the transcript "two eggs and a slice of toast" appears in the meal description field
    And no audio leaves the device
    And I can edit the transcript before I tap Submit

  @voice @edge
  Scenario: Voice gracefully degrades when unsupported or denied
    Given the browser does not support on-device speech recognition,
      or microphone permission is denied
    Then the microphone button is unavailable
    And I can still type or photograph the meal
    And the rest of the logging flow is unaffected

  @happy @photo @privacy
  Scenario: A photographed meal is held only in memory
    When I tap the photo button and capture my meal
    Then the image is held in memory only and is not written to storage
    And the image remains available while I review and adjust the estimate
    When I save the meal
    Then the image is discarded and is not stored on the device or any server

  @photo @edge
  Scenario: Camera gracefully degrades when denied
    Given camera permission is denied
    Then the photo button is unavailable
    And I can still type or dictate the meal

  # --------------------------------------------------------------------------
  # 2. Confidence-gated follow-up questions — shared across ALL inputs
  # --------------------------------------------------------------------------

  @followup
  Scenario Outline: A low-confidence estimate asks at most two chip questions
    When I provide a meal via <input>
    And the AI returns an estimate below the confidence threshold
    Then I am asked no more than 2 follow-up questions
    And each question is answerable by tapping a chip
    And a "Skip" option is always available
    When I answer the questions
    Then the estimate is refined
    And its confidence is at or above its previous level

    Examples:
      | input                       |
      | typing "salad"              |
      | dictating "salad"           |
      | photographing the salad     |

  @followup
  Scenario: Follow-up count never exceeds two even at very low confidence
    Given the AI returns an estimate far below the confidence threshold
    When the follow-up questions are presented
    Then I am asked at most 2 questions in a single round
    And I am not asked further questions after I answer or skip them

  @followup
  Scenario: Skipping follow-ups logs the meal at lower confidence
    Given follow-up questions are shown for my meal
    When I tap "Skip"
    Then the estimate is kept at its current, lower confidence
    And the saved meal is flagged as a lower-confidence estimate

  @followup
  Scenario Outline: Follow-ups target the highest-leverage unknowns
    Given a meal estimate is below the confidence threshold for "<reason>"
    Then one follow-up question addresses "<unknown>"

    # LOCKED (coach): ask code -> question+chips per the bank in the header.
    Examples:
      | reason                  | unknown                         |
      | hidden cooking fat      | preparation fat (oil/butter/dry) |
      | ambiguous portion       | portion reference (e.g. fist sizing) |
      | animal-vs-plant version | dietary version of the dish     |

  # --------------------------------------------------------------------------
  # 3. Confirm / adjust — fixing the estimate before it becomes a record
  # --------------------------------------------------------------------------

  @adjust
  Scenario: I can correct a misidentified element
    Given the estimate lists an element the AI identified incorrectly
    When I edit that element to the correct food
    Then the macros for the meal update accordingly
    And I can save the corrected meal

  @adjust @multi
  Scenario: A multi-item plate exposes each element for adjustment
    When I photograph a plate of several foods
    And the AI returns multiple elements
    Then each element is listed with its own adjustable portion
    And I can adjust or remove any element before saving

  @adjust @edge
  Scenario: An unreadable or non-food input is handled honestly
    When I submit an input the AI cannot interpret as food
    Then I am told the meal could not be read
    And I am offered to retake, re-enter, or switch to manual entry
    And no estimate is logged

  # --------------------------------------------------------------------------
  # 4. Failure & resilience — the transient input must never be lost
  # --------------------------------------------------------------------------

  @edge @resilience
  Scenario: A failed estimate retains my input for retry
    Given I have provided a meal via voice or photo
    When the estimate request fails due to no connection or a timeout
    Then my captured input is retained
    And I am offered to retry or switch to manual entry
    And my input is only released once the meal is saved

  @edge @cap
  Scenario: Reaching the usage cap degrades gracefully, not destructively
    Given I have reached my daily AI usage cap
    When I attempt an AI estimate
    Then I am shown a clear "daily AI limit reached" message
    # LOCKED (launch): worker DAILY_LIMIT=100/user/day, resets midnight UTC, 429.
    And I am offered manual entry
    And any input I captured is not lost

  @gating
  Scenario: Capture modes reuse the existing entitlement and cap mechanism
    Given a capture mode or AI usage is restricted to a particular entitlement tier
    Then its availability is determined by the same entitlement check used for
      other premium features
    And its usage is bounded by the same per-user cap as other AI features
    And no capture-specific gating mechanism is introduced

  # --------------------------------------------------------------------------
  # 5. Privacy, record integrity & store policy
  # --------------------------------------------------------------------------

  @privacy
  Scenario: The saved record contains numbers and answers, not media
    When I save an AI-estimated meal
    Then the stored record contains its elements, macros, my follow-up answers,
      and its source and confidence flags
    And the stored record contains no image and no audio

  @privacy @calibration
  Scenario: AI-estimated meals are flagged so calibration can weight them
    When I save an AI-estimated meal
    Then the meal is flagged as AI-estimated with its confidence level
    # Behaviour of runCalibration weighting is asserted in Jest — see foot of file.

  @policy @genai
  Scenario: I can report an estimate as wrong
    Given I am reviewing or have saved an AI estimate
    Then I can report the estimate as inaccurate
    # LOCKED (launch + design): "⚐ Report estimate as wrong" link under the
    #   result -> mailto:fuellogadmin@gmail.com prefilled with description +
    #   numbers only (no account data). Satisfies Google Play GenAI app policy.

# ============================================================================
# LOGIC-LAYER NOTES (Jest — __tests__/logic.test.js, NOT Gherkin)
#   - estimate → meal element shape → totals roll up correctly
#   - AI-estimated + low-confidence flags persist through runMigrations
#   - runCalibration down-weights (or excludes) AI-estimated intake vs weighed
#     entries so a biased estimate cannot silently retrain TDEE (coach req.)
#   - confidence tier mapping (score → high/med/low) once thresholds are set
# ============================================================================
