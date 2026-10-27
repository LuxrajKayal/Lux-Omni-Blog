# Lux Omni Blog — File Map

**Project:** `blog.luxomni.com`  
**Status:** Proposed planning map — not a commitment to a framework or final implementation.  
**Hosting direction:** The current GitHub Pages workflow publishes the static site from `site/`. External database and media services are not required or configured for the current scope.

This map separates the **public website** (stored in `site/`) from planning materials (`documentation/`). The control panel/dashboard has been removed from the project. The initial authoring workflow is to edit individual HTML article files directly in Visual Studio Code, preview and test locally, use Git/GitHub for version history, then publish the `site/` directory.

---

## Repository Layout in GitHub

The repository separates two areas. **Only `site/` is intended to be the public website's document root.** Publish `site/` rather than the repository root so planning documents are not website components. The existing root `README.md` remains untouched.

```text
Lux-Omni-Blog/
├── README.md                    # Existing file; unchanged
├── documentation/               # Planning references for development only
│   ├── PLAN_INDEX.md
│   ├── Lux-Omni-Blog-FileMap.md
│   ├── Lux-Omni-Blog-Blueprint.md
│   ├── Lux-Omni-Blog-Step-by-Step-Build-Plan.md
│   ├── Article-Group-Pages.md
│   └── ... other planning documents
├── site/                        # Public website source and eventual publish root
│   ├── index.html
│   ├── pages/
│   ├── sections/
│   ├── templates/
│   ├── articles/
│   └── assets/
```

## 1. Public Website — GitHub Pages

The active workflow publishes only `site/`. The homepage is the **only file named `index.html`** in the public website. Category and subcategory landing pages use descriptive, unique names ending in `-index.html`; articles use descriptive filenames in each subcategory's `articles/` directory. Do not add nested `index.html` files.

```text
site/
├── index.html
├── categories/
│   ├── tech-news/tech-news-index.html
│   │   ├── ai/tech-ai-index.html
│   │   ├── phones/tech-phones-index.html
│   │   └── ... remaining Tech News subcategories
│   ├── engineering/engineering-index.html
│   │   ├── electrical/electrical-engineering-index.html
│   │   ├── mechanical/mechanical-engineering-index.html
│   │   ├── labs/engineering-labs-index.html
│   │   └── drone-technology/drone-technology-index.html
│   ├── reviews/reviews-index.html
│   ├── how-to/how-to-index.html
│   ├── hardware/hardware-index.html
│   ├── software/software-index.html
│   └── buying-advice/buying-advice-index.html
├── pages/
├── templates/
├── assets/
│   ├── css/   # Existing stylesheets; unchanged in this migration
│   ├── images/
│   └── js/
├── sections/  # Legacy URL redirects retained for compatibility
├── articles/  # Legacy URL redirects retained for compatibility
├── sitemap.xml
└── 404.html
```

There are seven main categories and 44 subcategories, including Drone Technology under Engineering. Every subcategory owns an `articles/` folder. The article index uses site-root-relative canonical hrefs; each HTML page's `data-site-root` is set for its directory depth so search and shared assets work from every level.

Previous `sections/*.html` and `articles/*/*.html` paths remain as simple compatibility redirects. They are not canonical URLs and are excluded from the sitemap. The canonical sitemap lists 112 pages: one homepage, 51 category/subcategory landing pages and 60 sample articles.

The existing visual CSS and responsive rules are not changed during a category/file-structure migration.
## 2. Initial Authoring and Publishing Workflow — VS Code, Git and GitHub

No separate Article Studio or backend article-writing tool will be built for the initial release. The owner will create and edit each article directly as an HTML file in Visual Studio Code. Articles may use custom HTML structure and article-specific CSS/JavaScript when justified; a shared starter file is optional and must not force all articles into the same layout.

```text
Local project folder
├── index.html                 # Homepage
├── sections/                  # Dedicated article-group landing pages
├── templates/article-template.html  # Canonical article starter/reference
├── articles/<group-slug>/     # Six development samples per group, then later articles
├── assets/                    # Shared CSS, JS, images and UI assets
└── ...

Git repository
└── GitHub remote              # Version history and backup/collaboration
```

