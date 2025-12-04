// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Streamlined test that generates a skill and captures the download
 */

const CREATIVE_WRITING_PROMPT = `A Claude skill specialized in creative writing with a focus on rhythm and flow.

The skill should help Claude:
- Understand and apply poetic meter (iambic, trochaic, anapestic, dactylic)
- Recognize and create rhythmic prose patterns
- Vary sentence length and structure for musical effect
- Use techniques like alliteration, assonance, and consonance
- Balance long flowing sentences with short punchy ones
- Create natural cadence in dialogue and narration

This skill transforms Claude into a writing partner who understands the music of language.`;

test.describe('Download Skill Test', () => {
  test.setTimeout(720000); // 12 minutes max

  test('generate and download creative writing skill', async ({ page }) => {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const perplexityKey = process.env.PERPLEXITY_API_KEY || '';

    if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY required');

    console.log('\n=== STARTING SKILL GENERATION ===\n');

    // Navigate
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('[OK] Page loaded');

    // Enter API keys
    await page.locator('#apiKey').fill(anthropicKey);
    if (perplexityKey) {
      const searchInput = page.locator('#searchApiKey');
      if (await searchInput.isVisible()) await searchInput.fill(perplexityKey);
    }
    console.log('[OK] API keys entered');

    // Enter prompt
    const textarea = page.locator('#skillInput, textarea').first();
    await textarea.fill(CREATIVE_WRITING_PROMPT);
    console.log('[OK] Prompt entered');

    // Setup download handler BEFORE clicking generate
    const downloadPromise = page.waitForEvent('download', { timeout: 600000 });

    // Click generate
    await page.locator('button:has-text("Generate")').first().click();
    console.log('[OK] Generation started - waiting for completion...\n');

    // Monitor progress
    let lastLog = '';
    const progressInterval = setInterval(async () => {
      try {
        const logText = await page.locator('#logContainer, .log-container').textContent().catch(() => '');
        const lines = logText.split('\n').filter(l => l.trim());
        const last = lines[lines.length - 1] || '';
        if (last !== lastLog && last.length > 0) {
          console.log(`[PROGRESS] ${last.substring(0, 100)}`);
          lastLog = last;
        }
      } catch (e) {}
    }, 3000);

    // Wait for download button
    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
    await downloadButton.waitFor({ state: 'visible', timeout: 600000 });
    clearInterval(progressInterval);
    console.log('\n[OK] Generation complete - downloading...');

    // Click download and capture
    await downloadButton.click();
    const download = await downloadPromise;

    // Save the file
    const outputDir = path.join(__dirname, 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    const fileName = download.suggestedFilename();
    const savePath = path.join(outputDir, fileName);
    await download.saveAs(savePath);

    console.log(`[OK] Downloaded: ${fileName}`);
    console.log(`[OK] Saved to: ${savePath}`);

    // Extract and analyze
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(savePath);
    const entries = zip.getEntries();

    console.log('\n=== PACKAGE CONTENTS ===\n');
    entries.forEach(entry => {
      console.log(`  ${entry.entryName} (${entry.header.size} bytes)`);
    });

    // Extract SKILL.md for analysis
    const skillEntry = entries.find(e => e.entryName.endsWith('SKILL.md'));
    if (skillEntry) {
      const skillContent = skillEntry.getData().toString('utf8');
      const skillPath = path.join(outputDir, 'SKILL.md');
      fs.writeFileSync(skillPath, skillContent);
      console.log(`\n[OK] Extracted SKILL.md to ${skillPath}`);
      console.log(`[OK] SKILL.md size: ${skillContent.length} characters`);
    }

    // Extract metadata for analysis
    const metaEntry = entries.find(e => e.entryName.endsWith('metadata.json'));
    if (metaEntry) {
      const metaContent = metaEntry.getData().toString('utf8');
      const metaPath = path.join(outputDir, 'metadata.json');
      fs.writeFileSync(metaPath, metaContent);
      console.log(`[OK] Extracted metadata.json`);
    }

    console.log('\n=== TEST COMPLETE ===\n');
  });
});
