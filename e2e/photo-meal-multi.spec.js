// Several photos, and photos from the gallery (features/logging/10).
//
// The founder's feedback (2026-11-20): "I can't select a photo I have in storage" — the one 📷
// input carried capture="environment", which on Android opens the camera and nothing else — and
// "I can only add one photo", when the back of a packet often has no product name on it.
//
// Same stubbing as photo-meal-name.spec.js: a fake session token, the worker route fulfilled
// locally. Nothing leaves the machine. The "photos" are the app's own icons.

const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { open, TODAY_KEY_EXPR } = require("./harness");

const AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";
const IMG = ["icon-192.png", "icon-512.png", "icon-192-maskable.png", "icon-512-maskable.png"]
  .map(f => path.join(__dirname, "..", f));

const REPLY = { meal: "Müller Corner strawberry yogurt", items: [
  { name: "Müller Corner strawberry yogurt 124g", kcal: 136, protein: 5.6, carbs: 19, fat: 3.9,
    confidence: 92, ask: null, reasoning: "photos 1+2: front and label" },
] };

async function openAILog(page) {
  const sent = [];
  await open(page, { premium: true });
  await page.route(AI_ENDPOINT, route => (sent.push(route.request().postData() || ""), route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ content: [{ text: JSON.stringify(REPLY) }] }),
  })));
  await page.evaluate(() => {
    window.supabaseClient = {
      auth: { getSession: async () => ({ data: { session: { access_token: "e2e-fake-token" } } }) },
    };
  });
  await page.getByRole("button", { name: /AI LOG/ }).click();
  return sent;
}
const thumbs = page => page.getByRole("listitem").locator("img");
const picker = page => page.getByTestId("photo-gallery");

test.describe("Photos from the gallery, and more than one (logging/10)", () => {
  test("📷 goes straight to the camera; 🖼 opens the photo picker, several at once", async ({ page }) => {
    // Two icons because Android's own picker (Google Photos) has no camera — founder's phone.
    await openAILog(page);
    const gallery = picker(page), camera = page.getByTestId("photo-camera");
    expect(await gallery.getAttribute("capture")).toBeNull(); // no forced camera: the reel is offered
    expect(await gallery.evaluate(e => e.multiple)).toBe(true);
    expect(await gallery.getAttribute("accept")).toBe("image/*");
    expect(await camera.getAttribute("capture")).toBe("environment");
    await expect(page.getByRole("button", { name: "Take a photo" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Choose photos" })).toBeEnabled();
  });

  test("the screen says one sentence, not paragraphs", async ({ page }) => {
    await openAILog(page);
    await expect(page.getByText("Describe it, snap it, or both — photos go to our AI once and are never stored.")).toBeVisible();
    await picker(page).setInputFiles(IMG[0]);
    await expect(page.getByText(/Packet missing its name|Anything you type here|Only include food/)).toHaveCount(0);
  });

  test("two photos go to the model as one estimate, one image block each, then the prompt", async ({ page }) => {
    const sent = await openAILog(page);
    await picker(page).setInputFiles(IMG.slice(0, 2));
    await expect(thumbs(page)).toHaveCount(2);
    await expect(page.getByRole("img", { name: "Photo 2 of 2" })).toBeVisible();
    await page.getByRole("button", { name: "ANALYSE 2 PHOTOS" }).click();
    await expect(page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ })).toBeVisible();
    expect(sent).toHaveLength(1);
    const content = JSON.parse(sent[0]).messages[0].content;
    expect(content).toHaveLength(3);
    for (const b of content.slice(0, 2)) {
      expect(b.type).toBe("image");
      expect(b.source.type).toBe("base64");
      expect(b.source.media_type).toBe("image/jpeg");
      expect(b.source.data.length).toBeGreaterThan(100);
    }
    expect(content[0].source.data).not.toBe(content[1].source.data); // in pick order, not a copy
    expect(content[2].type).toBe("text");
    expect(content[2].text).toContain("2 photos are attached");
  });

  test("a camera shot after a gallery pick joins the strip instead of replacing it", async ({ page }) => {
    await openAILog(page);
    await picker(page).setInputFiles(IMG[0]);
    await expect(page.getByRole("button", { name: "ANALYSE PHOTO" })).toBeVisible();
    await page.getByTestId("photo-camera").setInputFiles(IMG[1]);
    await expect(thumbs(page)).toHaveCount(2);
    await expect(page.getByRole("button", { name: "ANALYSE 2 PHOTOS" })).toBeVisible();
  });

  test("picking more than three keeps the first three, says so, and disables both photo buttons", async ({ page }) => {
    await openAILog(page);
    await picker(page).setInputFiles(IMG);
    await expect(thumbs(page)).toHaveCount(3);
    await expect(page.getByText("Up to 3 photos per meal — 1 wasn't added.")).toBeVisible();
    await expect(page.getByRole("button", { name: "3 photos max" })).toHaveCount(2);
    for (const b of await page.getByRole("button", { name: "3 photos max" }).all()) await expect(b).toBeDisabled();
  });

  test("removing one photo drops just that one; removing all goes back to a typed meal", async ({ page }) => {
    const sent = await openAILog(page);
    await picker(page).setInputFiles(IMG.slice(0, 3));
    await page.getByRole("button", { name: "Remove photo 2 of 3" }).click();
    await expect(thumbs(page)).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Choose photos" })).toBeEnabled();
    await page.getByRole("button", { name: "Remove photo 1 of 2" }).click();
    await page.getByRole("button", { name: "Remove photo 1 of 1" }).click();
    await expect(thumbs(page)).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "Describe your meal" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ANALYSE MEAL" })).toBeDisabled();
    expect(sent).toHaveLength(0);
  });

  test("an unreadable file among good ones keeps the good ones", async ({ page }) => {
    await openAILog(page);
    await picker(page).setInputFiles([
      { name: "a.png", mimeType: "image/png", buffer: fs.readFileSync(IMG[0]) },
      { name: "broken.png", mimeType: "image/png", buffer: Buffer.from("not an image") },
      { name: "b.png", mimeType: "image/png", buffer: fs.readFileSync(IMG[1]) },
    ]);
    await expect(thumbs(page)).toHaveCount(2);
    await expect(page.getByText(/1 photo couldn't be read/)).toBeVisible();
    await expect(page.getByRole("button", { name: "ANALYSE 2 PHOTOS" })).toBeEnabled();
  });

  test("the logged entry carries the meal, never the photos", async ({ page }) => {
    await openAILog(page);
    await picker(page).setInputFiles(IMG.slice(0, 2));
    await page.getByRole("button", { name: "ANALYSE 2 PHOTOS" }).click();
    await page.getByRole("button", { name: /LOG ALL AS ONE ENTRY/ }).click();
    await expect(page.getByText("CONSUMED", { exact: true })).toBeVisible({ timeout: 15_000 });
    const raw = await page.evaluate(k => localStorage.getItem("logs__" + eval(k)) || "[]", TODAY_KEY_EXPR);
    const logs = JSON.parse(raw);
    expect(logs).toHaveLength(1);
    expect(logs[0].name).toBe("Müller Corner strawberry yogurt");
    expect(logs[0].source).toBe("ai-photo");
    expect(raw).not.toMatch(/base64|preview|data:image|photos/);
  });
});
