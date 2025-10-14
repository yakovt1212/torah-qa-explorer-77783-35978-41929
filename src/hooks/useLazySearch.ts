import React, { useState, useEffect, useCallback, useRef } from "react";
import { FlatPasuk, Sefer } from "@/types/torah";
import { getCachedSefer } from "@/utils/indexedDB";
import { fixJsonContent } from "@/utils/fixData";

export interface SearchFilters {
  sefer?: number;
  parsha?: number;
  perek?: number;
  searchType: "all" | "pasuk" | "perush";
}

// Cache for loaded sefarim used in search
const searchSeferCache = new Map<number, Sefer>();

const fixSefer = (sefer: Sefer): Sefer => {
  const jsonString = JSON.stringify(sefer);
  const fixedString = fixJsonContent(jsonString);
  return JSON.parse(fixedString) as Sefer;
};

export const useLazySearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({ searchType: "all" });
  const [results, setResults] = useState<FlatPasuk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSefarim, setIsLoadingSefarim] = useState(false);
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

  // Load sefarim lazily when search opens
  const loadSefarimForSearch = useCallback(async () => {
    // If we already have all sefarim, skip
    if (searchSeferCache.size === 5) return;

    setIsLoadingSefarim(true);
    
    const seferFiles: Record<number, () => Promise<any>> = {
      1: () => import('../data/bereishit.json'),
      2: () => import('../data/shemot.json'),
      3: () => import('../data/vayikra.json'),
      4: () => import('../data/bamidbar.json'),
      5: () => import('../data/devarim.json')
    };

    for (let seferId = 1; seferId <= 5; seferId++) {
      if (!searchSeferCache.has(seferId)) {
        try {
          // Try IndexedDB first
          const cached = await getCachedSefer(seferId);
          if (cached) {
            searchSeferCache.set(seferId, fixSefer(cached));
            continue;
          }

          // Load from network
          const seferModule = await seferFiles[seferId]();
          const sefer = fixSefer(seferModule.default);
          searchSeferCache.set(seferId, sefer);
        } catch (error) {
          console.error(`Failed to load sefer ${seferId} for search:`, error);
        }
      }
    }
    
    setIsLoadingSefarim(false);
  }, []);

  // Load sefarim when search opens
  useEffect(() => {
    if (isOpen && searchSeferCache.size < 5) {
      loadSefarimForSearch();
    }
  }, [isOpen, loadSefarimForSearch]);

  // Perform search
  useEffect(() => {
    const currentSearchId = ++searchIdRef.current;

    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      // Wait for sefarim to load if needed
      if (isLoadingSefarim) {
        return;
      }

      setIsSearching(true);

      if (!workerRef.current) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      // Create flat pesukim array from cached sefarim
      const allPesukim: FlatPasuk[] = [];
      for (let seferId = 1; seferId <= 5; seferId++) {
        const sefer = searchSeferCache.get(seferId);
        if (sefer) {
          for (const parsha of sefer.parshiot) {
            for (const perek of parsha.perakim) {
              for (const pasuk of perek.pesukim) {
                allPesukim.push({
                  id: pasuk.id,
                  sefer: sefer.sefer_id,
                  sefer_name: sefer.sefer_name,
                  perek: perek.perek_num,
                  pasuk_num: pasuk.pasuk_num,
                  text: pasuk.text,
                  content: pasuk.content || [],
                  parsha_id: parsha.parsha_id,
                  parsha_name: parsha.parsha_name
                });
              }
            }
          }
        }
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
  }, [query, filters, isLoadingSefarim]);

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
    isSearching: isSearching || isLoadingSefarim,
    openSearch,
    closeSearch,
    setQuery,
    setFilters,
    clearSearch,
    availableSefarim: Array.from(searchSeferCache.values()),
  };
};
