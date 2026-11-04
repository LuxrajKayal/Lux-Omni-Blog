# Lux Omni Blog — Article Identity, Metadata and Publishing Workflow

**Status:** Agreed workflow direction; implementation and several configuration details remain pending.  
**Scope:** Lux Omni Blog website repository and its publishing pipeline.  
**Last updated:** 2026-11-04

## 1. Purpose

This document records the agreed direction for article identity, automatic metadata processing, review and production publishing.

The goal is to automate predictable technical administration while keeping research and editorial decisions under the owner's control.

This is **not a CMS specification**. The future CMS is a separate project and is not part of this publishing workflow.

## 2. Operating principles

1. **Human judgement owns editorial quality.** Research, fact-checking, technical accuracy, article writing, SEO decisions and source selection remain human-controlled.
2. **Automation owns repeatable technical work.** It may assign permanent IDs, synchronize references, derive URLs, assemble shared components and validate structures.
3. **An article's internal ID is permanent.** Routine automation must never replace an ID already assigned to an article.
4. **The ID inventory is permanent.** Assigning an ID does not remove it from the library. The library retains both assigned and unassigned IDs.
5. **The canonical URL and internal article ID are different things.** The internal ID identifies the article independently of its URL; the canonical URL identifies its preferred public address.
6. **GitHub is the source-control and automation point.** Articles may arrive through a local VS Code workflow, a direct GitHub edit or another authorized publishing tool. The same GitHub Actions checks must apply.
7. **Cloudflare production publication is deliberate.** Pushing to GitHub must not automatically publish every intermediate version to Cloudflare.
8. **No silent editorial rewriting.** Automation must not invent or silently overwrite researched or editorially chosen information.

## 3. What remains manual and what becomes automatic

### 3.1 Human-controlled work

The owner remains responsible for:

- Research, investigation and fact-checking.
- Technical accuracy and final article content.
- Article headline/title and editorial structure.
- Meta description and article summary.
- Search intent, keyword strategy and topic decisions.
- Tag/topic selection and meaningful categorization.
- Source citations, references and factual claims.
- Image selection, image rights and meaningful alt text.
- Final review and approval before production publication.

AI tools may assist with drafting or research when explicitly directed, but the publishing scripts must not treat automatically generated editorial text as verified or publish-ready.

### 3.2 Manually triggered ID generation

A standalone **local ID Manager application**, maintained in a separate project/repository, will provide the ID-library generation interface.

The owner will:

1. Open the local ID Manager.
2. Select the ID library file in the local Lux Omni Blog working copy.
3. Inspect its existing patterns, prefixes, sequence ranges and counts.
4. Choose a configured ID pattern and the number of new IDs to generate.
5. Generate a new batch when needed.
6. Review and save the appended library.
7. Commit and synchronize the library update to GitHub.

Example of a customized ID pattern:

