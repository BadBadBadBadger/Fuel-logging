// Achievements v2 (owner, 2026-11-22: "looks jank"). The v2 grammar around the badges; emoji stay
// only on the badge itself (HANDOVER D12). Tiers are a mono ladder; the next tier is marked.
const { test, expect } = require("@playwright/test");
const { seed, PROFILE } = require("./harness");

const key = n => { const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
// 30 consecutive logged days ending yesterday, 10 of them with 8 glasses.
const history = Array.from({ length: 30 }, (_, i) => ({ date: key(i + 1), mode: "cut", kcal: 2000,
  protein: 150, carbs: 200, fat: 70, water: i < 10 ? 8 : 4, logs: [{ id: i + 1, name: "x", kcal: 2000, protein: 150, carbs: 200, fat: 70 }] }));

test("badges screen uses the v2 look: ladder, progress, emoji only on the badge", async ({ page }) => {
  await seed(page, { profile: PROFILE, history });
  await page.goto("/preview.html?ui=v2");
  await page.getByTestId("v2-nav-badges").click();
  const screen = page.getByTestId("achievements-v2");
  await expect(screen).toBeVisible();
  await expect(page.getByTestId("v2-badge")).toHaveCount(3);

  // Hydrated: 10 days at 8 glasses → Silver (6) earned, Gold (12) next
  const hyd = page.locator('[data-testid="v2-badge"][data-badge="hydrated"]');
  await expect(hyd).toContainText("Silver");
  await expect(hyd.locator('[data-testid="v2-badge-tier"][data-earned="1"]')).toHaveCount(2);
  await expect(hyd.getByTestId("v2-badge-progress")).toHaveText("10 of 12 for Gold");

  // Top Recorder: 30 days logged → Platinum (24), next Diamond 48
  const rec = page.locator('[data-testid="v2-badge"][data-badge="logger"]');
  await expect(rec).toContainText("Platinum");
  await expect(rec.getByTestId("v2-badge-progress")).toHaveText("30 of 48 for Diamond");

  // No tier medal emoji or trophy anywhere; the only emoji are the three badge glyphs
  const text = await screen.innerText();
  expect(text).not.toMatch(/[🟤⚪🟡🔵💎👑🏆]/u);
});
