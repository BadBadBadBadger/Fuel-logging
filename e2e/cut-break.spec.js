// The diet break, at the UI layer — DEVICE-TEST.md B3 and B4.
// Contract: features/energy-safety/03-diet-break-intervention.feature. Reasoning: ENERGY_MODEL.md §5.3.
//
// The behaviour under test is file 03's central claim: a break is simply NOT CUTTING. There is no
// break state to fail at, the mode picker is the only thing that changes mode, and the load bar is
// read in two directions — it fills while cutting and drains while you don't.
//
// Drain arithmetic is NOT re-asserted here; __tests__/logic.test.js owns it. This layer owns
// whether the right card appears and what words are on it.

const { test, expect } = require("@playwright/test");
const { open, storedMode, TODAY } = require("./harness");

// Seven rest days into a fourteen-day break: load 42 of an 84 breakLoad, exactly half drained.
// breakLoad 84 clears the soft threshold, which is what arms the one guarded action.
const MID_BREAK = {
  start: "2026-05-01", load: 42, startWeight: 98.5, offRun: 7, breakLoad: 84,
  lastAccrued: TODAY, lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null,
};

test.describe("A diet break", () => {
  test("the bar reads as a break in progress, counting days not load", async ({ page }) => {
    await open(page, { cutBlock: MID_BREAK, mode: "maintain" });

    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/about 7 days to fully recharged/)).toBeVisible();
    // The load number must never surface as a duration — 03's whole point.
    await expect(page.getByText(/DAY 42|42 days/)).toHaveCount(0);

    await page.screenshot({ path: "e2e/screenshots/b3-mid-break.png" });
  });

  test("Bulk mid-break is never guarded — it switches on the spot", async ({ page }) => {
    await open(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "BULK" }).click();

    await expect(page.getByText("BACK TO CUTTING ALREADY?")).toHaveCount(0);
    expect(await storedMode(page)).toBe("bulk");
    // Bulk drains identically — the break is still running, not cancelled by leaving Maintain.
    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible();

    await page.screenshot({ path: "e2e/screenshots/b3-bulk-mid-break.png" });
  });

  test("Cut mid-break asks once, and takes 'Cut anyway' as the answer", async ({ page }) => {
    const dialogs = [];
    page.on("dialog", async d => { dialogs.push(d.message()); await d.dismiss(); });

    await open(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "CUT" }).click();

    await expect(page.getByText("BACK TO CUTTING ALREADY?")).toBeVisible();
    await expect(page.getByText(/About 7 more rest days would recharge you fully/)).toBeVisible();
    await expect(page.getByText(/It's your call/)).toBeVisible();
    // Still on the break until the question is answered — asking must not pre-apply the change.
    expect(await storedMode(page)).toBe("maintain");
    await page.screenshot({ path: "e2e/screenshots/b3-cut-guard.png" });

    await page.getByRole("button", { name: "Cut anyway" }).click();

    // Honoured on the spot: it asks once, it does not argue.
    expect(await storedMode(page)).toBe("cut");
    await expect(page.getByText("BACK TO CUTTING ALREADY?")).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });

  test("'Keep resting' leaves the break exactly as it was", async ({ page }) => {
    await open(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "CUT" }).click();
    await page.getByRole("button", { name: "Keep resting" }).click();

    await expect(page.getByText("BACK TO CUTTING ALREADY?")).toHaveCount(0);
    expect(await storedMode(page)).toBe("maintain");
    await expect(page.getByText("ON A BREAK · DAY 7")).toBeVisible();
  });

  test("recharged: one card, no mode buttons on it, and silence after dismissal", async ({ page }) => {
    // Load hit zero and the block closed — start:null is what distinguishes "done" from "resting".
    await open(page, {
      cutBlock: {
        start: null, load: 0, startWeight: null, offRun: 0, breakLoad: 0,
        lastAccrued: TODAY, lastBreakEnd: TODAY, rechargedOn: TODAY, nudgeAt: null, snoozeAt: null,
      },
      mode: "maintain",
    });

    const card = page.getByText("RECHARGED");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("You're in good shape to cut again, if you want to.")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/b4-recharged.png" });

    // The picker is the only surface that changes mode — this card must not duplicate it.
    await expect(page.getByRole("button", { name: "Start a 2-week break" })).toHaveCount(0);
    await expect(page.getByText("ON A BREAK")).toHaveCount(0);

    await page.getByRole("button", { name: "×" }).click();
    await expect(page.getByText("RECHARGED")).toHaveCount(0);
  });
});

