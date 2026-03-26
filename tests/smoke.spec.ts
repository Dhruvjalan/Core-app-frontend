import { test, expect } from '@playwright/test';

test('End-to-End Health Check: Login and Search', async ({ page }) => {
  // 1. Go to the live production site`
  await page.goto('http://13.63.165.243/core-frontend/login');

  // 2. Perform Login
  // Using the ID from your code: id="email"
  await page.fill('#email', 'ed24b047@smail.iitm.ac.in');
  
  // Using the ID from your code: id="login-button"
  await page.click('#login-button');

  // 3. Verify Dashboard Redirection
  await expect(page).toHaveURL(/.*dashboard/);

  // 4. Perform Search on 'e21-students'
  // Select is already defaulted to 'e21-students' in your useState
  // Clicking the button with class .submit-btn
  await page.click('.submit-btn');

  // 5. Verify Results
  // Your code renders results inside a div with class "results-container"
  // and each result in a "result-card"
  const resultCards = page.locator('.result-card');
  
  // Wait for the results to appear (API call takes a moment)
  await expect(resultCards.first()).toBeVisible({ timeout: 10000 });

  // 6. Check for exactly 50 results
  const count = await resultCards.count();
  console.log(`Found ${count} results.`);
  expect(count).toBe(50);
});