# Problem Identifier Agent - Testing Guide

## Overview
This document provides test scenarios to validate the Problem Identifier Agent functionality added to Phase 0 of the Aviram Skill Builder.

## What Was Implemented

### New Functions
1. **`analyzeProblem(requirements, utilityAnalysis)`** - Lines 1407-1523
   - Calls Claude API with Problem Identifier prompt
   - Researches real domain problems practitioners face
   - Returns structured problem analysis with redesign suggestions

2. **`displayProblemAnalysis(problemAnalysis, utilityAnalysis)`** - Lines 1583-1668
   - Renders problem-grounded redesign UI
   - Shows practitioner pain points, Claude capability gaps, and value unlock
   - Displays enhanced redesign suggestions with metrics

3. **`displayBasicRedesigns(analysis)`** - Lines 1670-1688
   - Fallback display for when problem analysis fails
   - Shows generic redesign suggestions

### Modified Functions
1. **`showUtilityResults(analysis)`** - Lines 1529-1581
   - Now async to support problem analysis
   - Triggers Problem Identifier Agent for MEDIUM/LOW utility scores
   - Shows loading state while analyzing problems

2. **`startGeneration()`** - Line 2079
   - Now awaits `showUtilityResults()` to handle async problem analysis

### New State Variables
- **`problemAnalysisResult`** - Stores the problem analysis output

## Test Scenarios

### Test 1: HIGH_UTILITY Skill (Score 7-10)
**Input:**
```
Parse PDF tables and forms into structured JSON. Handle malformed PDFs, extract nested tables, preserve formatting context.
```

**Expected Behavior:**
- Utility score: 7-10
- Phase routing: PROCEED
- NO Problem Identifier Agent runs
- Shows "Continue to Research" button
- Logs show: "Analysis complete: PROCEED"

**What to Verify:**
- [ ] High utility score displayed (green)
- [ ] Research direction shown
- [ ] No problem analysis triggered
- [ ] Can proceed directly to research phase

---

### Test 2: MEDIUM_UTILITY Skill (Score 4-6)
**Input:**
```
Create a production budget skill for film productions
```

**Expected Behavior:**
- Utility score: 4-6
- Phase routing: REDESIGN
- Problem Identifier Agent runs automatically
- Shows loading state: "Analyzing real problems in this domain..."
- Displays problem analysis card with:
  - Real Problem Identified section
  - Practitioner pain points
  - Claude capability gap
  - Value unlock
  - 2-3 Problem-Grounded Redesigns with:
    - Redesigned skill name
    - Estimated utility score (with upward arrow)
    - Problem it solves
    - Power-up statement
    - Measurable outcome
    - Specific implementation

**What to Verify:**
- [ ] Medium utility score displayed (yellow)
- [ ] Log shows: "Deploying Problem Identifier Agent..."
- [ ] Log shows: "Identifying real practitioner problems..."
- [ ] Log shows: "Problem analysis complete"
- [ ] Problem analysis card displays with all sections
- [ ] Redesign suggestions are specific (not generic)
- [ ] Each redesign is clickable
- [ ] Clicking redesign fills input field and resets

**Example Expected Output:**
```
Real Problem Identified:
  Problem: "Production teams can't predict multi-location shoot costs
           with labor conflicts. Takes 8+ hours per production."
  Current Workaround: "Manual spreadsheets"
  Cost: "5-15% budget overruns due to errors"

Claude Capability Gap: "Cannot model constraint satisfaction with
                        location-specific variables"

Value Unlock: "Accurate cost predictions in minutes vs 8+ hours"

Redesign #1: production-budget-predictor with constraint-satisfaction engine
  Score: 8/10 ⬆️
  Solves: Predicting multi-location costs with dependencies
  Power-up: Models location-specific labor rates, equipment conflicts
  Outcome: Generates accurate predictions in minutes vs 8+ hours
  Implementation: Takes location list, shoot dates, equipment needs →
                  outputs cost predictions with conflict warnings
```

---

### Test 3: LOW_UTILITY Skill (Score 0-3)
**Input:**
```
Financial advisor chatbot
```

**Expected Behavior:**
- Utility score: 0-3
- Phase routing: REJECT
- Problem Identifier Agent runs automatically
- Shows rejection reason
- Displays problem-grounded alternatives
- Same enhanced UI as MEDIUM_UTILITY

**What to Verify:**
- [ ] Low utility score displayed (red)
- [ ] Rejection reason shown
- [ ] Problem Identifier Agent runs
- [ ] Problem analysis displays properly
- [ ] Can select alternative redesigns
- [ ] "Try New Skill Request" button works

---

### Test 4: Problem Analysis Failure (Fallback)
**Input:**
```
Motion design skill
```

**Expected Behavior:**
- If problem analysis fails (API error, timeout, etc.):
  - Log shows: "Problem analysis failed - using fallback"
  - Falls back to basic redesign suggestions
  - Shows simple button list (old UI)
  - Still allows user to select alternatives

**What to Verify:**
- [ ] Graceful degradation to basic redesigns
- [ ] User can still interact with the system
- [ ] Error is logged but doesn't crash the app

---

### Test 5: Cross-Domain Testing
Test Problem Identifier across different domains:

**Creative Domain:**
```
Input: "Motion design skill"
Expected: Problems about physics-accurate motion, easing curves, animation polish time
```

