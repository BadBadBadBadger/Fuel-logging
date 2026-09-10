# ─────────────────────────────────────────────────────────────
# FINALIZED after a three-round swarm — shaping (design-lead + nutrition-coach),
# a solo Critical-Thinking pass, then a QA/Engineering/Design-Lead debate
# moderated to close-out by Critical Thinking. Full transcript, all three
# rounds: `01-measurement-tracking-swarm-review.md`. Body-composition
# workstream, file 1.
#
# WHY: scale weight alone is a poor signal on a body recomposition — muscle gain
# and fat loss can offset each other, making real progress invisible on the scale
# for weeks. The founder already relies on a rolling weekly average rather than
# single-day readings for weight (weighRollingAvg, app.jsx:657) and wants the
# same treatment applied to body composition: weekly tape measurements, a US
# Navy-method body-fat % estimate, trended over time rather than read as single
# points.
#
# METHOD: US Navy circumference method (Hodgdon & Beckett, 1984, Naval Health
# Research Center). Male: height + neck + waist. Female: + hip. Confirmed correct
# by the nutrition-coach review. Exact regression coefficients are NOT reproduced
# in this file — verify against the primary source at implementation time, do not
# hand-derive from this spec.
#
# REUSES (every one below was checked against the real function, not assumed by
# resemblance — see Round 2/3 of the review doc):
#   • `p.height` (DEF_PROFILE, app.jsx:62) — collected today, consumed by NOTHING
#     until this feature: its first real use.
#   • `weighRollingAvg`'s n-before-averaging shape (app.jsx:657-660) for the
#     rolling sync average.
#   • `runCalibration`'s own rule for updating a number only once its
#     preconditions hold, and even then within a capped step (app.jsx:677-716)
#     — AND, critically, its cutting-aware ASYMMETRY (`wasCutting` refusal,
#     app.jsx:718-739): raising a target-feeding value is damped differently
#     from lowering it. This spec reuses that asymmetry, not just the cap shape
#     — see the "Sync to targets" section below.
#   • `shouldNudgeWeighIn` (app.jsx:1018-1025) and `weighCadence`'s "off" mute,
#     called a second time with a body-measurement-specific anchor/dismissal
#     key — confirmed by reading the real function signature, genuinely cheap.
#   • The existing body-fat plausibility check (profile/02-body-fat-guidance.
#     feature, 4-50% non-blocking warning) — extended with one line of copy,
#     not replaced.
#
# DATA MODEL (new): `body_measurements` table, mirrors `weigh_ins`'s shape
# (setup/supabase-schema.sql:126-133) plus one column the debate's finding-5
# fix requires — id, user_id, date, neck, waist, hip (nullable — male readings
# never set it), formula ('male'|'female', the formula this row was actually
# computed under), computed_bf, updated_at, UNIQUE(user_id, date). A one-time
# freeform "your protocol" note lives on the profile/settings row, not
# per-measurement. A second boolean on the same row, `muteBodyMeasurements`,
# backs the dedicated opt-out (see Opt-out section).
#
# RESOLVED VIA SWARM DEBATE, 2026-09-09 (full reasoning in the review doc —
# this is a summary, not a substitute for reading it):
#
#   • SYNC MECHANISM (was @founder-blocking item 1): silent, no confirm dialog.
#     One function (`bodyFatRollingAvg`), called unconditionally on every save
#     or edit, filtered to the profile's CURRENT formula, at/above the sync
#     gate (4 logged measurements under that formula). Safe not because the
#     user "already saw the raw reading" (an
#     earlier draft of this reasoning was imprecise and is corrected here) but
#     because the SYNCED value is immediately, plainly visible on the Profile
#     row after every write — the same transparency property that already
#     makes weight-sync safe.
#   • ASYMMETRIC CAP (new — found during the debate's own sanity-check against
#     the founder's success criterion, not proposed by any single reviewer):
#     a SYMMETRIC cap was the debate's first answer, and it has a real safety
#     gap — see the "Sync to targets" section. A sync that LOWERS `p.bodyFat`
#     (a leaner reading) applies promptly, undamped. A sync that RAISES it
#     while the user is cutting is the risky direction and gets the capped
#     treatment — mirroring `runCalibration`'s own asymmetry, not inventing a
#     new mechanism.
#   • DOUBLE-MEASUREMENT TAP COST (was @founder-blocking item 2): soft,
#     dismissible tip, unconditional — never a forced second entry, and NOT
#     contingent on the opt-out below shipping (an earlier debate position
#     claimed it was; retracted on re-examination).
#   • OUTLIER HANDLING: the flat cap alone is sufficient — no stored exclusion
#     flag, no confirm-or-remeasure fork. One line of copy added to the
#     existing plausibility warning is the only change.
#   • OPT-OUT (new — a genuine gap the shaping round missed entirely): muting
#     `weighCadence` also mutes the measurement ask, PLUS one dedicated
#     boolean for body composition specifically, reusing `shouldNudgeWeighIn`
#     for the dismiss/cooldown mechanics rather than inventing a parallel one.
#
# STILL GENUINELY OPEN (not resolved by the debate — flagged, not guessed):
#   • Exact SYNC_GATE / step-cap magnitudes — deferred to implementation
#     against real data, same treatment `CAL_STEP_CAP` itself got.
#   • Whether a reading taken after a multi-month gap deserves less trust in
#     the first place (protocol drift — different season, different tape, a
#     forgotten routine) is a measurement-reliability judgement call, not an
#     averaging-math one. None of the review hats are positioned to answer it
#     — correctly left for the founder/coach. One existing mitigation is
#     already on the table: the routine note is echoed back regardless of gap
#     length (see Input, below).
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   POLICY CONSTANTS — proposed, pending founder confirmation, NOT yet settled
#   (the debate reconciled the mechanism; it did not grant itself authority to
#   sign off on behalf of the founder):
#       SYNC_GATE        = 4 measurements, same formula   (before any reading
#                           can touch p.bodyFat)
#       TREND_MIN_POINTS = 4                              (chart trend-line
#                           sufficiency — a SEPARATE constant from SYNC_GATE
#                           even though it shares the same value today; see
#                           finding 10 in the review doc for why collapsing
#                           them into one literal is a risk)
#       BF_SYNC_STEP_CAP  = TBD at implementation, ASYMMETRIC — full weight
#                           when lowering p.bodyFat, capped when raising it
#                           while cutting (mirrors CAL_STEP_CAP's shape, not
#                           its tiers — this window doesn't grow unboundedly
#                           the way weigh-in history does, so one flat cap
#                           value is enough, just applied directionally)
#   DECISION RULE (not a number — closes what would otherwise be an open
#   sign-off condition without inventing one): if closing a full placeholder-
#   to-true gap would take more than N sync cycles under the chosen cap, add a
#   "trending toward NN%" copy state for after the sync gate is reached;
#   otherwise the existing countdown copy already shown before the sync gate
#   is sufficient. Engineering reports N against the real cap value at
#   implementation.
#
# IMPLEMENTED 2026-09-10 (app.jsx: navyBodyFat/bodyFatRollingAvg/syncedBodyFat,
# `__tests__/logic.test.js`, `e2e/body-measurements.spec.js`). SYNC_GATE and
# TREND_MIN_POINTS shipped at 4; BF_SYNC_STEP_CAP shipped at 3 percentage points
# as a starting value, per the Numbers Contract's own instruction to pick it
# against real data rather than invent it here — tune once real readings exist.
# A worked example (178cm/38cm neck/83cm waist male → 14.9%) is asserted in
# both the Jest mirror and the Playwright spec, so the two layers can't drift
# silently out of agreement with each other.
# ─────────────────────────────────────────────────────────────

