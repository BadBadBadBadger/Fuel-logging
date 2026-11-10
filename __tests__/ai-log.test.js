// AI Log — what happens to typed text BEFORE and AFTER the model is asked.
//
// Contracts: features/logging/06-stated-totals.feature (a full totals line is the meal — no
// model call) and features/logging/07-estimate-of-what-you-typed.feature (the model's numbers
// are the numbers — nothing replaces them afterwards).
//
// Two kinds of test here. The recogniser is LIFTED FROM app.jsx and run for real, not mirrored
// by hand: a hand copy of four regexes would pass forever while the real ones drifted, which
// is the exact shape of defect this file exists to catch. The other tests are static reads of
// app.jsx, in the style of datekeys.test.js — the Open Food Facts removal and the prompt's new
// rules are facts about the source, and the model itself is not reachable from here (the
// worker rejects anonymous calls; the harness never signs in).

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "app.jsx");
const src = fs.readFileSync(SRC, "utf8");

/** Lift `const STATED_RE … statedTotalsItem` out of app.jsx and evaluate it as plain JS. */
const lifted = (() => {
  const start = src.indexOf("const STATED_RE = {");
  const end   = src.indexOf("const confColor", start);
  if (start < 0 || end < 0) throw new Error("stated-totals block not found in app.jsx");
  const block = src.slice(start, end);
  return new Function(block + "\nreturn { parseStatedTotals, statedTotalsItem, dropDuplicateTotalRow, photoMealName, mealKey, findPastMeal, mealParts, similarPastMeals };")();
})();
const { parseStatedTotals, statedTotalsItem, dropDuplicateTotalRow, photoMealName, mealKey, findPastMeal, mealParts, similarPastMeals } = lifted;

describe("A full totals line typed by the user is the meal (logging/06)", () => {
  test("the founder's crumpets: name before the figures, all four numbers exact", () => {
    const r = parseStatedTotals(
      "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each) — P: 9.2g C: 66.5g F: 25.8g 539 kcal");
    expect(r).toEqual({
      name: "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each)",
      kcal: 539, protein: 9.2, carbs: 66.5, fat: 25.8,
    });
  });
  test("the row it becomes is at 100% confidence, asks nothing, and says where it came from", () => {
    const it = statedTotalsItem(parseStatedTotals("Chilli — P: 38g C: 40g F: 14g 450 kcal"));
    expect(it).toMatchObject({ name: "Chilli", kcal: 450, protein: 38, carbs: 40, fat: 14,
      confidence: 100, ask: null });
    expect(it.reasoning).toMatch(/typed/i);
  });
  test("word forms: protein / carbs / fat / kcal", () => {
    expect(parseStatedTotals("Chilli, 450 kcal, protein 38g, carbs 40g, fat 14g"))
      .toEqual({ name: "Chilli", kcal: 450, protein: 38, carbs: 40, fat: 14 });
  });
  test("'calories' and 'carbohydrates' spell out, kcal may come before its number", () => {
    expect(parseStatedTotals("Wrap: calories 512, protein 31, carbohydrates 44, fat 22"))
      .toEqual({ name: "Wrap", kcal: 512, protein: 31, carbs: 44, fat: 22 });
    expect(parseStatedTotals("kcal: 300 P=20 C=30 F=8 omelette").kcal).toBe(300);
  });
  test("figures first: the name is what follows them", () => {
    expect(parseStatedTotals("kcal: 210, F: 2g, C: 12g, P: 40g — protein shake"))
      .toEqual({ name: "protein shake", kcal: 210, protein: 40, carbs: 12, fat: 2 });
  });
  test("only numbers: the row is called Meal", () => {
    expect(parseStatedTotals("P: 30g C: 10g F: 5g 205 kcal").name).toBe("Meal");
  });
  test("an extra like fibre between the figures does not block recognition", () => {
    expect(parseStatedTotals("Overnight oats — P: 22g C: 58g F: 11g fibre 9g 410 kcal"))
      .toEqual({ name: "Overnight oats", kcal: 410, protein: 22, carbs: 58, fat: 11 });
  });
  test("case does not matter", () => {
    expect(parseStatedTotals("toast p: 5g c: 20g f: 1g 110 KCAL")).toMatchObject({ kcal: 110, protein: 5 });
  });

  // ── what must NOT count ──
  test("single letters without a colon or equals are not macros", () => {
    expect(parseStatedTotals("protein shake  kcal 210 F 2g C 12g P 40g")).toBeNull();
  });
  test("a kcal figure alone is not a totals line — it goes to the model", () => {
    expect(parseStatedTotals("Pret chicken bacon sandwich, 480 kcal")).toBeNull();
  });
  test("three of four is not a totals line", () => {
    expect(parseStatedTotals("Chilli — P: 38g C: 40g 450 kcal")).toBeNull();
  });
  test("a weight is not a macro", () => {
    expect(parseStatedTotals("150g chicken breast and 200g rice")).toBeNull();
  });
  test("brands and food words that start with P, C or F do not trip it", () => {
    expect(parseStatedTotals("Pret Christmas lunch, Fanta, 600 kcal")).toBeNull();
    expect(parseStatedTotals("low fat yoghurt, protein bar, carb killa, 350 kcal")).toBeNull();
  });
  test("a calzone is not a calorie", () => {
    expect(parseStatedTotals("2 calzones P: 30g C: 90g F: 25g")).toBeNull();
  });
  test("empty and nonsense input", () => {
    expect(parseStatedTotals("")).toBeNull();
    expect(parseStatedTotals(null)).toBeNull();
    expect(parseStatedTotals("just some dinner")).toBeNull();
  });
});

