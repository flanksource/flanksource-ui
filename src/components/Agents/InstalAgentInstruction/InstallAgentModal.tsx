import { useMemo, useState } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import { Tab, Tabs } from "../../../ui/Tabs/Tabs";
import { AgentFormValues } from "../Add/AddAgentForm";
import CLIInstallAgent from "./CLIInstallAgent";
import FluxInstallAgent from "./FluxInstallAgent";
import { useAgentsBaseURL } from "./useAgentsBaseURL";

export function WarningBox() {
  return (
    <div
      className="relative rounded border border-yellow-200 bg-yellow-100 px-4 py-3 text-yellow-700"
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

      <h3 className="text-lg font-bold">Next Steps</h3>

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

export type TemplateContextData = {
  namespace?: string;
  chart?: string;
  repoName?: string;
  values?: string[];
  kubeValues?: string[];
};

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
  const baseUrl = useAgentsBaseURL();

  const data = useMemo(() => {
    const kubeOptions = agentFormValues?.kubernetes;
    const pushTelemetry = agentFormValues?.pushTelemetry ?? undefined;

    return {
      chart: "mission-control-agent",
      namespace: "mission-control-agent",
      repoName: "flanksource",
      // You can add more values here to be passed to the template for the
      // values section of the HelmRelease
      values: [
        `upstream.createSecret=true`,
        `upstream.host=${baseUrl}`,
        `upstream.username=token`,
        `upstream.password=${generatedAgent?.access_token}`,
        `upstream.agentName=${agentFormValues?.name}`,
        ...(pushTelemetry?.enabled
          ? [
              `pushTelemetry.enabled=true`,
              `pushTelemetry.topologyName=${
                pushTelemetry.topologyName
              }-${agentFormValues?.name}`
            ]
          : [])
      ],
      // You can add more values here to be passed to the template for the
      // kubeValues section of the HelmRelease
      kubeValues: kubeOptions
        ? [
            `clusterName: "${agentFormValues?.name}"`,
            `scraper.schedule: "${kubeOptions.schedule}"`
          ]
        : []
    } satisfies TemplateContextData;
  }, [agentFormValues, baseUrl, generatedAgent]);

  console.log(JSON.stringify(data, null, 2));

  return (
    <Modal
      title={"Installation Instructions"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/installation/saas/agent"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <h3 className="text-lg font-bold">
          Install the Mission Control agent using instructions below
        </h3>
        <div className="flex flex-col">
          <Tabs
            activeTab={activeTab}
            onSelectTab={(v) => setActiveTab(v as any)}
          >
            <Tab className="flex flex-col gap-4 p-4" label="Flux" value="flux">
              <FluxInstallAgent data={data} />
              <WarningBox />
            </Tab>
            <Tab
              className="flex flex-col gap-4 p-4"
              label="Helm CLI"
              value="cli"
            >
              <CLIInstallAgent data={data} />
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
