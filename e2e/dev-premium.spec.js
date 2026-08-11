// The harness's dev premium unlock — does it actually open the gate, and does it stay local?
//
// The unlock exists so premium UI can be looked at (and driven) without a Google sign-in. Two
// things must hold, and the second matters more than the first: it must unlock the interface,
// and it must not touch the cloud. Entitlement is server-authoritative, so this is a view of
// the premium UI, never a premium account — worker-backed calls are still refused, correctly.

const { test, expect } = require("@playwright/test");
const { open } = require("./harness");

test.describe("Dev premium unlock", () => {
  test("locked: a gated feature raises the premium modal", async ({ page }) => {
    await open(page, { premium: false });
    await page.getByRole("button", { name: /Paste log/ }).click();

    await expect(page.getByText("PREMIUM FEATURE")).toBeVisible();
    // The name appears twice in the modal — as its title and again in the feature list below.
    await expect(page.getByText("Workout AI Parser").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/premium-locked.png" });
  });

  test("unlocked: the same feature opens straight up, no sign-in", async ({ page }) => {
    await open(page, { premium: true });
    await page.getByRole("button", { name: /Paste log/ }).click();

    await expect(page.getByText("PREMIUM FEATURE")).toHaveCount(0);
    await expect(page.getByText("AI features require a Premium account")).toHaveCount(0);
    await page.screenshot({ path: "e2e/screenshots/premium-unlocked.png" });
  });

  test("the unlock never reaches Supabase", async ({ page }) => {
    // id:null is what guarantees this — every sync path in app.jsx is guarded on authUser?.id.
    // If that guard is ever loosened, this test fails before real rows get overwritten.
    const calls = [];
    await page.route("**/rest/v1/**", route => { calls.push(route.request().url()); route.abort(); });

    await open(page, { premium: true });
    await page.waitForTimeout(1500);

    expect(calls).toEqual([]);
  });
});
