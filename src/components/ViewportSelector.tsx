import { useState, useEffect } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ViewportMode = 'auto' | 'desktop' | 'tablet' | 'mobile';

const STORAGE_KEY = 'viewport_mode_preference';

export const ViewportSelector = () => {
  const [mode, setMode] = useState<ViewportMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as ViewportMode) || 'auto';
  });

  // Apply viewport mode to document
  useEffect(() => {
    console.log('🖥️ Viewport mode changed to:', mode);
    
    // Save preference
    localStorage.setItem(STORAGE_KEY, mode);
    
    // Remove all viewport classes first
    document.documentElement.classList.remove(
      'force-desktop',
      'force-tablet', 
      'force-mobile'
    );
    
    // Apply selected mode
    if (mode === 'desktop') {
      document.documentElement.classList.add('force-desktop');
      // Override mobile detection
      document.documentElement.style.setProperty('--viewport-mode', 'desktop');
    } else if (mode === 'tablet') {
      document.documentElement.classList.add('force-tablet');
      document.documentElement.style.setProperty('--viewport-mode', 'tablet');
    } else if (mode === 'mobile') {
      document.documentElement.classList.add('force-mobile');
      document.documentElement.style.setProperty('--viewport-mode', 'mobile');
    } else {
      // Auto mode - remove override
      document.documentElement.style.removeProperty('--viewport-mode');
    }
    
    // Trigger a resize event to update responsive hooks
    window.dispatchEvent(new Event('resize'));
  }, [mode]);

  const getIcon = () => {
    switch (mode) {
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      default:
        return (
          <div className="relative">
            <Monitor className="h-5 w-5" />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-accent rounded-full border border-primary" />
          </div>
        );
    }
  };

  const getModeLabel = (m: ViewportMode) => {
    switch (m) {
      case 'auto':
        return 'זיהוי אוטומטי';
      case 'desktop':
        return 'מחשב שולחני';
      case 'tablet':
        return 'טאבלט';
      case 'mobile':
        return 'נייד';
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 transition-colors relative",
                  "hover:bg-accent/20"
                )}
              >
                {getIcon()}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            תצוגה: {getModeLabel(mode)}
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-center">בחר תצוגה</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as ViewportMode)}>
            <DropdownMenuRadioItem value="auto" className="cursor-pointer">
              <div className="flex items-center gap-2 w-full">
                <div className="relative">
                  <Monitor className="h-4 w-4" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-accent rounded-full" />
                </div>
                <span>זיהוי אוטומטי</span>
              </div>
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem value="desktop" className="cursor-pointer">
              <div className="flex items-center gap-2 w-full">
                <Monitor className="h-4 w-4" />
                <span>מחשב שולחני</span>
              </div>
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem value="tablet" className="cursor-pointer">
              <div className="flex items-center gap-2 w-full">
                <Tablet className="h-4 w-4" />
                <span>טאבלט</span>
              </div>
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem value="mobile" className="cursor-pointer">
              <div className="flex items-center gap-2 w-full">
                <Smartphone className="h-4 w-4" />
                <span>נייד</span>
              </div>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};
