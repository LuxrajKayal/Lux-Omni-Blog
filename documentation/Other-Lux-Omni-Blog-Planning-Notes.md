# Lux Omni Blog — Other Planning Notes

**Purpose:** Record the additional ideas discussed so far, separately from `Main-Navigation-Header.md` and `Main-Navigation-Dropdowns.md`.

**Status:** Discussion notes. These notes capture the user's stated intentions and current direction; they do not finalize technical implementation details. Anything marked undecided remains open.

## 1. Blog Concept and Content

- Website/domain: `blog.luxomni.com`, part of the wider Lux Omni website.
- Overall direction: a self-coded, static-first technical blog with a CNET-inspired interface.
- Planned content areas include technical product reviews, drone-related technical articles and engineering explanations, tutorials and teaching content, hardware, software, technology and buying advice.
- The user intends to build and control the website's code rather than adopt a preselected framework or conventional CMS without deciding to do so.

## 2. Top Information Bar

Planned elements:
- A slogan placeholder that the user can fill in manually.
- Newsletter link.
- Small-icon links for Facebook, Instagram, X, YouTube and GitHub.
- Business email link.
- About link.

Still undecided:
- Actual slogan, social profile URLs and email address.
- Exact layout, sizing and responsive behaviour.

## 3. Trending Topics Strip

- A scrolling Trending Topics strip will appear on the website.
- Topics will be entered and managed manually through a future developer control panel.
- Each topic will have text and an associated destination link.
- The website will display the published topics.
- The developer control panel itself will be planned separately.

Still undecided:
- Exact visual style and scrolling behaviour.
- Data structure, storage and publishing implementation.

## 4. Developer Control Panel — Core Requirement

The user wants a custom developer control panel connected to Supabase or another suitable data/configuration layer to manage supported website content and settings without editing source code for every routine change.

Desired controls discussed so far:
- Trending Topics.
- Homepage featured articles.
- Article titles, text and images.
- Navigation items and dropdown contents.
- Social media links.
- Top-bar slogan.
- Homepage sections, their content and order.
- Homepage banners, including images, text, links and supported styling.
- Logo and brand assets.
- Brand colors and other theme colors.
- Light/dark theme settings, including the default mode.
- Other supported website configuration options.

Important design requirement:
- Website components should be built to support configuration from the beginning.
- The control panel can only control options the website has been programmed to support. Entirely new functionality or a new component may still require code changes.
- Supabase was discussed as a possible database/authentication service, but the exact database and control-panel architecture has not been finalized.

## 5. Article Authoring and Publishing

Preferred direction:
- The user will create each article as a single self-contained HTML file containing its own HTML, CSS and JavaScript.
- Articles may have different designs and unique features rather than being forced into one standard article layout.
- The user wants to upload each article through the developer control panel.
- Published article pages are intended to be hosted on Cloudflare Pages.

Still to design:
- How the control panel publishes new HTML files to Cloudflare Pages.
- How article URLs are assigned and managed.
- How draft, publish, edit, unpublish and delete actions work.
- How article listings, category pages, internal links and sitemap entries are updated.
- How uploaded article HTML and JavaScript are validated and secured.

## 6. Hosting and Media Storage Separation

The user's intended separation is:

- **Cloudflare Pages:** website and published HTML article pages.
- **Cloudflare R2:** only high-quality media files, such as photographs, videos and other large media.
- Website source assets are not intended to be stored in R2 as the site's primary hosting location.
- Article HTML is not intended to be stored in R2.
- General website data and configuration are not intended to be stored in R2.
- The exact storage location for website data/configuration remains undecided.

Media used in articles can be served from R2 while the article HTML itself is served from Pages.

## 7. Search Engine Discovery and SEO

The user wants published articles to be discoverable and indexable by search engines.

The publishing design should account for:
- Public, crawlable article URLs.
- Unique page titles and meta descriptions.
- Canonical URLs where appropriate.
- Useful heading structure and crawlable internal links.
- A sitemap that includes published articles.
- Correct indexing directives so published pages are not accidentally blocked or marked `noindex`.

Indexing cannot be guaranteed, but the site should make published articles accessible and discoverable to search engines.

## 8. Hosting Migration and URL Continuity

Previously discussed direction:
- The user wants the option to migrate the blog to another host later.
- The goal is to preserve existing article URLs during migration.
- The user intends to test the new hosting setup before switching.
- Hosting/provider choice and the detailed migration procedure remain separate decisions.

## 9. Contact and Email Notes

Previously discussed:
- The contact page form will use Google Forms rather than a custom form-processing backend, at least initially.
- The user wants free email forwarding initially rather than setting up a full paid mailbox.
- The final email provider, address and form presentation remain undecided.

## 10. Related Portfolio

Previously discussed:
- The user plans to maintain a separate personal portfolio website hosted on GitHub Pages.
- The blog can link to the portfolio instead of duplicating the full personal profile on the blog.
- The exact author/about-page content and link placement remain undecided.

## 11. Open Decisions — Do Not Assume

The following have not been finalized:
- The complete developer control panel design and implementation.
- The final database/storage choice for website data and settings.
- The Cloudflare Pages publishing mechanism for uploaded article HTML.
- Exact URL/routing conventions.
- The precise layout and responsive behaviour of the bars, header, dropdowns and trending strip.
- Actual slogan, social URLs and business email.
- Final hosting plan and migration procedure.
- Any implementation or repository changes.

## Working Rule

These notes are a record of planning discussions, not authorization to build or modify code. Do not modify a repository, deploy anything or generate website code unless the user explicitly authorizes that work.


## 10. Initial development and SEO workflow update (2026-10-25)
- Exclude a separate backend/local Article Studio from the initial release to reduce workload.
- Write individual HTML articles directly in Visual Studio Code; article-specific CSS/JS is allowed where justified.
- Proposed version control: Git locally and GitHub as remote repository. Test each small fragment before committing a good checkpoint.
- Suggested tools: browser Developer Tools; Lighthouse/PageSpeed Insights; Google Search Console after domain setup; optional Bing Webmaster Tools and Google Trends.
- SEO basics should be built into article creation: unique title/description, meaningful headings, stable descriptive URL, canonical handling when appropriate, alt text, social-preview metadata, crawlable internal links and an up-to-date sitemap.
- These remain proposed workflow details pending owner confirmation; no code, repository, hosting or deployment changes are authorized by this note.