# ============================================================================
# BUILT 2026-11-10 (sw v108), on the founder's ask: "I've spent £15 in 6 months on my own, which
# makes the profit margin low. Structure which data sources we look at first, second, third, so
# the cheapest and best way is used first." Builds on logging/09 (reuse from the log).
#
# WHERE THE MONEY WENT. One text estimate ≈ 1p on Sonnet 4.6, and ~70% of that is the model's
# REPLY (output tokens cost 5× input), mostly a "reasoning" sentence on every row. Prompt caching
# cannot help: the fixed part of AI_PROMPT is ~700 tokens and Sonnet 4.6 caches nothing under 1024.
# So the savings are (a) not calling the model at all, (b) asking it about fewer items, and
# (c) shorter replies.
#
# THE DECISION — the lookup chain, cheapest and surest first; only what is still unknown goes on:
#   1. A stated totals line (logging/06).                                   free, exact
#   2. The whole line from the user's log or Quick Add (logging/09).        free
#   3. Each PART of a mixed meal from the log. Commas, ";", "+" and new lines split parts; "and",
#      "&" and "plus" split too, but a part split off by one of those must have 2+ food words to
#      be matched alone — "fish and chips", "mac and cheese", "cookies and cream" are one food.
#   4. A product label from Open Food Facts, asked by the WORKER (route /food — OFF never sees
#      the device or account). Only on a SURE match (the 2026-09-15 lesson, logging/07):
#        • the product's brand is one of the typed words; every typed food word is on the product
#          (one-letter typo allowed in 5+ letter words: "barbells" finds Barebells);
#        • its per-100 g figures add up; a portion exists (typed weight, else serving × count);
#        • several equally good fits must be the same product, else none is used and they go to
#          the AI as hints. Generic foods have no brand typed, so they never take a label.
#      A barcode — typed on its own, or read from a photo ON THE DEVICE (BarcodeDetector) — is
#      the product itself. A barcode photo sends no image to the AI at all.
#   5. The AI estimate, for the parts still unknown only. The parts already found are listed in
#      the prompt ("ALREADY WORKED OUT … return items ONLY for the rest"). Replies are now one
#      line of JSON with reasoning under 12 words.
#   6. A web check (Anthropic web search, added by the worker, never the client), ONLY on a tap of
#      "Check online", ONLY offered when an AI row is below 70% confidence, and only for the AI's
#      own rows. It is the costliest call (search fee + pages read), capped at 2 searches, and
#      counts as 5 calls against the daily limit.
#   Labels come BEFORE the model and answer parts the model is then not asked about; nothing ever
#   replaces the model's numbers after it answers (logging/07 still holds).
#
# NOT VERIFIED HERE: the live Open Food Facts responses (the build container cannot reach OFF;
# shapes are from its documented APIs and normalised defensively in offNormalise) and the live
# web search. Both need the worker redeployed. See DEVICE-TEST.md.
#
# Jest: __tests__/lookup-chain.test.js lifts splitAgainstPast, pickLabel, labelRow, barcodeRow
#       and the worker's offNormalise and runs them.
# Playwright: e2e/lookup-chain.spec.js counts worker calls on both routes.
# ============================================================================

@ai-capture
Feature: The cheapest sure source answers first
  As someone paying for every AI estimate
  I want the app to use my log and product labels before it asks the AI
  So that most meals cost nothing and the AI only works on what it must

  Background:
    Given I am signed in to Premium and on the AI logging screen
    And I logged "Chicken fajita pasta bake" on 3 Nov as 720 kcal

  Scenario: The part of a mixed meal I've logged comes from my log
    When I type "chicken fajita pasta bake and a greek yoghurt" and tap ANALYSE MEAL
    Then the bake is shown at 720 kcal "From your log"
    And the AI is asked about the yoghurt only, told the bake is already worked out
    And a "PARTLY FOUND WITHOUT AI" card says where each part came from

  Scenario: A one-word part after "and" is not matched on its own
    Given I logged "Cheese" before
    When I type "mac and cheese" and tap ANALYSE MEAL
    Then the AI is asked about "mac and cheese" as one food

  Scenario: A branded product I name, even misspelt, takes its label
    Given Open Food Facts has "Barebells Protein Bar Cookies & Cream", 364 kcal per 100 g, serving 55 g
    When I type "cookies and cream barbells protein bar" and tap ANALYSE MEAL
    Then I see one row of 200 kcal "(55 g)" from the product label
    And the AI is not asked

  Scenario: A count or weight sets the label portion
    When I type "2 barebells cookies and cream bars"
    Then the label row is 2 servings
    When I type "30g barebells cookies and cream"
    Then the label row is 30 g

  Scenario: A label that is not a sure match is only a hint
    Given Open Food Facts has two different Barebells flavours
    When I type "barebells protein bar" and tap ANALYSE MEAL
    Then the AI is asked, with both labels listed as possible products

  Scenario: Generic food never takes a label
    When I type "cooked chicken breast" and tap ANALYSE MEAL
    Then no label is used, because no brand was typed

  Scenario: A barcode is the product
    When I type "7340001802056" and tap ANALYSE MEAL
    Then the product's label is shown at one serving, and the AI is not asked

  Scenario: A photo of a barcode skips the photo estimate
    Given my phone can read barcodes
    When I photograph a packet's barcode and tap ANALYSE PHOTO
    Then its label is used and no image is sent to the AI

  Scenario: I can ask the AI for everything anyway
    When I tap "Re-estimate everything with AI"
    Then no log or label lookup is made and the AI estimates the whole meal

  Scenario: Check online is offered for guesses, and only runs on a tap
    Given the AI estimated the yoghurt at 55% confidence
    When I tap "Check online for published figures"
    Then one web check is made for the yoghurt only
    And the bake from my log is left as it is
    And the button goes away

  Scenario: No Check online when the AI is already sure
    Given every AI row is 70% confidence or more
    Then there is no "Check online" button
