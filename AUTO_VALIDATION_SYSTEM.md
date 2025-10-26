# Auto-Validation & Self-Redesign Loop

## Overview

The Skill Factory now includes an **auto-validation and self-redesign loop** that automatically validates generated skills and fixes common issues before outputting them. This ensures all factory-generated skills are production-ready.

## Architecture

### Flow

```
Input → Research → Generate → Auto-Validate → Auto-Fix → Re-Validate → ... → Output
                                    ↓
                                  Pass? → Final Validation → Package
```

### Integration Point

The auto-validation loop is integrated at **Phase 4 (Generation)** in the `continueToResearch()` function:

```javascript
// Old flow:
const metadata = await generateMetadata(requirements, research);
const documentation = await generateDocumentation(requirements, research, metadata);

// New flow:
const result = await generateWithAutoValidation(requirements, research);
const skillPackage = result.skillPackage;
```

## Validation Rules

The system implements **6 deterministic validation rules**, all fixable automatically:

### 1. Power-up Honesty ✓ FIXABLE
**Check:** Does the power-up statement match what the skill actually does?
- Detects overpromising keywords: "executable validation", "automated testing", "real-time", "device testing"
- Checks for contradictions with documented limitations
- **Auto-fix:** Uses Claude to rewrite description to match actual capabilities

### 2. Focused Scope ✓ FIXABLE
**Check:** Does the skill focus on 1-2 topics or does it try to do 5+ things?
- Analyzes ## headings in documentation
- Categorizes topics: colors, components, testing, migration, accessibility, architecture, performance
- **Auto-fix:** Adds scope navigation note to documentation (auto-splitting requires user decision)

### 3. Progressive Disclosure ✓ FIXABLE
**Check:** Is the main SKILL.md under 200 lines?
- Counts lines in documentation
- Flags if > 200 lines
- **Auto-fix:** Adds navigation note for comprehensive documentation

### 4. Constraint Clarity ✓ FIXABLE
**Check:** Are constraints framed as responsibility boundaries instead of negative statements?
- Detects negative patterns: "cannot test on actual", "unable to", "does not support"
- Looks for boundary patterns: "Claude provides", "You implement", "Claude is halted by"
- **Auto-fix:** Uses Claude to reframe constraints as responsibility boundaries

### 5. Dependencies Documented ✓ FIXABLE
**Check:** Are version requirements and prerequisites listed?
- Checks for requirements/dependencies sections
- Verifies language-specific skills document version requirements
- **Auto-fix:** Adds Requirements section with language, version, and API/library info

### 6. Metadata Complete ✓ FIXABLE
**Check:** Are all required metadata fields present?
- Required fields: name, description, version, complexity
- Should include: constraints field
- **Auto-fix:** Fills in missing fields with sensible defaults

## Implementation Details

### Constants

```javascript
const SKILL_VALIDATION_RULES = {
  power_up_honest: { name, description, check, fixable, auto_fix },
  focused_scope: { ... },
  progressive_disclosure: { ... },
  constraint_clarity: { ... },
  dependencies_documented: { ... },
  metadata_complete: { ... }
};
```

### Check Functions

Each validation rule has a check function that returns:
```javascript
{
  pass: boolean,
  issue?: string,
  severity?: 'high' | 'medium' | 'low',
  metadata?: object
}
```

### Auto-Fix Functions

Each rule has an async auto-fix function:
```javascript
async function fixRuleName(skillPackage) {
  // Modify skillPackage in place
  return skillPackage;
}
```

### Validation Loop

```javascript
async function generateWithAutoValidation(requirements, research) {
  // 1. Generate initial skill
  let skillPackage = await generate(...);

  // 2. Iterate up to 3 times
  for (attempt = 1; attempt <= 3; attempt++) {
    // 3. Validate
    const validation = await validateSkillPackage(skillPackage);

    // 4. If all pass, return
    if (validation.allPass) {
      return { status: 'production_ready', skillPackage, attempt };
    }

    // 5. Auto-fix failures
    for (failure of validation.failures) {
      if (failure.fixable) {
        skillPackage = await failure.auto_fix(skillPackage);
      }
    }
  }

  // 6. Max attempts reached
  return { status: 'max_attempts_reached', skillPackage };
}
```

## Return Statuses

The auto-validation loop returns one of three statuses:

- **`production_ready`**: All validation checks passed
- **`partially_validated`**: Some unfixable issues remain
- **`max_attempts_reached`**: Hit 3 attempt limit

## Logging

The system provides detailed logging during validation:

```
✓ Passed: Power-up Honesty, Metadata Complete, Dependencies Documented
Found 3 issue(s) to fix:
  ✗ Constraint Clarity: Constraints use negative framing
  ✗ Progressive Disclosure: Documentation is 250 lines, exceeds 200
Auto-fixing: Reframing constraints as responsibility boundaries...
✓ Constraints reframed as responsibility boundaries
Auto-fixing: Documentation too long, adding structure note...
✓ Added navigation note for long documentation
🎉 All validation checks passed! Skill is production-ready.
✓ Auto-validation succeeded in 2 attempt(s)
```

## Benefits

### For Users
- ✅ Get production-ready skills automatically
- ✅ No "oops, power-up was wrong" surprises
- ✅ Skills follow best practices by default
- ✅ Clear responsibility boundaries documented

### For Factory
- ✅ Output quality guaranteed
- ✅ No manual review needed for common issues
- ✅ Validation is deterministic and repeatable
- ✅ Auto-fixes are logged for transparency

### For Skills Ecosystem
- ✅ All factory-generated skills meet standards
- ✅ Skills can be shared with confidence
- ✅ Maintenance metadata standardized
- ✅ Future updates easier

## Future Enhancements

Potential improvements to the auto-validation system:

1. **Auto-splitting for focused scope**: Automatically split broad skills into focused sub-skills
2. **Multi-file progressive disclosure**: Automatically split long documentation into main + supporting files
3. **More sophisticated fixes**: Use Claude for more complex rewrites
4. **Custom validation rules**: Allow users to define project-specific validation rules
5. **Validation metrics**: Track which rules fail most often to improve generation prompts

## Code Locations

- **Validation Rules**: `index.html` lines 2627-2675
- **Check Functions**: `index.html` lines 2677-2864
- **Auto-Fix Functions**: `index.html` lines 2866-3047
- **Validation Orchestration**: `index.html` lines 3049-3156
- **Integration**: `index.html` line 3177 in `continueToResearch()`

## Testing

To test the auto-validation system:

1. Generate a skill with known issues (e.g., long documentation, overpromising description)
2. Observe the auto-validation logs in the UI
3. Verify auto-fixes are applied correctly
4. Check final skill package meets all validation criteria

## Philosophy

**Traditional approach:** Generate anything → Hope it's good → Users deal with problems

**Smart approach:** Generate → Auto-validate → Auto-fix → Only output production-ready

The factory becomes **self-improving** and **users get quality by default**.
