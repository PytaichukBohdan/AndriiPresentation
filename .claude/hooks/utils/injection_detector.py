#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""
Prompt injection pattern scanner for context files.

Scans content for instruction override attempts, deception directives,
hidden unicode, credential exfiltration patterns, and base64-encoded injections.
"""

import base64
import re
import sys
from typing import Any


# Pattern categories with compiled regexes
INSTRUCTION_OVERRIDE_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?previous\s+instructions", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?(above|previous|prior)", re.IGNORECASE),
    re.compile(r"new\s+system\s+prompt", re.IGNORECASE),
    re.compile(r"forget\s+everything", re.IGNORECASE),
    re.compile(r"override\s+(your\s+)?instructions", re.IGNORECASE),
    re.compile(r"you\s+are\s+now\s+(?:a|an)\s+", re.IGNORECASE),
    re.compile(r"act\s+as\s+if\s+you\s+have\s+no\s+restrictions", re.IGNORECASE),
    re.compile(r"from\s+now\s+on,?\s+ignore", re.IGNORECASE),
]

DECEPTION_PATTERNS = [
    re.compile(r"do\s+not\s+tell\s+the\s+user", re.IGNORECASE),
    re.compile(r"hide\s+this\s+from", re.IGNORECASE),
    re.compile(r"pretend\s+(that\s+)?this", re.IGNORECASE),
    re.compile(r"secretly\s+", re.IGNORECASE),
    re.compile(r"without\s+the\s+user\s+knowing", re.IGNORECASE),
    re.compile(r"don't\s+mention\s+this\s+to", re.IGNORECASE),
    re.compile(r"never\s+reveal\s+this", re.IGNORECASE),
]

HIDDEN_CONTENT_PATTERNS = [
    re.compile(r"<!--.*?-->", re.DOTALL),  # HTML comments
]

# Invisible unicode characters
INVISIBLE_CHARS = {
    "\u200b": "zero-width space (U+200B)",
    "\ufeff": "byte order mark (U+FEFF)",
    "\u200c": "zero-width non-joiner (U+200C)",
    "\u200d": "zero-width joiner (U+200D)",
    "\u2060": "word joiner (U+2060)",
    "\u180e": "mongolian vowel separator (U+180E)",
}

CREDENTIAL_EXFIL_PATTERNS = [
    re.compile(r"curl\s+.*(?:API_KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)", re.IGNORECASE),
    re.compile(r"cat\s+\.env\b", re.IGNORECASE),
    re.compile(r"echo\s+.*(?:SECRET|API_KEY|TOKEN|PASSWORD)", re.IGNORECASE),
    re.compile(r"wget\s+.*(?:token|secret|key|password)", re.IGNORECASE),
    re.compile(r"curl\s+.*(?:password|passwd|secret)", re.IGNORECASE),
    re.compile(r"base64\s+.*\.env", re.IGNORECASE),
    re.compile(r"env\s*\|\s*(?:curl|wget|nc)\b", re.IGNORECASE),
]

# Base64 pattern: at least 20 chars of valid base64
BASE64_PATTERN = re.compile(r"[A-Za-z0-9+/]{20,}={0,2}")


def _check_base64_injections(content: str, line_num: int, violations: list[dict[str, Any]]) -> None:
    """Check if any base64-encoded strings decode to injection patterns."""
    for match in BASE64_PATTERN.finditer(content):
        candidate = match.group(0)
        try:
            decoded = base64.b64decode(candidate).decode("utf-8", errors="ignore")
        except Exception:
            continue

        # Check decoded content against injection patterns
        for pattern in INSTRUCTION_OVERRIDE_PATTERNS + DECEPTION_PATTERNS + CREDENTIAL_EXFIL_PATTERNS:
            if pattern.search(decoded):
                violations.append({
                    "type": "base64_injection",
                    "pattern": f"base64 decodes to: {decoded[:80]}",
                    "line": line_num,
                    "snippet": candidate[:60],
                })
                break


def scan(content: str) -> dict[str, Any]:
    """
    Scan content for prompt injection patterns.

    Args:
        content: The text content to scan.

    Returns:
        {"clean": bool, "violations": [{"type": str, "pattern": str, "line": int, "snippet": str}]}
    """
    violations: list[dict[str, Any]] = []
    lines = content.split("\n")

    for line_num, line in enumerate(lines, start=1):
        # Instruction overrides
        for pattern in INSTRUCTION_OVERRIDE_PATTERNS:
            match = pattern.search(line)
            if match:
                violations.append({
                    "type": "instruction_override",
                    "pattern": pattern.pattern,
                    "line": line_num,
                    "snippet": match.group(0)[:80],
                })

        # Deception directives
        for pattern in DECEPTION_PATTERNS:
            match = pattern.search(line)
            if match:
                violations.append({
                    "type": "deception_directive",
                    "pattern": pattern.pattern,
                    "line": line_num,
                    "snippet": match.group(0)[:80],
                })

        # Hidden HTML comments
        for pattern in HIDDEN_CONTENT_PATTERNS:
            match = pattern.search(line)
            if match:
                violations.append({
                    "type": "hidden_content",
                    "pattern": "HTML comment",
                    "line": line_num,
                    "snippet": match.group(0)[:80],
                })

        # Invisible unicode
        for char, description in INVISIBLE_CHARS.items():
            if char in line:
                violations.append({
                    "type": "hidden_unicode",
                    "pattern": description,
                    "line": line_num,
                    "snippet": repr(line[:80]),
                })

        # Credential exfiltration
        for pattern in CREDENTIAL_EXFIL_PATTERNS:
            match = pattern.search(line)
            if match:
                violations.append({
                    "type": "credential_exfiltration",
                    "pattern": pattern.pattern,
                    "line": line_num,
                    "snippet": match.group(0)[:80],
                })

        # Base64-encoded injections
        _check_base64_injections(line, line_num, violations)

    result = {"clean": len(violations) == 0, "violations": violations}

    # Log violations to stderr for telemetry
    if violations:
        print(f"[injection_detector] Found {len(violations)} violation(s):", file=sys.stderr)
        for v in violations:
            print(f"  Line {v['line']}: {v['type']} — {v['snippet']}", file=sys.stderr)

    return result
