import KratosErrorPage from "../src/components/Authentication/Kratos/KratosError";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";

export default function ErrorPage() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "clerk") {
    // TODO: Clerk login
    return null;
  }

  return <KratosErrorPage />;
}
