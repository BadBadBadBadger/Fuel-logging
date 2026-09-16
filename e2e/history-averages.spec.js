// The History averages card, its labels, and the weight figure (features/history/01).
//
// Reproduces the account state the founder reported on 13 Sep 2026 — seven complete days plus a
// current day logged with nothing — and asserts what the SCREEN says. The arithmetic itself is
// owned by __tests__/history.test.js; the UTC day-key idiom is guarded statically by
// __tests__/datekeys.test.js. What this file adds is the thing 370 green Jest tests could not
// say anything about, because logic.test.js has no `require` of app.jsx.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

// Local date parts, the way the app keys a day (app.jsx todayKey) — NOT toISOString(),
// which is UTC and lands on the wrong day for an hour every night under BST.
const key = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};

// The reported week. daysAgo → [kcal, fat]. Day 0 is today, logged with nothing at all.
const REPORTED = {
  7: [2665, 67], 6: [2580, 72], 5: [2334, 80], 4: [2228, 80],
  3: [2504, 83], 2: [2927, 79], 1: [2331, 83],
};
const reportedHistory = () => [
  ...Object.keys(REPORTED).map(Number).sort((a, b) => b - a).map(n => ({
    date: key(n), mode: "cut", kcal: REPORTED[n][0], protein: 180, carbs: 200,
    fat: REPORTED[n][1], water: 6, training: false, logs: [{ kcal: REPORTED[n][0] }],
  })),
  { date: key(0), mode: "cut", kcal: 0, protein: 0, carbs: 0, fat: 0, water: 0,
    training: false, logs: [] },
];

const openHistory = async page => {
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.locator('button:has-text("📊")').click();
  await expect(page.getByText("HISTORY")).toBeVisible();
};
const sevenDays = async page => {
  await page.getByRole("button", { name: "7 Days" }).click();
};

test.describe("The seven-day average", () => {
  test("seven complete days average 2510 kcal, not 2196", async ({ page }) => {
    // 17,569 / 7 = 2,510. The shipped bug divided by 8 — including today's zeros — for 2,196.
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText("2510", { exact: true })).toBeVisible();
    await expect(page.getByText("2196", { exact: true })).toHaveCount(0);
    await shot(page, "history-7day-average");
  });

  test("fat averages 78g, not 68g", async ({ page }) => {
    // 544 / 7 = 77.7 → 78. Divided by 8 it is exactly 68, which is what shipped.
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText("78g", { exact: true })).toBeVisible();
    await expect(page.getByText("68g", { exact: true })).toHaveCount(0);
  });

  test("the average holds still once today is logged", async ({ page }) => {
    // The number the whole app is built around should not climb through the day.
    const withToday = reportedHistory().map(d => d.date === key(0)
      ? { ...d, kcal: 1800, protein: 150, carbs: 160, fat: 60, logs: [{ kcal: 1800 }] } : d);
    await open(page, { history: withToday });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText("2510", { exact: true })).toBeVisible();
  });

  test("a past day the app was only opened is not averaged in as a zero", async ({ page }) => {
    // The daily snapshot effect writes a row every day the app is opened, logged or not.
    const withEmptyPastDay = [
      { date: key(8), mode: "cut", kcal: 0, protein: 0, carbs: 0, fat: 0, water: 0,
        training: false, logs: [] },
      ...reportedHistory(),
    ];
    await open(page, { history: withEmptyPastDay });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText("2510", { exact: true })).toBeVisible();
  });
});

test.describe("What the labels say", () => {
  test("no header states a day count, so there is nothing to reconcile", async ({ page }) => {
    // The screen used to show three different counts: "7 Days", "7 DAYS AVERAGES · 8 DAYS" and
    // "8 DAYS LOGGED". Dates identify a window; counts only ever qualify it.
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/AVERAGES · 8 DAYS/)).toHaveCount(0);
    await expect(page.getByText(/8 DAYS LOGGED/)).toHaveCount(0);
    await expect(page.getByText(/DAILY AVERAGE ·/)).toBeVisible();
    await expect(page.getByText(/DAY BY DAY ·/)).toBeVisible();
  });

  test("no footnote under the numbers — the dates carry it", async ({ page }) => {
    // The card used to explain itself twice over: "7 of 7 days logged · today not counted yet",
    // then "What you logged. Today isn't counted until it's done." Both lines are gone. Today's
    // exclusion is still legible from the two headers ending on two different dates, and from the
    // TODAY row below (asserted in the next test).
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/days logged/)).toHaveCount(0);
    await expect(page.getByText(/not counted|isn.t counted/)).toHaveCount(0);
    await expect(page.getByText(/What you logged/)).toHaveCount(0);

    const avgHeader = await page.getByText(/DAILY AVERAGE ·/).innerText();
    const listHeader = await page.getByText(/DAY BY DAY ·/).innerText();
    expect(avgHeader.replace("DAILY AVERAGE", "")).not.toBe(listHeader.replace("DAY BY DAY", ""));
  });

  test("the one row the average excludes is marked TODAY", async ({ page }) => {
    // The list runs to today; the average stops at yesterday. Nobody should have to subtract
    // two counts to work out which row differs.
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText("TODAY", { exact: true })).toHaveCount(1);
  });

  test("the day list still runs to today — the fix narrows the average, not the rows", async ({ page }) => {
    await open(page, { history: reportedHistory() });
    await openHistory(page);
    await sevenDays(page);

    // Eight rows: 06–13. Narrowing these would have emptied the body charts and made today
    // untappable, which is a worse bug than the one being fixed.
    await expect(page.getByText("TODAY", { exact: true })).toBeVisible();
    await expect(page.getByText("2331", { exact: true })).toBeVisible(); // yesterday's row
  });
});

