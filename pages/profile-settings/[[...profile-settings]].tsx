import React from "react";
import KratosProfileSettings from "../../src/components/Authentication/Kratos/KratosProfileSettings";
import useDetermineAuthSystem from "../../src/components/Authentication/useDetermineAuthSystem";
import ClerkUserProfile from "../../src/components/Authentication/Clerk/ClerkUserProfile";
import { Head } from "../../src/components/Head/Head";

export default function ProfileSettings() {
  const authSystem = useDetermineAuthSystem();

  return (
    <>
      <Head prefix="Profile Management and Security Settings" />
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          {authSystem === "kratos" && <KratosProfileSettings />}
          {authSystem === "clerk" && <ClerkUserProfile />}
        </div>
      </div>
    </>
  );
}
