// A diet break for a SYNCED (premium) user, across several real mornings.
//
// Why this file exists: two bugs kept a founder's break at "ON A BREAK · STARTING TODAY" for ten
// days, and neither was visible to a single-page-load test.
//   1. A new day had no stored mode and opened in Cut, so the day's one accrual counted a cut day
//      and reset the break (fixed 2026-10-11).
//   2. The startup cloud pull reads the profiles row BEFORE that accrual and used to land AFTER
//      it, replacing the day just accrued with the cloud's copy from the day before (2026-10-12).
// Both only show up across launches, against a cloud that remembers what the app wrote. So this
// drives the real app through consecutive mornings — the clock moves a day, the page reloads, and
// local storage carries over exactly as it does on a phone — against a stateful stand-in for
// Supabase. A read sees the row as it was when the request was MADE and arrives 400 ms later; a
// write applies when it is made. That ordering is the race, reproduced rather than assumed.

const { test, expect } = require("@playwright/test");
const { open, PROFILE } = require("./harness");

const UID = "u1";

/** Replace window.supabaseClient with a fake whose state lives in sessionStorage, so it survives
 *  page.reload() the way a real account survives closing the app. Not cleared by the harness's
 *  localStorage.clear(), and seeded only once per context. */
async function installFakeCloud(page, seedCloud) {
  await page.addInitScript(seed => {
    const KEY = "__fake_cloud";
    if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(seed));
    const db  = () => JSON.parse(sessionStorage.getItem(KEY));
    const put = d => sessionStorage.setItem(KEY, JSON.stringify(d));
    const keyOf = (t, r) => (t === "profiles" || t === "settings" ? [r.id]
      : [r.user_id, r.date, r.entry_id, r.badge_key, r.name]).join("|");
    const fake = {
      from(table) {
        const q = { op: "select", single: false, payload: null };
        const b = {
          select: () => b, eq: () => b, order: () => b, in: () => b, neq: () => b, gte: () => b, lte: () => b,
          upsert: p => { q.op = "upsert"; q.payload = p; return b; },
          insert: p => { q.op = "upsert"; q.payload = p; return b; },
          update: () => { q.op = "noop"; return b; },
          delete: () => { q.op = "noop"; return b; },
          maybeSingle: () => { q.single = true; return b; },
          single: () => { q.single = true; return b; },
          then(resolve, reject) {
            const d = db();
            let result = { data: null, error: null };
            if (q.op === "upsert") {
              const rows = Array.isArray(q.payload) ? q.payload : [q.payload];
              const tbl = d[table] || [];
              for (const r of rows) {
                const i = tbl.findIndex(x => keyOf(table, x) === keyOf(table, r));
                if (i >= 0) tbl[i] = { ...tbl[i], ...r }; else tbl.push({ ...r });
              }
              d[table] = tbl;
              put(d);                                   // a write lands when it is made
            } else if (q.op === "select") {
              const rows = JSON.parse(JSON.stringify(d[table] || []));   // a read sees NOW
              rows.sort((x, y) => String(x.date || "").localeCompare(String(y.date || "")));
              result = { data: q.single ? (rows[0] || null) : rows, error: null };
            }
            const ms = q.op === "select" ? 400 : 50;    // ...and its answer arrives later
            return new Promise(r => setTimeout(r, ms)).then(() => result).then(resolve, reject);
          },
        };
        return b;
      },
      auth: { signOut: async () => ({}) },
    };
    Object.defineProperty(window, "supabaseClient", { get: () => fake, set: () => {}, configurable: true });
  }, seedCloud);
}

const snapRow = (date, mode) => ({
  user_id: UID, date, mode, kcal: mode === "cut" ? 2300 : 2800, protein: 160, carbs: 250, fat: 70,
  training: false, water: 6, target_kcal: mode === "cut" ? 2270 : 2770, target_protein: 157,
  target_fat: 79, target_fat_floor: 59, floored: false, workout_bonus: 0,
});

/** What the break card says right now, once the startup pull and the day's accrual have
 *  landed: its label, the days-left line, and how full the bar is drawn. */
const readBar = async page => {
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);   // well past the 400 ms pull and the accrual behind it
  if (await page.getByText("RECHARGED", { exact: true }).count()) return "RECHARGED";
  const bar = page.getByText(/^(ON A BREAK · (DAY \d+|STARTING TODAY)|CUTTING · WEEK \d+)$/);
  const label = await bar.textContent();
  const left  = await page.getByText(/about \d+ days? to fully recharged/).textContent().catch(() => "");
  const width = await bar.evaluate(el => {
    const fill = el.parentElement.parentElement.querySelector('div[style*="height: 6px"] > div');
    return fill ? fill.style.width : "?";
  });
  return `${label}${left ? " | " + left : ""} | bar ${width}`;
};

