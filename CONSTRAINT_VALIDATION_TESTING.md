# Constraint Validation Gate - Testing Guide

## Overview
The Constraint Validation Gate prevents Phase 0 from scoring skills highly when their power-up claims contradict their own constraints. This document provides test scenarios to validate the implementation.

## Bug Fix: YAML Constraint Extraction

### The Problem
Initial implementation only searched description text for constraints, missing the primary source: YAML metadata fields.

**Original Bug:**
```
Input: Skill with metadata.constraints: "Cannot access live data"
Result: "✓ No constraints found - analysis valid"
Outcome: FALSE POSITIVE (8/10 score when should be 2/10)
```

### The Fix
Updated `extractConstraints()` to use multi-source extraction:

1. **Primary Source**: Parse YAML frontmatter for `constraints:` field (top-level or nested in metadata)
2. **Secondary Source**: Search description text for constraint keywords
3. **Combine & Deduplicate**: Merge constraints from both sources

**After Fix:**
```
Input: Skill with metadata.constraints: "Cannot access live data"
Result: "✓ Found 1 constraint(s): Cannot access live data"
Outcome: CORRECT (contradictions detected, score adjusted)
```

### Implementation Details
- `extractYAMLConstraints()` - Parses YAML frontmatter using regex
- `extractTextConstraints()` - Searches text for constraint keywords
- `extractConstraints()` - Orchestrates both + deduplication
- Enhanced logging shows constraint sources and detection details

### Bug Fix: "Users Must" False Positives (P1)

**Problem:** The contradiction detector treated "users must" as a blocking pattern, causing false positives.

**Example False Positive:**
```yaml
metadata:
  constraints: "Users must provide their own API key for authentication"

Power-up claim: "provides API integration capabilities"
```
**Wrong Result:** CONTRADICTION ❌ (skill was penalized incorrectly)

**Fix:** Removed "users must" and "requires user" from contradiction blocking patterns. These are *requirements* (skill can do X if user provides Y), not *prohibitions* (skill cannot do X).

**Correct Logic:**
- **Prohibition** (blocks capability): "Cannot access", "No API", "No database"
- **Requirement** (capability exists, needs input): "Users must provide API key", "Requires user to run script"

After fix, only explicit prohibitions trigger contradictions.

## What Was Implemented

### New Functions (Lines 1531-1920)

1. **`extractYAMLConstraints(text)`** - Lines 1531-1575
   - **PRIMARY SOURCE**: Extracts constraints from YAML frontmatter
   - Parses YAML metadata for `constraints:` field (top-level or nested in metadata)
   - Handles both quoted and unquoted constraint strings
   - Returns array of constraint strings from YAML

2. **`extractTextConstraints(description)`** - Lines 1577-1630
   - **SECONDARY SOURCE**: Extracts constraints from description text
   - Looks for keywords: "Cannot", "No access to", "Users must", "Requires user", etc.
   - Cleans markdown formatting
   - Returns array of constraint strings from text

3. **`extractConstraints(description)`** - Lines 1632-1661
   - **MAIN ORCHESTRATOR**: Combines YAML and text constraint extraction
   - Calls extractYAMLConstraints() first (primary source)
   - Calls extractTextConstraints() second (supplementary)
   - Deduplicates constraints across sources
   - Returns complete array of all constraints found

2. **`extractPowerUpClaims(powerUpStatement)`** - Lines 1569-1625
   - Extracts claimed capabilities from power-up statement
   - Looks for markers: "providing", "enables", "performs", "executes", etc.
   - Identifies capability keywords: "web scraping", "real-time", "live data", "api calls", etc.
   - Returns array of claimed capabilities

3. **`validateConstraints(requirements, utilityAnalysis)`** - Lines 1627-1746
   - Main validation function that orchestrates constraint checking
   - Checks if power-up claims contradict skill's constraints
   - Recalculates score if contradictions found
   - Returns validation report with revised analysis

4. **`detectContradiction(claim, constraint)`** - Lines 1748-1799
   - Checks if a specific claim contradicts a constraint
   - Uses contradiction mapping and word-overlap detection
   - Returns true if contradiction detected

5. **`recalculateUtilityScore(originalScore, contradictionCount, validClaimsRatio)`** - Lines 1801-1815
   - Recalculates score based on contradictions
   - Penalty: -2 points per contradiction
   - Additional -4 points if <50% of claims are valid

