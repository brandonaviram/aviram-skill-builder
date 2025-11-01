# 🏭 Deep Research Skill Factory

**Aviram OS** • Cognitive Infrastructure for Claude Code

A beautiful, single-file web application that transforms rough ideas into production-ready Claude Code skills. Uses AI-powered research and generation to create properly formatted skill packages.

## Features

- **6-Stage Pipeline**: Input → Utility Analysis → Research → Generate → **Auto-Validate** → Package
- **AI-Powered Generation**: Uses Claude Sonnet 4 for intelligent skill creation
- **Auto-Validation Loop**: Automatically validates and fixes common issues before output
- **Real-time Quality Checks**: 6 deterministic validation rules ensure production-ready skills
- **One-Click Download**: Generates ready-to-install ZIP packages
- **Glassmorphic UI**: Beautiful Aviram OS design language

## Quick Start

1. **Open the app**:
   ```bash
   open index.html
   ```
   Or serve it locally:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Configure API**:
   - Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
   - Enter it in the API Configuration section
   - Your key is stored in browser memory only (never sent to servers except Anthropic)

3. **Generate Skills**:
   - Describe what you want Claude to know how to do
   - Click "Generate This Skill"
   - Download the ZIP package when complete

4. **Install Skills**:
   ```bash
   # Extract the ZIP to your skills directory
   unzip skill-name.zip -d ~/.claude/skills/

   # Or for project-specific skills:
   unzip skill-name.zip -d .claude/skills/
   ```

## How It Works

### 6-Stage Generation Pipeline

1. **Input Processing**: Extracts requirements, determines complexity, identifies key features
2. **Phase 0 - Capability Gain Analysis & Categorization** (v2.1 updated):
   - Evaluates what new capabilities the skill adds to Claude
   - **Skill Categorization**: Determines skill type and capability gain level
   - **Constraint Validation Gate**: Validates capability claims against skill's own constraints
   - **NEW**: Executor skills differentiated by execution context (agentic vs external)
   - Prevents inflated capability scores for contradictory claims
   - Routes to Research (High Gain), Redesign (Limited Gain), or Rejection (No Gain)
3. **Research**: Conducts focused research on best practices, APIs, and implementation patterns
4. **Generate with Auto-Validation**: Creates YAML metadata and comprehensive documentation, then:
   - **Auto-validates** against 6 quality rules
   - **Safety Assessment** (v2.1): Checks executor skills for unsafe patterns
   - **Auto-fixes** common issues (overpromising descriptions, unclear constraints, missing metadata)
   - **Iterates** up to 3 times until production-ready
   - Logs all validation checks and fixes in real-time
5. **Final Validate**: Ensures YAML compliance, checks quality score, validates structure
6. **Package**: Bundles everything into a properly formatted ZIP with README

### Skill Categories & Capability Gain (v2.1)

The factory categorizes skills to determine their capability gain level:

**What is Capability Gain?** It measures what Claude _itself_ can now do, not how helpful the idea is to you.

- **METHODOLOGY** (High Gain): Reasoning frameworks Claude applies directly
- **KNOWLEDGE** (High Gain): Domain expertise Claude uses in analysis
- **PROCESSOR** (High Gain): Processing/analysis logic Claude executes
- **REFERENCE_CODEGEN** (High Gain): API reference for better code generation
- **🟢 Agentic Skill** (Strong Gain): Runs safely inside Claude's environment (data processing, file operations, etc.)
- **🟠 External Skill** (Limited Gain): Runs on your system (still useful, but doesn't expand Claude's abilities)
- **TEMPLATE** (Limited Gain): Code templates Claude already knows

**v2.1 Update**: Executor skills now differentiated by execution context:
- **Agentic Skills**: Run safely in Claude's environment → adds real executable capability
- **External Skills**: Run on your system → generates useful code, but doesn't expand Claude's own abilities

This aligns with Claude's new agentic execution capabilities (Sonnet 4.5, Haiku 4.5).

### What Gets Generated

Each skill package includes:
- `SKILL.md` - Complete skill documentation with YAML frontmatter
- `README.md` - Installation and usage instructions
- Proper folder structure for immediate installation

### Quality Standards

