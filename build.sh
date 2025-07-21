#!/bin/bash
set -e

echo "🔧 Building Trivia Tiles Frontend..."
cd trivia-tiles/client

# Set the API URL for production
echo "📡 Setting production API URL..."
export REACT_APP_API_URL="https://trivia-tiles-backend.onrender.com"
echo "✅ API URL set to: $REACT_APP_API_URL"

npm install
npm run build
echo "✅ Build complete!"
