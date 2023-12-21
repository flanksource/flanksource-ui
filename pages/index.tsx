/* eslint-disable no-restricted-globals */
import type { NextPage } from "next";
import { App, CanaryCheckerApp } from "../src/App";
import AuthSessionChecker from "../src/components/Authentication/AuthSessionChecker";
import SetupIntercom from "../src/components/Intercom/SetupIntercom";
import { isCanaryUI } from "../src/context/Environment";

const Home: NextPage = () => {
  return (
    <AuthSessionChecker>
      <div className="container-fluid flex flex-col overflow-auto">
        <SetupIntercom>
          {isCanaryUI ? <CanaryCheckerApp /> : <App />}
        </SetupIntercom>
      </div>
    </AuthSessionChecker>
  );
};

export default Home;