test.describe("A synced user's diet break, morning after morning", () => {
  test("the break counts up one day per morning and the bar drains", async ({ page }) => {
    // Seven weeks of cutting ended on 1 Oct with 33 load-days banked; Maintain from 2 Oct.
    const cutDays = ["2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01"];
    await installFakeCloud(page, {
      profiles: [{ id: UID, weight: PROFILE.weight, height: PROFILE.height, body_fat: PROFILE.bodyFat,
        sex: PROFILE.sex, activity: PROFILE.activity,
        cut_block_start: "2026-08-12", cut_block_load: 33, cut_break_load: 0, last_break_end: null }],
      settings: [{ id: UID, mode: "maintain", tdee_adj: 0, custom_kcal: null, aggressive_cut_acked: false }],
      history_snapshots: cutDays.map(d => snapRow(d, "cut")),
    });

    const days = ["2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06"];
    const seen = [];
    for (const [i, day] of days.entries()) {
      await page.clock.setFixedTime(new Date(day + "T08:00:00"));
      if (i === 0) {
        await open(page, {
          premium: { id: UID, name: "T", email: "t@example.com", picture: "", subExpiry: null, since: 0 },
          mode: "maintain",   // tapped on the first morning of the break; never stored for a day since
          history: cutDays.map(d => ({ ...snapRow(d, "cut"), logs: [], targetKcal: 2270 })),
          cutBlock: { start: "2026-08-12", load: 33, startWeight: 98.5, offRun: 0, breakLoad: 0,
            lastAccrued: "2026-10-01", lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null },
          // The one-time meal recovery already ran on a real phone; left armed, it awaits the
          // network before the app is ready, which would hide the race.
          extra: { qa_revive_v68: "1" },
        });
      } else {
        await page.reload();
      }
      seen.push(`${day}: ${await readBar(page)}`);
    }
    console.log(seen.join("\n"));

    // 33 load-days drain by a fourteenth a day; the bar is drawn against the 56 soft threshold.
    expect(seen).toEqual([
      "2026-10-02: ON A BREAK · DAY 1 | about 13 days to fully recharged | bar 55%",
      "2026-10-03: ON A BREAK · DAY 2 | about 12 days to fully recharged | bar 51%",
      "2026-10-04: ON A BREAK · DAY 3 | about 11 days to fully recharged | bar 46%",
      "2026-10-05: ON A BREAK · DAY 4 | about 10 days to fully recharged | bar 42%",
      "2026-10-06: ON A BREAK · DAY 5 | about 9 days to fully recharged | bar 38%",
    ]);
  });

  // The founder's own state on 12 Oct, as the bugs left it: Maintain since 2 Oct, the card saying
  // "STARTING TODAY", the load inflated to 40 by phantom cut days. The one-off rebuild has to turn
  // that into the eleven-day break history records, and the days after have to carry on from it.
  test("a break the bugs had reset is rebuilt from history, then carries on to Recharged", async ({ page }) => {
    const cut = [], rest = [];
    for (let d = 20; d <= 30; d++) cut.push("2026-09-" + d);
    cut.push("2026-10-01");
    for (let d = 2; d <= 12; d++) rest.push("2026-10-" + String(d).padStart(2, "0"));
    const rows = [...cut.map(d => snapRow(d, "cut")), ...rest.map(d => snapRow(d, "maintain"))];
    await installFakeCloud(page, {
      // What this morning's accrual synced: a one-day break off 40 (40 × 13/14).
      profiles: [{ id: UID, weight: PROFILE.weight, height: PROFILE.height, body_fat: PROFILE.bodyFat,
        sex: PROFILE.sex, activity: PROFILE.activity,
        cut_block_start: "2026-08-12", cut_block_load: 37.14, cut_break_load: 40, last_break_end: null }],
      settings: [{ id: UID, mode: "maintain", tdee_adj: 0, custom_kcal: null, aggressive_cut_acked: false }],
      history_snapshots: rows,
    });

    const days = [["2026-10-12", "16:40"], ["2026-10-13", "08:00"], ["2026-10-14", "08:00"], ["2026-10-15", "08:00"]];
    const seen = [];
    for (const [i, [day, time]] of days.entries()) {
      await page.clock.setFixedTime(new Date(`${day}T${time}:00`));
      if (i === 0) {
        await open(page, {
          premium: { id: UID, name: "T", email: "t@example.com", picture: "", subExpiry: null, since: 0 },
          history: rows.map(r => ({ ...r, logs: [], targetKcal: r.target_kcal })),
          // What the phone holds after the pull overwrote this morning's accrual.
          cutBlock: { start: "2026-08-12", load: 40, startWeight: 98.5, offRun: 0, breakLoad: 0,
            lastAccrued: "2026-10-12", lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null },
          extra: { qa_revive_v68: "1" },
        });
      } else {
        await page.reload();
      }
      seen.push(`${day}: ${await readBar(page)}`);
    }
    console.log(seen.join("\n"));

    expect(seen).toEqual([
      "2026-10-12: ON A BREAK · DAY 11 | about 3 days to fully recharged | bar 15%",
      "2026-10-13: ON A BREAK · DAY 12 | about 2 days to fully recharged | bar 10%",
      "2026-10-14: ON A BREAK · DAY 13 | about 1 day to fully recharged | bar 5%",
      "2026-10-15: RECHARGED",
    ]);
  });
});
