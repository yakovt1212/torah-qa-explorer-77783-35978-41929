import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface QuickSelectorSettings {
  startMinimized: boolean;
}

interface QuickSelectorSettingsContextType {
  settings: QuickSelectorSettings;
  updateSettings: (settings: Partial<QuickSelectorSettings>) => void;
}

const QuickSelectorSettingsContext = createContext<QuickSelectorSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'quickSelectorSettings';

export const QuickSelectorSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<QuickSelectorSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to defaults
      }
    }
    return {
      startMinimized: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<QuickSelectorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <QuickSelectorSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </QuickSelectorSettingsContext.Provider>
  );
};

export const useQuickSelectorSettings = () => {
  const context = useContext(QuickSelectorSettingsContext);
  if (!context) {
    throw new Error('useQuickSelectorSettings must be used within QuickSelectorSettingsProvider');
  }
  return context;
};