/** Source lines, minus comments — comments are allowed to name the thing that was removed. */
const codeLines = () => src.split("\n")
  .map((text, i) => ({ n: i + 1, text }))
  .filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l.text));

/** The code of one top-level function, by its declaration line. */
const fnBody = decl => {
  const i = src.indexOf(decl);
  if (i < 0) throw new Error("not found: " + decl);
  const next = src.indexOf("\nfunction ", i + 1);
  return src.slice(i, next < 0 ? undefined : next);
};

describe("The model's numbers are the numbers (logging/07)", () => {
  test("searchOFT is gone", () => {
    const hits = codeLines().filter(l => /searchOFT/.test(l.text));
    expect(hits).toEqual([]);
  });
  test("nothing calls Open Food Facts — the Food Search screen was removed too", () => {
    const off = codeLines().filter(l => /openfoodfacts/.test(l.text));
    expect(off).toEqual([]);
    expect(src).not.toContain("function FoodSearch(");
  });
  test("no row is shown at a confidence the model did not give it", () => {
    // The old swap stamped every replaced row `confidence: 98`. Nothing may hard-code that now.
    const hits = codeLines().filter(l => /confidence:\s*98\b/.test(l.text));
    expect(hits).toEqual([]);
  });
  test("a stated total short-circuits the model call, and never for a photo", () => {
    const body = fnBody("function AILog(");
    expect(body).toMatch(/const stated = photo \? null : parseStatedTotals\(desc\)/);
    expect(body).toMatch(/if \(stated\) \{ setItems\(\[statedTotalsItem\(stated\)\]\);.*return; \}/);
  });
  test("estimate() runs the model's rows through dropDuplicateTotalRow", () => {
    expect(fnBody("function AILog(")).toMatch(/dropDuplicateTotalRow\(aiItems\.map/);
  });
});

describe("A hallucinated meal-total row is dropped even though the prompt asked the model not to send one (2026-09-16 recurrence)", () => {
  const rice    = { name: "Rice",    kcal: 325, protein: 6.5,  carbs: 71.5, fat: 1.3 };
  const chicken = { name: "Chicken", kcal: 220, protein: 46,   carbs: 0,    fat: 4.8 };
  const sauce   = { name: "Sauce",   kcal: 57,  protein: 0.3,  carbs: 13.5, fat: 0.1 };
  const mayo    = { name: "Mayo",    kcal: 101, protein: 0.2,  carbs: 0.3,  fat: 11 };
  const toms    = { name: "Tomatoes",kcal: 18,  protein: 0.9,  carbs: 3.5,  fat: 0.2 };
  const spinach = { name: "Spinach", kcal: 23,  protein: 2.8,  carbs: 1.4,  fat: 0.4 };
  const real = [rice, chicken, sauce, mayo, toms, spinach];

  test("the founder's lunch: a 7th row equal to the sum of the other six is stripped", () => {
    const summaryRow = { name: "Lunch estimate", kcal: 744, protein: 56.7, carbs: 90.2, fat: 17.8 };
    const out = dropDuplicateTotalRow([...real, summaryRow]);
    expect(out).toEqual(real);
    expect(out.reduce((a, it) => a + it.kcal, 0)).toBe(744);
  });
  test("the duplicate is caught wherever the model places it in the list", () => {
    const summaryRow = { name: "Total", kcal: 744, protein: 56.7, carbs: 90.2, fat: 17.8 };
    const out = dropDuplicateTotalRow([summaryRow, ...real]);
    expect(out).toEqual(real);
  });
  test("six genuine items with no coincidental match all survive", () => {
    expect(dropDuplicateTotalRow(real)).toEqual(real);
  });
  test("a single stated-totals row (logging/06) is untouched — nothing to compare it against", () => {
    const only = [{ name: "Chilli", kcal: 450, protein: 38, carbs: 40, fat: 14 }];
    expect(dropDuplicateTotalRow(only)).toEqual(only);
  });
  test("two items — even equal-sized ones — are never both dropped", () => {
    const a = { name: "Half A", kcal: 200, protein: 10, carbs: 20, fat: 5 };
    const b = { name: "Half B", kcal: 200, protein: 10, carbs: 20, fat: 5 };
    expect(dropDuplicateTotalRow([a, b])).toEqual([a, b]);
  });
  test("a genuine item that only coincidentally matches on kcal survives — protein/carbs/fat must ALL match too", () => {
    // Same kcal as the sum of the rest, but its own macros — not the arithmetic sum.
    const oddOneOut = { name: "Protein bar", kcal: 744, protein: 20, carbs: 25, fat: 8 };
    const out = dropDuplicateTotalRow([...real, oddOneOut]);
    expect(out).toContainEqual(oddOneOut);
    expect(out).toHaveLength(7);
  });
});

describe("The prompt carries the rules the bug report asked for (logging/07)", () => {
  const promptStart = src.indexOf("const AI_PROMPT = ");
  const prompt = src.slice(promptStart, src.indexOf("const AI_PHOTO_PROMPT", promptStart));

  test("dry / no oil / zero added fat mean no cooking fat, with chicken breast's real figure", () => {
    expect(prompt).toMatch(/"dry".*"zero added fat".*NO cooking fat/s);
    expect(prompt).toMatch(/chicken breast is about 3–4 g fat per 100 g/);
  });
  test("a stated weight is the portion and everything scales to it", () => {
    expect(prompt).toMatch(/stated weight or count IS the portion/);
    expect(prompt).toMatch(/150 g is 60% of 250 g/);
  });
  test("kcal is checked against the macros, with alcohol named as the exception", () => {
    expect(prompt).toMatch(/kcal ≈ 4×protein \+ 4×carbs \+ 9×fat/);
    expect(prompt).toMatch(/Alcohol \(7 kcal\/g\)/);
  });
  test("a number the user typed is a fact about its item, never a separate item", () => {
    expect(prompt).toMatch(/NEVER return a separate item for a number the user typed/);
  });
  test("a question the text already answers is not asked", () => {
    expect(prompt).toMatch(/already answers a question.*do not ask it/s);
  });
});

describe("A photo meal is named after what the model saw, not \"Photo meal\"", () => {
  const items = [{ name: "150g grilled chicken" }, { name: "80g mixed leaves" }];

  test("the model's short name wins", () => {
    expect(photoMealName("Chicken Caesar salad", "", items)).toBe("Chicken Caesar salad");
  });
  test("it wins over typed context too — the context is a hint, not a name", () => {
    expect(photoMealName("Pret tuna baguette", "from Pret", items)).toBe("Pret tuna baguette");
  });
  test("whitespace is tidied and an over-long name is cut", () => {
    expect(photoMealName("  Müller   Corner  yogurt ", "", items)).toBe("Müller Corner yogurt");
    expect(photoMealName("x".repeat(100), "", items)).toHaveLength(60);
  });
  test("no model name → what the user typed", () => {
    expect(photoMealName("", "leftover curry", items)).toBe("leftover curry");
    expect(photoMealName(undefined, "leftover curry", items)).toBe("leftover curry");
  });
  test("nothing typed and one item → that item's name", () => {
    expect(photoMealName(null, "", [{ name: "Cadbury Dairy Milk 45g" }])).toBe("Cadbury Dairy Milk 45g");
  });
  test("\"Photo meal\" only when there is nothing else at all", () => {
    expect(photoMealName("", "  ", items)).toBe("Photo meal");
  });

  const photoPrompt = (() => {
    const start = src.indexOf("const AI_PHOTO_PROMPT");
    return src.slice(start, src.indexOf("const AI_REESTIMATE_PROMPT", start));
  })();
  test("the photo prompt asks for a short meal name, using packaging brand names", () => {
    expect(photoPrompt).toMatch(/"meal": "short name for the whole meal"/);
    expect(photoPrompt).toMatch(/brand or product name is visible on packaging.*, use it/);
  });
  test("logAll uses it for photo meals", () => {
    expect(src).toMatch(/photo \? photoMealName\(mealName, desc, items\)/);
    expect(src).not.toMatch(/\|\| "Photo meal"\), kcal/);
  });
});

