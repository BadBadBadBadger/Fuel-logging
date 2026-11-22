// History v2, Region HA — the weight panel and the Body fat & tape sub-view.
// Contract: features/history/03-history-v2-weight.feature, design/v2/reviews/history-05-ruling.md
// §3 and §4. The arithmetic of weightTrend is owned by __tests__/weight-trend.test.js; this file
// asserts what the SCREEN says and draws.
//
// Locators are data-testids only, so this file and the v1 suite cannot break each other.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE } = require("./harness");

const keyDaysAgo = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

// The owner's six readings from the screenshot, placed relative to today exactly as they sat
// relative to 22 Nov: 23/10, 28/10, 04/11, 08/11, 18/11, 20/11.
const OWNER = [[30, 100.1], [25, 97.5], [18, 98.5], [14, 98.2], [4, 98.1], [2, 98.2]]
  .map(([n, weight]) => ({ date: keyDaysAgo(n), weight }));

const reading = (n, over = {}) => ({ date: keyDaysAgo(n), neck: 40, waist: 95, hip: null,
  formula: "male", computed_bf: 22.2, ...over });

async function openHistory(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("v2-nav-history").click();
  await expect(page.getByTestId("history-v2")).toBeVisible();
}

test.describe("Weight panel", () => {
  test("the owner's six readings: a rate over the last 4 weeks, in plain ink, and a chart", async ({ page }) => {
    await openHistory(page, { weighIns: OWNER });
    const panel = page.getByTestId("v2h-weight");
    await expect(panel).toBeVisible();
    await expect(page.getByTestId("v2h-weight-rate")).toHaveText("+0.1 kg a week · last 4 weeks · 5 weigh-ins");

    // No good/bad colour: the headline is the ink token, whichever way the scale went.
    const colours = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="v2h-weight-rate"]');
      const probe = document.createElement("span");
      probe.style.color = "var(--ink)";
      el.parentElement.appendChild(probe);
      const out = [getComputedStyle(el).color, getComputedStyle(probe).color];
      probe.remove();
      return out;
    });
    expect(colours[0]).toBe(colours[1]);

    // 30D is v1's row window (rangeWindow: today and the 30 days before), so all six readings
    // are dots, while the rate above counts only the 5 inside its fixed 28 days.
    const chart = page.getByTestId("v2h-weight-chart");
    await expect(chart).toBeVisible();
    await expect(chart.locator(".v2h-dots .recharts-dot")).toHaveCount(6);
    const d = await chart.locator(".v2h-ink path.recharts-curve").getAttribute("d");
    expect(d).not.toMatch(/C/);                       // linear: no cubic segments

    // Round 0.5 kg ticks, at least 2 kg of span.
    const ticks = (await chart.locator(".recharts-yAxis .recharts-cartesian-axis-tick-value").allTextContents()).map(Number);
    expect(ticks.length).toBeGreaterThanOrEqual(2);
    for (const t of ticks) expect(Math.round(t * 2)).toBeCloseTo(t * 2, 5);
    expect(Math.max(...ticks) - Math.min(...ticks)).toBeGreaterThanOrEqual(2);

    // No emoji anywhere on the panel.
    expect(await panel.innerText()).not.toMatch(/\p{Extended_Pictographic}/u);
    await shot(page, "v2-history-weight-light");
  });

  test("the trend line and dots are drawn in the theme's tokens, in dark too", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openHistory(page, { weighIns: OWNER });
    const chart = page.getByTestId("v2h-weight-chart");
    await expect(chart).toBeVisible();
    const got = await page.evaluate(() => {
      const c = document.querySelector('[data-testid="v2h-weight-chart"]');
      const line = c.querySelector(".v2h-ink path.recharts-curve");
      const dot = c.querySelector(".v2h-dots .recharts-dot");
      return { line: getComputedStyle(line).stroke, dot: getComputedStyle(dot).fill };
    });
    expect(got.line).toBe("rgb(219, 226, 223)");      // dark --ink #dbe2df
    expect(got.dot).toBe("rgb(127, 140, 142)");       // dark --dim #7f8c8e
    await shot(page, "v2-history-weight-dark");
  });

  test("below the minimum: a count and when the trend starts, no figure", async ({ page }) => {
    await openHistory(page, { weighIns: [{ date: keyDaysAgo(6), weight: 98.4 }, { date: keyDaysAgo(1), weight: 98.0 }] });
    await expect(page.getByTestId("v2h-weight-rate")).toHaveText("2 weigh-ins · your trend starts after 3 over 10 days");
    await expect(page.getByTestId("v2h-weight-chart")).toBeVisible();
  });

  test("an unchanged weight reads About level", async ({ page }) => {
    await openHistory(page, { weighInsSpec: { days: 21, startWeight: 98.2, perDay: 0 } });
    await expect(page.getByTestId("v2h-weight-rate")).toHaveText("About level · last 4 weeks · 21 weigh-ins");
  });

  test("a stone user sees the chart and the rate in pounds", async ({ page }) => {
    await openHistory(page, { weighIns: OWNER, extra: { fuel_wunit: "st" } });
    await expect(page.getByTestId("v2h-weight-rate")).toHaveText("+0.3 lb a week · last 4 weeks · 5 weigh-ins");
    const ticks = (await page.getByTestId("v2h-weight-chart")
      .locator(".recharts-yAxis .recharts-cartesian-axis-tick-value").allTextContents()).map(Number);
    expect(Math.min(...ticks)).toBeGreaterThan(200);
  });

  test("no weigh-ins: a quiet line, no chart, no measurements row", async ({ page }) => {
    await openHistory(page);
    await expect(page.getByTestId("v2h-weight-rate")).toHaveText("No weigh-ins yet. Log one on Today.");
    await expect(page.getByTestId("v2h-weight-chart")).toHaveCount(0);
    await expect(page.getByTestId("v2h-measure-link")).toHaveCount(0);
  });
});

