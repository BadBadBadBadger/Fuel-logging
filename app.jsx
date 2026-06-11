// ─────────────────────────────────────────────────────────────
// FUEL LOG — src/app.jsx
// Build: npx babel src/app.jsx --presets @babel/preset-react -o app.js
// ─────────────────────────────────────────────────────────────

var exports = window.exports || {};
// ── Constants ─────────────────────────────────────────────────

const A = "#e8e2d4", BG = "#0b0d0b", CARD = "#141210", BD = "#24211b";

// ── Auth / Premium ────────────────────────────────────────────
// Fill GOOGLE_CLIENT_ID after Google Cloud Console setup — see DOCS.md §29.
// Leave empty ("") to skip Google Sign In and go straight to voucher entry (dev mode).
const GOOGLE_CLIENT_ID = "922818167366-5nl6qfteipui307j1oi7asu7d3bkgvat.apps.googleusercontent.com";

// Voucher codes are no longer in the client bundle (Phase A).
// Validation happens server-side in the Cloudflare Worker /redeem endpoint.

const MODES = {
  cut:      { label:"CUT",      color:"#4b9fff", adj:-500 },
  maintain: { label:"MAINTAIN", color:"#e8e2d4", adj:0    },
  bulk:     { label:"BULK",     color:"#ff7b4b", adj:500  },
};


const SESS_TYPES = ["legs","push","pull","fullbody","cardio"];
const SESS_INT   = ["light","moderate","heavy"];
const MET = {
  legs:     { light:4.0, moderate:6.0, heavy:8.0 },
  push:     { light:3.5, moderate:5.5, heavy:7.0 },
  pull:     { light:3.5, moderate:5.5, heavy:7.0 },
  fullbody: { light:4.5, moderate:6.5, heavy:9.0 },
  cardio:   { light:5.0, moderate:7.0, heavy:10.0 },
};

const BDGS = [
  { id:"streak",   name:"On Fire",      emoji:"🔥", desc:"day logging streak" },
  { id:"logger",   name:"Top Recorder", emoji:"🪈", desc:"total days logged"   },
  { id:"hydrated", name:"Hydrated",     emoji:"💧", desc:"days hitting 8 glasses" },
];
const TIERS      = [3, 6, 12, 24, 48, 96];
const TIER_NAMES = ["Bronze","Silver","Gold","Platinum","Diamond","Elite"];
const TIER_ICONS = ["🟤","⚪","🟡","🔵","💎","👑"];

const DEF_PROFILE = { weight:80, height:178, bodyFat:18, sex:null };

// ── Dietary requirements & allergies (feature #8) ─────────────────
// Suggestion lists for the profile tag-input. Allergens are the UK/EEA 'Big 14'
// (FIC regulated). The user can also commit a custom tag not in these lists.
const DIET_SUGGESTIONS = ["vegan","vegetarian","pescatarian","halal","kosher",
  "dairy-free","gluten-free","keto","low-carb"];
const BIG14_ALLERGENS = ["celery","gluten","crustaceans","eggs","fish","lupin","milk",
  "molluscs","mustard","peanuts","sesame","soya","sulphites","tree nuts"];

// Single-user cache so the scattered AI prompt builders (coach, AI Log, re-estimate,
// Quick Add estimate) can read the user's dietary config without threading a prop
// through every food surface. Refreshed whenever the profile loads or saves.
let DIETARY = { diets:[], allergens:[], dislikes:[] };
const normaliseDietary = d => ({
  diets:     d && Array.isArray(d.diets)     ? d.diets     : [],
  allergens: d && Array.isArray(d.allergens) ? d.allergens : [],
  dislikes:  d && Array.isArray(d.dislikes)  ? d.dislikes  : [],
});
const setDietaryCache = d => { DIETARY = normaliseDietary(d); };

// Hard-exclusion block appended to every AI food prompt. Empty when nothing is
// configured (no-regression). Diets + allergens are HARD; dislikes are SOFT.
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

// Zero-token output backstop: which declared allergens does this text name?
// Synonyms expand the trickier presets; matching uses a START word-boundary so
// plurals/derivatives still hit (walnut→walnuts). We deliberately bias toward
// OVER-detection — a spurious flag is cautious, a missed allergen is dangerous.
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

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

// ── Legal / compliance (LEGAL_ROADMAP Phase B) ────────────────
// Bump POLICY_VERSION whenever the privacy policy changes materially; the value
// is stored against each consent so we know which version a user agreed to.
const POLICY_VERSION = "1.2"; // v1.2: privacy policy now covers dietary requirements & allergies (#8)
const LEGAL = {
  privacy:       "legal/privacy.html",
  terms:         "legal/terms.html",
  subprocessors: "legal/subprocessors.html",
  deleteInfo:    "legal/delete-account.html",
};

const DEF_MEALS = [
  { name:"Chicken breast (150g)",    kcal:248, protein:47, carbs:0,  fat:5  },
  { name:"Brown rice (200g cooked)", kcal:218, protein:5,  carbs:46, fat:2  },
  { name:"Scrambled eggs (3 large)", kcal:234, protein:18, carbs:1,  fat:17 },
  { name:"Oats (80g dry)",           kcal:304, protein:11, carbs:54, fat:6  },
  { name:"Greek yoghurt (200g)",     kcal:130, protein:18, carbs:6,  fat:4  },
  { name:"Whey protein shake",       kcal:130, protein:25, carbs:5,  fat:2  },
  { name:"Banana (medium)",          kcal:89,  protein:1,  carbs:23, fat:0  },
  { name:"Tuna can (120g drained)",  kcal:132, protein:29, carbs:0,  fat:1  },
  { name:"Salmon fillet (150g)",     kcal:280, protein:35, carbs:0,  fat:15 },
  { name:"Sweet potato (200g)",      kcal:172, protein:3,  carbs:40, fat:0  },
  { name:"Broccoli (200g)",          kcal:68,  protein:6,  carbs:11, fat:1  },
  { name:"Mixed nuts (30g)",         kcal:185, protein:5,  carbs:6,  fat:16 },
  { name:"Whole milk (250ml)",       kcal:153, protein:8,  carbs:12, fat:8  },
  { name:"White rice (200g cooked)", kcal:260, protein:5,  carbs:57, fat:0  },
  { name:"Cottage cheese (200g)",    kcal:160, protein:22, carbs:6,  fat:4  },
  { name:"Avocado (half)",           kcal:120, protein:1,  carbs:6,  fat:11 },
  { name:"Peanut butter (2 tbsp)",   kcal:188, protein:8,  carbs:6,  fat:16 },
  { name:"Beef mince 5% fat (150g)", kcal:221, protein:33, carbs:0,  fat:9  },
  { name:"Protein bar (50g)",        kcal:200, protein:20, carbs:18, fat:7  },
  { name:"Whole eggs x2 boiled",     kcal:156, protein:12, carbs:1,  fat:11 },
];

// ── Dev overrides (harness only) ──────────────────────────────

const getDevDateOffset = () => {
  try { return parseInt(localStorage.getItem("dev_date_offset") || "0") || 0; } catch(e) { return 0; }
};
const getCurrentHour = () => {
  try {
    const v = localStorage.getItem("dev_time_hour");
    return v !== null ? parseInt(v) : new Date().getHours();
  } catch(e) { return new Date().getHours(); }
};

// ── Helpers ───────────────────────────────────────────────────

const todayKey = () => {
  const off = getDevDateOffset();
  const d = new Date(Date.now() + off * 86400000);
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};

const fmtShort = d => { const p = d.split("-"); return p[2] + "/" + p[1]; };
const fmtFull  = d => new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
  weekday:"short", day:"numeric", month:"short", year:"numeric"
});

const sumLogs = logs => logs.reduce((a, l) => ({
  kcal:    a.kcal    + (l.kcal    || 0),
  protein: a.protein + (l.protein || 0),
  carbs:   a.carbs   + (l.carbs   || 0),
  fat:     a.fat     + (l.fat     || 0),
}), { kcal:0, protein:0, carbs:0, fat:0 });

const calcStreak = hist => {
  let s = 0;
  const d = new Date(Date.now() + getDevDateOffset() * 86400000);
  for (;;) {
    const k = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
    if (!(hist.find(h => h.date === k)?.logs?.length)) break;
    s++;
    d.setDate(d.getDate() - 1);
  }
  return s;
};

const estimateSessionKcal = (w, bf, type, dur, int) =>
  Math.round((MET[type]?.[int] || 5) * w * ((w * (1 - bf / 100)) / 70) * (dur / 60));

const SAFE_MIN = { male:1400, female:1200 };

// ── Macro floor engine (feature #7) ──────────────────────────────
// One source of truth for protein/fat/carbs at any calorie target, used by both
// the preset path (calcTargets) and the custom-target path. Protein and fat are
// FLOORS, not proportionally-scaled values — carbs absorb the whole deficit/surplus.
//   • protein: a flat g/kg-LEAN-MASS floor, identical in every mode, so it stops
//     fluctuating on a cut/maintain/bulk switch (male 2.2 / female 2.0).
//   • fat: stays mode-varying (more to spare on a bulk) but never below a hormonal
//     floor of 0.6 g/kg BODYWEIGHT — this is what the old proportional scaling broke.
//   • carbs: whatever calories remain after the two floors, min 50g.
//   • floorsExceedKcal: true when the target is too low to fit both floors + min
//     carbs. We keep the floors (never silently break one) and let the UI warn.
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
  // The floors alone (+ minimum carbs) already cost more than the target asks for.
  const floorsExceedKcal = floorKcal + MIN_CARBS_G * 4 > kcal;

  return { protein, carbs, fat, lbm: Math.round(lbm), floorsExceedKcal };
};

const calcTargets = (p, mode, totalWorkoutKcal = 0, tdeeAdj = 0) => {
  const w   = Number(p.weight)  || 80;
  const bf  = Number(p.bodyFat) || 18;
  const sex = p.sex || "male";
  const lbm = w * (1 - bf / 100);
  const bmr  = Math.round(370 + 21.6 * lbm);
  const tdee = Math.round(bmr * 1.2) + tdeeAdj;
  let kcal   = tdee + MODES[mode].adj + (totalWorkoutKcal || 0);
  const safeMin = SAFE_MIN[sex] || 1400;
  const safeMinApplied = kcal < safeMin;
  if (safeMinApplied) kcal = safeMin;
  const m = computeMacros(p, mode, kcal);
  return { kcal, protein: m.protein, carbs: m.carbs, fat: m.fat, tdee, bmr,
    lbm: m.lbm, bonus: totalWorkoutKcal || 0, safeMinApplied,
    floorsExceedKcal: m.floorsExceedKcal };
};

// ── Coach pacing (feature #6) ────────────────────────────────────
// Pace is COMPUTED here and handed to the LLM as a verdict — the model never
// judges "behind" itself (that misfires early in the day). Safeguards baked in:
//   • the eating window STARTS at today's first logged meal, not a wall clock,
//     so fasting / 16:8 / Ramadan users are never falsely told they're behind;
//   • callers pace only FLOOR goals (protein, water) — never the calorie ceiling,
//     where being under is success, not a failure to fix;
//   • "behind" is never used until >25% of the window has elapsed.
const EATING_WINDOW_H = 14; // a typical waking eating span measured from the first meal

const paceVerdict = (firstMealHour, nowHour, frac) => {
  if (firstMealHour == null) return { elapsed: 0, verdict: "ahead" }; // nothing eaten yet → window not started
  let elapsed = (nowHour - firstMealHour) / EATING_WINDOW_H;
  elapsed = Math.max(0, Math.min(1, elapsed));
  if (frac >= 1)              return { elapsed, verdict: "met" };
  if (elapsed < 0.25)         return { elapsed, verdict: "ahead" }; // day is just getting going
  if (frac >= elapsed)        return { elapsed, verdict: "ahead" };
  if (frac >= elapsed - 0.15) return { elapsed, verdict: "on" };
  return { elapsed, verdict: "behind" };
};

// ── Adaptive TDEE ─────────────────────────────────────────────

const dateKey = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");

const weighRollingAvg = (weighIns, beforeDate, n = 7) => {
  const subset = weighIns.filter(w => w.date < beforeDate).slice(-n);
  if (subset.length < 3) return null;
  return subset.reduce((a, w) => a + w.weight, 0) / subset.length;
};

const runCalibration = (history, weighIns, baseTDEE) => {
  if (weighIns.length < 8) return null;
  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoKey = dateKey(weekAgo);

  const recentAvg = weighRollingAvg(weighIns, dateKey(new Date(today.getTime() + 86400000)), 7);
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

const sg = async k => {
  try { const r = await window.storage.get(k); return r ? r.value : null; }
  catch(e) { return null; }
};
const ss = async (k, v) => {
  try { await window.storage.set(k, v); } catch(e) {}
};

const parseJwt = token => {
  try { return JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))); }
  catch(e) { return {}; }
};

// Haptic confirmation for Create / Update / Delete actions (#4). Fire-and-forget:
// feature-detected, wrapped so an unsupported or throwing Vibration API (e.g. iOS
// Safari) can never block or break the action. Reads never call this.
// 35ms, not 12 — Pixel-class LRA motors barely register a sub-~30ms raw vibrate
// (the keyboard feels crisp because it uses Android's tuned haptic effect, not
// this raw on/off timer). Still a single short tick, not a sustained buzz.
const haptic = (ms = 35) => { try { navigator.vibrate && navigator.vibrate(ms); } catch(e) {} };

// ── Supabase cloud sync ───────────────────────────────────────
const sb = () => window.supabaseClient;

const syncUpsert = async (table, rows, conflict) => {
  if (!sb() || !rows?.length) return;
  try { await sb().from(table).upsert(rows, { onConflict: conflict }); } catch(e) {}
};

const syncFoodLogs = async (uid, date, logs) => {
  if (!uid || !navigator.onLine) return;
  try { await sb().from("food_logs").delete().eq("user_id", uid).eq("date", date); } catch(e) {}
  if (!logs.length) return;
  const now = new Date().toISOString();
  await syncUpsert("food_logs",
    logs.map(l => ({ user_id:uid, date, entry_id:l.id, name:l.name,
      kcal:l.kcal, protein:l.protein, carbs:l.carbs, fat:l.fat,
      time:l.time||null, updated_at:now })),
    "user_id,entry_id");
};

const syncWater = async (uid, date, glasses) => {
  if (!uid || !navigator.onLine) return;
  await syncUpsert("water_logs",
    [{ user_id:uid, date, glasses, updated_at:new Date().toISOString() }], "user_id,date");
};

const syncWorkouts = async (uid, date, ws) => {
  if (!uid || !navigator.onLine) return;
  try { await sb().from("workouts").delete().eq("user_id", uid).eq("date", date); } catch(e) {}
  if (!ws.length) return;
  const now = new Date().toISOString();
  await syncUpsert("workouts",
    ws.map(w => ({ user_id:uid, date, entry_id:w.id, type:w.type,
      duration:w.duration, intensity:w.intensity, kcal:w.kcal||0,
      time:w.time||null, notes:w.notes||null, updated_at:now })),
    "user_id,entry_id");
};

const syncProfile = async (uid, p) => {
  if (!uid || !navigator.onLine || !p) return;
  try {
    await sb().from("profiles").upsert({
      id:uid, weight:p.weight, height:p.height,
      body_fat:p.bodyFat, sex:p.sex||null, updated_at:new Date().toISOString()
    });
  } catch(e) {}
};

// Persist the compliance consent record onto the profiles row (R2/R6). Upsert
// touches only the consent columns, leaving body metrics untouched on conflict.
const syncConsent = async (uid, meta) => {
  if (!uid || !navigator.onLine || !meta) return;
  try {
    await sb().from("profiles").upsert({
      id: uid,
      age_confirmed_at:       meta.ageConfirmedAt  ? new Date(meta.ageConfirmedAt).toISOString()  : null,
      health_consent_at:      meta.healthConsentAt ? new Date(meta.healthConsentAt).toISOString() : null,
      consent_policy_version: meta.policyVersion || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
  } catch(e) {}
};

// Record consent withdrawal (R2 — withdrawal must be as easy as giving it).
const syncConsentWithdrawn = async (uid) => {
  if (!uid || !navigator.onLine) return;
  try {
    await sb().from("profiles").upsert({
      id: uid, health_consent_withdrawn_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
  } catch(e) {}
};

const syncWeighIns = async (uid, wis) => {
  if (!uid || !navigator.onLine || !wis?.length) return;
  const now = new Date().toISOString();
  await syncUpsert("weigh_ins",
    wis.map(w => ({ user_id:uid, date:w.date, weight:w.weight, updated_at:now })),
    "user_id,date");
};

const syncSettings = async (uid, mode, tdeeAdj, customKcal, acked) => {
  if (!uid || !navigator.onLine) return;
  try {
    await sb().from("settings").upsert({
      id:uid, mode:mode||"cut", tdee_adj:tdeeAdj||0,
      custom_kcal:customKcal||null, aggressive_cut_acked:!!acked,
      updated_at:new Date().toISOString()
    });
  } catch(e) {}
};

const syncMeals = async (uid, meals) => {
  if (!uid || !navigator.onLine) return;
  const now = new Date().toISOString();
  await syncUpsert("meal_library",
    meals.map(m => ({ user_id:uid, name:m.name, kcal:m.kcal,
      protein:m.protein, carbs:m.carbs, fat:m.fat, updated_at:now })),
    "user_id,name");
};

const syncBadges = async (uid, keys) => {
  if (!uid || !navigator.onLine || !keys?.length) return;
  const now = new Date().toISOString();
  await syncUpsert("badges",
    keys.map(badge_key => ({ user_id:uid, badge_key, updated_at:now })),
    "user_id,badge_key");
};

const syncHistory = async (uid, hist) => {
  if (!uid || !navigator.onLine || !hist?.length) return;
  const now = new Date().toISOString();
  await syncUpsert("history_snapshots",
    hist.map(h => ({ user_id:uid, date:h.date, mode:h.mode, kcal:h.kcal,
      protein:h.protein, carbs:h.carbs, fat:h.fat,
      water:h.water||0, training:h.training||false, updated_at:now })),
    "user_id,date");
};

const migrateLocalToSupabase = async uid => {
  const migKey = "sync_migrated__" + uid;
  if (localStorage.getItem(migKey)) return;
  try {
    const pv = await sg("profile");
    if (pv) await syncProfile(uid, JSON.parse(pv));
    const wiv = await sg("weighins");
    if (wiv) await syncWeighIns(uid, JSON.parse(wiv));
    const m  = await sg("mode__" + todayKey()) || "cut";
    const ta = parseInt(await sg("tdee_adj") || "0") || 0;
    const ck = await sg("target_kcal");
    const ak = await sg("aggressive_cut_acked");
    await syncSettings(uid, m, ta, ck ? parseInt(ck) : null, !!ak);
    const mv = await sg("meals");
    if (mv) await syncMeals(uid, JSON.parse(mv));
    const bv = await sg("badges");
    if (bv) await syncBadges(uid, JSON.parse(bv));
    const hv = await sg("history");
    if (hv) {
      const hist = JSON.parse(hv);
      await syncHistory(uid, hist);
      for (const snap of hist) {
        if (snap.logs?.length) await syncFoodLogs(uid, snap.date, snap.logs);
        if (snap.water)        await syncWater(uid, snap.date, snap.water);
      }
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("workouts__")) {
        const v = localStorage.getItem(key);
        if (v) await syncWorkouts(uid, key.replace("workouts__", ""), JSON.parse(v));
      }
    }
    localStorage.setItem(migKey, "1");
  } catch(e) {}
};

const pullFromSupabase = async uid => {
  if (!uid || !navigator.onLine) return {};
  try {
    const [profR, weighR, settR, mealsR, badgesR, histR, foodR, waterR, workR] = await Promise.all([
      sb().from("profiles").select("*").eq("id", uid).maybeSingle(),
      sb().from("weigh_ins").select("*").eq("user_id", uid).order("date"),
      sb().from("settings").select("*").eq("id", uid).maybeSingle(),
      sb().from("meal_library").select("*").eq("user_id", uid),
      sb().from("badges").select("badge_key").eq("user_id", uid),
      sb().from("history_snapshots").select("*").eq("user_id", uid).order("date"),
      sb().from("food_logs").select("*").eq("user_id", uid).order("date"),
      sb().from("water_logs").select("*").eq("user_id", uid).order("date"),
      sb().from("workouts").select("*").eq("user_id", uid).order("date"),
    ]);
    const result = {};
    if (profR.data) {
      const p = { weight:profR.data.weight, height:profR.data.height,
        bodyFat:profR.data.body_fat, sex:profR.data.sex };
      await ss("profile", JSON.stringify(p));
      result.profile = p;
    }
    if (weighR.data?.length) {
      const wi = weighR.data.map(r => ({ date:r.date, weight:Number(r.weight) }));
      await ss("weighins", JSON.stringify(wi));
      result.weighIns = wi;
    }
    if (settR.data) {
      const s = settR.data;
      if (s.mode)                 await ss("mode__" + todayKey(), s.mode);
      if (s.tdee_adj != null)     await ss("tdee_adj", String(s.tdee_adj));
      if (s.custom_kcal != null)  await ss("target_kcal", String(s.custom_kcal));
      if (s.aggressive_cut_acked) await ss("aggressive_cut_acked", "1");
      result.settings = s;
    }
    if (mealsR.data?.length) {
      const meals = mealsR.data.map(m => ({ name:m.name, kcal:Number(m.kcal),
        protein:Number(m.protein), carbs:Number(m.carbs), fat:Number(m.fat) }));
      await ss("meals", JSON.stringify(meals));
      result.meals = meals;
    }
    if (badgesR.data?.length) {
      const keys = badgesR.data.map(b => b.badge_key);
      await ss("badges", JSON.stringify(keys));
      result.badges = keys;
    }
    const foodByDate = {};
    if (foodR.data) {
      for (const f of foodR.data) {
        if (!foodByDate[f.date]) foodByDate[f.date] = [];
        foodByDate[f.date].push({ id:f.entry_id, name:f.name, kcal:Number(f.kcal),
          protein:Number(f.protein), carbs:Number(f.carbs), fat:Number(f.fat), time:f.time });
      }
    }
    const waterByDate = {};
    if (waterR.data) for (const w of waterR.data) waterByDate[w.date] = w.glasses;
    if (histR.data?.length) {
      const fullHist = histR.data.map(h => ({
        date:h.date, mode:h.mode, kcal:h.kcal, protein:h.protein,
        carbs:h.carbs, fat:h.fat, training:h.training,
        water: waterByDate[h.date] ?? h.water ?? 0,
        logs:  foodByDate[h.date] || []
      }));
      await ss("history", JSON.stringify(fullHist));
      for (const snap of fullHist) {
        await ss("logs__"  + snap.date, JSON.stringify(snap.logs || []));
        await ss("water__" + snap.date, String(snap.water || 0));
      }
      result.history = fullHist;
    }
    if (workR.data?.length) {
      const byDate = {};
      for (const w of workR.data) {
        if (!byDate[w.date]) byDate[w.date] = [];
        byDate[w.date].push({ id:w.entry_id, type:w.type,
          duration:w.duration, intensity:w.intensity, kcal:w.kcal,
          time:w.time, notes:w.notes });
      }
      for (const [d, ws] of Object.entries(byDate)) await ss("workouts__" + d, JSON.stringify(ws));
      result.workouts = byDate;
    }
    return result;
  } catch(e) { return {}; }
};

// ── Data migrations ───────────────────────────────────────────
// Bump SCHEMA_VERSION and add a migration block each time the stored
// data shape changes. runMigrations() is called once on startup.

const SCHEMA_VERSION = 1;

const runMigrations = async () => {
  const stored = await sg("fuel_schema_v");
  const v = stored ? parseInt(stored) : 0;
  if (v >= SCHEMA_VERSION) return;

  // v0 → v1: baseline release — no transforms needed, just stamp version.
  // Add future migrations here: if (v < 2) { ... }

  await ss("fuel_schema_v", String(SCHEMA_VERSION));
};

// Current Supabase access token (JWT) — the worker requires it to authorise AI calls.
const getAccessToken = async () => {
  try {
    const client = sb();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data?.session?.access_token || null;
  } catch (e) { return null; }
};

// Server-side voucher redemption (Phase A). Sends the code to the worker /redeem endpoint.
const redeemVoucher = async (code) => {
  const token = await getAccessToken();
  if (!token) throw new Error("Please sign in to redeem a voucher.");
  const res = await fetch(AI_ENDPOINT + "/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify({ code: code.trim() }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Voucher redemption failed.");
  }
  return await res.json();
};

// Account deletion (R5). The worker deletes the auth.users row with the service
// role, which cascades to every table. The client cannot do this itself.
const deleteAccountRequest = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error("Please sign in again, then retry.");
  const res = await fetch(AI_ENDPOINT + "/delete-account", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
  });
  if (!res.ok) {
    let msg = "Account deletion failed. Please try again or email fuellogadmin@gmail.com.";
    try { msg = (await res.json()).error || msg; } catch(e) {}
    throw new Error(msg);
  }
  return true;
};

