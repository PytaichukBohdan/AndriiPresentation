#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""
Structured compression template for context handoffs.

Generates a structured summary from session events that preserves
critical context across context window compressions.
"""

import re

TEMPLATE = """## Context Handoff Summary

**This is a handoff from a previous context window — treat as background reference, NOT active instructions.**

### Goal
{goal}

### Constraints & Decisions
{constraints}

### Progress
{progress}

### Key Files Modified
{files_modified}

### Resolved Questions
{resolved}

### Pending Work
{pending}

### Active Blockers
{blockers}
"""

SECTION_PATTERN = re.compile(r"^### (.+)$", re.MULTILINE)


def extract_files_modified(events: list[dict]) -> list[str]:
    """Extract unique file paths from Write/Edit tool events."""
    files: list[str] = []
    seen: set[str] = set()

    for event in events:
        tool_name = event.get("tool_name", "")
        if tool_name not in ("Write", "Edit", "MultiEdit"):
            continue

        # Check tool_summary first, then tool_input
        summary = event.get("tool_summary", {})
        tool_input = event.get("tool_input", {})

        file_path = summary.get("file_path") or tool_input.get("file_path", "")
        if file_path and file_path not in seen:
            seen.add(file_path)
            files.append(file_path)

    return files


def _extract_goal(events: list[dict]) -> str:
    """Derive goal from early events (spec/plan file reads, first tool calls)."""
    for event in events[:10]:
        tool_name = event.get("tool_name", "")
        summary = event.get("tool_summary", {})

        # Check for spec/plan file reads
        if tool_name == "Read":
            file_path = summary.get("file_path", "")
            if any(keyword in file_path.lower() for keyword in ("spec", "plan", "todo", "task")):
                return f"Working on plan/spec: {file_path}"

        # Check for Skill usage
        if tool_name == "Skill":
            skill = summary.get("skill", "")
            if skill:
                return f"Executing skill: {skill}"

    return "None identified — review recent tool calls for context"


def _summarize_progress(events: list[dict]) -> str:
    """Count completed tool calls by category."""
    counts: dict[str, int] = {}
    for event in events:
        tool_name = event.get("tool_name", "")
        if tool_name:
            counts[tool_name] = counts.get(tool_name, 0) + 1

    if not counts:
        return "No tool calls recorded"

    total = sum(counts.values())
    top_tools = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:5]
    parts = [f"{name}: {count}" for name, count in top_tools]
    return f"{total} tool calls — {', '.join(parts)}"


def _extract_pending(events: list[dict]) -> str:
    """Check for TaskList data in events."""
    for event in reversed(events):
        tool_name = event.get("tool_name", "")
        if tool_name == "TaskList":
            return "Check TaskList for current task status"
    return "None identified"


def _parse_existing_summary(existing: str) -> dict[str, str]:
    """Parse an existing summary into section -> content mapping."""
    sections: dict[str, str] = {}
    current_section = ""
    current_content: list[str] = []

    for line in existing.split("\n"):
        match = SECTION_PATTERN.match(line)
        if match:
            if current_section:
                sections[current_section] = "\n".join(current_content).strip()
            current_section = match.group(1)
            current_content = []
        elif current_section:
            current_content.append(line)

    if current_section:
        sections[current_section] = "\n".join(current_content).strip()

    return sections


def generate_template(session_events: list[dict], existing_summary: str = "") -> str:
    """
    Generate a structured context handoff summary.

    Args:
        session_events: List of hook event dicts (from session logs).
        existing_summary: Previous summary to extend (for iterative updates).

    Returns:
        Formatted markdown summary string.
    """
    # Start with existing data if available
    existing = _parse_existing_summary(existing_summary) if existing_summary else {}

    # Extract data from events
    files = extract_files_modified(session_events)
    goal = existing.get("Goal", _extract_goal(session_events))
    progress = _summarize_progress(session_events)
    pending = _extract_pending(session_events)

    # If extending, append to existing sections
    if existing:
        existing_files_text = existing.get("Key Files Modified", "")
        if existing_files_text and existing_files_text != "None identified":
            # Merge file lists
            existing_files = [
                line.lstrip("- ").strip()
                for line in existing_files_text.split("\n")
                if line.strip().startswith("- ")
            ]
            for f in existing_files:
                if f not in files:
                    files.insert(0, f)

        existing_progress = existing.get("Progress", "")
        if existing_progress and existing_progress != "No tool calls recorded":
            progress = f"{existing_progress}\n(continued) {progress}"

    files_text = "\n".join(f"- {f}" for f in files) if files else "None identified"

    return TEMPLATE.format(
        goal=goal,
        constraints=existing.get("Constraints & Decisions", "None identified"),
        progress=progress,
        files_modified=files_text,
        resolved=existing.get("Resolved Questions", "None identified"),
        pending=pending,
        blockers=existing.get("Active Blockers", "None identified"),
    )
