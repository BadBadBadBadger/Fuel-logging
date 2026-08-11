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
    meals, history, historySpec, extra } = {}) {
  await page.addInitScript(
    ({ profile, cutBlock, mode, weighIns, weighInsSpec, dayOffset, premium, meals, history, historySpec, extra,
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
      // Daily snapshots of logged intake. runCalibration needs at least FOUR days with kcal > 0
      // in the last seven or it returns null before measuring anything (app.jsx:489) — so without
      // this runCalibration returns null and any test of it passes vacuously. `mode` per day is
      // also what runCalibration counts to decide whether the user was cutting (app.jsx:529): it
      // sets refused:true when a downward adjustment coincides with a majority of cut days.
      if (historySpec) {
        const { days, kcal, mode: dayMode = "cut", endDaysAgo = 0 } = historySpec;
        const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
        const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
          "-" + String(d.getDate()).padStart(2, "0");
        const snaps = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(Date.now() + off * 86400000 - (i + endDaysAgo) * 86400000);
          const date = fmt(d);
          snaps.push({ date, mode: dayMode, kcal, protein: 180, carbs: 200, fat: 70,
            training: false, water: 6, logs: [] });
          localStorage.setItem("mode__" + date, dayMode);
        }
        localStorage.setItem("history", JSON.stringify(snaps));
      }
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
        // endDaysAgo shifts the whole series back. Use 1 when the test needs to LOG a weigh-in:
        // the widget hides its input once today already has an entry (`todayEntry`, app.jsx:2512),
        // which is correct behaviour and makes the field unfillable if the series ends today.
        const { days, startWeight, perDay, endDaysAgo = 0 } = weighInsSpec;
        const off = parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
        const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
          "-" + String(d.getDate()).padStart(2, "0");
        const series = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(Date.now() + off * 86400000 - (i + endDaysAgo) * 86400000);
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
    { profile, cutBlock, mode, weighIns, weighInsSpec, dayOffset, premium, meals, history, historySpec, extra,
      keyExpr: TODAY_KEY_EXPR }
  );
}

/** Seed, open the harness, and wait for the app to actually render. */
async function open(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html");
  await expect(page.locator("#root")).toBeVisible({ timeout: 15_000 });
}

/**
 * Screenshot the phone, not the page.
 *
 * A plain page.screenshot() captures the whole harness viewport: the phone sits in the top-left
 * and the rest is flat background. Targeting the .phone element crops to the device.
 *
 * `full: true` first stretches #app-shell to its own scrollHeight, so content below the fold is
 * captured in one image instead of being clipped at 844px — then puts the height back. That is
 * what makes a whole dashboard (trend chart, target, cards) legible in a single shot.
 */
async function shot(page, name, { full = true } = {}) {
  let restore = null;
  if (full) {
    restore = await page.evaluate(() => {
      const shell = document.getElementById("app-shell");
      if (!shell) return null;
      const prev = { height: shell.style.height, overflow: shell.style.overflowY };

      // Two passes. Stretch to scrollHeight first so everything lays out, THEN measure where the
      // content actually ends and shrink to that. scrollHeight alone trails a long band of empty
      // background, because the app's containers keep filling the space they're given.
      shell.style.overflowY = "visible";
      shell.style.height = shell.scrollHeight + "px";

      // Measure only elements that actually RENDER something — leaves carrying text, and images.
      // Measuring every element instead catches the empty log container, which stretches to fill
      // whatever height it is given, so the crop never tightens no matter how tall the shell is.
      const top = shell.getBoundingClientRect().top;
      const bottom = [...shell.querySelectorAll("*")].reduce((max, el) => {
        const paints = (el.childElementCount === 0 && el.textContent.trim() !== "") ||
                       el.tagName === "IMG" || el.tagName === "SVG" || el.tagName === "CANVAS";
        if (!paints) return max;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 ? Math.max(max, r.bottom) : max;
      }, 0);
      if (bottom > top) shell.style.height = Math.ceil(bottom - top + 40) + "px";
      return prev;
    });
  }
  await page.locator(".phone").screenshot({ path: `e2e/screenshots/${name}.png` });
  if (restore) {
    await page.evaluate(prev => {
      const shell = document.getElementById("app-shell");
      if (shell) { shell.style.height = prev.height; shell.style.overflowY = prev.overflow; }
    }, restore);
  }
}

/** The app's own stored mode for today — the promise a mode-changing button makes. */
async function storedMode(page) {
  return page.evaluate(keyExpr => localStorage.getItem("mode__" + eval(keyExpr)), TODAY_KEY_EXPR);
}

/**
 * Install a recording stand-in for the Supabase client, capturing the FULL call chain —
 * table, method, and arguments — not merely which tables were touched.
 *
 * This matters, and the limit matters more. Recording table names alone would pass if the app
 * called select() where delete() was meant, or filtered on the wrong column. Recording the chain
 * proves the app *asked for the right thing*. It cannot prove Supabase would honour it: schema,
 * column names and RLS are not testable from here, by anything, ever. That last mile is a one-time
 * check on a real device — see DEVICE-TEST.md.
 *
 * Install AFTER the page has loaded, so the startup pull doesn't pollute the record.
 */
async function installSbRecorder(page) {
  await page.evaluate(() => {
    window.__sbCalls = [];
    window.supabaseClient = {
      from(table) {
        const call = { table, ops: [] };
        window.__sbCalls.push(call);
        const rec = name => (...args) => {
          call.ops.push({ op: name, args: args.map(a => (typeof a === "object" ? "[obj]" : a)) });
          return builder;
        };
        const builder = {
          delete: rec("delete"), upsert: rec("upsert"), insert: rec("insert"),
          update: rec("update"), select: rec("select"), eq: rec("eq"),
          order: rec("order"), maybeSingle: rec("maybeSingle"),
          // Thenable, so `await sb().from(t).delete().eq(...)` resolves like the real client.
          then: resolve => resolve({ data: [], error: null }),
        };
        return builder;
      },
      auth: { signOut: async () => ({}) },
    };
  });
}

const sbCalls = page => page.evaluate(() => window.__sbCalls);

/** Calls against one table, e.g. sbCallsFor(page, "meal_library"). */
const sbCallsFor = async (page, table) =>
  (await sbCalls(page)).filter(c => c.table === table);

module.exports = { seed, open, storedMode, shot, installSbRecorder, sbCalls, sbCallsFor,
  PROFILE, TODAY, daysAgo, TODAY_KEY_EXPR };
