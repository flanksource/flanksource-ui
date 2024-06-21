import ClerkUserProfile from "../../src/components/Authentication/Clerk/ClerkUserProfile";
import KratosProfileSettings from "../../src/components/Authentication/Kratos/KratosProfileSettings";
import useDetermineAuthSystem from "../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../src/ui/Head";

export default function ProfileSettings() {
  const authSystem = useDetermineAuthSystem();

  return (
    <>
      <Head prefix="Profile Management and Security Settings" />
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosProfileSettings />}
          {authSystem === "clerk" && <ClerkUserProfile />}
        </div>
      </div>
    </>
  );
}
