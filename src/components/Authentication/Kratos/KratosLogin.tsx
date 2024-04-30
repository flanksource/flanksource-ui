import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import FullPageSkeletonLoader from "../../../ui/SkeletonLoader/FullPageSkeletonLoader";
import { toastError } from "../../Toast/toast";
import { Flow, HandleError } from "../../ory";
import { SetUriFlow } from "../../ory/helpers";
import ory from "../../ory/sdk";

const Login: NextPage = () => {
  const [returnTo, setReturnTo] = useState<string | undefined>();
  const [flow, setFlow] = useState<LoginFlow>();

  // when login is successful, we set this to true and then show an animation as
  // the user is redirected to the return_to URL.
  const [loginSucccess, setLoginSuccess] = useState<boolean>(false);

  const { query, push, isReady } = useRouter();

  const returnToFromQuery = (query.return_to as string) || "";
  const flowId = String(query.flow || "");

  // If we have a return_to query parameter, we want to redirect the user to
  // that URL after a successful login. if set, and return_to is empty, we don't
  // overwrite it. This is a workaround for using both nextjs and react-router.
  useEffect(() => {
    if (returnToFromQuery && !returnTo) {
      setReturnTo(returnToFromQuery);
    }
  }, [returnTo, returnToFromQuery]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          SetUriFlow(Router, data.id, returnTo);
        })
        .catch(handleError),
    [handleError]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, returnTo ?? "/");
      });
      return;
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo ?? "/");
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
        console.log("Login successful");
        setLoginSuccess(true);
        push(returnTo || "/");
      })
      .catch((error) => {
        console.error(error);
        toastError((error as AxiosError).message);
      });

  if (loginSucccess) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <div className="w-96">
      <Toaster position="top-right" reverseOrder={false} />
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
          <Flow onSubmit={submitFlow} flow={flow} isLoginFlow />
        </div>
        <div className="mt-2">
          <Link href="/recovery" passHref>
            <div className="font-medium link">Reset password</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
