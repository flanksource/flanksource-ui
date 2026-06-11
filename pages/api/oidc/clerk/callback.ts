import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Clerk OIDC relay
 *
 * Mission Control is the OIDC provider, but Clerk browser login happens on this
 * shared frontend. After Clerk login, pages/oidc/clerk/callback.tsx posts the
 * auth_request_id here. This route verifies the Clerk session, derives the
 * tenant backend from Clerk org metadata, mints a Clerk Backend token, and
 * responds with an auto-submitting form so the browser POSTs the token to
 * Mission Control's /oidc/clerk/callback endpoint.
 *
 * The browser-mediated POST is load-bearing: Mission Control binds the OIDC
 * transaction to a __Host- cookie scoped to the tenant backend origin (set
 * when /authorize created the auth request). Only the browser holds that
 * cookie, and only a request the browser itself makes to the tenant backend
 * carries it — a server-side fetch from this route can never present it and
 * always fails with "invalid oidc transaction". The form POST is same-site
 * (both hosts are *.flanksource.com), so the SameSite=Lax cookie is attached.
 *
 * Security notes:
 * - This is intentionally not a blind proxy.
 * - The backend URL comes from Clerk org metadata, not from the browser, so
 *   the browser cannot choose where a Clerk Backend token is sent.
 */
const BACKEND_CALLBACK_PATH = "/oidc/clerk/callback";
const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

function isValidBackendOrigin(url: URL) {
  return (
    url.protocol === "https:" ||
    (url.protocol === "http:" && LOCALHOST_HOSTNAMES.has(url.hostname))
  );
}

// Build the only backend URL this relay is allowed to target. The org metadata
// supplies the tenant origin; the callback path is fixed here so the browser
// cannot choose where a Clerk Backend token is sent.
export function getBackendCallbackURL(orgBackendURL?: string) {
  if (!orgBackendURL) {
    return undefined;
  }

  try {
    const backendURL = new URL(orgBackendURL);

    if (!isValidBackendOrigin(backendURL)) {
      return undefined;
    }

    return new URL(BACKEND_CALLBACK_PATH, backendURL.origin);
  } catch {
    return undefined;
  }
}

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The interstitial page that completes the OIDC transaction from the browser,
// so the transaction cookie (host-locked to the tenant backend origin) is
// attached to the callback request.
export function buildCallbackFormHTML(
  action: string,
  clerkSessionToken: string
) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Completing login…</title>
  </head>
  <body onload="document.forms[0].submit()">
    <p>Completing login…</p>
    <form method="post" action="${escapeHTML(action)}">
      <input type="hidden" name="clerk_session_token" value="${escapeHTML(clerkSessionToken)}" />
      <noscript><button type="submit">Continue</button></noscript>
    </form>
  </body>
</html>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const authRequestID = String(req.body?.auth_request_id || "");

  if (!authRequestID) {
    return res.status(400).json({ error: "missing auth_request_id" });
  }

  const { clerkClient, getAuth } = await import("@clerk/nextjs/server");
  const auth = getAuth(req);

  if (!auth.userId || !auth.orgId) {
    return res.status(401).json({ error: "not signed in" });
  }

  const org = await clerkClient.organizations.getOrganization({
    organizationId: auth.orgId
  });
  const orgBackendURL = org.publicMetadata?.backend_url as string | undefined;

  const callbackURL = getBackendCallbackURL(orgBackendURL);

  if (!callbackURL) {
    return res.status(400).json({ error: "invalid backend callback" });
  }

  const token = await auth.getToken({ template: "Backend" });
  if (!token) {
    return res.status(401).json({ error: "unable to get session token" });
  }

  callbackURL.searchParams.set("auth_request_id", authRequestID);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res
    .status(200)
    .send(buildCallbackFormHTML(callbackURL.toString(), token));
}
