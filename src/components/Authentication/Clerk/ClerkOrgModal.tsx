import { OrganizationList, UserButton } from "@clerk/nextjs";
import { HelpDropdown } from "../../../ui/MenuBar/HelpDropdown";
import { clerkUrls } from "./ClerkAuthSessionChecker";

export default function ClerkOrgModal() {
  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex h-full w-56 animate-pulse flex-col space-y-6 border-r border-gray-300 bg-gray-50 px-4 pt-4">
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
        <div className="h-12 w-full rounded-md bg-gray-200"></div>
      </div>
      <div className="flex h-full flex-1 flex-col">
        <div className="flex h-auto w-full flex-row items-end justify-center gap-4 border-b border-gray-300 bg-gray-50 p-3">
          <div className="h-full w-36 animate-pulse rounded-md bg-gray-200"></div>
          <div className="flex-1"></div>
          <div className="flex h-full flex-row items-center justify-center gap-2">
            <HelpDropdown />
            <UserButton signInUrl={clerkUrls.login} afterSwitchSessionUrl="/" />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl="/organizations/orgs-switched"
            afterCreateOrganizationUrl="/organizations/orgs-switched"
          />
        </div>
      </div>
    </div>
  );
}
