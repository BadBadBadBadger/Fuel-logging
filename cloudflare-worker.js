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
  "http://localhost:3000",              // Local dev server
  "http://127.0.0.1:3000",              // Alternative localhost
];

// Server-controlled AI params — never trust the client's values.
const ALLOWED_MODELS  = new Set(["claude-sonnet-4-6"]);
const DEFAULT_MODEL   = "claude-sonnet-4-6";
const MAX_TOKENS_CAP  = 2000;

// Per-user daily rate limit (only enforced once a KV namespace `RATE_LIMIT`
// is bound to the worker — until then, auth still applies and this is skipped).
const DAILY_LIMIT = 100;

// Voucher codes (Phase A): server-side validation + entitlement writing.
// Only the /redeem endpoint uses this; the code never reaches the client.
const VALID_VOUCHERS = {
  "FREEFOODTIPS2026": { tier: "premium", status: "active", expiresAt: null, source: "voucher" },
};
const VOUCHER_SECRET = "voucher_redemption"; // Use a real secret in production (env var).

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

// Check user's entitlement status. Returns { tier, status } or null.
// Reads with the service role (bypasses RLS). Safe because `userId` comes from
// the already-verified JWT — the client cannot influence which row is read.
async function getEntitlement(env, userId) {
  try {
    const r = await fetch(
      SUPABASE_URL + "/rest/v1/entitlements?user_id=eq." + userId,
      {
        headers: {
          Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE,
          apikey: SUPABASE_ANON,
        },
      }
    );
    const data = await r.json();
    const ent = Array.isArray(data) ? data[0] : null;
    if (!ent) return null;
    const now = new Date();
    const expired = ent.expires_at && new Date(ent.expires_at) < now;
    return {
      tier: ent.tier,
      status: expired ? "expired" : ent.status,
    };
  } catch (e) {
    return null;
  }
}

// Redeem a voucher (Phase A). Service role writes to entitlements.
// If the user already has an entitlement, update it; otherwise create new.
async function redeemVoucher(env, userId, code) {
  const v = VALID_VOUCHERS[code.toUpperCase()];
  if (!v) return { error: "Invalid voucher code" };

  try {
    // Try INSERT first
    let r = await fetch(SUPABASE_URL + "/rest/v1/entitlements", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE,
        apikey: SUPABASE_ANON,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        tier: v.tier,
        status: v.status,
        expires_at: v.expiresAt,
        source: v.source,
      }),
    });

    // If unique constraint error, UPDATE instead
    if (!r.ok) {
      const errData = await r.json();
      if (errData.code === "23505") {  // PostgreSQL unique constraint violation
        r = await fetch(SUPABASE_URL + "/rest/v1/entitlements?user_id=eq." + userId, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE,
            apikey: SUPABASE_ANON,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            tier: v.tier,
            status: v.status,
            expires_at: v.expiresAt,
            source: v.source,
          }),
        });
      }
    }

    if (!r.ok) {
      const errData = await r.json();
      console.error("Supabase error:", r.status, errData);
      return { error: "Supabase error: " + (errData.message || r.statusText) };
    }
    return { success: true, tier: v.tier };
  } catch (e) {
    console.error("Redeem error:", e);
    return { error: "Failed to redeem voucher: " + e.message };
  }
}

// Delete a Supabase auth user with the service role. The ON DELETE CASCADE
// foreign keys purge every health/app table row for that user (R5). `userId`
// always comes from a verified JWT (route) or the admin list (cron) — never
// from raw client input.
async function deleteAuthUser(env, userId) {
  const r = await fetch(SUPABASE_URL + "/auth/v1/admin/users/" + userId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE,
      apikey: SUPABASE_ANON,
    },
  });
  return r.ok;
}

// 24-month inactivity sweep (LEGAL_ROADMAP retention). Pages through auth users
// and deletes any whose last sign-in (or creation, if never signed in) is older
// than the cutoff. Runs from the scheduled() cron handler.
async function sweepDormantAccounts(env) {
  const CUTOFF_MS = 1000 * 60 * 60 * 24 * 365 * 2; // ~24 months
  const cutoff = Date.now() - CUTOFF_MS;
  let page = 1, deleted = 0, scanned = 0;
  for (;;) {
    const r = await fetch(
      SUPABASE_URL + "/auth/v1/admin/users?page=" + page + "&per_page=200",
      { headers: { Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE, apikey: SUPABASE_ANON } }
    );
    if (!r.ok) break;
    const data = await r.json();
    const users = Array.isArray(data?.users) ? data.users : [];
    if (!users.length) break;
    for (const u of users) {
      scanned++;
      const last = u.last_sign_in_at || u.created_at;
      if (last && new Date(last).getTime() < cutoff) {
        if (await deleteAuthUser(env, u.id)) deleted++;
      }
    }
    if (users.length < 200) break; // last page
    page++;
    if (page > 1000) break;        // safety stop
  }
  console.log("Dormant sweep: scanned " + scanned + ", deleted " + deleted);
  return { scanned, deleted };
}

