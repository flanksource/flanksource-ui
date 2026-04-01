import { useState } from "react";
import { CreateTokenResponse } from "@flanksource-ui/api/services/tokens";
import { useAgentsBaseURL } from "@flanksource-ui/components/Agents/InstalAgentInstruction/useAgentsBaseURL";
import {
  CreateTokenFormContent,
  TokenFormValues
} from "@flanksource-ui/components/Tokens/Add/CreateTokenForm";
import { TokenDisplayContent } from "@flanksource-ui/components/Tokens/Add/TokenDisplayModal";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type SetupMode = "as-user" | "access-token";

type ClientKey = "claude-code" | "vscode-copilot";

const mcpUsageInstructionsByClient: Partial<Record<ClientKey, string>> = {
  "claude-code": "Add this to .mcp.json in your project root",
  "vscode-copilot": "Add this to .vscode/mcp.json in your project root"
};

const ACCESS_TOKEN_FORM_ID = "setup-mcp-access-token-form";

export default function SetupMcpModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<SetupMode>("as-user");
  const [activeClient, setActiveClient] = useState<ClientKey>("claude-code");
  const baseUrl = useAgentsBaseURL() + "/mcp";
  const [mcpTokenResponse, setMcpTokenResponse] =
    useState<CreateTokenResponse>();
  const [mcpTokenFormValues, setMcpTokenFormValues] =
    useState<TokenFormValues>();

  const handleClose = () => {
    setMode("as-user");
    setMcpTokenResponse(undefined);
    setMcpTokenFormValues(undefined);
    onClose();
  };

  const asUserConfigs: Record<ClientKey, { label: string; config: string }> = {
    "claude-code": {
      label: "Claude Code",
      config: `{
  "mcpServers": {
    "mission-control": {
      "name": "mission-control",
      "type": "http",
      "url": "${baseUrl}",
      "oauth": {
        "clientId": "mc-cli"
      }
    }
  }
}`
    },
    "vscode-copilot": {
      label: "VS Code",
      config: `{
  "servers": {
    "mission-control": {
      "url": "${baseUrl}"
    }
  },
  "inputs": []
}`
    }
  };

  return (
    <Modal
      title="Setup MCP"
      onClose={handleClose}
      open={isOpen}
      bodyClass="flex h-[70vh] min-h-[620px] max-h-[70vh] w-full flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-base font-semibold text-gray-900">
            Choose how MCP should authenticate
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            You can connect MCP either as your own user (full permissions) or
            with a dedicated access token (restricted permissions).
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <Tabs
            activeTab={mode}
            onSelectTab={(tab) => setMode(tab as SetupMode)}
            contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto border border-t-0 border-gray-300 bg-white"
          >
            <Tab
              value="as-user"
              label="As me (full user permissions)"
              className="h-full overflow-y-auto p-4"
            >
              <Tabs
                activeTab={activeClient}
                onSelectTab={(tab) => setActiveClient(tab as ClientKey)}
              >
                {Object.entries(asUserConfigs).map(
                  ([key, { label, config }]) => (
                    <Tab key={key} label={label} value={key} className="p-4">
                      <div className="max-h-64 overflow-y-auto">
                        <JSONViewer
                          code={config}
                          format="json"
                          showLineNo
                          hideCopyButton={false}
                        />
                      </div>
                    </Tab>
                  )
                )}
              </Tabs>

              {mcpUsageInstructionsByClient[activeClient] && (
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  {mcpUsageInstructionsByClient[activeClient]}
                </div>
              )}
            </Tab>

            <Tab
              value="access-token"
              label="Access token (restricted permissions)"
              className="h-full overflow-y-auto p-4"
            >
              {mcpTokenResponse ? (
                <TokenDisplayContent
                  tokenResponse={mcpTokenResponse}
                  formValues={mcpTokenFormValues}
                  isMcp
                />
              ) : (
                <CreateTokenFormContent
                  formId={ACCESS_TOKEN_FORM_ID}
                  showFooter={false}
                  isMcpSetup
                  onSuccess={(response, formValues) => {
                    setMcpTokenResponse(response);
                    setMcpTokenFormValues(formValues);
                  }}
                />
              )}
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={handleClose} className="btn-secondary" />
        {mode === "access-token" && !mcpTokenResponse && (
          <Button
            type="submit"
            form={ACCESS_TOKEN_FORM_ID}
            text="Create Token"
            className="btn-primary"
          />
        )}
      </div>
    </Modal>
  );
}
