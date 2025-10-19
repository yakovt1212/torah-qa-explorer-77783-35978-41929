# Torah QA Explorer - Keep Alive Server
# This script ensures the server stays running and restarts if it crashes

param(
    [int]$MaxRestarts = 10,
    [int]$Port = 8080
)

$restartCount = 0
$startTime = Get-Date

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Torah QA Explorer - Keep Alive Mode" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Server will automatically restart if it crashes" -ForegroundColor Yellow
Write-Host "📌 Maximum restarts: $MaxRestarts" -ForegroundColor Yellow
Write-Host "📌 Port: $Port" -ForegroundColor Yellow
Write-Host "📌 Press Ctrl+C to stop permanently" -ForegroundColor Yellow
Write-Host ""

function Check-Port {
    $connections = netstat -ano | findstr ":$Port.*LISTENING"
    return $connections -ne $null
}

function Kill-Port {
    $connections = netstat -ano | findstr ":$Port.*LISTENING"
    if ($connections) {
        $connections | ForEach-Object {
            $pid = ($_ -split '\s+')[-1]
            Write-Host "Killing process on port ${Port}: PID $pid" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
}

while ($restartCount -lt $MaxRestarts) {
    $attemptTime = Get-Date
    $uptime = $attemptTime - $startTime
    
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "🚀 Starting server (Attempt: $($restartCount + 1)/$MaxRestarts)" -ForegroundColor Green
    Write-Host "⏱️  Uptime: $($uptime.ToString('hh\:mm\:ss'))" -ForegroundColor Gray
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if port is in use
    if (Check-Port) {
        Write-Host "⚠️  Port $Port is already in use, attempting to free it..." -ForegroundColor Yellow
        Kill-Port
    }
    
    # Start the server
    try {
        $process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow -RedirectStandardOutput "server-output.log" -RedirectStandardError "server-error.log"
        
        Write-Host "✅ Server process started (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📋 Output: server-output.log" -ForegroundColor Gray
        Write-Host "📋 Errors: server-error.log" -ForegroundColor Gray
        Write-Host ""
        
        # Wait a moment for server to start
        Start-Sleep -Seconds 3
        
        # Monitor the process
        $checkInterval = 5
        $noOutputCount = 0
        
        while (!$process.HasExited) {
            Start-Sleep -Seconds $checkInterval
            
            # Check if port is still listening
            if (Check-Port) {
                Write-Host "✅ Server is running (PID: $($process.Id)) - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
                $noOutputCount = 0
            } else {
                $noOutputCount++
                Write-Host "⚠️  Server not responding on port $Port ($noOutputCount checks)" -ForegroundColor Yellow
                
                if ($noOutputCount -gt 3) {
                    Write-Host "❌ Server appears to be down, restarting..." -ForegroundColor Red
                    $process.Kill()
                    break
                }
            }
        }
        
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Red
        Write-Host "❌ Server process exited!" -ForegroundColor Red
        Write-Host "Exit Code: $($process.ExitCode)" -ForegroundColor Red
        Write-Host "================================================" -ForegroundColor Red
        Write-Host ""
        
        # Show last lines of error log
        if (Test-Path "server-error.log") {
            $errorContent = Get-Content "server-error.log" -Tail 20
            if ($errorContent) {
                Write-Host "Last error log entries:" -ForegroundColor Yellow
                $errorContent | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
                Write-Host ""
            }
        }
        
        $restartCount++
        
        if ($restartCount -lt $MaxRestarts) {
            Write-Host "⏳ Restarting in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
        
    } catch {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Red
        Write-Host "❌ Failed to start server!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "================================================" -ForegroundColor Red
        Write-Host ""
        
        $restartCount++
        
        if ($restartCount -lt $MaxRestarts) {
            Write-Host "⏳ Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Red
Write-Host "❌ Maximum restart attempts reached!" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red
Write-Host ""
Write-Host "Check the following files for details:" -ForegroundColor Yellow
Write-Host "  - server-output.log" -ForegroundColor Gray
Write-Host "  - server-error.log" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
