# תיקון: בחירה מהירה נסגרת אוטומטית

## 🐛 הבעיה
הכפתור של הבחירה המהירה (Quick Selector) פותח את החלון, אבל אחרי 5 שניות הוא נסגר אוטומטית.

## 🔍 הסיבה
ב-hook `useQuickSelector` היה מנגנון `AUTO_HIDE_DELAY` שהיה מוגדר ל-5000ms (5 שניות) עם `autoHideEnabled: true` כברירת מחדל.

```typescript
const AUTO_HIDE_DELAY = 5000; // 5 seconds

export function useQuickSelector(
  isMobile: boolean,
  startMinimized: boolean = false,
  autoHideEnabled: boolean = true  // ⚠️ הבעיה כאן!
)
```

הקוד היה מריץ טיימר שסוגר את החלון אוטומטית:

```typescript
// Auto-hide logic (only on desktop, only if not pinned and not minimized, and if enabled)
useEffect(() => {
  if (!autoHideEnabled) {
    // If auto-hide is disabled, clear any timer and skip effect
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    return;
  }
  
  // Start auto-hide timer ONLY if conditions allow
  autoHideTimerRef.current = setTimeout(() => {
    setState(prev => {
      if (!prev.isPinned && !prev.isMinimized && prev.isVisible) {
        return { ...prev, isVisible: false }; // 🔴 סוגר אוטומטית!
      }
      return prev;
    });
  }, AUTO_HIDE_DELAY);
  
  // ...
}, [autoHideEnabled, isMobile, state.isPinned, state.isMinimized, state.isVisible]);
```

## ✅ הפתרון

שיניתי את הקריאות ל-`useQuickSelector` כך שהן מעבירות `false` בפרמטר השלישי (`autoHideEnabled`):

### 1. בקובץ `src/pages/Index.tsx`:
```typescript
// לפני:
const quickSelector = useQuickSelector(isMobile, quickSelectorSettings.startMinimized);

// אחרי:
const quickSelector = useQuickSelector(isMobile, quickSelectorSettings.startMinimized, false); // Disable auto-hide
```

### 2. בקובץ `src/components/QuickSelector.tsx`:
```typescript
// לפני:
const ownHookState = useQuickSelector(isMobile);

// אחרי:
const ownHookState = useQuickSelector(isMobile, false, false); // Disable auto-hide
```

## 🎯 התוצאה

עכשיו החלון של הבחירה המהירה:
- ✅ נשאר פתוח ללא הגבלת זמן
- ✅ נסגר רק כאשר המשתמש לוחץ על:
  - כפתור ה-X
  - כפתור הסגירה
  - מקש ESC
- ✅ לא נסגר אוטומטית אחרי 5 שניות

## 📝 הערות

1. **הטיימר האוטומטי עדיין קיים** בקוד, אבל הוא לא מופעל כי `autoHideEnabled=false`
2. אם בעתיד תרצה להפעיל שוב את הסגירה האוטומטית, אפשר לשנות בחזרה ל-`true`
3. הפונקציונליות של "Pin" (נעיצה) עדיין עובדת, אבל היא לא רלוונטית עכשיו כי אין סגירה אוטומטית

## 🧪 בדיקה

1. לחץ על הכפתור העגול עם 3 קווים (☰) בפינה השמאלית התחתונה
2. החלון של הבחירה המהירה ייפתח
3. חכה יותר מ-5 שניות
4. ✅ החלון יישאר פתוח!
5. לחץ על X או ESC כדי לסגור

---

**תאריך תיקון:** 2025-10-19  
**קבצים שהשתנו:**
- `src/pages/Index.tsx`
- `src/components/QuickSelector.tsx`
