#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""
Exit code interpreter for common CLI tools.

Maps tool + exit_code combinations to human-readable explanations,
preventing agents from wasting turns investigating expected non-zero exits.
"""

import re


# Mapping: command_name -> {exit_code: explanation}
EXIT_CODE_MAP: dict[str, dict[int, str]] = {
    "grep": {
        1: "No matches found (not an error)",
        2: "Syntax error in pattern or I/O error",
    },
    "rg": {
        1: "No matches found (not an error)",
        2: "Some error occurred (pattern syntax, I/O, etc.)",
    },
    "diff": {
        1: "Files differ (expected behavior when comparing different files)",
        2: "File not found or error accessing files",
    },
    "test": {
        1: "Condition is false (not an error — this is normal boolean logic)",
    },
    "[": {
        1: "Condition is false (not an error — this is normal boolean logic)",
    },
    "git": {
        1: "Generic git error or changes exist (for git diff)",
        128: "Fatal git error (bad ref, not a repo, etc.)",
    },
    "curl": {
        6: "DNS resolution failed — could not resolve host",
        7: "Connection refused — server not listening on that port",
        22: "HTTP error response (4xx or 5xx status code)",
        28: "Operation timed out",
        35: "SSL/TLS handshake failed",
        47: "Too many redirects",
        56: "Failure in receiving network data",
    },
    "python": {
        1: "Runtime error (exception raised during execution)",
        2: "Syntax error or invalid usage of command-line arguments",
    },
    "python3": {
        1: "Runtime error (exception raised during execution)",
        2: "Syntax error or invalid usage of command-line arguments",
    },
    "npm": {
        1: "Generic npm error — check stderr for details",
        2: "npm internal error (unexpected failure in npm itself)",
    },
    "bun": {
        1: "Generic error — check stderr for details",
    },
    "make": {
        1: "Target recipe failed",
        2: "Error in Makefile (syntax or missing target)",
    },
    "ruff": {
        1: "Lint issues found in checked files",
        2: "Invalid command-line arguments",
    },
    "mypy": {
        1: "Type errors found in checked files",
        2: "Command-line usage error",
    },
    "ty": {
        1: "Type errors found in checked files",
    },
    "pytest": {
        1: "Tests were collected and run but some failed",
        2: "Test execution was interrupted by the user",
        3: "Internal error during test collection",
        4: "pytest command line usage error",
        5: "No tests were collected",
    },
    "cargo": {
        101: "Rust compilation or test failure",
    },
    "go": {
        1: "Build or test failure",
        2: "Go tool usage error",
    },
    "docker": {
        1: "Generic Docker error",
        125: "Docker daemon error",
        126: "Container command cannot be invoked",
        127: "Container command not found",
    },
}

# Signal exit codes (128 + signal number)
SIGNAL_CODES: dict[int, str] = {
    130: "Process interrupted by SIGINT (Ctrl+C)",
    137: "Process killed by SIGKILL (likely OOM killer or manual kill)",
    139: "Segmentation fault (SIGSEGV)",
    141: "Broken pipe (SIGPIPE)",
    143: "Process terminated by SIGTERM",
}


def _extract_command_name(command: str) -> str:
    """Extract the base command name from a full command string."""
    # Strip leading environment variables (FOO=bar cmd)
    stripped = re.sub(r"^(\w+=\S+\s+)*", "", command.strip())
    # Strip sudo, env, nice, etc.
    stripped = re.sub(r"^(sudo|env|nice|nohup|time)\s+", "", stripped)
    # Get first token
    parts = stripped.split()
    if not parts:
        return ""
    base = parts[0]
    # Handle paths: /usr/bin/python3 -> python3
    base = base.rsplit("/", 1)[-1]
    return base


def interpret(tool_name: str, command: str, exit_code: int) -> str | None:
    """
    Interpret a tool's exit code and return a human-readable explanation.

    Args:
        tool_name: The Claude tool that ran (e.g., "Bash")
        command: The actual command string executed
        exit_code: The process exit code

    Returns:
        A human-readable explanation, or None if unrecognized.
    """
    if exit_code == 0:
        return None  # Success needs no interpretation

    # Check signal codes first (apply to any command)
    if exit_code in SIGNAL_CODES:
        return SIGNAL_CODES[exit_code]

    cmd_name = _extract_command_name(command)
    if not cmd_name:
        return None

    # Special case: git subcommands
    if cmd_name == "git":
        parts = command.strip().split()
        git_idx = next((i for i, p in enumerate(parts) if p.endswith("git")), -1)
        if git_idx >= 0 and git_idx + 1 < len(parts):
            subcmd = parts[git_idx + 1]
            if subcmd == "diff" and exit_code == 1:
                return "Changes exist between compared refs (this is expected behavior, not an error)"

    # Look up in the map
    cmd_map = EXIT_CODE_MAP.get(cmd_name)
    if cmd_map and exit_code in cmd_map:
        return cmd_map[exit_code]

    return None
