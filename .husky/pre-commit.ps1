#!/usr/bin/env pwsh

Write-Host "🚀 מריץ בדיקות לפני commit..." -ForegroundColor Cyan

# Run linting (non-blocking - warnings only)
try {
  Write-Host "📝 מריץ ESLint..." -ForegroundColor Cyan
  $lintOutput = npm run lint --fix 2>&1
  
  if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ יש אזהרות ESLint (ממשיך בכל זאת)" -ForegroundColor Yellow
    # Don't fail the commit, just warn
  } else {
    Write-Host "✅ ESLint עבר בהצלחה" -ForegroundColor Green
  }
} catch {
  Write-Host "⚠️ לא ניתן להריץ ESLint (ממשיך בכל זאת)" -ForegroundColor Yellow
}

# Add any auto-fixed files
git add -u 2>&1 | Out-Null

Write-Host "✅ בדיקות הושלמו - ממשיך ל-commit" -ForegroundColor Green

# Always exit with success to not block commits
exit 0
