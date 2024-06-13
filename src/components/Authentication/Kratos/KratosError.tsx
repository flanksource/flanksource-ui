import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { FlowError } from "@ory/client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function KratosErrorPage() {
  const [error, setError] = useState<FlowError | string>();

  // Get ?id=... from the URL
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // If the router is not ready yet, or we already have an error, do nothing.
    if (!router.isReady || error) {
      return;
    }

    ory
      .getFlowError({
        id: String(id)
      })
      .then(({ data }) => {
        setError(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          // eslint-disable-next-line no-fallthrough
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          // eslint-disable-next-line no-fallthrough
          case 410:
            // The error id expired. Let's just redirect home!
            return router.push("/");
        }

        return Promise.reject(err);
      });
  }, [id, router, router.isReady, error]);

  if (!error) {
    return null;
  }

  return (
    <>
      <div>
        <div>An error occurred</div>
        <div>{JSON.stringify(error, null, 2)}</div>
      </div>
      <div>
        <Link href="/" passHref>
          <div>Go back</div>
        </Link>
      </div>
    </>
  );
}
