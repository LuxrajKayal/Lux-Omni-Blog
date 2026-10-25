# Lux Omni Blog — Main Navigation Dropdowns

## Status
Planning document updated to include dedicated article-group landing pages. Exact dropdown contents and interaction details remain partially undecided.

## Purpose
Main navigation items can open dropdown menus containing relevant subcategories or destinations. This replaces the previously proposed separate Technology Category Navigation row. Dropdown destinations lead to dedicated article-group pages, not directly to a homepage component.

## Navigation Structure

The main navigation remains a single row containing:
- Lux Omni Logo/home link
- Tech
- Reviews
- How To
- Hardware
- Software
- Buying Advice
- Search button
- Dark-mode toggle

## Dropdown-to-Page Rule

**Every final selectable article group in a dropdown must map to its own dedicated landing page.** For example, selecting `AI` opens the AI group page; selecting `Reviews` or a review subtype opens the corresponding review group page as defined by the final taxonomy. Each group page links to its own articles under `articles/<group-slug>/`.

The naming examples below demonstrate the convention; they are not a final exhaustive taxonomy:

| Main navigation item | Dropdown contents currently discussed | Page/link planning rule |
|---|---|---|
| Tech | AI, Phones, Computing, TV & Audio, Gaming, Smart Home, Internet, Cars, Security, Science | Each selectable destination gets its own `sections/<group-slug>.html` page when the final mapping is approved. |
| Reviews | To be planned | Each final review group/destination gets its own page. |
| How To | To be planned | Each final tutorial/how-to group/destination gets its own page. |
| Hardware | To be planned | Each final hardware group/destination gets its own page. |
| Software | To be planned | Each final software group/destination gets its own page. |
| Buying Advice | To be planned | Each final buying-advice group/destination gets its own page. |

A parent navigation label may also link directly to a broad parent landing page, but whether parent labels are direct links, dropdown-only controls, or both remains to be decided. Do not invent a parent/child URL hierarchy before that choice is settled.

## Connection to Group Pages and Article Files

- Dropdown item → matching page under `sections/`.
- Group landing page → article cards linked to matching files under `articles/<group-slug>/`.
- Homepage components → a selected subset of articles and a “See All”/equivalent link to the relevant group page.
- Every final article group gets **six sample article HTML files during development**. They must be linked from the relevant group page so cards and navigation can be tested. Do not automatically hide or exclude these samples from development lists or sitemap tests; the owner will remove them later.
- The canonical `templates/article-template.html` provides a stable starter/structure for article files. It is not itself a sample article; each test article must be a separate HTML file.

## Expected Behavior

- The main navigation remains a single navigation row; there is no separate second category-navigation row.
- Dropdown choices navigate to real group landing pages once those pages have been built.
- Group landing pages are distinct from homepage sections with similar names: homepage sections preview selected content, while group pages provide a full destination for browsing that group.
- Every article card must point to a valid article URL.
- Dropdowns should support mouse, keyboard, and touch interactions.
- Link and path conventions must remain stable so future publishing software can populate content without breaking navigation.

## Not Yet Decided

- Whether dropdowns open on hover, click, or both.
- Exact dropdown contents for Reviews, How To, Hardware, Software, and Buying Advice.
- Full article-group taxonomy, including which Tech subcategories merit their own pages.
- Dropdown visual design, positioning, and responsive behavior.
- Whether a main navigation item also has a direct broad landing-page link.
- Exact group-page components, filters, sort controls and pagination behavior.

## Constraints

- Do not implement or modify website code until explicitly authorized.
- Do not treat undecided details as approved requirements.
- Do not change the repository as part of planning-document updates.