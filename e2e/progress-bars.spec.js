// Contract: features/dashboard/01-calorie-tolerance.feature — the calorie bar's fill.
//
// The bug this exists for: the fill's background was built as `linear-gradient(90deg,${mc}88,${mc})`
// back when `mc` was a hex literal. Once MODES moved to CSS variables, `mc` became "var(--cut)" and
// the template produced `var(--cut)88` — a colour stop with a unitless 88 position. The gradient was
// invalid, so the browser dropped the whole `background` declaration and the bar painted nothing.
//
// WHY A NORMAL ASSERTION MISSES IT. The div is present, its width is correct, and its inline style
// attribute contains the string the developer wrote. Everything a DOM query can see is right. Only
// the COMPUTED style shows the declaration was thrown away, which is what these tests read.
//
// SCOPE. The last test here is a general net — no element on the dashboard may end up with a
// dropped background — but it only sees what this one screen renders in this one state. The
// comprehensive guard for the `var(--x)` + hex-alpha class is __tests__/styles.test.js, which
// reads the source instead and so also covers the tints that only appear once you tap to edit a
// target, open History, or add an allergy tag. Fix that test first if this one ever goes red.

const { test, expect } = require("@playwright/test");
const { open } = require("./harness");

/** The calorie card's fill — the inner div of the 10px-high rounded track. */
const kcalFill = page => page.locator('div[style*="height: 10px"] > div').first();

/** A background that paints. Chrome reports a dropped declaration as "none" or fully transparent. */
const paints = bg => bg !== "none" && bg !== "" && !/rgba\(0, 0, 0, 0\)/.test(bg);

/** One entry sized against the seeded profile's target, so the bar is partly filled, not full. */
const someFood = [{ id: 1755000001000, name: "Porridge", time: "08:00",
  kcal: 400, protein: 15, carbs: 60, fat: 8 }];

test.describe("The calorie progress bar", () => {
  // Under target is the case that broke. Over target took a different branch (a plain var(--warn)),
  // so the bar sprang back to life only when you overate — which is why it looked intermittent.
  test("its fill actually paints when you are under target", async ({ page }) => {
    await open(page, { logs: someFood });

    const fill = kcalFill(page);
    await expect(fill).toBeVisible();

    const style = await fill.evaluate(el => {
      const s = getComputedStyle(el);
      return { image: s.backgroundImage, color: s.backgroundColor, width: el.getBoundingClientRect().width };
    });

    // The gradient survived compositing rather than being discarded...
    expect(style.image).toContain("gradient");
    // ...and the bar has real extent, so a painted background is actually on screen.
    expect(style.width).toBeGreaterThan(0);
  });

  test("its fill still paints when you are over target", async ({ page }) => {
    await open(page, { logs: [{ ...someFood[0], kcal: 5000 }] });

    const fill = kcalFill(page);
    const bg = await fill.evaluate(el => {
      const s = getComputedStyle(el);
      return s.backgroundImage !== "none" ? s.backgroundImage : s.backgroundColor;
    });
    expect(paints(bg)).toBe(true);
  });

  test("the macro bars paint too", async ({ page }) => {
    await open(page, { logs: someFood });

    // The three MBar fills — the 7px-high tracks, distinct from the calorie bar's 10px.
    const fills = page.locator('div[style*="height: 7px"] > div');
    await expect(fills).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const bg = await fills.nth(i).evaluate(el => {
        const s = getComputedStyle(el);
        return s.backgroundImage !== "none" ? s.backgroundImage : s.backgroundColor;
      });
      expect(paints(bg)).toBe(true);
    }
  });

  // The general form. Anything that ASKED for a background and ended up with none has had its
  // declaration dropped — nearly always a var() with hex alpha stuck on the end.
  test("no element on the dashboard has had its background silently dropped", async ({ page }) => {
    await open(page, { logs: someFood });

    const dropped = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll("#root *")) {
        const asked = el.getAttribute("style") || "";
        if (!/background(-image|-color)?\s*:/.test(asked)) continue;
        // What was asked for, minus the cases where "nothing" is the honest answer.
        if (/background[^;]*:\s*(none|transparent|no-repeat)/.test(asked)) continue;
        const s = getComputedStyle(el);
        const got = s.backgroundImage !== "none" ? s.backgroundImage : s.backgroundColor;
        if (got === "none" || got === "" || /rgba\(0, 0, 0, 0\)/.test(got)) {
          bad.push(asked.match(/background[^;]*/)[0].slice(0, 90));
        }
      }
      return bad;
    });

    expect(dropped).toEqual([]);
  });
});
