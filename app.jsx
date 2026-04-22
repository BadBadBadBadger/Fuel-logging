// ─────────────────────────────────────────────────────────────
// FUEL LOG — src/app.jsx
// Build: npx babel src/app.jsx --presets @babel/preset-react -o app.js
// ─────────────────────────────────────────────────────────────

var exports = window.exports || {};
// ── Constants ─────────────────────────────────────────────────

const A = "#a3ff4b", BG = "#0b0d0b", CARD = "#111311", BD = "#1c201c";

const MODES = {
  cut:      { label:"CUT",      color:"#4b9fff", adj:-500 },
  maintain: { label:"MAINTAIN", color:"#a3ff4b", adj:0    },
  bulk:     { label:"BULK",     color:"#ff7b4b", adj:500  },
};

const ACTIVITY = {
  sedentary: { label:"Sedentary",         mult:1.2   },
  light:     { label:"Lightly Active",    mult:1.375 },
  moderate:  { label:"Moderately Active", mult:1.55  },
  active:    { label:"Very Active",       mult:1.725 },
  very:      { label:"Extra Active",      mult:1.9   },
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

const DEF_PROFILE = { weight:80, height:178, bodyFat:18, activity:"light" };

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

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

// ── Helpers ───────────────────────────────────────────────────

const todayKey = () => {
  const d = new Date();
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
  const d = new Date();
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

// ── Shared UI ─────────────────────────────────────────────────

const INP = {
  width:"100%", boxSizing:"border-box",
  background:"#0b0d0b", border:`1px solid ${BD}`,
  borderRadius:10, padding:"12px 14px",
  color:"#d8e8d0", fontSize:14,
  fontFamily:"inherit", outline:"none",
};

function Btn({ onClick, disabled, style, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      {children}
    </button>
  );
}

function BackHdr({ title, onBack, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22,
      position:"sticky", top:0, background:BG, zIndex:10, paddingTop:12, paddingBottom:12, marginTop:-12 }}>
      <Btn onClick={onBack} style={{ background:"#161a16", border:`1px solid ${BD}`,
        borderRadius:10, width:36, height:36, color:"#7a9a70", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</Btn>
      <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:A, letterSpacing:"0.06em", flex:1 }}>{title}</h2>
      {right}
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ textAlign:"center", background:"#0b0d0b", borderRadius:12, padding:"10px 6px" }}>
      <div style={{ fontSize:17, fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:10, color:"#3d4a38", marginTop:2, letterSpacing:"0.05em" }}>{label}</div>
    </div>
  );
}

function MBar({ label, value, target, color }) {
  const pct = Math.min(100, (value / target) * 100);
  const over = value > target;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ fontWeight:800, letterSpacing:"0.06em", color: over ? "#ff5555" : "#8aaa80" }}>{label}</span>
        <span style={{ color: over ? "#ff5555" : "#6a8a60" }}>{Math.round(value)}g / {target}g</span>
      </div>
      <div style={{ height:7, background:"#1a1a1a", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background: over ? "#ff5555" : color,
          borderRadius:99, transition:"width 0.4s" }}/>
      </div>
    </div>
  );
}

// ── Coach Card ────────────────────────────────────────────────

