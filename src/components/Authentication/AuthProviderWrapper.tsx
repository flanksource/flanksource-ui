import ClerkAuthContextProvider from "./Clerk/ClerkAuthContextProvider";
import KratosAuthContextProvider from "./Kratos/KratosAuthContextProvider";
import useDetermineAuthSystem from "./useDetermineAuthSystem";

type AuthProviderWrapperProps = {
  children: React.ReactNode;
};

export default function AuthProviderWrapper({
  children
}: AuthProviderWrapperProps) {
  const authSystem = useDetermineAuthSystem();

  // we need access to Clerk's organization context
  if (authSystem === "clerk") {
    return <ClerkAuthContextProvider>{children}</ClerkAuthContextProvider>;
  }

  return <KratosAuthContextProvider>{children}</KratosAuthContextProvider>;
}
