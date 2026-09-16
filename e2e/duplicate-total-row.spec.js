// A hallucinated "meal total" row must never double what LOG ALL AS ONE ENTRY writes.
//
// The founder's 16 Sep lunch (features/logging/00-bug-report.md follow-up): six real items —
// rice, chicken, sweet chilli sauce, mayo, tomatoes, spinach — typed alongside a trailing
// "Lunch estimate ≈700 kcal / Protein ~71g / Carbs ~76g / Fat ~16g" block. The prompt already
// tells the model never to turn a typed totals line into a separate item (logging/07), but that
// instruction is soft: the model came back with a 7th row whose four macros were exactly the sum
// of the real six. The TOTAL card and everything LOG ALL wrote came out at double — 1488 kcal
// instead of 744 — because the client summed every row it was given with no arithmetic check of
// its own. dropDuplicateTotalRow (app.jsx) now strips such a row after the model replies,
// regardless of whether the model obeyed the instruction. Jest exercises the pure function
// directly (__tests__/ai-log.test.js); this file is the screen and the record.
//
// Nothing leaves the machine — same stubbing as ai-followups.spec.js: a fake session token and
// the worker route fulfilled locally by Playwright.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

const REAL_ITEMS = [
  { name: "250g Tilda Sticky Rice",              kcal: 325, protein: 6.5, carbs: 71.5, fat: 1.3 },
  { name: "200g cooked chicken breast, no oil",  kcal: 220, protein: 46,  carbs: 0,    fat: 4.8 },
  { name: "30g sweet chilli sauce",              kcal: 57,  protein: 0.3, carbs: 13.5, fat: 0.1 },
  { name: "15g mayonnaise",                      kcal: 101, protein: 0.2, carbs: 0.3,  fat: 11  },
  { name: "100g cherry tomatoes",                kcal: 18,  protein: 0.9, carbs: 3.5,  fat: 0.2 },
  { name: "100g fresh spinach",                  kcal: 23,  protein: 2.8, carbs: 1.4,  fat: 0.4 },
].map(it => ({ ...it, confidence: 85, ask: null, reasoning: "e2e fixture" }));

const DUPLICATE_TOTAL_ROW = {
  name: "Lunch estimate", kcal: 744, protein: 56.7, carbs: 90.2, fat: 17.8,
  confidence: 80, ask: null,
  reasoning: "Sum of all components: 325+220+57+101+18+23 = 744 kcal — arithmetic check confirms the total.",
};

/** Open AI Log with a canned model response of 6 real items plus the hallucinated 7th total row. */
async function analyseWithDuplicateTotal(page) {
  await open(page, { premium: true });
  await page.route(AI_ENDPOINT, route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ content: [{ text: JSON.stringify({
      items: [...REAL_ITEMS, DUPLICATE_TOTAL_ROW],
    }) }] }),
  }));
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
  await page.getByRole("button", { name: /AI LOG/ }).click();
  await page.getByPlaceholder(/GDK large mixed meat meal/).fill(
    "250g Tilda Sticky Rice, 200g cooked chicken breast, no oil, 30g sweet chilli sauce, " +
    "15g mayo, 100g cherry tomatoes, 100g spinach. Lunch estimate ~700 kcal, protein ~71g, carbs ~76g, fat ~16g");
  await page.getByRole("button", { name: /ANALYSE MEAL/ }).click();
}

// Each item's own macro line ("P:6.5g · C:71.5g · F:1.3g") is unique to its ItemRow and, unlike
// the item's name, never collides with the typed description still sitting in the textarea.
const macroLine = it => `P:${it.protein}g · C:${it.carbs}g · F:${it.fat}g`;
const DUPLICATE_MACRO_LINE = macroLine(DUPLICATE_TOTAL_ROW);

test.describe("A duplicate meal-total row is dropped before it reaches the screen or the record", () => {
  test("only the six real items are shown — the summary row never renders", async ({ page }) => {
    await analyseWithDuplicateTotal(page);

    await expect(page.getByText("OVERALL CONFIDENCE")).toBeVisible({ timeout: 15_000 });
    for (const it of REAL_ITEMS) await expect(page.getByText(macroLine(it))).toBeVisible();
    await expect(page.getByText(DUPLICATE_MACRO_LINE)).toHaveCount(0);

    await shot(page, "ai-duplicate-total-row-dropped");
  });

  test("the TOTAL card sums the six real items only — not double", async ({ page }) => {
    await analyseWithDuplicateTotal(page);

    await expect(page.getByText("OVERALL CONFIDENCE")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("744")).toBeVisible();
    await expect(page.getByText("1488")).toHaveCount(0);
  });

  test("LOG ALL AS ONE ENTRY writes the true total, not double", async ({ page }) => {
    await analyseWithDuplicateTotal(page);

    await expect(page.getByText("OVERALL CONFIDENCE")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();

    const logged = await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("logs__"));
      const all  = keys.flatMap(k => JSON.parse(localStorage.getItem(k) || "[]"));
      return all[all.length - 1];
    });
    expect(logged.kcal).toBe(744);
    expect(logged.protein).toBeCloseTo(56.7, 1);
    expect(logged.carbs).toBeCloseTo(90.2, 1);
    expect(logged.fat).toBeCloseTo(17.8, 1);
  });
});
