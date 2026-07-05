# FOSS4G 2026 Workshop — Implementation Plan

Target event: FOSS4G 2026, workshop on 2026-08-31 14:00–17:00 (3 hours).
Proposal: https://talks.osgeo.org/foss4g-2026-workshop/talk/K7EYFD/

## Goals

1. **Single repository.** All materials — docs, exercise starter code, and
   answers — live in this repo. No separate template repo to clone-and-switch
   during the session (the main pain point in 2025).
2. **Live editor experience.** Each exercise embeds a widget: TypeScript code
   editor (left) + live map preview (right) + an "Answer" tab revealing the
   solution. Reusable across all exercises.
3. **Current Terra Draw.** Base everything on the latest 1.x release
   (v1.31.2 as of 2026-06) and add dedicated coverage of undo/redo and
   polyline mode. See terra-draw-v1-updates.md.
4. **Keep the local-dev track.** The live editor is the primary teaching tool,
   but attendees should still be able to build the same app locally
   (SvelteKit), because that is what they take home. The local template moves
   into this repo (e.g. `template/` at repo root) instead of a second repo.

## Proposed page structure

```
docs/workshops/foss4g2026/
├── index.md                     # Overview, schedule, prerequisites
├── getting-started.md           # Local setup (template/ in this repo) + how the live editor works
├── basics/
│   ├── index.md
│   ├── exercise-1.md            # First Terra Draw setup, no UI (rectangle mode)
│   ├── exercise-2.md            # Multiple modes + UI buttons (point, linestring, polygon, polyline NEW, freehand, circle…)
│   └── exercise-3.md            # Select mode (editing, dragging, allowManualSelection)
├── advanced/
│   ├── index.md
│   ├── exercise-4.md            # Custom styling (incl. dashed lines, opacity — NEW in 1.24/1.30)
│   ├── exercise-5.md            # Event handling (change/finish/select events, getModeState)
│   ├── exercise-6.md            # Data management (addFeatures, snapshot, updateFeatureGeometry)
│   └── exercise-7.md            # NEW: Undo / Redo (undo(), redo(), clearUndoRedoHistory, history UI buttons)
├── maplibre-gl-terradraw.md     # Plugin tutorial (measure/valhalla controls)
├── other-libraries.md           # (time permitting) Leaflet / OpenLayers adapter swap
├── support.md                   # Q&A / help
├── code/                        # Live-editor code files, one dir per exercise
│   ├── exercise-1/{start.ts,answer.ts}
│   ├── exercise-2/{start.ts,answer.ts}
│   └── …
└── assets/                      # Screenshots per exercise
```

Nav entry is added to `zensical.toml` under `Workshops`, parallel to
"FOSS4G 2025 Auckland"; also add the link to `docs/workshops/index.md`.

## Content mapping from 2025

| 2026 page | Based on 2025 | Changes |
|-----------|---------------|---------|
| index.md | foss4g2025/index.md | New schedule (14:00–17:00), remove template-repo links, describe live editor |
| getting-started.md | getting-started.md | Point at in-repo `template/`; add "or just use the embedded editors" path |
| basics/exercise-1 | basics/exercise-1 | Same flow; add live editor |
| basics/exercise-2 | basics/exercise-2 | Add **TerraDrawPolylineMode** to the mode lineup; note difference vs linestring |
| basics/exercise-3 | basics/exercise-3 | Add `allowManualSelection` (v1.27) note |
| advanced/exercise-4 | advanced/exercise-4 | Add dashed-line styles (v1.30) and opacity options (v1.24) |
| advanced/exercise-5 | advanced/exercise-5 | Same events flow; mention `getModeState` |
| advanced/exercise-6 | advanced/exercise-6 | Same; mention `updateFeatureGeometry` / `transformFeatureGeometry` |
| advanced/exercise-7 | — (new) | Undo/redo: enable history, wire UI buttons, `clearUndoRedoHistory` |
| maplibre-gl-terradraw.md | maplibre-gl-terradraw.md | Update to current plugin version |
| other-libraries.md | leaflet.md | Reframe as "one API, many libraries" demo |

## Phases

### Phase 1 — Scaffolding
- Create `docs/workshops/foss4g2026/` with index.md skeleton.
- Add nav entries in `zensical.toml`; update `docs/workshops/index.md`.
- Verify `uv run zensical build` passes.

### Phase 2 — Live editor widget (the critical path)
- Follow live-editor-widget.md. Build and verify the widget with a minimal
  "hello map" exercise before writing any exercise content that depends on it.
- Deliverables: `docs/assets/live-editor/live-editor.js` (+ CSS), extra
  JS/CSS wired into Zensical, one working embed in a scratch page.

### Phase 3 — Port and refresh 2025 content
- Copy pages per the mapping table; update APIs to pinned Terra Draw 1.31.x.
- Extract each exercise's starter/answer code into `code/exercise-N/`.
- Embed the widget into each page; keep plain code blocks as fallback.

### Phase 4 — New feature exercises
- Write exercise-7 (undo/redo) and the polyline additions to exercise-2.
- Optionally: marker mode and freehand smoothing as stretch content in
  exercise-2 or an appendix.

### Phase 5 — Local template
- Add `template/` (SvelteKit + TypeScript + terra-draw + adapter) to this repo,
  matching the final answer code of the basics track.
- Update getting-started.md accordingly (clone this repo once; `cd template`).

### Phase 6 — QA
- `uv run zensical build`; click through every page with `zensical serve`.
- Test each live editor: starter compiles, answer runs, reset works, tab
  switching preserves state sensibly.
- Test on Chrome/Firefox/Safari; test offline behaviour message (CDN blocked).
- Take/refresh screenshots for each exercise.

## Decisions to confirm with Jin

- Whether the 30-min break table format from 2025 applies (2026 slot is a
  straight 3 hours).
  - break for 15 min after first an hour is finished.
- Whether James Milner again opens with an intro talk (slides link).
  - This year has no intro talk by James, but we can do intro slides in the first 15 minutes.
- Which stretch features (marker mode, dashed lines, freehand smoothing) make
  the cut for a 3-hour session vs. appendix.
