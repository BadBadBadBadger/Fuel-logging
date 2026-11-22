// Feature: History v2 — the Day screen (features/history/05-history-v2-day.feature)
//
// v2 is behind ?ui=v2. A day is opened from History's day list by its row
// (data-testid="v2h-day-row", data-date="YYYY-MM-DD"). Locators are data-testid hooks, never
// copy, except where the copy IS the claim ("Set target", "Under-eaten" must not appear).
//
// The seeded history is deliberately awkward: two identical entries with NO id on one day, two
// entries sharing one id on another, and a day saved before targets were stored. Every write is
// checked in localStorage, the thing that survives a reload, not only on screen.
//
// The AI log is stubbed exactly as e2e/v2-meals.spec.js does. Nothing leaves the machine.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

// Local date parts, the way the app keys a day, NOT toISOString() (UTC).
const key = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};
const D3 = key(3), D2 = key(2), D1 = key(1);

const toast = { name: "Toast", kcal: 200, protein: 6, carbs: 30, fat: 5 };          // no id, twice
const HISTORY = [
  // A CUT day, 120 over a 2,241 target: amber on the Last 7 grader. Two id-less, identical rows.
  { date: D3, mode: "cut", training: false, water: 3,
    logs: [toast, { ...toast }, { name: "Pasta bake", kcal: 1961, protein: 120, carbs: 230, fat: 60 }],
    kcal: 2361, protein: 132, carbs: 290, fat: 70,
    targetKcal: 2241, targetProtein: 177, targetFat: 59, targetFatFloor: 59, floored: false },
  // FL-010's day: MAINTAIN, eaten at cut level. 378 under: v1 painted this amber "Under-eaten".
  { date: D2, mode: "maintain", training: false, water: 6,
    logs: [{ id: 7, name: "Day", kcal: 2331, protein: 180, carbs: 200, fat: 83 }],
    kcal: 2331, protein: 180, carbs: 200, fat: 83,
    targetKcal: 2709, targetProtein: 180, targetFat: 79, targetFatFloor: 59, floored: false },
  // Saved before targets were stored. Two rows share one id.
  { date: D1, mode: "cut", training: true, water: 0,
    logs: [{ id: 5, name: "Eggs", kcal: 300, protein: 20, carbs: 2, fat: 22 },
           { id: 5, name: "Rice", kcal: 400, protein: 8, carbs: 88, fat: 1 }],
    kcal: 700, protein: 28, carbs: 90, fat: 23 },
];
const TODAY_LOGS = [
  { id: 101, name: "Porridge", kcal: 400, protein: 15, carbs: 60, fat: 9, time: "08:00" },
  { id: 102, name: "Chicken wrap", kcal: 600, protein: 45, carbs: 55, fat: 18, time: "13:00" },
];

const stored = page => page.evaluate(() => JSON.parse(localStorage.getItem("history") || "[]"));
const storedDay = async (page, date) => (await stored(page)).find(d => d.date === date);
const live = (page, prefix) => page.evaluate(([p, k]) => localStorage.getItem(p + eval(k)), [prefix, TODAY_KEY_EXPR]);

