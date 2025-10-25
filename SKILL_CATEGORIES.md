# Skill Categories: Understanding Real Power-ups

## The Core Problem

Phase 0 must distinguish between two fundamentally different types of skills:

1. **Template Skills** - Code generation templates Claude already knows
2. **Power-up Skills** - New reasoning capabilities Claude can execute

**A skill only "powers up" Claude if Claude can execute/apply it during reasoning.**

---

## The Five Categories

### 📄 TEMPLATE (Not a Power-up)

**What it is:** Code templates and patterns for humans to run

**Examples:**
- "web scraping framework"
- "API client generator"
- "React component templates"
- "database migration builder"

**Key characteristics:**
- Claude generates code for humans to execute
- Claude already knows these patterns
- Does not expand Claude's reasoning capability
- Focus is on code generation

**Max Utility:** 3/10

**Real Power-up:** ❌ No

**Test:** Does Claude execute this? No → TEMPLATE

---

### 🧠 METHODOLOGY (Real Power-up)

**What it is:** Reasoning frameworks Claude can apply

**Examples:**
- "research methodology framework"
- "contradiction detection system"
- "source evaluation framework"
- "systematic fact verification"

**Key characteristics:**
- Claude applies the reasoning framework directly
- Enables new analytical capabilities
- Claude can use this in any conversation
- Focus is on how Claude thinks

**Max Utility:** 9/10

**Real Power-up:** ✅ Yes

**Test:** Does Claude apply this in reasoning? Yes → METHODOLOGY

---

### 📚 KNOWLEDGE (Real Power-up)

**What it is:** Domain knowledge Claude uses in reasoning

**Examples:**
- "constraint solving patterns"
- "CSS grid layout rules"
- "algorithm library"
- "design pattern catalog"

**Key characteristics:**
- Embeds domain-specific knowledge
- Claude applies knowledge directly
- Enhances Claude's expertise in a domain
- Focus is on what Claude knows

**Max Utility:** 9/10

**Real Power-up:** ✅ Yes

**Test:** Does Claude use this knowledge directly? Yes → KNOWLEDGE

---

### ⚙️ PROCESSOR (Real Power-up)

**What it is:** Processing logic Claude executes

**Examples:**
- "query optimization analyzer"
- "N+1 query detector"
- "contradiction detector"
- "source credibility scorer"

**Key characteristics:**
- Claude executes the algorithm
- Processes data systematically
- Applies logic to inputs
- Focus is on what Claude can compute

**Max Utility:** 9/10

**Real Power-up:** ✅ Yes

**Test:** Does Claude execute the logic? Yes → PROCESSOR

---

### 🔧 EXECUTOR (Not a Power-up)

**What it is:** Automation requiring external execution

**Examples:**
- "database migration runner"
- "deployment automation"
- "CI/CD pipeline"
- "backup scheduler"

**Key characteristics:**
- Requires humans to run scripts/tools
- Claude cannot execute this
- External system dependency
- Focus is on automation for humans

**Max Utility:** 2/10

**Real Power-up:** ❌ No

**Test:** Does this need external execution? Yes → EXECUTOR

---

## Scoring Rules

| Category | Max Score | Typical Range | Real Power-up? |
|----------|-----------|---------------|----------------|
| TEMPLATE | 3/10 | 1-3 | ❌ No |
| METHODOLOGY | 9/10 | 6-9 | ✅ Yes |
| KNOWLEDGE | 9/10 | 6-9 | ✅ Yes |
| PROCESSOR | 9/10 | 6-9 | ✅ Yes |
| EXECUTOR | 2/10 | 1-2 | ❌ No |

---

## The Critical Test

**Question:** "Can Claude execute/apply this during reasoning without humans running code?"

- **If NO** → TEMPLATE or EXECUTOR (low utility, not a power-up)
- **If YES** → METHODOLOGY, KNOWLEDGE, or PROCESSOR (high utility, real power-up)

---

## Real Examples Across Categories

### Example 1: Web Research

**User Input:** "Create a web research skill"

**❌ TEMPLATE Interpretation (Wrong):**
```
Category: TEMPLATE
Utility: 2/10
Reasoning: This gives Claude web scraping templates, which it already
          knows. Claude cannot access the internet. Not a power-up.
```

