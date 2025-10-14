import { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from 'sonner';

interface QuickJumpDialogProps {
  onNavigate?: (sefer: number, perek: number, pasuk?: number) => void;
}

export function QuickJumpDialog({ onNavigate }: QuickJumpDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  // Register Ctrl+G shortcut
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'g',
        ctrl: true,
        description: 'קפיצה מהירה לפסוק',
        action: () => setOpen(true),
        category: 'ניווט',
      }
    ],
  });

  // Reset input when dialog opens
  useEffect(() => {
    if (open) {
      setInput('');
    }
  }, [open]);

  const parseInput = (text: string): { sefer: number; perek: number; pasuk?: number } | null => {
    const cleaned = text.trim();

    // Try parsing "bereishit 1:1" format
    const match1 = cleaned.match(/^(\S+)\s+(\d+):(\d+)$/i);
    if (match1) {
      const [, seferName, perek, pasuk] = match1;
      const sefer = getSeferIdByName(seferName);
      if (sefer) {
        return { sefer, perek: parseInt(perek), pasuk: parseInt(pasuk) };
      }
    }

    // Try parsing "bereishit 1" format (without pasuk)
    const match2 = cleaned.match(/^(\S+)\s+(\d+)$/i);
    if (match2) {
      const [, seferName, perek] = match2;
      const sefer = getSeferIdByName(seferName);
      if (sefer) {
        return { sefer, perek: parseInt(perek) };
      }
    }

    // Try parsing "1 1:1" format (sefer ID instead of name)
    const match3 = cleaned.match(/^(\d+)\s+(\d+):(\d+)$/);
    if (match3) {
      const [, sefer, perek, pasuk] = match3;
      return { sefer: parseInt(sefer), perek: parseInt(perek), pasuk: parseInt(pasuk) };
    }

    // Try parsing "1 1" format
    const match4 = cleaned.match(/^(\d+)\s+(\d+)$/);
    if (match4) {
      const [, sefer, perek] = match4;
      return { sefer: parseInt(sefer), perek: parseInt(perek) };
    }

    return null;
  };

  const getSeferIdByName = (name: string): number | null => {
    const normalized = name.toLowerCase();
    const sefarim: Record<string, number> = {
      'בראשית': 1,
      'bereishit': 1,
      'genesis': 1,
      'שמות': 2,
      'shemot': 2,
      'exodus': 2,
      'ויקרא': 3,
      'vayikra': 3,
      'leviticus': 3,
      'במדבר': 4,
      'bamidbar': 4,
      'numbers': 4,
      'דברים': 5,
      'devarim': 5,
      'deuteronomy': 5,
    };
    return sefarim[normalized] || null;
  };

  const handleJump = () => {
    const result = parseInput(input);
    
    if (!result) {
      toast.error('פורמט לא תקין', {
        description: 'נסה: "בראשית 1:1" או "bereishit 1:1" או "1 1:1"'
      });
      return;
    }

    if (result.sefer < 1 || result.sefer > 5) {
      toast.error('מספר ספר לא תקין', {
        description: 'ספר חייב להיות בין 1 ל-5'
      });
      return;
    }

    onNavigate?.(result.sefer, result.perek, result.pasuk);
    setOpen(false);
    
    const seferNames = ['בראשית', 'שמות', 'ויקרא', 'במדבר', 'דברים'];
    toast.success('קפיצה לפסוק', {
      description: `${seferNames[result.sefer - 1]} פרק ${result.perek}${result.pasuk ? ` פסוק ${result.pasuk}` : ''}`
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleJump();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            קפיצה מהירה לפסוק
          </DialogTitle>
          <DialogDescription className="text-right space-y-1">
            <div>הזן מיקום בפורמטים הבאים:</div>
            <div className="font-mono text-xs">
              • "בראשית 1:1" או "bereishit 1:1"<br />
              • "בראשית 1" (פרק בלבד)<br />
              • "1 1:1" (מספר ספר)
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jump-input">מיקום</Label>
            <Input
              id="jump-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='לדוגמה: "בראשית 1:1"'
              className="text-right"
              autoFocus
              dir="rtl"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleJump}>
              קפוץ
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-right space-y-1">
            <div className="font-semibold">טיפ:</div>
            <div>לחץ Ctrl+G בכל עת לפתיחה מהירה</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
