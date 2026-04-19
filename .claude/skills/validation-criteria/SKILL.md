---
name: validation-criteria
description: "Meta-skill for collecting, formatting, and validating skill evaluation criteria. Guides users through articulating specific, binary pass/fail conditions and writing conformant validation examples."
tags: [meta, validation, eval, quality-gate]
tools: [Read, Write, Edit, Glob, Grep]
---

# Validation Criteria

## When to Activate

Activate this skill when:
- A task has just completed and the user gives feedback about the output quality
- The user explicitly asks to capture validation criteria, a pass example, or a fail example
- The `/capture` command is run
- The user says things like "that was good", "that was wrong", "save that as an example", or "capture that"

## The Eval-Quality Validation Gate

Before accepting any criterion as valid, it must pass the **binary-testability test**:

> Can a reviewer unambiguously determine pass or fail from this criterion alone, without subjective judgment?

### REJECT These (Vague / Untestable)

- "looks good" — by what measure?
- "is clean code" — define clean
- "seems right" — observable how?
- "nice output" — nice by what standard?
- "well-structured" — what structure is required?
- "concise" — how many words/sentences is the limit?
- "works well" — works under what specific conditions?

### REQUIRE These (Specific / Binary)

Every accepted criterion must be:
1. **Observable**: Can be checked by reading the output
2. **Binary**: Either passes or fails, no partial credit
3. **Specific**: Contains a concrete threshold, count, or condition

### Push-Back Scripts

When the user gives vague feedback, do not accept it. Use these push-back patterns:

| Vague feedback | Push-back prompt |
|---|---|
| "it was good" | "What specifically was good? For example: 'Output contained a numbered list', 'Response was under 5 sentences', 'All function signatures included type annotations'" |
| "looks nice" | "What made it look nice? Can you describe one observable thing — a structure, a format, a presence or absence of something?" |
| "is clean" | "What makes it clean? For example: 'No function exceeds 20 lines', 'No inline comments', 'All variables are named with snake_case'" |
| "it was wrong" | "What specifically was wrong? For example: 'Missing return type annotation on line 12', 'Used os.getenv instead of os.environ', 'Did not read the file before editing'" |
| "not quite right" | "What condition failed? Describe one thing that should have been present or absent." |

Never proceed with a vague criterion. Always get specificity before writing to the validation file.

## Guided Collection Flow

### Step 1: Identify the Skill

Ask: "Which skill produced this output?"

List available skills by globbing `.claude/skills/*/SKILL.md`. If the user doesn't know, show them the list and ask them to identify the relevant one.

### Step 2: Capture Context

Collect three pieces of context:
1. **input_prompt**: What was the task or user message that triggered the skill?
2. **skill_loaded**: Which skill(s) were active during the run?
3. **output_summary**: Briefly summarize what the agent produced (keep under 500 characters)

### Step 3: Articulate Criteria

This is the critical step. Ask: "What specific, binary conditions does this output demonstrate?"

- Require at least 2 criteria per example
- Apply the Eval-Quality Validation Gate (above) to every criterion offered
- Push back on vague criteria until they are binary-testable
- Each criterion must have a `met: true` or `met: false` field

### Step 4: Assign Verdict

The overall verdict is either `pass` or `fail`. There is no partial credit.

- `pass`: The output met all criteria — use this to show the skill working correctly
- `fail`: The output failed one or more criteria — use this to show a failure mode

### Step 5: Write Reasoning

Ask the user: "Why is this a good/bad example? Be specific."

The reasoning field must:
- Reference specific criteria by name or description
- Explain what the agent did or failed to do
- Be specific enough that someone reading it later can understand the failure or success without re-running the task

### Step 6: Format as YAML

Use the schema at `.claude/validations/_schema.yaml`. Generate the example as a conformant YAML document:

```yaml
skill_name: <kebab-case-skill-name>
example_id: <skill-name>-<pass|fail>-<NNN>
verdict: <pass|fail>
criteria:
  - criterion: "<specific, binary condition>"
    met: <true|false>
  - criterion: "<specific, binary condition>"
    met: <true|false>
context:
  input_prompt: "<the user prompt or task that triggered this skill>"
  skill_loaded: "<which skill(s) were active>"
  output_summary: "<under 500 chars — what was produced>"
reasoning: "<specific explanation of why this is a good or bad example>"
tags: [<optional-tags>]
captured_at: "<ISO 8601 timestamp>"
captured_by: manual
```

### Step 7: Write to File

Save to `.claude/validations/<skill-name>/<example_id>.yaml`.

To determine the sequential number for `example_id`:
1. Glob `.claude/validations/<skill-name>/*.yaml`
2. Count the number of existing files for the same verdict type (pass or fail)
3. Use the next number, zero-padded to 3 digits (e.g., `001`, `002`, `003`)

## Good vs Bad Criteria Examples

### GOOD Criteria (Binary-Testable)

- "Response contains fewer than 3 sentences"
- "All code examples include error handling with try/except blocks"
- "Function has return type annotation on the def line"
- "Output does not use os.getenv — uses os.environ instead"
- "File was read before it was edited"
- "The YAML frontmatter includes a `tags` field with at least one tag"
- "No fallback value (e.g., `or ''`, `or []`) appears in the generated code"
- "The example_id field follows the format `<skill>-<verdict>-<NNN>`"

### BAD Criteria (Reject These)

- "Response is concise" — how concise? No threshold given
- "Code quality is good" — unmeasurable, subjective
- "Works well" — no observable test
- "Clean implementation" — no specific definition
- "Nice output" — what is nice?
- "Followed the skill" — which instruction exactly?

## Schema Reference

- Schema: `.claude/validations/_schema.yaml`
- Documentation: `.claude/validations/README.md`
- Example pass: `.claude/validations/verification-before-completion/verification-before-completion-pass-001.yaml`
- Example fail: `.claude/validations/verification-before-completion/verification-before-completion-fail-001.yaml`

Read existing examples to understand the expected shape before writing a new one.
