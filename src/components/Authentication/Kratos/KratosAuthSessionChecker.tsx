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
        const url = window.location.pathname;
        switch ((err as AxiosError).response?.status) {
          case 403:
            // This is a legacy error code thrown. See code 422 for
            // more details.
            push(`/login?aal=aal2&return_to=${url}`);
            return;
            break;
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            push(`/login?aal=aal2&return_to=${url}`);
            return;
            break;
          case 401:
            push(`/login?return_to=${url}`);
            return;
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

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
