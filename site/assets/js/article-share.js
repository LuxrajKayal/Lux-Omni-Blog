/*
 * Lux Omni Blog — article sharing controls
 *
 * Supports the reusable author bar and the older article-share attributes
 * during the gradual article migration.
 */

function getArticleShareData() {
    const title = document.querySelector(".article-entry-header h1")?.textContent?.trim()
        || document.title;
    const description = document.querySelector(".article-introduction")?.textContent?.trim()
        || "";

    return {
        title,
        text: description,
        url: window.location.href
    };
}

function getStatusElement(trigger) {
    return trigger?.closest("[data-author-bar]")?.querySelector("[data-author-bar-status]")
        || document.querySelector("[data-article-share-status]");
}

function setShareStatus(message, trigger) {
    const statusElement = getStatusElement(trigger);
    if (statusElement) statusElement.textContent = message;
}

async function copyArticleUrl() {
    const url = window.location.href;

    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return;
    }

    const temporaryField = document.createElement("textarea");
    temporaryField.value = url;
    temporaryField.setAttribute("readonly", "");
    temporaryField.style.position = "fixed";
    temporaryField.style.opacity = "0";
    document.body.appendChild(temporaryField);
    temporaryField.select();

    const copied = document.execCommand("copy");
    temporaryField.remove();

    if (!copied) {
        throw new Error("The browser could not copy the article URL.");
    }
}

async function handleCopy(trigger) {
    try {
        await copyArticleUrl();
        setShareStatus("Link copied.", trigger);
    } catch {
        setShareStatus("Copy failed. You can copy the address from your browser.", trigger);
    }
}

async function handleDeviceShare(trigger, unavailableMessage) {
    if (navigator.share) {
        try {
            await navigator.share(getArticleShareData());
            setShareStatus("Sharing completed.", trigger);
        } catch (error) {
            if (error?.name !== "AbortError") {
                setShareStatus("Sharing could not be completed.", trigger);
            }
        }
        return;
    }

    try {
        await copyArticleUrl();
        setShareStatus(unavailableMessage, trigger);
    } catch {
        setShareStatus("Sharing is unavailable in this browser.", trigger);
    }
}

document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!target) return;

    const copyButton = target.closest("[data-article-copy]");
    if (copyButton) {
        event.preventDefault();
        handleCopy(copyButton);
        return;
    }

    const instagramButton = target.closest("[data-author-bar-instagram]");
    if (instagramButton) {
        event.preventDefault();
        handleDeviceShare(
            instagramButton,
            "Link copied. Paste it into your Instagram post or message."
        );
        return;
    }

    const legacyShareButton = target.closest("[data-article-share]");
    if (legacyShareButton) {
        event.preventDefault();
        handleDeviceShare(
            legacyShareButton,
            "Native sharing is unavailable here. Link copied instead."
        );
    }
});
