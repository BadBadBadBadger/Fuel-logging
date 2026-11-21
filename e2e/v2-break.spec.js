// Today v2 — Region D: header, mode lamps, cut-load tape, break sheets, early-return confirm,
// caution strip. Contracts: features/app-shell/05-today-v2-layout.feature,
// features/app-shell/06-mode-guard.feature, and the v2 section of
// features/energy-safety/03-diet-break-intervention.feature.
//
// Loaded with ?ui=v2: the harness clears localStorage, and the query turns the flag back on.
// Locators use data-testid hooks, never copy that CSS uppercases.

const { test, expect } = require("@playwright/test");
const { seed, storedMode, PROFILE, TODAY, daysAgo } = require("./harness");

async function openV2(page, state = {}) {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
}

const block = over => ({ startWeight: 98.5, offRun: 0, breakLoad: 0, lastAccrued: TODAY,
  lastBreakEnd: null, rechargedOn: null, nudgeAt: null, snoozeAt: null, ...over });
const CUTTING   = block({ start: daysAgo(42), load: 42 });
const SOFT      = block({ start: daysAgo(60), load: 60 });
const DUE       = block({ start: daysAgo(84), load: 84 });
// Seven rest days into a break that began at 84: load 42, guard armed (breakLoad ≥ soft).
const MID_BREAK = block({ start: daysAgo(60), load: 42, offRun: 7, breakLoad: 84 });

// Break-day snapshots, oldest first, ending yesterday. kcal null = no snapshot (unlogged).
// Six finished days (offRun 7 includes today). 3,600 is over 90 % of maintenance for PROFILE;
// 1,200 is well under. Dates are built with the app's local-date rule.
const localKey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
  String(d.getDate()).padStart(2, "0");
const breakHistory = kcals => kcals.map((kcal, i) => {
  const ago = kcals.length - i;
  return kcal == null ? null : { date: localKey(new Date(Date.now() - ago * 86400000)), mode: "maintain",
    kcal, protein: 150, carbs: 300, fat: 80, training: false, water: 6,
    logs: [{ id: 1, name: "Food", kcal, protein: 150, carbs: 300, fat: 80 }] };
}).filter(Boolean);

const cutBlockStored = page => page.evaluate(() => JSON.parse(localStorage.getItem("cut_block")));

test.describe("v2 header", () => {
  test("wordmark, date line with the streak as text, and nav buttons open their screens", async ({ page }) => {
    await openV2(page, { mode: "cut" });
    const header = page.getByTestId("v2-header");
    await expect(header).toContainText("Fuel/Log");
    await expect(page.getByTestId("v2-date")).toBeVisible();
    await expect(page.getByTestId("v2-streak")).toHaveCount(0);   // nothing logged today
    await expect(page.getByTestId("v2-nav-account")).toHaveCount(0);   // signed out

    for (const [id, gone] of [["v2-nav-history", "today-v2"], ["v2-nav-badges", "today-v2"], ["v2-nav-settings", "today-v2"]]) {
      await page.getByTestId(id).click();
      await expect(page.getByTestId(gone)).toHaveCount(0);
      await page.goto("/preview.html?ui=v2");
      await expect(page.getByTestId("today-v2")).toBeVisible({ timeout: 15_000 });
    }
  });

  test("signed in: a round avatar chip with an initial fallback opens Account", async ({ page }) => {
    await openV2(page, { mode: "cut", premium: true });
    const chip = page.getByTestId("v2-nav-account");
    await expect(chip).toBeVisible();
    await expect(chip).toHaveText("D");
    await chip.click();
    await expect(page.getByTestId("today-v2")).toHaveCount(0);
  });
});

