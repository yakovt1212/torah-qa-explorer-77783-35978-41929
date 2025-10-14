import React, { useEffect } from "react";
import { X, Search, Filter, BookOpen, MessageSquare, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FlatPasuk, Sefer } from "@/types/torah";
import { SearchFilters } from "@/hooks/useSearch";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  results: FlatPasuk[];
  isSearching: boolean;
  onResultClick: (pasuk: FlatPasuk) => void;
  seferData: Sefer[];
}

export const SearchDialog = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  results,
  isSearching,
  onResultClick,
  seferData,
}: SearchDialogProps) => {
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? `<mark class="bg-primary/20 text-primary font-semibold rounded px-0.5">${part}</mark>`
        : part
    ).join('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">חיפוש בתורה</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="חפש פסוקים, פרושים ושאלות..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pr-10 pl-4 h-12 text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select
              value={filters.searchType}
              onValueChange={(value: any) => 
                onFiltersChange({ ...filters, searchType: value })
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>הכל</span>
                  </div>
                </SelectItem>
                <SelectItem value="pasuk">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>פסוקים</span>
                  </div>
                </SelectItem>
                <SelectItem value="perush">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>פרושים</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sefer?.toString() || "all"}
              onValueChange={(value) => 
                onFiltersChange({ 
                  ...filters, 
                  sefer: value === "all" ? undefined : parseInt(value),
                  parsha: undefined,
                  perek: undefined 
                })
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="חומש" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל החומשים</SelectItem>
                {seferData.map((sefer) => (
                  <SelectItem key={sefer.sefer_id} value={sefer.sefer_id.toString()}>
                    {sefer.sefer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filters.sefer || filters.searchType !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ searchType: "all" })}
                className="h-9"
              >
                נקה סינון
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-3">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 animate-pulse mb-4" />
                <p>מחפש...</p>
              </div>
            ) : !query.trim() ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg">התחל להקליד כדי לחפש</p>
                <p className="text-sm mt-2">חפש פסוקים, פרושים או שאלות בכל התורה</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg">לא נמצאו תוצאות</p>
                <p className="text-sm mt-2">נסה חיפוש אחר או שנה את הפילטרים</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {results.length} תוצאות
                  </Badge>
                </div>
                
                {results.map((pasuk) => (
                  <button
                    key={`${pasuk.sefer}-${pasuk.perek}-${pasuk.pasuk_num}`}
                    onClick={() => {
                      onResultClick(pasuk);
                      onClose();
                    }}
                    className={cn(
                      "w-full text-right p-4 rounded-lg border",
                      "hover:bg-accent transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge variant="outline" className="shrink-0">
                        {pasuk.sefer_name} {pasuk.perek}:{pasuk.pasuk_num}
                      </Badge>
                    </div>
                    
                    <p 
                      className="text-base leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightText(pasuk.text, query) 
                      }}
                    />
                    
                    {pasuk.content?.flatMap(c => 
                      c.questions?.flatMap(q => 
                        q.perushim?.map((perush, idx) => (
                          <div key={`${c.id}-${q.id}-${idx}`} className="mt-3 pr-4 border-r-2 border-primary/20">
                            <p className="text-sm font-semibold text-primary mb-1">
                              {perush.mefaresh}
                            </p>
                            <p 
                              className="text-sm text-muted-foreground leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(perush.text, query) 
                              }}
                            />
                          </div>
                        ))
                      )
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </ScrollArea>

        {query && (
          <div className="px-6 py-3 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">Esc</kbd>
              {" "}לסגירה
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
