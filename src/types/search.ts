import { FlatPasuk } from "./torah";

export interface SearchFilters {
  sefer?: number;
  parsha?: number;
  perek?: number;
  mefaresh?: string;
  searchType: "all" | "question" | "perush" | "pasuk";
}

export interface SearchState {
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  activeTab: "quick" | "advanced";
  query: string;
  filters: SearchFilters;
  results: FlatPasuk[];
  isSearching: boolean;
  selectedResultIndex: number;
}

export interface SearchResultHighlight {
  pasukId: string;
  matchedText: string[];
  score: number;
}
