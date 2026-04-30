import BasicAuthSessionChecker from "./Basic/BasicAuthSessionChecker";
import ClerkAuthSessionChecker from "./Clerk/ClerkAuthSessionChecker";
import KratosAuthSessionChecker from "./Kratos/KratosAuthSessionChecker";
import useDetermineAuthSystem from "./useDetermineAuthSystem";

type AuthSessionCheckerProps = {
  children: React.ReactNode;
};

export default function AuthSessionChecker({
  children
}: AuthSessionCheckerProps) {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "basic") {
    return <BasicAuthSessionChecker>{children}</BasicAuthSessionChecker>;
  }

  if (authSystem === "clerk") {
    return <ClerkAuthSessionChecker>{children}</ClerkAuthSessionChecker>;
  }

  return <KratosAuthSessionChecker>{children}</KratosAuthSessionChecker>;
}
