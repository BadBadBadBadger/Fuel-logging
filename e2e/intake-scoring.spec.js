// Contract: features/dashboard/04-intake-scoring.feature (grading) +
//           features/dashboard/05-intake-score-card-layout.feature (the two cards).
//
// WHY THIS FILE EXISTS. 04 and 05 shipped with zero UI coverage, and the three worst defects the
// 2026-09-09 implementation review found were all invisible to `npx jest` — they only appeared
// when the app was actually opened and looked at:
//
//   • the fat health floor was judged flat from the first meal onward, so at 11am, after an
//     on-plan breakfast, the card read a red "FAT · Add some healthy fats" — which outranks
//     everything else in the hero order, and so was the dashboard's dominant daytime state;
//   • the majority-floor override returned a green "This week's been a real cut — averaging a
//     genuine deficit. Keep going." for a week with NOTHING logged in it, and for a week of
//     logged binges, because it read whether the TARGET was floored and never what was eaten;
//   • the TODAY card and THIS WEEK's own last segment showed different colours for the same day.
//
// Every test below is one of those, or a state the founder decided explicitly and which must not
// drift back. The arithmetic stays in __tests__/logic.test.js; this file only asks what the screen
// says.
//
// THE CLOCK. Day-open vs day-close is the axis most of this turns on, and it is reachable here
// only because Dashboard reads getCurrentHour() (app.jsx:205) rather than the raw wall clock —
// that was itself one of the review's fixes. `dev_time_hour` is the harness's own control, the
// same one preview.html's toolbar writes.

const { test, expect } = require("@playwright/test");
const { open, PROFILE } = require("./harness");

/** A meal whose id puts its clock time at `hour`, which is where firstMealHour comes from. */
const mealAt = (hour, m) => ({ id: new Date().setHours(hour, 0, 0, 0),
  name: "Meal", time: `${String(hour).padStart(2, "0")}:00`, ...m });

/** The seeded profile is 98.5 kg, so its fat health floor is round(98.5 × 0.6) = 59 g. */
const FAT_FLOOR_G = 59;

/** Text of one score card, by its printed title. */
const card = (page, title) => page.locator("div").filter({
  has: page.locator(`> div:text-is("${title}")`) }).filter({ has: page.locator("svg") }).first();

/** The 7 weekly ring segments, as "<stroke>@<opacity>" — grey track segments included.
 * Scoped to the THIS WEEK card specifically since 2026-09-09: TODAY's ring also renders <path>
 * segments now (one per macro, coloured by that macro's own score instead of a wall-clock fill —
 * founder feedback, the old fill told you the time and nothing about what was actually wrong), so
 * an unscoped query would pick up both rings' arcs. */
const segments = async page => card(page, "THIS WEEK").locator("path").evaluateAll(paths =>
  paths.filter(p => p.getAttribute("d")?.startsWith("M "))
    .map(p => p.getAttribute("stroke") + "@" + p.getAttribute("opacity")));

/** A history snapshot in the shape the daily effect writes since 2026-09-09 (real targets stored). */
const snap = (daysAgo, { kcal, protein = 175, carbs = 220, fat = 72, logged = true, floored = false }) => ({
  daysAgo, mode: "cut", kcal, protein, carbs, fat, water: 6, training: false,
  logs: logged ? [{ id: 1, name: "day", kcal, protein, carbs, fat, time: "08:00" }] : [],
  targetKcal: 2241, targetProtein: 169, targetFat: 79, targetFatFloor: FAT_FLOOR_G, floored,
});

/** Resolve `daysAgo` against the page's own clock, the way harness.js's historySpec does. */
const resolveHistory = snaps => {
  const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
    "-" + String(d.getDate()).padStart(2, "0");
  return snaps.map(({ daysAgo, ...rest }) =>
    ({ date: fmt(new Date(Date.now() - daysAgo * 86400000)), ...rest }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

test.describe("TODAY — the day's one action", () => {
  // THE BIG ONE. Before the fix this said "FAT / Add some healthy fats" in red, every morning,
  // for everyone — telling someone on a Cut to eat more fat while they were perfectly on plan.
  test("mid-morning, part-way to the day's fat, it does not tell you to eat more fat", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "11" },
      logs: [mealAt(8, { kcal: 600, protein: 45, carbs: 60, fat: 22 })] }); // 22g of a 59g floor

    const today = card(page, "TODAY");
    await expect(today).not.toContainText("Add some healthy fats");
    await expect(today).toContainText("ON TRACK");
  });

  test("at day close, genuinely short on fat, it does say so", async ({ page }) => {
    // First meal 08:00 + the 14h eating window = closed from 22:00.
    await open(page, { extra: { dev_time_hour: "22" },
      logs: [mealAt(8, { kcal: 2200, protein: 190, carbs: 320, fat: 25 })] });

    const today = card(page, "TODAY");
    await expect(today).toContainText("FAT");
    await expect(today).toContainText("Add some healthy fats");
  });

  // "OVER BY" is a bar caption, always printed next to a number. The hero prints its action on
  // its own line, so the card used to read "CALORIES / OVER BY" — a sentence ending in "BY".
  test("the calorie action is a finished sentence with the number in it", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "22" },
      logs: [mealAt(8, { kcal: 2950, protein: 190, carbs: 320, fat: 90 })] });

    const today = card(page, "TODAY");
    await expect(today).toContainText("CALORIES");
    await expect(today).toContainText(/Over by \d+ kcal today\./);
  });

  test("a closed day with nothing logged reads as a miss, not as on track", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "23" }, logs: [] });
    await expect(card(page, "TODAY")).toContainText("NO LOG");
  });
});

