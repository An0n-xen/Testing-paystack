# Paystack Payment Testing - Quick Start

Write-Host "🚀 Paystack Payment Testing Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Paystack keys
Write-Host "📝 Checking configuration..." -ForegroundColor Yellow

$backendEnv = "backend\.env"
$frontendEnv = "frontend\.env.local"

if (-not (Test-Path $backendEnv)) {
    Write-Host "❌ Backend .env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env with your Paystack secret key" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $frontendEnv)) {
    Write-Host "❌ Frontend .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create frontend\.env.local with your Paystack public key" -ForegroundColor Yellow
    exit 1
}

# Check backend key
$backendContent = Get-Content $backendEnv -Raw
if ($backendContent -match "sk_test_your_secret_key_here") {
    Write-Host "⚠️  Please update your Paystack secret key in backend\.env" -ForegroundColor Yellow
    Write-Host "Get your keys from: https://dashboard.paystack.com/settings/developer" -ForegroundColor Cyan
    exit 1
}

# Check frontend key
$frontendContent = Get-Content $frontendEnv -Raw
if ($frontendContent -match "pk_test_your_public_key_here") {
    Write-Host "⚠️  Please update your Paystack public key in frontend\.env.local" -ForegroundColor Yellow
    Write-Host "Get your keys from: https://dashboard.paystack.com/settings/developer" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Configuration looks good!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3030" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; yarn start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; yarn dev"

Write-Host "✅ Servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "Open your browser to: http://localhost:3030" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Card Details:" -ForegroundColor Yellow
Write-Host "  Card: 4084084084084081" -ForegroundColor White
Write-Host "  CVV:  408" -ForegroundColor White
Write-Host "  Date: Any future date" -ForegroundColor White
Write-Host "  PIN:  0000" -ForegroundColor White
Write-Host "  OTP:  123456" -ForegroundColor White
