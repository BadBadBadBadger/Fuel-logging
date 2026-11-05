// A photo meal logged as one entry is named after what the model saw — not "Photo meal".
//
// The founder's ask (2026-09-26): a photographed meal kept landing in the day's list as
// "Photo meal", which says nothing a week later. The photo prompt now asks the model for a short
// diary-style "meal" name (a brand off the packaging when one is visible), and LOG ALL AS ONE
// ENTRY uses it. The fallback order is Jest's: __tests__/ai-log.test.js lifts photoMealName.
//
// Nothing leaves the machine — same stubbing as stated-totals.spec.js: a fake session token and
// the worker route fulfilled locally. The "photo" is the app's own icon; the model never sees it.

const path = require("path");
const { test, expect } = require("@playwright/test");
const { open, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

const storedLogs = page => page.evaluate(keyExpr =>
  JSON.parse(localStorage.getItem("logs__" + eval(keyExpr)) || "[]"), TODAY_KEY_EXPR);

async function logPhoto(page, reply, notes = "") {
  const sent = [];
  await open(page, { premium: true });
  await page.route(AI_ENDPOINT, route => (sent.push(route.request().postData() || ""), route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ content: [{ text: JSON.stringify(reply) }] }),
  })));
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
  await page.getByRole("button", { name: /AI LOG/ }).click();
  await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, "..", "icon-192.png"));
  if (notes) await page.getByRole("textbox", { name: "Notes for the photo" }).fill(notes);
  await page.getByRole("button", { name: /ANALYSE PHOTO/ }).click();
  await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
  await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
  logPhoto.sent = sent;
  return storedLogs(page);
}

const ITEMS = [
  { name: "150g grilled chicken breast", kcal: 248, protein: 46, carbs: 0, fat: 5.4 },
  { name: "80g romaine with Caesar dressing", kcal: 190, protein: 3, carbs: 6, fat: 17 },
].map(it => ({ ...it, confidence: 85, ask: null, reasoning: "e2e fixture" }));

test.describe("A photo meal is named after the food", () => {
  test("the model's short name is what gets logged", async ({ page }) => {
    const logs = await logPhoto(page, { meal: "Chicken Caesar salad", items: ITEMS });
    expect(logs).toHaveLength(1);
    expect(logs[0].name).toBe("Chicken Caesar salad");
    expect(logs[0].source).toBe("ai-photo");
    expect(logs[0].elements.map(e => e.name)).toEqual(ITEMS.map(it => it.name));
  });

  test("a model that sends no name still never gives \"Photo meal\" for a single item", async ({ page }) => {
    const logs = await logPhoto(page, { items: [{ ...ITEMS[0], name: "Müller Corner strawberry yogurt" }] });
    expect(logs[0].name).toBe("Müller Corner strawberry yogurt");
  });
});

test.describe("Text typed with a photo guides the estimate (logging/08)", () => {
  test("the notes reach the model alongside the image, as guidance", async ({ page }) => {
    const notes = "200g chicken, cooked in 1 tbsp olive oil";
    await logPhoto(page, { meal: "Chicken Caesar salad", items: ITEMS }, notes);
    // The first call is the photo estimate (later calls, e.g. the coach, are not ours to check).
    const [content] = JSON.parse(logPhoto.sent[0]).messages.map(m => m.content);
    expect(content[0].type).toBe("image");
    expect(content[1].text).toContain(`USER'S NOTES about this photo: "${notes}"`);
  });
});
