import { AxiosError } from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ory from "../src/components/ory/sdk";
import { App } from "../src/App";
import { Head } from "../src/components/Head/Head";
import { Session } from "@ory/client";

const Home: NextPage = () => {
  const [session, setSession] = useState<Session | undefined>();
  const router = useRouter();

  useEffect(() => {
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
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <div className="container-fluid">
      <Head prefix="Home" />
      <App />
    </div>
  );
};

export default Home;
