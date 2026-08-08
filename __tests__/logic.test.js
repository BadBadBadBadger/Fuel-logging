// Pure logic extracted from app.jsx — tests run in Node via Jest

const MODES = {
  cut:      { adj: -500 },
  maintain: { adj: 0    },
  bulk:     { adj: 500  },
};

const SAFE_MIN = { male: 1400, female: 1200 };

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

// Faithful mirror of app.jsx calcTargets: TDEE seeded from a NEAT-only activity
// multiplier (sedentary 1.20 == the old flat baseline), the day's workout kcals added
// directly, macros via computeMacros, and a MAINTAIN-ONLY floor at sedentary TDEE
// (BMR × 1.2 — the adaptive adjustment can never starve maintenance below it, even
// for a higher-activity seed) plus the legacy SAFE_MIN backstop.
const ACTIVITY = { sedentary: 1.20, light: 1.35, active: 1.45, very: 1.55 };
const activityMult = p => ACTIVITY[p && p.activity] || ACTIVITY.sedentary;

// ── Energy floor + low-fuel warning (Step 4) — mirror of app.jsx ──────────────
// The hard clamp is RATE OF LOSS (scales with body size); energy availability is a
// WARNING ONLY, gated to lean bodies on days they trained. EA_OK (45) is not a band —
// it is unreachable given NEAT-only multipliers with training subtracted back out.
const EA_HARD          = 30;
const MAX_DEFICIT_FRAC = 0.25;
const LEAN_BF = { male: 15, female: 23 };
const ffmOf      = p => (Number(p.weight) || 80) * (1 - (Number(p.bodyFat) || 18) / 100);
const bodyFatSet = p => { const bf = Number(p && p.bodyFat); return bf > 0 && bf < 100; };
const isLeanBody = p => bodyFatSet(p) && Number(p.bodyFat) <= LEAN_BF[p.sex === "female" ? "female" : "male"];
const deficitFloorOf = (effTDEE, appliedBonus = 0) =>
  Math.round((1 - MAX_DEFICIT_FRAC) * (effTDEE + (appliedBonus || 0)));
const energyAvailability = (kcal, rawBurnKcal, p) =>
  bodyFatSet(p) ? Math.round(((kcal - (rawBurnKcal || 0)) / ffmOf(p)) * 10) / 10 : null;

