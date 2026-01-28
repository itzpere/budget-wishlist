#!/bin/bash

# Setup script for Budget & Wishlist Manager

echo "🚀 Setting up Budget & Wishlist Manager..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate database migrations
echo "🗄️  Generating database migrations..."
npm run db:generate

# Run migrations
echo "🔄 Running database migrations..."
npm run db:migrate

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To start with Docker:"
echo "  docker-compose up -d"
