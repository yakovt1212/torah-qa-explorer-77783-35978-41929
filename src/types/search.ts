import { FlatPasuk } from "./torah";

export interface SearchFilters {
  sefer?: number;
  parsha?: number;
  perek?: number;
  mefaresh?: string;
  searchType: "all" | "question" | "perush" | "pasuk";
  // Advanced filters
  exactMatch?: boolean;
  caseSensitive?: boolean;
  dateRange?: { from?: Date; to?: Date };
  includeBookmarks?: boolean;
  includeNotes?: boolean;
  pasukRange?: { from?: string; to?: string }; // Format: "sefer:perek:pasuk"
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
  isBookmarked?: boolean;
  hasNotes?: boolean;
}

export interface AdvancedSearchOptions {
  includeGematria?: boolean;
  includeRootWords?: boolean;
  fuzzySearch?: boolean;
  maxResults?: number;
}
