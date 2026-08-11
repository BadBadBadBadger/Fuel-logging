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
/**
 * Generate a weigh-in series in the page, relative to its own today.
 *   { days: 21, startWeight: 98, perDay: 0.05 }  → 21 daily entries, rising
 *   { days: 24, startWeight: 98, perDay: 0 }     → flat, which reads as a stall
 * Built in-page rather than in Node so the dates track the simulated clock, and so a run
 * that crosses midnight can't seed a series that ends yesterday.
 */
async function seed(page, { profile, cutBlock, mode, weighIns, weighInsSpec, dayOffset, premium,
    meals, history, extra } = {}) {
  await page.addInitScript(
    ({ profile, cutBlock, mode, weighIns, weighInsSpec, dayOffset, premium, meals, history, extra,
       keyExpr }) => {
      // Seed ONCE per page context, not once per navigation. addInitScript re-runs on every
      // load, so without this guard a page.reload() would clear storage and re-apply the seed —
      // silently undoing whatever the test just did, and making "does it survive a reload?"
      // impossible to ask. sessionStorage is the right latch: it survives reload, and
      // localStorage.clear() does not touch it.
      if (sessionStorage.getItem("__fuel_seeded")) return;
      sessionStorage.setItem("__fuel_seeded", "1");

      localStorage.clear();
      if (dayOffset) localStorage.setItem("dev_date_offset", String(dayOffset));
      const todayKey = eval(keyExpr);

      if (profile) localStorage.setItem("profile", JSON.stringify(profile));
      if (meals)   localStorage.setItem("meals", JSON.stringify(meals));
      if (history) localStorage.setItem("history", JSON.stringify(history));
      if (extra)   for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
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
      if (weighInsSpec) {
        const { days, startWeight, perDay } = weighInsSpec;
        const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
        const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
          "-" + String(d.getDate()).padStart(2, "0");
        const series = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(Date.now() + off * 86400000 - i * 86400000);
          series.push({ date: fmt(d), weight: Math.round((startWeight + (days - 1 - i) * perDay) * 100) / 100 });
        }
        localStorage.setItem("weighins", JSON.stringify(series));
      }

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
    { profile, cutBlock, mode, weighIns, weighInsSpec, dayOffset, premium, meals, history, extra,
      keyExpr: TODAY_KEY_EXPR }
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
