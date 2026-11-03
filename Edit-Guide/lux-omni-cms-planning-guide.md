# Lux Omni CMS — Future Planning and Editing Guide

**Status:** Planned for a later development phase. Do not begin CMS implementation until the Lux Omni website structure, article pages, shared components and current website features are ready.

**Purpose:** Record the agreed direction for a custom, hosted editorial CMS connected to Supabase and the existing GitHub website repository. This guide is a plan, not an instruction to build the CMS now. Exact database schemas, hosting provider, editor libraries and GitHub publishing mechanics will be decided during the CMS phase.

## 1. Core direction

Build a custom, hosted **Lux Omni CMS** for managing both new articles and existing published articles.

The CMS will use:

- **Supabase Auth** for user accounts and login.
- **Supabase Database** for article drafts, submissions, assignments, review comments, revisions and editorial status.
- **Supabase Row Level Security (RLS)** for database access restrictions.
- **Supabase Edge Functions** for trusted server-side actions, including publication.
- **GitHub App integration** for writing approved article files into the existing website repository.
- The website's **existing GitHub Actions build and deployment workflow** to build and publish the updated static website.

The public website remains a static HTML/CSS/JavaScript website. The CMS is a separate hosted editorial application; it does not replace the website builder or require a database to serve public article pages.

Writers must not receive access to the website's GitHub repository or to the owner's local project folder. They work only through the hosted CMS.

## 2. Main operating principle

**Supabase stores editorial work. GitHub stores the published website files.**

Saving a draft or submitting an article must not change the live website or write a public article file into the repository.

Only an authorized administrator's explicit **Publish** action may start the GitHub publishing operation. The server validates the administrator's permission and the article's approved state before writing the corresponding file.

GitHub credentials and privileged Supabase keys must remain on the server. They must never be placed in browser-side JavaScript or exposed to writers.

## 3. Two article workflows

The CMS must support both workflows below using the same article library, review system, revision history and publishing mechanism.

### A. New article workflow

1. A writer signs in to the hosted CMS.
2. The writer sees only the categories, subcategories, templates and assignments permitted for that account.
3. The writer starts a new article using an administrator-approved article template.
4. The writer completes the permitted article fields and writes the article content.
5. The writer can preview the article in a page layout that uses the website's real visual styling and shared components.
6. The writer saves a draft or submits it for review.
7. The submission and its author identity are stored in Supabase. No GitHub file is created at this stage.
8. The administrator reviews the submission and decides whether to publish, request changes, keep it pending/on hold, or discard/archive it.

### B. Existing published article revision workflow

The CMS must also manage articles that already exist in the GitHub repository.

1. The article library lists existing published articles and their repository locations.
2. The administrator opens an existing article and chooses to edit it or assign a revision task to a writer.
3. The CMS loads the article's current content and records the published version as the baseline for the revision.
4. Changes are saved as a separate working revision in Supabase. The live website remains unchanged.
5. A writer assigned to the revision can edit only the content and fields allowed by that assignment. The writer can preview and submit the revision for review.
6. The administrator can directly edit the existing article's main content without routing the work through a writer.
7. The administrator compares the proposed revision with the published version, reviews comments and changes, and decides whether to publish.
8. When approved and published, the CMS updates the existing HTML file at its mapped repository path.

For an existing article, preserve its current file path, article ID and public URL unless the administrator explicitly approves a change. Do not create a duplicate article merely because an existing article is being revised.

## 4. Writer experience

The writer dashboard should provide:

- Assigned article and revision tasks.
- Approved templates available to that writer.
- A content editor for the permitted fields and article body.
- A preview of the article before submission.
- Draft saving.
- Submission for administrator review.
- Review feedback, including comments attached to individual fields or content sections.
- A clear view of fields that need attention.
- The ability to revise and resubmit after changes are requested.
- A record of the writer's own submissions and their statuses.

Writers must not be able to publish, edit website code, modify shared partials, change stylesheets, alter build scripts, change repository mappings or change their own roles and permissions.

A writer must not be able to expand their permissions by changing browser requests or submitted data. Enforce authorization in Supabase RLS and trusted server-side functions, not only by hiding interface controls.

## 5. Administrator experience

The administrator dashboard must provide control over the editorial system.

### Article library

- Browse new submissions and existing published articles.
- Filter by category, subcategory, writer, status and article type.
- Open an article's current published version and its working revisions.
- Assign writers to new articles or existing article revisions.
- See the exact repository file path associated with an existing article.

### Review and decision controls

For a submitted article or revision, the administrator can:

- **Publish:** approve the current revision and send it to the publishing process.
- **Request changes:** return it to the writer with general feedback and/or field-level comments.
- **Keep pending / on hold:** retain it in the review queue without publishing or discarding it.
- **Discard / archive:** reject or archive the submission or revision without changing the live article.

