const CACHE = "fuel-log-v22";
const ASSETS = ["./", "./index.html", "./manifest.json", "./app.js",
  "./vendor/react.js", "./vendor/react-dom.js",
  "./vendor/prop-types.js", "./vendor/recharts.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // Take control immediately so stale caches don't linger.
});

self.addEventListener("message", e => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.url.includes("api.anthropic.com") ||
      e.request.url.includes("workers.dev") ||
      e.request.url.includes("openfoodfacts.org") ||
      e.request.url.includes("unpkg.com") ||
      e.request.url.includes("accounts.google.com") ||
      e.request.url.includes("googleapis.com") ||
      e.request.url.includes("supabase.co")) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : new Response("",{status:503})))
  );
});
