/* eslint-disable no-restricted-globals */
import { AxiosError } from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import ory from "../src/components/ory/sdk";
import { App, CanaryCheckerApp } from "../src/App";
import { Head } from "../src/components/Head/Head";
import { Session } from "@ory/client";
import { isCanaryUI } from "../src/context/Environment";

console.log('--------environment flags-----------');
console.log(process.env);
console.log('--------environment flags-----------');

const Home: NextPage = () => {
  const [session, setSession] = useState<Session | undefined>();

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
        const url = `${location.pathname}${location.search}`;
        switch (err.response?.status) {
          case 403:
            // This is a legacy error code thrown. See code 422 for
            // more details.
            location.href = `/login?aal=aal2&return_to=${url}`;
            return;
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            location.href = `/login?aal=aal2&return_to=${url}`;
            return;
          case 401:
            location.href = `/login?return_to=${url}`;
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, [isAuthDisabled]);

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
