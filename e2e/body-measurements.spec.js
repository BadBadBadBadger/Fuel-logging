// Body measurement tracking (features/body/01) — weekly tape measurements computing a
// Navy-method body-fat %, syncing into the profile's bodyFat field once the sync gate
// (4 same-formula readings) is reached. Covers the three touched surfaces: the weigh-in
// widget's measurement row, the Profile "BODY MEASUREMENTS" card, and the History toggle.

const { test, expect } = require("@playwright/test");
const { open, shot, PROFILE } = require("./harness");

// PROFILE (harness.js) is sex:"male", so the form should default to the 2-field shape.
async function expandMeasurementForm(page) {
  await page.getByText(/Log your first body measurement|Measured/).click();
}

test.describe("First measurement, from an empty state", () => {
  test("the widget invites a first measurement, and the form matches the male formula", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText("📏 Log your first body measurement")).toBeVisible();
    await expandMeasurementForm(page);

    await expect(page.getByPlaceholder("neck cm")).toBeVisible();
    await expect(page.getByPlaceholder("waist cm")).toBeVisible();
    await expect(page.getByPlaceholder("hip cm")).toHaveCount(0); // male: no hip field

    await shot(page, "measurement-form-open-male");
  });

  test("a waist not exceeding neck is hard-blocked, LOG stays disabled", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await expandMeasurementForm(page);

    await page.getByPlaceholder("neck cm").fill("40");
    await page.getByPlaceholder("waist cm").fill("38");

    await expect(page.getByText("Waist needs to be bigger than neck")).toBeVisible();
    const logBtn = page.getByRole("button", { name: "Log measurement" });
    await expect(logBtn).toBeDisabled();

    await shot(page, "measurement-form-blocked");
  });

  test("valid measurements save, compute a body-fat %, and are stored locally", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await expandMeasurementForm(page);

    await page.getByPlaceholder("neck cm").fill("38");
    await page.getByPlaceholder("waist cm").fill("83");
    await page.getByRole("button", { name: "Log measurement" }).click();

    await expect(page.getByText("Estimated body fat:")).toBeVisible();

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("bodymeasurements") || "[]"));
    expect(stored.length).toBe(1);
    expect(stored[0].formula).toBe("male");
    expect(stored[0].neck).toBe(38);
    expect(stored[0].waist).toBe(83);
    expect(stored[0].computed_bf).toBeGreaterThan(0);

    await shot(page, "measurement-saved-result");
  });

  test("the first-ever save offers an optional routine note", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await expandMeasurementForm(page);
    await expect(page.getByPlaceholder(/usual conditions/)).toBeVisible();
  });
});

test.describe("Female formula", () => {
  test("the form asks for hip too, and the domain guard covers waist+hip-neck", async ({ page }) => {
    await open(page, { profile: { ...PROFILE, sex: "female" } });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await expandMeasurementForm(page);

    await expect(page.getByPlaceholder("hip cm")).toBeVisible();

    // waist(70) > neck(32) alone looks fine, but hip is 0 — must still block.
    await page.getByPlaceholder("neck cm").fill("32");
    await page.getByPlaceholder("waist cm").fill("70");
    await expect(page.getByRole("button", { name: "Log measurement" })).toBeDisabled();

    await page.getByPlaceholder("hip cm").fill("95");
    await expect(page.getByRole("button", { name: "Log measurement" })).toBeEnabled();

    await page.getByRole("button", { name: "Log measurement" }).click();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("bodymeasurements") || "[]"));
    expect(stored[0].formula).toBe("female");
    expect(stored[0].hip).toBe(95);

    await shot(page, "measurement-form-female");
  });
});

test.describe("Profile — BODY MEASUREMENTS card", () => {
  test("shows the card and the opt-out toggle; the synced row waits for the sync gate", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await page.locator('button:has-text("⚙️")').click();
    await expect(page.getByText("MY PROFILE")).toBeVisible();
    await expect(page.getByText("BODY MEASUREMENTS")).toBeVisible();
    await expect(page.getByText("Don't ask me for these")).toBeVisible();
    await expect(page.getByText("Tape measurements estimate body fat")).toBeVisible(); // empty state
    await expect(page.getByText("Body Fat % (measured)")).toHaveCount(0); // sync gate not reached

    await shot(page, "profile-body-measurements-empty");
  });

  test("the synced row appears once the sync gate (4 same-formula readings) is reached", async ({ page }) => {
    const fourReadings = [0, 1, 2, 3].map(i => ({
      date: new Date(Date.now() - (10 - i) * 86400000).toISOString().split("T")[0],
      neck: 38, waist: 83 - i, hip: null, formula: "male", computed_bf: 18 - i,
    }));
    await open(page, { extra: { bodymeasurements: JSON.stringify(fourReadings) } });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await page.locator('button:has-text("⚙️")').click();
    await expect(page.getByText("Body Fat % (measured)")).toBeVisible();
    await expect(page.getByText(/from tape, updated/)).toBeVisible();

    await shot(page, "profile-body-measurements-synced");
  });

  test("the opt-out toggle mutes the dashboard nudge without hiding the fallback card", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await page.locator('button:has-text("⚙️")').click();
    await expect(page.getByText("BODY MEASUREMENTS")).toBeVisible();

    await page.getByLabel("Don't ask me for these").click();
    const muted = await page.evaluate(() => localStorage.getItem("mute_body_measurements"));
    expect(muted).toBe("1");

    // The card itself — the deliberate-visit fallback — stays, only the dashboard nudge is affected.
    await expect(page.getByText("BODY MEASUREMENTS")).toBeVisible();
  });
});

test.describe("History — Body Fat % toggle", () => {
  test("the toggle appears once a measurement exists and switches the chart", async ({ page }) => {
    const reading = [{ date: new Date().toISOString().split("T")[0],
      neck: 38, waist: 83, hip: null, formula: "male", computed_bf: 18 }];
    await open(page, { extra: { bodymeasurements: JSON.stringify(reading) } });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await page.locator('button:has-text("📊")').click();
    await expect(page.getByText("HISTORY")).toBeVisible();

    const toggle = page.getByRole("button", { name: "📏 Body Fat %" });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await shot(page, "history-body-fat-chart");
  });

  test("no toggle is offered when no measurement has ever been logged", async ({ page }) => {
    await open(page);
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
    await page.locator('button:has-text("📊")').click();
    await expect(page.getByText("HISTORY")).toBeVisible();
    await expect(page.getByRole("button", { name: "📏 Body Fat %" })).toHaveCount(0);
  });
});
