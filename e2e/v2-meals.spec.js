// Feature: Tap a meal row to edit it — Today v2 (features/logging/11-tap-row-to-edit.feature)
//
// v2 is behind ?ui=v2. The harness clears localStorage on seed, so the flag comes back from the
// query string on every load (the app re-latches localStorage.ui_v2 from it).
//
// Locators are data-testid / role hooks, never copy, except where the copy IS the claim
// ("Saved to Quick Add", "Re-estimating…", "Updated", "Tap a meal to edit.").
//
// The re-estimate is stubbed exactly as entry-editor.spec.js does: the worker answer is fulfilled
// locally and the session token is faked. Nothing leaves the machine.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

// Distinct numbers in every field so a locator can't pick the wrong box and still pass.
const LOGS = [
  { id: 1755000000001, name: "Porridge with banana", time: "07:45", kcal: 420, protein: 14, carbs: 72, fat: 8 },
  { id: 1755000000002, name: "Chicken and rice",     time: "12:30", kcal: 620, protein: 45, carbs: 70, fat: 14 },
  { id: 1755000000003, name: "Flat white",           time: "15:10", kcal: 110, protein: 6,  carbs: 9,  fat: 6 },
];

async function openV2(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
}

const meals = page => page.getByTestId("v2-meals");
const row = (page, name) => meals(page).getByTestId("v2-meal-row").filter({ hasText: name });
const editor = page => page.getByTestId("v2-meal-editor");
const stored = page => page.evaluate(k => JSON.parse(localStorage.getItem("logs__" + eval(k)) || "[]"), TODAY_KEY_EXPR);
const savedMeals = page => page.evaluate(() => JSON.parse(localStorage.getItem("meals") || "[]"));

async function stubAI(page, ai, { delay = 0, fail = false } = {}) {
  page.aiCalls = 0;
  await page.route(AI_ENDPOINT, async route => {
    page.aiCalls++;
    if (delay) await new Promise(r => setTimeout(r, delay));
    if (fail) return route.abort();
    return route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ text: JSON.stringify(ai) }] }) });
  });
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
}

const SAVED = [
  { name: "Overnight oats", kcal: 420, protein: 22, carbs: 58, fat: 11 },
  { name: "Chicken salad", kcal: 510, protein: 44, carbs: 18, fat: 28 },
];

