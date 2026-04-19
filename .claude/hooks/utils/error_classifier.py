#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""
Error classifier with 14-category taxonomy and recovery hints.

Classifies tool failures by analyzing stderr output and exit codes,
providing actionable recovery suggestions to the agent.
"""

import re
from dataclasses import dataclass


@dataclass
class ErrorClassification:
    category: str
    severity: str          # "critical", "error", "warning", "info"
    retryable: bool
    recovery_hint: str
    should_compress: bool  # whether this error should trigger context compression


# Each entry: (category, patterns, severity, retryable, recovery_hint, should_compress)
_CATEGORIES: list[tuple[str, list[re.Pattern], str, bool, str, bool]] = [
    (
        "rate_limit",
        [
            re.compile(r"\b429\b", re.IGNORECASE),
            re.compile(r"rate.?limit", re.IGNORECASE),
            re.compile(r"throttl", re.IGNORECASE),
            re.compile(r"too many requests", re.IGNORECASE),
            re.compile(r"quota exceeded", re.IGNORECASE),
        ],
        "critical",
        True,
        "Wait and retry, or check quota",
        False,
    ),
    (
        "auth_error",
        [
            re.compile(r"permission denied", re.IGNORECASE),
            re.compile(r"\b403\b"),
            re.compile(r"\b401\b"),
            re.compile(r"unauthorized", re.IGNORECASE),
            re.compile(r"access denied", re.IGNORECASE),
            re.compile(r"EACCES"),
        ],
        "critical",
        False,
        "Check credentials, API keys, or file permissions",
        False,
    ),
    (
        "context_overflow",
        [
            re.compile(r"context.?length", re.IGNORECASE),
            re.compile(r"token.?limit", re.IGNORECASE),
            re.compile(r"too long", re.IGNORECASE),
            re.compile(r"maximum context", re.IGNORECASE),
            re.compile(r"max.?tokens", re.IGNORECASE),
        ],
        "critical",
        False,
        "Reduce input size or compress context",
        True,
    ),
    (
        "disk_full",
        [
            re.compile(r"no space left", re.IGNORECASE),
            re.compile(r"ENOSPC"),
            re.compile(r"disk full", re.IGNORECASE),
        ],
        "critical",
        False,
        "Free disk space",
        False,
    ),
    (
        "timeout",
        [
            re.compile(r"timed?\s*out", re.IGNORECASE),
            re.compile(r"ETIMEDOUT"),
            re.compile(r"deadline exceeded", re.IGNORECASE),
        ],
        "error",
        True,
        "Increase timeout or optimize operation",
        False,
    ),
    (
        "network_error",
        [
            re.compile(r"ECONNREFUSED"),
            re.compile(r"ECONNRESET"),
            re.compile(r"connection refused", re.IGNORECASE),
            re.compile(r"network.?(error|unreachable)", re.IGNORECASE),
            re.compile(r"\bDNS\b", re.IGNORECASE),
            re.compile(r"getaddrinfo", re.IGNORECASE),
        ],
        "error",
        True,
        "Check connectivity, URL, or proxy settings",
        False,
    ),
    (
        "import_error",
        [
            re.compile(r"ImportError", re.IGNORECASE),
            re.compile(r"ModuleNotFoundError", re.IGNORECASE),
            re.compile(r"cannot find module", re.IGNORECASE),
            re.compile(r"No module named", re.IGNORECASE),
        ],
        "error",
        False,
        "Install with uv add or bun add",
        False,
    ),
    (
        "not_found",
        [
            re.compile(r"not found", re.IGNORECASE),
            re.compile(r"no such file", re.IGNORECASE),
            re.compile(r"command not found", re.IGNORECASE),
            re.compile(r"ENOENT"),
            re.compile(r"\b404\b"),
        ],
        "error",
        False,
        "Check path, install dependency, or verify name",
        False,
    ),
    (
        "syntax_error",
        [
            re.compile(r"SyntaxError"),
            re.compile(r"syntax error", re.IGNORECASE),
            re.compile(r"parse error", re.IGNORECASE),
            re.compile(r"unexpected token", re.IGNORECASE),
        ],
        "error",
        False,
        "Fix syntax at indicated location",
        False,
    ),
    (
        "type_error",
        [
            re.compile(r"TypeError"),
            re.compile(r"type error", re.IGNORECASE),
            re.compile(r"expected.*got", re.IGNORECASE),
            re.compile(r"incompatible type", re.IGNORECASE),
        ],
        "error",
        False,
        "Check argument types and function signatures",
        False,
    ),
    (
        "conflict",
        [
            re.compile(r"CONFLICT", re.IGNORECASE),
            re.compile(r"merge conflict", re.IGNORECASE),
            re.compile(r"lock.?file", re.IGNORECASE),
            re.compile(r"already exists.*EEXIST", re.IGNORECASE),
        ],
        "warning",
        False,
        "Resolve conflict manually",
        False,
    ),
    (
        "validation_error",
        [
            re.compile(r"\blint\b", re.IGNORECASE),
            re.compile(r"type.?check", re.IGNORECASE),
            re.compile(r"test.?fail", re.IGNORECASE),
            re.compile(r"AssertionError|AssertionError", re.IGNORECASE),
            re.compile(r"assertion.?failed", re.IGNORECASE),
        ],
        "warning",
        False,
        "Fix reported issues",
        False,
    ),
    (
        "configuration_error",
        [
            re.compile(r"invalid.?config", re.IGNORECASE),
            re.compile(r"missing.?key", re.IGNORECASE),
            re.compile(r"bad.?value", re.IGNORECASE),
            re.compile(r"\bYAML\b.*error", re.IGNORECASE),
            re.compile(r"\bJSON\b.*error", re.IGNORECASE),
            re.compile(r"\bTOML\b.*error", re.IGNORECASE),
            re.compile(r"configuration", re.IGNORECASE),
        ],
        "warning",
        False,
        "Check configuration file syntax and values",
        False,
    ),
]


def classify(tool_name: str, exit_code: int, stderr: str) -> ErrorClassification:
    """
    Classify a tool failure into one of 14 error categories.

    Args:
        tool_name: The tool that failed (e.g., "Bash", "Write")
        exit_code: The process exit code
        stderr: The stderr output from the failed tool

    Returns:
        ErrorClassification with category, severity, retryable flag, recovery hint,
        and whether context compression should be triggered.
    """
    for category, patterns, severity, retryable, hint, should_compress in _CATEGORIES:
        for pattern in patterns:
            if pattern.search(stderr):
                return ErrorClassification(
                    category=category,
                    severity=severity,
                    retryable=retryable,
                    recovery_hint=hint,
                    should_compress=should_compress,
                )

    return ErrorClassification(
        category="unknown",
        severity="info",
        retryable=False,
        recovery_hint="Investigate error output for clues",
        should_compress=False,
    )
