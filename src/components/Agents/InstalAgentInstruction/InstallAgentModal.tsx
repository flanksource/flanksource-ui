import { useState } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import { Tab, Tabs } from "../../../ui/Tabs/Tabs";
import { AgentFormValues } from "../Add/AddAgentForm";
import CLIInstallAgent from "./CLIInstallAgent";
import FluxInstallAgent from "./FluxInstallAgent";

export function WarningBox() {
  return (
    <div
      className="bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <span className="block sm:inline">
        Access token will be shown only once. Please copy it and store it
        securely.
      </span>
    </div>
  );
}

export function MoreInfoBox() {
  return (
    <div className="flex flex-col gap-2 px-2">
      <p>
        See the{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://docs.flanksource.com/registry/kubernetes/"
          target="_blank"
          rel="noreferrer"
        >
          Kubernetes
        </a>{" "}
        for more options on fine-tuning the import of Kubernetes resources.
      </p>

      <h3 className="font-bold text-lg">Next Steps</h3>

      <ul className="list-disc px-6">
        <li>
          Review the dashboard and catalog pages to verify the data being
          imported.
        </li>
        <li>
          Create new{" "}
          <a
            href="https://docs.flanksource.com/canary-checker/getting-started/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            health checks
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            className="text-blue-500 hover:underline"
            href="https://docs.flanksource.com/config-db/overview"
            rel="noreferrer"
          >
            catalog scrapers
          </a>{" "}
          using Gitops in the agent cluster.{" "}
        </li>
        <li>
          Create new{" "}
          <a
            href="https://docs.flanksource.com/topology/overview"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            topologies
          </a>{" "}
          to model your system -Topologies can be created either in the agent
          cluster or centrally to create views that span multiple agents.
        </li>
      </ul>
    </div>
  );
}

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
    <Modal title={"Agent Installation"} onClose={onClose} open={isOpen}>
      <div className="flex flex-col gap-4 flex-1 p-4 overflow-y-auto">
        <h3 className="font-bold text-lg">
          Install the Mission Control agent using instructions below
        </h3>
        <div className="flex flex-col ">
          <Tabs
            activeTab={activeTab}
            onSelectTab={(v) => setActiveTab(v as any)}
          >
            <Tab className="flex flex-col gap-4 p-4" label="Flux" value="flux">
              <FluxInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />
              <WarningBox />
            </Tab>
            <Tab
              className="flex flex-col gap-4 p-4"
              label="Helm CLI"
              value="cli"
            >
              <CLIInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />
              <WarningBox />
            </Tab>
          </Tabs>
        </div>
        <MoreInfoBox />
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
