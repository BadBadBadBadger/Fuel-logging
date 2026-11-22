// History v2, Region HB — range control, daily-average readout, kcal bars, day list.
// Contract: design/v2/reviews/history-05-ruling.md §3 and §5 (owner Q2, Q4) and
// features/history/04-history-v2-list.feature.
//
// Locators are data-testids only, so the v1 suite and this one cannot break each other. The
// averages are checked against v1's own screen for the same seed: v2 must not re-derive the
// FL-001/008 maths, only show it.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE } = require("./harness");

const keyDaysAgo = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

const CUT_T = 2241, MAINT_T = 2741;
// A finished day's snapshot with its stored target (the shape the daily effect writes).
const snap = (n, { kcal, mode = "cut", protein = 160, carbs = 230, fat = 75, logged = true }) => ({
  date: keyDaysAgo(n), mode, kcal, protein, carbs, fat, water: 6, training: false,
  logs: logged ? [{ id: n + 1, name: "day", kcal, protein, carbs, fat, time: "08:00" }] : [],
  targetKcal: mode === "cut" ? CUT_T : MAINT_T, targetProtein: 169, targetFat: 79, floored: false,
});

// 40 days back. Days 1–3 CUT (one amber, one red), 4–5 MAINTAIN (one far over: never marked),
// 6 an opened-but-empty day, 7–40 CUT with some variety. Days 50–60 sit outside 30D but in 3M.
const HISTORY = (() => {
  const h = [];
  for (let n = 60; n >= 50; n--) h.push(snap(n, { kcal: 2600, protein: 140, carbs: 300, fat: 90 }));
  for (let n = 40; n >= 7; n--) h.push(snap(n, { kcal: 2000 + (n % 5) * 50, protein: 150 + (n % 3), carbs: 220, fat: 70 + (n % 4) }));
  h.push(snap(6, { kcal: 0, logged: false, protein: 0, carbs: 0, fat: 0 }));
  h.push(snap(5, { kcal: 3400, mode: "maintain", protein: 140, carbs: 380, fat: 110 }));   // far over: neutral
  h.push(snap(4, { kcal: 2700, mode: "maintain", protein: 145, carbs: 300, fat: 90 }));
  h.push(snap(3, { kcal: CUT_T + 600, protein: 151, carbs: 329, fat: 89 }));             // red
  h.push(snap(2, { kcal: CUT_T + 300, protein: 155, carbs: 300, fat: 80 }));             // amber
  h.push(snap(1, { kcal: CUT_T - 100, protein: 170, carbs: 200, fat: 70 }));             // green: no lamp
  return h;
})();
const WEIGH_INS = [{ date: keyDaysAgo(9), weight: 98.6 }, { date: keyDaysAgo(2), weight: 98.2 }];
const TODAY_LOGS = [{ id: 999, name: "Porridge", kcal: 420, protein: 14, carbs: 72, fat: 8, time: "07:45" }];
const STATE = { history: HISTORY, weighIns: WEIGH_INS, logs: TODAY_LOGS };

async function openHistoryV2(page, state = STATE) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("v2-nav-history").click();
  await expect(page.getByTestId("history-v2")).toBeVisible();
}

// v1's DAILY AVERAGE chips for a range, read off v1's own screen.
async function v1Averages(browser, rangeLabel) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await ctx.newPage();
  await seed(page, { profile: PROFILE, ...STATE });
  await page.goto("/preview.html");
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.locator('button:has-text("📊")').click();
  await page.getByRole("button", { name: rangeLabel, exact: true }).click();
  // The header div, then the 4-chip grid beside it; each chip's first child is its value.
  const vals = await page.getByText(/^DAILY AVERAGE/).evaluate(h =>
    [...h.nextElementSibling.children].map(c => c.firstElementChild.textContent.replace(/g$/, "")));
  await ctx.close();
  return vals;   // [kcal, protein, carbs, fat]
}
const v2Averages = async page => Promise.all(["kcal", "pro", "carb", "fat"].map(k =>
  page.getByTestId(`v2h-readout-${k}`).innerText().then(t => t.replace(/,/g, ""))));

