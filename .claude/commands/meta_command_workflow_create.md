---
allowed-tools: Write, Edit, WebFetch, Task, mcp__firecrawl-mcp__firecrawl_scrape, Fetch
description: Create a new Claude Code slash command following the full-featured pipeline format
model: opus
---

# MetaCommand Workflow Create

Based on the `High Level Prompt`, follow the `Workflow` to create a new slash command in the `Specified Format`. Before starting, WebFetch everything in the `Documentation` section. The generated command must follow the full-featured pipeline format with all required sections and any applicable optional sections.

## Variables

HIGH_LEVEL_PROMPT: $ARGUMENTS

## Instructions

- Use one Task tool per documentation item to fetch all docs in parallel before writing a single line of the command.
- Ultra Think — you are writing a prompt that will drive other AI agents. The quality of what you produce directly determines the quality of their work. Think carefully before writing.
- The generated command must follow the `Specified Format` exactly. Do not add sections not listed there. Do not omit required sections.
- Replace every `<some request>` placeholder in the Specified Format template with content appropriate to the `High Level Prompt`.
- Choose a command name that clearly describes what the command does. Save to `.claude/commands/<name>.md`.
- If the `High Level Prompt` mentions multiple input arguments, give each a separate `## Variables` entry with `$1`, `$2`, etc. (index notation preferred over `$ARGUMENTS`). Dynamic variables come first; static variables come second.
- If no variables are needed, omit the `## Variables` section entirely.
- For commands that interact with feature sessions, accept `SESSION_DIR: $1` as the primary input variable.
- Mark optional sections clearly in the template comment — `## Team Orchestration` and `## Task Tracking` are optional. All other sections are required.
- Think through which sections of the Specified Format apply: a simple single-agent command may not need Team Orchestration or Task Tracking; a pipeline command always needs both.
- The Iron Law block must be ONE sentence — the command's core invariant, stated as an absolute rule in a code block.
- The Announcement must be a commitment device: a quoted sentence the agent says before starting work, following the pattern `"I'm using /[command] to [action]."`.
- Red Flags must be a bullet list of thoughts or impulses that should cause the agent to pause and reconsider.
- The Report section must describe exactly what output the agent should produce and in what format.

## The Iron Law

```
EVERY GENERATED COMMAND MUST FOLLOW THE SPECIFIED FORMAT — NO EXCEPTIONS.
```

A generated command missing required sections is not a command — it is a stub. Start over.

## Red Flags

- Generating a command without reading the Documentation first
- Writing the command file before Ultra Thinking through the structure
- Omitting `## Instructions`, `## The Iron Law`, `## Red Flags`, or `## Announcement (MANDATORY)` from a non-trivial command
- Adding sections not in the Specified Format
- Using `$ARGUMENTS` when multiple indexed arguments were requested
- Forgetting to include `model: opus` in the frontmatter
- Creating a `## Variables` section when no variables are needed
- Leaving placeholder text (`<some request>`) in the final output
- Making the Iron Law more than one sentence

## Announcement (MANDATORY)

Before writing the command file, announce:

"I'm using /meta_command_workflow_create to build the [command name] command. I will fetch documentation in parallel, then author the full-featured command following the Specified Format."

This creates commitment. Skipping this step means you will likely skip other steps.

## Documentation

Slash Command Documentation: https://docs.anthropic.com/en/docs/claude-code/slash-commands
Create Custom Slash Commands: https://docs.anthropic.com/en/docs/claude-code/common-workflows#create-custom-slash-commands
Available Tools and Settings: https://docs.anthropic.com/en/docs/claude-code/settings

## ai_docs/ Awareness

When the generated command interacts with feature sessions stored in `ai_docs/`, follow these conventions:

