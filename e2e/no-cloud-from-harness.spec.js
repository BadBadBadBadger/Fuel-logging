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

  // A genuine differential for the app.jsx backstop. A live client IS installed in both cases and
  // a real sync IS triggered; the only variable is whether the clock is faked. Without the guard in
  // sb(), the faked-clock case would write — which is precisely the incident.
  //
  // Premium here carries a real-looking id on purpose: id:null would stop the sync on its own and
  // the test would pass for the wrong reason.
  const PREMIUM_WITH_ID = {
    id: "00000000-0000-4000-8000-00000000dead", name: "Sync Probe", email: "probe@localhost",
    picture: "", grantedBy: "e2e", subExpiry: null, since: 0,
  };

  async function armSyncProbe(page, dayOffset) {
    // Must go through open()'s seeder: its init script calls localStorage.clear(), so anything
    // written by an earlier addInitScript is wiped before the app ever reads it.
    await open(page, { premium: PREMIUM_WITH_ID, dayOffset, mode: "cut" });

    // Install a recording stand-in AFTER load, so the initial pull doesn't pollute the record.
    await page.evaluate(() => {
      window.__sbCalls = [];
      const chain = () => new Proxy(() => chain(), {
        get: () => chain(),
        apply: () => chain(),
      });
      window.supabaseClient = {
        from: table => { window.__sbCalls.push(table); return chain(); },
        auth: { signOut: async () => ({}) },
      };
    });

    // Water + → saveWater → syncWater (app.jsx:5209). A one-tap, always-present sync trigger.
    await page.getByRole("button", { name: "+", exact: true }).first().click();
    await page.waitForTimeout(1000);
    return page.evaluate(() => window.__sbCalls);
  }

  test("with a real clock, a sync genuinely fires — the recorder captures it", async ({ page }) => {
    const calls = await armSyncProbe(page, 0);
    expect(calls).toContain("water_logs");
  });

  test("with a faked clock, the identical action reaches nothing", async ({ page }) => {
    const calls = await armSyncProbe(page, 30);
    expect(calls).toEqual([]);
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
