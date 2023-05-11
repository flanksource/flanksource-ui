import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody
} from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "../src/components";
import { Head } from "../src/components/Head/Head";

// Import render helpers
import { Flow } from "../src/components/ory";
import { handleFlowError } from "../src/components/ory/errors";
// Import the SDK
import ory from "../src/components/ory/sdk";

// Renders the registration page
const Registration: NextPage = () => {
  const router = useRouter();

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>();

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query;

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data);
        })
        .catch(handleFlowError(router, "registration", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "registration", setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: SubmitSelfServiceRegistrationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceRegistrationFlow(String(flow?.id), values)
          .then(({ data }) => {
            // If we ended up here, it means we are successfully signed up!
            //
            // You can do cool stuff here, like having access to the identity which just signed up:
            console.log("This is the user session: ", data, data.identity);

            // For now however we just want to redirect home!
            return router.push(flow?.return_to || "/").then(() => {});
          })
          .catch(handleFlowError(router, "registration", setFlow))
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
      <Head prefix="Register" />
      <div className="flex justify-center bg-gray-50 min-h-screen">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div className="w-96">
            <div className="mt-6">
              <div>
                <img
                  alt="Mission Control"
                  src="/images/logo.svg"
                  className="p-2 h-auto m-auto rounded-8px w-48"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Create account
                </h2>
                <div className="mt-8 bg-white pt-4 pb-8 px-4 shadow sm:rounded-lg sm:px-10">
                  <Flow onSubmit={onSubmit} flow={flow} />
                </div>
              </div>
              <div className="mt-2">
                <Link href="/login" passHref>
                  <a className="font-medium cursor-pointer text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
