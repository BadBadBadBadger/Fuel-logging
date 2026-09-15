// Totals typed by the user are the meal, not another row — features/logging/06.
//
// The founder's Bug 2 (features/logging/00-bug-report.md): a description ending in
// "P: 9.2g C: 66.5g F: 25.8g 539 kcal" came back as component rows PLUS a row for the totals
// line, and LOG ALL AS ONE ENTRY summed the lot to 942 kcal. Now a full totals line is one row,
// shown at once, and the model is not asked at all.
//
// The tests here are about the SCREEN and the RECORD: what appears, what gets logged, and — the
// assertion that matters most — that the worker route is never hit. The recogniser's own edge
// cases (word forms, figures-first, what must NOT count) are Jest's: __tests__/ai-log.test.js
// lifts the real regexes out of app.jsx and runs them.
//
// Nothing leaves the machine. The session token is faked (callAI bails without one) and the
// worker route is stubbed — with a canned answer whose numbers are DIFFERENT from the typed
// totals, so that if the model were asked after all, the wrong numbers would show and the test
// would say so. No real account; the harness rule holds.

const { test, expect } = require("@playwright/test");
const { open, shot, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

const CRUMPETS =
  "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each) — P: 9.2g C: 66.5g F: 25.8g 539 kcal";
const CRUMPETS_NAME = "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each)";

/** Open AI Log signed-in, with the worker stubbed to a tell-tale answer and every call counted. */
async function openAILog(page) {
  await open(page, { premium: true });
  page.aiCalls = 0;
  await page.route(AI_ENDPOINT, route => {
    page.aiCalls++;
    route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ text: JSON.stringify({ items: [
        { name: "Model's guess", kcal: 942, protein: 15.6, carbs: 101.8, fat: 51.6, confidence: 70,
          ask: null, reasoning: "e2e fixture — must never be shown for a stated total" },
      ] }) }] }) });
  });
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
  await page.getByRole("button", { name: /AI LOG/ }).click();
}

const analyse = async (page, text) => {
  await page.getByPlaceholder(/GDK large mixed meat meal/).fill(text);
  await page.getByRole("button", { name: /ANALYSE MEAL/ }).click();
};

/** Today's stored log — the record, not the render. */
const storedLogs = page => page.evaluate(keyExpr =>
  JSON.parse(localStorage.getItem("logs__" + eval(keyExpr)) || "[]"), TODAY_KEY_EXPR);

test.describe("A full totals line is the meal", () => {
  test("the founder's crumpets: one row, at once, exactly the typed numbers, model never asked", async ({ page }) => {
    await openAILog(page);
    await analyse(page, CRUMPETS);

    // One row, named after the food, with the typed figures at 100%.
    await expect(page.getByText(CRUMPETS_NAME, { exact: false }).first()).toBeVisible();
    await expect(page.getByText("539", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/100% High/).first()).toBeVisible();
    await expect(page.getByText("Model's guess")).toHaveCount(0);
    await expect(page.getByText("QUICK CHECK · OPTIONAL")).toHaveCount(0);

    await shot(page, "stated-totals-one-row");
    expect(page.aiCalls).toBe(0);
  });

  test("LOG ALL AS ONE ENTRY logs 539, not 942", async ({ page }) => {
    await openAILog(page);
    await analyse(page, CRUMPETS);
    await expect(page.getByText("539", { exact: true }).first()).toBeVisible();
    // Counted here, before leaving the screen: the dashboard has worker calls of its own (the
    // coach), which are not what this test is about.
    expect(page.aiCalls).toBe(0);
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();

    // Back on the dashboard, the day rose by exactly the typed total.
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("CONSUMED", { exact: true }).locator("xpath=following-sibling::div[1]"))
      .toContainText("539");

    const logs = await storedLogs(page);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ kcal: 539, protein: 9.2, carbs: 66.5, fat: 25.8, conf: 100 });
    expect(logs[0].name).toBe(CRUMPETS_NAME);
  });

  test("a description without a totals line still goes to the model", async ({ page }) => {
    await openAILog(page);
    await analyse(page, "Pret chicken bacon sandwich, 480 kcal");

    await expect(page.getByText("Model's guess").first()).toBeVisible({ timeout: 15_000 });
    expect(page.aiCalls).toBe(1);
  });
});
