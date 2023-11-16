import { OrganizationSwitcher } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";
import { clerkUrls } from "../../../src/components/Authentication/Clerk/ClerkAuthSessionChecker";
import useDetermineAuthSystem from "../../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../../src/components/Head/Head";

export default function ClerkOrganizationSwitcher() {
  const authSystem = useDetermineAuthSystem();
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl ? (query.return_to as string) : "/";

  if (authSystem === "kratos") {
    return null;
  }

  return (
    <>
      <Head prefix="Select Organization" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div className="w-full px-3 text-center flex flex-col">
            <div className="flex flex-col mb-12">
              <OrganizationSwitcher
                afterCreateOrganizationUrl={redirectUrl}
                createOrganizationUrl={clerkUrls.createOrganization}
                createOrganizationMode="navigation"
                afterSwitchOrganizationUrl={redirectUrl}
                hidePersonal
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
