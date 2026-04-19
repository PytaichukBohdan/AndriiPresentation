#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

"""Feedback keyword classification for validation criteria capture."""

from typing import Optional, Literal

# Positive signals — user is happy with the output
POSITIVE_KEYWORDS = [
    "perfect",
    "great",
    "exactly what i wanted",
    "love this",
    "good job",
    "nailed it",
    "awesome",
    "excellent",
    "well done",
    "that's exactly right",
    "spot on",
]

# Negative signals — user is unhappy with the output
NEGATIVE_KEYWORDS = [
    "wrong",
    "not what i wanted",
    "fix this",
    "terrible",
    "redo",
    "try again",
    "that's not right",
    "no no no",
    "completely wrong",
    "this is broken",
    "doesn't work",
    "not even close",
    "start over",
]

# Words that look like feedback but are actually task instructions — DO NOT trigger
NEUTRAL_WORDS = [
    "change",
    "modify",
    "update",
    "add",
    "remove",
    "refactor",
    "move",
    "rename",
]


def classify_feedback(prompt: str) -> Optional[Literal["positive", "negative"]]:
    """Classify user prompt as positive feedback, negative feedback, or not feedback.

    Returns None if the prompt doesn't appear to be feedback (is a task instruction,
    is ambiguous, or confidence is too low).

    Uses a simple keyword matching approach with guards against false positives:
    - Prompt must be short enough to likely be feedback (under 200 chars)
    - Prompt must not start with neutral task words
    - Keyword must appear as a standalone phrase, not embedded in code/technical context
    """
    normalized = prompt.strip().lower()

    # Skip very long prompts — likely task descriptions, not feedback
    if len(normalized) > 200:
        return None

    # Skip if prompt starts with a neutral task word (it's an instruction, not feedback)
    first_word = normalized.split()[0] if normalized.split() else ""
    if first_word in NEUTRAL_WORDS:
        return None

    # Skip if prompt contains code indicators (backticks, function calls, file paths)
    code_indicators = ["```", "def ", "class ", "import ", "./", "../", "function "]
    if any(indicator in normalized for indicator in code_indicators):
        return None

    # Check negative first (negative feedback is more actionable)
    for keyword in NEGATIVE_KEYWORDS:
        if keyword in normalized:
            return "negative"

    # Check positive
    for keyword in POSITIVE_KEYWORDS:
        if keyword in normalized:
            return "positive"

    return None
