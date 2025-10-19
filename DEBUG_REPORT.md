# Torah QA Explorer - Debug Summary Report

## 🔍 בדיקה והתקנת Debug

תאריך: 2025-10-19

### ❌ הבעיה שהתגלתה:
השרת היה נסגר אוטומטית מיד אחרי ההפעלה כאשר רץ דרך `run_in_terminal` עם `isBackground=true`.

### 🔧 הפתרונות שיושמו:

#### 1. **קבצי Debug חדשים שנוצרו:**

- **`START_SERVER.ps1`** (מומלץ!) ⭐
  - סקריפט PowerShell מקיף שבודק את כל התנאים
  - רץ בחלון PowerShell נפרד שנשאר פתוח
  - מזהה בעיות (פורט תפוס, Node.js חסר, תלויות חסרות)
  - **כיצד להריץ:** `Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", ".\START_SERVER.ps1"`
  - או פשוט: לחץ לחיצה ימנית → "Run with PowerShell"

- **`start-server-debug.ps1`**
  - גרסה מפורטת יותר עם timestamps
  - מציג כל פלט השרת עם חותמת זמן

- **`keep-alive.ps1`**
  - מצב שומר חיים - מפעיל מחדש אוטומטית אם השרת קורס
  - תומך ב-10 ניסיונות הפעלה מחדש
  - שומר לוגים ב-`server-output.log` ו-`server-error.log`

- **`start-server.bat`**
  - קובץ Batch פשוט לחלונות
  - אופציה קלה ליוזרים ללא PowerShell

#### 2. **שיפורים ב-`vite.config.ts`:**

```typescript
server: {
  middlewareMode: false,  // מונע סגירה אוטומטית
  fs: {
    strict: false,        // גמישות בטעינת קבצים
  },
}
optimizeDeps: {
  include: ['react', 'react-dom', 'react-router-dom'],  // אופטימיזציה
}
logLevel: 'info',  // לוגים מפורטים
```

### ✅ הפתרון הסופי:

השרת כעת רץ **בהצלחה** בחלון PowerShell נפרד!

```
✅ VITE v5.4.19 ready
✅ Port 8080 LISTENING (PID: 32624)
✅ Server URL: http://localhost:8080
```

### 🎯 איך להפעיל את השרת מעכשיו:

#### **דרך 1: קובץ START_SERVER.ps1 (מומלץ)**
```powershell
.\START_SERVER.ps1
```
או לחיצה ימנית → "Run with PowerShell"

#### **דרך 2: NPM רגיל (פחות יציב ב-VS Code)**
```powershell
npm run dev
```

#### **דרך 3: Keep-Alive Mode (עם הפעלה מחדש אוטומטית)**
```powershell
.\keep-alive.ps1
```

### ⚠️ הנחיות חשובות:

1. **אל תסגור את חלון PowerShell** שבו רץ השרת!
2. השרת רץ בחלון **נפרד** - חפש חלון PowerShell חדש שנפתח
3. אם תסגור את VS Code - השרת יישאר רץ (בחלון הנפרד)
4. לעצירת השרת: `Ctrl+C` בחלון PowerShell הנפרד

### 📊 סטטוס נוכחי:

- ✅ שרת רץ על http://localhost:8080
- ✅ PID: 32624
- ✅ Simple Browser פתוח ב-VS Code
- ✅ HMR פעיל

### 🐛 למה זה קרה?

כאשר `run_in_terminal` עם `isBackground=true` מריץ תהליך אינטראקטיבי כמו Vite,
התהליך יכול להסתיים כשה-"terminal handle" משתחרר או כשאין stdout פעיל.

הפתרון: להריץ בחלון טרמינל **נפרד ועצמאי** שלא תלוי ב-VS Code API.

---

**הפרויקט כעת רץ בהצלחה! 🎉**
