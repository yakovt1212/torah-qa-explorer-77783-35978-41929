import { test, expect } from '@playwright/test';

test.describe('ביצועים - בדיקת מהירות טעינה וחיפוש', () => {
  
  test('מדידת זמן טעינה ראשונית של האתר', async ({ page }) => {
    const startTime = Date.now();
    
    // מדידת Performance Metrics
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  זמן טעינה כולל: ${loadTime}ms`);
    
    // בדיקת Web Vitals
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        ttfb: navigation.responseStart - navigation.requestStart, // Time to First Byte
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });
    
    console.log('📊 Web Vitals:');
    console.log(`   - Time to First Byte (TTFB): ${metrics.ttfb}ms`);
    console.log(`   - DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`   - Load Complete: ${metrics.loadComplete}ms`);
    console.log(`   - DOM Interactive: ${metrics.domInteractive}ms`);
    
    // בדיקות תקינות
    expect(loadTime).toBeLessThan(5000); // צריך להיטען תוך 5 שניות
    expect(metrics.ttfb).toBeLessThan(1000); // TTFB צריך להיות מתחת לשנייה
    
    // בדיקה שהכותרת נטענה
    await expect(page.locator('h1')).toContainText('חמישה חומשי תורה');
  });

  test('מדידת זמן טעינת חומש בראשית', async ({ page }) => {
    await page.goto('/');
    
    // המתן לטעינה ראשונית
    await page.waitForSelector('h1:has-text("חמישה חומשי תורה")');
    
    const startTime = Date.now();
    
    // בחירת חומש בראשית (אם הוא לא כבר נבחר)
    const bereishitButton = page.locator('button:has-text("בראשית")').first();
    await bereishitButton.click();
    
    // המתן לטעינת התוכן
    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  זמן טעינת חומש בראשית: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(2000); // צריך להיטען תוך 2 שניות עם Code Splitting
    
    // בדיקה שיש פסוקים
    const pasukCards = await page.locator('[class*="Card"]').count();
    console.log(`📖 נטענו ${pasukCards} כרטיסי פסוקים`);
    expect(pasukCards).toBeGreaterThan(0);
  });

  test('מדידת זמן מעבר בין חומשים', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1');
    
    const transitions = [];
    
    // בדיקת מעבר לחומש שמות
    let startTime = Date.now();
    await page.locator('button:has-text("שמות")').first().click();
    await page.waitForSelector('[class*="Card"]');
    let transitionTime = Date.now() - startTime;
    transitions.push({ sefer: 'שמות', time: transitionTime });
    console.log(`⏱️  מעבר לשמות: ${transitionTime}ms`);
    
    // בדיקת מעבר לחומש ויקרא
    startTime = Date.now();
    await page.locator('button:has-text("ויקרא")').first().click();
    await page.waitForSelector('[class*="Card"]');
    transitionTime = Date.now() - startTime;
    transitions.push({ sefer: 'ויקרא', time: transitionTime });
    console.log(`⏱️  מעבר לויקרא: ${transitionTime}ms`);
    
    // חישוב ממוצע
    const avgTransitionTime = transitions.reduce((sum, t) => sum + t.time, 0) / transitions.length;
    console.log(`📊 זמן מעבר ממוצע: ${avgTransitionTime}ms`);
    
    // כל מעבר צריך להיות מהיר (תוך שנייה)
    transitions.forEach(t => {
      expect(t.time).toBeLessThan(1500);
    });
  });

  test('מדידת ביצועי גלילה עם Virtualization', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[class*="Card"]');
    
    // בדיקת גלילה חלקה
    const scrollMetrics = await page.evaluate(async () => {
      const results = [];
      let frameCount = 0;
      let totalTime = 0;
      
      // מדידת FPS במהלך גלילה
      const measureFPS = () => {
        const start = performance.now();
        frameCount++;
        
        if (frameCount < 60) {
          requestAnimationFrame(measureFPS);
        } else {
          totalTime = performance.now() - start;
        }
      };
      
      // התחלת גלילה
      window.scrollBy(0, 1000);
      requestAnimationFrame(measureFPS);
      
      // המתנה לסיום המדידה
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const fps = (frameCount / (totalTime / 1000)).toFixed(2);
      
      return {
        fps: parseFloat(fps),
        scrollHeight: document.documentElement.scrollHeight,
        visibleHeight: window.innerHeight,
      };
    });
    
    console.log(`🎮 FPS במהלך גלילה: ${scrollMetrics.fps}`);
    console.log(`📏 גובה מסמך: ${scrollMetrics.scrollHeight}px`);
    console.log(`📐 גובה נראה: ${scrollMetrics.visibleHeight}px`);
    
    // FPS צריך להיות גבוה (קרוב ל-60)
    expect(scrollMetrics.fps).toBeGreaterThan(30); // לפחות 30 FPS
  });

  test('מדידת זמן חיפוש', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1');
    
    // פתיחת דיאלוג חיפוש
    const searchButton = page.locator('button:has-text("חיפוש")').first();
    await searchButton.click();
    
    // המתן לדיאלוג
    await page.waitForSelector('input[placeholder*="חיפוש"]');
    
    const searchTerm = 'בראשית';
    const startTime = Date.now();
    
    // הקלדת חיפוש
    await page.fill('input[placeholder*="חיפוש"]', searchTerm);
    
    // המתן לתוצאות (debounce)
    await page.waitForTimeout(400);
    
    const searchTime = Date.now() - startTime;
    console.log(`🔍 זמן חיפוש עבור "${searchTerm}": ${searchTime}ms`);
    
    expect(searchTime).toBeLessThan(1000); // חיפוש צריך להיות מהיר
  });

  test('בדיקת גודל Bundle', async ({ page }) => {
    const resourceSizes: Record<string, number> = {};
    
    // האזנה ל-network requests
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.json')) {
        const size = parseInt(response.headers()['content-length'] || '0');
        const filename = url.split('/').pop() || url;
        resourceSizes[filename] = size;
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log('\n📦 גדלי קבצים:');
    let totalSize = 0;
    Object.entries(resourceSizes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([file, size]) => {
        const sizeKB = (size / 1024).toFixed(2);
        console.log(`   ${file}: ${sizeKB} KB`);
        totalSize += size;
      });
    
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`\n📊 גודל כולל: ${totalMB} MB`);
    
    // Bundle הראשוני צריך להיות קטן (עם Code Splitting)
    expect(totalSize).toBeLessThan(5 * 1024 * 1024); // פחות מ-5MB
  });

  test('בדיקת Memory Usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[class*="Card"]');
    
    const memoryMetrics = await page.evaluate(async () => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        const memory = performance.memory;
        return {
          usedJSHeapSize: (memory.usedJSHeapSize / (1024 * 1024)).toFixed(2),
          totalJSHeapSize: (memory.totalJSHeapSize / (1024 * 1024)).toFixed(2),
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2),
        };
      }
      return null;
    });
    
    if (memoryMetrics) {
      console.log('\n💾 שימוש בזיכרון:');
      console.log(`   Used: ${memoryMetrics.usedJSHeapSize} MB`);
      console.log(`   Total: ${memoryMetrics.totalJSHeapSize} MB`);
      console.log(`   Limit: ${memoryMetrics.jsHeapSizeLimit} MB`);
      
      // בדיקה שלא עוברים את הגבול
      expect(parseFloat(memoryMetrics.usedJSHeapSize))
        .toBeLessThan(parseFloat(memoryMetrics.jsHeapSizeLimit) * 0.7); // מתחת ל-70% מהגבול
    }
  });

  test('בדיקת Lazy Loading של פירושים', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[class*="Card"]');
    
    // מציאת השאלה הראשונה
    const firstQuestion = page.locator('[role="button"]:has-text("?")').first();
    
    const startTime = Date.now();
    
    // לחיצה על השאלה
    await firstQuestion.click();
    
    // המתן לפירושים להיטען
    await page.waitForSelector('[class*="CollapsibleContent"]', { state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  זמן טעינת פירושים: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(300); // צריך להיות מיידי (Lazy Loading)
  });

  test('דוח ביצועים מקיף', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 דוח ביצועים מקיף - חמישה חומשי תורה');
    console.log('='.repeat(60));
    
    await page.goto('/');
    
    const performanceReport = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Timing Metrics
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        
        // Paint Metrics
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Total
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });
    
    console.log('\n⏱️  זמני טעינה:');
    console.log(`   DNS Lookup: ${performanceReport.dns.toFixed(2)}ms`);
    console.log(`   TCP Connection: ${performanceReport.tcp.toFixed(2)}ms`);
    console.log(`   Time to First Byte: ${performanceReport.ttfb.toFixed(2)}ms`);
    console.log(`   Download Time: ${performanceReport.download.toFixed(2)}ms`);
    console.log(`   DOM Processing: ${performanceReport.domProcessing.toFixed(2)}ms`);
    console.log(`   First Paint: ${performanceReport.firstPaint.toFixed(2)}ms`);
    console.log(`   First Contentful Paint: ${performanceReport.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`   Total Load Time: ${performanceReport.totalLoadTime.toFixed(2)}ms`);
    
    console.log('\n' + '='.repeat(60));
    
    // בדיקות תקינות
    expect(performanceReport.firstContentfulPaint).toBeLessThan(2000); // FCP תוך 2 שניות
    expect(performanceReport.totalLoadTime).toBeLessThan(5000); // טעינה כוללת תוך 5 שניות
  });
});