test.describe("Today v2 — log buttons", () => {
  test("LOG FOOD content fits at 360px for free and premium users", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const premium of [false, true]) {
      await openV2(page, { premium, logs: LOGS });
      const overflow = await page.getByTestId("v2-log-food").evaluate(el => el.scrollWidth - el.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
  test("LOG FOOD and QUICK ADD sit above the meal list", async ({ page }) => {
    await openV2(page, { premium: true, logs: LOGS });
    const lf = page.getByTestId("v2-log-food");
    const qa = page.getByTestId("v2-quick-add");
    await expect(lf).toContainText(/log food/i);
    await expect(lf).toContainText("AI");
    // The button itself carries no glyph strip any more — those live in the drop-down
    await expect(lf.locator("svg")).toHaveCount(0);
    await expect(qa).toContainText(/quick add/i);
    await expect(qa).toContainText("saved meals");
    const lfBox = await lf.boundingBox();
    const listBox = await page.getByTestId("v2-meals-head").boundingBox();
    expect(lfBox.y + lfBox.height).toBeLessThanOrEqual(listBox.y);
    // Premium: no lock mark
    await expect(page.getByTestId("v2-log-food-lock")).toHaveCount(0);
  });

  test("premium: LOG FOOD drops the AI log open in place — no separate screen", async ({ page }) => {
    await openV2(page, { premium: true });
    const lf = page.getByTestId("v2-log-food");
    await expect(lf).toHaveAttribute("aria-expanded", "false");
    await lf.click();
    await expect(lf).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("v2-ailog")).toBeVisible();
    await expect(page.getByTestId("today-v2")).toBeVisible();          // still on Today
    await expect(page.getByText("AI MEAL LOG", { exact: true })).toHaveCount(0);
    // The strip is real buttons with icons, not emoji
    await expect(page.getByRole("button", { name: "Take a photo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Choose photos" })).toBeVisible();
    const strip = await page.getByTestId("v2-ailog").innerText();
    expect(strip).not.toMatch(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u);
    // Tapping LOG FOOD again folds it away
    await lf.click();
    await expect(page.getByTestId("v2-ailog")).toHaveCount(0);
  });

  test("premium: a meal analysed in the drop-down is logged and the panel closes", async ({ page }) => {
    await openV2(page, { premium: true });
    await page.route("https://fuellog.adriandavidrichards.workers.dev", route => route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ text: JSON.stringify({ items: [
        { name: "Banana", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, confidence: 90 }] }) }] }),
    }));
    await page.evaluate(() => {
      window.supabaseClient = {
        auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
      };
    });
    await page.getByTestId("v2-log-food").click();
    await page.getByRole("textbox", { name: "Describe your meal" }).fill("a banana");
    await page.getByRole("button", { name: /ANALYSE MEAL/ }).click();
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByTestId("v2-ailog")).toHaveCount(0);
    await expect(page.getByTestId("v2-meal-row")).toHaveCount(1);
    expect((await stored(page))[0].kcal).toBe(105);
  });

  test("free: LOG FOOD opens the premium gate, not the AI log", async ({ page }) => {
    await openV2(page);
    await expect(page.getByTestId("v2-log-food-lock")).toBeVisible();
    await page.getByTestId("v2-log-food").click();
    await expect(page.getByText("PREMIUM FEATURE")).toBeVisible();
    await expect(page.getByText("AI MEAL LOG", { exact: true })).toHaveCount(0);
    await expect(page.getByTestId("today-v2")).toBeVisible();
  });

  test("QUICK ADD drops saved meals open in place — no separate screen, no emoji", async ({ page }) => {
    await openV2(page, { premium: true, meals: SAVED });
    const qa = page.getByTestId("v2-quick-add");
    await qa.click();
    await expect(qa).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("v2-quick")).toBeVisible();
    await expect(page.getByText("QUICK ADD", { exact: true })).toHaveCount(0);   // the old screen's title
    await expect(page.getByTestId("today-v2")).toBeVisible();
    await expect(page.getByTestId("v2-quick-row")).toHaveCount(2);
    expect(await page.getByTestId("v2-quick").innerText()).not.toMatch(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u);
    // Only one drop-down at a time
    await page.getByTestId("v2-log-food").click();
    await expect(page.getByTestId("v2-quick")).toHaveCount(0);
  });

  test("tapping a saved meal logs it and folds the panel away", async ({ page }) => {
    await openV2(page, { meals: SAVED });
    await page.getByTestId("v2-quick-add").click();
    await page.getByLabel("Search saved meals").fill("oat");
    await expect(page.getByTestId("v2-quick-row")).toHaveCount(1);
    await page.getByRole("button", { name: "Log Overnight oats" }).click();
    await expect(page.getByTestId("v2-quick")).toHaveCount(0);
    await expect(page.getByTestId("v2-meal-row")).toHaveCount(1);
    expect((await stored(page))[0]).toMatchObject({ name: "Overnight oats", kcal: 420 });
  });

  test("new meal, edit and forget work from the panel", async ({ page }) => {
    await openV2(page, { meals: SAVED });
    await page.getByTestId("v2-quick-add").click();
    await page.getByTestId("v2-quick-new").click();
    const form = page.getByTestId("v2-meal-form");
    await expect(form).toBeVisible();
    await form.getByPlaceholder("e.g. Chicken breast (150g)").fill("Protein shake");
    await form.locator('input[type="number"]').first().fill("180");
    await form.getByRole("button", { name: "ADD MEAL" }).click();
    await expect(page.getByTestId("v2-quick-row")).toHaveCount(3);
    await page.getByRole("button", { name: "Forget Protein shake" }).click();
    await expect(page.getByTestId("v2-quick-row")).toHaveCount(2);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("meals")).map(m => m.name));
    expect(saved).toEqual(["Overnight oats", "Chicken salad"]);
  });
});

