// Two months of weigh-ins — DEVICE-TEST.md item 28, and the safety claim underneath it.
//
// Two runs of 60 days, differing only in what the scale did:
//   A. Weight comes off steadily — the ordinary case. Nothing alarming should be said.
//   B. Weight does not move at all — a break must be recommended, and crucially the calorie
//      target must NOT keep grinding downward in response.
//
// B is the one that matters. It is the shape of the harm this whole workstream exists to answer:
// nine months of a deficit walking the target down. The rule (ENERGY_MODEL.md §5.4) is that while
// you are cutting, a disappointing scale never lowers the app's estimate of what you burn — because
// water, glycogen and a full gut are indistinguishable from fat gain over one week.

const { test, expect } = require("@playwright/test");
const { open, shot, PROFILE, TODAY, daysAgo } = require("./harness");

const DAYS = 60;

// ~0.45 kg/week — an ordinary, sustainable rate for a 98.5 kg body.
const LOSING  = { days: DAYS, startWeight: 98.5, perDay: -0.065 };
// The scale has not moved in two months.
const STALLED = { days: DAYS, startWeight: 98.5, perDay: 0 };

// Same two series, but ending yesterday so today's slot is free to log into. The widget swaps its
// input for a read-only reading once today has an entry, so a series ending today can't be added to.
const LOSING_OPEN  = { ...LOSING,  endDaysAgo: 1 };
const STALLED_OPEN = { ...STALLED, endDaysAgo: 1 };

// An eight-week-old block, deep enough that the stall check has something to talk about.
const LONG_BLOCK = {
  start: daysAgo(56), load: 30, startWeight: 98.5, offRun: 0, breakLoad: 0,
  lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null,
};

/**
 * The calorie TARGET, read from the editable chip — identified by the ✎ next to it (app.jsx:3429).
 *
 * Not "the first span saying N kcal": the workout card's burn estimate ("486 kcal") sits higher in
 * the DOM and matches that just as well. An earlier version of this helper read that instead, so a
 * before/after comparison sat comparing 486 to 486 and passed while proving nothing.
 */
const targetKcal = page => page.evaluate(() => {
  const pencils = [...document.querySelectorAll("span")].filter(s => s.textContent.trim() === "✎");
  for (const p of pencils) {
    const sib = p.parentElement && p.parentElement.firstElementChild;
    if (sib && /^[\d,]+ kcal$/.test(sib.textContent.trim()))
      return parseInt(sib.textContent.replace(/[^\d]/g, ""), 10);
  }
  return null;
});

const storedAdj = page => page.evaluate(() => parseInt(localStorage.getItem("tdee_adj") || "0", 10) || 0);

/** Log a weigh-in through the widget, which is what triggers calibration (app.jsx:5517). */
async function logWeight(page, kg) {
  await page.getByPlaceholder(/kg today|lb today/).fill(String(kg));
  await page.getByRole("button", { name: "LOG", exact: true }).click();
  await page.waitForTimeout(600);
}

test.describe("Two months of weigh-ins — weight coming off", () => {
  test("the trend reads as ordinary progress, with nothing alarming said", async ({ page }) => {
    await open(page, { weighInsSpec: LOSING, cutBlock: LONG_BLOCK, mode: "cut" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    // Losing steadily is not a stall, and it is not a gain.
    await expect(page.getByText("YOUR LOSS HAS STALLED")).toHaveCount(0);
    await expect(page.getByText("WEIGHT UP WHILE EATING LESS THAN MAINTENANCE")).toHaveCount(0);

    await shot(page, "weighin-60d-losing");
  });

  test("a fresh weigh-in is accepted and the trend takes it", async ({ page }) => {
    await open(page, { weighInsSpec: LOSING_OPEN, cutBlock: LONG_BLOCK, mode: "cut" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    const before = await page.evaluate(() => JSON.parse(localStorage.getItem("weighins") || "[]").length);
    await logWeight(page, 94.4);
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem("weighins") || "[]"));

    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].weight).toBe(94.4);

    await shot(page, "weighin-60d-losing-after-log");
  });
});

