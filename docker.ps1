# Paystack Payment Testing - Docker Script (PowerShell)

Write-Host "🐳 Paystack Payment Testing - Docker Management" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check for environment files
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env not found!" -ForegroundColor Yellow
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Please update backend\.env with your Paystack secret key" -ForegroundColor Cyan
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  frontend\.env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.local.example" "frontend\.env.local"
    Write-Host "Please update frontend\.env.local with your Paystack public key" -ForegroundColor Cyan
}

# Menu
Write-Host "Select an option:" -ForegroundColor White
Write-Host "1) Start application (docker-compose up)"
Write-Host "2) Start in background (docker-compose up -d)"
Write-Host "3) Build and start (docker-compose up --build)"
Write-Host "4) Stop application (docker-compose down)"
Write-Host "5) View logs"
Write-Host "6) Restart services"
Write-Host "7) Clean up (remove containers and volumes)"
Write-Host "8) Exit"
Write-Host ""
$choice = Read-Host "Enter choice [1-8]"

switch ($choice) {
    "1" {
        Write-Host "🚀 Starting application..." -ForegroundColor Green
        docker-compose up
    }
    "2" {
        Write-Host "🚀 Starting application in background..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "✅ Application started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3030" -ForegroundColor Cyan
        Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "View logs: docker-compose logs -f" -ForegroundColor Yellow
        Write-Host "Stop: docker-compose down" -ForegroundColor Yellow
    }
    "3" {
        Write-Host "🔨 Building and starting..." -ForegroundColor Green
        docker-compose up --build
    }
    "4" {
        Write-Host "🛑 Stopping application..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Stopped!" -ForegroundColor Green
    }
    "5" {
        Write-Host "📋 Viewing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    "6" {
        Write-Host "🔄 Restarting services..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✅ Restarted!" -ForegroundColor Green
    }
    "7" {
        Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
        docker-compose down -v
        Write-Host "✅ Cleaned up!" -ForegroundColor Green
    }
    "8" {
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
        exit 1
    }
}
