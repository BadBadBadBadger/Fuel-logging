// Range windows, averages and the weight trend — features/history/01.
//
// Mirror of app.jsx, in the style of logic.test.js. FL-001 shipped because the History cutoffs
// were never mirrored there at all, so 370 passing tests said nothing about them.
// __tests__/datekeys.test.js guards the UTC idiom statically; this file owns the arithmetic.

const dateKey = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
const RANGE_DAYS = { W:7, "30D":30, "3M":90, "1Y":365, ALL:0 };

const rangeWindow = (range, nowMs) => {
  const to = dateKey(new Date(nowMs));
  const n  = RANGE_DAYS[range];
  if (!n) return { from:"", to };
  const s = new Date(nowMs);
  s.setDate(s.getDate() - n);
  return { from: dateKey(s), to };
};

const hasIntake = row =>
  !!row && ((Number(row.kcal) || 0) > 0 || (row.logs && row.logs.length > 0));

const avgRowsOf = (rows, todayK) => rows.filter(d => d.date < todayK && hasIntake(d));

const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtRange = (fromKey, toKey) => {
  if (!fromKey || !toKey) return "";
  const a = new Date(fromKey + "T12:00:00"), b = new Date(toKey + "T12:00:00");
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
    ? `${a.getDate()}–${b.getDate()} ${MON_SHORT[b.getMonth()]}`
    : `${a.getDate()} ${MON_SHORT[a.getMonth()]}–${b.getDate()} ${MON_SHORT[b.getMonth()]}`;
};
const fmtDay = key => {
  if (!key) return "";
  const d = new Date(key + "T12:00:00");
  return `${d.getDate()} ${MON_SHORT[d.getMonth()]}`;
};

const WEIGHT_MEAN_MIN_READINGS = 3;
const rollingWeightMean = (weighIns, key, spanDays = 7, minReadings = WEIGHT_MEAN_MIN_READINGS) => {
  const s = new Date(key + "T12:00:00");
  s.setDate(s.getDate() - (spanDays - 1));
  const from = dateKey(s);
  const win = weighIns.filter(w => w.date >= from && w.date <= key);
  if (win.length < minReadings) return null;
  return { kg: win.reduce((a, w) => a + w.weight, 0) / win.length, n: win.length, from, to: key };
};

const WEIGHT_TREND_MIN_PER_WINDOW = 2;
const weightTrendKg = (weighIns, toKey, spanDays = 7) => {
  const recent = rollingWeightMean(weighIns, toKey, spanDays, WEIGHT_TREND_MIN_PER_WINDOW);
  const pe = new Date(toKey + "T12:00:00");
  pe.setDate(pe.getDate() - spanDays);
  const prior = rollingWeightMean(weighIns, dateKey(pe), spanDays, WEIGHT_TREND_MIN_PER_WINDOW);
  if (!recent || !prior) return null;
  return { kg: Math.round((recent.kg - prior.kg) * 10) / 10, recent, prior, from: prior.from, to: recent.to };
};

// The account state reported from a live session on 13 Sep 2026.
const REPORTED_KCAL = { "2026-09-06":2665, "2026-09-07":2580, "2026-09-08":2334, "2026-09-09":2228,
                        "2026-09-10":2504, "2026-09-11":2927, "2026-09-12":2331, "2026-09-13":0 };
const REPORTED_FAT  = { "2026-09-06":67, "2026-09-07":72, "2026-09-08":80, "2026-09-09":80,
                        "2026-09-10":83, "2026-09-11":79, "2026-09-12":83, "2026-09-13":0 };
const reportedRows = () => Object.keys(REPORTED_KCAL).map(date => ({
  date, kcal: REPORTED_KCAL[date], fat: REPORTED_FAT[date],
  logs: REPORTED_KCAL[date] > 0 ? [{ kcal: REPORTED_KCAL[date] }] : [],
}));
const at = (key, hour) => new Date(`${key}T${String(hour).padStart(2,"0")}:00:00`).getTime();

