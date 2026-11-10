// The lookup chain — features/logging/10-lookup-chain.feature.
//
// Cheapest and surest source first: the user's own log (whole line, then each part of a mixed
// meal), then a product label (Open Food Facts through the worker), then the AI for whatever is
// still unknown, then a web check only on a tap. Everything here is LIFTED from app.jsx /
// cloudflare-worker.js and run for real, as in ai-log.test.js — a hand copy would drift.

const fs = require("fs");
const path = require("path");

const src    = fs.readFileSync(path.join(__dirname, "..", "app.jsx"), "utf8");
const worker = fs.readFileSync(path.join(__dirname, "..", "cloudflare-worker.js"), "utf8");

const L = (() => {
  const start = src.indexOf("const STATED_RE = {");
  const end   = src.indexOf("const confColor", start);
  if (start < 0 || end < 0) throw new Error("lookup block not found in app.jsx");
  return new Function(src.slice(start, end) + `
    return { splitAgainstPast, mealChunks, labelWords, nearWord, validLabel, labelPortion,
      pickLabel, labelRow, barcodeRow, barcodeInText, LABEL_CONF, BARCODE_CONF };`)();
})();

const offNormalise = (() => {
  const a = worker.indexOf("// OFF-NORMALISE-START"), b = worker.indexOf("// OFF-NORMALISE-END");
  if (a < 0 || b < 0) throw new Error("offNormalise markers not found in the worker");
  return new Function(worker.slice(a, b) + "\nreturn offNormalise;")();
})();

const BAKE = { name: "Chicken fajita pasta bake", kcal: 720, protein: 52, carbs: 70, fat: 22 };
const CHEESE = { name: "Cheese", kcal: 120, protein: 7.5, carbs: 0, fat: 10 };
const DAYS = [{ date: "2026-11-03", logs: [BAKE, CHEESE] }];

// What Open Food Facts returns for the founder's bar, after offNormalise.
const BAREBELLS = { code: "7340001802056", name: "Protein Bar Cookies & Cream", brands: "Barebells",
  kcal100: 364, protein100: 36, carbs100: 36, fat100: 13, servingG: 55 };
const BAREBELLS_PEANUT = { ...BAREBELLS, code: "7340001802001", name: "Protein Bar Salty Peanut", kcal100: 382 };

describe("A mixed meal: the parts logged before come from the log (logging/10)", () => {
  test("the bake from the log, the yoghurt left for the AI", () => {
    const r = L.splitAgainstPast("chicken fajita pasta bake and a yoghurt", DAYS);
    expect(r.known).toHaveLength(1);
    expect(r.known[0].past.items[0].kcal).toBe(720);
    expect(r.unknown).toEqual(["a yoghurt"]);
  });
  test("commas separate, and portion words still scale the logged part", () => {
    const r = L.splitAgainstPast("half chicken fajita pasta bake, garlic bread", DAYS);
    expect(r.known[0].past.factor).toBe(0.5);
    expect(r.known[0].past.items[0].kcal).toBe(360);
    expect(r.unknown).toEqual(["garlic bread"]);
  });
  test("a one-word part split off by 'and' is never matched alone — mac and cheese is one food", () => {
    const r = L.splitAgainstPast("mac and cheese", DAYS);
    expect(r.known).toEqual([]);
    expect(r.unknown).toEqual(["mac and cheese"]);
  });
  test("…but after a comma a single word is a part of its own", () => {
    const r = L.splitAgainstPast("crackers, cheese", DAYS);
    expect(r.known.map(k => k.past.name)).toEqual(["Cheese"]);
    expect(r.unknown).toEqual(["crackers"]);
  });
  test("cookies and cream is not split into 'cookies' + 'cream …'", () => {
    const r = L.splitAgainstPast("cookies and cream barbells protein bar", DAYS);
    expect(r.unknown).toEqual(["cookies and cream barbells protein bar"]);
  });
  test("a decimal comma does not split", () => {
    expect(L.mealChunks("1,5 bagels")).toEqual(["1,5 bagels"]);
  });
});

