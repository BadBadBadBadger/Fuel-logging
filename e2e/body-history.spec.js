// Body measurements in History, and what a save reports back (features/body/02).
// Presentation and feedback only — the arithmetic (measurementSiteChanges,
// bodyFatWindowChange, csvRows) is owned by __tests__/logic.test.js. What this file asserts
// is what the SCREEN says: which day rows carry body data, that a day without any renders
// nothing in its place, what the day detail shows, and what a save reports back.

const { test, expect } = require("@playwright/test");
const { open, shot, PROFILE } = require("./harness");

// Local date parts, the way the app keys a day (app.jsx todayKey) — NOT toISOString(),
// which is UTC and lands on the wrong day for an hour every night under BST.
const key = n => {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};

const day = (n, over = {}) => ({ date: key(n), mode: "cut", kcal: 2100, protein: 180,
  carbs: 200, fat: 70, water: 6, training: false, logs: [], ...over });

const reading = (n, over = {}) => ({ date: key(n), neck: 40, waist: 95, hip: null,
  formula: "male", computed_bf: 22.2, ...over });

const openHistory = async page => {
  await expect(page.getByText("CONSUMED")).toBeVisible({ timeout: 15_000 });
  await page.locator('button:has-text("📊")').click();
  await expect(page.getByText("HISTORY")).toBeVisible();
};

// The measurement form opens from the status line, or from the nudge's "Log now" once a
// week has passed since the last reading — both are the same form.
const openMeasurementForm = async page => {
  const nudge = page.getByRole("button", { name: "Log now" });
  if (await nudge.count()) await nudge.first().click();
  else await page.getByText(/Log your first body measurement|Measured/).click();
  await expect(page.getByPlaceholder("neck cm")).toBeVisible();
};

test.describe("History day rows", () => {
  test("a day I weighed carries that weight on its existing sub-line", async ({ page }) => {
    await open(page, {
      history: [day(3), day(2), day(1)],
      weighIns: [{ date: key(2), weight: 98.5 }],
    });
    await openHistory(page);

    await expect(page.getByText("⚖️98.5kg")).toBeVisible();
    await shot(page, "history-day-row-weight");
  });

  test("a day I measured also carries that day's estimated body fat %", async ({ page }) => {
    await open(page, {
      history: [day(3), day(2), day(1)],
      weighIns: [{ date: key(2), weight: 98.5 }],
      extra: { bodymeasurements: JSON.stringify([reading(2)]) },
    });
    await openHistory(page);

    await expect(page.getByText("📏22.2%")).toBeVisible();
    await shot(page, "history-day-row-weight-and-measurement");
  });

  test("days without body data show nothing in its place — no dash, no empty slot", async ({ page }) => {
    await open(page, {
      history: [day(3), day(2), day(1)],
      weighIns: [{ date: key(2), weight: 98.5 }],
      extra: { bodymeasurements: JSON.stringify([reading(2)]) },
    });
    await openHistory(page);

    // Exactly one row of the three carries each marker. The chart toggles above read
    // "⚖️ Weight" and "📏 Body Fat %", so a digit straight after the marker matches only a
    // day row.
    await expect(page.getByText(/⚖️\d/)).toHaveCount(1);
    await expect(page.getByText(/📏\d/)).toHaveCount(1);
    await expect(page.getByText("—", { exact: true })).toHaveCount(0);
  });
});

