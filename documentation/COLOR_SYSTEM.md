# Lux Omni Blog — Color System

**Status:** Approved implementation baseline — 2026-10-25 (palette values remain subject to in-context contrast validation)  
**Scope:** Lux Omni Blog website and its interface tokens  
**Design direction:** Editorial layout; balanced crimson/amber branding; light and dark themes  
**Icon policy:** Preserve supplied SVG artwork and its existing colors unchanged

---

## 1. Purpose

This document defines the color vocabulary for Lux Omni Blog so that pages, article components, navigation, and interactive states use colors consistently. It is a design specification, not a request to modify existing CSS or SVG assets.

The website takes its layout direction from the chosen CNET-style editorial reference. Lux Omni Blog retains its own crimson, burgundy, orange, and amber identity.

### Approved baseline decisions

- **Theme strategy:** Support both light and dark themes.
- **Accent intensity:** Balanced. Brand color should be recognizable without making every surface red or orange.
- **SVG artwork:** Preserve the supplied icons as they are. Do not recolor, flatten, or replace their gradients as part of routine theme changes.
- **Default theme:** Light theme is the initial implementation baseline; a future theme control may let readers switch to dark mode.
- **Typography:** Use Source Sans 3 for headlines, navigation, cards, metadata, and interface controls; use Source Serif 4 for long-form article body text. Use a system monospace stack for code, avoiding a third external font dependency.

## 2. Color-system principles

1. **Separate brand from interface.** Brand tokens describe Lux Omni Blog's identity; semantic tokens describe how the interface behaves in each theme.
2. **Prefer semantic tokens in components.** Components should use tokens such as `--color-text-primary` rather than hard-coded color values.
3. **Use accents deliberately.** Reserve crimson for brand emphasis, links, selected states, and primary actions. Use orange and amber mainly for decorative accents, small highlights, and artwork—not long text passages.
4. **Keep reading surfaces calm.** Article text and content areas should remain neutral, high-contrast, and comfortable for long-form reading.
5. **Do not recolor logo assets to match themes.** Preserve their built-in gradients. Select a suitable surrounding surface instead.
6. **Check actual contrast.** Validate text, icons, borders, focus indicators, and button states against WCAG 2.2 AA targets before release.

## 3. Brand palette

These values are sampled from the supplied SVG artwork. They are recorded as brand/artwork colors, not as a requirement to use every color in the interface.

| Token | Hex | Intended role |
|---|---|---|
| `--brand-crimson` | `#DC2626` | Primary brand accent |
| `--brand-red-deep` | `#B91C1C` | Deeper red accent; candidate for high-contrast actions |
| `--brand-burgundy` | `#881337` | Deep brand shade |
| `--brand-wine` | `#6B0F2B` | Dark wine shade in artwork |
| `--brand-oxblood` | `#4C0519` | Deepest burgundy background shade in artwork |
| `--brand-red-shadow` | `#7F1D1D` | Red shading in artwork |
| `--brand-red-mid` | `#991B1B` | Intermediate red shading |
| `--brand-orange` | `#EA580C` | Secondary warm accent |
| `--brand-amber` | `#D97706` | Amber accent |
| `--brand-amber-deep` | `#B45309` | Darker amber shading |
| `--brand-gold` | `#F59E0B` | Bright amber highlight |
| `--brand-gold-light` | `#FBBF24` | Light golden highlight |
| `--brand-yellow` | `#FDE047` | Bright decorative highlight |
| `--brand-yellow-pale` | `#FDE68A` | Pale golden highlight |
| `--brand-yellow-soft` | `#FEF08A` | Soft yellow highlight |
| `--brand-cream` | `#FFFBEB` | Warm light glow in artwork |
| `--brand-red-soft` | `#FCA5A5` | Soft red highlight in artwork |
| `--brand-red-pale` | `#FECACA` | Pale red highlight in artwork |

**Important:** The values above document the existing artwork. They do not all need independent CSS variables if the implementation does not use them directly. Keep a token only when it has a real, documented purpose.

## 4. Semantic interface tokens

Semantic tokens are the stable interface between the design and CSS. Component styles should refer to these names. The values can change between themes while component code remains the same.

### 4.1 Light theme — proposed values

