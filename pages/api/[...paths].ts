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
    const org = await clerkClient.organizations.getOrganization({
      organizationId: user.sessionClaims?.org_id!
    });
    return org?.publicMetadata?.backend_url;
  }
  return process.env.BACKEND_URL;
}

function getPathRewrites() {
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
    pathRewrite: getPathRewrites()
  });
}
