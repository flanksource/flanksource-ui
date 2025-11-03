import { useState } from "react";
import { FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";
import { CreateTokenResponse } from "../../../api/services/tokens";
import { Button } from "../../../ui/Buttons/Button";
import { JSONViewer } from "../../../ui/Code/JSONViewer";
import { Modal } from "../../../ui/Modal";
import { Tab, Tabs } from "../../../ui/Tabs/Tabs";
import { toastSuccess } from "../../Toast/toast";
import { TokenFormValues } from "./CreateTokenForm";
import { useAgentsBaseURL } from "../../../components/Agents/InstalAgentInstruction/useAgentsBaseURL";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tokenResponse: CreateTokenResponse;
  formValues?: TokenFormValues;
  isMcp?: boolean;
};

export default function TokenDisplayModal({
  isOpen,
  onClose,
  tokenResponse,
  formValues,
  isMcp = false
}: Props) {
  const [showToken, setShowToken] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenResponse.payload.token);
    toastSuccess("Token copied to clipboard");
  };

  const maskedToken = tokenResponse.payload.token.replace(/./g, "•");

  return (
    <Modal
      title="Token Created Successfully"
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 text-lg font-bold text-yellow-800">
            ⚠️ Important Security Notice
          </h3>
          <p className="text-yellow-700">
            This token will only be displayed once. Please copy and store it
            securely. You won't be able to see it again after closing this
            dialog.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Token Name:
          </label>
          <div className="rounded-md bg-gray-100 px-3 py-2 text-sm">
            {formValues?.name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Access Token:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 break-all rounded-md bg-gray-100 px-3 py-2 font-mono text-sm">
              {showToken ? tokenResponse.payload.token : maskedToken}
            </div>
            <Button
              onClick={() => setShowToken(!showToken)}
              className="btn-secondary p-2"
              icon={showToken ? <FaEyeSlash /> : <FaEye />}
            />
            <Button
              onClick={copyToClipboard}
              className="btn-secondary p-2"
              icon={<FaCopy />}
            />
          </div>
        </div>

        {isMcp ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-medium text-green-800">
              MCP Client Setup:
            </h4>
            <McpSetupTabs
              token={tokenResponse.payload.token}
              onTabChange={(tab) => {
                // Tab change handled by McpSetupTabs
              }}
            />
          </div>
        ) : (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-medium text-blue-800">
              Usage Instructions:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Use this token for API authentication</li>
              <li>
                • Basic auth:
                <ul className="px-6">
                  <li>
                    Username:{" "}
                    <code className="rounded bg-blue-100 px-1">token</code>
                  </li>
                  <li>
                    Password:{" "}
                    <code className="rounded bg-blue-100 px-1">
                      &lt;YOUR_TOKEN&gt;
                    </code>
                  </li>
                </ul>
              </li>
              <li>
                • Include it in the Authorization header:{" "}
                <code className="rounded bg-blue-100 px-1">
                  Bearer &lt;YOUR_TOKEN&gt;
                </code>
              </li>
              <li>• Store it securely and never share it publicly</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} className="btn-primary" />
      </div>
    </Modal>
  );
}

type McpSetupTabsProps = {
  token: string;
  onTabChange?: (tab: string) => void;
};

function McpSetupTabs({ token, onTabChange }: McpSetupTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("claude-desktop");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const bearerAuth = `Bearer ${token}`;
  const baseUrl = useAgentsBaseURL() + "/mcp";

  const mcpConfigs = {
    "claude-desktop": {
      label: "Claude Desktop",
      config: `{
  "mcpServers": {
    "mission-control": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${baseUrl}",
        "--header",
        "Authorization:${bearerAuth}"
      ],
      "env": {}
    }
  }
}`
    },
    "claude-code": {
      label: "Claude Code",
      config: `{
  "mcpServers": {
    "mission-control": {
      "name": "mission-control",
      "type": "http",
      "url": "${baseUrl}",
      "headers": {
        "Authorization": "${bearerAuth}"
      }
    }
  }
}`
    },
    "vscode-copilot": {
      label: "VS Code Copilot",
      config: `{
  "github.copilot.mcp.servers": {
    "mission-control": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${baseUrl}",
        "--header",
        "Authorization:${bearerAuth}"
      ],
      "env": {}
    }
  }
}`
    },
    cline: {
      label: "Cline",
      config: `{
  "cline.mcpServers": {
    "mission-control": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${baseUrl}",
        "--header",
        "Authorization:${bearerAuth}"
      ],
      "env": {}
    }
  }
}`
    },
    continue: {
      label: "Continue.dev",
      config: `{
  "mcpServers": [
    {
      "name": "mission-control",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${baseUrl}",
        "--header",
        "Authorization:${bearerAuth}"
      ],
      "env": {}
    }
  ]
}`
    },
    zed: {
      label: "Zed Editor",
      config: `{
  "assistant": {
    "mcp": {
      "servers": {
        "mission-control": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "${baseUrl}"
            "--header",
            "Authorization:${bearerAuth}"
          ]
        }
      }
    }
  }
}`
    },
    direct: {
      label: "Direct HTTP",
      config: `curl -X POST ${baseUrl} \\
  -H "Authorization: ${bearerAuth}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {}
    },
    "id": 1
  }'`
    }
  };

  const getMcpUsageInstructions = (key: string) => {
    switch (key) {
      case "claude-desktop":
        return (
          <>
            <li>
              Add this configuration to{" "}
              <code className="rounded bg-blue-100 px-1">
                claude_desktop_config.json
              </code>{" "}
              located at:
            </li>
            <ul className="list-inside list-disc space-y-1 pl-6">
              <li>
                macOS:{" "}
                <code className="rounded bg-blue-100 px-1">
                  ~/Library/Application Support/Claude/
                </code>
              </li>
              <li>
                Windows:{" "}
                <code className="rounded bg-blue-100 px-1">
                  %APPDATA%\Claude\
                </code>
              </li>
              <li>
                Linux:{" "}
                <code className="rounded bg-blue-100 px-1">
                  ~/.config/Claude/
                </code>
              </li>
            </ul>
          </>
        );
      case "claude-code":
        return (
          <li>
            Add this configuration to{" "}
            <code className="rounded bg-blue-100 px-1">.mcp.json</code> file in
            your project root.
          </li>
        );
      default:
        return null;
    }
  };

  const usageInstructions = getMcpUsageInstructions(activeTab);

  return (
    <>
      <div className="mt-4">
        <Tabs activeTab={activeTab} onSelectTab={handleTabChange}>
          {Object.entries(mcpConfigs).map(([key, { label, config }]) => (
            <Tab key={key} label={label} value={key} className="p-4">
              <div className="max-h-64 overflow-y-auto">
                {key === "direct" ? (
                  <CodeBlock code={config} language="bash" />
                ) : (
                  <JSONViewer
                    code={config}
                    format="json"
                    showLineNo
                    hideCopyButton={false}
                  />
                )}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
      {usageInstructions && (
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-800">
            Usage Instructions:
          </h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {usageInstructions}
            <li>• Store it securely and never share it publicly</li>
          </ul>
        </div>
      )}
    </>
  );
}
