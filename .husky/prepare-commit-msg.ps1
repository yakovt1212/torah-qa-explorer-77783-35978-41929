#!/usr/bin/env pwsh

# Generate version info
$VERSION = Get-Date -Format "yyyy.MM.dd.HHmm"
$BRANCH = git branch --show-current
$CHANGED_FILES = (git diff --cached --name-only | Measure-Object -Line).Lines

# Get list of changed files
$CHANGED_LIST = git diff --cached --name-status

# Create detailed commit message
$COMMIT_MSG_FILE = $args[0]

# Read existing message
$EXISTING_MSG = Get-Content $COMMIT_MSG_FILE -Raw -ErrorAction SilentlyContinue

# If message is empty or default, create detailed one
if ([string]::IsNullOrWhiteSpace($EXISTING_MSG)) {
  $DATE = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  
  @"
🔄 שינויים אוטומטיים - גרסה $VERSION

📋 פרטי השינוי:
- תאריך: $DATE
- ענף: $BRANCH
- מספר קבצים: $CHANGED_FILES

📝 קבצים ששונו:
$CHANGED_LIST

✅ שינויים אלו נשמרו אוטומטית ונסנכרנו עם GitHub
"@ | Out-File -FilePath $COMMIT_MSG_FILE -Encoding UTF8
}
