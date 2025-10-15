import { ThemePresetConfig, HebrewFont } from '@/types/theme';

// Pre-defined theme presets
export const THEME_PRESETS: ThemePresetConfig[] = [
  {
    id: 'default',
    name: 'ברירת מחדל',
    description: 'ערכת הצבעים הסטנדרטית',
    isDark: false,
    colors: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(221.2 83.2% 53.3%)',
      primaryForeground: 'hsl(210 40% 98%)',
      secondary: 'hsl(210 40% 96.1%)',
      secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
      accent: 'hsl(210 40% 96.1%)',
      accentForeground: 'hsl(222.2 47.4% 11.2%)',
      muted: 'hsl(210 40% 96.1%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
    }
  },
  {
    id: 'ocean',
    name: 'אוקיינוס',
    description: 'גוונים של כחול ותכלת',
    isDark: false,
    colors: {
      background: 'hsl(200 30% 98%)',
      foreground: 'hsl(210 50% 10%)',
      primary: 'hsl(200 80% 45%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(200 40% 92%)',
      secondaryForeground: 'hsl(210 50% 15%)',
      accent: 'hsl(180 60% 50%)',
      accentForeground: 'hsl(0 0% 100%)',
      muted: 'hsl(200 30% 94%)',
      mutedForeground: 'hsl(200 20% 40%)',
      card: 'hsl(200 40% 99%)',
      cardForeground: 'hsl(210 50% 10%)',
      border: 'hsl(200 30% 85%)',
      destructive: 'hsl(0 70% 55%)',
      destructiveForeground: 'hsl(0 0% 100%)',
    }
  },
  {
    id: 'forest',
    name: 'יער',
    description: 'טבע ירוק רגוע',
    isDark: false,
    colors: {
      background: 'hsl(120 20% 97%)',
      foreground: 'hsl(120 30% 15%)',
      primary: 'hsl(140 60% 40%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(120 25% 90%)',
      secondaryForeground: 'hsl(120 30% 20%)',
      accent: 'hsl(160 50% 45%)',
      accentForeground: 'hsl(0 0% 100%)',
      muted: 'hsl(120 20% 93%)',
      mutedForeground: 'hsl(120 15% 45%)',
      card: 'hsl(120 25% 98%)',
      cardForeground: 'hsl(120 30% 15%)',
      border: 'hsl(120 20% 82%)',
      destructive: 'hsl(0 70% 55%)',
      destructiveForeground: 'hsl(0 0% 100%)',
    }
  },
  {
    id: 'sunset',
    name: 'שקיעה',
    description: 'כתום וסגול חמים',
    isDark: false,
    colors: {
      background: 'hsl(30 40% 98%)',
      foreground: 'hsl(30 30% 12%)',
      primary: 'hsl(25 85% 55%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(30 40% 92%)',
      secondaryForeground: 'hsl(30 30% 18%)',
      accent: 'hsl(280 60% 55%)',
      accentForeground: 'hsl(0 0% 100%)',
      muted: 'hsl(30 35% 94%)',
      mutedForeground: 'hsl(30 20% 42%)',
      card: 'hsl(30 45% 99%)',
      cardForeground: 'hsl(30 30% 12%)',
      border: 'hsl(30 30% 85%)',
      destructive: 'hsl(0 75% 58%)',
      destructiveForeground: 'hsl(0 0% 100%)',
    }
  },
  {
    id: 'lavender',
    name: 'לבנדר',
    description: 'סגול עדין ורך',
    isDark: false,
    colors: {
      background: 'hsl(270 30% 98%)',
      foreground: 'hsl(270 40% 12%)',
      primary: 'hsl(260 60% 55%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(270 35% 92%)',
      secondaryForeground: 'hsl(270 40% 18%)',
      accent: 'hsl(290 55% 60%)',
      accentForeground: 'hsl(0 0% 100%)',
      muted: 'hsl(270 30% 94%)',
      mutedForeground: 'hsl(270 20% 44%)',
      card: 'hsl(270 40% 99%)',
      cardForeground: 'hsl(270 40% 12%)',
      border: 'hsl(270 25% 86%)',
      destructive: 'hsl(0 72% 56%)',
      destructiveForeground: 'hsl(0 0% 100%)',
    }
  },
  {
    id: 'sepia',
    name: 'ספיה',
    description: 'חום עתיק נעים לעיניים',
    isDark: false,
    colors: {
      background: 'hsl(40 30% 96%)',
      foreground: 'hsl(30 25% 15%)',
      primary: 'hsl(35 50% 40%)',
      primaryForeground: 'hsl(40 30% 98%)',
      secondary: 'hsl(40 25% 88%)',
      secondaryForeground: 'hsl(30 25% 20%)',
      accent: 'hsl(25 60% 50%)',
      accentForeground: 'hsl(40 30% 98%)',
      muted: 'hsl(40 25% 91%)',
      mutedForeground: 'hsl(35 18% 48%)',
      card: 'hsl(40 35% 97%)',
      cardForeground: 'hsl(30 25% 15%)',
      border: 'hsl(40 20% 83%)',
      destructive: 'hsl(0 65% 52%)',
      destructiveForeground: 'hsl(40 30% 98%)',
    }
  },
  {
    id: 'high-contrast',
    name: 'ניגודיות גבוהה',
    description: 'שחור לבן חד לנגישות',
    isDark: false,
    colors: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(0 0% 0%)',
      primary: 'hsl(0 0% 10%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(0 0% 95%)',
      secondaryForeground: 'hsl(0 0% 5%)',
      accent: 'hsl(0 0% 20%)',
      accentForeground: 'hsl(0 0% 100%)',
      muted: 'hsl(0 0% 92%)',
      mutedForeground: 'hsl(0 0% 30%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(0 0% 0%)',
      border: 'hsl(0 0% 70%)',
      destructive: 'hsl(0 0% 15%)',
      destructiveForeground: 'hsl(0 0% 100%)',
    }
  },
  {
    id: 'classic',
    name: 'קלאסי',
    description: 'עיצוב קלאסי עם בז\' וכחול-אפור',
    isDark: false,
    colors: {
      background: 'hsl(45 35% 94%)',      // רקע בז'/שמנת בהיר
      foreground: 'hsl(210 25% 20%)',     // טקסט כחול-אפור כהה
      primary: 'hsl(210 30% 35%)',        // כפתורים כחול-אפור
      primaryForeground: 'hsl(0 0% 100%)', // טקסט לבן על כפתורים
      secondary: 'hsl(45 25% 88%)',       // רקע משני בז'
      secondaryForeground: 'hsl(210 25% 25%)', // טקסט על רקע משני
      accent: 'hsl(210 35% 45%)',         // מבטאים כחול-אפור בהיר יותר
      accentForeground: 'hsl(0 0% 100%)', // טקסט על מבטאים
      muted: 'hsl(45 20% 90%)',           // רקע עמום
      mutedForeground: 'hsl(210 15% 45%)', // טקסט עמום
      card: 'hsl(0 0% 100%)',             // כרטיסים לבנים
      cardForeground: 'hsl(210 25% 20%)', // טקסט בכרטיסים
      border: 'hsl(45 20% 82%)',          // גבולות עדינים
      destructive: 'hsl(0 70% 50%)',      // אדום להרס
      destructiveForeground: 'hsl(0 0% 100%)', // טקסט לבן
    }
  },
  {
    id: 'cream',
    name: 'שמנת',
    description: 'רקע שמנת חם ונעים #FCF6E3',
    isDark: false,
    colors: {
      background: 'hsl(45 65% 94%)',      // #FCF6E3 - רקע שמנת
      foreground: 'hsl(30 25% 20%)',      // טקסט חום כהה
      primary: 'hsl(25 60% 45%)',         // כתום-חום עמוק
      primaryForeground: 'hsl(0 0% 100%)', // טקסט לבן
      secondary: 'hsl(40 50% 88%)',       // בז' זהוב
      secondaryForeground: 'hsl(30 30% 25%)', // חום כהה
      accent: 'hsl(35 70% 55%)',          // זהב חם
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(42 55% 91%)',           // שמנת בהיר יותר
      mutedForeground: 'hsl(30 20% 45%)', // חום בינוני
      card: 'hsl(0 0% 100%)',             // כרטיסים לבנים
      cardForeground: 'hsl(30 25% 20%)',  // חום כהה
      border: 'hsl(40 40% 80%)',          // גבול זהוב עדין
      destructive: 'hsl(0 65% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'lavender',
    name: 'לבנדר',
    description: 'סגול עדין ורומנטי',
    isDark: false,
    colors: {
      background: 'hsl(270 40% 97%)',     // רקע סגול בהיר מאוד
      foreground: 'hsl(270 30% 20%)',     // טקסט סגול כהה
      primary: 'hsl(270 50% 50%)',        // סגול עמוק
      primaryForeground: 'hsl(0 0% 100%)', // לבן
      secondary: 'hsl(280 35% 92%)',      // ורוד-סגול בהיר
      secondaryForeground: 'hsl(270 35% 25%)', // סגול כהה
      accent: 'hsl(260 60% 60%)',         // סגול בהיר
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(270 30% 94%)',          // סגול עמום
      mutedForeground: 'hsl(270 20% 45%)', // סגול בינוני
      card: 'hsl(0 0% 100%)',             // לבן
      cardForeground: 'hsl(270 30% 20%)', // סגול כהה
      border: 'hsl(270 30% 85%)',         // גבול סגול עדין
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'mint',
    name: 'מנטה',
    description: 'ירוק מנטה רענן ומרגיע',
    isDark: false,
    colors: {
      background: 'hsl(160 50% 97%)',     // רקע מנטה בהיר
      foreground: 'hsl(160 40% 15%)',     // טקסט ירוק כהה
      primary: 'hsl(160 60% 40%)',        // ירוק מנטה עמוק
      primaryForeground: 'hsl(0 0% 100%)', // לבן
      secondary: 'hsl(165 45% 90%)',      // מנטה בהיר
      secondaryForeground: 'hsl(160 45% 20%)', // ירוק כהה
      accent: 'hsl(155 65% 50%)',         // ירוק בהיר
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(160 40% 93%)',          // מנטה עמום
      mutedForeground: 'hsl(160 25% 45%)', // ירוק בינוני
      card: 'hsl(0 0% 100%)',             // לבן
      cardForeground: 'hsl(160 40% 15%)', // ירוק כהה
      border: 'hsl(160 35% 82%)',         // גבול ירוק עדין
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'rose-gold',
    name: 'רוז-גולד',
    description: 'ורוד-זהב יוקרתי ומעודן',
    isDark: false,
    colors: {
      background: 'hsl(350 60% 98%)',     // רקע ורוד בהיר מאוד
      foreground: 'hsl(340 35% 20%)',     // טקסט חום-ורוד כהה
      primary: 'hsl(340 60% 50%)',        // רוז-גולד עמוק
      primaryForeground: 'hsl(0 0% 100%)', // לבן
      secondary: 'hsl(345 50% 92%)',      // ורוד בהיר
      secondaryForeground: 'hsl(340 40% 25%)', // חום-ורוד
      accent: 'hsl(30 70% 60%)',          // זהב חם
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(350 45% 95%)',          // ורוד עמום
      mutedForeground: 'hsl(340 25% 50%)', // חום-ורוד בינוני
      card: 'hsl(0 0% 100%)',             // לבן
      cardForeground: 'hsl(340 35% 20%)', // חום-ורוד כהה
      border: 'hsl(345 40% 85%)',         // גבול ורוד עדין
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'sky-blue',
    name: 'תכלת שמיים',
    description: 'תכלת בהיר ומרענן',
    isDark: false,
    colors: {
      background: 'hsl(200 70% 98%)',     // רקע תכלת בהיר מאוד
      foreground: 'hsl(210 50% 15%)',     // טקסט כחול כהה
      primary: 'hsl(205 80% 50%)',        // תכלת חי
      primaryForeground: 'hsl(0 0% 100%)', // לבן
      secondary: 'hsl(200 60% 92%)',      // תכלת בהיר
      secondaryForeground: 'hsl(210 50% 20%)', // כחול כהה
      accent: 'hsl(195 75% 55%)',         // תכלת בהיר
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(200 55% 94%)',          // תכלת עמום
      mutedForeground: 'hsl(210 30% 45%)', // כחול בינוני
      card: 'hsl(0 0% 100%)',             // לבן
      cardForeground: 'hsl(210 50% 15%)', // כחול כהה
      border: 'hsl(200 50% 85%)',         // גבול תכלת עדין
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'coral',
    name: 'אלמוג',
    description: 'כתום-ורוד חמים ותוססים',
    isDark: false,
    colors: {
      background: 'hsl(15 70% 97%)',      // רקע אלמוג בהיר
      foreground: 'hsl(15 40% 20%)',      // טקסט חום כהה
      primary: 'hsl(10 75% 55%)',         // אלמוג עמוק
      primaryForeground: 'hsl(0 0% 100%)', // לבן
      secondary: 'hsl(20 60% 90%)',       // אפרסק בהיר
      secondaryForeground: 'hsl(15 45% 25%)', // חום
      accent: 'hsl(5 80% 60%)',           // כתום-אדום
      accentForeground: 'hsl(0 0% 100%)', // לבן
      muted: 'hsl(15 55% 93%)',           // אלמוג עמום
      mutedForeground: 'hsl(15 30% 45%)', // חום בינוני
      card: 'hsl(0 0% 100%)',             // לבן
      cardForeground: 'hsl(15 40% 20%)',  // חום כהה
      border: 'hsl(15 50% 83%)',          // גבול אלמוג עדין
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  },
  {
    id: 'navy-gold',
    name: 'כחול-זהב תורני',
    description: 'עיצוב תורני מסורתי - כחול נייבי עם זהב זוהר',
    isDark: false,
    colors: {
      background: 'hsl(210 15% 95%)',     // רקע אפור-כחול בהיר (כמו בתמונה)
      foreground: 'hsl(210 30% 20%)',     // טקסט כהה
      primary: 'hsl(220 50% 15%)',        // כחול כהה חזק קרוב לשחור
      primaryForeground: 'hsl(45 100% 93%)', // טקסט זהוב בהיר
      secondary: 'hsl(210 20% 88%)',      // אפור-כחול
      secondaryForeground: 'hsl(220 50% 15%)', // כחול כהה
      accent: 'hsl(45 100% 65%)',         // זהב זוהר (#FFE066)
      accentForeground: 'hsl(0 0% 100%)', // לבן על זהב
      muted: 'hsl(210 18% 92%)',          // אפור בהיר
      mutedForeground: 'hsl(210 25% 45%)', // אפור-כחול בינוני
      card: 'hsl(0 0% 100%)',             // כרטיסים לבנים
      cardForeground: 'hsl(210 30% 20%)', // טקסט כהה
      border: 'hsl(45 100% 65%)',         // גבול זהב זוהר
      destructive: 'hsl(0 70% 55%)',      // אדום
      destructiveForeground: 'hsl(0 0% 100%)', // לבן
    }
  }
];

// Hebrew fonts collection
export const HEBREW_FONTS: HebrewFont[] = [
  {
    id: 'frank-ruhl',
    name: 'Frank Ruhl Libre',
    displayName: 'פרנק רוהל',
    family: "'Frank Ruhl Libre', serif",
    weights: [300, 400, 500, 700, 900],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&display=swap',
  },
  {
    id: 'david',
    name: 'David Libre',
    displayName: 'דוד',
    family: "'David Libre', serif",
    weights: [400, 500, 700],
    cssUrl: 'https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500;700&display=swap',
  },
  {
    id: 'rubik',
    name: 'Rubik',
    displayName: 'רוביק',
    family: "'Rubik', sans-serif",
    weights: [300, 400, 500, 600, 700, 800, 900],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap',
  },
  {
    id: 'assistant',
    name: 'Assistant',
    displayName: 'אסיסטנט',
    family: "'Assistant', sans-serif",
    weights: [200, 300, 400, 500, 600, 700, 800],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap',
  },
  {
    id: 'heebo',
    name: 'Heebo',
    displayName: 'היבו',
    family: "'Heebo', sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap',
  },
  {
    id: 'alef',
    name: 'Alef',
    displayName: 'אלף',
    family: "'Alef', sans-serif",
    weights: [400, 700],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Alef:wght@400;700&display=swap',
  },
  {
    id: 'secular-one',
    name: 'Secular One',
    displayName: 'סקולר',
    family: "'Secular One', sans-serif",
    weights: [400],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Secular+One&display=swap',
  },
  {
    id: 'system',
    name: 'System Default',
    displayName: 'ברירת מחדל',
    family: 'system-ui, -apple-system, sans-serif',
    weights: [400, 500, 600, 700],
    isLocal: true,
  }
];

// Background patterns (CSS patterns)
export const BACKGROUND_PATTERNS = {
  none: '',
  dots: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
  grid: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
  waves: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
  paper: `repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)`,
  fabric: `repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 6px)`
};