test.describe("Body fat & tape", () => {
  const readings = [
    reading(40, { waist: 97, neck: 40, computed_bf: 23.6 }),
    reading(33, { waist: 96.5, neck: 40, computed_bf: 23.2 }),
    reading(26, { waist: 96, neck: 40.2, computed_bf: 22.7 }),
    reading(19, { waist: 95.5, neck: 40, computed_bf: 22.5 }),
    reading(12, { waist: 95, neck: 40.1, computed_bf: 22.1 }),
    reading(5, { waist: 94.5, neck: 40, computed_bf: 21.8 }),
  ];

  test("the quiet row opens the sub-view with both charts, and back returns", async ({ page }) => {
    await openHistory(page, { weighIns: OWNER, extra: { bodymeasurements: JSON.stringify(readings) } });
    const link = page.getByTestId("v2h-measure-link");
    await expect(link).toHaveText(/Body fat & tape · 6 readings/);
    await link.click();

    const view = page.getByTestId("v2h-measurements");
    await expect(view).toBeVisible();
    await expect(page.getByTestId("v2h-bodyfat-last")).toHaveText("21.8 %");
    await expect(page.getByTestId("v2h-bodyfat-change")).toHaveText(/^−1\.\d points since \d+ \w{3}$/);
    await expect(page.getByTestId("v2h-bodyfat-chart").locator(".v2h-dots .recharts-dot")).toHaveCount(6);
    await expect(page.getByTestId("v2h-tape-chart")).toBeVisible();
    await expect(view).toContainText("waist 94.5 · neck 40");
    expect(await view.innerText()).not.toMatch(/\p{Extended_Pictographic}/u);
    await shot(page, "v2-history-measurements-light");

    await page.getByRole("button", { name: "Back to History" }).click();
    await expect(page.getByTestId("v2h-weight")).toBeVisible();
  });

  test("dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openHistory(page, { weighIns: OWNER, extra: { bodymeasurements: JSON.stringify(readings) } });
    await page.getByTestId("v2h-measure-link").click();
    await expect(page.getByTestId("v2h-tape-chart")).toBeVisible();
    await shot(page, "v2-history-measurements-dark");
  });
});
