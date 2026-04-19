#!/usr/bin/env python3
"""Unified Gemini Vision toolkit — image generation, analysis, OCR, and editing.

Uses gemini-3-pro-image-preview for ALL operations. Never any other model.
"""

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

MODEL = "gemini-3-pro-image-preview"
API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"


def load_api_key() -> str:
    """Load GEMINI_API_KEY from env or .env file."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    path = os.getcwd()
    while path != os.path.dirname(path):
        env_file = os.path.join(path, ".env")
        if os.path.exists(env_file):
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GEMINI_API_KEY="):
                        return line.split("=", 1)[1].strip().strip("\"'")
        path = os.path.dirname(path)
    print("ERROR: GEMINI_API_KEY not found in environment or .env", file=sys.stderr)
    sys.exit(1)


def gemini_request(api_key: str, parts: list[dict], response_modalities: list[str] | None = None) -> dict:
    """Send request to Gemini and return raw response dict."""
    gen_config: dict = {"temperature": 0.2, "maxOutputTokens": 8192}
    if response_modalities:
        gen_config["responseModalities"] = response_modalities

    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": gen_config,
    }

    url = API_URL_TEMPLATE.format(model=MODEL, key=api_key)
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERROR: Gemini API HTTP {e.code}", file=sys.stderr)
        print(body[:500], file=sys.stderr)
        sys.exit(1)


def extract_text(response: dict) -> str:
    """Extract text from Gemini response."""
    candidates = response.get("candidates", [])
    if not candidates:
        return "(no response)"
    parts = candidates[0].get("content", {}).get("parts", [])
    return "\n".join(p.get("text", "") for p in parts if "text" in p)


def extract_image(response: dict, output_path: str) -> bool:
    """Extract image from Gemini response and save to file."""
    candidates = response.get("candidates", [])
    if not candidates:
        return False
    parts = candidates[0].get("content", {}).get("parts", [])
    for part in parts:
        inline = part.get("inlineData", {})
        if inline.get("mimeType", "").startswith("image/"):
            data = base64.b64decode(inline["data"])
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(data)
            return True
    return False


def load_image_part(image_path: str) -> dict:
    """Load an image file as a Gemini inline_data part."""
    with open(image_path, "rb") as f:
        data = f.read()
    ext = Path(image_path).suffix.lower()
    mime_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                ".webp": "image/webp", ".gif": "image/gif"}
    mime = mime_map.get(ext, "image/png")
    return {"inline_data": {"mime_type": mime, "data": base64.b64encode(data).decode()}}


# ─── Commands ───────────────────────────────────────────────────


def cmd_generate(args: argparse.Namespace) -> None:
    """Generate an image from a text prompt."""
    api_key = load_api_key()
    parts = [{"text": args.prompt}]

    # If reference images provided, include them
    if args.reference:
        for ref_path in args.reference:
            parts.append(load_image_part(ref_path))

    response = gemini_request(api_key, parts, response_modalities=["image", "text"])

    if extract_image(response, args.output):
        size = os.path.getsize(args.output)
        print(json.dumps({
            "success": True, "output_path": args.output,
            "model": MODEL, "file_size": size,
        }))
    else:
        # Might have returned text explanation instead
        text = extract_text(response)
        print(json.dumps({
            "success": False, "error": "No image generated",
            "model": MODEL, "text_response": text[:500],
        }), file=sys.stderr)
        sys.exit(1)


def cmd_analyze(args: argparse.Namespace) -> None:
    """Analyze one or more images with a prompt."""
    api_key = load_api_key()

    prompt = args.prompt or "Describe this image in detail. Be specific about colors, composition, style, and content."
    parts: list[dict] = [{"text": prompt}]

    for img_path in args.images:
        if not os.path.exists(img_path):
            print(f"WARN: {img_path} not found, skipping", file=sys.stderr)
            continue
        parts.append({"text": f"\n--- {Path(img_path).name} ---"})
        parts.append(load_image_part(img_path))

    response = gemini_request(api_key, parts)
    text = extract_text(response)
    print(text)

    if args.output:
        with open(args.output, "w") as f:
            f.write(text)
        print(f"\nSaved to {args.output}", file=sys.stderr)


def cmd_analyze_batch(args: argparse.Namespace) -> None:
    """Analyze all images in a directory, batched for API limits."""
    api_key = load_api_key()
    img_dir = Path(args.image_dir)
    all_images = sorted(
        p for p in img_dir.iterdir()
        if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif")
    )

    if not all_images:
        print(f"No images found in {img_dir}/", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(all_images)} images in {img_dir}/\n")

    prompt = args.prompt or (
        "Analyze these images. For each, give a 1-2 sentence description. "
        "Group by category (backgrounds, UI, characters, effects, etc). "
        "Be specific about colors, styles, and visible elements."
    )

    batch_size = args.batch_size
    all_results: list[str] = []

    for i in range(0, len(all_images), batch_size):
        batch = all_images[i:i + batch_size]
        batch_num = i // batch_size + 1
        print(f"Batch {batch_num} ({len(batch)} images: {batch[0].name} → {batch[-1].name})")

        parts: list[dict] = [{"text": f"{prompt}\n\nThere are {len(batch)} images in this batch."}]
        for img_path in batch:
            parts.append({"text": f"\n--- {img_path.name} ---"})
            parts.append(load_image_part(str(img_path)))

        response = gemini_request(api_key, parts)
        result = extract_text(response)
        all_results.append(result)
        print(f"  Done.\n")

    full_output = "\n\n---\n\n".join(all_results)
    print(full_output)

    if args.output:
        with open(args.output, "w") as f:
            f.write(full_output)
        print(f"\nSaved to {args.output}", file=sys.stderr)


def cmd_ocr(args: argparse.Namespace) -> None:
    """Extract text and tables from a screenshot using vision."""
    api_key = load_api_key()

    prompt = args.prompt or (
        "Extract ALL text from this image. If it contains tables, "
        "reproduce them as markdown tables with exact content. "
        "Preserve the original language. Be exhaustive — extract every word visible."
    )

    parts: list[dict] = [{"text": prompt}]

    for img_path in args.images:
        if not os.path.exists(img_path):
            print(f"WARN: {img_path} not found, skipping", file=sys.stderr)
            continue
        parts.append(load_image_part(img_path))

    response = gemini_request(api_key, parts)
    text = extract_text(response)
    print(text)

    if args.output:
        with open(args.output, "w") as f:
            f.write(text)
        print(f"\nSaved to {args.output}", file=sys.stderr)


def cmd_edit(args: argparse.Namespace) -> None:
    """Edit an existing image with a text instruction."""
    api_key = load_api_key()

    parts: list[dict] = [
        {"text": args.prompt},
        load_image_part(args.image),
    ]

    response = gemini_request(api_key, parts, response_modalities=["image", "text"])

    if extract_image(response, args.output):
        size = os.path.getsize(args.output)
        print(json.dumps({
            "success": True, "output_path": args.output,
            "model": MODEL, "file_size": size,
        }))
    else:
        text = extract_text(response)
        print(json.dumps({
            "success": False, "error": "No edited image returned",
            "model": MODEL, "text_response": text[:500],
        }), file=sys.stderr)
        sys.exit(1)


def cmd_compare(args: argparse.Namespace) -> None:
    """Compare two or more images and describe differences."""
    api_key = load_api_key()

    prompt = args.prompt or (
        "Compare these images. Describe the key differences and similarities "
        "in terms of composition, color, style, content, and quality."
    )
    parts: list[dict] = [{"text": prompt}]

    for i, img_path in enumerate(args.images):
        parts.append({"text": f"\n--- Image {i+1}: {Path(img_path).name} ---"})
        parts.append(load_image_part(img_path))

    response = gemini_request(api_key, parts)
    print(extract_text(response))


# ─── CLI ────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(
        description=f"Gemini Vision toolkit (model: {MODEL})"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # generate
    p = sub.add_parser("generate", help="Generate image from text prompt")
    p.add_argument("-p", "--prompt", required=True, help="Generation prompt")
    p.add_argument("-o", "--output", required=True, help="Output image path")
    p.add_argument("-r", "--reference", nargs="*", help="Reference images for style guidance")

    # analyze
    p = sub.add_parser("analyze", help="Analyze one or more images")
    p.add_argument("images", nargs="+", help="Image paths to analyze")
    p.add_argument("-p", "--prompt", help="Analysis prompt")
    p.add_argument("-o", "--output", help="Save analysis to file")

    # analyze-batch
    p = sub.add_parser("analyze-batch", help="Analyze all images in a directory")
    p.add_argument("--image-dir", required=True, help="Directory with images")
    p.add_argument("-p", "--prompt", help="Analysis prompt")
    p.add_argument("-o", "--output", help="Save analysis to file")
    p.add_argument("--batch-size", type=int, default=15, help="Images per API call (default: 15)")

    # ocr
    p = sub.add_parser("ocr", help="Extract text/tables from screenshots")
    p.add_argument("images", nargs="+", help="Screenshot paths")
    p.add_argument("-p", "--prompt", help="Custom OCR prompt")
    p.add_argument("-o", "--output", help="Save OCR text to file")

    # edit
    p = sub.add_parser("edit", help="Edit an image with text instructions")
    p.add_argument("-i", "--image", required=True, help="Source image to edit")
    p.add_argument("-p", "--prompt", required=True, help="Edit instruction")
    p.add_argument("-o", "--output", required=True, help="Output image path")

    # compare
    p = sub.add_parser("compare", help="Compare two or more images")
    p.add_argument("images", nargs="+", help="Image paths to compare")
    p.add_argument("-p", "--prompt", help="Comparison prompt")

    args = parser.parse_args()
    commands = {
        "generate": cmd_generate,
        "analyze": cmd_analyze,
        "analyze-batch": cmd_analyze_batch,
        "ocr": cmd_ocr,
        "edit": cmd_edit,
        "compare": cmd_compare,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