describe("rangeWindow — local day keys, fixed size", () => {
  test("7 Days is eight inclusive keys, so the chart and day list keep every row", () => {
    expect(rangeWindow("W", at("2026-09-13", 12))).toEqual({ from:"2026-09-06", to:"2026-09-13" });
  });

  test("the window does not change size with the hour it is read", () => {
    // The UTC idiom shifted the boundary late evening and again just after local midnight.
    expect(rangeWindow("W", at("2026-09-13", 0))).toEqual(rangeWindow("W", at("2026-09-13", 23)));
  });

  test("ALL has no lower bound instead of doing arithmetic on 99999 days", () => {
    expect(rangeWindow("ALL", at("2026-09-13", 12)).from).toBe("");
  });

  test("a window crossing a month boundary still spans the right number of days", () => {
    expect(rangeWindow("W", at("2026-09-03", 12))).toEqual({ from:"2026-08-27", to:"2026-09-03" });
  });

  test("30 days is thirty-one inclusive keys, the same shape as the week", () => {
    expect(rangeWindow("30D", at("2026-09-13", 12))).toEqual({ from:"2026-08-14", to:"2026-09-13" });
  });
});

describe("FL-001 — the average divides by complete days with intake", () => {
  test("the reported week averages 2510 kcal, not 2196", () => {
    const rows = avgRowsOf(reportedRows(), "2026-09-13");
    expect(rows.length).toBe(7);
    const avg = rows.reduce((a, d) => a + d.kcal, 0) / rows.length;
    expect(Math.round(avg)).toBe(2510);
    expect(Math.round(avg)).not.toBe(2196); // 17569/8 — what shipped
  });

  test("the reported week averages 78g fat, not 68g", () => {
    const rows = avgRowsOf(reportedRows(), "2026-09-13");
    const avg = rows.reduce((a, d) => a + d.fat, 0) / rows.length;
    expect(Math.round(avg)).toBe(78);
    expect(Math.round(avg)).not.toBe(68); // 544/8 — what shipped
  });

  test("today is excluded even once it has real intake, so the number holds still all day", () => {
    const rows = reportedRows().map(d => d.date === "2026-09-13"
      ? { ...d, kcal:1800, fat:60, logs:[{ kcal:1800 }] } : d);
    const kept = avgRowsOf(rows, "2026-09-13");
    expect(Math.round(kept.reduce((a, d) => a + d.kcal, 0) / kept.length)).toBe(2510);
  });

  test("a past day the app was merely opened is not counted as a favourable zero", () => {
    // The daily snapshot effect writes a row every day the app is opened, logged or not.
    const rows = [{ date:"2026-09-05", kcal:0, fat:0, logs:[] }, ...reportedRows()];
    const kept = avgRowsOf(rows, "2026-09-13");
    expect(kept.length).toBe(7);
    expect(kept.some(d => d.date === "2026-09-05")).toBe(false);
  });

  test("a day with kcal but no logs array still counts — sync can arrive in that order", () => {
    expect(hasIntake({ kcal:2228, logs:[] })).toBe(true);
    expect(hasIntake({ kcal:0, logs:[] })).toBe(false);
    expect(hasIntake({ kcal:0, logs:[{ kcal:0 }] })).toBe(true);
    expect(hasIntake(undefined)).toBe(false);
  });

  test("no complete days yet yields an empty set, not a divide by zero", () => {
    const rows = [{ date:"2026-09-13", kcal:500, fat:20, logs:[{ kcal:500 }] }];
    expect(avgRowsOf(rows, "2026-09-13")).toEqual([]);
  });
});

