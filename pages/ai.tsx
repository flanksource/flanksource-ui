import type { NextPage } from "next";
import { App } from "../src/App";
import AuthSessionChecker from "../src/components/Authentication/AuthSessionChecker";
import { isCanaryUI } from "../src/context/Environment";
import { CanaryCheckerApp } from "../src/App";

const AIPage: NextPage = () => {
  if (isCanaryUI) {
    return <CanaryCheckerApp />;
  }

  return (
    <AuthSessionChecker>
      <div className="container-fluid flex flex-col overflow-auto">
        <App />
      </div>
    </AuthSessionChecker>
  );
};

export default AIPage;
