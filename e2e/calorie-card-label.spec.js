// The CONSUMED / REMAINING card's caption — features/dashboard/01-calorie-tolerance.feature,
// the three scenarios added 2026-09-15.
//
// The founder's Bug 3 (features/logging/00-bug-report.md): 2,366 consumed against a 2,319 target
// printed "REMAINING 47 kcal", and he read it as 47 left. The word came from the colour bands
// (inside 100 kcal = fine = REMAINING) while the number was the gap with its sign dropped. The
// arithmetic is Jest's (kcalCardLabel); this file asks what the card actually says.
//
// The target is pinned by seeding `target_kcal`, the custom-target key the ✎ pill writes — so the
// three cases are exactly the report's numbers and not whatever calcTargets makes of the seeded
// profile that day. 2,319 sits above the 1,400 kcal male floor, so it is used as-is.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

const TARGET = 2319;

const meal = kcal => ({ id: 1755000000000, name: "The day so far", time: "13:14",
  kcal, protein: 150, carbs: 200, fat: 60 });

/** The card's right-hand caption and the number under it. */
const caption = page => page.getByText(/^(OVER BY|REMAINING|JUST OVER)$/);
const figure  = page => caption(page).locator("xpath=following-sibling::div[1]");

const openWith = async (page, consumed) => {
  await open(page, { logs: [meal(consumed)], extra: { target_kcal: String(TARGET) } });
  await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
  // The pinned target is on screen — otherwise the three cases below prove nothing.
  await expect(page.getByText(`${TARGET.toLocaleString()} kcal`).first()).toBeVisible();
};

test.describe("The calorie card says over when you are over", () => {
  test("47 over reads OVER BY 47 — the founder's case", async ({ page }) => {
    await openWith(page, TARGET + 47);
    await expect(caption(page)).toHaveText("OVER BY");
    await expect(figure(page)).toContainText("47");
    await shot(page, "calorie-card-over-by-47");
  });

  test("47 under reads REMAINING 47", async ({ page }) => {
    await openWith(page, TARGET - 47);
    await expect(caption(page)).toHaveText("REMAINING");
    await expect(figure(page)).toContainText("47");
  });

  test("exactly on target reads REMAINING 0", async ({ page }) => {
    await openWith(page, TARGET);
    await expect(caption(page)).toHaveText("REMAINING");
    await expect(figure(page)).toContainText("0");
  });

  test("150 over is amber and still says OVER BY — the colour softens, the word does not", async ({ page }) => {
    await openWith(page, TARGET + 150);
    await expect(caption(page)).toHaveText("OVER BY");
    await expect(figure(page)).toContainText("150");
    await expect(page.getByText("JUST OVER")).toHaveCount(0);
  });
});
