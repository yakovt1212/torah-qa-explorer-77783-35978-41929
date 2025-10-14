import { useState, useMemo } from 'react';
import { 
  Bookmark as BookmarkIcon, 
  Trash2, 
  Calendar,
  Search,
  Download,
  Upload,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { Bookmark, BookmarkColor } from '@/types/bookmark';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { exportBookmarks, importBookmarks } from '@/utils/bookmarks';

const COLOR_CLASSES: Record<BookmarkColor, { bg: string; border: string; text: string }> = {
  red: { bg: 'bg-red-100 dark:bg-red-900/20', border: 'border-red-500', text: 'text-red-700 dark:text-red-300' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-300' },
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-700 dark:text-yellow-300' },
  green: { bg: 'bg-green-100 dark:bg-green-900/20', border: 'border-green-500', text: 'text-green-700 dark:text-green-300' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/20', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-300' },
  default: { bg: 'bg-secondary', border: 'border-border', text: 'text-foreground' },
};

interface BookmarksPanelProps {
  onNavigate?: (bookmark: Bookmark) => void;
}

export function BookmarksPanel({ onNavigate }: BookmarksPanelProps) {
  const { bookmarks, deleteBookmark, updateBookmark, tags, collections } = useBookmarks();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<BookmarkColor | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'location'>('date');

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.seferName.toLowerCase().includes(query) ||
        b.parshaName?.toLowerCase().includes(query) ||
        b.pasukText?.toLowerCase().includes(query) ||
        b.note?.toLowerCase().includes(query) ||
        b.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter(b => (b.color || 'default') === selectedColor);
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(b => b.tags.includes(selectedTag));
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      filtered.sort((a, b) => {
        if (a.sefer !== b.sefer) return a.sefer - b.sefer;
        if ((a.parsha || 0) !== (b.parsha || 0)) return (a.parsha || 0) - (b.parsha || 0);
        if (a.perek !== b.perek) return a.perek - b.perek;
        return a.pasuk - b.pasuk;
      });
    }

    return filtered;
  }, [bookmarks, searchQuery, selectedColor, selectedTag, sortBy]);

  const handleDelete = (id: string) => {
    deleteBookmark(id);
    toast.success('🗑️ סימנייה נמחקה');
  };

  const handleChangeColor = (id: string, color: BookmarkColor) => {
    updateBookmark(id, { color });
    toast.success('🎨 צבע עודכן');
  };

  const handleNavigateToBookmark = (bookmark: Bookmark) => {
    if (onNavigate) {
      onNavigate(bookmark);
      setIsOpen(false);
      toast.info('📖 מעבר לפסוק...', {
        description: `${bookmark.seferName} ${bookmark.perek}:${bookmark.pasuk}`,
      });
    }
  };

  const handleExport = () => {
    const data = exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torah-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 סימניות יוצאו בהצלחה');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (importBookmarks(content)) {
            toast.success('📤 סימניות יובאו בהצלחה');
            window.location.reload();
          } else {
            toast.error('❌ שגיאה בייבוא סימניות');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="סימניות"
        >
          <BookmarkIcon className="h-5 w-5" />
          {bookmarks.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {bookmarks.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            הסימניות שלי
            <Badge variant="secondary">{bookmarks.length}</Badge>
          </SheetTitle>
          <SheetDescription>
            כל הפסוקים שסימנת לעיון מאוחר יותר
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש בסימניות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={selectedColor} onValueChange={(v) => setSelectedColor(v as BookmarkColor | 'all')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="כל הצבעים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הצבעים</SelectItem>
                  <SelectItem value="red">🔴 אדום</SelectItem>
                  <SelectItem value="orange">🟠 כתום</SelectItem>
                  <SelectItem value="yellow">🟡 צהוב</SelectItem>
                  <SelectItem value="green">🟢 ירוק</SelectItem>
                  <SelectItem value="blue">🔵 כחול</SelectItem>
                  <SelectItem value="purple">🟣 סגול</SelectItem>
                  <SelectItem value="pink">🩷 ורוד</SelectItem>
                </SelectContent>
              </Select>

              {tags.length > 0 && (
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="כל התגיות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל התגיות</SelectItem>
                    {tags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'location')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">⏰ לפי תאריך</SelectItem>
                  <SelectItem value="location">📍 לפי מיקום</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 ml-2" />
                ייצוא
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport} className="flex-1">
                <Upload className="h-4 w-4 ml-2" />
                ייבוא
              </Button>
            </div>
          </div>

          {/* Bookmarks List */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookmarkIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-2">אין סימניות</p>
                <p className="text-sm">
                  {searchQuery || selectedColor !== 'all' || selectedTag !== 'all'
                    ? 'לא נמצאו תוצאות מתאימות'
                    : 'התחל לסמן פסוקים כדי לראות אותם כאן'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookmarks.map((bookmark) => {
                  const colors = COLOR_CLASSES[bookmark.color || 'default'];
                  
                  return (
                    <div
                      key={bookmark.id}
                      className={cn(
                        'p-4 rounded-lg border-r-4 cursor-pointer transition-all hover:shadow-md',
                        colors.bg,
                        colors.border
                      )}
                      onClick={() => handleNavigateToBookmark(bookmark)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">
                            {bookmark.seferName} {bookmark.perek}:{bookmark.pasuk}
                          </h3>
                          {bookmark.parshaName && (
                            <p className="text-sm text-muted-foreground">
                              פרשת {bookmark.parshaName}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(bookmark.id);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {bookmark.pasukText && (
                        <p className="text-sm mb-2 opacity-80 line-clamp-2">
                          {bookmark.pasukText}
                        </p>
                      )}

                      {bookmark.note && (
                        <p className="text-sm italic mb-2 p-2 bg-background/50 rounded">
                          📝 {bookmark.note}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(bookmark.createdAt).toLocaleDateString('he-IL')}
                        </div>

                        {bookmark.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {bookmark.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
