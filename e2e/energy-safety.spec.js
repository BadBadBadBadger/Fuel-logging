// Energy safety, at the UI layer — DEVICE-TEST.md B2 (the soft nudge).
// Contract: features/energy-safety/02-cut-cycle-blocks.feature.
//
// Arithmetic is NOT re-asserted here — cutThresholds and the drain are already nailed in
// __tests__/logic.test.js. What this layer owns is the thing unit tests structurally cannot
// see: whether the card renders, and what it says.

const { test, expect } = require("@playwright/test");
const { open, storedMode, TODAY, daysAgo } = require("./harness");

// load 56 sits past the soft threshold but short of the hard one — the nudge, not the warning.
const MID_CUT_BLOCK = {
  start: "2026-05-01", load: 56, startWeight: 98.5, offRun: 0, breakLoad: 0,
  lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null,
};

// Ten weeks in, load 20: past the bar's minimum of 7 so the gauge speaks, well short of the
// soft threshold of 56 so it has nothing to advise. Start is relative, so WEEK 10 never drifts.
const EARLY_CUT_BLOCK = {
  start: daysAgo(70), load: 20, startWeight: 98.5, offRun: 0, breakLoad: 0,
  lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null,
};

test.describe("The cut bar while cutting", () => {
  test("fills as the cut runs, labelled in real weeks", async ({ page }) => {
    await open(page, { cutBlock: EARLY_CUT_BLOCK, mode: "cut" });

    await expect(page.getByText("CUTTING · WEEK 10")).toBeVisible({ timeout: 15_000 });
    // The two numbers it must never mistake for a week count: the load (20) and the fill (36%).
    await expect(page.getByText(/CUTTING · WEEK (20|36)\b/)).toHaveCount(0);
    // "days to fully recharged" belongs to the draining direction only.
    await expect(page.getByText(/fully recharged/)).toHaveCount(0);

    await page.screenshot({ path: "e2e/screenshots/b1-mid-cut.png" });
  });

  test("the fill is partial — neither empty nor complete", async ({ page }) => {
    await open(page, { cutBlock: EARLY_CUT_BLOCK, mode: "cut" });
    await expect(page.getByText("CUTTING · WEEK 10")).toBeVisible({ timeout: 15_000 });

    // The inner fill div carries width:<pct>%. Read it rather than the computed style, so the
    // assertion is about what the app asked for, not how Chromium rounded it.
    const width = await page.evaluate(() => {
      const el = [...document.querySelectorAll("div")]
        .find(d => /^\d+(\.\d+)?%$/.test(d.style.width) && d.style.borderRadius === "999px");
      return el ? parseFloat(el.style.width) : null;
    });
    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThan(100);
  });

  test("below the soft threshold the bar carries no advice of its own", async ({ page }) => {
    // The bar never duplicates the nudge — at load 20 there is nothing to nudge about yet.
    await open(page, { cutBlock: EARLY_CUT_BLOCK, mode: "cut" });
    await expect(page.getByText("CUTTING · WEEK 10")).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText(/YOU'VE BEEN CUTTING FOR/)).toHaveCount(0);
    await expect(page.getByText(/YOUR LOSS HAS STALLED/)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Start a 2-week break" })).toHaveCount(0);
  });
});

test.describe("A long cut offers a diet break", () => {
  test("the soft nudge appears, and starting a break needs no confirmation", async ({ page }) => {
    // A native confirm() here would be a regression: the no-friction rule says the primary
    // action is one tap. Fail loudly rather than let Playwright auto-dismiss it silently.
    const dialogs = [];
    page.on("dialog", async d => { dialogs.push(d.message()); await d.dismiss(); });

    await open(page, { cutBlock: MID_CUT_BLOCK, mode: "cut" });

    // The heading counts REAL WEEKS, never load — telling a gentle cutter a load number is
    // the failure mode 02 was written to avoid (app.jsx:564).
    await expect(page.getByText(/YOU'VE BEEN CUTTING FOR \d+ WEEKS/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/YOU'VE BEEN CUTTING FOR 56 WEEKS/)).toHaveCount(0);

    await page.screenshot({ path: "e2e/screenshots/b2-soft-nudge.png" });

    const startBreak = page.getByRole("button", { name: "Start a 2-week break" });
    await expect(startBreak).toBeVisible();
    await expect(page.getByRole("button", { name: "Not yet" })).toBeVisible();

    await startBreak.click();

    // The promise the button makes: it puts you in Maintain.
    expect(await storedMode(page)).toBe("maintain");
    expect(dialogs).toEqual([]);

    await page.screenshot({ path: "e2e/screenshots/b2-after-break.png" });
  });

  test("a fresh install says nothing about breaks at all", async ({ page }) => {
    // The bug found by hand last session: Cut is the default mode, so opening the app once
    // opened a block and the bar announced a break on an empty install. Silence is correct.
    await open(page, { mode: "cut" });
    await page.waitForTimeout(1000); // absence has no event to wait for

    await expect(page.getByText(/ON A BREAK/)).toHaveCount(0);
    await expect(page.getByText(/YOU'VE BEEN CUTTING FOR/)).toHaveCount(0);
    await expect(page.getByText(/RECHARGED/i)).toHaveCount(0);

    await page.screenshot({ path: "e2e/screenshots/fresh-install-quiet.png" });
  });
});
