---
name: foss4g2026-workshop
description: Build and maintain the FOSS4G 2026 Terra Draw workshop materials under docs/workshops/foss4g2026, including the reusable Zensical live-editor widget (editor + preview + Answer tab). Use when creating, editing, or reviewing FOSS4G 2026 workshop pages, exercises, or the live editor.
---

# FOSS4G 2026 Terra Draw Workshop

This skill guides the creation of the FOSS4G 2026 workshop materials in this
repository (Zensical static site, `docs/` → `site/`).

## Context

- FOSS4G 2025 (Auckland) used two repositories: this docs repo plus
  `watergis/terradraw-workshop-template` for code. Switching between them was
  painful for attendees. **FOSS4G 2026 must be self-contained in this single
  repository.**
- Workshop proposal: https://talks.osgeo.org/foss4g-2026-workshop/talk/K7EYFD/
  (3 hours, 2026-08-31 14:00–17:00, beginner web developers, MapLibre GL JS
  focus, speaker Jin Igarashi).
- The 2026 edition keeps the 2025 structure (basics → advanced →
  maplibre-gl-terradraw plugin) but adds the latest Terra Draw features:
  **undo/redo (v1.26.0)**, **polyline mode (v1.31.0)**, and optionally marker
  mode, dashed lines, and opacity styling. See
  [references/terra-draw-v1-updates.md](references/terra-draw-v1-updates.md).
- Every exercise page embeds a **live editor widget**: starter code on the
  left, live map preview on the right, and an "Answer" tab with the solution.
  See [references/live-editor-widget.md](references/live-editor-widget.md).

## Key files

| Path | Purpose |
|------|---------|
| `docs/workshops/foss4g2026/` | All 2026 workshop pages (create here) |
| `docs/workshops/foss4g2025/` | 2025 materials — reference only, never modify |
| `docs/assets/live-editor/` | Reusable live-editor widget (JS/CSS) |
| `zensical.toml` | Site config and nav — add 2026 pages to `nav` |
| `references/implementation-plan.md` | Full phased implementation plan |

## Rules

1. **Write all workshop content and code comments in English.**
2. Follow the page style of the 2025 materials: one exercise per page, short
   intro, incremental code blocks, screenshot of the expected result, a
   "What's Next?" closing section.
3. Pin Terra Draw versions in live-editor import maps (e.g. `terra-draw@1.31.2`)
   so the workshop cannot break when a new release lands. Update pins
   deliberately, in one place.
4. Every exercise must work in two ways: (a) inside the embedded live editor,
   and (b) copy-pasted into the local SvelteKit project set up in
   getting-started. Keep the code identical apart from the framework glue.
5. Keep plain fenced code blocks alongside the widget (`content.code.copy` is
   enabled) so attendees with restrictive networks can still follow along.
6. After content changes, build with `uv run zensical build` (or
   `uv run zensical serve` for preview) and confirm no nav warnings.
7. Never edit files under `site/` — it is build output.
8. Do not modify `docs/workshops/foss4g2025/**`; copy pages into
   `foss4g2026/` and edit the copies.

## Workflow

1. Read [references/implementation-plan.md](references/implementation-plan.md)
   and find the current phase (check which files already exist).
2. Implement one phase at a time; keep the site building between phases.
3. For live-editor work, follow
   [references/live-editor-widget.md](references/live-editor-widget.md) —
   verify Zensical's extra JS/CSS mechanism before writing widget code.
4. For exercise content, take the 2025 page as the base, update API usage to
   the pinned Terra Draw version, then add the live editor embed with
   `start.ts` / `answer.ts` files next to the page.
