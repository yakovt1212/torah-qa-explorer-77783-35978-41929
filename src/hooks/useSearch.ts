import React, { useState, useEffect, useCallback, useRef } from "react";
import { FlatPasuk } from "@/types/torah";

export interface SearchFilters {
  sefer?: number;
  parsha?: number;
  perek?: number;
  searchType: "all" | "pasuk" | "perush";
}

export const useSearch = (allPesukim: FlatPasuk[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({ searchType: "all" });
  const [results, setResults] = useState<FlatPasuk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const searchIdRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/search.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    return () => workerRef.current?.terminate();
  }, []);

  // Perform search
  useEffect(() => {
    const currentSearchId = ++searchIdRef.current;

    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      if (!workerRef.current) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      const timeout = setTimeout(() => {
        if (searchIdRef.current === currentSearchId) {
          setIsSearching(false);
        }
      }, 5000);

      workerRef.current.onmessage = (e: MessageEvent) => {
        if (searchIdRef.current === currentSearchId) {
          clearTimeout(timeout);
          setResults(e.data);
          setIsSearching(false);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Search worker error:', error);
        if (searchIdRef.current === currentSearchId) {
          clearTimeout(timeout);
          setResults([]);
          setIsSearching(false);
        }
      };

      workerRef.current.postMessage({ pesukim: allPesukim, query, filters });
    };

    const timer = setTimeout(performSearch, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [query, filters, allPesukim]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setFilters({ searchType: "all" });
    setResults([]);
  }, []);

  return {
    isOpen,
    query,
    filters,
    results,
    isSearching,
    openSearch,
    closeSearch,
    setQuery,
    setFilters,
    clearSearch,
  };
};