describe("Text typed with a photo guides the estimate (logging/08)", () => {
  /** Lift the real AI_PHOTO_PROMPT out of app.jsx and run it — not a static read. */
  const AI_PHOTO_PROMPT = (() => {
    const start = src.indexOf("const AI_PHOTO_PROMPT");
    const end   = src.indexOf("const AI_REESTIMATE_PROMPT", start);
    return new Function(src.slice(start, end) + "\nreturn AI_PHOTO_PROMPT;")();
  })();
  const notes = "200g chicken, fried in 1 tbsp olive oil, only ate half the rice";
  const withNotes = AI_PHOTO_PROMPT(notes);
  const without   = AI_PHOTO_PROMPT("");

  test("the user's notes are in the prompt, verbatim", () => {
    expect(withNotes).toContain(`USER'S NOTES about this photo: "${notes}"`);
  });
  test("the notes outrank the photo where they disagree", () => {
    expect(withNotes).toMatch(/the NOTES WIN/);
    expect(withNotes).toMatch(/Use the photo for everything the notes do not cover/);
  });
  test("a weight in the notes is the portion and every macro scales to it", () => {
    expect(withNotes).toMatch(/weight, count or size in the notes IS that item's portion/);
    expect(withNotes).toMatch(/150 g is 60% of 250 g/);
  });
  test("cooking fat, hidden ingredients, versions and part-eaten portions all come from the notes", () => {
    expect(withNotes).toMatch(/"dry".*"zero added fat".*NO cooking fat/s);
    expect(withNotes).toMatch(/fat IS there even if it is not visible/);
    expect(withNotes).toMatch(/photo cannot show .* are part of the meal/s);
    expect(withNotes).toMatch(/recipe variant in the notes/);
    expect(withNotes).toMatch(/estimate what was EATEN, not what is on the plate/);
  });
  test("a typed number is a fact about its item, never a separate item", () => {
    expect(withNotes).toMatch(/NEVER return a separate item for a number the user typed/);
  });
  test("confidence rises for what the notes pin down, and answered questions are not asked", () => {
    expect(withNotes).toMatch(/raise it for any component the notes pin down/);
    expect(withNotes).toMatch(/notes already answer a question.*do not set "ask"/s);
  });
  test("no notes → no notes section, and the meal-name and kcal rules still hold", () => {
    expect(without).not.toMatch(/USER'S NOTES/);
    expect(AI_PHOTO_PROMPT("   ")).not.toMatch(/USER'S NOTES/);
    expect(without).toMatch(/"meal": "short name for the whole meal"/);
    expect(without).toMatch(/kcal ≈ 4×protein \+ 4×carbs \+ 9×fat/);
  });
  test("the screen sends what was typed with the photo", () => {
    expect(src).toMatch(/text: AI_PHOTO_PROMPT\(desc\)/);
  });
});

describe("The coach never says \"floor\" or \"ceiling\" (features/coach/01)", () => {
  // The model copies the prompt's own words, so the words must be gone from everything the coach
  // prompt feeds it — not just forbidden in one rule. The one allowed mention is that rule itself.
  const coach = (() => {
    const start = src.indexOf("function CoachCard(");
    return src.slice(start, src.indexOf("const t    = await callAI(prompt", start));
  })();
  const strings = coach.match(/`[^`]*`|"[^"\n]*"/g) || [];

  test("the rule forbidding both words is in the prompt", () => {
    expect(coach).toMatch(/NEVER use the words "floor" or "ceiling"/);
  });
  test("no other string the prompt is built from uses either word", () => {
    const offenders = strings
      .map(s => s.replace(/- Speak plain, everyday English\.[^\n]*/, ""))
      .filter(s => /\b(floor|ceiling)s?\b/i.test(s));
    expect(offenders).toEqual([]);
  });
});

describe("A meal logged before is reused, not re-estimated (logging/09)", () => {
  const els = [
    { name: "2 slices sourdough", kcal: 230, protein: 8, carbs: 44, fat: 1.5, conf: 80 },
    { name: "2 poached eggs",     kcal: 143, protein: 12.6, carbs: 0.8, fat: 9.5, conf: 90 },
  ];
  const entry = (over = {}) => ({ name: "2 poached eggs on sourdough", kcal: 373, protein: 20.6,
    carbs: 44.8, fat: 11, conf: 86, elements: els, source: "ai-text", followups: [], ...over });

  test("case, punctuation and spacing don't matter; numbers and decimals do", () => {
    expect(mealKey("  2 Poached eggs, on SOURDOUGH! ")).toBe(mealKey("2 poached eggs on sourdough"));
    expect(mealKey("Nando's chicken")).toBe(mealKey("nandos chicken"));
    expect(mealKey("2 eggs on toast")).not.toBe(mealKey("3 eggs on toast"));
    expect(mealKey("1.5 bagels")).not.toBe(mealKey("15 bagels"));
  });
  test("an exact match returns the stored elements as rows, with no questions", () => {
    const r = findPastMeal("2 Poached Eggs on Sourdough", [{ date: "2026-11-01", logs: [entry()] }]);
    expect(r.date).toBe("2026-11-01");
    expect(r.items.map(i => i.name)).toEqual(els.map(e => e.name));
    expect(r.items[1]).toMatchObject({ kcal: 143, protein: 12.6, confidence: 90, ask: null });
  });
  test("a different meal is not a match — no fuzzy guessing", () => {
    expect(findPastMeal("3 poached eggs on sourdough", [{ date: "2026-11-01", logs: [entry()] }])).toBeNull();
    expect(findPastMeal("poached eggs", [{ date: "2026-11-01", logs: [entry()] }])).toBeNull();
    expect(findPastMeal("", [{ date: "2026-11-01", logs: [entry()] }])).toBeNull();
  });
  test("the most recent log wins, whatever order the days come in", () => {
    const days = [
      { date: "2026-10-20", logs: [entry({ kcal: 300, elements: null })] },
      { date: "2026-11-03", logs: [entry({ kcal: 410, elements: null })] },
      { date: "2026-10-28", logs: [entry({ kcal: 350, elements: null })] },
    ];
    const r = findPastMeal("2 poached eggs on sourdough", days);
    expect(r.date).toBe("2026-11-03");
    expect(r.items).toHaveLength(1);
    expect(r.items[0].kcal).toBe(410);
  });
  test("an entry edited after logging is reused as edited, not as its stale elements", () => {
    const r = findPastMeal("2 poached eggs on sourdough",
      [{ date: "2026-11-01", logs: [entry({ kcal: 450, fat: 19 })] }]);
    expect(r.items).toEqual([expect.objectContaining({ name: "2 poached eggs on sourdough", kcal: 450, fat: 19 })]);
  });
  test("a 0-kcal entry is never reused", () => {
    expect(findPastMeal("water", [{ date: "2026-11-01", logs: [{ name: "Water", kcal: 0 }] }])).toBeNull();
  });
  test("the follow-up answers from the earlier log come with it", () => {
    const fu = [{ q: "How were the eggs cooked?", a: "Poached" }];
    expect(findPastMeal("2 poached eggs on sourdough",
      [{ date: "2026-11-01", logs: [entry({ followups: fu })] }]).followups).toEqual(fu);
  });
});

describe("The same meal in other words: portion words scale it (logging/09, v106)", () => {
  // The founder's screenshot, 2026-11-10: logged weekly for six months, then typed with "Half size
  // portion of" in front — and the model guessed 420 kcal at 42% from a generic recipe.
  const bake = (date, kcal, name = "Chicken fajita pasta bake") => ({ date, logs: [{ name, kcal,
    protein: 52, carbs: 70, fat: 22, conf: 70, source: "ai-text", elements: null }] });
  const days = [bake("2026-10-20", 700), bake("2026-11-03", 720), bake("2026-10-27", 690, "chicken fajita pasta bake.")];

  test("filler and portion words aren't food words", () => {
    expect(mealParts("Half size portion of chicken fajita pasta bake"))
      .toMatchObject({ key: "chicken fajita pasta bake", mult: 0.5, size: "" });
    expect(mealParts("½ bowl of homemade chilli").mult).toBe(0.5);
    expect(mealParts("1/2 chilli").mult).toBe(0.5);
    expect(mealParts("double cheeseburgers").key).toBe("cheeseburger");
  });
  test("half of the usual is half of the most recent log, without the model", () => {
    const r = findPastMeal("Half size portion of chicken fajita pasta bake", days);
    expect(r).toMatchObject({ date: "2026-11-03", factor: 0.5, count: 3, exact: false });
    expect(r.items).toEqual([expect.objectContaining({
      name: "½ × Chicken fajita pasta bake", kcal: 360, protein: 26, carbs: 35, fat: 11 })]);
  });
  test("an earlier half portion logged in the same words is reused as it is", () => {
    const withHalf = [...days, bake("2026-10-01", 350, "Half size portion of chicken fajita pasta bake")];
    const r = findPastMeal("half size portion of chicken fajita pasta bake", withHalf);
    expect(r).toMatchObject({ exact: true, factor: 1, date: "2026-10-01" });
    expect(r.items[0].kcal).toBe(350);
  });
  test("a size word must be the same on both sides — 'large' has no honest number", () => {
    expect(findPastMeal("large chicken fajita pasta bake", days)).toBeNull();
  });
  test("an extra food is a different meal — but the usual goes to the model as reference", () => {
    const desc = "chicken fajita pasta bake with garlic bread";
    expect(findPastMeal(desc, days)).toBeNull();
    const refs = similarPastMeals(desc, days);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ name: "Chicken fajita pasta bake", kcal: 720 });
  });
  test("an unrelated meal sends no reference", () => {
    expect(similarPastMeals("chicken tikka masala", days)).toEqual([]);
  });
  test("a saved Quick Add meal counts as a meal logged before", () => {
    const r = findPastMeal("Whey protein shake", [], [{ name: "Whey protein shake", kcal: 130, protein: 25, carbs: 5, fat: 2 }]);
    expect(r).toMatchObject({ date: null, factor: 1 });
    expect(r.items[0].kcal).toBe(130);
  });
});

describe("The text prompt carries the user's own past logs when there are any", () => {
  const start = src.indexOf("const AI_PAST_BLOCK");
  const AI_PROMPT = new Function(src.slice(start, src.indexOf("// Vision variant", start)) + "\nreturn AI_PROMPT;")();
  test("no past logs: the prompt is as it was", () => {
    expect(AI_PROMPT("toast")).not.toMatch(/OWN past logs/);
  });
  test("past logs are listed with their numbers and the scaling rule", () => {
    const p = AI_PROMPT("chicken fajita pasta bake with garlic bread",
      [{ name: "Chicken fajita pasta bake", kcal: 720, protein: 52, carbs: 70, fat: 22 }]);
    expect(p).toMatch(/OWN past logs/);
    expect(p).toContain('- "Chicken fajita pasta bake": 720 kcal, P 52g, C 70g, F 22g');
    expect(p).toMatch(/"half" = half of the logged figures/);
  });
});
