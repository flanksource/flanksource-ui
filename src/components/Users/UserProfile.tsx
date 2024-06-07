import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { KratosUserProfileDropdown } from "../Authentication/Kratos/KratosUserProfileDropdown";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";

export function UserProfileDropdown() {
  const authSystem = useDetermineAuthSystem();

  return authSystem === "clerk" ? (
    <div className="flex flex-row gap-2 pr-2">
      <OrganizationSwitcher
        hidePersonal
        createOrganizationMode="modal"
        afterSelectOrganizationUrl={`/organizations/orgs-switched`}
        afterCreateOrganizationUrl={`/organizations/orgs-switched`}
      />
      <UserButton afterSignOutUrl="/login" />
    </div>
  ) : (
    <KratosUserProfileDropdown />
  );
}
