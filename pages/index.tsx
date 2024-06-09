/* eslint-disable no-restricted-globals */
import type { NextPage } from "next";
import { App, CanaryCheckerApp } from "../src/App";
import AuthSessionChecker from "../src/components/Authentication/AuthSessionChecker";
import { isCanaryUI } from "../src/context/Environment";

const Home: NextPage = () => {
  return (
    <AuthSessionChecker>
      <div className="container-fluid flex flex-col overflow-auto">
        {isCanaryUI ? <CanaryCheckerApp /> : <App />}
      </div>
    </AuthSessionChecker>
  );
};

export default Home;
