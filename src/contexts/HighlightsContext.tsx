import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

export interface Highlight {
  pasukId: string;
  text: string;
  color: string;
  startIndex: number;
  endIndex: number;
  id: string;
}

interface HighlightsContextType {
  highlights: Highlight[];
  addHighlight: (highlight: Omit<Highlight, "id">) => void;
  removeHighlight: (id: string) => void;
  getHighlightsForPasuk: (pasukId: string) => Highlight[];
}

const HighlightsContext = createContext<HighlightsContextType | undefined>(undefined);

export const HighlightsProvider = ({ children }: { children: ReactNode }) => {
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = localStorage.getItem("torah-highlights");
    return saved ? JSON.parse(saved) : [];
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce localStorage writes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("torah-highlights", JSON.stringify(highlights));
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [highlights]);

  const addHighlight = (highlight: Omit<Highlight, "id">) => {
    const newHighlight: Highlight = {
      ...highlight,
      id: `${Date.now()}-${Math.random()}`,
    };
    setHighlights((prev) => [...prev, newHighlight]);
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const getHighlightsForPasuk = (pasukId: string) => {
    return highlights.filter((h) => h.pasukId === pasukId);
  };

  return (
    <HighlightsContext.Provider
      value={{ highlights, addHighlight, removeHighlight, getHighlightsForPasuk }}
    >
      {children}
    </HighlightsContext.Provider>
  );
};

export const useHighlights = () => {
  const context = useContext(HighlightsContext);
  if (!context) {
    throw new Error("useHighlights must be used within HighlightsProvider");
  }
  return context;
};
