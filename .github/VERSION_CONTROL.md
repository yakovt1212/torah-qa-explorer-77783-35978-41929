# Version Control System - מערכת ניהול גרסאות

מערכת זו מספקת סינכרון אוטומטי עם GitHub וניהול גרסאות מפורט.

## תכונות

### 🔄 סינכרון אוטומטי
- כל שינוי נשמר אוטומטית ב-Git
- סינכרון מיידי עם GitHub לאחר כל commit
- יצירת גרסאות אוטומטית עם חותמת זמן

### 📝 תיעוד מפורט
- הודעות commit אוטומטיות עם פירוט שינויים
- רשימת קבצים ששונו
- תאריך ושעה מדויקים
- מספר גרסה ייחודי

### 🏷️ ניהול גרסאות
- כל גרסה מתועדת בקובץ JSON נפרד
- מעקב אחר שינויים לאורך זמן
- יכולת לחזור לגרסאות קודמות

## שימוש

### Commit ידני
```bash
git add .
git commit -m "תיאור השינוי"
```

המערכת תוסיף אוטומטית:
- מספר גרסה
- רשימת קבצים ששונו
- תאריך ושעה
- סינכרון אוטומטי ל-GitHub

### Commit אוטומטי
```bash
npm run auto-commit
```

### בדיקת סטטוס
```bash
git status
npm run version:current
```

### היסטוריית גרסאות
```bash
npm run version:history
```

## מבנה קבצים

```
.github/workflows/
  └── auto-sync.yml          # GitHub Actions לסינכרון אוטומטי
.husky/
  ├── pre-commit             # בדיקות לפני commit
  ├── prepare-commit-msg     # יצירת הודעת commit מפורטת
  └── post-commit            # סינכרון אוטומטי אחרי commit
.versions/
  └── version-*.json         # קבצי תיעוד גרסאות
scripts/
  ├── auto-commit.js         # סקריפט לcommit אוטומטי
  ├── version-info.js        # מידע על גרסה נוכחית
  └── sync-github.js         # סינכרון ידני עם GitHub
```

## תצורה

### הגדרות Git
```bash
git config --local commit.template .gitmessage
git config --local core.autocrlf true
```

### הרשאות GitHub
וודא שיש לך הרשאות write ל-repository ב-GitHub.

## פקודות נפוצות

| פקודה | תיאור |
|-------|-------|
| `npm run auto-commit` | Commit אוטומטי עם הודעה מפורטת |
| `npm run sync` | סינכרון עם GitHub |
| `npm run version:current` | הצג גרסה נוכחית |
| `npm run version:history` | הצג היסטוריית גרסאות |
| `git log --oneline` | היסטוריית commits |

## Changelog אוטומטי

המערכת יוצרת CHANGELOG אוטומטי עבור כל גרסה ב:
- `.versions/CHANGELOG.md`
- עדכון אוטומטי עם כל שינוי

## תמיכה

במקרה של בעיות:
1. בדוק `git status`
2. בדוק `git remote -v`
3. וודא חיבור לאינטרנט
4. בדוק הרשאות GitHub
