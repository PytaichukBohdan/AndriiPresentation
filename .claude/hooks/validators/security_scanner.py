# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Security scanner validator for agent-written Python files.

Scans for OWASP-style vulnerabilities after Write/Edit operations on .py files.
Always exits 0 to avoid blocking Claude Code. Findings are advisory only.
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path


SECURITY_RULES: list[dict] = [
    {
        "id": "SEC001",
        "name": "eval_exec",
        "pattern": re.compile(r"\b(eval|exec)\s*\("),
        "confidence": "HIGH",
        "message": "Use of eval()/exec() — can execute arbitrary code. Consider ast.literal_eval() or safer alternatives.",
    },
    {
        "id": "SEC002",
        "name": "subprocess_shell",
        "pattern": re.compile(r"subprocess\.\w+\(.*shell\s*=\s*True", re.DOTALL),
        "confidence": "HIGH",
        "message": "subprocess with shell=True — vulnerable to shell injection. Use shell=False with a list of arguments.",
    },
    {
        "id": "SEC003",
        "name": "os_system",
        "pattern": re.compile(r"\bos\.system\s*\("),
        "confidence": "HIGH",
        "message": "os.system() usage — vulnerable to shell injection. Use subprocess.run() with shell=False instead.",
    },
    {
        "id": "SEC004",
        "name": "pickle_load",
        "pattern": re.compile(r"\bpickle\.(loads?|Unpickler)\s*\("),
        "confidence": "HIGH",
        "message": "pickle.load()/loads() — can execute arbitrary code during deserialization. Use json or safer alternatives.",
    },
    {
        "id": "SEC005",
        "name": "sql_injection",
        "pattern": re.compile(r"""(f["']|\.format\s*\().*\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b""", re.IGNORECASE),
        "confidence": "MEDIUM",
        "message": "SQL query with string formatting — vulnerable to SQL injection. Use parameterized queries.",
    },
    {
        "id": "SEC006",
        "name": "unsafe_yaml",
        "pattern": re.compile(r"yaml\.load\s*\([^)]*\)(?!.*Loader\s*=\s*(?:Safe|Full)Loader)"),
        "confidence": "MEDIUM",
        "message": "yaml.load() without SafeLoader — can execute arbitrary Python. Use yaml.safe_load() or Loader=SafeLoader.",
    },
    {
        "id": "SEC007",
        "name": "hardcoded_secret",
        "pattern": re.compile(
            r"""(?:api_key|apikey|secret|password|passwd|token|auth_token|access_key|private_key)\s*=\s*["'][^"']{8,}["']""",
            re.IGNORECASE,
        ),
        "confidence": "MEDIUM",
        "message": "Possible hardcoded secret — use environment variables or a secrets manager instead.",
    },
    {
        "id": "SEC008",
        "name": "world_writable",
        "pattern": re.compile(r"os\.chmod\s*\(.*0o?777\)"),
        "confidence": "LOW",
        "message": "Setting world-writable permissions (0o777) — use more restrictive permissions.",
    },
    {
        "id": "SEC009",
        "name": "unsafe_tempfile",
        "pattern": re.compile(r"tempfile\.mktemp\s*\("),
        "confidence": "LOW",
        "message": "tempfile.mktemp() is insecure (race condition). Use tempfile.mkstemp() or tempfile.NamedTemporaryFile().",
    },
]


def get_log_dir() -> Path:
    import os
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")
    log_dir = Path(project_dir) / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    return log_dir


def log(message: str) -> None:
    log_dir = get_log_dir()
    log_file = log_dir / "security_scanner.log"
    timestamp = datetime.now().isoformat()
    with open(log_file, "a") as f:
        f.write(f"[{timestamp}] {message}\n")


def extract_file_path(hook_data: dict) -> str | None:
    """Extract file path from PostToolUse hook data."""
    try:
        tool_name = hook_data.get("tool_name", "")
        tool_input = hook_data.get("tool_input", {})
        if tool_name in ("Write", "Edit"):
            return tool_input.get("file_path")
        return None
    except (KeyError, TypeError):
        return None


def scan_file(file_path: str) -> list[dict]:
    """Scan a Python file for security vulnerabilities."""
    findings: list[dict] = []
    try:
        with open(file_path, "r") as f:
            lines = f.readlines()
    except OSError:
        return findings

    for line_num, line in enumerate(lines, start=1):
        stripped = line.strip()
        # Skip comments
        if stripped.startswith("#"):
            continue

        for rule in SECURITY_RULES:
            if rule["pattern"].search(line):
                findings.append({
                    "rule": rule["id"],
                    "name": rule["name"],
                    "line": line_num,
                    "confidence": rule["confidence"],
                    "message": rule["message"],
                    "source": stripped[:120],
                })
    return findings


def main() -> None:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            sys.exit(0)

        hook_data = json.loads(raw)
        file_path = extract_file_path(hook_data)

        if not file_path or not file_path.endswith(".py"):
            sys.exit(0)

        if not Path(file_path).exists():
            log(f"File not found: {file_path}")
            sys.exit(0)

        log(f"Scanning: {file_path}")
        findings = scan_file(file_path)

        if findings:
            log(f"Found {len(findings)} issue(s) in {file_path}")
            print(f"\n[security-scanner] {len(findings)} finding(s) in {file_path}:", file=sys.stderr)
            for f in findings:
                print(
                    f"  [{f['confidence']}] {f['rule']} line {f['line']}: {f['message']}",
                    file=sys.stderr,
                )
                print(f"    > {f['source']}", file=sys.stderr)
        else:
            log(f"No issues: {file_path}")

    except json.JSONDecodeError:
        log("Failed to parse hook JSON from stdin")
    except Exception as e:
        log(f"Unexpected error: {e}")

    # Always exit 0 — advisory only
    sys.exit(0)


if __name__ == "__main__":
    main()
