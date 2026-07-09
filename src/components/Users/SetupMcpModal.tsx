import { useState, type ReactNode } from "react";
import { RecordTouchpointOnMount } from "@flanksource-ui/components/GuidedTour/TouchpointObserver";
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

type ClientKey = "claude-code" | "vscode-copilot" | "claude-desktop";

type AsUserClientConfig = {
  label: string;
  config?: string;
  content?: ReactNode;
};

const mcpUsageInstructionsByClient: Partial<Record<ClientKey, ReactNode>> = {
  "claude-code": "Add this to .mcp.json in your project root",
  "vscode-copilot": "Add this to .vscode/mcp.json in your project root",
  "claude-desktop": (
    <div className="space-y-1">
      <div>
        Open Claude Desktop, go to <strong>Settings &gt; Connectors</strong>,
        then select <strong>Add &gt; Custom connector</strong>.
      </div>
      <div>
        Enter the values above, select <strong>Add</strong>, then select{" "}
        <strong>Connect</strong> and complete the OAuth flow.
      </div>
    </div>
  )
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

  const asUserConfigs: Record<ClientKey, AsUserClientConfig> = {
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
    },
    "claude-desktop": {
      label: "Claude Desktop",
      content: (
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            Claude Desktop uses custom connectors for remote MCP servers. Add a
            custom connector with these values:
          </p>
          <dl className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
            <dt className="font-medium text-gray-600">Name</dt>
            <dd>
              <code className="break-all rounded bg-gray-100 px-2 py-1">
                Mission-Control
              </code>
            </dd>

            <dt className="font-medium text-gray-600">Remote MCP server URL</dt>
            <dd>
              <code className="break-all rounded bg-gray-100 px-2 py-1">
                {baseUrl}
              </code>
            </dd>

            <dt className="font-medium text-gray-600">OAuth Client ID</dt>
            <dd>
              <code className="break-all rounded bg-gray-100 px-2 py-1">
                mc-cli
              </code>
            </dd>

            <dt className="font-medium text-gray-600">OAuth Client Secret</dt>
            <dd>Leave empty</dd>
          </dl>
        </div>
      )
    }
  };

  return (
    <Modal
      title="Setup MCP"
      onClose={handleClose}
      open={isOpen}
      allowBodyScroll
      bodyClass="flex w-full flex-col"
    >
      {isOpen && <RecordTouchpointOnMount id="ai.setup-mcp" />}
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="">
          <h3 className="text-md text-base font-semibold text-gray-900">
            Choose how MCP should authenticate
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            You can connect MCP either as your own user (full permissions) or
            with a dedicated access token (restricted permissions).
          </p>
        </div>

        <div className="flex flex-col">
          <Tabs
            activeTab={mode}
            onSelectTab={(tab) => setMode(tab as SetupMode)}
            contentClassName="flex flex-col border border-t-0 border-gray-300 bg-white"
          >
            <Tab
              value="as-user"
              label="As me (full user permissions)"
              className="h-full p-4"
            >
              <Tabs
                activeTab={activeClient}
                onSelectTab={(tab) => setActiveClient(tab as ClientKey)}
              >
                {Object.entries(asUserConfigs).map(
                  ([key, { label, config, content }]) => (
                    <Tab key={key} label={label} value={key} className="p-4">
                      <div className="max-h-80 overflow-y-auto">
                        {config ? (
                          <JSONViewer
                            code={config}
                            format="json"
                            showLineNo
                            hideCopyButton={false}
                          />
                        ) : (
                          content
                        )}
                      </div>
                    </Tab>
                  )
                )}
              </Tabs>

              {mcpUsageInstructionsByClient[activeClient] && (
                <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  {mcpUsageInstructionsByClient[activeClient]}
                </div>
              )}
            </Tab>

            <Tab
              value="access-token"
              label="Access token (restricted permissions)"
              className="h-full p-4"
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
