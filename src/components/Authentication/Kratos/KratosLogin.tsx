import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Flow, useCreateLogoutHandler } from "../../ory";
import { handleFlowError, handleGetFlowError } from "../../ory/errors";
import ory from "../../ory/sdk";

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>();

  // Get ?flow=... from the URL
  const router = useRouter();
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal
  } = router.query;

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = useCreateLogoutHandler([aal, refresh]);

  useEffect(() => {
    const fetchFlow = async () => {
      if (!router.isReady || flow) {
        return;
      }

      if (flowId) {
        try {
          const { data } = await ory.getLoginFlow({ id: String(flowId) });
          setFlow(data);
        } catch (err: any) {
          await handleGetFlowError(router, "login", setFlow)(err);
        }
        return;
      }

      try {
        const { data } = await ory.createBrowserLoginFlow({
          returnTo: returnTo ? String(returnTo) : undefined,
          refresh: Boolean(refresh),
          aal: aal ? String(aal) : undefined
        });
        setFlow(data);
      } catch (err: any) {
        await handleFlowError(router, "login", setFlow)(err);
      }
    };

    fetchFlow();
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow]);

  const onSubmit = async (values: UpdateLoginFlowBody) => {
    try {
      await router.push(`/login?flow=${flow?.id}`, undefined, {
        shallow: true
      });
      await ory.updateLoginFlow({
        flow: flow?.id!,
        updateLoginFlowBody: values
      });
      window.location.href = flow?.return_to ?? "/";
    } catch (err: any) {
      console.error(err);
      await handleFlowError(router, "login", setFlow)(err);
      if (err.response?.status === 400) {
        setFlow((err.response as any).data);
      } else {
        throw err;
      }
    }
  };

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
          <Flow onSubmit={onSubmit} flow={flow} />
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
