import { test, expect } from '@playwright/test';

/**
 * ==============================================================================
 * AI Player Test Agent
 * ==============================================================================
 *
 * This Playwright test simulates an "AI player" that interacts with the
 * Trivia Tiles puzzle. It's designed for end-to-end testing and to
 * stress-test the puzzle mechanics and API endpoints.
 *
 * How it works:
 * 1.  Navigates to the application's home page.
 * 2.  Waits for the main puzzle container to be visible.
 * 3.  Extracts the available letters from the TileWheel component.
 * 4.  Generates all possible 3-letter combinations from the available letters.
 * 5.  Submits each combination to the WordInput component.
 * 6.  Attempts to solve the final trivia question.
 * 7.  Submits a score to the leaderboard.
 *
 * This agent provides a baseline for automated testing and can be expanded
 * with more sophisticated word-generation logic (e.g., using a dictionary)
 * and more complex interaction patterns.
 *
 * ==============================================================================
 */

test('AI player solves a puzzle and submits a score', async ({ page }) => {
  // 1. Navigate to the application
  await page.goto('http://localhost:3000/');

  // 2. Wait for the main puzzle to load
  const puzzleContainer = page.locator('#puzzle-container');
  await expect(puzzleContainer).toBeVisible({ timeout: 10000 });

  // 3. Extract letters from the TileWheel
  const letters = await page.locator('.tile').allInnerTexts();
  const availableChars = letters.join('').split('');

  // 4. Generate and submit all 3-letter words
  console.log('AI Player: Starting word submission...');
  const wordInput = page.locator('input[type="text"]');
  const submitButton = page.locator('button[type="submit"]');

  for (let i = 0; i < availableChars.length; i++) {
    for (let j = 0; j < availableChars.length; j++) {
      for (let k = 0; k < availableChars.length; k++) {
        // Simple permutation - allows for repeated letters
        const word = availableChars[i] + availableChars[j] + availableChars[k];
        
        await wordInput.fill(word);
        await submitButton.click();

        // Small delay to simulate user behavior and not overload the API
        await page.waitForTimeout(100); 
      }
    }
  }
  console.log('AI Player: Finished word submission.');

  // 5. Attempt to solve the final trivia
  console.log('AI Player: Attempting to solve final trivia...');
  const triviaInput = page.locator('#final-trivia-input');
  
  // Wait for the trivia input to appear after solving the puzzle
  await expect(triviaInput).toBeVisible({ timeout: 15000 });
  await triviaInput.fill('A clever answer');
  
  const triviaSubmitButton = page.locator('#final-trivia-submit');
  await triviaSubmitButton.click();
  
  // 6. Submit a score to the leaderboard
  // This part assumes a "Submit Score" button appears after solving the trivia
  console.log('AI Player: Submitting score...');
  const scoreNameInput = page.locator('input[placeholder="Your Name"]');
  await expect(scoreNameInput).toBeVisible({ timeout: 10000 });
  
  await scoreNameInput.fill('AI Player');
  const submitScoreButton = page.locator('button:has-text("Submit Score")');
  await submitScoreButton.click();

  // 7. Verify submission was successful
  const successMessage = page.locator('text=/Score submitted successfully/i');
  await expect(successMessage).toBeVisible();

  console.log('AI Player: Test completed successfully.');
}); 