# ============================================================================
# BUILT 2026-11-20 (sw v108), on the founder's user feedback:
#   1. "I can't select a photo I have in storage. If I could select a photo from storage then I
#      could take a pic with all my camera settings and then use that."
#   2. "I can only add one photo. … sometimes the back of a packet does not have the product name,
#      meaning inaccurate logging."
#
# BEFORE. One hidden <input type="file" accept="image/*" capture="environment">. On Android,
# `capture` opens the camera and nothing else — no gallery, no files. No `multiple`, and the state
# held one photo: a second pick silently REPLACED the first (confirmed in Playwright).
#
# THE DECISION (persona swarm: design lead, nutrition coach, engineering, privacy, QA; revised the
# same day on the founder's second round, final say by the critical thinker):
#   • ONE 📷 button in the action row (🎤 · 📷 · ANALYSE). One input, accept="image/*" multiple, NO
#     `capture`: the phone's own picker offers the camera and the photo reel in one place. (The
#     first cut had separate Camera / Gallery buttons; founder: "just tap the Photo button and you
#     have the camera reel at the bottom".)
#   • v109 (same evening): on the founder's phone the single button opened Android's own photo
#     picker (Google Photos) — gallery fine, NO camera option, and a web page can't add one. The
#     founder chose two icons in the row: 🎤 · 📷 (capture → camera) · 🖼 (multiple → picker) ·
#     ANALYSE. Both disabled at the cap.
#   • ONE sentence on screen (founder: "all that AI-generated text… one small sentence"):
#     "Describe it, snap it, or both — photos go to our AI once and are never stored." It is also
#     the on-screen privacy layer; the detail lives in the privacy policy. The accuracy tip lives in
#     the photo placeholder ("e.g. 'Tesco chicken tikka, ate half' — weights and brands help").
#     Removed: the intro paragraph, the notes hint, the packet hint, the privacy paragraph, the cap
#     line, the 🤖 on ANALYSE.
#   • Up to THREE photos of ONE meal — front, label, plate. More invites double counting and a
#     second meal sneaking in, and costs more per call. (coach + privacy; design/QA said 4)
#   • At the cap the 📷 button is DISABLED, not hidden (the row doesn't jump). A `multiple` picker
#     can't limit how many are selected, so over-picking still gets a one-line notice afterwards.
#   • Photos show as an 84px thumbnail strip, each with its own ✕ (40px hit area). No reorder
#     — the model doesn't need an order. Adding never replaces; one unreadable file never drops the
#     good ones; picking past the cap keeps the first and says how many were skipped.
#   • Every photo is its own image block in ONE model call (one estimate, one rate-limit unit),
#     in the order picked. Several photos get a 45 s timeout instead of 30 s (slow uploads).
#   • The prompt says the photos are views of ONE meal: front/back/label of one packet is ONE
#     item; packet + plate → the packet identifies, the plate gives the portion; genuinely
#     different foods are separate; when unsure, combine and lower confidence — never count twice.
#     A readable nutrition panel is fact: per-100 g scaled to the portion; per-serving only when
#     the portion is one stated serving. (coach) The label rule applies to one photo too.
#   • The notes still win (logging/08), across all photos; a product named in the notes identifies
#     a packet seen only from the back. The meal name comes from the packaging photo even if the
#     others show the back or the plate (logging/05).
#   • PRIVACY: gallery photos carry EXIF/GPS. fileToImage's canvas re-encode strips it — that is now
#     marked as a guarantee in the code. Photos stay in memory only and never reach the record.
#     Legal docs now name photos (privacy.html, subprocessors.html, ropa.md, play-data-safety.md).
#
# Jest: __tests__/ai-log.test.js — "Several photos of one meal (logging/10)" lifts the real
# AI_PHOTO_PROMPT and addPhotos. Playwright: e2e/photo-meal-multi.spec.js. Device: DEVICE-TEST.md
# → "New in v108". What the real model does with two photos is a device check, not a test here.
# ============================================================================

@wip @photo @ai-capture
Feature: Photos from the gallery, up to three per meal
  As someone logging a packaged or plated meal
  I want to use photos I already took, and more than one of them
  So that the product is identified from the front and the numbers come from the label

  Background:
    Given I am on the AI logging screen

  Scenario: Camera and gallery, one tap each
    Then the row reads 🎤 · 📷 · 🖼 · ANALYSE
    And 📷 opens the camera straight away
    And 🖼 opens the phone's photo picker, choosing one or several

  Scenario: One sentence, not paragraphs
    Then the only guidance on screen is "Describe it, snap it, or both — photos go to our AI once and are never stored."

  Scenario: Several photos picked at once
    When I choose 2 photos from the gallery in one go
    Then both appear as thumbnails, in the order I picked them
    And the analyse button reads "ANALYSE 2 PHOTOS"

  Scenario: A photo added later joins the others
    Given I have attached 1 photo
    When I take another with 📷
    Then I have 2 photos attached, not 1

  Scenario: No more than three
    When I choose 4 photos
    Then the first 3 are attached
    And I am told "Up to 3 photos per meal — 1 wasn't added."
    And 📷 and 🖼 are disabled until I remove one

  Scenario: Removing one photo
    Given I have attached 3 photos
    When I tap the ✕ on photo 2
    Then only that photo is removed and 📷 and 🖼 work again

  Scenario: Removing every photo returns to a typed meal
    Given I have attached 1 photo
    When I remove it
    Then the box is "Describe your meal" again and the button reads "ANALYSE MEAL"

  Scenario: An unreadable file does not lose the others
    When I choose 2 good photos and 1 file that isn't a readable image
    Then the 2 good photos are attached
    And I am told "1 photo couldn't be read — try a JPEG or PNG."

  Scenario: All the photos go in one estimate
    Given I have attached 2 photos
    When I tap "ANALYSE 2 PHOTOS"
    Then one request is sent, with one image per photo in order, then the prompt

  Scenario: Front and back of the same packet is one item
    Given my photos are the front and the back of one yogurt pot
    When the meal is estimated
    Then the prompt tells the model that is ONE item, never two

  Scenario: The packet names the food, the plate gives the portion
    Given my photos are a ready meal's packet and the plated meal
    Then the prompt tells the model to return that food once

  Scenario: A readable label is used as fact
    Given one photo shows the nutrition panel
    Then the prompt tells the model to use its per-100 g figures, scaled to the portion eaten

  Scenario: The entry is named after the product
    Given one photo shows the product name and another only the back of the pack
    When I log it as one entry
    Then the entry is named after the product

  Scenario: Photos are never stored
    When I log a photo meal
    Then the saved entry holds the numbers and the name, and no photo data
