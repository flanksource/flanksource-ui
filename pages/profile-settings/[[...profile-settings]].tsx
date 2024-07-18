import ClerkUserProfile from "../../src/components/Authentication/Clerk/ClerkUserProfile";
import KratosProfileSettings from "../../src/components/Authentication/Kratos/KratosProfileSettings";
import useDetermineAuthSystem from "../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../src/ui/Head";

export default function ProfileSettings() {
  const authSystem = useDetermineAuthSystem();

  return (
    <>
      <Head prefix="Profile Management and Security Settings" />
      <div className="flex min-h-screen flex-col justify-center overflow-y-auto bg-gray-50">
        <div className="flex min-h-full flex-col justify-center pb-28 pt-12 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosProfileSettings />}
          {authSystem === "clerk" && <ClerkUserProfile />}
        </div>
      </div>
    </>
  );
}