test.describe("Two months of weigh-ins — the scale hasn't moved", () => {
  test("a break is recommended, blamelessly", async ({ page }) => {
    await open(page, { weighInsSpec: STALLED, cutBlock: LONG_BLOCK, mode: "cut" });

    await expect(page.getByText("YOUR LOSS HAS STALLED")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "Start a 2-week break" })).toBeVisible();
    // Blame-free by construction, and it must never respond to a stall by asking for less food.
    await expect(page.getByText(/Bodies adapt to a long deficit/)).toBeVisible();

    await shot(page, "weighin-60d-stalled-break-recommended");
  });

  // Two months of eating ~500 kcal under maintenance while the scale refuses to move. The
  // symmetric controller wants to conclude "your burn is lower" and walk the target down. That
  // conclusion is exactly the harm — water, glycogen and a full gut look identical to fat gain.
  const DEFICIT_HISTORY = { days: DAYS, kcal: 2241, mode: "cut", endDaysAgo: 1 };
  // Identical evidence, declared at maintenance — where it IS clean, and the loop should act.
  const MAINTAIN_HISTORY = { ...DEFICIT_HISTORY, mode: "maintain" };

  test("the target is NOT ground down by two months of disappointment", async ({ page }) => {
    // The core safety property, seen from the UI. Log a weigh-in — which is what runs calibration
    // — and confirm the adaptive adjustment did not move DOWNWARD, and the target did not fall.
    await open(page, { weighInsSpec: STALLED_OPEN, historySpec: DEFICIT_HISTORY,
      cutBlock: LONG_BLOCK, mode: "cut" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    const targetBefore = await targetKcal(page);
    const adjBefore    = await storedAdj(page);
    expect(targetBefore).toBeGreaterThan(0);

    await logWeight(page, 98.5); // still exactly the same weight, two months on

    const targetAfter = await targetKcal(page);
    const adjAfter    = await storedAdj(page);

    expect(adjAfter).toBeGreaterThanOrEqual(adjBefore);
    expect(targetAfter).toBeGreaterThanOrEqual(targetBefore);

    await shot(page, "weighin-60d-stalled-target-held");
  });

  test("the target stays above the safe floor, not merely unchanged", async ({ page }) => {
    // Unchanged is not the same as safe. SAFE_MIN for a male body is 1400 kcal (app.jsx:569 area),
    // and the steady-loss floor caps any deficit at 25% of maintenance.
    await open(page, { weighInsSpec: STALLED_OPEN, historySpec: DEFICIT_HISTORY,
      cutBlock: LONG_BLOCK, mode: "cut" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await logWeight(page, 98.5);
    expect(await targetKcal(page)).toBeGreaterThanOrEqual(1400);
  });

  test("at Maintain the same evidence IS acted on — the control", async ({ page }) => {
    // Without this the test above proves nothing: an adjustment that never fires looks identical
    // to one that is deliberately refused. Same weigh-ins, same intake, same stall — declared at
    // maintenance instead of cut, where the evidence is clean. Here the loop must actually move.
    await open(page, { weighInsSpec: STALLED_OPEN, historySpec: MAINTAIN_HISTORY,
      cutBlock: LONG_BLOCK, mode: "maintain" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    const adjBefore = await storedAdj(page);
    await logWeight(page, 98.5);

    // Eating below the estimate and not losing, at maintenance, genuinely does mean the estimate
    // was too high — so it comes DOWN here. That it moves at all is the point: it proves the
    // cutting case above is an active refusal, not an inert loop.
    const adjAfter = await storedAdj(page);
    expect(adjAfter).toBeLessThan(adjBefore);
    await shot(page, "weighin-60d-stalled-maintain");
  });
});