6. **`categorizeUtilityScore(score)`** - Lines 1817-1824
   - Converts numeric score to category
   - 7-10: HIGH_UTILITY, 4-6: MEDIUM_UTILITY, 0-3: LOW_UTILITY

### Modified Functions

1. **`startGeneration()`** - Lines 2373-2397
   - Added constraint validation call after utility analysis
   - Validates claims against constraints before displaying results
   - Logs validation status and score adjustments
   - Passes validation result to showUtilityResults

2. **`showUtilityResults(analysis, validationResult)`** - Lines 1830-1908
   - Updated to accept optional validationResult parameter
   - Displays constraint validation report when contradictions found
   - Shows original vs revised scores
   - Lists contradicted claims and remaining valid claims

### New HTML Elements

1. **`constraintValidationReport`** - Line 977
   - Container div for displaying validation results
   - Dynamically populated when contradictions detected
   - Hidden when no contradictions

## How It Works

### Phase 0 Flow (New)

```
Extract Requirements (input description)
  ↓
Analyze Utility (generate power-up claims)
  ↓
CONSTRAINT VALIDATION GATE ← NEW
  ├─ Extract constraints from description
  ├─ Extract claims from power-up statement
  ├─ Detect contradictions
  ├─ If contradictions found:
  │   ├─ Remove false claims
  │   ├─ Recalculate utility score
  │   └─ Update phase routing if needed
  └─ Log validation results
  ↓
Show Utility Results (with validation report)
  ↓
Route to Phase 2 or Problem Identifier
```

### Validation Logic

```javascript
For each power-up claim:
  For each constraint:
    If claim contradicts constraint:
      Mark as contradicted
      Record conflict

If contradictions found:
  Calculate penalty = contradictions × 2
  If valid_claims < 50%: penalty += 4
  New score = max(0, original_score - penalty)

  Update analysis with:
    - Revised score
    - Revised category
    - Revised routing
    - Updated power-up statement
```

---

## Test Scenarios

### Test 1: Web Research Analyst (Original Bug - Now Fixed)

**Input (with YAML metadata):**
```yaml
---
name: web-research-analyst
description: "Web research analyst skill"
metadata:
  constraints: "Cannot access live web data or perform real-time scraping. Users must execute API calls independently."
---

Web research analyst skill that provides executable web scraping, automated
data extraction, and real-time research capabilities.
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 8/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: providing executable web scraping, automated data extraction, and real-time research capabilities"

**Constraint Validation (FIXED - Now extracts YAML constraints):**
- **YAML constraints found**: 2
  1. "Cannot access live web data or perform real-time scraping"
  2. "Users must execute API calls independently"
- **Text constraints found**: 0 (no additional text-based constraints)
- **Total constraints**: 2
- Claims checked: 3
  1. "executable web scraping" → CONTRADICTED (by constraint #1)
  2. "automated data extraction" → CONTRADICTED (by constraint #2)
  3. "real-time research capabilities" → CONTRADICTED (by constraint #1)
- Valid claims: 0/3 (0%)

**Revised Analysis:**
- Score: 0/10 (down from 8/10)
  - Penalty: -6 (3 contradictions × 2)
  - Additional: -4 (0% valid claims)
  - Final: max(0, 8 - 10) = 0
- Category: LOW_UTILITY
- Power-up: "⚠️ No valid power-up statement (claims contradicted by constraints)"
- Routing: REJECT → Triggers Problem Identifier

**Expected Logs (After Fix):**
```
[INFO] Running constraint validation...
[INFO] ✓ Found 2 constraint(s):
[INFO]   - "Cannot access live web data or perform real-time scraping"
[INFO]   - "Users must execute API calls independently"
[WARNING] ⚠️ Constraint contradictions detected: 3 claim(s) invalidated
[WARNING]   ✗ Claim: "executable web scraping"
[WARNING]     Conflicts: "Cannot access live web data or perform real-time scr..."
[WARNING]   ✗ Claim: "automated data extraction"
[WARNING]     Conflicts: "Users must execute API calls independently"
[WARNING]   ✗ Claim: "real-time research capabilities"
[WARNING]     Conflicts: "Cannot access live web data or perform real-time scr..."
[WARNING] Score recalculated: 8/10 → 0/10 (-8)
```

**Expected UI:**
```
🛑 CONSTRAINT CONTRADICTIONS DETECTED

Original Score: 8/10
Revised Score: 0/10 ⬇️ -8

Contradicted Claims:
  ✗ "executable web scraping"
    Conflicts with: "Cannot access live web data or perform real-time scraping"

  ✗ "automated data extraction"
    Conflicts with: "Users must execute API calls independently"

  ✗ "real-time research capabilities"
    Conflicts with: "Cannot access live web data or perform real-time scraping"

