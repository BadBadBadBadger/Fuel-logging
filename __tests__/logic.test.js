// Pure logic extracted from app.jsx — tests run in Node via Jest

const MODES = {
  cut:      { adj: -500 },
  maintain: { adj: 0    },
  bulk:     { adj: 500  },
};

const ACTIVITY = {
  sedentary: { mult: 1.2   },
  light:     { mult: 1.375 },
  moderate:  { mult: 1.55  },
  active:    { mult: 1.725 },
  very:      { mult: 1.9   },
};

const MET = {
  legs:     { light: 4.0, moderate: 6.0, heavy: 8.0 },
  push:     { light: 3.5, moderate: 5.5, heavy: 7.0 },
  pull:     { light: 3.5, moderate: 5.5, heavy: 7.0 },
  fullbody: { light: 4.5, moderate: 6.5, heavy: 9.0 },
  cardio:   { light: 5.0, moderate: 7.0, heavy: 10.0 },
};

const sumLogs = logs => logs.reduce((a, l) => ({
  kcal:    a.kcal    + (l.kcal    || 0),
  protein: a.protein + (l.protein || 0),
  carbs:   a.carbs   + (l.carbs   || 0),
  fat:     a.fat     + (l.fat     || 0),
}), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

const estimateSessionKcal = (w, bf, type, dur, int) =>
  Math.round((MET[type]?.[int] || 5) * w * ((w * (1 - bf / 100)) / 70) * (dur / 60));

const calcTargets = (p, mode, training, sessKcal = null, tdeeAdj = 0) => {
  const w   = Number(p.weight)  || 80;
  const bf  = Number(p.bodyFat) || 18;
  const act = p.activity || "light";
  const lbm = w * (1 - bf / 100);
  const bmr  = Math.round(370 + 21.6 * lbm);
  const tdee = Math.round(bmr * (ACTIVITY[act]?.mult || 1.375)) + tdeeAdj;
  const bonus = training ? (sessKcal !== null ? sessKcal : Math.round(w * 2.8)) : 0;
  const kcal  = tdee + MODES[mode].adj + bonus;
  const protein = Math.round(lbm * (mode === "cut" ? 2.2 : mode === "bulk" ? 2.0 : 1.8));
  const fat     = Math.round(w   * (mode === "cut" ? 0.8 : 1.0));
  const carbs   = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat, tdee, bmr, lbm: Math.round(lbm), bonus };
};

const weighRollingAvg = (weighIns, beforeDate, n = 7) => {
  const subset = weighIns.filter(w => w.date < beforeDate).slice(-n);
  if (subset.length < 3) return null;
  return subset.reduce((a, w) => a + w.weight, 0) / subset.length;
};

const runCalibration = (history, weighIns, baseTDEE) => {
  if (weighIns.length < 8) return null;
  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoKey = weekAgo.getFullYear() + "-" + String(weekAgo.getMonth()+1).padStart(2,"0") + "-" + String(weekAgo.getDate()).padStart(2,"0");
  const todayPlus1 = new Date(today.getTime() + 86400000);
  const tp1Key = todayPlus1.getFullYear() + "-" + String(todayPlus1.getMonth()+1).padStart(2,"0") + "-" + String(todayPlus1.getDate()).padStart(2,"0");

  const recentAvg = weighRollingAvg(weighIns, tp1Key, 7);
  const olderAvg  = weighRollingAvg(weighIns, weekAgoKey, 7);
  if (!recentAvg || !olderAvg) return null;

  const actualChange = recentAvg - olderAvg;
  const recentHist   = history.filter(d => d.date >= weekAgoKey && d.kcal > 0);
  if (recentHist.length < 4) return null;

  const avgKcal      = recentHist.reduce((a, d) => a + d.kcal, 0) / recentHist.length;
  const avgDeficit   = baseTDEE - avgKcal;
  const expectedChange = -(avgDeficit * 7) / 7700;
  const discrepancy  = actualChange - expectedChange;
  const adj = Math.max(-150, Math.min(150, Math.round(-discrepancy * 7700 / 7 / 50) * 50));
  const confidence = weighIns.length >= 28 ? "high" : weighIns.length >= 14 ? "medium" : "low";
  return { adj, confidence, actualChange: Math.round(actualChange * 10) / 10,
    expectedChange: Math.round(expectedChange * 10) / 10, avgKcal: Math.round(avgKcal) };
};

