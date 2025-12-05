@echo off
REM Build script for Soft Stop Shop Docker image (Windows)

echo.
echo 🚀 Building Soft Stop Shop Docker Image...
echo.

docker build -t soft-stop-shop:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo 📦 Image: soft-stop-shop:latest
    echo.
    echo 🔧 Run commands:
    echo.
    echo   # Run with docker-compose (recommended):
    echo   docker-compose up -d
    echo.
    echo   # Or run standalone (requires external database):
    echo   docker run -d -p 3000:3000 ^
    echo     -e DATABASE_URL='your-database-url' ^
    echo     -e NEXTAUTH_SECRET='your-secret' ^
    echo     -e NEXTAUTH_URL='http://localhost:3000' ^
    echo     --name soft-stop-shop ^
    echo     soft-stop-shop:latest
    echo.
    echo   # Run database migrations:
    echo   docker-compose exec app npx prisma migrate deploy
    echo.
) else (
    echo.
    echo ❌ Build failed!
    exit /b 1
)
