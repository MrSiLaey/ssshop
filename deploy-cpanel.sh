#!/bin/bash
# SSShop cPanel Auto Deploy Script
# Usage: Copy this script to server and run it

echo "🚀 SSShop Auto Deploy Script"
echo "============================"

# Configuration - EDIT THESE VALUES
DB_USER="zsajcpsz_ssshop"
DB_PASS="YOUR_DB_PASSWORD"
DB_NAME="zsajcpsz_ssshop"
DOMAIN="yourdomain.z.com"
SECRET_KEY=$(openssl rand -base64 32)

# Paths
APP_DIR="/home/zsajcpsz/ssshop"
NODE_ENV_PATH="/home/zsajcpsz/nodevenv/ssshop/22/bin/activate"

echo ""
echo "📁 Step 1: Setting up directory..."
cd $APP_DIR

# Check if files exist
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please extract ssshop_cpanel.zip first:"
    echo "  1. Upload ssshop_cpanel.zip to $APP_DIR"
    echo "  2. unzip ssshop_cpanel.zip"
    echo "  3. mv cpanel_upload/* ."
    echo "  4. rm -rf cpanel_upload ssshop_cpanel.zip"
    exit 1
fi

echo "✅ Files found"

echo ""
echo "📝 Step 2: Creating .env file..."
cat > .env << EOF
# Database
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}"

# NextAuth
NEXTAUTH_URL="https://${DOMAIN}"
NEXTAUTH_SECRET="${SECRET_KEY}"

# App
NODE_ENV="production"
PORT=3000
HOSTNAME="0.0.0.0"
EOF

echo "✅ .env file created"

echo ""
echo "🗄️ Step 3: Setting up database..."

# Activate Node.js environment
source $NODE_ENV_PATH

# Create prisma directory if not exists
mkdir -p prisma
if [ ! -f "prisma/schema.prisma" ] && [ -f "schema.prisma" ]; then
    mv schema.prisma prisma/
fi

# Push database schema
npx prisma db push --accept-data-loss 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database tables created"
else
    echo "⚠️ Database setup had issues, check credentials"
fi

echo ""
echo "🌱 Step 4: Seeding demo data..."
npx prisma db seed 2>&1 || echo "⚠️ Seed skipped (may already exist)"

echo ""
echo "============================"
echo "✅ Deploy Complete!"
echo ""
echo "📌 Next Steps:"
echo "1. Go to cPanel > Setup Node.js App"
echo "2. Set Application startup file: server.js"
echo "3. Click RESTART"
echo ""
echo "🔐 Demo Login:"
echo "   Email: admin@ssshop.com"
echo "   Password: password123"
echo ""
echo "🌐 Your site: https://${DOMAIN}"
echo "============================"
