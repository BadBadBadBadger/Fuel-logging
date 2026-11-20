// The ⚙️ profile screen ends with the app version and the latest patch date (founder, 2026-11-20).
// __tests__/version.test.js keeps APP_VERSION in step with sw.js; this checks it reaches the screen.

const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { open } = require("./harness");

const sw = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
const VERSION = sw.match(/const CACHE = "fuel-log-(v\d+)"/)[1];

test("the version and patch date are the last thing on the profile screen", async ({ page }) => {
  await open(page, {});
  await page.locator('button:has-text("⚙️")').click();
  await expect(page.getByText("MY PROFILE")).toBeVisible();
  const footer = page.getByText(new RegExp(`^Fuel Log ${VERSION} · updated \\d{1,2} [A-Z][a-z]{2,3} \\d{4}$`));
  await expect(footer).toBeVisible();
  // Nothing on the screen sits below it.
  const isLast = await footer.evaluate(el => {
    const bottom = el.getBoundingClientRect().bottom;
    return [...el.ownerDocument.body.querySelectorAll("button, input, select, textarea, div")]
      .every(n => n === el || n.contains(el) || el.contains(n) || n.getBoundingClientRect().top < bottom
        || !n.offsetParent);
  });
  expect(isLast).toBe(true);
});
