// A source-level guard against one specific, silent class of bug: a day key built from UTC.
//
// Day keys in this app are LOCAL calendar days, "YYYY-MM-DD", produced by dateKey(d) (app.jsx)
// or todayKey(). The wrong idiom is `new Date(...).toISOString().split("T")[0]`, which is UTC:
// west of Greenwich it names yesterday for most of the evening, and under BST it names tomorrow
// between local midnight and 01:00. A range built that way holds a different number of days
// depending on the hour it is evaluated.
//
// That is what produced FL-001: the History range cutoffs at app.jsx:5612, 5619 and 5649 each
// built a UTC key, so the "7 days" average silently covered eight local days and divided by the
// wrong number. It shipped, and 370 passing Jest tests carried no information about it, because
// __tests__/logic.test.js is a hand-retyped mirror with no `require` of app.jsx — code never
// copied across cannot be tested, and nothing reports the omission.
//
// This test is static rather than rendered on purpose. It needs no clock, no fixture and no
// browser, it sees every call site including the ones no test navigates to, and it cannot pass
// vacuously the way a dayOffset-driven test does against code that ignores getDevDateOffset().

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "app.jsx");

/** Source lines, minus comments — the explanatory comments above name the bad pattern verbatim. */
const codeLines = () =>
  fs.readFileSync(SRC, "utf8")
    .split("\n")
    .map((text, i) => ({ n: i + 1, text }))
    .filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l.text));

describe("Day keys are local, never UTC", () => {
  test("no day key is built with toISOString().split(\"T\")", () => {
    // Only the date-extracting form is a defect. A bare toISOString() is a timestamp
    // (updated_at, exportedAt) and is correct — Postgres wants UTC there.
    const offenders = codeLines()
      .filter(l => /toISOString\(\)\s*\.\s*split\(\s*["']T["']\s*\)/.test(l.text))
      .map(l => `app.jsx:${l.n}  ${l.text.trim().slice(0, 100)}`);

    expect(offenders).toEqual([]);
  });

  test("no day key is built by slicing an ISO string to 10 characters", () => {
    // The other spelling of the same mistake: `.toISOString().slice(0, 10)`.
    const offenders = codeLines()
      .filter(l => /toISOString\(\)\s*\.\s*(slice|substring|substr)\(\s*0\s*,\s*10\s*\)/.test(l.text))
      .map(l => `app.jsx:${l.n}  ${l.text.trim().slice(0, 100)}`);

    expect(offenders).toEqual([]);
  });

  // Guards the guard. If dateKey or todayKey is renamed or removed, the tests above would keep
  // passing while the codebase quietly lost the only correct way to build a day key.
  test("dateKey and todayKey still exist, and todayKey honours the dev clock", () => {
    const src = fs.readFileSync(SRC, "utf8");

    expect(src).toMatch(/const dateKey = d =>/);
    expect(src).toMatch(/const todayKey = \(\) =>/);

    // todayKey must read the dev offset, or a seeded test day silently reads real today.
    const todayKeyBody = src.slice(src.indexOf("const todayKey = () =>"));
    expect(todayKeyBody.slice(0, 400)).toMatch(/getDevDateOffset\(\)/);

    // dateKey must be built from local getters, not from an ISO string.
    const dateKeyLine = src.split("\n").find(l => l.includes("const dateKey = d =>"));
    expect(dateKeyLine).toMatch(/getFullYear\(\)/);
    expect(dateKeyLine).toMatch(/getMonth\(\)/);
    expect(dateKeyLine).toMatch(/getDate\(\)/);
    expect(dateKeyLine).not.toMatch(/toISOString/);
  });
});
