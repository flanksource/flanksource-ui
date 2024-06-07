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
      <div className="flex justify-center bg-gray-50 min-h-screen">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosRegistration />}
          {authSystem === "clerk" && <ClerkRegistration />}
        </div>
      </div>
    </>
  );
}
