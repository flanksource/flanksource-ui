import ClerkAuthErrors from "../src/components/Authentication/Clerk/ClerkAuthErrors";
import KratosErrorPage from "../src/components/Authentication/Kratos/KratosError";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";

export default function ErrorPage() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "clerk") {
    return <ClerkAuthErrors />;
  }

  return <KratosErrorPage />;
}
