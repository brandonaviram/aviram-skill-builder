# Skill Categories Guide

**AVIRAM SKILL FACTORY v2.1**

This document explains how the factory categorizes skills and determines their maximum utility scores.

---

## Overview

The categorization system ensures that only genuine capability extensions score HIGH_UTILITY (7-10). Skills are categorized during Phase 0 before utility analysis, and each category has a maximum utility ceiling.

---

## Category Definitions

### 1. METHODOLOGY (max 9/10)
**Real Power-up: ✓**

Reasoning frameworks that Claude can apply directly to analyze and solve problems.

**What Claude Gets:**
- New ways of thinking about problems
- Systematic approaches to analysis
- Structured reasoning processes

**Examples:**
- Contradiction detection framework
- Research methodology
- Verification frameworks
- Decision-making processes
- Problem decomposition strategies

**Indicators:**
- "methodology", "framework for thinking"
- "systematic approach", "process"
- "reasoning pattern", "analysis method"

**Key Test:** Can Claude apply this reasoning framework during a conversation? If YES → METHODOLOGY

---

### 2. KNOWLEDGE (max 9/10)
**Real Power-up: ✓**

Domain knowledge that Claude can use in reasoning and analysis.

**What Claude Gets:**
- New domain expertise
- Embedded facts and principles
- Non-obvious patterns and rules

**Examples:**
- Constraint patterns for a specific framework
- Best practices for a domain
- Optimization algorithms
- Domain-specific heuristics
- Edge case knowledge

**Indicators:**
- "patterns", "rules", "algorithms"
- "best practices", "knowledge base"
- "principles", "heuristics"

**Key Test:** Does this provide knowledge Claude doesn't have in training data? If YES → KNOWLEDGE

---

### 3. PROCESSOR (max 9/10)
**Real Power-up: ✓**

Processing and analysis logic that Claude can execute to analyze information.

**What Claude Gets:**
- New capability to analyze/process
- Executable analysis logic
- Information processing workflows

**Examples:**
- Query analyzer
- Contradiction detector
- Web researcher
- Fact checker
- Data analyzer
- Content validator

**Indicators:**
- "analyzer", "detector", "researcher"
- "checker", "processor", "validator"
- "parser", "transformer"

**Key Test:** Can Claude execute this analysis process? If YES → PROCESSOR

**Important:** Web research and fact-checking ARE processor skills (Claude has web search capability)

---

### 4. REFERENCE_CODEGEN (max 9/10)
**Real Power-up: ✓**

Documentation and API reference for external tools that Claude uses to generate better code.

**What Claude Gets:**
- Knowledge to produce correct code for external systems
- API documentation for code generation
- Patterns for tool-specific code

**Examples:**
- Hammerspoon API documentation
- Docker patterns and best practices
- Terraform templates
- Arduino reference
- GitHub Actions workflow patterns

**Indicators:**
- "API reference", "documentation"
- "patterns", "automation framework"
- "scripting guide", "configuration reference"

**Key Distinction:** Claude CANNOT execute these tools, but CAN generate correct code/configs for them

**Use Case:** User asks Claude to generate code → User executes in external environment

**Key Test:** Is this documentation to help Claude generate better code? If YES → REFERENCE_CODEGEN

---

### 5. EXECUTOR - AGENTIC (max 6/10) **[v2.1 NEW]**
**Real Power-up: ✓**

Executable capabilities that Claude can run safely in its sandbox environment.

**What Claude Gets:**
- New executable capability
- Ability to run tools/scripts in sandbox
- Direct execution of processing tasks

**Examples:**
- FFmpeg video processor
- Python data pipeline
- Image processing with ImageMagick
- File format converter
- Batch file operations
- Data transformation scripts

**Indicators:**
- "bash commands", "python script"
- "file operations", "data processing"
- "ffmpeg", "imagemagick"
- "tool orchestration", "sandbox"

**Requirements:**
- Can run entirely in Claude's sandbox
- No external systems/services needed
- No privileged operations (sudo, system daemons)
- Bounded execution (no infinite loops)

**Safety Checks:**
- ✓ No dangerous file operations (rm -rf /)
- ✓ No privileged access (sudo)
- ✓ No code injection risks (eval, exec)
- ✓ No production system access

**Key Test:**
- Can run in Claude's sandbox? ✓
- Requires no external dependencies? ✓
- No privileged operations? ✓
- **If all YES → EXECUTOR (agentic, 6/10)**

---

### 6. EXECUTOR - EXTERNAL (max 2/10)
**Real Power-up: ✗**

Automation that requires external systems or privileged access that Claude cannot control.

**What Claude Gets:**
- Nothing (requires live external systems)
- Security/safety concerns prevent execution

**Examples:**
- Hammerspoon automation (requires macOS daemon)
- Live CI/CD pipeline runner
- Production cloud deployer
- System daemon controller
- Live database migrator

**Indicators:**
- "system daemon", "hardware control"
- "live database", "production deployment"
- "external service", "privileged access"
- "hammerspoon", "autohotkey", "systemd", "cron"

**Key Test:** Requires external systems, privileged access, or live services? If YES → EXECUTOR (external, 2/10)

**Why Low Score:** Claude cannot execute this capability. These should typically be redesigned as PROCESSOR or REFERENCE_CODEGEN skills.

---

