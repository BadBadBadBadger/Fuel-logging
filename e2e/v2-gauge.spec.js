// Today v2 fuel gauge — features/dashboard/07-gauge.feature, features/targets/02 (v2 scenarios).
// design/v2/HANDOVER.md §4, D2–D4, D17, D19.
//
// The v2 screen is behind ?ui=v2. The harness clears localStorage on seed; the query turns the
// flag back on for the page load. The CUT target is pinned with `target_kcal` (the custom-target
// key), as calorie-card-label.spec.js does: 2,241 is below this profile's maintenance, so the
// effective mode is CUT and the numbers match the mockups exactly.

const { test, expect } = require("@playwright/test");
const { seed, shot, PROFILE } = require("./harness");

const T = 2241;
const meal = (kcal, extra = {}) => ({ id: 1755000000000, name: "The day so far", time: "13:14",
  kcal, protein: 65, carbs: 151, fat: 28, ...extra });

const openV2 = async (page, state = {}) => {
  await seed(page, { profile: PROFILE, ...state });
  await page.goto("/preview.html?ui=v2");
  await expect(page.getByTestId("v2-gauge")).toBeVisible({ timeout: 15_000 });
};
const cutWith = (page, eaten) => openV2(page, { logs: eaten ? [meal(eaten)] : [], extra: { target_kcal: String(T) } });

const gauge   = page => page.getByTestId("v2-gauge");
const readout = page => page.getByTestId("v2-gauge-readout");
const caption = page => page.getByTestId("v2-gauge-caption");

/** The resolved value of a v2 token, so colour checks hold in either theme. */
const token = (page, name) => page.evaluate(n => {
  const probe = document.createElement("div");
  probe.style.color = `var(${n})`;
  document.querySelector(".ui-v2").appendChild(probe);
  const c = getComputedStyle(probe).color; probe.remove(); return c;
}, name);
const arcColour     = page => page.getByTestId("v2-gauge-arc").evaluate(el => {
  const p = document.createElement("div"); p.style.color = getComputedStyle(el).stroke;
  document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; });
const pointerColour = page => page.getByTestId("v2-gauge-pointer").evaluate(el => {
  const p = document.createElement("div"); p.style.color = getComputedStyle(el).fill;
  document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; });
const readoutColour = page => readout(page).evaluate(el => getComputedStyle(el).color);

test.describe("v2 gauge: still to go", () => {
  test("under target shows calories left, still to go, half-filled", async ({ page }) => {
    await cutWith(page, 1150);
    await expect(readout(page)).toHaveText("1,091");
    await expect(caption(page)).toHaveText("still to go");
    await expect(page.getByTestId("v2-target")).toHaveText("2,241");
    await expect(page.getByTestId("v2-eaten")).toHaveText("1,150");
    const fill = Number(await gauge(page).getAttribute("data-fill"));
    expect(fill).toBeGreaterThan(0.5); expect(fill).toBeLessThan(0.52);
    // No sum anywhere, no pencil.
    await expect(page.getByTestId("today-v2")).not.toContainText("=");
    await expect(page.getByTestId("today-v2")).not.toContainText("✎");
  });

  test("nothing eaten: full target to go, arc empty", async ({ page }) => {
    await cutWith(page, 0);
    await expect(readout(page)).toHaveText("2,241");
    await expect(caption(page)).toHaveText("still to go");
    await expect(gauge(page)).toHaveAttribute("data-fill", "0.000");
    await expect(page.getByTestId("v2-gauge-arc")).toHaveCount(0);
  });

  test("exactly on target: 0 still to go, arc full", async ({ page }) => {
    await cutWith(page, T);
    await expect(readout(page)).toHaveText("0");
    await expect(caption(page)).toHaveText("still to go");
    await expect(gauge(page)).toHaveAttribute("data-fill", "1.000");
    await expect(gauge(page)).toHaveAttribute("data-band", "good");
  });
});

test.describe("v2 gauge: CUT colour bands (D17)", () => {
  test("at or under target is green, number in ink", async ({ page }) => {
    await cutWith(page, 1150);
    await expect(gauge(page)).toHaveAttribute("data-band", "good");
    expect(await arcColour(page)).toBe(await token(page, "--good"));
    expect(await pointerColour(page)).toBe(await token(page, "--good"));
    expect(await readoutColour(page)).toBe(await token(page, "--ink"));
  });

  test("150 over is amber, full arc, reads 150 over", async ({ page }) => {
    await cutWith(page, T + 150);
    await expect(readout(page)).toHaveText("150");
    await expect(caption(page)).toHaveText("over");
    await expect(gauge(page)).toHaveAttribute("data-band", "amber");
    await expect(gauge(page)).toHaveAttribute("data-fill", "1.000");
    expect(await arcColour(page)).toBe(await token(page, "--amber-mark"));
    expect(await readoutColour(page)).toBe(await token(page, "--amber-ink"));
  });

  test("250 over is still amber", async ({ page }) => {
    await cutWith(page, T + 250);
    await expect(gauge(page)).toHaveAttribute("data-band", "amber");
  });
  test("251 over is red", async ({ page }) => {
    await cutWith(page, T + 251);
    await expect(gauge(page)).toHaveAttribute("data-band", "over");
  });

  test("400 over is red, full arc, pointer at F", async ({ page }) => {
    await cutWith(page, T + 400);
    await expect(readout(page)).toHaveText("400");
    await expect(caption(page)).toHaveText("over");
    await expect(gauge(page)).toHaveAttribute("data-band", "over");
    await expect(gauge(page)).toHaveAttribute("data-fill", "1.000");
    expect(await arcColour(page)).toBe(await token(page, "--over"));
    expect(await readoutColour(page)).toBe(await token(page, "--over"));
  });

  test("600 over: no over-zone past F — the arc ends at F", async ({ page }) => {
    await cutWith(page, T + 600);
    await expect(readout(page)).toHaveText("600");
    await expect(page.getByTestId("v2-gauge-arc")).toHaveAttribute("d", "M22 150 A 138 138 0 0 1 298.0 150.0");
    await shot(page, "v2-gauge-600-over", { full: false });
  });
});