- **SESSION_DIR input**: Commands that operate on a session should accept `SESSION_DIR: $1` as their primary variable. This is the path to the session folder (e.g., `ai_docs/my-feature/`).
- **Output subdirectories**: Commands that produce output (reports, screenshots, generated files) should write into a named subdirectory of `SESSION_DIR` (e.g., `SESSION_DIR/testing_results/`, `SESSION_DIR/browser_validation/`).
- **Spec lifecycle tracking**: Commands that complete a lifecycle phase should update the `## Post-Implementation Record` section of `SESSION_DIR/implementation_spec.md` using the Edit tool to record completion status, timestamps, and key findings.

## Workflow

1. **Announce** — say the Announcement sentence before doing any work.

2. **Fetch Documentation** — use one Task tool call per URL in the `Documentation` section to fetch all docs in parallel. Do not proceed until all fetches complete.

3. **Ultra Think** — reason through the following before writing:
   - What is the command's purpose and who will use it?
   - What are the required inputs (variables)?
   - Which sections are required vs optional for this command?
   - Does this command operate on a session (`SESSION_DIR`)? If so, what outputs does it write?
   - What is the single-sentence Iron Law for this command?
   - What thoughts or impulses should the executing agent guard against (Red Flags)?
   - What does a good Report look like for this command?

4. **Draft the command** following the `Specified Format`:
   - Write the frontmatter (allowed-tools, description, argument-hint, model: opus)
   - Write the title and purpose paragraph
   - Write `## Variables` (skip if no variables needed)
   - Write `## Instructions` (required — bullet list of behavioral rules)
   - Write `## The Iron Law` (required — one sentence in a code block)
   - Write `## Red Flags` (required — bullet list of stop-and-reconsider thoughts)
   - Write `## Announcement (MANDATORY)` (required — commitment sentence in quotes)
   - Write `## Task Tracking` (optional — include only if command uses TaskCreate/TaskUpdate)
   - Write `## Team Orchestration` (optional — include only if command deploys sub-agents)
   - Write `## Workflow` (required — numbered steps)
   - Write `## Report` (required — description of output format)

5. **Save** the file to `.claude/commands/<name>.md`. Confirm the file was written.

## Specified Format

```md
---
allowed-tools: <allowed-tools comma separated>
description: <one-line description used to identify this command>
argument-hint: [<hint for first dynamic variable>], [<hint for second dynamic variable>]
model: opus
---

# <CommandName>

<Purpose paragraph: describe what the command does and reference its key sections. Every command must have an `## Instructions` section with behavioral rules as a bullet point list.>

## Variables

<NAME_OF_DYNAMIC_VARIABLE>: $1
<NAME_OF_DYNAMIC_VARIABLE>: $2
<NAME_OF_STATIC_VARIABLE>: <static value>

## Instructions

- <Behavioral rule 1 — what the agent must do>
- <Behavioral rule 2 — constraints and requirements>
- <Reference any skills the agent should follow>

## The Iron Law

```
<ONE SENTENCE: the command's core invariant, stated as an absolute rule>
```

<One paragraph elaborating on the law and its consequences.>

## Red Flags

- <Thought or impulse that should trigger a pause>
- <Another stop-and-reconsider pattern>

## Announcement (MANDATORY)

Before starting work, announce:

"I'm using /<command-name> to <action>. I will follow the workflow exactly and <verification commitment>."

This creates commitment. Skipping this step = likely to skip other steps.

## Task Tracking (optional — include only if command uses TaskCreate/TaskUpdate)

<Describe the task lifecycle: how tasks are created, updated, and completed. Reference TaskCreate, TaskUpdate, TaskList, TaskGet as appropriate.>

## Team Orchestration (optional — include only if command deploys sub-agents)

<Describe how sub-agents are deployed: which agent files to use, what work is delegated, how results are collected.>

## Workflow

<Numbered list of steps the agent executes to accomplish the command's purpose.>

## Report

<Describe the exact format and content of the agent's final output: bullet summary, file paths written, tables, evidence required.>
```

## Report

After creating the command:

- Confirm the file path where the command was saved
- List every section included and note which optional sections were added or omitted (with reason)
- Show the first 10 lines of the frontmatter as confirmation
