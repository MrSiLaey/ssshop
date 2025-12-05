#!/bin/bash

# Build script for Soft Stop Shop Docker image

echo "🚀 Building Soft Stop Shop Docker Image..."
echo ""

# Build the Docker image
docker build -t soft-stop-shop:latest .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📦 Image: soft-stop-shop:latest"
    echo ""
    echo "🔧 Run commands:"
    echo ""
    echo "  # Run with docker-compose (recommended):"
    echo "  docker-compose up -d"
    echo ""
    echo "  # Or run standalone (requires external database):"
    echo "  docker run -d -p 3000:3000 \\"
    echo "    -e DATABASE_URL='your-database-url' \\"
    echo "    -e NEXTAUTH_SECRET='your-secret' \\"
    echo "    -e NEXTAUTH_URL='http://localhost:3000' \\"
    echo "    --name soft-stop-shop \\"
    echo "    soft-stop-shop:latest"
    echo ""
    echo "  # Run database migrations:"
    echo "  docker-compose exec app npx prisma migrate deploy"
    echo ""
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