⚠️ No valid power-up claims remain after constraint validation

Routing: Score dropped significantly - REDESIGN RECOMMENDED
```

**Verification:**
- [x] YAML constraints extracted from metadata.constraints field
- [x] Logs show all constraints found
- [x] Score drops from 8/10 to 0/10
- [x] All 3 claims marked as contradicted
- [x] Power-up statement shows warning
- [x] Routing changes from PROCEED to REJECT
- [x] Problem Identifier Agent runs
- [x] Validation report displays in UI
- [x] Detailed logs show which constraints triggered contradictions

---

### Test 2: API Integration Skill (Users Must Provide Key - Should Pass)

**Input (with user requirement, not prohibition):**
```yaml
---
name: api-integration-helper
description: "API integration helper"
metadata:
  constraints: "Users must provide their own API keys. Requires user to configure authentication."
---

Helps integrate with external APIs by generating request templates and handling
authentication flows.
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 7/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: providing API integration capabilities, generating authentication flows"

**Constraint Validation (After Fix):**
- Constraints found: 2
  1. "Users must provide their own API keys"
  2. "Requires user to configure authentication"
- Claims checked: 2
  1. "API integration capabilities" → VALID (not blocked by "users must provide")
  2. "authentication flows" → VALID (not blocked by "requires user to")
- Valid claims: 2/2 (100%)
- **No contradictions detected** ✅

**Revised Analysis:**
- Score: 7/10 (unchanged)
- Category: HIGH_UTILITY
- Routing: PROCEED

**Expected Logs:**
```
[INFO] Running constraint validation...
[INFO] ✓ Found 2 constraint(s) - all claims validated
[INFO]   - "Users must provide their own API keys"
[INFO]   - "Requires user to configure authentication"
[SUCCESS] ✓ Constraint validation passed: 2 claim(s) verified
```

**Verification:**
- [x] "Users must" not treated as blocking pattern
- [x] "Requires user to" not treated as blocking pattern
- [x] Score remains 7/10 (no false positive penalty)
- [x] Routing stays PROCEED
- [x] No contradiction warnings in logs

