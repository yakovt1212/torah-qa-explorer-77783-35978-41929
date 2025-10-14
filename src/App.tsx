import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemePresetsProvider } from "@/contexts/ThemePresetsContext";
import { FontSettingsProvider } from "@/contexts/FontSettingsContext";
import { HighlightsProvider } from "@/contexts/HighlightsContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { QuickSelectorSettingsProvider } from "@/contexts/QuickSelectorSettingsContext";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import { DevPanel } from "@/components/DevPanel";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemePresetsProvider>
        <FontSettingsProvider>
          <HighlightsProvider>
            <NotesProvider>
              <BookmarksProvider>
                <QuickSelectorSettingsProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <DevPanel />
                    <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </QuickSelectorSettingsProvider>
            </BookmarksProvider>
          </NotesProvider>
        </HighlightsProvider>
      </FontSettingsProvider>
    </ThemePresetsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