// 2026-10-11 — a new day has no stored mode, and it used to open in Cut. The daily accrual then
// counted every morning of a break as a cut day and reset it, so a week-long break sat at
// "about 14 days to fully recharged" forever. Mode now carries over from the last day.
test.describe("A break across days", () => {
  test("a new morning keeps yesterday's Maintain, so the break moves on a day", async ({ page }) => {
    await open(page, {
      historySpec: { days: 3, kcal: 2600, mode: "maintain", endDaysAgo: 1 }, // no mode stored for today
      cutBlock: { ...MID_BREAK, lastAccrued: "@-1d" },                        // today not accrued yet
    });

    await expect(page.getByText("ON A BREAK · DAY 8")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/about 6 days to fully recharged/)).toBeVisible();
    expect(await storedMode(page)).toBe("maintain");
  });

  // 2026-10-12 — the startup cloud pull reads the profiles row BEFORE the day's accrual runs, and
  // used to land AFTER it, replacing today's freshly accrued rest day with yesterday's cloud copy.
  // A synced user on a break saw "ON A BREAK · STARTING TODAY" every morning.
  test("a slow cloud pull doesn't undo the morning's rest day", async ({ page }) => {
    // Yesterday's state as the cloud holds it: the break was reset (breakLoad 0) that morning.
    await page.addInitScript(() => {
      const ok = data => ({ data, error: null });
      const fake = {
        from(table) {
          const b = {
            select: () => b, eq: () => b, order: () => b, upsert: () => b, insert: () => b,
            delete: () => b, update: () => b,
            maybeSingle: () => {
              b.single = true;
              return b;
            },
            then: (resolve, reject) => new Promise(r => setTimeout(r, 400)).then(() => {
              if (table === "profiles" && b.single) return ok({
                id: "u1", weight: 98.5, height: 178, body_fat: 22, sex: "male", activity: "light",
                cut_block_start: "2026-05-01", cut_block_load: 84, cut_break_load: 0, last_break_end: null,
              });
              return ok(b.single ? null : []);
            }).then(resolve, reject),
          };
          return b;
        },
        auth: { signOut: async () => ({}) },
      };
      Object.defineProperty(window, "supabaseClient", { get: () => fake, set: () => {}, configurable: true });
    });
    await open(page, {
      premium: { id: "u1", name: "T", email: "t@example.com", picture: "", subExpiry: null, since: Date.now() },
      historySpec: { days: 3, kcal: 2600, mode: "maintain", endDaysAgo: 1 },
      cutBlock: { ...MID_BREAK, load: 84, offRun: 0, breakLoad: 0, lastAccrued: "@-1d" },
      // The one-time meal recovery already ran on a real phone; left armed, it awaits the network
      // before the app is ready and hides the race. The one-off break rebuild is marked done too:
      // it would credit the seeded Maintain days, and this test is about the race alone (the
      // rebuild has its own in cut-break-sync.spec.js).
      extra: { "qa_revive_v68": "1", "cut_break_rebuilt_v1": "1" },
    });

    await expect(page.getByText("ON A BREAK · DAY 1")).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(1500); // well past the pull landing
    await expect(page.getByText("ON A BREAK · DAY 1")).toBeVisible();
    await expect(page.getByText("ON A BREAK · STARTING TODAY")).toHaveCount(0);
  });
});
