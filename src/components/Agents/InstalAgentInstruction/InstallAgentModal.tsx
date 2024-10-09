import HelmInstallationSnippets, {
  ChartData
} from "@flanksource-ui/ui/HelmSnippet/HelmInstallationSnippets";
import { useMemo } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import { AgentFormValues } from "../Add/AddAgentForm";
import { useAgentsBaseURL } from "./useAgentsBaseURL";

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
  const baseUrl = useAgentsBaseURL();

  const data = useMemo(() => {
    const kubeOptions = agentFormValues?.kubernetes;
    const pushTelemetry = agentFormValues?.pushTelemetry ?? undefined;

    return [
      {
        chart: "mission-control-agent",
        namespace: "mission-control-agent",
        repoName: "flanksource",
        createNamespace: true,
        createRepo: true,
        updateHelmRepo: true,
        releaseName: "mc-agent",
        chartUrl: "https://flanksource.github.io/charts",
        // You can add more values here to be passed to the template for the
        // values section of the HelmRelease
        values: [
          {
            key: "upstream.createSecret",
            value: "true"
          },
          {
            key: "upstream.host",
            value: baseUrl
          },
          {
            key: "upstream.username",
            value: "token"
          },
          {
            key: "upstream.password",
            value: generatedAgent?.access_token
          },
          {
            key: "upstream.agentName",
            value: agentFormValues?.name
          },
          ...(pushTelemetry?.enabled
            ? [
                {
                  key: "pushTelemetry.enabled",
                  value: "true"
                },
                {
                  key: "pushTelemetry.topologyName",
                  value: `${pushTelemetry.topologyName}`
                }
              ]
            : [])
        ]
      },
      ...(kubeOptions?.enabled
        ? [
            {
              chart: "mission-control-kubernetes",
              namespace: "mission-control-agent",
              repoName: "flanksource",
              releaseName: "mc-agent-kubernetes",
              values: [
                {
                  key: "clusterName",
                  value: agentFormValues?.name
                },
                {
                  key: "scraper.schedule",
                  value: kubeOptions.schedule
                }
              ]
            }
          ]
        : [])
    ] satisfies ChartData[];
  }, [agentFormValues, baseUrl, generatedAgent]);

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
          <HelmInstallationSnippets charts={data} isWarningDisplayed />
        </div>
        <MoreInfoBox />
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
