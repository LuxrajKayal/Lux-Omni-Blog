# Lux Omni Blog — File Map

**Project:** `blog.luxomni.com`  
**Status:** Proposed planning map — not a commitment to a framework or final implementation.  
**Hosting direction:** Cloudflare Pages for the public site and published article HTML; Cloudflare R2 for large media; Supabase for structured metadata and developer-panel settings.

This map separates the **public website** (stored in `site/`) from planning materials (`documentation/`) and any future developer control panel (`control-panel/`). The initial authoring workflow is deliberately simple: edit individual HTML article files directly in Visual Studio Code, preview and test locally, use Git/GitHub for version history, then publish through a deployment method that will be decided later. A separate article-writing tool is excluded from the initial scope.

---

## Repository Layout in GitHub

The repository separates three areas. **Only `site/` is intended to be the public website's document root.** When hosting is configured later, publish `site/` rather than the repository root so planning documents and control-panel files are not website components. The existing root `README.md` remains untouched.

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
└── control-panel/                # Separate future application, outside the public site
```

## 1. Public Website — Cloudflare Pages

The tree below is relative to `site/`. Hosting/build settings remain undecided; when chosen, the public output root should be `site/`.

```text
site/
├── index.html                    # Homepage; contains the homepage components already planned
├── 404.html                      # Custom not-found page; should return HTTP 404
├── robots.txt                    # Search-engine crawling rules
├── sitemap.xml                   # Updated to reflect the actual URLs currently included in the site
├── favicon.ico
├── manifest.webmanifest          # Optional; add if install/PWA support is wanted
│
├── pages/                        # Standalone utility/legal pages
│   ├── search.html               # Search interface
│   ├── archive.html              # Cross-group article archive with filters/pagination
│   ├── privacy.html              # Blog-specific privacy information
│   ├── advertising.html           # Advertising/contact information
│   └── contact.html              # Optional; can instead link to a Google Form
│
├── sections/                     # One dedicated landing page for each final article group/navigation destination
│   ├── reviews.html               # Example group landing page
│   ├── drone-technology.html      # Example group landing page
│   ├── tutorials.html             # Example group landing page
│   ├── tech-news-and-guides.html  # Example group landing page
│   ├── buying-guides.html         # Example group landing page
│   └── <group-slug>.html          # Add one page for every additional final group/destination
│
├── templates/
│   └── article-template.html      # Canonical article starter/contract for authors and future publishing software
│
├── articles/                     # Individual sample and editorial article HTML files, grouped by article group
│   ├── reviews/
│   │   ├── sample-review-01.html
│   │   ├── sample-review-02.html
│   │   ├── sample-review-03.html
│   │   ├── sample-review-04.html
│   │   ├── sample-review-05.html
│   │   └── sample-review-06.html
│   ├── drone-technology/          # Six sample articles during development, plus later real articles
│   ├── tutorials/                 # Six sample articles during development, plus later real articles
│   ├── tech-news-and-guides/      # Six sample articles during development, plus later real articles
│   ├── buying-guides/             # Six sample articles during development, plus later real articles
│   └── <group-slug>/              # One matching folder for every additional article group
│
├── assets/
│   ├── css/
│   │   ├── tokens.css            # Shared brand, theme, spacing and typography tokens
│   │   ├── base.css              # Resets, body defaults and shared typography
│   │   ├── layout.css            # Shared page/container layout
│   │   ├── topbar.css            # Top information bar
│   │   ├── header.css            # Main navigation header and theme/search controls
│   │   ├── dropdowns.css         # Navigation dropdowns
│   │   ├── trending.css          # Trending topics strip
│   │   ├── featured-story.css    # Homepage featured-story layout
│   │   ├── ads.css               # Reserved ad-slot layout
│   │   ├── reviews.css           # Homepage Reviews & Recommendations section
│   │   ├── latest-articles.css   # Homepage Latest Tech News & Guides section
│   │   ├── section-page.css      # Shared layout for parent and subcategory landing pages
│   │   ├── article-page.css      # Shared defaults used by the canonical article template
│   │   ├── newsletter.css        # Newsletter section
│   │   ├── footer.css            # Footer
│   │   ├── search.css            # Search popup and filter controls
│   │   └── responsive.css        # Shared responsive adjustments
│   │
│   ├── js/
│   │   ├── main.js               # Public-site entry point
│   │   ├── theme.js              # Working theme toggle and localStorage persistence
│   │   ├── navigation.js         # Click-operated dropdown and mobile navigation behavior
│   │   ├── featured-story.js     # Homepage featured-story rotation and interactions
│   │   ├── homepage-data.js      # Homepage article selections/settings where required
│   │   ├── search.js             # Search, category filter, reading-time slider and sorting
│   │   ├── article-index.js      # Shared static article metadata for search and landing pages
│   │   ├── newsletter.js         # Newsletter form integration
│   │   └── analytics.js           # Optional analytics integration, if adopted
│   │
│   ├── images/
│   │   ├── brand/                # Supplied Lux Omni identity SVGs; preserve original artwork
│   │   │   ├── Lux-Omni-Blog-App-Icon.svg
│   │   │   ├── lux-Omni-Blog-micro-icon.svg
│   │   │   └── lux-Omni-Blog-Transparent-Symbol.svg
│   │   └── ui/                   # Supplied loading and article-animation SVGs
│   │       ├── lux-Omni-Blog-Loader.svg
│   │       └── lux-Omni-Blog-Subtle-Animation-For-Article.svg
│   │
│   └── fonts/                    # Only if self-hosted fonts are needed
│
```

**Folder-name rule:** the illustrative groups above are examples from the planning discussion, not a final exhaustive taxonomy. Every article group ultimately included in the navigation/content plan must have (1) one dedicated page under `sections/`, (2) a matching folder under `articles/`, and (3) six sample article HTML files during development. The exact set of groups follows the final agreed dropdown taxonomy.

### Public-site notes

- The homepage (`index.html`) keeps its own planned components. Its article cards are selected previews and link either to an individual article or to the appropriate group landing page through a “See All”/equivalent link.
- Every final article group has a dedicated landing page under `sections/`. This is separate from the similarly named homepage section: the homepage section is a preview; the group page is the full browseable destination.
- A dropdown item links to the matching group landing page. The group page links to its articles, stored in a matching `articles/<group-slug>/` folder. A group page must not merely reload the homepage or point at a non-existent destination.
- During development, create **six sample article pages per article group, not six total**. They are deliberate test fixtures for checking cards, metadata, images, article layouts, navigation, and group-specific behavior. Keep them linkable from their group pages while testing; do not automatically hide them or exclude them from development listings or sitemap tests. The owner will decide when to delete them later.
- `templates/article-template.html` is the canonical starter/reference structure for consistent article scaffolding and future publishing software. It is not itself one of the six sample articles for a group; make a real sample article file when testing an article page.
- Keep individual article HTML pages flexible: the canonical template protects stable metadata, shared hooks, navigation and link conventions, but does not prohibit deliberate article-specific layouts or CSS/JS.
- Use stable, human-readable article filenames, for example `articles/reviews/sample-review-01.html`. Once an article URL is intentionally retained as a public URL, avoid changing it unless a redirect is provided.
- Large article photographs, video, banners and other media belong in **Cloudflare R2** if that storage direction is approved, not in this source tree. Small essential interface assets, including the supplied SVG icon set, belong under `site/assets/images/`.
- The supplied SVG assets are retained at the exact paths listed in the tree: brand identity artwork under `assets/images/brand/`, and the loader/article animation artwork under `assets/images/ui/`.
- Preserve the supplied SVG artwork as provided, including original colours, gradients, opacity and animation. Do not recolour, flatten, replace, or globally override these SVGs during theme changes. The micro icon uses `currentColor`, so theme-controlled recolouring should use that asset's intended current-colour behaviour rather than altering the file.
- The supplied icon archive does not include a `.ico` favicon. `site/favicon.ico` remains a placeholder until a proper favicon file is supplied or a conversion is explicitly approved; do not treat the empty placeholder as a finished favicon.
- `sitemap.xml` should match the URLs intentionally included in the current development or release build. During development, sample articles may be included so the sitemap/link checks can be tested. Before launch, the owner will decide which samples to delete; update the sitemap and internal links after that cleanup.
- The file names above are a proposed starting point. Files should be created when needed; this is not a requirement to create every listed file immediately.

---

## 2. Developer Control Panel — Separate Application

Keep the control panel separate from the public site's ordinary frontend files. It may be deployed as its own application, for example on a separate subdomain, once the deployment arrangement is chosen.

```text
control-panel/
├── index.html                    # Dashboard entry point
├── login.html                    # Sign-in interface, if appropriate for chosen auth flow
├── assets/
│   ├── css/
│   │   ├── panel-base.css
│   │   ├── panel-layout.css
│   │   └── panel-components.css
│   └── js/
│       ├── panel-main.js
│       ├── auth.js                # Authentication integration
│       ├── articles.js            # Article metadata and publishing controls
│       ├── homepage.js            # Featured stories, reviews and latest articles
│       ├── trending.js            # Trending-topic controls
│       ├── ads.js                 # Ad-slot/campaign settings
│       ├── site-settings.js       # Shared settings and visibility controls
│       └── media.js               # Media metadata and R2 workflow integration
```

**Security boundary:** client-side code is not a security boundary. Protect the panel with an appropriate authentication setup and enforce permissions in Supabase Row Level Security (RLS). Never put a Supabase service-role key in browser JavaScript.

---

## 3. Initial Authoring and Publishing Workflow — VS Code, Git and GitHub

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

## 4. Data and Media Outside the Website Repository

These are services/resources rather than folders in the public website repository.

```text
Supabase
├── articles metadata and publication status
├── categories and tags
├── homepage selections
├── trending-topic entries
├── site/theme settings
├── ad-slot and campaign settings
├── media metadata/IDs
└── authenticated control-panel access and permissions