\`\`\`text
LUX-ENG-DRONE-00001
LUX-ENG-DRONE-00002
LUX-ENG-DRONE-00003
\`\`\`

The exact prefix map and sequence format for all categories/subcategories must be finalized before implementation.

**Generator safeguards:**

- New IDs are appended; existing library entries are never overwritten.
- A generated ID must not duplicate another library entry.
- Existing sequence ranges must be inspected before generating the next batch.
- IDs already assigned in website articles must also be treated as used.
- The generator must report the number of IDs added and the resulting inventory counts.
- Generation must fail safely if the requested pattern is invalid or the resulting IDs would collide.

### 3.3 Permanent ID library

The ID library is an inventory, not a consumable queue.

- It contains every ID ever generated for the project.
- Assignment does not delete or remove an ID from the library.
- Whether an ID is available is determined by comparing the library against IDs already assigned in article files across the full category tree.
- The same ID must never be assigned to two articles.
- Releasing an ID from an article does not make it eligible for routine reassignment. Reassignment or identity correction is an exceptional, explicitly approved maintenance operation.

For GitHub Actions to allocate IDs, the library must be available in the Lux Omni Blog repository or through a deliberately configured, authenticated source. The current proposal is to keep it in a repository-managed directory **outside \`site/\`**, for example:

\`\`\`text
article-id-data/
└── library.json
\`\`\`

This path is proposed, not yet created or approved as the final path. It must not be copied into \`_site/\` or published as a website asset. A file outside \`site/\` is excluded from the deployed website, but it is still visible in the GitHub repository if that repository is public; it must not contain secrets.

The separate local ID Manager edits this library file in the local website working copy. The library update is then committed and pushed so the GitHub Actions workflow can use the same inventory.

## 4. Automatic permanent article-ID assignment

ID assignment will run in **GitHub Actions**, before the website build. It will not depend on a local pre-commit hook, because articles may be committed from VS Code, edited directly on GitHub or created by an authorized automated publishing process.

### 4.1 Scan scope

The assignment process scans the complete article tree, not only the folder containing the newest article:

\`\`\`text
site/categories/
└── <main-category>/
    └── <subcategory>/
        └── articles/
            └── ... article HTML files
\`\`\`

The scanner must support the actual nested folder structure and any deeper subfolders under an \`articles/\` directory. It must exclude landing pages, shared partials, documentation, the \`Restore/\` backup, generated output and unrelated HTML pages.

### 4.2 Assignment procedure

For each eligible article:

1. Read the existing internal article ID from the agreed HTML field. The current front-end Tag Fetcher expects the body attribute \`data-article-id\`, exposed in JavaScript as \`document.body.dataset.articleId\`.
2. If a valid ID is already present, preserve it. Do not generate a replacement.
3. If no ID exists, determine the applicable category/subcategory prefix from the approved prefix map.
4. Compare the permanent library with all IDs already used anywhere in the complete article tree.
5. Select one unused ID matching the article's configured prefix.
6. Insert the ID in the article HTML using \`data-article-id\`.
7. Synchronize all references that use the article's identity, including the corresponding record in \`site/assets/js/article-index.js\` and the matching key in \`site/assets/js/tag-indexer.js\`.
8. Preserve any existing tag-to-article relationships when a key is updated.
9. Record a clear assignment report in the workflow log/summary.

The assignment must be one-time and stable. Subsequent runs must recognize the assigned ID and leave it unchanged.

### 4.3 Duplicate and failure safeguards

Before changing files, the workflow must scan and validate the complete article tree.

It must stop rather than publish when it detects:

- The same internal ID assigned to more than one article.
- An ID that is malformed or not present in the permanent library, unless explicitly recognized as a legacy ID under an approved migration rule.
- No available ID for the required category/subcategory prefix.
- A missing or ambiguous article-index record for an article that requires synchronization.
- Conflicting tag-indexer keys or a mapping that cannot be preserved safely.
- An article that cannot be safely parsed or updated.

Existing IDs must never be silently overwritten. The workflow must report the file path, reason and required corrective action. It must not continue to Cloudflare publication after a failed identity check.

### 4.4 Persisting automated assignments

An assignment made only inside the GitHub Actions runner would disappear when the runner is discarded. Therefore, successful assignments must be saved back to the source repository.

The intended method is for the workflow to create a narrowly scoped automated commit using the repository's \`GITHUB_TOKEN\` after it updates the article files and indexes. The same workflow run then continues to the build step using the updated working tree.

GitHub documents that pushes made using \`GITHUB_TOKEN\` do not trigger another \`push\`-based workflow run. This avoids a recursive workflow loop; the original run continues and builds the processed files. See [GitHub's GITHUB_TOKEN workflow-trigger documentation](https://docs.github.com/en/actions/concepts/security/github_token).

Implementation requirements:

- Grant only the permissions actually needed, including \`contents: write\` for the assignment commit.
- Serialize assignment runs so two workflows cannot allocate the same ID concurrently.
- Do not cancel an assignment run midway through a source update.
- Commit only the files changed by the assignment process.
- If assignment or persistence fails, stop before deployment.
- After the bot commit, the owner's local clone must synchronize the remote changes before making a later push that could overlap the same article/index files.

This creates two Git commits in the remote history when assignment is needed: the original content commit and the automated identity commit. They are handled within the same GitHub Actions workflow run. The automated commit does not cause a second workflow run when it uses \`GITHUB_TOKEN\`.

## 5. Automatic canonical URL and derived metadata processing

The internal article ID is not the canonical URL. Both are required and serve different purposes.

### 5.1 Canonical URL

The canonical URL will be derived from:

\`\`\`text
Configured production origin + article's path relative to site/
\`\`\`

For example, the article path:

\`\`\`text
categories/engineering/drone-technology/articles/a-pre-flight-inspection-checklist-for-small-drones.html
\`\`\`

will be combined with the configured production origin to produce its full public URL.

The production origin must be configured once and confirmed before implementation. The current sitemap uses \`https://blog.luxomni.com\`; confirm that this remains the final canonical production origin before using it as the build configuration.

### 5.2 Fields generated from the canonical URL

The build process will populate the article's source placeholders in the generated output, including:

- \`<link rel="canonical">\`
- Open Graph \`og:url\`
- Schema.org Article \`@id\` using the canonical URL plus \`#article\`
- Schema.org WebPage \`@id\` using the canonical URL plus \`#webpage\`
- Other URL references that are deterministic copies of the same canonical address.

The current source articles contain \`{{ARTICLE_CANONICAL_URL}}\` placeholders. The current \`scripts/build-site.mjs\` does not yet replace them. The planned implementation will populate them in the generated \`_site/\` output; it does not need to write the calculated public URL back into each original article source file.

A filename or folder move changes the derived canonical URL on the next build. It does not change the permanent internal article ID.

### 5.3 Other suitable derived metadata

Candidate deterministic tasks include:

- Reading-time estimates from article word counts, using one documented calculation rule.
- Breadcrumb hierarchy derived from the article's actual category/subcategory location.
- Author display details resolved from an explicitly selected author ID.
- Repeated social metadata values copied from the owner's approved article title/description fields.
- Structured-data relationships derived from the actual article metadata and canonical URL.

Each field must have a documented source and rule before it is automated. Do not invent missing editorial information. Do not silently rewrite manual publication dates, modification dates, descriptions, titles, tags or other owner-controlled values.

## 6. GitHub Actions development and review workflow

GitHub Actions is the central processing point for all supported ways of adding or editing articles.

### 6.1 Trigger

A push to the configured development/production source branch (currently \`main\`) starts the GitHub Actions validation/build workflow when relevant paths change.

The path filters will need to include:

- \`site/**\`
- \`scripts/**\`
- The permanent ID library directory once approved.
- \`.github/workflows/**\`

Documentation-only changes do not need to start the website build unless a workflow explicitly requires it.

If the owner makes many local commits during the day and synchronizes them in one push, that push starts one workflow run. Separate pushes can start separate runs.

### 6.2 Processing order

The workflow's intended order is:

\`\`\`text
Push received on GitHub
        |
        v
Checkout source repository
        |
        v
Scan all article files and all existing IDs
        |
        v
Validate global uniqueness and library references
        |
        v
Assign IDs to eligible articles missing an ID
        |
        v
Update article-index.js and tag-indexer.js references
        |
        v
Persist assignment changes with GITHUB_TOKEN
        |
        v
Run scripts/build-site.mjs
        |
        v
Generate canonical URLs and derived metadata
        |
        v
Validate assembled HTML and metadata
        |
        v
Create a reviewable _site artifact and run report
        |
        v
Wait for explicit production approval
\`\`\`

The assignment and build stages should be part of the same workflow run. The workflow must not deploy if identity assignment, metadata processing or validation fails.

### 6.3 Review evidence

Before production deployment, the workflow should provide:

- A readable summary of files scanned, IDs preserved, IDs assigned and errors found.
- A list of source files changed by automatic identity assignment.
- Duplicate-ID and library-validation results.
- Canonical URL and unresolved-placeholder checks.
- Build success/failure information.
- A downloadable \`_site/\` artifact containing the exact assembled website to be considered for deployment.

The owner can inspect the GitHub Actions run and preview the built artifact locally. The exact visual/performance audit tooling and pass thresholds remain to be decided; the current build script is a structural assembler/validator, not a Lighthouse performance audit.

If corrections are needed, push the corrected source and review the resulting run. Do not approve a failed or outdated run.

## 7. Cloudflare Pages production publishing

### 7.1 Desired Cloudflare configuration

The intended hosting arrangement is:

- Connect the Cloudflare Pages project to the GitHub repository.
- Disable automatic production branch deployments.
- Set the Preview branch to \`None\` if automatic preview deployments are also not wanted.
- Keep GitHub Actions responsible for processing and preparing the website.
- Publish the reviewed, prebuilt \`_site/\` directory to Cloudflare using Wrangler after explicit approval.

Cloudflare's documentation confirms that an existing Git-integrated Pages project can disable automatic deployments and then use Wrangler to deploy directly to the Pages project. See [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) and [Wrangler Pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/).

### 7.2 What happens on a normal GitHub push

A push to GitHub starts the GitHub Actions workflow. It does **not** start a Cloudflare Git-integrated build once Cloudflare automatic deployments are disabled.

GitHub Actions may build and validate the site on every qualifying push. Those are GitHub Actions runs, not Cloudflare Pages Git builds.

The workflow creates a reviewable artifact. No Cloudflare production deployment occurs until the owner approves the final deployment.

### 7.3 Final deployment

After the owner has reviewed the run, logs, artifact and required checks, an explicitly approved deployment job will upload the already-built artifact using Wrangler.

The deployment should use the exact artifact from the approved run rather than silently rebuilding different source after review.

This gives the project repeated GitHub-side validation during development but only one deliberate Cloudflare production deployment for the approved release.

The current \`.github/workflows/pages.yml\` still deploys to GitHub Pages using \`actions/deploy-pages\`. It must be deliberately refactored as part of the Cloudflare migration. Do not leave two competing production deployment pipelines active unintentionally.

## 8. Everyday publishing examples

### 8.1 Article created in VS Code

1. The owner or an authorized writing tool creates/edits an article in the local repository.
2. The owner saves and commits the source changes.
3. VS Code Sync Changes pushes the commit to GitHub.
4. GitHub Actions assigns missing permanent IDs, synchronizes references, saves its automated source commit and builds the site.
5. The owner reviews the workflow report and artifact.
6. The owner approves the final Cloudflare deployment when satisfied.

### 8.2 Article edited directly on GitHub

A direct GitHub edit bypasses local hooks. It does not bypass GitHub Actions. The same remote assignment, validation and build workflow runs after the push.

### 8.3 Article created by an authorized automated publishing tool

The tool commits/pushes the source article to the repository. The same GitHub Actions workflow processes its identity, references and build. The automated tool must not be given responsibility for researching or approving article facts merely because it can create a file.

### 8.4 Multiple local commits during one day

The owner may create multiple local commits and synchronize them in one push. GitHub Actions processes the pushed state in one workflow run. The Cloudflare deployment remains separate and waits for explicit approval.

## 9. Failure and recovery rules

- **No suitable unused ID:** Stop assignment/build and report which category prefix needs replenishment.
- **Duplicate existing ID:** Stop; do not guess which article should keep it.
- **Missing article-index record or conflicting tag mapping:** Stop and report the exact article and file references.
- **Canonical placeholder unresolved:** Fail the build; do not deploy an incomplete page.
- **Build or validation failure:** Keep the current live Cloudflare deployment unchanged.
- **Cloudflare deployment not approved:** Keep the reviewed artifact available; do not publish it.
- **Automated assignment commit succeeds but a later build fails:** Keep the permanent ID assignment in source control. Correct the build issue and rerun validation; do not allocate a replacement ID.
- **Existing article moved or renamed:** Preserve its internal ID. Recalculate its canonical URL and update URL references deliberately.
- **ID reassignment/removal:** Treat as an exceptional, explicitly approved maintenance action. Routine automation must never reassign an existing article's identity.

## 10. Current implementation status

The following is the state observed when this plan was recorded:

| Component | Current status |
|---|---|
| Article source under \`site/categories/\` | Exists |
| \`article-index.js\` | Exists; stores 60 article records with existing IDs |
| \`tag-indexer.js\` and \`tag-library.js\` | Exist; tag mappings depend on article IDs |
| \`tag-fetcher.js\` | Exists; reads \`body.dataset.articleId\` |
| \`scripts/build-site.mjs\` | Exists; assembles shared components, checks page structure and creates \`_site/\` |
| Canonical URL placeholders in article sources | Exist |
| Canonical URL substitution in build script | Not implemented |
| Permanent generated ID library | Not yet established |
| Separate local ID Manager application | Not yet implemented |
| Automatic GitHub Actions ID assignment and source commit | Not implemented |
| Canonical metadata generation during build | Not implemented |
| Cloudflare Pages project and manual Wrangler deployment workflow | Not yet configured |
| Current deployment workflow | \`.github/workflows/pages.yml\` deploys to GitHub Pages |

This document records the target workflow. It does not state that the planned automation or Cloudflare migration is already implemented.

## 11. Decisions required before implementation

The following details must be finalized in the specification phase:

1. **ID prefix map:** Define the exact customized ID prefix for each main category/subcategory, sequence width and generation rules.
2. **Legacy ID policy:** Decide how the existing IDs already referenced by \`article-index.js\` and \`tag-indexer.js\` are treated. Do not mass-replace them without an explicit migration plan that preserves every tag relationship.
3. **Library location and format:** Confirm the permanent library path outside \`site/\`, its JSON schema and the local ID Manager's write behavior.
4. **Article identity field:** Confirm \`data-article-id\` on the article's \`<body>\` as the permanent internal ID field used by the front end.
5. **Production origin:** Confirm the final canonical site origin before enabling canonical URL generation.
6. **Derived metadata rules:** Approve the calculation/source for each automatically generated field.
7. **Workflow concurrency and permissions:** Configure serialized identity assignment, least-privilege write access and safe bot commits.
8. **Review and deployment gate:** Choose the GitHub Actions approval mechanism and exact artifact handoff to Wrangler.
9. **Performance review:** Decide whether performance checks are manual initially or use an automated audit with defined thresholds.

## 12. Implementation sequence

1. Finalize the article identity and metadata schema, including the legacy-ID migration policy.
2. Define the permanent ID library format and category/subcategory prefix map.
3. Build the separate local ID Manager for manual ID generation and library replenishment.
4. Implement GitHub Actions global ID scanning, one-time assignment, reference synchronization and safe source commits.
5. Extend \`scripts/build-site.mjs\` to generate canonical URLs and approved deterministic metadata in \`_site/\`.
6. Add validation reports and a downloadable review artifact.
7. Configure Cloudflare Pages with automatic Git deployments disabled.
8. Replace the current GitHub Pages deployment stage with an explicitly approved Wrangler production deployment using the reviewed artifact.
9. Test VS Code pushes, direct GitHub edits, automated article commits, duplicate detection, library exhaustion, failed builds and final production deployment.

---

## Official workflow references

- [Cloudflare Pages — Git integration and disabling automatic deployments](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare — Wrangler Pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/)
- [GitHub Actions — GITHUB_TOKEN and workflow triggers](https://docs.github.com/en/actions/concepts/security/github_token)
- [GitHub Actions — Workflow triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