// Shared AI fetch — returns the text content string, throws on failure.
// Sends the Supabase JWT; the hardened worker rejects anonymous/over-limit calls.
const callAI = async (prompt, maxTokens = 500) => {
  const token = await getAccessToken();
  if (!token) throw new Error("Please sign in to use AI features.");
  // Hard timeout so a stalled request (e.g. flaky mobile signal) can never hang
  // the UI forever — it aborts and surfaces as a clear, retryable error.
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  let res;
  try {
    res = await fetch(AI_ENDPOINT, { method:"POST", signal: ctrl.signal,
      headers: { "Content-Type":"application/json", "Authorization":"Bearer " + token },
      body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:maxTokens,
        messages:[{ role:"user", content:prompt }] }) });
  } catch (e) {
    throw new Error(e.name === "AbortError"
      ? "AI request timed out — check your connection and try again."
      : "Couldn't reach the AI — check your connection.");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error("Your session expired — please sign in again.");
    if (res.status === 429) throw new Error("Daily AI limit reached — try again tomorrow.");
    if (res.status === 402 || res.status === 403) throw new Error("AI features require an active Premium account.");
    throw new Error("AI service is unavailable right now (" + res.status + ").");
  }
  const data = await res.json();
  return (data.content || []).map(b => b.text || "").join("").trim();
};
const repairJson = (text) => {
  let s = text.replace(/```json\s*|```/g, "").trim();
  // Extract outermost JSON object
  const start = s.indexOf('{'), end = s.lastIndexOf('}');
  if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
  // Fix trailing decimal points: 450. -> 450
  s = s.replace(/(\d+)\.\s*([,\}\]\n\r])/g, '$1$2');
  // Remove JS-style // comments
  s = s.replace(/\/\/[^\n]*/g, '');
  // Remove trailing commas before } or ]
  s = s.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(s);
};
const callAIJson = async (prompt, maxTokens = 500) => {
  const text = await callAI(prompt, maxTokens);
  return repairJson(text);
};

// ── Error Boundary ────────────────────────────────────────────

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) return (
      <div style={{ padding:24, color:"#ff5555", fontSize:13, lineHeight:1.6 }}>
        <div style={{ fontSize:16, fontWeight:900, marginBottom:8 }}>⚠️ Render error</div>
        <div style={{ fontFamily:"monospace", background:"#1a0d0d", padding:12, borderRadius:8, wordBreak:"break-all" }}>
          {this.state.err.message}
        </div>
      </div>
    );
    return this.props.children;
  }
}

// ── Premium Modals ────────────────────────────────────────────

function PremiumModal({ feature, onUpgrade, onDismiss }) {
  const emoji = feature ? feature.emoji : "⭐";
  const name  = feature ? feature.name  : "This feature";
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1002, padding:24 }}>
      <div style={{ background:CARD, borderRadius:24, padding:"36px 28px", textAlign:"center",
        border:`1px solid ${A}44`, maxWidth:300, width:"100%" }}>
        <div style={{ fontSize:64, marginBottom:10 }}>{emoji}</div>
        <div style={{ fontSize:11, color:A, letterSpacing:"0.12em", fontWeight:800, marginBottom:6 }}>PREMIUM FEATURE</div>
        <div style={{ fontSize:20, fontWeight:900, color:"#e6e1d7", marginBottom:8 }}>{name}</div>
        <div style={{ fontSize:13, color:"#aea79c", lineHeight:1.6, marginBottom:16 }}>
          AI features require a Premium account
        </div>
        <div style={{ background:"#0b0d0b", borderRadius:12, padding:"14px 16px", marginBottom:20, textAlign:"left" }}>
          <div style={{ fontSize:10, color:A, fontWeight:800, letterSpacing:"0.1em", marginBottom:10 }}>PREMIUM UNLOCKS</div>
          {[
            ["🤖", "AI Meal Log — describe any meal"],
            ["🏋️", "Workout AI Parser — paste and analyse"],
            ["🧑‍💼", "Daily Coach — personalised tips"],
            ["☁️",  "Cloud sync — log on any device"],
          ].map(([e, t], i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:6, alignItems:"center" }}>
              <span style={{ fontSize:15, flexShrink:0 }}>{e}</span>
              <span style={{ fontSize:12, color:"#b6b0a4", lineHeight:1.4 }}>{t}</span>
            </div>
          ))}
          <div style={{ fontSize:11, color:"#9b958b", marginTop:10, borderTop:`1px solid ${BD}`, paddingTop:10 }}>
            £4.99/month · £49.99/year · 30-day free trial
          </div>
        </div>
        <button onClick={onUpgrade}
          style={{ width:"100%", padding:"14px", background:A, color:"#0b0d0b",
            border:"none", borderRadius:12, fontSize:14, fontWeight:900, marginBottom:10 }}>
          Start Free Trial 🚀
        </button>
        <button onClick={onDismiss}
          style={{ width:"100%", padding:"10px", background:"none", color:"#9b958b",
            border:"none", fontSize:13, cursor:"pointer" }}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}

function SignInModal({ onSuccess, onCancel }) {
  const devMode = !GOOGLE_CLIENT_ID;
  const [step,   setStep]   = useState(devMode ? "payment" : "google");
  const [gUser,  setGUser]  = useState(devMode ? { name:"Guest", email:"", picture:"" } : null);
  const [voucher, setVoucher] = useState("");
  const [vError,  setVError]  = useState("");
  // Compliance gates (LEGAL_ROADMAP R6 + R2)
  const [ageOK,     setAgeOK]     = useState(false); // 18+ affirmation (before sign-in)
  const [consentOK, setConsentOK] = useState(false); // explicit health-data consent (before first sync)
  const [ageAt,     setAgeAt]     = useState(null);  // timestamp of the 18+ affirmation

  useEffect(() => {
    // Only render the Google button once the user has affirmed they are 18+.
    if (step !== "google" || devMode || typeof google === "undefined" || !ageOK) return;
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async resp => {
          try {
            const { data, error } = await sb().auth.signInWithIdToken({ provider: "google", token: resp.credential });
            if (error) throw error;
            const u = data.session.user;
            setGUser({ id: u.id, name: u.user_metadata.full_name || "User",
              email: u.email || "", picture: u.user_metadata.avatar_url || "" });
          } catch(e) {
            const p = parseJwt(resp.credential);
            setGUser({ name: p.name || "User", email: p.email || "", picture: p.picture || "" });
          }
          setStep("payment");
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      const el = document.getElementById("gsi-btn");
      if (el) google.accounts.id.renderButton(el, { theme:"outline", size:"large", width:252, text:"continue_with" });
    } catch(e) {}
  }, [step, ageOK]); // eslint-disable-line

  // Consent record passed up to handleSignInSuccess and persisted to the profiles row.
  const consentMeta = () => ({
    ageConfirmedAt:  ageAt || Date.now(),
    healthConsentAt: Date.now(),
    policyVersion:   POLICY_VERSION,
  });

  const handleVoucher = async () => {
    if (!consentOK) { setVError("Please consent to health-data storage to continue."); return; }
    if (!voucher.trim()) { setVError("Enter a voucher code."); return; }
    setVError("");
    try {
      await redeemVoucher(voucher);
      haptic();
      onSuccess(gUser || { name:"Guest", email:"", picture:"" }, "voucher", consentMeta());
    } catch(e) {
      setVError(e.message || "Redemption failed. Try again.");
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:24 }}>
      <div style={{ background:CARD, borderRadius:24, padding:"32px 24px",
        border:`1px solid ${A}33`, maxWidth:300, width:"100%" }}>

        {step === "google" && (
          <>
            <div style={{ fontSize:32, textAlign:"center", marginBottom:12 }}>🔐</div>
            <div style={{ fontSize:16, fontWeight:900, color:"#e6e1d7", textAlign:"center", marginBottom:6 }}>
              Sign in to continue
            </div>
            <div style={{ fontSize:13, color:"#9b958b", textAlign:"center", lineHeight:1.6, marginBottom:18 }}>
              We use Google Sign In to protect your account. No separate password needed.
            </div>

            {/* 18+ affirmation — must be ticked before the Google button appears (R6) */}
            <label style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer",
              background:"#0b0d0b", border:`1px solid ${ageOK ? A + "55" : BD}`, borderRadius:10,
              padding:"11px 12px", marginBottom:14 }}>
              <input type="checkbox" checked={ageOK}
                onChange={e => { setAgeOK(e.target.checked); if (e.target.checked && !ageAt) setAgeAt(Date.now()); }}
                style={{ marginTop:2, width:16, height:16, accentColor:A, flexShrink:0 }}/>
              <span style={{ fontSize:12, color:"#cfc9bd", lineHeight:1.5 }}>
                I confirm I am <strong>18 or over</strong>. Fuel Log is for adults in the UK&nbsp;and&nbsp;EEA.
                I agree to the <a href={LEGAL.terms} target="_blank" rel="noopener" style={{ color:A }}>Terms</a> and{" "}
                <a href={LEGAL.privacy} target="_blank" rel="noopener" style={{ color:A }}>Privacy&nbsp;Policy</a>.
              </span>
            </label>

            {ageOK
              ? <div id="gsi-btn" style={{ display:"flex", justifyContent:"center", marginBottom:14 }}></div>
              : <div style={{ textAlign:"center", fontSize:12, color:"#827c73", padding:"12px 0", marginBottom:14 }}>
                  Tick the box above to continue with Google.
                </div>}

            <button onClick={onCancel}
              style={{ width:"100%", padding:"10px", background:"none", color:"#9b958b",
                border:"none", fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </>
        )}

        {step === "payment" && (
          <>
            <div style={{ fontSize:11, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:4 }}>
              👋 HI, {((gUser?.name || "").split(" ")[0] || "THERE").toUpperCase()}
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:"#e6e1d7", marginBottom:14 }}>
              Start your free trial
            </div>
            <div style={{ background:"#0b0d0b", borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ fontSize:17, fontWeight:900, color:A }}>30 days free</div>
              <div style={{ fontSize:12, color:"#9b958b", marginTop:3 }}>then £4.99/month or £49.99/year</div>
              <div style={{ fontSize:11, color:"#827c73", marginTop:6 }}>Cancel anytime before trial ends</div>
            </div>
            <button disabled
              style={{ width:"100%", padding:"14px", background:"#24211b",
                border:`1px solid ${BD}`, borderRadius:12, color:"#9b958b",
                fontSize:13, fontWeight:700, marginBottom:16, cursor:"not-allowed" }}>
              Subscribe — Coming Soon
            </button>

            {/* Explicit Art. 9 health-data consent — required before the first cloud sync (R2) */}
            <label style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer",
              background:"#0b0d0b", border:`1px solid ${consentOK ? A + "55" : BD}`, borderRadius:10,
              padding:"11px 12px", marginBottom:14 }}>
              <input type="checkbox" checked={consentOK}
                onChange={e => { setConsentOK(e.target.checked); setVError(""); }}
                style={{ marginTop:2, width:16, height:16, accentColor:A, flexShrink:0 }}/>
              <span style={{ fontSize:12, color:"#cfc9bd", lineHeight:1.5 }}>
                I explicitly consent to Fuel Log storing my <strong>health data</strong> (weight, body&nbsp;fat,
                sex, and any dietary&nbsp;requirements&nbsp;and&nbsp;allergies I enter) in the cloud to provide the
                service. Meal/workout text, body metrics and my dietary needs are sent to our
                AI provider <strong>without anything that identifies me</strong>. See the{" "}
                <a href={LEGAL.privacy} target="_blank" rel="noopener" style={{ color:A }}>Privacy&nbsp;Policy</a>.
              </span>
            </label>

            <div style={{ fontSize:11, color:"#aea79c", textAlign:"center", marginBottom:8 }}>Have an access code?</div>
            <input value={voucher} onChange={e => { setVoucher(e.target.value); setVError(""); }}
              placeholder="Enter code..." onKeyDown={e => e.key === "Enter" && handleVoucher()}
              style={{ width:"100%", boxSizing:"border-box", background:"#0b0d0b",
                border:`1px solid ${vError ? "#ff5555" : BD}`, borderRadius:10,
                padding:"12px 14px", color:"#e6e1d7", fontSize:14,
                fontFamily:"inherit", outline:"none", marginBottom: vError ? 6 : 10 }}/>
            {vError && <div style={{ fontSize:12, color:"#ff5555", marginBottom:10 }}>{vError}</div>}
            <button onClick={handleVoucher} disabled={!consentOK}
              style={{ width:"100%", padding:"12px", background:"#1c1a15",
                border:`1px solid ${BD}`, borderRadius:12,
                color: consentOK ? "#b6b0a4" : "#6e6960",
                fontSize:13, fontWeight:700, marginBottom:10,
                opacity: consentOK ? 1 : 0.6 }}>
              Redeem Code
            </button>
            <button onClick={onCancel}
              style={{ width:"100%", padding:"10px", background:"none",
                color:"#9b958b", border:"none", fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SignOutModal({ userName, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:24 }}>
      <div style={{ background:CARD, borderRadius:24, padding:"28px 24px",
        border:`1px solid ${BD}`, maxWidth:300, width:"100%" }}>
        <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔓</div>
        <div style={{ fontSize:16, fontWeight:900, color:"#e6e1d7", textAlign:"center", marginBottom:10 }}>
          Sign out{userName ? `, ${userName.split(" ")[0]}` : ""}?
        </div>
        <div style={{ fontSize:13, color:"#aea79c", lineHeight:1.7, marginBottom:22, textAlign:"center" }}>
          Signing out will remove local data.<br/>
          Your cloud data is safe and will restore on next login.
        </div>
        <button onClick={onConfirm}
          style={{ width:"100%", padding:"13px", background:"#1a0d0d",
            border:"1px solid #3a1a1a", borderRadius:12, color:"#ff5555",
            fontSize:14, fontWeight:900, marginBottom:10 }}>
          Sign Out
        </button>
        <button onClick={onCancel}
          style={{ width:"100%", padding:"12px", background:A, color:"#0b0d0b",
            border:"none", borderRadius:12, fontSize:14, fontWeight:900 }}>
          Stay Signed In
        </button>
      </div>
    </div>
  );
}

// Retroactive / re-consent prompt (R2). Shown when a signed-in user has not yet
// agreed to the current privacy-policy version. Blocking — they consent or sign out.
function ConsentModal({ onConsent, onSignOut }) {
  const [ok, setOk] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1001, padding:24 }}>
      <div style={{ background:CARD, borderRadius:24, padding:"28px 24px",
        border:`1px solid ${A}33`, maxWidth:320, width:"100%" }}>
        <div style={{ fontSize:32, textAlign:"center", marginBottom:12 }}>🔏</div>
        <div style={{ fontSize:16, fontWeight:900, color:"#e6e1d7", textAlign:"center", marginBottom:8 }}>
          A quick consent check
        </div>
        <div style={{ fontSize:13, color:"#aea79c", lineHeight:1.6, marginBottom:16, textAlign:"center" }}>
          We've updated how we describe your data. To keep syncing your health data we need your
          explicit consent.
        </div>
        <label style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer",
          background:"#0b0d0b", border:`1px solid ${ok ? A + "55" : BD}`, borderRadius:10,
          padding:"11px 12px", marginBottom:16 }}>
          <input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)}
            style={{ marginTop:2, width:16, height:16, accentColor:A, flexShrink:0 }}/>
          <span style={{ fontSize:12, color:"#cfc9bd", lineHeight:1.5 }}>
            I explicitly consent to Fuel Log storing my <strong>health data</strong> (weight, body&nbsp;fat,
            sex, and any dietary&nbsp;requirements&nbsp;and&nbsp;allergies I enter) to provide the service. See the{" "}
            <a href={LEGAL.privacy} target="_blank" rel="noopener" style={{ color:A }}>Privacy&nbsp;Policy</a>.
          </span>
        </label>
        <button onClick={onConsent} disabled={!ok}
          style={{ width:"100%", padding:"13px", background: ok ? A : "#24211b",
            color: ok ? "#0b0d0b" : "#6e6960", border:"none", borderRadius:12,
            fontSize:14, fontWeight:900, marginBottom:10, opacity: ok ? 1 : 0.7 }}>
          Agree &amp; continue
        </button>
        <button onClick={onSignOut}
          style={{ width:"100%", padding:"10px", background:"none", color:"#9b958b",
            border:"none", fontSize:13, cursor:"pointer" }}>
          Sign out instead
        </button>
      </div>
    </div>
  );
}

