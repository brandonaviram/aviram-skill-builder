# Changelog

All notable changes to the AVIRAM SKILL FACTORY will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-10-27

### Added
- **Executor Utility Ceiling Revision**: Implemented conditional utility scoring for EXECUTOR skills
  - AGENTIC subtype: Skills that run in Claude's sandbox (FFmpeg, Python, file operations) now score up to 6/10
  - EXTERNAL subtype: Skills requiring external systems (Hammerspoon, system daemons) remain capped at 2/10
- **Safety Assessment System**: New validation layer for executor skills
  - Detects unsafe patterns (sudo, rm -rf, eval, production access)
  - Flags semi-safe patterns requiring caution (API keys, credentials, data deletion)
  - Awards bonus points for verified safe operations
- **Enhanced UI Badges**: Executor skills now display subtype-specific badges
  - 🤖 Green badge for AGENTIC executors (real power-up)
  - 🔗 Orange badge for EXTERNAL executors (not a power-up)
  - Explanatory tooltips for each subtype

### Changed
- **Categorization Engine**: Updated `categorizeSkill()` function to detect execution context
  - Added `executor_subtype` field to categorization response
  - Enhanced prompt with agentic vs external detection criteria
  - Updated category ceiling logic to apply 6/10 or 2/10 based on subtype
- **UI Display Logic**: Modified `showUtilityResults()` to handle executor subtypes
  - Different color schemes for agentic (green) vs external (orange)
  - Context-aware explanations for each executor type
- **Validation Pipeline**: Integrated safety assessment into skill validation
  - Runs automatically for all EXECUTOR category skills
  - Blocks unsafe patterns from passing validation
  - Logs warnings for semi-safe patterns

### Technical Details
- Updated `categorizeSkill()` prompt (lines 1596-1751)
  - Added EXECUTOR subtype definitions with examples
  - Included decision criteria and indicator patterns
- Added `assessSkillSafety()` function (lines 3566-3640)
  - Pattern matching for unsafe operations
  - Utility score adjustments based on safety level
- Modified `validateSkillPackage()` (lines 3646-3696)
  - Integrated safety assessment results
  - Added safety failures to validation results
- Enhanced UI badge system (lines 2707-2781)
  - Added EXECUTOR_AGENTIC and EXECUTOR_EXTERNAL configs
  - Dynamic badge selection based on subtype

### Context
This update aligns the AVIRAM SKILL FACTORY with Claude's new agentic execution capabilities introduced in:
- Claude Sonnet 4.5 (Sept 29, 2025): Robust agentic reasoning and computer use
- Claude Haiku 4.5 (Oct 15, 2025): Extended thinking and tool use

Executor skills that leverage Claude's sandbox execution are now properly recognized as capability extensions rather than external automation.

### Migration Notes
- Existing skills are unaffected (backward compatible)
- No breaking changes to the generation pipeline
- Rollback available by reverting executor ceiling to 2/10

## [2.0.0] - Previous Release

### Added
- 6-stage generation pipeline
- Auto-validation loop with 6 fixable rules
- Constraint validation gate
- Skill categorization system
- Glassmorphic UI design
- One-click ZIP packaging

### Features
- Utility analysis with power-up detection
- AI-powered research and generation
- Real-time quality checks
- YAML safety and sanitization
- Single-file architecture
