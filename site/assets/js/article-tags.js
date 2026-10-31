import { ARTICLES } from "./article-index.js";
import { TAGS_BY_ID } from "./tag-index.js";

const escapeHTML = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

/**
 * Add the article's reusable tags after its metadata.
 * A click emits a custom event for the future Tag Search popup.
 * This module does not create a popup or display tag-search results.
 */
export function initArticleTags() {
  if (document.body.dataset.pageType !== "article") return;

  const articleId = document.body.dataset.articleId;
  const articleMeta = document.querySelector(".article-meta");
  if (!articleId || !articleMeta || document.querySelector(".article-tags")) return;

  const article = ARTICLES.find(item => item.id === articleId);
  if (!article) return;

  const tags = (article.tags || []).map(id => TAGS_BY_ID[id]).filter(Boolean);
  if (!tags.length) return;

  const section = document.createElement("nav");
  section.className = "article-tags";
  section.setAttribute("aria-label", "Article topics");
  section.innerHTML = '<span class="article-tags__label">Topics</span><div class="article-tags__list"></div>';

  const list = section.querySelector(".article-tags__list");
  list.innerHTML = tags.map(tag =>
    '<button class="article-tag" type="button" data-tag-trigger data-tag-id="' +
    escapeHTML(tag.id) + '">' + escapeHTML(tag.name) + '</button>'
  ).join("");

  articleMeta.insertAdjacentElement("afterend", section);

  list.addEventListener("click", event => {
    const trigger = event.target.closest("[data-tag-trigger]");
    if (!trigger || !list.contains(trigger)) return;

    const tag = TAGS_BY_ID[trigger.dataset.tagId];
    if (!tag) return;

    document.dispatchEvent(new CustomEvent("luxomni:tag-select", {
      detail: { tagId: tag.id, tagName: tag.name, articleId }
    }));
  });
}
