# Deep Research Skill Factory - Claude Code Context

> Project-specific context for Claude Code sessions

## Project Overview

**Deep Research Skill Factory** transforms rough ideas into production-ready Claude Code skills through a 9-stage AI pipeline with intelligent model routing, optional web research, and auto-validation.

**Key Stats:**
- Single-page application: `index.html` (~7,350 lines, 273KB)
- Serverless API: `/api/claude.js`, `/api/search.js`
- Zero server-side storage (user-controlled, privacy-first)

## Architecture Decisions

### Single-File Design
Everything is in `index.html` for maximum portability. No build process, no dependencies (except JSZip CDN).

### Dual Model Strategy
- **Haiku** (fast): Viability, extraction, utility, categorization, auto-fix, testing
- **Sonnet** (quality): Research, generation, metadata, refinement, validation
- Result: 28% faster, 28% cheaper, same output quality

### Pipeline Architecture
9 stages with clear separation of concerns:
1. Viability Check → 2. Input Processing → 3. Utility Analysis → 4. Research → 5. Generate → 6. Validate → 7. Package → 8. Testing → 9. Review

### Constraint Validation Gate
Prevents overpromising by detecting contradictions between claims and limitations. Extracts constraints from skill description and validates power-up claims against them.

## File Structure

```
aviram-skill-builder/
├── index.html                    # Complete SPA (UI + CSS + JS)
├── api/
│   ├── claude.js                 # Claude API proxy with model routing
│   └── search.js                 # Perplexity/DuckDuckGo proxy
├── Documentation/                # Design docs and testing notes
├── vercel.json                   # Deployment config
├── README.md                     # User documentation
└── CLAUDE.md                     # This file
```

## Key Functions (index.html)

| Function | Line ~Range | Purpose |
|----------|-------------|---------|
| `init()` | ~150 | App initialization |
| `stage0_viabilityCheck()` | ~800 | Score viability (DISTINCT, SCOPE, REUSABLE, TESTABLE) |
| `extractRequirements()` | ~1100 | Parse natural language → structured JSON |
| `analyzeUtility()` | ~1400 | Score capability gain (1-10), validate constraints |
| `categorizeSkill()` | ~1800 | Classify skill type and capability ceiling |
| `validateConstraints()` | ~2100 | Constraint validation gate |
| `conductResearch()` | ~2500 | Parallel research agents + web search |
| `performWebResearch()` | ~2800 | Perplexity API integration |
| `generateWithAutoValidation()` | ~3200 | Create skill with auto-fix loop |
| `validateSkillPackage()` | ~3800 | Run 6 deterministic validation rules |
| `packageSkill()` | ~4500 | Create ZIP with proper structure |
| `callClaude()` | ~5000 | API communication with retry logic |

## API Endpoints

### `/api/claude.js`
- Routes to Haiku or Sonnet based on `phase` parameter
- Exponential backoff retry: 2s → 4s → 8s → 16s
- Doesn't retry auth errors (400, 401, 403)

### `/api/search.js`
- Primary: Perplexity API (`pplx-` keys) → `sonar-pro` model
- Fallback: DuckDuckGo (basic)
- Returns: `{ findings, sources, key_points, verified }`

## Validation Rules (6 Auto-Fixable)

1. **Power-up Honesty** - Description matches actual capabilities
2. **Focused Scope** - Covers 1-2 topics, not 5+
3. **Progressive Disclosure** - Main doc ≤200 lines
4. **Constraint Clarity** - Frames limitations positively
5. **Dependencies Documented** - Version requirements listed
6. **Metadata Complete** - All required YAML fields present

## Skill Categories

| Category | Capability Gain | Max Score |
|----------|-----------------|-----------|
| METHODOLOGY | High | 10/10 |
| KNOWLEDGE | High | 10/10 |
| PROCESSOR | High | 10/10 |
| REFERENCE_CODEGEN | High | 10/10 |
| EXECUTOR_AGENTIC | Strong | 9/10 |
| EXECUTOR_EXTERNAL | Limited | 6/10 |
| TEMPLATE | Limited | 6/10 |

## Storage Keys (localStorage)

- `anthropic_api_key` - Anthropic API key
- `search_api_key` - Perplexity API key
- `skill_builder_registry` - Last 50 generated skills

## Common Development Tasks

### Testing Changes
```bash
# Local testing (no build needed)
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Deploying
```bash
# Auto-deploys via Vercel on git push
git push origin main
```

### Modifying Pipeline
1. Find the stage function (e.g., `stage0_viabilityCheck()`)
2. Update the logic
3. Test with various inputs
4. Check that downstream stages still work

### Adding New Validation Rules
1. Add rule to `SKILL_VALIDATION_RULES` object
2. Implement check function
3. Implement auto-fix function (if fixable)
4. Add to validation loop

### Changing Model Routing
Edit `AVIRAM_FACTORY_MODELS` in `/api/claude.js`:
```javascript
const AVIRAM_FACTORY_MODELS = {
  default: 'claude-sonnet-4-5',
  haiku_phases: [...],
  sonnet_phases: [...]
}
```

## Design Philosophy

Aligned with Apple's approach:
- **Simplicity over complexity**: Every feature should make things simpler
- **Quality over quantity**: Better to have 3 transformative improvements than 10 minor tweaks
- **User-first thinking**: Focus on what users need, not what's technically possible

## Important Patterns

### Error Handling
- Exponential backoff for API calls
- Auth errors (400, 401, 403) fail immediately
- User-facing errors displayed in UI
- Validation errors trigger auto-fix loop

### State Management
- Global variables for pipeline state
- localStorage for persistent data
- No framework state management (vanilla JS)

### UI Updates
- Direct DOM manipulation
- Progress bar with shimmer animation
- Collapsible sections for detailed info
- Real-time log display

## Recent Changes

- **Web Search Integration**: Optional Perplexity API for real-time research
- **Dual Model Strategy**: Haiku/Sonnet routing for speed/quality balance
- **9-Stage Pipeline**: Added viability checking and testing stages
- **Constraint Validation Gate**: Prevents contradictory claims

---

**Last Updated:** 2025-11-26
