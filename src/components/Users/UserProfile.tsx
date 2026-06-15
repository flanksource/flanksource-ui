import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { lazy, Suspense, useEffect, useState } from "react";
import { Info, Search } from "lucide-react";
import { IoMdAirplane, IoMdDownload, IoMdSwap } from "react-icons/io";
import { MdSecurity, MdTerminal } from "react-icons/md";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { isNewUIPreferred, setNewUIPreference } from "../../utils/uiPreference";
import { hasImpersonatedScopes } from "../Scopes/Impersonation/scopeImpersonationStore";
import { KratosUserProfileDropdown } from "../Authentication/Kratos/KratosUserProfileDropdown";
import { frontendVersion } from "../VersionInfo/VersionInfo";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";
import AddKubeConfigModal from "../KubeConfig/AddKubeConfigModal";
import ScopeImpersonationModal from "../Scopes/Impersonation/ScopeImpersonationModal";
import SetupMcpModal from "./SetupMcpModal";
import SetupMissionControlCliModal from "./SetupMissionControlCliModal";

const LazyResourceSelectorSearchModal = lazy(() =>
  import("../ResourceSelectorSearch/ResourceSelectorSearchModal").then(
    (module) => ({
      default: module.ResourceSelectorSearchModal
    })
  )
);

export function UserProfileDropdown() {
  const authSystem = useDetermineAuthSystem();
  const { featureFlags } = useFeatureFlagsContext();
  const isRLSEnabled = featureFlags.some(
    (f) => f.name === "rls.enable" && f.value === "true"
  );
  const [isDownloadKubeConfigModalOpen, setIsDownloadKubeConfigModalOpen] =
    useState(false);
  const [isMcpSetupModalOpen, setIsMcpSetupModalOpen] = useState(false);
  const [isCliSetupModalOpen, setIsCliSetupModalOpen] = useState(false);
  const [
    isResourceSelectorSearchModalOpen,
    setIsResourceSelectorSearchModalOpen
  ] = useState(false);
  const [isScopeImpersonationModalOpen, setIsScopeImpersonationModalOpen] =
    useState(false);
  const [newUIEnabled, setNewUIEnabled] = useState(false);
  useEffect(() => {
    setNewUIEnabled(isNewUIPreferred());
  }, []);

  const toggleNewUI = () => {
    const next = !newUIEnabled;
    setNewUIPreference(next);
    window.location.href = next ? "/ui" : "/";
  };

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
                label={newUIEnabled ? "Use Old UI" : "Use New UI"}
                labelIcon={<IoMdSwap />}
                onClick={toggleNewUI}
              />
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
                label="Setup CLI"
                labelIcon={<MdTerminal />}
                onClick={() => setIsCliSetupModalOpen(true)}
              />
              <UserButton.Action
                label="Resource selector search"
                labelIcon={<Search className="h-4 w-4" />}
                onClick={() => setIsResourceSelectorSearchModalOpen(true)}
              />
              {isRLSEnabled && (
                <UserButton.Action
                  label={`Impersonate Scope${hasImpersonatedScopes() ? " (active)" : ""}`}
                  labelIcon={<MdSecurity />}
                  onClick={() => setIsScopeImpersonationModalOpen(true)}
                />
              )}
              <UserButton.Action
                label={`UI Version: ${frontendVersion}`}
                labelIcon={<Info className="h-4 w-4" />}
                onClick={() => {}}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      ) : (
        <KratosUserProfileDropdown
          openKubeConfigModal={() => setIsDownloadKubeConfigModalOpen(true)}
          openMcpTokenModal={() => setIsMcpSetupModalOpen(true)}
          openCliSetupModal={() => setIsCliSetupModalOpen(true)}
          openResourceSelectorSearchModal={() =>
            setIsResourceSelectorSearchModalOpen(true)
          }
          openScopeImpersonationModal={() =>
            setIsScopeImpersonationModalOpen(true)
          }
          showScopeImpersonation={isRLSEnabled}
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
      <SetupMissionControlCliModal
        isOpen={isCliSetupModalOpen}
        onClose={() => setIsCliSetupModalOpen(false)}
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
