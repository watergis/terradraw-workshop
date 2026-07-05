# FOSS4G Hiroshima 2026 - Terra Draw Workshop

Welcome to the Terra Draw workshop at FOSS4G Hiroshima 2026! This 3-hour hands-on session will teach you how to integrate advanced drawing features into your web mapping applications using Terra Draw's unified API.

## Workshop Overview

[Terra Draw](https://github.com/JamesLMilner/terra-draw) is a powerful, cross-platform drawing library that works with all major web mapping libraries including MapLibre, Leaflet, OpenLayers, Mapbox, Google Maps, and ArcGIS. This workshop will take you from basic concepts to advanced implementation.

Unlike the 2025 edition, everything you need is in **this single website**: every exercise page has a built-in live editor where you can write TypeScript on the left and see the result on the right — no need to jump between repositories. If you prefer working locally, a SvelteKit template is also included in this repository.

### What You'll Learn

- Understanding Terra Draw's architecture and unified API
- Setting up Terra Draw with MapLibre GL JS
- Implementing basic drawing features with the latest drawing modes
- Customizing styles, handling events, and managing data
- Using the new **undo / redo** history feature
- Using the maplibre-gl-terradraw plugin for seamless integration

### Prerequisites

To participate in this workshop, please ensure you have:

- A modern browser (Chrome, Firefox or Safari) — the embedded live editors are all you strictly need
- **Node.js v24 LTS** or **Node.js v22** installed ([download here](https://nodejs.org/) or install by [nvm](https://github.com/nvm-sh/nvm)) if you want to follow the local development track
- **VS Code** or your preferred code editor ([download here](https://code.visualstudio.com/))
- Basic knowledge of JavaScript and web development
- Familiarity with web mapping concepts (helpful but not required)

### Workshop Schedule

The workshop runs for 3 hours with a 15-minute break after the first hour.

| Time | Duration | Section |
|----------|----------|---------|
|14:00-14:15| 15 min | Terra Draw Introduction |
|14:15-14:30| 15 min | [Environment Setup](./getting-started.md) |
|14:30-15:00| 30 min | [Terra Draw Basics - Exercise 1 & 2](./basics/index.md) |
|15:00-15:15| 15 min | Break |
|15:15-15:35| 20 min | [Terra Draw Basics - Exercise 3](./basics/exercise-3.md) |
|15:35-16:30| 55 min | [Advanced Features - Exercise 4 to 7](./advanced/index.md) |
|16:30-16:45| 15 min | [maplibre-gl-terradraw introduction](./maplibre-gl-terradraw.md) |
|16:45-17:00| 15 min | [Other mapping libraries](./other-libraries.md) & Q&A |

### Workshop materials

Everything lives in a single repository: [watergis/terradraw-workshop](https://github.com/watergis/terradraw-workshop)

- **Documentation & live editors** — the pages you are reading now
- **Local template** — a SvelteKit starter under `template/` in the same repository

## Getting Started

To begin setting up your development environment:

[Start with Environment Setup](./getting-started.md)
