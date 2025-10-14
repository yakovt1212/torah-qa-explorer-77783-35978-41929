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

  // Apply theme to document
  const applyTheme = () => {
    const preset = THEME_PRESETS.find(p => p.id === settings.preset);
    if (!preset) return;

    const root = document.documentElement;

    // Apply colors as CSS variables (shadcn/ui format)
    root.style.setProperty('--background', preset.colors.background.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--foreground', preset.colors.foreground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--primary', preset.colors.primary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--primary-foreground', preset.colors.primaryForeground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--secondary', preset.colors.secondary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--secondary-foreground', preset.colors.secondaryForeground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--accent', preset.colors.accent.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--accent-foreground', preset.colors.accentForeground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--muted', preset.colors.muted.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--muted-foreground', preset.colors.mutedForeground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--card', preset.colors.card.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--card-foreground', preset.colors.cardForeground.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--border', preset.colors.border.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--destructive', preset.colors.destructive.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--destructive-foreground', preset.colors.destructiveForeground.replace('hsl(', '').replace(')', ''));

    // Apply background pattern
    if (settings.backgroundPattern !== 'none') {
      const pattern = BACKGROUND_PATTERNS[settings.backgroundPattern];
      const opacity = settings.patternOpacity / 100;
      // Apply pattern as background image
      document.body.style.setProperty('--bg-pattern', `url("data:image/svg+xml,${encodeURIComponent(pattern)}")`);
      document.body.style.setProperty('--bg-pattern-opacity', opacity.toString());
    } else {
      document.body.style.removeProperty('--bg-pattern');
      document.body.style.removeProperty('--bg-pattern-opacity');
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

  // Save to localStorage and apply theme whenever settings change
  useEffect(() => {
    localStorage.setItem('theme_presets', JSON.stringify(settings));
    applyTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

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
