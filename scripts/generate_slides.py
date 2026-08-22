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
* on a talk deck (`slide_theme: presentation`) a `##` slide is a section
  divider — the heading is the section title and the paragraph under it the
  subtitle — and `###` is an ordinary content slide;
* pymdownx admonitions (`!!!` / `???`) become blockquotes;
* the `<terra-draw-editor>` live editor becomes a slide of its own holding an
  iframe onto `assets/live-editor/embed.html`, so the editor stays usable while
  presenting (see `editor_slide`);
* relative `*.md` links are rewritten to their `use_directory_urls` form.

A page configures its own deck through its front matter:

    ---
    slide_theme: presentation
    header_logo: ../assets/images/foss4g2026/foss4g2026-logo-small.svg
    title_logo: ../assets/images/foss4g2026/foss4g2026-logo-large.svg
    event_date: 3 September 2026, 14:30
    event_venue: International Conference Center Hiroshima
    event_name: FOSS4G 2026 Hiroshima
    presenter_name: Jin Igarashi
    presenter_role: Software Engineer, Fracta Inc
    profile_image: ../assets/images/jin-igarashi.png
    linkedin: jinigarashi
    github: JinIgarashi
    ---

`slide_theme: presentation` switches the deck to the talk theme
(`terradraw-presentation`); without it a page gets the documentation theme
(`terradraw`).

`header_logo` is shown on every slide, `title_logo` only on the title slide.
Paths are written relative to the page, like Markdown image paths. Geometry
lives in the theme (`.td-header-logo` / `.td-title-logo`); only the image URLs
are injected per deck.

`presenter_name`, `event_date`, `event_venue` and `event_name` are added to the
title slide — the speaker name above the event lines, one per line, in that
order. `profile_image` adds a generated
speaker slide right after the title, built from `presenter_name`,
`presenter_role` and the `linkedin` / `github` account names.

Run before building or serving the site:

    npm --prefix scripts/slides ci
    uv run python scripts/generate_slides.py && uv run zensical build