@wip
Feature: Weekly body measurements and Navy-method body-fat % tracking

  A weekly tape-measurement routine estimates body-fat % using the US Navy
  method and trends it over time, using the same rolling-average-over-single-
  readings approach the app already applies to weight — so a recomposition
  (fat loss and muscle gain happening together) has a signal that isn't hidden
  by the scale.

  Background:
    Given my profile has a height set
    And "the sync gate" means 4 logged measurements under my current formula,
      proposed pending founder confirmation
    And a computed body-fat % outside 4-50% shows the existing gentle,
      non-blocking plausibility warning (profile/02-body-fat-guidance.feature)

  # ── Input: what's asked, and where ──────────────────────
  Scenario Outline: Measurement fields match my sex
    Given my profile sex is "<sex>"
    When I open the measurement form
    Then I am asked for "<fields>"

    Examples:
      | sex    | fields                    |
      | male   | neck, waist               |
      | female | neck, waist, hip          |

  Scenario: An unset sex defaults to the male field set without blocking entry
    Given my profile sex is not set
    When I open the measurement form
    Then I am asked for neck and waist only
    And a one-line prompt suggests setting my sex in Profile for an accurate read
    And I can still log a measurement without setting it

  Scenario: Height is reused from my profile, never re-asked
    Given my profile height is already set
    When I open the measurement form
    Then height is not one of the fields I fill in
    And the stored height is used in the calculation

  Scenario Outline: A measurement that breaks the formula's domain is hard-blocked
    Given my profile sex is "<sex>"
    When I enter "<entry>"
    Then saving is blocked
    And I see a plain explanation of why

    # Male: the formula takes log10(waist − neck), which requires
    # waist − neck > 0. Female: log10(waist + hip − neck), which requires
    # waist + hip − neck > 0. Verified algebraically: since waist > neck is
    # already enforced, waist + hip − neck > hip, so hip > 0 alone completes
    # that requirement for the female formula — no separate formula redesign
    # needed.
    Examples:
      | sex    | entry                          |
      | male   | a waist not greater than neck  |
      | female | a waist not greater than neck  |
      | female | a hip of zero or less          |

  Scenario: The first measurement I ever log captures a one-time routine note
    Given this is my first-ever logged measurement
    When I save it
    Then I am invited to jot a short freeform note about my conditions
      (e.g. "mornings, fasted, before shower")
    And the note is optional and never blocks saving

  Scenario: My routine note is shown back to me on every later measurement
    Given I have already logged a routine note
    When I open the measurement form on a later week
    Then my own note is shown at the top of the form as a reminder
    # This holds regardless of how long the gap since my last measurement was
    # — the one existing mitigation against protocol drift on a lapsed
    # routine, see the header's "still genuinely open" note.

  Scenario: A dismissible tip suggests measuring each site twice
    Given I am filling in the measurement form
    Then a one-line tip suggests measuring each site twice and using the
      closer pair for accuracy
    And the tip is informational only — a single entry per site is accepted
    And dismissing or ignoring the tip never blocks saving
    # Unconditional and independent of the opt-out below — this is a
    # data-quality nudge shown at input time regardless of values; it is a
    # different piece of copy from the implausible-reading line further down,
    # which fires at result time and only when a reading is flagged. Keep
    # them as two small, separate pieces of copy, not one merged component.

  Scenario: Logging measurements never blocks or delays saving a weigh-in
    Given I am logging today's weigh-in
    When I choose not to also log a measurement
    Then my weigh-in saves exactly as it does today
    And nothing about the measurement prompt blocks or delays the LOG button

  Scenario: A quiet status line always shows my last measurement, regardless of gap
    Given I have a logged measurement
    When I view the weigh-in widget
    Then it shows "Measured N days ago", where N is the real elapsed days
    # Always-on, no valence, no threshold — a status line, not a nudge. This
    # is deliberately a SEPARATE mechanism from the nudge below, not two
    # branches of one day-count Outline (an earlier draft conflated them,
    # which is exactly why it had nowhere to attach the opt-out).

  Scenario: A nudge with its own conditions invites a fresh measurement once a week has passed
    Given my last logged measurement was 7 or more days ago
    And the measurement ask is not muted (see Opt-out)
    And the nudge has not been dismissed within its cooldown window
    When I view the dashboard
    Then a visible, non-blocking prompt invites me to log this week's measurement
    # Fires AT 7 days, matching WEIGH_NUDGE_GAP_DAYS exactly (app.jsx) — an
    # earlier draft put this boundary at 8, contradicting the exact precedent
    # it claimed to mirror. Reuses shouldNudgeWeighIn-shaped logic (anchor
    # timestamp, dismissal timestamp, cooldown), called a second time with a
    # body-measurement-specific key — not a hand-rolled day-count check.

  Scenario: The measurement nudge dismisses and cools down like the weigh-in nudge
    Given the visible measurement nudge is showing
    When I choose "Not now"
    Then it is dismissed and does not reappear until the same cooldown window
      used for weigh-in nudges has passed, or I log a measurement first,
      whichever comes first

  Scenario: The Profile screen offers a fallback entry point outside the weigh-in moment
    Given I am on the profile screen
    Then a "BODY MEASUREMENTS" card sits alongside the existing BODY STATS and
      WEIGH-INS cards
    And it shows my latest readings and when they were last logged
    And it offers a "Log now" action that opens the same measurement form
    And this fallback stays available even if I've muted the nudges below —
      a deliberate visit is not the same as a push

  Scenario: An implausible computed reading shows a warning and still saves at full weight
    Given my measurements compute to a body-fat % below 4% or above 50%
    Then the existing gentle inline warning appears
      (profile/02-body-fat-guidance.feature)
    And it adds one line noting a single reading can only move my synced
      number by a little, regardless
    And saving is not blocked, and the reading counts the same as any other
    # No stored "excluded" flag, no confirm-or-remeasure choice — the app
    # already has a rule against blocking a save behind an optional step, and
    # the flat sync cap (see Sync to targets) already bounds how much
    # influence one outlier reading can have. Building a second mechanism on
    # top of the cap would be complexity with no precedent in this codebase.

  # ── Calculation ────────────────────────────────────────────
  Scenario: Body-fat % is computed from the Navy-method formula on save
    Given I save a valid set of measurements
    Then a body-fat % is computed using height, neck, waist, and (if female) hip
    And the result is shown to me immediately
    # Exact regression coefficients: OPEN, owned by __tests__/logic.test.js —
    # verify against the primary source at implementation, not this file.

  Scenario: Every raw measurement, its formula, and its computed reading are all stored
    Given I save a measurement
    Then the raw neck/waist/hip values, which formula (male/female) computed
      the result, and the computed body-fat % are all stored in their own
      history
    And this is true whether or not the reading is recent enough to affect my
      calorie targets
    # The formula tag is what lets a later sex change correctly age old
    # readings out of the sync window (see Sync to targets) without
    # inventing a hip measurement for rows that never had one.

  # ── Opt-out: the measurement ask can be turned off ────────────
  Scenario: Muting weigh-in cadence also mutes the measurement ask
    Given my weigh-in cadence is set to "I'd rather not"
    Then the measurement row inside the weigh-in widget is never shown
    And the visible measurement nudge never fires
    # The more loaded number (per the nutrition-coach review) never asks once
    # the less loaded one has already been declined.

  Scenario: A dedicated opt-out for body measurements, independent of weigh-in cadence
    Given I am on the "BODY MEASUREMENTS" Profile card
    When I turn on "Don't ask me for these"
    Then the measurement row inside the weigh-in widget stops rendering
    And no measurement nudge appears, regardless of my weigh-in cadence setting
    And I can turn it back on later from the same card
    # Deliberately NOT a parallel cadence picker (few/daily/weekly/off)
    # mirroring the weigh-in cadence's full value set — there is only one
    # candidate cadence for a tape measurement (weekly, by construction), so
    # a binary ask/don't-ask is the entire decision space. One boolean, not a
    # second settings taxonomy.

  # ── Sync to targets ────────────────────────────────────────
  Scenario: Fewer than the sync gate's readings leaves my targets on their current body-fat %
    Given I have logged fewer than 4 measurements under my current formula
    When I view my calorie and macro targets
    Then they continue to use whatever body-fat % is currently on my profile
      (my existing manual entry, or the app default)
    And nothing about the in-progress measurements has touched that value yet

  Scenario Outline: Every qualifying save re-syncs the rolling average, not just the first one to reach the sync gate
    Given I have logged "<n>" measurements under my current formula
    And "<n>" is at or above the sync gate
    When I <action>
    Then my profile body-fat % recomputes to the rolling average of my last 4
      same-formula readings, not the single newest one
    And this happens immediately, with no confirmation step

    # One mechanism, not two — the same recompute runs whether this is the
    # 4th reading or the 40th, and whether it's a new date or a correction to
    # an existing one. This is what makes the safeguarding invariant below
    # hold structurally (one writer of p.bodyFat from measurement data)
    # rather than needing to be proven scenario-by-scenario for every reading
    # count.
    Examples:
      | n  | action                                |
      | 4  | log a new measurement                 |
      | 5  | log a new measurement                 |
      | 40 | log a new measurement                 |
      | 12 | edit an existing logged measurement   |

  Scenario: The sync step is asymmetric, mirroring runCalibration's own cutting-aware caution
    Given a new rolling average differs from my current profile body-fat %
    When the new average is LOWER (a leaner reading)
    Then it applies promptly, without capping
    But when the new average is HIGHER and I am cutting
    Then the update is capped, mirroring how runCalibration itself refuses to
      move a target the risky direction while cutting (app.jsx:718-739)
    # A single flat cap applied in both directions was this spec's first
    # answer, and it has a real safety gap: it delays isLeanBody tripping
    # exactly when a real recomposition (falling body fat) is happening —
    # the population this feature exists to serve. Reusing runCalibration's
    # existing asymmetry closes this without inventing new machinery.

  Scenario: A later synced reading supersedes a manual edit to body-fat %
    Given I have manually typed a body-fat % on my profile
    When my next measurement reaches the sync gate
    Then the synced rolling average overwrites my manual entry
    # Exactly mirrors how the next weigh-in supersedes a manual weight edit
    # (profile/04-weight-sync.feature).

  Scenario: Changing my sex ages old-formula readings out of the sync window, no reset needed
    Given I have logged measurements under my previous sex/formula
    When I change my sex in Profile
    Then future syncs draw only from readings computed under my new formula
    And readings under my old formula stay in my history, untouched, but stop
      counting toward the sync window
    And I see one line of inline copy noting my body-fat average will
      restart under the new formula
    # Described as an outcome (readings are filtered by current formula on
    # every read), not a "reset event" — there is no stored counter to reset
    # and nothing that can be forgotten or half-applied on a code path that
    # changes sex elsewhere in the app.

  Scenario: Gaps in my weekly cadence don't change how the sync gate or cap behave
    Given I have logged measurements with an uneven cadence (some weeks skipped)
    When I view my synced body-fat %
    Then it is still computed from my last 4 same-formula readings, and the
      cap behaves the same whether the gap was days or months
    And no reminder, streak, or "you missed a week" message is shown
    # The cap's job is bounding how far one update can move a target-feeding
    # value, regardless of WHY the new reading differs — being gap-agnostic
    # is deliberate, not an unexamined resemblance to weighRollingAvg. What's
    # still open (not this scenario's job to resolve): whether a reading
    # after a long gap deserves less TRUST going in, a measurement-protocol
    # question for the founder/coach — see the header.

  # ── Safeguarding interaction — holds at every reading count ───
  Scenario: The lean-body / low-fuel classification never reads a raw, unsynced reading
    Given any number of logged measurements, before or long after the sync gate
    When the app evaluates whether I'm in a lean-body state (isLeanBody, app.jsx:379)
    Then it reads the same synced/manual body-fat % everything else reads
    And there is no code path where a raw tape reading reaches this
      classification directly
    # Holds structurally because the sync mechanism above has exactly one
    # writer of p.bodyFat from measurement data — not because this scenario
    # enumerates every reading count. Replaces an earlier version of this
    # scenario that was scoped only to "fewer than 4 measurements" and said
    # nothing about the feature's behaviour once the sync gate has been
    # reached.

  Scenario: The existing "weight up while eating less" card explains a rising measured body-fat %
    Given the card is showing (app.jsx:3708-3743)
    Then its explanation of possible causes now includes a rise in my measured
      body-fat %, alongside water, glycogen, and muscle
    # Copy itself is a coach-hat pass, not decided in this file.

  Scenario: The existing card's button now points at Body Measurements, not the raw profile field
    Given the card is showing and auto-sync is live
    Then its call-to-action no longer says "updating your body-fat % in your
      profile keeps your targets tracking your real lean mass" as an instruction
    And it becomes a status line, and its button opens Body Measurements
      instead of the raw body-fat field
    # The old copy becomes actively wrong once the app updates this itself —
    # required as part of this work, not a follow-up.

  # ── Display ────────────────────────────────────────────────
  Scenario: Profile shows my current synced body-fat % with when it was last updated
    Given the sync gate has been reached at least once
    When I view my profile's calculated stats
    Then a "Body Fat % (measured)" row shows the current synced value
    And it is captioned with when that value was last updated
    # This is also the transparency mechanism that makes silent sync safe —
    # see the header's RESOLVED note on the sync mechanism.

  Scenario: History gets a body-fat % toggle alongside weight
    Given I am viewing my History screen
    Then a "SHOW BODY FAT %" toggle sits alongside the existing "SHOW WEIGHT" toggle
    And selecting it charts my measurement history the same way weight is charted

  Scenario: Too few readings for a trend line yet, individual points still shown
    Given I have fewer than TREND_MIN_POINTS logged measurements
    When I view the body-fat % chart
    Then my individual readings are plotted as points
    And no rolling trend line is drawn yet

  Scenario: The trend is never colour-coded
    Given I am viewing the body-fat % chart or the profile row
    Then no green/amber/red or up/down colour is applied to the value
    # Deliberately more restrained than even the weight trend — see design
    # review §2 and coach review §2.

  Scenario: Change is always framed over a window, never a single week's difference
    Given my body-fat % trend has moved between two readings
    Then any copy describing the change refers to a window (e.g. "since last
      month"), never a single most-recent-reading delta

  Scenario: The empty state before any measurement has ever been logged
    Given I have never logged a measurement
    When I view the Body Measurements card or the History toggle
    Then I see an explainer that tape measurements estimate body-fat % from
      neck, waist, and (if applicable) hip — no scan needed, under a minute
    And a "Log my first measurement" action is offered

  # ── Non-happy path ─────────────────────────────────────────
  Scenario: Logging a measurement offline still saves and syncs later
    Given I am offline
    When I log a measurement
    Then it is stored locally and the computed reading shows immediately
    And it syncs to the server, and can contribute to the sync gate, once I am
      back online
