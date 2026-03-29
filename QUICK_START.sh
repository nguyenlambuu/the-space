#!/bin/bash
# Quick Start Script for The Space Project

echo "🚀 The Space Project - Quick Start"
echo "=================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local - please update with your Supabase credentials"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with Supabase credentials"
echo "2. Read SUPABASE_SETUP.md for database setup"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
