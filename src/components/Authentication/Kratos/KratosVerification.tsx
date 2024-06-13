import { Flow } from "@flanksource-ui/components/Authentication/Kratos/ory";
import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function KratosVerification() {
  const [flow, setFlow] = useState<VerificationFlow>();

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
        .getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 410:
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's
              // reload!
              window.location.href = "/verification";
              return;
          }

          throw err;
        });
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserVerificationFlow({
        returnTo: returnTo ? String(returnTo) : undefined
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the user is already signed in
            return router.push("/");
        }

        throw err;
      });
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: UpdateVerificationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/verification?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateVerificationFlow({
            flow: String(flow?.id),
            updateVerificationFlowBody: values
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data);
          })
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                // @ts-ignore
                setFlow(err.response?.data);
                return;
            }

            throw err;
          })
      );

  return (
    <>
      <Head>
        <title>Verify your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <div>
        <div>Verify your account</div>
        <Flow onSubmit={onSubmit} flow={flow} />
      </div>
      <div>
        <Link href="/" passHref>
          <div>Go back</div>
        </Link>
      </div>
    </>
  );
}

export default KratosVerification;
