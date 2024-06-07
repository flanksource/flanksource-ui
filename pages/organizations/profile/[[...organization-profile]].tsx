import { OrganizationProfile } from "@clerk/nextjs";
import useDetermineAuthSystem from "../../../src/components/Authentication/useDetermineAuthSystem";
import { Head } from "../../../src/ui/Head";

export default function ClerkOrganizationSwitcher() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "kratos") {
    return null;
  }

  return (
    <>
      <Head prefix="Manage Organization" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div className="w-full px-3 text-center flex flex-col">
            <div className="flex flex-col mb-12">
              <OrganizationProfile
                afterLeaveOrganizationUrl="/"
                path="/organizations/profile"
                routing="path"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
