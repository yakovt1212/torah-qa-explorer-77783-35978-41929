#!/usr/bin/env pwsh

Write-Host "🚀 מריץ בדיקות לפני commit..." -ForegroundColor Cyan

# Run linting
try {
  npm run lint --fix 2>&1 | Out-Null
} catch {
  Write-Host "⚠️ Lint warnings (continuing...)" -ForegroundColor Yellow
}

# Add any auto-fixed files
git add -u

Write-Host "✅ בדיקות הושלמו" -ForegroundColor Green
