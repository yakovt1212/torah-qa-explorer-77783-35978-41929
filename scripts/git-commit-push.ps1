#!/usr/bin/env pwsh
# Auto-commit and push script for DevPanel

$ErrorActionPreference = "Stop"

try {
  Write-Host "📝 מוסיף קבצים..." -ForegroundColor Cyan
  git add .
  
  # Check if there are changes to commit
  $changes = git status --porcelain
  if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "ℹ️ אין שינויים לשמירה" -ForegroundColor Yellow
    exit 0
  }
  
  # Generate commit message
  $VERSION = Get-Date -Format "yyyy.MM.dd.HHmm"
  $DATE = Get-Date -Format "dd/MM/yyyy בשעה HH:mm"
  $DAY_NAME = switch ((Get-Date).DayOfWeek) {
    "Sunday" { "ראשון" }
    "Monday" { "שני" }
    "Tuesday" { "שלישי" }
    "Wednesday" { "רביעי" }
    "Thursday" { "חמישי" }
    "Friday" { "שישי" }
    "Saturday" { "שבת" }
  }
  $BRANCH = git branch --show-current
  $CHANGED_FILES = (git diff --cached --name-only | Measure-Object -Line).Lines
  $CHANGED_LIST = git diff --cached --name-status
  
  $COMMIT_MSG = @"
🔄 עדכון ידני מ-DevPanel - גרסה $VERSION

📅 יום $DAY_NAME, $DATE
🌿 ענף: $BRANCH
📁 קבצים ששונו: $CHANGED_FILES

📝 רשימת שינויים:
$CHANGED_LIST

✅ השינויים נשמרו ידנית דרך כפתור DevPanel
"@
  
  # Commit
  Write-Host "💾 יוצר קומיט..." -ForegroundColor Cyan
  git commit -m $COMMIT_MSG
  
  # Push
  Write-Host "📤 דוחף ל-GitHub..." -ForegroundColor Cyan
  git push origin $BRANCH
  
  Write-Host "✅ הושלם בהצלחה!" -ForegroundColor Green
  exit 0
  
} catch {
  Write-Host "❌ שגיאה: $_" -ForegroundColor Red
  exit 1
}