**✅ METHODOLOGY Interpretation (Correct):**
```
Category: METHODOLOGY
Utility: 8/10
Reasoning: Research methodology framework enables Claude to systematically
          verify claims, detect contradictions, and evaluate sources.
          Real power-up that Claude can apply in any research task.
```

### Example 2: Motion Design

**User Input:** "Create a motion design skill"

**❌ TEMPLATE Interpretation (Wrong):**
```
Category: TEMPLATE
Utility: 3/10
Reasoning: Motion design code templates. Claude already knows animation
          patterns. Not a power-up.
```

**✅ PROCESSOR Interpretation (Correct):**
```
Category: PROCESSOR
Utility: 8/10
Reasoning: Physics-based motion generator. Claude can execute easing
          calculations and generate optimized animation curves.
          Real power-up.
```

### Example 3: Database Schema

**User Input:** "Create a database schema generator"

**❌ TEMPLATE Interpretation (Wrong):**
```
Category: TEMPLATE
Utility: 3/10
Reasoning: Schema generation templates. Claude already knows SQL.
          Not a power-up.
```

**✅ PROCESSOR Interpretation (Correct):**
```
Category: PROCESSOR
Utility: 8/10
Reasoning: Query-aware schema optimizer. Claude can analyze query patterns
          and optimize schema design. Real power-up.
```

---

## Why This Matters

### Before Categorization (Broken)

Phase 0 gave 9/10 to template skills:
```
"web scraping framework" → 9/10 ✗
"API client generator" → 8/10 ✗
"React templates" → 7/10 ✗
```

**Problem:** These aren't power-ups. Claude already knows this.

### After Categorization (Fixed)

Phase 0 correctly scores based on category:
```
"web scraping framework" → TEMPLATE → 2/10 ✓
"research methodology" → METHODOLOGY → 8/10 ✓
"query optimizer" → PROCESSOR → 8/10 ✓
```

**Result:** Only skills that genuinely enhance Claude pass.

---

## Implementation Details

### Phase 0 Categorization Flow

```
User Input: "Create a [X] skill"

1. Extract requirements
2. Categorize skill type (TEMPLATE/METHODOLOGY/KNOWLEDGE/PROCESSOR/EXECUTOR)
3. Apply category-based utility ceiling
4. Score utility within ceiling
5. Return category + score + reasoning
```

### Category Detection Prompt

Phase 0 asks Claude to categorize based on:
- Does Claude execute this? (Yes = power-up, No = not power-up)
- Is this code templates? → TEMPLATE
- Is this reasoning framework? → METHODOLOGY
- Is this domain knowledge? → KNOWLEDGE
- Is this processing logic? → PROCESSOR
- Is this automation requiring execution? → EXECUTOR

### UI Display

Results show:
```
Category: 🧠 METHODOLOGY ✓ Real Power-up
Utility Score: 8/10
Reasoning: [category_reasoning]
```

---

## Acceptance Criteria

### Categorization Tests

- [ ] "web scraping framework" → TEMPLATE → 1-3/10
- [ ] "research methodology" → METHODOLOGY → 6-9/10
- [ ] "constraint solver" → KNOWLEDGE → 6-9/10
- [ ] "query optimizer" → PROCESSOR → 6-9/10
- [ ] "deployment runner" → EXECUTOR → 1-2/10

### Utility Ceiling Enforcement

- [ ] TEMPLATE skills cannot score above 3/10
- [ ] METHODOLOGY skills can score 6-9/10
- [ ] KNOWLEDGE skills can score 6-9/10
- [ ] PROCESSOR skills can score 6-9/10
- [ ] EXECUTOR skills cannot score above 2/10

### UI Display

- [ ] Category badge shows with emoji
- [ ] "Real Power-up" or "Not a Power-up" indicator
- [ ] Category reasoning displayed
- [ ] Utility score shown with category context

---

## North Star Alignment

**Factory Purpose:** Power up Claude with new reasoning capabilities

**Before Fix:** Factory generated template skills that didn't power up Claude

**After Fix:** Factory only accepts/generates skills that genuinely enhance Claude's reasoning

This architectural fix ensures the factory aligns with its core purpose.
