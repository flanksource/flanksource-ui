import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false
  }
};

async function getTargetURL(req: NextApiRequest) {
  if (process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true") {
    const { clerkClient, getAuth } = await import("@clerk/nextjs/server");
    const user = getAuth(req);
    const orgId = user.sessionClaims?.org_id;

    if (!orgId) {
      return process.env.BACKEND_URL;
    }

    try {
      const org = await clerkClient.organizations.getOrganization({
        organizationId: orgId
      });
      return org?.publicMetadata?.backend_url || process.env.BACKEND_URL;
    } catch {
      return process.env.BACKEND_URL;
    }
  }
  return process.env.BACKEND_URL;
}

function getPathRewrites(req: NextApiRequest) {
  if (/^\/api\/plugins\/[^/]+\/assets(?:\/|$)/.test(req.url ?? "")) {
    return [
      {
        patternStr: "^/api/plugins/([^/]+)/assets",
        replaceStr: "/api/plugins/$1/ui/assets"
      }
    ];
  }

  if (req.url?.startsWith("/api/plugins")) {
    return [{ patternStr: "^/api/plugins", replaceStr: "/api/plugins" }];
  }

  return [{ patternStr: "^/api", replaceStr: "/" }];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const target = await getTargetURL(req);

  if (!target) {
    return res.status(500).json({ error: "Missing target" });
  }

  return httpProxyMiddleware(req, res, {
    target: target!,
    xfwd: true,
    pathRewrite: getPathRewrites(req)
  });
}
