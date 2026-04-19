---
name: gemini-vision
version: 2.0.0
description: Unified Gemini Vision toolkit — image generation, analysis, batch analysis, OCR/table extraction, image editing, and comparison. All operations use gemini-3-pro-image-preview. NEVER use gemini-2.5-pro or any flash model.
triggers:
  - "generate an image"
  - "create a picture"
  - "analyze image"
  - "analyze images"
  - "ocr this"
  - "extract text from image"
  - "extract table from screenshot"
  - "compare images"
  - "edit image"
  - "describe image"
  - "what's in this image"
  - "batch analyze"
---

# Gemini Vision Toolkit

Unified image intelligence using **`gemini-3-pro-image-preview`** — generation, analysis, OCR, editing, and comparison in one script.

**IMPORTANT:** NEVER use `gemini-2.5-pro`, `gemini-2.5-flash`, or any other model. Always `gemini-3-pro-image-preview`.

## Prerequisites

```bash
GEMINI_API_KEY=your-key    # in .env or environment
```

Get a key at: https://aistudio.google.com/apikey

## Quick Reference

```bash
SCRIPT="${SKILL_DIR}/scripts/gemini_vision.py"

# Generate image from prompt
uv run python $SCRIPT generate -p "a cartoon biplane over mountains" -o output.png

# Generate with reference images for style
uv run python $SCRIPT generate -p "same style but with a jet" -o jet.png -r reference1.png reference2.png

# Analyze single image
uv run python $SCRIPT analyze photo.png

# Analyze with custom prompt
uv run python $SCRIPT analyze photo.png -p "What UI elements are visible?"

# Analyze multiple images at once
uv run python $SCRIPT analyze img1.png img2.png img3.png -o analysis.md

# Batch analyze entire directory
uv run python $SCRIPT analyze-batch --image-dir ./images/ -o analysis.md

# OCR — extract text and tables from screenshots
uv run python $SCRIPT ocr screenshot.png -o tables.md

# OCR multiple screenshots
uv run python $SCRIPT ocr screen1.png screen2.png -o all_text.md

# Edit an existing image
uv run python $SCRIPT edit -i source.png -p "change the sky to sunset colors" -o edited.png

# Compare images
uv run python $SCRIPT compare before.png after.png
```

## Commands

### `generate` — Text to Image

```bash
uv run python $SCRIPT generate \
  -p "detailed prompt describing desired image" \
  -o output.png \
  [-r reference1.png reference2.png]  # optional style references
```

Tips for better results:
- Be specific about style: "watercolor illustration" not just "illustration"
- Include exclusions: "no text, no watermarks"
- Mention use case: "for a mobile app splash screen"
- Use hex colors: "primary color #6366F1"
- Specify aspect ratio: "16:9 landscape", "1:1 square"

### `analyze` — Image Analysis

```bash
uv run python $SCRIPT analyze image1.png [image2.png ...] \
  [-p "custom analysis prompt"] \
  [-o output.md]
```

Default prompt describes colors, composition, style, content. Override with `-p` for specific questions.

### `analyze-batch` — Directory Batch Analysis

```bash
uv run python $SCRIPT analyze-batch \
  --image-dir ./path/to/images/ \
  [-p "custom prompt"] \
  [-o analysis.md] \
  [--batch-size 15]
```

Processes all images in a directory in batches of 15 (configurable). Groups results by category automatically.

### `ocr` — Text & Table Extraction

```bash
uv run python $SCRIPT ocr screenshot.png [more.png ...] \
  [-p "custom OCR prompt"] \
  [-o output.md]
```

Extracts all visible text. Tables are reproduced as markdown. Preserves original language.

### `edit` — Image Editing

```bash
uv run python $SCRIPT edit \
  -i source.png \
  -p "make the background blue" \
  -o edited.png
```

Modifies an existing image based on text instructions. Good for color changes, element removal, style transfer.

### `compare` — Image Comparison

```bash
uv run python $SCRIPT compare img1.png img2.png [img3.png ...] \
  [-p "compare these designs for consistency"]
```

Describes differences and similarities. Useful for design QA, before/after, variant comparison.

## Integration with Other Skills

### Used by miro-connection

The miro-connection skill's `full-extract` command uses this toolkit internally for:
- Phase 4a: `analyze-batch` on downloaded board images
- Phase 4b: `ocr` on browser screenshots of tables

### Used by psd-variations

The psd-variations skill uses `generate` and `edit` for creating visual variations.

### Shell script (legacy)

The original `generate-image.sh` still works for simple generation:

```bash
bash scripts/generate-image.sh -p "prompt" -o output.png
```

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `GEMINI_API_KEY not found` | No key in env or .env | Set the key |
| `HTTP 400` | Bad prompt or too many images | Reduce batch size or simplify prompt |
| `HTTP 429` | Rate limit | Wait and retry |
| `HTTP 403` | Key lacks permissions | Check API key scopes |
| `No image generated` | Model returned text only | Rephrase prompt, be more specific |