Cloudflare R2
├── article photographs
├── videos and other large media
├── banners and campaign creatives
└── other large downloadable media
```

This is a **conceptual map**, not a finalized database schema. Exact table names, columns, policies, storage buckets and access rules must be designed before implementation.

Do not assume that changing a Supabase setting automatically changes the public site: the public site must be built to read that setting. A new standalone HTML article still normally needs to be included in a Pages deployment to become available at its URL.

---

## 5. Publishing Flow

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

Developer Control Panel ─────► Supabase
                                  │
                                  └── Homepage selections, tags,
                                      visibility and other settings

Large media ─────────────────► Cloudflare R2
```

The exact automation mechanism—manual Wrangler deployment, a script, or another approved workflow—remains open. This map does not configure or deploy anything.

---

## 6. File and Naming Rules

1. **One article, one HTML file** under `articles/<group-slug>/`, with custom article-specific styling or scripting when needed.
2. Every final article group has one page under `sections/<group-slug>.html` and a matching `articles/<group-slug>/` folder.
3. Create six sample article HTML files per group during development. They are intentionally linkable test content and may be removed later by the owner.
4. Use `templates/article-template.html` as the canonical starter/reference; preserve stable metadata conventions, classes/IDs, navigation links and shared hooks when creating an article from it.
5. Use stable lowercase filenames with hyphens; avoid spaces and frequent URL changes.
6. Keep article IDs distinct from media IDs. IDs support management and references; they are not secrets or access controls.
7. Keep large media in R2 and store references/metadata where appropriate.
8. Keep public code, authenticated control-panel code, local drafts and secrets separated.
9. Add shared CSS/JS files only when there is a real need for shared behavior; do not create empty files just to match this map.
10. Preserve the existing file map and architecture decisions as the project evolves. Update this document when the actual structure changes.
11. Do not treat optional files, proposed component names, or the separate-app arrangement as final until explicitly approved.

---

## 7. Decisions Still Open

- Exact URL format for articles (`/articles/article-name.html` versus clean directory URLs).
- Whether the control panel will be hosted on a separate subdomain or another protected deployment.
- Exact Supabase schema and public read-access model.
- How the public site retrieves homepage selections and other settings.
- Deployment automation for new article files and sitemap updates.
- Whether search is generated at build time, uses a client-side index, or uses another method.
- Final CSS/JavaScript module boundaries after the first working skeleton.
- Whether the optional `manifest.webmanifest`, contact page, analytics and self-hosted fonts are needed.

**Guiding principle:** start with the smallest working structure, keep article URLs stable, and add files when the corresponding feature is implemented.

## Repository boundary reminder

- Keep all planning files under the repository-root `documentation/` directory, outside `site/`.
- Keep public HTML, CSS, JavaScript, and public-site asset placeholders under `site/`.
- Do not include the root `documentation/` or `control-panel/` directories in the public website's deployment output.
- The existing root `README.md` is not modified as part of the skeleton.
