// Today v2, Region C — water, weight | est. TDEE, measurements, workout, last 7 days.
// Contract: design/v2/HANDOVER.md §3 items 9–13 (D9, D19) and features/body/03-measurements-row.
//
// Every locator is a data-testid or a role/label, never v1 copy, so the v1 suite and this one
// cannot break each other. v2 is opened with `?ui=v2` — the harness clears localStorage on seed,
// and the query string is what turns the flag back on.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE } = require("./harness");

async function openV2(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
}

const keyDaysAgo = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const todayKeyIn = page => page.evaluate(() => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
});

/** A finished day's snapshot, with its real target recorded (the shape the daily effect writes). */
const snap = (daysAgo, { kcal, mode = "cut", logged = true }) => ({
  date: keyDaysAgo(daysAgo), mode, kcal, protein: 175, carbs: 220, fat: 72, water: 6, training: false,
  logs: logged ? [{ id: 1, name: "day", kcal, protein: 175, carbs: 220, fat: 72, time: "08:00" }] : [],
  targetKcal: mode === "cut" ? 2241 : 2741, targetProtein: 169, targetFat: 79, floored: false,
});

test.describe("Water", () => {
  test("+ and − move the 8-glass strip and the count, and the count is stored", async ({ page }) => {
    await openV2(page);
    const water = page.getByTestId("v2-water");
    await expect(page.getByTestId("v2-water-count")).toHaveText(/0 \/ 8 glasses/i);
    await expect(page.getByTestId("v2-water-minus")).toBeDisabled();

    await page.getByRole("button", { name: "Add a glass of water" }).click();
    await page.getByRole("button", { name: "Add a glass of water" }).click();
    await expect(page.getByTestId("v2-water-count")).toHaveText(/2 \/ 8 glasses/i);
    await expect(water.locator('i[data-filled="1"]')).toHaveCount(2);

    await page.getByRole("button", { name: "Remove a glass of water" }).click();
    await expect(page.getByTestId("v2-water-count")).toHaveText(/1 \/ 8 glasses/i);
    await expect(water.getByRole("meter")).toHaveAttribute("aria-valuenow", "1");
    const k = await todayKeyIn(page);
    await expect.poll(() => page.evaluate(k => localStorage.getItem("water__" + k), k)).toBe("1");
  });
});

test.describe("Weight | Est. TDEE", () => {
  test("logging a weight shows it, and Change replaces today's reading instead of adding one", async ({ page }) => {
    await openV2(page, { weighInsSpec: { days: 10, startWeight: 99, perDay: -0.05, endDaysAgo: 1 } });
    await expect(page.getByTestId("v2-tdee")).toHaveText(/^~[\d,]+ kcal$/);
    await expect(page.getByTestId("v2-tdee-confidence")).toHaveText(/estimating/i);

    await expect(page.getByTestId("v2-weight-log")).toBeDisabled();
    await page.getByLabel("Weight today in kg").fill("98.4");
    await page.getByRole("button", { name: "Log weight" }).click();
    await expect(page.getByTestId("v2-weight-today")).toContainText("98.4");

    await page.getByRole("button", { name: "Change today's weight" }).click();
    await page.getByLabel("Weight today in kg").fill("98.1");
    await page.getByRole("button", { name: "Update today's weight" }).click();
    await expect(page.getByTestId("v2-weight-today")).toContainText("98.1");

    const k = await todayKeyIn(page);
    const todays = await page.evaluate(k => JSON.parse(localStorage.getItem("weighins")).filter(w => w.date === k), k);
    expect(todays).toEqual([{ date: k, weight: 98.1 }]);
  });

  test("a week without a weigh-in is a quiet DUE on the cell, not a pop-up card", async ({ page }) => {
    await openV2(page, { weighInsSpec: { days: 5, startWeight: 99, perDay: 0, endDaysAgo: 9 } });
    await expect(page.getByTestId("v2-weight-due")).toBeVisible();
    await expect(page.getByText("Time for a quick check-in?")).toHaveCount(0);
    await page.getByLabel("Weight today in kg").fill("98.8");
    await page.getByRole("button", { name: "Log weight" }).click();
    await expect(page.getByTestId("v2-weight-due")).toHaveCount(0);
  });
});

test.describe("Measurements row (features/body/03)", () => {
  const old = [{ date: keyDaysAgo(8), neck: 40, waist: 95, hip: null, formula: "male", computed_bf: 22.4 }];

  test("the row shows the last reading, and a due week is an amber DUE, never a pop-up", async ({ page }) => {
    await openV2(page, { extra: { bodymeasurements: JSON.stringify(old) } });
    await expect(page.getByTestId("v2-measure-reading")).toHaveText("Neck 40 · Waist 95 cm");
    await expect(page.getByTestId("v2-measure-when")).toHaveText("Last logged 8 days ago · weekly");
    await expect(page.getByTestId("v2-measure-due")).toBeVisible();
    await expect(page.getByText("Also log this week's measurements?")).toHaveCount(0);
  });

  test("logging from the row saves through the v1 path, reports back and clears DUE", async ({ page }) => {
    await openV2(page, { extra: { bodymeasurements: JSON.stringify(old) } });
    await page.getByRole("button", { name: "Log measurements" }).click();
    await expect(page.getByLabel("hip cm")).toHaveCount(0);

    await page.getByLabel("neck cm").fill("40");
    await page.getByLabel("waist cm").fill("38");
    await expect(page.getByRole("button", { name: "Save measurement" })).toBeDisabled();
    await expect(page.getByTestId("v2-measurements").getByRole("alert")).toContainText("Waist needs to be bigger");

    await page.getByLabel("neck cm").fill("38");
    await page.getByLabel("waist cm").fill("83");
    await page.getByRole("button", { name: "Save measurement" }).click();

    await expect(page.getByTestId("v2-measure-result")).toContainText("Estimated body fat");
    await expect(page.getByTestId("v2-measure-reading")).toHaveText("Neck 38 · Waist 83 cm");
    await expect(page.getByTestId("v2-measure-when")).toContainText("Last logged today");
    await expect(page.getByTestId("v2-measure-due")).toHaveCount(0);

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("bodymeasurements")));
    expect(stored).toHaveLength(2);
    expect(stored[1]).toMatchObject({ neck: 38, waist: 83, formula: "male" });
    expect(stored[1].computed_bf).toBeGreaterThan(0);
  });

  test("a woman's row and form include the hip; first-ever offers the routine note", async ({ page }) => {
    await openV2(page, { profile: { ...PROFILE, sex: "female" } });
    await expect(page.getByTestId("v2-measure-reading")).toHaveText("No measurements yet");
    await page.getByRole("button", { name: "Log measurements" }).click();
    await expect(page.getByLabel("hip cm")).toBeVisible();
    await expect(page.getByLabel("Your usual measuring conditions")).toBeVisible();
    await page.getByTestId("v2-measure-close").click();
    await expect(page.getByTestId("v2-measure-form")).toHaveCount(0);
  });
});

