# Live editor vendor bundle

Builds `docs/assets/live-editor/vendor/editor-bundle.js` — the single self-hosted ESM
file that the `<terra-draw-editor>` widget imports for CodeMirror and Sucrase.

The bundle is **committed to the repository**; the docs site has no JavaScript build
step, so `zensical build` just copies it. Only rerun this when the editor needs a new
CodeMirror API or a dependency bump.

```bash
cd scripts/editor-bundle
npm install
npm run build
```

Then commit the regenerated `editor-bundle.js`.

## Notes

- Dependency versions here must stay in sync with the `PINS` object at the top of
  `docs/assets/live-editor/live-editor.js`, which documents them for readers.
- Self-hosting was chosen over a CDN because esm.sh 500'd on `@codemirror/view`
  sub-dependencies and jsdelivr's `+esm` builds produced duplicate `@codemirror/state`
  instances. Keep `@codemirror/language` and `@lezer/highlight` deduped to one copy
  (`npm ls @codemirror/state`) — two instances silently break the editor.
- `classHighlighter` (from `@lezer/highlight`) is exported so `live-editor.css` can own
  the syntax colours via stable `tok-*` class names. Without it, CodeMirror's
  `defaultHighlightStyle` emits generated class names that CSS cannot target.
