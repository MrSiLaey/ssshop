#!/bin/bash
# SSShop Server Fix Script
# รัน: bash fix-server.sh

set -e

DOMAIN="softstopshop.com"
APP_PATH="/home/${DOMAIN}/public_html"
APP_NAME="ssshop"
PORT=3008

echo "🔧 SSShop Server Fix Script"
echo "============================"
echo ""

# ==========================================
# 1. ตรวจสอบ PM2 Status
# ==========================================
echo "📊 1. Checking PM2 Status..."
pm2 status

# ตรวจสอบว่า app รันอยู่หรือไม่
PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o "\"name\":\"${APP_NAME}\"" || echo "")
if [ -z "$PM2_STATUS" ]; then
    echo "❌ App ไม่ได้รัน! กำลัง start..."
    cd "$APP_PATH"
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start server.js --name "$APP_NAME" -- --port $PORT
    fi
    pm2 save
fi

echo ""

# ==========================================
# 2. ตรวจสอบ Port
# ==========================================
echo "🔌 2. Checking Port $PORT..."
if netstat -tlnp 2>/dev/null | grep -q ":$PORT"; then
    echo "✅ Port $PORT กำลังรันอยู่"
else
    echo "❌ Port $PORT ไม่มีใครฟัง!"
    echo "กำลัง restart PM2..."
    pm2 restart "$APP_NAME" || pm2 start "$APP_PATH/server.js" --name "$APP_NAME"
fi

echo ""

# ==========================================
# 3. ตรวจสอบ Local Access
# ==========================================
echo "🌐 3. Testing Local Access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT/ --max-time 10 2>/dev/null || echo "000")
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "000" ]; then
    echo "❌ ไม่สามารถเชื่อมต่อ localhost:$PORT ได้!"
    echo ""
    echo "📜 PM2 Logs:"
    pm2 logs "$APP_NAME" --lines 50 --nostream
elif [ "$HTTP_CODE" = "500" ]; then
    echo "❌ Server Error 500 - ตรวจสอบ logs:"
    pm2 logs "$APP_NAME" --lines 30 --nostream
else
    echo "✅ App ทำงานปกติ (HTTP $HTTP_CODE)"
fi

echo ""

# ==========================================
# 4. ตรวจสอบและติดตั้ง SSL
# ==========================================
echo "🔐 4. Checking SSL Certificate..."

# ตรวจสอบว่า SSL ใช้งานได้หรือไม่
SSL_CHECK=$(curl -sI "https://${DOMAIN}" --max-time 5 2>&1 || echo "SSL_ERROR")

if echo "$SSL_CHECK" | grep -q "SSL_ERROR\|curl: (60)\|certificate"; then
    echo "❌ SSL ไม่ทำงาน!"
    echo ""
    echo "🔧 กำลังติดตั้ง SSL ด้วย CyberPanel CLI..."
    
    # ติดตั้ง SSL ด้วย CyberPanel
    if command -v cyberpanel &> /dev/null; then
        echo "พบ CyberPanel CLI - กำลังออก SSL..."
        cyberpanel issueSSL --domainName "$DOMAIN" 2>/dev/null || echo "⚠️ ต้องออก SSL ผ่าน CyberPanel GUI"
    else
        echo "⚠️ ไม่พบ CyberPanel CLI"
    fi
    
    echo ""
    echo "📌 วิธีออก SSL ผ่าน CyberPanel GUI:"
    echo "1. เข้า https://YOUR_SERVER_IP:8090"
    echo "2. ไปที่ SSL → Manage SSL"
    echo "3. เลือก domain: $DOMAIN"
    echo "4. คลิก Issue SSL"
else
    echo "✅ SSL ทำงานปกติ"
fi

echo ""

# ==========================================
# 5. ตรวจสอบ OpenLiteSpeed Proxy Config
# ==========================================
echo "⚙️ 5. Checking OpenLiteSpeed Proxy..."

VHOST_CONF="/usr/local/lsws/conf/vhosts/${DOMAIN}/vhost.conf"

if [ -f "$VHOST_CONF" ]; then
    if grep -q "proxy" "$VHOST_CONF"; then
        echo "✅ Proxy config มีอยู่แล้ว"
    else
        echo "❌ ไม่มี Proxy config!"
        echo ""
        echo "📝 กำลังเพิ่ม Proxy config..."
        
        # Backup config เดิม
        cp "$VHOST_CONF" "${VHOST_CONF}.backup"
        
        # เพิ่ม proxy config
        cat >> "$VHOST_CONF" << 'PROXYEOF'

# Next.js Proxy Configuration
extprocessor ssshop {
  type                    proxy
  address                 127.0.0.1:3008
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 ssshop
  addDefaultCharset       off
}
PROXYEOF
        
        echo "✅ Proxy config เพิ่มแล้ว"
        echo "🔄 กำลัง restart OpenLiteSpeed..."
        systemctl restart lsws || /usr/local/lsws/bin/lswsctrl restart
    fi
else
    echo "⚠️ ไม่พบ vhost.conf"
    echo "ต้องตั้งค่า Proxy ผ่าน CyberPanel GUI"
fi

echo ""

# ==========================================
# 6. ตรวจสอบ Database
# ==========================================
echo "🗄️ 6. Checking Database..."
cd "$APP_PATH"

if [ -f ".env" ]; then
    DB_URL=$(grep "DATABASE_URL" .env | head -1)
    if echo "$DB_URL" | grep -q "YOUR_PASSWORD"; then
        echo "❌ DATABASE_URL ยังไม่ได้ตั้งค่า!"
        echo "กรุณาแก้ไข .env file"
    else
        echo "✅ DATABASE_URL configured"
        # ทดสอบ connection
        npx prisma db execute --stdin <<< "SELECT 1" 2>&1 | head -3 || echo "⚠️ Database connection มีปัญหา"
    fi
else
    echo "❌ ไม่พบ .env file!"
fi

echo ""

# ==========================================
# 7. Restart ทุกอย่าง
# ==========================================
echo "🔄 7. Restarting Services..."

# Restart PM2
pm2 restart "$APP_NAME" 2>/dev/null || true

# Restart OpenLiteSpeed
systemctl restart lsws 2>/dev/null || /usr/local/lsws/bin/lswsctrl restart 2>/dev/null || true

echo "✅ Services restarted"

echo ""

# ==========================================
# Final Status
# ==========================================
echo "============================"
echo "📊 FINAL STATUS"
echo "============================"
echo ""

pm2 status

echo ""
echo "🌐 Testing endpoints..."
echo "HTTP:  $(curl -sI "http://${DOMAIN}" --max-time 5 2>&1 | head -1 || echo 'Failed')"
echo "HTTPS: $(curl -sI "https://${DOMAIN}" --max-time 5 2>&1 | head -1 || echo 'Failed')"
echo "Local: $(curl -sI "http://127.0.0.1:${PORT}" --max-time 5 2>&1 | head -1 || echo 'Failed')"

echo ""
echo "============================"
echo "📌 ถ้ายังไม่ทำงาน:"
echo "============================"
echo "1. ดู logs: pm2 logs ssshop"
echo "2. ตรวจสอบ .env: cat $APP_PATH/.env"
echo "3. Rebuild: cd $APP_PATH && npm run build"
echo "4. ออก SSL ผ่าน CyberPanel GUI"
echo ""
