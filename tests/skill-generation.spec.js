// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Deep Research Skill Factory - Complete Flow Test
 *
 * Tests the full skill generation pipeline with a creative writing skill.
 *
 * Required environment variables:
 * - ANTHROPIC_API_KEY: Your Anthropic API key
 * - PERPLEXITY_API_KEY: (Optional) Your Perplexity API key for web research
 *
 * Run with:
 *   ANTHROPIC_API_KEY=sk-xxx npx playwright test tests/skill-generation.spec.js --headed
 */

// Test configuration
const CREATIVE_WRITING_PROMPT = `A Claude skill specialized in creative writing with a focus on rhythm and flow.

The skill should help Claude:
- Understand and apply poetic meter (iambic, trochaic, anapestic, dactylic)
- Recognize and create rhythmic prose patterns
- Vary sentence length and structure for musical effect
- Use techniques like alliteration, assonance, and consonance
- Balance long flowing sentences with short punchy ones
- Create natural cadence in dialogue and narration

This skill transforms Claude into a writing partner who understands the music of language, helping writers craft prose that flows naturally and engages readers through the rhythm of words.`;

// Capture and format logs
const capturedLogs = [];
function logStep(stage, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, stage, message, data };
  capturedLogs.push(logEntry);
  console.log(`\n[${timestamp}] [${stage}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

test.describe('Skill Generation Pipeline', () => {
  test.setTimeout(600000); // 10 minutes for full generation

  test('should generate a creative writing skill end-to-end', async ({ page }) => {
    // Get API keys from environment
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const perplexityKey = process.env.PERPLEXITY_API_KEY || '';

    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    logStep('SETUP', 'Starting skill generation test');
    logStep('SETUP', 'API Keys configured', {
      anthropic: anthropicKey ? '✓ Present' : '✗ Missing',
      perplexity: perplexityKey ? '✓ Present' : '○ Optional (not provided)'
    });

    // Listen for console messages from the page
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Stage') || text.includes('Error') || text.includes('Validation')) {
        logStep('BROWSER_CONSOLE', text);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      logStep('PAGE_ERROR', error.message, { stack: error.stack });
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
      logStep('REQUEST_FAILED', `${request.method()} ${request.url()}`, {
        failure: request.failure()?.errorText
      });
    });

    // Track API calls
    page.on('request', request => {
      if (request.url().includes('/api/') || request.url().includes('anthropic')) {
        logStep('API_REQUEST', `${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/') || response.url().includes('anthropic')) {
        logStep('API_RESPONSE', `${response.status()} ${response.url()}`);
      }
    });

    // Step 1: Navigate to app
    logStep('NAVIGATE', 'Opening application');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    logStep('NAVIGATE', 'Page loaded successfully');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/01-initial-load.png', fullPage: true });
    logStep('SCREENSHOT', 'Captured initial page state');

    // Step 2: Enter API keys
    logStep('CONFIG', 'Entering Anthropic API key');
    const apiKeyInput = page.locator('#apiKey');
    await apiKeyInput.fill(anthropicKey);

    // Click save button
    const saveButton = page.locator('button:has-text("Save Key")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      logStep('CONFIG', 'API key saved');
    }

    // Enter Perplexity key if provided
    if (perplexityKey) {
      logStep('CONFIG', 'Entering Perplexity API key');
      const searchKeyInput = page.locator('#searchApiKey');
      if (await searchKeyInput.isVisible()) {
        await searchKeyInput.fill(perplexityKey);
        logStep('CONFIG', 'Perplexity key entered');
      }
    }

    await page.screenshot({ path: 'tests/screenshots/02-api-configured.png', fullPage: true });

    // Step 3: Enter skill prompt
    logStep('INPUT', 'Entering creative writing skill prompt');
    const skillInput = page.locator('#skillInput, textarea[placeholder*="skill"], textarea').first();
    await skillInput.fill(CREATIVE_WRITING_PROMPT);
    logStep('INPUT', 'Prompt entered', { promptLength: CREATIVE_WRITING_PROMPT.length });

    await page.screenshot({ path: 'tests/screenshots/03-prompt-entered.png', fullPage: true });

    // Step 4: Click generate button
    logStep('GENERATE', 'Clicking generate button');
    const generateButton = page.locator('button:has-text("Generate")').first();
    await generateButton.click();
    logStep('GENERATE', 'Generation started');

    // Step 5: Monitor progress through all stages
    const stages = [
      { name: 'Viability', timeout: 30000 },
      { name: 'Input', timeout: 30000 },
      { name: 'Utility', timeout: 60000 },
      { name: 'Research', timeout: 120000 },
      { name: 'Generate', timeout: 120000 },
      { name: 'Validate', timeout: 60000 },
      { name: 'Package', timeout: 30000 }
    ];

    // Wait for and capture each stage
    let lastStageReached = '';
    let stageIndex = 0;

    // Monitor the stepper/progress for stage changes
    const checkProgress = async () => {
      try {
        // Check stepper for current stage
        const activeStep = await page.locator('.step.active, .stepper-item.active, [class*="active"]').textContent().catch(() => '');

        // Check progress bar percentage
        const progressBar = await page.locator('.progress-fill, [class*="progress"]').getAttribute('style').catch(() => '');
        const progressMatch = progressBar?.match(/width:\s*(\d+)/);
        const progressPercent = progressMatch ? progressMatch[1] : '0';

        // Check log container for latest messages
        const logContainer = page.locator('#logContainer, .log-container, [class*="log"]');
        const logText = await logContainer.textContent().catch(() => '');

        // Extract last few log entries
        const logLines = logText.split('\n').filter(l => l.trim()).slice(-5);

        return {
          activeStep: activeStep?.trim(),
          progress: progressPercent,
          recentLogs: logLines
        };
      } catch (e) {
        return { error: e.message };
      }
    };

    // Poll for progress updates
    let lastProgress = '';
    let consecutiveNoChange = 0;
    const maxNoChange = 60; // 60 * 5s = 5 minutes without change = timeout

    for (let i = 0; i < 120; i++) { // Max 10 minutes (120 * 5s)
      await page.waitForTimeout(5000); // Check every 5 seconds

      const progress = await checkProgress();
      const progressKey = JSON.stringify(progress);

      if (progressKey !== lastProgress) {
        logStep('PROGRESS', 'Pipeline update', progress);
        lastProgress = progressKey;
        consecutiveNoChange = 0;

        // Take screenshot at significant changes
        if (progress.activeStep && progress.activeStep !== lastStageReached) {
          lastStageReached = progress.activeStep;
          const screenshotName = `tests/screenshots/stage-${stageIndex++}-${progress.activeStep.toLowerCase().replace(/\s+/g, '-')}.png`;
          await page.screenshot({ path: screenshotName, fullPage: true });
          logStep('SCREENSHOT', `Captured ${progress.activeStep} stage`);
        }
      } else {
        consecutiveNoChange++;
        if (consecutiveNoChange >= maxNoChange) {
          logStep('WARNING', 'No progress change for 5 minutes, possible hang');
          await page.screenshot({ path: 'tests/screenshots/possible-hang.png', fullPage: true });
        }
      }

      // Check for completion indicators
      const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
      if (await downloadButton.isVisible().catch(() => false)) {
        logStep('COMPLETE', 'Download button appeared - generation complete!');
        break;
      }

      // Check for error states
      const errorElement = page.locator('.error, [class*="error"]:visible, .error-message');
      const errorText = await errorElement.textContent().catch(() => '');
      if (errorText && errorText.length > 10) {
        logStep('ERROR', 'Error detected in UI', { errorText });
        await page.screenshot({ path: 'tests/screenshots/error-state.png', fullPage: true });
        break;
      }

      // Check if generation button is re-enabled (might indicate completion or failure)
      const isGenerateEnabled = await generateButton.isEnabled().catch(() => false);
      const buttonText = await generateButton.textContent().catch(() => '');
      if (isGenerateEnabled && i > 5 && !buttonText.toLowerCase().includes('generat')) {
        logStep('STATUS', 'Generate button state changed', { enabled: isGenerateEnabled, text: buttonText });
      }
    }

    // Step 6: Capture final state
    logStep('FINAL', 'Capturing final state');
    await page.screenshot({ path: 'tests/screenshots/final-state.png', fullPage: true });

    // Try to get the generated content
    const resultContent = await page.locator('.file-tree, [class*="result"], .skill-output').textContent().catch(() => '');
    if (resultContent) {
      logStep('RESULT', 'Generated content preview', {
        length: resultContent.length,
        preview: resultContent.substring(0, 500)
      });
    }

    // Get validation results if visible
    const validationResults = await page.locator('[class*="validation"], .validation-results').textContent().catch(() => '');
    if (validationResults) {
      logStep('VALIDATION', 'Validation results', { results: validationResults.substring(0, 1000) });
    }

    // Step 7: Download if available
    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
    if (await downloadButton.isVisible().catch(() => false)) {
      logStep('DOWNLOAD', 'Attempting to download generated skill');

      // Set up download handler
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
        downloadButton.click()
      ]);

      if (download) {
        const fileName = download.suggestedFilename();
        const savePath = `tests/output/${fileName}`;
        await download.saveAs(savePath);
        logStep('DOWNLOAD', 'Skill package downloaded', { fileName, savePath });
      }
    }

    // Final summary
    logStep('SUMMARY', 'Test completed', {
      totalLogs: capturedLogs.length,
      stagesReached: lastStageReached,
      errors: capturedLogs.filter(l => l.stage === 'ERROR' || l.stage === 'PAGE_ERROR').length
    });

    // Write full log to file
    const fs = require('fs');
    fs.mkdirSync('tests/logs', { recursive: true });
    fs.writeFileSync(
      `tests/logs/test-run-${Date.now()}.json`,
      JSON.stringify(capturedLogs, null, 2)
    );
    logStep('LOGS', 'Full logs saved to tests/logs/');
  });
});
