# Validation Examples

## Purpose

This directory stores pass/fail examples that ground each skill's evaluation criteria in concrete, observable behavior. These examples serve two purposes:

1. **Calibration** — they show agents what "done right" and "done wrong" look like for each skill
2. **Scoring** — the scoring system compares agent outputs against these examples to produce a quality signal

## Directory Structure

```
.claude/validations/
  _schema.yaml                          # Canonical schema for all example files
  README.md                             # This file
  <skill-name>/                         # One directory per skill
    <example_id>.yaml                   # One file per example
```

Convention: the `<skill-name>` directory must match the kebab-case name of a skill under `.claude/skills/<name>/`.

Example layout:

```
.claude/validations/
  verification-before-completion/
    verification-before-completion-pass-001.yaml
    verification-before-completion-fail-001.yaml
  systematic-debugging/
    systematic-debugging-pass-001.yaml
    systematic-debugging-fail-001.yaml
```

## Schema Reference

All example files must conform to `.claude/validations/_schema.yaml`. The schema defines required fields, types, and constraints.

Key fields:

| Field | Required | Description |
|---|---|---|
| `skill_name` | yes | Kebab-case skill name |
| `example_id` | yes | Unique ID (see naming convention below) |
| `verdict` | yes | `pass` or `fail` — binary, no partial credit |
| `criteria` | yes | List of binary-testable criterion/met pairs |
| `context` | yes | Input prompt, skill loaded, output summary |
| `reasoning` | yes | Specific explanation of why this is a good/bad example |
| `tags` | no | Searchable labels |
| `captured_at` | yes | ISO 8601 timestamp |
| `captured_by` | yes | `manual`, `auto-detected`, or `system` |

## Naming Convention

Example IDs follow this format:

```
<skill-name>-<verdict>-<sequential-number>
```

Examples:
- `verification-before-completion-pass-001`
- `verification-before-completion-fail-002`
- `systematic-debugging-pass-003`

Sequential numbers are zero-padded to three digits and never reused within a skill+verdict combination.

## Adding New Examples

### Manually

1. Create the skill directory if it does not exist: `.claude/validations/<skill-name>/`
2. Determine the next sequential number for the verdict (pass or fail)
3. Create a new YAML file named `<example_id>.yaml`
4. Fill in all required fields per the schema
5. Validate the YAML is parseable: `python3 -c "import yaml; yaml.safe_load(open('<file>'))"`

### Via `/capture` Command

When the `/capture` command is available, invoke it after a completed task to automatically generate a validation example from the session. The command will:

1. Inspect the agent's output
2. Evaluate each criterion for the active skill
3. Write the example file with `captured_by: auto-detected`

## Example File Format

```yaml
skill_name: verification-before-completion
example_id: verification-before-completion-pass-001
verdict: pass
criteria:
  - criterion: "Agent ran ALL validation commands listed in the plan"
    met: true
  - criterion: "Agent checked exit codes and read full output"
    met: true
  - criterion: "Agent included actual command output as evidence in completion report"
    met: true
context:
  input_prompt: "Implement the user authentication module and verify it works"
  skill_loaded: verification-before-completion
  output_summary: "Agent implemented auth module, ran all 12 test cases, checked each passed, included test output showing 12/12 pass in the completion report"
reasoning: "The agent followed the verification protocol exactly — ran fresh validation, read output carefully, and provided concrete evidence. No 'should work' language used."
tags:
  - evidence-based
  - thorough
captured_at: "2026-04-14T12:00:00Z"
captured_by: system
```

## How the Scoring System Uses These Files

The scoring system reads all YAML files under `.claude/validations/<skill-name>/` and uses them as labeled examples. For a given agent output:

1. Each criterion in the example set is evaluated against the output
2. The fraction of criteria met (weighted by verdict) produces a quality score
3. Pass examples set the upper bound; fail examples define the failure modes to avoid

A score near 1.0 means the output closely matches known good examples. A score near 0.0 means it reproduces known failure patterns.
