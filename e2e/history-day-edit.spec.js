// Correcting a past day: its mode, and the calorie target it is graded against (FL-010).
//
// The founder set 12 Sep 2026 to MAINTAIN by mistake, logged at cut level, and could then edit
// that day's food and water but not what he had been aiming for. This drives the fix through the
// real screen.
//
// Deterministic by design: changing the mode changes ONLY the mode, and the target is a number
// the user sets. The app never tries to work out what the target "would have been" — that needs
// the day's TDEE adjustment and whether a custom target applied, neither of which was ever
// saved, so any reconstruction would be a guess presented as a record.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

// Local date parts, the way the app keys a day — NOT toISOString(), which is UTC.
const key = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};

// The reported day: declared MAINTAIN against a 2,709 target, eaten at cut level (2,331).
// 378 under a maintenance target is amber, "Under-eaten" — correct arithmetic, wrong intention.
const day = (n, over = {}) => ({
  date: key(n), mode: "maintain", kcal: 2331, protein: 180, carbs: 200, fat: 83,
  water: 6, training: false, logs: [{ id: 1, name: "Day", kcal: 2331, protein: 180, carbs: 200, fat: 83 }],
  targetKcal: 2709, targetProtein: 180, targetFat: 79, targetFatFloor: 59, floored: false,
  ...over,
});

const history = () => [day(3), day(2), day(1), day(0, { mode: "cut", kcal: 0, protein: 0, carbs: 0, fat: 0, logs: [] })];

// Open a day's detail by clicking its row. The row is identified by the mode chip inside it
// rather than by its kcal, because every seeded day here has the same kcal — so the averages
// card above the list carries that number too, and a text match would hit the chip, not a row.
const openHistory = async page => {
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.locator('button:has-text("📊")').click();
  await expect(page.getByText("HISTORY")).toBeVisible();
  await page.getByRole("button", { name: "7 Days" }).click();
};
const openPastDay = async page => {
  await openHistory(page);
  await page.getByText("MAINTAIN", { exact: true }).first().click();
  await expect(page.getByText("MACRO BREAKDOWN")).toBeVisible();
};
const openToday = async page => {
  await openHistory(page);
  await page.getByText("TODAY", { exact: true }).click();
  await expect(page.getByText("MACRO BREAKDOWN")).toBeVisible();
};

test.describe("A past day's mode", () => {
  test("is three chips, and one tap changes it — no confirm in the way", async ({ page }) => {
    await open(page, { history: history() });
    await openPastDay(page);

    await expect(page.getByRole("button", { name: "CUT" })).toBeVisible();
    await expect(page.getByRole("button", { name: "MAINTAIN" })).toBeVisible();
    await expect(page.getByRole("button", { name: "BULK" })).toBeVisible();

    await page.getByRole("button", { name: "CUT" }).click();
    await expect(page.getByText(/Scored against CUT/)).toBeVisible();
    await shot(page, "history-past-day-mode-corrected");
  });

  test("changing the mode does not move the target behind your back", async ({ page }) => {
    // The whole point of the deterministic choice: a label must never silently change a number.
    await open(page, { history: history() });
    await openPastDay(page);

    await expect(page.getByText(/target 2,709 kcal/)).toBeVisible();
    await page.getByRole("button", { name: "CUT" }).click();
    await expect(page.getByText(/target 2,709 kcal/)).toBeVisible();
  });

  test("correcting MAINTAIN to CUT turns the day green, because under is never a penalty", async ({ page }) => {
    // 2,331 against the 2,709 target that actually applied is 378 UNDER. On a cut that is in
    // range (app.jsx:497). It reads amber only while the day claims to be a maintenance day.
    await open(page, { history: history() });
    await openPastDay(page);

    await expect(page.getByText(/378 under/)).toBeVisible();
    await page.getByRole("button", { name: "CUT" }).click();
    await expect(page.getByText(/Scored against CUT · target 2,709 kcal · 378 under/)).toBeVisible();
  });

  test("today is not editable here — its own control is on the dashboard", async ({ page }) => {
    // Today's snapshot is rewritten from live state, so an edit made here would silently revert.
    await open(page, { history: history() });
    await openToday(page);

    await expect(page.getByRole("button", { name: "MAINTAIN" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "BULK" })).toHaveCount(0);
  });
});

test.describe("A past day's calorie target", () => {
  test("can be set by hand, and the day is regraded against it", async ({ page }) => {
    await open(page, { history: history() });
    await openPastDay(page);

    await page.getByRole("button", { name: "✎" }).click();
    const box = page.locator('input[type="number"]').first();
    await box.fill("2209");
    await page.getByRole("button", { name: "Save" }).click();

    // 2,331 against a 2,209 target is 122 OVER.
    await expect(page.getByText(/target 2,209 kcal · 122 over/)).toBeVisible();
    await shot(page, "history-past-day-target-edited");
  });

  test("the safety floor still holds on a typed number", async ({ page }) => {
    // A typed target is the user's own choice, but it cannot go below SAFE_MIN.
    await open(page, { history: history() });
    await openPastDay(page);

    await page.getByRole("button", { name: "✎" }).click();
    await page.locator('input[type="number"]').first().fill("900");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(/target 1,400 kcal/)).toBeVisible();
  });

  test("cancelling leaves the stored target alone", async ({ page }) => {
    await open(page, { history: history() });
    await openPastDay(page);

    await page.getByRole("button", { name: "✎" }).click();
    await page.locator('input[type="number"]').first().fill("1800");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByText(/target 2,709 kcal/)).toBeVisible();
  });

  test("a day saved before targets were stored says so, rather than pretending", async ({ page }) => {
    await open(page, {
      history: [
        day(2, { targetKcal: null, targetProtein: null, targetFat: null, targetFatFloor: null }),
        day(0, { mode: "cut", kcal: 0, protein: 0, carbs: 0, fat: 0, logs: [] }),
      ],
    });
    await openPastDay(page);

    await expect(page.getByText(/No target was saved for this day/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Set target" })).toBeVisible();
  });
});
