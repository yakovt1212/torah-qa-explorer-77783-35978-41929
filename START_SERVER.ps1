# Torah QA Explorer - Stable Server Starter
# Run this in PowerShell to start the server

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Torah QA Explorer - Starting Dev Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "📂 Working Directory: $ScriptDir" -ForegroundColor Gray
Write-Host ""

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connections -ne $null
}

# Check port 8080
Write-Host "[Step 1/4] Checking Port 8080..." -ForegroundColor Yellow
if (Test-PortInUse -Port 8080) {
    Write-Host "⚠️  Port 8080 is already in use!" -ForegroundColor Red
    Write-Host ""
    $response = Read-Host "Do you want to kill the process? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $connections = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid in $pids) {
            Write-Host "Stopping process $pid..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Cannot start server - port is in use." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✅ Port 8080 is available" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "[Step 2/4] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check dependencies
Write-Host "[Step 3/4] Checking Dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Start server
Write-Host "[Step 4/4] Starting Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "🚀 Server will start on: http://localhost:8080" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "   1. Keep this PowerShell window OPEN" -ForegroundColor White
Write-Host "   2. Do NOT close this window" -ForegroundColor White
Write-Host "   3. Press Ctrl+C only when you want to STOP the server" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start the server with full output
try {
    & npm run dev
} catch {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "❌ Server crashed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
} finally {
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to close this window"
}
