// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const CONTEXT_AWARE_WRITING_PROMPT = `A Claude skill for context-aware writing enhancement that automatically detects the type of content and applies appropriate stylistic improvements.

The skill should:
- **Auto-detect writing context**: Recognize whether input is prose/fiction, email, tweet/social post, technical documentation, marketing copy, academic writing, or conversational chat
- **Apply context-appropriate enhancements**:
  - Prose/Fiction: Rhythm, meter, imagery, sentence variation, sonic devices
  - Email: Clarity, tone matching (formal/casual), actionable structure, appropriate greeting/closing
  - Tweet/Social: Punch, hook, character efficiency, hashtag suggestions, engagement optimization
  - Technical docs: Precision, scannability, code example formatting, logical flow
  - Marketing copy: Persuasion triggers, benefit-focused language, calls to action
  - Academic: Citation awareness, hedging language, argument structure
  - Chat/Conversational: Natural flow, appropriate informality, emoji guidance

- **Provide enhancement rationale**: Explain why specific changes improve the text for its detected context
- **Offer context override**: Allow user to specify "treat this as [context type]" to force a different lens
- **Score before/after**: Rate the text on context-appropriate metrics

This skill makes Claude a universal writing partner that adapts to whatever you're working on.`;

test.describe('Context-Aware Writing Skill', () => {
  test.setTimeout(720000);

  test('generate context-aware writing skill', async ({ page }) => {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const perplexityKey = process.env.PERPLEXITY_API_KEY || '';

    if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY required');

    console.log('\n=== GENERATING CONTEXT-AWARE WRITING SKILL ===\n');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('[OK] Page loaded');

    await page.locator('#apiKey').fill(anthropicKey);
    if (perplexityKey) {
      const searchInput = page.locator('#searchApiKey');
      if (await searchInput.isVisible()) await searchInput.fill(perplexityKey);
    }
    console.log('[OK] API keys entered');

    const textarea = page.locator('#skillInput, textarea').first();
    await textarea.fill(CONTEXT_AWARE_WRITING_PROMPT);
    console.log('[OK] Prompt entered');

    const downloadPromise = page.waitForEvent('download', { timeout: 600000 });

    await page.locator('button:has-text("Generate")').first().click();
    console.log('[OK] Generation started...\n');

    let lastLog = '';
    const progressInterval = setInterval(async () => {
      try {
        const logText = await page.locator('#logContainer, .log-container').textContent().catch(() => '');
        const lines = logText.split('\n').filter(l => l.trim());
        const last = lines[lines.length - 1] || '';
        if (last !== lastLog && last.length > 0) {
          console.log(`[PROGRESS] ${last.substring(0, 120)}`);
          lastLog = last;
        }
      } catch (e) {}
    }, 3000);

    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
    await downloadButton.waitFor({ state: 'visible', timeout: 600000 });
    clearInterval(progressInterval);
    console.log('\n[OK] Generation complete - downloading...');

    await downloadButton.click();
    const download = await downloadPromise;

    const outputDir = path.join(__dirname, 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    const fileName = download.suggestedFilename();
    const savePath = path.join(outputDir, fileName);
    await download.saveAs(savePath);

    console.log(`[OK] Downloaded: ${fileName}`);

    const AdmZip = require('adm-zip');
    const zip = new AdmZip(savePath);
    const entries = zip.getEntries();

    console.log('\n=== PACKAGE CONTENTS ===\n');
    entries.forEach(entry => {
      console.log(`  ${entry.entryName} (${entry.header.size} bytes)`);
    });

    const skillEntry = entries.find(e => e.entryName.endsWith('SKILL.md'));
    if (skillEntry) {
      const skillContent = skillEntry.getData().toString('utf8');
      fs.writeFileSync(path.join(outputDir, 'context-aware-SKILL.md'), skillContent);
      console.log(`\n[OK] Extracted SKILL.md (${skillContent.length} chars)`);
    }

    const metaEntry = entries.find(e => e.entryName.endsWith('metadata.json'));
    if (metaEntry) {
      const metaContent = metaEntry.getData().toString('utf8');
      fs.writeFileSync(path.join(outputDir, 'context-aware-metadata.json'), metaContent);
      const meta = JSON.parse(metaContent);
      console.log(`[OK] Viability: ${meta.viability_score}, Tests: ${meta.tests_passed}/${meta.tests_total}`);
    }

    console.log('\n=== COMPLETE ===\n');
  });
});
