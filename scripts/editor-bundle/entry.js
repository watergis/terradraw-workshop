// Entry point for the self-hosted live-editor vendor bundle.
//
// Everything the <terra-draw-editor> widget needs from CodeMirror and Sucrase
// is re-exported here and bundled into a single ESM file, so the widget works
// without any CDN at runtime. See README.md for how to rebuild.
export { EditorView, basicSetup } from 'codemirror';
export { javascript } from '@codemirror/lang-javascript';
// classHighlighter emits stable `tok-*` class names instead of the generated
// class names `defaultHighlightStyle` uses, which lets live-editor.css own the
// syntax colours (and switch them with the site's light/dark palette).
export { syntaxHighlighting } from '@codemirror/language';
export { classHighlighter } from '@lezer/highlight';
export { transform } from 'sucrase';
