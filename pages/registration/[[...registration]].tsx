import ClerkRegistration from "../../src/components/Authentication/Clerk/ClerkRegistration";
import KratosRegistration from "../../src/components/Authentication/Kratos/KratosRegistration";
import useDetermineAuthSystem from "../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../src/ui/Head";

// Renders the registration page
export default function Registration() {
  const authSystem = useDetermineAuthSystem();

  return (
    <>
      <Head prefix="Register" />
      <div className="flex min-h-screen justify-center bg-gray-50">
        <div className="flex min-h-full flex-col justify-center pb-28 pt-12 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosRegistration />}
          {authSystem === "clerk" && <ClerkRegistration />}
        </div>
      </div>
    </>
  );
}
