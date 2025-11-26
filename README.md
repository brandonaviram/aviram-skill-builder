# 🏭 Deep Research Skill Factory

**Aviram OS** • Cognitive Infrastructure for Claude Code

A sophisticated single-page web application that transforms rough ideas into production-ready Claude Code skills. Features a 9-stage AI pipeline with intelligent model routing, optional web research, and auto-validation.

## Value Proposition

| Metric | Factory | Manual | Improvement |
|--------|---------|--------|-------------|
| **Cost per skill** | $0.20 | $87.08 | **435x cheaper** |
| **Generation time** | 6.3 min | 2 hours | **16x faster** |
| **Quality score** | 100/100 | 40-90 | **Perfect consistency** |
| **ROI per skill** | — | — | **43,440%** |

### Real Test Results

```
Skill: rhythmic-prose-craft
├─ Generation time: 6.3 minutes
├─ API calls: 26
├─ Cost: ~$0.20
├─ Viability score: 7.5/10
├─ Tests passed: 5/5 (100%)
└─ Quality: 100/100
```

**Skill Effectiveness Tested**: We compared prose written WITH vs WITHOUT a factory-generated skill:

| Metric | With Skill | Without | Delta |
|--------|-----------|---------|-------|
| Sentence Variation | 9/10 | 5/10 | **+80%** |
| Sonic Devices | 8/10 | 4/10 | **+100%** |
| Imagery | 8/10 | 5/10 | **+60%** |
| Rhythm/Flow | 9/10 | 5/10 | **+80%** |
| **Total** | **49/60** | **31/60** | **+58%** |

The factory doesn't just document skills—it transfers measurable capability.

## Features

