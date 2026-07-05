# terradraw-workshop

## Workshop example codes and template

This workshop example codes and template are available at [watergis/terradraw-workshop-template](https://github.com/watergis/terradraw-workshop-template)

## Development

- Install dependencies

```bash
uv sync
```

- Launch Zensical locally

```bash
uv run zensical serve
```

- Format code with Ruff

```bash
uv run ruff format .
```

Open http://localhost:8000/

## Build

```bash
uv run python scripts/generate_keys.py
uv run zensical build
```

### Live-editor API keys

Some live-editor examples (Mapbox GL JS, Google Maps) need API keys, which
are baked into the site at build time by `scripts/generate_keys.py`:

- **Locally**: copy `.env.example` to `.env`, fill in the keys, and run the
  script before building/serving. It writes the gitignored
  `docs/assets/live-editor/keys.js`.
- **Cloudflare Pages**: set `MAPBOX_ACCESS_TOKEN` and `GOOGLE_MAPS_API_KEY`
  as build environment variables in the Pages project settings, and use the
  build command above (the script prefers environment variables over `.env`).

Restrict the keys by HTTP referrer — the built site is public. If a key is
missing, the affected example shows a notice instead of a map; everything
else works.
