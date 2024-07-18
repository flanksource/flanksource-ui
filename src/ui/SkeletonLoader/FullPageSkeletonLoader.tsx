import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import useDetermineAuthSystem from "../../components/Authentication/useDetermineAuthSystem";

export default function FullPageSkeletonLoader() {
  const authSystem = useDetermineAuthSystem();

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
        <div className="flex h-auto w-full flex-row items-end space-x-4 border-b border-gray-300 bg-gray-50 p-3">
          <div className="h-full w-36 animate-pulse rounded-md bg-gray-200"></div>
          <div className="flex-1 animate-pulse"></div>
          {authSystem === "kratos" ? (
            <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          ) : (
            <div
              className="flex h-12 flex-row items-center gap-2"
              data-testid="open-user-button"
            >
              <OrganizationSwitcher
                hidePersonal
                createOrganizationMode="modal"
                afterSelectOrganizationUrl={`/organizations/orgs-switched`}
                afterCreateOrganizationUrl={`/organizations/orgs-switched`}
              />
              <UserButton />
            </div>
          )}
        </div>
        <div className="flex flex-1 animate-pulse flex-row p-4">
          <div className="flex w-full flex-row space-x-4">
            <div className="flex h-48 w-1/2 flex-col space-y-6 rounded-md bg-gray-50 p-4">
              <div className="h-12 w-full rounded-md bg-gray-200"></div>
              <div className="h-12 w-2/3 rounded-md bg-gray-200"></div>
              <div className="h-12 w-1/2 rounded-md bg-gray-200"></div>
            </div>

            <div className="flex h-48 w-1/2 flex-col space-y-6 rounded-md bg-gray-50 p-4">
              <div className="h-12 w-full rounded-md bg-gray-200"></div>
              <div className="h-12 w-2/3 rounded-md bg-gray-200"></div>
              <div className="h-12 w-1/2 rounded-md bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
