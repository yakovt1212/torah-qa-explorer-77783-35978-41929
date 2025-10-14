#!/usr/bin/env pwsh

Write-Host "📤 מסנכרן עם GitHub..." -ForegroundColor Cyan

# Get current branch
$BRANCH = git branch --show-current

# Push to remote
try {
  git push origin $BRANCH 2>&1 | Out-Null
  Write-Host "✅ סונכרן בהצלחה עם GitHub!" -ForegroundColor Green
} catch {
  Write-Host "⚠️ לא ניתן לדחוף ל-GitHub. אנא בדוק את החיבור." -ForegroundColor Yellow
}
