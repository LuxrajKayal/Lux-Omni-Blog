/*
 * Lux Omni Blog — curated homepage hero.
 * Manually maintain up to five same-origin article URLs below.
 * Each article must contain one selected image marked with data-hero-image.
 */
const FEATURED_ARTICLE_URLS = [
  "categories/tech-news/ai/articles/ai-on-the-edge-what-local-inference-changes.html",
  "categories/tech-news/phones/articles/phone-hardware-explained-chips-cameras-and-radios.html",
  "categories/tech-news/computing/articles/a-practical-guide-to-choosing-a-computer-processor.html",
  "categories/tech-news/tv-audio/articles/display-refresh-rates-and-hdr-explained.html",
  "categories/tech-news/gaming/articles/what-to-check-before-upgrading-a-gaming-pc.html"
];
const MAX_FEATURED_ARTICLES = 5;
const ROTATION_INTERVAL_MS = 5000;
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
async function readArticle(path, siteRoot) {
  const url = new URL(path, siteRoot);
  if (url.origin !== window.location.origin) throw new Error("Featured article must be same-origin: " + url.href);
  const response = await fetch(url.href, { headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error("Article request failed (" + response.status + "): " + url.href);
  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  const heading = doc.querySelector(".article-content h1, main article h1, article h1, main h1");
  const picked = doc.querySelector("img[data-hero-image]");
  if (!heading?.textContent.trim()) throw new Error("Article has no h1: " + url.href);
  if (!picked) throw new Error("Article has no img[data-hero-image]: " + url.href);
  const src = picked.getAttribute("src") || picked.getAttribute("data-src");
  if (!src) throw new Error("Tagged image has no src: " + url.href);
  const imageUrl = new URL(src, url);
  if (!["http:", "https:"].includes(imageUrl.protocol)) throw new Error("Unsupported image URL: " + imageUrl.href);
  return { url: url.href, title: heading.textContent.trim(), imageUrl: imageUrl.href, alt: (picked.getAttribute("alt") || heading.textContent).trim() };
}
function buildSlide(article, index, total) {
  const slide = el("article", "hero-showcase__item");
  const imageLink = el("a", "hero-showcase__image-link");
  imageLink.href = article.url;
  imageLink.setAttribute("aria-label", "Read article: " + article.title);
  const image = el("img", "hero-showcase__image");
  image.src = article.imageUrl; image.alt = article.alt; image.width = 480; image.height = 270; image.loading = "eager"; image.decoding = "async";
  imageLink.append(image);
  const caption = el("div", "hero-showcase__caption");
  caption.append(el("span", "hero-showcase__article-label", "Featured article · " + String(index+1).padStart(2,"0") + " / " + String(total).padStart(2,"0")));
  const heading = el("h2");
  const titleLink = el("a", "hero-showcase__headline", article.title);
  titleLink.href = article.url;
  heading.append(titleLink);
  const readLink = el("a", "hero-showcase__read-link", "Read article ↗");
  readLink.href = article.url;
  caption.append(heading, readLink);
  slide.append(imageLink, caption);
  return slide;
}
export function initHeroShowcase() {
  const root = document.querySelector("[data-hero-showcase]");
  if (!root) return;
  const siteRoot = new URL(document.body.dataset.siteRoot || "./", document.baseURI);
  const slide = root.querySelector("[data-hero-slide]");
  const count = root.querySelector("[data-hero-count]");
  const dots = root.querySelector("[data-hero-dots]");
  const prev = root.querySelector("[data-hero-prev]");
  const next = root.querySelector("[data-hero-next]");
  const toggle = root.querySelector("[data-hero-toggle-play]");
  if (!slide || !count || !dots || !prev || !next || !toggle) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let articles = [];
  let current = 0;
  let paused = false;
  let hovering = false;
  let timer = null;
  function updateControls() {
    const total = articles.length;
    count.textContent = total ? String(current+1).padStart(2,"0") + " / " + String(total).padStart(2,"0") : "0 / 0";
    prev.disabled = next.disabled = total < 2;
    toggle.disabled = total < 2 || reducedMotion;
    toggle.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", reducedMotion ? "Automatic rotation disabled by reduced-motion preference" : paused ? "Resume automatic rotation" : "Pause automatic rotation");
    toggle.setAttribute("aria-pressed", String(paused));
    dots.querySelectorAll("[data-hero-index]").forEach((dot,i)=>{dot.setAttribute("aria-pressed",String(i===current));dot.classList.toggle("is-active",i===current);});
  }
  function stopTimer() { if (timer!==null) window.clearInterval(timer); timer=null; }
  function syncTimer() {
    stopTimer();
    if (articles.length<2 || paused || hovering || document.hidden || reducedMotion) return;
    timer=window.setInterval(()=>show((current+1)%articles.length),ROTATION_INTERVAL_MS);
  }
  function show(index) {
    if (!articles.length) return;
    current=(index+articles.length)%articles.length;
    slide.replaceChildren(buildSlide(articles[current],current,articles.length));
    slide.classList.remove("is-entering"); void slide.offsetWidth; slide.classList.add("is-entering");
    updateControls();
  }
  function buildDots() {
    dots.replaceChildren(...articles.map((article,i)=>{
      const dot=el("button","hero-showcase__dot"); dot.type="button"; dot.dataset.heroIndex=String(i);
      dot.setAttribute("aria-label","Show featured article "+(i+1)+": "+article.title); dot.setAttribute("aria-pressed","false");
      dot.addEventListener("click",()=>{show(i);syncTimer();}); return dot;
    }));
  }
  function unavailable() {
    count.textContent="0 / 0";
    const message=el("p","hero-showcase__status","Featured articles are temporarily unavailable.");
    const link=el("a","","Browse Tech News"); link.href=new URL("categories/tech-news/tech-news-index.html",siteRoot).href;
    message.append(document.createElement("br"),link); slide.replaceChildren(message);
    prev.disabled=next.disabled=toggle.disabled=true;
  }
  prev.addEventListener("click",()=>{show(current-1);syncTimer();});
  next.addEventListener("click",()=>{show(current+1);syncTimer();});
  toggle.addEventListener("click",()=>{paused=!paused;updateControls();syncTimer();});
  root.addEventListener("pointerenter",()=>{hovering=true;syncTimer();});
  root.addEventListener("pointerleave",()=>{hovering=false;syncTimer();});
  document.addEventListener("visibilitychange",syncTimer);
  Promise.all(FEATURED_ARTICLE_URLS.slice(0,MAX_FEATURED_ARTICLES).map(async path=>{
    try{return await readArticle(path,siteRoot);}catch(error){console.warn("[Lux Omni hero] Skipping featured article:",error);return null;}
  })).then(results=>{
    articles=results.filter(Boolean);
    if(!articles.length){unavailable();return;}
    buildDots();show(0);syncTimer();
  });
}
