# GrowPilot Setup Verification Script
# Run this to check if your environment is ready

Write-Host ""
Write-Host "GrowPilot Setup Verification" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion -match "v(\d+)") {
        $major = [int]$Matches[1]
        if ($major -ge 18) {
            Write-Host " [OK] $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host " [FAIL] Version $nodeVersion (need 18+)" -ForegroundColor Red
            $allGood = $false
        }
    }
} catch {
    Write-Host " [FAIL] Not installed" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -NoNewline
try {
    $npmVersion = npm --version 2>$null
    Write-Host " [OK] $npmVersion" -ForegroundColor Green
} catch {
    Write-Host " [FAIL] Not installed" -ForegroundColor Red
    $allGood = $false
}

# Check MongoDB
Write-Host "Checking MongoDB..." -NoNewline
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -InformationLevel Quiet 2>$null
    if ($mongoCheck.TcpTestSucceeded) {
        Write-Host " [OK] Running on port 27017" -ForegroundColor Green
    } else {
        Write-Host " [WARN] Not running" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [WARN] Not running" -ForegroundColor Yellow
}

# Check backend dependencies
Write-Host "Checking backend dependencies..." -NoNewline
if (Test-Path "backend/node_modules") {
    Write-Host " [OK] Installed" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Run 'cd backend && npm install'" -ForegroundColor Red
    $allGood = $false
}

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -NoNewline
if (Test-Path "frontend/node_modules") {
    Write-Host " [OK] Installed" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Run 'cd frontend && npm install'" -ForegroundColor Red
    $allGood = $false
}

# Check backend .env
Write-Host "Checking backend/.env..." -NoNewline
if (Test-Path "backend/.env") {
    $envContent = Get-Content "backend/.env" -Raw
    if ($envContent -match "your_openai_api_key_here") {
        Write-Host " [WARN] Needs OpenAI API key" -ForegroundColor Yellow
    } else {
        Write-Host " [OK] Configured" -ForegroundColor Green
    }
} else {
    Write-Host " [FAIL] Missing" -ForegroundColor Red
}

# Check frontend .env.local
Write-Host "Checking frontend/.env.local..." -NoNewline
if (Test-Path "frontend/.env.local") {
    Write-Host " [OK] Exists" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Missing" -ForegroundColor Red
}

Write-Host ""

if ($allGood) {
    Write-Host "[SUCCESS] Ready to start!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Terminal 1: cd backend && npm run dev" -ForegroundColor Cyan
    Write-Host "Terminal 2: cd frontend && npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "[WARNING] Fix issues above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Need help? Check QUICKSTART.md" -ForegroundColor Gray
Write-Host ""
