// The AI workout parser ("Paste log") — does a worker response turn into a logged workout?
//
// WHAT THIS DOES NOT TEST. The AI itself needs a real Supabase session: callAI sends the JWT
// and the worker rejects anonymous calls (app.jsx:1269 area). Whether the token is accepted,
// whether the model returns sensible numbers, and whether the live Cloudflare Worker itself is
// up all stay a device/production job — this harness cannot reach the real worker or Anthropic.
//
// What IS tested is everything that runs after a response arrives: the prompt fires, the JSON
// gets parsed into estimatedKcal/type/intensity/summary, the result renders, and logging it adds
// a real workout with the right kcal. Also covered: what the screen shows when the worker call
// fails outright, since parseWorkout collapses every failure — expired session, rate limit,
// timeout, bad JSON, a real outage — into one generic message (app.jsx:3331-3333).
//
// Two things are stubbed to reach it, and nothing leaves the machine: a fake session token so
// callAI does not bail out early, and the worker response itself, fulfilled locally by Playwright.
// No real account, no real sign-in, no request to Supabase — the harness rule holds.

const { test, expect } = require("@playwright/test");
const { open, shot } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

/** Open the Workout AI Parser with a canned worker response (or failure). */
async function openParserWith(page, { status = 200, estimatedKcal, type, intensity, summary } = {}) {
  await open(page, { premium: true });

  await page.route(AI_ENDPOINT, route => route.fulfill(
    status === 200
      ? {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            content: [{ text: JSON.stringify({ estimatedKcal, type, intensity, summary }) }],
          }),
        }
      : { status, contentType: "application/json", body: JSON.stringify({ error: "worker error" }) }
  ));

  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });

  await page.getByRole("button", { name: /Paste log/ }).click();
  await page.getByPlaceholder(/Paste your workout log here/).fill(
    "Back Squat 4x5 @ 100kg\nRomanian Deadlift 3x10 @ 80kg"
  );
  await page.getByRole("button", { name: /PARSE WORKOUT/ }).click();
}

test.describe("Parsing a pasted workout log", () => {
  test("a well-formed response shows the estimate and logs it", async ({ page }) => {
    await openParserWith(page, {
      estimatedKcal: 420, type: "legs", intensity: "heavy",
      summary: "Heavy squat + RDL session",
    });

    await expect(page.getByText("Heavy squat + RDL session")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("420 kcal")).toBeVisible();
    await shot(page, "workout-parse-result");

    await page.getByRole("button", { name: /LOG THIS WORKOUT/ }).click();

    // Back on the main WorkoutLogger view: the parsed session is now in the list, and its kcal
    // rolled into the burned-total badge.
    await expect(page.getByText("Heavy squat + RDL session")).toBeVisible();
    await expect(page.getByText("420 kcal burned")).toBeVisible();
  });

  test("a worker failure surfaces as a readable error, not a stuck spinner", async ({ page }) => {
    await openParserWith(page, { status: 500 });

    await expect(page.getByText(/Parse failed/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "PARSING..." })).toHaveCount(0);
  });

  test("a malformed JSON body also fails cleanly rather than logging garbage", async ({ page }) => {
    await open(page, { premium: true });

    await page.route(AI_ENDPOINT, route => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ content: [{ text: "not json at all" }] }),
    }));
    await page.evaluate(() => {
      window.supabaseClient = {
        auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
      };
    });

    await page.getByRole("button", { name: /Paste log/ }).click();
    await page.getByPlaceholder(/Paste your workout log here/).fill("Bench 3x5 @ 80kg");
    await page.getByRole("button", { name: /PARSE WORKOUT/ }).click();

    await expect(page.getByText(/Parse failed/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /LOG THIS WORKOUT/ })).toHaveCount(0);
  });
});
