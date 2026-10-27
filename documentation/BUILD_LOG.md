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


## 2026-10-27 — Control panel removed

- Deleted the complete `control-panel/` directory and its HTML/CSS/JavaScript placeholders.
- Updated `.github/workflows/pages.yml` to publish only `site/`; removed the `/dev/` assembly, control-panel existence check, and control-panel path trigger.
- Updated active architecture and feature planning documents to use manual source-file configuration instead of a control-panel workflow.
- No public-site source files were changed as part of this removal.


## 2026-10-27 — Category folder migration

- Reorganized seven main categories and 44 subcategories beneath `site/categories/`, using distinct descriptive landing-page filenames. `site/index.html` remains the only `index.html` page.
- Migrated 40 existing populated sample articles into their subcategory-specific `articles/` folders with descriptive filenames.
- Added Engineering's Electrical Engineering, Mechanical Engineering, Labs and Drone Technology topic pages, with five sample articles per topic.
- Updated article-index hrefs, the dynamic Engineering navigation, local links/assets and each page's `data-site-root`.
- Preserved old `sections/` and `articles/` URLs with compatibility redirects and regenerated the canonical sitemap with 112 URLs.
- Kept all CSS files unchanged.

## 2026-10-27 — Legacy redirect and template-placeholder cleanup

- Deleted 52 legacy landing-page redirect files from `site/sections/` and 46 legacy article redirect files from the top-level `site/articles/`.
- Removed the now-empty legacy folders; canonical category pages and articles remain under `site/categories/`.
- Intentionally deleted the empty `site/templates/article-template.html` placeholder. No shared article-template file currently exists.
- Kept the canonical sitemap unchanged at 112 URLs and preserved the existing CSS files.
- Updated `documentation/Lux-Omni-Blog-FileMap.md` to describe the actual repository structure.

## 2026-10-27 — Shared shell components and homepage-only build

- Added source-only partials for the topbar, main navigation header (including the search dialog), and footer under site/partials/.
- Added scripts/build-site.mjs to expand explicit shared-component markers into full HTML at build time, resolve local component links for the current page depth, exclude source partials from public output, and verify the built homepage shell.
- Migrated only site/index.html to shared markers. Category, subcategory, article, and other pages retain their existing markup until the owner approves each subsequent migration step.
- Kept the footer content blank and retained the existing dedicated CSS files.
- Updated the GitHub Pages workflow to run the build before deployment and updated the file map to describe the implemented source/build/output structure.


## 2026-10-27 — Source-level shared shell migration

- Migrated all 112 populated HTML pages under `site/` to one explicit marker each for the canonical topbar, main header/search dialog, and footer.
- Removed the duplicated inline topbar, main header, and search dialog from category, subcategory, and article source files; replaced any existing shared footer shell where present, and added the shared footer marker to each populated page.
- Preserved page-specific content, metadata, URLs, CSS references, and JavaScript; five empty HTML placeholders were left unchanged.
- Reworked `scripts/build-site.mjs` into a marker-only assembler. It rejects populated pages with missing/duplicate markers or leftover hardcoded shared shell markup instead of automatically replacing legacy source markup.
- Updated the file map to describe the source-level shared-component structure and strict build behavior.

## 2026-10-27 — Initial shared footer content

- Replaced the empty footer partial with a brand summary, round author avatar/profile link, seven main-category links, the existing article-search trigger, a link to the public source repository, copyright, and Back to Top.
- Kept the author-page destination at the requested temporary `https://example.com` URL; the avatar uses the repository owner's public GitHub profile image.
- Implemented responsive footer columns and theme-aware text masks so the circuit pattern does not show through the footer's text.
- Left optional RSS/Atom/JSON feeds, recent-posts module, status page, newsletter, social-link list, and unfinished policy destinations out of this implementation.

## 2026-10-27 — Dark theme first-visit default

- Changed the theme initializer fallback to dark mode when no valid preference is saved; saved `light` or `dark` values continue to take priority.
- Kept the existing localStorage key and theme-toggle persistence behavior unchanged.
- Updated the design-token documentation to reflect the dark first-visit default.

