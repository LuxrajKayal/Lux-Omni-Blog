import { AUTHORS_BY_ID } from "./author-library.js";

const ICONS = {
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"></path><path d="M4 17v-5h5"></path><path d="M5.6 9A7 7 0 0 1 17.5 6L20 12M4 12l2.5 6A7 7 0 0 0 18.4 15"></path></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72"></path></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7M10 14 21 3"></path><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"></path></svg>',
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

function createDateGroup({ label, value, icon, modifier }) {
  const formattedDate = formatArticleDate(value);
  if (!formattedDate) {
    console.warn("Author bar has an invalid " + label.toLowerCase() + " date: " + (value || "(missing)"));
    return null;
  }

  const group = createElement("div", "author-bar__date-group author-bar__date-group--" + modifier);
  const iconElement = createIcon(icon);
  iconElement.classList.add("author-bar__date-icon");

  const textGroup = createElement("div", "author-bar__date-text");
  const dateLabel = createElement("span", "author-bar__date-label", label);
  const time = createElement("time", "author-bar__date-value", formattedDate);
  time.dateTime = value;

  textGroup.append(dateLabel, time);
  group.append(iconElement, textGroup);
  return group;
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
  avatar.width = 84;
  avatar.height = 84;
  avatar.loading = "eager";
  avatar.decoding = "async";
  avatarLink.append(avatar);

  const identity = createElement("div", "author-bar__identity");
  const name = createElement("a", "author-bar__name", author.name);
  name.href = profileUrl.href;

  const handle = createElement("a", "author-bar__handle", author.handle);
  handle.href = profileUrl.href;
  handle.append(createIcon(ICONS.external));
  handle.lastElementChild.classList.add("author-bar__external-icon");

  identity.append(name, handle);
  profile.append(avatarLink, identity);
  return profile;
}

function createSharingGroup() {
  const sharing = createElement("div", "author-bar__sharing");
  const articleUrl = window.location.href;
  const title = document.querySelector(".article-entry-header h1")?.textContent?.trim() || document.title;

  const copyButton = createElement("button", "author-bar__copy", "Copy Link");
  copyButton.type = "button";
  copyButton.setAttribute("data-article-copy", "");
  copyButton.setAttribute("aria-label", "Copy article link");
  copyButton.insertBefore(createIcon(ICONS.link), copyButton.firstChild);

  const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php");
  facebookUrl.searchParams.set("u", articleUrl);
  const facebook = createElement("a", "author-bar__social author-bar__social--facebook");
  facebook.href = facebookUrl.href;
  facebook.target = "_blank";
  facebook.rel = "noopener noreferrer";
  facebook.setAttribute("aria-label", "Share article on Facebook");
  facebook.title = "Share on Facebook";
  facebook.append(createIcon(ICONS.facebook));

  const xUrl = new URL("https://twitter.com/intent/tweet");
  xUrl.searchParams.set("text", title);
  xUrl.searchParams.set("url", articleUrl);
  const x = createElement("a", "author-bar__social author-bar__social--x");
  x.href = xUrl.href;
  x.target = "_blank";
  x.rel = "noopener noreferrer";
  x.setAttribute("aria-label", "Share article on X");
  x.title = "Share on X";
  x.append(createIcon(ICONS.x));

  const instagram = createElement("button", "author-bar__social author-bar__social--instagram");
  instagram.type = "button";
  instagram.setAttribute("data-author-bar-instagram", "");
  instagram.setAttribute("aria-label", "Share article using your device's share options");
  instagram.title = "Share using device options";
  instagram.append(createIcon(ICONS.instagram));

  sharing.append(copyButton, facebook, x, instagram);
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

    const profile = createProfile(author, siteRoot);
    const published = createDateGroup({
      label: "Published",
      value: bar.dataset.publishedDate,
      icon: ICONS.calendar,
      modifier: "published"
    });
    const modified = createDateGroup({
      label: "Last Updated",
      value: bar.dataset.modifiedDate,
      icon: ICONS.refresh,
      modifier: "modified"
    });

    if (!profile || !published || !modified) {
      bar.hidden = true;
      console.warn("Author bar could not be rendered completely for article author: " + authorId);
      return;
    }

    bar.replaceChildren(profile, published, modified, createSharingGroup());
    bar.hidden = false;
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Article author and sharing details for " + author.name);

    const status = createElement("span", "author-bar__status");
    status.setAttribute("data-author-bar-status", "");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    bar.append(status);
  });
}
