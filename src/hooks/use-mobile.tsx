import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkViewport = () => {
      // Check for forced viewport mode
      const forcedMode = document.documentElement.style.getPropertyValue('--viewport-mode');
      
      if (forcedMode === 'mobile') {
        setIsMobile(true);
        return;
      }
      
      if (forcedMode === 'tablet' || forcedMode === 'desktop') {
        setIsMobile(false);
        return;
      }
      
      // Auto detection
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkViewport);
    
    // Listen for custom viewport changes
    window.addEventListener("resize", checkViewport);
    
    checkViewport();
    
    return () => {
      mql.removeEventListener("change", checkViewport);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return !!isMobile;
}

export function useViewportSize() {
  const [viewport, setViewport] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const checkViewport = () => {
      // Check for forced viewport mode
      const forcedMode = document.documentElement.style.getPropertyValue('--viewport-mode');
      
      if (forcedMode) {
        setViewport(forcedMode as 'mobile' | 'tablet' | 'desktop');
        return;
      }
      
      // Auto detection
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setViewport('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };

    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkViewport);
    
    // Listen for custom viewport changes
    window.addEventListener("resize", checkViewport);
    
    checkViewport();
    
    return () => {
      mql.removeEventListener("change", checkViewport);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return viewport;
}