| Token | Value | Use |
|---|---|---|
| `--color-page` | `#FFFFFF` | Main page background |
| `--color-surface` | `#F5F5F5` | Secondary panels and subtle cards |
| `--color-surface-raised` | `#FFFFFF` | Header, menus, or elevated cards when needed |
| `--color-text-primary` | `#171717` | Headlines and body text |
| `--color-text-secondary` | `#525252` | Metadata, captions, supporting text |
| `--color-text-muted` | `#737373` | Low-priority labels; verify contrast for each use |
| `--color-border` | `#E5E5E5` | Standard separators and card borders |
| `--color-border-strong` | `#A3A3A3` | Stronger separators where needed |
| `--color-link` | `#B91C1C` | Inline links |
| `--color-link-hover` | `#7F1D1D` | Hovered links |
| `--color-action` | `#B91C1C` | Primary action background |
| `--color-action-hover` | `#991B1B` | Hovered primary action |
| `--color-on-action` | `#FFFFFF` | Text/icon on the primary action |
| `--color-focus` | `#B91C1C` | Keyboard focus outline |
| `--color-selection` | `#FECACA` | Text-selection background, subject to browser behavior |

### 4.2 Dark theme — proposed values

| Token | Value | Use |
|---|---|---|
| `--color-page` | `#171717` | Main page background |
| `--color-surface` | `#262626` | Secondary panels and cards |
| `--color-surface-raised` | `#303030` | Menus, popovers, or elevated cards |
| `--color-text-primary` | `#FAFAFA` | Headlines and body text |
| `--color-text-secondary` | `#D4D4D4` | Metadata and supporting text |
| `--color-text-muted` | `#A3A3A3` | Lower-priority labels; verify contrast for each use |
| `--color-border` | `#404040` | Standard separators and card borders |
| `--color-border-strong` | `#737373` | Stronger separators where needed |
| `--color-link` | `#F87171` | Inline links |
| `--color-link-hover` | `#FCA5A5` | Hovered links |
| `--color-action` | `#DC2626` | Primary action background |
| `--color-action-hover` | `#B91C1C` | Hovered primary action; retains a strong white-text contrast |
| `--color-on-action` | `#FFFFFF` | Text/icon on the primary action; contrast must be verified |
| `--color-focus` | `#FCA5A5` | Keyboard focus outline |
| `--color-selection` | `#7F1D1D` | Text-selection background, subject to browser behavior |

These values are a proposed starting palette. They should be checked against representative page screenshots and actual text sizes before implementation is considered complete. If a contrast check fails, adjust the token rather than weakening the accessibility requirement.

## 5. Functional colors

Functional colors communicate a state, not brand identity. Keep their meaning consistent in both themes.

| Purpose | Light theme candidate | Dark theme candidate | Guidance |
|---|---|---|---|
| Success | `#166534` | `#4ADE80` | Confirmed, completed, or successful action |
| Warning | `#92400E` | `#FBBF24` | Caution or content needing attention |
| Error | `#B91C1C` | `#F87171` | Failed action or validation error |
| Information | `#1D4ED8` | `#60A5FA` | Neutral explanatory status |

Functional colors should not be used as the sole way to communicate meaning. Pair them with clear text, an icon, or another accessible cue. These candidates require contrast testing for their final backgrounds and component states.

## 6. Component color mapping

| Component | Main token choices | Rules |
|---|---|---|
| Site header/navigation | `--color-surface-raised`, `--color-text-primary`, `--color-border` | Keep navigation readable and restrained; use brand color for active/selected states only |
| Brand link/logo area | SVG artwork + `--color-text-primary` | Preserve SVG colors and gradients; do not apply CSS filters to force a theme match |
| Main article headline | `--color-text-primary` | Headlines should not default to brand red |
| Article body | `--color-text-primary` | Prioritize long-form readability |
| Article metadata/byline | `--color-text-secondary` | Must remain readable at small sizes |
| Article cards | `--color-surface-raised`, `--color-border` | Use subtle surfaces and borders; avoid excessive red backgrounds |
| Inline links | `--color-link` | Add a visible hover/focus treatment; do not rely on color alone if context requires stronger distinction |
| Primary buttons | `--color-action`, `--color-on-action` | Check text contrast for normal, hover, active, disabled, and focus states |
| Category labels/tags | Neutral tokens plus a restrained accent | Use a consistent mapping; preserve readable text contrast |
| Footer | Theme surface/text/border tokens | Footer should follow the selected theme rather than hard-coded colors |
| Loading indicator | Existing loader SVG | Keep its artwork and gradients unchanged |