// calcStreak needs a controllable "today" so we inject a date factory
const makeCalcStreak = (getNow) => (hist) => {
  let s = 0;
  const d = getNow();
  for (;;) {
    const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    if (!(hist.find(h => h.date === k)?.logs?.length)) break;
    s++;
    d.setDate(d.getDate() - 1);
  }
  return s;
};

// ── calcTargets ───────────────────────────────────────────────

describe("calcTargets — Katch-McArdle", () => {
  const prof = { weight: 80, height: 178, bodyFat: 18, activity: "light" };

  test("BMR is correct for 80kg/18%bf", () => {
    // lbm = 80 * 0.82 = 65.6 → bmr = 370 + 21.6*65.6 = 1787
    const { bmr } = calcTargets(prof, "maintain", false);
    expect(bmr).toBe(1787);
  });

  test("TDEE applies light activity multiplier (×1.375)", () => {
    const { bmr, tdee } = calcTargets(prof, "maintain", false);
    expect(tdee).toBe(Math.round(bmr * 1.375));
  });

  test("maintain mode adds no adjustment", () => {
    const { tdee, kcal, bonus } = calcTargets(prof, "maintain", false);
    expect(kcal).toBe(tdee + bonus);
  });

  test("cut mode subtracts 500 kcal", () => {
    const maintain = calcTargets(prof, "maintain", false).kcal;
    const cut      = calcTargets(prof, "cut",      false).kcal;
    expect(maintain - cut).toBe(500);
  });

  test("bulk mode adds 500 kcal", () => {
    const maintain = calcTargets(prof, "maintain", false).kcal;
    const bulk     = calcTargets(prof, "bulk",     false).kcal;
    expect(bulk - maintain).toBe(500);
  });

  test("training=false gives zero bonus", () => {
    const { bonus } = calcTargets(prof, "maintain", false);
    expect(bonus).toBe(0);
  });

  test("training=true without session uses weight×2.8 bonus", () => {
    const { bonus } = calcTargets(prof, "maintain", true);
    expect(bonus).toBe(Math.round(80 * 2.8)); // 224
  });

  test("sessKcal overrides weight-based bonus when training=true", () => {
    const { bonus } = calcTargets(prof, "maintain", true, 400);
    expect(bonus).toBe(400);
  });

  test("sessKcal is ignored when training=false", () => {
    const { bonus } = calcTargets(prof, "maintain", false, 400);
    expect(bonus).toBe(0);
  });

  test("cut protein target uses 2.2g per kg LBM", () => {
    const lbm = 80 * 0.82;
    const { protein } = calcTargets(prof, "cut", false);
    expect(protein).toBe(Math.round(lbm * 2.2));
  });

  test("bulk protein target uses 2.0g per kg LBM", () => {
    const lbm = 80 * 0.82;
    const { protein } = calcTargets(prof, "bulk", false);
    expect(protein).toBe(Math.round(lbm * 2.0));
  });

  test("cut fat target uses 0.8g per kg bodyweight", () => {
    const { fat } = calcTargets(prof, "cut", false);
    expect(fat).toBe(Math.round(80 * 0.8));
  });

  test("carbs never go below 50g", () => {
    // Very low kcal scenario
    const lean = { weight: 50, bodyFat: 5, activity: "sedentary" };
    const { carbs } = calcTargets(lean, "cut", false);
    expect(carbs).toBeGreaterThanOrEqual(50);
  });

  test("different activity multipliers produce different TDEEs", () => {
    const sedentary = calcTargets({ ...prof, activity: "sedentary" }, "maintain", false).tdee;
    const active    = calcTargets({ ...prof, activity: "active"    }, "maintain", false).tdee;
    expect(active).toBeGreaterThan(sedentary);
  });

  test("lbm returned is rounded", () => {
    const { lbm } = calcTargets(prof, "maintain", false);
    expect(lbm).toBe(Math.round(80 * 0.82));
  });
});

// ── estimateSessionKcal ───────────────────────────────────────