test.describe("v2 mode lamps", () => {
  test("one lamp lit; taps go through requestMode", async ({ page }) => {
    await openV2(page, { mode: "cut" });
    await expect(page.getByTestId("v2-lamp-cut")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("v2-lamp-maintain")).toHaveAttribute("aria-pressed", "false");
    await page.getByTestId("v2-lamp-bulk").click();
    await expect(page.getByTestId("v2-lamp-bulk")).toHaveAttribute("aria-pressed", "true");
    expect(await storedMode(page)).toBe("bulk");
  });

  test("no lamp lit with a custom target", async ({ page }) => {
    await openV2(page, { mode: "cut", extra: { target_kcal: "2300" } });
    for (const k of ["cut", "maintain", "bulk"])
      await expect(page.getByTestId(`v2-lamp-${k}`)).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("v2 early-return confirm", () => {
  test("guarded Cut asks once: Keep resting keeps the break, Cut anyway is honoured", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await page.getByTestId("v2-lamp-cut").click();
    const sheet = page.getByTestId("v2-early-return");
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText("Back to cutting already?");
    await expect(page.getByTestId("v2-er-forecast")).toHaveText(
      /^About 7 more rest days would finish this break, and if you cut now the next break reminder is likely in about \d+ weeks? at your cut target\.$/);
    await expect(page.getByTestId("v2-er-began")).toHaveText(/^This block began on \d{1,2} \w{3}\.$/);
    expect(await storedMode(page)).toBe("maintain");
    await page.screenshot({ path: "e2e/screenshots/v2-early-return.png" });

    await page.getByTestId("v2-er-keep").click();
    await expect(sheet).toHaveCount(0);
    expect(await storedMode(page)).toBe("maintain");

    await page.getByTestId("v2-lamp-cut").click();
    await page.getByTestId("v2-er-cut").click();
    await expect(sheet).toHaveCount(0);
    expect(await storedMode(page)).toBe("cut");
  });

  test("load still at or above the nudge: the reminder is back in a few days", async ({ page }) => {
    await openV2(page, { cutBlock: block({ start: daysAgo(70), load: 66, offRun: 3, breakLoad: 84 }), mode: "maintain" });
    await page.getByTestId("v2-lamp-cut").click();
    await expect(page.getByTestId("v2-er-forecast")).toHaveText(
      "About 11 more rest days would finish this break, and if you cut now the break reminder will be back in a few days.");
  });

  test("Bulk mid-break is never guarded", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain" });
    await page.getByTestId("v2-lamp-bulk").click();
    await expect(page.getByTestId("v2-early-return")).toHaveCount(0);
    expect(await storedMode(page)).toBe("bulk");
  });
});

test.describe("v2 cut-load tape", () => {
  test("cutting below the nudge: neutral, real weeks, not tappable", async ({ page }) => {
    await openV2(page, { cutBlock: CUTTING, mode: "cut" });
    const tape = page.getByTestId("v2-cut-tape");
    await expect(tape).toHaveAttribute("data-state", "cutting");
    await expect(page.getByTestId("v2-tape-status")).toHaveText("6 weeks");
    await tape.click();
    await expect(page.getByTestId("v2-break-sheet")).toHaveCount(0);
  });

  test("hidden with no open block", async ({ page }) => {
    await openV2(page, { mode: "cut" });
    await expect(page.getByTestId("v2-cut-tape")).toHaveCount(0);
  });

  test("soft nudge: amber, tap opens Start / Not yet, Not yet snoozes the nudge", async ({ page }) => {
    await openV2(page, { cutBlock: SOFT, mode: "cut" });
    await expect(page.getByTestId("v2-cut-tape")).toHaveAttribute("data-state", "hot");
    await page.getByTestId("v2-tape-status").click();
    await expect(page.getByTestId("v2-break-sheet")).toHaveAttribute("data-level", "soft");
    await page.getByTestId("v2-break-notyet").click();
    await expect(page.getByTestId("v2-break-sheet")).toHaveCount(0);
    expect((await cutBlockStored(page)).nudgeAt).toBeTruthy();
  });

  test("break due: label, decision sheet copy, snooze", async ({ page }) => {
    await openV2(page, { cutBlock: DUE, mode: "cut" });
    await expect(page.getByTestId("v2-cut-tape")).toHaveAttribute("data-state", "due");
    await expect(page.getByTestId("v2-tape-status")).toHaveText("Break due · 12 weeks");
    await page.getByTestId("v2-tape-status").click();
    const sheet = page.getByTestId("v2-break-sheet");
    await expect(sheet).toHaveAttribute("data-level", "hard");
    await expect(sheet).toContainText("Cut load full");
    await expect(sheet).toContainText("12 weeks in a deficit");
    await expect(sheet).toContainText("Time for a diet break");
    await expect(sheet).toContainText("12 weeks is a long stretch in a deficit. Let's spend a couple of weeks at maintenance.");
    await expect(sheet).toContainText(/Your target moves to maintenance, about [\d,]+ kcal\./);
    await expect(page.getByTestId("v2-break-notyet")).toHaveCount(0);   // never dismissable
    await page.screenshot({ path: "e2e/screenshots/v2-break-due-sheet.png" });
    await page.getByTestId("v2-break-snooze").click();
    await expect(sheet).toHaveCount(0);
    expect((await cutBlockStored(page)).snoozeAt).toBeTruthy();
  });

  test("break due: Start a 2-week break sets Maintain in one tap", async ({ page }) => {
    await openV2(page, { cutBlock: DUE, mode: "cut" });
    await page.getByTestId("v2-tape-status").click();
    await page.getByTestId("v2-break-start").click();
    expect(await storedMode(page)).toBe("maintain");
    await expect(page.getByTestId("v2-lamp-maintain")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("v2 on a break", () => {
  test("all banked: teal drain, banked count, W10 streak and W3", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain",
      history: breakHistory([3600, 3600, 3600, 3600, 3600, 3600]) });
    await expect(page.getByTestId("v2-cut-tape")).toHaveAttribute("data-state", "break");
    await expect(page.getByTestId("v2-tape-status")).toHaveText("On a break · 6 of 14 days banked");
    await expect(page.getByTestId("v2-break-line")).toHaveAttribute("data-line", "W10");
    await expect(page.getByTestId("v2-break-line")).toHaveText("6 for 6. This is what a break looks like.");
    await expect(page.getByTestId("v2-bank-today")).toHaveText(/^Today 0 of [\d,]+ to bank it$/);
    await expect(page.getByTestId("v2-tape-gap")).toHaveCount(0);
    await page.getByTestId("v2-tape-status").click();
    await expect(page.getByTestId("v2-break-details")).toContainText("About 7 days to fully recharged.");
  });

  test("yesterday under: W4, one neutral hatched gap with its screen-reader label", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain",
      history: breakHistory([3600, 3600, 3600, 3600, 3600, 1200]) });
    await expect(page.getByTestId("v2-break-line")).toHaveAttribute("data-line", "W4");
    await expect(page.getByTestId("v2-break-line"))
      .toHaveText("Yesterday was under maintenance, so it didn't count towards your break.");
    await expect(page.getByRole("img", { name: "Not banked, under maintenance" })).toHaveCount(1);
    await expect(page.getByTestId("v2-tape-status")).toHaveText("On a break · 5 of 14 days banked");
  });

  test("two or more under: W5 outranks everything", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain",
      history: breakHistory([3600, 1200, 3600, 3600, 3600, 1200]) });
    await expect(page.getByTestId("v2-break-line")).toHaveAttribute("data-line", "W5");
    await expect(page.getByTestId("v2-break-line")).toHaveText("You're not taking an effective break. Eat at maintenance.");
    await expect(page.locator('[data-testid="v2-tape-gap"][data-kind="under"]')).toHaveCount(2);
    await page.screenshot({ path: "e2e/screenshots/v2-break-w5.png" });
  });

  test("yesterday unlogged: W6 with Log it, and a dashed pending gap", async ({ page }) => {
    await openV2(page, { cutBlock: MID_BREAK, mode: "maintain",
      history: breakHistory([3600, 3600, 3600, 3600, 3600, null]) });
    await expect(page.getByTestId("v2-break-line")).toHaveAttribute("data-line", "W6");
    await expect(page.getByRole("img", { name: "Not banked yet, not logged" })).toHaveCount(1);
    await page.getByTestId("v2-break-logit").click();
    await expect(page.getByTestId("today-v2")).toHaveCount(0);   // History opened
  });
});