A field-level review comment should identify the exact field or content section that needs attention. The writer should see the highlighted field and the administrator's feedback when reopening the work.

### Direct main article editing

The administrator must have a proper main article editor for both new and existing articles.

The administrator must be able to directly:

- Rewrite, add, remove and rearrange paragraphs.
- Add, edit and remove headings and sections.
- Edit lists, tables, quotations, links, images, captions and other article content.
- Edit article metadata and SEO fields.
- Preview the complete article before publishing.
- Save work as a revision without immediately changing the live website.
- Compare the revision with the currently published version.
- Publish the approved changes.

The administrator must not be limited to leaving comments or sending content back to a writer. Direct editing of the actual article body is a core requirement.

## 6. Editing modes and HTML preservation

Lux Omni articles are complete HTML documents. Some articles may use custom HTML structures, layouts, styles or scripts. The CMS must not assume that every existing article has the same body structure.

Plan for two editing modes:

1. **Structured article editor:** For articles created with approved CMS templates. It exposes the defined fields and content sections as editable controls.
2. **Custom HTML/source editor:** For administrator-level editing of articles that use unique structures or need precise markup changes.

The administrator's editing capability must include the main article content, not only metadata. The source-editing mode is needed for custom HTML cases and must be permission-restricted.

The CMS must preserve unsupported or unrecognized HTML elements and article-specific structures when saving. Do not automatically convert every existing HTML article into a generic rich-text format. Do not silently remove custom markup, scripts, styles, attributes, figures or embeds.

If a particular legacy article cannot yet be safely round-tripped through the structured editor, keep it in a safe custom-source editing path rather than damaging its existing layout.

The live preview should use the same article layout, shared components, CSS and relevant scripts as the actual website wherever practical. Do not build a visually approximate preview that can differ materially from the published page.

## 7. Article templates and repository mapping

The CMS will have an administrator-managed template library and repository mapping.

### New articles

- Each approved template defines the fields and content structure supported by that template.
- The administrator controls which templates writers can use.
- Category and subcategory assignments determine the permitted destination folder.
- When the administrator publishes a new article, the CMS generates a new complete HTML article file in the mapped `site/categories/<category>/<subcategory>/articles/` folder.
- The generated file uses the agreed article template and the submitted, approved content.
- The CMS must not overwrite a sample/template file with each article submission. A template is a blueprint; publishing creates a new article file.

### Existing articles

- Each existing article record is mapped to its actual repository file path.
- Publishing a revision updates that existing file at its mapped path.
- The CMS must not infer or alter an existing article's path from a writer-supplied value.
- Existing article IDs and current URL conventions must be preserved unless an administrator deliberately changes them.

### Mapping controls

Repository paths, category assignments, template availability and article identifiers are administrator-controlled configuration. Writers cannot edit these mappings.

The mapping system must fit the existing Lux Omni folder hierarchy and preserve the rule that `site/index.html` is the only file named `index.html`. Category and subcategory landing pages retain their descriptive `*-index.html` filenames; articles retain descriptive filenames in their respective `articles/` folders.

## 8. Roles and permissions

The initial role model should include:

| Role | Intended access |
|---|---|
| Owner / primary administrator | Full CMS control, direct editing of any article, user and permission management, mapping, review and publishing. |
| Administrator | Access granted by the owner for editorial administration and review. Publishing permission must be explicit. |
| Writer | Access only to assigned categories, articles, templates and revision tasks; can save drafts and submit work. No GitHub access and no publishing permission. |

The exact distinction between Owner and Administrator can be finalized during implementation. Additional roles, such as a reviewer who can comment but not publish, may be added later if needed.

Store role and assignment information in protected database records. Do not trust user-editable profile metadata as the source of authorization. Apply RLS policies to exposed tables and verify privileged actions server-side.

## 9. Suggested Supabase data responsibilities

The following are conceptual data areas, not a finalized database schema:

- **User profiles:** CMS role and account status linked to Supabase Auth users.
- **Category assignments:** categories and subcategories each writer may access.
- **Article records:** article identity, title, category, subcategory, author, status, template reference and repository path.
- **Article templates:** approved template definitions and supported editable fields.
- **Article revisions:** saved drafts and immutable submission snapshots, including the relationship to the published baseline.
- **Review comments:** general feedback and comments attached to individual fields or content sections.
- **Publication records:** who approved and published a revision, when it was published, and the resulting repository commit or deployment reference.
- **Audit history:** important editorial, permission, mapping and publication actions.

Do not finalize table names, columns or SQL until the workflows and article mapping have been designed.

## 10. Review states and version history

The CMS should distinguish between the published website version and an unpublished working revision.

Suggested editorial states:

- Draft
- Submitted
- Changes requested
- Pending / on hold
- Approved for publishing
- Published
- Discarded / archived

