---
name: self-improving-skills
description: Meta-skill that teaches the agent when and how to create, update, and improve skills based on task outcomes
tags: [meta, skills, self-improvement, automation]
requires_tools: [Read, Write, Edit, Glob]
---

# Self-Improving Skills

## When to Create a New Skill

Create a new skill when:
- A complex task (5+ tool calls) succeeds and the pattern is likely to recur
- You discover a domain-specific workflow that requires specialized knowledge
- A user correction reveals a non-obvious approach that should be codified
- Error recovery required a novel, reusable strategy

Do NOT create a skill when:
- The task is a one-off with no reuse potential
- The pattern is project-specific trivia (file paths, config values)
- The skill would duplicate an existing skill's functionality
- The task is trivial (< 3 steps)

## Skill Structure

New skills go to `.claude/skills/<skill-name>/SKILL.md`

Required format:

```yaml
---
name: <skill-name>
description: <one-line description of what the skill does>
tags: [<relevant>, <tags>]
requires_tools: [<tools needed>]
---
```

### Content Structure

1. **Problem**: What problem does this skill solve?
2. **Approach**: High-level strategy
3. **Steps**: Numbered, concrete steps the agent should follow
4. **Validation**: How to verify the skill was applied correctly
5. **Common Pitfalls**: What to watch out for

## Self-Patching Protocol

When a skill is used and issues are discovered:
1. Read the current skill file
2. Identify what went wrong or what could be improved
3. Edit the skill with corrections, preserving working parts
4. Add a `## Changelog` entry with date and description of the change

## Quality Criteria for Skills

A good skill:
- Is reusable across multiple tasks or projects
- Contains domain-specific knowledge not obvious from code
- Has clear trigger conditions (when to use it)
- Includes validation steps (how to verify it worked)
- Is procedural (step-by-step), not declarative (what to do)

A bad skill:
- Wraps a single command or trivial operation
- Contains only project-specific paths or values
- Duplicates tool documentation
- Has no clear trigger condition
- Cannot be validated

## Skill Discovery

Before creating a new skill, check for existing skills:

```
Glob: .claude/skills/*/SKILL.md
```

Read any skills with similar names or tags to avoid duplication.

## Example: Creating a Skill After Error Recovery

If you discover a novel error recovery pattern:

1. Confirm the pattern worked and is generalizable
2. Create `.claude/skills/<recovery-pattern>/SKILL.md`
3. Document the error signature, root cause, and fix steps
4. Add validation: "How to confirm the fix worked"
5. Add pitfalls: "What similar-looking errors need different treatment"

## Validation Criteria Integration

Before self-patching any skill, check for accumulated validation evidence:

### Evidence-Based Patching Protocol

1. **Check validation dataset**: Before modifying a skill, read `.claude/validations/<skill-name>/` for accumulated examples
2. **Pattern detection**: Look for 3+ fail examples with overlapping criteria — this indicates a systematic issue worth fixing
3. **Single-variable rule** (from Autoresearch methodology): Change ONE instruction per patch. Never modify multiple behaviors simultaneously — this makes it impossible to attribute improvement
4. **Pre-patch scoring**: Run `/score <skill-name>` to establish a baseline score before patching
5. **Post-patch verification**: After patching, run `/validate-skill <skill-name>` to verify improvement
6. **Changelog entry**: Log what was changed, why, and the before/after validation scores

### When to Self-Patch Based on Validation Data

- **3+ fail examples** with the same criterion failing → patch the instruction that governs that criterion
- **Contradictory examples** (same criterion passes and fails in similar contexts) → the criterion or instruction is ambiguous, clarify it
- **Zero validation data** → do NOT patch based on a single interaction, wait for evidence to accumulate

### What NOT to Do

- Don't patch based on a single fail example (could be an outlier)
- Don't change multiple instructions at once (violates single-variable rule)
- Don't skip post-patch validation (the patch might make things worse)
- Don't generate new criteria during patching (criteria come from users via `/capture`)
