"""Generate a Marp slide deck for every documentation page.

Each `docs/<path>/<name>.md` is converted to `docs/<path>/<name>_slide.html`,
which zensical copies verbatim into the built site (non-Markdown files under
`docs_dir` are passed through). The "Switch to presentation mode" button added
by `overrides/partials/actions.html` links to that file.

Decks are written next to their source page on purpose: relative image and
asset paths then resolve identically from the deck and from the Markdown, so
they need no rewriting.

Marp does not understand the Markdown dialect the site uses, so the source is
preprocessed first:

* slides are split at `#`, `##`, `###` and author-written `---` rules; the
  page title (`#`) gets a slide of its own, and the text below it starts the
  next slide;
* pymdownx admonitions (`!!!` / `???`) become blockquotes;
* the `<terra-draw-editor>` live editor is replaced by a pointer back to the
  web page — it cannot run inside a deck;
* relative `*.md` links are rewritten to their `use_directory_urls` form.

Run before building or serving the site:

    npm --prefix scripts/slides ci
    uv run python scripts/generate_slides.py && uv run zensical build

Generated decks are gitignored; `scripts/build.sh` runs the whole pipeline.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
THEMES_DIR = ROOT / "scripts" / "slides" / "themes"
MARP_BIN = ROOT / "scripts" / "slides" / "node_modules" / ".bin" / "marp"

SLIDE_SUFFIX = "_slide"
THEME_NAME = "terradraw"

# Admonition types mapped to the label prefix used in the generated blockquote.
ADMONITION_ICONS = {
    "abstract": "📄",
    "bug": "🐛",
    "danger": "🚨",
    "example": "📋",
    "failure": "❌",
    "info": "ℹ️",
    "note": "📝",
    "question": "❓",
    "quote": "💬",
    "success": "✅",
    "tip": "💡",
    "warning": "⚠️",
}

FRONT_MATTER_RE = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
EDITOR_RE = re.compile(
    r"^[ \t]*<terra-draw-editor\b.*?</terra-draw-editor>[ \t]*$\n?",
    re.MULTILINE | re.DOTALL,
)
ADMONITION_RE = re.compile(
    r"^(?P<indent>[ \t]*)(?P<marker>!!!|\?\?\?\+?)[ \t]+"
    r'(?P<type>[\w-]+)(?:[ \t]+"(?P<title>[^"]*)")?[ \t]*$'
)
LINK_RE = re.compile(r"(?<=\]\()(?P<target>[^)\s]+)(?=\))")
TITLE_RE = re.compile(r"^# ")
HEADING_RE = re.compile(r"^###? ")

EDITOR_NOTE = "> 💻 **Live editor** — open this page in the browser to run the code."


def strip_front_matter(text: str) -> str:
    return FRONT_MATTER_RE.sub("", text, count=1)


def rewrite_link(target: str) -> str:
    """Rewrite a relative `*.md` link to its built-site directory URL."""
    url, sep, fragment = target.partition("#")
    if not url or url.startswith(("http://", "https://", "mailto:", "/", "#")):
        return target
    if not url.endswith(".md"):
        return target

    base = url[: -len(".md")]
    if base == "index" or base.endswith("/index"):
        base = base[: -len("index")]
        new = base or "./"
    else:
        new = base + "/"
    return new + sep + fragment


def convert_admonitions(text: str) -> str:
    """Turn `!!!` / `???` admonitions into blockquotes Marp can render."""
    lines = text.split("\n")
    out: list[str] = []
    index = 0

    while index < len(lines):
        match = ADMONITION_RE.match(lines[index])
        if not match:
            out.append(lines[index])
            index += 1
            continue

        base_indent = len(match.group("indent").expandtabs(4))
        index += 1

        body: list[str] = []
        while index < len(lines):
            line = lines[index]
            if not line.strip():
                body.append("")
                index += 1
                continue
            if len(line) - len(line.lstrip()) <= base_indent:
                break
            body.append(line)
            index += 1

        while body and not body[-1].strip():
            body.pop()

        kind = match.group("type").lower()
        label = match.group("title") or kind.capitalize()
        icon = ADMONITION_ICONS.get(kind, "📌")

        out.append(f"> **{icon} {label}**")
        if body:
            out.append(">")
            dedented = textwrap.dedent("\n".join(body)).split("\n")
            out.extend(f"> {line}".rstrip() for line in dedented)
        out.append("")

    return "\n".join(out)


def split_into_slides(text: str) -> list[str]:
    """Split at column-0 headings and standalone `---` rules.

    A `#` title stands alone on its slide: whatever follows it starts the next
    one. `##` and `###` keep their section on the same slide as the heading.
    """
    slides: list[list[str]] = [[]]
    in_fence = False

    for line in text.split("\n"):
        if line.startswith(("```", "~~~")):
            in_fence = not in_fence
        elif not in_fence:
            if TITLE_RE.match(line):
                if any(existing.strip() for existing in slides[-1]):
                    slides.append([])
                slides[-1].append(line)
                slides.append([])
                continue
            if HEADING_RE.match(line):
                if any(existing.strip() for existing in slides[-1]):
                    slides.append([])
            elif line.strip() == "---":
                if any(existing.strip() for existing in slides[-1]):
                    slides.append([])
                continue
        slides[-1].append(line)

    return [
        "\n".join(slide).strip()
        for slide in slides
        if any(line.strip() for line in slide)
    ]


def to_marp_markdown(source: str) -> str:
    text = strip_front_matter(source)
    text = EDITOR_RE.sub(EDITOR_NOTE + "\n", text)
    text = convert_admonitions(text)
    text = LINK_RE.sub(lambda m: rewrite_link(m.group("target")), text)

    slides = split_into_slides(text)
    if slides:
        slides[0] = "<!-- _class: lead -->\n<!-- _paginate: false -->\n\n" + slides[0]

    front_matter = f"---\nmarp: true\ntheme: {THEME_NAME}\npaginate: true\n---\n"
    return front_matter + "\n" + "\n\n---\n\n".join(slides) + "\n"


def page_url_for(relative: Path) -> str:
    """Relative URL of the documentation page a deck was generated from."""
    if relative.stem == "index":
        return "./"
    return f"./{relative.stem}/"


# Documentation pages are written as prose, not as decks, so a section can
# easily hold more than fits on a 1280x720 slide — Marpit clips the overflow.
# This scales such slides down instead of losing their tail.
AUTOFIT_SCRIPT = """
<script>
addEventListener("load", function () {
  document.querySelectorAll("section").forEach(function (section) {
    var fit = document.createElement("div");
    fit.className = "td-fit";
    while (section.firstChild) fit.appendChild(section.firstChild);
    section.appendChild(fit);

    var style = getComputedStyle(section);
    var available =
      section.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    var needed = fit.scrollHeight;
    if (needed > available && available > 0) {
      var scale = Math.max(0.5, available / needed);
      fit.style.transformOrigin = "top left";
      fit.style.transform = "scale(" + scale + ")";
      fit.style.width = 100 / scale + "%";
    }
  });
});
</script>
"""


def inject_deck_chrome(html: str, href: str) -> str:
    """Add the "back to page" link and the overflow auto-fit script."""
    snippet = (
        "<style>"
        ".td-fit{width:100%}"
        "#td-back{position:fixed;top:12px;left:12px;z-index:9999;"
        "font:600 13px/1 system-ui,sans-serif;color:#fff;text-decoration:none;"
        "background:rgba(63,81,181,.85);padding:8px 12px;border-radius:6px;"
        "opacity:.35;transition:opacity .15s}"
        "#td-back:hover{opacity:1}"
        "@media print{#td-back{display:none}}"
        "</style>"
        f'<a id="td-back" href="{href}">&larr; Back to page</a>' + AUTOFIT_SCRIPT
    )
    if "</body>" not in html:
        return html + snippet
    return html.replace("</body>", snippet + "</body>", 1)


def remove_stale_decks() -> None:
    for deck in DOCS_DIR.rglob(f"*{SLIDE_SUFFIX}.html"):
        deck.unlink()


def main() -> int:
    if not MARP_BIN.exists():
        print(
            f"Marp CLI not found at {MARP_BIN.relative_to(ROOT)}.\n"
            "Run: npm --prefix scripts/slides ci",
            file=sys.stderr,
        )
        return 1

    pages = sorted(
        path for path in DOCS_DIR.rglob("*.md") if not path.stem.endswith(SLIDE_SUFFIX)
    )
    if not pages:
        print("No Markdown pages found under docs/")
        return 0

    remove_stale_decks()

    with tempfile.TemporaryDirectory(prefix="terradraw-slides-") as tmp:
        tmp_path = Path(tmp)
        src_dir = tmp_path / "src"
        out_dir = tmp_path / "out"

        for page in pages:
            relative = page.relative_to(DOCS_DIR)
            target = src_dir / relative.with_name(f"{relative.stem}{SLIDE_SUFFIX}.md")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(
                to_marp_markdown(page.read_text(encoding="utf-8")), encoding="utf-8"
            )

        result = subprocess.run(
            [
                str(MARP_BIN),
                "--input-dir",
                str(src_dir),
                "--output",
                str(out_dir),
                "--theme-set",
                str(THEMES_DIR),
                "--html",
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            sys.stderr.write(result.stdout)
            sys.stderr.write(result.stderr)
            print("Marp CLI failed", file=sys.stderr)
            return result.returncode

        for page in pages:
            relative = page.relative_to(DOCS_DIR)
            name = f"{relative.stem}{SLIDE_SUFFIX}.html"
            built = out_dir / relative.with_name(name)
            if not built.exists():
                print(f"Marp produced no output for {relative}", file=sys.stderr)
                return 1

            deck = DOCS_DIR / relative.with_name(name)
            deck.write_text(
                inject_deck_chrome(
                    built.read_text(encoding="utf-8"), page_url_for(relative)
                ),
                encoding="utf-8",
            )

    print(f"Wrote {len(pages)} slide decks under docs/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
