import { AxiosError } from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ory from "../src/components/ory/sdk";
import { App, CanaryCheckerApp } from "../src/App";
import { Head } from "../src/components/Head/Head";
import { Session } from "@ory/client";
import { isCanaryUI } from "../src/constants";

const Home: NextPage = () => {
  const [session, setSession] = useState<Session | undefined>();
  const router = useRouter();

  const isAuthDisabled = process.env.NEXT_PUBLIC_WITHOUT_SESSION === "true";

  useEffect(() => {
    if (isAuthDisabled) {
      return;
    }

    ory
      .toSession()
      .then(({ data }) => {
        setSession(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
            // This is a legacy error code thrown. See code 422 for
            // more details.
            return router.push("/login?aal=aal2");
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            return router.push("/login?aal=aal2");
          case 401:
            // do nothing, the user is not logged in
            return router.push("/login");
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, [router, isAuthDisabled]);

  if (!isAuthDisabled && !session) {
    return null;
  }

  return (
    <div className="container-fluid">
      <Head prefix="Home" />
      {isCanaryUI ? <CanaryCheckerApp /> : <App />}
    </div>
  );
};

export default Home;
