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

  if (authSystem === "clerk") {
    return <ClerkAuthSessionChecker>{children}</ClerkAuthSessionChecker>;
  }

  return <KratosAuthSessionChecker>{children}</KratosAuthSessionChecker>;
}