test.describe("History day detail", () => {
  test("a date with body data gets a body card listing the weight, the sites and the estimate",
    async ({ page }) => {
      await open(page, {
        history: [day(3), day(2), day(1)],
        weighIns: [{ date: key(2), weight: 98.5 }],
        extra: { bodymeasurements: JSON.stringify([reading(2)]) },
      });
      await openHistory(page);
      await page.getByText("📏22.2%").click();

      await expect(page.getByText("BODY", { exact: true })).toBeVisible();
      await expect(page.getByText("Weight", { exact: true })).toBeVisible();
      await expect(page.getByText("98.5 kg")).toBeVisible();
      await expect(page.getByText("Neck", { exact: true })).toBeVisible();
      await expect(page.getByText("40 cm")).toBeVisible();
      await expect(page.getByText("Waist", { exact: true })).toBeVisible();
      await expect(page.getByText("95 cm")).toBeVisible();
      await expect(page.getByText("Estimated body fat")).toBeVisible();
      await expect(page.getByText("Hip", { exact: true })).toHaveCount(0); // male reading

      await shot(page, "history-day-detail-body-card");
    });

  test("a date with no body data gets no body card at all", async ({ page }) => {
    await open(page, {
      history: [day(3), day(2), day(1)],
      weighIns: [{ date: key(2), weight: 98.5 }],
      extra: { bodymeasurements: JSON.stringify([reading(2)]) },
    });
    await openHistory(page);
    await page.getByText("⚖️98.5kg").click();      // the day that HAS body data
    await expect(page.getByText("BODY", { exact: true })).toBeVisible();

    await page.locator('button:has-text("‹")').click(); // step back one day — nothing logged there
    await expect(page.getByText("BODY", { exact: true })).toHaveCount(0);
    await expect(page.getByText(/no measurement/i)).toHaveCount(0);
  });

  test("a female reading's day detail lists hip too", async ({ page }) => {
    await open(page, {
      profile: { ...PROFILE, sex: "female" },
      history: [day(2), day(1)],
      extra: { bodymeasurements: JSON.stringify([
        reading(2, { formula: "female", neck: 32, waist: 70, hip: 95, computed_bf: 28.4 })]) },
    });
    await openHistory(page);
    await page.getByText("📏28.4%").click();

    await expect(page.getByText("Hip", { exact: true })).toBeVisible();
    await expect(page.getByText("95 cm")).toBeVisible();
  });
});

test.describe("What a save reports back", () => {
  test("it reports each site's change, and how long ago the reading it compares against was",
    async ({ page }) => {
      await open(page, { extra: { bodymeasurements: JSON.stringify([reading(7)]) } });
      await openMeasurementForm(page);

      await page.getByPlaceholder("neck cm").fill("40.2");
      await page.getByPlaceholder("waist cm").fill("94.5");
      await page.getByRole("button", { name: "Log measurement" }).click();

      await expect(page.getByText("Since your last reading, 7 days ago:")).toBeVisible();
      await expect(page.getByText("-0.5cm")).toBeVisible();   // waist, smaller
      await expect(page.getByText("+0.2cm")).toBeVisible();   // neck, larger
      await shot(page, "measurement-save-changes");
    });

  test("a sub-centimetre change is shown at full size, with no threshold hiding it",
    async ({ page }) => {
      // DECIDED, founder, 2026-09-11 — a proposed 1cm threshold was overruled outright.
      await open(page, { extra: { bodymeasurements: JSON.stringify([reading(7)]) } });
      await openMeasurementForm(page);

      await page.getByPlaceholder("neck cm").fill("40");
      await page.getByPlaceholder("waist cm").fill("94.8");
      await page.getByRole("button", { name: "Log measurement" }).click();

      await expect(page.getByText("-0.2cm")).toBeVisible();
      await expect(page.getByText("no change")).toBeVisible(); // neck, unmoved
    });

  test("waist is coloured by direction; neck is shown at full size but not coloured",
    async ({ page }) => {
      await open(page, { extra: { bodymeasurements: JSON.stringify([reading(7)]) } });
      await openMeasurementForm(page);

      await page.getByPlaceholder("neck cm").fill("40.2");
      await page.getByPlaceholder("waist cm").fill("94.5");
      await page.getByRole("button", { name: "Log measurement" }).click();

      const colourOf = sel => page.locator(sel).evaluate(el => getComputedStyle(el).color);
      const accent = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--accent)";
        document.body.appendChild(probe);
        const c = getComputedStyle(probe).color;
        probe.remove();
        return c;
      });

      expect(await colourOf('strong[data-site="waist"]')).toBe(accent);
      expect(await colourOf('strong[data-site="neck"]')).not.toBe(accent);
    });

  test("the first ever reading says there is nothing to compare it with yet", async ({ page }) => {
    await open(page);
    await openMeasurementForm(page);

    await page.getByPlaceholder("neck cm").fill("38");
    await page.getByPlaceholder("waist cm").fill("83");
    await page.getByRole("button", { name: "Log measurement" }).click();

    await expect(page.getByText("First reading — your next one will show what has changed.")).toBeVisible();
    await expect(page.getByText(/Since your last reading/)).toHaveCount(0);
    await shot(page, "measurement-save-first-reading");
  });

  test("no body-fat change is reported between two readings a week apart", async ({ page }) => {
    await open(page, { extra: { bodymeasurements: JSON.stringify([reading(7)]) } });
    await openMeasurementForm(page);

    await page.getByPlaceholder("neck cm").fill("40");
    await page.getByPlaceholder("waist cm").fill("94");
    await page.getByRole("button", { name: "Log measurement" }).click();

    await expect(page.getByText("Estimated body fat:")).toBeVisible();
    await expect(page.getByText(/points of body fat/)).toHaveCount(0);
  });

  test("a body-fat change IS reported once a reading a month old exists", async ({ page }) => {
    await open(page, { extra: { bodymeasurements: JSON.stringify([
      reading(35, { waist: 98, computed_bf: 23.2 }), reading(7, { waist: 96, computed_bf: 22.6 })]) } });
    await openMeasurementForm(page);

    await page.getByPlaceholder("neck cm").fill("40");
    await page.getByPlaceholder("waist cm").fill("94");
    await page.getByRole("button", { name: "Log measurement" }).click();

    // Names the comparison date rather than claiming "last month" — the old copy subtracted a
    // reading with no upper age limit, so a six-month-old reading was reported as last month's.
    await expect(page.getByText(/points of body fat vs \d+ [A-Z][a-z]{2}/)).toBeVisible();
    await shot(page, "measurement-save-window-change");
  });
});

