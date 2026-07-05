# Terra Draw — Features to Cover in 2026 (vs. 2025 materials)

Latest release at planning time: **v1.31.2 (2026-06-17)**. The 2025 workshop
was written against early 1.x. Source of truth:
https://github.com/JamesLMilner/terra-draw/blob/main/packages/terra-draw/CHANGELOG.md
(re-check the CHANGELOG before writing each exercise — pin whatever is
current then).

## Must cover (headline new features)

- **Undo / Redo (v1.26.0)** — history of drawing actions; `undo()` / `redo()`
  on the TerraDraw instance, plus `clearUndoRedoHistory()` (v1.28.0).
  → New advanced exercise 7: wire Undo/Redo buttons, discuss what is and
  isn't tracked in history. Verify exact enabling options in current docs.
- **Polyline mode (v1.31.0)** — `TerraDrawPolylineMode`, complementing
  linestring. → Add to basics exercise 2's mode lineup and explain how it
  differs from `TerraDrawLineStringMode` (check docs for the actual
  behavioural difference before writing prose).

## Good candidates (fit existing exercises)

- **Dashed lines (v1.30.0)** — styling option; fits exercise 4 (custom styling).
- **Opacity options (v1.24.0)** — point/linestring/polygon-outline opacity;
  fits exercise 4.
- **`allowManualSelection` on select mode (v1.27.0)** and multiple concurrent
  select modes — fits exercise 3.
- **`getModeState` (recent API)** — fits exercise 5 (events/state).
- **`updateFeatureGeometry` / `transformFeatureGeometry`** — fits exercise 6
  (data management).

## Stretch / appendix only (3-hour limit)

- **Marker mode (v1.17.0)** — built-in marker mode with icon customization.
- **Freehand smoothing + freehand-linestring mode (v1.25.0 / v1.11.0)**.
- **Coordinate points rendering for polygons (v1.4.0)**.

## Version pinning policy

Pin exact versions in the live-editor import map and in `template/package.json`
(e.g. `terra-draw@1.31.2`, matching `terra-draw-maplibre-gl-adapter`). One
constant in `live-editor.js` holds the pins. Bump deliberately shortly before
the workshop, then re-run all exercises.