test.describe("Day one, and an empty window", () => {
  test("a brand-new account says the average starts tomorrow, rather than showing 0", async ({ page }) => {
    // The old code rendered a confident "0 KCAL" here. A wrong number gets acted on; a blank
    // gets asked about.
    await open(page, {
      history: [{ date: key(0), mode: "cut", kcal: 500, protein: 40, carbs: 50, fat: 15,
        water: 1, training: false, logs: [{ kcal: 500 }] }],
    });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/No complete days yet/)).toBeVisible();
    await shot(page, "history-day-one-empty-average");
  });

  test("a 30-day window with no complete day in it does not report 0 KCAL", async ({ page }) => {
    // The symptom QA reproduced on the shipped build: "30 DAYS AVERAGES · 1 DAYS / 0 KCAL" — a
    // confident wrong number rather than the NaN the report expected, which is worse.
    //
    // Note the fully-empty branch ("Nothing logged between …") is close to unreachable in
    // practice: the daily snapshot effect writes a row for today every time the app is opened,
    // so the window almost always contains at least that row. It is kept as a fallback, not
    // asserted here, because a test for a state the app cannot reach passes vacuously.
    await open(page, {
      history: [{ date: key(40), mode: "cut", kcal: 2200, protein: 180, carbs: 200, fat: 70,
        water: 6, training: false, logs: [{ kcal: 2200 }] }],
    });
    await openHistory(page);

    await expect(page.getByText(/No complete days yet/)).toBeVisible();
    // The four average chips are not rendered at all, so there is no 0 to misread.
    await expect(page.getByText("KCAL", { exact: true })).toHaveCount(0);
    await expect(page.getByText(/AVERAGES · 1 DAYS/)).toHaveCount(0);
  });
});

test.describe("The weight figure", () => {
  const weighIns = perDay => Array.from({ length: 21 }, (_, i) => ({
    date: key(20 - i), weight: 98.5 + (20 - i) * perDay,
  }));

  test("a flat fortnight is not reported as a gain", async ({ page }) => {
    // What shipped took the last reading minus the first, so one low reading at the left end
    // read as "+1.7 kg" in orange while the smoothed line was flat.
    await open(page, { history: reportedHistory(), weighIns: weighIns(0) });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/WEIGHT, WEEK ON WEEK/)).toBeVisible();
    await expect(page.getByText("0 kg", { exact: true })).toBeVisible();
    await shot(page, "history-weight-week-on-week");
  });

  test("the figure carries no caption", async ({ page }) => {
    // "Averages, not single days — water and food still swing this." repeated the "· 7-day
    // averages" line above it and then hedged the figure. The two averages and the change stand
    // on their own.
    await open(page, { history: reportedHistory(), weighIns: weighIns(0) });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/7-day averages/)).toBeVisible();
    await expect(page.getByText(/not single days/)).toHaveCount(0);
    await expect(page.getByText(/still swing/)).toHaveCount(0);
  });

  // FL-009 — one step across a chart is one day, whichever series is drawn. Weight and body fat
  // used to have a row per READING, so a two-day gap took the same width as a one-day step and a
  // slow change read as a fast one. The kcal chart never had the problem, because history has a
  // row per day; that inconsistency was the actual defect.
  test("a missing weigh-in takes up its own space instead of collapsing", async ({ page }) => {
    // Seven consecutive days, then no weigh-in on the second-to-last. The step across that gap
    // must be about twice a normal one-day step.
    const w = [7, 6, 5, 4, 3, 1].map(n => ({ date: key(n), weight: 98.5 - n * 0.1 }));
    await open(page, { history: reportedHistory(), weighIns: w });
    await openHistory(page);
    await sevenDays(page);
    await page.getByRole("button", { name: "⚖️ Weight" }).click();

    await expect(page.locator("svg circle").first()).toBeVisible({ timeout: 10_000 });
    const xs = await page.locator("svg circle").evaluateAll(
      els => els.map(e => Number(e.getAttribute("cx")))
        .filter(n => Number.isFinite(n)).sort((a, b) => a - b));
    expect(xs.length).toBeGreaterThanOrEqual(6);

    const steps = xs.slice(1).map((x, i) => x - xs[i]);
    const oneDay = Math.min(...steps);
    // The last gap spans two days (3 days ago → 1 day ago) and must read as two.
    expect(Math.max(...steps)).toBeGreaterThan(oneDay * 1.6);
    await shot(page, "history-weight-chart-date-spacing");
  });

  test("too few weigh-ins says so instead of guessing a direction", async ({ page }) => {
    await open(page, {
      history: reportedHistory(),
      weighIns: [{ date: key(1), weight: 98.5 }, { date: key(0), weight: 98.4 }],
    });
    await openHistory(page);
    await sevenDays(page);

    await expect(page.getByText(/Two weeks of weigh-ins and this shows which way/)).toBeVisible();
  });
});