test.describe("Range and readout", () => {
  test("four ranges, 30D by default, no Day or Year", async ({ page }) => {
    await openHistoryV2(page);
    const seg = page.getByTestId("v2h-range");
    await expect(seg.getByRole("radio")).toHaveText(["7D", "30D", "3M", "All"]);
    await expect(page.getByTestId("v2h-range-30D")).toHaveAttribute("aria-checked", "true");
  });

  for (const [v2, v1] of [["7D", "7 Days"], ["30D", "30 Days"], ["3M", "3 Months"], ["ALL", "All Time"]]) {
    test(`${v2} readout matches v1's daily average for the same seed`, async ({ page, browser }) => {
      const want = await v1Averages(browser, v1);
      await openHistoryV2(page);
      await page.getByTestId(`v2h-range-${v2}`).click();
      await expect(page.getByTestId(`v2h-range-${v2}`)).toHaveAttribute("aria-checked", "true");
      expect(await v2Averages(page)).toEqual(want);
    });
  }

  test("ranges change the readout, and today is not averaged in", async ({ page }) => {
    await openHistoryV2(page);
    await page.getByTestId("v2h-range-7D").click();
    // Days 1–7: 2141 + 2541 + 2841 + 2700 + 3400 + (day 7) ; day 6 empty is not a zero.
    const d7 = 2000 + (7 % 5) * 50;
    const want7 = Math.round((2141 + 2541 + 2841 + 2700 + 3400 + d7) / 6);
    await expect(page.getByTestId("v2h-readout-kcal")).toHaveText(want7.toLocaleString("en-GB"));
    await expect(page.getByTestId("v2h-readout")).toContainText(/Daily average ·/i);
    const seven = await page.getByTestId("v2h-readout-kcal").innerText();
    await page.getByTestId("v2h-range-3M").click();
    await expect(page.getByTestId("v2h-readout-kcal")).not.toHaveText(seven);
  });

  test("no complete day: one quiet line, never a zero", async ({ page }) => {
    await openHistoryV2(page, { history: [], logs: TODAY_LOGS });
    await expect(page.getByTestId("v2h-readout-empty")).toBeVisible();
    await expect(page.getByTestId("v2h-readout-kcal")).toHaveCount(0);
  });
});

test.describe("Intake chart", () => {
  test("kcal bars with the stored target as a dashed line, in neutral ink", async ({ page }) => {
    await openHistoryV2(page);
    const chart = page.getByTestId("v2h-intake");
    await expect(chart).toBeVisible();
    await expect(chart.locator(".v2h-bar-past path").first()).toBeVisible();
    await expect(chart.locator(".v2h-target path.recharts-curve")).toHaveAttribute("stroke-dasharray", "4 3");
    const box = await chart.boundingBox();
    expect(box.height).toBeLessThan(180);
  });
});