function CoachCard({ mode, totals, targets, streak, water }) {
  const [tip, setTip]           = useState("");
  const [refreshes, setRefreshes] = useState(0);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    sg("coach__" + todayKey()).then(v => {
      if (v) { const d = JSON.parse(v); setTip(d.tip || ""); setRefreshes(d.r || 0); }
    });
  }, []);

  useEffect(() => {
    if (!tip && !loading && totals.kcal >= 200) gen();
  }, [totals.kcal]); // eslint-disable-line

  const gen = async () => {
    if (loading || refreshes >= 3) return;
    setLoading(true);
    try {
      const prompt = `You are a supportive fitness coach. Today: ${mode} mode, ${Math.round(totals.kcal)}/${targets.kcal} kcal, protein ${Math.round(totals.protein)}g/${targets.protein}g, ${water}/8 glasses, ${streak} day streak.\nWrite exactly 3 sentences: 1) honest observation about today 2) specific food suggestion for tomorrow 3) genuine praise. Brief, personal, max one emoji per sentence.`;
      const res  = await fetch(AI_ENDPOINT, { method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:200,
          messages:[{ role:"user", content:prompt }] }) });
      const data = await res.json();
      const t    = (data.content || []).map(b => b.text || "").join("").trim();
      const r    = refreshes + 1;
      setTip(t); setRefreshes(r);
      await ss("coach__" + todayKey(), JSON.stringify({ tip:t, r }));
    } catch(e) {}
    setLoading(false);
  };

  if (totals.kcal < 200 && !tip) return null;
  return (
    <div style={{ background:CARD, border:`1px solid ${A}22`, borderRadius:20, padding:"14px 18px", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: tip ? 8 : 0 }}>
        <div style={{ fontSize:11, color:A, letterSpacing:"0.12em", fontWeight:800 }}>🤖 DAILY COACH</div>
        {refreshes < 3 && (
          <button onClick={gen} disabled={loading}
            style={{ background:"none", border:"none", color:"#556050", cursor:"pointer", fontSize:13, padding:"2px 6px" }}>
            {loading ? "..." : "↺"} <span style={{ fontSize:10, color:"#334a30" }}>{3 - refreshes}</span>
          </button>
        )}
      </div>
      {loading && !tip && <div style={{ fontSize:12, color:"#445040", marginTop:4 }}>Generating your tip...</div>}
      {tip && <div style={{ fontSize:13, color:"#8aaa80", lineHeight:1.7 }}>{tip}</div>}
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────

function ProfileScreen({ profile, onSave, onBack }) {
  const [f, setF]       = useState({ ...DEF_PROFILE, ...profile });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));
  const valid = Number(f.weight) > 0 && Number(f.height) > 0 &&
                Number(f.bodyFat) > 0 && Number(f.bodyFat) < 100;
  const prev = calcTargets(f, "cut", false);

  useEffect(() => {
    if (!valid) return;
    const t = setTimeout(() => {
      onSave(f);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
    return () => clearTimeout(t);
  }, [f.weight, f.height, f.bodyFat, f.activity]); // eslint-disable-line

  const row = (label, val, unit, color = "#d8e8d0") => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
      <span style={{ fontSize:12, color:"#556050" }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:700, color }}>{val}
        <span style={{ fontSize:11, color:"#445040", marginLeft:3 }}>{unit}</span>
      </span>
    </div>
  );

  return (
    <div style={{ padding:"20px 16px 50px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="MY PROFILE" onBack={onBack}
        right={saved && <span style={{ fontSize:11, color:A, fontWeight:700 }}>✓ SAVED</span>}/>
      <p style={{ color:"#556050", fontSize:13, lineHeight:1.6, marginBottom:20 }}>
        Targets use <strong style={{ color:"#7a9a70" }}>Katch-McArdle</strong>. Changes save automatically.
      </p>
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"20px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>BODY STATS</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          {[{ k:"weight", l:"WEIGHT", u:"kg" }, { k:"height", l:"HEIGHT", u:"cm" }].map(fl => (
            <div key={fl.k}>
              <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>
                {fl.l} <span style={{ color:"#445040" }}>({fl.u})</span>
              </div>
              <input type="number" min="0" value={f[fl.k]}
                onChange={e => set(fl.k, e.target.value)} style={INP}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:5 }}>
          BODY FAT <span style={{ color:"#445040" }}>(%)</span>
        </div>
        <input type="number" min="0" max="99" value={f.bodyFat}
          onChange={e => set("bodyFat", e.target.value)} style={{ ...INP, marginBottom:14 }}/>
        <div style={{ fontSize:10, color:A, letterSpacing:"0.1em", fontWeight:800, marginBottom:8 }}>ACTIVITY LEVEL</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {Object.entries(ACTIVITY).map(([k, v]) => (
            <Btn key={k} onClick={() => set("activity", k)}
              style={{ padding:"11px 14px",
                background: f.activity === k ? "#1a2a1a" : "#0b0d0b",
                border: `1px solid ${f.activity === k ? A + "44" : BD}`,
                borderRadius:10, textAlign:"left",
                color: f.activity === k ? A : "#556050",
                fontSize:13, fontWeight: f.activity === k ? 800 : 400 }}>
              {v.label} <span style={{ fontSize:11, color:"#334a30", marginLeft:6 }}>×{v.mult}</span>
            </Btn>
          ))}
        </div>
      </div>
      {valid && (
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"20px" }}>
          <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:12 }}>
            CALCULATED STATS
          </div>
          {row("Lean Body Mass",            prev.lbm,  "kg",       "#4b9fff")}
          {row("BMR",                       prev.bmr,  "kcal/day", "#ffb84b")}
          {row("TDEE (maintenance)",        prev.tdee, "kcal/day", A)}
          <div style={{ marginTop:14, fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:10 }}>
            TARGETS BY MODE
          </div>
          {[
            { mode:"cut",      label:"CUT",      color:"#4b9fff" },
            { mode:"maintain", label:"MAINTAIN", color:A         },
            { mode:"bulk",     label:"BULK",     color:"#ff7b4b" },
          ].map(({ mode, label, color }) => {
            const t = calcTargets(f, mode, false);
            return (
              <div key={mode} style={{ background:"#0b0d0b", borderRadius:10, padding:"10px 14px", marginBottom:6 }}>
                <div style={{ fontSize:11, fontWeight:900, color, letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[["KCAL","kcal",""],["P","protein","g"],["C","carbs","g"],["F","fat","g"]].map(([k, key, u]) => (
                    <div key={k} style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontSize:14, fontWeight:900, color }}>{t[key]}{u}</div>
                      <div style={{ fontSize:9, color:"#334a30", marginTop:1 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ fontSize:11, color:"#334a30", marginTop:8 }}>
            Training days add kcal based on your weight + session type.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Meal Form ─────────────────────────────────────────────────

function MealForm({ meal, onSave, onCancel }) {
  const blank = { name:"", kcal:"", protein:"", carbs:"", fat:"" };
  const [f, setF] = useState(meal ? {
    name: meal.name, kcal: String(meal.kcal), protein: String(meal.protein),
    carbs: String(meal.carbs), fat: String(meal.fat),
  } : blank);
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));
  const ok  = f.name.trim() && Number(f.kcal) > 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"flex-end", justifyContent:"center", zIndex:999 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background:CARD, borderRadius:"22px 22px 0 0", padding:"28px 20px 50px",
        width:"100%", maxWidth:500, border:`1px solid ${BD}`, borderBottom:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ margin:0, color:A, fontSize:16, fontWeight:900 }}>{meal ? "EDIT MEAL" : "ADD MEAL"}</h3>
          <Btn onClick={onCancel} style={{ background:"none", border:"none", color:"#556050", fontSize:24 }}>×</Btn>
        </div>
        <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.1em", fontWeight:800, marginBottom:6 }}>MEAL NAME</div>
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
        <Btn onClick={() => ok && onSave({
          name: f.name.trim(), kcal: Number(f.kcal) || 0,
          protein: Number(f.protein) || 0, carbs: Number(f.carbs) || 0, fat: Number(f.fat) || 0,
        })} disabled={!ok}
          style={{ width:"100%", padding:"15px",
            background: ok ? A : "#161a16", color: ok ? "#0b0d0b" : "#2e3a2c",
            border:"none", borderRadius:13, fontSize:14, fontWeight:900, letterSpacing:"0.08em" }}>
          {meal ? "SAVE CHANGES" : "ADD MEAL"}
        </Btn>
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
  const confColor2 = weighIns.length >= 28 ? A : weighIns.length >= 14 ? "#ffb84b" : "#556050";

  return (
    <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:4 }}>BODY WEIGHT</div>
          {todayEntry
            ? <div style={{ fontSize:22, fontWeight:900, color:"#d8e8d0" }}>{todayEntry.weight}<span style={{ fontSize:12, color:"#445040", marginLeft:4 }}>kg</span>
                {trend7 !== null && <span style={{ fontSize:12, color: trend7 <= 0 ? "#a3ff4b" : "#ff7b4b", marginLeft:10 }}>
                  {trend7 > 0 ? "+" : ""}{trend7}kg/wk
                </span>}
              </div>
            : <div style={{ fontSize:13, color:"#334a30", marginTop:2 }}>Not logged today</div>
          }
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:confColor2, letterSpacing:"0.08em", fontWeight:800 }}>{confidence.toUpperCase()}</div>
          {weeks >= 1
            ? <>
                <div style={{ fontSize:15, fontWeight:900, color:A, marginTop:2 }}>~{(baseTDEE + tdeeAdj).toLocaleString()} kcal</div>
                <div style={{ fontSize:10, color:"#445040", marginTop:1 }}>est. TDEE{tdeeAdj !== 0 && <span style={{ color: tdeeAdj > 0 ? A : "#ff7b4b" }}> {tdeeAdj > 0 ? "+" : ""}{tdeeAdj}</span>}</div>
              </>
            : <div style={{ fontSize:11, color:"#334a30", marginTop:4, maxWidth:100, textAlign:"right", lineHeight:1.4 }}>Log daily to calibrate your TDEE</div>
          }
        </div>
      </div>

      {!todayEntry && (
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input type="number" step="0.1" min="30" max="300" value={val}
            onChange={e => setVal(e.target.value)} placeholder="kg today..."
            style={{ ...INP, flex:1, padding:"10px 12px", fontSize:13 }}
            onKeyDown={e => e.key === "Enter" && Number(val) > 0 && (onWeighIn(Number(val)), setVal(""))}/>
          <Btn onClick={() => { if (Number(val) > 0) { onWeighIn(Number(val)); setVal(""); }}}
            disabled={!Number(val)}
            style={{ padding:"10px 18px", background: Number(val) > 0 ? A : "#161a16",
              color: Number(val) > 0 ? "#0b0d0b" : "#2e3a2c",
              border:"none", borderRadius:10, fontWeight:900, fontSize:13 }}>
            LOG
          </Btn>
        </div>
      )}

      <div style={{ fontSize:11, color:"#334a30", lineHeight:1.5 }}>
        {weeks < 1 && "Targets use the Katch-McArdle formula. Once you have a week of weigh-ins, they'll self-adjust to your real metabolism."}
        {weeks >= 1 && weeks < 2 && `🔄 ${confidence} — ${weighIns.length} weigh-ins so far. 2+ weeks unlocks calibration.`}
        {weeks >= 2 && tdeeAdj === 0 && "Formula TDEE matches your results — no adjustment needed yet."}
        {weeks >= 2 && tdeeAdj !== 0 && `Your real TDEE is ${tdeeAdj > 0 ? "higher" : "lower"} than the formula predicts. Targets adjusted accordingly.`}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────