## 7. SVG asset inventory and preservation policy

The supplied icon archive contains these files:

- `Lux-Omni-Blog-App-Icon.svg`
- `lux-Omni-Blog-Loader.svg`
- `lux-Omni-Blog-micro-icon.svg`
- `lux-Omni-Blog-Subtle-Animation-For-Article.svg`
- `lux-Omni-Blog-Transparent-Symbol.svg`

The App Icon, Loader, Subtle Article Animation, and Transparent Symbol contain the same 18 explicit hexadecimal color values listed in the brand palette. Their gradients, opacities, and animation details are part of the artwork and should be preserved. The micro icon uses `fill="currentColor"` rather than a hard-coded hex value. When used inline in the document, it can take its color from the surrounding CSS `color` value. When loaded as an external image (`<img src="...svg">`), the page's CSS color generally does not cross the image boundary; test the chosen embedding method and use inline SVG or another compatible approach if theme-controlled coloring is required. This can be handled without changing the SVG source.

### Usage rules

- Keep the original SVG source unchanged unless a separate, explicit icon redesign is approved.
- Use the micro icon where a one-color, theme-adaptive symbol is needed; set its inherited color intentionally.
- Keep multicolor brand artwork on a background that provides adequate visual separation. Do not assume that every detail of the logo needs WCAG text contrast; instead ensure the overall mark remains discernible and its surrounding label is readable.
- Do not apply `filter`, `opacity`, or global `fill` overrides to multicolor SVGs as a theme-switching shortcut.
- If an asset is difficult to see in a theme, first adjust the surrounding surface or provide an appropriate clear-space/container treatment.

## 8. Accessibility requirements

Before release, test the palette against WCAG 2.2 AA criteria, including:

- Normal text contrast of at least **4.5:1** against its actual background.
- Large text contrast of at least **3:1** against its actual background.
- Essential interface component boundaries and graphical information at **3:1** against adjacent colors where the criterion applies.
- Visible keyboard focus indicators and a clear focus state for links, buttons, menus, and theme controls.
- Hover, pressed, disabled, error, warning, and success states in both themes.

Do not assume a color passes because it looks readable on one screen. Test combinations, not isolated color values. Avoid using amber or pale yellow for small text on white, and avoid relying on color alone to communicate categories or status.

### Preliminary text-contrast spot checks

These ratios are calculated for the listed foreground/background pairs only; they are not a substitute for testing every real component state.

| Foreground on background | Contrast ratio | Note |
|---|---:|---|
| White `#FFFFFF` on action red `#B91C1C` | 6.47:1 | Passes normal-text AA |
| White `#FFFFFF` on brand crimson `#DC2626` | 4.83:1 | Passes normal-text AA, with less margin |
| White `#FFFFFF` on hover red `#EF4444` | 3.76:1 | Does **not** pass normal-text AA; not used for white-text buttons |
| Secondary text `#737373` on white `#FFFFFF` | 4.74:1 | Passes normal-text AA |
| Link `#F87171` on dark page `#171717` | 6.48:1 | Passes normal-text AA |

The dark-theme hover action is therefore set to the deeper `#B91C1C` in this draft rather than the brighter `#EF4444` when the button label remains white.

## 9. Proposed CSS implementation pattern

Keep primitive brand colors and semantic theme tokens logically separate. The following is a proposed pattern only; it is not an instruction to edit the repository now.

