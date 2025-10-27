# Skill Categories & Capability Gain Guide

**AVIRAM SKILL FACTORY v2.1**

This document explains how the factory categorizes skills and determines their capability gain level.

---

## Overview

**What is Capability Gain?** It measures what _Claude itself_ can now do, not how helpful the idea is to you.

The categorization system ensures that only genuine capability extensions receive high capability gain scores. Skills are categorized during Phase 0, and each category has a defined capability level:
- **High Gain**: Adds new reasoning, knowledge, or analysis capabilities
- **Strong Gain**: Adds executable capabilities within Claude's environment
- **Limited Gain**: Useful for users but doesn't expand Claude's abilities

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

### 5. 🟢 AGENTIC SKILL (Strong Capability Gain) **[v2.1 NEW]**
**Badge:** Green circle • **Label:** "Agentic Skill" • **Gain Level:** Strong

Executable capabilities that run safely inside Claude's environment.

**What Claude Gains:**
- Real executable capability
- Can process data, run scripts, transform files directly
- No longer needs to delegate to external systems

**What This Means:**
Runs safely here. Adds new Claude capability.

**Examples:**
- Data processing and transformation
- File format conversion
- Batch operations on files
- Text analysis and extraction
- Data validation and cleaning

**Indicators:**
- "bash commands", "python script"
- "file operations", "data processing"
- "tool orchestration", "sandbox"

**Requirements:**
- Can run entirely in Claude's environment
- No external systems/services needed
- No privileged operations (sudo, system daemons)
- Bounded execution (no infinite loops)

**Safety Checks:**
- ✓ No dangerous file operations (rm -rf /)
- ✓ No privileged access (sudo)
- ✓ No code injection risks (eval, exec)
- ✓ No production system access

**Key Test:**
- Can run in Claude's environment? ✓
- Requires no external dependencies? ✓
- No privileged operations? ✓
- **If all YES → Agentic Skill (Strong Gain)**

---

### 6. 🟠 EXTERNAL SKILL (Limited Capability Gain)
**Badge:** Orange circle • **Label:** "External Skill" • **Gain Level:** Limited

Code that runs on your system, not in Claude's environment.

**What Claude Gains:**
- Nothing directly (Claude can't execute external systems)
- Improves code generation quality for you

**What This Means:**
Runs on your system. Still useful (generates code you can run), but doesn't expand what Claude itself can do.

**Examples:**
- Desktop automation (requires OS-level tools)
- System administration scripts
- Cloud deployment automation
- Database operations on live systems
- Hardware control

**Indicators:**
- "system daemon", "hardware control"
- "live database", "production deployment"
- "external service", "privileged access"
- "desktop automation", "systemd", "cron"

**Key Test:** Requires external systems, privileged access, or live services? If YES → External Skill (Limited Gain)

**Better Alternatives:** Consider redesigning as:
- **PROCESSOR**: Analysis logic Claude can execute
- **REFERENCE_CODEGEN**: API docs to improve code generation quality

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

## Executor Skill Examples (v2.1)

### 🟢 Agentic Skill Examples (Strong Gain)

✅ **Data Processing Pipeline**
- Runs: Python scripts for data transformation
- Environment: ✓ (runs in Claude)
- External: ✗ (no external services)
- Gain: Strong

✅ **File Format Converter**
- Runs: Batch file operations
- Environment: ✓ (runs in Claude)
- External: ✗ (local files only)
- Gain: Strong

✅ **Text Analysis Tool**
- Runs: Processing and extraction logic
- Environment: ✓ (runs in Claude)
- External: ✗ (no external dependencies)
- Gain: Strong

### 🟠 External Skill Examples (Limited Gain)

⚠️ **Desktop Automation**
- Runs: System-level automation scripts
- Environment: ✗ (requires OS tools)
- External: ✓ (desktop applications)
- Gain: Limited
- **Better alternative:** REFERENCE_CODEGEN skill with automation API docs (High Gain)

⚠️ **Live Database Manager**
- Runs: Database operations on live systems
- Environment: ✗ (requires database connection)
- External: ✓ (live database)
- Gain: Limited
- **Better alternative:** PROCESSOR skill that generates SQL scripts (High Gain)

⚠️ **Cloud Deployment Tool**
- Runs: Deployment to production systems
- Environment: ✗ (requires cloud access)
- External: ✓ (production infrastructure)
- Gain: Limited
- **Better alternative:** REFERENCE_CODEGEN skill with deployment patterns (High Gain)

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
