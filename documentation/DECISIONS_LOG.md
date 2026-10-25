# Lux Omni Blog — Decisions Log

**Status:** Open. Record a decision only after the owner explicitly approves it.

| Date | Decision | Status | Reason / notes |
|---|---|---|---|
| 2026-10-25 | Exclude a separate backend/local article-writing tool from the initial scope; author articles directly in VS Code is the current working direction. | Proposed / confirm with owner | Reduce initial workload; use individual HTML files and custom article layouts where needed. |
| 2026-10-25 | Use Git and GitHub for version control/checkpoints. | Proposed / confirm with owner | Enable traceable small changes and recovery. |
| 2026-10-25 | Add SEO fundamentals from the beginning and use appropriate auditing/search-console tools. | Proposed / confirm with owner | Catch metadata, crawlability, and quality issues early. |

Do not silently promote a proposal to Approved. Add a dated row when the owner confirms or changes a decision.

| 2026-10-25 | Each final article group/navigation destination will have its own landing page, matching article folder, and six separate sample article HTML files during development. Samples remain linkable for testing and can be deleted later by the owner. | Confirmed planning requirement | Keeps homepage previews, group browsing, individual articles, and future publishing software connected. |
| 2026-10-25 | Use `templates/article-template.html` as the canonical article starter/reference contract while allowing deliberate article-specific layouts. | Confirmed planning requirement | Standardizes metadata/link/hooks to reduce accidental breakage as authoring software is added later. |

## D-Repository-Layout — 2026-10-25

**Decision:** Keep repository-root `documentation/`, public-site `site/`, and future `control-panel/` as siblings. Configure future public-site hosting to publish `site/` only.

**Reason:** Planning documents must remain available on GitHub for development reference without becoming components of the public website. The control panel is a separate future application.

**Status:** Confirmed by the project owner.
