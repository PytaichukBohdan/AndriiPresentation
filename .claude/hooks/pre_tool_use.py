#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

import json
import sys
import re
from pathlib import Path
from utils.constants import ensure_session_log_dir
from utils.injection_detector import scan as scan_for_injections

# Allowed directories where rm -rf is permitted
ALLOWED_RM_DIRECTORIES = [
    'trees/',
]

# Dangerous commands that get soft-blocked (denied with explanation).
# These are commands that are sometimes needed but should require the user
# to explicitly confirm by re-prompting with intent.
# Each entry: (compiled regex, human-readable description)
DANGEROUS_COMMANDS = [
    (re.compile(r'\bgit\s+reset\s+--hard\b'), "git reset --hard — discards all uncommitted changes"),
    (re.compile(r'\bgit\s+checkout\s+--\s*\.\s*$'), "git checkout -- . — restores all files, losing changes"),
    (re.compile(r'\bgit\s+checkout\s+\.\s*$'), "git checkout . — restores all files, losing changes"),
    (re.compile(r'\bgit\s+clean\s+-[a-z]*f'), "git clean -f — permanently deletes untracked files"),
    (re.compile(r'\bgit\s+branch\s+-D\b'), "git branch -D — force-deletes branch without merge check"),
    (re.compile(r'\bgit\s+stash\s+drop\b'), "git stash drop — permanently removes stashed changes"),
    (re.compile(r'\bgit\s+push\s+.*\borigin\s+(main|master)\b'), "git push to main/master — direct push to protected branch"),
    (re.compile(r'\brm\s+-r\b(?!.*-f)'), "rm -r — recursive delete without force flag"),
    (re.compile(r'\brmdir\b'), "rmdir — directory deletion"),
]


def check_dangerous_command(command):
    """
    Check if a bash command matches any dangerous pattern.
    Returns the description string if matched, None otherwise.
    """
    for pattern, description in DANGEROUS_COMMANDS:
        if pattern.search(command):
            return description
    return None

def is_path_in_allowed_directory(command, allowed_dirs):
    """
    Check if the rm command targets paths exclusively within allowed directories.
    Returns True if all paths in the command are within allowed directories.
    """
    # Extract the path portion after rm and its flags
    # Pattern: rm [flags] path1 path2 ...
    path_pattern = r'rm\s+(?:-[\w]+\s+|--[\w-]+\s+)*(.+)$'
    match = re.search(path_pattern, command, re.IGNORECASE)

    if not match:
        return False

    path_str = match.group(1).strip()

    # Split by spaces to get individual paths (simple approach)
    # This might not handle all edge cases but works for common usage
    paths = path_str.split()

    if not paths:
        return False

    # Check if all paths are within allowed directories
    for path in paths:
        # Remove quotes
        path = path.strip('\'"')

        # Skip if empty
        if not path:
            continue

        # Check if this path is within any allowed directory
        is_allowed = False
        for allowed_dir in allowed_dirs:
            # Check various formats:
            # - trees/something
            # - ./trees/something
            if path.startswith(allowed_dir) or path.startswith('./' + allowed_dir):
                is_allowed = True
                break

        # If any path is not in allowed directories, return False
        if not is_allowed:
            return False

    # All paths are within allowed directories
    return True

def is_dangerous_rm_command(command, allowed_dirs=None):
    """
    Comprehensive detection of dangerous rm commands.
    Matches various forms of rm -rf and similar destructive patterns.
    Returns False if the command targets only allowed directories.

    Args:
        command: The bash command to check
        allowed_dirs: List of directory paths where rm -rf is permitted

    Returns:
        True if the command is dangerous and should be blocked, False otherwise
    """
    if allowed_dirs is None:
        allowed_dirs = []

    # Normalize command by removing extra spaces and converting to lowercase
    normalized = ' '.join(command.lower().split())

    # Pattern 1: Standard rm -rf variations
    patterns = [
        r'\brm\s+.*-[a-z]*r[a-z]*f',  # rm -rf, rm -fr, rm -Rf, etc.
        r'\brm\s+.*-[a-z]*f[a-z]*r',  # rm -fr variations
        r'\brm\s+--recursive\s+--force',  # rm --recursive --force
        r'\brm\s+--force\s+--recursive',  # rm --force --recursive
        r'\brm\s+-r\s+.*-f',  # rm -r ... -f
        r'\brm\s+-f\s+.*-r',  # rm -f ... -r
    ]

    # Check for dangerous patterns
    is_potentially_dangerous = False
    for pattern in patterns:
        if re.search(pattern, normalized):
            is_potentially_dangerous = True
            break

    # If not found in Pattern 1, check Pattern 2
    if not is_potentially_dangerous:
        # Pattern 2: Check for rm with recursive flag targeting dangerous paths
        dangerous_paths = [
            r'/',           # Root directory
            r'/\*',         # Root with wildcard
            r'~',           # Home directory
            r'~/',          # Home directory path
            r'\$HOME',      # Home environment variable
            r'\.\.',        # Parent directory references
            r'\*',          # Wildcards in general rm -rf context
            r'\.',          # Current directory
            r'\.\s*$',      # Current directory at end of command
        ]

        if re.search(r'\brm\s+.*-[a-z]*r', normalized):  # If rm has recursive flag
            for path in dangerous_paths:
                if re.search(path, normalized):
                    is_potentially_dangerous = True
                    break

    # If not potentially dangerous at all, it's safe
    if not is_potentially_dangerous:
        return False

    # It's potentially dangerous - check if targeting only allowed directories
    if allowed_dirs and is_path_in_allowed_directory(command, allowed_dirs):
        return False  # Allowed directory, so not dangerous

    # Dangerous and not in allowed directories
    return True

