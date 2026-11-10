// The lookup chain — features/logging/10.
//
// Cheapest and surest first: the parts of a mixed meal logged before come from the log, a sure
// product label comes from Open Food Facts (through the worker's /food route), the AI is asked
// only for what is left, and the web check runs only on a tap. Both worker routes are fulfilled
// locally and counted; the model's fixture numbers differ from the log's and the label's, so
// any row shows where it came from.

const { test, expect } = require("@playwright/test");
const { open, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

const BAKE = { name: "Chicken fajita pasta bake", kcal: 720, protein: 52, carbs: 70, fat: 22, conf: 70,
  source: "ai-text", followups: [], id: 2, time: "19:00", elements: null };
const HISTORY = [
  { date: "2026-11-03", mode: "cut", kcal: 720, protein: 52, carbs: 70, fat: 22,
    training: false, water: 4, logs: [BAKE] },
];
const BAREBELLS = { code: "7340001802056", name: "Protein Bar Cookies & Cream", brands: "Barebells",
  kcal100: 364, protein100: 36, carbs100: 36, fat100: 13, servingG: 55 };

const modelReply = items => ({ status: 200, contentType: "application/json",
  body: JSON.stringify({ content: [{ text: JSON.stringify({ items }) }] }) });
const YOGHURT = { name: "Greek yoghurt pot", kcal: 140, protein: 10, carbs: 6, fat: 8, confidence: 55,
  ask: null, reasoning: "e2e fixture" };

async function openAILog(page, { products = [], items = [YOGHURT], webItems = null } = {}) {
  await open(page, { premium: true, history: HISTORY, extra: { qa_revive_v68: "1" } });
  page.aiCalls = 0; page.aiBodies = [];
  await page.route(AI_ENDPOINT, route => {
    page.aiCalls++;
    const body = route.request().postData() || "";
    page.aiBodies.push(body);
    route.fulfill(modelReply(JSON.parse(body).web && webItems ? webItems : items));
  });
  page.foodBodies = [];
  await page.route(AI_ENDPOINT + "/food", route => {
    page.foodBodies.push(JSON.parse(route.request().postData() || "{}"));
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ products }) });
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

test.describe("The lookup chain (logging/10)", () => {
  test("a mixed meal: the bake from the log, only the yoghurt sent to the AI", async ({ page }) => {
    await openAILog(page);
    await analyse(page, "chicken fajita pasta bake and a greek yoghurt");
    await expect(page.getByText("↺ PARTLY FOUND WITHOUT AI")).toBeVisible();
    await expect(page.getByText(/From your log: “Chicken fajita pasta bake”, 3 Nov/)).toBeVisible();
    await expect(page.getByText("Greek yoghurt pot").first()).toBeVisible();
    expect(page.aiCalls).toBe(1);
    const prompt = JSON.parse(page.aiBodies[0]).messages[0].content;
    expect(prompt).toMatch(/ALREADY WORKED OUT/);
    expect(prompt).toContain('- "Chicken fajita pasta bake": 720 kcal');
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    expect((await storedLogs(page))[0]).toMatchObject({ kcal: 860 });
  });

  test("the founder's bar, brand misspelt: its label, and the AI is never asked", async ({ page }) => {
    await openAILog(page, { products: [BAREBELLS] });
    await analyse(page, "cookies and cream barbells protein bar");
    await expect(page.getByText("↺ FOUND WITHOUT AI")).toBeVisible();
    await expect(page.getByText(/Product label: Barebells Protein Bar Cookies & Cream/)).toBeVisible();
    await expect(page.getByText("Barebells Protein Bar Cookies & Cream (55 g)").first()).toBeVisible();
    expect(page.aiCalls).toBe(0);
    expect(page.foodBodies).toEqual([{ q: "cookies and cream barbells protein bar" }]);
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    expect((await storedLogs(page))[0]).toMatchObject({ kcal: 200, protein: 19.8, fat: 7.2 });
  });

  test("a label that is not a sure match is not used: the AI is asked, with it as a hint", async ({ page }) => {
    await openAILog(page, { products: [{ ...BAREBELLS, name: "Protein Bar Salty Peanut" },
      { ...BAREBELLS, code: "2", name: "Protein Bar Caramel Cashew" }] });
    await analyse(page, "barebells protein bar");
    await expect(page.getByText("Greek yoghurt pot").first()).toBeVisible();
    expect(page.aiCalls).toBe(1);
    expect(JSON.parse(page.aiBodies[0]).messages[0].content).toMatch(/Possible product labels/);
  });

  test("a typed barcode is looked up by code", async ({ page }) => {
    await openAILog(page, { products: [BAREBELLS] });
    await analyse(page, "7340001802056");
    await expect(page.getByText(/Barcode: Barebells Protein Bar Cookies & Cream/)).toBeVisible();
    expect(page.foodBodies).toEqual([{ code: "7340001802056" }]);
    expect(page.aiCalls).toBe(0);
  });

  test("Re-estimate everything with AI skips every lookup", async ({ page }) => {
    await openAILog(page, { products: [BAREBELLS] });
    await analyse(page, "cookies and cream barbells protein bar");
    await page.getByRole("button", { name: "Re-estimate everything with AI" }).click();
    await expect(page.getByText("Greek yoghurt pot").first()).toBeVisible();
    expect(page.aiCalls).toBe(1);
    expect(page.foodBodies).toHaveLength(1);
  });

  test("Check online: offered for a low-confidence AI row, sent once, replaces only AI rows", async ({ page }) => {
    const web = [{ ...YOGHURT, name: "Fage Total 0% (170 g)", kcal: 92, confidence: 93,
      reasoning: "fage.co.uk nutrition page" }];
    await openAILog(page, { webItems: web });
    await analyse(page, "chicken fajita pasta bake and a greek yoghurt");
    await page.getByRole("button", { name: /Check online/ }).click();
    await expect(page.getByText("Fage Total 0% (170 g)").first()).toBeVisible();
    expect(page.aiCalls).toBe(2);
    const second = JSON.parse(page.aiBodies[1]);
    expect(second.web).toBe(true);
    expect(second.tools).toBeUndefined();
    expect(second.messages[0].content).toContain('"Greek yoghurt pot"');
    expect(second.messages[0].content).not.toContain('"Chicken fajita pasta bake"');
    await expect(page.getByRole("button", { name: /Check online/ })).toHaveCount(0);
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    expect((await storedLogs(page))[0]).toMatchObject({ kcal: 812 });
  });

  test("no Check online button when the AI is already confident", async ({ page }) => {
    await openAILog(page, { items: [{ ...YOGHURT, confidence: 85 }] });
    await analyse(page, "a greek yoghurt pot");
    await expect(page.getByText("Greek yoghurt pot").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Check online/ })).toHaveCount(0);
  });
});
