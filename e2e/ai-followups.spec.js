// AI capture follow-up questions — which ones get asked, and in what units.
//
// WHAT THIS DOES NOT TEST. The AI itself needs a real Supabase session: callAI sends the JWT and
// the worker rejects anonymous calls (app.jsx:1269). None of that is reachable from here, and it
// stays a device job — whether the token is accepted, whether the model returns sensible `ask`
// codes, whether the prompt is any good.
//
// What IS tested is everything that runs AFTER a response arrives: the choice of which items are
// worth a question, and the units the question is asked in. That code is local and deterministic,
// and it is where both reported defects lived ("how big was your ketchup — a fist?").
//
// Two things are stubbed to reach it, and nothing leaves the machine: a fake session token so
// callAI does not bail out early, and the worker response itself, fulfilled locally by Playwright.
// No real account, no real sign-in, no request to Supabase — the harness rule holds.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

/** Open AI Log with a canned model response for the given items. */
async function analyseWith(page, items) {
  await open(page, { premium: true });

  // The worker's response shape: content blocks whose text is the JSON the app parses.
  await page.route(AI_ENDPOINT, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ content: [{ text: JSON.stringify({ items }) }] }),
  }));

  // Open Food Facts runs in parallel and REPLACES an item when it comes back more confident,
  // clearing `ask` as it does (app.jsx:4062). Left live, it would silently delete the very
  // follow-up under test. Aborting makes searchOFT return null, which is its offline path.
  await page.route("**world.openfoodfacts.org/**", route => route.abort());

  // getAccessToken reads sb().auth.getSession(). preview.html deliberately creates no client, so
  // supply one that returns a token and nothing else — enough to get past the sign-in check.
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });

  await page.getByRole("button", { name: /AI LOG/ }).click();
  await page.getByPlaceholder(/GDK large mixed meat meal/).fill("test meal");
  await page.getByRole("button", { name: /ANALYSE MEAL/ }).click();
}

const item = (name, kcal, ask, confidence = 40) =>
  ({ name, kcal, protein: 5, carbs: 10, fat: 5, confidence, ask, reasoning: "e2e fixture" });

test.describe("Which items get a follow-up question", () => {
  test("a condiment too small to matter is never asked about", async ({ page }) => {
    // The reported case. At 20 kcal it topped a weak field on impact alone and reached the screen.
    await analyseWith(page, [item("Ketchup", 20, "portion")]);

    await expect(page.getByText("Ketchup").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("QUICK CHECK · OPTIONAL")).toHaveCount(0);

    await shot(page, "ai-no-question-for-ketchup");
  });

  test("an item big enough to matter still gets asked", async ({ page }) => {
    await analyseWith(page, [item("Beef lasagne", 700, "portion")]);

    await expect(page.getByText("QUICK CHECK · OPTIONAL")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Roughly how much Beef lasagne/)).toBeVisible();
  });

  test("the cooking-fat question is not asked about a drink", async ({ page }) => {
    // "Any oil or butter on the Whole milk?" does not apply.
    await analyseWith(page, [item("Whole milk", 200, "fat")]);

    await expect(page.getByText("Whole milk").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/oil or butter/i)).toHaveCount(0);
  });
});

test.describe("Portion questions are asked in units the food has", () => {
  test("solid food is asked in hand sizes", async ({ page }) => {
    await analyseWith(page, [item("Beef lasagne", 700, "portion")]);

    await expect(page.getByRole("button", { name: "Medium (a fist)" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /~250ml/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "A tablespoon" })).toHaveCount(0);

    await shot(page, "ai-portion-solid");
  });

  test("a drink is asked in glasses, never in fists", async ({ page }) => {
    await analyseWith(page, [item("Whole milk", 200, "portion")]);

    await expect(page.getByText(/How much Whole milk/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "Glass or mug (~250ml)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Large or pint (~500ml)" })).toBeVisible();
    await expect(page.getByRole("button", { name: /fist/i })).toHaveCount(0);

    await shot(page, "ai-portion-drink");
  });

  test("a sauce is asked in spoons, never in fists", async ({ page }) => {
    await analyseWith(page, [item("Mayonnaise", 180, "portion")]);

    await expect(page.getByRole("button", { name: "A tablespoon" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "A teaspoon" })).toBeVisible();
    await expect(page.getByRole("button", { name: /fist/i })).toHaveCount(0);

    await shot(page, "ai-portion-spoon");
  });

  test("an unrecognised food falls back to hand sizes rather than guessing", async ({ page }) => {
    await analyseWith(page, [item("Nan's mystery casserole", 500, "portion")]);

    await expect(page.getByRole("button", { name: "Medium (a fist)" })).toBeVisible({ timeout: 15_000 });
  });

  test("answering a drink's portion rescales it by the glass factor", async ({ page }) => {
    // End to end through refineElement: a pint is 2x the assumed 250ml serving.
    await analyseWith(page, [item("Whole milk", 200, "portion")]);
    await expect(page.getByRole("button", { name: "Large or pint (~500ml)" })).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Large or pint (~500ml)" }).click();

    // ItemRow prints the item's kcal as a bare rounded number (app.jsx:3952). Match it exactly —
    // an `exact: false` "400" also hits the running total and the macro line.
    await expect(page.getByText("400", { exact: true }).first()).toBeVisible();
  });
});
