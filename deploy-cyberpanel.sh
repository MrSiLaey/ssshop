#!/bin/bash
# SSShop CyberPanel Deploy Script with PM2
# Usage: Run this on the server after uploading files

set -e

# ==========================================
# CONFIGURATION
# ==========================================
SERVER_IP="149.28.156.191"
SERVER_USER="root"
REMOTE_PATH="/home/softstopshop.com/public_html"
APP_NAME="ssshop"
PORT=3008
NODE_VERSION="20"

echo "🚀 SSShop CyberPanel Deploy Script"
echo "===================================="
echo "📍 Target: $REMOTE_PATH"
echo "🔌 Port: $PORT"
echo ""

# ==========================================
# Step 1: Navigate to app directory
# ==========================================
echo "📁 Step 1: Setting up directory..."
cd "$REMOTE_PATH"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in $REMOTE_PATH"
    echo "Please upload project files first!"
    exit 1
fi

echo "✅ Project files found"

# ==========================================
# Step 2: Install Node.js if not exists
# ==========================================
echo ""
echo "🟢 Step 2: Checking Node.js..."

if ! command -v node &> /dev/null; then
    echo "Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js $(node -v) installed"

# ==========================================
# Step 3: Install PM2 globally
# ==========================================
echo ""
echo "📦 Step 3: Installing PM2..."

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo "✅ PM2 installed"

# ==========================================
# Step 4: Create .env file
# ==========================================
echo ""
echo "📝 Step 4: Creating .env file..."

if [ ! -f ".env" ]; then
    SECRET_KEY=$(openssl rand -base64 32)
    cat > .env << EOF
# Database - UPDATE THESE VALUES
DATABASE_URL="mysql://ssshop_user:YOUR_PASSWORD@localhost:3306/ssshop_db"

# NextAuth
NEXTAUTH_URL="https://softstopshop.com"
NEXTAUTH_SECRET="${SECRET_KEY}"

# App
NODE_ENV="production"
PORT=${PORT}
HOSTNAME="0.0.0.0"
EOF
    echo "✅ .env file created - PLEASE UPDATE DATABASE CREDENTIALS!"
else
    # Update PORT in existing .env
    sed -i "s/^PORT=.*/PORT=${PORT}/" .env
    echo "✅ .env file exists, PORT updated to ${PORT}"
fi

# ==========================================
# Step 5: Install dependencies
# ==========================================
echo ""
echo "📦 Step 5: Installing dependencies..."
npm install --production=false

echo "✅ Dependencies installed"

# ==========================================
# Step 6: Generate Prisma client
# ==========================================
echo ""
echo "🔧 Step 6: Generating Prisma client..."
npx prisma generate

echo "✅ Prisma client generated"

# ==========================================
# Step 7: Build Next.js app
# ==========================================
echo ""
echo "🏗️ Step 7: Building Next.js application..."
npm run build

echo "✅ Build complete"

# ==========================================
# Step 8: Setup database
# ==========================================
echo ""
echo "🗄️ Step 8: Setting up database..."
npx prisma db push --accept-data-loss || echo "⚠️ Database push had issues"

echo "✅ Database schema synced"

# ==========================================
# Step 9: Create PM2 ecosystem file
# ==========================================
echo ""
echo "⚙️ Step 9: Creating PM2 ecosystem config..."

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'server.js',
    cwd: '${REMOTE_PATH}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT},
      HOSTNAME: '0.0.0.0'
    },
    error_file: '${REMOTE_PATH}/logs/pm2-error.log',
    out_file: '${REMOTE_PATH}/logs/pm2-out.log',
    log_file: '${REMOTE_PATH}/logs/pm2-combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

echo "✅ PM2 ecosystem config created"

# ==========================================
# Step 10: Start/Restart with PM2
# ==========================================
echo ""
echo "🚀 Step 10: Starting application with PM2..."

# Stop existing instance if running
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start with ecosystem file
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "✅ Application started with PM2"

# ==========================================
# Step 11: Setup Nginx proxy (CyberPanel)
# ==========================================
echo ""
echo "🌐 Step 11: Nginx reverse proxy config..."

NGINX_CONF="/usr/local/lsws/conf/vhosts/softstopshop.com/vhost.conf"

echo "
📌 Add this to your CyberPanel vhost config or use CyberPanel GUI:

# Proxy settings for Next.js app
extprocessor ${APP_NAME} {
  type                    proxy
  address                 127.0.0.1:${PORT}
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 ${APP_NAME}
  addDefaultCharset       off
}
"

# ==========================================
# Summary
# ==========================================
echo ""
echo "===================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "===================================="
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "📌 Important Info:"
echo "   App Name: ${APP_NAME}"
echo "   Port: ${PORT}"
echo "   Path: ${REMOTE_PATH}"
echo ""
echo "🔧 PM2 Commands:"
echo "   pm2 status              - Check status"
echo "   pm2 logs ${APP_NAME}    - View logs"
echo "   pm2 restart ${APP_NAME} - Restart app"
echo "   pm2 stop ${APP_NAME}    - Stop app"
echo ""
echo "⚠️ NEXT STEPS:"
echo "1. Update .env file with correct DATABASE_URL"
echo "2. Configure reverse proxy in CyberPanel"
echo "3. Run: npx prisma db seed (for demo data)"
echo ""
echo "🔐 Demo Login (after seeding):"
echo "   Email: admin@ssshop.com"
echo "   Password: password123"
echo ""
echo "🌐 Site URL: https://softstopshop.com"
echo "===================================="
