import { ARTICLES } from "./article-index.js";
import { getArticleTagNames } from "./tag-indexer.js";

const titleCompare = (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
const catCompare = (a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: "base" });
const escapeHTML = value => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const fmtDate = value => new Date(value + "T12:00:00Z").toLocaleDateString("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
});

export function initSearch() {
  const dialog = document.querySelector("#search-dialog");
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#search-query");
  const category = document.querySelector("#search-category-filter");
  const sort = document.querySelector("#search-sort");
  const slider = document.querySelector("#search-reading-time");
  const output = document.querySelector("#search-reading-output");
  const results = document.querySelector("#search-results");
  const count = document.querySelector("#search-result-count");
  if (!dialog || !form || !input || !category || !sort || !slider || !output || !results || !count) return;

  [...new Set(ARTICLES.map(article => article.category))]
    .sort((a, b) => a.localeCompare(b))
    .forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      category.append(option);
    });

  function matches() {
    const query = input.value.trim().toLocaleLowerCase();
    const selectedCategory = category.value;
    const maxReadingTime = Number(slider.value);
    const list = ARTICLES.filter(article => {
      const tagNames = getArticleTagNames(article.id);
      const searchable = [article.title, article.summary, article.category, article.parentCategory, ...tagNames]
        .join(" ").toLocaleLowerCase();
      return (!query || searchable.includes(query)) &&
        (!selectedCategory || article.category === selectedCategory) &&
        article.readingMinutes <= maxReadingTime;
    });

    switch (sort.value) {
      case "date-asc": list.sort((a, b) => a.published.localeCompare(b.published) || titleCompare(a, b)); break;
      case "category-asc": list.sort((a, b) => catCompare(a, b) || titleCompare(a, b)); break;
      case "title-asc": list.sort(titleCompare); break;
      case "title-desc": list.sort((a, b) => titleCompare(b, a)); break;
      default: list.sort((a, b) => b.published.localeCompare(a.published) || titleCompare(a, b));
    }
    return list;
  }

  function render() {
    const max = Number(slider.value);
    output.textContent = (max === 15 ? "15+" : String(max)) + " min max";
    const list = matches();
    count.textContent = list.length + " sample article" + (list.length === 1 ? "" : "s");
    if (!list.length) {
      results.innerHTML = '<p class="search-empty">No sample articles match those filters. Try a broader term, another category or a longer reading time.</p>';
      return;
    }
    const root = document.body.dataset.siteRoot || "";
    results.innerHTML = list.map(article =>
      '<article class="search-result"><div class="search-result__eyebrow"><span>' +
      escapeHTML(article.parentCategory) + " / " + escapeHTML(article.category) +
      '</span><span>' + escapeHTML(fmtDate(article.published)) +
      '</span></div><h3><a href="' + root + escapeHTML(article.href) + '">' +
      escapeHTML(article.title) + '</a></h3><p>' + escapeHTML(article.summary) +
      '</p><div class="search-result__footer"><span>' + article.readingMinutes +
      ' min read</span></div></article>'
    ).join("");
  }

  let lastTrigger = null;
  document.querySelectorAll("[data-search-open]").forEach(button => button.addEventListener("click", () => {
    lastTrigger = button;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    render();
    input.focus();
  }));
  document.querySelector("[data-search-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => lastTrigger?.focus());
  form.addEventListener("submit", event => { event.preventDefault(); render(); });
  input.addEventListener("input", render);
  category.addEventListener("change", render);
  sort.addEventListener("change", render);
  slider.addEventListener("input", render);
  render();
}