describe("FL-013 — the rolling weight mean is calendar-based and not starved by the view", () => {
  const flatWeek = [
    { date:"2026-09-06", weight:97.1 },  // the one low reading the report blames
    { date:"2026-09-07", weight:98.5 }, { date:"2026-09-08", weight:98.5 },
    { date:"2026-09-09", weight:98.5 }, { date:"2026-09-10", weight:98.5 },
    { date:"2026-09-11", weight:98.5 }, { date:"2026-09-12", weight:98.5 },
  ];

  test("a window is a fixed span of calendar days, not a count of readings", () => {
    const m = rollingWeightMean(flatWeek, "2026-09-12", 7);
    expect(m.from).toBe("2026-09-06");
    expect(m.n).toBe(7);
  });

  test("a gap day does not pull an older reading in to make the count up", () => {
    const withGap = flatWeek.filter(w => w.date !== "2026-09-12");
    const m = rollingWeightMean(withGap, "2026-09-12", 7);
    expect(m.n).toBe(6);
    expect(m.from).toBe("2026-09-06");
  });

  test("the mean at a date is the same whichever range is on screen", () => {
    // The old version rolled over the RANGE-FILTERED array, so the 7-day chip starved the left
    // end and the same labelled quantity changed when the chip changed.
    const long = Array.from({ length:30 }, (_, i) => {
      const d = new Date("2026-09-12T12:00:00"); d.setDate(d.getDate() - i);
      return { date: dateKey(d), weight: 98.5 };
    }).reverse();
    const fromFull   = rollingWeightMean(long, "2026-09-12", 7).kg;
    const fromWindow = rollingWeightMean(long.filter(w => w.date >= "2026-09-06"), "2026-09-12", 7).kg;
    expect(fromFull).toBeCloseTo(fromWindow, 5);
  });

  test("it returns null under three readings instead of averaging thin air", () => {
    expect(rollingWeightMean(flatWeek.slice(0, 2), "2026-09-07", 7)).toBeNull();
  });
});

describe("Q4 — the weight figure compares two non-overlapping weeks", () => {
  const series = kgFor => Array.from({ length:21 }, (_, i) => {
    const d = new Date("2026-09-13T12:00:00"); d.setDate(d.getDate() - (20 - i));
    return { date: dateKey(d), weight: kgFor(i) };
  });

  test("a genuinely flat fortnight reports no change", () => {
    expect(weightTrendKg(series(() => 98.5), "2026-09-13").kg).toBe(0);
  });

  test("the two windows never overlap, so no mean is differenced against itself", () => {
    const t = weightTrendKg(series(() => 98.5), "2026-09-13");
    expect(t.recent.from).toBe("2026-09-07");
    expect(t.prior.to).toBe("2026-09-06");
    expect(t.prior.to < t.recent.from).toBe(true);
  });

  test("a steady half-kilo weekly loss reports about half a kilo", () => {
    const t = weightTrendKg(series(i => 100 - i * (0.5 / 7)), "2026-09-13");
    expect(t.kg).toBeCloseTo(-0.5, 1);
  });

  test("one low first reading no longer drives the figure", () => {
    const s = series(() => 98.5);
    s[0] = { ...s[0], weight: 97.1 };
    expect(Math.abs(weightTrendKg(s, "2026-09-13").kg)).toBeLessThanOrEqual(0.1);
  });

  test("it returns null when either week is too thin to average", () => {
    const sparse = [{ date:"2026-09-12", weight:98.5 }, { date:"2026-09-13", weight:98.4 }];
    expect(weightTrendKg(sparse, "2026-09-13")).toBeNull();
  });
});

describe("fmtRange — one format for every window label", () => {
  test("a window inside one month names the month once", () => {
    expect(fmtRange("2026-09-06", "2026-09-12")).toBe("6–12 Sep");
  });
  test("a window crossing months names both", () => {
    expect(fmtRange("2026-08-27", "2026-09-03")).toBe("27 Aug–3 Sep");
  });
  test("an absent lower bound formats as nothing, not as 'Invalid Date'", () => {
    expect(fmtRange("", "2026-09-13")).toBe("");
  });
  test("the month name does not depend on the platform's date formatter", () => {
    // en-GB renders September as "Sept" in Node and "Sep" in some browsers.
    expect(fmtRange("2026-09-06", "2026-09-12")).not.toMatch(/Sept/);
  });
  test("a single date formats the same way, for 'vs 14 Aug'", () => {
    expect(fmtDay("2026-08-14")).toBe("14 Aug");
    expect(fmtDay("")).toBe("");
  });
});
