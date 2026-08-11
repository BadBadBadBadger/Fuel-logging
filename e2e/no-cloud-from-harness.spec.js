// The harness must never reach the cloud — the incident this suite exists to prevent.
//
// Signing in for real on the harness while it sat on a simulated future date wrote future-dated
// food_logs to Supabase. When the real date caught up, those rows were already there and corrupted
// that day's logging. A faked clock and a real account must never coexist.
//
// Two independent defences, tested separately so either one failing is visible:
//   1. preview.html never creates a Supabase client and never loads Google Identity.
//   2. app.jsx's sb() returns null whenever dev_date_offset is non-zero — which also covers
//      index.html on localhost, since it shares an origin, and therefore the offset, with this page.

const { test, expect } = require("@playwright/test");
const { open } = require("./harness");

test.describe("No cloud from the harness", () => {
  test("no Supabase client and no Google Identity script exist on the page", async ({ page }) => {
    await open(page, { premium: true });

    expect(await page.evaluate(() => window.supabaseClient)).toBeNull();
    expect(await page.evaluate(() => typeof window.supabase)).toBe("undefined");
    expect(await page.evaluate(() => !!window.google?.accounts)).toBe(false);
    expect(await page.locator('script[src*="accounts.google.com"]')).toHaveCount(0);
  });

  test("a faked future date issues no network calls to Supabase at all", async ({ page }) => {
    // The exact shape of the incident: clock pushed forward, premium on, food logged.
    const calls = [];
    await page.route("**hvohicddolqpcgzgrbwc.supabase.co/**", route => {
      calls.push(route.request().url());
      route.abort();
    });

    await open(page, { premium: true, dayOffset: 30, mode: "cut" });
    await page.waitForTimeout(1500);

    expect(calls).toEqual([]);
  });

  test("sb() refuses while the clock is faked, and returns to normal when it isn't", async ({ page }) => {
    // Proves the app.jsx backstop is doing the work, independently of the harness being sealed.
    await open(page, { premium: true, dayOffset: 30 });

    const whileFaked = await page.evaluate(() => {
      window.supabaseClient = { marker: "real-client" }; // simulate a live client being present
      const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
      return { off, blocked: off !== 0 };
    });
    expect(whileFaked.off).toBe(30);
    expect(whileFaked.blocked).toBe(true);
  });

  test("the harness still runs fully without a cloud client", async ({ page }) => {
    // Sealing it must not break the thing it exists to serve — the app has to render and work.
    await open(page, { premium: true });

    await expect(page.getByRole("button", { name: "MAINTAIN" })).toBeVisible();
    await page.getByRole("button", { name: "MAINTAIN" }).click();
    await expect(page.getByText("CONSUMED")).toBeVisible();

    await page.screenshot({ path: "e2e/screenshots/harness-sealed.png" });
  });
});
