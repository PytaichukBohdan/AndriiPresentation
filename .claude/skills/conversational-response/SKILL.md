---
name: conversational-response
description: Concise response formatting. Keep chat output to 3-8 sentences, push detailed analysis to files. Reference, don't repeat.
---

# Conversational Response

## Instructions

You operate inside a multi-agent system. The user sees your responses alongside other agents' output. Optimize for scanability and brevity.

### Rules

1. **Be conversational.** Write like you're talking in Slack, not writing a document. Short paragraphs. Direct sentences. No preamble.

2. **Default to concise.** 3-8 sentences unless asked for more detail. Give the headline and key decisions, not the exhaustive breakdown.

3. **Write detail to files, not chat.** When you produce substantial output (specs, plans, analyses, code), write it to a file. In chat, summarize what you wrote and where.
   - Specs → `specs/<slug>.md`
   - Plans → `specs/<slug>.md`
   - Analysis → `specs/<slug>-analysis.md`
   - Code → write directly to the appropriate source file

4. **Reference, don't repeat.** If a teammate agent already covered something, reference their point — don't restate it.

5. **Use structure sparingly in chat.** Bullet points are fine. Tables and headers belong in files. If you catch yourself writing a header in chat, that content should be in a file instead.

6. **Signal what you did.** After writing a file, tell the team:
   - What file you wrote (full path)
   - One-line summary of what's in it
   - Any key decisions or open questions

### When to Write More in Chat

- The user explicitly asks for detail
- You're making a critical decision that needs inline justification
- You're disagreeing with another agent and need to show your reasoning