test.describe("THIS WEEK — the rolling read", () => {
  const sevenLoggedDays = extra => ({
    extra, logs: [mealAt(8, { kcal: 1100, protein: 90, carbs: 110, fat: 38 }),
                  mealAt(9, { kcal: 1100, protein: 85, carbs: 100, fat: 36 })],
    history: resolveHistory([
      snap(6, { kcal: 2200 }), snap(5, { kcal: 2950, fat: 95 }), snap(4, { kcal: 0, logged: false }),
      snap(3, { kcal: 2400, protein: 120, fat: 80 }), snap(2, { kcal: 2200, fat: 30 }),
      snap(1, { kcal: 2230 }), snap(7, { kcal: 2200 }),
    ]),
  });

  test("it states how many of the 7 days it is built from, and the ring agrees", async ({ page }) => {
    await open(page, sevenLoggedDays({ dev_time_hour: "11" }));

    const week = card(page, "THIS WEEK");
    await expect(week).toContainText("Based on 6 of 7 days logged");
    // The count in that sentence and the ring have to be the same fact: one unlogged day in the
    // seed means exactly one segment left on the empty track, and six carrying a day's colour.
    const track = await page.evaluate(() =>
      document.querySelectorAll("circle")[document.querySelectorAll("circle").length - 1]
        .getAttribute("stroke"));
    const segs = await segments(page);
    expect(segs).toHaveLength(7);
    expect(segs.filter(s => s.split("@")[0] === track)).toHaveLength(1);
  });

  // Guardrail §6, the inversion the founder's unlogged-day decision exists to close. It came
  // back through a different door: the majority-floor override ran before the "nothing logged"
  // check, so a week with no data at all was congratulated on a deficit it never ran.
  test("a week with nothing logged gives no verdict, it does not congratulate a deficit", async ({ page }) => {
    await open(page, {
      // 50 kg / 30% body fat / sedentary → target pinned at SAFE_MIN 1200, so every day is floored.
      profile: { ...PROFILE, weight: 50, height: 160, bodyFat: 30, activity: "sedentary", sex: "female" },
      extra: { dev_time_hour: "11" }, logs: [],
      history: resolveHistory([1, 2, 3, 4, 5, 6, 7].map(d => snap(d, { kcal: 0, logged: false }))),
    });

    const week = card(page, "THIS WEEK");
    await expect(week).toContainText("Still filling in");
    await expect(week).not.toContainText("genuine deficit");
  });

  test("a floored week of logged binges reads as the surplus it was, not as a real cut", async ({ page }) => {
    await open(page, {
      profile: { ...PROFILE, weight: 50, height: 160, bodyFat: 30, activity: "sedentary", sex: "female" },
      extra: { dev_time_hour: "11" },
      logs: [mealAt(8, { kcal: 3000, protein: 60, carbs: 400, fat: 110 })],
      history: resolveHistory([
        snap(1, { kcal: 3200, fat: 120, floored: true }), snap(2, { kcal: 3200, fat: 120, floored: true }),
        snap(3, { kcal: 3200, fat: 120, floored: true }), snap(4, { kcal: 0, logged: false, floored: true }),
        snap(5, { kcal: 0, logged: false, floored: true }), snap(6, { kcal: 0, logged: false, floored: true }),
        snap(7, { kcal: 0, logged: false, floored: true }),
      ]),
    });

    const week = card(page, "THIS WEEK");
    await expect(week).not.toContainText("genuine deficit");
    await expect(week).toContainText("actually run as a surplus");
  });

  test("while it says it is still filling in, the ring shows no colour verdict either", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "11" },
      logs: [mealAt(8, { kcal: 1100, protein: 90, carbs: 110, fat: 38 })] });

    await expect(card(page, "THIS WEEK")).toContainText("Still filling in");
    const segs = await segments(page);
    const opacities = new Set(segs.map(s => s.split("@")[1]));
    expect(segs).toHaveLength(7);
    expect(opacities).toEqual(new Set(["1"]));               // no softened, graded day
    expect(new Set(segs.map(s => s.split("@")[0])).size).toBe(1); // one colour: the empty track
  });
});

test.describe("The two cards together (05)", () => {
  test("both timeframes are on screen at once, each with its own title", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "11" },
      logs: [mealAt(8, { kcal: 1100, protein: 90, carbs: 110, fat: 38 })] });

    await expect(page.locator('div:text-is("TODAY")')).toBeVisible();
    await expect(page.locator('div:text-is("THIS WEEK")')).toBeVisible();
  });

  // They sit side by side and describe the same day at their shared edge. An unlogged closed day
  // used to show a grey "NO LOG" on the left and a full-strength red segment on the right.
  test("an unlogged closed day is not coloured in the week ring while TODAY calls it a miss", async ({ page }) => {
    await open(page, { extra: { dev_time_hour: "23" }, logs: [],
      history: resolveHistory([1, 2, 3, 4, 5, 6, 7].map(d => snap(d, { kcal: 2200 }))) });

    await expect(card(page, "TODAY")).toContainText("NO LOG");
    // The empty-track colour is whatever the ring's own background circle is painted with, so
    // this reads it off the page rather than hard-coding a palette value that both themes change.
    const track = await page.evaluate(() =>
      document.querySelectorAll("circle")[document.querySelectorAll("circle").length - 1]
        .getAttribute("stroke"));
    const segs = await segments(page);
    expect(segs).toHaveLength(7);
    expect(segs.slice(-1)[0].split("@")[0]).toBe(track); // today closes the loop, and is uncoloured
    expect(segs.slice(0, 6).every(s => s.split("@")[0] !== track)).toBe(true); // the six logged days are
  });
});
