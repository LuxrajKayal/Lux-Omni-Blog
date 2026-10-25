# Lux Omni Blog — Build and Planning Log

**Implementation status:** Initial shared navigation/search/theme implementation completed; broader homepage and editorial content build remains in progress.

Append-only after implementation begins. Record real milestones only; do not pre-fill future work as completed.

## Planning milestone — 2026-10-25
- Discussed excluding a separate backend/local Article Studio from the initial scope.
- Updated draft workflow to author individual HTML articles in VS Code, use proposed Git/GitHub checkpoints, and include SEO fundamentals from the beginning.
- Hosting/deployment, backend, and control-panel choices remain unresolved.
- No code, repository, or deployment changes were made.


## 2026-10-25 — Article-group page planning update

- Documented the homepage → group landing page → individual article hierarchy.
- Recorded six linkable sample articles per final group for development testing and a canonical article-template contract.
- Updated planning documents only; no repository or deployment changes occurred.

## 2026-10-25 — Initial repository skeleton

- Added a blank public-site skeleton under `site/`.
- Added root-level `documentation/` with the planning reference files.
- Added a separate blank `control-panel/` skeleton for the future application.
- Added six blank sample article files in each of the five currently listed article groups (30 sample files total).
- No website implementation code or article content was added. The existing root `README.md` was left unchanged.


## 2026-10-25 — Main header, category destinations, search and theme

- Implemented the single-row CNET-inspired navigation with the supplied transparent-symbol SVG and a bold uppercase crimson LUX OMNI wordmark that remains crimson across themes.
- Added direct parent links and separate click-operated dropdown controls for Tech, Reviews, How To, Hardware, Software and Buying Advice; hover does not open menus.
- Added dedicated parent and dropdown-category landing pages and linkable sample article HTML pages for all current menu categories.
- Implemented the search popup with text search, category filtering, a reading-time slider and sorting by date/category/article title.
- Implemented a persistent light/dark theme toggle and placed JavaScript in the existing `site/assets/js/` structure with `main.js` as the entry point.
- Added responsive navigation and updated the file map and navigation planning documents. The finalized copper topbar stylesheet and design tokens were not changed.