### 7. TEMPLATE (max 3/10)
**Real Power-up: ✗**

Code templates and examples that Claude can already generate from training data.

**What Claude Gets:**
- Nothing (already knows these patterns)

**Examples:**
- Boilerplate generator
- Scaffolding templates
- Starter code
- Code snippet library
- Example collections

**Indicators:**
- "templates", "examples", "boilerplate"
- "scaffolding", "starter", "snippet"

**Key Test:** Can Claude USE this itself? If NO (just static code examples) → TEMPLATE

---

## Category Decision Tree

```
Is this code templates/examples?
├─ YES → TEMPLATE (3/10)
└─ NO → Continue

Is this a reasoning framework?
├─ YES → METHODOLOGY (9/10)
└─ NO → Continue

Is this domain knowledge?
├─ YES → KNOWLEDGE (9/10)
└─ NO → Continue

Is this processing/analysis logic?
├─ YES → PROCESSOR (9/10)
└─ NO → Continue

Is this API documentation for code generation?
├─ YES → REFERENCE_CODEGEN (9/10)
└─ NO → Continue

Does this involve code execution?
├─ YES → Is it executable in Claude's sandbox?
│   ├─ YES → EXECUTOR - AGENTIC (6/10)
│   └─ NO → EXECUTOR - EXTERNAL (2/10)
└─ NO → Unclear (ask for clarification)
```

---

## Executor Subtype Examples (v2.1)

### AGENTIC Examples (6/10 max)

✅ **FFmpeg Video Processor**
- Runs: `ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4`
- Sandbox: ✓ (ffmpeg available)
- External: ✗ (no external services)
- Score: Up to 6/10

✅ **Python Data Pipeline**
- Runs: Python scripts for data transformation
- Sandbox: ✓ (python available)
- External: ✗ (processes local data)
- Score: Up to 6/10

✅ **Image Batch Processor**
- Runs: ImageMagick commands
- Sandbox: ✓ (convert available)
- External: ✗ (local files only)
- Score: Up to 6/10

### EXTERNAL Examples (2/10 max)

❌ **Hammerspoon Automation**
- Runs: Hammerspoon Lua scripts
- Sandbox: ✗ (requires macOS daemon)
- External: ✓ (system-level automation)
- Score: Max 2/10
- **Better alternative:** REFERENCE_CODEGEN skill with Hammerspoon API docs (9/10 max)

❌ **Live Database Migrator**
- Runs: Database migration scripts
- Sandbox: ✗ (requires database connection)
- External: ✓ (live database)
- Score: Max 2/10
- **Better alternative:** PROCESSOR skill that generates migration scripts (9/10 max)

❌ **Production Deploy Runner**
- Runs: Deployment scripts
- Sandbox: ✗ (requires cloud access)
- External: ✓ (production systems)
- Score: Max 2/10
- **Better alternative:** REFERENCE_CODEGEN skill with deployment patterns (9/10 max)

---

## Safety Assessment (v2.1)

For EXECUTOR - AGENTIC skills, the factory runs additional safety checks:

### Unsafe Patterns (Auto-reject)
- `rm -rf /` (dangerous file deletion)
- `sudo` (privileged operations)
- `eval()` (code injection risk)
- `exec()` (arbitrary code execution)
- Production system access
- Bypass flags (`--force`, `--no-verify`)

### Semi-Safe Patterns (Warning)
- API key handling
- Password/credential management
- Data deletion (`DELETE FROM`, `DROP TABLE`)
- Shell command substitution

### Safe Operations (Bonus)
- FFmpeg processing
- Python scripts
- ImageMagick operations
- jq/awk/sed processing

---

## Common Misclassifications

### Web Research → PROCESSOR (not TEMPLATE)
❌ WRONG: "This is just documentation about web research"
✅ CORRECT: "Claude has web search capability and can execute this"

### Docker Patterns → REFERENCE_CODEGEN (not EXECUTOR)
❌ WRONG: "Docker is external, so EXECUTOR external"
✅ CORRECT: "This helps Claude generate better Docker configs, so REFERENCE_CODEGEN"

### FFmpeg Skill → EXECUTOR AGENTIC (not EXTERNAL)
❌ WRONG: "FFmpeg is external tool, so EXECUTOR external"
✅ CORRECT: "FFmpeg runs in Claude's sandbox, so EXECUTOR agentic"

### Hammerspoon Docs → REFERENCE_CODEGEN (not EXECUTOR)
❌ WRONG: "Hammerspoon automation, so EXECUTOR"
✅ CORRECT: "API docs to help generate Hammerspoon code, so REFERENCE_CODEGEN"

---

## Version History

### v2.1 (October 2025)
- Added EXECUTOR subtype distinction (agentic vs external)
- Raised agentic executor ceiling from 2/10 to 6/10
- Added safety assessment system
- Enhanced UI with subtype badges

### v2.0 (Previous)
- Initial categorization system
- EXECUTOR capped at 2/10 (all types)
- 6 skill categories

---

## References

- [README.md](README.md) - Main documentation
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [PHASE_0_CATEGORIZATION_IMPLEMENTATION.md](PHASE_0_CATEGORIZATION_IMPLEMENTATION.md) - Implementation details
- [PHASE_0_CATEGORIZATION_TESTING.md](PHASE_0_CATEGORIZATION_TESTING.md) - Test cases
