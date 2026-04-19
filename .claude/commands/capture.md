---
description: "Capture a validation example (good or bad) for a skill's criteria dataset"
argument-hint: "[good|bad] [skill-name]"
model: claude-opus-4-6
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
---

# Capture Validation Example

Capture a pass or fail validation example for a skill's criteria dataset. This builds the ground-truth evaluation set used by `/score` and `/validate-skill`.

## Variables

ARGUMENTS: $ARGUMENTS

## Instructions

Load the `validation-criteria` skill for eval-quality gate rules before starting. Follow every step in order.

### Step 1: Parse Arguments

Parse `$ARGUMENTS` to extract:
- **verdict**: `good` (pass) or `bad` (fail)
- **skill_name**: the kebab-case name of the skill

If both are present in `$ARGUMENTS`, proceed. Otherwise, collect missing values in Step 2 and Step 3.

### Step 2: Identify the Skill

If skill name was not provided in arguments:

1. Glob `.claude/skills/*/SKILL.md` to list all available skills
2. Read the `name` and `description` fields from each SKILL.md frontmatter
3. Ask the user: "Which skill produced the output you want to evaluate?"
   - Present the skill list as numbered options
   - Accept either the number or the skill name

Record the kebab-case directory name as `skill_name`.

### Step 3: Determine Verdict

If verdict was not provided in arguments:

Ask the user: "Is this a **good** (pass) or **bad** (fail) example?"

- `good` / `pass` → verdict: `pass`
- `bad` / `fail` → verdict: `fail`

There is no middle ground. Force a binary choice.

### Step 4: Capture Context

Ask the user these three questions (can be asked together):

1. "What was the task or prompt that triggered this skill? Paste the original user message or describe it."
2. "Which skill(s) were active during this run? (e.g., `verification-before-completion`, or 'I'm not sure')"
3. "Briefly summarize what the agent produced — what was the output? (Keep under 500 characters)"

Record as:
- `input_prompt`: answer to question 1
- `skill_loaded`: answer to question 2, defaulting to `skill_name` if user is unsure
- `output_summary`: answer to question 3

### Step 5: Articulate Criteria (Critical Step)

Ask: "What specifically made this output good/bad? List concrete, binary pass/fail conditions — things that can be checked by reading the output."

**Apply the eval-quality gate to every criterion offered:**

REJECT vague criteria. If the user says something like:
- "it was good" → push back: "What specifically was good? For example: 'Output included a numbered list', 'All functions had type annotations', 'Response was under 5 sentences'"
- "looked nice" → push back: "What made it look nice? Name one observable thing — a structure, count, or format."
- "it was wrong" → push back: "What specifically was wrong? For example: 'Used os.getenv instead of os.environ', 'Did not read the file before editing it', 'Missing return type annotation'"
- "not quite right" → push back: "What condition failed? Describe one thing that should have been present or absent."

REQUIRE binary-testable criteria. Each criterion must:
- Be observable: can be verified by reading the output
- Be binary: either passes or fails, no subjectivity
- Be specific: contains a concrete threshold, count, keyword, or condition

REQUIRE at least 2 criteria per example. If the user provides only 1, ask for at least one more.

For each criterion, also ask: "Was this criterion met in the example? (yes/no)"

### Step 6: Collect Reasoning

Ask: "Why is this a good/bad example — be specific. Reference what the agent did or failed to do."

The reasoning must be specific. Do not accept "it was fine" or "it failed". Push back until the reasoning names concrete behaviors.

### Step 7: Format as YAML

Read `.claude/validations/_schema.yaml` to confirm the required fields.

Generate `example_id`:
1. Glob `.claude/validations/<skill_name>/*.yaml`
2. Count files matching `*-<pass|fail>-*.yaml` for the same verdict
3. Next sequential number zero-padded to 3 digits (e.g., `001`, `002`, `003`)
4. Format: `<skill_name>-<pass|fail>-<NNN>`

Set:
- `captured_at`: current ISO 8601 timestamp (e.g., `2026-04-14T10:30:00Z`)
- `captured_by`: `manual`

Produce the YAML:

```yaml
skill_name: <skill_name>
example_id: <example_id>
verdict: <pass|fail>
criteria:
  - criterion: "<specific, binary condition>"
    met: <true|false>
  - criterion: "<specific, binary condition>"
    met: <true|false>
context:
  input_prompt: "<the original task or user prompt>"
  skill_loaded: "<which skill(s) were active>"
  output_summary: "<under 500 chars>"
reasoning: "<specific explanation>"
tags: []
captured_at: "<ISO 8601 timestamp>"
captured_by: manual
```

### Step 8: Present for Confirmation

Show the formatted YAML to the user and ask: "Does this look correct? I'll save it to `.claude/validations/<skill_name>/<example_id>.yaml` — confirm to proceed or tell me what to change."

Do not write the file until the user confirms.

### Step 9: Write the File

1. Ensure the directory exists: `.claude/validations/<skill_name>/`
2. Write the confirmed YAML to `.claude/validations/<skill_name>/<example_id>.yaml`

### Step 10: Confirm

Tell the user:

"Saved: `.claude/validations/<skill_name>/<example_id>.yaml`

This example is now part of the evaluation dataset for `<skill_name>`. To test against it or score the skill, run:
- `/score <skill_name>` — score all examples for this skill
- `/validate-skill <skill_name>` — run the full validation suite"