async function openV2(page, state = {}) {
  await seed(page, { profile: PROFILE, history: HISTORY, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
}
async function openDay(page, date) {
  await page.getByTestId("v2-nav-history").click();
  await page.locator(`[data-testid="v2h-day-row"][data-date="${date}"]`).click();
  await expect(page.getByTestId("v2h-day")).toHaveAttribute("data-date", date);
}
const day = page => page.getByTestId("v2h-day");
const rows = page => page.getByTestId("v2h-day-foods").locator('[data-testid="v2-meal-row"][aria-expanded="false"]');

test.describe("History v2 — Day screen", () => {
  test("steps to the previous and next day with ‹ ›", async ({ page }) => {
    await openV2(page);
    await openDay(page, D2);
    await expect(page.getByTestId("v2h-day-prev")).toBeEnabled();
    await page.getByTestId("v2h-day-prev").click();
    await expect(day(page)).toHaveAttribute("data-date", D3);
    await expect(page.getByTestId("v2h-day-prev")).toBeDisabled();     // the first day
    await page.getByTestId("v2h-day-next").click();
    await page.getByTestId("v2h-day-next").click();
    await expect(day(page)).toHaveAttribute("data-date", D1);
    // The title is the day, e.g. "THU 19 NOV", never the raw key
    const title = await day(page).locator("h1").innerText();
    expect(title).toMatch(/^[A-Z]{3} \d{1,2} [A-Z]{3}$/);
  });

  test("changing a past day's mode re-targets it, and the change is stored", async ({ page }) => {
    await openV2(page);
    await openDay(page, D2);
    await expect(page.getByTestId("v2h-day-target")).toHaveText("2,709");
    await page.getByTestId("v2h-day-mode-cut").click();
    await expect(page.getByTestId("v2h-day-mode-cut")).toHaveAttribute("aria-checked", "true");
    await expect.poll(async () => (await storedDay(page, D2)).mode).toBe("cut");
    const saved = await storedDay(page, D2);
    expect(saved.targetKcal).toBeLessThan(2709);                   // a cut is below maintenance
    await expect(page.getByTestId("v2h-day-target")).toHaveText(saved.targetKcal.toLocaleString("en-GB"));
    // Still there after a reload
    await page.reload();
    await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
    await openDay(page, D2);
    await expect(page.getByTestId("v2h-day-mode-cut")).toHaveAttribute("aria-checked", "true");
  });

  test("a Maintain day is neutral: no lamp, no colour, no Under-eaten (D19)", async ({ page }) => {
    await openV2(page);
    await openDay(page, D2);
    const score = page.getByTestId("v2h-day-score");
    await expect(score).toHaveAttribute("data-band", "neutral");
    await expect(score.getByTestId("v2h-day-lamp")).toHaveCount(0);
    await expect(score).toContainText("378 under");
    await expect(day(page)).not.toContainText(/under-eaten/i);
    await shot(page, "v2-history-day-maintain");
  });

  test("a CUT day over target carries the Last 7 band lamp", async ({ page }) => {
    await openV2(page);
    await openDay(page, D3);
    await expect(page.getByTestId("v2h-day-score")).toHaveAttribute("data-band", "amber");
    await expect(page.getByTestId("v2h-day-lamp")).toHaveAttribute("data-state", "amber");
    await expect(page.getByTestId("v2h-day-gap")).toHaveText("120 over");
  });

  test("a day with no stored target offers Set target, and it saves", async ({ page }) => {
    await openV2(page);
    await openDay(page, D1);
    await expect(page.getByTestId("v2h-day-score")).toHaveAttribute("data-band", "none");
    await expect(page.getByTestId("v2h-day-target")).toHaveText("Set target");
    await page.getByTestId("v2h-day-target").click();
    await page.getByTestId("v2h-day-target-input").fill("2200");
    await page.getByTestId("v2h-day-target-input").press("Enter");
    await expect(page.getByTestId("v2h-day-target")).toHaveText("2,200");
    await expect(page.getByTestId("v2h-day-score")).toHaveAttribute("data-band", "green");
    const saved = await storedDay(page, D1);
    expect(saved.targetKcal).toBe(2200);
    expect(saved.targetProtein).toBeGreaterThan(0);
    expect(saved.targetFat).toBeGreaterThan(0);
  });

  test("TRAINING · REST toggles and is stored", async ({ page }) => {
    await openV2(page);
    await openDay(page, D3);
    await expect(page.getByTestId("v2h-day-training-rest")).toHaveAttribute("aria-checked", "true");
    await page.getByTestId("v2h-day-training-training").click();
    await expect(page.getByTestId("v2h-day-training-training")).toHaveAttribute("aria-checked", "true");
    await expect.poll(async () => (await storedDay(page, D3)).training).toBe(true);
  });

  test("water steps up and down and is stored", async ({ page }) => {
    await openV2(page);
    await openDay(page, D3);
    const w = page.getByTestId("v2h-day-water");
    await w.getByTestId("v2-water-plus").click();
    await expect(w.getByTestId("v2-water-count")).toHaveText(/4 \/ 8/);
    await expect.poll(async () => (await storedDay(page, D3)).water).toBe(4);
    await w.getByTestId("v2-water-minus").click();
    await expect.poll(async () => (await storedDay(page, D3)).water).toBe(3);
  });

  test("editing one of two identical id-less foods changes only that one", async ({ page }) => {
    await openV2(page);
    await openDay(page, D3);
    await expect(rows(page)).toHaveCount(3);
    await rows(page).nth(1).click();
    const ed = page.getByTestId("v2-meal-editor");
    await ed.getByTestId("v2-meal-kcal").fill("250");
    await ed.getByTestId("v2-meal-save").click();
    await expect.poll(async () => (await storedDay(page, D3)).logs.map(l => l.kcal)).toEqual([200, 250, 1961]);
    const saved = await storedDay(page, D3);
    expect(saved.kcal).toBe(2411);                                // totals recomputed from logs
    expect(saved.logs.every(l => l.id === undefined || typeof l.id === "number")).toBe(true); // no synthetic ids stored
    await expect(page.getByTestId("v2h-day-kcal")).toHaveText("2,411");
  });

  test("deleting one of two identical id-less foods removes only that one", async ({ page }) => {
    await openV2(page);
    await openDay(page, D3);
    await rows(page).nth(0).click();
    await page.getByTestId("v2-meal-editor").getByTestId("v2-meal-delete").click();
    await expect(rows(page)).toHaveCount(2);
    await expect.poll(async () => (await storedDay(page, D3)).logs.map(l => l.name)).toEqual(["Toast", "Pasta bake"]);
    expect((await storedDay(page, D3)).kcal).toBe(2161);
  });

  test("deleting one of two same-id foods removes only that one", async ({ page }) => {
    await openV2(page);
    await openDay(page, D1);
    await rows(page).nth(1).click();
    await page.getByTestId("v2-meal-editor").getByTestId("v2-meal-delete").click();
    await expect.poll(async () => (await storedDay(page, D1)).logs.map(l => l.name)).toEqual(["Eggs"]);
  });

  test("premium: LOG FOOD adds an AI-estimated entry to THIS day, not to today", async ({ page }) => {
    await openV2(page, { premium: true, logs: TODAY_LOGS });
    await page.route(AI_ENDPOINT, route => route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ text: JSON.stringify({ items: [
        { name: "Banana", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, confidence: 90 }] }) }] }),
    }));
    await page.evaluate(() => {
      window.supabaseClient = {
        auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
      };
    });
    await openDay(page, D2);
    await day(page).getByTestId("v2-log-food").click();
    await page.getByRole("textbox", { name: "Describe your meal" }).fill("a banana");
    await page.getByRole("button", { name: /ANALYSE MEAL/ }).click();
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(rows(page)).toHaveCount(2);
    await expect.poll(async () => (await storedDay(page, D2)).logs.map(l => l.name)).toEqual(["Day", "a banana"]);
    const saved = await storedDay(page, D2);
    expect(saved.kcal).toBe(2436);
    expect(typeof saved.logs[1].id).toBe("number");
    expect(JSON.parse(await live(page, "logs__")).map(l => l.name)).toEqual(["Porridge", "Chicken wrap"]);
  });

  test("today opens editable: water, food and training reach live Today; mode stays on Today", async ({ page }) => {
    await openV2(page, { logs: TODAY_LOGS });
    const today = await page.evaluate(k => eval(k), TODAY_KEY_EXPR);
    await expect.poll(async () => !!(await storedDay(page, today))).toBe(true);   // snapshot written
    await openDay(page, today);
    await expect(day(page).locator("h1")).toHaveText(/today/i);
    await expect(page.getByTestId("v2h-day-mode")).toHaveAttribute("data-readonly", "1");
    await expect(page.getByTestId("v2h-day-mode-cut")).toHaveCount(0);
    await expect(page.getByTestId("v2h-day-next")).toBeDisabled();

    await page.getByTestId("v2h-day-water").getByTestId("v2-water-plus").click();
    await expect.poll(() => live(page, "water__")).toBe("1");
    await rows(page).nth(0).click();
    await page.getByTestId("v2-meal-editor").getByTestId("v2-meal-delete").click();
    await expect.poll(async () => JSON.parse(await live(page, "logs__")).map(l => l.name)).toEqual(["Chicken wrap"]);
    await page.getByTestId("v2h-day-training-training").click();
    await expect.poll(() => live(page, "training__")).toBe("1");
    await shot(page, "v2-history-day-today");

    // Today shows the same day
    await page.getByTestId("v2-settings-back").click();
    await page.getByTestId("v2-settings-back").click();
    await expect(page.getByTestId("today-v2")).toBeVisible();
    await expect(page.getByTestId("v2-water-count")).toHaveText(/1 \/ 8/);
    await expect(page.getByTestId("v2-meals").getByText("Porridge")).toHaveCount(0);
  });

  test("no emoji anywhere on the Day screen", async ({ page }) => {
    await openV2(page, { weighIns: [{ date: D3, weight: 98.2 }] });
    await openDay(page, D3);
    await expect(page.getByTestId("v2h-day-body")).toContainText("98.2");
    const text = await day(page).innerText();
    expect(text).not.toMatch(/[\u{1F300}-\u{1FAFF}☀-➿]/u);
    await shot(page, "v2-history-day-cut");
  });
});