const calcTargets = (p, mode, totalWorkoutKcal = 0, tdeeAdj = 0, rawBurnKcal = 0) => {
  const w   = Number(p.weight)  || 80;
  const bf  = Number(p.bodyFat) || 18;
  const sex = p.sex || "male";
  const lbm = w * (1 - bf / 100);
  const bmr  = Math.round(370 + 21.6 * lbm);
  const seed = Math.round(bmr * activityMult(p));
  const sedentaryTDEE = Math.round(bmr * 1.2);
  const tdee = seed + tdeeAdj;
  let kcal   = tdee + MODES[mode].adj + (totalWorkoutKcal || 0);
  const bmrFloorApplied = mode === "maintain" && kcal < sedentaryTDEE;
  if (bmrFloorApplied) kcal = sedentaryTDEE;
  const effTDEE = Math.max(sedentaryTDEE, tdee);
  const deficitFloor = deficitFloorOf(effTDEE, totalWorkoutKcal);
  const deficitFloorApplied = kcal < deficitFloor;
  if (deficitFloorApplied) kcal = deficitFloor;
  const safeMin = SAFE_MIN[sex] || 1400;
  const safeMinApplied = kcal < safeMin;
  if (safeMinApplied) kcal = safeMin;
  const m = computeMacros(p, mode, kcal);
  const ea = energyAvailability(kcal, rawBurnKcal, p);
  const lowFuel = ea != null && isLeanBody(p) && (rawBurnKcal || 0) > 0 && ea < EA_HARD;
  return { kcal, protein: m.protein, carbs: m.carbs, fat: m.fat, tdee, bmr,
    lbm: m.lbm, bonus: totalWorkoutKcal || 0, safeMinApplied, bmrFloorApplied,
    deficitFloorApplied, deficitFloor, ea, lowFuel, bodyFatUnset: !bodyFatSet(p),
    floorsExceedKcal: m.floorsExceedKcal };
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

// Mirror of app.jsx runCalibration (energy Step 2): dead-time-compensated, damped,
// confidence-scaled convergence. inFlightAdj = adjustments applied in the last 7 days
// (the weight window hasn't reflected them yet) — subtracted to prevent overshoot.
const CAL_MIN_WEIGHINS = 6;
const CAL_GAIN         = 0.8;
const CAL_STEP_CAP     = { low: 100, medium: 150, high: 200 };
const CAL_STEP_ROUND   = 25;
const ADJ_CAP          = 600;
const runCalibration = (history, weighIns, baseTDEE, inFlightAdj = 0) => {
  if (weighIns.length < CAL_MIN_WEIGHINS) return null;
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
  const errKcal      = -discrepancy * 7700 / 7;
  const effErr       = errKcal - inFlightAdj;
  const confidence = weighIns.length >= 28 ? "high" : weighIns.length >= 14 ? "medium" : "low";
  const cap = CAL_STEP_CAP[confidence];
  const adj = Math.max(-cap, Math.min(cap, Math.round(CAL_GAIN * effErr / CAL_STEP_ROUND) * CAL_STEP_ROUND));
  return { adj, confidence, actualChange: Math.round(actualChange * 10) / 10,
    expectedChange: Math.round(expectedChange * 10) / 10, avgKcal: Math.round(avgKcal) };
};

// ── Cut cycling (energy Step 5; features/energy-safety/02) ────
// Mirror of app.jsx. The unit is a DEFICIT-WEIGHTED day ("cut load"), never a flat
// calendar day and never read from food logs — see ENERGY_MODEL.md §5.2.
const dateKey = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
const REFERENCE_DEFICIT       = 0.20;
const CUT_MIN_FRAC            = 0.05;
const CUT_BLOCK_SOFT_NUDGE    = 56;
const CUT_BLOCK_HARD_PROMPT   = 84;
const CUT_BLOCK_LEAN_SOFT     = 42;
const CUT_BLOCK_LEAN_HARD     = 56;
const BLOCK_LOSS_TRIGGER      = 0.05;
const CUMULATIVE_CUT_ESCALATE = 168;
const MAINTENANCE_DECAY       = 1.0;
const TREND_CUT_RATE          = 0.0025;
const BLOCK_END_GRACE         = 7;
const CUT_NUDGE_SNOOZE_DAYS   = 7;
const CUT_PROMPT_SNOOZE_DAYS  = 3;

const dayCutLoad = (targetKcal, maintenanceKcal) => {
  if (!maintenanceKcal || maintenanceKcal <= 0) return 0;
  const frac = 1 - targetKcal / maintenanceKcal;
  if (frac < CUT_MIN_FRAC) return 0;
  return Math.round((frac / REFERENCE_DEFICIT) * 100) / 100;
};

const cutThresholds = p => isLeanBody(p)
  ? { soft: CUT_BLOCK_LEAN_SOFT, hard: CUT_BLOCK_LEAN_HARD }
  : { soft: CUT_BLOCK_SOFT_NUDGE, hard: CUT_BLOCK_HARD_PROMPT };

const weeklyLossFrac = (weighIns, todayK) => {
  const t = new Date(todayK + "T12:00:00");
  const recent = weighRollingAvg(weighIns, dateKey(new Date(t.getTime() + 86400000)), 7);
  const older  = weighRollingAvg(weighIns, dateKey(new Date(t.getTime() - 7 * 86400000)), 7);
  if (!recent || !older || older <= 0) return null;
  return (older - recent) / older;
};

const EMPTY_CUT_BLOCK = { start:null, load:0, yearLoad:0, startWeight:null,
  offRun:0, lastAccrued:null, lastBreakEnd:null, nudgeAt:null, snoozeAt:null };

const stepCutBlock = (block, day) => {
  const b = { ...block, lastAccrued: day.date };
  if (day.cutting && day.load > 0) {
    if (!b.start) { b.start = day.date; b.load = 0; b.startWeight = day.weight ?? null; }
    if (b.startWeight == null && day.weight != null) b.startWeight = day.weight;
    b.load     = Math.round((b.load + day.load) * 100) / 100;
    b.yearLoad = Math.round((b.yearLoad + day.load) * 100) / 100;
    b.offRun   = 0;
    return b;
  }
  b.offRun   = (b.offRun || 0) + 1;
  b.yearLoad = Math.max(0, Math.round((b.yearLoad - MAINTENANCE_DECAY) * 100) / 100);
  if (b.start && b.offRun >= BLOCK_END_GRACE) { b.start = null; b.load = 0; b.startWeight = null; }
  return b;
};

const accrueCutBlock = (block, todayK, day) => {
  const b0 = block || EMPTY_CUT_BLOCK;
  if (b0.lastAccrued === todayK) return b0;
  const today = new Date(todayK + "T12:00:00");
  const days = [];
  if (b0.lastAccrued) {
    const from = new Date(b0.lastAccrued + "T12:00:00");
    for (let d = new Date(from.getTime() + 86400000); d <= today; d = new Date(d.getTime() + 86400000))
      days.push(dateKey(d));
  } else days.push(todayK);
  return days.slice(-370).reduce((b, date) => stepCutBlock(b, { ...day, date }), b0);
};

const daysBetween = (fromK, toK) =>
  Math.max(0, Math.round((new Date(toK + "T12:00:00") - new Date(fromK + "T12:00:00")) / 86400000));

const cutPromptFor = ({ block, profile, todayK, lossFrac = null, now = Date.now() }) => {
  if (!block || !block.start) return null;
  const th = cutThresholds(profile || {});
  const bigLoss = lossFrac != null && lossFrac >= BLOCK_LOSS_TRIGGER;
  const level = (block.load >= th.hard || bigLoss) ? "hard"
              : block.load >= th.soft ? "soft" : null;
  if (!level) return null;
  const snoozedFor = level === "hard"
    ? (block.snoozeAt ? now - block.snoozeAt < CUT_PROMPT_SNOOZE_DAYS * 86400000 : false)
    : (block.nudgeAt  ? now - block.nudgeAt  < CUT_NUDGE_SNOOZE_DAYS  * 86400000 : false);
  if (snoozedFor) return null;
  return { level, bigLoss,
    weeks:    Math.max(1, Math.round(daysBetween(block.start, todayK) / 7)),
    escalate: block.yearLoad > CUMULATIVE_CUT_ESCALATE };
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
  const prof = { weight: 80, height: 178, bodyFat: 18 };

  test("BMR is correct for 80kg/18%bf", () => {
    // lbm = 80 * 0.82 = 65.6 → bmr = 370 + 21.6*65.6 = 1787
    const { bmr } = calcTargets(prof, "maintain");
    expect(bmr).toBe(1787);
  });

  test("unset/sedentary activity seeds TDEE at BMR × 1.20 (backwards-compatible baseline)", () => {
    const { bmr, tdee } = calcTargets(prof, "maintain"); // prof has no activity → sedentary
    expect(tdee).toBe(Math.round(bmr * 1.2));
    expect(calcTargets({ ...prof, activity: "sedentary" }, "maintain").tdee).toBe(tdee);
  });

  test("activity level scales the seeded TDEE (NEAT multiplier, not flat)", () => {
    const { bmr } = calcTargets(prof, "maintain");
    expect(calcTargets({ ...prof, activity: "light"  }, "maintain").tdee).toBe(Math.round(bmr * 1.35));
    expect(calcTargets({ ...prof, activity: "active" }, "maintain").tdee).toBe(Math.round(bmr * 1.45));
    expect(calcTargets({ ...prof, activity: "very"   }, "maintain").tdee).toBe(Math.round(bmr * 1.55));
    // and a more active seed is strictly higher than sedentary
    expect(calcTargets({ ...prof, activity: "active" }, "maintain").tdee)
      .toBeGreaterThan(calcTargets({ ...prof, activity: "sedentary" }, "maintain").tdee);
  });

  test("maintain mode adds no adjustment beyond workout kcals", () => {
    const { tdee, kcal, bonus } = calcTargets(prof, "maintain");
    expect(kcal).toBe(tdee + bonus);
  });

  test("cut mode subtracts 500 kcal", () => {
    const maintain = calcTargets(prof, "maintain").kcal;
    const cut      = calcTargets(prof, "cut").kcal;
    expect(maintain - cut).toBe(500);
  });

  test("bulk mode adds 500 kcal", () => {
    const maintain = calcTargets(prof, "maintain").kcal;
    const bulk     = calcTargets(prof, "bulk").kcal;
    expect(bulk - maintain).toBe(500);
  });

  test("no workout kcals gives zero bonus", () => {
    const { bonus } = calcTargets(prof, "maintain");
    expect(bonus).toBe(0);
  });

  test("totalWorkoutKcal is added to the target and reflected in bonus", () => {
    const base = calcTargets(prof, "maintain").kcal;
    const { kcal, bonus } = calcTargets(prof, "maintain", 400);
    expect(bonus).toBe(400);
    expect(kcal - base).toBe(400);
  });

  test("protein target uses 2.2g per kg LBM for males (mode-independent)", () => {
    const lbm = 80 * 0.82;
    expect(calcTargets(prof, "cut").protein).toBe(Math.round(lbm * 2.2));
    expect(calcTargets(prof, "bulk").protein).toBe(Math.round(lbm * 2.2));
  });

  test("cut fat target uses 0.8g per kg bodyweight (male)", () => {
    const { fat } = calcTargets(prof, "cut");
    expect(fat).toBe(Math.round(80 * 0.8));
  });

  test("carbs never go below 50g", () => {
    // Very low kcal scenario
    const lean = { weight: 50, bodyFat: 5 };
    const { carbs } = calcTargets(lean, "cut");
    expect(carbs).toBeGreaterThanOrEqual(50);
  });

  test("lbm returned is rounded", () => {
    const { lbm } = calcTargets(prof, "maintain");
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
  const prof = { weight: 80, height: 178, bodyFat: 18 };

  test("positive tdeeAdj raises the maintenance target", () => {
    const base     = calcTargets(prof, "maintain", 0, 0).kcal;
    const adjusted = calcTargets(prof, "maintain", 0, 200).kcal;
    expect(adjusted - base).toBe(200);
  });

  test("negative tdeeAdj still lowers a BULK target (floor is maintain-only)", () => {
    const base     = calcTargets(prof, "bulk", 0, 0).kcal;
    const adjusted = calcTargets(prof, "bulk", 0, -150).kcal;
    expect(base - adjusted).toBe(150);
  });

  test("tdeeAdj is reflected in the (unfloored) tdee estimate field", () => {
    const up   = calcTargets(prof, "maintain", 0, 300).tdee;
    const base = calcTargets(prof, "maintain", 0, 0).tdee;
    const down = calcTargets(prof, "maintain", 0, -300).tdee;
    expect(up - base).toBe(300);
    expect(base - down).toBe(300);
  });
});

// ── calcTargets — BMR×1.2 maintenance floor (energy-safety file 04) ────────────
// The harm: adaptive tdeeAdj drove maintenance BELOW resting metabolism, prescribing
// "eat less" to a stalling dieter. Rule: maintenance can never sit below sedentary
// TDEE (BMR × 1.2); a deliberate cut may, bounded elsewhere. Numbers are DERIVED
// from the formula here (never hardcoded upstream), with contrasting bodies proving
// the floor is computed, not baked in.
describe("calcTargets — maintenance BMR×1.2 floor", () => {
  const sedentaryTDEE = p => {
    const lbm = p.weight * (1 - p.bodyFat / 100);
    return Math.round(Math.round(370 + 21.6 * lbm) * 1.2);
  };

  // Worked example from the harm report: 98.5 kg / 30% BF → BMR ≈ 1859, floor ≈ 2231.
  const harmed = { weight: 98.5, bodyFat: 30 };
  // A smaller, contrasting body so the floor value differs — proof it is derived.
  const smaller = { weight: 62, bodyFat: 22 };

  test.each([harmed, smaller])(
    "maintenance is never pulled below sedentary TDEE by a full negative adjustment (%o)",
    (p) => {
      const floor = sedentaryTDEE(p);
      const raw   = floor - 600;                       // what the auto-lowering alone would give
      const { kcal, bmrFloorApplied } = calcTargets(p, "maintain", 0, -600);
      expect(kcal).toBe(floor);
      expect(kcal).toBeGreaterThan(raw);
      expect(bmrFloorApplied).toBe(true);
    },
  );

  test("the floor value tracks body size (two bodies → two different floors)", () => {
    expect(sedentaryTDEE(harmed)).not.toBe(sedentaryTDEE(smaller));
    expect(calcTargets(harmed, "maintain", 0, -600).kcal).toBe(sedentaryTDEE(harmed));
    expect(calcTargets(smaller, "maintain", 0, -600).kcal).toBe(sedentaryTDEE(smaller));
  });

  test("any negative adjustment to maintenance is floored, not just the extreme", () => {
    const { kcal, bmrFloorApplied } = calcTargets(harmed, "maintain", 0, -50);
    expect(kcal).toBe(sedentaryTDEE(harmed));
    expect(bmrFloorApplied).toBe(true);
  });

  test("a positive adjustment raises maintenance and does NOT flag the floor", () => {
    const { kcal, bmrFloorApplied } = calcTargets(harmed, "maintain", 0, 200);
    expect(kcal).toBe(sedentaryTDEE(harmed) + 200);
    expect(bmrFloorApplied).toBe(false);
  });

  test("a deliberate cut is allowed below sedentary TDEE — the maintain floor does not apply", () => {
    const { kcal, bmrFloorApplied } = calcTargets(harmed, "cut", 0, -600);
    expect(bmrFloorApplied).toBe(false);
    expect(kcal).toBeLessThan(sedentaryTDEE(harmed)); // cut deficit + negative adj both bite
  });

  test("workout kcals cannot be gamed to bypass the floor downward", () => {
    // Even with zero workout and a huge negative adj, maintenance holds at the floor.
    expect(calcTargets(harmed, "maintain", 0, -600).kcal).toBe(sedentaryTDEE(harmed));
  });

  test("floor is SEDENTARY, not the seed — a higher-activity seed still floors at BMR×1.2", () => {
    // An 'active' user seeds at BMR×1.45 but a full negative adjustment must still be
    // allowed to calibrate maintenance DOWN to sedentary (BMR×1.2) — never below.
    const active = { ...harmed, activity: "active" };
    const seedActive = calcTargets(active, "maintain", 0, 0).tdee;      // BMR × 1.45
    expect(seedActive).toBeGreaterThan(sedentaryTDEE(active));          // seed sits above the floor
    const { kcal, bmrFloorApplied } = calcTargets(active, "maintain", 0, -600);
    expect(kcal).toBe(sedentaryTDEE(active));                          // floored at sedentary, not the seed
    expect(bmrFloorApplied).toBe(true);
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
  test("returns null below the engagement threshold (6 weigh-ins)", () => {
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

  // Build 14 daily weigh-ins losing 0.2 kg/wk faster than expected + a full week of
  // deficit history, so a non-null calibration is produced for the unit checks below.
  const scenario = (inFlight, weighInCount = 14) => {
    const today = new Date();
    // ~0.7 kg/wk loss vs ~0.55 expected → a mild error, so the step sits below the cap
    // and the dead-time / confidence effects are visible rather than saturated.
    const weighIns = Array.from({ length: weighInCount }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (weighInCount - 1) + i);
      return { date: d.toISOString().split("T")[0], weight: 80 - i * 0.1 };
    });
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoKey = weekAgo.toISOString().split("T")[0];
    const history = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - 7 + i);
      return { date: d.toISOString().split("T")[0], kcal: 1800 };
    }).filter(d => d.date >= weekAgoKey);
    return runCalibration(history, weighIns, 2400, inFlight);
  };

  test("dead-time compensation: an in-flight adjustment shrinks (never enlarges) the next step", () => {
    const raw  = scenario(0);
    const comp = scenario(150); // 150 kcal of correction already applied but not yet in the weight window
    expect(raw).not.toBeNull();
    expect(comp).not.toBeNull();
    expect(comp.adj).toBeLessThan(raw.adj);            // don't re-count the in-flight correction
    expect(raw.adj - comp.adj).toBeGreaterThanOrEqual(50); // ~0.8 × 150, rounded to 25
  });

  test("confidence-scaled cap: more weigh-ins permit a larger single step", () => {
    // Same signal, different history length → different confidence tier → different cap.
    const low  = scenario(0, 12); // <14 → low → cap 100
    const high = scenario(0, 30); // ≥28 → high → cap 200
    expect(low.confidence).toBe("low");
    expect(high.confidence).toBe("high");
    expect(Math.abs(low.adj)).toBeLessThanOrEqual(100);
    expect(Math.abs(high.adj)).toBeGreaterThan(100);
  });

  // ACCEPTANCE (ENERGY_MODEL §5 Step 2): a real 500 kcal under-estimate closes within ~3
  // weeks WITHOUT lurching — the whole point of the strengthening. Simulates a maintain-mode
  // user eating exactly at target while their true TDEE is 500 above the seed; each day
  // re-anchors the trailing windows to "today" and applies the ≥25 step under the ±600 cap
  // with dead-time compensation, exactly as the app does.
  test("closes a 500 kcal gap in ≤3 weeks and settles without overshooting the cap", () => {
    const dk = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
    const seed = 2200, trueTDEE = 2700, today = new Date();
    let tdeeAdj = 0, weight = 80, closedDay = null, maxAdj = 0, maxStep = 0;
    const series = [], adjLog = [], N = 35;
    for (let day = 0; day < N; day++) {
      const intake = seed + tdeeAdj;
      weight += (intake - trueTDEE) / 7700;            // maintain, perfect adherence
      series.push({ weight, kcal: intake });
      const len = series.length;
      const weighIns = series.map((s, i) => ({ date: dk(new Date(today.getTime() - (len-1-i)*86400000)), weight: s.weight }));
      const history  = series.map((s, i) => ({ date: dk(new Date(today.getTime() - (len-1-i)*86400000)), kcal: s.kcal }));
      const inFlight = adjLog.filter(a => a.dayIdx > day - 7).reduce((s, a) => s + a.adj, 0);
      const r = runCalibration(history, weighIns, seed + tdeeAdj, inFlight);
      if (r && Math.abs(r.adj) >= 25) {
        const prev = tdeeAdj;
        tdeeAdj = Math.max(-600, Math.min(600, tdeeAdj + r.adj));
        const applied = tdeeAdj - prev;
        if (applied !== 0) { adjLog.push({ dayIdx: day, adj: applied }); maxStep = Math.max(maxStep, Math.abs(applied)); }
      }
      maxAdj = Math.max(maxAdj, tdeeAdj);
      if (closedDay === null && tdeeAdj >= 450) closedDay = day + 1;
    }
    expect(closedDay).not.toBeNull();
    expect(closedDay).toBeLessThanOrEqual(21);         // ≤ 3 weeks
    expect(maxAdj).toBeLessThan(600);                  // never pinned at the safety cap (no runaway overshoot)
    expect(maxStep).toBeLessThanOrEqual(200);          // no single lurch beyond the high-confidence cap
    expect(tdeeAdj).toBeGreaterThanOrEqual(450);       // settled at the true gap (±50)
    expect(tdeeAdj).toBeLessThanOrEqual(575);
  });
});

// ── Weigh-in engagement (energy Step 2 companion; features/energy-safety/06) ──
// Mirror of app.jsx: cadence default + the pure nudge gate (a week with no weigh-in,
// respecting the mute and the post-dismissal cooldown).
const WEIGH_NUDGE_GAP_DAYS = 7, WEIGH_NUDGE_COOLDOWN_DAYS = 14;
const WEIGH_CADENCE = { few:1, daily:1, weekly:1, off:1 };
const weighCadenceOf = p => (p && WEIGH_CADENCE[p.weighCadence] ? p.weighCadence : "few");
const daysBetweenTs = (a, b) => Math.floor((b - a) / 86400000);
const shouldNudgeWeighIn = ({ cadence, lastActivityTs, dismissedTs, now,
  gapDays = WEIGH_NUDGE_GAP_DAYS, cooldownDays = WEIGH_NUDGE_COOLDOWN_DAYS }) => {
  if (cadence === "off") return false;
  if (lastActivityTs == null) return false;
  if (daysBetweenTs(lastActivityTs, now) < gapDays) return false;
  if (dismissedTs != null && daysBetweenTs(dismissedTs, now) < cooldownDays) return false;
  return true;
};

describe("weighCadenceOf", () => {
  test("defaults to 'few' when unset or unknown", () => {
    expect(weighCadenceOf(null)).toBe("few");
    expect(weighCadenceOf({})).toBe("few");
    expect(weighCadenceOf({ weighCadence: "nonsense" })).toBe("few");
  });
  test("respects a valid stored cadence", () => {
    expect(weighCadenceOf({ weighCadence: "weekly" })).toBe("weekly");
    expect(weighCadenceOf({ weighCadence: "off" })).toBe("off");
  });
});

describe("shouldNudgeWeighIn", () => {
  const now = new Date("2026-08-20T09:00:00Z").getTime();
  const daysAgo = n => now - n * 86400000;

  test("'I'd rather not' (off) never nudges, even after a long gap", () => {
    expect(shouldNudgeWeighIn({ cadence: "off", lastActivityTs: daysAgo(30), dismissedTs: null, now })).toBe(false);
  });

  test("no anchor yet (brand-new user) does not nudge", () => {
    expect(shouldNudgeWeighIn({ cadence: "few", lastActivityTs: null, dismissedTs: null, now })).toBe(false);
  });

  test("a gap under a week does not nudge; a week or more does", () => {
    expect(shouldNudgeWeighIn({ cadence: "few", lastActivityTs: daysAgo(6), dismissedTs: null, now })).toBe(false);
    expect(shouldNudgeWeighIn({ cadence: "few", lastActivityTs: daysAgo(7), dismissedTs: null, now })).toBe(true);
    expect(shouldNudgeWeighIn({ cadence: "daily", lastActivityTs: daysAgo(20), dismissedTs: null, now })).toBe(true);
  });

  test("a recent dismissal silences the nudge until the cooldown passes", () => {
    const lastActivityTs = daysAgo(20); // well past the gap
    expect(shouldNudgeWeighIn({ cadence: "few", lastActivityTs, dismissedTs: daysAgo(3),  now })).toBe(false); // in cooldown
    expect(shouldNudgeWeighIn({ cadence: "few", lastActivityTs, dismissedTs: daysAgo(14), now })).toBe(true);  // cooldown elapsed
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

const normConf = c => {
  let n = Number(c);
  if (!isFinite(n)) return 50;
  if (n > 0 && n <= 1) n = n * 100;
  return Math.round(Math.max(0, Math.min(100, n)));
};

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

describe("normConf — model confidence normalised to 0–100", () => {
  test("a 0–1 fraction is scaled up (the quiche bug)", () => {
    expect(normConf(0.72)).toBe(72);
    expect(normConf(0.5)).toBe(50);
    expect(normConf(1)).toBe(100);   // bare 1 read as fully confident
  });
  test("a proper 0–100 value passes through", () => {
    expect(normConf(72)).toBe(72);
    expect(normConf(98)).toBe(98);
    expect(normConf(0)).toBe(0);
  });
  test("out-of-range is clamped and junk defaults to 50", () => {
    expect(normConf(150)).toBe(100);
    expect(normConf(-5)).toBe(0);
    expect(normConf(undefined)).toBe(50);
    expect(normConf("nope")).toBe(50);
  });
});

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

// ── Smoothed earn-to-eat (energy-model Step 3) ────────────────────
// Mirror of app.jsx: a logged workout's kcal are spread FORWARD across a 3-day
// window as an energy-conserving weighted average (weights sum to 1). Front-loaded
// so today weighs most but a session no longer fully unlocks its own day.
const SMOOTH_WEIGHTS = [0.5, 0.3, 0.2];
const smoothWorkoutKcal = kcalByOffset =>
  Math.round(SMOOTH_WEIGHTS.reduce((s, w, i) => s + w * (kcalByOffset[i] || 0), 0));

describe("Smoothed earn-to-eat (Step 3)", () => {
  test("weights are energy-conserving (sum to 1)", () => {
    expect(SMOOTH_WEIGHTS.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  test("a single session is damped on its own day, not fully unlocked", () => {
    // 600 kcal logged today, nothing prior → only 0.5×600 lands today.
    expect(smoothWorkoutKcal([600, 0, 0])).toBe(300);
  });

  test("the day after a hard session still carries earned fuel", () => {
    // Rest today, 600 yesterday → 0.3×600 = 180 still fuels today.
    expect(smoothWorkoutKcal([0, 600, 0])).toBe(180);
  });

  test("fuel tapers across the window then disappears", () => {
    expect(smoothWorkoutKcal([0, 0, 600])).toBe(120); // 2 days ago
    // 3 days ago is outside the 3-slot window entirely → nothing to add.
    expect(smoothWorkoutKcal([0, 0, 0])).toBe(0);
  });

  test("the training-day share strictly exceeds later days", () => {
    const day0 = smoothWorkoutKcal([600, 0, 0]);
    const day1 = smoothWorkoutKcal([0, 600, 0]);
    const day2 = smoothWorkoutKcal([0, 0, 600]);
    expect(day0).toBeGreaterThan(day1);
    expect(day1).toBeGreaterThan(day2);
  });

  test("back-to-back days average, never stack", () => {
    // 600 yesterday + 600 today → 0.5×600 + 0.3×600 = 480, well below 1200,
    // and above a single session's same-day 300.
    const stacked = smoothWorkoutKcal([600, 600, 0]);
    expect(stacked).toBe(480);
    expect(stacked).toBeLessThan(1200);
    expect(stacked).toBeGreaterThan(300);
  });

  test("steady training settles to a stable daily bonus", () => {
    // Same 600 every day → 0.5+0.3+0.2 = 1.0 × 600 = 600 (== avg daily load).
    expect(smoothWorkoutKcal([600, 600, 600])).toBe(600);
  });

  test("no training in the window adds nothing (baseline unchanged)", () => {
    expect(smoothWorkoutKcal([])).toBe(0);
    expect(smoothWorkoutKcal([0, 0, 0])).toBe(0);
  });
});

// ── Energy floor + low-fuel warning (Step 4; features/energy-safety/01) ────────
// Numbers here are DERIVED from the formulas, never hardcoded upstream. Contrasting
// bodies prove each rule is computed. The two protections are tested separately
// because they are separate: the deficit floor CLAMPS, energy availability WARNS.
describe("Step 4 — steady-loss floor (the hard clamp)", () => {
  const tdeeOf = p => {
    const bmr = Math.round(370 + 21.6 * p.weight * (1 - p.bodyFat / 100));
    return Math.round(bmr * (ACTIVITY[p.activity] || ACTIVITY.sedentary));
  };
  // Contrasting bodies: a large one where a flat −500 is modest, a small one where
  // the same flat −500 is a third of everything they burn.
  const large = { weight: 98.5, bodyFat: 30, sex: "male"   }; // TDEE ≈ 2231
  const small = { weight: 60,   bodyFat: 25, sex: "female" }; // TDEE ≈ 1610

  test("the floor is a fixed fraction of maintenance, so it tracks body size", () => {
    const fLarge = calcTargets(large, "cut").deficitFloor;
    const fSmall = calcTargets(small, "cut").deficitFloor;
    expect(fLarge).toBe(Math.round(0.75 * tdeeOf(large)));
    expect(fSmall).toBe(Math.round(0.75 * tdeeOf(small)));
    expect(fLarge).not.toBe(fSmall);
    // The point of replacing the flat floor: a big body's floor sits well above 1,400.
    expect(fLarge).toBeGreaterThan(SAFE_MIN.male);
  });

  test("a normal cut on a large body is NOT clamped — weight loss still works", () => {
    const { kcal, deficitFloorApplied } = calcTargets(large, "cut");
    expect(deficitFloorApplied).toBe(false);
    expect(kcal).toBe(tdeeOf(large) - 500); // the full 500 kcal deficit survives
  });

  test("the same flat cut IS eased on a small body, where it is too deep a share", () => {
    const { kcal, deficitFloorApplied, deficitFloor } = calcTargets(small, "cut");
    expect(deficitFloorApplied).toBe(true);
    expect(kcal).toBe(Math.max(deficitFloor, SAFE_MIN.female));
    expect(kcal).toBeGreaterThan(tdeeOf(small) - 500); // eased upward, not blocked
    expect(kcal).toBeLessThan(tdeeOf(small));          // still a real deficit
  });

  test("the deficit never exceeds a quarter of maintenance in any preset mode", () => {
    for (const p of [large, small]) {
      for (const mode of ["cut", "maintain", "bulk"]) {
        const { kcal } = calcTargets(p, mode);
        expect(kcal).toBeGreaterThanOrEqual(Math.round(0.75 * tdeeOf(p)));
      }
    }
  });

  test("maintain and bulk are untouched by the floor (it only binds a deficit)", () => {
    expect(calcTargets(large, "maintain").deficitFloorApplied).toBe(false);
    expect(calcTargets(large, "bulk").deficitFloorApplied).toBe(false);
  });

  test("the floor rises with the applied training bonus, so smoothing is not undone", () => {
    const bonus = 300; // the SMOOTHED bonus the target was actually built from
    const base  = calcTargets(large, "cut").deficitFloor;
    const withTraining = calcTargets(large, "cut", bonus, 0, 600).deficitFloor;
    expect(withTraining).toBe(Math.round(0.75 * (tdeeOf(large) + bonus)));
    expect(withTraining).toBeGreaterThan(base);
    // and the smoothed target still clears it — a training day isn't force-fed back
    expect(calcTargets(large, "cut", bonus, 0, 600).deficitFloorApplied).toBe(false);
  });

  test("a negative adaptive adjustment cannot deepen the real deficit past the cap", () => {
    // The floor is measured against BELIEVABLE maintenance (never below sedentary),
    // so auto-lowering can't quietly stack another 600 kcal onto the cut.
    const { kcal } = calcTargets(large, "cut", 0, -600);
    expect(kcal).toBe(Math.round(0.75 * tdeeOf(large)));
  });

  test("SAFE_MIN still wins when it is the stricter of the two", () => {
    const tiny = { weight: 45, bodyFat: 22, sex: "female" };
    const { kcal, safeMinApplied } = calcTargets(tiny, "cut");
    expect(safeMinApplied).toBe(true);
    expect(kcal).toBe(SAFE_MIN.female);
  });
});

describe("Step 4 — energy availability (warning only, never a clamp)", () => {
  const lean = { weight: 80, bodyFat: 10, sex: "male", activity: "very" };  // FFM 72
  const soft = { weight: 98.5, bodyFat: 30, sex: "male", activity: "very" }; // FFM 69

  test("EA is intake minus TODAY'S RAW burn, per kg of fat-free mass", () => {
    const { kcal, ea } = calcTargets(lean, "cut", 450, 0, 900);
    expect(ea).toBeCloseTo(Math.round(((kcal - 900) / 72) * 10) / 10, 5);
  });

  test("EA uses the raw burn, not the smoothed bonus the target was built from", () => {
    const smoothed = calcTargets(lean, "cut", 450, 0, 450).ea;
    const raw      = calcTargets(lean, "cut", 450, 0, 900).ea;
    expect(raw).toBeLessThan(smoothed); // the body spent 900 today, whatever we credited
  });

  test("a lean body training hard on a low target is flagged", () => {
    const { lowFuel } = calcTargets(lean, "cut", 450, 0, 900);
    expect(lowFuel).toBe(true);
  });

  test("the flag NEVER changes the target — it warns, it does not clamp", () => {
    const flagged = calcTargets(lean, "cut", 450, 0, 900);
    const quiet   = calcTargets(lean, "cut", 450, 0, 0);
    expect(flagged.lowFuel).toBe(true);
    expect(flagged.kcal).toBe(quiet.kcal); // identical target; only the flag differs
  });

  test("a body with fat reserves is not flagged at the same low EA", () => {
    // Same rule, contrasting body: this profile's EA is below 30 too, but EA-30 is
    // derived in lean athletes — here the reserves cover the gap, so no warning.
    const { ea, lowFuel } = calcTargets(soft, "cut", 450, 0, 900);
    expect(ea).toBeLessThan(EA_HARD);
    expect(lowFuel).toBe(false);
  });

  test("no training logged → no low-fuel warning, however deep the cut", () => {
    expect(calcTargets(lean, "cut", 0, -600, 0).lowFuel).toBe(false);
  });

  test("a lean body that eats its training back is not flagged", () => {
    const { lowFuel } = calcTargets(lean, "bulk", 900, 0, 900);
    expect(lowFuel).toBe(false);
  });

  test("the lean gate is sex-specific and uses the profile's own body fat", () => {
    const leanWoman  = { weight: 62, bodyFat: 22, sex: "female", activity: "very" };
    const otherWoman = { weight: 62, bodyFat: 30, sex: "female", activity: "very" };
    expect(calcTargets(leanWoman,  "cut", 300, 0, 600).lowFuel).toBe(true);
    expect(calcTargets(otherWoman, "cut", 300, 0, 600).lowFuel).toBe(false);
    // a man at the woman's threshold is NOT lean by the male gate
    expect(calcTargets({ ...leanWoman, sex: "male" }, "cut", 300, 0, 600).lowFuel).toBe(false);
  });

  test("with body fat unset there is no EA at all, and SAFE_MIN backstops instead", () => {
    const unknown = { weight: 80, bodyFat: 0, sex: "male" };
    const t = calcTargets(unknown, "cut", 0, 0, 600);
    expect(t.ea).toBe(null);
    expect(t.lowFuel).toBe(false);
    expect(t.bodyFatUnset).toBe(true);
  });
});

// ── Cut cycling (energy Step 5; features/energy-safety/02) ────
// The numbers contract for the load model. Copy lives in the feature file; the exact
// arithmetic lives here. See ENERGY_MODEL.md §5.2 for why load, not calendar days.

const MAINT = 2500;                         // believable maintenance used throughout
const atDeficit = pct => MAINT * (1 - pct); // target kcal for a given deficit fraction

// Step a block forward n days with the same day-spec, from a fixed start date.
const runDays = (n, day, startK = "2026-01-01", block = EMPTY_CUT_BLOCK) => {
  let b = block, d = new Date(startK + "T12:00:00");
  for (let i = 0; i < n; i++) {
    b = stepCutBlock(b, { ...day, date: dateKey(d) });
    d = new Date(d.getTime() + 86400000);
  }
  return b;
};
const cutDay = (pct, weight = null) =>
  ({ cutting: true, load: dayCutLoad(atDeficit(pct), MAINT), weight });
const offDay = { cutting: false, load: 0, weight: null };

describe("dayCutLoad — a day is weighted by how deep the deficit is", () => {
  test("the reference deficit is exactly one load-day", () => {
    expect(dayCutLoad(atDeficit(0.20), MAINT)).toBe(1);
  });

  test("a gentler deficit counts for less, a deeper one for more", () => {
    expect(dayCutLoad(atDeficit(0.10), MAINT)).toBe(0.5);
    expect(dayCutLoad(atDeficit(0.25), MAINT)).toBe(1.25);
  });

  test("it is a ratio, so the same deficit fraction scores the same at any body size", () => {
    expect(dayCutLoad(1280, 1600)).toBe(dayCutLoad(2560, 3200)); // 20% of 1,600 and of 3,200
  });

  test("anything shallower than CUT_MIN_FRAC is noise, not a cut", () => {
    expect(dayCutLoad(atDeficit(0.03), MAINT)).toBe(0);
    expect(dayCutLoad(MAINT, MAINT)).toBe(0);       // maintenance
    expect(dayCutLoad(MAINT * 1.1, MAINT)).toBe(0); // a surplus never accrues
  });

  test("a missing or nonsense maintenance never accrues", () => {
    expect(dayCutLoad(2000, 0)).toBe(0);
    expect(dayCutLoad(2000, null)).toBe(0);
  });
});

describe("cut blocks — a gentle cut runs longer, a deep one is cautioned sooner", () => {
  const daysToHard = pct => {
    let b = EMPTY_CUT_BLOCK, n = 0, d = new Date("2026-01-01T12:00:00");
    while (b.load < CUT_BLOCK_HARD_PROMPT && n < 500) {
      b = stepCutBlock(b, { ...cutDay(pct), date: dateKey(d) });
      d = new Date(d.getTime() + 86400000); n++;
    }
    return n;
  };

  test("10% / 20% / 25% deficits reach the hard prompt at ~24 / 12 / ~10 real weeks", () => {
    expect(daysToHard(0.10)).toBe(168);  // 24 weeks
    expect(daysToHard(0.20)).toBe(84);   // 12 weeks
    expect(daysToHard(0.25)).toBe(68);   // ~9.7 weeks
    // the ordering is the real guarantee: a deeper cut is ALWAYS cautioned sooner
    expect(daysToHard(0.10)).toBeGreaterThan(daysToHard(0.20));
    expect(daysToHard(0.20)).toBeGreaterThan(daysToHard(0.25));
  });

  test("Step 4's MAX_DEFICIT_FRAC bounds how fast any preset target can trip it", () => {
    expect(daysToHard(MAX_DEFICIT_FRAC)).toBeGreaterThanOrEqual(67);
  });

  test("the block starts on the first qualifying day and counts from zero", () => {
    const b = runDays(1, cutDay(0.20, 98.5));
    expect(b.start).toBe("2026-01-01");
    expect(b.load).toBe(1);
    expect(b.startWeight).toBe(98.5);
  });

  test("a deficit under CUT_MIN_FRAC never opens a block however long it runs", () => {
    const b = runDays(30, cutDay(0.03));
    expect(b.start).toBe(null);
    expect(b.load).toBe(0);
    expect(cutPromptFor({ block: b, profile: {}, todayK: "2026-01-31" })).toBe(null);
  });

  test("a single day off Cut does not reset the counter", () => {
    let b = runDays(30, cutDay(0.20));
    expect(b.load).toBe(30);
    b = stepCutBlock(b, { ...offDay, date: "2026-01-31" });
    b = stepCutBlock(b, { ...cutDay(0.20), date: "2026-02-01" });
    expect(b.start).toBe("2026-01-01"); // same block
    expect(b.load).toBe(31);            // continued, not restarted
  });

  test("BLOCK_END_GRACE consecutive non-cut days closes the block, but the year remembers", () => {
    let b = runDays(50, cutDay(0.20));
    expect(b.load).toBe(50);
    b = runDays(BLOCK_END_GRACE, offDay, "2026-02-20", b);
    expect(b.start).toBe(null);
    expect(b.load).toBe(0);
    expect(b.yearLoad).toBe(50 - BLOCK_END_GRACE * MAINTENANCE_DECAY); // 43
    b = stepCutBlock(b, { ...cutDay(0.20), date: "2026-03-01" });
    expect(b.start).toBe("2026-03-01");  // a NEW block, from zero
    expect(b.load).toBe(1);
  });

  test("six days off does NOT close the block — the grace window is not trivially trippable", () => {
    let b = runDays(50, cutDay(0.20));
    b = runDays(BLOCK_END_GRACE - 1, offDay, "2026-02-20", b);
    expect(b.start).toBe("2026-01-01");
    expect(b.load).toBe(50);
  });
});

describe("cut load — not logging never pauses the clock", () => {
  test("days the app was never opened are caught up on the next open", () => {
    const start = { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load: 40, yearLoad: 40,
      lastAccrued: "2026-02-09" };
    const b = accrueCutBlock(start, "2026-02-15", cutDay(0.20)); // 6 days closed
    expect(b.load).toBe(46);
    expect(b.lastAccrued).toBe("2026-02-15");
  });

  test("accrual is idempotent — reopening the app the same day cannot double-count", () => {
    const b1 = accrueCutBlock(EMPTY_CUT_BLOCK, "2026-01-01", cutDay(0.20));
    const b3 = accrueCutBlock(accrueCutBlock(b1, "2026-01-01", cutDay(0.20)),
      "2026-01-01", cutDay(0.20));
    expect(b1.load).toBe(1);
    expect(b3.load).toBe(1);
  });

  test("a dormant install doesn't spin through unbounded history", () => {
    const stale = { ...EMPTY_CUT_BLOCK, lastAccrued: "2020-01-01" };
    const b = accrueCutBlock(stale, "2026-01-01", cutDay(0.20));
    expect(b.load).toBeLessThanOrEqual(370);
    expect(b.lastAccrued).toBe("2026-01-01");
  });
});

describe("weeklyLossFrac — the weight-trend backstop", () => {
  // 14 daily weigh-ins losing a steady 0.1 kg/day from 100 kg
  const steady = Array.from({ length: 14 }, (_, i) => ({
    date: dateKey(new Date(new Date("2026-01-01T12:00:00").getTime() + i * 86400000)),
    weight: 100 - i * 0.1,
  }));

  test("a real downward trend reads as cutting whatever mode is selected", () => {
    expect(weeklyLossFrac(steady, "2026-01-14")).toBeGreaterThan(TREND_CUT_RATE);
  });

  test("a flat scale does not", () => {
    expect(weeklyLossFrac(steady.map(w => ({ ...w, weight: 100 })), "2026-01-14")).toBe(0);
  });

  test("too few weigh-ins yields null rather than a false reading", () => {
    expect(weeklyLossFrac(steady.slice(0, 2), "2026-01-14")).toBe(null);
    expect(weeklyLossFrac([], "2026-01-14")).toBe(null);
  });
});

describe("cutPromptFor — thresholds, real weeks, and snoozing", () => {
  const normal = { weight: 90, bodyFat: 25, sex: "male" };
  const lean   = { weight: 80, bodyFat: 12, sex: "male" };

  test("no block, no prompt", () => {
    expect(cutPromptFor({ block: EMPTY_CUT_BLOCK, profile: normal, todayK: "2026-03-01" })).toBe(null);
  });

  test("soft nudge at the soft threshold, hard prompt at the hard one", () => {
    const at = load => cutPromptFor({
      block: { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load },
      profile: normal, todayK: "2026-03-01" });
    expect(at(CUT_BLOCK_SOFT_NUDGE - 1)).toBe(null);
    expect(at(CUT_BLOCK_SOFT_NUDGE).level).toBe("soft");
    expect(at(CUT_BLOCK_HARD_PROMPT - 1).level).toBe("soft");
    expect(at(CUT_BLOCK_HARD_PROMPT).level).toBe("hard");
  });

  test("the lean modifier pulls both thresholds earlier, reusing Step 4's isLeanBody", () => {
    const at = (profile, load) => cutPromptFor({
      block: { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load }, profile, todayK: "2026-03-01" });
    expect(at(lean, CUT_BLOCK_LEAN_SOFT).level).toBe("soft");
    expect(at(lean, CUT_BLOCK_LEAN_HARD).level).toBe("hard");
    expect(at(normal, CUT_BLOCK_LEAN_HARD).level).toBe("soft"); // same load, normal body
    expect(cutThresholds(lean).hard).toBeLessThan(cutThresholds(normal).hard);
  });

  test("the card reports REAL elapsed weeks, not load", () => {
    // a 15% cut accrues 0.75/day, so 84 load takes 112 real days = 16 weeks
    const b = runDays(112, cutDay(0.15));
    expect(b.load).toBe(CUT_BLOCK_HARD_PROMPT);
    const prompt = cutPromptFor({ block: b, profile: normal, todayK: "2026-04-23" });
    expect(prompt.level).toBe("hard");
    expect(prompt.weeks).toBe(16); // NOT 12, which is what the load alone would imply
  });

  test("a deep cutter is prompted sooner AND told the smaller true week count", () => {
    const b = runDays(68, cutDay(0.25));
    const prompt = cutPromptFor({ block: b, profile: normal, todayK: "2026-03-09" });
    expect(prompt.level).toBe("hard");
    expect(prompt.weeks).toBe(10);
  });

  test("losing BLOCK_LOSS_TRIGGER of bodyweight forces the prompt below the load threshold", () => {
    const b = { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load: 20 };
    expect(cutPromptFor({ block: b, profile: normal, todayK: "2026-02-01" })).toBe(null);
    const p = cutPromptFor({ block: b, profile: normal, todayK: "2026-02-01", lossFrac: 0.05 });
    expect(p.level).toBe("hard");
    expect(p.bigLoss).toBe(true);
  });

  test("the soft nudge is silent for 7 days after 'Not yet', then returns", () => {
    const now = Date.parse("2026-03-01T12:00:00Z");
    const b = { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load: CUT_BLOCK_SOFT_NUDGE,
      nudgeAt: now - 6 * 86400000 };
    expect(cutPromptFor({ block: b, profile: normal, todayK: "2026-03-01", now })).toBe(null);
    const later = { ...b, nudgeAt: now - 8 * 86400000 };
    expect(cutPromptFor({ block: later, profile: normal, todayK: "2026-03-01", now }).level).toBe("soft");
  });

  test("the hard prompt snoozes for 3 days only — there is no permanent dismissal", () => {
    const now = Date.parse("2026-03-01T12:00:00Z");
    const b = { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load: CUT_BLOCK_HARD_PROMPT,
      snoozeAt: now - 2 * 86400000 };
    expect(cutPromptFor({ block: b, profile: normal, todayK: "2026-03-01", now })).toBe(null);
    const returned = { ...b, snoozeAt: now - 4 * 86400000 };
    expect(cutPromptFor({ block: returned, profile: normal, todayK: "2026-03-01", now }).level).toBe("hard");
    // a soft-nudge dismissal can never silence the hard prompt
    const dismissed = { ...EMPTY_CUT_BLOCK, start: "2026-01-01",
      load: CUT_BLOCK_HARD_PROMPT, nudgeAt: now };
    expect(cutPromptFor({ block: dismissed, profile: normal, todayK: "2026-03-01", now }).level).toBe("hard");
  });

  test("the week count keeps climbing while the prompt is showing", () => {
    const b = { ...EMPTY_CUT_BLOCK, start: "2026-01-01", load: CUT_BLOCK_HARD_PROMPT };
    expect(cutPromptFor({ block: b, profile: normal, todayK: "2026-04-23" }).weeks).toBe(16);
    expect(cutPromptFor({ block: b, profile: normal, todayK: "2026-05-21" }).weeks).toBe(20);
  });
});

describe("cut load for the year — maintenance pays it down", () => {
  const anyBody = { weight: 90, bodyFat: 25, sex: "male" };

  test("14 days at maintenance removes 14 load-days", () => {
    const b = runDays(14, offDay, "2026-03-01", { ...EMPTY_CUT_BLOCK, yearLoad: 150 });
    expect(b.yearLoad).toBe(136);
  });

  test("the yearly total never goes negative however long you maintain", () => {
    const b = runDays(30, offDay, "2026-03-01", { ...EMPTY_CUT_BLOCK, yearLoad: 5 });
    expect(b.yearLoad).toBe(0);
  });

  test("a heavy year escalates the message; a light one does not", () => {
    const heavy = { ...EMPTY_CUT_BLOCK, start: "2026-01-01",
      load: CUT_BLOCK_HARD_PROMPT, yearLoad: CUMULATIVE_CUT_ESCALATE + 1 };
    const light = { ...heavy, yearLoad: CUMULATIVE_CUT_ESCALATE - 1 };
    expect(cutPromptFor({ block: heavy, profile: anyBody, todayK: "2026-04-23" }).escalate).toBe(true);
    expect(cutPromptFor({ block: light, profile: anyBody, todayK: "2026-04-23" }).escalate).toBe(false);
  });
});
