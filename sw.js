const CACHE = "fuel-log-v20";
const ASSETS = ["./", "./index.html", "./manifest.json",
  "./vendor/react.js", "./vendor/react-dom.js",
  "./vendor/prop-types.js", "./vendor/recharts.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Don't skipWaiting — let the update banner prompt the user to reload.
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
      e.request.url.includes("unpkg.com")) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
