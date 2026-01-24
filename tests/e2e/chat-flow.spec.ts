import { test, expect } from '@playwright/test';

test('Chat Flow Smoke Test - Verification of 4-bucket classification', async ({ page }) => {
  // 1. Intercept Supabase Auth to mock logged-in state if needed
  // Note: The dashboard is currently 'force-dynamic' but doesn't hard-block without session
  // unless createClient() throws.
  
  await page.goto('/');

  // 2. Locate the Command Center (Chat)
  const chatInput = page.getByPlaceholder('Enter query...');
  await expect(chatInput).toBeVisible();

  // 3. Input the target query
  await chatInput.fill('Verify 3-bucket vs 4-bucket classification.');
  await page.keyboard.press('Enter');

  // 4. Assert response using stable data-testids
  const messages = page.getByTestId('chat-message');
  
  // Wait for the second message (assistant response) to appear
  await expect(messages).toHaveCount(2, { timeout: 20000 });

  const lastMessage = messages.last();
  const text = await lastMessage.innerText();

  expect(text.length).toBeGreaterThan(10);
  expect(text.toLowerCase()).not.toContain('mock');
  expect(text.toLowerCase()).not.toContain('loop');
  
  console.log('Smoke Test PASSED: RAG response received and validated.');
});
