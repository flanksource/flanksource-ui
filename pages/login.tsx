import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody
} from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "../src/components";
import { Head } from "../src/components/Head/Head";

import { useCreateLogoutHandler, Flow } from "../src/components/ory";
import {
  handleGetFlowError,
  handleFlowError
} from "../src/components/ory/errors";
import ory from "../src/components/ory/sdk";

const Login: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow>();

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
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleGetFlowError(router, "login", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "login", setFlow));
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow]);

  const onSubmit = (values: SubmitSelfServiceLoginFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceLoginFlow(String(flow?.id), values)
          // We logged in successfully! Let's bring the user home.
          .then((res) => {
            if (flow?.return_to) {
              window.location.href = flow?.return_to;
              return;
            }
            router.push("/");
          })
          .then(() => {})
          .catch(handleFlowError(router, "login", setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <>
      <Head prefix="Sign in" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div className="w-96">
            <div>
              <img
                alt="Flanksource"
                src="/images/logo.svg"
                className="p-2 h-auto m-auto rounded-8px w-48"
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
                <div className="flex-col align-center justify-between">
                  <Link href="/recovery" passHref>
                    <div className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                      Reset password
                    </div>
                  </Link>

                  <div className="flex justify-center">
                    <Link href="/registration" passHref>
                      <div className="mt-5">
                        <span className="text-gray-600 text-sm font-semibold">
                          Don't have an account ?
                        </span>
                        <span className="cursor-pointer font-bold text-blue-600 hover:underline">
                          {" "}
                          Sign Up{" "}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
