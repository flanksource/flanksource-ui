import {
  Flow,
  handleGetFlowError as HandleError
} from "@flanksource-ui/components/Authentication/Kratos/ory";
import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import {} from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { toastError } from "../../Toast/toast";

type LoginCredentials = {
  username: string;
  password: string;
};

const KratosLogin = () => {
  const [flow, setFlow] = useState<LoginFlow>();

  // when login is successful, we set this to true and then show an animation as
  // the user is redirected to the return_to URL.
  const [loginSuccessful, setLoginSuccessful] = useState<boolean>(false);

  const router = useRouter();

  const { query, isReady, replace, push } = router;

  const searchParams = useSearchParams();

  const flowId = searchParams.get("flow") || undefined;
  const returnTo = searchParams.get("return_to") || "/";
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  const [credentials, setCredentials] = useState<
    LoginCredentials | undefined
  >();

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(query.refresh);

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(query.aal || "");

  const getFlow = useCallback(async (id: string) => {
    try {
      const { data } = await ory.getLoginFlow({ id });
      setFlow(data);
    } catch (error) {
      handleError(error as AxiosError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(router, "login", setFlow);
      return handle(error);
    },
    [router]
  );

  const createFlow = useCallback(
    async (refresh: boolean, aal: string, returnTo: string = "/") => {
      try {
        const { data } = await ory.createBrowserLoginFlow({
          refresh: refresh,
          // Check for two-factor authentication
          aal: aal,
          returnTo: returnTo
        });
        setFlow(data);
        if (flowId !== data.id) {
          const params = new URLSearchParams(searchParams);
          params.set("flow", data.id);
          replace(`${router.pathname}?${params.toString()}`);
        }
      } catch (error) {
        console.error(error);
        handleError(error as AxiosError);
      }
    },
    [flowId, handleError, replace, router.pathname, searchParams]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, String(returnTo ?? "/"));
      });
      return;
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo ?? "/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const submitFlow = useCallback(
    async (values: UpdateLoginFlowBody) => {
      try {
        await ory.updateLoginFlow({
          flow: String(flow?.id),
          updateLoginFlowBody: values
        });
        setLoginSuccessful(true);
        console.log("Login successful");
        push(String(returnTo || "/"));
      } catch (error) {
        console.error(error);
        toastError((error as AxiosError).message);
      }
    },
    [flow, push, returnTo]
  );

  useEffect(() => {
    if (username && password) {
      setCredentials({
        username: username,
        password: password
      });
    }
  }, [username, password]);

  useEffect(() => {
    if (credentials && flow) {
      const node = flow.ui.nodes.find(
        (n) =>
          n.attributes.node_type === "input" &&
          n.attributes.name === "csrf_token"
      );
      const csrf_token =
        node?.attributes.node_type === "input"
          ? node?.attributes.value
          : undefined;
      submitFlow({
        csrf_token,
        method: "password",
        password: credentials.password,
        identifier: credentials.username
      });
    }
  }, [flow, submitFlow, credentials]);

  return (
    <div className="w-96">
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <Image
          height={288}
          width={75}
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
          {loginSuccessful || credentials ? (
            <FormSkeletonLoader />
          ) : (
            <Flow onSubmit={submitFlow} flow={flow} isLoginFlow />
          )}
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

export default KratosLogin;
