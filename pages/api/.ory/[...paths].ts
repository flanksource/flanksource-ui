// @ory/integrations offers a package for integrating with Next.js in development. It is not needed in production.
// @ory/integrations works in a similar way as ory tunnel, read more about it what it does:
// https://www.ory.sh/docs/guides/cli/proxy-and-tunnel
import { config, createApiHandler } from "@ory/integrations/next-edge";

// We need to export the config.
export { config };

// And create the Ory Network API "bridge".
export default createApiHandler({
  fallbackToPlayground: true,
  dontUseTldForCookieDomain: true,
  // we require this since we are proxying the Ory requests through nextjs
  // Ory needs to know about our host to generate the correct urls for redirecting back between flows
  // For example between Login MFA and Settings
  forwardAdditionalHeaders: ["x-forwarded-host"]
});
