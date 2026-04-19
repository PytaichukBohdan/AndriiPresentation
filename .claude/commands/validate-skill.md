---
description: "Run a skill through its full validation suite — regression test for skill quality"
argument-hint: "[skill-name]"
model: claude-opus-4-6
allowed-tools:
  - Read
  - Glob
  - Grep
  - Agent
---

# Validate Skill Command

## Variables

SKILL_NAME: $ARGUMENTS

## Instructions

You are the orchestrator for the `/validate-skill` command. Your job is to run a skill through its full validation suite, checking whether the skill's current instructions would produce output meeting all criteria across every recorded example.

### Step 1: Resolve Skill Name

If `SKILL_NAME` is empty or not provided:

1. Use Glob to find skills that have validation data. Glob the pattern `.claude/validations/**/*.yaml` and extract the unique subdirectory names (skill names).
2. Filter out `_schema.yaml` and `README.md`.
3. Present the list:
   ```
   Skills with validation data:
   - skill-name-1
   - skill-name-2
   - ...

   Specify which skill to validate: /validate-skill <skill-name>
   ```
4. STOP and wait for the user.

### Step 2: Load All Validation Examples

1. Use Glob to find all YAML files: `.claude/validations/<SKILL_NAME>/*.yaml`
2. Filter out `_schema.yaml`.
3. If no examples found:
   ```
   No validation examples found for skill: <SKILL_NAME>

   Run /capture to record examples first, then re-run /validate-skill <SKILL_NAME>.
   ```
   STOP.
4. Read each example file. For each example, extract:
   - `example_id`
   - `verdict` (pass or fail)
   - `criteria` list (each criterion text and its `met` boolean)
   - `context.input_prompt`
   - `context.skill_loaded`
   - `context.output_summary`
   - `reasoning`

5. Also read the skill's current instructions from `.claude/skills/<SKILL_NAME>/` (use Glob to find the skill file).

### Step 3: Evaluate Each Example

For each example, deploy the `validation-scorer` agent to evaluate whether the SKILL.md instructions would lead to meeting the criteria given the example's input context.

Deploy all scorer agents. Collect their results.

Each agent should receive:

```
You are evaluating whether a skill's instructions would produce output meeting specific criteria.

Skill name: <SKILL_NAME>
Skill instructions file: .claude/skills/<SKILL_NAME>/<skill-file>

Example ID: <example_id>
Expected verdict: <pass|fail>
Input prompt that triggered the skill: <input_prompt>
Output summary from when this example was captured: <output_summary>

Criteria to evaluate:
<list each criterion>

Your task:
1. Read the skill's instructions file
2. Reason through: given the input prompt and the skill's current instructions, would the skill produce output that meets each criterion?
3. For PASS examples: verify the skill instructions would lead to output meeting ALL criteria
4. For FAIL examples: verify the skill instructions NOW address the failure pattern described in the criteria and context

Score each criterion:
- PASS: skill instructions clearly lead to meeting this criterion
- FAIL: skill instructions do not address this criterion adequately

Report format:
Example ID: <example_id>
Expected: <pass|fail>
Actual: PASS|FAIL (FAIL if any criterion fails)
Status: OK | REGRESSION | FIXED | BROKEN

Criterion scores:
| Criterion | Verdict | Reasoning |
|-----------|---------|-----------|
| ... | PASS/FAIL | ... |

Status definitions:
- OK: expected=pass, actual=pass (skill correctly produces good output)
- REGRESSION: expected=pass, actual=fail (skill no longer meets criteria it used to)
- FIXED: expected=fail, actual=pass (skill now addresses the failure pattern)
- BROKEN: expected=fail, actual=fail (skill still has the failure pattern — acceptable if no fix intended)
```

### Step 4: Compile Results

After all agents complete, compile their results into the report:

```
## Skill Validation Report: <SKILL_NAME>

**Pass rate**: X/Y examples validated successfully
**Status**: HEALTHY | NEEDS ATTENTION | DEGRADED

Status thresholds:
- HEALTHY: >= 80% pass rate, no REGRESSION items
- NEEDS ATTENTION: 60-79% pass rate OR has REGRESSION items
- DEGRADED: < 60% pass rate

| Example ID | Expected | Actual | Status |
|------------|----------|--------|--------|
| <id> | pass | pass | OK |
| <id> | fail | pass | FIXED |
| <id> | pass | fail | REGRESSION |
| <id> | fail | fail | BROKEN |

### Action Items
- <one action per REGRESSION or BROKEN item, specific and actionable>
```

### Step 5: Post-Report Guidance

After the report, provide guidance based on the outcome:

**If HEALTHY:**
```
Skill <SKILL_NAME> is healthy. All pass examples still pass, and all recorded failure patterns are addressed.
```

**If NEEDS ATTENTION:**
```
Skill <SKILL_NAME> needs attention. Review the REGRESSION items above — these are criteria the skill used to meet but no longer does.

Suggested next steps:
1. Review .claude/skills/<SKILL_NAME>/ for recent changes that may have caused regressions
2. Run /capture to add new examples if you find new edge cases
3. Fix the skill instructions to address the REGRESSION items
```

**If DEGRADED or pass rate < 80%:**
```
Skill <SKILL_NAME> is degraded. Pass rate is below 80%.

Suggested next steps:
1. Review the skill's instructions at .claude/skills/<SKILL_NAME>/
2. Run /capture to add more representative examples
3. Rewrite or refine the skill instructions to address the failing criteria
4. Re-run /validate-skill <SKILL_NAME> after making changes
```