**Coding Domain:**
```
Input: "Database schema generator"
Expected: Problems about N+1 queries, missing indexes, production performance
```

**Finance Domain:**
```
Input: "Financial advisor chatbot"
Expected: Problems about SaaS unit economics, runway calculations, fundraising strategy
```

**Research Domain:**
```
Input: "Research aggregator"
Expected: Problems about finding contradictions between papers, citation analysis
```

**Automation Domain:**
```
Input: "Workflow automation helper"
Expected: Problems about multi-app workflow generation, error handling, productivity loss
```

**What to Verify:**
- [ ] Problem analysis is domain-specific
- [ ] Pain points are concrete (not generic)
- [ ] Workarounds mention actual tools/processes
- [ ] Costs are quantified (time/money)
- [ ] Redesigns target specific problems

---

## UI/UX Verification

### Visual Elements
- [ ] Problem card has light blue background with border
- [ ] Redesign cards have dark background
- [ ] Hover effects work (border color changes to accent blue)
- [ ] Score badges show correct colors (green for 8+, yellow for 7)
- [ ] Loading spinner appears during problem analysis
- [ ] All text is readable with proper contrast

### Interaction
- [ ] Clicking redesign card fills input field
- [ ] "Proceed Anyway" button still works
- [ ] "Start Over" button resets the app
- [ ] Redesign selection triggers factory reset

### Responsiveness
- [ ] UI works on different screen sizes
- [ ] Grid layout collapses properly on mobile
- [ ] Text remains readable at all sizes

---

## Performance Testing

### API Calls
- [ ] Problem Identifier makes ONE additional API call (not multiple)
- [ ] Total calls for MEDIUM_UTILITY path:
  1. Extract Requirements
  2. Analyze Utility
  3. Analyze Problem (NEW)
- [ ] Progress indicators update during each phase
- [ ] Logs show all stages

### Error Handling
- [ ] API key missing → proper error message
- [ ] Network failure → graceful degradation
- [ ] Malformed JSON response → fallback to basic redesigns
- [ ] Timeout → user-friendly error

---

## Integration Testing

### State Management
- [ ] `currentRequirements` is set before problem analysis
- [ ] `utilityAnalysisResult` is accessible to problem analyzer
- [ ] `problemAnalysisResult` is stored correctly
- [ ] Selected redesign updates input field

### Workflow Continuity
- [ ] HIGH_UTILITY → Can proceed to research
- [ ] MEDIUM_UTILITY → Can choose redesign OR proceed anyway
- [ ] LOW_UTILITY → Can choose alternative OR start over
- [ ] All paths eventually lead to skill generation or reset

---

## Regression Testing

Verify existing functionality still works:
- [ ] API key save/load/clear
- [ ] High utility skills proceed normally
- [ ] Research phase works
- [ ] Generation phase works
- [ ] Validation phase works
- [ ] Package download works
- [ ] Copy to clipboard works
- [ ] Examples populate input field
- [ ] Reset button clears state

---

## Success Criteria

✅ **Complete** when:
1. Problem Identifier runs for MEDIUM/LOW utility
2. Displays 2-3 specific practitioner pain points
3. Each pain point has workaround, cost, and frequency
4. Claude capability gap is specific and concrete
5. Redesign suggestions are problem-grounded (not generic)
6. Each redesign has measurable outcome
7. UI is visually appealing and interactive
8. Works across multiple domains
9. Graceful fallback on errors
10. All existing functionality preserved

---

## Manual Testing Checklist

### Quick Test (5 minutes)
1. Enter "production budget skill"
2. Wait for utility analysis
3. Verify MEDIUM_UTILITY routing
4. Observe Problem Identifier running
5. Check problem analysis displays
6. Click a redesign suggestion
7. Verify input field updates

### Full Test (20 minutes)
1. Test all 5 domain examples
2. Verify each shows domain-specific problems
3. Test HIGH_UTILITY path (PDF parsing)
4. Test LOW_UTILITY path (generic chatbot)
5. Test "Proceed Anyway" button
6. Test "Start Over" functionality
7. Verify API key persistence
8. Test error scenarios (no API key, network failure)

### Edge Cases
- Very long skill descriptions
- Special characters in input
- Non-English input
- Empty input
- API rate limiting
- Slow network conditions

---

## Known Limitations

1. **Single Problem Display**: Currently shows only first pain point (can be extended)
2. **No Problem Caching**: Re-runs analysis if user goes back
3. **Fixed Number of Redesigns**: Always shows 2-3 suggestions
4. **No User Preference**: Can't choose which problem to focus on

---

## Future Enhancements

1. Allow user to select which pain point to focus on
2. Show all pain points in expandable sections
3. Add "Why is this better?" explanation for each redesign
4. Allow side-by-side comparison of original vs redesign
5. Save problem analysis results for reference
6. Add "Explore More Problems" button to re-run analysis

---

## Debugging Tips

If problem analysis doesn't show:
1. Check browser console for errors
2. Verify API key is set
3. Check network tab for API calls
4. Look for "Problem analysis failed" in logs
5. Verify utility score is 0-6 (not 7+)

If redesigns are too generic:
1. Check the prompt in `analyzeProblem()`
2. Verify domain is detected correctly
3. Ensure Claude is using latest model
4. Try increasing max_tokens for more detail

If UI doesn't render:
1. Check for HTML injection issues
2. Verify all template strings are properly escaped
3. Check for missing closing tags
4. Verify CSS classes exist
