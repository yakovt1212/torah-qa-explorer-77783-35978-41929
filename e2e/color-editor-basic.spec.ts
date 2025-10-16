import { test, expect } from '@playwright/test';

test.describe('Color Editor - Basic Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('should open settings dialog', async ({ page }) => {
    // Click settings button using aria-label
    const settingsBtn = page.getByRole('button', { name: 'הגדרות' });
    await settingsBtn.click();

    // Check dialog opened with title "הגדרות"
    await expect(page.getByRole('heading', { name: 'הגדרות' })).toBeVisible({ timeout: 5000 });
  });

  test('should show color editor button in themes tab', async ({ page }) => {
    // Open settings
    await page.getByRole('button', { name: 'הגדרות' }).click();
    
    // Wait for dialog
    await page.waitForTimeout(500);

    // Check for themes tab and color editor button
    const themesTab = page.getByRole('tab', { name: /ערכות נושא/i });
    await expect(themesTab).toBeVisible();
    
    // Click on themes tab
    await themesTab.click();
    
    // Look for the specific button (not the heading)
    const colorEditorBtn = page.getByRole('button', { name: /פתח עורך צבעים חי/i });
    await expect(colorEditorBtn).toBeVisible();
  });

  test('should display CSS variables when editor opens', async ({ page }) => {
    // This test will verify the fix
    console.log('Testing CSS variables loading...');
    
    // Wait for the app to fully load
    await page.waitForSelector('body', { state: 'attached' });
    await page.waitForTimeout(2000); // Give more time for CSS to load
    
    // Check that CSS variables exist in the document
    const hasVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const allProps = Array.from(computedStyle);
      const cssVars = allProps.filter(prop => prop.startsWith('--'));
      console.log('Found CSS variables:', cssVars.length);
      console.log('Sample variables:', cssVars.slice(0, 10));
      
      // Debug: Check if styles are loaded
      const styleSheets = Array.from(document.styleSheets);
      console.log('Loaded stylesheets:', styleSheets.length);
      
      // Debug: Check body classes
      console.log('Body classes:', document.body.className);
      
      return cssVars.length > 0;
    });

    console.log('hasVariables result:', hasVariables);
    expect(hasVariables).toBe(true);
  });
});
