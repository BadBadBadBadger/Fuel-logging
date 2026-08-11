// Part A smoke — the app renders and the everyday actions work.
//
// Deliberately shallow and broad. These are the checks that would have caught the theme-CSS
// failure, where every colour variable resolved to nothing and the UI flattened to white-on-dark
// while every DOM assertion still passed.

const { test, expect } = require("@playwright/test");
const { open, storedMode } = require("./harness");

test.describe("It renders", () => {
  test("the dashboard comes up, not a blank screen", async ({ page }) => {
    await open(page);

    await expect(page.getByText("FUEL LOG")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("CONSUMED")).toBeVisible();
    await expect(page.getByText("MACROS")).toBeVisible();
    // A React error boundary or a crashed render leaves #root present but empty.
    expect(await page.locator("#root").innerText()).not.toHaveLength(0);
  });

  test("it survives all three device widths", async ({ page }) => {
    // The harness resizes #app-shell, not the browser viewport — so this exercises the app's
    // own layout at 375/390/412, which is the width that actually reaches the components.
    await open(page);
    for (const device of ["Pixel 7", "iPhone SE", "iPhone 14"]) {
      await page.getByRole("button", { name: device, exact: true }).click();
      await expect(page.getByText("FUEL LOG")).toBeVisible();
      await expect(page.getByText("MACROS")).toBeVisible();
      await page.screenshot({ path: `e2e/screenshots/smoke-${device.replace(/\s+/g, "-")}.png` });
    }
  });
});

test.describe("Theme", () => {
  // The exact bug from session 15: the harness carried no theme CSS, every var() resolved to
  // nothing, and the UI flattened. Asserting the variables RESOLVE is what catches that class —
  // a DOM-only assertion sails straight past it.
  for (const choice of ["light", "dark"]) {
    test(`${choice} resolves its colour variables, and survives a reload`, async ({ page }) => {
      await open(page, { extra: { fuel_theme: choice } });

      const probe = async () => page.evaluate(() => {
        const s = getComputedStyle(document.documentElement);
        return {
          attr: document.documentElement.getAttribute("data-theme"),
          bg:   s.getPropertyValue("--bg").trim(),
          text: s.getPropertyValue("--text-hi").trim(),
        };
      });

      const before = await probe();
      expect(before.attr).toBe(choice);
      expect(before.bg).not.toBe("");
      expect(before.text).not.toBe("");

      await page.reload();
      await expect(page.getByText("FUEL LOG")).toBeVisible({ timeout: 15_000 });
      expect(await probe()).toEqual(before);
    });
  }

  test("light and dark are actually different", async ({ page }) => {
    const read = async choice => {
      await page.evaluate(c => localStorage.setItem("fuel_theme", c), choice);
      await page.reload();
      await expect(page.getByText("FUEL LOG")).toBeVisible({ timeout: 15_000 });
      return page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    };
    await open(page, { extra: { fuel_theme: "light" } });

    const light = await read("light");
    const dark  = await read("dark");
    expect(light).not.toBe(dark);
  });
});

test.describe("Everyday actions", () => {
  test("logging a meal lands it in today's list and moves the macros", async ({ page }) => {
    await open(page, { extra: { qa_revive_v68: "1" } });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: /QUICK ADD/ }).click();
    await page.getByText("Chicken breast (150g)").click();

    // Back on the dashboard, the entry is in today's log and protein has moved off zero.
    await expect(page.getByText("Chicken breast (150g)")).toBeVisible();
    const protein = await page.getByText(/^\d+(\.\d+)?g \/ \d+g$/).first().innerText();
    expect(protein).not.toMatch(/^0g/);
  });

  test("a logged workout says its calories are spread forward", async ({ page }) => {
    await open(page);
    await expect(page.getByText("WORKOUTS")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: /LOG WORKOUT/ }).click();

    // The Step 3 promise: one big session must not all land today.
    await expect(page.getByText(/the rest fuels the next couple of days/)).toBeVisible();
    await expect(page.getByText(/doesn't all land at once|doesn’t all land at once/)).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/smoke-workout-spread.png" });
  });

  test("switching mode moves the target, with no confirm in the way", async ({ page }) => {
    const dialogs = [];
    page.on("dialog", async d => { dialogs.push(d.message()); await d.dismiss(); });
    await open(page, { mode: "cut" });
    await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });

    // The editable target chip, not the workout's burn figure — an unscoped /\d+ kcal/ matches
    // "486 kcal" from the workout card first and compares a number that never moves.
    const target = () => page.locator("div", { has: page.getByText("✎", { exact: true }) })
      .last().innerText();
    const cutTarget = await target();

    await page.getByRole("button", { name: "BULK" }).click();
    expect(await storedMode(page)).toBe("bulk");
    await expect.poll(target).not.toBe(cutTarget);

    expect(dialogs).toEqual([]);
  });
});
