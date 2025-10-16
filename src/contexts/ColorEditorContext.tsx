import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import type { CSSVariable, ColorEditorContextType } from '@/types/colorEditor';
import { getCSSVariables } from '@/utils/cssVariables';

export const ColorEditorContext = createContext<ColorEditorContextType | undefined>(undefined);

// Store original values
const originalValues = new Map<string, string>();

export const ColorEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cssVariables, setCssVariables] = useState<CSSVariable[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load CSS variables on mount with retry logic
    const loadVariables = () => {
      const variables = getCSSVariables();
      console.log('🎨 Color Editor: Loaded', variables.length, 'CSS variables');
      
      // If no variables found, retry after a short delay
      if (variables.length === 0) {
        console.log('⚠️ No variables found, retrying in 100ms...');
        setTimeout(loadVariables, 100);
        return;
      }
      
      console.log('🎨 Sample variables:', variables.slice(0, 5));
      setCssVariables(variables);
      
      // Store original values
      for (const v of variables) {
        if (!originalValues.has(v.name)) {
          originalValues.set(v.name, v.value);
        }
      }
    };
    
    loadVariables();
  }, []);

  const updateVariable = useCallback((name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
    setCssVariables(prev => 
      prev.map(v => v.name === name ? { ...v, value } : v)
    );
  }, []);

  const resetVariable = useCallback((name: string) => {
    const original = originalValues.get(name);
    if (original) {
      updateVariable(name, original);
    }
  }, [updateVariable]);

  const resetAllVariables = useCallback(() => {
    for (const [name, value] of originalValues) {
      document.documentElement.style.setProperty(name, value);
    }
    setCssVariables(getCSSVariables());
  }, []);

  const exportVariables = useCallback((): string => {
    let css = ':root {\n';
    for (const v of cssVariables) {
      css += `  ${v.name}: ${v.value};\n`;
    }
    css += '}';
    return css;
  }, [cssVariables]);

  const importVariables = useCallback((css: string) => {
    // Parse CSS and apply variables
    const matches = css.matchAll(/--[\w-]+:\s*([^;]+);/g);
    for (const match of matches) {
      const [fullMatch] = match;
      const name = fullMatch.split(':')[0].trim();
      const value = fullMatch.split(':')[1].replace(';', '').trim();
      updateVariable(name, value);
    }
  }, [updateVariable]);

  const contextValue = useMemo(
    () => ({
      cssVariables,
      updateVariable,
      resetVariable,
      resetAllVariables,
      exportVariables,
      importVariables,
      isEditing,
      setIsEditing,
    }),
    [cssVariables, updateVariable, resetVariable, resetAllVariables, exportVariables, importVariables, isEditing]
  );

  return (
    <ColorEditorContext.Provider value={contextValue}>
      {children}
    </ColorEditorContext.Provider>
  );
};