test.describe("Today v2 — meal rows and the inline editor", () => {
  test("rows: time, name, macros with P emphasised, kcal; header count; hint; no per-row buttons", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await expect(page.getByTestId("v2-meals-summary")).toHaveText("3 items · 1,150");
    const rows = meals(page).getByTestId("v2-meal-row");
    await expect(rows).toHaveCount(3);
    // Order as logged
    await expect(rows.nth(0)).toContainText("07:45");
    await expect(rows.nth(2)).toContainText("Flat white");
    const r = row(page, "Chicken and rice");
    await expect(r).toHaveAttribute("aria-expanded", "false");
    await expect(r.getByTestId("v2-meal-macros")).toHaveText("P 45 · C 70 · F 14");
    await expect(r.getByTestId("v2-meal-macros").locator("b")).toHaveText("P 45");
    await expect(r.getByTestId("v2-meal-kcal")).toHaveText("620");
    // The row itself is the only control: no buttons nested in it, none beside it.
    await expect(r.locator("button")).toHaveCount(0);
    await expect(meals(page).getByRole("button")).toHaveCount(3);
    await expect(page.getByTestId("v2-meals-hint")).toHaveText("Tap a meal to edit.");
  });

  test("empty day: one quiet line, no hint", async ({ page }) => {
    await openV2(page);
    await expect(page.getByTestId("v2-meals-empty")).toHaveText("Nothing logged yet today.");
    await expect(page.getByTestId("v2-meals-hint")).toHaveCount(0);
    await expect(page.getByTestId("v2-meals-summary")).toHaveCount(0);
  });

  test("tap expands in place, pre-filled, with the full action set", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await row(page, "Chicken and rice").click();
    const ed = editor(page);
    await expect(ed).toBeVisible();
    await expect(ed.getByTestId("v2-meal-row")).toHaveAttribute("aria-expanded", "true");
    await expect(ed).toContainText("12:30");
    await expect(ed).toContainText(/editing/i);
    await expect(ed.getByLabel("Name")).toHaveValue("Chicken and rice");
    await expect(ed.getByLabel("Kcal")).toHaveValue("620");
    await expect(ed.getByLabel("Protein")).toHaveValue("45");
    await expect(ed.getByLabel("Carbs")).toHaveValue("70");
    await expect(ed.getByLabel("Fat")).toHaveValue("14");
    await expect(ed.getByRole("button", { name: "Save", exact: true })).toBeVisible();
    await expect(ed.getByRole("button", { name: "Save to Quick Add" })).toBeVisible();
    await expect(ed.getByRole("button", { name: "Delete" })).toBeVisible();
    await expect(ed.getByRole("button", { name: "Re-estimate from name" })).toBeVisible();
    await expect(ed.getByTestId("v2-meal-pro")).toBeVisible();
    // Editor sits inside the list, between its neighbours — no overlay.
    const order = await meals(page).locator('[data-testid="v2-meal-row"], [data-testid="v2-meal-editor"]')
      .evaluateAll(els => els.map(e => e.dataset.testid));
    expect(order).toEqual(["v2-meal-row", "v2-meal-editor", "v2-meal-row", "v2-meal-row"]);
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await shot(page, "v2-meals-open");
  });

  test("only one row is open at a time", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await row(page, "Porridge with banana").click();
    await editor(page).getByLabel("Kcal").fill("999");
    await row(page, "Flat white").click();
    await expect(editor(page)).toHaveCount(1);
    await expect(editor(page).getByLabel("Name")).toHaveValue("Flat white");
    // The first one collapsed with its stored values — the 999 went nowhere.
    await expect(row(page, "Porridge with banana").getByTestId("v2-meal-kcal")).toHaveText("420");
    expect((await stored(page))[0].kcal).toBe(420);
  });

  test("save updates the row, the totals, and the record", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await row(page, "Chicken and rice").click();
    const ed = editor(page);
    await ed.getByLabel("Name").fill("Chicken thigh and rice");
    await ed.getByLabel("Kcal").fill("700");
    await ed.getByLabel("Protein").fill("50");
    await ed.getByLabel("Carbs").fill("72");
    await ed.getByLabel("Fat").fill("20");
    await ed.getByTestId("v2-meal-save").click();
    await expect(editor(page)).toHaveCount(0);
    const r = row(page, "Chicken thigh and rice");
    await expect(r.getByTestId("v2-meal-kcal")).toHaveText("700");
    await expect(r.getByTestId("v2-meal-macros")).toHaveText("P 50 · C 72 · F 20");
    await expect(page.getByTestId("v2-meals-summary")).toHaveText("3 items · 1,230");
    await page.reload();
    await expect(row(page, "Chicken thigh and rice").getByTestId("v2-meal-kcal")).toHaveText("700");
    expect((await stored(page))[1]).toMatchObject({ name: "Chicken thigh and rice", kcal: 700, protein: 50 });
  });

  for (const how of ["header", "cancel"]) {
    test(`collapsing via ${how} discards changes (O5)`, async ({ page }) => {
      await openV2(page, { logs: LOGS });
      await row(page, "Chicken and rice").click();
      await editor(page).getByLabel("Kcal").fill("9999");
      await editor(page).getByLabel("Name").fill("Something else");
      if (how === "header") await editor(page).getByTestId("v2-meal-row").click();
      else await editor(page).getByRole("button", { name: "Cancel" }).click();
      await expect(editor(page)).toHaveCount(0);
      await expect(row(page, "Chicken and rice").getByTestId("v2-meal-kcal")).toHaveText("620");
      await expect(page.getByTestId("v2-meals-summary")).toHaveText("3 items · 1,150");
      // Re-open: the typed values are gone.
      await row(page, "Chicken and rice").click();
      await expect(editor(page).getByLabel("Kcal")).toHaveValue("620");
      await expect(editor(page).getByLabel("Name")).toHaveValue("Chicken and rice");
    });
  }

  test("delete removes the meal and its kcal", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await row(page, "Chicken and rice").click();
    await editor(page).getByTestId("v2-meal-delete").click();
    await expect(row(page, "Chicken and rice")).toHaveCount(0);
    await expect(editor(page)).toHaveCount(0);
    await expect(page.getByTestId("v2-meals-summary")).toHaveText("2 items · 530");
    expect((await stored(page)).map(l => l.name)).toEqual(["Porridge with banana", "Flat white"]);
  });

  test("save to Quick Add: filled bookmark, label, re-blink, entry untouched", async ({ page }) => {
    await openV2(page, { logs: LOGS, meals: [] });
    await row(page, "Flat white").click();
    const btn = editor(page).getByTestId("v2-meal-saveqa");
    await expect(btn).toHaveText("Save to Quick Add");
    await expect(btn).toHaveAttribute("aria-pressed", "false");
    await btn.click();
    await expect(btn).toHaveText("Saved to Quick Add");
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(btn.locator('svg[fill="currentColor"]')).toHaveCount(1);   // the filled bookmark
    const m = await savedMeals(page);
    expect(m).toEqual([{ name: "Flat white", kcal: 110, protein: 6, carbs: 9, fat: 6 }]);
    // Re-blink on a second tap: the button is re-mounted with the animation each time.
    const anim = () => btn.evaluate(el => getComputedStyle(el).animationName);
    expect(await anim()).toBe("blink_add");
    await btn.click();
    await expect(btn).toHaveText("Saved to Quick Add");
    expect((await savedMeals(page)).length).toBe(1);   // addToQA does not duplicate a name
    // Still open; the logged entry is unchanged.
    await expect(editor(page)).toBeVisible();
    expect((await stored(page))[2].kcal).toBe(110);
    await shot(page, "v2-meals-saved-qa");
  });

  test("free: re-estimate opens the premium gate and asks nothing", async ({ page }) => {
    await openV2(page, { logs: LOGS });
    await stubAI(page, { kcal: 1, protein: 1, carbs: 1, fat: 1 });
    await row(page, "Chicken and rice").click();
    await editor(page).getByTestId("v2-meal-reestimate").click();
    await expect(page.getByText("PREMIUM FEATURE")).toBeVisible();
    expect(page.aiCalls).toBe(0);
    await expect(editor(page).getByLabel("Kcal")).toHaveValue("620");
  });

  test("premium: re-estimate shows progress, then refills from the typed name", async ({ page }) => {
    await openV2(page, { premium: true, logs: LOGS });
    await stubAI(page, { name: "Chicken thigh and rice", kcal: 815, protein: 52, carbs: 71, fat: 33,
      confidence: 92, reasoning: "e2e fixture" }, { delay: 800 });
    await row(page, "Chicken and rice").click();
    const ed = editor(page);
    await ed.getByLabel("Name").fill("Chicken thigh and rice");
    await ed.getByTestId("v2-meal-reestimate").click();
    await expect(ed.getByTestId("v2-meal-reestimate")).toHaveText("Re-estimating…");
    await expect(ed.getByTestId("v2-meal-reestimate")).toHaveText("Updated", { timeout: 15_000 });
    await expect(ed.getByLabel("Kcal")).toHaveValue("815");
    await expect(ed.getByLabel("Protein")).toHaveValue("52");
    await expect(ed.getByLabel("Carbs")).toHaveValue("71");
    await expect(ed.getByLabel("Fat")).toHaveValue("33");
    await expect(ed.getByLabel("Name")).toHaveValue("Chicken thigh and rice");
    expect((await stored(page))[1].kcal).toBe(620);   // nothing saved yet
    await ed.getByTestId("v2-meal-save").click();
    await expect(row(page, "Chicken thigh and rice").getByTestId("v2-meal-kcal")).toHaveText("815");
  });

  test("premium: a failed re-estimate says so and keeps the fields", async ({ page }) => {
    await openV2(page, { premium: true, logs: LOGS });
    await stubAI(page, {}, { fail: true });
    await row(page, "Chicken and rice").click();
    await editor(page).getByTestId("v2-meal-reestimate").click();
    await expect(editor(page).getByTestId("v2-meal-reestimate-error")).toBeVisible({ timeout: 15_000 });
    await expect(editor(page).getByTestId("v2-meal-reestimate")).toHaveText("Re-estimate from name");
    await expect(editor(page).getByLabel("Kcal")).toHaveValue("620");
  });
});
