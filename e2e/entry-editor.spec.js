// Feature: Edit a logged entry in place (features/logging/01-edit-entry.feature)
//
// A straight translation of the five Gherkin scenarios. The editor is the one surface where a
// wrong number can be corrected after the fact, so what matters is that the correction actually
// lands — in the row, in the day's totals, and on disk — and that Cancel truly discards.
//
// WHAT THIS DOES NOT TEST. The two AI scenarios stub the model: the worker response is fulfilled
// locally by Playwright and the session token is faked, exactly as ai-followups.spec.js does. That
// exercises everything after a response arrives — filling the fields, the Open Food Facts
// cross-check, the premium gate — and says nothing about whether the real model returns sensible
// numbers. No real account, no request leaves the machine; the no-cloud rule holds.

const { test, expect } = require("@playwright/test");
const { open, shot, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

// One entry, with values chosen so every field is distinguishable from every other. Reusing a
// number across fields would let a locator pick up the wrong box and still pass.
const ENTRY = { id: 1755000000000, name: "Chicken and rice", time: "12:30",
  kcal: 620, protein: 45, carbs: 70, fat: 14 };

// One Open Food Facts product, shared by the two re-estimate tests so they differ in nothing else.
// serving_size 100 g makes the per-serving factor exactly 1 (app.jsx:3903), so the numbers that
// land are the label's own — no arithmetic of mine sits between the fixture and the assertion.
const OFT_FIXTURE = { product_name: "Beef Lasagne", serving_size: "100 g",
  nutriments: { "energy-kcal_100g": 415, proteins_100g: 21, carbohydrates_100g: 39, fat_100g: 19 } };

/** The card holding TODAY'S LOG — the header's parent. Scopes assertions off the rest of the page. */
const logCard = page => page.getByText(/TODAY'S LOG · \d+ ITEM/).locator("xpath=..");

/** The dashboard's CONSUMED figure — the sibling div after the label. */
const consumed = page => page.getByText("CONSUMED", { exact: true }).locator("xpath=following-sibling::div[1]");

/**
 * An editor field, by its label.
 *
 * The labels are styled `<label>`s with no `for`/`id` pairing, so getByLabel finds nothing and
 * the inputs have no accessible name at all. Walking the document from the label to the next
 * input works for both layouts here: NAME's input is its sibling, the macro inputs sit one
 * wrapper deeper. Anchoring on the visible label is still far better than an index.
 */
const field = (page, label) =>
  page.locator(`label:text-is("${label}")`).locator("xpath=following::input[1]");

/** The kcal actually written to `logs__<todayKey>` — the record, not the render. */
const storedKcal = page => page.evaluate(keyExpr =>
  JSON.parse(localStorage.getItem("logs__" + eval(keyExpr)) || "[]")[0]?.kcal, TODAY_KEY_EXPR);

const openEditor = async page => {
  await page.getByText(ENTRY.name, { exact: true }).click();
  await expect(field(page, "KCAL")).toBeVisible();
};

/** Premium AI, stubbed. `oft` null aborts Open Food Facts; an object is returned as a product. */
async function stubAI(page, ai, oft = null) {
  await page.route(AI_ENDPOINT, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ content: [{ text: JSON.stringify(ai) }] }),
  }));

  // OFF runs after the AI answer and overwrites it whenever it is more confident — its confidence
  // is hardcoded 98 (app.jsx:3910), so it beats anything the AI claims below that. Left live it
  // would reach the real network and make the result depend on a third party's uptime.
  await page.route("**world.openfoodfacts.org/**", route => oft
    ? route.fulfill({ status: 200, contentType: "application/json",
        body: JSON.stringify({ products: [oft] }) })
    : route.abort());

  // callAI refuses without a session token (app.jsx:1271) and preview.html deliberately creates no
  // Supabase client. Supply just enough to get past that check — this is not a sign-in.
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
}

