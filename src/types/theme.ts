// Theme preset types for the application

export type ThemePreset = 
  | 'default'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'lavender'
  | 'sepia'
  | 'high-contrast';

export type BackgroundPattern = 
  | 'none'
  | 'dots'
  | 'grid'
  | 'waves'
  | 'paper'
  | 'fabric';

export interface ThemeColors {
  // Main colors
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // UI colors
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  
  // Semantic colors
  destructive: string;
  destructiveForeground: string;
}

export interface HebrewFont {
  id: string;
  name: string;
  displayName: string;
  family: string;
  weights: number[];
  cssUrl?: string; // Google Fonts or external URL
  isLocal?: boolean; // If font is already available in system
}

export interface ThemePresetConfig {
  id: ThemePreset;
  name: string;
  description: string;
  colors: ThemeColors;
  isDark: boolean;
}

export interface ThemeSettings {
  preset: ThemePreset;
  customColors?: Partial<ThemeColors>;
  backgroundPattern: BackgroundPattern;
  patternOpacity: number; // 0-100
  hebrewFont: string; // Font ID
  enableAnimations: boolean;
  borderRadius: number; // 0-20px
}
