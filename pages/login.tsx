import ClerkLogin from "../src/components/Authentication/Clerk/ClerkLogin";
import KratosLogin from "../src/components/Authentication/Kratos/KratosLogin";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../src/components/Head/Head";

export default function Login() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "clerk") {
    // TODO: implement
  }

  return (
    <>
      <Head prefix="Sign in" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosLogin />}
          {authSystem === "clerk" && <ClerkLogin />}
        </div>
      </div>
    </>
  );
}
