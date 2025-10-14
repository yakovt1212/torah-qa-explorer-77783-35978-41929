import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Note {
  id: string;
  pasukId: string;
  content: string;
  createdAt: number;
}

export interface PersonalQuestion {
  id: string;
  pasukId: string;
  question: string;
  answer?: string;
  createdAt: number;
}

interface NotesContextType {
  notes: Note[];
  questions: PersonalQuestion[];
  addNote: (pasukId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForPasuk: (pasukId: string) => Note[];
  addQuestion: (pasukId: string, question: string) => void;
  updateQuestion: (id: string, question: string, answer?: string) => void;
  deleteQuestion: (id: string) => void;
  getQuestionsForPasuk: (pasukId: string) => PersonalQuestion[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("torah-notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<PersonalQuestion[]>(() => {
    const saved = localStorage.getItem("torah-questions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("torah-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("torah-questions", JSON.stringify(questions));
  }, [questions]);

  const addNote = (pasukId: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random()}`,
      pasukId,
      content,
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, content } : note)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const getNotesForPasuk = (pasukId: string) => {
    return notes.filter((note) => note.pasukId === pasukId);
  };

  const addQuestion = (pasukId: string, question: string) => {
    const newQuestion: PersonalQuestion = {
      id: `q-${Date.now()}-${Math.random()}`,
      pasukId,
      question,
      createdAt: Date.now(),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, question: string, answer?: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question, answer } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const getQuestionsForPasuk = (pasukId: string) => {
    return questions.filter((q) => q.pasukId === pasukId);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        questions,
        addNote,
        updateNote,
        deleteNote,
        getNotesForPasuk,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        getQuestionsForPasuk,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
};