test.describe("Day by day", () => {
  test("rows newest first, today labelled, macros and kcal, weight on weigh-in days", async ({ page }) => {
    await openHistoryV2(page);
    const rows = page.getByTestId("v2h-day-row");
    await expect(rows.first()).toHaveAttribute("data-date", keyDaysAgo(0));
    await expect(rows.first().getByTestId("v2h-day-date")).toHaveText(/today/i);
    await expect(rows.nth(1)).toHaveAttribute("data-date", keyDaysAgo(1));

    const red = page.locator(`[data-testid="v2h-day-row"][data-date="${keyDaysAgo(3)}"]`);
    await expect(red.getByTestId("v2h-day-macros")).toHaveText("P 151 · C 329 · F 89");
    await expect(red.getByTestId("v2h-day-kcal")).toHaveText((CUT_T + 600).toLocaleString("en-GB"));
    const dt = new Date(keyDaysAgo(3) + "T12:00:00");
    await expect(red.getByTestId("v2h-day-date")).toHaveText(
      new RegExp(`^${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()]} ${dt.getDate()}$`, "i"));

    const weighed = page.locator(`[data-testid="v2h-day-row"][data-date="${keyDaysAgo(2)}"]`);
    await expect(weighed.getByTestId("v2h-day-weight")).toHaveText("98.2 kg");
    await expect(red.getByTestId("v2h-day-weight")).toHaveCount(0);
    await expect(page.getByTestId("v2h-days")).toContainText("Tap a day to open.");
  });

  test("the mode label shows on the top row and only where it changes", async ({ page }) => {
    await openHistoryV2(page);
    await page.getByTestId("v2h-range-7D").click();
    const rows = page.getByTestId("v2h-day-row");
    const n = await rows.count();
    const seen = [];
    for (let i = 0; i < n; i++) {
      const r = rows.nth(i);
      seen.push([await r.getAttribute("data-mode"), await r.getByTestId("v2h-day-mode").count()]);
    }
    expect(seen[0][1]).toBe(1);
    for (let i = 1; i < n; i++) expect(seen[i][1]).toBe(seen[i][0] !== seen[i - 1][0] ? 1 : 0);
    // Cut (top) → Maintain (day 4) → Cut again (day 6 back to cut): exactly three labels.
    await expect(page.getByTestId("v2h-day-mode")).toHaveText([/cut/i, /maintain/i, /cut/i]);
  });

  test("CUT days over target get Last 7's lamp; Maintain is never marked", async ({ page }) => {
    await openHistoryV2(page);
    const row = n => page.locator(`[data-testid="v2h-day-row"][data-date="${keyDaysAgo(n)}"]`);
    await expect(row(3).getByTestId("v2h-day-lamp")).toHaveAttribute("data-state", "red");
    await expect(row(2).getByTestId("v2h-day-lamp")).toHaveAttribute("data-state", "amber");
    await expect(row(1).getByTestId("v2h-day-lamp")).toHaveCount(0);   // green: unmarked
    await expect(row(5).getByTestId("v2h-day-lamp")).toHaveCount(0);   // maintain, far over
    await expect(row(4).getByTestId("v2h-day-lamp")).toHaveCount(0);

    // Identical to the Last 7 lamp for the same day.
    await page.getByTestId("v2-settings-back").click();
    const l7 = page.locator(`[data-testid="v2-last7-day"][data-date="${keyDaysAgo(3)}"]`);
    await expect(l7).toHaveAttribute("data-state", "red");
    const l7style = await l7.evaluate(e => { const s = getComputedStyle(e);
      return [s.width, s.height, s.borderTopColor, s.borderTopWidth, s.color, s.backgroundColor, e.textContent]; });
    await page.getByTestId("v2-nav-history").click();
    const hb = row(3).getByTestId("v2h-day-lamp");
    const hbStyle = await hb.evaluate(e => { const s = getComputedStyle(e);
      return [s.width, s.height, s.borderTopColor, s.borderTopWidth, s.color, s.backgroundColor, e.textContent]; });
    expect(hbStyle).toEqual(l7style);
  });

  test("tapping a row opens that day, today included", async ({ page }) => {
    await openHistoryV2(page);
    await page.locator(`[data-testid="v2h-day-row"][data-date="${keyDaysAgo(2)}"]`).click();
    await expect(page.getByTestId("v2h-day")).toBeVisible();
    await page.getByTestId("v2-settings-back").click();
    await page.getByTestId("v2h-day-row").first().click();
    await expect(page.getByTestId("v2h-day")).toBeVisible();
    await expect(page.getByTestId("today-v2")).toHaveCount(0);
  });

  test("a range with nothing logged: no chart, no zero average", async ({ page }) => {
    // Only an old day: 7D holds at most today's own (empty) snapshot row.
    await openHistoryV2(page, { history: [snap(80, { kcal: 2000 })] });
    await page.getByTestId("v2h-range-7D").click();
    expect(await page.getByTestId("v2h-day-row").count()).toBeLessThanOrEqual(1);
    await expect(page.getByTestId("v2h-intake")).toHaveCount(0);
    await expect(page.getByTestId("v2h-readout-empty")).toBeVisible();
  });
});

test.describe("The whole screen", () => {
  test("no emoji anywhere on the list screen", async ({ page }) => {
    await openHistoryV2(page);
    for (const r of ["7D", "30D", "3M", "ALL"]) {
      await page.getByTestId(`v2h-range-${r}`).click();
      const text = await page.getByTestId("history-v2").innerText();
      expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  test("the Last 7 card on Today opens History at 7D", async ({ page }) => {
    await seed(page, { profile: PROFILE, ...STATE });
    await page.goto("/preview.html?ui=v2");
    await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("v2-last7").click();
    await expect(page.getByTestId("history-v2")).toBeVisible();
    await expect(page.getByTestId("v2h-range-7D")).toHaveAttribute("aria-checked", "true");
  });

  for (const theme of ["dark", "light"]) {
    test(`screenshot · ${theme}`, async ({ page }) => {
      await seed(page, { profile: PROFILE, ...STATE, extra: { fuel_theme: theme } });
      await page.goto("/preview.html?ui=v2");
      await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
      await page.getByTestId("v2-nav-history").click();
      await expect(page.getByTestId("v2h-days")).toBeVisible();
      await page.waitForTimeout(400);
      await shot(page, `v2-history-list-${theme}`);
    });
  }
});