test.describe("Edit a logged entry in place", () => {
  test("tapping an entry opens an inline editor, pre-filled", async ({ page }) => {
    await open(page, { logs: [ENTRY] });

    await expect(page.getByText("TODAY'S LOG · 1 ITEM")).toBeVisible();
    await openEditor(page);

    // "pre-filled with the current values" — every field, not just the one being changed.
    await expect(field(page, "NAME")).toHaveValue("Chicken and rice");
    await expect(field(page, "KCAL")).toHaveValue("620");
    await expect(field(page, "P (g)")).toHaveValue("45");
    await expect(field(page, "C (g)")).toHaveValue("70");
    await expect(field(page, "F (g)")).toHaveValue("14");

    // "in place ... no separate modal or screen". Two halves: the editor is INSIDE the log card,
    // and nothing full-screen has opened over the dashboard.
    await expect(logCard(page).locator('label:text-is("KCAL")')).toBeVisible();
    await expect(consumed(page)).toBeVisible();
    const overlays = await page.evaluate(() => [...document.querySelectorAll("#root *")]
      .filter(el => getComputedStyle(el).position === "fixed" &&
                    el.getBoundingClientRect().height > 300).length);
    expect(overlays).toBe(0);

    await shot(page, "entry-editor-open");
  });

  test("editing values and saving updates the entry, the totals, and the record", async ({ page }) => {
    await open(page, { logs: [ENTRY] });
    await expect(consumed(page)).toContainText("620");

    await openEditor(page);
    await field(page, "KCAL").fill("450");
    await field(page, "P (g)").fill("30");
    await field(page, "C (g)").fill("50");
    await field(page, "F (g)").fill("10");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    // The row shows the new values. Scoped to the card: a bare "450" also appears in the header.
    await expect(logCard(page).getByText("450", { exact: true })).toBeVisible();
    await expect(logCard(page).getByText(/P:30g C:50g F:10g/)).toBeVisible();

    // "the day's totals recalculate immediately"
    await expect(consumed(page)).toContainText("450");

    await shot(page, "entry-editor-saved");

    // "the change persists after reload". The seeder latches on sessionStorage, so the reload
    // reads what the app actually wrote rather than the fixture being laid down again.
    await page.reload();
    await expect(page.getByText("TODAY'S LOG · 1 ITEM")).toBeVisible();
    await expect(logCard(page).getByText("450", { exact: true })).toBeVisible();
    await expect(consumed(page)).toContainText("450");
  });

  test("cancelling leaves the entry exactly as it was", async ({ page }) => {
    await open(page, { logs: [ENTRY] });
    await openEditor(page);

    await field(page, "KCAL").fill("9999");
    await field(page, "P (g)").fill("1");
    await page.getByRole("button", { name: "Cancel", exact: true }).click();

    // The editor closes...
    await expect(page.locator('label:text-is("KCAL")')).toHaveCount(0);
    // ...and nothing it held was kept — neither in the row nor in the totals.
    await expect(logCard(page).getByText("620", { exact: true })).toBeVisible();
    await expect(logCard(page).getByText(/P:45g C:70g F:14g/)).toBeVisible();
    await expect(consumed(page)).toContainText("620");
    await expect(page.getByText("9999")).toHaveCount(0);
  });

  // The next two are a matched pair, and the only difference between them is the AI's confidence.
  // Open Food Facts answers in BOTH — with the same fixture — so what is being tested is that the
  // confidence comparison decides the winner. Aborting OFF in one of them would prove only that a
  // silent third party changes nothing, which is not the claim.
  test("premium: AI re-estimate refills the macros from the corrected name", async ({ page }) => {
    await open(page, { premium: true, logs: [ENTRY] });
    // Confidence 99 outranks Open Food Facts' fixed 98, so the AI figure is the one that stands.
    await stubAI(page,
      { name: "Chicken thigh and rice", kcal: 815, protein: 52, carbs: 71, fat: 33,
        confidence: 99, reasoning: "e2e fixture" },
      OFT_FIXTURE);

    await openEditor(page);
    await field(page, "NAME").fill("Chicken thigh and rice");
    await page.getByRole("button", { name: /AI re-estimate from name/ }).click();

    await expect(page.getByRole("button", { name: /Updated — re-estimate again/ }))
      .toBeVisible({ timeout: 15_000 });
    await expect(field(page, "KCAL")).toHaveValue("815");
    await expect(field(page, "P (g)")).toHaveValue("52");
    await expect(field(page, "F (g)")).toHaveValue("33");
    // OFF answered and was refused. Give it room to arrive late — asserting an absence
    // immediately would pass simply because the response had not landed yet.
    await page.waitForTimeout(1000);
    await expect(field(page, "KCAL")).toHaveValue("815");
    // The correction is kept — re-estimating must not overwrite the name it was asked about.
    await expect(field(page, "NAME")).toHaveValue("Chicken thigh and rice");

    await shot(page, "entry-editor-reestimated");

    // "I can still review the values before saving" — the new numbers are in the editor only.
    // The row itself is not on screen to check: it is REPLACED by the editor while editing
    // (app.jsx:3605), so the day's total and the stored record are what carry the assertion.
    await expect(consumed(page)).toContainText("620");
    expect(await storedKcal(page)).toBe(620);

    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(logCard(page).getByText("815", { exact: true })).toBeVisible();
    await expect(consumed(page)).toContainText("815");
  });

  test("premium: an Open Food Facts match overrides the AI when it is more confident", async ({ page }) => {
    await open(page, { premium: true, logs: [ENTRY] });
    // Same OFF fixture as above; only the AI's confidence has moved, from 99 to 60.
    await stubAI(page,
      { name: "Beef lasagne", kcal: 815, protein: 52, carbs: 71, fat: 33, confidence: 60,
        reasoning: "e2e fixture" },
      OFT_FIXTURE);

    await openEditor(page);
    await field(page, "NAME").fill("Beef lasagne");
    await page.getByRole("button", { name: /AI re-estimate from name/ }).click();

    // The AI answer is shown first and OFF refines it in the background, so wait for the
    // override rather than asserting on whatever happens to be on screen at this instant.
    await expect(field(page, "KCAL")).toHaveValue("415", { timeout: 15_000 });
    await expect(field(page, "P (g)")).toHaveValue("21");
    await expect(field(page, "C (g)")).toHaveValue("39");
    await expect(field(page, "F (g)")).toHaveValue("19");
  });

  test("anonymous: re-estimate raises the premium gate, and manual editing still works", async ({ page }) => {
    await open(page, { logs: [ENTRY] });
    await openEditor(page);

    await page.getByRole("button", { name: /AI re-estimate from name/ }).click();

    await expect(page.getByText("PREMIUM FEATURE")).toBeVisible();
    await expect(page.getByText("AI re-estimate", { exact: true })).toBeVisible();

    await shot(page, "entry-editor-premium-gate");

    // "the manual fields remain editable without premium" — the gate is on the AI button alone.
    await page.getByRole("button", { name: "Maybe Later" }).click();
    await field(page, "KCAL").fill("500");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(logCard(page).getByText("500", { exact: true })).toBeVisible();
    await expect(consumed(page)).toContainText("500");
  });
});