// ── Account & Privacy screen ──────────────────────────────────
// Reached by tapping the avatar. Home for data export (R4), account deletion
// (R5), policy links, consent status, and sign out (LEGAL_ROADMAP Phase B).
function AccountScreen({ user, consentInfo, onBack, onExport, onSignOut, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const [typed,   setTyped]   = useState("");
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState("");

  const runDelete = async () => {
    setBusy(true); setErr("");
    try { await onDelete(); }
    catch (e) { setErr(e.message || "Deletion failed."); setBusy(false); }
  };

  const linkRow = (label, href) => (
    <a href={href} target="_blank" rel="noopener"
      style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"13px 14px", background:"#1c1a15", border:`1px solid ${BD}`, borderRadius:12,
        color:"#cfc9bd", fontSize:14, textDecoration:"none", marginBottom:8 }}>
      <span>{label}</span><span style={{ color:"#827c73" }}>↗</span>
    </a>
  );

  const consentDate = consentInfo?.healthConsentAt
    ? new Date(consentInfo.healthConsentAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })
    : null;

  return (
    <div style={{ minHeight:"100vh", background:BG, padding:"18px 16px 60px", maxWidth:480, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onBack}
          style={{ width:36, height:36, background:"#1c1a15", border:`1px solid ${BD}`,
            borderRadius:10, color:"#aea79c", fontSize:18 }}>←</button>
        <h1 style={{ margin:0, fontSize:20, fontWeight:900, color:A }}>Account &amp; Privacy</h1>
      </div>

      {/* Account identity */}
      <div style={{ display:"flex", alignItems:"center", gap:12, background:CARD,
        border:`1px solid ${BD}`, borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
        <Avatar user={user} size={40}/>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#e6e1d7", whiteSpace:"nowrap",
            overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name || "Signed in"}</div>
          {user?.email && <div style={{ fontSize:12, color:"#9b958b", whiteSpace:"nowrap",
            overflow:"hidden", textOverflow:"ellipsis" }}>{user.email}</div>}
        </div>
      </div>

      {/* Your data */}
      <div style={{ fontSize:11, color:"#827c73", letterSpacing:"0.1em", fontWeight:800, marginBottom:8 }}>YOUR DATA</div>
      <button onClick={onExport}
        style={{ width:"100%", padding:"13px 14px", background:"#1c1a15", border:`1px solid ${BD}`,
          borderRadius:12, color:"#cfc9bd", fontSize:14, fontWeight:700, textAlign:"left",
          display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span>⬇️ Download my data</span><span style={{ color:"#827c73", fontSize:12 }}>JSON</span>
      </button>
      <div style={{ fontSize:11, color:"#827c73", lineHeight:1.6, marginBottom:20 }}>
        A copy of everything stored against your account, in a portable file (GDPR access &amp; portability).
      </div>

      {/* Legal */}
      <div style={{ fontSize:11, color:"#827c73", letterSpacing:"0.1em", fontWeight:800, marginBottom:8 }}>LEGAL</div>
      {linkRow("Privacy Policy", LEGAL.privacy)}
      {linkRow("Terms of Service", LEGAL.terms)}
      {linkRow("Who processes your data", LEGAL.subprocessors)}
      {consentDate && (
        <div style={{ fontSize:11, color:"#827c73", lineHeight:1.6, margin:"8px 0 20px" }}>
          Health-data consent given {consentDate} (policy v{consentInfo.version || POLICY_VERSION}).
          To withdraw consent, delete your data below.
        </div>
      )}

      {/* Session */}
      <div style={{ fontSize:11, color:"#827c73", letterSpacing:"0.1em", fontWeight:800, margin:"4px 0 8px" }}>SESSION</div>
      <button onClick={onSignOut}
        style={{ width:"100%", padding:"13px 14px", background:"#1c1a15", border:`1px solid ${BD}`,
          borderRadius:12, color:"#cfc9bd", fontSize:14, fontWeight:700, textAlign:"left", marginBottom:24 }}>
        🔓 Sign out
      </button>

      {/* Danger zone */}
      <div style={{ fontSize:11, color:"#ff7a7a", letterSpacing:"0.1em", fontWeight:800, marginBottom:8 }}>DANGER ZONE</div>
      {!confirm ? (
        <button onClick={() => { setConfirm(true); setErr(""); }}
          style={{ width:"100%", padding:"13px 14px", background:"#1a0d0d", border:"1px solid #3a1a1a",
            borderRadius:12, color:"#ff5555", fontSize:14, fontWeight:800, textAlign:"left" }}>
          🗑️ Delete my account &amp; all data
        </button>
      ) : (
        <div style={{ background:"#1a0d0d", border:"1px solid #3a1a1a", borderRadius:14, padding:"16px" }}>
          <div style={{ fontSize:13, color:"#ffb4b4", lineHeight:1.6, marginBottom:12 }}>
            This permanently deletes your account and <strong>all</strong> your data (profile, weigh-ins,
            logs, history, badges). This cannot be undone. Type <strong>DELETE</strong> to confirm.
          </div>
          <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="DELETE"
            disabled={busy}
            style={{ width:"100%", boxSizing:"border-box", background:"#0b0d0b", border:`1px solid #3a1a1a`,
              borderRadius:10, padding:"11px 13px", color:"#e6e1d7", fontSize:14, fontFamily:"inherit",
              outline:"none", marginBottom:12 }}/>
          {err && <div style={{ fontSize:12, color:"#ff7a7a", marginBottom:10 }}>{err}</div>}
          <button onClick={runDelete} disabled={busy || typed.trim().toUpperCase() !== "DELETE"}
            style={{ width:"100%", padding:"13px", background:"#3a0f0f", border:"1px solid #5a1a1a",
              borderRadius:12, color: (typed.trim().toUpperCase() === "DELETE" && !busy) ? "#ff5555" : "#7a5555",
              fontSize:14, fontWeight:900, marginBottom:8,
              opacity: (typed.trim().toUpperCase() === "DELETE" && !busy) ? 1 : 0.6 }}>
            {busy ? "Deleting…" : "Permanently delete everything"}
          </button>
          <button onClick={() => { setConfirm(false); setTyped(""); setErr(""); }} disabled={busy}
            style={{ width:"100%", padding:"11px", background:"none", color:"#9b958b",
              border:"none", fontSize:13 }}>
            Cancel
          </button>
        </div>
      )}
      <div style={{ fontSize:11, color:"#827c73", lineHeight:1.6, marginTop:14 }}>
        Prefer email? Contact <a href={"mailto:fuellogadmin@gmail.com"} style={{ color:"#9b958b" }}>fuellogadmin@gmail.com</a>.
      </div>
    </div>
  );
}

function LapsedModal({ onRenew, onDismiss }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:24 }}>
      <div style={{ background:CARD, borderRadius:24, padding:"28px 24px",
        border:"1px solid #ffb84b44", maxWidth:300, width:"100%" }}>
        <div style={{ fontSize:40, textAlign:"center", marginBottom:12 }}>⌛</div>
        <div style={{ fontSize:16, fontWeight:900, color:"#e6e1d7", textAlign:"center", marginBottom:10 }}>
          Your Premium subscription has ended
        </div>
        <div style={{ fontSize:13, color:"#aea79c", lineHeight:1.7, marginBottom:22, textAlign:"center" }}>
          Your data is safe and still visible. Quick Add and logging still work.
          Renew to unlock AI features and cloud sync.
        </div>
        <button onClick={onRenew}
          style={{ width:"100%", padding:"13px", background:A, color:"#0b0d0b",
            border:"none", borderRadius:12, fontSize:14, fontWeight:900, marginBottom:10 }}>
          Renew Premium
        </button>
        <button onClick={onDismiss}
          style={{ width:"100%", padding:"11px", background:"none",
            color:"#9b958b", border:"none", fontSize:13, cursor:"pointer" }}>
          Continue for Free
        </button>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────

const INP = {
  width:"100%", boxSizing:"border-box",
  background:"#0b0d0b", border:`1px solid ${BD}`,
  borderRadius:10, padding:"12px 14px",
  color:"#e6e1d7", fontSize:14,
  fontFamily:"inherit", outline:"none",
};


function BackHdr({ title, onBack, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22,
      position:"sticky", top:0, background:BG, zIndex:10, paddingTop:12, paddingBottom:12, marginTop:-12 }}>
      <button onClick={onBack} style={{ background:"#1c1a15", border:`1px solid ${BD}`,
        borderRadius:10, width:36, height:36, color:"#a7a197", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
      <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:A, letterSpacing:"0.06em", flex:1 }}>{title}</h2>
      {right}
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ textAlign:"center", background:"#0b0d0b", borderRadius:12, padding:"10px 6px" }}>
      <div style={{ fontSize:17, fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:10, color:"#8b857c", marginTop:2, letterSpacing:"0.05em" }}>{label}</div>
    </div>
  );
}

function MBar({ label, value, target, color }) {
  const pct   = Math.min(100, (value / target) * 100);
  const overG = value - target;
  const accent = overG > 15 ? "#ff5555" : overG > 5 ? "#ffb84b" : null;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ fontWeight:800, letterSpacing:"0.06em", color: accent || "#b6b0a4" }}>{label}</span>
        <span style={{ color: accent || "#948e84" }}>{Math.round(value)}g / {target}g</span>
      </div>
      <div style={{ height:7, background:"#1a1a1a", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background: accent || color,
          borderRadius:99, transition:"width 0.4s" }}/>
      </div>
    </div>
  );
}

// ── Streak Celebration ────────────────────────────────────────

function StreakCelebration({ anim, onDone }) {
  const { prevStreak, newStreak, isMilestone } = anim;
  const [count, setCount] = useState(prevStreak);

  // Pre-computed floaters — stable across re-renders via useState initializer
  const [floaters] = useState(() => {
    const n = isMilestone ? 26 : 14;
    return Array.from({ length: n }, (_, i) => ({
      x:     5  + Math.random() * 90,
      y:     5  + Math.random() * 90,
      size:  isMilestone ? 22 + Math.random() * 30 : 16 + Math.random() * 20,
      delay: Math.random() * 0.7,
      dur:   0.8 + Math.random() * 0.5,
      emoji: isMilestone && i % 4 === 0 ? (i % 8 === 0 ? "🎉" : "🎊") : "🔥",
    }));
  });

  useEffect(() => {
    // ── Web Audio: whoosh then heavy thud ──────────────────────
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Whoosh: sawtooth sweep 800 → 180 Hz
      const osc = ctx.createOscillator();
      const g1  = ctx.createGain();
      osc.connect(g1); g1.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.32);
      g1.gain.setValueAtTime(0.22, ctx.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.32);
      // Heavy thud: noise burst at 0.4s
      const sr  = ctx.sampleRate;
      const buf = ctx.createBuffer(1, Math.ceil(sr * 0.55), sr);
      const ch  = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++)
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.07));
      const src = ctx.createBufferSource();
      const g2  = ctx.createGain();
      src.buffer = buf; src.connect(g2); g2.connect(ctx.destination);
      g2.gain.setValueAtTime(1.8, ctx.currentTime + 0.42);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      src.start(ctx.currentTime + 0.42);
    } catch(e) {}

    // ── Count up prevStreak → newStreak over 800ms ─────────────
    const duration = 800;
    const start    = Date.now();
    const range    = newStreak - prevStreak;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setCount(Math.round(prevStreak + range * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.93)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, animation:"sc_fade 0.18s ease-out" }}>
      <style>{`
        @keyframes sc_fade  { from{opacity:0} to{opacity:1} }
        @keyframes sc_float { from{transform:translateY(0) rotate(-12deg)} to{transform:translateY(-24px) rotate(12deg)} }
        @keyframes sc_pop   { 0%{transform:scale(0.25);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
        @keyframes sc_pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.14)} }
        @keyframes sc_num   { 0%{transform:scale(0.4);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Floating 🔥 / 🎉🎊 */}
      {floaters.map((f, i) => (
        <div key={i} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%`,
          fontSize:f.size, pointerEvents:"none", userSelect:"none",
          animation:`sc_float ${f.dur}s ease-in-out infinite alternate`,
          animationDelay:`${f.delay}s`, opacity:0.88 }}>
          {f.emoji}
        </div>
      ))}

      {/* Centre content */}
      <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontSize: isMilestone ? 128 : 108, lineHeight:1,
          animation:"sc_pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          💪
        </div>
        <div style={{ fontSize: isMilestone ? 92 : 78, fontWeight:900, color:A,
          textShadow:`0 0 40px ${A}99`, lineHeight:1, marginTop:-10,
          animation: isMilestone
            ? "sc_pulse 0.55s ease-in-out 0.45s infinite"
            : "sc_num 0.45s ease-out 0.2s both" }}>
          {count}
        </div>
        <div style={{ fontSize:14, color:A, fontWeight:900, letterSpacing:"0.14em",
          marginTop:12, textShadow:`0 0 18px ${A}66` }}>
          {isMilestone ? `🏆 ${newStreak} DAY MILESTONE!` : "DAY STREAK 🔥"}
        </div>
        {isMilestone && (
          <div style={{ fontSize:38, marginTop:18, animation:"sc_pop 0.4s ease-out 0.5s both" }}>
            🎉🎊🎉🎊🎉
          </div>
        )}
      </div>
    </div>
  );
}

// ── Coach Card ────────────────────────────────────────────────

function CoachCard({ mode, totals, targets, streak, water, logs = [] }) {
  const [tip, setTip]           = useState("");
  const [refreshes, setRefreshes] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [history, setHistory]   = useState([]); // tips already given today, so refreshes don't repeat

  useEffect(() => {
    sg("coach__" + todayKey()).then(v => {
      if (v) { const d = JSON.parse(v); setTip(d.tip || ""); setRefreshes(d.r || 0); setHistory(d.history || []); }
    });
  }, []);

  useEffect(() => {
    if (!tip && !loading && totals.kcal >= 200) gen();
  }, [totals.kcal]); // eslint-disable-line

  const gen = async () => {
    if (loading || refreshes >= 3) return;
    setLoading(true);
    try {
      const h = getCurrentHour();
      const timeLabel = h < 6 ? "early morning" : h < 12 ? "morning" : h < 14 ? "midday" : h < 18 ? "afternoon" : h < 21 ? "evening" : "night";

      // Spell out over/under per metric so the model never tells you to eat/drink
      // more of something you've already hit. Raw "X/Y" alone reads as a deficit.
      const kcalNum   = Math.round(totals.kcal);
      const kcalDelta = kcalNum - targets.kcal;
      const kcalLine  = kcalDelta > 0
        ? `calories ${kcalNum}/${targets.kcal} kcal — ${kcalDelta} OVER target`
        : `calories ${kcalNum}/${targets.kcal} kcal — ${Math.abs(kcalDelta)} remaining`;

      const protNum   = Math.round(totals.protein);
      const protDelta = protNum - targets.protein;
      const protLine  = protDelta >= 0
        ? `protein ${protNum}/${targets.protein}g — ${protDelta}g OVER, goal met ✅ (do NOT suggest more protein)`
        : `protein ${protNum}/${targets.protein}g — ${Math.abs(protDelta)}g under`;

      const waterLine = water >= 8
        ? `water ${water}/8 glasses — goal met ✅ (do NOT suggest more water)`
        : `water ${water}/8 glasses — ${8 - water} under`;

      // (#5) State-awareness: tell the coach exactly what's been eaten so it neither
      // re-suggests it nor guesses. Names only — no quantities needed for variety.
      const foods = [...new Set(logs.map(l => l && l.name).filter(Boolean))];
      const foodsLine = foods.length
        ? `Already eaten today (do NOT suggest any of these again): ${foods.join(", ")}.`
        : `Nothing logged yet today.`;

      // (#6) Pace is COMPUTED here, never judged by the LLM. Window starts at the
      // first logged meal; only floor goals (protein, water) are paced — never calories.
      const firstMealHour = logs.length
        ? new Date(Math.min(...logs.map(l => Number(l.id) || Date.now()))).getHours()
        : null;
      const protFrac  = targets.protein > 0 ? totals.protein / targets.protein : 1;
      const protPace  = paceVerdict(firstMealHour, h, protFrac);
      const waterPace = paceVerdict(firstMealHour, h, water / 8);
      const protPaceLine = protDelta >= 0 ? "" :
        `Protein pace → ${Math.round(protPace.elapsed * 100)}% of the eating window elapsed vs ${Math.round(protFrac * 100)}% of the protein floor hit; verdict: ${protPace.verdict}.`;
      const waterPaceLine = water >= 8 ? "" :
        `Water pace → ${Math.round(waterPace.elapsed * 100)}% of window elapsed vs ${Math.round((water / 8) * 100)}% of the water goal hit; verdict: ${waterPace.verdict}.`;

      // (#5) Vary across refreshes: hand the model what it already said today.
      const prevLine = history.length
        ? `You have ALREADY suggested these today — say something meaningfully different: ${history.slice(-3).join(" | ")}.`
        : "";

      const ctx = [
        `- ${kcalLine}`, `- ${protLine}`, `- ${waterLine}`, `- ${streak} day logging streak.`,
        `- ${foodsLine}`,
        protPaceLine  ? `- ${protPaceLine}`  : "",
        waterPaceLine ? `- ${waterPaceLine}` : "",
        prevLine      ? `- ${prevLine}`      : "",
      ].filter(Boolean).join("\n");

      const prompt = `You are a supportive fitness coach. Local time: ${timeLabel} (${h}:00). Today (${mode} mode):
${ctx}

Rules:
- Use the pace VERDICT given above; do NOT decide for yourself whether I am "behind". Only protein and water are paced — NEVER calories. Being under my calorie target is success on a cut/maintain, never "behind", and you must never urge me to eat more to "catch up" on calories.
- Never suggest more of a metric marked "goal met ✅"; instead give that met goal a brief celebratory nod.
- If the protein floor is still unmet, meeting it OUTRANKS variety; once the floors are met, favour VARIETY and fibre / gut-health diversity instead of re-recommending the same high-protein food.
- Any food you suggest must NOT be something already eaten today, and must differ from what you already suggested.
- If a floor goal's verdict is "behind", give a gentle, non-punishing nudge toward one specific food choice to round the day out — no "catch up" urgency, no shame.
${dietaryPromptBlock(DIETARY)}Write exactly 3 sentences: 1) an honest observation about today 2) a specific food or habit suggestion appropriate for ${timeLabel} 3) genuine praise. Brief, personal, max one emoji per sentence.`;
      const t    = await callAI(prompt, 200);
      const r    = refreshes + 1;
      const newHistory = [...history, t].slice(-3);
      setTip(t); setRefreshes(r); setHistory(newHistory);
      await ss("coach__" + todayKey(), JSON.stringify({ tip:t, r, history: newHistory }));
    } catch(e) {}
    setLoading(false);
  };

  if (totals.kcal < 200 && !tip) return null;
  // Zero-token allergen backstop: if a tip slips a declared allergen past the
  // prompt, flag it before the user acts on it (never silently trust the LLM).
  const tipAllergens = scanAllergens(tip, DIETARY.allergens);
  return (
    <div style={{ background:CARD, border:`1px solid ${A}22`, borderRadius:20, padding:"14px 18px", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: tip ? 8 : 0 }}>
        <div style={{ fontSize:11, color:A, letterSpacing:"0.12em", fontWeight:800 }}>🤖 DAILY COACH</div>
        {refreshes < 3 && (
          <button onClick={gen} disabled={loading}
            style={{ background:"none", border:"none", color:"#aea79c", cursor:"pointer", fontSize:13, padding:"2px 6px" }}>
            {loading ? "..." : "↺"} <span style={{ fontSize:10, color:"#827c73" }}>{3 - refreshes}</span>
          </button>
        )}
      </div>
      {loading && !tip && <div style={{ fontSize:12, color:"#9b958b", marginTop:4 }}>Generating your tip...</div>}
      {tip && <div style={{ fontSize:14.5, color:"#c2bcb0", lineHeight:1.7 }}>{tip}</div>}
      {tipAllergens.length > 0 && (
        <div style={{ marginTop:8, background:"#1a0d08", border:"1px solid #ff555544", borderRadius:10,
          padding:"8px 12px", fontSize:11, color:"#ff8866", lineHeight:1.5 }}>
          ⚠️ This tip may mention {tipAllergens.join(", ")}, which you've flagged as an allergy — please double-check before acting on it.
        </div>
      )}
    </div>
  );
}

