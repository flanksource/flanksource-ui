import { useState } from "react";
import { useAgentsBaseURL } from "@flanksource-ui/components/Agents/InstalAgentInstruction/useAgentsBaseURL";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthMode = "browser" | "token";
type InstallMode = "mac" | "linux" | "windows" | "go";

export default function SetupMissionControlCliModal({
  isOpen,
  onClose
}: Props) {
  const [authMode, setAuthMode] = useState<AuthMode>("browser");
  const [installMode, setInstallMode] = useState<InstallMode>("mac");
  const serverUrl = useAgentsBaseURL() || "https://your-mission-control/api";

  const releaseBaseUrl =
    "https://github.com/flanksource/mission-control/releases/latest/download";
  const macInstallCommand = `# Apple Silicon
curl -L -o faro "${releaseBaseUrl}/faro_darwin_arm64"
chmod +x faro
sudo mv faro /usr/local/bin/faro

# Intel Mac
curl -L -o faro "${releaseBaseUrl}/faro_darwin_amd64"
chmod +x faro
sudo mv faro /usr/local/bin/faro`;
  const linuxInstallCommand = `# x86_64 / amd64
curl -L -o faro "${releaseBaseUrl}/faro_linux_amd64"
chmod +x faro
sudo mv faro /usr/local/bin/faro

# arm64 / aarch64
curl -L -o faro "${releaseBaseUrl}/faro_linux_arm64"
chmod +x faro
sudo mv faro /usr/local/bin/faro`;
  const windowsInstallCommand = `# PowerShell - x86_64 / amd64
Invoke-WebRequest -Uri "${releaseBaseUrl}/faro_windows_amd64.exe" -OutFile "faro.exe"

# PowerShell - arm64
Invoke-WebRequest -Uri "${releaseBaseUrl}/faro_windows_arm64.exe" -OutFile "faro.exe"

# Move faro.exe to a directory on your PATH, then run:
faro.exe version`;
  const goInstallCommand = `go install github.com/flanksource/incident-commander/faro@latest`;
  const browserLoginCommand = `faro auth login --server "${serverUrl}"`;
  const tokenLoginCommand = `MISSION_CONTROL_TOKEN="<paste-token>"
faro auth login --server "${serverUrl}" --token "$MISSION_CONTROL_TOKEN"`;
  const verifyCommand = `faro whoami`;
  const commonCommands = `faro catalog list
faro playbook list
faro playbook run <namespace/name-or-id> key=value
faro refresh-cache`;

  return (
    <Modal
      title="Setup Mission Control CLI"
      onClose={onClose}
      open={isOpen}
      allowBodyScroll
      bodyClass="flex w-full flex-col"
    >
      <div className="flex w-full flex-col gap-4 p-4 text-sm text-gray-700">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Install the slim Mission Control client
          </h3>
          <p className="mt-1">
            <code className="rounded bg-gray-100 px-1">faro</code> is the
            lightweight CLI for remote Mission Control APIs. The full
            <code className="mx-1 rounded bg-gray-100 px-1">
              mission-control
            </code>
            binary exposes the same client commands.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-gray-900">1. Install</h4>
          <p>
            Download a prebuilt binary from GitHub Releases for your OS, or
            build/install with Go.
          </p>
          <Tabs<InstallMode>
            activeTab={installMode}
            onSelectTab={setInstallMode}
            contentClassName="flex flex-col border border-t-0 border-gray-300 bg-white p-4"
          >
            <Tab label="macOS" value="mac">
              <CodeBlock code={macInstallCommand} />
            </Tab>
            <Tab label="Linux" value="linux">
              <CodeBlock code={linuxInstallCommand} />
            </Tab>
            <Tab label="Windows" value="windows">
              <CodeBlock code={windowsInstallCommand} />
            </Tab>
            <Tab label="Go install" value="go">
              <CodeBlock code={goInstallCommand} />
            </Tab>
          </Tabs>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-gray-900">2. Authenticate</h4>
          <Tabs<AuthMode>
            activeTab={authMode}
            onSelectTab={setAuthMode}
            contentClassName="flex flex-col border border-t-0 border-gray-300 bg-white p-4"
          >
            <Tab label="Browser login" value="browser">
              <div className="flex flex-col gap-3">
                <p>
                  Opens your browser using the CLI OIDC flow and saves a local
                  context.
                </p>
                <CodeBlock code={browserLoginCommand} />
              </div>
            </Tab>
            <Tab label="Access token" value="token">
              <div className="flex flex-col gap-3">
                <p>
                  Use this when you want a dedicated token instead of logging in
                  as your user.
                </p>
                <CodeBlock code={tokenLoginCommand} />
              </div>
            </Tab>
          </Tabs>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-gray-900">3. Verify</h4>
          <CodeBlock code={verifyCommand} />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-gray-900">Useful commands</h4>
          <CodeBlock code={commonCommands} />
          <p className="text-xs text-gray-500">
            CLI contexts and tokens are stored under your user config directory
            in <code className="rounded bg-gray-100 px-1">mission-control</code>
            .
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} className="btn-secondary" />
      </div>
    </Modal>
  );
}
