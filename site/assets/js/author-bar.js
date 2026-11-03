import { AUTHORS_BY_ID } from "./author-library.js";

const ICONS = {
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.62 1.62"></path><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.62-1.62"></path><path d="m8.5 15.5 7-7"></path></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v1.9H7v3.1h3V21h3.5Z"></path></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2.8h2.8l-6.1 7 7.2 11.4h-5.6l-4.4-6.9-6 6.9H4l6.5-7.5L3.6 2.8h5.7l4 6.3 5.6-6.3Zm-1 16.3h1.5L8.1 4.8H6.5l11.4 14.3Z"></path></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.8" r=".8" class="author-bar__instagram-dot"></circle></svg>'
};

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createIcon(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup;
  return template.content.firstElementChild;
}

function getSiteRoot() {
  return new URL(document.body.dataset.siteRoot || "./", window.location.href);
}

function resolveHttpUrl(value, baseUrl) {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value, baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

function formatArticleDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;

  const date = new Date(value + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function createProfile(author, siteRoot) {
  const profileUrl = resolveHttpUrl(author.profileUrl, siteRoot);
  const imageUrl = resolveHttpUrl(author.image, siteRoot);

  if (!author.name || !author.handle || !profileUrl || !imageUrl) {
    console.warn("Author Library record is incomplete or invalid: " + author.id);
    return null;
  }

  const profile = createElement("div", "author-bar__profile");

  const avatarLink = createElement("a", "author-bar__avatar-link");
  avatarLink.href = profileUrl.href;
  avatarLink.setAttribute("aria-label", "Visit " + author.name + "'s author page");

  const avatar = createElement("img", "author-bar__avatar");
  avatar.src = imageUrl.href;
  avatar.alt = author.name + " profile photograph";
  avatar.width = 48;
  avatar.height = 48;
  avatar.loading = "eager";
  avatar.decoding = "async";
  avatarLink.append(avatar);

  const identity = createElement("div", "author-bar__identity");
  const nameLine = createElement("div", "author-bar__name-line");

  const name = createElement("a", "author-bar__name", author.name);
  name.href = profileUrl.href;

  const handle = createElement("a", "author-bar__handle", author.handle);
  handle.href = profileUrl.href;
  handle.setAttribute("aria-label", "Author page for " + author.name);

  nameLine.append(name, handle);
  identity.append(nameLine);

  profile.append(avatarLink, identity);
  return { profile, identity };
}

function createDateLine(publishedValue, modifiedValue) {
  const publishedDate = formatArticleDate(publishedValue);
  const modifiedDate = formatArticleDate(modifiedValue);

  if (!publishedDate || !modifiedDate) {
    console.warn("Author bar requires valid publication and modification dates.");
    return null;
  }

  const dateLine = createElement("div", "author-bar__date-line");

  const published = createElement("span", "author-bar__date-item");
  published.append(
    createElement("span", "author-bar__date-label", "Published"),
    document.createTextNode(" " + publishedDate)
  );

  const separator = createElement("span", "author-bar__date-separator", "·");
  separator.setAttribute("aria-hidden", "true");

  const modified = createElement("span", "author-bar__date-item");
  modified.append(
    createElement("span", "author-bar__date-label", "Updated"),
    document.createTextNode(" " + modifiedDate)
  );

  dateLine.append(published, separator, modified);
  return dateLine;
}

function createSocialLink({ label, className, href, icon }) {
  const link = createElement("a", "author-bar__social " + className);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = label;
  link.setAttribute("aria-label", label);
  link.append(createIcon(icon));
  return link;
}

function createSharingGroup() {
  const sharing = createElement("div", "author-bar__sharing");
  const articleUrl = window.location.href;
  const title = document.querySelector(".article-entry-header h1")?.textContent?.trim() || document.title;

  const label = createElement("span", "author-bar__share-label", "SHARE");

  const xUrl = new URL("https://twitter.com/intent/tweet");
  xUrl.searchParams.set("text", title);
  xUrl.searchParams.set("url", articleUrl);

  const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php");
  facebookUrl.searchParams.set("u", articleUrl);

  const x = createSocialLink({
    label: "Share article on X",
    className: "author-bar__social--x",
    href: xUrl.href,
    icon: ICONS.x
  });

  const facebook = createSocialLink({
    label: "Share article on Facebook",
    className: "author-bar__social--facebook",
    href: facebookUrl.href,
    icon: ICONS.facebook
  });

  const instagram = createElement("button", "author-bar__social author-bar__social--instagram");
  instagram.type = "button";
  instagram.setAttribute("data-author-bar-instagram", "");
  instagram.setAttribute("aria-label", "Share article using your device's share options");
  instagram.title = "Share using device options";
  instagram.append(createIcon(ICONS.instagram));

  const copy = createElement("button", "author-bar__social author-bar__social--copy");
  copy.type = "button";
  copy.setAttribute("data-article-copy", "");
  copy.setAttribute("aria-label", "Copy article link");
  copy.title = "Copy article link";
  copy.append(createIcon(ICONS.link));

  sharing.append(label, x, facebook, instagram, copy);
  return sharing;
}

export function initAuthorBar() {
  const bars = document.querySelectorAll("[data-author-bar]");
  if (!bars.length) return;

  let siteRoot;
  try {
    siteRoot = getSiteRoot();
  } catch (error) {
    console.warn("Author bar could not resolve the website root.", error);
    return;
  }

  bars.forEach(bar => {
    const authorId = bar.dataset.authorId;
    const author = AUTHORS_BY_ID[authorId];

    if (!author) {
      bar.hidden = true;
      console.warn("Author profile not found in Author Library: " + (authorId || "(missing ID)"));
      return;
    }

    const authorParts = createProfile(author, siteRoot);
    const dateLine = createDateLine(bar.dataset.publishedDate, bar.dataset.modifiedDate);

    if (!authorParts || !dateLine) {
      bar.hidden = true;
      console.warn("Author bar could not be rendered for article author: " + authorId);
      return;
    }

    authorParts.identity.append(dateLine);
    bar.replaceChildren(authorParts.profile, createSharingGroup());

    const status = createElement("span", "author-bar__status");
    status.setAttribute("data-author-bar-status", "");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    bar.append(status);

    bar.hidden = false;
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Article author and sharing information for " + author.name);
  });
}
