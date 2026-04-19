---
name: mental-model
description: Manage structured YAML expertise files as personal mental models. Read for context at task start, update with learnings at completion.
---

# Mental Model

## Instructions

You have personal expertise files — structured YAML documents that represent your mental model of the system you work on. These are YOUR files. You own them.

### When to Read

- **At the start of every task** — read your expertise file(s) for context before doing anything
- **When you need to recall** prior observations, decisions, or patterns
- **When a teammate references something** you've tracked before

### When to Update

- **After completing meaningful work** — capture what you learned
- **When you discover something new** about the system (architecture, patterns, gotchas)
- **When your understanding changes** — update stale entries, don't just append

### How to Structure

Write structured YAML. Let the structure emerge from your work, but keep it organized enough to scan quickly.

```yaml
# Good: structured, scannable, evolving
architecture:
  api_layer:
    pattern: "REST with WebSocket for real-time"
    key_files:
      - path: apps/server/routes.ts
        note: "All endpoints, ~400 lines"

observations:
  - date: "2026-03-24"
    note: "Hook validators catch most issues before they reach production"

open_questions:
  - "Should we split the auth module? It's growing fast."
```

### What NOT to Store

- Don't copy-paste entire files — reference them by path
- Don't store conversation logs — just conclusions
- Don't store transient data (build output, test results) — just conclusions
- Don't be prescriptive about categories — evolve them naturally

### Line Limit

Each expertise file should stay under 200 lines. After every write:

1. Check the line count
2. If over 200 lines, trim immediately:
   - Remove least critical entries (old observations, resolved questions)
   - Condense verbose sections
   - Merge redundant entries

### YAML Validation

After every write, validate your YAML is parseable:

```bash
python3 -c "import yaml; yaml.safe_load(open('<file>'))"
```

Fix any syntax errors immediately.
