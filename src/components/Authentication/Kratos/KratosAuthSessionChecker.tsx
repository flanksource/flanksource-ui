import { Session } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isAuthEnabled } from "../../../context/Environment";
import ory from "../../ory/sdk";

type KratosAuthSessionCheckerProps = {
  children: React.ReactNode;
};

export default function KratosAuthSessionChecker({
  children
}: KratosAuthSessionCheckerProps) {
  const [session, setSession] = useState<Session | undefined>();

  const { push, pathname } = useRouter();

  useEffect(() => {
    if (!isAuthEnabled()) {
      return;
    }

    ory
      .toSession()
      .then(({ data }) => {
        setSession(data);
      })
      .catch((err: AxiosError) => {
        const url = `${pathname}`;
        switch (err.response?.status) {
          case 403:
            // This is a legacy error code thrown. See code 422 for
            // more details.
            push(`/login?aal=aal2&return_to=${url}`);
            return;
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            push(`/login?aal=aal2&return_to=${url}`);
            return;
          case 401:
            push(`/login?return_to=${url}`);
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, [pathname, push]);

  if (isAuthEnabled() && !session) {
    return null;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
