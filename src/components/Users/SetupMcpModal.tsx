import { useState } from "react";
import { useAgentsBaseURL } from "@flanksource-ui/components/Agents/InstalAgentInstruction/useAgentsBaseURL";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccessTokenMode: () => void;
};

type SetupMode = "as-user" | "access-token";

type ClientKey = "claude-code" | "vscode-copilot";

const mcpUsageInstructionsByClient: Partial<Record<ClientKey, string>> = {
  "claude-code": "Add this to .mcp.json in your project root",
  "vscode-copilot": "Add this to .vscode/mcp.json in your project root"
};

export default function SetupMcpModal({
  isOpen,
  onClose,
  onSelectAccessTokenMode
}: Props) {
  const [mode, setMode] = useState<SetupMode>("as-user");
  const [activeClient, setActiveClient] = useState<ClientKey>("claude-code");
  const baseUrl = useAgentsBaseURL() + "/mcp";

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
      onClose={onClose}
      open={isOpen}
      bodyClass="flex h-full w-full flex-1 flex-col overflow-y-auto"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-base font-semibold text-gray-900">
            Choose how MCP should authenticate
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            You can connect MCP either as your own user (full permissions) or
            with a dedicated access token (restricted permissions).
          </p>
        </div>

        <Tabs activeTab={mode} onSelectTab={(tab) => setMode(tab as SetupMode)}>
          <Tab
            value="as-user"
            label="As me (full user permissions)"
            className="p-4"
          >
            <div className="space-y-4 p-2">
              <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-medium">Recommended for personal usage</p>
                <p className="mt-1">
                  MCP will run with your own user identity and all permissions
                  you already have in Mission Control.
                </p>
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                OIDC is currently supported only for <b>VS Code</b> and{" "}
                <b>Claude Code</b>. Use one of these configurations and
                authenticate as yourself when prompted.
              </div>

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
            </div>
          </Tab>

          <Tab
            value="access-token"
            label="Access token (restricted permissions)"
            className="p-4"
          >
            <div className="space-y-4 p-2">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-medium">Recommended for automation/bots</p>
                <p className="mt-1">
                  Create a dedicated token with only the MCP scopes you want.
                  This is safer than using your full user permissions.
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                Continue to token setup to configure expiry, auto-renew, and
                restricted scopes.
              </div>

              <div>
                <Button
                  onClick={() => {
                    onClose();
                    onSelectAccessTokenMode();
                  }}
                  className="btn-primary"
                  text="Continue to access token setup"
                />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} className="btn-secondary" />
      </div>
    </Modal>
  );
}