#### Phase 0: Utility Analysis
- **Constraint Validation Gate**:
  - Extracts constraints from skill description (e.g., "Cannot access live data")
  - Validates power-up claims don't contradict constraints
  - Recalculates utility score when contradictions detected
  - Prevents false HIGH_UTILITY scores for documentation-only skills

#### Phase 4: Auto-Validation Loop (NEW ✨)
Six deterministic rules that automatically validate and fix skills:

1. **Power-up Honesty** ✓ Auto-fixable
   - Validates description matches actual capabilities
   - Detects overpromising ("executable validation", "real-time testing")
   - Auto-rewrites using Claude to match documented limitations

2. **Focused Scope** ✓ Auto-fixable
   - Ensures skill focuses on 1-2 topics, not 5+
   - Analyzes section headings to categorize topics
   - Adds navigation notes for broad skills

3. **Progressive Disclosure** ✓ Auto-fixable
   - Checks main documentation is under 200 lines
   - Adds navigation helpers for comprehensive docs

4. **Constraint Clarity** ✓ Auto-fixable
   - Reframes negative constraints as responsibility boundaries
   - Converts "cannot" → "Claude provides X, You implement Y"
   - Uses Claude to rewrite limitations section

5. **Dependencies Documented** ✓ Auto-fixable
   - Ensures version requirements are listed
   - Adds Requirements section for language-specific skills

6. **Metadata Complete** ✓ Auto-fixable
   - Validates all required fields present
   - Fills missing fields with sensible defaults
   - Ensures constraints field documents limitations

#### Phase 5: Final Validation
- YAML validation (name format, required fields, proper structure)
- Quality scoring (metadata validity, documentation depth, completeness)
- Safe character handling (prevents YAML injection, escapes special chars)
- Naming conventions (lowercase-hyphenated, max 64 chars)
- **Red flag detection** (identifies promises of real-time data, external integrations, etc.)

See [AUTO_VALIDATION_SYSTEM.md](AUTO_VALIDATION_SYSTEM.md) for detailed auto-validation documentation.
See [VALIDATION_FRAMEWORK.md](VALIDATION_FRAMEWORK.md) and [CONSTRAINT_VALIDATION_TESTING.md](CONSTRAINT_VALIDATION_TESTING.md) for validation guidelines.

## Examples

Describe it once, and it becomes a reusable, automated skill.

## Tech Stack

- **Pure HTML/CSS/JS** - No build process, no dependencies (except JSZip CDN)
- **Anthropic API** - Claude Sonnet 4 for intelligent generation
- **JSZip** - Client-side ZIP file creation
- **Glassmorphic Design** - Aviram OS design system

## Security Notes

- API keys stored in browser localStorage (persists across sessions)
- Keys never leave your browser except for direct Anthropic API calls
- No server-side code - everything runs client-side
- No tracking, no analytics, no data collection
- YAML sanitization prevents injection attacks
- User bears all API costs directly

## Architecture

### Single-File Design Philosophy

Everything is in `index.html` for maximum portability:
- Embedded CSS (glassmorphic Aviram OS design system)
- Embedded JavaScript (generation pipeline + UI logic)
- No build step required
- Works offline (except API calls)

### API Integration

```javascript
async function callClaude(prompt, maxTokens = 2000) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }]
    })
  });
}
```

### YAML Safety

```javascript
function sanitizeForYAML(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
```

## Development

This is a static HTML file - no development server needed. Just edit `index.html` and refresh.

### Customization Points

- **Design tokens**: CSS variables in `:root`
- **Generation prompts**: Search for `const prompt =` in JavaScript
- **Quality thresholds**: `validateGeneration()` function
- **Model selection**: Change `claude-sonnet-4-20250514` in `callClaude()`

## Roadmap

- [x] Local storage for API key persistence
- [x] Validation framework with constraint checking
- [x] Auto-validation and self-redesign loop (6 fixable rules)
- [ ] Support for multi-file skills (scripts, templates, references)
- [ ] API key encryption in localStorage
- [ ] Template library for common skill patterns
- [ ] Skill versioning and update system
- [ ] Export to GitHub Gist
- [ ] Batch skill generation
- [ ] Skill testing framework

## License

MIT

## Credits

Built with Claude Code by Brandon Aviram
Part of the Aviram OS ecosystem
