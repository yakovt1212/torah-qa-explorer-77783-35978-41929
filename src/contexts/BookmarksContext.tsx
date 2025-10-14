import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bookmark, BookmarkCollection, BookmarkColor } from '@/types/bookmark';
import {
  getAllBookmarks,
  addBookmark as addBookmarkUtil,
  updateBookmark as updateBookmarkUtil,
  deleteBookmark as deleteBookmarkUtil,
  isBookmarked as isBookmarkedUtil,
  getAllCollections,
  addCollection as addCollectionUtil,
  updateCollection as updateCollectionUtil,
  deleteCollection as deleteCollectionUtil,
  addBookmarkToCollection as addToCollectionUtil,
  removeBookmarkFromCollection as removeFromCollectionUtil,
  getAllTags,
} from '@/utils/bookmarks';

interface BookmarksContextType {
  bookmarks: Bookmark[];
  collections: BookmarkCollection[];
  tags: string[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => boolean;
  deleteBookmark: (id: string) => boolean;
  isBookmarked: (sefer: number, perek: number, pasuk: number) => Bookmark | null;
  toggleBookmark: (
    sefer: number,
    seferName: string,
    perek: number,
    pasuk: number,
    parshaId?: number | null,
    parshaName?: string | null,
    pasukText?: string
  ) => Bookmark | null;
  addCollection: (collection: Omit<BookmarkCollection, 'id' | 'createdAt' | 'updatedAt'>) => BookmarkCollection;
  updateCollection: (id: string, updates: Partial<BookmarkCollection>) => boolean;
  deleteCollection: (id: string) => boolean;
  addBookmarkToCollection: (collectionId: string, bookmarkId: string) => boolean;
  removeBookmarkFromCollection: (collectionId: string, bookmarkId: string) => boolean;
  refreshBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setBookmarks(getAllBookmarks());
    setCollections(getAllCollections());
    setTags(getAllTags());
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark = addBookmarkUtil(bookmark);
    refreshData();
    return newBookmark;
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    const success = updateBookmarkUtil(id, updates);
    if (success) refreshData();
    return success;
  };

  const deleteBookmark = (id: string) => {
    const success = deleteBookmarkUtil(id);
    if (success) refreshData();
    return success;
  };

  const isBookmarked = (sefer: number, perek: number, pasuk: number) => {
    return isBookmarkedUtil(sefer, perek, pasuk);
  };

  const toggleBookmark = (
    sefer: number,
    seferName: string,
    perek: number,
    pasuk: number,
    parshaId: number | null = null,
    parshaName: string | null = null,
    pasukText?: string
  ) => {
    const existing = isBookmarked(sefer, perek, pasuk);
    
    if (existing) {
      deleteBookmark(existing.id);
      return null;
    } else {
      return addBookmark({
        sefer,
        seferName,
        parsha: parshaId,
        parshaName,
        perek,
        pasuk,
        pasukText,
        color: 'default',
        tags: [],
      });
    }
  };

  const addCollection = (collection: Omit<BookmarkCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCollection = addCollectionUtil(collection);
    refreshData();
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<BookmarkCollection>) => {
    const success = updateCollectionUtil(id, updates);
    if (success) refreshData();
    return success;
  };

  const deleteCollection = (id: string) => {
    const success = deleteCollectionUtil(id);
    if (success) refreshData();
    return success;
  };

  const addBookmarkToCollection = (collectionId: string, bookmarkId: string) => {
    const success = addToCollectionUtil(collectionId, bookmarkId);
    if (success) refreshData();
    return success;
  };

  const removeBookmarkFromCollection = (collectionId: string, bookmarkId: string) => {
    const success = removeFromCollectionUtil(collectionId, bookmarkId);
    if (success) refreshData();
    return success;
  };

  const value: BookmarksContextType = {
    bookmarks,
    collections,
    tags,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    isBookmarked,
    toggleBookmark,
    addCollection,
    updateCollection,
    deleteCollection,
    addBookmarkToCollection,
    removeBookmarkFromCollection,
    refreshBookmarks: refreshData,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within BookmarksProvider');
  }
  return context;
}
