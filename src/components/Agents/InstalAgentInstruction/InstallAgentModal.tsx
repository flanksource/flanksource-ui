import { useState } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../../ui/Button";
import { Modal } from "../../../ui/Modal";
import { Tab, Tabs } from "../../Tabs/Tabs";
import { AgentFormValues } from "../Add/AddAgentForm";
import CLIInstallAgent from "./CLIInstallAgent";
import FluxInstallAgent from "./FluxInstallAgent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  generatedAgent: GeneratedAgent;
  agentFormValues?: AgentFormValues;
};

export default function InstallAgentModal({
  isOpen,
  onClose,
  generatedAgent,
  agentFormValues
}: Props) {
  const [activeTab, setActiveTab] = useState<"cli" | "flux">("cli");

  return (
    <Modal
      title={"Installation Instructions"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-col gap-4 flex-1 p-4 overflow-y-auto">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">
            Access token will be shown only once. Please copy it and store it
            securely.
          </span>
        </div>
        <div className="flex flex-col ">
          <Tabs
            activeTab={activeTab}
            onSelectTab={(v) => setActiveTab(v as any)}
          >
            <Tab label="Helm CLI" value="cli">
              <CLIInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />
            </Tab>
            <Tab label="Flux" value="flux">
              <FluxInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
