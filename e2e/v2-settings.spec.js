// Settings v2 (UI v2, ?ui=v2). Contract: features/profile/05-settings-v2.feature; design/v2/HANDOVER.md §6.
// Presentation only: every save goes through App's v1 handlers, so this asserts what is stored, not maths.
// Settings is opened from the v2 Today header's Settings button (data-testid "v2-nav-settings").

const { test, expect } = require("@playwright/test");
const { seed, storedMode, PROFILE, TODAY } = require("./harness");

async function openSettings(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.locator("#root")).toBeVisible({ timeout: 15_000 });
  await page.locator('[data-testid="v2-nav-settings"]').click();
  await expect(page.getByTestId("settings-v2")).toBeVisible();
}
const stored = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
const storedProfile = async page => JSON.parse(await stored(page, "profile"));

test.describe("Settings v2", () => {
  test("top screen: identity row signed out, readout, groups, footer", async ({ page }) => {
    await openSettings(page);
    const id = page.getByTestId("v2-settings-identity");
    await expect(id).toContainText("Not signed in");
    await expect(page.getByTestId("v2-settings-signin")).toBeVisible();
    await expect(page.getByTestId("v2-readout-weight")).toHaveText("98.5 kg");
    await expect(page.getByTestId("v2-readout-height")).toHaveText("178 cm");
    await expect(page.getByTestId("v2-readout-bf")).toHaveText("22 %");
    await expect(page.getByTestId("v2-readout-activity")).toHaveText("Light");
    await expect(page.getByTestId("v2-readout-mode")).toHaveText("Cut");
    for (const r of ["body", "units", "account", "advanced"])
      await expect(page.getByTestId(`v2-settings-row-${r}`)).toBeVisible();
    const foot = page.getByTestId("v2-settings-footer");
    for (const l of ["Privacy", "Terms", "Who handles my data"]) await expect(foot.getByRole("link", { name: l })).toBeVisible();
    await expect(page.getByTestId("v2-settings-version")).toHaveText(/^Fuel Log v\d+ · updated \d{1,2} [A-Z][a-z]{2,3} \d{4}$/);
  });

  test("identity row signed in shows Google account and PREMIUM", async ({ page }) => {
    await openSettings(page, { premium: true });
    const id = page.getByTestId("v2-settings-identity");
    await expect(id).toContainText("Dev Preview");
    await expect(id).toContainText("Signed in with Google");
    await expect(id).toContainText("dev@localhost");
    await expect(page.getByTestId("v2-settings-premium-tag")).toBeVisible();
  });

  test("Body & goal edits save and persist after reload", async ({ page }) => {
    await openSettings(page);
    await page.getByTestId("v2-settings-row-body").click();
    await expect(page.getByTestId("v2-bodyfat-hint")).toContainText("25% for men or 30% for women");
    await page.getByLabel("Weight kg").fill("91.2");
    await page.getByLabel("Height cm").fill("181");
    await page.getByTestId("v2-bodyfat").fill("19");
    await page.getByTestId("v2-activity-active").click();
    await page.getByTestId("v2-weigh-weekly").click();
    await page.getByTestId("v2-sex-female").click();
    await expect(page.getByTestId("v2-settings-saved")).toHaveText("Targets updated");
    await expect.poll(async () => (await storedProfile(page)).weighCadence).toBe("weekly");
    const p = await storedProfile(page);
    expect(p).toMatchObject({ weight: "91.2", height: "181", bodyFat: "19", activity: "active", sex: "female" });

    await page.getByTestId("v2-measure-off").click();
    await expect.poll(() => stored(page, "mute_body_measurements")).toBe("1");

    await page.reload();
    await page.locator('[data-testid="v2-nav-settings"]').click();
    await expect(page.getByTestId("v2-readout-weight")).toHaveText("91.2 kg");
    await expect(page.getByTestId("v2-readout-activity")).toHaveText("Active");
    await page.getByTestId("v2-settings-row-body").click();
    await expect(page.getByLabel("Weight kg")).toHaveValue("91.2");
    await expect(page.getByTestId("v2-sex-female")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("v2-weigh-weekly")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("v2-measure-off")).toHaveAttribute("aria-checked", "true");
    // No sum row anywhere on Body & goal (D3).
    await expect(page.getByTestId("settings-v2")).not.toContainText(/[−=]/);
  });

  test("goal change goes through requestMode; custom target and back to auto", async ({ page }) => {
    await openSettings(page, { mode: "cut" });
    await page.getByTestId("v2-settings-row-body").click();
    await page.getByTestId("v2-goal-maintain").click();
    await expect(page.getByTestId("v2-goal-maintain")).toHaveAttribute("aria-checked", "true");
    expect(await storedMode(page)).toBe("maintain");

    await page.getByTestId("v2-target-own").click();
    await page.getByTestId("v2-target-own-input").fill("2000");
    await page.getByTestId("v2-target-own-input").press("Enter");
    await expect.poll(() => stored(page, "target_kcal")).toBe("2000");
    for (const k of ["cut", "maintain", "bulk"])
      await expect(page.getByTestId(`v2-goal-${k}`)).toHaveAttribute("aria-checked", "false");
    await page.getByTestId("v2-settings-back").click();
    await expect(page.getByTestId("v2-readout-target")).toHaveText("2,000");

    await page.getByTestId("v2-settings-row-body").click();
    await page.getByTestId("v2-target-auto").click();
    await expect.poll(() => stored(page, "target_kcal")).toBe("");
    await expect(page.getByTestId("v2-goal-maintain")).toHaveAttribute("aria-checked", "true");
  });

  test("going back to Cut mid-break asks first (guarded path)", async ({ page }) => {
    const MID_BREAK = { start: "2026-05-01", load: 42, startWeight: 98.5, offRun: 7, breakLoad: 84,
      lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null };
    await openSettings(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await page.getByTestId("v2-settings-row-body").click();
    await page.getByTestId("v2-goal-cut").click();
    const sheet = page.getByRole("dialog", { name: "Back to cutting already?" });
    await expect(sheet).toBeVisible();
    expect(await storedMode(page)).toBe("maintain");
    await sheet.getByRole("button", { name: "Cut anyway" }).click();
    await expect.poll(() => storedMode(page)).toBe("cut");
  });

  test("units switch changes the display, not the stored value", async ({ page }) => {
    await openSettings(page);
    await page.getByTestId("v2-settings-row-units").click();
    await page.getByTestId("v2-wunit-st").click();
    await page.getByTestId("v2-hunit-ftin").click();
    await page.getByTestId("v2-settings-back").click();
    await expect(page.getByTestId("v2-readout-weight")).toHaveText("15 st 7 lb");
    await expect(page.getByTestId("v2-readout-height")).toHaveText("5 ft 10 in");
    expect(await stored(page, "fuel_wunit")).toBe("st");
    expect((await storedProfile(page)).weight).toBe(98.5);
  });

  test("theme switch", async ({ page }) => {
    await openSettings(page);
    await page.getByTestId("v2-settings-row-units").click();
    await page.getByTestId("v2-theme-light").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await stored(page, "fuel_theme")).toBe("light");
    await page.getByTestId("v2-theme-dark").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByTestId("v2-theme-system").click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });

  test("Account & data for everyone; delete needs DELETE typed", async ({ page }) => {
    await openSettings(page);
    await page.getByTestId("v2-settings-row-account").click();
    await expect(page.getByTestId("v2-account-export")).toBeVisible();
    await expect(page.getByTestId("v2-account-upgrade")).toBeVisible();
    await expect(page.getByTestId("v2-account-signout")).toHaveCount(0);
    await expect(page.getByTestId("v2-account-delete")).toHaveCount(0);
  });

  test("Account & data signed in: sign out and guarded delete", async ({ page }) => {
    await openSettings(page, { premium: true });
    await page.getByTestId("v2-settings-row-account").click();
    await expect(page.getByTestId("v2-account-signout")).toBeVisible();
    await page.getByTestId("v2-account-delete").click();
    const go = page.getByTestId("v2-account-delete-go");
    await expect(go).toBeDisabled();
    await page.getByTestId("v2-account-delete-input").fill("delete");
    await expect(go).toBeEnabled();
  });

  test("Advanced shows the working and a read-only aggressive-cut status", async ({ page }) => {
    await openSettings(page, { extra: { tdee_adj: "-120" } });
    await page.getByTestId("v2-settings-row-advanced").click();
    await expect(page.getByTestId("v2-adv-adj")).toContainText("-120 kcal");
    for (const k of ["cut", "maintain", "bulk"]) await expect(page.getByTestId(`v2-adv-target-${k}`)).toBeVisible();
    await expect(page.getByTestId("v2-adv-aggressive")).not.toContainText(/undo/i);
    await page.getByTestId("v2-adv-reset").click();
    await page.getByTestId("v2-adv-reset-yes").click();
    await expect.poll(() => stored(page, "tdee_adj")).toBe("0");
  });

  test("no diet, allergy or dislike settings anywhere (D6)", async ({ page }) => {
    await openSettings(page, { profile: { ...PROFILE, dietary: { diets: ["vegan"], allergens: ["peanuts"], dislikes: [] } } });
    const root = page.getByTestId("settings-v2");
    for (const r of [null, "body", "units", "account", "advanced"]) {
      if (r) await page.getByTestId(`v2-settings-row-${r}`).click();
      await expect(root).not.toContainText(/diet type|allerg|dislike/i);
      if (r) await page.getByTestId("v2-settings-back").click();
    }
    // Stored diet data is left alone.
    await page.getByTestId("v2-settings-row-body").click();
    await page.getByTestId("v2-bodyfat").fill("21");
    await expect.poll(async () => (await storedProfile(page)).bodyFat).toBe("21");
    expect((await storedProfile(page)).dietary).toEqual({ diets: ["vegan"], allergens: ["peanuts"], dislikes: [] });
  });
});