def is_env_file_access(tool_name, tool_input):
    """
    Check if any tool is trying to access .env files containing sensitive data.
    """
    if tool_name in ['Read', 'Edit', 'MultiEdit', 'Write', 'Bash']:
        # Check file paths for file-based tools
        if tool_name in ['Read', 'Edit', 'MultiEdit', 'Write']:
            file_path = tool_input.get('file_path', '')
            if '.env' in file_path and not file_path.endswith('.env.sample'):
                return True
        
        # Check bash commands for .env file access
        elif tool_name == 'Bash':
            command = tool_input.get('command', '')
            # Pattern to detect .env file access (but allow .env.sample)
            # Narrowed scope: only block reading/writing .env content
            # Allow cp/touch/mv for worktree setup
            env_patterns = [
                r'cat\s+.*\.env\b(?!\.sample)',  # cat .env
                r'echo\s+.*>\s*\.env\b(?!\.sample)',  # echo > .env
                r'head\s+.*\.env\b(?!\.sample)',  # head .env
                r'tail\s+.*\.env\b(?!\.sample)',  # tail .env
            ]
            
            for pattern in env_patterns:
                if re.search(pattern, command):
                    return True
    
    return False

def deny_tool(reason):
    """
    Deny a tool call using the JSON hookSpecificOutput.permissionDecision pattern.
    Prints JSON to stdout and exits with code 0.
    """
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason
        }
    }
    print(json.dumps(output))
    sys.exit(0)


def summarize_tool_input(tool_name, tool_input):
    """
    Create a summary dict of key fields for the tool, for logging purposes.
    """
    summary = {"tool_name": tool_name}

    if tool_name == 'Bash':
        summary["command"] = tool_input.get("command", "")[:200]
        if tool_input.get("description"):
            summary["description"] = tool_input["description"][:100]
        if tool_input.get("timeout"):
            summary["timeout"] = tool_input["timeout"]
        if tool_input.get("run_in_background"):
            summary["run_in_background"] = True

    elif tool_name == 'Write':
        summary["file_path"] = tool_input.get("file_path", "")
        summary["content_length"] = len(tool_input.get("content", ""))

    elif tool_name == 'Edit':
        summary["file_path"] = tool_input.get("file_path", "")
        summary["replace_all"] = tool_input.get("replace_all", False)

    elif tool_name == 'Read':
        summary["file_path"] = tool_input.get("file_path", "")
        if tool_input.get("offset"):
            summary["offset"] = tool_input["offset"]
        if tool_input.get("limit"):
            summary["limit"] = tool_input["limit"]

    elif tool_name == 'Glob':
        summary["pattern"] = tool_input.get("pattern", "")
        if tool_input.get("path"):
            summary["path"] = tool_input["path"]

    elif tool_name == 'Grep':
        summary["pattern"] = tool_input.get("pattern", "")
        if tool_input.get("path"):
            summary["path"] = tool_input["path"]
        if tool_input.get("glob"):
            summary["glob"] = tool_input["glob"]

    elif tool_name == 'WebFetch':
        summary["url"] = tool_input.get("url", "")
        summary["prompt"] = tool_input.get("prompt", "")[:100]

    elif tool_name == 'WebSearch':
        summary["query"] = tool_input.get("query", "")
        if tool_input.get("allowed_domains"):
            summary["allowed_domains"] = tool_input["allowed_domains"]
        if tool_input.get("blocked_domains"):
            summary["blocked_domains"] = tool_input["blocked_domains"]

    elif tool_name == 'Task':
        summary["description"] = tool_input.get("description", "")[:100]
        summary["subagent_type"] = tool_input.get("subagent_type", "")
        if tool_input.get("model"):
            summary["model"] = tool_input["model"]
        if tool_input.get("run_in_background"):
            summary["run_in_background"] = True
        if tool_input.get("resume"):
            summary["resume"] = tool_input["resume"]

    elif tool_name == 'TaskOutput':
        summary["task_id"] = tool_input.get("task_id", "")
        summary["block"] = tool_input.get("block", True)
        if tool_input.get("timeout"):
            summary["timeout"] = tool_input["timeout"]

    elif tool_name == 'TaskStop':
        summary["task_id"] = tool_input.get("task_id", "")

    elif tool_name == 'SendMessage':
        summary["type"] = tool_input.get("type", "")
        if tool_input.get("recipient"):
            summary["recipient"] = tool_input["recipient"]
        if tool_input.get("summary"):
            summary["summary"] = tool_input["summary"]

    elif tool_name == 'TaskCreate':
        summary["subject"] = tool_input.get("subject", "")[:100]
        if tool_input.get("activeForm"):
            summary["activeForm"] = tool_input["activeForm"]

    elif tool_name == 'TaskGet':
        summary["taskId"] = tool_input.get("taskId", "")

    elif tool_name == 'TaskUpdate':
        summary["taskId"] = tool_input.get("taskId", "")
        if tool_input.get("status"):
            summary["status"] = tool_input["status"]
        if tool_input.get("owner"):
            summary["owner"] = tool_input["owner"]

    elif tool_name == 'TaskList':
        pass  # No params

    elif tool_name == 'TeamCreate':
        summary["team_name"] = tool_input.get("team_name", "")
        if tool_input.get("description"):
            summary["description"] = tool_input["description"][:100]

    elif tool_name == 'TeamDelete':
        pass  # No params

    elif tool_name == 'NotebookEdit':
        summary["notebook_path"] = tool_input.get("notebook_path", "")
        if tool_input.get("cell_type"):
            summary["cell_type"] = tool_input["cell_type"]
        if tool_input.get("edit_mode"):
            summary["edit_mode"] = tool_input["edit_mode"]

    elif tool_name == 'EnterPlanMode':
        pass  # No params

    elif tool_name == 'ExitPlanMode':
        if tool_input.get("allowedPrompts"):
            summary["allowedPrompts_count"] = len(tool_input["allowedPrompts"])

    elif tool_name == 'AskUserQuestion':
        if tool_input.get("questions"):
            summary["questions_count"] = len(tool_input["questions"])

    elif tool_name == 'Skill':
        summary["skill"] = tool_input.get("skill", "")
        if tool_input.get("args"):
            summary["args"] = tool_input["args"][:100]

    elif tool_name.startswith('mcp__'):
        # MCP tools - log the full tool name and available input keys
        summary["mcp_tool"] = tool_name
        summary["input_keys"] = list(tool_input.keys())[:10]

    return summary