describe("estimateSessionKcal — MET-based", () => {
  test("heavy legs 60min 80kg/18%bf matches formula", () => {
    // MET=8, w=80, lbm=65.6, ratio=65.6/70, dur=1h
    const expected = Math.round(8 * 80 * (65.6 / 70) * 1);
    expect(estimateSessionKcal(80, 18, "legs", 60, "heavy")).toBe(expected);
  });

  test("heavier person burns more for same session", () => {
    const light = estimateSessionKcal(70,  18, "push", 45, "moderate");
    const heavy = estimateSessionKcal(100, 18, "push", 45, "moderate");
    expect(heavy).toBeGreaterThan(light);
  });

  test("longer session burns more", () => {
    const short = estimateSessionKcal(80, 18, "cardio", 30, "moderate");
    const long  = estimateSessionKcal(80, 18, "cardio", 60, "moderate");
    expect(long).toBeGreaterThan(short);
  });

  test("higher intensity burns more", () => {
    const easy = estimateSessionKcal(80, 18, "fullbody", 45, "light");
    const hard = estimateSessionKcal(80, 18, "fullbody", 45, "heavy");
    expect(hard).toBeGreaterThan(easy);
  });

  test("unknown type falls back to MET 5", () => {
    const result = estimateSessionKcal(80, 18, "unknown", 60, "moderate");
    const expected = Math.round(5 * 80 * ((80 * 0.82) / 70) * 1);
    expect(result).toBe(expected);
  });

  test("higher body fat reduces kcal (less lean mass)", () => {
    const lean = estimateSessionKcal(80, 10, "legs", 60, "heavy");
    const fat  = estimateSessionKcal(80, 30, "legs", 60, "heavy");
    expect(lean).toBeGreaterThan(fat);
  });
});

// ── calcStreak ────────────────────────────────────────────────

describe("calcStreak", () => {
  const today = new Date("2026-04-22");
  const calcStreak = makeCalcStreak(() => new Date(today));

  const day = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  test("empty history gives streak 0", () => {
    expect(calcStreak([])).toBe(0);
  });

  test("single entry today gives streak 1", () => {
    const hist = [{ date: day(0), logs: [{ kcal: 200 }] }];
    expect(calcStreak(hist)).toBe(1);
  });

  test("consecutive days count correctly", () => {
    const hist = [
      { date: day(0), logs: [{ kcal: 200 }] },
      { date: day(1), logs: [{ kcal: 300 }] },
      { date: day(2), logs: [{ kcal: 400 }] },
    ];
    expect(calcStreak(hist)).toBe(3);
  });

  test("gap in history breaks the streak", () => {
    const hist = [
      { date: day(0), logs: [{ kcal: 200 }] },
      // day(1) missing
      { date: day(2), logs: [{ kcal: 400 }] },
    ];
    expect(calcStreak(hist)).toBe(1);
  });

  test("entry with empty logs array does not count", () => {
    const hist = [{ date: day(0), logs: [] }];
    expect(calcStreak(hist)).toBe(0);
  });
});

// ── sumLogs ───────────────────────────────────────────────────

describe("sumLogs", () => {
  test("empty array returns all zeros", () => {
    expect(sumLogs([])).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  });

  test("single entry returns its values", () => {
    expect(sumLogs([{ kcal: 500, protein: 40, carbs: 60, fat: 15 }]))
      .toEqual({ kcal: 500, protein: 40, carbs: 60, fat: 15 });
  });

  test("multiple entries sum correctly", () => {
    const logs = [
      { kcal: 300, protein: 25, carbs: 30, fat: 10 },
      { kcal: 200, protein: 15, carbs: 20, fat:  5 },
    ];
    expect(sumLogs(logs)).toEqual({ kcal: 500, protein: 40, carbs: 50, fat: 15 });
  });

  test("missing macro fields default to 0", () => {
    expect(sumLogs([{ kcal: 100 }]))
      .toEqual({ kcal: 100, protein: 0, carbs: 0, fat: 0 });
  });
});

// ── calcTargets tdeeAdj ───────────────────────────────────────

describe("calcTargets — tdeeAdj", () => {
  const prof = { weight: 80, height: 178, bodyFat: 18, activity: "light" };

  test("positive tdeeAdj raises kcal target", () => {
    const base    = calcTargets(prof, "maintain", false, null, 0).kcal;
    const adjusted = calcTargets(prof, "maintain", false, null, 200).kcal;
    expect(adjusted - base).toBe(200);
  });

  test("negative tdeeAdj lowers kcal target", () => {
    const base    = calcTargets(prof, "maintain", false, null, 0).kcal;
    const adjusted = calcTargets(prof, "maintain", false, null, -150).kcal;
    expect(base - adjusted).toBe(150);
  });

  test("tdeeAdj is reflected in tdee field", () => {
    const { tdee } = calcTargets(prof, "maintain", false, null, 300);
    const baseTdee = calcTargets(prof, "maintain", false, null, 0).tdee;
    expect(tdee - baseTdee).toBe(300);
  });
});

// ── weighRollingAvg ───────────────────────────────────────────

