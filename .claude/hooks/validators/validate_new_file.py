#!/usr/bin/env python3
"""Stop hook validator: checks that a new file was created in a directory.

Usage:
    uv run .claude/hooks/validators/validate_new_file.py --directory ai_docs --filename implementation_spec.md

Reads the Stop hook JSON from stdin. Scans subdirectories of --directory for
files matching --filename. If at least one file exists, exits 0 (allow stop).
If none found, exits 2 with an error on stderr (block stop).
"""
import argparse
import json
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Validate a new file was created")
    parser.add_argument("--directory", required=True, help="Parent directory to check")
    parser.add_argument(
        "--filename",
        default="*.md",
        help="Filename or glob pattern to search for (default: *.md)",
    )
    parser.add_argument("--extension", default=None, help="File extension to search for (e.g. .md). Alias for --filename '*<ext>'")
    args = parser.parse_args()

    # --extension is an alias: --extension .md becomes --filename '*.md'
    if args.extension:
        args.filename = f"*{args.extension}"

    # Read stdin (Stop hook input) but we only need the cwd
    try:
        hook_input = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, EOFError):
        hook_input = {}

    cwd = hook_input.get("cwd", ".")
    search_dir = Path(cwd) / args.directory

    if not search_dir.exists():
        # Directory doesn't exist — this validator is a no-op outside of /plan_w_team
        sys.exit(0)

    # Search both directly in directory and in subdirectories
    matching_files = list(search_dir.glob(f"**/{args.filename}"))

    if not matching_files:
        print(
            f"No '{args.filename}' found in subdirectories of '{args.directory}'",
            file=sys.stderr,
        )
        sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