**Why This Passes:**
- "Users must provide API keys" = **REQUIREMENT** (skill CAN do API calls, needs user's key)
- "Cannot access APIs" = **PROHIBITION** (skill CANNOT do API calls at all)
- Only prohibitions trigger contradictions

---

### Test 3: React iOS HIG (Should Pass)

**Input:**
```
React iOS Human Interface Guidelines component generator.
Generates production-ready React components following iOS HIG.

Constraints:
- Cannot test on physical devices
- Cannot access iOS runtime APIs
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 8/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: generating iOS HIG-compliant React components with embedded design patterns"

**Constraint Validation:**
- Constraints found: 2
- Claims checked: 1
  1. "generating iOS HIG-compliant React components" → VALID (doesn't require device testing)
- Valid claims: 1/1 (100%)
- No contradictions detected

**Revised Analysis:**
- Score: 8/10 (unchanged)
- Category: HIGH_UTILITY
- Routing: PROCEED

**Expected UI:**
- No validation report shown
- Original score displayed
- Logs show: "✓ Constraint validation passed: 1 claim(s) validated"

**Verification:**
- [ ] Score remains 8/10
- [ ] No contradictions detected
- [ ] No validation report displayed
- [ ] Routing stays PROCEED
- [ ] Logs show validation passed

---

### Test 3: Travel Framework (Partial Contradiction)

**Input:**
```
Travel planning framework with real-time price optimization and itinerary
generation using historical data.

Constraints:
- Cannot access real-time pricing APIs
- Cannot book travel
- Users must check current prices on booking sites
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 7/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: providing real-time price optimization, automated itinerary generation"

**Constraint Validation:**
- Constraints found: 3
- Claims checked: 2
  1. "real-time price optimization" → CONTRADICTED
  2. "automated itinerary generation" → VALID
- Valid claims: 1/2 (50%)

**Revised Analysis:**
- Score: 5/10 (down from 7/10)
  - Penalty: -2 (1 contradiction × 2)
  - No additional penalty (50% valid claims)
  - Final: 7 - 2 = 5
- Category: MEDIUM_UTILITY
- Power-up: "This skill powers up Claude by: automated itinerary generation"
- Routing: REDESIGN (changed from PROCEED)

**Expected UI:**
```
🛑 CONSTRAINT CONTRADICTIONS DETECTED

Original Score: 7/10
Revised Score: 5/10 ⬇️ -2

Contradicted Claims:
  ✗ "real-time price optimization"
    Conflicts with: "Cannot access real-time pricing APIs"

Valid Claims Remaining:
  automated itinerary generation

Routing: Score dropped significantly - REDESIGN RECOMMENDED
```

**Verification:**
- [ ] Score drops from 7/10 to 5/10
- [ ] 1 claim contradicted, 1 valid
- [ ] Routing changes from PROCEED to REDESIGN
- [ ] Problem Identifier Agent runs
- [ ] Valid claims still shown in power-up statement

---

### Test 4: PDF Parser (No Constraints)

**Input:**
```
Parse PDF tables and forms into structured JSON. Handle malformed PDFs,
extract nested tables, preserve formatting context.

(No constraint statements)
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 9/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: providing robust PDF parsing algorithms and edge case handling"

**Constraint Validation:**
- Constraints found: 0
- No validation needed

**Revised Analysis:**
- Score: 9/10 (unchanged)
- Category: HIGH_UTILITY
- Routing: PROCEED

**Expected UI:**
- No validation report shown
- Logs show: "✓ No constraints found - analysis valid"

**Verification:**
- [ ] Score remains 9/10
- [ ] No validation performed
- [ ] Routing stays PROCEED
- [ ] Quick validation (no constraints to check)

---

### Test 5: Database Helper (All Claims Contradicted)

**Input:**
```
Database query helper that provides live database connections, automated
migrations, and real-time data sync.

Constraints:
- Cannot connect to databases
- Cannot execute SQL queries
- Users must run migrations themselves
- No access to database servers
```

**Expected Behavior:**

**Initial Utility Analysis:**
- Score: 7/10 (HIGH_UTILITY)
- Power-up: "This skill powers up Claude by: providing live database connections, automated migrations, real-time data sync"

**Constraint Validation:**
- Constraints found: 4
- Claims checked: 3
  1. "live database connections" → CONTRADICTED
  2. "automated migrations" → CONTRADICTED
  3. "real-time data sync" → CONTRADICTED
- Valid claims: 0/3 (0%)

**Revised Analysis:**
- Score: 0/10 (down from 7/10)
  - Penalty: -6 (3 contradictions × 2)
  - Additional: -4 (0% valid claims)
  - Final: max(0, 7 - 10) = 0
- Category: LOW_UTILITY
- Routing: REJECT

**Verification:**
- [ ] Score drops to 0/10
- [ ] All claims contradicted
- [ ] Routing changes to REJECT
- [ ] Problem Identifier suggests alternatives

---

## Integration Testing

### Workflow Continuity

**Test: HIGH_UTILITY (No Contradictions)**
1. Input: PDF parser skill
2. Utility analysis: 9/10
3. Constraint validation: No constraints
4. Expected: Show "Continue to Research" button
5. User clicks → Proceeds to Research phase

**Test: HIGH_UTILITY → MEDIUM_UTILITY (Contradictions)**
1. Input: Travel framework skill
2. Utility analysis: 7/10
3. Constraint validation: 1 contradiction
4. Revised score: 5/10
5. Expected: Trigger Problem Identifier Agent
6. Display: Redesign suggestions

**Test: MEDIUM_UTILITY → LOW_UTILITY (Many Contradictions)**
1. Input: Database helper skill
2. Utility analysis: 6/10
3. Constraint validation: Multiple contradictions
4. Revised score: 0/10
5. Expected: Trigger Problem Identifier Agent
6. Display: Alternative suggestions

---

## UI/UX Verification

### Visual Elements
- [ ] Validation report has pink/red background (rgba(248, 180, 174, 0.08))
- [ ] Contradicted claims have red "✗" markers
- [ ] Score changes show down arrow (⬇️)
- [ ] Valid claims shown in separate section
- [ ] Report only displays when contradictions found

### Text Content
- [ ] Original vs revised scores clearly shown
- [ ] Each contradiction shows claim + conflicting constraint
- [ ] Routing decision explained
- [ ] Valid claims preserved and displayed

### Interaction
- [ ] Report displays before routing sections
- [ ] Validation happens automatically
- [ ] Logs show validation progress
- [ ] User can see full reasoning with adjustment note

---

## Performance Testing

### Execution Time
- [ ] Constraint extraction: <50ms (client-side, no API call)
- [ ] Claims extraction: <50ms (client-side)
- [ ] Contradiction detection: <100ms (client-side loops)
- [ ] Total validation overhead: <200ms

### API Calls
- [ ] No additional API calls (all client-side JavaScript)
- [ ] Total calls for HIGH_UTILITY path (no contradictions):
  1. Extract Requirements
  2. Analyze Utility
  Total: 2 calls (unchanged)

- [ ] Total calls for HIGH→MEDIUM path (with contradictions):
  1. Extract Requirements
  2. Analyze Utility
  3. Analyze Problem (triggered by revised routing)
  Total: 3 calls

---

## Error Handling

### Edge Cases

**Empty Description:**
- Input: Skill with no description
- Expected: No constraints found, validation skipped

**No Power-up Statement:**
- Input: Utility analysis fails to generate power-up
- Expected: No claims to validate, validation skipped

**Malformed Constraints:**
- Input: Partial or unclear constraint statements
- Expected: Extracted anyway, may not match claims (safe)

**Ambiguous Claims:**
- Input: Vague power-up like "helps with data"
- Expected: May not match contradiction patterns (safe)

---

## Success Criteria

✅ **Complete** when:
1. Constraint extraction works for all keyword patterns
2. Claims extraction identifies capability statements
3. Contradiction detection catches all example patterns
4. Score recalculation follows penalty rules
5. Validation report displays correctly
6. Routing updates based on revised scores
7. Logs show validation status clearly
8. No false positives (valid skills not penalized)
9. No false negatives (contradictions caught)
10. Performance overhead < 200ms

---

## Debugging Tips

**If validation not triggering:**
1. Check browser console for errors
2. Verify constraint keywords in description
3. Check power-up statement format
4. Look for "Running constraint validation..." in logs

**If contradictions not detected:**
1. Verify contradiction patterns in `detectContradiction()`
2. Check claim extraction is finding capabilities
3. Test word-overlap logic
4. Add console.log in validation functions

**If score calculation wrong:**
1. Check penalty formula: contradictions × 2
2. Verify valid claims ratio calculation
3. Confirm additional penalty for <50% valid
4. Test Math.max(0, score - penalty)

**If UI not displaying report:**
1. Verify constraintValidationReport div exists
2. Check validationResult.hasContradictions is true
3. Ensure container.classList.remove('hidden') called
4. Inspect HTML for generated content

---

## Known Limitations

1. **Keyword-based Detection**: May miss contradictions phrased differently
2. **No Semantic Analysis**: Relies on word matching, not meaning
3. **English Only**: Constraint keywords are English-specific
4. **Client-side Only**: No server-side validation

---

## Future Enhancements

1. Add more contradiction patterns for edge cases
2. Support multi-language constraint detection
3. Use AI to detect semantic contradictions
4. Cache validation results for same descriptions
5. Allow manual override of validation results
6. Show "Why is this a contradiction?" explanations

---

## Example Output

**Console Logs (Web Research Analyst):**
```
[INFO] Analyzing input and extracting requirements...
[SUCCESS] Extracted skill: web-research-analyst
[INFO] Analyzing skill utility...
[SUCCESS] Utility score: 8/10 (HIGH_UTILITY)
[INFO] Power-up: This skill powers up Claude by: providing executable web scraping, automated data extraction, and real-time research capabilities
[INFO] Running constraint validation...
[WARNING] ⚠️ Constraint contradictions detected: 3 claim(s) invalidated
[WARNING] Score adjusted: 8/10 → 0/10
```

**Validation Result Object:**
```javascript
{
  hasConstraints: true,
  constraints: [
    "Cannot access live web data or perform real-time scraping",
    "Users must execute API calls and data collection independently",
    "Cannot perform live web scraping"
  ],
  claimsChecked: 3,
  hasContradictions: true,
  contradictions: [
    {
      claim: "executable web scraping",
      constraint: "Cannot access live web data or perform real-time scraping",
      reason: "Claim contradicts explicit constraint"
    },
    {
      claim: "automated data extraction",
      constraint: "Users must execute API calls independently",
      reason: "Claim contradicts explicit constraint"
    },
    {
      claim: "real-time research capabilities",
      constraint: "Cannot perform live web scraping",
      reason: "Claim contradicts explicit constraint"
    }
  ],
  validClaims: [],
  originalScore: 8,
  revisedScore: 0,
  scoreChange: -8,
  validClaimsRatio: 0,
  originalAnalysis: { /* original */ },
  revisedAnalysis: { /* revised */ }
}
```
