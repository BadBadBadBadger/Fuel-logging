// ─────────────────────────────────────────────────────────────
// Fuel Log — Cloudflare Worker
// Proxies requests to Anthropic API so the key never hits the client
//
// Setup:
// 1. Cloudflare Dashboard → Workers & Pages → Create Worker
// 2. Paste this entire file
// 3. Deploy
// 4. Settings → Variables and Secrets → Add secret: ANTHROPIC_KEY
// 5. Copy the worker URL (e.g. https://fuellog.YOUR-SUBDOMAIN.workers.dev)
// 6. In app.jsx, update AI_ENDPOINT to your worker URL
// 7. Run build.sh, push to GitHub
// ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin":  "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         env.ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type":                "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type":                "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
