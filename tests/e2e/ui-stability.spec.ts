import { test, expect } from '@playwright/test';

test('UI Stability and Responsive Sweep', async ({ page }) => {
  await page.goto('/');

  // 1. Verify Branding and Layout
  await expect(page.getByText('hex-rag-dss')).toBeVisible();
  
  // 2. Verify Triage Sidebar (Pinned on Desktop)
  const triageSidebar = page.getByText('Triage Feed');
  await expect(triageSidebar).toBeVisible();

  // 3. Verify Settings Drawer Trigger
  const settingsBtn = page.getByRole('button', { name: /settings/i });
  await expect(settingsBtn).toBeVisible();
  await settingsBtn.click();
  
  const settingsDrawer = page.getByText('Layout & Direction');
  await expect(settingsDrawer).toBeVisible();

  // 4. Verify Theme Switching (Dark Mode)
  const themeToggle = page.getByLabel('toggle theme mode');
  await expect(themeToggle).toBeVisible();
  await themeToggle.click();
  
  // Check if color scheme changed (data-color-scheme on html)
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-color-scheme', 'dark');

  // 5. Verify RTL Support
  const rtlToggle = page.getByLabel('RTL Support (Arabic)');
  await expect(rtlToggle).toBeVisible();
  await rtlToggle.click();
  
  // Verify body direction attribute
  const body = page.locator('div[dir]');
  await expect(body.first()).toHaveAttribute('dir', 'rtl');

  // 6. Close Settings
  await page.keyboard.press('Escape');

  // 7. Test Mobile Responsiveness
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone 13 Pro
  
  // Verify Bottom Navigation is visible on mobile
  const bottomNav = page.locator('nav').filter({ has: page.getByText('Triage') });
  await expect(bottomNav).toBeVisible();

  // Verify Sidebars are collapsed (not visible without trigger)
  await expect(triageSidebar).not.toBeVisible();

  console.log('UI Stability Sweep PASSED: All responsive and theme elements verified.');
});
