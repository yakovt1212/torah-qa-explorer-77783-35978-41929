import { test, expect } from '@playwright/test';

test.describe('בדיקת ביצועים מהירה ומדויקת', () => {
  
  test('📊 דוח ביצועים מלא', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('🎯 בדיקת ביצועים - חמישה חומשי תורה');
    console.log('='.repeat(70));
    
    // ============================================
    // 1️⃣ טעינה ראשונית של האתר
    // ============================================
    console.log('\n📍 בדיקה 1: טעינה ראשונית של האתר');
    console.log('-'.repeat(70));
    
    const startLoad = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const loadTime = Date.now() - startLoad;
    console.log(`⏱️  זמן טעינה ראשונית: ${loadTime}ms`);
    
    // Web Vitals
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        tcp: Math.round(navigation.connectEnd - navigation.connectStart),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart),
        download: Math.round(navigation.responseEnd - navigation.responseStart),
        domParsing: Math.round(navigation.domInteractive - navigation.responseEnd),
        domComplete: Math.round(navigation.domComplete - navigation.domInteractive),
        firstPaint: Math.round(paint.find(p => p.name === 'first-paint')?.startTime || 0),
        firstContentfulPaint: Math.round(paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0),
        totalLoad: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      };
    });
    
    console.log(`   📡 DNS Lookup: ${metrics.dns}ms`);
    console.log(`   🔌 TCP Connection: ${metrics.tcp}ms`);
    console.log(`   ⚡ TTFB (Time to First Byte): ${metrics.ttfb}ms`);
    console.log(`   📥 Download: ${metrics.download}ms`);
    console.log(`   🔨 DOM Parsing: ${metrics.domParsing}ms`);
    console.log(`   ✅ DOM Complete: ${metrics.domComplete}ms`);
    console.log(`   🎨 First Paint: ${metrics.firstPaint}ms`);
    console.log(`   🖼️  First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`   🏁 Total Load: ${metrics.totalLoad}ms`);
    
    const status1 = loadTime < 5000 ? '✅ מצוין' : loadTime < 8000 ? '⚠️ בסדר' : '❌ איטי';
    console.log(`   ${status1} - טעינה ראשונית`);
    
    // המתנה לכותרת
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // ============================================
    // 2️⃣ טעינת חומש בראשית
    // ============================================
    console.log('\n📍 בדיקה 2: טעינת חומש בראשית');
    console.log('-'.repeat(70));
    
    const startSefer = Date.now();
    
    // המתנה לכפתור בראשית ולחיצה
    const bereishitBtn = page.locator('button').filter({ hasText: 'בראשית' }).first();
    await bereishitBtn.waitFor({ state: 'visible', timeout: 10000 });
    await bereishitBtn.click();
    
    // המתנה לפסוק ראשון
    await page.waitForSelector('text=/בְּרֵאשִׁית/', { timeout: 15000 });
    
    const seferLoadTime = Date.now() - startSefer;
    console.log(`⏱️  זמן טעינת חומש: ${seferLoadTime}ms`);
    
    // ספירת פסוקים
    const pasukCount = await page.locator('[class*="Card"]').count();
    console.log(`📖 מספר פסוקים שנטענו: ${pasukCount}`);
    
    const status2 = seferLoadTime < 2000 ? '✅ מהיר' : seferLoadTime < 4000 ? '⚠️ בסדר' : '❌ איטי';
    console.log(`   ${status2} - טעינת חומש`);
    
    // ============================================
    // 3️⃣ מעבר לחומש שמות
    // ============================================
    console.log('\n📍 בדיקה 3: מעבר לחומש שמות');
    console.log('-'.repeat(70));
    
    const startTransition = Date.now();
    
    const shemotBtn = page.locator('button').filter({ hasText: 'שמות' }).first();
    await shemotBtn.click();
    
    // המתנה לפסוק ראשון של שמות
    await page.waitForSelector('text=/וְאֵלֶּה/', { timeout: 15000 });
    
    const transitionTime = Date.now() - startTransition;
    console.log(`⏱️  זמן מעבר: ${transitionTime}ms`);
    
    const status3 = transitionTime < 1500 ? '✅ מהיר' : transitionTime < 3000 ? '⚠️ בסדר' : '❌ איטי';
    console.log(`   ${status3} - מעבר בין חומשים`);
    
    // ============================================
    // 4️⃣ בדיקת גודל קבצים
    // ============================================
    console.log('\n📍 בדיקה 4: גדלי קבצים שהורדו');
    console.log('-'.repeat(70));
    
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsFiles = entries.filter(e => e.name.includes('.js'));
      const jsonFiles = entries.filter(e => e.name.includes('.json'));
      
      const totalSize = entries.reduce((sum, e) => sum + (e.transferSize || 0), 0);
      const jsSize = jsFiles.reduce((sum, e) => sum + (e.transferSize || 0), 0);
      const jsonSize = jsonFiles.reduce((sum, e) => sum + (e.transferSize || 0), 0);
      
      return {
        totalKB: Math.round(totalSize / 1024),
        jsKB: Math.round(jsSize / 1024),
        jsonKB: Math.round(jsonSize / 1024),
        fileCount: entries.length,
        jsCount: jsFiles.length,
        jsonCount: jsonFiles.length,
      };
    });
    
    console.log(`📦 סה"כ קבצים: ${resources.fileCount}`);
    console.log(`📄 קבצי JS: ${resources.jsCount} (${resources.jsKB} KB)`);
    console.log(`📋 קבצי JSON: ${resources.jsonCount} (${resources.jsonKB} KB)`);
    console.log(`💾 סה"כ הורד: ${resources.totalKB} KB (${(resources.totalKB / 1024).toFixed(2)} MB)`);
    
    const status4 = resources.totalKB < 5120 ? '✅ טוב' : resources.totalKB < 10240 ? '⚠️ בסדר' : '❌ כבד';
    console.log(`   ${status4} - גודל Bundle`);
    
    // ============================================
    // 5️⃣ בדיקת זיכרון
    // ============================================
    console.log('\n📍 בדיקה 5: שימוש בזיכרון');
    console.log('-'.repeat(70));
    
    const memory = await page.evaluate(() => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        const mem = performance.memory;
        return {
          usedMB: Math.round(mem.usedJSHeapSize / (1024 * 1024)),
          totalMB: Math.round(mem.totalJSHeapSize / (1024 * 1024)),
          limitMB: Math.round(mem.jsHeapSizeLimit / (1024 * 1024)),
        };
      }
      return null;
    });
    
    if (memory) {
      console.log(`💾 זיכרון בשימוש: ${memory.usedMB} MB`);
      console.log(`📊 זיכרון כולל: ${memory.totalMB} MB`);
      console.log(`🎯 גבול זיכרון: ${memory.limitMB} MB`);
      console.log(`📈 אחוז שימוש: ${Math.round((memory.usedMB / memory.limitMB) * 100)}%`);
      
      const status5 = memory.usedMB < 100 ? '✅ מעולה' : memory.usedMB < 200 ? '⚠️ בסדר' : '❌ גבוה';
      console.log(`   ${status5} - שימוש בזיכרון`);
    } else {
      console.log('   ℹ️  מידע זיכרון לא זמין בדפדפן זה');
    }
    
    // ============================================
    // 📊 סיכום
    // ============================================
    console.log('\n' + '='.repeat(70));
    console.log('📊 סיכום תוצאות');
    console.log('='.repeat(70));
    console.log(`✅ טעינה ראשונית: ${loadTime}ms`);
    console.log(`✅ TTFB: ${metrics.ttfb}ms`);
    console.log(`✅ First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`✅ טעינת חומש: ${seferLoadTime}ms`);
    console.log(`✅ מעבר בין חומשים: ${transitionTime}ms`);
    console.log(`✅ גודל Bundle: ${resources.totalKB} KB`);
    if (memory) console.log(`✅ זיכרון: ${memory.usedMB} MB`);
    console.log('='.repeat(70));
    
    // בדיקות תקינות
    expect(loadTime).toBeLessThan(10000); // טעינה ראשונית
    expect(metrics.ttfb).toBeLessThan(2000); // TTFB
    expect(seferLoadTime).toBeLessThan(5000); // טעינת חומש
    expect(transitionTime).toBeLessThan(5000); // מעבר
  });
});
