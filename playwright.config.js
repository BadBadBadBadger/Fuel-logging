// Playwright — UI-layer tests, driven through the preview harness.
//
// Why the harness and not index.html: preview.html already solves the two hard problems.
// It bridges window.storage to localStorage, and it fakes the calendar via a plain
// `dev_date_offset` integer — which is what makes the time-dependent energy-safety
// surfaces (cut blocks, the drain, the stall) reachable at all. In normal use they need
// weeks of real history. It also unregisters service workers, so no stale bundle.
//
// This layer answers "does the right card appear, saying the right words". Arithmetic
// stays in __tests__/logic.test.js; nothing is asserted in both places.

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  // On-demand suite, run by a person watching the output — not a CI gate.
  fullyParallel: true,
  workers: 2,
  reporter: [["list"]],
  outputDir: "./e2e/.artifacts",

  use: {
    baseURL: "http://localhost:3000",
    // Screenshots are the point, not a failure artifact: the theme-CSS bug that got
    // through rendered "fine" to a DOM assertion and looked obviously wrong to an eye.
    screenshot: "on",
    trace: "retain-on-failure",
    // Pixel 7, not iPhone: the iPhone descriptors default to WebKit, and the real target is a
    // Chrome PWA on Android. Real Safari behaviour is not simulable here and stays a device job.
    ...devices["Pixel 7"],
  },

  webServer: {
    command: "node dev-server.js",
    url: "http://localhost:3000/preview.html",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
