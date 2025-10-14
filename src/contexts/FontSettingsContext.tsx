import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FontSettings {
  pasukFont: string;
  pasukSize: number;
  questionFont: string;
  questionSize: number;
  answerFont: string;
  answerSize: number;
}

interface FontSettingsContextType {
  fontSettings: FontSettings;
  updateFontSettings: (settings: Partial<FontSettings>) => void;
}

const defaultSettings: FontSettings = {
  pasukFont: "David",
  pasukSize: 18,
  questionFont: "Arial",
  questionSize: 16,
  answerFont: "Arial",
  answerSize: 14,
};

const FontSettingsContext = createContext<FontSettingsContextType | undefined>(undefined);

export const FontSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => {
    const saved = localStorage.getItem("torah-font-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("torah-font-settings", JSON.stringify(fontSettings));
  }, [fontSettings]);

  const updateFontSettings = (settings: Partial<FontSettings>) => {
    setFontSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <FontSettingsContext.Provider value={{ fontSettings, updateFontSettings }}>
      {children}
    </FontSettingsContext.Provider>
  );
};

export const useFontSettings = () => {
  const context = useContext(FontSettingsContext);
  if (!context) {
    throw new Error("useFontSettings must be used within FontSettingsProvider");
  }
  return context;
};
