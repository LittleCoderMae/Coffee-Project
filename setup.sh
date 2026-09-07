#!/bin/bash

# Brew Bakes Coffee Shop Setup Script
# Run this script to set up the development environment

echo "🚀 Brew Bakes Coffee Shop Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"
echo ""

# Navigate to server directory
cd server

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your credentials."
    echo ""
    echo "📝 Edit the following file with your API keys:"
    echo "   - Stripe API keys"
    echo "   - Yango delivery credentials"
    echo "   - MongoDB connection string (if not local)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit server/.env with your API credentials"
echo "   2. Start MongoDB: mongod (or brew services start mongodb-community)"
echo "   3. Start the server: npm start"
echo "   4. Open http://localhost:5000 in your browser"
echo ""
echo "🔐 Admin Login:"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""