export default {
  // Cron Trigger entrypoint (configure schedule in wrangler / dashboard — see SETUP).
  async scheduled(event, env, ctx) {
    if (!env.SUPABASE_SERVICE_ROLE) return;
    ctx.waitUntil(sweepDormantAccounts(env));
  },

  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors   = corsHeaders(origin);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")    return json({ error: "Method not allowed" }, 405, cors);

    // ── Route: POST /redeem (voucher redemption, Phase A)
    const url = new URL(request.url);
    if (url.pathname === "/redeem") {
      // 1. Require a valid Supabase session.
      const authHeader = request.headers.get("Authorization") || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      if (!token) return json({ error: "Unauthorized" }, 401, cors);

      const user = await verifySupabaseUser(token);
      if (!user) return json({ error: "Unauthorized" }, 401, cors);

      // 2. Read voucher code from body.
      let body;
      try { body = await request.json(); }
      catch (e) { return json({ error: "Bad request" }, 400, cors); }

      const code = body.code ? String(body.code).trim() : "";
      if (!code) return json({ error: "No voucher code provided" }, 400, cors);

      // 3. Check if SUPABASE_SERVICE_ROLE is set (required for entitlement writes).
      if (!env.SUPABASE_SERVICE_ROLE) {
        return json(
          { error: "Voucher service not configured" },
          503,
          cors
        );
      }

      // 4. Redeem the voucher.
      const result = await redeemVoucher(env, user.id, code);
      return json(
        result.success
          ? { tier: result.tier, message: "Voucher redeemed!" }
          : result,
        result.success ? 200 : 400,
        cors
      );
    }

    // ── Route: POST /delete-account (GDPR erasure, R5)
    if (url.pathname === "/delete-account") {
      const authHeader = request.headers.get("Authorization") || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      if (!token) return json({ error: "Unauthorized" }, 401, cors);

      const user = await verifySupabaseUser(token);
      if (!user) return json({ error: "Unauthorized" }, 401, cors);

      if (!env.SUPABASE_SERVICE_ROLE)
        return json({ error: "Deletion service not configured" }, 503, cors);

      // Delete only the caller's own account (id from the verified JWT). Cascades.
      const ok = await deleteAuthUser(env, user.id);
      return ok
        ? json({ message: "Account deleted" }, 200, cors)
        : json({ error: "Deletion failed" }, 502, cors);
    }

    // ── Route: POST / (AI proxy, Phase 0+A)
    // 1. Require a valid Supabase session.
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return json({ error: "Unauthorized" }, 401, cors);

    const user = await verifySupabaseUser(token);
    if (!user) return json({ error: "Unauthorized" }, 401, cors);

    // 2. Check entitlement (Phase A). Premium required for AI.
    const ent = await getEntitlement(env, user.id);
    if (!ent || ent.status !== "active" || ent.tier !== "premium") {
      return json(
        { error: "Premium account required" },
        403,
        cors
      );
    }

    // 3. Per-user rate limit (no-op until KV is bound).
    if (!(await withinRateLimit(env, user.id)))
      return json({ error: "Daily AI limit reached" }, 429, cors);

    // 4. Sanitise the body — never trust client-supplied model / max_tokens.
    let body;
    try { body = await request.json(); }
    catch (e) { return json({ error: "Bad request" }, 400, cors); }

    const model     = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
    const maxTokens = Math.min(Math.max(1, Number(body.max_tokens) || 500), MAX_TOKENS_CAP);
    const messages  = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) return json({ error: "Bad request" }, 400, cors);

    // 5. Proxy to Anthropic with server-controlled params.
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
//
// SETUP — account deletion + retention sweep (LEGAL_ROADMAP Phase B)
//   Both reuse the SERVICE_ROLE secret already needed by /redeem:
//     Workers & Pages → worker → Settings → Variables and Secrets →
//     add secret SUPABASE_SERVICE_ROLE = <your Supabase service_role key>.
//
//   /delete-account : POST with a valid Bearer JWT → deletes the caller's
//   own account (cascades to all tables). No extra setup beyond the secret.
//
//   Retention cron (24-month dormant sweep) : add a Cron Trigger so scheduled()
//   runs. In the dashboard: worker → Settings → Triggers → Cron Triggers → Add,
//   e.g. weekly "0 3 * * 0". Or in wrangler.toml:
//       [triggers]
//       crons = ["0 3 * * 0"]
//   Until a trigger exists, scheduled() simply never fires (no harm); deletion
//   on request still works. Test manually with: npx wrangler dev --test-scheduled
//   then curl "http://localhost:8787/__scheduled".
// ─────────────────────────────────────────────────────────────
