(() => {
  "use strict";

  const config = window.LUX_OMNI_DEVELOPER_CONFIG || {};
  const DEFAULT_SETTINGS = Object.freeze({
    schemaVersion: 1,
    topbar: {
      slogan: "Hello World!",
      socialLinks: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        x: "https://x.com",
        youtube: "https://youtube.com",
        github: "https://github.com"
      }
    }
  });
  const FIELD_IDS = {
    slogan: "topbar-slogan",
    facebook: "social-facebook",
    instagram: "social-instagram",
    x: "social-x",
    youtube: "social-youtube",
    github: "social-github"
  };

  const byId = (id) => document.getElementById(id);
  const setupScreen = byId("setup-screen");
  const authScreen = byId("auth-screen");
  const appShell = byId("app-shell");
  const previewBanner = byId("preview-banner");
  const modeBadge = byId("mode-badge");
  const modeLabel = byId("mode-label");
  const userLabel = byId("user-label");
  const loginForm = byId("login-form");
  const loginMessage = byId("login-message");
  const loginSubmit = byId("login-submit");
  const signOutButton = byId("sign-out");
  const topbarForm = byId("topbar-form");
  const saveDraftButton = byId("save-draft");
  const pushButton = byId("push-settings");
  const saveStatus = byId("save-status");
  const saveStatusDot = document.querySelector(".save-feedback__dot");
  const sloganCount = byId("slogan-count");

  let supabaseClient = null;
  let activeSession = null;
  let draftSettings = structuredClone(DEFAULT_SETTINGS);
  let busy = false;
  let previewMode = false;

  function show(element) {
    element.hidden = false;
  }

  function hide(element) {
    element.hidden = true;
  }

  function setStatus(message, state = "default") {
    saveStatus.textContent = message;
    saveStatusDot.classList.toggle("is-success", state === "success");
  }

  function setMode(label, connected = false) {
    modeLabel.textContent = label;
    modeBadge.classList.toggle("is-connected", connected);
  }

  function setBusy(value) {
    busy = value;
    saveDraftButton.disabled = value;
    pushButton.disabled = value || previewMode || !activeSession;
    loginSubmit.disabled = value;
    loginSubmit.textContent = value ? "Signing in…" : "Sign in →";
  }

  function hasSomeConfig() {
    return Boolean(config.supabaseUrl || config.supabasePublishableKey || config.apiBaseUrl);
  }

  function isFullyConfigured() {
    return Boolean(
      typeof config.supabaseUrl === "string" &&
      config.supabaseUrl.startsWith("https://") &&
      typeof config.supabasePublishableKey === "string" &&
      config.supabasePublishableKey.trim() &&
      typeof config.apiBaseUrl === "string" &&
      config.apiBaseUrl.startsWith("https://")
    );
  }

  function currentSettings() {
    const slogan = byId(FIELD_IDS.slogan).value.trim();
    const socialLinks = {};
    for (const platform of ["facebook", "instagram", "x", "youtube", "github"]) {
      socialLinks[platform] = byId(FIELD_IDS[platform]).value.trim();
    }
    return { schemaVersion: 1, topbar: { slogan, socialLinks } };
  }

  function setForm(settings) {
    const topbar = settings?.topbar || DEFAULT_SETTINGS.topbar;
    byId(FIELD_IDS.slogan).value = typeof topbar.slogan === "string" ? topbar.slogan : DEFAULT_SETTINGS.topbar.slogan;
    const socialLinks = topbar.socialLinks || DEFAULT_SETTINGS.topbar.socialLinks;
    for (const platform of ["facebook", "instagram", "x", "youtube", "github"]) {
      const value = socialLinks[platform];
      byId(FIELD_IDS[platform]).value = typeof value === "string" ? value : "";
    }
    updateSloganCount();
    clearFieldErrors();
  }

  function updateSloganCount() {
    const length = byId(FIELD_IDS.slogan).value.length;
    sloganCount.textContent = `${length} / 120`;
  }

  function clearFieldErrors() {
    topbarForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  }

  function validateSettings(settings, report = true) {
    clearFieldErrors();
    let valid = true;
    const sloganInput = byId(FIELD_IDS.slogan);
    if (!settings.topbar.slogan || settings.topbar.slogan.length > 120) {
      valid = false;
      sloganInput.setAttribute("aria-invalid", "true");
      if (report) sloganInput.focus();
    }

    for (const platform of ["facebook", "instagram", "x", "youtube", "github"]) {
      const input = byId(FIELD_IDS[platform]);
      const value = settings.topbar.socialLinks[platform];
      if (!value) continue;
      try {
        const url = new URL(value);
        if (url.protocol !== "https:" || !url.hostname) throw new Error("Only HTTPS URLs are allowed.");
      } catch {
        valid = false;
        input.setAttribute("aria-invalid", "true");
        if (report) input.setCustomValidity("Enter a complete HTTPS URL, or leave this field blank.");
        else input.setCustomValidity("");
      }
    }

    if (valid) {
      topbarForm.querySelectorAll("input").forEach((input) => input.setCustomValidity(""));
    } else if (report) {
      topbarForm.reportValidity();
      setStatus("Check the highlighted fields. No settings were saved.", "default");
    }
    return valid;
  }

  async function apiRequest(path, options = {}) {
    if (!activeSession?.access_token) throw new Error("Your session is no longer available. Please sign in again.");
    const response = await fetch(`${config.apiBaseUrl.replace(/\/+$/, "")}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${activeSession.access_token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      },
      cache: "no-store"
    });
    let body = {};
    try { body = await response.json(); } catch { /* Keep the HTTP status for the message below. */ }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await returnToLogin("Your session is invalid or your account is not authorized.");
      }
      throw new Error(body.error || body.message || `Request failed (${response.status}).`);
    }
    return body;
  }

  async function returnToLogin(message = "") {
    const client = supabaseClient;
    activeSession = null;
    hide(appShell);
    show(authScreen);
    hide(setupScreen);
    loginMessage.textContent = message;
    userLabel.textContent = "";
    hide(userLabel);
    hide(signOutButton);
    setMode("Signed out", false);
    if (client) {
      try { await client.auth.signOut({ scope: "local" }); } catch { /* UI is locked even if sign-out cannot reach the server. */ }
    }
  }

  async function openAuthorizedWorkspace(session) {
    activeSession = session;
    try {
      const result = await apiRequest("/api/auth/check");
      if (result.authorized !== true) throw new Error("Your account is not authorized to manage this site.");
      hide(authScreen);
      hide(setupScreen);
      show(appShell);
      hide(previewBanner);
      userLabel.textContent = result.email || session.user?.email || "Authorized user";
      show(userLabel);
      show(signOutButton);
      setMode("Authorized", true);
      pushButton.disabled = false;
      setStatus("Loading the saved Topbar settings…");
      const payload = await apiRequest("/api/topbar/settings");
      setForm(payload.settings || DEFAULT_SETTINGS);
      draftSettings = currentSettings();
      setStatus("Saved settings loaded. Edit, save a draft, or push when publishing is enabled.");
    } catch (error) {
      activeSession = null;
      hide(appShell);
      show(authScreen);
      loginMessage.textContent = error.message || "Could not verify authorization.";
      setMode("Access denied", false);
      pushButton.disabled = true;
    }
  }

  function showPreviewWorkspace() {
    previewMode = true;
    activeSession = null;
    show(appShell);
    hide(authScreen);
    hide(setupScreen);
    show(previewBanner);
    setMode("Preview only", false);
    pushButton.disabled = true;
    userLabel.textContent = "Not connected";
    hide(userLabel);
    hide(signOutButton);
    setForm(DEFAULT_SETTINGS);
    draftSettings = structuredClone(DEFAULT_SETTINGS);
    setStatus("Preview only. Drafts stay in memory and are not published.");
  }

  function showSetupRequired() {
    hide(appShell);
    hide(authScreen);
    show(setupScreen);
    setMode("Setup required", false);
  }

  async function initializeAuthentication() {
    if (!window.supabase?.createClient) {
      showSetupRequired();
      return;
    }
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;
      loginMessage.textContent = "";
      setBusy(true);
      try {
        const formData = new FormData(loginForm);
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: String(formData.get("email") || "").trim(),
          password: String(formData.get("password") || "")
        });
        if (error) throw error;
        if (!data.session) throw new Error("Sign-in did not return a valid session.");
        await openAuthorizedWorkspace(data.session);
      } catch (error) {
        loginMessage.textContent = error.message || "Unable to sign in.";
      } finally {
        setBusy(false);
      }
    });

    signOutButton.addEventListener("click", async () => {
      setBusy(true);
      try { await supabaseClient.auth.signOut(); } finally {
        activeSession = null;
        setBusy(false);
        hide(appShell);
        show(authScreen);
        loginForm.reset();
        loginMessage.textContent = "You have signed out.";
        setMode("Signed out", false);
      }
    });

    supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        activeSession = null;
        hide(appShell);
        if (isFullyConfigured()) show(authScreen);
      }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      show(authScreen);
      loginMessage.textContent = "Could not restore your session. Please sign in.";
      return;
    }
    if (data.session) {
      await openAuthorizedWorkspace(data.session);
    } else {
      hide(appShell);
      show(authScreen);
    }
  }

  function saveDraft() {
    if (busy) return;
    const settings = currentSettings();
    if (!validateSettings(settings)) return;
    draftSettings = structuredClone(settings);
    setStatus("Draft saved in this page session only. Nothing has been committed.", "success");
  }

  async function pushSettings() {
    if (busy) return;
    if (previewMode || !activeSession) {
      setStatus("Publishing is not connected. No files were changed.");
      return;
    }
    const settings = currentSettings();
    if (!validateSettings(settings)) return;
    setBusy(true);
    setStatus("Checking authorization and publishing settings…");
    try {
      const result = await apiRequest("/api/topbar/publish", {
        method: "POST",
        body: JSON.stringify({ settings })
      });
      draftSettings = structuredClone(settings);
      setStatus(result.message || "Settings committed. Cloudflare Pages will deploy the commit.", "success");
    } catch (error) {
      setStatus(error.message || "Publishing failed. No success was reported.");
    } finally {
      setBusy(false);
      pushButton.disabled = previewMode || !activeSession;
    }
  }

  topbarForm.addEventListener("submit", (event) => event.preventDefault());
  topbarForm.addEventListener("input", (event) => {
    if (event.target.id === FIELD_IDS.slogan) updateSloganCount();
    if (event.target.matches("input")) event.target.removeAttribute("aria-invalid");
  });
  saveDraftButton.addEventListener("click", saveDraft);
  pushButton.addEventListener("click", pushSettings);

  const localPreviewRequested = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
    new URLSearchParams(window.location.search).get("preview") === "1";
  if (!hasSomeConfig() && localPreviewRequested) {
    showPreviewWorkspace();
  } else if (!isFullyConfigured()) {
    showSetupRequired();
  } else {
    initializeAuthentication().catch(() => showSetupRequired());
  }
})();