test.describe("The 📐 Tape chart", () => {
  // Four weekly readings: enough for the rolling average to exist (TREND_MIN_POINTS = 4).
  const weekly = (n, over = {}) => Array.from({ length: n }, (_, i) =>
    reading(7 * (n - 1 - i), { waist: 96 - i, computed_bf: 23 - i * 0.4, ...over }));

  test("the chip sits alongside the other two and selecting it clears them", async ({ page }) => {
    await open(page, {
      history: [day(2), day(1)],
      weighIns: [{ date: key(2), weight: 98.5 }],
      extra: { bodymeasurements: JSON.stringify(weekly(4)) },
    });
    await openHistory(page);

    const tape = page.getByRole("button", { name: "📐 Tape" });
    const bodyFat = page.getByRole("button", { name: "📏 Body Fat %" });
    await expect(tape).toBeVisible();
    await expect(page.getByRole("button", { name: "⚖️ Weight" })).toBeVisible();

    await bodyFat.click();
    await tape.click();
    // Only one body chart is selected at a time — the Tape chip is now the selected one.
    await expect(page.locator(".recharts-line")).toHaveCount(4); // waist + neck, raw + average
    // Recharts grows each line from the left over ~1.5s; screenshot after it settles or the
    // image is the animation's first frame, not the chart.
    await page.waitForTimeout(1800);
    await shot(page, "history-tape-chart", { full: false });
  });

  test("no tape chip before any measurement has been logged", async ({ page }) => {
    await open(page, { history: [day(2), day(1)] });
    await openHistory(page);
    await expect(page.getByRole("button", { name: "📐 Tape" })).toHaveCount(0);
  });

  test("a female set draws hip as a third site on the same axis", async ({ page }) => {
    await open(page, {
      profile: { ...PROFILE, sex: "female" },
      history: [day(2), day(1)],
      extra: { bodymeasurements: JSON.stringify(
        weekly(4, { formula: "female", neck: 32, hip: 102 })) },
    });
    await openHistory(page);
    await page.getByRole("button", { name: "📐 Tape" }).click();

    await expect(page.locator(".recharts-line")).toHaveCount(6); // 3 sites, raw + average
    await page.waitForTimeout(1800);
    await shot(page, "history-tape-chart-female", { full: false });
  });

  test("male readings draw no hip line at all", async ({ page }) => {
    await open(page, {
      history: [day(2), day(1)],
      extra: { bodymeasurements: JSON.stringify(weekly(4)) },
    });
    await openHistory(page);
    await page.getByRole("button", { name: "📐 Tape" }).click();

    await expect(page.locator(".recharts-line")).toHaveCount(4);
  });
});

