---
description: "Score a skill's output against its validation criteria dataset"
argument-hint: "[skill-name]"
model: claude-opus-4-6
allowed-tools:
  - Read
  - Glob
  - Grep
  - Agent
---

# Score Command

## Variables

SKILL_NAME: $ARGUMENTS

## Instructions

You are the orchestrator for the `/score` command. Your job is to score a skill's output against its accumulated validation criteria dataset.

### Step 1: Resolve Skill Name

If `SKILL_NAME` is empty or not provided:

1. Use Glob to list available skills that have validation data:
   - Pattern: `.claude/validations/*/` (look for directories)
   - Use Glob with pattern `.claude/validations/**/_schema.yaml` as a reference, then list the subdirectory names
2. Actually glob `.claude/validations/*.yaml` won't work for directories — instead, glob `.claude/validations/**/*.yaml` and extract the directory names
3. Present the list of available skill names to the user and ask them to pick one:

   ```
   Available skills with validation data:
   - skill-name-1
   - skill-name-2
   - ...

   Please specify which skill to score: /score <skill-name>
   ```

4. STOP and wait for the user to provide the skill name before proceeding.

### Step 2: Verify Validation Examples Exist

1. Use Glob to check for YAML files in `.claude/validations/<SKILL_NAME>/`:
   - Pattern: `.claude/validations/<SKILL_NAME>/*.yaml`
   - Exclude `_schema.yaml` from the count

2. If no YAML files found (or directory doesn't exist):
   ```
   No validation examples found for skill: <SKILL_NAME>

   To score this skill, you need validation examples first.
   Run `/capture` to record good and bad examples for this skill, then run `/score <SKILL_NAME>` again.
   ```
   STOP.

3. If examples found, note how many: "Found X validation examples for <SKILL_NAME>."

### Step 3: Identify the Output to Score

The output to score is the most recent relevant output in the current conversation context. This is typically:
- The most recent response produced by the skill being scored
- Or the output the user explicitly referenced

If the context is ambiguous, tell the user:
```
To score an output, I need to know what to evaluate. Please share:
1. The output you want scored (paste it or describe where it is), OR
2. The conversation context where the skill ran

Then run /score <skill-name> again with that context.
```

For the purposes of this command, proceed with the conversation context as the output to evaluate.

### Step 4: Deploy Validation Scorer

Deploy the `validation-scorer` agent with the following instructions:

```
You are scoring a skill's output against its validation criteria dataset.

Skill name: <SKILL_NAME>
Validations directory: .claude/validations/<SKILL_NAME>/

Your task:
1. Read .claude/validations/_schema.yaml to understand the YAML structure
2. Use Glob to find all .yaml files in .claude/validations/<SKILL_NAME>/ (exclude _schema.yaml)
3. Read each example file and extract all criteria items
4. Deduplicate criteria by criterion text across all examples
5. The output to score is the recent conversation context provided to you

Score the output against each unique criterion:
- PASS: output clearly meets the criterion (cite specific evidence)
- FAIL: output does not meet the criterion (explain what is missing)
- When ambiguous: default to FAIL

Produce the scoring report in this exact format:

## Validation Score: <SKILL_NAME>

**Overall**: PASS | FAIL (FAIL if ANY criterion fails)
**Criteria met**: X/Y

| Criterion | Verdict | Evidence |
|-----------|---------|----------|
| <criterion text> | PASS/FAIL | <specific quote or observation> |

### Recommendations
- <actionable improvement suggestions based on failed criteria, one per failed criterion>

The output being scored is the most recent skill output visible in the conversation context.
```

### Step 5: Present Results

Present the scoring report from the `validation-scorer` agent to the user as-is.

After the report, add:
- If PASS: "The output meets all validation criteria for `<SKILL_NAME>`."
- If FAIL: "Some criteria were not met. See Recommendations above for improvement suggestions. Consider running `/capture` to record this as a fail example."
