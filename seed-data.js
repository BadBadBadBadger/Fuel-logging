window.seedFuelLog = function () {
  // ── helpers ──────────────────────────────────────────────────
  function dk(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ── wipe old seed keys ───────────────────────────────────────
  const drop = Object.keys(localStorage).filter(k =>
    ["profile","meals","history","badges","weighins","tdee_adj"].includes(k) ||
    /^(logs|water|train|mode|session|coach)__/.test(k)
  );
  drop.forEach(k => localStorage.removeItem(k));

  // ── profile ──────────────────────────────────────────────────
  localStorage.setItem("profile", JSON.stringify(
    { weight: 80, height: 178, bodyFat: 16, activity: "light" }
  ));

  // ── meal library ─────────────────────────────────────────────
  const mealLib = [
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
  localStorage.setItem("meals", JSON.stringify(mealLib));

  // ── meal combos for history generation ───────────────────────
  const breakfasts = [
    [{ name:"Oats (80g dry)", kcal:304, protein:11, carbs:54, fat:6 },
     { name:"Greek yoghurt (200g)", kcal:130, protein:18, carbs:6, fat:4 },
     { name:"Banana (medium)", kcal:89, protein:1, carbs:23, fat:0 }],
    [{ name:"Scrambled eggs (3 large)", kcal:234, protein:18, carbs:1, fat:17 },
     { name:"Whole milk (250ml)", kcal:153, protein:8, carbs:12, fat:8 }],
    [{ name:"Oats (80g dry)", kcal:304, protein:11, carbs:54, fat:6 },
     { name:"Whey protein shake", kcal:130, protein:25, carbs:5, fat:2 }],
    [{ name:"Whole eggs x2 boiled", kcal:156, protein:12, carbs:1, fat:11 },
     { name:"Greek yoghurt (200g)", kcal:130, protein:18, carbs:6, fat:4 }],
    [{ name:"Oats (80g dry)", kcal:304, protein:11, carbs:54, fat:6 },
     { name:"Banana (medium)", kcal:89, protein:1, carbs:23, fat:0 }],
  ];
  const lunches = [
    [{ name:"Chicken breast (150g)", kcal:248, protein:47, carbs:0, fat:5 },
     { name:"Brown rice (200g cooked)", kcal:218, protein:5, carbs:46, fat:2 },
     { name:"Broccoli (200g)", kcal:68, protein:6, carbs:11, fat:1 }],
    [{ name:"Tuna can (120g drained)", kcal:132, protein:29, carbs:0, fat:1 },
     { name:"White rice (200g cooked)", kcal:260, protein:5, carbs:57, fat:0 },
     { name:"Broccoli (200g)", kcal:68, protein:6, carbs:11, fat:1 }],
    [{ name:"Beef mince 5% fat (150g)", kcal:221, protein:33, carbs:0, fat:9 },
     { name:"Sweet potato (200g)", kcal:172, protein:3, carbs:40, fat:0 }],
    [{ name:"Chicken breast (150g)", kcal:248, protein:47, carbs:0, fat:5 },
     { name:"White rice (200g cooked)", kcal:260, protein:5, carbs:57, fat:0 }],
    [{ name:"Cottage cheese (200g)", kcal:160, protein:22, carbs:6, fat:4 },
     { name:"Brown rice (200g cooked)", kcal:218, protein:5, carbs:46, fat:2 }],
    [{ name:"Salmon fillet (150g)", kcal:280, protein:35, carbs:0, fat:15 },
     { name:"Sweet potato (200g)", kcal:172, protein:3, carbs:40, fat:0 }],
  ];
  const snacks = [
    [{ name:"Whey protein shake", kcal:130, protein:25, carbs:5, fat:2 },
     { name:"Mixed nuts (30g)", kcal:185, protein:5, carbs:6, fat:16 }],
    [{ name:"Protein bar (50g)", kcal:200, protein:20, carbs:18, fat:7 }],
    [{ name:"Cottage cheese (200g)", kcal:160, protein:22, carbs:6, fat:4 }],
    [{ name:"Greek yoghurt (200g)", kcal:130, protein:18, carbs:6, fat:4 },
     { name:"Banana (medium)", kcal:89, protein:1, carbs:23, fat:0 }],
    [{ name:"Whey protein shake", kcal:130, protein:25, carbs:5, fat:2 }],
    [{ name:"Peanut butter (2 tbsp)", kcal:188, protein:8, carbs:6, fat:16 },
     { name:"Banana (medium)", kcal:89, protein:1, carbs:23, fat:0 }],
  ];
  const dinners = [
    [{ name:"Salmon fillet (150g)", kcal:280, protein:35, carbs:0, fat:15 },
     { name:"Sweet potato (200g)", kcal:172, protein:3, carbs:40, fat:0 }],
    [{ name:"Chicken breast (150g)", kcal:248, protein:47, carbs:0, fat:5 },
     { name:"White rice (200g cooked)", kcal:260, protein:5, carbs:57, fat:0 }],
    [{ name:"Beef mince 5% fat (150g)", kcal:221, protein:33, carbs:0, fat:9 },
     { name:"Brown rice (200g cooked)", kcal:218, protein:5, carbs:46, fat:2 }],
    [{ name:"Salmon fillet (150g)", kcal:280, protein:35, carbs:0, fat:15 },
     { name:"Brown rice (200g cooked)", kcal:218, protein:5, carbs:46, fat:2 },
     { name:"Broccoli (200g)", kcal:68, protein:6, carbs:11, fat:1 }],
    [{ name:"Chicken breast (150g)", kcal:248, protein:47, carbs:0, fat:5 },
     { name:"Sweet potato (200g)", kcal:172, protein:3, carbs:40, fat:0 },
     { name:"Broccoli (200g)", kcal:68, protein:6, carbs:11, fat:1 }],
    [{ name:"Beef mince 5% fat (150g)", kcal:221, protein:33, carbs:0, fat:9 },
     { name:"Sweet potato (200g)", kcal:172, protein:3, carbs:40, fat:0 },
     { name:"Whole milk (250ml)", kcal:153, protein:8, carbs:12, fat:8 }],
  ];

  // ── date range: 183 days ago → today ─────────────────────────
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayStr = dk(today);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 183);

  const totalDays = 183;

  // Weight journey: 85.2 → 79.8 over 183 days
  const startWeight = 85.2;
  const endWeight   = 79.8;
  const dailyDrop   = (startWeight - endWeight) / totalDays;

  // Training schedule: Mon=legs, Wed=push, Fri=pull, Sat=fullbody
  const sessMap = { 1:"legs", 3:"push", 5:"pull", 6:"fullbody" };

  const history  = [];
  const weighins = [];

  // Track consecutive-skip counter to avoid gaps > 2 days
  let skipStreak = 0;

  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = dk(d);
    const isToday = dateStr === todayStr;
    const dow = d.getDay(); // 0=Sun

    // Skip ~12% of non-today days (realistic partial logging)
    if (!isToday) {
      if (skipStreak < 2 && Math.random() < 0.12) {
        skipStreak++;
        continue;
      }
    }
    skipStreak = 0;

    // Mode: cut most days, occasional maintain on Sundays
    const mode = (!isToday && dow === 0 && Math.random() < 0.25) ? "maintain" : "cut";

    // Training
    const isTrainDay = sessMap[dow] != null;
    const didTrain   = isTrainDay && (isToday || Math.random() > 0.1); // 90% attendance
    const session    = didTrain ? {
      type:      sessMap[dow],
      duration:  45 + Math.floor(rnd(0, 30)),
      intensity: pick(["moderate","moderate","heavy","light"]),
    } : null;

    // Food log
    let logs;
    if (isToday) {
      // Today: wide variety to showcase the food log screen
      logs = [
        { name:"Oats (80g dry)",           kcal:304, protein:11, carbs:54, fat:6  },
        { name:"Greek yoghurt (200g)",     kcal:130, protein:18, carbs:6,  fat:4  },
        { name:"Banana (medium)",          kcal:89,  protein:1,  carbs:23, fat:0  },
        { name:"Whey protein shake",       kcal:130, protein:25, carbs:5,  fat:2  },
        { name:"Chicken breast (150g)",    kcal:248, protein:47, carbs:0,  fat:5  },
        { name:"Brown rice (200g cooked)", kcal:218, protein:5,  carbs:46, fat:2  },
        { name:"Broccoli (200g)",          kcal:68,  protein:6,  carbs:11, fat:1  },
        { name:"Protein bar (50g)",        kcal:200, protein:20, carbs:18, fat:7  },
        { name:"Salmon fillet (150g)",     kcal:280, protein:35, carbs:0,  fat:15 },
        { name:"Sweet potato (200g)",      kcal:172, protein:3,  carbs:40, fat:0  },
      ];
    } else {
      logs = [...pick(breakfasts), ...pick(lunches), ...pick(snacks), ...pick(dinners)];
    }

    const tots = logs.reduce((a, l) => ({
      kcal:    a.kcal    + l.kcal,
      protein: a.protein + l.protein,
      carbs:   a.carbs   + l.carbs,
      fat:     a.fat     + l.fat,
    }), { kcal:0, protein:0, carbs:0, fat:0 });

    const water = isToday ? 7 : Math.floor(rnd(5, 10));

    // Persist per-day keys
    localStorage.setItem("logs__"    + dateStr, JSON.stringify(logs));
    localStorage.setItem("water__"   + dateStr, String(water));
    localStorage.setItem("train__"   + dateStr, String(didTrain));
    localStorage.setItem("mode__"    + dateStr, mode);
    if (session) localStorage.setItem("session__" + dateStr, JSON.stringify(session));

    history.push({
      date: dateStr, mode,
      kcal:    Math.round(tots.kcal),
      protein: Math.round(tots.protein * 10) / 10,
      carbs:   Math.round(tots.carbs   * 10) / 10,
      fat:     Math.round(tots.fat     * 10) / 10,
      water, training: didTrain, logs: [...logs],
    });

    // Weigh-in (~85% of days; always weigh in today)
    if (isToday || Math.random() < 0.85) {
      const trend   = startWeight - dailyDrop * i;
      // Daily noise ±0.4kg, weekly water cycle ±0.25kg
      const noise   = (Math.random() - 0.5) * 0.8;
      const weekly  = Math.sin((i / 7) * Math.PI * 2) * 0.25;
      const w = isToday
        ? endWeight
        : clamp(Math.round((trend + noise + weekly) * 10) / 10, endWeight - 1.5, startWeight + 0.5);
      weighins.push({ date: dateStr, weight: w });
    }
  }

  history.sort((a, b) => a.date.localeCompare(b.date));
  weighins.sort((a, b) => a.date.localeCompare(b.date));

  localStorage.setItem("history",  JSON.stringify(history));
  localStorage.setItem("weighins", JSON.stringify(weighins));
  localStorage.setItem("tdee_adj", "50");

  // Badges: earned across the 6-month journey
  localStorage.setItem("badges", JSON.stringify([
    "streak_0","streak_1","streak_2",          // 🔥 Bronze/Silver/Gold streak
    "logger_0","logger_1","logger_2","logger_3",// 🪈 up to Platinum total days
    "hydrated_0","hydrated_1",                  // 💧 Bronze/Silver hydration
  ]));

  const msg = "Seeded " + history.length + " days · " + weighins.length + " weigh-ins. Reload the app!";
  console.log("✅", msg);
  alert("✅ " + msg);
};