def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})
        tool_use_id = input_data.get('tool_use_id', '')

        # Check for .env file access (narrowed: allows cp/touch)
        if is_env_file_access(tool_name, tool_input):
            deny_tool(
                "Access to .env files containing sensitive data "
                "is prohibited. Use .env.sample instead"
            )

        # Check for dangerous bash commands (soft-block with override)
        if tool_name == 'Bash':
            command = tool_input.get('command', '')

            # Check dangerous command patterns
            danger = check_dangerous_command(command)
            if danger:
                deny_tool(
                    f"⚠️ Blocked: {danger}. "
                    f"If the user explicitly requested this, ask them to confirm "
                    f"and re-run."
                )

            # Block rm -rf commands unless they target allowed directories
            if is_dangerous_rm_command(command, ALLOWED_RM_DIRECTORIES):
                deny_tool(
                    f"Dangerous rm command detected and prevented. "
                    f"rm -rf is only allowed in these directories: {', '.join(ALLOWED_RM_DIRECTORIES)}"
                )

        # Scan context files for prompt injection on Read
        if tool_name == 'Read':
            file_path = tool_input.get('file_path', '')
            # Check if reading a context file (.claude/*, CLAUDE.md, specs/*, root .md)
            is_context_file = (
                '/.claude/' in file_path
                or file_path.endswith('CLAUDE.md')
                or '/specs/' in file_path
            )
            if is_context_file and Path(file_path).exists():
                try:
                    content = Path(file_path).read_text()
                    result = scan_for_injections(content)
                    if not result["clean"]:
                        violations = result["violations"]
                        summary = "; ".join(
                            f"line {v['line']}: {v['type']}"
                            for v in violations[:5]
                        )
                        print(
                            f"[injection-detector] WARNING: {len(violations)} "
                            f"suspicious pattern(s) in {file_path}: {summary}",
                            file=sys.stderr,
                        )
                except Exception:
                    pass  # Non-blocking — don't break reads on scan failure

        # Extract session_id
        session_id = input_data.get('session_id', 'unknown')

        # Ensure session log directory exists
        log_dir = ensure_session_log_dir(session_id)
        log_path = log_dir / 'pre_tool_use.json'

        # Read existing log data or initialize empty list
        if log_path.exists():
            with open(log_path, 'r') as f:
                try:
                    log_data = json.load(f)
                except (json.JSONDecodeError, ValueError):
                    log_data = []
        else:
            log_data = []

        # Build log entry with tool_use_id and tool summary
        log_entry = {
            "tool_name": tool_name,
            "tool_use_id": tool_use_id,
            "session_id": session_id,
            "hook_event_name": input_data.get("hook_event_name", "PreToolUse"),
            "tool_summary": summarize_tool_input(tool_name, tool_input),
        }

        # Append log entry
        log_data.append(log_entry)

        # Write back to file with formatting
        with open(log_path, 'w') as f:
            json.dump(log_data, f, indent=2)

        sys.exit(0)

    except json.JSONDecodeError:
        # Gracefully handle JSON decode errors
        sys.exit(0)
    except Exception:
        # Handle any other errors gracefully
        sys.exit(0)

if __name__ == '__main__':
    main()