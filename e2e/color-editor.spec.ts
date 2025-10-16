import { test, expect } from '@playwright/test';

test.describe('Color Editor Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:8080');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should open color editor from settings', async ({ page }) => {
    // Click on Settings button
    const settingsButton = page.getByRole('button', { name: 'הגדרות' });
    await settingsButton.click();

    // Wait for settings dialog to open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'הגדרות' })).toBeVisible();

    // Click on "ערכות נושא" tab (Themes tab)
    const themesTab = page.getByRole('tab', { name: /ערכות נושא/i });
    await themesTab.click();

    // Find and click the "פתח עורך צבעים חי" button using test ID
    const colorEditorButton = page.getByTestId('open-color-editor-btn');
    await expect(colorEditorButton).toBeVisible();
    await colorEditorButton.click();

    // Wait for color editor panel to open - it's a Sheet component
    await page.waitForTimeout(1000);
    
    // Check for panel elements
    await expect(page.locator('[role="dialog"]').last()).toBeVisible({ timeout: 5000 });
  });

  test('should display CSS variables in color editor', async ({ page }) => {
    // Open settings
    const settingsButton = page.getByRole('button', { name: 'הגדרות' });
    await settingsButton.click();

    // Navigate to color editor
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    const colorEditorBtn = page.getByTestId('open-color-editor-btn');
    await expect(colorEditorBtn).toBeVisible();
    await colorEditorBtn.click();

    // Wait for the color editor panel to appear using data-testid
    const panel = page.getByTestId('color-editor-panel');
    await expect(panel).toBeVisible({ timeout: 10000 });

    // Check title is visible
    const title = page.getByTestId('color-editor-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Live Color Editor');

    // Wait for variables to load and check that at least one variable card exists
    const variableCards = page.getByTestId('variable-card');
    await expect(variableCards.first()).toBeVisible({ timeout: 10000 });
    
    const count = await variableCards.count();
    expect(count).toBeGreaterThan(0);

    // Check that tabs exist using data-testids
    await expect(page.getByTestId('backgrounds-tab')).toBeVisible();
    await expect(page.getByTestId('primary-tab')).toBeVisible();
    await expect(page.getByTestId('borders-tab')).toBeVisible();
    await expect(page.getByTestId('all-tab')).toBeVisible();
  });

  test('should search for variables', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel to appear
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });

    // Wait for variables to load by checking for at least one variable card
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Find search input using data-testid
    const searchInput = page.getByTestId('search-variables-input');
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Type search term
    await searchInput.fill('primary');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Check that results are filtered using data-testid
    const variableCards = page.getByTestId('variable-card');
    const count = await variableCards.count();
    
    // Should have at least some results
    expect(count).toBeGreaterThan(0);
  });

  test('should edit a color variable', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel and variables to load
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Search for a specific variable using data-testid
    const searchInput = page.getByTestId('search-variables-input');
    await searchInput.fill('background');
    await page.waitForTimeout(500);

    // Wait for filtered results
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 5000 });

    // Find the first variable card and its input
    const firstCard = page.getByTestId('variable-card').first();
    const firstInput = firstCard.locator('input[type="text"]').first();
    await expect(firstInput).toBeVisible({ timeout: 5000 });

    // Change the value
    await firstInput.fill('0 0% 100%');
    await page.waitForTimeout(500);

    // Verify the value changed
    const newValue = await firstInput.inputValue();
    expect(newValue).toBe('0 0% 100%');
  });

  test('should export CSS variables', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel and variables to load
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Setup clipboard permission
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click Copy CSS button using data-testid
    const copyButton = page.getByTestId('export-css-btn');
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Wait a bit for the action to complete
    await page.waitForTimeout(1000);
    
    // Try to verify clipboard content instead of toast
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain(':root');
    expect(clipboardContent).toContain('--');
  });

  test('should download theme file', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel and variables to load
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Setup download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

    // Click Download button using data-testid
    const downloadButton = page.getByTestId('download-theme-btn');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('theme-variables.css');
  });

  test('should reset all variables', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel and variables to load
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Make a change first
    const searchInput = page.getByTestId('search-variables-input');
    await searchInput.fill('primary');
    await page.waitForTimeout(500);
    
    // Wait for filtered card
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 5000 });
    
    const firstCard = page.getByTestId('variable-card').first();
    const firstInput = firstCard.locator('input[type="text"]').first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('350 100% 50%');
      await page.waitForTimeout(500);
    }

    // Clear search to see all buttons
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Setup dialog handler for confirm
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // Click Reset All button using data-testid
    const resetAllButton = page.getByTestId('reset-all-btn');
    await expect(resetAllButton).toBeVisible({ timeout: 5000 });
    await resetAllButton.click();

    // Wait for reset to complete
    await page.waitForTimeout(1000);

    // Verify toast appears
    await expect(page.getByText(/reset to defaults/i)).toBeVisible({ timeout: 3000 });
  });

  test('should filter by category tabs', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel
    await expect(page.getByTestId('color-editor-panel')).toBeVisible({ timeout: 10000 });
    
    // Wait for variables to load
    await expect(page.getByTestId('variable-card').first()).toBeVisible({ timeout: 10000 });

    // Click on Backgrounds tab using data-testid
    const backgroundsTab = page.getByTestId('backgrounds-tab');
    await backgroundsTab.click();
    await page.waitForTimeout(500);

    // Count variables using data-testid
    const backgroundsCount = await page.getByTestId('variable-card').count();
    expect(backgroundsCount).toBeGreaterThan(0);
    
    // Click on All tab using data-testid
    const allTab = page.getByTestId('all-tab');
    await allTab.click();
    await page.waitForTimeout(500);

    // All should have the most
    const allCount = await page.getByTestId('variable-card').count();
    expect(allCount).toBeGreaterThanOrEqual(backgroundsCount);
  });

  test('should close color editor panel', async ({ page }) => {
    // Open color editor
    await page.getByRole('button', { name: 'הגדרות' }).click();
    await page.getByRole('tab', { name: /ערכות נושא/i }).click();
    await page.getByTestId('open-color-editor-btn').click();

    // Wait for panel
    await expect(page.getByText('Live Color Editor')).toBeVisible();

    // Close the panel (click outside or close button)
    // Assuming there's a close button or clicking overlay closes it
    await page.keyboard.press('Escape');
    
    // Or find and click close button
    // await page.locator('[data-testid="close-button"]').click();

    // Verify panel is closed
    await expect(page.getByText('Live Color Editor')).not.toBeVisible({ timeout: 2000 });
  });
});
