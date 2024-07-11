import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Loading } from "../../../ui/Loading";
import { HelpDropdown } from "../../../ui/MenuBar/HelpDropdown";
import { clerkUrls } from "./ClerkAuthSessionChecker";

export default function InstanceCreationInProgress() {
  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="flex flex-col w-56 pt-4 px-4 space-y-6 h-full bg-gray-50 border-r border-gray-300 animate-pulse">
        <div className="w-full bg-gray-200 rounded-md h-12 "></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12 "></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
      </div>
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-row h-auto w-full bg-gray-50 p-3 gap-4 justify-center items-end border-b border-gray-300">
          <div className="w-36 bg-gray-200 h-full rounded-md animate-pulse"></div>
          <div className="flex-1"></div>
          <div className="h-full flex flex-row gap-2 items-center justify-center">
            <HelpDropdown />
            <OrganizationSwitcher
              hidePersonal
              createOrganizationMode="modal"
              afterSelectOrganizationUrl="/organizations/orgs-switched"
              afterCreateOrganizationUrl="/organizations/orgs-switched"
            />
            <UserButton signInUrl={clerkUrls.login} afterSwitchSessionUrl="/" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Loading text="Please wait, instance provisioning in-progress ..." />
        </div>
      </div>
    </div>
  );
}
