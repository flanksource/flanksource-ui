import { createHash } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Clerk OIDC relay
 *
 * Mission Control is the OIDC provider, but Clerk browser login happens on this
 * shared frontend. After Clerk login, pages/oidc/clerk/callback.tsx posts the
 * auth_request_id here. This route verifies the Clerk session, derives the
 * tenant backend from Clerk org metadata, mints a Clerk Backend token, and POSTs
 * it to Mission Control's /oidc/clerk/callback endpoint.
 *
 * Security notes:
 * - This is intentionally not a blind proxy.
 * - The backend URL comes from Clerk org metadata, not from the browser.
 * - Mission Control binds auth_request_id to a short-lived transaction cookie.
 *   Because the backend call below is a server-side fetch, browser cookies are
 *   not forwarded automatically. We forward only the matching OIDC transaction
 *   cookie and never pass through Clerk/session cookies.
 */
const BACKEND_CALLBACK_PATH = "/oidc/clerk/callback";
const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);
const OIDC_TRANSACTION_COOKIE_PREFIXES = ["__Host-mc_oidc_tx_", "mc_oidc_tx_"];

function isValidBackendOrigin(url: URL) {
  return (
    url.protocol === "https:" ||
    (url.protocol === "http:" && LOCALHOST_HOSTNAMES.has(url.hostname))
  );
}

// Build the only backend URL this relay is allowed to call. The org metadata
// supplies the tenant origin; the callback path is fixed here so the browser
// cannot choose where a Clerk Backend token is sent.
function getBackendCallbackURL(orgBackendURL?: string) {
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

// Keep this in sync with mission-control/auth/oidc/transaction_cookie.go.
// Mission Control hashes the auth request ID into the cookie name so multiple
// concurrent OIDC login transactions can coexist in the same browser.
function oidcTransactionCookieSuffix(authRequestID: string) {
  return createHash("sha256")
    .update(authRequestID)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 22);
}

// Convert the incoming browser Cookie header into the minimal Cookie header
// needed by Mission Control. Both prefixes are accepted because Mission Control
// uses __Host- for HTTPS issuers and the plain prefix for local HTTP issuers.
// All other cookies, including Clerk session cookies, are intentionally dropped.
export function getOIDCTransactionCookieHeader(
  cookieHeader: string | undefined,
  authRequestID: string
) {
  if (!cookieHeader || !authRequestID) {
    return undefined;
  }

  const suffix = oidcTransactionCookieSuffix(authRequestID);
  const allowedNames = new Set(
    OIDC_TRANSACTION_COOKIE_PREFIXES.map((prefix) => `${prefix}${suffix}`)
  );

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => {
      const separator = cookie.indexOf("=");
      if (separator <= 0) {
        return false;
      }

      return allowedNames.has(cookie.slice(0, separator));
    });

  return cookies.length > 0 ? cookies.join("; ") : undefined;
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

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  // This is a server-side fetch, so browser cookies are not sent by default.
  // Forward only the OIDC transaction cookie required for Mission Control's
  // login-CSRF protection; never forward req.headers.cookie wholesale.
  const oidcTransactionCookie = getOIDCTransactionCookieHeader(
    req.headers.cookie,
    authRequestID
  );
  if (oidcTransactionCookie) {
    headers.Cookie = oidcTransactionCookie;
  }

  const backendResp = await fetch(callbackURL.toString(), {
    method: "POST",
    redirect: "manual",
    headers,
    body: new URLSearchParams({ clerk_session_token: token })
  });

  const location = backendResp.headers.get("location");
  if (location && backendResp.status >= 300 && backendResp.status < 400) {
    return res.redirect(backendResp.status, location);
  }

  const body = await backendResp.text();
  return res.status(backendResp.status).send(body);
}
