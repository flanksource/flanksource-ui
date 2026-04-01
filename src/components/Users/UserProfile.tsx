import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { lazy, Suspense, useState } from "react";
import { Search } from "lucide-react";
import { IoMdAirplane, IoMdDownload } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { hasImpersonatedScopes } from "../Scopes/Impersonation/scopeImpersonationStore";
import { KratosUserProfileDropdown } from "../Authentication/Kratos/KratosUserProfileDropdown";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";
import AddKubeConfigModal from "../KubeConfig/AddKubeConfigModal";
import ScopeImpersonationModal from "../Scopes/Impersonation/ScopeImpersonationModal";
import SetupMcpModal from "./SetupMcpModal";

const LazyResourceSelectorSearchModal = lazy(() =>
  import("../ResourceSelectorSearch/ResourceSelectorSearchModal").then(
    (module) => ({
      default: module.ResourceSelectorSearchModal
    })
  )
);

export function UserProfileDropdown() {
  const authSystem = useDetermineAuthSystem();
  const [isDownloadKubeConfigModalOpen, setIsDownloadKubeConfigModalOpen] =
    useState(false);
  const [isMcpSetupModalOpen, setIsMcpSetupModalOpen] = useState(false);
  const [
    isResourceSelectorSearchModalOpen,
    setIsResourceSelectorSearchModalOpen
  ] = useState(false);
  const [isScopeImpersonationModalOpen, setIsScopeImpersonationModalOpen] =
    useState(false);

  return (
    <>
      {authSystem === "clerk" ? (
        <div className="flex flex-row gap-2 pr-2">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            afterSelectOrganizationUrl={`/organizations/orgs-switched`}
            afterCreateOrganizationUrl={`/organizations/orgs-switched`}
          />
          <UserButton signInUrl="/login">
            <UserButton.MenuItems>
              <UserButton.Action
                label="Download kubeconfig"
                labelIcon={<IoMdDownload />}
                onClick={() => setIsDownloadKubeConfigModalOpen(true)}
              />
              <UserButton.Action
                label="Setup MCP"
                labelIcon={<IoMdAirplane />}
                onClick={() => setIsMcpSetupModalOpen(true)}
              />
              <UserButton.Action
                label="Resource selector search"
                labelIcon={<Search className="h-4 w-4" />}
                onClick={() => setIsResourceSelectorSearchModalOpen(true)}
              />
              <UserButton.Action
                label={`Impersonate Scope${hasImpersonatedScopes() ? " (active)" : ""}`}
                labelIcon={<MdSecurity />}
                onClick={() => setIsScopeImpersonationModalOpen(true)}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      ) : (
        <KratosUserProfileDropdown
          openKubeConfigModal={() => setIsDownloadKubeConfigModalOpen(true)}
          openMcpTokenModal={() => setIsMcpSetupModalOpen(true)}
          openResourceSelectorSearchModal={() =>
            setIsResourceSelectorSearchModalOpen(true)
          }
          openScopeImpersonationModal={() =>
            setIsScopeImpersonationModalOpen(true)
          }
        />
      )}
      <AddKubeConfigModal
        isOpen={isDownloadKubeConfigModalOpen}
        onClose={() => setIsDownloadKubeConfigModalOpen(false)}
      />
      <SetupMcpModal
        isOpen={isMcpSetupModalOpen}
        onClose={() => setIsMcpSetupModalOpen(false)}
      />
      {isResourceSelectorSearchModalOpen && (
        <Suspense fallback={null}>
          <LazyResourceSelectorSearchModal
            open={isResourceSelectorSearchModalOpen}
            onClose={() => setIsResourceSelectorSearchModalOpen(false)}
          />
        </Suspense>
      )}
      <ScopeImpersonationModal
        isOpen={isScopeImpersonationModalOpen}
        onClose={() => setIsScopeImpersonationModalOpen(false)}
      />
    </>
  );
}
