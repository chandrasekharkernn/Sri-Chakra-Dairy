#!/bin/bash

# Frontend Deployment Script

echo "🚀 Starting frontend deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' directory"
    echo ""
    echo "To deploy:"
    echo "1. Upload the contents of 'dist' folder to your hosting provider"
    echo "2. Or use one of the following platforms:"
    echo "   - Vercel: vercel --prod"
    echo "   - Netlify: netlify deploy --prod --dir=dist"
    echo "   - GitHub Pages: Push to gh-pages branch"
else
    echo "❌ Build failed!"
    exit 1
fi
