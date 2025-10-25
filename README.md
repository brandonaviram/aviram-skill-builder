# 🏭 Deep Research Skill Factory

**Aviram OS** • Cognitive Infrastructure for Claude Code

A beautiful, single-file web application that transforms rough ideas into production-ready Claude Code skills. Uses AI-powered research and generation to create properly formatted skill packages.

## Features

- **5-Stage Pipeline**: Input → Research → Generate → Validate → Package
- **AI-Powered Generation**: Uses Claude Sonnet 4 for intelligent skill creation
- **Real-time Validation**: Ensures YAML compliance and quality standards
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

### 5-Stage Generation Pipeline

1. **Input Processing**: Extracts requirements, determines complexity, identifies key features
2. **Research**: Conducts focused research on best practices, APIs, and implementation patterns
3. **Generate**: Creates YAML metadata and comprehensive documentation
4. **Validate**: Ensures YAML compliance, checks quality score, validates structure
5. **Package**: Bundles everything into a properly formatted ZIP with README

### What Gets Generated

Each skill package includes:
- `SKILL.md` - Complete skill documentation with YAML frontmatter
- `README.md` - Installation and usage instructions
- Proper folder structure for immediate installation

### Quality Standards

- YAML validation (name format, required fields, proper structure)
- Quality scoring (metadata validity, documentation depth, completeness)
- Safe character handling (prevents YAML injection, escapes special chars)
- Naming conventions (lowercase-hyphenated, max 64 chars)
- **Constraint validation** (reality checks to prevent overselling Claude's capabilities)
- **Red flag detection** (identifies promises of real-time data, external integrations, etc.)

See [VALIDATION_FRAMEWORK.md](VALIDATION_FRAMEWORK.md) for detailed validation guidelines.

## Examples

**Try these prompts**:

```
Parse PDF tables into clean JSON, handle malformed data gracefully
```

```
Build type-safe React forms with accessible error states
```

```
Create REST API clients with token refresh, exponential backoff, request deduplication
```

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