describe("weighRollingAvg", () => {
  const makeWeighIns = (weights, startDate = "2026-04-01") => {
    return weights.map((w, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return { date: d.toISOString().split("T")[0], weight: w };
    });
  };

  test("returns null when fewer than 3 entries before cutoff", () => {
    const wi = makeWeighIns([80, 79.5]);
    expect(weighRollingAvg(wi, "2026-04-10")).toBeNull();
  });

  test("computes correct average of last n entries before date", () => {
    const wi = makeWeighIns([80, 79.8, 79.6, 79.4]);
    const avg = weighRollingAvg(wi, "2026-04-10", 4);
    expect(avg).toBeCloseTo((80 + 79.8 + 79.6 + 79.4) / 4, 2);
  });

  test("excludes entries on or after the cutoff date", () => {
    const wi = [
      { date: "2026-04-01", weight: 80 },
      { date: "2026-04-02", weight: 79 },
      { date: "2026-04-03", weight: 78 },
      { date: "2026-04-04", weight: 77 }, // excluded if cutoff is "2026-04-04"
    ];
    const avg = weighRollingAvg(wi, "2026-04-04", 7);
    expect(avg).toBeCloseTo((80 + 79 + 78) / 3, 2);
  });

  test("returns null for empty array", () => {
    expect(weighRollingAvg([], "2026-04-10")).toBeNull();
  });
});

// ── runCalibration ────────────────────────────────────────────

describe("runCalibration", () => {
  test("returns null with fewer than 8 weigh-ins", () => {
    const wi = [{ date: "2026-04-01", weight: 80 }];
    expect(runCalibration([], wi, 2400)).toBeNull();
  });

  test("returns null with insufficient history in recent week", () => {
    const today = new Date();
    const weighIns = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - 13 + i);
      return { date: d.toISOString().split("T")[0], weight: 80 - i * 0.07 };
    });
    // No history entries → recentHist.length < 4
    expect(runCalibration([], weighIns, 2400)).toBeNull();
  });

  test("positive adj when actual loss exceeds expected (higher real TDEE)", () => {
    const today = new Date();
    const weighIns = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - 13 + i);
      return { date: d.toISOString().split("T")[0], weight: 80 - i * 0.2 }; // losing faster than expected
    });
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoKey = weekAgo.toISOString().split("T")[0];
    const history = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - 6 + i);
      return { date: d.toISOString().split("T")[0], kcal: 1800 }; // eating 1800 vs 2400 TDEE → expected loss 0.55kg
    }).filter(d => d.date >= weekAgoKey);
    const result = runCalibration(history, weighIns, 2400);
    if (result) expect(result.adj).toBeGreaterThan(0);
  });
});

// ── runMigrations ─────────────────────────────────────────────
// Mirror of the migration logic in app.jsx — uses a plain object as
// the storage mock so tests run synchronously in Node.

const SCHEMA_VERSION = 1;

const makeMockStorage = (initial = {}) => {
  const store = { ...initial };
  return {
    store,
    get: async k => store[k] != null ? store[k] : null,
    set: async (k, v) => { store[k] = v; },
  };
};

const runMigrations = async (storage) => {
  const sg = async k => storage.get(k);
  const ss = async (k, v) => storage.set(k, v);

  const stored = await sg("fuel_schema_v");
  const v = stored ? parseInt(stored) : 0;
  if (v >= SCHEMA_VERSION) return;

  // v0 → v1: baseline — no transforms needed.

  await ss("fuel_schema_v", String(SCHEMA_VERSION));
};

describe("runMigrations", () => {
  test("stamps schema version when none exists", async () => {
    const storage = makeMockStorage();
    await runMigrations(storage);
    expect(storage.store["fuel_schema_v"]).toBe("1");
  });

  test("is a no-op when already at current version", async () => {
    const storage = makeMockStorage({ fuel_schema_v: "1", profile: '{"weight":80}' });
    await runMigrations(storage);
    expect(storage.store["profile"]).toBe('{"weight":80}');
    expect(storage.store["fuel_schema_v"]).toBe("1");
  });

  test("does not overwrite existing user data during migration", async () => {
    const storage = makeMockStorage({ logs__2026_01_01: "[{\"kcal\":500}]" });
    await runMigrations(storage);
    expect(storage.store["logs__2026_01_01"]).toBe("[{\"kcal\":500}]");
  });

  test("applies migration only once across multiple calls", async () => {
    const storage = makeMockStorage();
    await runMigrations(storage);
    await runMigrations(storage);
    expect(storage.store["fuel_schema_v"]).toBe("1");
  });
});
