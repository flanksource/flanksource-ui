import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, DependencyList } from "react";
import { IsAuthEnabled } from "../../context/Environment";

import ory from "./sdk";

// Returns a function which will log the user out
export function useCreateLogoutHandler(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>("");
  const router = useRouter();

  if (!IsAuthEnabled()) {
    return () => {};
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    ory
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, deps);

  return () => {
    if (logoutToken) {
      ory
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => router.push("/login"))
        .then(() => router.reload());
    }
  };
}
