# How to Edit the Topbar

The shared topbar is maintained in `site/partials/topbar.html` and is assembled into populated pages by `scripts/build-site.mjs`. Edit the source partial; do not edit generated files under `_site/` or copy the change into individual pages.

## Current content

The topbar currently contains:

- The brand symbol, linking back to the homepage through the build-safe `{{ROOT}}index.html` path.
- The brand motto: **Technology. Without the noise.**
- A link to the confirmed Luxraj GitHub profile: `https://github.com/LuxrajKayal`.

The motto is rendered through `.topbar__slogan`. Keep its class and `data-config-key` attribute so existing styling and configuration hooks remain stable.

## Adding another link

Add a link only after its final destination is known. For a social profile, use the owner's actual profile URL—not the platform homepage. For an internal page, use `{{ROOT}}` before the path so the link works from nested category and article pages.

Do not add placeholder values such as `example.com`, `hello@example.com`, or generic social-platform homepages. If a destination is not ready, leave that link out until it is.

## Build and test

From the repository root, run:

```bash
node scripts/build-site.mjs
```

Preview the generated `_site/` output. Test the homepage link and GitHub profile link from both the homepage and a nested article page. Check the topbar at desktop and mobile widths, then verify the GitHub Pages workflow after pushing.
