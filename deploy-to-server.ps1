# SSShop Deploy to CyberPanel Server
# Run this from Windows to upload and deploy

$SERVER_IP = "149.28.156.191"
$SERVER_USER = "root"
$REMOTE_PATH = "/home/softstopshop.com/public_html"
$APP_NAME = "ssshop"
$PORT = 3008

Write-Host "🚀 SSShop Deploy to CyberPanel" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Files and folders to exclude from upload
$EXCLUDE_PATTERNS = @(
    "node_modules",
    ".next",
    ".git",
    "*.log",
    ".env.local",
    ".env.development",
    "cpanel_upload",
    "ssshop_delivery"
)

# Step 1: Build locally first
Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔧 Step 2: Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "🏗️ Step 3: Building Next.js app..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green

# Step 4: Create rsync exclude file
Write-Host ""
Write-Host "📁 Step 4: Preparing files for upload..." -ForegroundColor Yellow

$excludeFile = ".rsync-exclude"
$EXCLUDE_PATTERNS | Out-File -FilePath $excludeFile -Encoding utf8

# Step 5: Upload to server using rsync (requires WSL or Git Bash)
Write-Host ""
Write-Host "📤 Step 5: Uploading to server..." -ForegroundColor Yellow
Write-Host "   Target: ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}" -ForegroundColor Gray

# Check if rsync is available (Git Bash or WSL)
$rsyncPath = Get-Command rsync -ErrorAction SilentlyContinue

if ($rsyncPath) {
    # Use rsync
    $excludeArgs = $EXCLUDE_PATTERNS | ForEach-Object { "--exclude=$_" }
    rsync -avz --delete $excludeArgs ./ "${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/"
} else {
    Write-Host ""
    Write-Host "⚠️ rsync not found. Using SCP instead..." -ForegroundColor Yellow
    Write-Host "   (Install Git Bash or WSL for faster uploads)" -ForegroundColor Gray
    
    # Create a zip file excluding node_modules and .next
    $zipFile = "ssshop-deploy.zip"
    
    Write-Host "   Creating deployment package..." -ForegroundColor Gray
    
    # Use 7-Zip if available, otherwise use Compress-Archive
    $7zipPath = "C:\Program Files\7-Zip\7z.exe"
    
    if (Test-Path $7zipPath) {
        & $7zipPath a -tzip $zipFile . -xr!node_modules -xr!.next -xr!.git -xr!cpanel_upload -xr!ssshop_delivery
    } else {
        # PowerShell native compression (slower but works)
        $filesToZip = Get-ChildItem -Path . -Exclude "node_modules", ".next", ".git", "cpanel_upload", "ssshop_delivery"
        Compress-Archive -Path $filesToZip -DestinationPath $zipFile -Force
    }
    
    Write-Host "   Uploading $zipFile..." -ForegroundColor Gray
    scp $zipFile "${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/"
    
    Write-Host "   Extracting on server..." -ForegroundColor Gray
    ssh "${SERVER_USER}@${SERVER_IP}" "cd ${REMOTE_PATH} && unzip -o $zipFile && rm $zipFile"
    
    # Cleanup local zip
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✅ Files uploaded!" -ForegroundColor Green

# Step 6: Run deployment script on server
Write-Host ""
Write-Host "🚀 Step 6: Running deployment on server..." -ForegroundColor Yellow

$deployScript = @"
cd $REMOTE_PATH

# Install dependencies
npm install --production=false

# Generate Prisma
npx prisma generate

# Create PM2 ecosystem
cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'server.js',
    cwd: '$REMOTE_PATH',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT,
      HOSTNAME: '0.0.0.0'
    }
  }]
};
EOFPM2

# Stop existing and start new
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 status
"@

ssh "${SERVER_USER}@${SERVER_IP}" $deployScript

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 App running on port $PORT" -ForegroundColor Cyan
Write-Host "🌐 URL: https://softstopshop.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 SSH Commands:" -ForegroundColor Yellow
Write-Host "   ssh ${SERVER_USER}@${SERVER_IP}" -ForegroundColor Gray
Write-Host "   pm2 logs $APP_NAME" -ForegroundColor Gray
Write-Host "   pm2 restart $APP_NAME" -ForegroundColor Gray
