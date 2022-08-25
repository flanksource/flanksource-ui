// https://github.com/ory/docs/blob/master/code-examples/protect-page-login/nextjs/pages/api/.ory/%5B...paths%5D.ts

// @ory/integrations offers a package for integrating with Next.js.
import { config, createApiHandler } from "@ory/integrations/next-edge";
// We need to export the config.
export { config };

export default createApiHandler({
  fallbackToPlayground: false,
  dontUseTldForCookieDomain: true
});
