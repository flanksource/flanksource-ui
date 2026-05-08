import type { NextApiRequest, NextApiResponse } from "next";

function isAllowedBackendCallback(rawURL: string, orgBackendURL?: string) {
  try {
    const url = new URL(rawURL);
    const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname);
    const isValidProtocol =
      url.protocol === "https:" || (url.protocol === "http:" && isLocalhost);

    if (url.pathname !== "/oidc/clerk/callback" || !isValidProtocol) {
      return false;
    }

    if (isLocalhost) {
      return true;
    }

    if (!orgBackendURL) {
      return false;
    }

    return url.origin === new URL(orgBackendURL).origin;
  } catch {
    return false;
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
  const backendCallback = String(req.body?.backend_callback || "");

  if (!authRequestID || !backendCallback) {
    return res.status(400).json({ error: "missing callback parameters" });
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

  if (!isAllowedBackendCallback(backendCallback, orgBackendURL)) {
    return res.status(400).json({ error: "invalid backend callback" });
  }

  const token = await auth.getToken({ template: "Backend" });
  if (!token) {
    return res.status(401).json({ error: "unable to get session token" });
  }

  const callbackURL = new URL(backendCallback);
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
