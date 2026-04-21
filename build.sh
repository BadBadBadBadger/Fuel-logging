#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Fuel Log — Build Script
# Run this from the fuel-log-src/ directory
# ─────────────────────────────────────────────────────────────

echo "🔥 Fuel Log build starting..."

# Check Node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# Install Babel if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing Babel..."
  npm install --save-dev @babel/core @babel/cli @babel/preset-react @babel/preset-env
fi

# Transpile JSX → plain JS
echo "⚙️  Transpiling app.jsx..."
npx babel app.jsx \
  --presets @babel/preset-react,@babel/preset-env \
  --out-file app.js

if [ $? -ne 0 ]; then
  echo "❌ Transpile failed. Check app.jsx for syntax errors."
  exit 1
fi

echo "✅ app.js built ($(wc -l < app.js) lines)"
echo ""
echo "📁 Files ready to push to GitHub:"
echo "   index.html"
echo "   app.js"
echo "   manifest.json"
echo "   sw.js"
echo "   icon-192.png"
echo "   icon-512.png"
echo ""
echo "🚀 Push and GitHub Pages will serve it live."
