import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sefer, Perek } from "@/types/torah";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, ArrowRight, Columns, Maximize2, Pin, PinOff, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuickSelector } from "@/hooks/useQuickSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toHebrewNumber } from "@/utils/hebrewNumbers";

interface QuickSelectorProps {
  sefer: Sefer | null;
  selectedParsha: number | null;
  onParshaSelect: (parshaId: number | null) => void;
  selectedPerek: number | null;
  onPerekSelect: (perekNum: number | null) => void;
  totalPesukimInPerek: number;
  selectedPasuk: number | null;
  onPasukSelect: (pasukNum: number | null) => void;
  // QuickSelector state from parent
  quickSelectorState?: ReturnType<typeof useQuickSelector>;
}

export const QuickSelector = ({
  sefer,
  selectedParsha,
  onParshaSelect,
  selectedPerek,
  onPerekSelect,
  totalPesukimInPerek,
  selectedPasuk,
  onPasukSelect,
  quickSelectorState,
}: QuickSelectorProps) => {
  const isMobile = useIsMobile();
  
  // Use passed state if available, otherwise create own hook
  const ownHookState = useQuickSelector(isMobile);
  const {
    isVisible,
    isPinned,
    isMinimized,
    viewMode,
    sidebarWidth,
    setVisible,
    togglePinned,
    toggleMinimized,
    setViewMode,
    setSidebarWidth,
    recordInteraction,
  } = quickSelectorState || ownHookState;

  const displayedPerakim = useMemo(() => {
    if (!sefer) return [];
    if (selectedParsha === null) {
      return sefer.parshiot.flatMap(p => p.perakim);
    }
    const parsha = sefer.parshiot.find(p => p.parsha_id === selectedParsha);
    return parsha?.perakim || [];
  }, [sefer, selectedParsha]);

  const selectedParshaName = useMemo(() => {
    if (!sefer || selectedParsha === null) return null;
    return sefer.parshiot.find(p => p.parsha_id === selectedParsha)?.parsha_name;
  }, [sefer, selectedParsha]);

  const handleParshaSelect = (parshaId: number | null) => {
    onParshaSelect(parshaId);
    onPerekSelect(null);
    onPasukSelect(null);
    recordInteraction();
    
    if (viewMode === 'accordion' && parshaId !== null) {
      const parsha = sefer?.parshiot.find(p => p.parsha_id === parshaId);
      if (parsha && parsha.perakim.length === 1) {
        onPerekSelect(parsha.perakim[0].perek_num);
      }
    }
  };

  const handlePerekSelect = (perekNum: number | null) => {
    onPerekSelect(perekNum);
    onPasukSelect(null);
    recordInteraction();
  };

  const handlePasukSelect = (pasukNum: number | null) => {
    onPasukSelect(pasukNum);
    recordInteraction();
  };

  if (!sefer) return null;

  console.log('🟢 QuickSelector Render:', {
    isVisible,
    isPinned,
    isMinimized,
    isMobile,
    seferName: sefer?.sefer_name,
  });

  // Render as Dialog/Popup (both mobile and desktop)
  return (
    <Dialog open={isVisible} onOpenChange={(open) => {
      console.log('🟡 Dialog onOpenChange called:', open);
      setVisible(open);
    }}>
      <DialogContent className={cn(
        "max-h-[92vh] overflow-y-auto",
        isMobile ? "max-w-[95vw]" : "max-w-7xl w-[95vw]"
      )}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-l from-primary via-primary to-sidebar-background bg-clip-text text-transparent">
            בחירה מהירה
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-1 sm:px-2">
          <QuickSelectorContent
            sefer={sefer}
            viewMode={viewMode}
            sidebarWidth={sidebarWidth}
            isMinimized={false}
            isMobile={isMobile}
            selectedParsha={selectedParsha}
            selectedParshaName={selectedParshaName}
            selectedPerek={selectedPerek}
            selectedPasuk={selectedPasuk}
            displayedPerakim={displayedPerakim}
            totalPesukimInPerek={totalPesukimInPerek}
            onParshaSelect={handleParshaSelect}
            onPerekSelect={handlePerekSelect}
            onPasukSelect={handlePasukSelect}
            setViewMode={setViewMode}
            setSidebarWidth={setSidebarWidth}
            isPinned={isPinned}
            togglePinned={togglePinned}
            toggleMinimized={toggleMinimized}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Content component (shared between mobile drawer and desktop sidebar)
interface QuickSelectorContentProps {
  sefer: Sefer;
  viewMode: 'all' | 'accordion';
  sidebarWidth: 'normal' | 'wide';
  isMinimized: boolean;
  isMobile: boolean;
  selectedParsha: number | null;
  selectedParshaName: string | null;
  selectedPerek: number | null;
  selectedPasuk: number | null;
  displayedPerakim: Perek[];
  totalPesukimInPerek: number;
  onParshaSelect: (parshaId: number | null) => void;
  onPerekSelect: (perekNum: number | null) => void;
  onPasukSelect: (pasukNum: number | null) => void;
  setViewMode: (mode: 'all' | 'accordion') => void;
  setSidebarWidth: (width: 'normal' | 'wide') => void;
  isPinned: boolean;
  togglePinned: () => void;
  toggleMinimized: () => void;
}

const QuickSelectorContent = ({
  sefer,
  viewMode,
  sidebarWidth,
  isMinimized,
  isMobile,
  selectedParsha,
  selectedParshaName,
  selectedPerek,
  selectedPasuk,
  displayedPerakim,
  totalPesukimInPerek,
  onParshaSelect,
  onPerekSelect,
  onPasukSelect,
  setViewMode,
  setSidebarWidth,
  isPinned,
  togglePinned,
  toggleMinimized,
}: QuickSelectorContentProps) => {
  // Grid layout - תצוגה אופקית למקסימום ניצול המסך
  const gridColsForParshiot = isMobile ? "grid-cols-2" : 
    isMinimized ? "grid-cols-1" :
    sidebarWidth === 'wide' ? "grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" : "grid-cols-3 xl:grid-cols-4";

  const gridColsForPerakim = isMobile ? "grid-cols-4 xs:grid-cols-5 sm:grid-cols-6" :
    isMinimized ? "grid-cols-1" :
    sidebarWidth === 'wide' ? "grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12" : "grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10";

  const gridColsForPesukim = isMobile ? "grid-cols-5 xs:grid-cols-6 sm:grid-cols-8" :
    isMinimized ? "grid-cols-1" :
    sidebarWidth === 'wide' ? "grid-cols-10 xl:grid-cols-12 2xl:grid-cols-15" : "grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12";

  return (
    <>
      <div className="space-y-4">
          {/* Parshiot Section */}
          {viewMode === 'all' || selectedParsha === null ? (
            <Collapsible open={viewMode === 'all'} className="space-y-3">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-accent/50 bg-secondary/30 rounded-lg py-3"
                >
                  <span className="font-bold text-lg text-primary">📖 פרשות ({sefer.parshiot.length})</span>
                  {viewMode === 'accordion' && <ChevronDown className="h-5 w-5 text-primary" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn("grid gap-2", gridColsForParshiot)} dir="rtl">
                  {sefer.parshiot.map((parsha) => (
                    <Button
                      key={parsha.parsha_id}
                      onClick={() => onParshaSelect(parsha.parsha_id)}
                      variant={selectedParsha === parsha.parsha_id ? "default" : "outline"}
                      className={cn(
                        "justify-center text-center h-auto py-2.5 px-3 font-semibold transition-all hover:scale-105",
                        selectedParsha === parsha.parsha_id && "bg-primary text-primary-foreground shadow-lg",
                        isMobile && "min-h-[2.5rem] text-sm"
                      )}
                    >
                      <span className="truncate">{parsha.parsha_name}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => onParshaSelect(null)}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4" />
                <span>חזור לבחירת פרשה</span>
              </Button>
              <div className="font-semibold text-lg text-primary">
                {selectedParshaName}
              </div>
            </div>
          )}

          {/* Perakim Section */}
          {displayedPerakim.length > 0 && (viewMode === 'all' || selectedParsha !== null) && (
            <Collapsible open={viewMode === 'all' || selectedPerek === null} className="space-y-3">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-accent/50 bg-secondary/30 rounded-lg py-3"
                >
                  <span className="font-bold text-lg text-primary">📚 פרקים ({displayedPerakim.length})</span>
                  {viewMode === 'accordion' && selectedParsha !== null && <ChevronDown className="h-5 w-5 text-primary" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn("grid gap-2", gridColsForPerakim)} dir="rtl">
                  {displayedPerakim.map((perek, idx) => (
                    <Button
                      key={`perek-${sefer.sefer_id}-${selectedParsha ?? 'all'}-${perek.perek_num}-${idx}`}
                      onClick={() => onPerekSelect(perek.perek_num)}
                      variant="outline"
                      className={cn(
                        "h-auto py-2 px-3 font-semibold transition-all hover:scale-105",
                        selectedPerek === perek.perek_num && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
                        isMobile && "min-h-[2.5rem] text-base"
                      )}
                    >
                      {toHebrewNumber(perek.perek_num)}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Pesukim Section */}
          {selectedPerek !== null && totalPesukimInPerek > 0 && (viewMode === 'all' || selectedPerek !== null) && (
            <Collapsible open={true} className="space-y-2">
              {viewMode === 'accordion' && (
                <Button
                  variant="ghost"
                  onClick={() => onPerekSelect(null)}
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground mb-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>חזור לבחירת פרק</span>
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-accent/50 bg-secondary/30 rounded-lg py-3"
                >
                  <span className="font-bold text-lg text-primary">📜 פסוקים ({totalPesukimInPerek})</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn("grid gap-2", gridColsForPesukim)} dir="rtl">
                  {Array.from({ length: totalPesukimInPerek }, (_, i) => i + 1).map((pasukNum) => (
                    <Button
                      key={`pasuk-${pasukNum}`}
                      onClick={() => onPasukSelect(pasukNum)}
                      variant="outline"
                      className={cn(
                        "h-auto py-2 px-2 font-semibold transition-all hover:scale-105",
                        selectedPasuk === pasukNum && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
                        isMobile && "min-h-[2.5rem] text-base"
                      )}
                    >
                      {toHebrewNumber(pasukNum)}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

        {displayedPerakim.length === 0 && selectedParsha !== null && (
          <p className="text-center text-muted-foreground py-4">
            אין פרקים זמינים
          </p>
        )}
      </div>
    </>
  );
};
