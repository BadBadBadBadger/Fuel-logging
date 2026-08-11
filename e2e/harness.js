// Shared setup for the UI suite — everything that talks to preview.html lives here.
//
// The harness is what makes these tests possible at all: it bridges window.storage to
// localStorage and fakes the calendar through a plain `dev_date_offset` integer, so the
// time-dependent energy-safety surfaces (cut blocks, the drain, the stall) are reachable
// without weeks of real history.

const { expect } = require("@playwright/test");

// The app keys the day from LOCAL date parts (app.jsx:214), NOT toISOString(), which is UTC.
// Under BST those disagree between 00:00 and 00:59 — a seeded `mode__<key>` would land on the
// wrong day and the test would pass against a screen that was never configured. Compute it the
// app's way, in the page.
const TODAY_KEY_EXPR = `(() => {
  const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
  const d = new Date(Date.now() + off * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
})()`;

const PROFILE = { weight: 98.5, height: 178, bodyFat: 22, activity: "light", sex: "male" };

/**
 * Date sentinels substituted in the page when seeding a cut_block:
 *   "@today"  → today's key
 *   "@-70d"   → 70 days before today
 * Relative dates keep week counts deterministic — a hard-coded start date would make
 * "CUTTING · WEEK 10" drift by one every seven days and fail on an arbitrary Tuesday.
 */
const TODAY = "@today";
const daysAgo = n => `@-${n}d`;

/**
 * Seed localStorage before any app script runs. addInitScript is essential — the app reads
 * storage in its first effect, so seeding after load would race it.
 */
async function seed(page, { profile, cutBlock, mode, weighIns, dayOffset, premium } = {}) {
  await page.addInitScript(
    ({ profile, cutBlock, mode, weighIns, dayOffset, premium, keyExpr }) => {
      localStorage.clear();
      if (dayOffset) localStorage.setItem("dev_date_offset", String(dayOffset));
      const todayKey = eval(keyExpr);

      if (profile) localStorage.setItem("profile", JSON.stringify(profile));
      if (cutBlock) {
        // Pin accrual to today, or the daily accrual effect advances the very state under test.
        const b = { ...cutBlock };
        const key = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
          "-" + String(d.getDate()).padStart(2, "0");
        for (const k of Object.keys(b)) {
          if (b[k] === "@today") { b[k] = todayKey; continue; }
          const rel = typeof b[k] === "string" && b[k].match(/^@-(\d+)d$/);
          if (rel) {
            const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
            b[k] = key(new Date(Date.now() + off * 86400000 - rel[1] * 86400000));
          }
        }
        localStorage.setItem("cut_block", JSON.stringify(b));
      }
      if (mode)     localStorage.setItem("mode__" + todayKey, mode);
      if (weighIns) localStorage.setItem("weighins", JSON.stringify(weighIns));

      // Mirrors the harness's 🔓 Premium button. id:null keeps every sync path in app.jsx
      // dormant, so a test can never write to or overwrite real Supabase rows.
      //
      // Pass an object instead of `true` to override the user — only the sync-guard tests need
      // that, to carry a real-looking id so a sync actually fires and the guard is what stops it.
      if (premium) {
        localStorage.setItem("auth_state", "premium");
        localStorage.setItem("auth_user", JSON.stringify(
          typeof premium === "object" ? premium : {
            id: null, name: "Dev Preview", email: "dev@localhost", picture: "",
            grantedBy: "dev-harness", subExpiry: null, since: Date.now(),
          }));
        localStorage.setItem("health_consent", JSON.stringify({
          version: "1.2", policyVersion: "1.2",
          agreedAt: new Date().toISOString(), source: "dev-harness",
        }));
      }
    },
    { profile, cutBlock, mode, weighIns, dayOffset, premium, keyExpr: TODAY_KEY_EXPR }
  );
}

/** Seed, open the harness, and wait for the app to actually render. */
async function open(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html");
  await expect(page.locator("#root")).toBeVisible({ timeout: 15_000 });
}

/** The app's own stored mode for today — the promise a mode-changing button makes. */
async function storedMode(page) {
  return page.evaluate(keyExpr => localStorage.getItem("mode__" + eval(keyExpr)), TODAY_KEY_EXPR);
}

module.exports = { seed, open, storedMode, PROFILE, TODAY, daysAgo, TODAY_KEY_EXPR };
