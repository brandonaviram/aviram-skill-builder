# Changelog

All notable changes to the AVIRAM SKILL FACTORY will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-10-27

### Added
- **Executor Capability Framework**: Implemented conditional capability scoring for EXECUTOR skills
  - AGENTIC subtype: Skills that run in Claude's sandbox → Strong Capability Gain
  - EXTERNAL subtype: Skills requiring external systems → Limited Capability Gain
- **Safety Assessment System**: New validation layer for executor skills
  - Detects unsafe patterns (sudo, rm -rf, eval, production access)
  - Flags semi-safe patterns requiring caution (API keys, credentials, data deletion)
  - Awards bonus points for verified safe operations
- **Enhanced UI with Human-Readable Labels**: Executor skills now display clear, user-friendly badges
  - 🟢 Green "Agentic Skill" badge (Runs safely here. Strong capability gain.)
  - 🟠 Orange "External Skill" badge (Runs elsewhere. Limited capability gain.)
  - Contextual "What is Capability Gain?" explanation card
  - Explanatory descriptions for each skill type

### Changed
- **Terminology Update**: Migrated from "Utility Score" to "Capability Gain" throughout UI and docs
  - More intuitive for non-technical users
  - Clearer distinction between "what helps users" vs "what expands Claude"
  - Human-readable labels: "High Gain", "Strong Gain", "Limited Gain"
- **Categorization Engine**: Updated `categorizeSkill()` function to detect execution context
  - Added `executor_subtype` field to categorization response
  - Enhanced prompt with agentic vs external detection criteria
  - Updated capability ceiling logic based on subtype
- **UI Display Logic**: Complete redesign of `showUtilityResults()` for clarity
  - Human-readable badge labels: "Agentic Skill" and "External Skill"
  - Different color schemes for agentic (green) vs external (orange)
  - Context-aware explanations for each executor type
  - Added "What is Capability Gain?" info card
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
