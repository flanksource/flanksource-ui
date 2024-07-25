import ClerkLogin from "../../src/components/Authentication/Clerk/ClerkLogin";
import KratosLogin from "../../src/components/Authentication/Kratos/KratosLogin";
import useDetermineAuthSystem from "../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../src/ui/Head";

export default function Signin() {
  const authSystem = useDetermineAuthSystem();

  return (
    <>
      <Head prefix="Sign in" />
      <div className="flex min-h-screen justify-center bg-gray-50">
        <div className="flex min-h-full flex-col justify-center">
          {authSystem === "kratos" && <KratosLogin />}
          {authSystem === "clerk" && <ClerkLogin />}
        </div>
      </div>
    </>
  );
}
