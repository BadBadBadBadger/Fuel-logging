// weightTrend — the sparse-friendly weight trend on History v2.
// Contract: design/v2/reviews/history-05-ruling.md §4 (owner Q1: yes) and
// features/history/03-history-v2-weight.feature.
//
// The function is LIFTED FROM app.jsx and run for real, not mirrored by hand: a hand copy passes
// forever while the real one drifts (ruling bug B6). weightTrend is written to be self-contained
// for exactly this reason — it uses no other app helper.

const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "app.jsx"), "utf8");
const weightTrend = (() => {
  const start = src.indexOf("function weightTrend(");
  const end   = src.indexOf("// ── Chart plumbing", start);
  if (start < 0 || end < 0) throw new Error("weightTrend not found in app.jsx (REGION HA)");
  return new Function(src.slice(start, end) + "\nreturn weightTrend;")();
})();

// The owner's six readings from the History screenshot (2026-11-21), viewed on 22 Nov.
const OWNER = [
  { date: "2026-10-23", weight: 100.1 },
  { date: "2026-10-28", weight: 97.5 },
  { date: "2026-11-04", weight: 98.5 },
  { date: "2026-11-08", weight: 98.2 },
  { date: "2026-11-18", weight: 98.1 },
  { date: "2026-11-20", weight: 98.2 },
];
const TODAY = "2026-11-22";

describe("the line: a time-weighted EWMA, alpha = 1 - 0.9^days", () => {
  test("starts at the first reading and is evaluated at every reading", () => {
    const { line } = weightTrend(OWNER, TODAY);
    expect(line.map(p => p.date)).toEqual(OWNER.map(w => w.date));
    expect(line.map(p => p.weight)).toEqual(OWNER.map(w => w.weight));
    expect(line[0].trend).toBe(100.1);
  });

  test("each step moves by 1 - 0.9^gap of the distance to the reading", () => {
    const { line } = weightTrend(OWNER, TODAY);
    let t = 100.1;
    const gaps = [5, 7, 4, 10, 2];
    OWNER.slice(1).forEach((w, i) => {
      t = t + (1 - Math.pow(0.9, gaps[i])) * (w.weight - t);
      expect(line[i + 1].trend).toBeCloseTo(t, 2);
    });
  });

  test("the owner's 97.5 low pulls the trend down but does not jump to it", () => {
    const { line } = weightTrend(OWNER, TODAY);
    // 5 days: alpha = 1 - 0.9^5 = 0.41, so 100.1 → about 99.03
    expect(line[1].trend).toBeCloseTo(99.03, 1);
    expect(line[1].trend).toBeGreaterThan(97.5);
    // and it ends a little above the last readings, still settling from 100.1
    expect(line[5].trend).toBeGreaterThan(98.1);
    expect(line[5].trend).toBeLessThan(98.6);
  });

  test("a 7-day gap moves it about 52%", () => {
    const { line } = weightTrend([{ date: "2026-11-01", weight: 100 }, { date: "2026-11-08", weight: 90 }], "2026-11-08");
    expect(line[1].trend).toBeCloseTo(100 - 10 * (1 - Math.pow(0.9, 7)), 2);
    expect(1 - Math.pow(0.9, 7)).toBeCloseTo(0.52, 2);
  });

  test("a daily weigher is smoothed 10% a day", () => {
    const { line } = weightTrend([{ date: "2026-11-01", weight: 100 }, { date: "2026-11-02", weight: 90 }], "2026-11-02");
    expect(line[1].trend).toBeCloseTo(99, 5);
  });

  test("unsorted input, duplicate days (last wins), bad rows and future rows are handled", () => {
    const { line } = weightTrend([
      { date: "2026-11-05", weight: 98 },
      { date: "2026-11-01", weight: 99 },
      { date: "2026-11-05", weight: 97 },
      { date: "2026-11-03", weight: 0 },
      { date: "nope", weight: 98 },
      { date: "2026-11-30", weight: 80 },
    ], "2026-11-22");
    expect(line.map(p => [p.date, p.weight])).toEqual([["2026-11-01", 99], ["2026-11-05", 97]]);
  });

  test("calendar days are counted across the October clock change", () => {
    const { line } = weightTrend([{ date: "2026-10-24", weight: 100 }, { date: "2026-10-26", weight: 90 }], "2026-10-26");
    expect(line[1].trend).toBeCloseTo(100 - 10 * (1 - 0.81), 5);
  });
});

describe("the headline rate: last 28 days, least squares, x7, rounded 0.1", () => {
  test("the owner's readings: 5 in the last 4 weeks over 23 days, +0.1 kg a week", () => {
    const t = weightTrend(OWNER, TODAY);
    // 23 Oct is 30 days before 22 Nov, so it is outside the 28-day window.
    expect(t.n).toBe(5);
    expect(t.spanDays).toBe(23);
    // slope through (0,97.5) (7,98.5) (11,98.2) (21,98.1) (23,98.2) = 6.2/371.2 kg/day
    expect(t.rawRate).toBeCloseTo((6.2 / 371.2) * 7, 6);
    expect(t.rate).toBe(0.1);
    expect(t.level).toBe(false);
  });

  test("the window is fixed to 28 days ending today, not to the readings", () => {
    // Viewed on 25 Nov the 28 Oct reading falls out too: 4 readings, 16 days.
    const t = weightTrend(OWNER, "2026-11-25");
    expect(t.n).toBe(4);
    expect(t.spanDays).toBe(16);
  });

  test("a steady loss reads as a negative rate", () => {
    const w = [0, 7, 14, 21].map(d => ({ date: `2026-11-${String(1 + d).padStart(2, "0")}`, weight: 100 - d * 0.06 }));
    const t = weightTrend(w, "2026-11-22");
    expect(t.rate).toBe(-0.4);   // -0.06 kg/day = -0.42 a week
  });

  test("under 0.1 kg a week is About level", () => {
    const w = [
      { date: "2026-11-01", weight: 98.0 },
      { date: "2026-11-08", weight: 98.1 },
      { date: "2026-11-15", weight: 98.0 },
      { date: "2026-11-21", weight: 98.1 },
    ];
    const t = weightTrend(w, "2026-11-22");
    expect(Math.abs(t.rawRate)).toBeLessThan(0.1);
    expect(t.level).toBe(true);
    expect(t.rate).toBe(0);
  });

  test("needs 3 readings: two readings far apart give no rate", () => {
    const t = weightTrend([{ date: "2026-11-01", weight: 99 }, { date: "2026-11-20", weight: 98 }], "2026-11-22");
    expect(t.rate).toBeNull();
    expect(t.n).toBe(2);
  });

  test("needs 10 days of span: three readings over 9 days give no rate", () => {
    const t = weightTrend([
      { date: "2026-11-10", weight: 99 }, { date: "2026-11-15", weight: 98.5 }, { date: "2026-11-19", weight: 98 },
    ], "2026-11-22");
    expect(t.spanDays).toBe(9);
    expect(t.rate).toBeNull();
  });

  test("exactly 3 readings over exactly 10 days is enough", () => {
    const t = weightTrend([
      { date: "2026-11-10", weight: 99 }, { date: "2026-11-15", weight: 98.5 }, { date: "2026-11-20", weight: 98 },
    ], "2026-11-22");
    expect(t.spanDays).toBe(10);
    expect(t.rate).toBe(-0.7);
  });

  test("no readings: empty line, no rate", () => {
    expect(weightTrend([], TODAY)).toMatchObject({ line: [], rate: null, n: 0, spanDays: 0, level: false });
    expect(weightTrend(undefined, TODAY).line).toEqual([]);
  });
});
