import { useState, useEffect, useMemo, Suspense } from "react";
import { Book, Menu } from "lucide-react";
import { Sefer, FlatPasuk } from "@/types/torah";
import { SeferSelector } from "@/components/SeferSelector";
import { VirtualizedPasukList } from "@/components/VirtualizedPasukList";
import { QuickSelector } from "@/components/QuickSelector";
import { Settings } from "@/components/Settings";
import { ViewportSelector } from "@/components/ViewportSelector";

import { SearchButton } from "@/components/search/SearchButton";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Card } from "@/components/ui/card";
import { fixJsonContent } from "@/utils/fixData";
import { cn } from "@/lib/utils";
import { useLazySearch } from "@/hooks/useLazySearch";
import { PasukSkeleton } from "@/components/SkeletonLoader";
import { getCachedSefer, setCachedSefer, preloadAllSefarimToCache } from "@/utils/indexedDB";
import { registerServiceWorker } from "@/utils/serviceWorkerRegistration";
import { useQuickSelector } from "@/hooks/useQuickSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuickSelectorSettings } from "@/contexts/QuickSelectorSettingsContext";
import { TorahBreadcrumb } from "@/components/TorahBreadcrumb";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Global in-memory cache for sefarim (for instant access)
const seferCache = new Map<number, Sefer>();

