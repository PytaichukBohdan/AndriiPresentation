---
name: active-context
description: Read shared context before starting work. Check what has been decided and what is in progress. Do not repeat work another agent already completed.
---

# Active Context

## Instructions

Before doing any work, check for shared context from the current session.

### On Every Task Start

1. Check if `specs/.session-context.md` exists
2. If it exists, read it to understand:
   - What has been decided
   - What is currently in progress
   - What has been completed
   - Any constraints or blockers
3. Do not repeat work that another agent has already completed
4. If your work changes the shared state, update the context file

### Rules

- **Always read before acting.** No exceptions.
- **Don't repeat work.** If another agent already covered it, build on their output or reference it.
- **Flag conflicts.** If your analysis contradicts a prior decision recorded in context, say so with reasoning.
- **Update when relevant.** After completing significant work, add your results to the context file so the next agent benefits.

### Context File Format

```markdown
# Session Context

## Decisions Made
- [decision 1]
- [decision 2]

## In Progress
- [agent-name]: [what they're working on]

## Completed
- [agent-name]: [what they delivered] → [file path]

## Blockers
- [blocker description]
```
