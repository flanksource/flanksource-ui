import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

const API_URL = process.env.BACKEND_URL;
const isCanary = process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
const env = process.env.ENV;
const isClerkAuth = process.env.NEXT_PUBLIC_AUTH_IS_CLERK;
const clerkDomain = process.env.NEXT_PUBLIC_CLERK_BACKEND_DOMAIN;

const canaryPrefix = isCanary ? "" : "/canary";

export const config = {
  api: {
    bodyParser: false
  }
};

function getTargetURL(req: NextApiRequest) {
  if (isClerkAuth) {
    const user = getAuth(req);
    const organizationSlug = user.sessionClaims?.org_slug;
    const target = `https://${organizationSlug}.${clerkDomain}/`;
    return target;
  }
  return API_URL;
}

const clerkBackendPathRewrites = [
  {
    patternStr: "^/api",
    replaceStr: "/"
  }
];

const kratosBackendPathRewrites = ["localhost", "netlify"].includes(env!)
  ? [
      {
        patternStr: "^/api",
        replaceStr: "/api"
      }
    ]
  : [
      {
        patternStr: "^/api/canary",
        replaceStr: `${canaryPrefix}`
      },
      {
        patternStr: "^/api/.ory",
        replaceStr: "/kratos/"
      },
      {
        patternStr: "^/api",
        replaceStr: "/"
      }
    ];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = getTargetURL(req);

  if (!target) {
    return res.status(500).json({ error: "Missing target" });
  }

  console.log(`Proxying to ${target}`);

  return httpProxyMiddleware(req, res, {
    target: target!,
    pathRewrite: [
      ...(isClerkAuth ? clerkBackendPathRewrites : kratosBackendPathRewrites)
    ]
  });
}
