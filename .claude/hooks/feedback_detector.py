#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""UserPromptSubmit hook that detects feedback keywords and suggests /capture."""

import json
import sys
from pathlib import Path

# Add hooks/utils directory to path so we can import feedback_keywords directly
sys.path.insert(0, str(Path(__file__).parent / "utils"))

from feedback_keywords import classify_feedback


def main():
    # Read the hook input from stdin (same format as user_prompt_submit.py)
    input_data = json.loads(sys.stdin.read())

    # Extract the user's prompt
    prompt = input_data["prompt"]

    # Classify the feedback
    feedback_type = classify_feedback(prompt)

    if feedback_type == "positive":
        print(
            "Positive feedback detected! Run `/capture good` to save this as a validation example.",
            file=sys.stderr,
        )
    elif feedback_type == "negative":
        print(
            "Negative feedback detected. Run `/capture bad` to capture what went wrong.",
            file=sys.stderr,
        )
        print(
            "   Or I can ask you a few questions to capture what went wrong — just say 'yes, capture'.",
            file=sys.stderr,
        )

    sys.exit(0)


if __name__ == "__main__":
    main()
