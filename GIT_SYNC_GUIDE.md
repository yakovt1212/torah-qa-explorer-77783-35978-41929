# 🔄 מערכת ניהול גרסאות וסינכרון אוטומטי

## סקירה כללית

מערכת זו מספקת **סינכרון אוטומטי מלא עם GitHub** ו**ניהול גרסאות מפורט** לפרויקט.

## ✨ תכונות עיקריות

### 🤖 סינכרון אוטומטי
- ✅ שמירה אוטומטית של כל שינוי ב-Git
- ✅ העלאה אוטומטית ל-GitHub לאחר כל commit
- ✅ יצירת גרסאות עם מספור אוטומטי
- ✅ תיעוד מפורט של כל שינוי

### 📝 תיעוד מפורט
- 📋 הודעות commit אוטומטיות עם כל הפרטים
- 📊 רשימה מלאה של קבצים ששונו
- ⏰ תאריך ושעה מדויקים (אזור זמן ישראל)
- 🏷️ מספר גרסה ייחודי לכל שינוי

### 🗂️ ניהול גרסאות
- 💾 שמירת מידע על כל גרסה בקובץ JSON
- 📈 מעקב אחר שינויים לאורך זמן
- ↩️ יכולת לחזור לגרסאות קודמות
- 📜 CHANGELOG אוטומטי

## 🚀 התקנה

