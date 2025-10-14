// Types for Bookmarks and Enhanced Notes

export interface Bookmark {
  id: string;
  sefer: number;
  seferName: string;
  parsha: number | null;
  parshaName: string | null;
  perek: number;
  pasuk: number;
  pasukText?: string; // First few words for preview
  color?: BookmarkColor;
  tags: string[];
  createdAt: number;
  lastVisited?: number;
  note?: string; // Quick note
}

export type BookmarkColor = 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'pink'
  | 'default';

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  bookmarks: string[]; // Bookmark IDs
  color?: BookmarkColor;
  createdAt: number;
  updatedAt: number;
}

export interface RecentlyViewed {
  sefer: number;
  seferName: string;
  parsha: number | null;
  parshaName: string | null;
  perek: number;
  pasuk: number | null;
  timestamp: number;
}

export interface ReadingProgress {
  sefer: number;
  parsha: number;
  perek: number;
  pasuk: number;
  percentage: number;
  lastRead: number;
}

export interface BookmarkStats {
  totalBookmarks: number;
  bySefer: Record<number, number>;
  byColor: Record<BookmarkColor, number>;
  recentlyAdded: Bookmark[];
  mostVisited: Bookmark[];
}
