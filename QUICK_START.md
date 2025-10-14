# ⚡ התחלה מהירה - מערכת סינכרון אוטומטי

## 🎯 מה נוצר עבורך?

מערכת **סינכרון אוטומטי מלא** עם GitHub שכוללת:
- ✅ שמירה אוטומטית של כל שינוי
- ✅ העלאה אוטומטית ל-GitHub
- ✅ ניהול גרסאות מפורט
- ✅ תיעוד אוטומטי של שינויים

## 🚀 3 צעדים להפעלה

### 1️⃣ הגדר הרשאות GitHub

**בחר אפשרות אחת:**

#### דרך א' - GitHub CLI (מומלץ, הכי פשוט)
\`\`\`powershell
# התקן
winget install --id GitHub.cli

# התחבר
gh auth login
# בחר: GitHub.com → HTTPS → Login with browser
\`\`\`

#### דרך ב' - Personal Access Token
1. לך ל-https://github.com/settings/tokens
2. "Generate new token (classic)"
3. בחר: `repo` ו-`workflow`
4. העתק את ה-Token
5. בפעם הבאה ש-git יבקש password, הדבק את ה-Token

### 2️⃣ התקן תלויות
\`\`\`powershell
npm install
\`\`\`

### 3️⃣ אתחל את המערכת
\`\`\`powershell
npm run prepare
\`\`\`

## 💡 שימוש יומיומי

### לשמור ולסנכרן עם GitHub (פקודה אחת!)
\`\`\`powershell
npm run auto-commit
\`\`\`

**זהו!** המערכת תעשה הכל:
1. ✅ תבדוק מה השתנה
2. ✅ תוסיף את הקבצים ל-Git
3. ✅ תיצור commit עם הודעה מפורטת
4. ✅ תעלה אוטומטית ל-GitHub
5. ✅ תשמור מידע על הגרסה

### לבדוק מצב נוכחי
\`\`\`powershell
npm run version:current
\`\`\`

### לראות היסטוריה
\`\`\`powershell
npm run version:history
\`\`\`

### לסנכרן ידנית
\`\`\`powershell
npm run sync
\`\`\`

## 📋 פקודות נוספות

| פקודה | תיאור |
|-------|-------|
| \`git status\` | בדוק מה השתנה |
| \`git log --oneline -10\` | 10 commits אחרונים |
| \`git diff\` | הצג שינויים |

## 🎨 מה יקרה כשתריץ auto-commit?

תראה משהו כזה:
\`\`\`
🔄 מתחיל commit אוטומטי...

📝 נמצאו 3 קבצים ששונו:
   M  src/App.tsx
   M  package.json
   A  src/NewFile.tsx

📦 מוסיף קבצים...
💾 שומר שינויים...
📤 מסנכרן עם GitHub...

✅ הושלם בהצלחה!
📌 גרסה: 2024.10.14.1430
🌐 סונכרן עם GitHub: main
\`\`\`

## 📖 מסמכים נוספים

- **[GIT_SYNC_GUIDE.md](./GIT_SYNC_GUIDE.md)** - מדריך מלא ומפורט
- **[GITHUB_AUTH_FIX.md](./GITHUB_AUTH_FIX.md)** - פתרון בעיות הרשאות
- **[.github/VERSION_CONTROL.md](./.github/VERSION_CONTROL.md)** - תיעוד טכני

## ❗ בעיות נפוצות

### "Permission denied" כשמנסה push
→ עקוב אחרי **[GITHUB_AUTH_FIX.md](./GITHUB_AUTH_FIX.md)**

### Husky לא עובד
\`\`\`powershell
npm install
npm run prepare
\`\`\`

### רוצה לראות את כל הקבצים שנוצרו
\`\`\`powershell
# GitHub Actions
ls .github/workflows/

# Git Hooks
ls .husky/

# Scripts
ls scripts/

# תיעוד
ls *.md
\`\`\`

## 🎉 סיימנו!

עכשיו בכל פעם שאתה משנה קוד:
\`\`\`powershell
npm run auto-commit
\`\`\`

**וזהו!** כל השינויים נשמרים ומסונכרנים אוטומטית ⚡

---

💡 **טיפ:** הוסף את הפקודות האלה ל-VS Code Tasks או Shortcuts לנוחות מקסימלית!