Generated decks are gitignored; `scripts/build.sh` runs the whole pipeline.
"""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import subprocess
import sys
import tempfile
import textwrap
from html import escape
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent.parent
I18N_DIR = ROOT / "i18n"

# Which documentation tree to build decks for. `--docs-dir` points this at a
# staged translation tree (build/i18n/<lang>/docs, see scripts/build_i18n.py) so
# each language gets its own decks.
DOCS_DIR = ROOT / "docs"
THEMES_DIR = ROOT / "scripts" / "slides" / "themes"
MARP_BIN = ROOT / "scripts" / "slides" / "node_modules" / ".bin" / "marp"

SLIDE_SUFFIX = "_slide"

# Documentation pages get the prose-oriented theme; a talk page opts into the
# presentation theme with `slide_theme: presentation`.
THEME_NAME = "terradraw"
SLIDE_THEMES = {"presentation": "terradraw-presentation"}

PROFILE_CLASS = "td-profile"
SECTION_CLASS = "td-section"
SECTION_ALT_CLASS = "td-section-alt"
SOCIAL_ICON_DIR = "assets/images/social"
# Account front matter key -> (icon file stem, profile URL template)
SOCIAL_LINKS = {
    "linkedin": ("linkedin", "linkedin.com/in/{account}"),
    "github": ("github", "github.com/{account}"),
}

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

FRONT_MATTER_RE = re.compile(r"\A---\n(?P<body>.*?)\n---\n", re.DOTALL)
META_LINE_RE = re.compile(r"^(?P<key>[\w-]+)[ \t]*:[ \t]*(?P<value>.*)$")

# Front matter keys understood here, and the class each one adds to the deck.
HEADER_LOGO_CLASS = "td-header-logo"
TITLE_LOGO_CLASS = "td-title-logo"
EDITOR_RE = re.compile(
    r"^[ \t]*<terra-draw-editor\b(?P<attrs>[^>]*)>\s*</terra-draw-editor>[ \t]*$\n?",
    re.MULTILINE,
)
ATTRIBUTE_RE = re.compile(r'(?P<name>[\w-]+)\s*=\s*"(?P<value>[^"]*)"')
ADMONITION_RE = re.compile(
    r"^(?P<indent>[ \t]*)(?P<marker>!!!|\?\?\?\+?)[ \t]+"
    r'(?P<type>[\w-]+)(?:[ \t]+"(?P<title>[^"]*)")?[ \t]*$'
)
LINK_RE = re.compile(r"(?<=\]\()(?P<target>[^)\s]+)(?=\))")
TITLE_RE = re.compile(r"^# ")
HEADING_RE = re.compile(r"^###? ")
SECTION_RE = re.compile(r"^## ")

# The live editor is a Web Component loaded from the site stylesheet and
# `extra_javascript`, neither of which a deck has. `docs/assets/live-editor/embed.html`
# hosts one widget on a page of its own, and a deck embeds that in an iframe —
# which also keeps CodeMirror's keystrokes away from Marp's slide navigation.
EDITOR_CLASS = "td-editor"
EDITOR_DIR = "assets/live-editor"
EDITOR_PAGE = f"{EDITOR_DIR}/embed.html"
EDITOR_SENTINEL_RE = re.compile(r"\A<!--td-editor:(?P<payload>.*)-->\Z", re.DOTALL)
# Shown instead of the iframe where it cannot run: printing, or a PDF export.
EDITOR_FALLBACK = (
    "💻 <strong>Live editor</strong> — open this page in the browser to run the code."
)

# Language the decks are generated for, used for the widget's UI strings. Set
# from `--lang`; `scripts/build.sh` passes the language it is staging.
LANG = "en"


def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    """Split a page into its front matter and its body.

    Only flat `key: value` lines are read — enough for the deck options below,
    and it keeps the generator free of a YAML dependency.
    """
    match = FRONT_MATTER_RE.match(text)
    if not match:
        return {}, text

    meta: dict[str, str] = {}
    for line in match.group("body").split("\n"):
        entry = META_LINE_RE.match(line)
        if entry:
            meta[entry.group("key")] = entry.group("value").strip().strip("\"'")
    return meta, text[match.end() :]


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


def event_html(meta: dict[str, str]) -> str:
    """Speaker and event block for the title slide.

    The presenter name sits above the event metadata, which stacks date, venue
    and event name one per line. Each part is optional, so a page that declares
    none of them gets nothing.
    """
    parts = [meta.get("event_date"), meta.get("event_venue"), meta.get("event_name")]
    lines = "".join(f"<div>{escape(part)}</div>" for part in parts if part)

    blocks = ""
    name = meta.get("presenter_name")
    if name:
        blocks += f'<div class="td-presenter">{escape(name)}</div>'
    if lines:
        blocks += f'<div class="td-event-meta">{lines}</div>'
    if not blocks:
        return ""
    return f'\n\n<div class="td-event">{blocks}</div>'


def asset_prefix(relative: Path) -> str:
    """Path prefix from a page back to `docs/`, as its Markdown links use."""
    return "../" * len(relative.parent.parts)


def profile_slide(meta: dict[str, str], relative: Path, classes: list[str]) -> str:
    """Speaker slide generated from the page's front matter.

    Written as HTML rather than Markdown because the layout is a two-column
    grid — the theme styles `.td-profile-*`, this only fills it in.
    """
    prefix = asset_prefix(relative)

    links = ""
    for key, (icon, url_template) in SOCIAL_LINKS.items():
        account = meta.get(key)
        if not account:
            continue
        label = url_template.format(account=account)
        links += (
            '<div class="td-profile-link">'
            f'<img class="td-social-icon" src="{prefix}{SOCIAL_ICON_DIR}/{icon}.svg"'
            f' alt="{key}" />'
            f"<span>{escape(label)}</span>"
            "</div>"
        )

    name = meta.get("presenter_name", "")
    role = meta.get("presenter_role", "")
    photo = meta["profile_image"]

    return (
        f"<!-- _class: {' '.join(classes)} -->\n\n"
        "<div>"
        f'<p class="td-profile-name">{escape(name)}</p>'
        f'<p class="td-profile-role">{escape(role)}</p>'
        f"{links}"
        "</div>\n"
        f'<img class="td-profile-photo" src="{escape(photo, quote=True)}"'
        f' alt="{escape(name)}" />'
    )


def editor_source(value: str, page_dir: str) -> str:
    """Rewrite a page-relative code path to one relative to the embed page.

    A widget writes its sources the way the Markdown page sees them
    (`start="../../code/exercise-1/start.ts"`), but the widget that finally
    reads them lives on `assets/live-editor/embed.html` and resolves them
    against that page. Both are relative, so this stays language-agnostic: the
    same deck works from `/` and from `/<lang>/`.
    """
    target = posixpath.normpath(posixpath.join(page_dir, value))
    return posixpath.relpath(target, EDITOR_DIR)


def editor_slide(
    attrs: dict[str, str], relative: Path, classes: list[str], heading: str | None
) -> str:
    """Slide holding one live editor, as an iframe onto the embed page.

    The heading is the one the widget sat under on the web page, so the slide
    keeps the exercise's title; the theme gives `.td-editor` the full-bleed
    layout and swaps the iframe for `.td-editor-fallback` when printing.
    """
    # Sources are written relative to the page's URL, and `use_directory_urls`
    # gives an ordinary page one more segment than its file has.
    page_dir = relative.parent
    if relative.stem != "index":
        page_dir = page_dir / relative.stem
    query = {"start": editor_source(attrs["start"], page_dir.as_posix()), "lang": LANG}
    if attrs.get("answer"):
        query["answer"] = editor_source(attrs["answer"], page_dir.as_posix())
    if attrs.get("lib"):
        query["lib"] = attrs["lib"]
    if attrs.get("boilerplate") == "none":
        query["boilerplate"] = "none"

    src = f"{asset_prefix(relative)}{EDITOR_PAGE}?{urlencode(query)}"
    title = f"### {heading}\n\n" if heading else ""
    return (
        f"<!-- _class: {' '.join(classes)} -->\n\n"
        f"{title}"
        '<div class="td-editor-embed">\n'
        f'<iframe src="{escape(src, quote=True)}" title="Live editor"'
        ' allow="fullscreen"></iframe>\n'
        f'<p class="td-editor-fallback">{EDITOR_FALLBACK}</p>\n'
        "</div>"
    )


def apply_editor_slides(
    slides: list[str], relative: Path, deck_classes: list[str]
) -> list[str]:
    """Turn every editor placeholder into its own live-editor slide.

    `to_marp_markdown` leaves a sentinel comment fenced by `---` rules, so the
    split above has already given each editor a slide to itself; all that is
    left is to fill it in, with the heading carried over from the slide before.
    """
    out: list[str] = []
    heading: str | None = None

    for slide in slides:
        match = EDITOR_SENTINEL_RE.match(slide)
        if match:
            attrs = json.loads(match.group("payload"))
            classes = [EDITOR_CLASS, *deck_classes]
            out.append(editor_slide(attrs, relative, classes, heading))
            continue
        for line in slide.split("\n"):
            if HEADING_RE.match(line) or SECTION_RE.match(line):
                heading = line.lstrip("#").strip()
                break
        out.append(slide)

    return out


def to_marp_markdown(source: str, relative: Path) -> tuple[dict[str, str], str]:
    meta, text = parse_front_matter(source)
    # Fenced by `---` so the split below gives every editor a slide of its own.
    text = EDITOR_RE.sub(
        lambda match: (
            "\n---\n\n"
            + "<!--td-editor:"
            + json.dumps(dict(ATTRIBUTE_RE.findall(match.group("attrs"))))
            + "-->\n\n---\n"
        ),
        text,
    )
    text = convert_admonitions(text)
    text = LINK_RE.sub(lambda m: rewrite_link(m.group("target")), text)

    # `_class` replaces the global class on that slide, so the title slide has
    # to repeat the header logo class rather than only carrying `lead`.
    deck_classes = [HEADER_LOGO_CLASS] if meta.get("header_logo") else []
    title_classes = ["lead", *deck_classes]
    if meta.get("title_logo"):
        title_classes.append(TITLE_LOGO_CLASS)

    theme = SLIDE_THEMES.get(meta.get("slide_theme", ""), THEME_NAME)

    slides = apply_editor_slides(split_into_slides(text), relative, deck_classes)
    if slides:
        # Only a talk deck treats `##` as a section divider — a documentation
        # page uses it for ordinary sections full of prose.
        if theme == SLIDE_THEMES["presentation"]:
            # Every other divider gets the alternate wash, so two sections in a
            # row never look the same. CSS cannot count by class, hence here.
            seen = 0
            for index, slide in enumerate(slides[1:], start=1):
                if not SECTION_RE.match(slide):
                    continue
                classes = [SECTION_CLASS, *deck_classes]
                if seen % 2:
                    classes.insert(1, SECTION_ALT_CLASS)
                seen += 1
                slides[index] = f"<!-- _class: {' '.join(classes)} -->\n\n{slide}"

        slides[0] = (
            f"<!-- _class: {' '.join(title_classes)} -->\n"
            "<!-- _paginate: false -->\n\n" + slides[0] + event_html(meta)
        )
        if meta.get("profile_image"):
            slides.insert(
                1, profile_slide(meta, relative, [PROFILE_CLASS, *deck_classes])
            )

    front_matter = f"---\nmarp: true\ntheme: {theme}\npaginate: true\n"
    if deck_classes:
        front_matter += f"class: {' '.join(deck_classes)}\n"
    front_matter += "---\n"
    return meta, front_matter + "\n" + "\n\n---\n\n".join(slides) + "\n"


def page_url_for(relative: Path) -> str:
    """Relative URL of the documentation page a deck was generated from."""
    if relative.stem == "index":
        return "./"
    return f"./{relative.stem}/"


# Documentation pages are written as prose, not as decks, so a section can
# easily hold more than fits on a 1280x720 slide — Marpit clips the overflow.
# This scales such slides down instead of losing their tail.
#
# Title, speaker and section slides are laid out by the theme (centred, or a
# two-column grid), and re-parenting their children into the wrapper would
# break that, so they are left alone — they are short by construction. So is
# the live-editor slide, whose iframe fills whatever height is left.
AUTOFIT_SCRIPT = """
<script>
addEventListener("load", function () {
  document.querySelectorAll("section").forEach(function (section) {
    if (section.classList.contains("lead") ||
        section.classList.contains("td-section") ||
        section.classList.contains("td-editor") ||
        section.classList.contains("td-profile")) return;
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


# The deck is also embedded in an iframe as a preview on its talk page. There
# the link back to that very page is noise, so it is dropped when framed.
BACK_LINK_SCRIPT = """
<script>
(function () {
  var framed = false;
  try {
    framed = window.self !== window.top;
  } catch (e) {
    framed = true;
  }
  if (!framed) return;
  var back = document.getElementById("td-back");
  if (back) back.remove();
})();
</script>
"""


def css_url(path: str) -> str:
    escaped = path.replace("\\", "\\\\").replace('"', '\\"')
    return f'url("{escaped}")'


def logo_css(meta: dict[str, str]) -> str:
    """Per-deck image URLs for the logos declared in a page's front matter.

    `!important` is needed because Marp scopes the theme's selectors — the
    scoped `section { background: #fff }` rule is more specific than anything
    that can be written here, and its shorthand clears `background-image`.
    """
    rules = ""
    header = meta.get("header_logo")
    if header:
        rules += (
            f"section.{HEADER_LOGO_CLASS}::before"
            f"{{background-image:{css_url(header)} !important}}"
        )
    title = meta.get("title_logo")
    if title:
        rules += (
            f"section.{TITLE_LOGO_CLASS}"
            f"{{background-image:{css_url(title)} !important}}"
        )
    return rules


def inject_deck_chrome(html: str, href: str, meta: dict[str, str]) -> str:
    """Add the "back to page" link, the deck logos and the auto-fit script."""
    styles = (
        ".td-fit{width:100%}"
        "#td-back{position:fixed;top:12px;left:12px;z-index:9999;"
        "font:600 13px/1 system-ui,sans-serif;color:#fff;text-decoration:none;"
        "background:rgba(63,81,181,.85);padding:8px 12px;border-radius:6px;"
        "opacity:.35;transition:opacity .15s}"
        "#td-back:hover{opacity:1}"
        "@media print{#td-back{display:none}}"
    ) + logo_css(meta)
    snippet = (
        f"<style>{styles}</style>"
        f'<a id="td-back" href="{href}">&larr; Back to page</a>'
        + BACK_LINK_SCRIPT
        + AUTOFIT_SCRIPT
    )
    if "</body>" not in html:
        return html + snippet
    return html.replace("</body>", snippet + "</body>", 1)


def remove_stale_decks() -> None:
    for deck in DOCS_DIR.rglob(f"*{SLIDE_SUFFIX}.html"):
        deck.unlink()


def is_translation(path: Path) -> bool:
    """True for a `<name>.<lang>.md` translation source.

    Translations are not pages in their own right — `scripts/build_i18n.py`
    moves them over their English counterpart in the staged tree, which is what
    gets decks. Building one from `docs/` directly would emit a deck the site
    never links to.
    """
    lang = Path(path.stem).suffix.lstrip(".")
    return bool(lang) and (I18N_DIR / f"{lang}.toml").is_file()


def main() -> int:
    global DOCS_DIR, LANG

    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--docs-dir",
        type=Path,
        default=DOCS_DIR,
        help="documentation tree to generate decks for (default: docs/)",
    )
    parser.add_argument(
        "--lang",
        default=LANG,
        help="language of that tree, for the live editor's UI strings",
    )
    args = parser.parse_args()

    LANG = args.lang
    DOCS_DIR = args.docs_dir.resolve()
    if not DOCS_DIR.is_dir():
        print(f"No such docs directory: {args.docs_dir}", file=sys.stderr)
        return 1

    if not MARP_BIN.exists():
        print(
            f"Marp CLI not found at {MARP_BIN.relative_to(ROOT)}.\n"
            "Run: npm --prefix scripts/slides ci",
            file=sys.stderr,
        )
        return 1

    pages = sorted(
        path
        for path in DOCS_DIR.rglob("*.md")
        if not path.stem.endswith(SLIDE_SUFFIX) and not is_translation(path)
    )
    if not pages:
        print(f"No Markdown pages found under {DOCS_DIR.relative_to(ROOT)}/")
        return 0

    remove_stale_decks()

    with tempfile.TemporaryDirectory(prefix="terradraw-slides-") as tmp:
        tmp_path = Path(tmp)
        src_dir = tmp_path / "src"
        out_dir = tmp_path / "out"

        deck_meta: dict[Path, dict[str, str]] = {}
        for page in pages:
            relative = page.relative_to(DOCS_DIR)
            target = src_dir / relative.with_name(f"{relative.stem}{SLIDE_SUFFIX}.md")
            target.parent.mkdir(parents=True, exist_ok=True)
            meta, markdown = to_marp_markdown(
                page.read_text(encoding="utf-8"), relative
            )
            deck_meta[relative] = meta
            target.write_text(markdown, encoding="utf-8")

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
                    built.read_text(encoding="utf-8"),
                    page_url_for(relative),
                    deck_meta[relative],
                ),
                encoding="utf-8",
            )

    print(f"Wrote {len(pages)} slide decks under {DOCS_DIR.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
