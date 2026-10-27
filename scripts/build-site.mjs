#!/usr/bin/env node
/**
 * Lux Omni Blog static-site build.
 *
 * Expands explicitly marked shared components into complete HTML at build time.
 * Pages without component markers are copied without shell migration.
 * Source partials are excluded from the public output.
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_DIR = path.join(REPOSITORY_ROOT, 'site');
const PARTIAL_DIR = path.join(SITE_DIR, 'partials');
const OUTPUT_DIR = path.join(REPOSITORY_ROOT, '_site');

const PARTIALS = {
  TOPBAR: path.join(PARTIAL_DIR, 'topbar.html'),
  'MAIN-HEADER': path.join(PARTIAL_DIR, 'main-header.html'),
  FOOTER: path.join(PARTIAL_DIR, 'footer.html')
};

function pageRootPrefix(html, relativeFile) {
  const bodyTag = html.match(/<body\b[^>]*>/i)?.[0] || '';
  const rootMatch = bodyTag.match(/\bdata-site-root\s*=\s*(["'])(.*?)\1/i);
  if (rootMatch) return rootMatch[2];

  const directory = path.posix.dirname(relativeFile.split(path.sep).join('/'));
  if (directory === '.') return '';
  const depth = directory.split('/').filter(Boolean).length;
  return '../'.repeat(depth);
}

function assertMarkerCounts(html, relativeFile) {
  for (const markerName of Object.keys(PARTIALS)) {
    const marker = '<!-- SHARED:' + markerName + ' -->';
    const count = html.split(marker).length - 1;
    if (count > 1) {
      throw new Error(relativeFile + ' contains the marker ' + marker + ' more than once.');
    }
  }
}

function injectFooterStylesheet(html, rootPrefix, relativeFile, usesFooter) {
  if (!usesFooter || html.includes('assets/css/footer.css')) return html;
  const headEnd = html.toLowerCase().lastIndexOf('</head>');
  if (headEnd < 0) {
    throw new Error(relativeFile + ' uses the shared footer but has no closing </head> tag.');
  }
  const link = '  <link rel="stylesheet" href="' + rootPrefix + 'assets/css/footer.css">\n';
  return html.slice(0, headEnd) + link + html.slice(headEnd);
}

async function walkAndBuild(sourceDirectory, relativeDirectory, partialContents) {
  const entries = await readdir(sourceDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = relativeDirectory
      ? path.join(relativeDirectory, entry.name)
      : entry.name;
    const normalizedRelativePath = relativePath.split(path.sep).join('/');

    // These are authoring fragments, not public pages or static assets.
    if (!relativeDirectory && entry.isDirectory() && entry.name === 'partials') continue;

    const sourcePath = path.join(sourceDirectory, entry.name);
    const outputPath = path.join(OUTPUT_DIR, relativePath);

    if (entry.isDirectory()) {
      await mkdir(outputPath, { recursive: true });
      await walkAndBuild(sourcePath, relativePath, partialContents);
      continue;
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    if (!entry.isFile()) continue;

    if (!normalizedRelativePath.toLowerCase().endsWith('.html')) {
      await cp(sourcePath, outputPath);
      continue;
    }

    let html = await readFile(sourcePath, 'utf8');
    const hasSharedMarker = /<!-- SHARED:(?:TOPBAR|MAIN-HEADER|FOOTER) -->/.test(html);
    if (hasSharedMarker) {
      assertMarkerCounts(html, normalizedRelativePath);
      const rootPrefix = pageRootPrefix(html, normalizedRelativePath);
      const usesFooter = html.includes('<!-- SHARED:FOOTER -->');

      for (const [markerName] of Object.entries(PARTIALS)) {
        const marker = '<!-- SHARED:' + markerName + ' -->';
        if (!html.includes(marker)) continue;
        const fragment = partialContents[markerName].replaceAll('{{ROOT}}', rootPrefix).trim();
        html = html.replace(marker, fragment);
      }

      html = injectFooterStylesheet(html, rootPrefix, normalizedRelativePath, usesFooter);
      if (/<!-- SHARED:|{{ROOT}}/.test(html)) {
        throw new Error(normalizedRelativePath + ' contains an unresolved shared-component marker or root token.');
      }
    }

    await writeFile(outputPath, html, 'utf8');
  }
}

async function main() {
  await readFile(path.join(SITE_DIR, 'index.html'), 'utf8');
  const partialContents = {};
  for (const [markerName, partialPath] of Object.entries(PARTIALS)) {
    partialContents[markerName] = await readFile(partialPath, 'utf8');
  }

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });
  await walkAndBuild(SITE_DIR, '', partialContents);
  await writeFile(path.join(OUTPUT_DIR, '.nojekyll'), '', 'utf8');

  const builtHome = await readFile(path.join(OUTPUT_DIR, 'index.html'), 'utf8');
  for (const [name, selector] of [
    ['topbar', 'class="topbar"'],
    ['main header', 'class="site-header"'],
    ['search dialog', 'id="search-dialog"'],
    ['footer', 'class="site-footer"']
  ]) {
    if (!builtHome.includes(selector)) {
      throw new Error('Homepage build verification failed: missing ' + name + '.');
    }
  }
  if (/<!-- SHARED:|{{ROOT}}/.test(builtHome)) {
    throw new Error('Homepage build verification failed: unresolved shared-component marker or root token.');
  }

  console.log('Built static site into _site/. Shared components are expanded only on pages with explicit markers.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