test.describe("v2 gauge: Maintain and Bulk are neutral (D19)", () => {
  for (const mode of ["maintain", "bulk"]) {
    test(`${mode} under target: neutral, still to go`, async ({ page }) => {
      await openV2(page, { mode, logs: [meal(1150)] });
      await expect(gauge(page)).toHaveAttribute("data-band", "neutral");
      await expect(caption(page)).toHaveText("still to go");
      expect(await arcColour(page)).toBe(await token(page, "--dim"));
      expect(await readoutColour(page)).toBe(await token(page, "--ink"));
    });
    test(`${mode} over target: still neutral, reads over`, async ({ page }) => {
      await openV2(page, { mode, logs: [meal(6000)] });
      await expect(gauge(page)).toHaveAttribute("data-band", "neutral");
      await expect(caption(page)).toHaveText("over");
      expect(await arcColour(page)).toBe(await token(page, "--dim"));
      expect(await readoutColour(page)).toBe(await token(page, "--ink"));
    });
  }
});

test.describe("v2 TARGET override (D4, targets/02)", () => {
  test("tap TARGET, type a number, Done: target and readout update", async ({ page }) => {
    await openV2(page, { mode: "cut", logs: [meal(1150)] });
    const target = page.getByTestId("v2-target");
    const auto = (await target.textContent()).trim();
    await expect(target).toHaveCSS("text-decoration-style", "dashed");
    await target.click();
    const input = page.getByTestId("v2-target-input");
    await expect(input).toBeFocused();
    await expect(input).toHaveValue(auto.replace(/,/g, ""));
    await expect(page.getByTestId("v2-target-auto")).toHaveText(auto);
    await expect(page.getByTestId("v2-target-use-auto")).toHaveCount(0);   // already auto
    await input.fill("2000");
    await input.press("Enter");
    await expect(page.getByTestId("v2-target")).toHaveText("2,000");
    await expect(readout(page)).toHaveText("850");
    await expect(page.getByTestId("v2-target")).toHaveAttribute("data-custom", "1");

    // Edit again: Auto would be <the original>, and Use auto brings it back.
    await page.getByTestId("v2-target").click();
    await expect(page.getByTestId("v2-target-auto")).toHaveText(auto);
    await page.getByTestId("v2-target-use-auto").click();
    await expect(page.getByTestId("v2-target")).toHaveText(auto);
    await expect(page.getByTestId("v2-target")).toHaveAttribute("data-custom", "0");
  });

  test("tapping away without changing keeps the auto target", async ({ page }) => {
    await openV2(page, { mode: "cut", logs: [meal(1150)] });
    const before = (await page.getByTestId("v2-target").textContent()).trim();
    await page.getByTestId("v2-target").click();
    await page.getByTestId("v2-eaten").click();   // blur
    await expect(page.getByTestId("v2-target")).toHaveText(before);
    await expect(page.getByTestId("v2-target")).toHaveAttribute("data-custom", "0");
  });

  test("Escape cancels the edit", async ({ page }) => {
    await cutWith(page, 1150);
    await page.getByTestId("v2-target").click();
    await page.getByTestId("v2-target-input").fill("1800");
    await page.getByTestId("v2-target-input").press("Escape");
    await expect(page.getByTestId("v2-target")).toHaveText("2,241");
  });
});

test.describe("v2 macro tapes", () => {
  test("PRO, CARB and FAT show eaten/target with a neutral tape and amber pointer", async ({ page }) => {
    await cutWith(page, 1150);
    for (const id of ["protein", "carbs", "fat"]) {
      await expect(page.getByTestId(`v2-macro-${id}-value`)).toHaveText(/^\d+\/\d+$/);
      const ptr = await page.getByTestId(`v2-macro-${id}-pointer`).evaluate(el => getComputedStyle(el).borderTopColor);
      expect(ptr).toBe(await token(page, "--amber-mark"));
    }
    await expect(page.getByTestId("v2-macro-protein-value")).toContainText("65/");
  });

  test("a macro over target fills the tape and stops the pointer at the end", async ({ page }) => {
    await openV2(page, { logs: [meal(1150, { protein: 400 })], extra: { target_kcal: String(T) } });
    await expect(page.getByTestId("v2-macro-protein")).toHaveAttribute("data-pct", "100.0");
    await expect(page.getByTestId("v2-macro-protein-value")).toContainText("400/");
  });
});
