// The version shown at the foot of the ⚙️ profile screen must be the one the service worker ships.
// They are two hand-bumped strings in two files; this is what stops them drifting apart.
const fs = require("fs");
const path = require("path");
const app = fs.readFileSync(path.join(__dirname, "..", "app.jsx"), "utf8");
const sw  = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");

test("APP_VERSION matches sw.js CACHE", () => {
  const appV = app.match(/const APP_VERSION\s*=\s*"(v\d+)"/)[1];
  const swV  = sw.match(/const CACHE = "fuel-log-(v\d+)"/)[1];
  expect(appV).toBe(swV);
});

test("APP_PATCH_DATE is a real YYYY-MM-DD date", () => {
  const d = app.match(/const APP_PATCH_DATE\s*=\s*"([^"]+)"/)[1];
  expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(new Date(d + "T12:00:00").toISOString().slice(0, 10)).toBe(d);
});
