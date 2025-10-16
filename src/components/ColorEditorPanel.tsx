import React, { useState, useEffect } from 'react';
import { useColorEditor } from '@/hooks/useColorEditor';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface ColorEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorEditorPanel: React.FC<ColorEditorPanelProps> = ({ isOpen, onClose }) => {
  const {
    cssVariables,
    updateVariable,
    resetVariable,
    resetAllVariables,
    exportVariables,
    importVariables,
  } = useColorEditor();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isPickingElement, setIsPickingElement] = useState(false);

  // Debug: Log when variables change
  React.useEffect(() => {
    console.log('🎨 ColorEditorPanel: Variables updated, count:', cssVariables.length);
  }, [cssVariables]);

  // Element picker functionality
  useEffect(() => {
    if (!isPickingElement) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Don't highlight elements inside the Sheet
      const target = e.target as Element;
      if (target.closest('[data-radix-portal]') || target.closest('[role="dialog"]')) {
        return;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as Element;
      if (target.closest('[data-radix-portal]') || target.closest('[role="dialog"]')) {
        return;
      }

      // Get computed styles of the clicked element
      const computedStyles = globalThis.getComputedStyle(target);
      const usedVariables: string[] = [];

      // Check which CSS variables are used in this element
      for (const variable of cssVariables) {
        const varName = variable.name;
        // Check if this variable is used in any computed style
        for (const value of Object.values(computedStyles)) {
          if (typeof value === 'string' && value.includes(varName)) {
            usedVariables.push(varName);
          }
        }
      }

      if (usedVariables.length > 0) {
        setSearchTerm(usedVariables[0].replace('--', ''));
        toast.success(`Found ${usedVariables.length} CSS variable(s)`, {
          description: `Element uses: ${usedVariables.slice(0, 3).join(', ')}${usedVariables.length > 3 ? '...' : ''}`,
        });
      } else {
        // If no variables found, try to extract colors from computed styles
        const backgroundColor = computedStyles.backgroundColor;
        const color = computedStyles.color;
        
        toast.info('No CSS variables detected', {
          description: `BG: ${backgroundColor}, Text: ${color}`,
        });
      }

      setIsPickingElement(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPickingElement(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isPickingElement, cssVariables]);

  const filteredVariables = cssVariables.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || v.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleExport = () => {
    const css = exportVariables();
    navigator.clipboard.writeText(css);
    toast.success('CSS Variables copied to clipboard!', {
      description: 'You can now paste them into your styles',
    });
  };

  const handleImport = () => {
    navigator.clipboard.readText().then(text => {
      try {
        importVariables(text);
        toast.success('Variables imported successfully!');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to import variables', {
          description: `Make sure the clipboard contains valid CSS: ${errorMessage}`,
        });
      }
    });
  };

  const handleDownload = () => {
    const css = exportVariables();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-variables.css';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Theme downloaded!');
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all variables to their original values?')) {
      resetAllVariables();
      toast.success('All variables reset to defaults');
    }
  };

  const isColorValue = (value: string) => {
    return value.startsWith('#') || 
           value.startsWith('rgb') || 
           value.startsWith('hsl') ||
           /^\d+\s+\d+%?\s+\d+%?/.test(value); // HSL without hsl()
  };

  const convertToHex = (value: string): string => {
    // If it's HSL format like "222.2 84% 4.9%", convert to hsl() format
    if (/^\d+\.?\d*\s+\d+\.?\d*%\s+\d+\.?\d*%/.test(value)) {
      const [h, s, l] = value.split(/\s+/);
      return `hsl(${h}, ${s}, ${l})`;
    }
    return value;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl" data-testid="color-editor-panel">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2" data-testid="color-editor-title">
            <Palette className="w-5 h-5" />
            Live Color Editor
          </SheetTitle>
          <SheetDescription>
            Edit CSS variables in real-time and see changes instantly
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExport} variant="outline" size="sm" data-testid="export-css-btn">
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
            <Button onClick={handleImport} variant="outline" size="sm" data-testid="import-css-btn">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm" data-testid="download-theme-btn">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleResetAll} variant="outline" size="sm" data-testid="reset-all-btn">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>

          {/* Search */}
          <div>
            <Input
              placeholder="Search variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-variables-input"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="grid grid-cols-4" data-testid="category-tabs">
              <TabsTrigger value="backgrounds" data-testid="backgrounds-tab">
                Backgrounds
                <Badge variant="secondary" className="ml-2">
                  {cssVariables.filter(v => v.category === 'backgrounds').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="primary" data-testid="primary-tab">
                Primary
                <Badge variant="secondary" className="ml-2">
                  {cssVariables.filter(v => v.category === 'primary').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="borders" data-testid="borders-tab">
                Borders
                <Badge variant="secondary" className="ml-2">
                  {cssVariables.filter(v => v.category === 'borders').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="all-tab">
                All
                <Badge variant="secondary" className="ml-2">
                  {cssVariables.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-4" data-testid="variables-list">
                  {filteredVariables.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No variables found. Try adjusting your search or category filter.
                    </p>
                  )}
                  {filteredVariables.map((variable) => (
                    <div
                      key={variable.name}
                      className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
                      data-testid="variable-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">{variable.displayName}</Label>
                          <p className="text-xs text-muted-foreground font-mono">
                            {variable.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetVariable(variable.name)}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex gap-2 items-center">
                        {isColorValue(variable.value) && (
                          <div
                            className="w-10 h-10 rounded border-2 border-border shrink-0"
                            style={{ backgroundColor: convertToHex(variable.value) }}
                          />
                        )}
                        <Input
                          value={variable.value}
                          onChange={(e) => updateVariable(variable.name, e.target.value)}
                          className="font-mono text-sm"
                          type="text"
                        />
                        {isColorValue(variable.value) && (
                          <Input
                            type="color"
                            value={variable.value.startsWith('#') ? variable.value : '#000000'}
                            onChange={(e) => updateVariable(variable.name, e.target.value)}
                            className="w-16 h-10 p-1 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredVariables.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No variables found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
