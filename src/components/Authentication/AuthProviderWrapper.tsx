import BasicAuthContextProvider from "./Basic/BasicAuthContextProvider";
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

  if (authSystem === "basic") {
    return <BasicAuthContextProvider>{children}</BasicAuthContextProvider>;
  }

  if (authSystem === "clerk") {
    return <ClerkAuthContextProvider>{children}</ClerkAuthContextProvider>;
  }

  return <KratosAuthContextProvider>{children}</KratosAuthContextProvider>;
}
