// ─────────────────────────────────────────────────────────────
// Fuel Log — Cloudflare Worker (HARDENED — SECURITY_ROADMAP Phase 0)
// Proxies requests to Anthropic so the key never hits the client.
//
// Phase 0 controls (vs. the old open proxy):
//   1. Requires a valid Supabase session (JWT) — no anonymous access.
//   2. Server-side model allowlist + max_tokens cap — client can't pick
//      an expensive model or huge token count.
//   3. Optional per-user daily rate limit (activates once a KV namespace
//      named RATE_LIMIT is bound — see SETUP at bottom).
//   4. CORS locked to the app's own origin(s).
//   5. Generic error messages — no internal detail leaked.
//
// Secrets / config:
//   - ANTHROPIC_KEY  → Cloudflare secret (Settings → Variables and Secrets).
//   - SUPABASE_URL / SUPABASE_ANON are public (the anon key already ships in
//     index.html) so they live here as constants — no setup needed.
//
// Deploy order matters: deploy THIS worker first, then the new app.js, so the
// CORS preflight accepts the Authorization header before the app starts
// sending it. Cached clients on the old app.js will get 401 until they update.
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL  = "https://hvohicddolqpcgzgrbwc.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2b2hpY2Rkb2xxcGNnemdyYndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDI4NTIsImV4cCI6MjA5MjcxODg1Mn0.NS5cRD-CHLV6_I9BiNmH-tN4kicbgXBh4gb_xl-65fY";

// CORS: the app's own origins. The JWT is the real gate; this is defence-in-depth.
const ALLOWED_ORIGINS = [
  "https://badbadbadbadger.github.io", // GitHub Pages (installed PWA / TWA share this origin)
];

// Server-controlled AI params — never trust the client's values.
const ALLOWED_MODELS  = new Set(["claude-sonnet-4-6"]);
const DEFAULT_MODEL   = "claude-sonnet-4-6";
const MAX_TOKENS_CAP  = 2000;

// Per-user daily rate limit (only enforced once a KV namespace `RATE_LIMIT`
// is bound to the worker — until then, auth still applies and this is skipped).
const DAILY_LIMIT = 100;

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin":  allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

// Validate a Supabase access token by asking Supabase who it belongs to.
// Returns the user object (with `.id`) on success, or null. This transparently
// handles both HS256 and asymmetric JWT signing without needing the secret.
async function verifySupabaseUser(token) {
  try {
    const r = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { Authorization: "Bearer " + token, apikey: SUPABASE_ANON },
    });
    if (!r.ok) return null;
    const u = await r.json();
    return u && u.id ? u : null;
  } catch (e) {
    return null;
  }
}

async function withinRateLimit(env, userId) {
  if (!env.RATE_LIMIT) return true; // KV not bound yet — skip (auth still enforced)
  try {
    const key   = "rl:" + userId + ":" + new Date().toISOString().slice(0, 10);
    const count = parseInt((await env.RATE_LIMIT.get(key)) || "0", 10);
    if (count >= DAILY_LIMIT) return false;
    await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 172800 });
    return true;
  } catch (e) {
    return true; // never let a KV hiccup block a legitimate user
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors   = corsHeaders(origin);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")    return json({ error: "Method not allowed" }, 405, cors);

    // 1. Require a valid Supabase session.
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return json({ error: "Unauthorized" }, 401, cors);

    const user = await verifySupabaseUser(token);
    if (!user) return json({ error: "Unauthorized" }, 401, cors);

    // (Phase A will add an entitlement lookup here: no active premium → 403.)

    // 2. Per-user rate limit (no-op until KV is bound).
    if (!(await withinRateLimit(env, user.id)))
      return json({ error: "Daily AI limit reached" }, 429, cors);

    // 3. Sanitise the body — never trust client-supplied model / max_tokens.
    let body;
    try { body = await request.json(); }
    catch (e) { return json({ error: "Bad request" }, 400, cors); }

    const model     = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
    const maxTokens = Math.min(Math.max(1, Number(body.max_tokens) || 500), MAX_TOKENS_CAP);
    const messages  = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) return json({ error: "Bad request" }, 400, cors);

    // 4. Proxy to Anthropic with server-controlled params.
    try {
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         env.ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
      });
      const data = await upstream.json();
      return json(data, upstream.status, cors);
    } catch (e) {
      return json({ error: "Upstream error" }, 502, cors);
    }
  },
};

// ─────────────────────────────────────────────────────────────
// SETUP — enabling the per-user rate limit (optional, recommended)
//   1. Cloudflare Dashboard → Storage & Databases → KV → Create namespace
//      (name it e.g. "fuellog-rate-limit").
//   2. Workers & Pages → your worker → Settings → Bindings → Add → KV namespace.
//      Variable name MUST be: RATE_LIMIT   → select the namespace above → Save.
//   3. Re-deploy this worker. The limit (DAILY_LIMIT) now applies per user/day.
//   Until step 2 is done, the worker runs fine and auth is still enforced;
//   only the rate limit is skipped.
//
// BACKSTOP — set a hard spend cap in the Anthropic Console (Billing → Limits)
// so even a novel abuse path can't run an unbounded bill.
// ─────────────────────────────────────────────────────────────
