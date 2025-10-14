import { useState, useEffect, useCallback, useRef } from 'react';

interface QuickSelectorState {
  isVisible: boolean;
  isPinned: boolean;
  isMinimized: boolean;
  viewMode: 'all' | 'accordion';
  sidebarWidth: 'normal' | 'wide';
}

const STORAGE_KEY = 'quickSelector_preferences';
const AUTO_HIDE_DELAY = 5000; // 5 seconds

export function useQuickSelector(isMobile: boolean, startMinimized: boolean = false) {
  const [state, setState] = useState<QuickSelectorState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('[QuickSelector] 🔵 Initial load from localStorage:', saved);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('[QuickSelector] Parsed state:', parsed);
        return {
          ...parsed,
          isVisible: false, // Start closed by default
          isMinimized: startMinimized || parsed.isMinimized, // Use setting or saved preference
        };
      } catch (e) {
        console.error('[QuickSelector] Failed to parse localStorage:', e);
      }
    }
    
    return {
      isVisible: false, // Start closed by default
      isPinned: false,
      isMinimized: startMinimized, // Use the setting
      viewMode: 'all' as const,
      sidebarWidth: 'normal' as const,
    };
  });

  const lastInteractionRef = useRef(Date.now());
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Auto-hide logic (only on desktop, only if not pinned and not minimized)
  useEffect(() => {
    console.log('[QuickSelector Auto-Hide] 🔄 Effect triggered', {
      isMobile,
      isPinned: state.isPinned,
      isMinimized: state.isMinimized,
      isVisible: state.isVisible,
      hasActiveTimer: autoHideTimerRef.current !== null
    });

    // Always clear any existing timer first
    if (autoHideTimerRef.current) {
      console.log('[QuickSelector Auto-Hide] Clearing existing timer');
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }

    // Don't start new timer if pinned, minimized, mobile, OR NOT VISIBLE
    if (isMobile || state.isPinned || state.isMinimized || !state.isVisible) {
      console.log('[QuickSelector Auto-Hide] Not starting timer - conditions not met');
      return;
    }

    // Start auto-hide timer ONLY if conditions allow
    console.log('[QuickSelector Auto-Hide] Starting new auto-hide timer for', AUTO_HIDE_DELAY, 'ms');
    autoHideTimerRef.current = setTimeout(() => {
      console.log('[QuickSelector Auto-Hide] Timer fired! Using functional setState to check CURRENT state...');
      
      // Use functional setState to get CURRENT state (not closure state!)
      setState(prev => {
        console.log('[QuickSelector Auto-Hide] Current state check:', {
          isPinned: prev.isPinned,
          isMinimized: prev.isMinimized,
          isVisible: prev.isVisible
        });
        
        // Only hide if CURRENTLY not pinned, not minimized, and visible
        if (!prev.isPinned && !prev.isMinimized && prev.isVisible) {
          console.log('[QuickSelector Auto-Hide] ✅ Conditions met - HIDING sidebar');
          return { ...prev, isVisible: false };
        }
        
        console.log('[QuickSelector Auto-Hide] ❌ Conditions NOT met - keeping sidebar visible');
        return prev; // No change
      });
    }, AUTO_HIDE_DELAY);

    // Cleanup on unmount or dependency change
    return () => {
      if (autoHideTimerRef.current) {
        console.log('[QuickSelector Auto-Hide] Cleanup - clearing timer');
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
    };
  }, [isMobile, state.isPinned, state.isMinimized, state.isVisible]);

  const setVisible = useCallback((visible: boolean) => {
    console.log('🔵 useQuickSelector.setVisible called with:', visible);
    setState(prev => {
      console.log('🔵 Previous state:', prev);
      const newState = { ...prev, isVisible: visible };
      console.log('🔵 New state:', newState);
      return newState;
    });
    lastInteractionRef.current = Date.now();
  }, []);

  const setPinned = useCallback((pinned: boolean) => {
    setState(prev => ({ ...prev, isPinned: pinned }));
    lastInteractionRef.current = Date.now();
  }, []);

  const setMinimized = useCallback((minimized: boolean) => {
    setState(prev => ({ ...prev, isMinimized: minimized }));
    lastInteractionRef.current = Date.now();
  }, []);

  const setViewMode = useCallback((viewMode: 'all' | 'accordion') => {
    setState(prev => ({ ...prev, viewMode }));
    lastInteractionRef.current = Date.now();
  }, []);

  const setSidebarWidth = useCallback((sidebarWidth: 'normal' | 'wide') => {
    console.log('[QuickSelector] 🔄 setSidebarWidth CALLED:', sidebarWidth);
    setState(prev => {
      console.log('[QuickSelector] Previous sidebarWidth:', prev.sidebarWidth, '-> New:', sidebarWidth);
      lastInteractionRef.current = Date.now();
      return { ...prev, sidebarWidth };
    });
  }, []);

  const togglePinned = useCallback(() => {
    console.log('[QuickSelector] 🔴 togglePinned CALLED!');
    setState(prev => {
      const newPinned = !prev.isPinned;
      console.log('[QuickSelector] Toggle pinned:', prev.isPinned, '->', newPinned);
      console.log('[QuickSelector] 📌 New pinned state will be:', newPinned);
      lastInteractionRef.current = Date.now();
      return { ...prev, isPinned: newPinned };
    });
  }, []);

  const toggleMinimized = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
    lastInteractionRef.current = Date.now();
  }, []);

  const recordInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  return {
    ...state,
    setVisible,
    setPinned,
    setMinimized,
    setViewMode,
    setSidebarWidth,
    togglePinned,
    toggleMinimized,
    recordInteraction,
  };
}
