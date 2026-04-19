---
name: artifacts-builder
description: Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.
license: Complete terms in LICENSE.txt
---

# Artifacts Builder

To build powerful frontend claude.ai artifacts, follow these steps:
1. Initialize the frontend repo using `scripts/init-artifact.sh`
2. Develop your artifact by editing the generated code
3. Bundle all code into a single HTML file using `scripts/bundle-artifact.sh`
4. Display artifact to user
5. (Optional) Test the artifact

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Design & Style Guidelines

**CRITICAL: Design System Integration**

When creating slide components for presentations, you MUST follow the project's design system defined in `ai_docs/DESIGN_AESTHETICS.md`. Reference this file dynamically for:

- **Color Palette** (Section: "Color System"):
  - Primary: Electric Orange (#FF4D00)
  - Accent: Neon Cyan (#00D9FF)
  - Neutral: Charcoal (#0A0A0A), Muted Gray (#A0A0A0)

- **Typography** (Section: "Typography System"):
  - Display titles: Bebas Neue
  - Emphasis text: Syne
  - Body text: Manrope
  - Code/technical: JetBrains Mono

- **Design Philosophy** (Section: "Design Philosophy"):
  - Brutalist elements: Bold typography, high contrast, geometric patterns, hard edges
  - Retro-futuristic: Neon glows, analog grain, warm gradients, cyan accents
  - Minimalist foundation: Clean layouts, purposeful restraint, clarity over decoration

**Anti-Patterns to Avoid**:
- Inter font (use Manrope for body text instead)
- Purple gradients (use orange/cyan from design system)
- Excessive centered layouts (use grid-based, asymmetric layouts)
- Uniform rounded corners (use angular, brutalist edges)

**Reference**: Always check `ai_docs/DESIGN_AESTHETICS.md` for the complete, up-to-date design system before creating components.

## Quick Start

### Step 1: Initialize Project

Run the initialization script to create a new React project:
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

This creates a fully configured project with:
- ✅ React + TypeScript (via Vite)
- ✅ Tailwind CSS 3.4.1 with shadcn/ui theming system
- ✅ Path aliases (`@/`) configured
- ✅ 40+ shadcn/ui components pre-installed
- ✅ All Radix UI dependencies included
- ✅ Parcel configured for bundling (via .parcelrc)
- ✅ Node 18+ compatibility (auto-detects and pins Vite version)

### Step 2: Develop Your Artifact

To build the artifact, edit the generated files. See **Common Development Tasks** below for guidance.

### Step 3: Bundle to Single HTML File

To bundle the React app into a single HTML artifact:
```bash
bash scripts/bundle-artifact.sh
```

This creates `bundle.html` - a self-contained artifact with all JavaScript, CSS, and dependencies inlined. This file can be directly shared in Claude conversations as an artifact.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:
- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 4: Share Artifact with User

Finally, share the bundled HTML file in conversation with the user so they can view it as an artifact.

### Step 5: Testing/Visualizing the Artifact (Optional)

Note: This is a completely optional step. Only perform if necessary or requested.

To test/visualize the artifact, use available tools (including other Skills or built-in tools like Playwright or Puppeteer). In general, avoid testing the artifact upfront as it adds latency between the request and when the finished artifact can be seen. Test later, after presenting the artifact, if requested or if issues arise.

## Reference

- **shadcn/ui components**: https://ui.shadcn.com/docs/components