### שלב 1: התקן את החבילות הנדרשות
\`\`\`powershell
npm install
\`\`\`

### שלב 2: אתחל את Husky
\`\`\`powershell
npm run prepare
\`\`\`

### שלב 3: הגדר הרשאות (רק פעם אחת)
\`\`\`powershell
git config --local user.name "השם שלך"
git config --local user.email "your-email@example.com"
\`\`\`

## 📚 פקודות זמינות

### שמירה וסינכרון אוטומטי
\`\`\`powershell
# שמירה אוטומטית עם הודעה מפורטת וסינכרון ל-GitHub
npm run auto-commit

# או בצורה ידנית:
git add .
git commit -m "תיאור קצר של השינוי"
# (המערכת תוסיף אוטומטית פרטים נוספים)
\`\`\`

### סינכרון ידני עם GitHub
\`\`\`powershell
# סנכרן עם GitHub (pull + push)
npm run sync
\`\`\`

### בדיקת מצב ומידע
\`\`\`powershell
# הצג מידע על הגרסה הנוכחית
npm run version:current

# הצג היסטוריית גרסאות (20 אחרונות)
npm run version:history

# בדוק סטטוס Git
git status
\`\`\`

## 🎯 תרחישי שימוש נפוצים

### תרחיש 1: עבדתי על הקוד ורוצה לשמור ולסנכרן
\`\`\`powershell
npm run auto-commit
\`\`\`
זהו! המערכת תעשה הכל בשבילך:
- ✅ תבדוק אילו קבצים השתנו
- ✅ תוסיף אותם ל-Git
- ✅ תיצור commit עם הודעה מפורטת
- ✅ תעלה ל-GitHub אוטומטית
- ✅ תשמור מידע על הגרסה

### תרחיש 2: רוצה לראות מה השתנה
\`\`\`powershell
# הצג סטטוס
git status

# הצג שינויים
git diff

# הצג מידע על הגרסה
npm run version:current
\`\`\`

### תרחיש 3: רוצה לראות היסטוריה
\`\`\`powershell
# היסטוריה גרפית יפה
npm run version:history

# היסטוריה מפורטת יותר
git log --oneline -10

# הצג שינויים בין commits
git log -p -2
\`\`\`

### תרחיש 4: משיכת שינויים מהשרת
\`\`\`powershell
# משוך שינויים חדשים
git pull

# או השתמש בסינכרון המלא
npm run sync
\`\`\`

## 📁 מבנה הפרויקט

\`\`\`
.
├── .github/
│   ├── workflows/
│   │   └── auto-sync.yml          # GitHub Actions לסינכרון אוטומטי
│   └── VERSION_CONTROL.md         # תיעוד מפורט
│
├── .husky/                         # Git hooks
│   ├── pre-commit                 # בדיקות לפני commit
│   ├── pre-commit.ps1             # גרסת PowerShell
│   ├── prepare-commit-msg         # יצירת הודעה מפורטת
│   ├── prepare-commit-msg.ps1     # גרסת PowerShell
│   ├── post-commit                # סינכרון אחרי commit
│   └── post-commit.ps1            # גרסת PowerShell
│
├── scripts/
│   ├── auto-commit.js             # סקריפט commit אוטומטי
│   ├── version-info.js            # הצגת מידע על גרסה
│   └── sync-github.js             # סינכרון עם GitHub
│
└── .versions/                      # תיקיית גרסאות (נוצרת אוטומטית)
    ├── version-2024-10-14-1430.json
    ├── version-2024-10-14-1445.json
    └── CHANGELOG.md               # רשימת שינויים
\`\`\`

## 🔧 התאמה אישית

### שינוי תבנית הודעת Commit
ערוך את `.husky/prepare-commit-msg` או `.husky/prepare-commit-msg.ps1`

### שינוי תדירות הסינכרון
ערוך את `.github/workflows/auto-sync.yml` בחלק `on:`

### הוספת בדיקות נוספות
הוסף בדיקות ב-`.husky/pre-commit` או `.husky/pre-commit.ps1`

## 🎨 דוגמת הודעת Commit

כשאתה מריץ `npm run auto-commit`, תיווצר הודעה כזו:

\`\`\`
🔄 עדכון אוטומטי - גרסה 2024.10.14.1430

📋 פרטי העדכון:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ תאריך: 14/10/2024 14:30:45
📊 קבצים ששונו: 5
🏷️  גרסה: 2024.10.14.1430

📝 שינויים:
   • M  src/components/PasukDisplay.tsx
   • M  src/App.tsx
   • A  src/components/NewComponent.tsx
   • M  package.json
   • M  README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ שינויים אלו נשמרו ונסנכרנו אוטומטית
\`\`\`

## 📊 קובץ גרסה לדוגמה

\`\`\`json
{
  "version": "2024.10.14.1430",
  "timestamp": "2024-10-14T14:30:45.123Z",
  "branch": "main",
  "filesChanged": 5,
  "files": [
    "M  src/components/PasukDisplay.tsx",
    "M  src/App.tsx",
    "A  src/components/NewComponent.tsx"
  ],
  "commit": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}
\`\`\`

## 🔒 אבטחה והרשאות

### GitHub Token
GitHub Actions משתמש ב-`GITHUB_TOKEN` המובנה. אין צורך בהגדרה נוספת.

### הרשאות נדרשות
- `contents: write` - כתיבת קבצים
- `pull-requests: write` - יצירת PRs (אופציונלי)

## ❓ פתרון בעיות

### הסינכרון לא עובד
\`\`\`powershell
# בדוק חיבור לאינטרנט
ping github.com

# בדוק הגדרות remote
git remote -v

# נסה לסנכרן ידנית
git push origin main
\`\`\`

### Husky לא עובד
\`\`\`powershell
# התקן מחדש
npm install
npm run prepare

# בדוק שה-hooks קיימים
ls .husky/
\`\`\`

### הודעות commit לא מפורטות
\`\`\`powershell
# וודא ש-PowerShell scripts ניתנים להרצה
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# או השתמש בסקריפט הישיר
node scripts/auto-commit.js
\`\`\`

## 🎓 טיפים ועצות

1. **הרץ תמיד `npm run version:current`** לפני שאתה מתחיל לעבוד
2. **השתמש ב-`npm run auto-commit`** במקום `git commit` רגיל
3. **בדוק את `.versions/`** כדי לראות היסטוריה מפורטת
4. **הרץ `npm run sync`** בתחילת כל יום כדי להתעדכן

## 📞 תמיכה

במקרה של בעיות:
1. בדוק את `.github/VERSION_CONTROL.md`
2. בדוק את `git status`
3. בדוק את `git log --oneline -5`
4. הרץ `npm run version:current`

## 📜 רישיון

הפרויקט הזה הוא חלק מ-Torah QA Explorer.

---

**נוצר עם ❤️ לניהול גרסאות וסינכרון אוטומטי מלא**
