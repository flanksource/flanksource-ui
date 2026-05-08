import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_CALLBACK_PATH = "/oidc/clerk/callback";
const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

function isValidBackendOrigin(url: URL) {
  return (
    url.protocol === "https:" ||
    (url.protocol === "http:" && LOCALHOST_HOSTNAMES.has(url.hostname))
  );
}

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

  const backendResp = await fetch(callbackURL.toString(), {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ clerk_session_token: token })
  });

  const location = backendResp.headers.get("location");
  if (location && backendResp.status >= 300 && backendResp.status < 400) {
    return res.redirect(backendResp.status, location);
  }

  const body = await backendResp.text();
  return res.status(backendResp.status).send(body);
}