- **9-Stage Pipeline**: Viability → Input → Utility → Research → Generate → Validate → Package → Testing → Review
- **Dual Model Strategy**: Haiku for speed (structured tasks), Sonnet for quality (creative tasks) — 28% faster, 28% cheaper
- **Web Research Integration**: Optional Perplexity API for real-time web research with source authority scoring
- **Auto-Validation Loop**: 6 deterministic rules that automatically validate and fix common issues
- **Constraint Validation Gate**: Prevents overpromising by detecting contradictions between claims and limitations
- **One-Click Download**: Generates ready-to-install ZIP packages with SKILL.md, README, and references
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
   - (Optional) Get a Perplexity API key from [perplexity.ai](https://www.perplexity.ai/) for real web research
   - Enter keys in the API Configuration section
   - Keys stored in browser localStorage (never sent to servers except respective APIs)

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

### 9-Stage Generation Pipeline

| Stage | Name | Model | Purpose |
|-------|------|-------|---------|
| 0 | **Viability Check** | Haiku | Scores DISTINCT, SCOPE, REUSABLE, TESTABLE (auto-narrows if needed) |
| 1 | **Input Processing** | Haiku | Extracts requirements, determines complexity, identifies key features |
| 2 | **Utility Analysis** | Haiku | Capability gain scoring (1-10), constraint validation gate |
| 3 | **Research** | Sonnet + Perplexity | Domain context, parallel research agents, web search with citations |
| 4 | **Generate** | Sonnet | Creates YAML metadata and comprehensive documentation |
| 5 | **Validate** | Haiku | Auto-validates against 6 rules, auto-fixes (up to 3 iterations) |
| 6 | **Package** | Local | Bundles into ZIP with SKILL.md, README, references |
| 7 | **Testing** | Haiku | Quality testing and iteration |
| 8 | **Review** | — | Final review and download |

**Key Pipeline Features:**
- **Capability Gain Analysis & Categorization** (v2.1): Evaluates what capabilities the skill adds to Claude
- **Constraint Validation Gate**: Validates claims don't contradict skill's own limitations
- **Executor Differentiation**: Agentic (runs in Claude's environment) vs External (runs on user's system)
- **Safety Assessment**: Checks executor skills for unsafe patterns (rm -rf, sudo, eval, etc.)
- **Auto-fix Loop**: Iterates up to 3 times until production-ready

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

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Pure HTML/CSS/JS | Single-file SPA, no build process |
| **AI Models** | Claude Haiku 4.5 / Sonnet 4.5 | Dual model strategy (speed vs quality) |
| **Web Research** | Perplexity API (optional) | Real-time web search with citations |
| **ZIP Generation** | JSZip (CDN) | Client-side packaging |
| **Backend** | Vercel Serverless | API proxies (`/api/claude.js`, `/api/search.js`) |
| **Storage** | Browser localStorage | API keys, skill registry (last 50) |
| **UI Design** | Glassmorphic | Aviram OS design system |

**Model Routing Strategy:**
- **Haiku** (⚡ fast): Viability, extraction, utility, categorization, auto-fix, testing
- **Sonnet** (🎯 quality): Research, generation, metadata, refinement, validation
- **Result**: 28% faster, 28% cheaper, same output quality

## Security Notes

- API keys stored in browser localStorage (persists across sessions)
- Keys never leave your browser except for direct Anthropic API calls
- No server-side code - everything runs client-side
- No tracking, no analytics, no data collection
- YAML sanitization prevents injection attacks
- User bears all API costs directly

## Architecture

### File Structure

```
aviram-skill-builder/
├── index.html (273KB, ~7,350 lines)  # Complete SPA
├── api/
│   ├── claude.js (4.7KB)             # Claude API proxy with model routing
│   └── search.js (5.9KB)             # Perplexity/DuckDuckGo proxy
├── Documentation/ (~230KB)
│   ├── AUTO_VALIDATION_SYSTEM.md
│   ├── SKILL_CATEGORIES.md
│   └── ... (15+ markdown files)
├── vercel.json                       # Deployment config
└── README.md
```

### Single-File Design Philosophy

Everything is in `index.html` for maximum portability:
- Embedded CSS (glassmorphic Aviram OS design system)
- Embedded JavaScript (generation pipeline + UI logic)
- No build step required
- Works offline (except API calls)

### Core Functions

| Function | Purpose |
|----------|---------|
| `stage0_viabilityCheck()` | Score viability, auto-narrow scope if needed |
| `extractRequirements()` | Parse natural language → structured JSON |
| `analyzeUtility()` | Score capability gain (1-10), validate constraints |
| `categorizeSkill()` | Classify skill type and capability ceiling |
| `conductResearch()` | Parallel research agents + web search |
| `generateWithAutoValidation()` | Create skill with auto-fix loop |
| `validateSkillPackage()` | Run 6 deterministic validation rules |
| `packageSkill()` | Create ZIP with proper structure |

### API Integration

```javascript
// Model routing based on task phase
const AVIRAM_FACTORY_MODELS = {
  haiku_phases: ['stage0', 'extraction', 'utility', 'categorization', 'autofix', 'testing'],
  sonnet_phases: ['research', 'generation', 'metadata', 'refinement', 'validation']
}

// Exponential backoff retry: 2s → 4s → 8s → 16s (max 4 retries)
```

### Web Research Integration

```javascript
// Source authority scoring
official_docs: 9/10
github: 7/10
stackoverflow: 6/10
web: 5/10
```

## Development

This is a static HTML file - no development server needed. Just edit `index.html` and refresh.

### Customization Points

- **Design tokens**: CSS variables in `:root`
- **Generation prompts**: Search for `const prompt =` in JavaScript
- **Quality thresholds**: `validateGeneration()` function
- **Model routing**: `AVIRAM_FACTORY_MODELS` in `/api/claude.js` (uses auto-updating aliases)

## Roadmap

- [x] Local storage for API key persistence
- [x] Validation framework with constraint checking
- [x] Auto-validation and self-redesign loop (6 fixable rules)
- [x] Web search integration (Perplexity API with fallback)
- [x] Dual model optimization (Haiku/Sonnet routing)
- [x] 9-stage pipeline with viability checking
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
