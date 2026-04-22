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

const calcTargets = (p, mode, training, sessKcal = null) => {
  const w   = Number(p.weight)  || 80;
  const bf  = Number(p.bodyFat) || 18;
  const act = p.activity || "light";
  const lbm = w * (1 - bf / 100);
  const bmr  = Math.round(370 + 21.6 * lbm);
  const tdee = Math.round(bmr * (ACTIVITY[act]?.mult || 1.375));
  const bonus = training ? (sessKcal !== null ? sessKcal : Math.round(w * 2.8)) : 0;
  const kcal  = tdee + MODES[mode].adj + bonus;
  const protein = Math.round(lbm * (mode === "cut" ? 2.2 : mode === "bulk" ? 2.0 : 1.8));
  const fat     = Math.round(w   * (mode === "cut" ? 0.8 : 1.0));
  const carbs   = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat, tdee, bmr, lbm: Math.round(lbm), bonus };
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
