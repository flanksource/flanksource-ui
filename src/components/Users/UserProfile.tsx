import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { IoMdAirplane, IoMdDownload } from "react-icons/io";
import { CreateTokenResponse } from "../../api/services/tokens";
import { KratosUserProfileDropdown } from "../Authentication/Kratos/KratosUserProfileDropdown";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";
import AddKubeConfigModal from "../KubeConfig/AddKubeConfigModal";
import CreateTokenForm, {
  TokenFormValues
} from "../Tokens/Add/CreateTokenForm";
import TokenDisplayModal from "../Tokens/Add/TokenDisplayModal";

export function UserProfileDropdown() {
  const authSystem = useDetermineAuthSystem();
  const [isDownloadKubeConfigModalOpen, setIsDownloadKubeConfigModalOpen] =
    useState(false);
  const [isMcpTokenModalOpen, setIsMcpTokenModalOpen] = useState(false);
  const [isMcpTokenDisplayModalOpen, setIsMcpTokenDisplayModalOpen] =
    useState(false);
  const [mcpTokenResponse, setMcpTokenResponse] =
    useState<CreateTokenResponse>();
  const [mcpTokenFormValues, setMcpTokenFormValues] =
    useState<TokenFormValues>();

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
                onClick={() => setIsMcpTokenModalOpen(true)}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      ) : (
        <KratosUserProfileDropdown
          openKubeConfigModal={() => setIsDownloadKubeConfigModalOpen(true)}
          openMcpTokenModal={() => setIsMcpTokenModalOpen(true)}
        />
      )}
      <AddKubeConfigModal
        isOpen={isDownloadKubeConfigModalOpen}
        onClose={() => setIsDownloadKubeConfigModalOpen(false)}
      />
      <CreateTokenForm
        isOpen={isMcpTokenModalOpen}
        onClose={() => setIsMcpTokenModalOpen(false)}
        onSuccess={(response, formValues) => {
          setMcpTokenResponse(response);
          setMcpTokenFormValues(formValues);
          setIsMcpTokenModalOpen(false);
          setIsMcpTokenDisplayModalOpen(true);
        }}
      />
      {mcpTokenResponse && (
        <TokenDisplayModal
          isOpen={isMcpTokenDisplayModalOpen}
          onClose={() => setIsMcpTokenDisplayModalOpen(false)}
          tokenResponse={mcpTokenResponse}
          formValues={mcpTokenFormValues}
          isMcp={true}
        />
      )}
    </>
  );
}
