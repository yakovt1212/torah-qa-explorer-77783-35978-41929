import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeSettings, ThemePreset, BackgroundPattern } from '@/types/theme';
import { THEME_PRESETS, HEBREW_FONTS, BACKGROUND_PATTERNS } from '@/data/themePresets';

interface ThemePresetsContextType {
  settings: ThemeSettings;
  setPreset: (preset: ThemePreset) => void;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
  setPatternOpacity: (opacity: number) => void;
  setHebrewFont: (fontId: string) => void;
  toggleAnimations: () => void;
  setBorderRadius: (radius: number) => void;
  applyTheme: () => void;
  resetToDefault: () => void;
}

const ThemePresetsContext = createContext<ThemePresetsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ThemeSettings = {
  preset: 'default',
  backgroundPattern: 'none',
  patternOpacity: 5,
  hebrewFont: 'frank-ruhl',
  enableAnimations: true,
  borderRadius: 8,
};

export function ThemePresetsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme_presets');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('theme_presets', JSON.stringify(settings));
    applyTheme();
  }, [settings]);

  // Apply theme to document
  const applyTheme = () => {
    const preset = THEME_PRESETS.find(p => p.id === settings.preset);
    if (!preset) return;

    const root = document.documentElement;

    // Apply colors
    Object.entries(preset.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Apply background pattern
    if (settings.backgroundPattern !== 'none') {
      const pattern = BACKGROUND_PATTERNS[settings.backgroundPattern];
      const opacity = settings.patternOpacity / 100;
      root.style.setProperty('--background-pattern', pattern);
      root.style.setProperty('--pattern-opacity', opacity.toString());
    } else {
      root.style.setProperty('--background-pattern', 'none');
      root.style.setProperty('--pattern-opacity', '0');
    }

    // Apply font
    const font = HEBREW_FONTS.find(f => f.id === settings.hebrewFont);
    if (font) {
      // Load font if needed
      if (font.cssUrl && !font.isLocal) {
        const existingLink = document.querySelector(`link[href="${font.cssUrl}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = font.cssUrl;
          document.head.appendChild(link);
        }
      }
      root.style.setProperty('--font-hebrew', font.family);
    }

    // Apply animations
    root.style.setProperty('--enable-animations', settings.enableAnimations ? '1' : '0');

    // Apply border radius
    root.style.setProperty('--radius', `${settings.borderRadius}px`);
  };

  const setPreset = (preset: ThemePreset) => {
    setSettings(prev => ({ ...prev, preset }));
  };

  const setBackgroundPattern = (pattern: BackgroundPattern) => {
    setSettings(prev => ({ ...prev, backgroundPattern: pattern }));
  };

  const setPatternOpacity = (opacity: number) => {
    setSettings(prev => ({ ...prev, patternOpacity: Math.max(0, Math.min(100, opacity)) }));
  };

  const setHebrewFont = (fontId: string) => {
    setSettings(prev => ({ ...prev, hebrewFont: fontId }));
  };

  const toggleAnimations = () => {
    setSettings(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
  };

  const setBorderRadius = (radius: number) => {
    setSettings(prev => ({ ...prev, borderRadius: Math.max(0, Math.min(20, radius)) }));
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ThemePresetsContext.Provider
      value={{
        settings,
        setPreset,
        setBackgroundPattern,
        setPatternOpacity,
        setHebrewFont,
        toggleAnimations,
        setBorderRadius,
        applyTheme,
        resetToDefault,
      }}
    >
      {children}
    </ThemePresetsContext.Provider>
  );
}

export function useThemePresets() {
  const context = useContext(ThemePresetsContext);
  if (!context) {
    throw new Error('useThemePresets must be used within ThemePresetsProvider');
  }
  return context;
}
