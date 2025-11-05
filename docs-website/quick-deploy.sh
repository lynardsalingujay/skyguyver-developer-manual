#!/bin/bash

echo "🚀 SkyGuyver Documentation - Quick Deploy Script"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the docs-website directory"
    echo "Usage: cd docs-website && ./quick-deploy.sh"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building documentation..."
npm run docs:build

echo "✅ Build completed successfully!"
echo ""
echo "📁 Built files are ready in: docs/.vitepress/dist/"
echo ""
echo "🌐 Manual Deploy Instructions:"
echo "1. Go to https://netlify.com"
echo "2. Drag & drop the 'docs/.vitepress/dist' folder"
echo "3. Your password-protected site will be live!"
echo ""
echo "🔐 Password: SkyGuyver2025!"
echo ""
echo "📊 Site includes:"
echo "  ✅ Password protection"
echo "  ✅ All documentation sections"
echo "  ✅ Mobile-responsive design"
echo "  ✅ Search functionality"
echo "  ✅ Professional presentation"
echo ""
echo "🎉 Ready to deploy!"