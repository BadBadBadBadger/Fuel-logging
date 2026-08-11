// The auto-lowering fix, at the UI layer — DEVICE-TEST.md B5 and B6.
// Contract: features/energy-safety/04-adaptive-tdee-guardrails.feature. Reasoning: ENERGY_MODEL.md §5.4.
//
// This is the mechanism that caused the original harm: runCalibration read "weight went up while
// eating in a deficit" as "your metabolism is slower" and lowered the target. Water, glycogen and a
// full gut look identical to fat gain over one week.
//
// The asymmetry itself — that the correction only runs downward when NOT cutting — is arithmetic and
// belongs to __tests__/logic.test.js, which already covers it. What this layer owns is the promise
// made on screen: that the explanation appears, and that it says the target was left alone.

const { test, expect } = require("@playwright/test");
const { open, TODAY, daysAgo } = require("./harness");

// Three weeks of steadily rising weight — a gain the 14-day trend can actually see.
const RISING = { days: 21, startWeight: 98, perDay: 0.05 };

// The stall check reads a 21-day span, and weighRollingAvg needs at least THREE entries before
// `today − 21` or it returns null. 24 days yields two, so the whole check silently evaluates to
// "no data" — and a negative test written on 24 days passes without proving anything. 30 days
// leaves real margin. (DEVICE-TEST.md's B6 snippet uses 25, which clears it by exactly one entry.)
const STALL_DAYS = 30;
const FLAT    = { days: STALL_DAYS, startWeight: 98, perDay: 0 };
const FALLING = { days: STALL_DAYS, startWeight: 98, perDay: -0.06 };

const STALLED_BLOCK = {
  start: daysAgo(42), load: 20, startWeight: 98, offRun: 0, breakLoad: 0,
  lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null,
};

test.describe("Weight up while eating less than maintenance", () => {
  test("the card explains the gain, and says the target was left alone", async ({ page }) => {
    await open(page, { weighInsSpec: RISING, mode: "cut" });

    await expect(page.getByText("WEIGHT UP WHILE EATING LESS THAN MAINTENANCE"))
      .toBeVisible({ timeout: 15_000 });
    // The load-bearing sentence. If the app ever does lower the target here, this line becomes a
    // lie before it becomes a bug report — so it is asserted verbatim.
    await expect(page.getByText(/This is usually water, glycogen or muscle — not a slower metabolism/))
      .toBeVisible();
    await expect(page.getByText(/Your target\s+hasn't been lowered/)).toBeVisible();

    await page.screenshot({ path: "e2e/screenshots/b5-weight-up-cutting.png" });
  });

  test("it offers a body-fat update, and carries no mode buttons", async ({ page }) => {
    await open(page, { weighInsSpec: RISING, mode: "cut" });
    await expect(page.getByText("WEIGHT UP WHILE EATING LESS THAN MAINTENANCE"))
      .toBeVisible({ timeout: 15_000 });

    await expect(page.getByRole("button", { name: "Update my body-fat %" })).toBeVisible();
    // The mode picker is the only surface that changes mode — no card duplicates it.
    await expect(page.getByRole("button", { name: "Start a 2-week break" })).toHaveCount(0);
  });

  test("at Maintain it stays silent — there the evidence is clean", async ({ page }) => {
    // Not a duplicate of the Jest asymmetry test: that one asserts the correction runs, this one
    // asserts the *explanation* does not appear where it would be wrong. File 03's break copy
    // owns the not-cutting case.
    await open(page, { weighInsSpec: RISING, mode: "maintain" });
    await page.waitForTimeout(1000); // absence has no event to wait for

    await expect(page.getByText("WEIGHT UP WHILE EATING LESS THAN MAINTENANCE")).toHaveCount(0);
  });

  test("a scale going the right way says nothing at all", async ({ page }) => {
    await open(page, { weighInsSpec: { days: 21, startWeight: 98, perDay: -0.05 }, mode: "cut" });
    await page.waitForTimeout(1000);

    await expect(page.getByText("WEIGHT UP WHILE EATING LESS THAN MAINTENANCE")).toHaveCount(0);
  });
});

test.describe("The stall nudge", () => {
  test("three flat weeks while cutting offers a break, blamelessly", async ({ page }) => {
    await open(page, { cutBlock: STALLED_BLOCK, weighInsSpec: FLAT, mode: "cut" });

    await expect(page.getByText("YOUR LOSS HAS STALLED")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/The scale hasn't moved in about three weeks/)).toBeVisible();
    // Blameless by construction: bodies adapt, rather than you failed.
    await expect(page.getByText(/Bodies adapt to a long deficit/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Start a 2-week break" })).toBeVisible();

    await page.screenshot({ path: "e2e/screenshots/b6-stall-nudge.png" });
  });

  test("the stall outranks the plain week-count copy — one message, not two", async ({ page }) => {
    await open(page, { cutBlock: STALLED_BLOCK, weighInsSpec: FLAT, mode: "cut" });
    await expect(page.getByText("YOUR LOSS HAS STALLED")).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText(/YOU'VE BEEN CUTTING FOR \d+ WEEKS/)).toHaveCount(0);
  });

  test("a moving scale is not a stall", async ({ page }) => {
    await open(page, { cutBlock: STALLED_BLOCK, weighInsSpec: FALLING, mode: "cut" });
    await page.waitForTimeout(1000);

    await expect(page.getByText("YOUR LOSS HAS STALLED")).toHaveCount(0);
  });
});