describe("A product label is used only on a sure match (logging/10)", () => {
  test("the founder's bar, typed with the brand misspelt, takes its label at one serving", () => {
    const r = L.pickLabel("cookies and cream barbells protein bar", [BAREBELLS_PEANUT, BAREBELLS]);
    expect(r.pick).toBe(BAREBELLS);
    const row = L.labelRow("cookies and cream barbells protein bar", r.pick);
    expect(row).toMatchObject({ kcal: 200, protein: 19.8, carbs: 19.8, fat: 7.2,
      confidence: L.LABEL_CONF, source: "label", ask: null });
    expect(row.name).toBe("Barebells Protein Bar Cookies & Cream (55 g)");
    expect(row.reasoning).toMatch(/Open Food Facts/);
  });
  test("a typed count multiplies the serving; a typed weight replaces it", () => {
    expect(L.labelRow("2 barebells cookies and cream bars", BAREBELLS).kcal).toBe(400);
    expect(L.labelRow("2x barebells cookies and cream", BAREBELLS).kcal).toBe(400);
    expect(L.labelRow("half a barebells cookies and cream bar", BAREBELLS).kcal).toBe(100);
    expect(L.labelRow("30g barebells cookies and cream", BAREBELLS).kcal).toBe(109);
  });
  test("no brand in what was typed → no label (generic food goes to the AI)", () => {
    const tesco = { name: "Cooked chicken breast", brands: "Tesco", kcal100: 150, protein100: 31,
      carbs100: 0, fat100: 2.5, servingG: 100 };
    expect(L.pickLabel("cooked chicken breast", [tesco]).pick).toBeNull();
    expect(L.pickLabel("tesco cooked chicken breast", [tesco]).pick).toBe(tesco);
  });
  test("the 2026-09-15 bug cannot recur: 'Butter, 30g' does not become a peanut-butter biscuit", () => {
    const presto = { name: "peanut butter 30g", brands: "Presto", kcal100: 500, protein100: 10,
      carbs100: 70, fat100: 20, servingG: 30 };
    expect(L.pickLabel("Butter, 30g", [presto]).pick).toBeNull();
    // …and with a brand typed, the brand must be the product's own: Lurpak is not Presto.
    expect(L.pickLabel("Lurpak butter, 30g", [presto]).pick).toBeNull();
  });
  test("every typed word must be on the product", () => {
    expect(L.pickLabel("barebells white chocolate almond", [BAREBELLS]).pick).toBeNull();
  });
  test("a vague name that fits several different products picks none, and hands them to the AI", () => {
    const r = L.pickLabel("barebells protein bar", [BAREBELLS, BAREBELLS_PEANUT]);
    expect(r.pick).toBeNull();
    expect(r.near).toHaveLength(2);
  });
  test("figures that don't add up are not a label", () => {
    expect(L.validLabel({ ...BAREBELLS, kcal100: 1364 })).toBe(false);
    expect(L.validLabel({ ...BAREBELLS, fat100: 80 })).toBe(false);
    expect(L.validLabel({ ...BAREBELLS, kcal100: null })).toBe(false);
    expect(L.validLabel(BAREBELLS)).toBe(true);
  });
  test("no weight typed and no serving on the label → no honest portion → not used", () => {
    const r = L.pickLabel("barebells cookies and cream", [{ ...BAREBELLS, servingG: null }]);
    expect(r.pick).toBeNull();
    expect(r.near).toHaveLength(1);
  });
  test("typos: one letter in 5–7 letter words, two in longer ones; short words exact", () => {
    expect(L.nearWord("barbell", "barebell")).toBe(true);
    expect(L.nearWord("snickr", "snicker")).toBe(true);
    expect(L.nearWord("oat", "oak")).toBe(false);
    expect(L.nearWord("chicken", "chickpea")).toBe(false);
  });
});

describe("Barcodes (logging/10)", () => {
  test("digits on their own are a barcode; a number in a meal is not", () => {
    expect(L.barcodeInText(" 7340001802056 ")).toBe("7340001802056");
    expect(L.barcodeInText("50184385")).toBe("50184385");
    expect(L.barcodeInText("2 eggs")).toBeNull();
    expect(L.barcodeInText("123456789")).toBeNull();
  });
  test("a barcode row is the label at one serving, at the barcode confidence", () => {
    expect(L.barcodeRow("", BAREBELLS)).toMatchObject({ kcal: 200, confidence: L.BARCODE_CONF });
  });
  test("no serving on the label: per 100 g, low confidence, and the portion is asked", () => {
    const row = L.barcodeRow("", { ...BAREBELLS, servingG: null });
    expect(row).toMatchObject({ kcal: 364, ask: "portion", confidence: 60 });
  });
});

