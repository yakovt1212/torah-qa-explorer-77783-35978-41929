# בדיקות ביצועים עם Playwright 🚀

## התקנה

```bash
npm install -D @playwright/test
npx playwright install
```

## הרצת הבדיקות

### הרצת כל הבדיקות
```bash
npx playwright test
```

### הרצת בדיקת ביצועים ספציפית
```bash
npx playwright test e2e/performance.spec.ts
```

### הרצה עם UI Mode (מומלץ לפיתוח)
```bash
npx playwright test --ui
```

### הרצה עם דוח HTML
```bash
npx playwright test
npx playwright show-report
```

## הבדיקות הכלולות

### 1. ✅ בדיקת טעינה ראשונית
- מודד זמן טעינה כולל של האתר
- בודק Web Vitals (TTFB, FCP, DOM Interactive)
- מוודא שהאתר נטען תוך 5 שניות

### 2. ✅ בדיקת טעינת חומש
- מודד זמן טעינת חומש בראשית
- בודק שהתוכן מוצג תוך 2 שניות
- מוודא ש-Code Splitting עובד

### 3. ✅ בדיקת מעברים בין חומשים
- מודד זמן מעבר בין חומשים שונים
- מחשב זמן ממוצע למעבר
- מוודא שכל מעבר מהיר (פחות משנייה וחצי)

### 4. ✅ בדיקת ביצועי גלילה
- מודד FPS במהלך גלילה
- בודק ש-Virtualization עובד תקין
- מוודא גלילה חלקה (מעל 30 FPS)

### 5. ✅ בדיקת חיפוש
- מודד זמן תגובה של החיפוש
- בודק שהחיפוש מהיר (פחות משנייה)
- כולל debouncing

### 6. ✅ בדיקת גודל Bundle
- מודד גודל של כל הקבצים שנטענים
- בודק שהגודל הכולל סביר (פחות מ-5MB)
- מציג רשימה מפורטת של כל הקבצים

### 7. ✅ בדיקת שימוש בזיכרון
- מודד שימוש ב-JS Heap
- מוודא שלא עוברים גבולות זיכרון
- בודק ל-memory leaks

### 8. ✅ בדיקת Lazy Loading
- בודק שפירושים נטענים רק כשצריך
- מודד זמן פתיחת פירוש
- מוודא שהטעינה מיידית

### 9. ✅ דוח ביצועים מקיף
- מספק סיכום מלא של כל המדדים
- כולל Timeline מפורט
- מציג Web Vitals מקיפים

## פענוח תוצאות

### ✅ ירוק (טוב)
- טעינה ראשונית: < 3 שניות
- TTFB: < 500ms
- FCP: < 1.5 שניות
- FPS: > 50

### ⚠️ צהוב (בינוני)
- טעינה ראשונית: 3-5 שניות
- TTFB: 500-1000ms
- FCP: 1.5-2 שניות
- FPS: 30-50

### ❌ אדום (צריך שיפור)
- טעינה ראשונית: > 5 שניות
- TTFB: > 1000ms
- FCP: > 2 שניות
- FPS: < 30

## טיפים לשיפור ביצועים

### אם הטעינה איטית:
1. בדוק ש-Code Splitting עובד
2. בדוק גודל קבצי JSON
3. שקול Compression (gzip/brotli)
4. בדוק CDN configuration

### אם הגלילה לא חלקה:
1. בדוק ש-Virtualization מופעל
2. הפחת מספר re-renders
3. השתמש ב-React.memo
4. בדוק CSS animations

### אם החיפוש איטי:
1. הוסף debouncing
2. שקול Web Workers
3. אופטם את אלגוריתם החיפוש
4. שקול indexing מראש

## דוגמאות לפלט

```
⏱️  זמן טעינה כולל: 1245ms
📊 Web Vitals:
   - Time to First Byte (TTFB): 234ms
   - DOM Content Loaded: 89ms
   - Load Complete: 156ms
   - DOM Interactive: 678ms

⏱️  זמן טעינת חומש בראשית: 789ms
📖 נטענו 15 כרטיסי פסוקים

⏱️  מעבר לשמות: 567ms
⏱️  מעבר לויקרא: 543ms
📊 זמן מעבר ממוצע: 555ms

🎮 FPS במהלך גלילה: 58.3
📏 גובה מסמך: 12450px
📐 גובה נראה: 937px

🔍 זמן חיפוש עבור "בראשית": 234ms

📦 גדלי קבצים:
   bereishit.json: 1234.56 KB
   main.js: 456.78 KB
   index.js: 123.45 KB

📊 גודל כולל: 2.45 MB

💾 שימוש בזיכרון:
   Used: 45.67 MB
   Total: 78.90 MB
   Limit: 512.00 MB
```

## CI/CD Integration

הוסף לקובץ `.github/workflows/performance.yml`:

```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```
