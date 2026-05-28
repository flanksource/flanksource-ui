/* eslint-disable no-restricted-globals */
import type { GetServerSideProps, NextPage } from "next";
import { App, CanaryCheckerApp } from "../src/App";
import AuthSessionChecker from "../src/components/Authentication/AuthSessionChecker";
import { isCanaryUI } from "../src/context/Environment";
import { NEW_UI_COOKIE } from "../src/utils/uiPreference";

const Home: NextPage = () => {
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!isCanaryUI && req.cookies[NEW_UI_COOKIE] === "true") {
    return { redirect: { destination: "/ui", permanent: false } };
  }
  return { props: {} };
};

export default Home;