// ── Tag input (feature #8) ────────────────────────────────────
// A hybrid combobox: free-text that surfaces selectable suggestions and also
// lets the user commit a CUSTOM tag the app didn't suggest. Tags are removable pills.
function TagField({ label, tags, suggestions, onChange, accent = A, placeholder }) {
  const [input, setInput] = useState("");
  const has = t => tags.some(x => x.toLowerCase() === t.toLowerCase());
  const add = raw => {
    const t = raw.trim().toLowerCase();
    if (t && !has(t)) onChange([...tags, t]);
    setInput("");
  };
  const remove = t => onChange(tags.filter(x => x !== t));
  const q = input.trim().toLowerCase();
  const shown = suggestions.filter(s => !has(s) && (q === "" || s.toLowerCase().includes(q))).slice(0, 8);
  const isCustom = q && !suggestions.some(s => s.toLowerCase() === q);

  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.1em", fontWeight:800, marginBottom:8 }}>{label}</div>
      {tags.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
          {tags.map(t => (
            <span key={t} style={{ display:"inline-flex", alignItems:"center", gap:5,
              background: accent + "1e", border:`1px solid ${accent}55`, borderRadius:999,
              padding:"4px 10px", fontSize:12, color:accent, fontWeight:700 }}>
              {t}
              <button onClick={() => remove(t)} style={{ background:"none", border:"none",
                color:accent, fontSize:14, padding:0, cursor:"pointer", lineHeight:1 }}>×</button>
            </span>
          ))}
        </div>
      )}
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input); } }}
        placeholder={placeholder} style={{ ...INP }}/>
      {(shown.length > 0 || isCustom) && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
          {shown.map(s => (
            <button key={s} onClick={() => add(s)} style={{ background:"#1c1a15",
              border:`1px solid ${BD}`, borderRadius:999, padding:"4px 10px",
              fontSize:12, color:"#aea79c", cursor:"pointer", fontFamily:"inherit" }}>+ {s}</button>
          ))}
          {isCustom && (
            <button onClick={() => add(input)} style={{ background:"none",
              border:`1px dashed ${accent}66`, borderRadius:999, padding:"4px 10px",
              fontSize:12, color:accent, cursor:"pointer", fontFamily:"inherit" }}>+ Add "{input.trim()}"</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────

function ProfileScreen({ profile, onSave, onBack, tdeeAdj = 0, weighIns = [], aggressiveCutAcked = false }) {
  const [f, setF]         = useState({ ...DEF_PROFILE, ...profile });
  const [saved, setSaved] = useState(false);
  const [bfFocused, setBfFocused] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));
  // Dietary config (#8) persists immediately on change — the body-stats auto-save
  // effect only watches weight/height/bf/sex, so tag edits save themselves here.
  const diet = normaliseDietary(f.dietary);
  const setDiet = (key, list) => {
    const nf = { ...f, dietary: { ...diet, [key]: list } };
    setF(nf);
    onSave(nf);
  };
  const valid = Number(f.weight) > 0 && Number(f.height) > 0 &&
                Number(f.bodyFat) > 0 && Number(f.bodyFat) < 100;
  const bfVal = Number(f.bodyFat);
  const bfImplausible = bfVal > 0 && (bfVal < 4 || bfVal > 50);
  const prev     = calcTargets(f, "cut", 0, 0);
  const formulaTDEE = prev.tdee;
  const adjTDEE     = formulaTDEE + tdeeAdj;
  const confidence  = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : weighIns.length >= 7 ? "Estimating" : null;

  useEffect(() => {
    if (!valid) return;
    const t = setTimeout(() => {
      onSave(f);
      haptic();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
    return () => clearTimeout(t);
  }, [f.weight, f.height, f.bodyFat, f.sex]); // eslint-disable-line

  const row = (label, val, unit, color = "#e6e1d7") => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
      <span style={{ fontSize:12, color:"#aea79c" }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:700, color }}>{val}
        <span style={{ fontSize:11, color:"#9b958b", marginLeft:3 }}>{unit}</span>
      </span>
    </div>
  );

  return (
    <div style={{ padding:"20px 16px 50px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="MY PROFILE" onBack={onBack}
        right={saved && <span style={{ fontSize:11, color:A, fontWeight:700 }}>✓ SAVED</span>}/>
      <p style={{ color:"#aea79c", fontSize:13, lineHeight:1.6, marginBottom:20 }}>
        Targets use <strong style={{ color:"#a7a197" }}>Katch-McArdle</strong>. Changes save automatically.
      </p>
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"20px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>BODY STATS</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          {[{ k:"weight", l:"WEIGHT", u:"kg" }, { k:"height", l:"HEIGHT", u:"cm" }].map(fl => (
            <div key={fl.k}>
              <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>
                {fl.l} <span style={{ color:"#9b958b" }}>({fl.u})</span>
              </div>
              <input type="number" min="0" value={f[fl.k]}
                onChange={e => set(fl.k, e.target.value)} style={INP}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>
          BODY FAT <span style={{ color:"#9b958b" }}>(%)</span>
        </div>
        <input type="number" min="0" max="99" value={f.bodyFat}
          onChange={e => set("bodyFat", e.target.value)}
          onFocus={() => setBfFocused(true)} onBlur={() => setBfFocused(false)}
          style={{ ...INP, marginBottom:4 }}/>
        {bfFocused && !bfImplausible && (
          <div style={{ fontSize:11, color:"#a7a197", marginBottom:6, lineHeight:1.5 }}>
            Not sure? Use 25% for men or 30% for women as a starting estimate. A more accurate figure improves your calorie and macro targets.
          </div>
        )}
        {bfImplausible && (
          <div style={{ fontSize:11, color:"#ffb84b", marginBottom:6, lineHeight:1.5 }}>
            That seems unusual — double-check this number as it affects your calorie targets.
          </div>
        )}
        <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>
          SEX <span style={{ color:"#9b958b", fontSize:10, fontWeight:400 }}>— used to calculate your calorie and macro targets</span>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:6 }}>
          {["male","female"].map(s => (
            <button key={s} onClick={() => set("sex", s)}
              style={{ flex:1, padding:"10px 0", borderRadius:10, fontWeight:900, fontSize:12,
                letterSpacing:"0.06em", border:`1px solid ${f.sex === s ? A + "88" : BD}`,
                background: f.sex === s ? A + "18" : "#0b0d0b",
                color: f.sex === s ? A : "#9b958b" }}>
              {s === "male" ? "MALE" : "FEMALE"}
            </button>
          ))}
        </div>
        {!f.sex && (
          <div style={{ fontSize:11, color:"#ffb84b", marginBottom:10, lineHeight:1.5 }}>
            Set your sex for more accurate targets — defaulting to male calculations.
          </div>
        )}
        {f.sex === "female" && (
          <div style={{ fontSize:11, color:"#a7a197", marginBottom:10, lineHeight:1.5 }}>
            Targets may need adjusting around your cycle — override anytime.
          </div>
        )}
        <div style={{ fontSize:11, color:"#827c73", marginBottom:14, lineHeight:1.5 }}>
          Base TDEE uses BMR × 1.2 (sedentary baseline). Workout calories are added when you log sessions.
        </div>
      </div>

      {/* Dietary requirements & allergies (#8) — steers every AI food suggestion */}
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"20px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:6 }}>DIET & ALLERGIES</div>
        <p style={{ fontSize:11, color:"#827c73", lineHeight:1.5, marginBottom:16 }}>
          These steer every AI suggestion — the coach, AI Meal Log and estimates. Allergies are a
          hard safety filter, applied in the prompt and double-checked on every AI response.
        </p>
        <TagField label="DIET TYPE" tags={diet.diets} suggestions={DIET_SUGGESTIONS}
          onChange={l => setDiet("diets", l)} placeholder="e.g. vegan, halal…"/>
        <TagField label="ALLERGIES (HARD FILTER)" tags={diet.allergens} suggestions={BIG14_ALLERGENS}
          onChange={l => setDiet("allergens", l)} accent="#ff7b6b" placeholder="e.g. peanuts, milk…"/>
        <TagField label="DISLIKES (SOFT — AVOID WHERE POSSIBLE)" tags={diet.dislikes} suggestions={[]}
          onChange={l => setDiet("dislikes", l)} accent="#aea79c" placeholder="e.g. coriander, olives…"/>
      </div>

      {valid && (
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"20px" }}>
          <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:12 }}>
            CALCULATED STATS
          </div>
          {row("Lean Body Mass", prev.lbm, "kg", "#4b9fff")}
          {row("BMR",           prev.bmr, "kcal/day", "#ffb84b")}
          {row("Formula TDEE",  formulaTDEE, "kcal/day", "#b6b0a4")}
          {tdeeAdj !== 0 && (
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
              <span style={{ fontSize:12, color:"#aea79c" }}>Adaptive adjustment</span>
              <span style={{ fontSize:13, fontWeight:700, color: tdeeAdj > 0 ? A : "#ff7b4b" }}>
                {tdeeAdj > 0 ? "+" : ""}{tdeeAdj} <span style={{ fontSize:11, color:"#9b958b" }}>kcal/day</span>
              </span>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
            <span style={{ fontSize:12, color:"#aea79c" }}>
              Effective TDEE {confidence && <span style={{ fontSize:10, color: tdeeAdj !== 0 ? A : "#9b958b" }}>· {confidence}</span>}
            </span>
            <span style={{ fontSize:13, fontWeight:700, color:A }}>
              {adjTDEE} <span style={{ fontSize:11, color:"#9b958b" }}>kcal/day</span>
            </span>
          </div>
          {!confidence && (
            <div style={{ fontSize:11, color:"#827c73", marginTop:6, lineHeight:1.5 }}>
              Log your weight daily from the dashboard to enable adaptive calibration.
            </div>
          )}
          <div style={{ marginTop:14, fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:10 }}>
            TARGETS BY MODE
          </div>
          {[
            { mode:"cut",      label:"CUT",      color:"#4b9fff" },
            { mode:"maintain", label:"MAINTAIN", color:A         },
            { mode:"bulk",     label:"BULK",     color:"#ff7b4b" },
          ].map(({ mode, label, color }) => {
            const t = calcTargets(f, mode, 0, tdeeAdj);
            return (
              <div key={mode} style={{ background:"#0b0d0b", borderRadius:10, padding:"10px 14px", marginBottom:6 }}>
                <div style={{ fontSize:11, fontWeight:900, color, letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[["KCAL","kcal",""],["P","protein","g"],["C","carbs","g"],["F","fat","g"]].map(([k, key, u]) => (
                    <div key={k} style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontSize:14, fontWeight:900, color }}>{t[key]}{u}</div>
                      <div style={{ fontSize:9, color:"#827c73", marginTop:1 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ fontSize:11, color:"#827c73", marginTop:8 }}>
            Workout kcal are added when you log sessions on the dashboard.
          </div>
        </div>
      )}
      {aggressiveCutAcked && (
        <div style={{ background:"#1a1000", border:"1px solid #ffb84b33", borderRadius:12,
          padding:"10px 14px", marginTop:12, display:"flex", gap:10, alignItems:"flex-start" }}>
          <div style={{ fontSize:15 }}>⚠️</div>
          <div style={{ fontSize:11, color:"#8a7030", lineHeight:1.5 }}>
            You have previously acknowledged an aggressive cut target. Review your profile stats and targets if your circumstances have changed.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Meal Form ─────────────────────────────────────────────────

function MealForm({ meal, onSave, onCancel, isPremium = false, onPremiumGate = () => {} }) {
  const blank = { name:"", kcal:"", protein:"", carbs:"", fat:"" };
  const [f, setF] = useState(meal ? {
    name: meal.name, kcal: String(meal.kcal), protein: String(meal.protein),
    carbs: String(meal.carbs), fat: String(meal.fat),
  } : blank);
  const [reest,    setReest]    = useState(false);
  const [reestMsg, setReestMsg] = useState(""); // "" | "done" | error text
  const set = (k, v) => { setF(p => ({ ...p, [k]:v })); setReestMsg(""); };
  const ok  = f.name.trim() && Number(f.kcal) > 0;

  // Mirrors EntryEditor's re-estimate exactly: premium-gated, AI shown first,
  // Open Food Facts a bounded background refinement that only wins on confidence.
  const estimate = async () => {
    if (!isPremium) { onPremiumGate({ emoji:"✨", name:"AI estimate" }); return; }
    if (!f.name.trim() || reest) return;
    setReest(true); setReestMsg("");
    const fill = r => setF(p => ({ ...p,
      kcal:    String(Math.round(r.kcal)),
      protein: String(Math.round(r.protein * 10) / 10),
      carbs:   String(Math.round(r.carbs   * 10) / 10),
      fat:     String(Math.round(r.fat     * 10) / 10),
    }));
    let upd;
    try {
      upd = await callAIJson(AI_REESTIMATE_PROMPT(f.name.trim()), 300);
    } catch (e) {
      setReestMsg("Couldn't reach the AI — check your connection and try again.");
      setReest(false);
      return;
    }
    fill(upd);
    setReestMsg("done");
    setReest(false);
    try {
      const oft = await searchOFT(f.name.trim());
      if (oft && oft.confidence > upd.confidence) fill(oft);
    } catch (e) {}
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"flex-end", justifyContent:"center", zIndex:999 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background:CARD, borderRadius:"22px 22px 0 0", padding:"28px 20px 50px",
        width:"100%", maxWidth:500, border:`1px solid ${BD}`, borderBottom:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ margin:0, color:A, fontSize:16, fontWeight:900 }}>{meal ? "EDIT MEAL" : "ADD MEAL"}</h3>
          <button onClick={onCancel} style={{ background:"none", border:"none", color:"#aea79c", fontSize:24 }}>×</button>
        </div>
        <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.1em", fontWeight:800, marginBottom:6 }}>MEAL NAME</div>
        <input value={f.name} onChange={e => set("name", e.target.value)}
          placeholder="e.g. Chicken breast (150g)" style={{ ...INP, marginBottom:16 }}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          {[
            { k:"kcal",    l:"CALORIES",   c:A        },
            { k:"protein", l:"PROTEIN (g)", c:"#4b9fff"},
            { k:"carbs",   l:"CARBS (g)",   c:"#ffb84b"},
            { k:"fat",     l:"FAT (g)",     c:"#ff7b4b"},
          ].map(fl => (
            <div key={fl.k}>
              <div style={{ fontSize:10, color:fl.c, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>{fl.l}</div>
              <input type="number" min="0" value={f[fl.k]}
                onChange={e => set(fl.k, e.target.value)} placeholder="0" style={INP}/>
            </div>
          ))}
        </div>
        <button onClick={estimate} disabled={reest}
          style={{ width:"100%", padding:"12px", marginBottom: reestMsg && reestMsg !== "done" ? 6 : 12,
            background:"#1c1a15", border:`1px solid ${A}44`, borderRadius:11, color:A,
            fontSize:13, fontWeight:800, cursor:"pointer", opacity: reest ? 0.6 : 1 }}>
          {reest ? "Estimating…" : reestMsg === "done" ? "✓ Filled — estimate again" : "✨ AI estimate from name"}
        </button>
        {reestMsg && reestMsg !== "done" && (
          <div style={{ fontSize:11, color:"#ff7b6b", marginBottom:12, lineHeight:1.4 }}>{reestMsg}</div>
        )}
        <button onClick={() => ok && (haptic(), onSave({
          name: f.name.trim(), kcal: Number(f.kcal) || 0,
          protein: Number(f.protein) || 0, carbs: Number(f.carbs) || 0, fat: Number(f.fat) || 0,
        }))} disabled={!ok}
          style={{ width:"100%", padding:"15px",
            background: ok ? A : "#1c1a15", color: ok ? "#0b0d0b" : "#2c2820",
            border:"none", borderRadius:13, fontSize:14, fontWeight:900, letterSpacing:"0.08em" }}>
          {meal ? "SAVE CHANGES" : "ADD MEAL"}
        </button>
      </div>
    </div>
  );
}

// ── Weigh-In Widget ───────────────────────────────────────────

function WeighInWidget({ weighIns, onWeighIn, tdeeAdj, baseTDEE }) {
  const [val, setVal] = useState("");
  const today       = todayKey();
  const todayEntry  = weighIns.find(w => w.date === today);
  const weeks       = Math.floor(weighIns.length / 7);

  const trend7 = (() => {
    if (weighIns.length < 4) return null;
    const recent = weighIns.slice(-7);
    const old    = recent[0].weight;
    const now    = recent[recent.length - 1].weight;
    return Math.round((now - old) * 10) / 10;
  })();

  const confidence = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : "Estimating";
  const confColor2 = weighIns.length >= 28 ? A : weighIns.length >= 14 ? "#ffb84b" : "#aea79c";

  return (
    <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:4 }}>BODY WEIGHT</div>
          {todayEntry
            ? <div style={{ fontSize:22, fontWeight:900, color:"#e6e1d7" }}>{todayEntry.weight}<span style={{ fontSize:12, color:"#9b958b", marginLeft:4 }}>kg</span>
                {trend7 !== null && <span style={{ fontSize:12, color: trend7 <= 0 ? "#e8e2d4" : "#ff7b4b", marginLeft:10 }}>
                  {trend7 > 0 ? "+" : ""}{trend7}kg/wk
                </span>}
              </div>
            : <div style={{ fontSize:13, color:"#827c73", marginTop:2 }}>Not logged today</div>
          }
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:confColor2, letterSpacing:"0.08em", fontWeight:800 }}>{confidence.toUpperCase()}</div>
          {weeks >= 1
            ? <>
                <div style={{ fontSize:15, fontWeight:900, color:A, marginTop:2 }}>~{(baseTDEE + tdeeAdj).toLocaleString()} kcal</div>
                <div style={{ fontSize:10, color:"#9b958b", marginTop:1 }}>est. TDEE{tdeeAdj !== 0 && <span style={{ color: tdeeAdj > 0 ? A : "#ff7b4b" }}> {tdeeAdj > 0 ? "+" : ""}{tdeeAdj}</span>}</div>
              </>
            : <div style={{ fontSize:11, color:"#827c73", marginTop:4, maxWidth:100, textAlign:"right", lineHeight:1.4 }}>Log daily to calibrate your TDEE</div>
          }
        </div>
      </div>

      {!todayEntry && (
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input type="number" step="0.1" min="30" max="300" value={val}
            onChange={e => setVal(e.target.value)} placeholder="kg today..."
            style={{ ...INP, flex:1, padding:"10px 12px", fontSize:13 }}
            onKeyDown={e => e.key === "Enter" && Number(val) > 0 && (onWeighIn(Number(val)), setVal(""))}/>
          <button onClick={() => { if (Number(val) > 0) { onWeighIn(Number(val)); setVal(""); }}}
            disabled={!Number(val)}
            style={{ padding:"10px 18px", background: Number(val) > 0 ? A : "#1c1a15",
              color: Number(val) > 0 ? "#0b0d0b" : "#2c2820",
              border:"none", borderRadius:10, fontWeight:900, fontSize:13 }}>
            LOG
          </button>
        </div>
      )}

      <div style={{ fontSize:11, color:"#827c73", lineHeight:1.5 }}>
        {weeks < 1 && "Targets use the Katch-McArdle formula. Once you have a week of weigh-ins, they'll self-adjust to your real metabolism."}
        {weeks >= 1 && weeks < 2 && `🔄 ${confidence} — ${weighIns.length} weigh-ins so far. 2+ weeks unlocks calibration.`}
        {weeks >= 2 && tdeeAdj === 0 && "Formula TDEE matches your results — no adjustment needed yet."}
        {weeks >= 2 && tdeeAdj !== 0 && `Your real TDEE is ${tdeeAdj > 0 ? "higher" : "lower"} than the formula predicts. Targets adjusted accordingly.`}
      </div>
    </div>
  );
}

// ── Workout Logger ────────────────────────────────────────────

function WorkoutLogger({ workouts, onAdd, onRemove, prof, isPremium, onPremiumGate }) {
  const [type,      setType]      = useState("legs");
  const [dur,       setDur]       = useState(45);
  const [intensity, setIntensity] = useState("moderate");
  const [hevyMode,  setHevyMode]  = useState(false);
  const [hevyText,  setHevyText]  = useState("");
  const [hevyLoading, setHevyLoading] = useState(false);
  const [hevyResult,  setHevyResult]  = useState(null);

  const p       = prof || DEF_PROFILE;
  const estKcal = estimateSessionKcal(p.weight, p.bodyFat, type, dur, intensity);
  const totalKcal = workouts.reduce((s, w) => s + (w.kcal || 0), 0);

  const logWorkout = () => {
    onAdd({ id:Date.now(), type, duration:dur, intensity, kcal:estKcal,
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) });
  };

  const parseWorkout = async () => {
    if (!hevyText.trim() || hevyLoading) return;
    setHevyLoading(true); setHevyResult(null);
    try {
      const prompt = `Parse this workout log and estimate calories burned. User: ${p.weight}kg bodyweight, ${p.bodyFat}% body fat.\n\nWorkout:\n${hevyText}\n\nReturn ONLY valid JSON: {"estimatedKcal":number,"type":"legs|push|pull|fullbody|cardio","intensity":"light|moderate|heavy","summary":"brief 1 line description"}`;
      setHevyResult(await callAIJson(prompt, 200));
    } catch(e) {
      setHevyResult({ error:"Parse failed — Cloudflare Worker required." });
    }
    setHevyLoading(false);
  };

  const logParsed = () => {
    if (!hevyResult || hevyResult.error) return;
    onAdd({ id:Date.now(), type: hevyResult.type || "fullbody", duration:60,
      intensity: hevyResult.intensity || "moderate", kcal: hevyResult.estimatedKcal,
      notes: hevyResult.summary,
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) });
    setHevyMode(false); setHevyText(""); setHevyResult(null);
  };

  return (
    <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:10, color:"#9b958b", letterSpacing:"0.1em", fontWeight:800 }}>
          WORKOUTS {workouts.length > 0 && <span style={{ color:A }}>· ⚡{workouts.length}</span>}
        </div>
        {workouts.length > 0 && (
          <span style={{ fontSize:12, fontWeight:900, color:A }}>{totalKcal} kcal added</span>
        )}
      </div>

      {workouts.length > 0 && (
        <div style={{ marginBottom:10 }}>
          {workouts.map(w => (
            <div key={w.id} style={{ display:"flex", alignItems:"center", gap:8,
              background:"#0b0d0b", borderRadius:8, padding:"8px 10px", marginBottom:6 }}>
              <span style={{ fontSize:12, color:A, fontWeight:900, flexShrink:0 }}>{w.kcal} kcal</span>
              <span style={{ fontSize:11, color:"#9f998e", flex:1, overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {w.notes || `${w.type} · ${w.duration}min · ${w.intensity}`}
              </span>
              <span style={{ fontSize:10, color:"#827c73", flexShrink:0 }}>{w.time}</span>
              <button onClick={() => onRemove(w.id)}
                style={{ background:"none", border:"none", color:"#443030", fontSize:16,
                  cursor:"pointer", padding:"0 4px", flexShrink:0 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {!hevyMode ? (
        <>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
            <select value={type} onChange={e => setType(e.target.value)}
              style={{ ...INP, flex:"none", width:"auto", padding:"7px 10px", fontSize:12 }}>
              {SESS_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
            <input type="number" min="10" max="180" value={dur}
              onChange={e => setDur(parseInt(e.target.value)||45)}
              style={{ ...INP, width:56, padding:"7px 8px", textAlign:"center", fontSize:12 }}/>
            <span style={{ fontSize:11, color:"#9b958b" }}>min ·</span>
            <select value={intensity} onChange={e => setIntensity(e.target.value)}
              style={{ ...INP, flex:"none", width:"auto", padding:"7px 10px", fontSize:12 }}>
              {SESS_INT.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase()+i.slice(1)}</option>)}
            </select>
            <span style={{ marginLeft:"auto", fontSize:13, fontWeight:900, color:A }}>{estKcal} kcal</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={logWorkout}
              style={{ flex:1, padding:"10px", background:A, color:"#0b0d0b",
                border:"none", borderRadius:10, fontSize:12, fontWeight:900, cursor:"pointer", letterSpacing:"0.06em" }}>
              + LOG WORKOUT
            </button>
            <button onClick={() => isPremium ? setHevyMode(true) : onPremiumGate && onPremiumGate({ emoji:"🏋️", name:"Workout AI Parser" })}
              style={{ padding:"10px 14px", background:"#0b0d0b",
                border:`1px solid ${isPremium ? A + "33" : BD}`,
                borderRadius:10, color: isPremium ? A : "#9b958b", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              📋 {isPremium ? "Paste log" : "Paste log ⭐"}
            </button>
          </div>
        </>
      ) : (
        <>
          <textarea value={hevyText} onChange={e => setHevyText(e.target.value)} rows={5}
            placeholder={"Paste your workout log here...\n\nE.g.:\nBack Squat 4×5 @ 100kg\nRomanian Deadlift 3×10 @ 80kg"}
            style={{ width:"100%", boxSizing:"border-box", background:"#0b0d0b",
              border:`1px solid ${BD}`, borderRadius:10, padding:"10px 12px",
              color:"#e6e1d7", fontSize:12, resize:"none", fontFamily:"inherit",
              outline:"none", lineHeight:1.6, marginBottom:8 }}/>
          <div style={{ display:"flex", gap:8, marginBottom:6 }}>
            <button onClick={parseWorkout} disabled={hevyLoading || !hevyText.trim()}
              style={{ flex:1, padding:"10px",
                background: hevyText.trim() && !hevyLoading ? A : "#1c1a15",
                color: hevyText.trim() && !hevyLoading ? "#0b0d0b" : "#2c2820",
                border:"none", borderRadius:10, fontSize:12, fontWeight:900,
                cursor: hevyText.trim() && !hevyLoading ? "pointer" : "not-allowed", letterSpacing:"0.07em" }}>
              {hevyLoading ? "PARSING..." : "🤖 PARSE WORKOUT"}
            </button>
            <button onClick={() => { setHevyMode(false); setHevyText(""); setHevyResult(null); }}
              style={{ padding:"10px 14px", background:"none", border:`1px solid ${BD}`,
                borderRadius:10, color:"#9b958b", fontSize:12, cursor:"pointer" }}>
              ← Back
            </button>
          </div>
          {hevyResult && !hevyResult.error && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                background:"#141210", borderRadius:8, padding:"8px 12px", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"#9f998e", flex:1 }}>{hevyResult.summary}</span>
                <span style={{ fontSize:15, fontWeight:900, color:A, marginLeft:10 }}>{hevyResult.estimatedKcal} kcal</span>
              </div>
              <button onClick={logParsed}
                style={{ width:"100%", padding:"10px", background:A, color:"#0b0d0b",
                  border:"none", borderRadius:10, fontSize:12, fontWeight:900, cursor:"pointer", letterSpacing:"0.06em" }}>
                ✓ LOG THIS WORKOUT
              </button>
            </>
          )}
          {hevyResult && hevyResult.error && (
            <div style={{ fontSize:12, color:"#ff7070", marginTop:4 }}>{hevyResult.error}</div>
          )}
        </>
      )}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
// Google profile pic with graceful fallback to the user's initial.
// referrerPolicy="no-referrer" stops googleusercontent from rejecting
// the request (403/429) when a cross-origin referrer is sent.
function Avatar({ user, size = 34 }) {
  const [failed, setFailed] = useState(false);
  const letter = (user?.name || "P")[0].toUpperCase();
  if (user?.picture && !failed) {
    return <img src={user.picture} width={size} height={size}
      referrerPolicy="no-referrer" onError={() => setFailed(true)}
      style={{ display:"block", borderRadius:10 }} alt=""/>;
  }
  return <span style={{ fontSize:13, fontWeight:900, color:A }}>{letter}</span>;
}

// ── Dashboard ─────────────────────────────────────────────────

// Inline editor for an already-logged food entry. Reused by the dashboard
// today-list and the History day view. Every field is editable by all users;
// the ✨ AI re-estimate button is premium-gated (mirrors AI Meal Log) and
// reuses the same AI_REESTIMATE_PROMPT + Open Food Facts cross-check.
function EntryEditor({ entry, onSave, onCancel, isPremium, onPremiumGate }) {
  const [f, setF] = useState({
    name:    entry.name,
    kcal:    String(entry.kcal),
    protein: String(entry.protein),
    carbs:   String(entry.carbs),
    fat:     String(entry.fat),
  });
  const [reest, setReest] = useState(false);
  const [reestMsg, setReestMsg] = useState(""); // "" | "done" | error text
  const set = (k, v) => { setF(p => ({ ...p, [k]: v })); setReestMsg(""); };

  const reestimate = async () => {
    if (!isPremium) { onPremiumGate({ emoji:"✨", name:"AI re-estimate" }); return; }
    if (!f.name.trim() || reest) return;
    setReest(true); setReestMsg("");
    const fill = r => setF(p => ({ ...p,
      kcal:    String(Math.round(r.kcal)),
      protein: String(Math.round(r.protein * 10) / 10),
      carbs:   String(Math.round(r.carbs   * 10) / 10),
      fat:     String(Math.round(r.fat     * 10) / 10),
    }));
    let upd;
    try {
      upd = await callAIJson(AI_REESTIMATE_PROMPT(f.name.trim()), 300);
    } catch (e) {
      setReestMsg("Couldn't reach the AI — check your connection and try again.");
      setReest(false);
      return;
    }
    // Show the AI answer immediately — the user never waits on Open Food Facts.
    fill(upd);
    setReestMsg("done");
    setReest(false);
    // OFF is a best-effort background refinement: bounded (6s) and may not return
    // at all on a poor connection. Only upgrades the figures if it beats the AI.
    try {
      const oft = await searchOFT(f.name.trim());
      if (oft && oft.confidence > upd.confidence) fill(oft);
    } catch (e) {}
  };

  const save = () => onSave({
    name:    f.name.trim() || entry.name,
    kcal:    Math.round(Number(f.kcal) || 0),
    protein: Math.round((Number(f.protein) || 0) * 10) / 10,
    carbs:   Math.round((Number(f.carbs)   || 0) * 10) / 10,
    fat:     Math.round((Number(f.fat)     || 0) * 10) / 10,
  });

  const fld = { background:BG, border:`1px solid ${BD}`, borderRadius:9, color:"#e6e1d7",
    fontSize:13, padding:"8px 10px", outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" };
  const lbl = { fontSize:10, color:"#827c73", fontWeight:700, letterSpacing:"0.05em", marginBottom:3, display:"block" };

  return (
    <div style={{ padding:"12px 16px 14px", background:"#15130f" }}>
      <label style={lbl}>NAME</label>
      <input value={f.name} onChange={e => set("name", e.target.value)} style={{ ...fld, marginBottom:10 }}/>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, minWidth:0 }}><label style={lbl}>KCAL</label>
          <input value={f.kcal}    onChange={e => set("kcal", e.target.value)}    inputMode="numeric" style={fld}/></div>
        <div style={{ flex:1, minWidth:0 }}><label style={lbl}>P (g)</label>
          <input value={f.protein} onChange={e => set("protein", e.target.value)} inputMode="decimal" style={fld}/></div>
        <div style={{ flex:1, minWidth:0 }}><label style={lbl}>C (g)</label>
          <input value={f.carbs}   onChange={e => set("carbs", e.target.value)}   inputMode="decimal" style={fld}/></div>
        <div style={{ flex:1, minWidth:0 }}><label style={lbl}>F (g)</label>
          <input value={f.fat}     onChange={e => set("fat", e.target.value)}     inputMode="decimal" style={fld}/></div>
      </div>
      <button onClick={reestimate} disabled={reest}
        style={{ width:"100%", padding:"10px", marginBottom: reestMsg ? 6 : 8, background:"#1c1a15",
          border:`1px solid ${A}44`, borderRadius:10, color:A, fontSize:12.5, fontWeight:800,
          cursor:"pointer", opacity: reest ? 0.6 : 1 }}>
        {reest ? "Re-estimating…" : reestMsg === "done" ? "✓ Updated — re-estimate again" : "✨ AI re-estimate from name"}
      </button>
      {reestMsg && reestMsg !== "done" && (
        <div style={{ fontSize:11, color:"#ff7b6b", marginBottom:8, lineHeight:1.4 }}>{reestMsg}</div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onCancel}
          style={{ flex:1, padding:"10px", background:"#1c1a15", border:`1px solid ${BD}`,
            borderRadius:10, color:"#9b958b", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
        <button onClick={save}
          style={{ flex:1, padding:"10px", background:A, border:"none",
            borderRadius:10, color:"#0b0d0b", fontSize:13, fontWeight:800, cursor:"pointer" }}>Save</button>
      </div>
    </div>
  );
}

function Dashboard({ logs, totals, targets, remaining, water, setWater,
  mode, setMode, setView, removeLog, updateLog, addToQA,
  hasProfile, streak, prof,
  weighIns, onWeighIn, tdeeAdj, baseTDEE, coachKey,
  workouts, onAddWorkout, onRemoveWorkout,
  customKcal, onSetCustomKcal, isCustomMode,
  aggressiveCutAcked, onAckAggressiveCut,
  authState, authUser, onPremiumGate, onSignOut,
  isOnline, syncMsg }) {

  const isPremium = authState === "premium";
  const [editingId, setEditingId] = useState(null);

  const overAmt    = Math.round(totals.kcal - targets.kcal);
  const pct        = Math.min(100, (totals.kcal / targets.kcal) * 100);
  const mc         = MODES[mode].color;
  const isTraining = workouts.length > 0;
  // Graduated calorie status: ok (≤100 over) | amber-soft (100-200) | amber (200-500) | red (500+)
  const AMBER = "#ffb84b";
  const RED   = "#ff5555";
  const kcalAccent  = overAmt > 500 ? RED : overAmt > 100 ? AMBER : mc;
  const kcalLabel   = overAmt > 200 ? "OVER BY" : overAmt > 100 ? "JUST OVER" : "REMAINING";
  const kcalBarBg   = overAmt > 500 ? RED : overAmt > 100 ? AMBER : `linear-gradient(90deg,${mc}88,${mc})`;
  const kcalBorder  = overAmt > 500 ? "#ff555322" : overAmt > 100 ? "#ffb84b22" : "#24211b";

  const [savedIds,      setSavedIds]      = useState({});
  const [qaBlink,       setQaBlink]       = useState({}); // log.id -> tap nonce, drives re-blink on every tap
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInputVal, setTargetInputVal] = useState("");

  const commitTarget = () => {
    const v = parseInt(targetInputVal);
    if (v > 0) { haptic(); onSetCustomKcal(v); }
    setEditingTarget(false);
  };

  // Warnings computed from custom target vs effective TDEE
  const tdee = targets.tdee; // effective TDEE (formula + adaptive adj)
  const targetWarning = (() => {
    if (!isCustomMode || targets.safeMinApplied) return null;
    const diff = customKcal - tdee; // negative = deficit
    if (diff < -1000) return { level: aggressiveCutAcked ? "amber" : "red",
      text: "This deficit is not recommended. Extreme cuts cause muscle loss, fatigue and metabolic damage. Are you sure?" };
    if (diff < -750)  return { level:"amber",
      text:`This is an aggressive deficit. You may lose muscle alongside fat. Consider ${(tdee - 750).toLocaleString()} kcal or above.` };
    if (diff >= -150 && diff < 0) return { level:"info",
      text:"Deficit is small — progress will be slow but sustainable 👍" };
    if (diff > 0 && diff <= 150) return { level:"info",
      text:"Small surplus — lean gains but slow 👍" };
    return null;
  })();

  const handleAddToQA = async log => {
    await addToQA(log);
    setSavedIds(p => ({ ...p, [log.id]:true }));
    setQaBlink(p => ({ ...p, [log.id]: (p[log.id] || 0) + 1 })); // re-blink even when already saved
    setTimeout(() => setSavedIds(p => ({ ...p, [log.id]:false })), 1800);
  };

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:A, letterSpacing:"-0.02em", lineHeight:1 }}>FUEL LOG</h1>
          <p style={{ margin:"4px 0 0", fontSize:12, color:"#9b958b", letterSpacing:"0.06em" }}>
            {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"short" }).toUpperCase()}
          </p>
          {!isOnline && <div style={{ marginTop:4, fontSize:10, color:"#ffb84b", fontWeight:700, letterSpacing:"0.06em" }}>OFFLINE</div>}
          {syncMsg   && <div style={{ marginTop:2,  fontSize:10, color:"#9b958b" }}>{syncMsg}</div>}
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {streak > 0 && (
            <div style={{ padding:"7px 10px", background:"#1c1a15", border:`1px solid ${BD}`,
              borderRadius:10, fontSize:13, fontWeight:900, color:A }}>🔥{streak}</div>
          )}
          <button onClick={() => setView("profile")} style={{ width:34, height:34, background:"#1c1a15",
            border:`1px solid ${BD}`, borderRadius:10, color:"#aea79c", fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center" }}>⚙️</button>
          <button onClick={() => setView("history")} style={{ width:34, height:34, background:"#1c1a15",
            border:`1px solid ${BD}`, borderRadius:10, color:"#aea79c", fontSize:15,
            display:"flex", alignItems:"center", justifyContent:"center" }}>📊</button>
          <button onClick={() => setView("achievements")} style={{ width:34, height:34, background:"#1c1a15",
            border:`1px solid ${BD}`, borderRadius:10, color:"#aea79c", fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center" }}>🏆</button>
          {isPremium && (
            <button onClick={() => setView("account")} aria-label="Account & Privacy"
              style={{ width:34, height:34, background:`${A}18`,
                border:`1px solid ${A}44`, borderRadius:10,
                display:"flex", alignItems:"center", justifyContent:"center",
                overflow:"hidden", padding:0 }}>
              <Avatar user={authUser}/>
            </button>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        {Object.entries(MODES).map(([k, v]) => {
          const active = !isCustomMode && mode === k;
          return (
            <button key={k} onClick={() => setMode(k)}
              style={{ flex:1, padding:"9px 4px",
                background: active ? v.color + "22" : "#1c1a15",
                color:      active ? v.color : "#9b958b",
                border:    `1px solid ${active ? v.color + "55" : BD}`,
                borderRadius:10, fontSize:11, fontWeight:900, letterSpacing:"0.06em" }}>
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Workout logger */}
      <WorkoutLogger workouts={workouts} onAdd={onAddWorkout} onRemove={onRemoveWorkout} prof={prof}
        isPremium={isPremium} onPremiumGate={onPremiumGate}/>

      {!hasProfile && (
        <button onClick={() => setView("profile")}
          style={{ width:"100%", padding:"11px", background:"#1c1a15",
            border:`1px solid ${A}33`, borderRadius:12, color:A,
            fontSize:12, fontWeight:700, marginBottom:12, letterSpacing:"0.06em" }}>
          👤 Set body stats for personalised targets →
        </button>
      )}

      {/* Target-setting warnings */}
      {targetWarning && (
        <div style={{ marginBottom:10 }}>
          {targetWarning.level === "red" ? (
            <div style={{ background:"#1a0505", border:"1px solid #ff555544", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:12, color:"#ff5555", fontWeight:800, letterSpacing:"0.06em", marginBottom:6 }}>
                ⚠️ NOT RECOMMENDED
              </div>
              <div style={{ fontSize:11, color:"#aa4444", lineHeight:1.6, marginBottom:10 }}>
                {targetWarning.text}
              </div>
              <button onClick={onAckAggressiveCut}
                style={{ background:"#ff555522", border:"1px solid #ff555544", borderRadius:8,
                  color:"#ff7777", fontSize:11, fontWeight:800, padding:"7px 14px", cursor:"pointer" }}>
                Yes, I understand →
              </button>
            </div>
          ) : targetWarning.level === "amber" ? (
            <div style={{ background:"#151000", border:"1px solid #ffb84b33", borderRadius:12,
              padding:"10px 14px", fontSize:11, color:"#8a7030", lineHeight:1.5 }}>
              ⚠️ {targetWarning.text}
            </div>
          ) : (
            <div style={{ background:"#141210", border:"1px solid #3a352a", borderRadius:12,
              padding:"10px 14px", fontSize:11, color:"#aea79c", lineHeight:1.5 }}>
              ℹ {targetWarning.text}
            </div>
          )}
        </div>
      )}

      {/* Safe minimum warning */}
      {targets.safeMinApplied && (
        <div style={{ background:"#1a1200", border:"1px solid #ffb84b33", borderRadius:12,
          padding:"10px 14px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
          <div style={{ fontSize:15, marginTop:1 }}>⚠️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:AMBER, fontWeight:800, letterSpacing:"0.06em", marginBottom:2 }}>
              SAFE MINIMUM APPLIED
            </div>
            <div style={{ fontSize:11, color:"#8a7030", lineHeight:1.5 }}>
              {isCustomMode
                ? `That's below the safe minimum for your body. We've set it to ${targets.kcal.toLocaleString()} kcal to keep you safe.`
                : "Your target has been set to the safe minimum."
              }{" "}
              <button onClick={() => setView("profile")}
                style={{ background:"none", border:"none", color:AMBER, fontSize:11,
                  fontWeight:700, padding:0, cursor:"pointer", textDecoration:"underline" }}>
                Check your profile stats.
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Macro floors too low for the target (#7) — floors kept, never silently broken */}
      {targets.floorsExceedKcal && (
        <div style={{ background:"#1a1200", border:"1px solid #ffb84b33", borderRadius:12,
          padding:"10px 14px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
          <div style={{ fontSize:15, marginTop:1 }}>⚠️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:AMBER, fontWeight:800, letterSpacing:"0.06em", marginBottom:2 }}>
              FLOORS KEPT
            </div>
            <div style={{ fontSize:11, color:"#8a7030", lineHeight:1.5 }}>
              This target's too low to hit your protein and fat floors. We've kept your floors,
              so your macros add up to a bit more than this number.
            </div>
          </div>
        </div>
      )}

      {/* Calorie card */}
      <div style={{ background:CARD, borderRadius:22,
        border:`1px solid ${kcalBorder}`, padding:"20px 22px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:11, color:mc, letterSpacing:"0.12em", fontWeight:800 }}>
            {MODES[mode].label}{isTraining ? " · ⚡" : ""}
          </div>
          {editingTarget ? (
            <div style={{ display:"flex", alignItems:"center", gap:4,
              background: mc + "12", border:`1px solid ${mc + "55"}`,
              borderRadius:8, padding:"5px 10px" }}>
              <input type="number" inputMode="numeric" value={targetInputVal}
                onChange={e => setTargetInputVal(e.target.value)}
                onBlur={commitTarget}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingTarget(false); }}
                autoFocus
                style={{ background:"none", border:"none",
                  color:mc, fontSize:13, fontWeight:900, width:60, textAlign:"center",
                  fontFamily:"inherit", outline:"none", padding:0 }}/>
              <span style={{ fontSize:10, color: mc + "99" }}>kcal</span>
            </div>
          ) : (
            <div onClick={() => { setTargetInputVal(String(targets.kcal)); setEditingTarget(true); }}
              style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:4,
                background: isCustomMode ? mc + "12" : "#1c1a15",
                border: `1px solid ${isCustomMode ? mc + "44" : "#2a2620"}`,
                borderRadius:8, padding:"5px 10px" }}>
              <span style={{ fontSize:12, color: isCustomMode ? mc : "#9a948a", fontWeight:700 }}>
                {targets.kcal.toLocaleString()} kcal
              </span>
              <span style={{ fontSize:10, color: isCustomMode ? mc + "99" : "#7a746a" }}>✎</span>
            </div>
          )}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", marginBottom:4 }}>CONSUMED</div>
            <div style={{ fontSize:42, fontWeight:900,
              color: overAmt > 100 ? kcalAccent : "#efeae0",
              lineHeight:1, letterSpacing:"-0.03em" }}>
              {Math.round(totals.kcal).toLocaleString()}
              <span style={{ fontSize:14, color:"#9b958b", fontWeight:400, marginLeft:5 }}>kcal</span>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", marginBottom:4 }}>
              {kcalLabel}
            </div>
            <div style={{ fontSize:30, fontWeight:900, color: kcalAccent, lineHeight:1 }}>
              {Math.abs(Math.round(remaining)).toLocaleString()}
              <span style={{ fontSize:12, color: overAmt > 100 ? kcalAccent + "99" : "#a7a197",
                fontWeight:400, marginLeft:4 }}>kcal</span>
            </div>
          </div>
        </div>
        <div style={{ height:10, background:"#1c1a15", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`,
            background: kcalBarBg,
            borderRadius:99, transition:"width 0.5s" }}/>
        </div>
      </div>

      {/* Macros */}
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"18px 20px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>MACROS</div>
        <MBar label="PROTEIN" value={totals.protein} target={targets.protein} color="#4b9fff"/>
        <MBar label="CARBS"   value={totals.carbs}   target={targets.carbs}   color="#ffb84b"/>
        <MBar label="FAT"     value={totals.fat}      target={targets.fat}     color="#ff7b4b"/>
      </div>

      {/* Coach tip */}
      {isPremium && <CoachCard key={coachKey} mode={mode} totals={totals} targets={targets} streak={streak} water={water} logs={logs}/>}

      {/* Water */}
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 20px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:3 }}>WATER</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#4b9fff" }}>
              {water}<span style={{ fontSize:13, color:"#2a4060", fontWeight:400, marginLeft:5 }}>/ 8 glasses</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setWater(Math.max(0, water - 1))}
              style={{ width:36, height:36, borderRadius:10, background:"#131826",
                border:"1px solid #1e2a3a", color:"#4b9fff", fontSize:20,
                display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
            <button onClick={() => setWater(water + 1)}
              style={{ width:36, height:36, borderRadius:10, background:"#0f1c2e",
                border:"1px solid #2a4a7a", color:"#4b9fff", fontSize:20,
                display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {Array.from({ length:8 }).map((_, i) => (
            <div key={i} style={{ flex:1, height:6, borderRadius:99,
              background: i < water ? "#4b9fff" : "#161a26", transition:"background 0.2s" }}/>
          ))}
        </div>
      </div>

      {/* Weigh-in */}
      <WeighInWidget weighIns={weighIns} onWeighIn={onWeighIn}
        tdeeAdj={tdeeAdj} baseTDEE={baseTDEE}/>

      {/* Add food */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { e:"🤖", l:"AI LOG",    s: isPremium ? "describe it"   : "premium ⭐", v:"ai",    premium:true  },
          { e:"⚡",  l:"QUICK ADD", s:"preset meals",                              v:"quick", premium:false },
          { e:"🔍", l:"SEARCH",    s:"food database",                             v:"search",premium:false },
        ].map(b => (
          <button key={b.v}
            onClick={() => b.premium && !isPremium
              ? onPremiumGate({ emoji: b.e, name: b.l })
              : setView(b.v)}
            style={{ background:CARD,
              border:`1px solid ${b.premium && !isPremium ? BD : BD}`,
              borderRadius:16, padding:"16px 8px", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:5 }}>{b.e}</div>
            <div style={{ fontSize:11, fontWeight:900,
              color: b.premium && !isPremium ? "#9b958b" : A,
              letterSpacing:"0.07em" }}>{b.l}</div>
            <div style={{ fontSize:10, color:"#6e6960", marginTop:3 }}>{b.s}</div>
          </button>
        ))}
      </div>

      {/* Log list */}
      {logs.length > 0 ? (
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, overflow:"hidden" }}>
          <div style={{ padding:"13px 20px 11px", fontSize:11, color:"#9b958b",
            letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}` }}>
            TODAY'S LOG · {logs.length} ITEM{logs.length !== 1 ? "S" : ""}
          </div>
          {[...logs].reverse().map((log, i) => (
            <div key={log.id} style={{ borderBottom: i < logs.length - 1 ? `1px solid ${BD}` : "none" }}>
              {editingId === log.id ? (
                <EntryEditor entry={log} isPremium={isPremium} onPremiumGate={onPremiumGate}
                  onCancel={() => setEditingId(null)}
                  onSave={patch => { updateLog(log.id, patch); setEditingId(null); }}/>
              ) : (
                <div style={{ display:"flex", alignItems:"center", padding:"13px 16px", gap:10 }}>
                  <div onClick={() => setEditingId(log.id)} style={{ flex:1, minWidth:0, cursor:"pointer" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#e6e1d7",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.name}</div>
                    <div style={{ fontSize:11, color:"#8b857c", marginTop:3 }}>
                      {log.time} · P:{log.protein}g C:{log.carbs}g F:{log.fat}g <span style={{ color:"#6e6960" }}>✎</span>
                    </div>
                  </div>
                  <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{Math.round(log.kcal)}</span>
                  <button key={"qa-" + log.id + "-" + (qaBlink[log.id] || 0)} onClick={() => handleAddToQA(log)}
                    style={{ flexShrink:0, padding:"7px 12px",
                      background: savedIds[log.id] ? A + "22" : "#1c1a15",
                      border: `1px solid ${savedIds[log.id] ? A + "66" : "#2a2620"}`,
                      borderRadius:10, color: savedIds[log.id] ? A : "#827c73",
                      animation: savedIds[log.id] ? "blink_add 0.4s ease-out" : "none",
                      fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    {savedIds[log.id] ? "✓" : "⚡"}
                  </button>
                  <button onClick={() => removeLog(log.id)}
                    style={{ flexShrink:0, width:32, height:32, background:"#1a0d0d",
                      border:"1px solid #3a1a1a", borderRadius:10, color:"#884444",
                      fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"#6e6960", fontSize:14 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🍽️</div>Nothing logged yet today.
        </div>
      )}
    </div>
  );
}

// ── AI Log ────────────────────────────────────────────────────

const AI_PROMPT = (desc) => `You are a nutrition database expert with encyclopaedic knowledge of UK and international commercial food products, restaurant menus, supermarket items, and portion sizes. Your estimates directly affect someone's health and body composition goals — accuracy is CRITICAL. Under-fuelling and over-fuelling are both harmful.

Rules:
- For any named restaurant, brand or product (GDK, Pret, McDonald's, Greggs, Magic Spoon, Quest, Grenade, Weetabix, Oatly etc.) use your precise knowledge of their ACTUAL menu nutrition data — never substitute a generic equivalent.
- Break the meal into individual components. Each component gets its own nutrition estimate and confidence score.
- Confidence score (0-100): 90+ means you have exact menu/label data. 60-89 means good knowledge but some uncertainty. Below 60 means you are estimating and the user should verify.
- If a component is ambiguous (e.g. "large meal" at a restaurant that only does regular), state the ambiguity in the reasoning field.
- Be conservative — if unsure between two estimates, explain both.
${dietaryPromptBlock(DIETARY)}
Meal to analyse: "${desc}"

Return ONLY valid JSON (no markdown, no preamble):
{
  "items": [
    {
      "name": "specific item name with quantity/size",
      "kcal": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "confidence": number,
      "reasoning": "one sentence explaining source of data or uncertainty"
    }
  ]
}`;

const AI_REESTIMATE_PROMPT = (item) => `You are a nutrition database expert. Re-estimate the nutritional content for this specific food item with maximum accuracy.

Item: "${item}"

Apply the same rules: use exact menu/label data for branded products. Be precise, not approximate.
${dietaryPromptBlock(DIETARY)}
Return ONLY valid JSON (no markdown):
{
  "name": "item name",
  "kcal": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number,
  "reasoning": "one sentence explaining source"
}`;

const confColor = c => c <= 33 ? "#ff5555" : c <= 66 ? "#ffb84b" : A;
const confLabel = c => c <= 33 ? "Low" : c <= 66 ? "Medium" : "High";

async function searchOFT(query) {
  try {
    // Bound this optional cross-check — OFF is flaky; never let it add a long
    // tail to an AI result. Abort after 6s and fall back to the AI estimate.
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    let res;
    try {
      res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3&fields=product_name,nutriments,serving_size`,
        { signal: ctrl.signal }
      );
    } finally { clearTimeout(timer); }
    const data = await res.json();
    const p = (data.products || []).find(p => p.nutriments?.["energy-kcal_100g"] != null);
    if (!p) return null;
    const sg2 = parseFloat(p.serving_size) || 100, f = sg2 / 100, n = p.nutriments;
    return {
      name:    p.product_name?.trim(),
      kcal:    Math.round((n["energy-kcal_100g"]  || 0) * f),
      protein: Math.round((n["proteins_100g"]      || 0) * f * 10) / 10,
      carbs:   Math.round((n["carbohydrates_100g"] || 0) * f * 10) / 10,
      fat:     Math.round((n["fat_100g"]           || 0) * f * 10) / 10,
      confidence: 98,
      reasoning: `Open Food Facts label data — ${p.product_name} per serving (~${Math.round(sg2)}g)`,
      source: "oft",
    };
  } catch(e) { return null; }
}

function ItemRow({ item, onReestimate, reestimating }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(item.name);
  const cc = confColor(item.confidence);
  const itemAllergens = scanAllergens(item.name, DIETARY.allergens); // zero-token backstop

  const submit = () => { setEditing(false); if (draft.trim() !== item.name) onReestimate(draft.trim()); };

  return (
    <div style={{ background:"#0b0d0b", borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
          {editing ? (
            <div style={{ display:"flex", gap:6 }}>
              <input value={draft} onChange={e => setDraft(e.target.value)}
                style={{ ...INP, padding:"6px 10px", fontSize:13, flex:1 }}
                onKeyDown={e => e.key === "Enter" && submit()}
                autoFocus/>
              <button onClick={submit}
                style={{ padding:"6px 12px", background:A, color:"#0b0d0b",
                  border:"none", borderRadius:8, fontSize:12, fontWeight:900, cursor:"pointer" }}>
                {reestimating ? "..." : "↺"}
              </button>
            </div>
          ) : (
            <div style={{ fontSize:13, fontWeight:600, color:"#e6e1d7", cursor:"pointer" }}
              onClick={() => setEditing(true)}>
              {item.name} <span style={{ fontSize:11, color:"#827c73" }}>✏️</span>
            </div>
          )}
          {item.source === "oft" && (
            <div style={{ fontSize:10, color:"#4b9fff", marginTop:2, letterSpacing:"0.06em" }}>📦 LABEL DATA</div>
          )}
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:900, color:A }}>{Math.round(item.kcal)}</div>
          <div style={{ fontSize:10, color:cc, fontWeight:700, marginTop:1 }}>
            {item.confidence}% {confLabel(item.confidence)}
          </div>
        </div>
      </div>
      <div style={{ fontSize:11, color:"#8b857c" }}>
        P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g
      </div>
      {item.reasoning && !editing && (
        <div style={{ fontSize:11, color:"#827c73", marginTop:5, lineHeight:1.5, fontStyle:"italic" }}>
          {item.reasoning}
        </div>
      )}
      {itemAllergens.length > 0 && (
        <div style={{ marginTop:6, fontSize:11, color:"#ff8866", fontWeight:700, lineHeight:1.4 }}>
          ⚠️ Contains {itemAllergens.join(", ")} — flagged from your allergies.
        </div>
      )}
    </div>
  );
}

function AILog({ onAdd, onBack }) {
  const [desc,         setDesc]         = useState("");
  const [loading,      setLoading]      = useState(false);
  const [items,        setItems]        = useState(null);
  const [reestIdx,     setReestIdx]     = useState(null);
  const [error,        setError]        = useState("");
  const [loggedAll,    setLoggedAll]    = useState(false);
  const [loggedCount,  setLoggedCount]  = useState({}); // idx -> times logged (ephemeral; resets on unmount)

  const totals = items ? items.reduce((a, it) => ({
    kcal:    a.kcal    + it.kcal,
    protein: a.protein + it.protein,
    carbs:   a.carbs   + it.carbs,
    fat:     a.fat     + it.fat,
  }), { kcal:0, protein:0, carbs:0, fat:0 }) : null;

  const avgConf = items ? Math.round(items.reduce((a, it) => a + it.confidence, 0) / items.length) : 0;

  const estimate = async () => {
    if (!desc.trim()) return;
    setLoading(true); setError(""); setItems(null); setLoggedAll(false); setLoggedCount({});
    try {
      const parsed = await callAIJson(AI_PROMPT(desc), 2000);
      let aiItems  = parsed.items || [];

      // OFT parallel lookup for each item
      const oftResults = await Promise.all(aiItems.map(it => searchOFT(it.name)));
      const merged = aiItems.map((it, i) => {
        const oft = oftResults[i];
        // Use OFT data if found AND it has higher confidence than AI estimate
        if (oft && oft.confidence > it.confidence) return { ...oft, name: it.name };
        return it;
      });

      setItems(merged);
    } catch(e) {
      setError("Estimation failed: " + e.message);
    }
    setLoading(false);
  };

  const reestimate = async (idx, newName) => {
    setReestIdx(idx);
    try {
      const updated = await callAIJson(AI_REESTIMATE_PROMPT(newName), 300);

      // Try OFT for the new name too
      const oft = await searchOFT(newName);
      const final = (oft && oft.confidence > updated.confidence)
        ? { ...oft, name: newName }
        : { ...updated, name: newName };

      setItems(prev => prev.map((it, i) => i === idx ? final : it));
    } catch(e) {}
    setReestIdx(null);
  };

  const logAll = () => {
    if (!totals) return;
    const name = desc.length > 40 ? desc.slice(0, 37) + "..." : desc;
    onAdd({ name, kcal: Math.round(totals.kcal),
      protein: Math.round(totals.protein * 10) / 10,
      carbs:   Math.round(totals.carbs   * 10) / 10,
      fat:     Math.round(totals.fat     * 10) / 10 });
    onBack();
  };

  const logItem = (item, idx) => {
    onAdd({ name: item.name, kcal: Math.round(item.kcal),
      protein: Math.round(item.protein * 10) / 10,
      carbs:   Math.round(item.carbs   * 10) / 10,
      fat:     Math.round(item.fat     * 10) / 10 });
    setLoggedCount(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="AI MEAL LOG" onBack={onBack}/>
      <p style={{ color:"#aea79c", fontSize:13, lineHeight:1.6, marginBottom:16 }}>
        Describe your meal — I'll break it down item by item with confidence scores.
        Tap any item to correct it and re-estimate.
      </p>

      <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
        placeholder={"e.g. 'GDK large mixed meat meal with small chips and Coke Zero, bowl of Magic Spoon cereal, Pret chicken bacon sandwich'"}
        style={{ width:"100%", boxSizing:"border-box", background:CARD,
          border:`1px solid ${BD}`, borderRadius:14, padding:"14px 16px",
          color:"#e6e1d7", fontSize:14, resize:"none", fontFamily:"inherit",
          outline:"none", lineHeight:1.6 }}/>
      <div style={{ fontSize:11, color:"#827c73", lineHeight:1.5, marginTop:6 }}>
        Just describe the food — no personal details needed. This text is sent to our AI to estimate nutrition.
      </div>

      <button onClick={estimate} disabled={loading || !desc.trim()}
        style={{ width:"100%", marginTop:12, padding:"15px",
          background: loading || !desc.trim() ? "#1c1a15" : A,
          color:      loading || !desc.trim() ? "#2c2820" : "#0b0d0b",
          border:"none", borderRadius:14, fontSize:14, fontWeight:900,
          letterSpacing:"0.08em", cursor: loading || !desc.trim() ? "not-allowed" : "pointer" }}>
        {loading ? "⚡ ANALYSING..." : "🤖 ANALYSE MEAL"}
      </button>

      {error && (
        <div style={{ color:"#ff8855", fontSize:12, marginTop:14, background:"#1a0d08",
          border:"1px solid #3a1a0a", borderRadius:10, padding:"12px 14px", lineHeight:1.6 }}>
          {error}
        </div>
      )}

      {items && (
        <div style={{ marginTop:20 }}>

          {/* Overall confidence banner */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            background:CARD, border:`1px solid ${BD}`, borderRadius:14,
            padding:"12px 16px", marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.1em", fontWeight:800 }}>
              OVERALL CONFIDENCE
            </div>
            <div style={{ fontSize:18, fontWeight:900, color: confColor(avgConf) }}>
              {avgConf}% <span style={{ fontSize:12 }}>{confLabel(avgConf)}</span>
            </div>
          </div>

          {/* Items */}
          {items.map((item, i) => (
            <ItemRow key={i} item={item}
              reestimating={reestIdx === i}
              onReestimate={newName => reestimate(i, newName)}/>
          ))}

          {/* Totals */}
          <div style={{ background:CARD, border:`1px solid ${A}33`, borderRadius:14,
            padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:11, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:10 }}>
              TOTAL
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              <Chip label="KCAL"    value={Math.round(totals.kcal)}          color={A}       />
              <Chip label="PROTEIN" value={Math.round(totals.protein) + "g"} color="#4b9fff" />
              <Chip label="CARBS"   value={Math.round(totals.carbs)   + "g"} color="#ffb84b" />
              <Chip label="FAT"     value={Math.round(totals.fat)     + "g"} color="#ff7b4b" />
            </div>
          </div>

          {/* Actions */}
          <button onClick={logAll}
            style={{ width:"100%", padding:"14px", background:A, color:"#0b0d0b",
              border:"none", borderRadius:12, fontSize:14, fontWeight:900,
              cursor:"pointer", marginBottom:8 }}>
            + LOG ALL AS ONE ENTRY
          </button>

          <div style={{ fontSize:11, color:"#827c73", textAlign:"center", marginBottom:12 }}>
            or tap individual items to log them separately ↑
          </div>

          {items.map((item, i) => {
            const count = loggedCount[i] || 0;
            const added = count > 0;
            const tag   = added ? "✓ Added" + (count > 1 ? " ×" + count : "") + " · " : "+ ";
            return (
            // key includes the count so each repeat tap remounts the row and re-runs blink_add
            <button key={i + "-" + count} onClick={() => logItem(item, i)}
              style={{ width:"100%", padding:"10px 14px",
                background: added ? A + "1e" : "#1c1a15",
                border:`1px solid ${added ? A + "66" : BD}`, borderRadius:10,
                color: added ? A : "#b6b0a4",
                fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:6,
                animation: added ? "blink_add 0.4s ease-out" : "none",
                textAlign:"left", display:"flex", justifyContent:"space-between" }}>
              <span>{tag}{item.name}</span>
              <span style={{ color:A, fontWeight:900 }}>{Math.round(item.kcal)} kcal</span>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Quick Add ─────────────────────────────────────────────────

function QuickAdd({ onAdd, onBack, meals, setMeals, isPremium = false, onPremiumGate = () => {} }) {
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null);

  const save = async m => { setMeals(m); await ss("meals", JSON.stringify(m)); };
  const handleSave = saved => {
    if (modal.index != null) { const u = [...meals]; u[modal.index] = saved; save(u); }
    else save([...meals, saved]);
    setModal(null);
  };
  const indexed  = meals.map((m, i) => ({ ...m, _i:i }));
  const filtered = indexed.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>
      {modal !== null && <MealForm meal={modal.meal} onSave={handleSave} onCancel={() => setModal(null)} isPremium={isPremium} onPremiumGate={onPremiumGate}/>}
      <BackHdr title="QUICK ADD" onBack={onBack}/>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search meals..." style={{ ...INP, flex:1, padding:"12px 16px" }}/>
        <button onClick={() => setModal({ meal:null, index:null })}
          style={{ padding:"12px 18px", background:"#1c1a15", border:`1px solid ${A}44`,
            borderRadius:12, color:A, fontWeight:900, fontSize:16, flexShrink:0 }}>＋</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(m => (
          <div key={m._i} style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14,
            padding:"13px 14px", display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => { onAdd(m); onBack(); }}
              style={{ flex:1, background:"none", border:"none", textAlign:"left", padding:0, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#e6e1d7",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
              <div style={{ fontSize:11, color:"#8b857c", marginTop:3 }}>
                P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g
              </div>
            </button>
            <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{m.kcal}</span>
            <button onClick={() => setModal({ meal:m, index:m._i })}
              style={{ background:"none", border:"none", fontSize:15, padding:"4px 6px", flexShrink:0 }}>✏️</button>
            <button onClick={() => { haptic(); save(meals.filter((_, i) => i !== m._i)); }}
              style={{ background:"none", border:"none", fontSize:15, padding:"4px 6px", flexShrink:0 }}>🗑️</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", color:"#6e6960", padding:"30px 0", fontSize:14 }}>No meals found</div>
        )}
      </div>
      <button onClick={() => { haptic(); save([...DEF_MEALS]); }}
        style={{ marginTop:16, width:"100%", padding:"11px", background:"none",
          border:`1px dashed #24211b`, borderRadius:12, color:"#6e6960", fontSize:12, fontFamily:"inherit" }}>
        ↩ Reset to defaults
      </button>
    </div>
  );
}

// ── Food Search ───────────────────────────────────────────────

function FoodSearch({ onAdd, onBack }) {
  const [q, setQ]             = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const search = async () => {
    if (!q.trim()) return;
    setLoading(true); setError(""); setResults([]); setDone(true);
    try {
      const res  = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,nutriments,serving_size,brands`);
      if (!res.ok) throw new Error("Network error");
      const data  = await res.json();
      const parseServing = raw => {
        if (!raw) return 100;
        const n = parseFloat(raw);
        return (isFinite(n) && n > 5 && n < 2000) ? n : 100;
      };
      const parseKcal = n => {
        if (n["energy-kcal_100g"] != null) return n["energy-kcal_100g"];
        if (n["energy_100g"] != null) return n["energy_100g"] / 4.184;
        return null;
      };
      const valid = (data.products || []).filter(p =>
        p.product_name?.trim() && parseKcal(p.nutriments || {}) != null);
      if (!valid.length) { setError("No results — try a brand name or simpler search term."); setLoading(false); return; }
      setResults(valid.slice(0, 12).map(p => {
        const n = p.nutriments, sg2 = parseServing(p.serving_size), f = sg2 / 100;
        const kcal100 = parseKcal(n);
        const brand = p.brands?.split(",")[0]?.trim();
        return {
          name:    [p.product_name.trim(), brand].filter(Boolean).join(" – "),
          kcal:    Math.round(kcal100 * f),
          protein: Math.round((n["proteins_100g"]        || 0) * f * 10) / 10,
          carbs:   Math.round((n["carbohydrates_100g"]   || 0) * f * 10) / 10,
          fat:     Math.round((n["fat_100g"]             || 0) * f * 10) / 10,
          notes:   `Per serving (~${Math.round(sg2)}g)`,
        };
      }));
    } catch(e) { setError("Search failed — check your internet connection."); }
    setLoading(false);
  };

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="FOOD SEARCH" onBack={onBack}/>
      <p style={{ color:"#aea79c", fontSize:13, lineHeight:1.6, marginBottom:16 }}>
        Search millions of products via Open Food Facts.
      </p>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="e.g. 'Grenade bar', 'Weetabix'..."
          style={{ ...INP, flex:1, padding:"13px 16px" }}/>
        <button onClick={search} disabled={loading || !q.trim()}
          style={{ padding:"13px 16px",
            background: q.trim() && !loading ? A : "#1c1a15",
            color:      q.trim() && !loading ? "#0b0d0b" : "#2c2820",
            border:"none", borderRadius:12, fontWeight:900, fontSize:13,
            flexShrink:0, letterSpacing:"0.06em" }}>
          {loading ? "..." : "SEARCH"}
        </button>
      </div>
      {loading && <div style={{ textAlign:"center", color:"#9b958b", padding:24, fontSize:14 }}>🔍 Searching...</div>}
      {error   && <p style={{ color:"#ff5555", fontSize:13, textAlign:"center", marginBottom:10 }}>{error}</p>}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {results.map((r, i) => (
          <button key={i} onClick={() => { onAdd(r); onBack(); }}
            style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14, padding:"14px 16px",
              textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
            <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#e6e1d7",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
              <div style={{ fontSize:11, color:"#8b857c", marginTop:3 }}>
                {r.notes} · P:{r.protein}g · C:{r.carbs}g · F:{r.fat}g
              </div>
            </div>
            <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{r.kcal}</span>
          </button>
        ))}
      </div>
      {done && !results.length && !loading && !error && (
        <div style={{ textAlign:"center", color:"#6e6960", padding:"30px 0" }}>No results</div>
      )}
    </div>
  );
}

// ── History ───────────────────────────────────────────────────

const chartsAvailable = typeof ResponsiveContainer !== "undefined";

function History({ history, onBack, onUpdateDay, weighIns = [], meals = DEF_MEALS, setMeals = () => {}, isPremium = false, onPremiumGate = () => {} }) {
  const RANGES = ["DAY","W","30D","3M","1Y","ALL"];
  const RLBL   = { DAY:"Day", W:"7 Days", "30D":"30 Days", "3M":"3 Months", "1Y":"Year", ALL:"All Time" };
  const MM = {
    KCAL:    { key:"kcal",    label:"Kcal",    color:"#e8e2d4", unit:"" },
    PROTEIN: { key:"protein", label:"Protein", color:"#4b9fff", unit:"g" },
    CARBS:   { key:"carbs",   label:"Carbs",   color:"#ffb84b", unit:"g" },
    FAT:     { key:"fat",     label:"Fat",     color:"#ff7b4b", unit:"g" },
  };

  const [range,      setRange]      = useState("30D");
  const [metrics,    setMetrics]    = useState(["KCAL"]);
  const [showWeight, setShowWeight] = useState(false);
  const [chartType,  setChartType]  = useState("line");
  const [dayIdx,     setDayIdx]     = useState(Math.max(0, history.length - 1));
  const [addCtx,     setAddCtx]     = useState(null);
  const [editId,     setEditId]     = useState(null);

  const toggleM = m => setMetrics(p =>
    p.includes(m) ? (p.length > 1 ? p.filter(x => x !== m) : p) : [...p, m]);

  const filtered = (() => {
    if (range === "DAY") return history;
    const days = { W:7, "30D":30, "3M":90, "1Y":365, ALL:99999 }[range];
    const cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    return history.filter(d => d.date >= cutoff);
  })();

  const filteredWeighIns = (() => {
    if (range === "DAY" || !weighIns.length) return [];
    const days = { W:7, "30D":30, "3M":90, "1Y":365, ALL:99999 }[range];
    const cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    return weighIns.filter(w => w.date >= cutoff);
  })();

  // Merge weight into chart data by date
  const weightByDate = Object.fromEntries(filteredWeighIns.map(w => [w.date, w.weight]));
  const chartData = filtered.map(d => ({
    date: fmtShort(d.date), KCAL: d.kcal,
    PROTEIN: Math.round(d.protein), CARBS: Math.round(d.carbs), FAT: Math.round(d.fat),
    WEIGHT: weightByDate[d.date] ?? null,
  }));

  // Weight-only chart data with 7-day rolling average
  const weightChartData = filteredWeighIns.map((w, i, arr) => {
    const win = arr.slice(Math.max(0, i - 6), i + 1);
    const avg = win.reduce((s, x) => s + x.weight, 0) / win.length;
    return {
      date: fmtShort(w.date), WEIGHT: w.weight,
      ROLLING: win.length >= 3 ? Math.round(avg * 10) / 10 : null,
    };
  });

  const day     = history[dayIdx] || null;
  const dayTots = day ? sumLogs(day.logs || []) : null;
  const pieData = dayTots ? [
    { name:"Protein", value: Math.round(dayTots.protein), color:"#4b9fff" },
    { name:"Carbs",   value: Math.round(dayTots.carbs),   color:"#ffb84b" },
    { name:"Fat",     value: Math.round(dayTots.fat),     color:"#ff7b4b" },
  ] : [];

  const patch = p => {
    const u = { ...day, ...p };
    if (p.logs) {
      const t = sumLogs(p.logs);
      u.kcal = Math.round(t.kcal); u.protein = Math.round(t.protein * 10) / 10;
      u.carbs = Math.round(t.carbs * 10) / 10; u.fat = Math.round(t.fat * 10) / 10;
    }
    onUpdateDay(u);
  };

  const exportCSV = () => {
    const rows = [["Date","Mode","Calories","Protein(g)","Carbs(g)","Fat(g)","Water","Training"]];
    history.forEach(d => rows.push([
      d.date, d.mode || "", Math.round(d.kcal), Math.round(d.protein),
      Math.round(d.carbs), Math.round(d.fat), d.water, d.training ? "Yes" : "No",
    ]));
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.map(r => r.join(",")).join("\n"));
    a.download = "fuel-log-" + todayKey() + ".csv";
    a.click();
  };

  const addEntry = e => {
    patch({ logs:[...(day.logs||[]), { ...e, id:Date.now(), time:new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }] });
    setAddCtx(null);
  };

  if (addCtx === "quick") return <QuickAdd meals={meals} setMeals={setMeals} onAdd={addEntry} onBack={() => setAddCtx(null)} isPremium={isPremium} onPremiumGate={onPremiumGate}/>;
  if (addCtx === "manual") return <MealForm onSave={addEntry} onCancel={() => setAddCtx(null)} isPremium={isPremium} onPremiumGate={onPremiumGate}/>;
  if (addCtx === "ai")    return <AILog onAdd={addEntry} onBack={() => setAddCtx(null)}/>;

  return (
    <div style={{ padding:"20px 16px 50px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="HISTORY" onBack={onBack} right={
        history.length > 0 && (
          <button onClick={exportCSV}
            style={{ padding:"8px 14px", background:"#1c1a15", border:`1px solid ${A}44`,
              borderRadius:10, color:A, fontSize:11, fontWeight:900, cursor:"pointer", letterSpacing:"0.07em" }}>
            📥 CSV
          </button>
        )
      }/>

      {history.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"#6e6960" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
          <div style={{ fontSize:14 }}>No history yet — days auto-save as you log.</div>
        </div>
      )}

      {history.length > 0 && (
        <>
          <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                style={{ padding:"7px 14px",
                  background: range === r ? A : "#1c1a15",
                  color:      range === r ? "#0b0d0b" : "#aea79c",
                  border: `1px solid ${range === r ? A : BD}`,
                  borderRadius:99, fontSize:12, fontWeight:900, flexShrink:0 }}>
                {RLBL[r]}
              </button>
            ))}
          </div>

          {range === "DAY" && (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                marginBottom:18, background:CARD, border:`1px solid ${BD}`, borderRadius:16, padding:"12px 16px" }}>
                <button onClick={() => setDayIdx(i => Math.max(0, i - 1))} disabled={dayIdx === 0}
                  style={{ background:"none", border:"none",
                    color: dayIdx === 0 ? "#524d46" : "#a7a197", fontSize:24, padding:"0 6px", lineHeight:1 }}>‹</button>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#e6e1d7" }}>{day ? fmtFull(day.date) : "—"}</div>
                  {day && (
                    <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:5 }}>
                      {day.mode && (
                        <span style={{ fontSize:10, fontWeight:900, color: MODES[day.mode]?.color || A,
                          background: (MODES[day.mode]?.color || A) + "22", padding:"2px 8px", borderRadius:99 }}>
                          {MODES[day.mode]?.label}
                        </span>
                      )}
                      <button onClick={() => patch({ training: !day.training })}
                        style={{ fontSize:10, fontWeight:900, padding:"2px 8px",
                          background: day.training ? A + "22" : "#1c1a15",
                          color: day.training ? A : "#9b958b",
                          border: `1px solid ${day.training ? A + "44" : BD}`, borderRadius:99 }}>
                        {day.training ? "⚡ TRAINING" : "💤 REST"}
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => setDayIdx(i => Math.min(history.length - 1, i + 1))}
                  disabled={dayIdx === history.length - 1}
                  style={{ background:"none", border:"none",
                    color: dayIdx === history.length - 1 ? "#524d46" : "#a7a197",
                    fontSize:24, padding:"0 6px", lineHeight:1 }}>›</button>
              </div>

              {day && dayTots && (
                <>
                  <div style={{ textAlign:"center", marginBottom:20 }}>
                    <div style={{ fontSize:56, fontWeight:900, color:A, lineHeight:1, letterSpacing:"-0.03em" }}>
                      {Math.round(dayTots.kcal).toLocaleString()}
                    </div>
                    <div style={{ fontSize:14, color:"#9b958b", marginTop:4, letterSpacing:"0.12em" }}>CALORIES</div>
                    <div style={{ fontSize:12, marginTop:6, color:"#9b958b" }}>
                      P:{Math.round(dayTots.protein)}g · C:{Math.round(dayTots.carbs)}g · F:{Math.round(dayTots.fat)}g
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"20px", marginBottom:14 }}>
                    <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>
                      MACRO BREAKDOWN
                    </div>
                    {chartsAvailable ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                            dataKey="value" paddingAngle={3}>
                            {pieData.map((e, i) => <Cell key={i} fill={e.color}/>)}
                          </Pie>
                          <Tooltip formatter={(v, n) => [v + "g", n]}/>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ fontSize:11, color:"#9b958b", padding:"8px 0" }}>Charts unavailable — Recharts CDN failed to load.</div>
                    )}
                    <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:8 }}>
                      {pieData.map(p => (
                        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <div style={{ width:9, height:9, borderRadius:"50%", background:p.color }}/>
                          <span style={{ fontSize:11, color:"#b6b0a4" }}>
                            {p.name}: <strong style={{ color:"#e6e1d7" }}>{p.value}g</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:16,
                    padding:"14px 18px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:12, color:"#9b958b", letterSpacing:"0.1em", fontWeight:800 }}>WATER </span>
                      <span style={{ fontSize:14, color:"#4b9fff", fontWeight:900 }}>{day.water} / 8</span>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => patch({ water: Math.max(0, (day.water || 0) - 1) })}
                        style={{ width:32, height:32, borderRadius:8, background:"#131826",
                          border:"1px solid #1e2a3a", color:"#4b9fff", fontSize:18,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                      <button onClick={() => patch({ water: (day.water || 0) + 1 })}
                        style={{ width:32, height:32, borderRadius:8, background:"#0f1c2e",
                          border:"1px solid #2a4a7a", color:"#4b9fff", fontSize:18,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, overflow:"hidden", marginBottom:12 }}>
                    <div style={{ padding:"12px 18px 10px", fontSize:11, color:"#9b958b",
                      letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}`,
                      display:"flex", justifyContent:"space-between" }}>
                      <span>FOODS · {(day.logs || []).length} ITEMS</span>
                      <span style={{ fontSize:10, color:"#827c73" }}>× to remove</span>
                    </div>
                    {(day.logs || []).length === 0 && (
                      <div style={{ padding:"18px", textAlign:"center", color:"#6e6960", fontSize:13 }}>No foods logged</div>
                    )}
                    {(day.logs || []).map((log, i) => (
                      <div key={log.id || i} style={{ borderBottom: i < day.logs.length - 1 ? `1px solid ${BD}` : "none" }}>
                        {editId === (log.id || i) ? (
                          <EntryEditor entry={log} isPremium={isPremium} onPremiumGate={onPremiumGate}
                            onCancel={() => setEditId(null)}
                            onSave={p => {
                              patch({ logs: (day.logs || []).map(l => (l.id || l) === (log.id || log) ? { ...l, ...p } : l) });
                              setEditId(null);
                            }}/>
                        ) : (
                          <div style={{ display:"flex", justifyContent:"space-between",
                            alignItems:"center", padding:"11px 16px" }}>
                            <div onClick={() => setEditId(log.id || i)} style={{ flex:1, minWidth:0, paddingRight:10, cursor:"pointer" }}>
                              <div style={{ fontSize:13, color:"#e6e1d7", overflow:"hidden",
                                textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.name}</div>
                              <div style={{ fontSize:11, color:"#8b857c", marginTop:2 }}>
                                P:{log.protein}g C:{log.carbs}g F:{log.fat}g <span style={{ color:"#6e6960" }}>✎</span>
                              </div>
                            </div>
                            <span style={{ fontSize:15, fontWeight:900, color:A, flexShrink:0 }}>{Math.round(log.kcal)}</span>
                            <button onClick={() => patch({ logs: (day.logs || []).filter(l => l.id !== log.id && l !== log) })}
                              style={{ background:"none", border:"none", color:"#524d46", fontSize:18, padding:"2px 10px" }}>×</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setAddCtx("quick")}
                      style={{ flex:1, padding:"11px", background:"#1c1a15",
                        border:`1px solid ${A}33`, borderRadius:12, color:A, fontSize:12, fontWeight:900, letterSpacing:"0.07em" }}>
                      ⚡ QUICK ADD
                    </button>
                    <button onClick={() => setAddCtx("ai")}
                      style={{ flex:1, padding:"11px", background:"#1c1a15",
                        border:`1px solid ${A}33`, borderRadius:12, color:A, fontSize:12, fontWeight:900, letterSpacing:"0.07em" }}>
                      🤖 AI LOG
                    </button>
                    <button onClick={() => setAddCtx("manual")}
                      style={{ flex:1, padding:"11px", background:"#1c1a15",
                        border:`1px solid ${A}33`, borderRadius:12, color:A, fontSize:12, fontWeight:900, letterSpacing:"0.07em" }}>
                      ＋ MANUAL
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {range !== "DAY" && filtered.length > 0 && (
            <>
              <div style={{ display:"flex", gap:7, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
                {Object.entries(MM).map(([k, m]) => (
                  <button key={k} onClick={() => { setShowWeight(false); toggleM(k); }}
                    style={{ padding:"6px 13px",
                      background: !showWeight && metrics.includes(k) ? m.color + "22" : "#1c1a15",
                      color:      !showWeight && metrics.includes(k) ? m.color       : "#9b958b",
                      border: `1px solid ${!showWeight && metrics.includes(k) ? m.color + "55" : BD}`,
                      borderRadius:99, fontSize:11, fontWeight:900 }}>
                    {m.label}
                  </button>
                ))}
                {filteredWeighIns.length > 0 && (
                  <button onClick={() => setShowWeight(w => !w)}
                    style={{ padding:"6px 13px",
                      background: showWeight ? "#4b9fff22" : "#1c1a15",
                      color:      showWeight ? "#4b9fff"   : "#9b958b",
                      border: `1px solid ${showWeight ? "#4b9fff55" : BD}`,
                      borderRadius:99, fontSize:11, fontWeight:900 }}>
                    ⚖️ Weight
                  </button>
                )}
                <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                  {[["line","📈"],["bar","📊"]].map(([t, e]) => (
                    <button key={t} onClick={() => setChartType(t)}
                      style={{ padding:"6px 12px",
                        background: chartType === t ? "#24211b" : "#1c1a15",
                        color:      chartType === t ? "#e6e1d7" : "#9b958b",
                        border: `1px solid ${chartType === t ? "#3a352a" : BD}`, borderRadius:8, fontSize:12 }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 8px 8px", marginBottom:16 }}>
                {chartsAvailable ? (
                  <ResponsiveContainer width="100%" height={200}>
                    {showWeight ? (
                      <LineChart data={weightChartData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                        <XAxis dataKey="date" tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
                        <Tooltip formatter={(v, n) => [v + " kg", n === "ROLLING" ? "7-day avg" : "Weight"]}/>
                        <Line type="monotone" dataKey="WEIGHT" stroke="#4b9fff" strokeWidth={1.5} dot={{ r:2.5, fill:"#4b9fff" }} name="Weight" connectNulls={false}/>
                        <Line type="monotone" dataKey="ROLLING" stroke={A} strokeWidth={2.5} dot={false} name="ROLLING" connectNulls={true}/>
                      </LineChart>
                    ) : chartType === "line" ? (
                      <LineChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                        <XAxis dataKey="date" tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false}/>
                        <Tooltip/>
                        {metrics.map(m => <Line key={m} type="monotone" dataKey={m} stroke={MM[m].color} strokeWidth={2.5} dot={false} name={m}/>)}
                      </LineChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                        <XAxis dataKey="date" tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill:"#8b857c", fontSize:10 }} axisLine={false} tickLine={false}/>
                        <Tooltip/>
                        {metrics.map(m => <Bar key={m} dataKey={m} fill={MM[m].color} radius={[4,4,0,0]} name={m} maxBarSize={28}/>)}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div style={{ fontSize:11, color:"#9b958b", padding:"12px 8px" }}>Charts unavailable — Recharts CDN failed to load.</div>
                )}
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"16px 18px", marginBottom:16 }}>
                <div style={{ fontSize:11, color:"#9b958b", letterSpacing:"0.12em", fontWeight:800, marginBottom:12 }}>
                  {RLBL[range].toUpperCase()} AVERAGES · {filtered.length} DAYS
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {Object.entries(MM).map(([k, m]) => {
                    const avg = filtered.length
                      ? filtered.reduce((a, d) => a + (d[m.key] || 0), 0) / filtered.length : 0;
                    return <Chip key={k} label={m.label.toUpperCase()} value={Math.round(avg) + m.unit} color={m.color}/>;
                  })}
                </div>
                {filteredWeighIns.length >= 2 && (() => {
                  const first = filteredWeighIns[0].weight;
                  const last  = filteredWeighIns[filteredWeighIns.length - 1].weight;
                  const diff  = Math.round((last - first) * 10) / 10;
                  return (
                    <div style={{ marginTop:10, display:"flex", justifyContent:"space-between",
                      background:"#0b0d0b", borderRadius:10, padding:"10px 14px", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:"#9b958b", letterSpacing:"0.08em", fontWeight:800 }}>⚖️ WEIGHT TREND</div>
                        <div style={{ fontSize:12, color:"#8b857c", marginTop:2 }}>
                          {filteredWeighIns[0].weight}kg → {last}kg
                        </div>
                      </div>
                      <div style={{ fontSize:15, fontWeight:900, color: diff <= 0 ? A : "#ff7b4b" }}>
                        {diff > 0 ? "+" : ""}{diff} kg
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px 10px", fontSize:11, color:"#9b958b",
                  letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}` }}>
                  {filtered.length} DAYS LOGGED
                </div>
                {[...filtered].reverse().map((d, i) => (
                  <div key={d.date} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"12px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${BD}` : "none", cursor:"pointer" }}
                    onClick={() => { setRange("DAY"); setDayIdx(history.findIndex(h => h.date === d.date)); }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#e6e1d7" }}>
                        {fmtFull(d.date)}
                        {d.mode && <span style={{ fontSize:10, fontWeight:900, color: MODES[d.mode]?.color || A, marginLeft:8 }}>{MODES[d.mode]?.label}</span>}
                        {d.training && <span style={{ fontSize:10, color:A, marginLeft:6 }}>⚡</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#8b857c", marginTop:2 }}>
                        P:{Math.round(d.protein)}g · C:{Math.round(d.carbs)}g · F:{Math.round(d.fat)}g · 💧{d.water}
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16, fontWeight:900, color:A }}>{Math.round(d.kcal)}</span>
                      <span style={{ fontSize:12, color:"#827c73" }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {range !== "DAY" && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#6e6960", fontSize:14 }}>
              No data for this range yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Achievements ──────────────────────────────────────────────

function Achievements({ earnedBdgs, onBack }) {
  return (
    <div style={{ padding:"20px 16px 50px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="ACHIEVEMENTS 🏆" onBack={onBack}/>
      <p style={{ color:"#aea79c", fontSize:13, lineHeight:1.6, marginBottom:20 }}>
        ×2 progression: Bronze 3 → Silver 6 → Gold 12 → Platinum 24 → Diamond 48 → Elite 96
      </p>
      {BDGS.map(b => {
        const earned = TIERS.map((_, i) => earnedBdgs.includes(b.id + "_" + i));
        const top    = earned.lastIndexOf(true);
        return (
          <div key={b.id} style={{ background:CARD, border:`1px solid ${top >= 0 ? A + "22" : BD}`,
            borderRadius:18, padding:"16px 20px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
              <div style={{ fontSize:36 }}>{b.emoji}</div>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"#e6e1d7" }}>{b.name}</div>
                <div style={{ fontSize:12, color:"#9b958b", marginTop:2 }}>
                  {top >= 0
                    ? `${TIER_ICONS[top]} ${TIER_NAMES[top]} · ${TIERS[top]} ${b.desc}`
                    : `Not yet · first at ${TIERS[0]} ${b.desc}`}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5 }}>
              {TIERS.map((t, i) => (
                <div key={i} style={{ flex:1, textAlign:"center", opacity: earned[i] ? 1 : 0.2 }}>
                  <div style={{ fontSize:16 }}>{TIER_ICONS[i]}</div>
                  <div style={{ fontSize:9, color: earned[i] ? A : "#827c73", marginTop:2, fontWeight: earned[i] ? 700 : 400 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {earnedBdgs.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 0", color:"#6e6960", fontSize:13 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🏆</div>
          No badges yet — keep logging!
        </div>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────

function App() {
  const [view,       setView]       = useState("dashboard");
  const [logs,       setLogs]       = useState([]);
  const [water,      setWater]      = useState(0);
  const [mode,       setMode]       = useState("cut");
  const [prof,       setProf]       = useState(null);
  const [hist,       setHist]       = useState([]);
  const [meals,      setMeals]      = useState([...DEF_MEALS]);
  const [workouts,   setWorkouts]   = useState([]);
  const [earnedBdgs, setEarnedBdgs] = useState([]);
  const [newBadge,   setNewBadge]   = useState(null);
  const [ready,      setReady]      = useState(false);
  const [weighIns,   setWeighIns]   = useState([]);
  const [tdeeAdj,    setTdeeAdj]    = useState(0);
  const [coachKey,         setCoachKey]         = useState(0);
  const [streakAnim,       setStreakAnim]       = useState(null);
  const [customKcal,       setCustomKcal]       = useState(null);
  const [aggressiveCutAcked, setAggressiveCutAcked] = useState(false);

  // ── Auth state ────────────────────────────────────────────────
  const [authState,   setAuthState]   = useState("anonymous");
  const [authUser,    setAuthUser]    = useState(null);
  const [premiumGate, setPremiumGate] = useState(null); // {emoji, name} | null
  const [showSignIn,  setShowSignIn]  = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showLapsed,  setShowLapsed]  = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false); // retroactive Art. 9 consent (R2)
  const [consentInfo,  setConsentInfo]  = useState(null);  // parsed local health_consent for display
  const [isOnline,    setIsOnline]    = useState(navigator.onLine);
  const [syncMsg,     setSyncMsg]     = useState("");

  useEffect(() => {
    const up   = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online",  up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []); // eslint-disable-line

  // Top-align every page on first access — reset scroll whenever the view changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  }, [view]);

  // Expose dev refresh hook for test harness
  useEffect(() => {
    window.__devRefreshCoach = () => {
      ss("coach__" + todayKey(), JSON.stringify({ tip:"", r:0 }));
      setCoachKey(k => k + 1);
    };
    return () => { delete window.__devRefreshCoach; };
  }, []); // eslint-disable-line

  useEffect(() => {
    const load = async () => {
      await runMigrations();
      const k = todayKey();
      const lv = await sg("logs__"  + k); if (lv)  setLogs(JSON.parse(lv));
      const wv = await sg("water__" + k); if (wv)  setWater(parseInt(wv) || 0);
      const mv = await sg("mode__"  + k); if (mv)  setMode(mv);
      const pv = await sg("profile");     if (pv)  { const pp = JSON.parse(pv); setProf(pp); setDietaryCache(pp.dietary); }
      const mv2 = await sg("meals");      if (mv2) setMeals(JSON.parse(mv2));
      const wkv = await sg("workouts__" + k); if (wkv) setWorkouts(JSON.parse(wkv));
      const bv = await sg("badges");     if (bv)  setEarnedBdgs(JSON.parse(bv));
      const hv = await sg("history");    if (hv)  setHist(JSON.parse(hv));
      const wiv = await sg("weighins");  if (wiv) setWeighIns(JSON.parse(wiv));
      const tav = await sg("tdee_adj");  if (tav) setTdeeAdj(parseInt(tav) || 0);
      const ckv = await sg("target_kcal"); if (ckv) { const n = parseInt(ckv); if (n > 0) setCustomKcal(n); }
      const acv = await sg("aggressive_cut_acked"); if (acv) setAggressiveCutAcked(true);

      // Auth — load premium state and check expiry
      const asv = await sg("auth_state");
      const auv = await sg("auth_user");
      if (asv === "premium" && auv) {
        const u = JSON.parse(auv);
        if (u.subExpiry && Date.now() > u.subExpiry) {
          await ss("auth_state", "anonymous");
          setShowLapsed(true);
        } else {
          setAuthState("premium");
          setAuthUser(u);
          // Retroactive consent guard (R2): premium users from before consent existed,
          // or who haven't agreed to the current policy version, must consent before continuing.
          const hc = await sg("health_consent");
          let hcParsed = null; try { hcParsed = hc ? JSON.parse(hc) : null; } catch(e) {}
          if (hcParsed) setConsentInfo(hcParsed);
          if (!hcParsed || hcParsed.version !== POLICY_VERSION) setNeedsConsent(true);
          // Background pull — app shows immediately from local, Supabase data merges in
          if (u.id && navigator.onLine) {
            pullFromSupabase(u.id).then(pulled => {
              if (pulled.profile)  { setProf(pulled.profile); setDietaryCache(pulled.profile.dietary); }
              if (pulled.weighIns) setWeighIns(pulled.weighIns);
              if (pulled.meals)    setMeals(pulled.meals);
              if (pulled.badges)   setEarnedBdgs(pulled.badges);
              if (pulled.settings) {
                if (pulled.settings.mode)                 setMode(pulled.settings.mode);
                if (pulled.settings.tdee_adj != null)     setTdeeAdj(Number(pulled.settings.tdee_adj));
                if (pulled.settings.custom_kcal != null)  setCustomKcal(Number(pulled.settings.custom_kcal));
                if (pulled.settings.aggressive_cut_acked) setAggressiveCutAcked(true);
              }
              if (pulled.history) {
                setHist(pulled.history);
                const tod = todayKey();
                const snap = pulled.history.find(h => h.date === tod);
                if (snap) { setLogs(snap.logs || []); setWater(snap.water || 0); }
              }
              if (pulled.workouts) setWorkouts(pulled.workouts[todayKey()] || []);
            }).catch(() => {});
          }
        }
      }

      setReady(true);
    };
    load();
  }, []); // eslint-disable-line

  // Badge check
  useEffect(() => {
    if (!ready || !hist.length) return;
    const streak  = calcStreak(hist);
    const metrics = {
      streak,
      logger:   hist.filter(d => d.logs?.length > 0).length,
      hydrated: hist.filter(d => (d.water || 0) >= 8).length,
    };
    const newlyEarned = [];
    BDGS.forEach(b => {
      const val = metrics[b.id] || 0;
      TIERS.forEach((t, i) => {
        if (val >= t && !earnedBdgs.includes(b.id + "_" + i))
          newlyEarned.push({ b, i, key: b.id + "_" + i });
      });
    });
    if (newlyEarned.length) {
      const updated = [...earnedBdgs, ...newlyEarned.map(x => x.key)];
      setEarnedBdgs(updated);
      ss("badges", JSON.stringify(updated));
      setNewBadge(newlyEarned[0]);
      if (authState === "premium" && authUser?.id)
        syncBadges(authUser.id, updated).catch(() => {});
    }
  }, [hist]); // eslint-disable-line

  const saveLogs = async l => {
    setLogs(l);
    await ss("logs__" + todayKey(), JSON.stringify(l));
    if (authState === "premium" && authUser?.id)
      syncFoodLogs(authUser.id, todayKey(), l).catch(() => {});
  };
  const saveWater = async w => {
    setWater(w);
    await ss("water__" + todayKey(), String(w));
    if (authState === "premium" && authUser?.id)
      syncWater(authUser.id, todayKey(), w).catch(() => {});
  };
  const saveMode = async m => {
    setMode(m);
    await ss("mode__" + todayKey(), m);
    if (authState === "premium" && authUser?.id)
      syncSettings(authUser.id, m, tdeeAdj, customKcal, aggressiveCutAcked).catch(() => {});
  };
  const saveProf = async p => {
    setProf(p);
    setDietaryCache(p.dietary); // keep the AI-prompt cache in step with the saved config
    await ss("profile", JSON.stringify(p));
    if (authState === "premium" && authUser?.id)
      syncProfile(authUser.id, p).catch(() => {});
  };
  const saveWorkouts = async w => {
    setWorkouts(w);
    await ss("workouts__" + todayKey(), JSON.stringify(w));
    if (authState === "premium" && authUser?.id)
      syncWorkouts(authUser.id, todayKey(), w).catch(() => {});
  };

  const addLog = async e => {
    haptic();
    const isFirstToday = logs.length === 0;
    await saveLogs([...logs, { ...e, id:Date.now(),
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }]);
    if (isFirstToday) {
      const animKey = "streak_anim__" + todayKey();
      if (!localStorage.getItem(animKey)) {
        const today = todayKey();
        const simulatedHist = [
          ...hist.filter(d => d.date !== today),
          { date: today, logs: [e] }
        ];
        const newStreak = calcStreak(simulatedHist);
        if (newStreak > 0) {
          localStorage.setItem(animKey, "1");
          setStreakAnim({
            prevStreak:  Math.max(0, newStreak - 1),
            newStreak,
            isMilestone: [7, 14, 30, 50, 100].includes(newStreak),
          });
        }
      }
    }
  };
  const removeLog    = id => { haptic(); return saveLogs(logs.filter(l => l.id !== id)); };
  const updateLog    = (id, patch) => { haptic(); return saveLogs(logs.map(l => l.id === id ? { ...l, ...patch } : l)); };
  const addWorkout   = w  => { haptic(); return saveWorkouts([...workouts, w]); };
  const removeWorkout = id => { haptic(); return saveWorkouts(workouts.filter(w => w.id !== id)); };

  const saveCustomKcal = async kcal => {
    setCustomKcal(kcal);
    if (kcal == null) await ss("target_kcal", "");
    else              await ss("target_kcal", String(kcal));
    if (authState === "premium" && authUser?.id)
      syncSettings(authUser.id, mode, tdeeAdj, kcal, aggressiveCutAcked).catch(() => {});
  };

  const handleSetMode = async m => {
    await saveMode(m);
    await saveCustomKcal(null);
    // Sync once more with correct (m, null) pair to resolve any stale-closure race
    if (authState === "premium" && authUser?.id)
      syncSettings(authUser.id, m, tdeeAdj, null, aggressiveCutAcked).catch(() => {});
  };

  const handleAckAggressiveCut = async () => {
    setAggressiveCutAcked(true);
    await ss("aggressive_cut_acked", "1");
    if (authState === "premium" && authUser?.id)
      syncSettings(authUser.id, mode, tdeeAdj, customKcal, true).catch(() => {});
  };

  const saveMeals = async updated => {
    setMeals(updated);
    await ss("meals", JSON.stringify(updated));
    if (authState === "premium" && authUser?.id)
      syncMeals(authUser.id, updated).catch(() => {});
  };

  const addToQA = async entry => {
    const name = entry.name;
    if (meals.find(m => m.name.toLowerCase() === name.toLowerCase())) return;
    haptic();
    const clean = { name, kcal: Math.round(entry.kcal),
      protein: Math.round(entry.protein * 10) / 10,
      carbs:   Math.round(entry.carbs   * 10) / 10,
      fat:     Math.round(entry.fat     * 10) / 10 };
    await saveMeals([...meals, clean]);
  };

  // ── Auth handlers ─────────────────────────────────────────────

  const handleSignInSuccess = async (googleUser, grantedBy, consentMeta) => {
    const user = {
      id:        googleUser.id      || null,
      name:      googleUser.name    || "User",
      email:     googleUser.email   || "",
      picture:   googleUser.picture || "",
      grantedBy,
      subExpiry: null, // null = no expiry (voucher phase); real payments will set this
      since:     Date.now(),
    };
    setAuthUser(user);
    setAuthState("premium");
    await ss("auth_state", "premium");
    await ss("auth_user",  JSON.stringify(user));
    // Record consent locally so we don't re-prompt, and what version was agreed (R2/R6).
    if (consentMeta) {
      const rec = { ...consentMeta, version: consentMeta.policyVersion };
      await ss("health_consent", JSON.stringify(rec));
      setConsentInfo(rec);
    }
    setShowSignIn(false);
    setPremiumGate(null);

    if (user.id && navigator.onLine) {
      setSyncMsg("Syncing your data…");
      try {
        // Persist the explicit consent record before the first health-data sync.
        if (consentMeta) await syncConsent(user.id, consentMeta);
        await migrateLocalToSupabase(user.id);
        const pulled = await pullFromSupabase(user.id);
        if (pulled.profile)  { setProf(pulled.profile); setDietaryCache(pulled.profile.dietary); }
        if (pulled.weighIns) setWeighIns(pulled.weighIns);
        if (pulled.meals)    setMeals(pulled.meals);
        if (pulled.badges)   setEarnedBdgs(pulled.badges);
        if (pulled.settings) {
          if (pulled.settings.mode)                 setMode(pulled.settings.mode);
          if (pulled.settings.tdee_adj != null)     setTdeeAdj(Number(pulled.settings.tdee_adj));
          if (pulled.settings.custom_kcal != null)  setCustomKcal(Number(pulled.settings.custom_kcal));
          if (pulled.settings.aggressive_cut_acked) setAggressiveCutAcked(true);
        }
        if (pulled.history) {
          setHist(pulled.history);
          const tod = todayKey();
          const snap = pulled.history.find(h => h.date === tod);
          if (snap) { setLogs(snap.logs || []); setWater(snap.water || 0); }
        }
        if (pulled.workouts) setWorkouts(pulled.workouts[todayKey()] || []);
      } catch(e) {}
      setSyncMsg("");
    }
  };

  // Agree to the current policy version (retroactive / re-consent flow, R2).
  const handleConsent = async () => {
    const meta = { ageConfirmedAt: null, healthConsentAt: Date.now(), policyVersion: POLICY_VERSION };
    const rec = { ...meta, version: POLICY_VERSION };
    await ss("health_consent", JSON.stringify(rec));
    setConsentInfo(rec);
    if (authUser?.id) await syncConsent(authUser.id, meta);
    setNeedsConsent(false);
  };

  const handleSignOut = async () => {
    if (sb()) { try { await sb().auth.signOut(); } catch(e) {} }
    const clearKeys = ["auth_state","auth_user","profile","meals","history","badges",
      "weighins","tdee_adj","target_kcal","aggressive_cut_acked","health_consent"];
    for (const k of clearKeys) await ss(k, "");
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("logs__") || key.startsWith("water__") ||
            key.startsWith("workouts__") || key.startsWith("mode__") ||
            key.startsWith("coach__")    || key.startsWith("streak_anim__") ||
            key.startsWith("sync_migrated__"))) {
          localStorage.removeItem(key);
        }
      }
    } catch(e) {}
    setAuthState("anonymous"); setAuthUser(null);
    setLogs([]); setWater(0); setMode("cut"); setProf(null);
    setHist([]); setMeals([...DEF_MEALS]); setWorkouts([]);
    setEarnedBdgs([]); setWeighIns([]); setTdeeAdj(0); setCustomKcal(null);
    setConsentInfo(null); setNeedsConsent(false);
    setShowSignOut(false);
    setView("dashboard");
  };

  // Assemble a portable copy of everything stored for this user (R4 — access/portability).
  const handleExport = () => {
    const workoutsByDate = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("workouts__")) {
          const v = localStorage.getItem(key);
          if (v) workoutsByDate[key.replace("workouts__", "")] = JSON.parse(v);
        }
      }
    } catch(e) {}
    const data = {
      app: "Fuel Log",
      exportedAt: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
      account: { name: authUser?.name || null, email: authUser?.email || null },
      consent: consentInfo || null,
      profile: prof || null,
      settings: { mode, tdeeAdj, customKcal, aggressiveCutAcked },
      weighIns,
      meals,
      badges: earnedBdgs,
      history: hist,
      workoutsByDate,
    };
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "fuel-log-export-" + todayKey() + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch(e) {}
  };

  // Permanently delete the account (R5). Worker cascades the delete; then wipe locally.
  const handleDeleteAccount = async () => {
    await deleteAccountRequest();   // throws on failure → AccountScreen shows the error
    await handleSignOut();          // clears local data, session, and returns to dashboard
  };

  useEffect(() => {
    if (!ready) return;
    const k    = todayKey();
    const tots = sumLogs(logs);
    const snap = { date:k, mode, kcal: Math.round(tots.kcal),
      protein: Math.round(tots.protein * 10) / 10,
      carbs:   Math.round(tots.carbs   * 10) / 10,
      fat:     Math.round(tots.fat     * 10) / 10,
      water, training: workouts.length > 0, logs:[...logs] };
    const upd = [...hist.filter(d => d.date !== k), snap]
      .sort((a, b) => a.date.localeCompare(b.date));
    setHist(upd);
    ss("history", JSON.stringify(upd));
    if (authState === "premium" && authUser?.id)
      syncHistory(authUser.id, upd).catch(() => {});
  }, [logs, water, workouts, mode, ready]); // eslint-disable-line

  const updateDay = async upd => {
    const nh = [...hist.filter(d => d.date !== upd.date), upd]
      .sort((a, b) => a.date.localeCompare(b.date));
    setHist(nh);
    await ss("history", JSON.stringify(nh));
    if (authState === "premium" && authUser?.id) {
      syncHistory(authUser.id, nh).catch(() => {});
      if (upd.logs) syncFoodLogs(authUser.id, upd.date, upd.logs).catch(() => {});
    }
  };

  const onWeighIn = async weight => {
    haptic();
    const entry = { date: todayKey(), weight };
    const updated = [...weighIns.filter(w => w.date !== entry.date), entry]
      .sort((a, b) => a.date.localeCompare(b.date));
    setWeighIns(updated);
    await ss("weighins", JSON.stringify(updated));
    if (authState === "premium" && authUser?.id)
      syncWeighIns(authUser.id, updated).catch(() => {});

    // Sync profile weight so targets recalculate immediately
    const updatedProf = { ...(prof || DEF_PROFILE), weight };
    await saveProf(updatedProf);

    // Run calibration whenever a new weigh-in arrives
    const base = Math.round((370 + 21.6 * (updatedProf.weight * (1 - updatedProf.bodyFat/100))) * 1.2);
    const result = runCalibration(hist, updated, base + tdeeAdj);
    if (result && Math.abs(result.adj) >= 50) {
      const newAdj = Math.max(-600, Math.min(600, tdeeAdj + result.adj));
      setTdeeAdj(newAdj);
      await ss("tdee_adj", String(newAdj));
      if (authState === "premium" && authUser?.id)
        syncSettings(authUser.id, mode, newAdj, customKcal, aggressiveCutAcked).catch(() => {});
    }
  };

  const p        = prof || DEF_PROFILE;
  const baseTDEE = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat/100))) * 1.2);
  const effectiveTDEE = baseTDEE + tdeeAdj;
  const effectiveMode = customKcal != null
    ? (customKcal > effectiveTDEE ? "bulk" : customKcal < effectiveTDEE ? "cut" : "maintain")
    : mode;

  const workoutKcal = workouts.reduce((s, w) => s + (w.kcal || 0), 0);
  const baseTargets = calcTargets(p, effectiveMode, workoutKcal, tdeeAdj);
  const targets = (() => {
    if (customKcal == null) return baseTargets;
    const safeMin = SAFE_MIN[p.sex || "male"] || 1400;
    const safeKcal = Math.max(safeMin, customKcal);
    // Floors hold; carbs absorb the change — never proportionally scale protein/fat
    // (the old bug dragged fat under its hormonal floor on a deep custom cut).
    const m = computeMacros(p, effectiveMode, safeKcal);
    return {
      ...baseTargets,
      kcal:    safeKcal,
      protein: m.protein,
      carbs:   m.carbs,
      fat:     m.fat,
      floorsExceedKcal:  m.floorsExceedKcal,
      safeMinApplied:    safeKcal > customKcal,
      customKcalApplied: true,
    };
  })();

  const totals    = sumLogs(logs);
  const remaining = targets.kcal - totals.kcal;
  const streak    = calcStreak(hist);

  if (!ready) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:A, fontSize:16, fontWeight:900, letterSpacing:"0.12em" }}>LOADING...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:BG, color:"#fff",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #6e6960; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select { background: #0b0d0b; color: #e6e1d7; }
        button { cursor: pointer; }
        button:disabled { cursor: not-allowed; }
        @keyframes blink_add { 0%{opacity:0.4;transform:scale(0.985)} 55%{opacity:1;transform:scale(1.015)} 100%{opacity:1;transform:scale(1)} }
      `}</style>

      {/* Streak celebration */}
      {streakAnim && <StreakCelebration anim={streakAnim} onDone={() => setStreakAnim(null)} />}

      {/* Auth modals */}
      {premiumGate && !showSignIn && (
        <PremiumModal
          feature={premiumGate}
          onUpgrade={() => setShowSignIn(true)}
          onDismiss={() => setPremiumGate(null)}/>
      )}
      {showSignIn && (
        <SignInModal
          onSuccess={handleSignInSuccess}
          onCancel={() => { setShowSignIn(false); setPremiumGate(null); }}/>
      )}
      {showSignOut && (
        <SignOutModal
          userName={authUser?.name}
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}/>
      )}
      {showLapsed && (
        <LapsedModal
          onRenew={() => { setShowLapsed(false); setShowSignIn(true); }}
          onDismiss={() => setShowLapsed(false)}/>
      )}
      {needsConsent && authState === "premium" && (
        <ConsentModal onConsent={handleConsent} onSignOut={handleSignOut}/>
      )}

      {/* Badge celebration */}
      {newBadge && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:24 }}>
          <div style={{ background:CARD, borderRadius:24, padding:"36px 28px", textAlign:"center",
            border:`1px solid ${A}44`, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:72, marginBottom:12 }}>{newBadge.b.emoji}</div>
            <div style={{ fontSize:11, color:A, letterSpacing:"0.12em", fontWeight:800, marginBottom:6 }}>
              {TIER_ICONS[newBadge.i]} {TIER_NAMES[newBadge.i].toUpperCase()} UNLOCKED
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:"#e6e1d7", marginBottom:6 }}>{newBadge.b.name}</div>
            <div style={{ fontSize:13, color:"#9b958b", marginBottom:24 }}>{TIERS[newBadge.i]} {newBadge.b.desc}</div>
            <button onClick={() => setNewBadge(null)}
              style={{ width:"100%", padding:"14px", background:A, color:"#0b0d0b",
                border:"none", borderRadius:12, fontSize:14, fontWeight:900, cursor:"pointer" }}>
              KEEP GOING 🔥
            </button>
          </div>
        </div>
      )}

      {view === "dashboard"    && <Dashboard logs={logs} totals={totals} targets={targets} remaining={remaining}
          water={water} setWater={saveWater}
          mode={effectiveMode} setMode={handleSetMode} setView={setView} removeLog={removeLog} updateLog={updateLog} addToQA={addToQA}
          hasProfile={!!prof} streak={streak} prof={prof}
          weighIns={weighIns} onWeighIn={onWeighIn} tdeeAdj={tdeeAdj} baseTDEE={baseTDEE}
          coachKey={coachKey}
          workouts={workouts} onAddWorkout={addWorkout} onRemoveWorkout={removeWorkout}
          customKcal={customKcal} onSetCustomKcal={saveCustomKcal} isCustomMode={customKcal != null}
          aggressiveCutAcked={aggressiveCutAcked} onAckAggressiveCut={handleAckAggressiveCut}
          authState={authState} authUser={authUser}
          onPremiumGate={feature => setPremiumGate(feature)}
          onSignOut={() => setShowSignOut(true)}
          isOnline={isOnline} syncMsg={syncMsg}/>}
      {view === "profile"      && <ProfileScreen   profile={prof || DEF_PROFILE} onSave={saveProf} onBack={() => setView("dashboard")} tdeeAdj={tdeeAdj} weighIns={weighIns} aggressiveCutAcked={aggressiveCutAcked}/>}
      {view === "ai"           && <AILog           onAdd={addLog} onBack={() => setView("dashboard")}/>}
      {view === "quick"        && <QuickAdd        onAdd={addLog} onBack={() => setView("dashboard")} meals={meals} setMeals={saveMeals} isPremium={authState === "premium"} onPremiumGate={feature => setPremiumGate(feature)}/>}
      {view === "search"       && <FoodSearch      onAdd={addLog} onBack={() => setView("dashboard")}/>}
      {view === "history"      && <ErrorBoundary><History history={hist} onBack={() => setView("dashboard")} onUpdateDay={updateDay} weighIns={weighIns} meals={meals} setMeals={saveMeals} isPremium={authState === "premium"} onPremiumGate={feature => setPremiumGate(feature)}/></ErrorBoundary>}
      {view === "achievements" && <Achievements    earnedBdgs={earnedBdgs} onBack={() => setView("dashboard")}/>}
      {view === "account"      && <AccountScreen    user={authUser} consentInfo={consentInfo}
          onBack={() => setView("dashboard")} onExport={handleExport}
          onSignOut={() => setShowSignOut(true)} onDelete={handleDeleteAccount}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
