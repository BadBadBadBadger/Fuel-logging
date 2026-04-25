const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".ico":  "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

http.createServer((req, res) => {
  let url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";

  const file = path.join(ROOT, url);
  const ext  = path.extname(file);

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[ext] || "text/plain", "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  Fuel Log running at http://localhost:${PORT}`);
  console.log(`  Mobile preview:    http://localhost:${PORT}/preview.html\n`);
});
