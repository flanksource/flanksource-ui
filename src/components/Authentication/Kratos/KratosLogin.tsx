import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Flow, HandleError, useCreateLogoutHandler } from "../../ory";
import { SetUriFlow } from "../../ory/helpers";
import ory from "../../ory/sdk";

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>();

  const { query, push, isReady } = useRouter();

  const returnTo = String(query.return_to || "");
  console.log("Return to: " + returnTo);
  const flowId = String(query.flow || "");

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(query.refresh);

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(query.aal || "");

  const getFlow = useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    []
  );

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/login", true);
      return handle(error);
    },
    [getFlow]
  );

  const createFlow = useCallback(
    (refresh: boolean, aal: string, returnTo: string) =>
      ory
        .createBrowserLoginFlow({
          refresh: refresh,
          // Check for two-factor authentication
          aal: aal,
          returnTo: returnTo
        })
        .then(({ data }) => {
          setFlow(data);
          SetUriFlow(Router, data.id);
        })
        .catch(handleError),
    [handleError]
  );

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = useCreateLogoutHandler([aal, refresh]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, returnTo);
      });
      return;
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const submitFlow = (values: UpdateLoginFlowBody) =>
    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        push(returnTo || "/");
      });

  return (
    <div className="w-96">
      <div>
        <img
          alt="Mission Control"
          src="/images/logo.svg"
          className="p-2 h-auto m-auto rounded-8px w-72"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action";
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication";
            }
            return "Sign In to your account";
          })()}
        </h2>
        <div className="mt-8 bg-white pt-4 pb-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Flow onSubmit={submitFlow} flow={flow} />
        </div>
        {aal || refresh ? (
          <div>
            <div data-testid="logout-link" onClick={onLogout}>
              Log out
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Link href="/recovery" passHref>
              <div className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                Reset password
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
