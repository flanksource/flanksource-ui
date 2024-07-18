import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Import render helpers
import { handleFlowError } from "@flanksource-ui/components/Authentication/Kratos/ory/errors";
// Import the SDK
import { Flow } from "@flanksource-ui/components/Authentication/Kratos/ory";
import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";

// Renders the registration page
export default function KratosRegistration() {
  const router = useRouter();

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<RegistrationFlow>();

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
        .getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data);
        })
        .catch(handleFlowError(router, "registration", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserRegistrationFlow({
        afterVerificationReturnTo: returnTo ? String(returnTo) : undefined
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "registration", setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: UpdateRegistrationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateRegistrationFlow({
            flow: String(flow?.id),
            updateRegistrationFlowBody: values
          })
          .then(({ data }) => {
            // If we ended up here, it means we are successfully signed up!
            //
            // You can do cool stuff here, like having access to the identity which just signed up:
            console.log("This is the user session: ", data, data.identity);

            // For now however we just want to redirect home!
            window.location.href = flow?.return_to || "/";
          })
          .catch(handleFlowError(router, "registration", setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow((err.response as any).data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <div className="w-96">
      <div className="mt-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Mission Control"
            src="/images/logo.svg"
            className="m-auto h-auto w-48 rounded-8px p-2"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create account
          </h2>
          <div className="mt-8 bg-white px-4 pb-8 pt-4 shadow sm:rounded-lg sm:px-10">
            <Flow onSubmit={onSubmit} flow={flow} />
          </div>
        </div>
        <div className="mt-2">
          <Link
            href="/login"
            passHref
            className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
