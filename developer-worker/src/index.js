const DEFAULT_SETTINGS = {
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
};

const SETTINGS_ASSIGNMENT = "window.LUX_OMNI_SITE_CONFIG = Object.freeze(";

function response(body, status, corsHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...corsHeaders
    }
  });
}

function allowedOrigins(env) {
  return String(env.DASHBOARD_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsFor(request, env) {
  const origin = request.headers.get("Origin");
  const permitted = allowedOrigins(env);
  if (origin && !permitted.includes(origin)) return { denied: true, headers: {} };
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin"
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return { denied: false, headers };
}

function bearerToken(request) {
  const value = request.headers.get("Authorization") || "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

async function authorize(request, env) {
  const token = bearerToken(request);
  const supabaseUrl = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const publishableKey = String(env.SUPABASE_PUBLISHABLE_KEY || "");
  const emails = String(env.AUTHORIZED_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!token || !supabaseUrl || !publishableKey || emails.length === 0) return null;

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });
  if (!userResponse.ok) return null;
  const user = await userResponse.json();
  if (!user?.email || !emails.includes(String(user.email).toLowerCase())) return null;
  return { id: user.id, email: String(user.email).toLowerCase() };
}

function normalizeSettings(input) {
  if (!input || typeof input !== "object" || !input.topbar || typeof input.topbar !== "object") {
    throw new Error("The settings payload is missing the Topbar values.");
  }
  const slogan = typeof input.topbar.slogan === "string" ? input.topbar.slogan.trim() : "";
  if (!slogan || slogan.length > 120) throw new Error("The slogan must contain between 1 and 120 characters.");

  const inputLinks = input.topbar.socialLinks;
  if (!inputLinks || typeof inputLinks !== "object") throw new Error("Social links are missing.");
  const socialLinks = {};
  for (const platform of ["facebook", "instagram", "x", "youtube", "github"]) {
    const raw = typeof inputLinks[platform] === "string" ? inputLinks[platform].trim() : "";
    if (raw) {
      let parsed;
      try { parsed = new URL(raw); } catch { throw new Error(`The ${platform} link is not a valid URL.`); }
      if (parsed.protocol !== "https:" || !parsed.hostname) throw new Error(`The ${platform} link must use HTTPS.`);
    }
    socialLinks[platform] = raw;
  }
  return { schemaVersion: 1, topbar: { slogan, socialLinks } };
}

function decodeBase64Utf8(content) {
  const binary = atob(String(content || "").replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Utf8(content) {
  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function readSettingsFile(content) {
  const text = decodeBase64Utf8(content);
  if (!text.startsWith(SETTINGS_ASSIGNMENT)) throw new Error("The existing settings file has an unexpected format.");
  const jsonText = text.slice(SETTINGS_ASSIGNMENT.length).replace(/\);?\s*$/, "");
  const parsed = JSON.parse(jsonText);
  return normalizeSettings(parsed);
}

function makeSettingsFile(settings) {
  return [
    "/* Managed by Lux Omni Developer Dashboard. Do not add secrets to this file. */",
    `window.LUX_OMNI_SITE_CONFIG = Object.freeze(${JSON.stringify(settings, null, 2)});`,
    ""
  ].join("\n");
}

function githubHeaders(env) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_TOKEN || ""}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "lux-omni-developer-worker"
  };
}

function settingsFileUrl(env) {
  const owner = String(env.GITHUB_OWNER || "");
  const repo = String(env.GITHUB_REPO || "");
  const path = String(env.SITE_SETTINGS_PATH || "");
  const branch = String(env.GITHUB_BRANCH || "main");
  if (!owner || !repo || !path || !env.GITHUB_TOKEN) throw new Error("The Worker GitHub settings are incomplete.");
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
}

async function getStoredSettings(env) {
  const url = settingsFileUrl(env);
  const result = await fetch(url, { headers: githubHeaders(env), cache: "no-store" });
  if (result.status === 404) return { settings: DEFAULT_SETTINGS, sha: null };
  if (!result.ok) throw new Error(`GitHub could not read the settings file (HTTP ${result.status}).`);
  const file = await result.json();
  return { settings: readSettingsFile(file.content), sha: file.sha };
}

async function saveStoredSettings(settings, env) {
  const url = settingsFileUrl(env);
  const current = await fetch(url, { headers: githubHeaders(env), cache: "no-store" });
  let currentSha = null;
  if (current.ok) {
    const file = await current.json();
    currentSha = file.sha;
  } else if (current.status !== 404) {
    throw new Error(`GitHub could not check the current settings file (HTTP ${current.status}).`);
  }

  const branch = String(env.GITHUB_BRANCH || "main");
  const content = makeSettingsFile(settings);
  const payload = {
    message: "Update Topbar settings from developer dashboard",
    content: encodeBase64Utf8(content),
    branch
  };
  if (currentSha) payload.sha = currentSha;

  const saved = await fetch(url.split("?")[0], {
    method: "PUT",
    headers: { ...githubHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await saved.json().catch(() => ({}));
  if (!saved.ok) {
    throw new Error(body.message || `GitHub rejected the settings commit (HTTP ${saved.status}).`);
  }
  return {
    commit: body.commit?.sha || "",
    commitUrl: body.commit?.html_url || ""
  };
}

export default {
  async fetch(request, env) {
    const cors = corsFor(request, env);
    if (cors.denied) return response({ error: "This origin is not allowed." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors.headers });

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return response({ ok: true, service: "lux-omni-developer-api" }, 200, cors.headers);
    }

    const supported =
      (request.method === "GET" && ["/api/auth/check", "/api/topbar/settings"].includes(url.pathname)) ||
      (request.method === "POST" && url.pathname === "/api/topbar/publish");
    if (!supported) return response({ error: "Not found." }, 404, cors.headers);

    let user;
    try {
      user = await authorize(request, env);
    } catch {
      return response({ error: "Authorization could not be verified. Try again." }, 502, cors.headers);
    }
    if (!user) return response({ error: "Sign in with an authorized account to continue." }, 403, cors.headers);

    if (request.method === "GET" && url.pathname === "/api/auth/check") {
      return response({ authorized: true, email: user.email }, 200, cors.headers);
    }

    if (request.method === "GET" && url.pathname === "/api/topbar/settings") {
      try {
        const result = await getStoredSettings(env);
        return response({ settings: result.settings, source: result.sha ? "github" : "defaults" }, 200, cors.headers);
      } catch (error) {
        return response({ error: error.message || "Could not load the saved settings." }, 502, cors.headers);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/topbar/publish") {
      if (String(env.PUBLIC_SETTINGS_INTEGRATION_ENABLED || "false").toLowerCase() !== "true") {
        return response({
          error: "Publishing is paused until the public site is approved and connected to read this settings file. No commit was made."
        }, 409, cors.headers);
      }
      let body;
      try { body = await request.json(); } catch { return response({ error: "Request body must be valid JSON." }, 400, cors.headers); }
      let settings;
      try { settings = normalizeSettings(body.settings); } catch (error) {
        return response({ error: error.message || "Invalid settings." }, 400, cors.headers);
      }
      try {
        const result = await saveStoredSettings(settings, env);
        return response({
          ok: true,
          message: "Topbar settings were committed to GitHub. Cloudflare Pages will deploy the commit.",
          commit: result.commit,
          commitUrl: result.commitUrl
        }, 200, cors.headers);
      } catch (error) {
        return response({ error: error.message || "The settings could not be published." }, 502, cors.headers);
      }
    }

    return response({ error: "Not found." }, 404, cors.headers);
  }
};
