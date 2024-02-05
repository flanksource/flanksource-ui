import { useState } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../../ui/Button";
import { Modal } from "../../../ui/Modal";
import { Tab, Tabs } from "../../Tabs/Tabs";
import { AgentFormValues } from "../Add/AddAgentForm";
import CLIInstallAgent from "./CLIInstallAgent";
import FluxInstallAgent from "./FluxInstallAgent";

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

      <strong>Next Steps</strong>

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
    <Modal
      title={"Installation Instructions"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-col gap-4 flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col ">
          <Tabs
            activeTab={activeTab}
            onSelectTab={(v) => setActiveTab(v as any)}
          >
            <Tab
              className="flex flex-col gap-4 p-4"
              label="Helm CLI"
              value="cli"
            >
              <div
                className="bg-red-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">
                  Access token will be shown only once. Please copy it and store
                  it securely.
                </span>
              </div>
              <CLIInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />
              <MoreInfoBox />
            </Tab>
            <Tab className="flex flex-col gap-4 p-4" label="Flux" value="flux">
              <div
                className="bg-red-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">
                  Access token will be shown only once. Please copy it and store
                  it securely.
                </span>
              </div>

              <FluxInstallAgent
                generatedAgent={generatedAgent}
                agentFormValues={agentFormValues}
              />

              <MoreInfoBox />
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
