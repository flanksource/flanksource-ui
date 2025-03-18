import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { FeatureFlagsContextProvider } from "@flanksource-ui/context/FeatureFlagsContext";
import { Session } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isAuthEnabled } from "../../../context/Environment";

type KratosAuthSessionCheckerProps = {
  children: React.ReactNode;
};

export default function KratosAuthSessionChecker({
  children
}: KratosAuthSessionCheckerProps) {
  const [session, setSession] = useState<Session | undefined>();

  const { push } = useRouter();

  useEffect(() => {
    const getSession = async () => {
      if (!isAuthEnabled()) {
        return;
      }

      try {
        const { data } = await ory.toSession();
        setSession(data);
      } catch (err) {
        const url = encodeURIComponent(window.location.href);
        switch ((err as AxiosError).response?.status) {
          case 403:
            push(`/login?aal=aal2&return_to=${url}`);
            break;
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

    getSession();
  }, [push]);

  if (isAuthEnabled() && !session) {
    return null;
  }

  return <FeatureFlagsContextProvider>{children}</FeatureFlagsContextProvider>;
}
