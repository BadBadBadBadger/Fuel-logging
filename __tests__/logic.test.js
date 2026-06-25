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

// Confidence model (Separated) — mirror of app.jsx
const tdeeConfidence = weighInCount =>
  weighInCount >= 28 ? 92 : weighInCount >= 14 ? 80 : weighInCount >= 7 ? 65 : 50;
const intakeConfidence = logs => {
  const kcal = logs.reduce((a, l) => a + (l.kcal || 0), 0);
  if (kcal <= 0) return 100;
  const weighted = logs.reduce((a, l) => a + (l.conf == null ? 100 : l.conf) * (l.kcal || 0), 0);
  return Math.round(weighted / kcal);
};

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

// ── Macro floor engine (feature #7) — mirror of app.jsx computeMacros ──────────
const PROTEIN_PER_LBM  = { male: 2.2, female: 2.0 };
const FAT_FLOOR_PER_KG = 0.6;
const FAT_MODE_PER_KG  = {
  male:   { cut: 0.8, maintain: 1.0, bulk: 1.0 },
  female: { cut: 0.7, maintain: 0.9, bulk: 0.9 },
};
const MIN_CARBS_G = 50;

const computeMacros = (p, mode, kcal) => {
  const w   = Number(p.weight)  || 80;
  const bf  = Number(p.bodyFat) || 18;
  const sex = p.sex === "female" ? "female" : "male";
  const lbm = w * (1 - bf / 100);

  const protein  = Math.round(lbm * PROTEIN_PER_LBM[sex]);
  const fatPerKg = Math.max(FAT_FLOOR_PER_KG, (FAT_MODE_PER_KG[sex][mode] ?? FAT_MODE_PER_KG[sex].maintain));
  const fat      = Math.round(w * fatPerKg);

  const floorKcal = protein * 4 + fat * 9;
  const carbs     = Math.max(MIN_CARBS_G, Math.round((kcal - floorKcal) / 4));
  const floorsExceedKcal = floorKcal + MIN_CARBS_G * 4 > kcal;

  return { protein, carbs, fat, lbm: Math.round(lbm), floorsExceedKcal };
};

// ── Dietary / allergies (feature #8) — mirror of app.jsx pure helpers ──────────
const normaliseDietary = d => ({
  diets:     d && Array.isArray(d.diets)     ? d.diets     : [],
  allergens: d && Array.isArray(d.allergens) ? d.allergens : [],
  dislikes:  d && Array.isArray(d.dislikes)  ? d.dislikes  : [],
});
const dietaryPromptBlock = (d) => {
  const c = normaliseDietary(d);
  const lines = [];
  if (c.diets.length)
    lines.push(`- DIET (hard rule): the user follows ${c.diets.join(", ")}. Never suggest, name or include any food that violates these diets.`);
  if (c.allergens.length)
    lines.push(`- ALLERGIES (hard SAFETY rule): the user is allergic to ${c.allergens.join(", ")}. Never suggest, name or include any food containing these — or any dish that typically contains them. This is a medical safety constraint.`);
  if (c.dislikes.length)
    lines.push(`- DISLIKES (soft preference): avoid ${c.dislikes.join(", ")} where reasonable; this is a preference, not a safety rule.`);
  return lines.length ? `\nDietary constraints:\n${lines.join("\n")}\n` : "";
};
const ALLERGEN_SYNONYMS = {
  "tree nuts":   ["tree nut","almond","walnut","cashew","pecan","pistachio","hazelnut","macadamia","brazil nut","praline","nutella","marzipan"],
  "peanuts":     ["peanut","groundnut","satay"],
  "milk":        ["milk","dairy","cheese","butter","cream","yogurt","yoghurt","whey","casein","custard"],
  "eggs":        ["egg","mayonnaise","mayo","meringue"],
  "gluten":      ["gluten","wheat","barley","rye","bread","pasta","flour","breaded","batter","couscous"],
  "crustaceans": ["crustacean","prawn","shrimp","crab","lobster","langoustine"],
  "molluscs":    ["mollusc","mussel","clam","oyster","squid","octopus","scallop","snail"],
  "soya":        ["soya","soy","tofu","edamame","miso","tempeh"],
  "fish":        ["fish","salmon","tuna","cod","haddock","anchovy","mackerel","sardine"],
  "sesame":      ["sesame","tahini","hummus"],
  "celery":      ["celery","celeriac"],
  "mustard":     ["mustard"],
  "sulphites":   ["sulphite","sulfite"],
  "lupin":       ["lupin"],
};
const scanAllergens = (text, allergens) => {
  if (!text || !allergens || !allergens.length) return [];
  const hay = String(text).toLowerCase();
  const hits = [];
  for (const a of allergens) {
    const key   = String(a).toLowerCase();
    const terms = ALLERGEN_SYNONYMS[key] || [key];
    const found = terms.some(t => new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(hay));
    if (found) hits.push(a);
  }
  return hits;
};

