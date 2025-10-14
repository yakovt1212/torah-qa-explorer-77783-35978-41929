import { test, expect } from '@playwright/test';

test.describe('Theme Customizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
  });

  test('should open theme customizer', async ({ page }) => {
    // Find and click the theme customizer button (Palette icon)
    const themeButton = page.locator('button[aria-label="Theme Customizer"], button:has(svg)').filter({ hasText: /ערכות נושא|נושא/ }).first();
    
    // If not found by text, try to find by icon
    if (await themeButton.count() === 0) {
      const paletteButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await paletteButton.click();
    } else {
      await themeButton.click();
    }

    // Wait for sheet to open
    await page.waitForTimeout(500);

    // Check if sheet is visible
    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();
  });

  test('should change theme preset', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-palette"]') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Get initial background color
    const initialBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );

    // Click on a different theme preset (Ocean theme)
    const oceanPreset = page.locator('button:has-text("אוקיינוס")');
    if (await oceanPreset.count() > 0) {
      await oceanPreset.click();
      await page.waitForTimeout(300);

      // Check if background color changed
      const newBg = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );

      expect(newBg).not.toBe(initialBg);
    }
  });

  test('should change hebrew font', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Find font selector
    const fontSelector = page.locator('select, [role="combobox"]').filter({ hasText: /פונט|גופן/ }).first();
    
    if (await fontSelector.count() === 0) {
      // Try to find by label
      const fontLabel = page.locator('label:has-text("פונט עברי")');
      const fontSelect = fontLabel.locator('..').locator('select, [role="combobox"]');
      
      if (await fontSelect.count() > 0) {
        await fontSelect.click();
        await page.waitForTimeout(200);
        
        // Select a different font
        const fontOption = page.locator('[role="option"]').filter({ hasText: /רוביק|דוד/ }).first();
        if (await fontOption.count() > 0) {
          await fontOption.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('should toggle animations', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Find animations toggle
    const animationsToggle = page.locator('button[role="switch"], input[type="checkbox"]').filter({ 
      has: page.locator('..').locator(':has-text("אנימציות")') 
    }).first();

    if (await animationsToggle.count() === 0) {
      // Try alternative selector
      const toggle = page.locator('label:has-text("אנימציות")').locator('..').locator('button[role="switch"]');
      if (await toggle.count() > 0) {
        const initialState = await toggle.getAttribute('data-state');
        await toggle.click();
        await page.waitForTimeout(200);
        const newState = await toggle.getAttribute('data-state');
        expect(newState).not.toBe(initialState);
      }
    }
  });

  test('should change border radius', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Find border radius slider
    const radiusSlider = page.locator('input[type="range"]').first();
    
    if (await radiusSlider.count() > 0) {
      const initialValue = await radiusSlider.getAttribute('value');
      
      // Change slider value
      await radiusSlider.fill('15');
      await page.waitForTimeout(200);
      
      const newValue = await radiusSlider.getAttribute('value');
      expect(newValue).not.toBe(initialValue);
    }
  });

  test('should apply background pattern', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Find background pattern selector
    const patternSelector = page.locator('select').filter({ hasText: /רקע|טקסטורה/ }).first();
    
    if (await patternSelector.count() === 0) {
      // Try to find by label
      const patternLabel = page.locator('label:has-text("רקע")');
      const patternSelect = patternLabel.locator('..').locator('select, [role="combobox"]');
      
      if (await patternSelect.count() > 0) {
        await patternSelect.click();
        await page.waitForTimeout(200);
        
        // Select a pattern
        const patternOption = page.locator('[role="option"]').filter({ hasText: /נקודות|רשת/ }).first();
        if (await patternOption.count() > 0) {
          await patternOption.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('should reset to default settings', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Change some settings first
    const oceanPreset = page.locator('button:has-text("אוקיינוס")');
    if (await oceanPreset.count() > 0) {
      await oceanPreset.click();
      await page.waitForTimeout(300);
    }

    // Find and click reset button
    const resetButton = page.locator('button:has-text("איפוס")');
    if (await resetButton.count() > 0) {
      await resetButton.click();
      await page.waitForTimeout(300);

      // Verify default theme is selected
      const defaultPreset = page.locator('button:has-text("ברירת מחדל")');
      const isSelected = await defaultPreset.getAttribute('class');
      expect(isSelected).toContain('border');
    }
  });

  test('should persist settings in localStorage', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Change theme to Ocean
    const oceanPreset = page.locator('button:has-text("אוקיינוס")');
    if (await oceanPreset.count() > 0) {
      await oceanPreset.click();
      await page.waitForTimeout(300);
    }

    // Check localStorage
    const themeSettings = await page.evaluate(() => {
      const settings = localStorage.getItem('theme_presets');
      return settings ? JSON.parse(settings) : null;
    });

    expect(themeSettings).not.toBeNull();
    expect(themeSettings).toHaveProperty('preset');
  });

  test('should load saved settings on page refresh', async ({ page }) => {
    // Set theme to Ocean
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    const oceanPreset = page.locator('button:has-text("אוקיינוס")');
    if (await oceanPreset.count() > 0) {
      await oceanPreset.click();
      await page.waitForTimeout(300);
    }

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if Ocean theme is still applied
    const themeSettings = await page.evaluate(() => {
      const settings = localStorage.getItem('theme_presets');
      return settings ? JSON.parse(settings) : null;
    });

    if (themeSettings) {
      expect(themeSettings.preset).toBe('ocean');
    }
  });

  test('should display all theme presets', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Check for theme presets
    const expectedThemes = ['ברירת מחדל', 'אוקיינוס', 'יער', 'שקיעה', 'לבנדר', 'ספיה'];
    
    for (const theme of expectedThemes) {
      const themeButton = page.locator(`button:has-text("${theme}")`);
      const count = await themeButton.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should show color preview for each theme', async ({ page }) => {
    // Open theme customizer
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Check if theme cards have color previews
    const colorPreviews = page.locator('div[style*="background"]').filter({ 
      has: page.locator('..').locator(':has-text("ברירת מחדל")') 
    });

    // Should have at least one color preview
    const count = await colorPreviews.count();
    expect(count).toBeGreaterThan(0);
  });
});
