---
description: Build the codebase based on the plan
argument-hint: [path to ai_docs session folder]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, TaskCreate, TaskUpdate, TaskList, TaskGet
---

# Build

Follow the `Workflow` to implement the spec at `SESSION_DIR` then `Report` the completed work.

## Variables

SESSION_DIR: $1

## Instructions

- IMPORTANT: Implement the plan top to bottom, in order. Do not skip any steps. Do not stop in between steps. Complete every step in the plan before stopping.
  - Make your best guess judgement based on the plan, everything will be detailed there.
  - If you have not run any validation commands throughout your implementation, DO NOT STOP until you have validated the work.
  - Your implementation should end with executing the validation commands to validate the work, if there are issues, fix them before stopping.
- Follow the `Spec Status Update Protocol` below to update the plan file in real-time as you work.
- For complex plans with a `## Team Orchestration` section, use Task tools (`TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`) to deploy team agents (implementer, validator) for assigned tasks. Delegate work to `.claude/agents/team/*.md` agents as defined in the orchestration section.
- **Skill reference**: Follow the `verification-before-completion` skill before claiming completion.

## The Iron Law

```
NO COMPLETION CLAIM WITHOUT VERIFIED EVIDENCE
```

Claiming completion without running validation? Start over.

**No exceptions:**
- Don't claim "should work" - prove it works
- Don't trust previous run results - run again
- Don't skip validation "this once"
- Evidence or it didn't happen

## Spec Status Update Protocol

This is the key mechanism for real-time plan tracking. As you work through the plan, update the spec file itself using the Edit tool so that anyone inspecting the plan can see current progress.

**Status values:** `pending` | `in_progress` | `completed` | `blocked` | `skipped` | `needs_fix`

**Protocol:**

1. **Before starting a phase/task:**
   - Set `Status:` to `in_progress`
   - Add a timestamp to `Comments:` indicating work has begun

2. **After completing a phase/task:**
   - Check the checkbox `- [x]`
   - Set `Status:` to `completed`
   - Add completion notes to `Comments:` describing what was done

3. **If a phase/task fails or is blocked:**
   - Set `Status:` to `blocked`
   - Add failure details and root cause to `Comments:`

4. **If intentionally skipping a phase/task:**
   - Set `Status:` to `skipped`
   - Add rationale explaining why it was skipped to `Comments:`

5. **When resuming work on tasks previously marked `needs_fix` by review or testing:**
   - Set `Status:` to `in_progress`
   - Add a comment noting the fix attempt and reference the review/testing report that identified the issue

**Example - Updating a task status with Edit tool:**

Before:
```markdown
- [ ] Implement authentication module
  - Status: pending
  - Comments:
```

After starting work, use the Edit tool to change it to:
```markdown
- [ ] Implement authentication module
  - Status: in_progress
  - Comments: Started implementation at 2026-02-24T10:30:00
```

After completing, use the Edit tool again:
```markdown
- [x] Implement authentication module
  - Status: completed
  - Comments: Started implementation at 2026-02-24T10:30:00. Completed - added JWT-based auth with refresh tokens, all tests passing.
```

## Verification Gate (MANDATORY)

BEFORE claiming implementation is complete:

1. **IDENTIFY**: What validation commands prove completion?
2. **RUN**: Execute EVERY validation command from the plan (fresh, complete)
3. **READ**: Full output - check exit codes, count failures
4. **VERIFY**: Does ALL output confirm success?
   - If NO: Fix issues, re-run, repeat
   - If YES: Include evidence in report
5. **ONLY THEN**: Claim completion

Skip any step = incomplete implementation. Return to Step 1.

**Evidence required for completion claim:**
- Validation command output (actual output, not "it passed")
- Test results with pass/fail counts
- `git diff --stat` summary
- Browser validation screenshots with visual analysis (when plan has Browser Validation section)

## Browser Validation Pair Mode

Activate this mode when the plan has a `## Browser Validation` section with `Browser Validation Required: true`.

### The Pair Workflow

1. **Orchestrator deploys implementer** for the task piece
2. **Implementer builds** a logical piece and signals ready (completes a task or sub-task)
3. **Orchestrator deploys browser-validator** with the relevant user stories for that piece
4. **Browser-validator** starts dev server (if needed), runs stories, takes + analyzes screenshots via multimodal vision
5. **If PASS**: proceed to next piece
6. **If FAIL**: orchestrator resumes implementer with the browser-validator's failure report (including screenshots, visual analysis, and suggested fix direction). Implementer fixes. Re-deploy browser-validator.
7. **Max 5 iterations per piece**. After 5 failures, escalate: mark the piece as `blocked` with full failure history and move to next piece or stop.
8. **After all pieces complete**: deploy browser-validator for a **final full validation pass** running ALL user stories end-to-end

