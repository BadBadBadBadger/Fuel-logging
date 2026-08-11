// Quick Add — the v68 fix, at the UI layer.
//
// Shipped 2026-08-11 with Jest coverage of the merge logic only; nothing verified the screen.
// Three behaviours matter here:
//   1. The "Reset to defaults" button is gone. It overwrote the whole list on one tap, no confirm.
//   2. Deleting a meal actually removes it — locally AND in the cloud. syncMeals only ever upserts,
//      so before the fix a deleted meal stayed in meal_library and returned on the next pull.
//   3. The one-time revive puts back what the reset wiped, and never runs twice.

const { test, expect } = require("@playwright/test");
const { open, installSbRecorder, sbCallsFor, PROFILE } = require("./harness");

const CUSTOM = [
  { name: "Nan's lasagne", kcal: 640, protein: 38, carbs: 52, fat: 30 },
  { name: "Flat white",    kcal: 120, protein: 6,  carbs: 10, fat: 6  },
];

const PREMIUM_WITH_ID = {
  id: "00000000-0000-4000-8000-00000000beef", name: "Sync Probe", email: "probe@localhost",
  picture: "", grantedBy: "e2e", subExpiry: null, since: 0,
};

/**
 * Seed a meal library and open the Quick Add screen. Everything goes through open()'s init
 * script: it re-runs (and re-clears) on every navigation, so state written from the test body
 * would not survive the reloads these tests depend on.
 */
async function openQuickAdd(page, { meals, premium, history, skipRevive = true } = {}) {
  await open(page, {
    profile: PROFILE, premium, meals, history,
    extra: skipRevive ? { qa_revive_v68: "1" } : undefined,
  });
  await gotoQuickAdd(page);
}

async function gotoQuickAdd(page) {
  await page.getByRole("button", { name: /QUICK ADD/ }).click();
  await expect(page.getByPlaceholder("Search meals...")).toBeVisible();
}

/** Scope assertions to the app, not the page — the harness toolbar has its own buttons. */
const app = page => page.locator("#root");

test.describe("Quick Add", () => {
  test("the 'Reset to defaults' button is gone", async ({ page }) => {
    await openQuickAdd(page, { meals: CUSTOM });

    // One tap, no confirm, whole list replaced. It must not come back.
    // Scoped to #root: the harness's own dev panel has a "Reset to Today" button, and an
    // unscoped /Reset/i match picks that up and fails for the wrong reason.
    await expect(app(page).getByText(/Reset to defaults/i)).toHaveCount(0);
    await expect(app(page).getByRole("button", { name: /Reset/i })).toHaveCount(0);

    await page.screenshot({ path: "e2e/screenshots/quick-add-no-reset.png" });
  });

  test("a custom meal list renders, and delete removes it for good", async ({ page }) => {
    await openQuickAdd(page, { meals: CUSTOM });

    await expect(page.getByText("Nan's lasagne")).toBeVisible();
    await expect(page.getByText("Flat white")).toBeVisible();

    // The bin on the lasagne row. Rows carry ✏️ then 🗑️.
    await page.getByRole("button", { name: "🗑️" }).first().click();
    await expect(page.getByText("Nan's lasagne")).toHaveCount(0);

    // It must not come back on reload — the local write has to have landed.
    await page.reload();
    await gotoQuickAdd(page);
    await expect(page.getByText("Flat white")).toBeVisible();
    await expect(page.getByText("Nan's lasagne")).toHaveCount(0);
  });

  test("deleting a meal asks the cloud to delete that exact row", async ({ page }) => {
    // The v68 bug: syncMeals only upserts, so a delete never propagated and the meal came back on
    // the next pull. This asserts the app issues a DELETE filtered by user and by the meal's name —
    // not merely that it touched the table. What it cannot prove is that Supabase honours it; that
    // is a one-time device check (DEVICE-TEST.md, "Renaming and deleting stick").
    await openQuickAdd(page, { meals: CUSTOM, premium: PREMIUM_WITH_ID });
    await installSbRecorder(page);

    await page.getByRole("button", { name: "🗑️" }).first().click();
    await page.waitForTimeout(800);

    const calls = await sbCallsFor(page, "meal_library");
    expect(calls.length).toBeGreaterThan(0);

    const del = calls.find(c => c.ops.some(o => o.op === "delete"));
    expect(del, "expected a delete against meal_library").toBeTruthy();

    const filters = del.ops.filter(o => o.op === "eq").map(o => o.args);
    expect(filters).toContainEqual(["user_id", PREMIUM_WITH_ID.id]);
    expect(filters).toContainEqual(["name", "Nan's lasagne"]);
  });

  test("renaming a meal deletes the row under the old name", async ({ page }) => {
    // Without this the rename writes a NEW row and leaves the old one behind, so the next cloud
    // pull hands back both and one rename becomes two meals.
    await openQuickAdd(page, { meals: CUSTOM, premium: PREMIUM_WITH_ID });
    await installSbRecorder(page);

    await page.getByRole("button", { name: "✏️" }).first().click();
    const nameField = page.getByPlaceholder("e.g. Chicken breast (150g)");
    await expect(nameField).toHaveValue("Nan's lasagne");
    await nameField.fill("Mum's lasagne");
    await page.getByRole("button", { name: "SAVE CHANGES" }).click();

    await expect(page.getByText("Mum's lasagne")).toBeVisible();
    await expect(page.getByText("Nan's lasagne")).toHaveCount(0);
    await page.waitForTimeout(800);

    const calls = await sbCallsFor(page, "meal_library");
    const del = calls.find(c => c.ops.some(o => o.op === "delete"));
    expect(del, "expected the old name to be deleted on rename").toBeTruthy();

    const filters = del.ops.filter(o => o.op === "eq").map(o => o.args);
    expect(filters).toContainEqual(["name", "Nan's lasagne"]);
    // And emphatically NOT the new one.
    expect(filters).not.toContainEqual(["name", "Mum's lasagne"]);
  });

  test("editing a meal WITHOUT renaming deletes nothing", async ({ page }) => {
    // The control. If a plain edit also fired a delete, the meal would vanish from the cloud and
    // the rename test above would pass for the wrong reason.
    await openQuickAdd(page, { meals: CUSTOM, premium: PREMIUM_WITH_ID });
    await installSbRecorder(page);

    await page.getByRole("button", { name: "✏️" }).first().click();
    // exact:true is load-bearing. getByPlaceholder substring-matches, and the name field's
    // placeholder is "e.g. Chicken breast (150g)" — which contains a "0", so .first() grabs the
    // NAME input and this "plain edit" silently becomes a rename to "700".
    await page.getByPlaceholder("0", { exact: true }).first().fill("700");
    await page.getByRole("button", { name: "SAVE CHANGES" }).click();
    await page.waitForTimeout(800);

    const calls = await sbCallsFor(page, "meal_library");
    expect(calls.some(c => c.ops.some(o => o.op === "delete"))).toBe(false);
  });
});

