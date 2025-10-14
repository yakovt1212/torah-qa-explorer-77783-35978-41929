import { Highlight } from "@/contexts/HighlightsContext";
import { Note, PersonalQuestion } from "@/contexts/NotesContext";

export interface ExportedData {
  version: string;
  exportDate: string;
  highlights: Highlight[];
  notes: Note[];
  questions: PersonalQuestion[];
}

/**
 * ייצוא כל הנתונים האישיים לקובץ JSON
 */
export const exportAllData = (): ExportedData => {
  const highlights = JSON.parse(localStorage.getItem("torah-highlights") || "[]");
  const notes = JSON.parse(localStorage.getItem("torah-notes") || "[]");
  const questions = JSON.parse(localStorage.getItem("torah-questions") || "[]");

  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    highlights,
    notes,
    questions,
  };
};

/**
 * הורדת הנתונים כקובץ JSON
 */
export const downloadDataAsFile = () => {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `torah-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * ייבוא נתונים מקובץ JSON
 */
export const importDataFromFile = (file: File): Promise<ExportedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportedData;
        
        // ולידציה בסיסית
        if (!data.version || !data.highlights || !data.notes || !data.questions) {
          throw new Error("Invalid backup file format");
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error("Failed to parse backup file"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

/**
 * שחזור נתונים ל-localStorage
 */
export const restoreData = (data: ExportedData, mode: "merge" | "replace" = "replace") => {
  if (mode === "replace") {
    // החלפה מלאה - מחיקת הנתונים הקיימים
    localStorage.setItem("torah-highlights", JSON.stringify(data.highlights));
    localStorage.setItem("torah-notes", JSON.stringify(data.notes));
    localStorage.setItem("torah-questions", JSON.stringify(data.questions));
  } else {
    // מיזוג - שילוב עם נתונים קיימים
    const existingHighlights = JSON.parse(localStorage.getItem("torah-highlights") || "[]");
    const existingNotes = JSON.parse(localStorage.getItem("torah-notes") || "[]");
    const existingQuestions = JSON.parse(localStorage.getItem("torah-questions") || "[]");
    
    // מיזוג לפי ID ייחודי
    const mergedHighlights = mergeByUniqueId([...existingHighlights, ...data.highlights]);
    const mergedNotes = mergeByUniqueId([...existingNotes, ...data.notes]);
    const mergedQuestions = mergeByUniqueId([...existingQuestions, ...data.questions]);
    
    localStorage.setItem("torah-highlights", JSON.stringify(mergedHighlights));
    localStorage.setItem("torah-notes", JSON.stringify(mergedNotes));
    localStorage.setItem("torah-questions", JSON.stringify(mergedQuestions));
  }
};

/**
 * מיזוג פריטים לפי ID ייחודי
 */
const mergeByUniqueId = <T extends { id: string }>(items: T[]): T[] => {
  const uniqueMap = new Map<string, T>();
  items.forEach((item) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });
  return Array.from(uniqueMap.values());
};

/**
 * קבלת סטטיסטיקות על הנתונים
 */
export const getDataStats = () => {
  const data = exportAllData();
  const dataSize = new Blob([JSON.stringify(data)]).size;
  
  return {
    highlights: data.highlights.length,
    notes: data.notes.length,
    questions: data.questions.length,
    totalItems: data.highlights.length + data.notes.length + data.questions.length,
    sizeKB: (dataSize / 1024).toFixed(2),
  };
};

/**
 * גיבוי אוטומטי ל-localStorage
 */
export const createAutoBackup = () => {
  const data = exportAllData();
  const backupKey = `torah-auto-backup-${new Date().toISOString().split("T")[0]}`;
  
  try {
    localStorage.setItem(backupKey, JSON.stringify(data));
    
    // שמירה על 3 גיבויים אחרונים בלבד
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys
      .filter((key) => key.startsWith("torah-auto-backup-"))
      .sort()
      .reverse();
    
    // מחיקת גיבויים ישנים
    backupKeys.slice(3).forEach((key) => localStorage.removeItem(key));
    
    return true;
  } catch (error) {
    console.error("Auto-backup failed:", error);
    return false;
  }
};

/**
 * קבלת רשימת גיבויים אוטומטיים
 */
export const getAutoBackups = (): string[] => {
  const allKeys = Object.keys(localStorage);
  return allKeys
    .filter((key) => key.startsWith("torah-auto-backup-"))
    .sort()
    .reverse();
};