**Proposed working cycle (not yet approved as a final deployment procedure):**
1. Create or edit one scoped fragment in VS Code.
2. Preview it locally in a browser.
3. Check responsive behaviour, links, browser-console errors and basic accessibility.
4. Check SEO basics for each article: unique title and description, meaningful headings, descriptive URL/slug, canonical URL when appropriate, image alt text, and social-preview metadata.
5. Run relevant Lighthouse/PageSpeed checks at suitable milestones rather than after every tiny text edit.
6. Commit the tested change in Git and push it to GitHub. Do not label a known-broken change as a good checkpoint.
7. Publish using the deployment method selected later; verify the live URL and update sitemap/listings as needed.

**Initial tool shortlist:**
- Visual Studio Code — editing individual HTML/CSS/JS files.
- Git — local version history and checkpoints.
- GitHub — remote repository and change history.
- Browser Developer Tools — console, network, device/responsive testing.
- Google Lighthouse / PageSpeed Insights — performance, accessibility, SEO and best-practice audits.
- Google Search Console — indexing, search performance and sitemap monitoring after the domain is ready.
- Bing Webmaster Tools — optional additional search-engine monitoring.
- Google Trends — optional topic research; not a technical requirement.

These tools are recommendations, not an instruction to sign up for every service immediately. No SEO tool can guarantee indexing or ranking.

---

## 3. Optional External Services

The current website uses static HTML, CSS, JavaScript and local article metadata. A database or control panel is not required for the current scope. Large media storage (for example, Cloudflare R2) may be evaluated separately if needed; no external backend or media service is assumed to be configured.

## 4. Publishing Flow

```text
VS Code article authoring
        │
        ├── Create/edit and preview custom article HTML
        ├── Validate article ID, metadata, links and media references
        └── Prepare article for publication
                    │
                    ▼
          Cloudflare Pages deployment
                    │
                    ├── Article has a stable public URL
                    └── Sitemap/public article listing is updated

Manual source edits in VS Code ─► Git/GitHub ─► approved site deployment

Large media ─────────────────► Cloudflare R2
```

The exact automation mechanism—manual Wrangler deployment, a script, or another approved workflow—remains open. This map does not configure or deploy anything.

---

## 5. File and Naming Rules

1. **One article, one HTML file** under `articles/<group-slug>/`, with custom article-specific styling or scripting when needed.
2. Every final article group has one page under `sections/<group-slug>.html` and a matching `articles/<group-slug>/` folder.
3. Create six sample article HTML files per group during development. They are intentionally linkable test content and may be removed later by the owner.
4. Use `templates/article-template.html` as the canonical starter/reference; preserve stable metadata conventions, classes/IDs, navigation links and shared hooks when creating an article from it.
5. Use stable lowercase filenames with hyphens; avoid spaces and frequent URL changes.
6. Keep article IDs distinct from media IDs. IDs support management and references; they are not secrets or access controls.
7. Keep large media in R2 and store references/metadata where appropriate.
8. Keep public website source, local drafts and secrets separated. Never put credentials or private keys in public files.
9. Add shared CSS/JS files only when there is a real need for shared behavior; do not create empty files just to match this map.
10. Preserve the existing file map and architecture decisions as the project evolves. Update this document when the actual structure changes.
11. Do not treat optional files or proposed component names as final until explicitly approved.

---

## 6. Decisions Still Open

- Exact URL format for articles (`/articles/article-name.html` versus clean directory URLs).
- How homepage selections, metadata and settings should be represented in static source files.
- Deployment automation for new article files and sitemap updates.
- Whether search is generated at build time, uses a client-side index, or uses another method.
- Final CSS/JavaScript module boundaries after the first working skeleton.
- Whether the optional `manifest.webmanifest`, contact page, analytics and self-hosted fonts are needed.

**Guiding principle:** start with the smallest working structure, keep article URLs stable, and add files when the corresponding feature is implemented.

## Repository boundary reminder

- Keep all planning files under the repository-root `documentation/` directory, outside `site/`.
- Keep public HTML, CSS, JavaScript, and public-site asset placeholders under `site/`.
- Do not include the root `documentation/` directory in the public website's deployment output.
- The existing root `README.md` is not modified as part of the skeleton.
