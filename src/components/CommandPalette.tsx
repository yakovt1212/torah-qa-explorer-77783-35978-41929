import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Bookmark, Settings, Palette, Menu, Moon, Sun } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/contexts/ThemeContext';

interface CommandPaletteProps {
  onNavigateToSefer?: (seferId: number) => void;
  onOpenSearch?: () => void;
  onOpenBookmarks?: () => void;
  onOpenSettings?: () => void;
  onOpenThemeCustomizer?: () => void;
  onToggleQuickSelector?: () => void;
}

export function CommandPalette({
  onNavigateToSefer,
  onOpenSearch,
  onOpenBookmarks,
  onOpenSettings,
  onOpenThemeCustomizer,
  onToggleQuickSelector,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Register Ctrl+K shortcut
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        ctrl: true,
        description: 'פתח תפריט פקודות מהיר',
        action: () => setOpen(true),
        category: 'כללי',
      }
    ],
  });

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const sefarim = useMemo(() => [
    { id: 1, name: 'בראשית', icon: BookOpen },
    { id: 2, name: 'שמות', icon: BookOpen },
    { id: 3, name: 'ויקרא', icon: BookOpen },
    { id: 4, name: 'במדבר', icon: BookOpen },
    { id: 5, name: 'דברים', icon: BookOpen },
  ], []);

  const handleSelect = (callback?: () => void) => {
    if (callback) callback();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="חפש פקודה, ספר, או תכונה..." />
      <CommandList>
        <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="ניווט">
          {onOpenSearch && (
            <CommandItem onSelect={() => handleSelect(onOpenSearch)}>
              <Search className="ml-2 h-4 w-4" />
              <span>חיפוש</span>
              <kbd className="mr-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Ctrl+F</span>
              </kbd>
            </CommandItem>
          )}
          
          {onOpenBookmarks && (
            <CommandItem onSelect={() => handleSelect(onOpenBookmarks)}>
              <Bookmark className="ml-2 h-4 w-4" />
              <span>סימניות</span>
            </CommandItem>
          )}

          {onToggleQuickSelector && (
            <CommandItem onSelect={() => handleSelect(onToggleQuickSelector)}>
              <Menu className="ml-2 h-4 w-4" />
              <span>בחירה מהירה</span>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Sefarim */}
        <CommandGroup heading="ספרי תורה">
          {sefarim.map((sefer) => (
            <CommandItem
              key={sefer.id}
              onSelect={() => handleSelect(() => onNavigateToSefer?.(sefer.id))}
            >
              <BookOpen className="ml-2 h-4 w-4" />
              <span>{sefer.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Settings */}
        <CommandGroup heading="הגדרות">
          <CommandItem onSelect={() => handleSelect(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}>
            {theme === 'dark' ? <Sun className="ml-2 h-4 w-4" /> : <Moon className="ml-2 h-4 w-4" />}
            <span>החלף {theme === 'dark' ? 'למצב בהיר' : 'למצב כהה'}</span>
          </CommandItem>

          {onOpenThemeCustomizer && (
            <CommandItem onSelect={() => handleSelect(onOpenThemeCustomizer)}>
              <Palette className="ml-2 h-4 w-4" />
              <span>התאמת עיצוב</span>
            </CommandItem>
          )}

          {onOpenSettings && (
            <CommandItem onSelect={() => handleSelect(onOpenSettings)}>
              <Settings className="ml-2 h-4 w-4" />
              <span>הגדרות</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
