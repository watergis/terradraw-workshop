"""Serve the assembled `site/` and rebuild it when a source file changes.

`uv run zensical serve` only ever builds one configuration, so it cannot show
the finished multilingual site: the translations live at `/<lang>/`, which only
exists once `scripts/build.sh` has assembled every language into `site/`. This
serves that assembled directory instead, so every language, the language
switcher and the generated slide decks are all at their real URLs.

The trade-off is that Zensical's own incremental dev server is not involved, so
a change triggers a full `scripts/build.sh --skip-npm` (a few seconds). Pages
reload themselves when it finishes, via a small script injected into each HTML
response.

Run it through `make serve`, which does the first full build.
"""

from __future__ import annotations

import argparse
import http.server
import os
import subprocess
import sys
import threading
import time
from functools import partial
from pathlib import Path

# Same directory, so it is importable when this file is run as a script.
import build_i18n

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "site"

# Inputs a rebuild depends on. `site/` and `build/` are outputs, and the Marp
# decks are regenerated per build, so neither is watched.
WATCH_ROOTS = ("docs", "i18n", "overrides", "scripts")
WATCH_FILES = ("zensical.toml",)
SLIDE_SUFFIX = "_slide"

# Dependency trees and caches: nothing here is a source, and walking them costs
# more than everything else combined (scripts/ alone holds ~11k node_modules
# files, statted on every poll).
IGNORE_DIRS = frozenset(
    ("node_modules", "__pycache__", ".venv", ".cache", ".ruff_cache")
)
# Build outputs that land under a watched root. They are rewritten by every
# build, so watching them would make each rebuild trigger the next one.
IGNORE_FILES = (ROOT / "docs" / "assets" / "live-editor" / "keys.js",)

POLL_SECONDS = 1.0

# Polled by the injected script; changes once a rebuild finishes.
BUILD_ID_PATH = "/__preview_build_id"

RELOAD_SCRIPT = """
<script>
  // Injected by scripts/preview.py — reloads the page after a rebuild.
  (async () => {
    // A rebuild reload should not throw away where the reader was.
    const key = "__preview_scroll:" + location.pathname;
    const saved = sessionStorage.getItem(key);
    if (saved !== null) {
      sessionStorage.removeItem(key);
      addEventListener("load", () => scrollTo(0, Number(saved)));
    }

    const read = async () =>
      (await fetch("__BUILD_ID_PATH__", { cache: "no-store" })).text();
    let current = await read();
    setInterval(async () => {
      try {
        const latest = await read();
        if (latest !== current) {
          sessionStorage.setItem(key, String(scrollY));
          location.reload();
        }
      } catch {
        /* the server is mid-restart; try again on the next tick */
      }
    }, 1000);
  })();
</script>
""".replace("__BUILD_ID_PATH__", BUILD_ID_PATH).encode()


def fingerprint() -> dict[Path, tuple[int, int]]:
    """Size and mtime of every watched source file."""
    state: dict[Path, tuple[int, int]] = {}
    paths = [ROOT / name for name in WATCH_FILES]
    for name in WATCH_ROOTS:
        root = ROOT / name
        if not root.is_dir():
            continue
        for parent, dirs, files in os.walk(root):
            # Pruning in place stops os.walk from descending into them at all.
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            paths.extend(Path(parent) / file for file in files)
    for path in paths:
        if path.name.endswith(f"{SLIDE_SUFFIX}.html") or path in IGNORE_FILES:
            continue
        if not path.is_file():
            continue
        info = path.stat()
        state[path] = (info.st_size, info.st_mtime_ns)
    return state


class Preview:
    """Shared state between the HTTP handler and the watcher thread."""

    def __init__(self) -> None:
        self.build_id = str(time.time_ns())
        self.lock = threading.Lock()

    def rebuild(self) -> bool:
        print("preview: rebuilding…", flush=True)
        result = subprocess.run(
            ["bash", "scripts/build.sh", "--skip-npm"],
            cwd=ROOT,
            check=False,
        )
        if result.returncode != 0:
            print("preview: build failed — keeping the previous site", flush=True)
            return False
        with self.lock:
            self.build_id = str(time.time_ns())
        print("preview: rebuilt", flush=True)
        return True

    def watch(self) -> None:
        state = fingerprint()
        while True:
            time.sleep(POLL_SECONDS)
            current = fingerprint()
            if current == state:
                continue
            # Wait for writes to settle so a multi-file save rebuilds once.
            while True:
                time.sleep(POLL_SECONDS)
                settled = fingerprint()
                if settled == current:
                    break
                current = settled
            state = current
            self.rebuild()


class Handler(http.server.SimpleHTTPRequestHandler):
    """Static handler for `site/`, plus the build id and the reload script."""

    protocol_version = "HTTP/1.1"

    def __init__(self, *args, preview: Preview, **kwargs) -> None:
        self.preview = preview
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

    def do_GET(self) -> None:  # method name is fixed by the base class
        if self.path == BUILD_ID_PATH:
            with self.preview.lock:
                self.respond(self.preview.build_id.encode(), "text/plain")
            return

        page = self.html_target()
        if page is None:
            super().do_GET()
            return

        body = page.read_bytes()
        if b"</body>" in body:
            body = body.replace(b"</body>", RELOAD_SCRIPT + b"</body>", 1)
        self.respond(body, "text/html; charset=utf-8")

    def html_target(self) -> Path | None:
        """The HTML file this request resolves to, if it is one.

        HTML is served from here rather than through the base class so the
        injected reload script is counted in Content-Length — otherwise the
        response is truncated back to the file's size on disk and the script is
        cut off.
        """
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            # Let the base class handle the redirect to the trailing slash.
            if not self.path.split("?", 1)[0].endswith("/"):
                return None
            path = path / "index.html"
        if path.suffix != ".html" or not path.is_file():
            return None
        return path

    def respond(self, body: bytes, content_type: str) -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        # A rebuild must never be masked by the browser cache.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format: str, *args) -> None:
        # One line per request is noise; failures are worth seeing.
        status = args[1] if len(args) > 1 else ""
        if str(status).startswith(("4", "5")):
            super().log_message(format, *args)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--host", default="127.0.0.1", help="default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=8000, help="default: 8000")
    parser.add_argument(
        "--no-watch",
        action="store_true",
        help="serve the current site/ without rebuilding on changes",
    )
    args = parser.parse_args()

    if not SITE_DIR.is_dir():
        print(
            "error: site/ does not exist — run `make build` first "
            "(`make serve` does this for you)",
            file=sys.stderr,
        )
        return 1

    preview = Preview()
    if not args.no_watch:
        threading.Thread(target=preview.watch, daemon=True).start()

    server = http.server.ThreadingHTTPServer(
        (args.host, args.port),
        partial(Handler, preview=preview),
    )
    print(f"preview: serving site/ on http://{args.host}:{args.port}/")
    for lang in build_i18n.available_languages():
        suffix = "" if lang == build_i18n.DEFAULT_LANG else f"{lang}/"
        print(f"  {lang}: http://{args.host}:{args.port}/{suffix}")
    if args.no_watch:
        print("preview: watching disabled")
    else:
        print("preview: watching docs/, i18n/, overrides/, scripts/, zensical.toml")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
