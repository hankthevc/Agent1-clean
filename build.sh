#!/bin/bash
set -e

echo "🔧 Building Trivia Tiles Frontend..."
cd trivia-tiles/client
npm install
npm run build
echo "✅ Build complete!"
