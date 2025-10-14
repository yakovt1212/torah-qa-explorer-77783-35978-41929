// Bookmark Management Utilities

import { Bookmark, BookmarkCollection, BookmarkColor, RecentlyViewed, ReadingProgress } from '@/types/bookmark';

const BOOKMARKS_KEY = 'torah_bookmarks';
const COLLECTIONS_KEY = 'torah_bookmark_collections';
const RECENT_KEY = 'torah_recently_viewed';
const PROGRESS_KEY = 'torah_reading_progress';

// ==================== BOOKMARKS ====================

export function getAllBookmarks(): Bookmark[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
}

export function getBookmark(id: string): Bookmark | null {
  const bookmarks = getAllBookmarks();
  return bookmarks.find(b => b.id === id) || null;
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  const bookmarks = getAllBookmarks();
  
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  
  bookmarks.push(newBookmark);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  
  console.log('📚 Bookmark added:', newBookmark);
  return newBookmark;
}

export function updateBookmark(id: string, updates: Partial<Bookmark>): boolean {
  const bookmarks = getAllBookmarks();
  const index = bookmarks.findIndex(b => b.id === id);
  
  if (index === -1) return false;
  
  bookmarks[index] = { ...bookmarks[index], ...updates };
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  
  console.log('📝 Bookmark updated:', bookmarks[index]);
  return true;
}

export function deleteBookmark(id: string): boolean {
  const bookmarks = getAllBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  
  if (filtered.length === bookmarks.length) return false;
  
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  console.log('🗑️ Bookmark deleted:', id);
  return true;
}

export function isBookmarked(sefer: number, perek: number, pasuk: number): Bookmark | null {
  const bookmarks = getAllBookmarks();
  return bookmarks.find(b => 
    b.sefer === sefer && b.perek === perek && b.pasuk === pasuk
  ) || null;
}

export function getBookmarksBySefer(sefer: number): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter(b => b.sefer === sefer);
}

export function getBookmarksByColor(color: BookmarkColor): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter(b => b.color === color);
}

export function getBookmarksByTag(tag: string): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter(b => b.tags.includes(tag));
}

export function getAllTags(): string[] {
  const bookmarks = getAllBookmarks();
  const tags = new Set<string>();
  bookmarks.forEach(b => b.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

// ==================== COLLECTIONS ====================

export function getAllCollections(): BookmarkCollection[] {
  try {
    const data = localStorage.getItem(COLLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading collections:', error);
    return [];
  }
}

export function addCollection(collection: Omit<BookmarkCollection, 'id' | 'createdAt' | 'updatedAt'>): BookmarkCollection {
  const collections = getAllCollections();
  
  const newCollection: BookmarkCollection = {
    ...collection,
    id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  collections.push(newCollection);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  
  console.log('📁 Collection created:', newCollection);
  return newCollection;
}

export function updateCollection(id: string, updates: Partial<BookmarkCollection>): boolean {
  const collections = getAllCollections();
  const index = collections.findIndex(c => c.id === id);
  
  if (index === -1) return false;
  
  collections[index] = { 
    ...collections[index], 
    ...updates,
    updatedAt: Date.now() 
  };
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  
  console.log('📝 Collection updated:', collections[index]);
  return true;
}

export function deleteCollection(id: string): boolean {
  const collections = getAllCollections();
  const filtered = collections.filter(c => c.id !== id);
  
  if (filtered.length === collections.length) return false;
  
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(filtered));
  console.log('🗑️ Collection deleted:', id);
  return true;
}

export function addBookmarkToCollection(collectionId: string, bookmarkId: string): boolean {
  const collections = getAllCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) return false;
  if (collection.bookmarks.includes(bookmarkId)) return false;
  
  return updateCollection(collectionId, {
    bookmarks: [...collection.bookmarks, bookmarkId]
  });
}

export function removeBookmarkFromCollection(collectionId: string, bookmarkId: string): boolean {
  const collections = getAllCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) return false;
  
  return updateCollection(collectionId, {
    bookmarks: collection.bookmarks.filter(id => id !== bookmarkId)
  });
}

// ==================== RECENTLY VIEWED ====================

export function addToRecentlyViewed(item: Omit<RecentlyViewed, 'timestamp'>): void {
  try {
    const recent = getRecentlyViewed();
    
    // Remove duplicate if exists
    const filtered = recent.filter(r => 
      !(r.sefer === item.sefer && r.perek === item.perek && r.pasuk === item.pasuk)
    );
    
    // Add to front
    filtered.unshift({ ...item, timestamp: Date.now() });
    
    // Keep only last 50
    const limited = filtered.slice(0, 50);
    
    localStorage.setItem(RECENT_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving to recently viewed:', error);
  }
}

export function getRecentlyViewed(limit: number = 20): RecentlyViewed[] {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    const recent = data ? JSON.parse(data) : [];
    return recent.slice(0, limit);
  } catch (error) {
    console.error('Error loading recently viewed:', error);
    return [];
  }
}

export function clearRecentlyViewed(): void {
  localStorage.removeItem(RECENT_KEY);
}

// ==================== READING PROGRESS ====================

export function saveReadingProgress(progress: ReadingProgress): void {
  try {
    const allProgress = getAllReadingProgress();
    const index = allProgress.findIndex(p => p.sefer === progress.sefer);
    
    if (index >= 0) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving reading progress:', error);
  }
}

export function getAllReadingProgress(): ReadingProgress[] {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading reading progress:', error);
    return [];
  }
}

export function getReadingProgress(sefer: number): ReadingProgress | null {
  const allProgress = getAllReadingProgress();
  return allProgress.find(p => p.sefer === sefer) || null;
}

// ==================== EXPORT / IMPORT ====================

export function exportBookmarks(): string {
  const data = {
    bookmarks: getAllBookmarks(),
    collections: getAllCollections(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  return JSON.stringify(data, null, 2);
}

export function importBookmarks(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.bookmarks) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
    }
    
    if (data.collections) {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(data.collections));
    }
    
    console.log('✅ Bookmarks imported successfully');
    return true;
  } catch (error) {
    console.error('❌ Error importing bookmarks:', error);
    return false;
  }
}
