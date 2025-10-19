# Torah QA Explorer - Debug Server Launcher
# This script helps identify why the server keeps stopping

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Torah QA Explorer - Debug Mode" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 8080 is already in use
Write-Host "[1/5] Checking port 8080..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :8080 | findstr LISTENING
if ($portCheck) {
    Write-Host "❌ Port 8080 is already in use!" -ForegroundColor Red
    Write-Host $portCheck
    Write-Host ""
    Write-Host "Kill the process? (y/n): " -NoNewline -ForegroundColor Yellow
    $kill = Read-Host
    if ($kill -eq 'y') {
        $portCheck | ForEach-Object {
            $pid = ($_ -split '\s+')[-1]
            Write-Host "Killing process $pid..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "✅ Port 8080 is available" -ForegroundColor Green
}
Write-Host ""

# Check Node.js
Write-Host "[2/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check npm
Write-Host "[3/5] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check node_modules
Write-Host "[4/5] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules not found! Running npm install..." -ForegroundColor Red
    npm install
}
Write-Host ""

# Start the server with detailed logging
Write-Host "[5/5] Starting Vite Dev Server..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Server is starting on http://localhost:8080" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Keep this terminal window open!" -ForegroundColor Yellow
Write-Host "⚠️  Do not press Ctrl+C unless you want to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Set error action to continue and capture all output
$ErrorActionPreference = "Continue"

# Start the server with verbose output
Write-Host "Running: npm run dev" -ForegroundColor Cyan
Write-Host ""

# Trap Ctrl+C
$null = [Console]::TreatControlCAsInput = $false

try {
    # Run npm with full output
    & npm run dev 2>&1 | ForEach-Object {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] $_"
    }
} catch {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "❌ Server crashed or stopped!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
} finally {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Yellow
    Write-Host "⚠️  Server has stopped!" -ForegroundColor Yellow
    Write-Host "================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
