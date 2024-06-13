import { Flow } from "@flanksource-ui/components/Authentication/Kratos/ory";
import { handleFlowError } from "@flanksource-ui/components/Authentication/Kratos/ory/errors";
import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Head } from "../../../ui/Head";

function KratosRecovery() {
  const [flow, setFlow] = useState<RecoveryFlow>();

  // Get ?flow=... from the URL
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "recovery", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserRecoveryFlow({
        returnTo: returnTo ? String(returnTo) : undefined
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "recovery", setFlow))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow((err.response as any).data);
          return;
        }

        return Promise.reject(err);
      });
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: UpdateRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateRecoveryFlow({
            flow: String(flow?.id),
            updateRecoveryFlowBody: values
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data);
          })
          .catch(handleFlowError(router, "recovery", setFlow))
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                setFlow((err.response as any).data);
                return;
            }

            throw err;
          })
      );

  return (
    <>
      <Head prefix="Recovery" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div className="w-96">
            <div>
              <img
                alt="Mission Control"
                src="/images/logo.svg"
                className="p-2 h-auto m-auto rounded-8px w-48"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Recover account
              </h2>
              <div className="mt-8 bg-white pt-4 pb-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Flow onSubmit={onSubmit} flow={flow} />
              </div>
              <div className="mt-2">
                <Link
                  href="/"
                  passHref
                  className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                >
                  Go back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KratosRecovery;
