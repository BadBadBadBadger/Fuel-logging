// Today is one day, not two copies (owner, 2026-11-21: "consistency is always king").
//
// History lists today too, and its day editor lets you change today's food, water and the
// TRAINING/REST flag. Those edits used to land only in the stored history row; the next change on
// Today rebuilt that row from live state and silently wiped them. Now an edit to today from
// History goes through the same live handlers Today uses, so both screens show the same day and
// nothing reverts.

const { test, expect } = require("@playwright/test");
const { open, TODAY_KEY_EXPR } = require("./harness");

const LOGS = [
  { id: 101, name: "Porridge", kcal: 400, protein: 15, carbs: 60, fat: 9, time: "08:00" },
  { id: 102, name: "Chicken wrap", kcal: 600, protein: 45, carbs: 55, fat: 18, time: "13:00" },
];

const live = (page, prefix) => page.evaluate(([p, k]) => localStorage.getItem(p + eval(k)), [prefix, TODAY_KEY_EXPR]);
const todayRow = page => page.evaluate(k => JSON.parse(localStorage.getItem("history") || "[]")
  .find(d => d.date === eval(k)) || null, TODAY_KEY_EXPR);

const openTodayInHistory = async page => {
  await page.locator('button:has-text("📊")').click();
  await expect(page.getByText("HISTORY")).toBeVisible();
  await page.getByRole("button", { name: "7 Days" }).click();
  await page.getByText("TODAY", { exact: true }).click();
  await expect(page.getByText("MACRO BREAKDOWN")).toBeVisible();
};
const backToToday = async page => {
  await page.getByRole("button", { name: "←" }).first().click();   // back to Today
  await expect(page.getByText("CONSUMED")).toBeVisible();
};

test("edits to today made in History reach Today, and survive the next change on Today", async ({ page }) => {
  await open(page, { logs: LOGS });
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

  await openTodayInHistory(page);
  await page.getByRole("button", { name: "+", exact: true }).click();          // water 0 → 1
  await page.getByRole("button", { name: "×", exact: true }).first().click();  // delete Porridge
  await page.getByRole("button", { name: /REST/ }).click();                     // → TRAINING
  await expect(page.getByRole("button", { name: /TRAINING/ })).toBeVisible();

  // Straight into Today's live state, not just the history row
  expect(await live(page, "water__")).toBe("1");
  expect(JSON.parse(await live(page, "logs__")).map(l => l.name)).toEqual(["Chicken wrap"]);
  expect(await live(page, "training__")).toBe("1");

  // Today shows the same day
  await backToToday(page);
  await expect(page.getByText(/1\s*\/ 8 glasses/)).toBeVisible();
  await expect(page.getByText("Porridge")).toHaveCount(0);

  // A change on Today rebuilds today's history row — the History edits must still be there
  await page.getByRole("button", { name: "+", exact: true }).click();          // water 1 → 2
  await expect.poll(async () => (await todayRow(page))?.water).toBe(2);
  const row = await todayRow(page);
  expect(row.logs.map(l => l.name)).toEqual(["Chicken wrap"]);
  expect(row.kcal).toBe(600);
  expect(row.training).toBe(true);

  // And after a reload
  await page.reload();
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await openTodayInHistory(page);
  await expect(page.getByText("Chicken wrap")).toBeVisible();
  await expect(page.getByText("Porridge")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /TRAINING/ })).toBeVisible();
  await expect(page.getByText("2 / 8")).toBeVisible();
});

test("logging a workout on Today takes over from a hand-set REST flag (latest action wins)", async ({ page }) => {
  await open(page, { logs: LOGS });
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  // Set TRAINING by hand, then back to REST: matches the workout-derived value, so no override
  await openTodayInHistory(page);
  await page.getByRole("button", { name: /REST/ }).click();
  expect(await live(page, "training__")).toBe("1");
  await page.getByRole("button", { name: /TRAINING/ }).click();
  expect(await live(page, "training__")).toBe("");
  expect((await todayRow(page)).training).toBe(false);
});