test.describe("v2 caution strip", () => {
  test("highest priority first, +N more expands, the aggressive-cut acknowledgement stays actionable", async ({ page }) => {
    await openV2(page, { mode: "cut", extra: { target_kcal: "1450" },
      cutBlock: block({ start: null, load: 0, lastBreakEnd: TODAY, rechargedOn: TODAY }) });
    const strip = page.getByTestId("v2-caution");
    await expect(strip).toHaveAttribute("data-top", "aggressive");
    await expect(page.getByTestId("v2-caution-item")).toHaveCount(1);
    await expect(page.getByTestId("v2-caution-more")).toHaveText(/^\+\d+ more$/);
    await page.getByTestId("v2-caution-more").click();
    await expect(page.locator('[data-testid="v2-caution-item"][data-kind="recharged"]')).toBeVisible();

    await page.getByTestId("v2-caution-ack").click();
    await expect(page.getByTestId("v2-caution-ack")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("aggressive_cut_acked"))).toBe("1");
  });

  test("recharged alone can be dismissed", async ({ page }) => {
    await openV2(page, { mode: "maintain",
      cutBlock: block({ start: null, load: 0, lastBreakEnd: TODAY, rechargedOn: TODAY }) });
    await expect(page.getByTestId("v2-caution")).toHaveAttribute("data-top", "recharged");
    await page.getByTestId("v2-caution-dismiss").click();
    await expect(page.getByTestId("v2-caution")).toHaveCount(0);
  });
});
