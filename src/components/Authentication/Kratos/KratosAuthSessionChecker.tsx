import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { FeatureFlagsContextProvider } from "@flanksource-ui/context/FeatureFlagsContext";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isAuthEnabled } from "../../../context/Environment";

type KratosAuthSessionCheckerProps = {
  children: React.ReactNode;
};

/**
 * Validates the Ory session in the background without blocking rendering.
 *
 * The ory.toSession() call only matters for its HTTP status code (redirect to
 * login on 401/403/422) — the response body is never used. The actual user
 * identity, roles, and permissions come from /api/auth/whoami (via
 * KratosAuthContextProvider). So there's no reason to gate the entire app on
 * this call completing.
 */
export default function KratosAuthSessionChecker({
  children
}: KratosAuthSessionCheckerProps) {
  const [isBrowserEnv, setIsBrowserEnv] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    setIsBrowserEnv(true);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (!isAuthEnabled()) {
        return;
      }

      try {
        await ory.toSession();
      } catch (err) {
        const url = encodeURIComponent(window.location.href);
        switch ((err as AxiosError).response?.status) {
          case 403:
          case 422:
            push(`/login?aal=aal2&return_to=${url}`);
            break;
          case 401:
            push(`/login?return_to=${url}`);
            break;
          default:
            throw err;
        }
      }
    };

    checkSession();
  }, [push]);

  // Guard against SSR — BrowserRouter in children requires `document`.
  // The old `!session` check was accidentally preventing this; now we
  // gate on client mount explicitly instead of on the ory response.
  if (!isBrowserEnv) {
    return null;
  }

  return <FeatureFlagsContextProvider>{children}</FeatureFlagsContextProvider>;
}
