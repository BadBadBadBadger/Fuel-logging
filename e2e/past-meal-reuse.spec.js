// A meal the user has logged before is answered from their log, not the model — features/logging/09.
//
// The founder's ask (2026-11-09): "the AI should look at the user's past eaten meals and check
// whether the same thing has been logged before, to save spending tokens." Typed text that
// matches a past entry (case, punctuation and spacing aside) is shown at once from that entry,
// and the worker is never hit. "Re-estimate with AI" is the way back to the model.
//
// Same stubbing as stated-totals.spec.js: a fake session token, the worker route fulfilled
// locally with numbers DIFFERENT from the past entry's, and every call counted.

const { test, expect } = require("@playwright/test");
const { open, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

const PAST = {
  name: "2 poached eggs on sourdough", kcal: 373, protein: 20.6, carbs: 44.8, fat: 11, conf: 86,
  source: "ai-text", followups: [], id: 1, time: "08:10",
  elements: [
    { name: "2 slices sourdough", kcal: 230, protein: 8, carbs: 44, fat: 1.5, conf: 80 },
    { name: "2 poached eggs", kcal: 143, protein: 12.6, carbs: 0.8, fat: 9.5, conf: 90 },
  ],
};
const HISTORY = [{ date: "2026-11-01", mode: "cut", kcal: 373, protein: 20.6, carbs: 44.8, fat: 11,
  training: false, water: 4, logs: [PAST] }];

async function openAILog(page) {
  await open(page, { premium: true, history: HISTORY });
  page.aiCalls = 0;
  await page.route(AI_ENDPOINT, route => {
    page.aiCalls++;
    route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ text: JSON.stringify({ items: [
        { name: "Model's guess", kcal: 999, protein: 50, carbs: 100, fat: 40, confidence: 70,
          ask: null, reasoning: "e2e fixture" },
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
const storedLogs = page => page.evaluate(keyExpr =>
  JSON.parse(localStorage.getItem("logs__" + eval(keyExpr)) || "[]"), TODAY_KEY_EXPR);

test.describe("A meal logged before is reused (logging/09)", () => {
  test("same meal, different case and punctuation: past numbers at once, model never asked", async ({ page }) => {
    await openAILog(page);
    await analyse(page, "2 Poached Eggs, on sourdough");
    await expect(page.getByText("↺ LOGGED BEFORE")).toBeVisible();
    await expect(page.getByText(/You logged this on 1 Nov/)).toBeVisible();
    // Counted here, on the AI Log screen: the dashboard's coach makes its own call once we leave.
    expect(page.aiCalls).toBe(0);
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    const logs = await storedLogs(page);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ kcal: 373, protein: 20.6, carbs: 44.8, fat: 11 });
    expect(logs[0].elements.map(e => e.name)).toEqual(PAST.elements.map(e => e.name));
  });

  test("Re-estimate with AI asks the model after all", async ({ page }) => {
    await openAILog(page);
    await analyse(page, "2 poached eggs on sourdough");
    await page.getByRole("button", { name: "Re-estimate with AI" }).click();
    await expect(page.getByText("Model's guess").first()).toBeVisible();
    await expect(page.getByText("↺ LOGGED BEFORE")).toHaveCount(0);
    expect(page.aiCalls).toBe(1);
  });

  test("a different meal still goes to the model", async ({ page }) => {
    await openAILog(page);
    await analyse(page, "3 poached eggs on sourdough");
    await expect(page.getByText("Model's guess").first()).toBeVisible();
    await expect(page.getByText("↺ LOGGED BEFORE")).toHaveCount(0);
    expect(page.aiCalls).toBe(1);
  });
});
