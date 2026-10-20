// The startup cloud pull, for an account with more than 1000 logged entries.
//
// Why this file exists: PostgREST answers a select with at most 1000 rows and says nothing about
// the rest. The pull read food_logs in one request, oldest first, so once an account passed 1000
// entries the newest days — today included — came back with no entries. Today's snapshot still
// arrived, so the pull replaced the day's logs with that empty list on every launch: a meal logged
// and then a refresh, and it was gone (2026-10-20). The fake cloud enforces the same cap.

const { test, expect } = require("@playwright/test");
const { open, PROFILE, installFakeCloud } = require("./harness");

const UID = "u1";
const TODAY = "2026-10-20";

const entry = (date, id, name, kcal) => ({
  user_id: UID, date, entry_id: id, name, kcal, protein: 20, carbs: 40, fat: 10,
  conf: 100, elements: null, time: "08:00",
});

test("today's meals survive a reload once the account has over 1000 entries", async ({ page }) => {
  // 1100 entries spread over the 110 days before today: ten a day.
  const past = [];
  for (let d = 110; d >= 1; d--) {
    const date = new Date(new Date(TODAY + "T12:00:00").getTime() - d * 86400000).toISOString().slice(0, 10);
    for (let i = 0; i < 10; i++) past.push(entry(date, d * 100 + i, "Old meal", 200));
  }
  const today = [entry(TODAY, 9000001, "Test porridge", 420), entry(TODAY, 9000002, "Test chicken wrap", 610)];
  const snap = { user_id: UID, date: TODAY, mode: "cut", kcal: 1030, protein: 40, carbs: 80, fat: 20,
    training: false, water: 2 };

  await installFakeCloud(page, {
    profiles: [{ id: UID, weight: PROFILE.weight, height: PROFILE.height, body_fat: PROFILE.bodyFat,
      sex: PROFILE.sex, activity: PROFILE.activity }],
    history_snapshots: [snap],
    food_logs: [...past, ...today],
  });
  await page.clock.setFixedTime(new Date(TODAY + "T09:00:00"));
  await open(page, {
    premium: { id: UID, name: "T", email: "t@example.com", picture: "", subExpiry: null, since: 0 },
    // On the phone already, as they were just logged.
    logs: today.map(r => ({ id: r.entry_id, name: r.name, kcal: r.kcal, protein: r.protein,
      carbs: r.carbs, fat: r.fat, conf: 100, elements: null, time: r.time })),
    extra: { qa_revive_v68: "1" },
  });

  for (const pass of ["first load", "after reload"]) {
    if (pass === "after reload") await page.reload();
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(2500);   // well past every page of the 400 ms pull
    await expect(page.getByText("Test porridge"), pass).toBeVisible();
    await expect(page.getByText("Test chicken wrap"), pass).toBeVisible();
  }
});
