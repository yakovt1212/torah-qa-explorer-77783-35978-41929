import { Palette, Grid3X3, Type, Sparkles, RotateCcw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useThemePresets } from '@/contexts/ThemePresetsContext';
import { THEME_PRESETS, HEBREW_FONTS } from '@/data/themePresets';
import { ThemePreset, BackgroundPattern } from '@/types/theme';
import { cn } from '@/lib/utils';

export function ThemeCustomizer() {
  const {
    settings,
    setPreset,
    setBackgroundPattern,
    setPatternOpacity,
    setHebrewFont,
    toggleAnimations,
    setBorderRadius,
    resetToDefault,
  } = useThemePresets();

  const backgroundPatterns: { value: BackgroundPattern; label: string }[] = [
    { value: 'none', label: 'ללא' },
    { value: 'dots', label: 'נקודות' },
    { value: 'grid', label: 'רשת' },
    { value: 'waves', label: 'גלים' },
    { value: 'paper', label: 'נייר' },
    { value: 'fabric', label: 'בד' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            התאמה אישית של עיצוב
          </SheetTitle>
          <SheetDescription>
            בחר ערכת צבעים, פונט, ורקע לחוויה מותאמת אישית
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Theme Presets */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              ערכת צבעים
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPreset(preset.id as ThemePreset)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-right transition-all hover:scale-105',
                    settings.preset === preset.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-sm">{preset.name}</div>
                    {settings.preset === preset.id && (
                      <Badge variant="default" className="text-xs">פעיל</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                  <div className="flex gap-1 mt-2">
                    <div 
                      className="h-4 w-4 rounded-full border" 
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div 
                      className="h-4 w-4 rounded-full border" 
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div 
                      className="h-4 w-4 rounded-full border" 
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Hebrew Font */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Type className="h-4 w-4" />
              פונט עברי
            </Label>
            <Select value={settings.hebrewFont} onValueChange={setHebrewFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEBREW_FONTS.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    <span style={{ fontFamily: font.family }}>
                      {font.displayName}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-4 rounded-lg border bg-card">
              <p 
                className="text-center text-lg"
                style={{ fontFamily: HEBREW_FONTS.find(f => f.id === settings.hebrewFont)?.family }}
              >
                בראשית ברא אלהים את השמים ואת הארץ
              </p>
            </div>
          </div>

          <Separator />

          {/* Background Pattern */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              רקע/טקסטורה
            </Label>
            <Select 
              value={settings.backgroundPattern} 
              onValueChange={(value) => setBackgroundPattern(value as BackgroundPattern)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundPatterns.map((pattern) => (
                  <SelectItem key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {settings.backgroundPattern !== 'none' && (
              <div className="space-y-2">
                <Label className="text-sm">
                  עוצמת הרקע: {settings.patternOpacity}%
                </Label>
                <Slider
                  value={[settings.patternOpacity]}
                  onValueChange={([value]) => setPatternOpacity(value)}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Border Radius */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              עיגול פינות: {settings.borderRadius}px
            </Label>
            <Slider
              value={[settings.borderRadius]}
              onValueChange={([value]) => setBorderRadius(value)}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex gap-2">
              {[0, 4, 8, 12, 16].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setBorderRadius(radius)}
                  className={cn(
                    'flex-1 p-2 border transition-all',
                    settings.borderRadius === radius && 'border-primary bg-primary/10'
                  )}
                  style={{ borderRadius: `${radius}px` }}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Animations Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="text-base font-semibold cursor-pointer">
              אנימציות
            </Label>
            <Switch
              id="animations"
              checked={settings.enableAnimations}
              onCheckedChange={toggleAnimations}
            />
          </div>

          <Separator />

          {/* Reset Button */}
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={resetToDefault}
          >
            <RotateCcw className="h-4 w-4" />
            איפוס לברירת מחדל
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