A revision must not replace the current published version merely because it is saved or submitted.

Retain revision history so the administrator can inspect who changed the article, what changed, which review comments were resolved, and which version was published. The CMS should support comparison against the currently published version before publication.

When an update is published, the original publication date should remain unchanged. The modification date should reflect an actual published modification, not every draft save.

## 11. Publishing and deployment

The publishing process must be server-controlled:

1. The administrator selects **Publish** for a specific approved article revision.
2. A trusted server-side function verifies the authenticated user and explicit publishing permission.
3. The function retrieves the approved revision from Supabase; it does not blindly trust article HTML or destination paths sent by the browser.
4. It validates the article's status, template or editing mode, category mapping, filename, article identity and permitted repository destination.
5. It generates the new article HTML or safely updates the mapped existing HTML file.
6. It uses server-held GitHub App credentials to write only the intended article change.
7. The repository change triggers the existing GitHub Actions website build and deployment workflow.
8. The CMS records the repository commit and publication result. It must distinguish a successful GitHub write from a successful completed website deployment.

The exact GitHub API operation, branch strategy and handling of a failed build will be decided during implementation. Writers must never receive the GitHub App private key, installation token, repository write credentials or any ability to invoke an unrestricted publishing operation.

The existing `scripts/build-site.mjs` remains the website builder. The CMS must generate source files compatible with its marker validation and shared-component assembly requirements. Do not replace the current build system with a new static-site generator merely to support the CMS.

## 12. Security and operational requirements

- Writers authenticate through the hosted CMS and Supabase Auth; they do not need GitHub accounts.
- Enable and test RLS on exposed database tables.
- Enforce category, article ownership, role and status rules on the server/database, not only in the UI.
- Only explicit administrator permissions can trigger publishing.
- Keep privileged Supabase keys and GitHub credentials in server-side secrets.
- Validate and sanitize content according to the supported HTML and template rules.
- Protect the publishing function against forged article IDs, unauthorized paths, status manipulation and replay/duplicate publication.
- Record important actions in an audit history.
- Preserve the last published version so a failed or incorrect revision can be recovered.
- Prevent simultaneous edits from silently overwriting another user's newer revision.
- Test permission boundaries using separate writer and administrator accounts before inviting external writers.

## 13. Implementation phases — after the website is ready

Work through the CMS in controlled stages:

1. **Audit the finished website:** inspect actual category folders, article HTML patterns, shared components, article IDs, article-specific layouts and build validation rules.
2. **Design the article mapping:** decide how new article templates map to folders and how existing article files are registered and opened for revision.
3. **Define article templates and editable fields:** establish the structured fields for new template-based articles without forcing custom existing articles into one format.
4. **Design Supabase Auth, roles, assignments and RLS:** establish owner, administrator and writer permissions before building publishing features.
5. **Build writer workflow:** login, assigned tasks, template editor, live preview, draft saving and submission.
6. **Build administrator workflow:** article library, review queue, field-level feedback, pending/discard actions, revision comparison and direct main article editing.
7. **Build HTML generation and safe existing-article updates:** verify the generated output against actual Lux Omni article files and the existing builder.
8. **Connect GitHub securely:** add the GitHub App and server-side publishing function. Keep publishing administrator-only.
9. **Integrate and test deployment:** verify the existing GitHub Actions workflow, deployment result reporting and recovery process.
10. **Security and acceptance testing:** test writer restrictions, category isolation, custom HTML preservation, revision recovery and unauthorized publishing attempts before adding real external writers.

Do not start the next phase merely because the previous screen or interface is complete. Verify its data permissions and publishing boundaries before proceeding.

## 14. Decisions intentionally left open

These decisions should be made when CMS development begins, not assumed in advance:

- CMS frontend framework and hosting provider.
- Exact Supabase table design and database schema.
- Rich-text editor and custom HTML editor technology.
- Which article fields are structured for each approved template.
- How images and other uploaded assets are stored and moved into the published website.
- How existing custom HTML articles are safely loaded and edited.
- Exact GitHub publishing operation and branch/approval strategy.
- Whether additional reviewer or editor roles are needed.
- Whether the first CMS release supports every existing article or starts with a tested subset.

## 15. Scope boundaries

The CMS is a future editorial tool. Until the website is ready:

- Do not build the CMS dashboard, database schema, authentication, editor or GitHub integration.
- Do not migrate current article files to Markdown or introduce front matter solely for a future CMS.
- Do not change the current website architecture to fit a third-party CMS.
- Do not give writers direct GitHub repository access as a substitute for CMS permissions.
- Do not remove the ability to create custom HTML articles.
- Do not let an unpublished draft or revision change the live website.
- Do not make publication automatic for writers.

The website should be completed first. The CMS will then be designed around the actual finished website and its real article structures.
