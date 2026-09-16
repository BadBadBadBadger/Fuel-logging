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
  return new Function(block + "\nreturn { parseStatedTotals, statedTotalsItem, dropDuplicateTotalRow };")();
})();
const { parseStatedTotals, statedTotalsItem, dropDuplicateTotalRow } = lifted;

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
  test("the AI Log never calls Open Food Facts — only FoodSearch, where the user picks from a list, may", () => {
    const off = codeLines().filter(l => /openfoodfacts/.test(l.text));
    expect(off.length).toBe(1);
    expect(fnBody("function FoodSearch(")).toContain("openfoodfacts");
    expect(fnBody("function AILog(")).not.toContain("openfoodfacts");
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
