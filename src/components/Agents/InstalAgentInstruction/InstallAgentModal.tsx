import { useState } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../Button";
import { Modal } from "../../Modal";
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
      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        <Tabs activeTab={activeTab} onSelectTab={(v) => setActiveTab(v as any)}>
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
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
