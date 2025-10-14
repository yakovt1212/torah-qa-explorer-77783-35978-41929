import { useState } from 'react';
import { Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  sefer: number;
  seferName: string;
  perek: number;
  pasuk: number;
  parshaId?: number | null;
  parshaName?: string | null;
  pasukText?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function BookmarkButton({
  sefer,
  seferName,
  perek,
  pasuk,
  parshaId,
  parshaName,
  pasukText,
  className,
  size = 'sm',
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const bookmark = isBookmarked(sefer, perek, pasuk);
  const bookmarked = bookmark !== null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    const result = toggleBookmark(
      sefer,
      seferName,
      perek,
      pasuk,
      parshaId,
      parshaName,
      pasukText
    );
    
    if (result) {
      toast.success('📚 נוסף לסימניות', {
        description: `${seferName} ${perek}:${pasuk}`,
        duration: 2000,
      });
    } else {
      toast.info('🗑️ הוסר מסימניות', {
        duration: 2000,
      });
    }
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            onClick={handleToggle}
            className={cn(
              'transition-all',
              isAnimating && 'scale-125',
              bookmarked && 'text-accent hover:text-accent/80',
              className
            )}
          >
            {bookmarked ? (
              <BookmarkCheck className={cn(iconSize, 'fill-accent')} />
            ) : (
              <BookmarkIcon className={iconSize} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {bookmarked ? 'הסר מסימניות' : 'הוסף לסימניות'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
