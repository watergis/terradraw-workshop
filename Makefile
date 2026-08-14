# Terra Draw workshop documentation.
#
#   make install   Install the Python and Marp toolchains
#   make build     Build the whole site (every language) into site/
#   make serve     Build, then preview site/ with rebuild-on-change
#   make clean     Remove the build output and the generated files under docs/
#
# `make build` is self-contained: it installs whatever is missing first, so it
# is the only command Cloudflare Pages needs as its build command.

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

UV ?= uv
NPM ?= npm

# Written after a successful install so the toolchains are only rebuilt when
# their lockfiles change. `node_modules/` is wiped by `npm ci`, so the stamp
# lives inside it and disappears with it.
VENV_STAMP := .venv/.make-install-stamp
NODE_STAMP := scripts/slides/node_modules/.make-install-stamp

.PHONY: help install build serve clean distclean format check

help:
	@echo "make install   Install the Python (uv) and Marp (npm) toolchains"
	@echo "make build     Build every language into site/"
	@echo "make serve     Build, then preview site/ at http://localhost:8000/"
	@echo "               (PORT=8001 make serve to use another port)"
	@echo "make clean     Remove site/, build/ and the generated files in docs/"
	@echo "make distclean Also remove .venv/ and node_modules/"
	@echo "make format    Format the Python sources with Ruff"
	@echo "make check     Lint and check formatting, as CI does"

# ---------------------------------------------------------------------------
# Toolchains
# ---------------------------------------------------------------------------

install: $(VENV_STAMP) $(NODE_STAMP)

# `uv` is present on developer machines and in CI (astral-sh/setup-uv). On a
# bare build image — Cloudflare Pages — it is installed on demand so that
# `make build` alone is enough.
$(VENV_STAMP): pyproject.toml uv.lock
	@command -v $(UV) >/dev/null || { \
		echo "make: uv not found, installing it"; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
	}
	PATH="$$HOME/.local/bin:$$PATH" $(UV) sync
	@mkdir -p $(dir $@) && touch $@

$(NODE_STAMP): scripts/slides/package.json scripts/slides/package-lock.json
	$(NPM) --prefix scripts/slides ci
	@touch $@

# ---------------------------------------------------------------------------
# Build and preview
# ---------------------------------------------------------------------------

# scripts/build.sh does its own `npm ci` unless told otherwise; the install
# targets above have already done it, and repeating it on every build is slow.
build: install
	PATH="$$HOME/.local/bin:$$PATH" bash scripts/build.sh --skip-npm

serve: build
	PATH="$$HOME/.local/bin:$$PATH" $(UV) run python scripts/preview.py \
		$(if $(PORT),--port $(PORT))

# ---------------------------------------------------------------------------
# Housekeeping
# ---------------------------------------------------------------------------

# Everything here is gitignored build output: the assembled site, the staged
# per-language trees, the Marp decks and the injected API keys.
clean:
	rm -rf site build
	find docs -name '*_slide.html' -delete
	rm -f docs/assets/live-editor/keys.js

distclean: clean
	rm -rf .venv scripts/slides/node_modules

format: $(VENV_STAMP)
	$(UV) run ruff format .

check: $(VENV_STAMP)
	$(UV) run ruff check .
	$(UV) run ruff format --check .
