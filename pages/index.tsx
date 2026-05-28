/* eslint-disable no-restricted-globals */
import type { NextPage } from "next";
import { useEffect } from "react";
import { App, CanaryCheckerApp } from "../src/App";
import AuthSessionChecker from "../src/components/Authentication/AuthSessionChecker";
import { isCanaryUI } from "../src/context/Environment";
import { isNewUIPreferred } from "../src/utils/uiPreference";

const Home: NextPage = () => {
  useEffect(() => {
    if (!isCanaryUI && isNewUIPreferred()) {
      window.location.replace("/ui");
    }
  }, []);

  // For the canary UI, we don't have any authentication system in place
  if (isCanaryUI) {
    return (
      <div className="container-fluid flex flex-col overflow-auto">
        <CanaryCheckerApp />
      </div>
    );
  }

  return (
    <AuthSessionChecker>
      <div className="container-fluid flex flex-col overflow-auto">
        <App />
      </div>
    </AuthSessionChecker>
  );
};

export default Home;