// ── Coach pacing (feature #6) — mirror of app.jsx paceVerdict ──────────────────
const EATING_WINDOW_H = 14;
const paceVerdict = (firstMealHour, nowHour, frac) => {
  if (firstMealHour == null) return { elapsed: 0, verdict: "ahead" };
  let elapsed = (nowHour - firstMealHour) / EATING_WINDOW_H;
  elapsed = Math.max(0, Math.min(1, elapsed));
  if (frac >= 1)              return { elapsed, verdict: "met" };
  if (elapsed < 0.25)         return { elapsed, verdict: "ahead" };
  if (frac >= elapsed)        return { elapsed, verdict: "ahead" };
  if (frac >= elapsed - 0.15) return { elapsed, verdict: "on" };
  return { elapsed, verdict: "behind" };
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

  // Confidence-weight intake; drop near-guess days (<50%) so a biased AI estimate
  // can't silently retrain TDEE. Days without inspectable logs default to 100%.
  const trusted = recentHist
    .map(d => ({ kcal: d.kcal, w: (d.logs ? intakeConfidence(d.logs) : 100) / 100 }))
    .filter(x => x.w >= 0.5);
  if (trusted.length < 4) return null;
  const wSum         = trusted.reduce((a, x) => a + x.w, 0);
  const avgKcal      = trusted.reduce((a, x) => a + x.kcal * x.w, 0) / wSum;
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

// ── computeMacros — macro floor engine (#7) ───────────────────
describe("computeMacros — floors hold, carbs absorb", () => {
  const man   = { weight: 80, bodyFat: 18, sex: "male"   }; // lbm 65.6
  const woman = { weight: 70, bodyFat: 25, sex: "female" }; // lbm 52.5

  test("protein is identical across cut, maintain and bulk", () => {
    const cut      = computeMacros(man, "cut",      1800).protein;
    const maintain = computeMacros(man, "maintain", 2300).protein;
    const bulk     = computeMacros(man, "bulk",     2800).protein;
    expect(cut).toBe(maintain);
    expect(maintain).toBe(bulk);
  });

  test("male protein floor is 2.2 g/kg LBM", () => {
    expect(computeMacros(man, "maintain", 2300).protein).toBe(Math.round(65.6 * 2.2));
  });

  test("female protein floor is 2.0 g/kg LBM and lower than a man at equal LBM", () => {
    expect(computeMacros(woman, "maintain", 2000).protein).toBe(Math.round(52.5 * 2.0));
    const m = { weight: 70, bodyFat: 25, sex: "male"   }; // same lbm as `woman`
    const f = { weight: 70, bodyFat: 25, sex: "female" };
    expect(computeMacros(m, "maintain", 2000).protein)
      .toBeGreaterThan(computeMacros(f, "maintain", 2000).protein);
  });

  test("fat rises from cut to bulk but never below the 0.6 g/kg floor", () => {
    const cutFat  = computeMacros(man, "cut",  1800).fat;
    const bulkFat = computeMacros(man, "bulk", 2800).fat;
    expect(bulkFat).toBeGreaterThan(cutFat);
    // A deep custom cut must not drag fat under 0.6 g/kg bodyweight.
    expect(computeMacros(man, "cut", 1200).fat).toBeGreaterThanOrEqual(Math.round(80 * 0.6));
  });

  test("carbs absorb the whole change while protein and fat hold", () => {
    const lo = computeMacros(man, "maintain", 2000);
    const hi = computeMacros(man, "maintain", 2600);
    expect(hi.protein).toBe(lo.protein);
    expect(hi.fat).toBe(lo.fat);
    // 600 kcal added → all into carbs → +150 g (±1 for rounding)
    expect(hi.carbs - lo.carbs).toBeGreaterThanOrEqual(149);
    expect(hi.carbs - lo.carbs).toBeLessThanOrEqual(151);
  });

  test("preset and custom paths agree at the same calorie number", () => {
    expect(computeMacros(man, "cut", 1900)).toEqual(computeMacros(man, "cut", 1900));
  });

  test("a target too low to fit the floors flags floorsExceedKcal and keeps carbs ≥ 50", () => {
    const r = computeMacros(man, "cut", 900);
    expect(r.floorsExceedKcal).toBe(true);
    expect(r.carbs).toBe(50); // floor kept, never negative
  });

  test("a comfortable target does not flag floorsExceedKcal", () => {
    expect(computeMacros(man, "maintain", 2300).floorsExceedKcal).toBe(false);
  });
});

// ── scanAllergens & dietaryPromptBlock — dietary safety (#8) ───
describe("scanAllergens — zero-token output backstop", () => {
  test("catches a declared allergen named directly", () => {
    expect(scanAllergens("Peanut satay chicken", ["peanuts"])).toContain("peanuts");
  });

  test("catches an allergen via a synonym the prompt may have slipped (walnut → tree nuts)", () => {
    expect(scanAllergens("Walnut and honey salad", ["tree nuts"])).toContain("tree nuts");
  });

  test("matches plurals/derivatives (walnut matches 'walnuts')", () => {
    expect(scanAllergens("a handful of walnuts", ["tree nuts"])).toContain("tree nuts");
  });

  test("custom allergen tags are scanned too (celeriac)", () => {
    expect(scanAllergens("celeriac remoulade", ["celeriac"])).toContain("celeriac");
  });

  test("does not flag unrelated food", () => {
    expect(scanAllergens("grilled chicken and rice", ["peanuts", "milk"])).toEqual([]);
  });

  test("no allergens declared → never flags (no regression)", () => {
    expect(scanAllergens("peanut butter on toast", [])).toEqual([]);
  });

  test("returns every distinct allergen present", () => {
    const hits = scanAllergens("cheese and prawn toastie", ["milk", "crustaceans", "soya"]);
    expect(hits).toContain("milk");
    expect(hits).toContain("crustaceans");
    expect(hits).not.toContain("soya");
  });
});

describe("dietaryPromptBlock — prompt injection", () => {
  test("empty config yields an empty block (no regression)", () => {
    expect(dietaryPromptBlock({})).toBe("");
    expect(dietaryPromptBlock(null)).toBe("");
  });

  test("vegan diet becomes a hard rule", () => {
    expect(dietaryPromptBlock({ diets: ["vegan"] })).toMatch(/hard rule/i);
    expect(dietaryPromptBlock({ diets: ["vegan"] })).toMatch(/vegan/);
  });

  test("allergens become a hard safety rule listing each allergen", () => {
    const b = dietaryPromptBlock({ allergens: ["peanuts", "milk"] });
    expect(b).toMatch(/SAFETY/);
    expect(b).toMatch(/peanuts/);
    expect(b).toMatch(/milk/);
  });

  test("dislikes are framed as a soft preference, not a safety rule", () => {
    const b = dietaryPromptBlock({ dislikes: ["coriander"] });
    expect(b).toMatch(/soft preference/i);
    expect(b).toMatch(/coriander/);
  });
});

// ── paceVerdict — coach pacing safeguards (#6) ─────────────────
describe("paceVerdict — computed pace with safeguards", () => {
  test("low totals early in the day are never 'behind' (62/147g protein at 07:00)", () => {
    // first meal at 07:00, now 07:00 → window barely started
    expect(paceVerdict(7, 7, 62 / 147).verdict).not.toBe("behind");
    expect(paceVerdict(7, 7, 62 / 147).verdict).toBe("ahead");
  });

  test("ahead of pace is recognised as ahead (79/146g at 10:00, first meal 07:00)", () => {
    expect(paceVerdict(7, 10, 79 / 146).verdict).toBe("ahead");
  });

  test("genuinely behind late in the day (40/150g at 20:00, first meal 07:00)", () => {
    expect(paceVerdict(7, 20, 40 / 150).verdict).toBe("behind");
  });

  test("before 25% of the window elapses, 'behind' is never used", () => {
    // 3% of goal hit but only ~14% of window elapsed → not behind
    expect(paceVerdict(8, 10, 0.03).verdict).not.toBe("behind");
  });

  test("no food logged yet means the window has not started — never behind", () => {
    expect(paceVerdict(null, 20, 0).verdict).not.toBe("behind");
  });

  test("a met goal reports 'met', not a pace verdict", () => {
    expect(paceVerdict(7, 20, 1.0).verdict).toBe("met");
    expect(paceVerdict(7, 20, 1.2).verdict).toBe("met");
  });

  test("on-track mid-window reads as 'on'", () => {
    // first meal 07:00, now 14:00 → ~50% elapsed; ~40% hit → on (within 15%)
    expect(paceVerdict(7, 14, 0.40).verdict).toBe("on");
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

// ── Unit conversions (display only; storage stays metric kg/cm) ──────
const LB_PER_KG = 2.2046226218;
const IN_PER_CM = 0.3937007874;
const kgToStLb = kg => { const tot = Math.round((Number(kg) || 0) * LB_PER_KG); return { st: Math.floor(tot / 14), lb: tot % 14 }; };
const stLbToKg = (st, lb) => Math.round(((Number(st) || 0) * 14 + (Number(lb) || 0)) / LB_PER_KG * 10) / 10;
const kgToLb   = kg => Math.round((Number(kg) || 0) * LB_PER_KG * 10) / 10;
const lbToKg   = lb => Math.round((Number(lb) || 0) / LB_PER_KG * 100) / 100;
const cmToFtIn = cm => { const tot = Math.round((Number(cm) || 0) * IN_PER_CM); return { ft: Math.floor(tot / 12), in: tot % 12 }; };
const ftInToCm = (ft, inch) => Math.round(((Number(ft) || 0) * 12 + (Number(inch) || 0)) / IN_PER_CM);
const cmToInch = cm => Math.round((Number(cm) || 0) * IN_PER_CM);
const inchToCm = inch => Math.round((Number(inch) || 0) / IN_PER_CM);

describe("unit conversions", () => {
  test("kg → stone+pounds is in range", () => {
    expect(kgToStLb(80)).toEqual({ st: 12, lb: 8 });
    expect(kgToStLb(0)).toEqual({ st: 0, lb: 0 });
    const { lb } = kgToStLb(83);
    expect(lb).toBeLessThan(14); // pounds never spill past a stone
  });

  test("stone+pounds round-trips back to a stable stone+pounds (no drift on unit switch)", () => {
    for (let s = 5; s <= 25; s++) {
      for (let p = 0; p < 14; p++) {
        const kg = stLbToKg(s, p);
        expect(kgToStLb(kg)).toEqual({ st: s, lb: p });
      }
    }
  });

  test("cm → feet+inches is in range", () => {
    expect(cmToFtIn(178)).toEqual({ ft: 5, in: 10 });
    const { in: inch } = cmToFtIn(183);
    expect(inch).toBeLessThan(12);
  });

  test("feet+inches round-trips back to a stable feet+inches", () => {
    for (let ft = 3; ft <= 7; ft++) {
      for (let inch = 0; inch < 12; inch++) {
        const cm = ftInToCm(ft, inch);
        expect(cmToFtIn(cm)).toEqual({ ft, in: inch });
      }
    }
  });

  test("pounds-only round-trips back to the same integer pounds (2dp kg storage)", () => {
    for (let lb = 60; lb <= 660; lb++) {
      expect(kgToLb(lbToKg(lb))).toBe(lb); // what you type in lb is what you see back
    }
  });

  test("inches-only round-trips back to the same integer inches", () => {
    for (let inch = 36; inch <= 90; inch++) {
      expect(cmToInch(inchToCm(inch))).toBe(inch);
    }
  });
});

// ── MeasureField seed/build (the "stuck 0" regression) ──────────────
// The field seeds local text from the stored metric ONCE, then edits locally.
// A 0/empty stored value must seed BLANK strings — never "0" — so a cleared
// field never shows a literal 0 to fight, including after a unit switch.
const emptyMetric = m => m === "" || m == null || Number(m) === 0;
const MEASURE_CFG = {
  kg:   { seed: kg => emptyMetric(kg) ? [""] : [String(kg)],                                  build: ([a])     => a },
  lb:   { seed: kg => emptyMetric(kg) ? [""] : [String(kgToLb(kg))],                          build: ([a])     => lbToKg(a) },
  st:   { seed: kg => { if (emptyMetric(kg)) return ["", ""]; const x = kgToStLb(kg); return [String(x.st), String(x.lb)]; },     build: ([s, p])  => stLbToKg(s, p) },
  cm:   { seed: cm => emptyMetric(cm) ? [""] : [String(cm)],                                  build: ([a])     => a },
  in:   { seed: cm => emptyMetric(cm) ? [""] : [String(cmToInch(cm))],                        build: ([a])     => inchToCm(a) },
  ftin: { seed: cm => { if (emptyMetric(cm)) return ["", ""]; const x = cmToFtIn(cm); return [String(x.ft), String(x.in)]; },     build: ([ft, i]) => ftInToCm(ft, i) },
};

describe("MeasureField seed/build", () => {
  test("an unset / fully-cleared value seeds blank in every unit (no stray 0)", () => {
    for (const u of Object.keys(MEASURE_CFG)) {
      for (const empty of [0, "", null]) {
        expect(MEASURE_CFG[u].seed(empty).every(s => s === "")).toBe(true);
      }
    }
  });

  test("a genuine zero sub-part of a REAL measurement is shown, not blanked", () => {
    expect(MEASURE_CFG.st.seed(76.2)).toEqual(["12", "0"]);  // 12 st 0 lb — pounds box shows 0
    expect(MEASURE_CFG.ftin.seed(152)).toEqual(["5", "0"]);  // 5 ft 0 in — inches box shows 0
  });

  test("a non-zero value still shows both real parts", () => {
    expect(MEASURE_CFG.st.seed(80)).toEqual(["12", "8"]);
    expect(MEASURE_CFG.ftin.seed(178)).toEqual(["5", "10"]);
  });

  test("seed → build → seed is stable (the displayed numbers don't drift on re-render)", () => {
    // kg→display→kg is inherently lossy (kg is finer than whole lb), but the
    // direction that governs UX — display → kg → display — must be stable.
    const cases = { st: 80, lb: 80, ftin: 178, in: 178 };
    for (const [u, metric] of Object.entries(cases)) {
      const seeded = MEASURE_CFG[u].seed(metric);
      const kg = MEASURE_CFG[u].build(seeded);
      expect(MEASURE_CFG[u].seed(kg)).toEqual(seeded);
    }
  });

  test("a blank sub-field builds as if it were zero (clearing a box is safe)", () => {
    expect(MEASURE_CFG.st.build(["12", ""])).toBe(stLbToKg(12, 0));  // cleared the lb box
    expect(MEASURE_CFG.ftin.build(["", "10"])).toBe(ftInToCm(0, 10)); // cleared the ft box
    expect(MEASURE_CFG.lb.build([""])).toBe(0);
  });
});

// ── TagField suggestion resolution (allergy SAFETY: typed text should
// resolve to the canonical preset so synonym expansion isn't lost) ──────
const BIG14 = ["celery","gluten","crustaceans","eggs","fish","lupin","milk",
  "molluscs","mustard","peanuts","sesame","soya","sulphites","tree nuts"];
const resolveTag = (raw, suggestions, tags = []) => {
  const has = t => tags.some(x => x.toLowerCase() === t.toLowerCase());
  const t = raw.trim().toLowerCase();
  if (!t) return "";
  const exact = suggestions.find(s => s.toLowerCase() === t);
  if (exact) return exact;
  const partial = suggestions.filter(s => s.toLowerCase().includes(t) && !has(s));
  return partial.length === 1 ? partial[0] : raw.trim();
};

describe("tag suggestion resolution", () => {
  test("exact typed match resolves to the canonical preset", () => {
    expect(resolveTag("milk", BIG14)).toBe("milk");
    expect(resolveTag("MILK", BIG14)).toBe("milk");
  });

  test("typing the singular resolves to the canonical plural preset (safety)", () => {
    // 'tree nut' must become 'tree nuts' or synonym expansion (almond, walnut…) is lost
    expect(resolveTag("tree nut", BIG14)).toBe("tree nuts");
    expect(resolveTag("peanut", BIG14)).toBe("peanuts");
  });

  test("ambiguous input stays as a custom tag", () => {
    expect(resolveTag("nut", BIG14)).toBe("nut"); // matches peanuts AND tree nuts
  });

  test("genuinely novel input stays as a custom tag", () => {
    expect(resolveTag("kiwi", BIG14)).toBe("kiwi");
  });
});

describe("confidence model (separated)", () => {
  test("tdeeConfidence maps weigh-in tiers to the conservative bands", () => {
    expect(tdeeConfidence(0)).toBe(50);   // formula only
    expect(tdeeConfidence(6)).toBe(50);
    expect(tdeeConfidence(7)).toBe(65);   // Estimating
    expect(tdeeConfidence(13)).toBe(65);
    expect(tdeeConfidence(14)).toBe(80);  // Learning
    expect(tdeeConfidence(27)).toBe(80);
    expect(tdeeConfidence(28)).toBe(92);  // Calibrated
    expect(tdeeConfidence(200)).toBe(92);
  });

  test("intakeConfidence treats entries without conf as exact (100)", () => {
    expect(intakeConfidence([{ kcal: 500 }, { kcal: 300 }])).toBe(100);
    expect(intakeConfidence([])).toBe(100);
  });

  test("intakeConfidence is impact-weighted by kcal share", () => {
    // 1400 kcal exact (100%) + 600 kcal at 60% => (1400*100 + 600*60)/2000 = 88
    expect(intakeConfidence([
      { kcal: 1400, conf: 100 },
      { kcal: 600,  conf: 60 },
    ])).toBe(88);
  });

  test("a fuzzy big meal hurts more than a fuzzy snack", () => {
    const bigFuzzy   = intakeConfidence([{ kcal: 900, conf: 50 }, { kcal: 100, conf: 100 }]);
    const smallFuzzy = intakeConfidence([{ kcal: 100, conf: 50 }, { kcal: 900, conf: 100 }]);
    expect(bigFuzzy).toBeLessThan(smallFuzzy);
  });

  test("zero-kcal day is fully confident (no division by zero)", () => {
    expect(intakeConfidence([{ kcal: 0, conf: 30 }])).toBe(100);
  });
});

// ── AI capture: confidence tiers, follow-up selection & refinement ────────────
// Mirror of app.jsx helpers (confLabel / pickFollowups / refineElement).

const confLabel = c => c <= 33 ? "Low" : c <= 66 ? "Medium" : "High";

const FOLLOWUP_BELOW = 80; // = INTAKE_FLAG_BELOW
const FOLLOWUP_BANK = { fat: {}, portion: {}, version: {} }; // keys gate pickFollowups

const refineElement = (el, mode, factor, conf) => {
  if (conf == null) return el;
  const r1 = n => Math.round(n * 10) / 10;
  const out = mode === "fat"
    ? { ...el, kcal: Math.round(el.kcal * factor), fat: r1(el.fat * factor) }
    : { ...el, kcal: Math.round(el.kcal * factor), protein: r1(el.protein * factor),
        carbs: r1(el.carbs * factor), fat: r1(el.fat * factor) };
  out.confidence = Math.max(el.confidence, conf);
  return out;
};

const pickFollowups = items => (items || [])
  .map((it, idx) => ({ idx, ask: it.ask, name: it.name,
    impact: (it.kcal || 0) * (100 - (it.confidence || 0)) }))
  .filter(x => x.ask && FOLLOWUP_BANK[x.ask])
  .sort((a, b) => b.impact - a.impact)
  .slice(0, 2);

describe("confLabel — score → tier", () => {
  test("bands at 33 and 66", () => {
    expect(confLabel(0)).toBe("Low");
    expect(confLabel(33)).toBe("Low");
    expect(confLabel(34)).toBe("Medium");
    expect(confLabel(66)).toBe("Medium");
    expect(confLabel(67)).toBe("High");
    expect(confLabel(100)).toBe("High");
  });
});

describe("pickFollowups — highest-leverage unknowns, max 2", () => {
  test("only elements with a known ask code qualify", () => {
    const items = [
      { name: "rice",    kcal: 200, confidence: 95, ask: null },
      { name: "chicken", kcal: 300, confidence: 50, ask: "fat" },
      { name: "side",    kcal: 100, confidence: 40, ask: "mystery" }, // unknown code → ignored
    ];
    const fu = pickFollowups(items);
    expect(fu).toHaveLength(1);
    expect(fu[0].name).toBe("chicken");
  });

  test("ranks by impact = kcal*(100-conf) and caps at 2", () => {
    const items = [
      { name: "garnish", kcal: 30,  confidence: 20, ask: "portion" }, // impact 2400
      { name: "main",    kcal: 700, confidence: 50, ask: "fat" },     // impact 35000
      { name: "drink",   kcal: 250, confidence: 40, ask: "portion" }, // impact 15000
    ];
    const fu = pickFollowups(items);
    expect(fu.map(x => x.name)).toEqual(["main", "drink"]); // top 2 by impact, garnish dropped
  });

  test("returns empty when nothing is asked", () => {
    expect(pickFollowups([{ name: "x", kcal: 100, confidence: 90, ask: null }])).toEqual([]);
    expect(pickFollowups([])).toEqual([]);
  });
});

describe("refineElement — follow-up answers refine deterministically", () => {
  const base = { name: "stir fry", kcal: 400, protein: 30, carbs: 20, fat: 18, confidence: 50 };

  test("portion (scale) multiplies every macro and kcal", () => {
    const out = refineElement(base, "scale", 1.5, 85);
    expect(out.kcal).toBe(600);
    expect(out.protein).toBe(45);
    expect(out.carbs).toBe(30);
    expect(out.fat).toBe(27);
  });

  test("fat mode scales kcal + fat only; protein/carbs held", () => {
    const out = refineElement(base, "fat", 1.3, 82);
    expect(out.kcal).toBe(520);
    expect(out.fat).toBe(23.4);
    expect(out.protein).toBe(30); // unchanged
    expect(out.carbs).toBe(20);   // unchanged
  });

  test("answering raises confidence but never lowers it", () => {
    expect(refineElement(base, "scale", 1.0, 85).confidence).toBe(85);
    const already = { ...base, confidence: 90 };
    expect(refineElement(already, "scale", 1.0, 85).confidence).toBe(90); // not dropped
  });

  test("\"Not sure\" (conf null) leaves the element untouched", () => {
    expect(refineElement(base, "scale", 1.0, null)).toEqual(base);
  });
});

describe("runCalibration — AI-estimated days can't silently retrain TDEE", () => {
  const today = new Date();
  const dkey  = d => d.toISOString().split("T")[0];
  const weighIns = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 13 + i);
    return { date: dkey(d), weight: 80 - i * 0.2 }; // steady loss
  });
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoKey = dkey(weekAgo);
  const recentDays = (mk) => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 6 + i);
    return { date: dkey(d), ...mk(i) };
  }).filter(d => d.date >= weekAgoKey);

  test("near-guess days (<50% intake confidence) are dropped from avgKcal", () => {
    // 4 reliable 1800-kcal days + 3 wild 4000-kcal guesses at 20% confidence.
    const history = recentDays(i => i < 4
      ? { kcal: 1800, logs: [{ kcal: 1800, conf: 100 }] }
      : { kcal: 4000, logs: [{ kcal: 4000, conf: 20 }] });
    const result = runCalibration(history, weighIns, 2400);
    expect(result).not.toBeNull();
    // If the 4000-kcal guesses counted, avgKcal would blow past 2500. Dropped → ~1800.
    expect(result.avgKcal).toBeLessThanOrEqual(1850);
  });

  test("legacy days without logs still count at full confidence", () => {
    const history = recentDays(() => ({ kcal: 1800 })); // no logs field
    const result = runCalibration(history, weighIns, 2400);
    expect(result).not.toBeNull();
    expect(result.avgKcal).toBe(1800);
  });
});
