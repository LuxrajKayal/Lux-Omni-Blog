/*
 * Lux Omni Blog — article share and copy controls
 *
 * Uses the native Web Share API where available. The copy action uses the
 * Clipboard API when available and a textarea fallback otherwise.
 */

const shareButton = document.querySelector("[data-article-share]");
const copyButton = document.querySelector("[data-article-copy]");
const statusElement = document.querySelector("[data-article-share-status]");

function articleShareData() {
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

function setShareStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
}

async function copyArticleUrl() {
    const url = window.location.href;

    if (navigator.clipboard?.writeText) {
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

copyButton?.addEventListener("click", async () => {
    try {
        await copyArticleUrl();
        setShareStatus("Link copied.");
    } catch {
        setShareStatus("Copy failed. You can copy the address from your browser.");
    }
});

shareButton?.addEventListener("click", async () => {
    const shareData = articleShareData();

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error?.name !== "AbortError") {
                setShareStatus("Sharing could not be completed.");
            }
        }
        return;
    }

    try {
        await copyArticleUrl();
        setShareStatus("Native sharing is unavailable here. Link copied instead.");
    } catch {
        setShareStatus("Sharing is unavailable in this browser.");
    }
});
