# Miscellaneous Notes — Lux Omni Blog

## Article Visibility Gate

**Status:** Idea noted; implementation details intentionally undecided.

- Article visibility will be controlled from the Supabase-backed developer control panel.
- When the gate is disabled, the article displays normally.
- When the gate is enabled, visitors should see a private-article message instead of the article content, with a link back to the homepage.
- The goal is to manage visibility without manually editing each article whenever its status changes.
- Keep this as a small implementation detail for later planning; do not overcomplicate it during current planning.


## Initial authoring workflow update (2026-10-25)
- A separate backend/local article-writing tool (Article Studio) is excluded from the initial scope to reduce workload.
- Articles will initially be authored directly as individual HTML files in Visual Studio Code. Article-specific CSS/JavaScript remains possible where needed.
- Git and GitHub are proposed for version history and checkpoints.
- Suggested SEO/quality tools: browser Developer Tools, Lighthouse/PageSpeed Insights, Google Search Console; Bing Webmaster Tools and Google Trends are optional.
- These workflow/tool choices remain proposals until explicitly confirmed. Hosting/deployment and backend/control-panel decisions remain open.