### Dev Server Lifecycle

Browser-validator manages its own dev server. If the plan specifies a `Dev Server Command` and `Dev Server URL`, browser-validator starts it via the drive skill in a tmux session. Otherwise, it expects the server to already be running.

### Evidence Requirements

Browser validation screenshots count as evidence in the Verification Gate. The completion report must include:
- Screenshot paths for each validated story
- Visual analysis summaries from the browser-validator
- PASS/FAIL status for each user story

## Red Flags - STOP Implementation

If any of these thoughts occur to you, STOP and reconsider:

- Writing code before reading relevant files
- Skipping validation "because code looks correct"
- "I'll fix the tests later"
- Committing without running checks
- "Just a small change, no need to verify"
- Using "should work" or "probably passes"
- Claiming completion before running commands
- Trusting previous run results

**If any of these apply: STOP. Run validation commands NOW.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Code is obviously correct" | Obvious code fails all the time. Verify. |
| "Tests were passing earlier" | Previous runs prove nothing. Run again. |
| "Just a small change" | Small changes break things. Full verification. |
| "I'll test it later" | Later never comes. Test now. |
| "The plan said to do this" | Plans can be wrong. Verify outcomes. |

## Announcement (MANDATORY)

Before starting work, announce:

"I'm using /build to implement the plan at [path]. I will follow the workflow exactly and verify all work before claiming completion."

This creates commitment. Skipping this step = likely to skip other steps.

## The Standard

The marginal cost of completeness is near zero with AI. Do the whole thing. Do it right. Do it with tests. Do it with documentation. Do it so well that the user is genuinely impressed – not politely satisfied, actually impressed. Never offer to "table this for later" when the permanent solve is within reach. Never leave a dangling thread when tying it off takes five more minutes. Never present a workaround when the real fix exists. The standard isn't "good enough" – it's "holy shit, that's done." Search before building. Test before shipping. Ship the complete thing. When asked for something, the answer is the finished product, not a plan to build it. Time is not an excuse. Fatigue is not an excuse. Complexity is not an excuse. Boil the ocean.

## Workflow

- If no `SESSION_DIR` is provided, STOP immediately and ask the user to provide it.

  **No exceptions:**
  - Don't infer the plan from conversation
  - Don't create an ad-hoc plan
  - Don't proceed without an explicit path
  - STOP means STOP

- Resolve `SPEC_PATH` by joining `SESSION_DIR` + `implementation_spec.md`. If the file doesn't exist at that path, STOP and ask the user for the correct folder.

- Read the plan at `SPEC_PATH`. Ultrathink about the plan and IMPLEMENT it into the codebase.
  - Implement the entire plan top to bottom before stopping.
  - **Restart handling:** If the spec has tasks with Status: `needs_fix`, prioritize those tasks. Read the `## Post-Implementation Record` section for review/testing reports that describe what needs to be fixed.

- **Shared Context Protocol**: At implementation start, create `.session-context.md` inside `SESSION_DIR` recording what has been decided and what is in progress. Subagents with the `active-context` skill will read this before starting work. Update it as tasks complete.

- **Domain Scoping**: Before delegating to an implementer, declare which paths they may modify in the task description. This prevents parallel agents from colliding on shared files. Include a `Domain:` field listing allowed directories/files.

- **Architect Deployment** (optional): For complex plans, deploy an `architect` agent first to review the plan's architectural decisions before implementation begins. The architect is read-only and cannot modify code.

- If the plan has a `## Team Orchestration` section, use Task tools to deploy team agents for assigned tasks:
  - Use `TaskCreate` to create tasks for implementer/validator agents as defined in the orchestration section
  - Use `TaskList` and `TaskGet` to monitor progress of delegated tasks
  - Use `TaskUpdate` to update coordination status
  - Team agents are defined in `.claude/agents/team/*.md` (implementer, validator, architect, tester, security-reviewer, static-validator, runtime-validator)

- Update spec status fields as you work using the `Spec Status Update Protocol` above.
- Run validation commands before claiming completion per the `Verification Gate`.

## Report

- Summarize the work you've just done in a concise bullet point list.
- Report the files and total lines changed with `git diff --stat`
- Spec status summary - include a table showing completion state:

| Phase/Task | Assigned Agent | Status |
|------------|---------------|--------|
| [phase/task name] | [self / implementer / validator] | completed / blocked / skipped |
| ... | ... | ... |
| browser-validation | browser-validator | completed / blocked / skipped |