```css
:root {
  color-scheme: light;

  /* Brand primitives */
  --brand-crimson: #DC2626;
  --brand-red-deep: #B91C1C;
  --brand-burgundy: #881337;
  --brand-orange: #EA580C;
  --brand-amber: #D97706;

  /* Light-theme semantic tokens */
  --color-page: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-surface-raised: #FFFFFF;
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-text-muted: #737373;
  --color-border: #E5E5E5;
  --color-border-strong: #A3A3A3;
  --color-link: #B91C1C;
  --color-link-hover: #7F1D1D;
  --color-action: #B91C1C;
  --color-action-hover: #991B1B;
  --color-on-action: #FFFFFF;
  --color-focus: #B91C1C;
}

:root[data-theme="dark"] {
  color-scheme: dark;

  --color-page: #171717;
  --color-surface: #262626;
  --color-surface-raised: #303030;
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #D4D4D4;
  --color-text-muted: #A3A3A3;
  --color-border: #404040;
  --color-border-strong: #737373;
  --color-link: #F87171;
  --color-link-hover: #FCA5A5;
  --color-action: #DC2626;
  --color-action-hover: #B91C1C;
  --color-on-action: #FFFFFF;
  --color-focus: #FCA5A5;
}

body {
  color: var(--color-text-primary);
  background: var(--color-page);
}
```

The selector assumes theme switching will eventually set `data-theme="dark"` on the root element. The theme-switching behavior itself is outside this document. If the site uses a different theme mechanism, adapt the selector without changing the semantic token names unnecessarily.

## 10. Naming and change-control rules

- Use lowercase kebab-case names prefixed with `--brand-` or `--color-`.
- `--brand-*` tokens identify palette values; `--color-*` tokens describe semantic UI roles.
- Avoid introducing component-specific hex values when an existing semantic token fits.
- When a new color is needed, document its purpose, theme values, and contrast implications before adding it.
- Treat changes to brand artwork colors as a separate, explicitly approved task.
- After CSS implementation, compare both themes on the home page, an article page, category/archive pages, and small-screen layouts.

## 11. Open implementation checklist

- [ ] Review this specification against the final website layout.
- [ ] Confirm theme selector and light-mode default.
- [ ] Verify text and UI contrast for light and dark themes.
- [ ] Define complete hover, active, focus, disabled, and error states.
- [ ] Test logo visibility against header and page surfaces.
- [ ] Confirm the micro icon inherits its theme color correctly.
- [ ] Implement CSS tokens only after the specification is approved.


## 12. Typography foundation — approved baseline

### Font roles

| Token | Font stack | Intended use |
|---|---|---|
| `--font-ui` | `"Source Sans 3", Arial, sans-serif` | Headlines, navigation, controls, buttons, cards, excerpts, metadata, labels, and the developer interface |
| `--font-editorial` | `"Source Serif 4", Georgia, serif` | Long-form article body copy, quotations, and reading-focused prose where the serif treatment improves editorial character |
| `--font-code` | `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace` | Code samples, technical identifiers, and preformatted output |

Source Sans 3 and Source Serif 4 form the approved starting pairing. This combination gives short interface elements and headlines a clear sans-serif voice while distinguishing long-form article reading with a serif face. The role tokens keep this choice consistent without forcing every area of the site to use the same family.

### Initial weight guidance

- UI and navigation: 400 for ordinary text, 500 for emphasis, 600 for navigation and card headings, and 700 for major headlines.
- Article body: 400 for normal paragraphs; 600 or 700 for bold emphasis and headings inside the article.
- Use italics only where they convey meaning, such as book titles, cited work, or a deliberate editorial quotation.
- Detailed font sizes, line heights, fluid type scales, and content measure will be defined in the spacing/typography token plan before implementation. Do not invent per-component sizes in this document.

### Font loading and fallback

- Load the selected web fonts using `<link rel="preconnect">` hints and a Google Fonts stylesheet link in the HTML document `<head>`; avoid CSS `@import` for the primary font load.
- Request only the weights and styles that the design actually uses. Start with Source Sans 3 weights 400, 500, 600, and 700; start with Source Serif 4 weights 400, 600, and 700, plus italic 400 and 600 for meaningful editorial italics.
- Keep the fallback stacks shown in the table so the page remains readable if the font service is unavailable.
- Do not introduce font-loading code in this substep. The correct HTML documents and shared article starter will receive the needed links when their implementation step is approved.
- Confirm the web fonts load without blocking the page and check representative headline and long-form text when actual page content exists.

### Scope and validation

This typography decision is a baseline, not a claim that the finished site has already been visually tested. The names and roles are approved; sizes, responsive scale, line lengths, precise weights per component, and live-page validation remain for the relevant design-token and component steps.
