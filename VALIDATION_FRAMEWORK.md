# Claude Code: Skill Generation Validation Framework

When building a skill, apply the Deep Research Skill Factory's pipeline with
built-in reality checks at each stage. Do not generate skills that oversell
Claude's actual capabilities.

---

## CONTEXT: Factory Infrastructure

The factory requires API key persistence via localStorage to function properly.
The user enters their Anthropic API key once, it's stored locally in their
browser, and persists across sessions. This allows the factory to run at
zero operational cost with the user bearing all API expenses directly.

---

## INPUT STAGE

Analyze what the skill will actually receive:

### Real Trigger Queries
List 3-5 actual user questions, not theoretical ones.

### Data Constraints
What can Claude legitimately access?

**✓ Available:**
- Web search context (limited)
- User's local files (if uploaded)
- Historical patterns/reasoning (from training)
- Published documentation (via web search)

**✗ NOT Available:**
- Live APIs (unless user provides API key)
- Real-time data (only via web search, subject to cutoff)
- External services (cannot make authenticated requests)
- Private/proprietary data
- Database queries

### Query Preprocessing
What normalization is required for this skill?

---

## RESEARCH STAGE

Define what the skill can actually research:

### Available Sources
- Official documentation (web search)
- Published examples and tutorials (web search)
- Historical data and patterns (training data)
- Public APIs and their schemas (web search)
- Common use cases and best practices (training data)

### NOT Available
- Real-time pricing or inventory (unless user provides API key)
- Live service status or availability
- Proprietary/private data
- Authenticated API calls on user's behalf
- Database queries

### Data Freshness Expectations
When was the last update? Is this static or rapidly changing?

---

## GENERATE STAGE

Specify what Claude can reliably produce:

### Type 1 - Frameworks & Structures
**✓ Can generate:**
- Decision trees
- Checklists
- Templates
- Workflows
- Process models
- Comparison matrices

### Type 2 - Analysis & Synthesis
**✓ Can generate:**
- Summaries
- Comparisons
- Evaluations
- Recommendations
- Structured breakdowns

### Type 3 - Code & Scripts
**✓ Can generate:**
- Example code
- Architectural patterns
- Pseudocode
- Script templates (with caveat: must be tested by user)

**✗ Cannot generate:**
- Live integrations
- Authenticated API calls
- Production deployment scripts without user validation

### Type 4 - Data-Driven Results
**✗ Cannot generate:**
- Real prices
- Availability
- Live inventory
- Current rates
- Real-time metrics

**✓ Can generate:**
- Budget frameworks
- Cost ranges
- Estimation models
- Historical trends

### Concrete Outputs
List specific, concrete outputs this skill can produce.

**Good:** "Generates day-by-day itinerary templates with activity clustering and budget breakdowns"

**Bad:** "Helps with travel planning" (too vague)

---

## VALIDATE STAGE

Explicitly document limitations and failure modes:

### Critical Question: Where Does This Skill Break?

#### Failure Mode 1: User Expects Live Data
**Example:** "Find the cheapest flight to Barcelona tomorrow"

- **Claude can:** Explain how to search, provide strategies
- **Claude cannot:** Access real-time Skyscanner/Google Flights prices
- **Skill should:** Clearly state "I'll help structure your search, then direct you to booking sites for current prices"

#### Failure Mode 2: External APIs Required
**Example:** "Get weather data for my trip"

- **Claude can:** Explain weather patterns, historical data, what to look for
- **Claude cannot:** Call OpenWeather API or WeatherAPI directly
- **Skill should:** Explain how to interpret forecasts OR ask user to provide API key

#### Failure Mode 3: Authentication Needed
**Example:** "Book my hotel"

- **Claude can:** Help compare options, create decision frameworks
- **Claude cannot:** Make authenticated requests to Booking.com
- **Skill should:** Hand off to user tools

### Deferral Matrix

Create a table for each skill:

| Query Type | Claude Can Do | Deferral Point |
|-----------|---------------|----------------|
| "Plan a Barcelona trip" | Structure itinerary, budget framework | User goes to booking sites for prices |
| "Find flights" | Compare flight strategies, explain tradeoffs | User searches Google Flights/Skyscanner |
| "What's the weather?" | Explain seasonal patterns | User checks weather.com or forecast app |
| "Best restaurants" | Category recommendations, cuisine guides | User checks Google Maps/TripAdvisor for current |

---

## PACKAGE STAGE

Create an honest, constraint-aware skill specification:

### ✗ Remove These (Overselling)
- "Integrates multiple travel APIs to provide data-driven recommendations"
- "Multi-source price comparison"
- "Fetches real-time flight data"
- Async/Redis/circuit breaker architecture (Claude can't do this)

### ✓ Replace With (Reality-Based)
- "Structures travel planning through research frameworks and decision templates"
- "Compares destinations using available data and reasoning"
- "Creates budget models and itinerary templates"
- "Defers to user tools for real-time pricing and booking"

### Required Metadata Format

```yaml
name: [skill-name]
description: "What Claude actually does. Use when [realistic triggers]."
metadata:
  constraints: "Cannot access real-time pricing. Requires user to provide API keys for live data. Best for planning frameworks, not booking execution."
  data_sources: "Web search, historical patterns, training data"
  external_tools_required: "[list actual external tools user must go to]"
  success_criteria: "User has structured plan, understands tradeoffs, knows next steps"
```

---

## FINAL VALIDATION CHECKLIST

Before packaging, verify:

- [ ] All promised capabilities tested against Claude's actual constraints
- [ ] External tool deferrals explicitly documented
- [ ] Failure modes explained in user-facing language
- [ ] No async/API/database implementation promises
- [ ] Data freshness and limitations stated
- [ ] User journey shows where Claude ends and external tools begin
- [ ] Real trigger examples (not theoretical)
- [ ] Deferral matrix complete
- [ ] No overselling in description or examples

**If you cannot check all boxes, revise the skill scope.**

---

## Examples of Revised Skills

### BAD (Original)
"Travel Researcher - Multi-source price comparison with real-time data aggregation"

### GOOD (Revised)
"Travel Framework Builder - Creates structured itineraries, budget models, and destination comparison matrices. Defers to Booking.com, Google Flights, and Weather services for real-time data."

---

## Application Notes

Apply this framework to every skill. When in doubt, bias toward admitting constraints over promising capabilities.

### Integration with Factory

The Deep Research Skill Factory should apply these validation checks at each stage:

1. **Input Stage:** Verify skill request doesn't require capabilities Claude lacks
2. **Research Stage:** Only research what's actually available to Claude
3. **Generate Stage:** Ensure prompts constrain output to realistic capabilities
4. **Validate Stage:** Check for overselling and add constraint documentation
5. **Package Stage:** Include clear limitation notices in metadata

### Red Flags to Watch For

- Promises of "real-time" anything without API key requirement
- Claims to "integrate with" external services
- Suggestions of database operations
- Async/background processing claims
- Automated deployment or execution
- Access to proprietary/private data