test.describe("The one-time revive", () => {
  test("rebuilds the list from logged history when there is no cloud copy", async ({ page }) => {
    // The harness has no Supabase client, so the revive falls through to the history sweep —
    // exactly the path a non-premium user takes.
    const history = [
      { date: "2026-08-01", logs: [{ id: 1, name: "Nan's lasagne", kcal: 640, protein: 38, carbs: 52, fat: 30 }] },
      { date: "2026-08-02", logs: [{ id: 2, name: "Airport sandwich", kcal: 450, protein: 20, carbs: 40, fat: 20 }] },
      { date: "2026-08-03", logs: [{ id: 3, name: "Nan's lasagne", kcal: 640, protein: 38, carbs: 52, fat: 30 }] },
    ];
    await openQuickAdd(page, { meals: [], history, skipRevive: false });

    await expect(page.getByText("Nan's lasagne")).toBeVisible();
    await expect(page.getByText("Airport sandwich")).toBeVisible();
    // Deduped by name — logged twice, listed once.
    await expect(page.getByText("Nan's lasagne")).toHaveCount(1);
  });

  test("it marks itself done and never runs a second time", async ({ page }) => {
    const history = [
      { date: "2026-08-01", logs: [{ id: 1, name: "Nan's lasagne", kcal: 640, protein: 38, carbs: 52, fat: 30 }] },
      { date: "2026-08-02", logs: [{ id: 2, name: "Flat white", kcal: 120, protein: 6, carbs: 10, fat: 6 }] },
      { date: "2026-08-03", logs: [{ id: 3, name: "Porridge", kcal: 300, protein: 10, carbs: 50, fat: 6 }] },
    ];
    await openQuickAdd(page, { meals: [], history, skipRevive: false });
    await expect(page.getByText("Nan's lasagne")).toBeVisible();

    expect(await page.evaluate(() => localStorage.getItem("qa_revive_v68"))).toBe("1");

    // Delete one, reload: the revive must NOT resurrect it. This is the whole point of the
    // one-shot flag — without it the recovery would fight the user's own deletions forever.
    await page.getByRole("button", { name: "🗑️" }).first().click();
    await page.reload();
    await gotoQuickAdd(page);

    await expect(page.getByText("Nan's lasagne")).toHaveCount(0);
  });
});
