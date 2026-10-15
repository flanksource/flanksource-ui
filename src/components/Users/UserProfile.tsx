import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { lazy, Suspense, useEffect, useState } from "react";
import { Info, MapPin, Search } from "lucide-react";
import { IoMdAirplane, IoMdDownload, IoMdSwap } from "react-icons/io";
import { MdTerminal } from "react-icons/md";
import { isNewUIPreferred, setNewUIPreference } from "../../utils/uiPreference";
import { KratosUserProfileDropdown } from "../Authentication/Kratos/KratosUserProfileDropdown";
import { frontendVersion } from "../VersionInfo/VersionInfo";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";
import AddKubeConfigModal from "../KubeConfig/AddKubeConfigModal";
import SetupMcpModal from "./SetupMcpModal";
import SetupMissionControlCliModal from "./SetupMissionControlCliModal";
import { useNavigate } from "react-router-dom";

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
  const [isCliSetupModalOpen, setIsCliSetupModalOpen] = useState(false);
  const [
    isResourceSelectorSearchModalOpen,
    setIsResourceSelectorSearchModalOpen
  ] = useState(false);
  const [newUIEnabled, setNewUIEnabled] = useState(false);
  const navigate = useNavigate();
  const openGettingStarted = () => navigate("/getting-started");
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
        <div data-tour="user-menu" className="flex flex-row gap-2 pr-2">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            afterSelectOrganizationUrl={`/organizations/orgs-switched`}
            afterCreateOrganizationUrl={`/organizations/orgs-switched`}
          />
          <UserButton signInUrl="/login">
            <UserButton.MenuItems>
              <UserButton.Action
                label="Getting started"
                labelIcon={<MapPin className="h-4 w-4" />}
                onClick={openGettingStarted}
              />
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
          openGettingStarted={openGettingStarted}
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
    </>
  );
}