describe("The worker's Open Food Facts normaliser", () => {
  test("the classic API shape", () => {
    expect(offNormalise({ code: "7340001802056", product_name: "Protein Bar Cookies & Cream",
      brands: "Barebells", serving_quantity: "55", serving_quantity_unit: "g",
      nutriments: { "energy-kcal_100g": 364, proteins_100g: 36, carbohydrates_100g: 36, fat_100g: 13 } }))
      .toEqual(BAREBELLS);
  });
  test("the search service shape: brands as a list, energy only in kJ", () => {
    const p = offNormalise({ code: "1", product_name: "Bar", brands: ["Barebells", "Barebells Functional Foods"],
      nutriments: { energy_100g: 1523, proteins_100g: 36, carbohydrates_100g: 36, fat_100g: 13 } });
    expect(p.brands).toBe("Barebells, Barebells Functional Foods");
    expect(p.kcal100).toBe(364);
    expect(p.servingG).toBeNull();
  });
  test("junk is null", () => {
    expect(offNormalise(null)).toBeNull();
    expect(offNormalise({ nutriments: {} })).toBeNull();
  });
});

describe("The AI is asked only for what is still unknown (logging/10)", () => {
  const start = src.indexOf("const AI_PAST_BLOCK");
  const AI_PROMPT = new Function(src.slice(start, src.indexOf("// Vision variant", start)) + "\nreturn AI_PROMPT;")();
  test("known parts are listed and the model is told not to return them", () => {
    const p = AI_PROMPT("chicken fajita pasta bake and a yoghurt", [],
      { known: [{ name: "Chicken fajita pasta bake", kcal: 720 }] });
    expect(p).toMatch(/ALREADY WORKED OUT/);
    expect(p).toContain('- "Chicken fajita pasta bake": 720 kcal');
    expect(p).toMatch(/Return items ONLY for the rest of the meal/);
  });
  test("near-miss labels go in as hints", () => {
    const p = AI_PROMPT("barebells protein bar", [], { labels: [BAREBELLS] });
    expect(p).toMatch(/Possible product labels/);
    expect(p).toContain("Barebells — Protein Bar Cookies & Cream");
  });
  test("nothing known: neither block appears", () => {
    const p = AI_PROMPT("toast");
    expect(p).not.toMatch(/ALREADY WORKED OUT|Possible product labels/);
  });
  test("the reply is asked to be short: one line, reasoning under 12 words", () => {
    const p = AI_PROMPT("toast");
    expect(p).toMatch(/single line/);
    expect(p).toMatch(/under 12 words/);
  });
});

describe("The web check is opt-in and server-controlled (logging/10)", () => {
  test("the app sends only a flag; the tool itself is added by the worker", () => {
    expect(src).toMatch(/opts\.web \? \{ web: true \}/);
    expect(src).not.toMatch(/web_search_2/);
    expect(worker).toMatch(/const web\s+= body\.web === true/);
    expect(worker).toMatch(/tools: \[WEB_SEARCH_TOOL\]/);
    expect(worker).not.toMatch(/body\.tools/);
  });
  test("a web check is capped and counts several calls against the daily limit", () => {
    expect(worker).toMatch(/max_uses: 2/);
    expect(worker).toMatch(/withinRateLimit\(env, user\.id, web \? WEB_COST : 1\)/);
  });
  test("it only runs from the Check online button", () => {
    const calls = src.split("\n").filter(l => /\{ web: true \}\)/.test(l));
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatch(/AI_WEB_PROMPT/);
  });
  test("the app never calls Open Food Facts itself — only through the worker's /food route", () => {
    expect(src).toMatch(/AI_ENDPOINT \+ "\/food"/);
    expect(src).not.toMatch(/openfoodfacts\.org/);
  });
});
