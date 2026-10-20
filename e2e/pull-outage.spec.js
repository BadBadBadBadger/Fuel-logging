// The startup cloud pull, after the cloud refused a write.
//
// Why this file exists: during a Supabase outage (2026-10-20) log writes failed silently while
// reads kept working. The next launch's pull read the cloud's older copy of today and replaced the
// meals just logged with it. A day the cloud hasn't confirmed is now marked pending, and the pull
// keeps the phone's copy of it and retries the upload instead.

const { test, expect } = require("@playwright/test");
const { open, PROFILE, installFakeCloud } = require("./harness");

const UID = "u1";
const TODAY = "2026-10-20";

test("a meal logged while the cloud refuses writes survives a reload, then syncs", async ({ page }) => {
  // Breakfast synced this morning, before the outage.
  const breakfast = { user_id: UID, date: TODAY, entry_id: 1, name: "Test porridge", kcal: 420,
    protein: 15, carbs: 70, fat: 8, conf: 100, elements: null, time: "07:30" };
  await installFakeCloud(page, {
    profiles: [{ id: UID, weight: PROFILE.weight, height: PROFILE.height, body_fat: PROFILE.bodyFat,
      sex: PROFILE.sex, activity: PROFILE.activity }],
    history_snapshots: [{ user_id: UID, date: TODAY, mode: "cut", kcal: 420, protein: 15, carbs: 70,
      fat: 8, training: false, water: 0 }],
    food_logs: [breakfast],
  });
  await page.clock.setFixedTime(new Date(TODAY + "T12:00:00"));
  await open(page, {
    premium: { id: UID, name: "T", email: "t@example.com", picture: "", subExpiry: null, since: 0 },
    logs: [{ id: 1, name: "Test porridge", kcal: 420, protein: 15, carbs: 70, fat: 8, conf: 100,
      elements: null, time: "07:30" }],
    extra: { qa_revive_v68: "1" },
  });
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);   // let the startup pull land first

  // The outage starts; lunch is logged and the write is refused.
  await page.evaluate(() => sessionStorage.setItem("__fake_cloud_down", "1"));
  await page.getByRole("button", { name: /QUICK ADD/ }).click();
  await page.getByText("Chicken breast (150g)").click();
  await expect(page.getByText("Chicken breast (150g)")).toBeVisible();
  await page.waitForTimeout(500);

  // Reload with reads still working: the cloud only has breakfast.
  await page.reload();
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(page.getByText("Test porridge")).toBeVisible();
  await expect(page.getByText("Chicken breast (150g)")).toBeVisible();

  // The outage ends; the next launch keeps lunch AND finally gets it into the cloud.
  await page.evaluate(() => sessionStorage.removeItem("__fake_cloud_down"));
  await page.reload();
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(page.getByText("Chicken breast (150g)")).toBeVisible();
  const cloudNames = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("__fake_cloud")).food_logs.map(r => r.name));
  expect(cloudNames).toContain("Chicken breast (150g)");
  expect(await page.evaluate(d => localStorage.getItem("logs_pending__" + d), TODAY)).toBeNull();
});

test("water and a workout logged while the cloud refuses writes survive a reload, then sync", async ({ page }) => {
  // Two glasses synced this morning, and a workout yesterday — so the cloud has workout rows,
  // just none for today, which used to clear today's on the phone.
  const YESTERDAY = "2026-10-19";
  await installFakeCloud(page, {
    profiles: [{ id: UID, weight: PROFILE.weight, height: PROFILE.height, body_fat: PROFILE.bodyFat,
      sex: PROFILE.sex, activity: PROFILE.activity }],
    history_snapshots: [{ user_id: UID, date: TODAY, mode: "cut", kcal: 0, protein: 0, carbs: 0,
      fat: 0, training: false, water: 2 }],
    water_logs: [{ user_id: UID, date: TODAY, glasses: 2 }],
    workouts: [{ user_id: UID, date: YESTERDAY, entry_id: 5, type: "legs", duration: 45,
      intensity: "moderate", kcal: 400, time: "18:00", notes: null }],
  });
  await page.clock.setFixedTime(new Date(TODAY + "T12:00:00"));
  await open(page, {
    premium: { id: UID, name: "T", email: "t@example.com", picture: "", subExpiry: null, since: 0 },
    extra: { qa_revive_v68: "1", ["water__" + TODAY]: "2" },
  });
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);

  // The outage starts; two more glasses and a workout are logged, and every write is refused.
  await page.evaluate(() => sessionStorage.setItem("__fake_cloud_down", "1"));
  const plus = page.getByRole("button", { name: "+", exact: true });
  await plus.click();
  await plus.click();
  await page.getByRole("button", { name: /LOG WORKOUT/ }).click();
  await expect(page.getByText(/kcal burned/)).toBeVisible();
  await page.waitForTimeout(500);

  const phone = () => page.evaluate(d => ({
    water: localStorage.getItem("water__" + d),
    workouts: JSON.parse(localStorage.getItem("workouts__" + d) || "[]").length,
  }), TODAY);

  // Reload with reads still working: the cloud has 2 glasses and no workout today.
  await page.reload();
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(page.getByText(/kcal burned/)).toBeVisible();
  expect(await phone()).toEqual({ water: "4", workouts: 1 });

  // The outage ends; the next launch keeps both AND gets them into the cloud.
  await page.evaluate(() => sessionStorage.removeItem("__fake_cloud_down"));
  await page.reload();
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  expect(await phone()).toEqual({ water: "4", workouts: 1 });
  const cloud = await page.evaluate(() => JSON.parse(sessionStorage.getItem("__fake_cloud")));
  expect(cloud.water_logs.find(r => r.date === TODAY).glasses).toBe(4);
  expect(cloud.workouts.filter(r => r.date === TODAY)).toHaveLength(1);
  expect(await page.evaluate(d => [localStorage.getItem("water_pending__" + d),
    localStorage.getItem("workouts_pending__" + d)], TODAY)).toEqual([null, null]);
});