function Dashboard({ logs, totals, targets, remaining, water, setWater,
  isTraining, setIsTraining, mode, setMode, setView, removeLog, addToQA,
  hasProfile, streak, session, onSession, sessionKcal, prof,
  weighIns, onWeighIn, tdeeAdj, baseTDEE }) {

  const over = totals.kcal > targets.kcal;
  const pct  = Math.min(100, (totals.kcal / targets.kcal) * 100);
  const mc   = MODES[mode].color;

  const [savedIds, setSavedIds]     = useState({});
  const [hevyMode, setHevyMode]     = useState(false);
  const [hevyText, setHevyText]     = useState("");
  const [hevyLoading, setHevyLoading] = useState(false);
  const [hevyResult, setHevyResult] = useState(null);

  const handleAddToQA = async log => {
    await addToQA(log);
    setSavedIds(p => ({ ...p, [log.id]:true }));
    setTimeout(() => setSavedIds(p => ({ ...p, [log.id]:false })), 1800);
  };

  const parseWorkout = async () => {
    if (!hevyText.trim() || hevyLoading) return;
    setHevyLoading(true); setHevyResult(null);
    try {
      const w = (prof || DEF_PROFILE).weight, bf = (prof || DEF_PROFILE).bodyFat;
      const res = await fetch(AI_ENDPOINT, { method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:200,
          messages:[{ role:"user", content:
            `Parse this workout log and estimate calories burned. User: ${w}kg bodyweight, ${bf}% body fat.\n\nWorkout:\n${hevyText}\n\nReturn ONLY valid JSON: {"estimatedKcal":number,"type":"legs|push|pull|fullbody|cardio","intensity":"light|moderate|heavy","summary":"brief 1 line description"}`
          }] }) });
      const data   = await res.json();
      const text   = (data.content || []).map(b => b.text || "").join("").trim();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setHevyResult(parsed);
      onSession({ ...session, type: parsed.type || session.type,
        intensity: parsed.intensity || session.intensity, hevyKcal: parsed.estimatedKcal });
    } catch(e) {
      setHevyResult({ error:"Parse failed — requires Cloudflare Worker to be set up." });
    }
    setHevyLoading(false);
  };

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:A, letterSpacing:"-0.02em", lineHeight:1 }}>FUEL LOG</h1>
          <p style={{ margin:"4px 0 0", fontSize:12, color:"#445040", letterSpacing:"0.06em" }}>
            {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"short" }).toUpperCase()}
          </p>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {streak > 0 && (
            <div style={{ padding:"7px 10px", background:"#131a11", border:`1px solid ${BD}`,
              borderRadius:10, fontSize:13, fontWeight:900, color:A }}>🔥{streak}</div>
          )}
          <Btn onClick={() => setView("profile")} style={{ width:34, height:34, background:"#131a11",
            border:`1px solid ${BD}`, borderRadius:10, color:"#556050", fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center" }}>⚙️</Btn>
          <Btn onClick={() => setView("history")} style={{ width:34, height:34, background:"#131a11",
            border:`1px solid ${BD}`, borderRadius:10, color:"#556050", fontSize:15,
            display:"flex", alignItems:"center", justifyContent:"center" }}>📊</Btn>
          <Btn onClick={() => setView("achievements")} style={{ width:34, height:34, background:"#131a11",
            border:`1px solid ${BD}`, borderRadius:10, color:"#556050", fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center" }}>🏆</Btn>
        </div>
      </div>

      {/* Mode + training */}
      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        {Object.entries(MODES).map(([k, v]) => (
          <Btn key={k} onClick={() => setMode(k)}
            style={{ flex:1, padding:"9px 4px",
              background: mode === k ? v.color + "22" : "#131a11",
              color: mode === k ? v.color : "#445040",
              border: `1px solid ${mode === k ? v.color + "55" : BD}`,
              borderRadius:10, fontSize:11, fontWeight:900, letterSpacing:"0.06em" }}>
            {v.label}
          </Btn>
        ))}
        <Btn onClick={() => setIsTraining(!isTraining)}
          style={{ padding:"9px 12px",
            background: isTraining ? A + "22" : "#131a11",
            color: isTraining ? A : "#445040",
            border: `1px solid ${isTraining ? A + "44" : BD}`,
            borderRadius:10, fontSize:11, fontWeight:900, flexShrink:0 }}>
          {isTraining ? "⚡" : "💤"}
        </Btn>
      </div>

      {/* Session selector */}
      {isTraining && (
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
          <div style={{ fontSize:10, color:"#445040", letterSpacing:"0.1em", fontWeight:800, marginBottom:10 }}>SESSION</div>
          {!hevyMode ? (
            <>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
                <select value={session.type}
                  onChange={e => onSession({ ...session, type:e.target.value, hevyKcal:null })}
                  style={{ ...INP, flex:"none", width:"auto", padding:"7px 10px", fontSize:12 }}>
                  {SESS_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <input type="number" min="10" max="180" value={session.duration}
                  onChange={e => onSession({ ...session, duration: parseInt(e.target.value) || 45, hevyKcal:null })}
                  style={{ ...INP, width:56, padding:"7px 8px", textAlign:"center", fontSize:12 }}/>
                <span style={{ fontSize:11, color:"#445040" }}>min ·</span>
                <select value={session.intensity}
                  onChange={e => onSession({ ...session, intensity:e.target.value, hevyKcal:null })}
                  style={{ ...INP, flex:"none", width:"auto", padding:"7px 10px", fontSize:12 }}>
                  {SESS_INT.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
                </select>
                <span style={{ marginLeft:"auto", fontSize:14, fontWeight:900, color:A }}>{sessionKcal} kcal</span>
              </div>
              <button onClick={() => setHevyMode(true)}
                style={{ width:"100%", padding:"9px", background:"#0b0d0b",
                  border:`1px solid ${A}33`, borderRadius:10, color:A,
                  fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:"0.06em" }}>
                📋 Paste workout log instead
              </button>
            </>
          ) : (
            <>
              <textarea value={hevyText} onChange={e => setHevyText(e.target.value)} rows={5}
                placeholder={"Paste your workout log here...\n\nE.g.:\nBack Squat 4×5 @ 100kg\nRomanian Deadlift 3×10 @ 80kg\nLeg Press 3×12 @ 120kg"}
                style={{ width:"100%", boxSizing:"border-box", background:"#0b0d0b",
                  border:`1px solid ${BD}`, borderRadius:10, padding:"10px 12px",
                  color:"#d8e8d0", fontSize:12, resize:"none", fontFamily:"inherit",
                  outline:"none", lineHeight:1.6, marginBottom:8 }}/>
              <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                <button onClick={parseWorkout} disabled={hevyLoading || !hevyText.trim()}
                  style={{ flex:1, padding:"10px",
                    background: hevyText.trim() && !hevyLoading ? A : "#161a16",
                    color: hevyText.trim() && !hevyLoading ? "#0b0d0b" : "#2e3a2c",
                    border:"none", borderRadius:10, fontSize:12, fontWeight:900,
                    cursor: hevyText.trim() && !hevyLoading ? "pointer" : "not-allowed",
                    letterSpacing:"0.07em" }}>
                  {hevyLoading ? "PARSING..." : "🤖 PARSE SESSION"}
                </button>
                <button onClick={() => { setHevyMode(false); setHevyText(""); setHevyResult(null); onSession({ ...session, hevyKcal:null }); }}
                  style={{ padding:"10px 14px", background:"none", border:`1px solid ${BD}`,
                    borderRadius:10, color:"#445040", fontSize:12, cursor:"pointer" }}>
                  ← Manual
                </button>
              </div>
              {hevyResult && !hevyResult.error && (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:"#0a1a0a", borderRadius:8, padding:"8px 12px" }}>
                  <span style={{ fontSize:12, color:"#6a9a60", flex:1 }}>{hevyResult.summary}</span>
                  <span style={{ fontSize:15, fontWeight:900, color:A, marginLeft:10 }}>{hevyResult.estimatedKcal} kcal</span>
                </div>
              )}
              {hevyResult && hevyResult.error && (
                <div style={{ fontSize:12, color:"#ff7070", marginTop:4 }}>{hevyResult.error}</div>
              )}
            </>
          )}
        </div>
      )}

      {!hasProfile && (
        <Btn onClick={() => setView("profile")}
          style={{ width:"100%", padding:"11px", background:"#131a11",
            border:`1px solid ${A}33`, borderRadius:12, color:A,
            fontSize:12, fontWeight:700, marginBottom:12, letterSpacing:"0.06em" }}>
          👤 Set body stats for personalised targets →
        </Btn>
      )}

      {/* Calorie card */}
      <div style={{ background:CARD, borderRadius:22,
        border:`1px solid ${over ? "#ff555328" : "#1c241c"}`, padding:"20px 22px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:11, color:mc, letterSpacing:"0.12em", fontWeight:800 }}>
            {MODES[mode].label}{isTraining ? " · ⚡" : ""}
          </div>
          <div style={{ fontSize:11, color:"#2e3a2c" }}>TARGET {targets.kcal.toLocaleString()} kcal</div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", marginBottom:4 }}>CONSUMED</div>
            <div style={{ fontSize:42, fontWeight:900, color: over ? "#ff5555" : "#e8f0e0",
              lineHeight:1, letterSpacing:"-0.03em" }}>
              {Math.round(totals.kcal).toLocaleString()}
              <span style={{ fontSize:14, color:"#445040", fontWeight:400, marginLeft:5 }}>kcal</span>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", marginBottom:4 }}>
              {over ? "OVER BY" : "REMAINING"}
            </div>
            <div style={{ fontSize:30, fontWeight:900, color: over ? "#ff5555" : mc, lineHeight:1 }}>
              {Math.abs(Math.round(remaining)).toLocaleString()}
              <span style={{ fontSize:12, color: over ? "#aa3333" : "#6a9a30", fontWeight:400, marginLeft:4 }}>kcal</span>
            </div>
          </div>
        </div>
        <div style={{ height:10, background:"#161a16", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`,
            background: over ? "#ff5555" : `linear-gradient(90deg,${mc}88,${mc})`,
            borderRadius:99, transition:"width 0.5s" }}/>
        </div>
      </div>

      {/* Macros */}
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"18px 20px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>MACROS</div>
        <MBar label="PROTEIN" value={totals.protein} target={targets.protein} color="#4b9fff"/>
        <MBar label="CARBS"   value={totals.carbs}   target={targets.carbs}   color="#ffb84b"/>
        <MBar label="FAT"     value={totals.fat}      target={targets.fat}     color="#ff7b4b"/>
      </div>

      {/* Coach tip */}
      <CoachCard mode={mode} totals={totals} targets={targets} streak={streak} water={water}/>

      {/* Water */}
      <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 20px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:3 }}>WATER</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#4b9fff" }}>
              {water}<span style={{ fontSize:13, color:"#2a4060", fontWeight:400, marginLeft:5 }}>/ 8 glasses</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={() => setWater(Math.max(0, water - 1))}
              style={{ width:36, height:36, borderRadius:10, background:"#131826",
                border:"1px solid #1e2a3a", color:"#4b9fff", fontSize:20,
                display:"flex", alignItems:"center", justifyContent:"center" }}>−</Btn>
            <Btn onClick={() => setWater(water + 1)}
              style={{ width:36, height:36, borderRadius:10, background:"#0f1c2e",
                border:"1px solid #2a4a7a", color:"#4b9fff", fontSize:20,
                display:"flex", alignItems:"center", justifyContent:"center" }}>+</Btn>
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
          { e:"🤖", l:"AI LOG",    s:"describe it",   v:"ai"     },
          { e:"⚡",  l:"QUICK ADD", s:"preset meals",  v:"quick"  },
          { e:"🔍", l:"SEARCH",    s:"food database",  v:"search" },
        ].map(b => (
          <Btn key={b.v} onClick={() => setView(b.v)}
            style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:16, padding:"16px 8px", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:5 }}>{b.e}</div>
            <div style={{ fontSize:11, fontWeight:900, color:A, letterSpacing:"0.07em" }}>{b.l}</div>
            <div style={{ fontSize:10, color:"#334030", marginTop:3 }}>{b.s}</div>
          </Btn>
        ))}
      </div>

      {/* Log list */}
      {logs.length > 0 ? (
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, overflow:"hidden" }}>
          <div style={{ padding:"13px 20px 11px", fontSize:11, color:"#445040",
            letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}` }}>
            TODAY'S LOG · {logs.length} ITEM{logs.length !== 1 ? "S" : ""}
          </div>
          {[...logs].reverse().map((log, i) => (
            <div key={log.id} style={{ display:"flex", alignItems:"center", padding:"13px 16px",
              borderBottom: i < logs.length - 1 ? `1px solid ${BD}` : "none", gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:"#d8e8d0",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.name}</div>
                <div style={{ fontSize:11, color:"#3d4a38", marginTop:3 }}>
                  {log.time} · P:{log.protein}g C:{log.carbs}g F:{log.fat}g
                </div>
              </div>
              <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{Math.round(log.kcal)}</span>
              <button onClick={() => handleAddToQA(log)}
                style={{ flexShrink:0, padding:"7px 12px",
                  background: savedIds[log.id] ? A + "22" : "#131a11",
                  border: `1px solid ${savedIds[log.id] ? A + "66" : "#2a4a28"}`,
                  borderRadius:10, color: savedIds[log.id] ? A : "#4a8a40",
                  fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {savedIds[log.id] ? "✓" : "⚡"}
              </button>
              <button onClick={() => removeLog(log.id)}
                style={{ flexShrink:0, width:32, height:32, background:"#1a0d0d",
                  border:"1px solid #3a1a1a", borderRadius:10, color:"#884444",
                  fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"#2a3228", fontSize:14 }}>
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
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3&fields=product_name,nutriments,serving_size`
    );
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
            <div style={{ fontSize:13, fontWeight:600, color:"#d8e8d0", cursor:"pointer" }}
              onClick={() => setEditing(true)}>
              {item.name} <span style={{ fontSize:11, color:"#334a30" }}>✏️</span>
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
      <div style={{ fontSize:11, color:"#3d4a38" }}>
        P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g
      </div>
      {item.reasoning && !editing && (
        <div style={{ fontSize:11, color:"#334a30", marginTop:5, lineHeight:1.5, fontStyle:"italic" }}>
          {item.reasoning}
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

  const totals = items ? items.reduce((a, it) => ({
    kcal:    a.kcal    + it.kcal,
    protein: a.protein + it.protein,
    carbs:   a.carbs   + it.carbs,
    fat:     a.fat     + it.fat,
  }), { kcal:0, protein:0, carbs:0, fat:0 }) : null;

  const avgConf = items ? Math.round(items.reduce((a, it) => a + it.confidence, 0) / items.length) : 0;

  const estimate = async () => {
    if (!desc.trim()) return;
    setLoading(true); setError(""); setItems(null); setLoggedAll(false);
    try {
      // Fire AI and OFT searches in parallel
      const aiPromise = fetch(AI_ENDPOINT, { method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{ role:"user", content: AI_PROMPT(desc) }] })
      }).then(r => r.json());

      const aiData = await aiPromise;
      const text   = (aiData.content || []).map(b => b.text || "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
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
      const res  = await fetch(AI_ENDPOINT, { method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:300,
          messages:[{ role:"user", content: AI_REESTIMATE_PROMPT(newName) }] })
      });
      const data = await res.json();
      const text = (data.content || []).map(b => b.text || "").join("");
      const updated = JSON.parse(text.replace(/```json|```/g, "").trim());

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

  const logItem = (item) => {
    onAdd({ name: item.name, kcal: Math.round(item.kcal),
      protein: Math.round(item.protein * 10) / 10,
      carbs:   Math.round(item.carbs   * 10) / 10,
      fat:     Math.round(item.fat     * 10) / 10 });
  };

  return (
    <div style={{ padding:"20px 16px 40px", maxWidth:500, margin:"0 auto" }}>
      <BackHdr title="AI MEAL LOG" onBack={onBack}/>
      <p style={{ color:"#556050", fontSize:13, lineHeight:1.6, marginBottom:16 }}>
        Describe your meal — I'll break it down item by item with confidence scores.
        Tap any item to correct it and re-estimate.
      </p>

      <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
        placeholder={"e.g. 'GDK large mixed meat meal with small chips and Coke Zero, bowl of Magic Spoon cereal, Pret chicken bacon sandwich'"}
        style={{ width:"100%", boxSizing:"border-box", background:CARD,
          border:`1px solid ${BD}`, borderRadius:14, padding:"14px 16px",
          color:"#d8e8d0", fontSize:14, resize:"none", fontFamily:"inherit",
          outline:"none", lineHeight:1.6 }}/>

      <button onClick={estimate} disabled={loading || !desc.trim()}
        style={{ width:"100%", marginTop:12, padding:"15px",
          background: loading || !desc.trim() ? "#161a16" : A,
          color:      loading || !desc.trim() ? "#2e3a2c" : "#0b0d0b",
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
            <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.1em", fontWeight:800 }}>
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

          <div style={{ fontSize:11, color:"#334a30", textAlign:"center", marginBottom:12 }}>
            or tap individual items to log them separately ↑
          </div>

          {items.map((item, i) => (
            <button key={i} onClick={() => logItem(item)}
              style={{ width:"100%", padding:"10px 14px", background:"#131a11",
                border:`1px solid ${BD}`, borderRadius:10, color:"#8aaa80",
                fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:6,
                textAlign:"left", display:"flex", justifyContent:"space-between" }}>
              <span>+ {item.name}</span>
              <span style={{ color:A, fontWeight:900 }}>{Math.round(item.kcal)} kcal</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Quick Add ─────────────────────────────────────────────────

function QuickAdd({ onAdd, onBack, meals, setMeals }) {
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
      {modal !== null && <MealForm meal={modal.meal} onSave={handleSave} onCancel={() => setModal(null)}/>}
      <BackHdr title="QUICK ADD" onBack={onBack}/>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search meals..." style={{ ...INP, flex:1, padding:"12px 16px" }}/>
        <Btn onClick={() => setModal({ meal:null, index:null })}
          style={{ padding:"12px 18px", background:"#131a11", border:`1px solid ${A}44`,
            borderRadius:12, color:A, fontWeight:900, fontSize:16, flexShrink:0 }}>＋</Btn>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(m => (
          <div key={m._i} style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14,
            padding:"13px 14px", display:"flex", alignItems:"center", gap:8 }}>
            <Btn onClick={() => { onAdd(m); onBack(); }}
              style={{ flex:1, background:"none", border:"none", textAlign:"left", padding:0, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#d8e8d0",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
              <div style={{ fontSize:11, color:"#3d4a38", marginTop:3 }}>
                P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g
              </div>
            </Btn>
            <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{m.kcal}</span>
            <Btn onClick={() => setModal({ meal:m, index:m._i })}
              style={{ background:"none", border:"none", fontSize:15, padding:"4px 6px", flexShrink:0 }}>✏️</Btn>
            <Btn onClick={() => save(meals.filter((_, i) => i !== m._i))}
              style={{ background:"none", border:"none", fontSize:15, padding:"4px 6px", flexShrink:0 }}>🗑️</Btn>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", color:"#2a3228", padding:"30px 0", fontSize:14 }}>No meals found</div>
        )}
      </div>
      <Btn onClick={() => save([...DEF_MEALS])}
        style={{ marginTop:16, width:"100%", padding:"11px", background:"none",
          border:`1px dashed #1a2a18`, borderRadius:12, color:"#2a3a28", fontSize:12, fontFamily:"inherit" }}>
        ↩ Reset to defaults
      </Btn>
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
      <p style={{ color:"#556050", fontSize:13, lineHeight:1.6, marginBottom:16 }}>
        Search millions of products via Open Food Facts.
      </p>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="e.g. 'Grenade bar', 'Weetabix'..."
          style={{ ...INP, flex:1, padding:"13px 16px" }}/>
        <Btn onClick={search} disabled={loading || !q.trim()}
          style={{ padding:"13px 16px",
            background: q.trim() && !loading ? A : "#161a16",
            color:      q.trim() && !loading ? "#0b0d0b" : "#2e3a2c",
            border:"none", borderRadius:12, fontWeight:900, fontSize:13,
            flexShrink:0, letterSpacing:"0.06em" }}>
          {loading ? "..." : "SEARCH"}
        </Btn>
      </div>
      {loading && <div style={{ textAlign:"center", color:"#445040", padding:24, fontSize:14 }}>🔍 Searching...</div>}
      {error   && <p style={{ color:"#ff5555", fontSize:13, textAlign:"center", marginBottom:10 }}>{error}</p>}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {results.map((r, i) => (
          <Btn key={i} onClick={() => { onAdd(r); onBack(); }}
            style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:14, padding:"14px 16px",
              textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
            <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#d8e8d0",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
              <div style={{ fontSize:11, color:"#3d4a38", marginTop:3 }}>
                {r.notes} · P:{r.protein}g · C:{r.carbs}g · F:{r.fat}g
              </div>
            </div>
            <span style={{ fontSize:16, fontWeight:900, color:A, flexShrink:0 }}>{r.kcal}</span>
          </Btn>
        ))}
      </div>
      {done && !results.length && !loading && !error && (
        <div style={{ textAlign:"center", color:"#2a3228", padding:"30px 0" }}>No results</div>
      )}
    </div>
  );
}

// ── History ───────────────────────────────────────────────────

function History({ history, onBack, onUpdateDay }) {
  const RANGES = ["DAY","W","30D","3M","1Y","ALL"];
  const RLBL   = { DAY:"Day", W:"7 Days", "30D":"30 Days", "3M":"3 Months", "1Y":"Year", ALL:"All Time" };
  const MM = {
    KCAL:    { key:"kcal",    label:"Kcal",    color:"#a3ff4b", unit:"" },
    PROTEIN: { key:"protein", label:"Protein", color:"#4b9fff", unit:"g" },
    CARBS:   { key:"carbs",   label:"Carbs",   color:"#ffb84b", unit:"g" },
    FAT:     { key:"fat",     label:"Fat",     color:"#ff7b4b", unit:"g" },
  };

  const [range,     setRange]     = useState("30D");
  const [metrics,   setMetrics]   = useState(["KCAL"]);
  const [chartType, setChartType] = useState("line");
  const [dayIdx,    setDayIdx]    = useState(Math.max(0, history.length - 1));
  const [addCtx,    setAddCtx]    = useState(null);

  const toggleM = m => setMetrics(p =>
    p.includes(m) ? (p.length > 1 ? p.filter(x => x !== m) : p) : [...p, m]);

  const filtered = (() => {
    if (range === "DAY") return history;
    const days = { W:7, "30D":30, "3M":90, "1Y":365, ALL:99999 }[range];
    const cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    return history.filter(d => d.date >= cutoff);
  })();

  const chartData = filtered.map(d => ({
    date: fmtShort(d.date), KCAL: d.kcal,
    PROTEIN: Math.round(d.protein), CARBS: Math.round(d.carbs), FAT: Math.round(d.fat),
  }));

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

  return (
    <div style={{ padding:"20px 16px 50px", maxWidth:500, margin:"0 auto" }}>
      {addCtx === "quick" && (
        <QuickAdd meals={DEF_MEALS} setMeals={() => {}}
          onAdd={e => { patch({ logs:[...(day.logs||[]), { ...e, id:Date.now(), time:new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }] }); setAddCtx(null); }}
          onBack={() => setAddCtx(null)}/>
      )}
      {addCtx === "manual" && (
        <MealForm
          onSave={e => { patch({ logs:[...(day.logs||[]), { ...e, id:Date.now(), time:new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }] }); setAddCtx(null); }}
          onCancel={() => setAddCtx(null)}/>
      )}
      <BackHdr title="HISTORY" onBack={onBack} right={
        history.length > 0 && (
          <Btn onClick={exportCSV}
            style={{ padding:"8px 14px", background:"#131a11", border:`1px solid ${A}44`,
              borderRadius:10, color:A, fontSize:11, fontWeight:900, cursor:"pointer", letterSpacing:"0.07em" }}>
            📥 CSV
          </Btn>
        )
      }/>

      {history.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"#2a3228" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
          <div style={{ fontSize:14 }}>No history yet — days auto-save as you log.</div>
        </div>
      )}

      {history.length > 0 && (
        <>
          <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
            {RANGES.map(r => (
              <Btn key={r} onClick={() => setRange(r)}
                style={{ padding:"7px 14px",
                  background: range === r ? A : "#131a11",
                  color:      range === r ? "#0b0d0b" : "#556050",
                  border: `1px solid ${range === r ? A : BD}`,
                  borderRadius:99, fontSize:12, fontWeight:900, flexShrink:0 }}>
                {RLBL[r]}
              </Btn>
            ))}
          </div>

          {range === "DAY" && (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                marginBottom:18, background:CARD, border:`1px solid ${BD}`, borderRadius:16, padding:"12px 16px" }}>
                <Btn onClick={() => setDayIdx(i => Math.max(0, i - 1))} disabled={dayIdx === 0}
                  style={{ background:"none", border:"none",
                    color: dayIdx === 0 ? "#2a3028" : "#7a9a70", fontSize:24, padding:"0 6px", lineHeight:1 }}>‹</Btn>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#d8e8d0" }}>{day ? fmtFull(day.date) : "—"}</div>
                  {day && (
                    <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:5 }}>
                      {day.mode && (
                        <span style={{ fontSize:10, fontWeight:900, color: MODES[day.mode]?.color || A,
                          background: (MODES[day.mode]?.color || A) + "22", padding:"2px 8px", borderRadius:99 }}>
                          {MODES[day.mode]?.label}
                        </span>
                      )}
                      <Btn onClick={() => patch({ training: !day.training })}
                        style={{ fontSize:10, fontWeight:900, padding:"2px 8px",
                          background: day.training ? A + "22" : "#131a11",
                          color: day.training ? A : "#445040",
                          border: `1px solid ${day.training ? A + "44" : BD}`, borderRadius:99 }}>
                        {day.training ? "⚡ TRAINING" : "💤 REST"}
                      </Btn>
                    </div>
                  )}
                </div>
                <Btn onClick={() => setDayIdx(i => Math.min(history.length - 1, i + 1))}
                  disabled={dayIdx === history.length - 1}
                  style={{ background:"none", border:"none",
                    color: dayIdx === history.length - 1 ? "#2a3028" : "#7a9a70",
                    fontSize:24, padding:"0 6px", lineHeight:1 }}>›</Btn>
              </div>

              {day && dayTots && (
                <>
                  <div style={{ textAlign:"center", marginBottom:20 }}>
                    <div style={{ fontSize:56, fontWeight:900, color:A, lineHeight:1, letterSpacing:"-0.03em" }}>
                      {Math.round(dayTots.kcal).toLocaleString()}
                    </div>
                    <div style={{ fontSize:14, color:"#445040", marginTop:4, letterSpacing:"0.12em" }}>CALORIES</div>
                    <div style={{ fontSize:12, marginTop:6, color:"#445040" }}>
                      P:{Math.round(dayTots.protein)}g · C:{Math.round(dayTots.carbs)}g · F:{Math.round(dayTots.fat)}g
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"20px", marginBottom:14 }}>
                    <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:14 }}>
                      MACRO BREAKDOWN
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                          dataKey="value" paddingAngle={3}>
                          {pieData.map((e, i) => <Cell key={i} fill={e.color}/>)}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v + "g", n]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:8 }}>
                      {pieData.map(p => (
                        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <div style={{ width:9, height:9, borderRadius:"50%", background:p.color }}/>
                          <span style={{ fontSize:11, color:"#8aaa80" }}>
                            {p.name}: <strong style={{ color:"#d8e8d0" }}>{p.value}g</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:16,
                    padding:"14px 18px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:12, color:"#445040", letterSpacing:"0.1em", fontWeight:800 }}>WATER </span>
                      <span style={{ fontSize:14, color:"#4b9fff", fontWeight:900 }}>{day.water} / 8</span>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn onClick={() => patch({ water: Math.max(0, (day.water || 0) - 1) })}
                        style={{ width:32, height:32, borderRadius:8, background:"#131826",
                          border:"1px solid #1e2a3a", color:"#4b9fff", fontSize:18,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>−</Btn>
                      <Btn onClick={() => patch({ water: (day.water || 0) + 1 })}
                        style={{ width:32, height:32, borderRadius:8, background:"#0f1c2e",
                          border:"1px solid #2a4a7a", color:"#4b9fff", fontSize:18,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>+</Btn>
                    </div>
                  </div>

                  <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, overflow:"hidden", marginBottom:12 }}>
                    <div style={{ padding:"12px 18px 10px", fontSize:11, color:"#445040",
                      letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}`,
                      display:"flex", justifyContent:"space-between" }}>
                      <span>FOODS · {(day.logs || []).length} ITEMS</span>
                      <span style={{ fontSize:10, color:"#334a30" }}>× to remove</span>
                    </div>
                    {(day.logs || []).length === 0 && (
                      <div style={{ padding:"18px", textAlign:"center", color:"#2a3228", fontSize:13 }}>No foods logged</div>
                    )}
                    {(day.logs || []).map((log, i) => (
                      <div key={log.id || i} style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", padding:"11px 16px",
                        borderBottom: i < day.logs.length - 1 ? `1px solid ${BD}` : "none" }}>
                        <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
                          <div style={{ fontSize:13, color:"#d8e8d0", overflow:"hidden",
                            textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.name}</div>
                          <div style={{ fontSize:11, color:"#3d4a38", marginTop:2 }}>
                            P:{log.protein}g C:{log.carbs}g F:{log.fat}g
                          </div>
                        </div>
                        <span style={{ fontSize:15, fontWeight:900, color:A, flexShrink:0 }}>{Math.round(log.kcal)}</span>
                        <Btn onClick={() => patch({ logs: (day.logs || []).filter(l => l.id !== log.id && l !== log) })}
                          style={{ background:"none", border:"none", color:"#2a3028", fontSize:18, padding:"2px 10px" }}>×</Btn>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <Btn onClick={() => setAddCtx("quick")}
                      style={{ flex:1, padding:"11px", background:"#131a11",
                        border:`1px solid ${A}33`, borderRadius:12, color:A, fontSize:12, fontWeight:900, letterSpacing:"0.07em" }}>
                      ⚡ QUICK ADD
                    </Btn>
                    <Btn onClick={() => setAddCtx("manual")}
                      style={{ flex:1, padding:"11px", background:"#131a11",
                        border:`1px solid ${A}33`, borderRadius:12, color:A, fontSize:12, fontWeight:900, letterSpacing:"0.07em" }}>
                      ＋ MANUAL
                    </Btn>
                  </div>
                </>
              )}
            </>
          )}

          {range !== "DAY" && filtered.length > 0 && (
            <>
              <div style={{ display:"flex", gap:7, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
                {Object.entries(MM).map(([k, m]) => (
                  <Btn key={k} onClick={() => toggleM(k)}
                    style={{ padding:"6px 13px",
                      background: metrics.includes(k) ? m.color + "22" : "#131a11",
                      color:      metrics.includes(k) ? m.color       : "#445040",
                      border: `1px solid ${metrics.includes(k) ? m.color + "55" : BD}`,
                      borderRadius:99, fontSize:11, fontWeight:900 }}>
                    {m.label}
                  </Btn>
                ))}
                <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                  {[["line","📈"],["bar","📊"]].map(([t, e]) => (
                    <Btn key={t} onClick={() => setChartType(t)}
                      style={{ padding:"6px 12px",
                        background: chartType === t ? "#1e2a1e" : "#131a11",
                        color:      chartType === t ? "#d8e8d0" : "#445040",
                        border: `1px solid ${chartType === t ? "#334a33" : BD}`, borderRadius:8, fontSize:12 }}>
                      {e}
                    </Btn>
                  ))}
                </div>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:20, padding:"16px 8px 8px", marginBottom:16 }}>
                <ResponsiveContainer width="100%" height={200}>
                  {chartType === "line" ? (
                    <LineChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                      <XAxis dataKey="date" tick={{ fill:"#3d4a38", fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:"#3d4a38", fontSize:10 }} axisLine={false} tickLine={false}/>
                      <Tooltip/>
                      {metrics.map(m => <Line key={m} type="monotone" dataKey={m} stroke={MM[m].color} strokeWidth={2.5} dot={false} name={m}/>)}
                    </LineChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                      <XAxis dataKey="date" tick={{ fill:"#3d4a38", fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:"#3d4a38", fontSize:10 }} axisLine={false} tickLine={false}/>
                      <Tooltip/>
                      {metrics.map(m => <Bar key={m} dataKey={m} fill={MM[m].color} radius={[4,4,0,0]} name={m} maxBarSize={28}/>)}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, padding:"16px 18px", marginBottom:16 }}>
                <div style={{ fontSize:11, color:"#445040", letterSpacing:"0.12em", fontWeight:800, marginBottom:12 }}>
                  {RLBL[range].toUpperCase()} AVERAGES · {filtered.length} DAYS
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {Object.entries(MM).map(([k, m]) => {
                    const avg = filtered.length
                      ? filtered.reduce((a, d) => a + (d[m.key] || 0), 0) / filtered.length : 0;
                    return <Chip key={k} label={m.label.toUpperCase()} value={Math.round(avg) + m.unit} color={m.color}/>;
                  })}
                </div>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:18, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px 10px", fontSize:11, color:"#445040",
                  letterSpacing:"0.12em", fontWeight:800, borderBottom:`1px solid ${BD}` }}>
                  {filtered.length} DAYS LOGGED
                </div>
                {[...filtered].reverse().map((d, i) => (
                  <div key={d.date} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"12px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${BD}` : "none", cursor:"pointer" }}
                    onClick={() => { setRange("DAY"); setDayIdx(history.findIndex(h => h.date === d.date)); }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#d8e8d0" }}>
                        {fmtFull(d.date)}
                        {d.mode && <span style={{ fontSize:10, fontWeight:900, color: MODES[d.mode]?.color || A, marginLeft:8 }}>{MODES[d.mode]?.label}</span>}
                        {d.training && <span style={{ fontSize:10, color:A, marginLeft:6 }}>⚡</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#3d4a38", marginTop:2 }}>
                        P:{Math.round(d.protein)}g · C:{Math.round(d.carbs)}g · F:{Math.round(d.fat)}g · 💧{d.water}
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16, fontWeight:900, color:A }}>{Math.round(d.kcal)}</span>
                      <span style={{ fontSize:12, color:"#334a30" }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {range !== "DAY" && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#2a3228", fontSize:14 }}>
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
      <p style={{ color:"#556050", fontSize:13, lineHeight:1.6, marginBottom:20 }}>
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
                <div style={{ fontSize:16, fontWeight:800, color:"#d8e8d0" }}>{b.name}</div>
                <div style={{ fontSize:12, color:"#445040", marginTop:2 }}>
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
                  <div style={{ fontSize:9, color: earned[i] ? A : "#334a30", marginTop:2, fontWeight: earned[i] ? 700 : 400 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {earnedBdgs.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 0", color:"#2a3228", fontSize:13 }}>
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
  const [train,      setTrain]      = useState(false);
  const [mode,       setMode]       = useState("cut");
  const [prof,       setProf]       = useState(null);
  const [hist,       setHist]       = useState([]);
  const [meals,      setMeals]      = useState([...DEF_MEALS]);
  const [session,    setSession]    = useState({ type:"legs", duration:45, intensity:"moderate" });
  const [earnedBdgs, setEarnedBdgs] = useState([]);
  const [newBadge,   setNewBadge]   = useState(null);
  const [ready,      setReady]      = useState(false);
  const [weighIns,   setWeighIns]   = useState([]);
  const [tdeeAdj,    setTdeeAdj]    = useState(0);

  useEffect(() => {
    const load = async () => {
      const k = todayKey();
      const lv = await sg("logs__"  + k); if (lv)  setLogs(JSON.parse(lv));
      const wv = await sg("water__" + k); if (wv)  setWater(parseInt(wv) || 0);
      const tv = await sg("train__" + k); if (tv)  setTrain(tv === "true");
      const mv = await sg("mode__"  + k); if (mv)  setMode(mv);
      const pv = await sg("profile");     if (pv)  setProf(JSON.parse(pv));
      const mv2 = await sg("meals");      if (mv2) setMeals(JSON.parse(mv2));
      const sv = await sg("session__" + k); if (sv) setSession(JSON.parse(sv));
      const bv = await sg("badges");     if (bv)  setEarnedBdgs(JSON.parse(bv));
      const hv = await sg("history");    if (hv)  setHist(JSON.parse(hv));
      const wiv = await sg("weighins");  if (wiv) setWeighIns(JSON.parse(wiv));
      const tav = await sg("tdee_adj");  if (tav) setTdeeAdj(parseInt(tav) || 0);
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
    }
  }, [hist]); // eslint-disable-line

  const saveLogs  = async l => { setLogs(l);    await ss("logs__"  + todayKey(), JSON.stringify(l)); };
  const saveWater = async w => { setWater(w);   await ss("water__" + todayKey(), String(w));         };
  const saveTrain = async t => { setTrain(t);   await ss("train__" + todayKey(), String(t));         };
  const saveMode  = async m => { setMode(m);    await ss("mode__"  + todayKey(), m);                 };
  const saveProf  = async p => { setProf(p);    await ss("profile",              JSON.stringify(p)); };
  const onSession = async s => { setSession(s); await ss("session__" + todayKey(), JSON.stringify(s)); };

  const addLog    = e  => saveLogs([...logs, { ...e, id:Date.now(),
    time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }]);
  const removeLog = id => saveLogs(logs.filter(l => l.id !== id));

  const addToQA = async entry => {
    const name = entry.name;
    if (meals.find(m => m.name.toLowerCase() === name.toLowerCase())) return;
    const clean = { name, kcal: Math.round(entry.kcal),
      protein: Math.round(entry.protein * 10) / 10,
      carbs:   Math.round(entry.carbs   * 10) / 10,
      fat:     Math.round(entry.fat     * 10) / 10 };
    const updated = [...meals, clean];
    setMeals(updated);
    await ss("meals", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!ready) return;
    const k    = todayKey();
    const tots = sumLogs(logs);
    const snap = { date:k, mode, kcal: Math.round(tots.kcal),
      protein: Math.round(tots.protein * 10) / 10,
      carbs:   Math.round(tots.carbs   * 10) / 10,
      fat:     Math.round(tots.fat     * 10) / 10,
      water, training:train, logs:[...logs] };
    const upd = [...hist.filter(d => d.date !== k), snap]
      .sort((a, b) => a.date.localeCompare(b.date));
    setHist(upd);
    ss("history", JSON.stringify(upd));
  }, [logs, water, train, mode, ready]); // eslint-disable-line

  const updateDay = async upd => {
    const nh = [...hist.filter(d => d.date !== upd.date), upd]
      .sort((a, b) => a.date.localeCompare(b.date));
    setHist(nh);
    await ss("history", JSON.stringify(nh));
  };

  const onWeighIn = async weight => {
    const entry = { date: todayKey(), weight };
    const updated = [...weighIns.filter(w => w.date !== entry.date), entry]
      .sort((a, b) => a.date.localeCompare(b.date));
    setWeighIns(updated);
    await ss("weighins", JSON.stringify(updated));

    // Run calibration whenever a new weigh-in arrives
    const p = prof || DEF_PROFILE;
    const base = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat/100))) *
      (ACTIVITY[p.activity]?.mult || 1.375));
    const result = runCalibration(hist, updated, base + tdeeAdj);
    if (result && Math.abs(result.adj) >= 50) {
      const newAdj = Math.max(-600, Math.min(600, tdeeAdj + result.adj));
      setTdeeAdj(newAdj);
      await ss("tdee_adj", String(newAdj));
    }
  };

  const p        = prof || DEF_PROFILE;
  const baseTDEE = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat/100))) *
    (ACTIVITY[p.activity]?.mult || 1.375));

  const sessionKcal = train
    ? (session.hevyKcal != null
        ? session.hevyKcal
        : estimateSessionKcal((prof||DEF_PROFILE).weight, (prof||DEF_PROFILE).bodyFat,
            session.type, session.duration, session.intensity))
    : null;

  const targets   = calcTargets(prof || DEF_PROFILE, mode, train, sessionKcal, tdeeAdj);
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
        input::placeholder, textarea::placeholder { color: #2a3228; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select { background: #0b0d0b; color: #d8e8d0; }
      `}</style>

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
            <div style={{ fontSize:22, fontWeight:900, color:"#d8e8d0", marginBottom:6 }}>{newBadge.b.name}</div>
            <div style={{ fontSize:13, color:"#445040", marginBottom:24 }}>{TIERS[newBadge.i]} {newBadge.b.desc}</div>
            <button onClick={() => setNewBadge(null)}
              style={{ width:"100%", padding:"14px", background:A, color:"#0b0d0b",
                border:"none", borderRadius:12, fontSize:14, fontWeight:900, cursor:"pointer" }}>
              KEEP GOING 🔥
            </button>
          </div>
        </div>
      )}

      {view === "dashboard"    && <Dashboard logs={logs} totals={totals} targets={targets} remaining={remaining}
          water={water} setWater={saveWater} isTraining={train} setIsTraining={saveTrain}
          mode={mode} setMode={saveMode} setView={setView} removeLog={removeLog} addToQA={addToQA}
          hasProfile={!!prof} streak={streak} session={session} onSession={onSession}
          sessionKcal={sessionKcal} prof={prof}
          weighIns={weighIns} onWeighIn={onWeighIn} tdeeAdj={tdeeAdj} baseTDEE={baseTDEE}/>}
      {view === "profile"      && <ProfileScreen   profile={prof || DEF_PROFILE} onSave={saveProf} onBack={() => setView("dashboard")}/>}
      {view === "ai"           && <AILog           onAdd={addLog} onBack={() => setView("dashboard")}/>}
      {view === "quick"        && <QuickAdd        onAdd={addLog} onBack={() => setView("dashboard")} meals={meals} setMeals={setMeals}/>}
      {view === "search"       && <FoodSearch      onAdd={addLog} onBack={() => setView("dashboard")}/>}
      {view === "history"      && <History         history={hist} onBack={() => setView("dashboard")} onUpdateDay={updateDay}/>}
      {view === "achievements" && <Achievements    earnedBdgs={earnedBdgs} onBack={() => setView("dashboard")}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