test.describe("The Body Fat % tooltip as a diagnostic", () => {
  const weekly = n => Array.from({ length: n }, (_, i) =>
    reading(7 * (n - 1 - i), { waist: 96 - i, computed_bf: 23 - i * 0.4 }));

  // Hover the plotted point itself rather than a fraction of the container's width — the
  // chart's left margin is negative, so a fraction near the left edge lands outside the plot
  // area and activates nothing. Only the raw body-fat line draws dots, so `.recharts-line-dot`
  // is exactly the readings, oldest first.
  const hoverPoint = async (page, index) => {
    const dot = page.locator(".recharts-line-dot").nth(index);
    await expect(dot).toBeVisible();
    const box = await dot.boundingBox();
    await page.mouse.move(box.x - 40, box.y - 40);           // move from somewhere else first
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  };

  test("it reports the raw sites for that reading, waist first", async ({ page }) => {
    await open(page, { history: [day(2), day(1)],
      extra: { bodymeasurements: JSON.stringify(weekly(4)) } });
    await openHistory(page);
    await page.getByRole("button", { name: "📏 Body Fat %" }).click();
    await hoverPoint(page, 3);

    await expect(page.getByText(/waist 93 · neck 40/)).toBeVisible();
    await shot(page, "history-body-fat-tooltip", { full: false });
  });

  test("it says how long since the previous reading, and says nothing on the first one",
    async ({ page }) => {
      await open(page, { history: [day(2), day(1)],
        extra: { bodymeasurements: JSON.stringify(weekly(4)) } });
      await openHistory(page);
      await page.getByRole("button", { name: "📏 Body Fat %" }).click();

      await hoverPoint(page, 3);
      await expect(page.getByText("7 days later")).toBeVisible();

      await hoverPoint(page, 0);           // the oldest reading — nothing before it
      await expect(page.getByText("Body fat 23%")).toBeVisible(); // the card IS showing…
      await expect(page.getByText(/days later/)).toHaveCount(0);  // …it just omits the row
    });

  test("it states what the average is built from, and omits it before one exists",
    async ({ page }) => {
      await open(page, { history: [day(2), day(1)],
        extra: { bodymeasurements: JSON.stringify(weekly(4)) } });
      await openHistory(page);
      await page.getByRole("button", { name: "📏 Body Fat %" }).click();

      await hoverPoint(page, 3);
      await expect(page.getByText(/avg of last 4:/)).toBeVisible();

      await hoverPoint(page, 0);           // only one reading in the window so far
      await expect(page.getByText("Body fat 23%")).toBeVisible(); // the card IS showing…
      await expect(page.getByText(/avg of last/)).toHaveCount(0); // …it just omits the row
    });

  test("a male reading's tooltip shows no hip and no dash in its place", async ({ page }) => {
    await open(page, { history: [day(2), day(1)],
      extra: { bodymeasurements: JSON.stringify(weekly(4)) } });
    await openHistory(page);
    await page.getByRole("button", { name: "📏 Body Fat %" }).click();
    await hoverPoint(page, 3);

    await expect(page.getByText(/waist/)).toBeVisible();
    await expect(page.getByText(/hip/)).toHaveCount(0);
  });
});

test.describe("CSV export", () => {
  test("the export button is offered once there is history to export", async ({ page }) => {
    // The row shape itself is asserted in __tests__/logic.test.js (csvRows) — a data: URL
    // download is not something this harness can open.
    await open(page, { history: [day(2), day(1)] });
    await openHistory(page);
    await expect(page.getByRole("button", { name: "📥 CSV" })).toBeVisible();
  });
});
