# 🔌 ניהול פורטים - Port Management

## 📌 פורטים מוגדרים

הפרויקט משתמש בפורטים **קבועים וייעודיים** בטווח **4000-5000** כדי למנוע בלבול ועימותים.

### פורטים פעילים

| שירות | פורט | תיאור | פקודה |
|-------|------|-------|-------|
| **Development Server** | `4500` | שרת הפיתוח הראשי | `npm run dev` |
| **Preview Server** | `4501` | תצוגת production build | `npm run preview` |

## 🚀 הרצת הפרויקט

### פיתוח (Development)

```bash
# הרצה רגילה
npm run dev

# הרצה עם פתיחה אוטומטית בדפדפן
npm run dev:open
```

השרת יעלה על: **http://localhost:4500**

### תצוגה מקדימה (Preview)

```bash
# Build + Preview
npm run build
npm run preview

# Preview עם פתיחה אוטומטית
npm run preview:open
```

השרת יעלה על: **http://localhost:4501**

## 🛡️ מנגנון הגנה

### StrictPort Mode
הפרויקט מוגדר עם `strictPort: true` - משמעות הדבר:

✅ **אם הפורט פנוי** - השרת יעלה בהצלחה  
❌ **אם הפורט תפוס** - השרת יכשל ולא ינסה פורט אחר

זה **מונע בלבול** - תמיד תדע בדיוק על איזה פורט האפליקציה רצה!

### דוגמה לשגיאה

אם הפורט תפוס, תראה:
```
Error: Port 4500 is already in use
```

## 🔍 בדיקת פורטים תפוסים

### Windows (PowerShell)

```powershell
# בדוק איזה תהליך משתמש בפורט 4500
netstat -ano | Select-String "4500"

# בדוק פורטים 4500-4501
netstat -ano | Select-String "450[0-1]"

# הצג פרטי תהליך
Get-Process -Id <PID>

# סגור תהליך (זהירות!)
Stop-Process -Id <PID> -Force
```

### Linux/Mac

```bash
# בדוק פורט 4500
lsof -i :4500

# בדוק טווח פורטים
lsof -i :4500-4501

# הרוג תהליך
kill -9 <PID>
```

## 📋 פקודות מהירות

### התקנה ראשונית
```bash
npm install
```

### הרצה מהירה
```bash
# פיתוח
npm run dev

# או עם פתיחה אוטומטית
npm run dev:open
```

### בדיקת גרסה
```bash
npm run version:current
```

### Build ותצוגה
```bash
npm run build
npm run preview
```

## 🎯 למה פורט 4500?

1. **טווח 4000-5000** - טווח בטוח, לא נמצא בשימוש תכוף
2. **4500** - מספר עגול, קל לזכור
3. **4501** - סמוך ל-4500, אבל שונה בבירור
4. **StrictPort** - מבטיח שלא יהיה בלבול

## ⚙️ שינוי פורטים

אם בכל זאת צריך לשנות את הפורט:

### אופציה 1: דרך vite.config.ts
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 4600, // שנה כאן
    strictPort: true,
  },
  preview: {
    port: 4601, // שנה כאן
    strictPort: true,
  },
});
```

### אופציה 2: דרך package.json
```json
{
  "scripts": {
    "dev": "vite --port 4600 --strictPort",
    "preview": "vite preview --port 4601 --strictPort"
  }
}
```

### אופציה 3: דרך .env (לא מומלץ כאן)
```env
VITE_PORT=4600
```

## 🔥 פתרון בעיות נפוצות

### הפורט תפוס
```powershell
# Windows: מצא ועצור את התהליך
$port = 4500
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    $pid = $process.OwningProcess
    Write-Host "פורט $port תפוס על ידי תהליך $pid"
    Stop-Process -Id $pid -Force
    Write-Host "התהליך נעצר"
}
```

### מספר instances רצים
```bash
# עצור את כל תהליכי node
taskkill /F /IM node.exe

# או עצור רק vite
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process
```

### HMR לא עובד
בדוק ש:
1. הפורט פתוח בחומת האש
2. אין proxy/VPN שחוסמים
3. הפורט בטווח המותר (4000-5000 ✓)

## 📊 סטטיסטיקות פורטים

| טווח | שימוש נפוץ | בטוח לשימוש? |
|------|-----------|--------------|
| 1-1023 | System ports | ❌ לא |
| 1024-3999 | שירותים ידועים | ⚠️ זהירות |
| **4000-5000** | **פיתוח/Testing** | ✅ **כן** |
| 5001-8000 | שירותים שונים | ⚠️ זהירות |
| 8000-9999 | פיתוח נפוץ | ⚠️ עמוס |

## ✅ סיכום

- 🎯 **פורט dev: 4500**
- 🎯 **פורט preview: 4501**
- 🛡️ **StrictPort מופעל** - אין בלבול!
- 📦 **טווח 4000-5000** - בטוח ונקי
- 🚀 **פקודה:** `npm run dev`

---

**זכור: אם הפורט תפוס - זה feature, לא bug! המערכת מגינה עליך מבלבול 💪**
