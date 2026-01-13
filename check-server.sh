#!/bin/bash
# Script ตรวจสอบปัญหา SSShop Server
# รัน: bash check-server.sh

echo "🔍 SSShop Server Diagnostic"
echo "============================"
echo ""

# ==========================================
# 1. ตรวจสอบ PM2 Status
# ==========================================
echo "📊 1. PM2 Status:"
pm2 status
echo ""

# ==========================================
# 2. ตรวจสอบ Port ที่ใช้งาน
# ==========================================
echo "🔌 2. Port 3008 Status:"
netstat -tlnp | grep 3008 || echo "❌ Port 3008 ไม่มีใครฟังอยู่!"
echo ""

# ==========================================
# 3. ตรวจสอบ PM2 Logs
# ==========================================
echo "📜 3. PM2 Logs (Last 30 lines):"
pm2 logs ssshop --lines 30 --nostream
echo ""

# ==========================================
# 4. ตรวจสอบ .env file
# ==========================================
echo "📝 4. .env file exists:"
if [ -f "/home/softstopshop.com/public_html/.env" ]; then
    echo "✅ .env exists"
    echo "DATABASE_URL configured:" 
    grep "DATABASE_URL" /home/softstopshop.com/public_html/.env | head -1 | sed 's/:.*/:*****@/' 
else
    echo "❌ .env ไม่มี!"
fi
echo ""

# ==========================================
# 5. ตรวจสอบ Database Connection
# ==========================================
echo "🗄️ 5. Testing Database Connection:"
cd /home/softstopshop.com/public_html
npx prisma db execute --stdin <<< "SELECT 1" 2>&1 | head -5
echo ""

# ==========================================
# 6. ตรวจสอบ Build Files
# ==========================================
echo "📁 6. Build Files:"
if [ -d "/home/softstopshop.com/public_html/.next" ]; then
    echo "✅ .next folder exists"
    ls -la /home/softstopshop.com/public_html/.next/ | head -10
else
    echo "❌ .next folder ไม่มี! ต้อง build ใหม่"
fi
echo ""

# ==========================================
# 7. Test Local Access
# ==========================================
echo "🌐 7. Testing Local Access (localhost:3008):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3008/ --max-time 5 || echo "❌ ไม่สามารถเชื่อมต่อได้!"
echo ""

# ==========================================
# 8. ตรวจสอบ Firewall
# ==========================================
echo "🔥 8. Firewall Status:"
ufw status 2>/dev/null || iptables -L -n 2>/dev/null | head -10 || echo "ไม่สามารถตรวจสอบ firewall ได้"
echo ""

# ==========================================
# 9. ตรวจสอบ Memory & CPU
# ==========================================
echo "💻 9. System Resources:"
echo "Memory:"
free -h
echo ""
echo "Disk:"
df -h | grep -E "^/dev|Filesystem"
echo ""

# ==========================================
# 10. OpenLiteSpeed/Nginx Status
# ==========================================
echo "🌐 10. Web Server Status:"
systemctl status lsws 2>/dev/null | head -5 || echo "LiteSpeed ไม่ได้ติดตั้ง"
echo ""

# ==========================================
# Summary & Fix Suggestions
# ==========================================
echo "============================"
echo "🔧 Quick Fix Commands:"
echo "============================"
echo ""
echo "# Restart PM2:"
echo "pm2 restart ssshop"
echo ""
echo "# Rebuild app:"
echo "cd /home/softstopshop.com/public_html && npm run build"
echo ""
echo "# View live logs:"
echo "pm2 logs ssshop"
echo ""
echo "# Restart with ecosystem:"
echo "pm2 delete ssshop && pm2 start ecosystem.config.js"
echo ""