test.describe("Workout", () => {
  test("Log workout adds the session, and it can be removed", async ({ page }) => {
    await openV2(page);
    const wo = page.getByTestId("v2-workout");
    await expect(page.getByTestId("v2-workout-summary")).toContainText(/Legs/);
    await expect(page.getByTestId("v2-workout-summary")).toContainText(/45 min · moderate · \d+ kcal/);

    await page.getByTestId("v2-workout-summary").click();
    await page.getByLabel("Workout type", { exact: true }).selectOption("push");
    await page.getByRole("button", { name: "Log workout" }).click();
    await expect(wo.getByTestId("v2-workout-item")).toHaveCount(1);
    await expect(wo.getByTestId("v2-workout-item")).toContainText("Push · 45 min · moderate");

    await wo.getByRole("button", { name: /Remove workout/ }).click();
    await expect(wo.getByTestId("v2-workout-item")).toHaveCount(0);
  });

  test("Paste log is Pro: a free user gets the premium gate", async ({ page }) => {
    await openV2(page);
    await page.getByRole("button", { name: /Paste a workout log, Pro/ }).click();
    await expect(page.getByText("Workout AI Parser").first()).toBeVisible();
    await expect(page.getByTestId("v2-workout-paste-form")).toHaveCount(0);
  });

  test("a premium user opens the paste form", async ({ page }) => {
    await openV2(page, { premium: true });
    await page.getByRole("button", { name: "Paste a workout log" }).click();
    await expect(page.getByLabel("Workout log")).toBeVisible();
  });
});

test.describe("Last 7 days", () => {
  const week = (overrides = {}) => Array.from({ length: 7 }, (_, i) => snap(i + 1, { kcal: 2200, ...(overrides[i + 1] || {}) }));

  test("seven on-target cut days read as a real cut, with seven lit lamps", async ({ page }) => {
    await openV2(page, { history: week() });
    await expect(page.getByTestId("v2-last7-verdict")).toContainText("A real cut.");
    await expect(page.getByTestId("v2-last7-count")).toHaveText("7 of 7 days logged.");
    const days = page.getByTestId("v2-last7-day");
    await expect(days).toHaveCount(7);
    await expect(page.locator('[data-testid="v2-last7-day"][data-state="green"]')).toHaveCount(7);
    // The newest lamp is yesterday — today is never in the window.
    await expect(days.last()).toHaveAttribute("data-date", keyDaysAgo(1));
  });

  test("calories alone grade a day: one big over day is marked, an unlogged day is a gap", async ({ page }) => {
    await openV2(page, { history: week({ 2: { kcal: 3000 }, 4: { kcal: 0, logged: false } }) });
    await expect(page.locator(`[data-date="${keyDaysAgo(2)}"]`)).toHaveAttribute("data-state", "red");
    await expect(page.locator(`[data-date="${keyDaysAgo(4)}"]`)).toHaveAttribute("data-state", "unlogged");
    await expect(page.getByTestId("v2-last7-count")).toHaveText("6 of 7 days logged.");
  });

  test("Maintain days are neutral (D19): logged, but never graded", async ({ page }) => {
    const hist = Array.from({ length: 7 }, (_, i) => snap(i + 1, { kcal: 3400, mode: "maintain" }));
    await openV2(page, { history: hist, mode: "maintain" });
    await expect(page.locator('[data-testid="v2-last7-day"][data-state="neutral"]')).toHaveCount(7);
  });

  test("a new account says it is still filling in", async ({ page }) => {
    await openV2(page, { history: [snap(1, { kcal: 2200 }), snap(2, { kcal: 2200 })] });
    await expect(page.getByTestId("v2-last7-verdict")).toContainText("Still filling in.");
    await expect(page.locator('[data-testid="v2-last7-day"][data-state="green"]')).toHaveCount(0);
  });
});

test.describe("Screenshots", () => {
  for (const scheme of ["dark", "light"]) {
    test(`region C, ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await openV2(page, {
        history: Array.from({ length: 7 }, (_, i) => snap(i + 1, { kcal: 2200 })),
        weighInsSpec: { days: 16, startWeight: 99, perDay: -0.05, endDaysAgo: 1 },
        extra: { bodymeasurements: JSON.stringify([{ date: keyDaysAgo(8), neck: 40, waist: 95, hip: null, formula: "male", computed_bf: 22.4 }]) },
      });
      await page.getByTestId("v2-water").scrollIntoViewIfNeeded();
      await shot(page, `v2-region-c-${scheme}`);
    });
  }
});
