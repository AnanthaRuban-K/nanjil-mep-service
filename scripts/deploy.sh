#!/bin/bash

# Nanjil MEP Service Deployment Script for Coolify

set -e

echo "🚀 Starting Nanjil MEP Service deployment..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set"
    exit 1
fi

if [ -z "$CLERK_SECRET_KEY" ]; then
    echo "❌ CLERK_SECRET_KEY is not set"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build applications
echo "🔨 Building applications..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Seed database (only on first deployment)
if [ "$FIRST_DEPLOYMENT" = "true" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo "✅ Deployment completed successfully!"