const Index = () => {
  const isMobile = useIsMobile();
  const { settings: quickSelectorSettings } = useQuickSelectorSettings();
  const quickSelector = useQuickSelector(isMobile, quickSelectorSettings.startMinimized);
  
  const [selectedSefer, setSelectedSefer] = useState<number>(1);
  const [seferData, setSeferData] = useState<Sefer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParsha, setSelectedParsha] = useState<number | null>(null);
  const [selectedPerek, setSelectedPerek] = useState<number | null>(null);
  const [selectedPasuk, setSelectedPasuk] = useState<number | null>(null);
  const [swVersion, setSwVersion] = useState<string>('...');
  
  // Dynamic import helper with caching (memory + IndexedDB)
  const loadSefer = async (seferId: number) => {
    try {
      // 1. Check in-memory cache first (instant)
      if (seferCache.has(seferId)) {
        setSeferData(seferCache.get(seferId)!);
        setSelectedParsha(null);
        setSelectedPerek(null);
        setSelectedPasuk(null);
        setLoading(false);
        return;
      }
      
      // 2. Check IndexedDB (fast)
      const cachedSefer = await getCachedSefer(seferId);
      if (cachedSefer) {
        const fixedSefer = fixSefer(cachedSefer);
        seferCache.set(seferId, fixedSefer);
        setSeferData(fixedSefer);
        setSelectedParsha(null);
        setSelectedPerek(null);
        setSelectedPasuk(null);
        setLoading(false);
        return;
      }
      
      // 3. Load from network (slower)
      setLoading(true);
      
      const seferFiles: Record<number, () => Promise<any>> = {
        1: () => import('../data/bereishit.json'),
        2: () => import('../data/shemot.json'),
        3: () => import('../data/vayikra.json'),
        4: () => import('../data/bamidbar.json'),
        5: () => import('../data/devarim.json')
      };
      
      const seferModule = await seferFiles[seferId]();
      const sefer = fixSefer(seferModule.default);
      
      // Cache in both memory and IndexedDB
      seferCache.set(seferId, sefer);
      await setCachedSefer(seferId, sefer);
      
      setSeferData(sefer);
      setSelectedParsha(null);
      setSelectedPerek(null);
      setSelectedPasuk(null);
      setLoading(false);
    } catch (error) {
      console.error("Error loading sefer:", error);
      setLoading(false);
    }
  };
  
  // Helper to fix sefer data
  const fixSefer = (sefer: Sefer): Sefer => {
    const jsonString = JSON.stringify(sefer);
    const fixedString = fixJsonContent(jsonString);
    return JSON.parse(fixedString) as Sefer;
  };
  
  // Register service worker on mount and get version
  useEffect(() => {
    registerServiceWorker();
    
    // Get SW version in production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            const { version, buildTime } = event.data;
            const date = new Date(buildTime);
            const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            setSwVersion(`v${version} (${timeStr})`);
          };
          registration.active.postMessage(
            { type: 'GET_VERSION' },
            [messageChannel.port2]
          );
        }
      }).catch(() => setSwVersion('❌'));
    } else {
      setSwVersion('dev');
    }
  }, []);

  // Load initial sefer on mount
  useEffect(() => {
    loadSefer(selectedSefer);
  }, [selectedSefer]);

  // Preload sefarim in background (delayed) - OPTIMIZED
  useEffect(() => {
    const preloadAllSefarim = async () => {
      // Wait 5 seconds before starting background preload
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('[Preload] Starting background preload...');
      
      // Start background preloading to IndexedDB (non-blocking)
      preloadAllSefarimToCache((current, total) => {
        console.log(`[Preload] Progress: ${current}/${total}`);
      });

      const seferFiles: Record<number, () => Promise<any>> = {
        1: () => import('../data/bereishit.json'),
        2: () => import('../data/shemot.json'),
        3: () => import('../data/vayikra.json'),
        4: () => import('../data/bamidbar.json'),
        5: () => import('../data/devarim.json')
      };
      
      // Load remaining sefarim one by one (skip already loaded ones)
      for (let seferId = 2; seferId <= 5; seferId++) {
        if (!seferCache.has(seferId)) {
          // Add delay between loads to not block UI
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            // Try IndexedDB first
            const cached = await getCachedSefer(seferId);
            if (cached) {
              const sefer = fixSefer(cached);
              seferCache.set(seferId, sefer);
              console.log(`[Preload] Loaded sefer ${seferId} from IndexedDB`);
              continue;
            }

            // Load from network
            const seferModule = await seferFiles[seferId]();
            const sefer = fixSefer(seferModule.default);
            seferCache.set(seferId, sefer);
            await setCachedSefer(seferId, sefer);
            console.log(`[Preload] Loaded sefer ${seferId} from network`);
          } catch (error) {
            console.error(`[Preload] Failed to load sefer ${seferId}:`, error);
          }
        }
      }
    };
    
    // Start preloading after initial render
    const timer = setTimeout(preloadAllSefarim, 100);
    return () => clearTimeout(timer);
  }, []);
  // Flatten pesukim from nested structure (only current sefer)
  const flattenedPesukim = useMemo(() => {
    if (!seferData) return [];
    
    const flat: FlatPasuk[] = [];
    
    for (const parsha of seferData.parshiot) {
      for (const perek of parsha.perakim) {
        for (const pasuk of perek.pesukim) {
          flat.push({
            id: pasuk.id,
            sefer: seferData.sefer_id,
            sefer_name: seferData.sefer_name,
            perek: perek.perek_num,
            pasuk_num: pasuk.pasuk_num,
            text: pasuk.text,
            content: pasuk.content || [],
            parsha_id: parsha.parsha_id,
            parsha_name: parsha.parsha_name
          });
        }
      }
    }
    
    return flat;
  }, [seferData]);

  // Lazy search - loads sefarim only when needed
  const {
    isOpen: isSearchOpen,
    query: searchQuery,
    filters: searchFilters,
    results: searchResults,
    isSearching,
    openSearch,
    closeSearch,
    setQuery: setSearchQuery,
    setFilters: setSearchFilters,
    clearSearch,
    availableSefarim,
  } = useLazySearch();

  // Filter pesukim without search (for performance)
  const filteredPesukim = useMemo(() => {
    let pesukim = flattenedPesukim;

    // Filter by parsha
    if (selectedParsha !== null) {
      pesukim = pesukim.filter(p => p.parsha_id === selectedParsha);
    }

    // Filter by perek
    if (selectedPerek !== null) {
      pesukim = pesukim.filter(p => p.perek === selectedPerek);
    }

    // Filter by pasuk
    if (selectedPasuk !== null) {
      pesukim = pesukim.filter(p => p.pasuk_num === selectedPasuk);
    }

    // Only show pesukim with content
    return pesukim.filter(p => p.content.some(c => c.questions.length > 0));
  }, [
    flattenedPesukim,
    selectedParsha,
    selectedPerek,
    selectedPasuk
  ]);
  const totalPesukimInPerek = useMemo(() => {
    if (!seferData || selectedPerek === null) return 0;
    const pesukimInPerek = flattenedPesukim.filter(p => p.perek === selectedPerek);
    return pesukimInPerek.length > 0 ? Math.max(...pesukimInPerek.map(p => p.pasuk_num)) : 0;
  }, [flattenedPesukim, selectedPerek]);

  const handleBreadcrumbNavigate = (level: 'sefer' | 'parsha' | 'perek', value?: number) => {
    if (level === 'sefer') {
      setSelectedParsha(null);
      setSelectedPerek(null);
      setSelectedPasuk(null);
    } else if (level === 'parsha') {
      setSelectedParsha(value || null);
      setSelectedPerek(null);
      setSelectedPasuk(null);
    } else if (level === 'perek') {
      setSelectedPerek(value || null);
      setSelectedPasuk(null);
    }
  };

  const handleNavigateToResult = (pasuk: FlatPasuk) => {
    // Navigate to the pasuk
    if (pasuk.sefer !== selectedSefer) {
      setSelectedSefer(pasuk.sefer);
    }
    setSelectedParsha(pasuk.parsha_id || null);
    setSelectedPerek(pasuk.perek);
    setSelectedPasuk(pasuk.pasuk_num);
    closeSearch();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-l from-primary via-primary to-sidebar-background shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6 bg-blue-950 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-lg p-1">
              <Settings />
              <ViewportSelector />
              {/* Toggle Sidebar Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        console.log('[Header] Toggling QuickSelector:', !quickSelector.isVisible);
                        quickSelector.setVisible(!quickSelector.isVisible);
                      }}
                      className={cn(
                        "h-9 w-9 transition-colors",
                        isMobile && "h-10 w-10 bg-primary/10",
                        "hover:bg-accent/20"
                      )}
                    >
                      <Menu 
                        className={cn(
                          "text-primary-foreground",
                          isMobile ? "h-6 w-6" : "h-5 w-5"
                        )} 
                        strokeWidth={2.5} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{quickSelector.isVisible ? 'סגור בחירה מהירה' : 'פתח בחירה מהירה'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground">
                חמישה חומשי תורה - שאלות ופירושים
              </h1>
              <Book className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-accent" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Sefer Selector */}
        <SeferSelector selectedSefer={selectedSefer} onSeferSelect={setSelectedSefer} />

        {/* Breadcrumb Navigation */}
        {!loading && seferData && (
          <TorahBreadcrumb
            seferData={seferData}
            selectedParsha={selectedParsha}
            selectedPerek={selectedPerek}
            selectedPasuk={selectedPasuk}
            onNavigate={handleBreadcrumbNavigate}
          />
        )}

        {/* Quick Selector - Render as Dialog/Popup */}
        <Suspense fallback={null}>
          <QuickSelector
            sefer={seferData}
            selectedParsha={selectedParsha}
            onParshaSelect={setSelectedParsha}
            selectedPerek={selectedPerek}
            onPerekSelect={setSelectedPerek}
            totalPesukimInPerek={totalPesukimInPerek}
            selectedPasuk={selectedPasuk}
            onPasukSelect={setSelectedPasuk}
            quickSelectorState={quickSelector}
          />
        </Suspense>

        {loading ? (
          <PasukSkeleton />
        ) : (
          <div>
            {/* Main Content */}
            {filteredPesukim.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  בחר חומש ופרשה להתחלה
                </p>
              </Card>
            ) : (
              <div className="pl-2">
                <Suspense fallback={<PasukSkeleton />}>
                  <VirtualizedPasukList pesukim={filteredPesukim} seferId={selectedSefer} />
                </Suspense>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Quick Selector Floating Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                console.log('🔵 Quick Selector Button Clicked!');
                console.log('Current state:', quickSelector.isVisible);
                quickSelector.setVisible(!quickSelector.isVisible);
                console.log('New state should be:', !quickSelector.isVisible);
              }}
              className="fixed bottom-6 left-6 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl z-[9998] transition-all hover:scale-110 pointer-events-auto cursor-pointer"
              size="icon"
            >
              <Menu className="h-7 w-7 text-primary-foreground pointer-events-none" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {quickSelector.isVisible ? 'סגור בחירה מהירה' : 'פתח בחירה מהירה'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* SW Version Indicator */}
      {import.meta.env.PROD && (
        <div className="fixed bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded shadow-lg backdrop-blur-sm z-40">
          SW: {swVersion}
        </div>
      )}

      {/* Search */}
      <SearchButton onClick={openSearch} />
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={closeSearch}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        filters={searchFilters}
        onFiltersChange={setSearchFilters}
        results={searchResults}
        isSearching={isSearching}
        onResultClick={handleNavigateToResult}
        seferData={availableSefarim}
      />
    </div>
  );
};
export default Index;