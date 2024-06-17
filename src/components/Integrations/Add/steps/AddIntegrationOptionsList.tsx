import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { features } from "@flanksource-ui/services/permissions/features";
import CardButton from "@flanksource-ui/ui/Buttons/CardButton";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { LogsIcon } from "@flanksource-ui/ui/Icons/LogsIcon";
import { SearchInListIcon } from "@flanksource-ui/ui/Icons/SearchInListIcon";
import { TopologyIcon } from "@flanksource-ui/ui/Icons/TopologyIcon";
import { useMemo } from "react";

const Kubernetes =
  "Prerequisite: The Kubernetes bundle is required for this integration.";

export type IntegrationOption = {
  dependencies?: string[];
  name: string;
  help?: string;
  icon?: React.ReactNode;
  directory?: boolean;
  chart?: string;
  schemaURL?: string;
  category: "Add Via GitOps" | "Add Directly" | "Scraper" | "Topology";
};

var integrations = [
  {
    category: "Add Via GitOps",
    help: "registry/aws",
    icon: <Icon key="aws-icon" name="aws" className="w-6 h-auto" />,
    name: "AWS",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/aws/Chart.yaml",
    schemaURL:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/aws/values.schema.json"
  },

  {
    category: "Add Via GitOps",
    help: "registry/azure",
    icon: <Icon key="azure-icon" name="azure" className="w-6 h-auto" />,
    name: "Azure",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/azure/Chart.yaml",
    schemaURL:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/azure/values.schema.json"
  },
  {
    category: "Add Via GitOps",
    help: "registry/kubernetes",
    icon: (
      <Icon key="kubernetes-icon" name="kubernetes" className="w-6 h-auto" />
    ),
    name: "Kubernetes",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/kubernetes/Chart.yaml",
    schemaURL:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/kubernetes/values.schema.json"
  },
  {
    category: "Add Via GitOps",
    help: "registry/prometheus",
    icon: (
      <Icon key="prometheus-icon" name="prometheus" className="w-6 h-auto" />
    ),
    name: "Prometheus",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/prometheus/Chart.yaml",
    schemaURL:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/prometheus/values.schema.json"
  },
  {
    dependencies: [Kubernetes],
    category: "Add Via GitOps",
    icon: <Icon key="flux-icon" name="flux" className="w-6 h-auto" />,
    name: "Flux",
    help: "registry/flux",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/flux/Chart.yaml",

    schemaURL:
      "https://github.com/flanksource/mission-control-registry/raw/main/charts/flux/values.schema.json"
  },

  {
    dependencies: [Kubernetes],
    category: "Add Via GitOps",
    help: "registry/argocd",
    icon: <Icon key="argo-icon" name="argo" className="w-6 h-auto" />,
    name: "Argo",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/argocd/Chart.yaml",

    schemaURL:
      "https://github.com/flanksource/mission-control-registry/raw/main/charts/argocd/values.schema.json"
  },
  {
    category: "Add Via GitOps",
    help: "registry/mission-control",
    icon: (
      <Icon
        key="mission-control-icon"
        name="mission-control"
        className="w-6 h-auto"
      />
    ),
    name: "Mission Control",
    chart:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/mission-control/Chart.yaml",
    schemaURL:
      "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/mission-control/values.schema.json"
  },

  {
    category: "Add Directly",
    help: "topology",
    directory: true,

    icon: <TopologyIcon key="topology-icon" className="w-6 h-auto" />,
    name: "Custom Topology"
  },
  {
    category: "Add Directly",
    help: "config-db",
    directory: true,

    icon: <SearchInListIcon key="catalog-icon" className="w-6 h-auto" />,
    name: "Catalog Scraper"
  },

  {
    category: "Add Directly",
    directory: true,
    help: "logging",
    icon: <LogsIcon key="logs-icon" className="w-6 h-auto" />,
    name: "Log Backends"
  }
] as IntegrationOption[];

type AddTopologyOptionsListProps = {
  onSelectOption: (options: IntegrationOption) => void;
};

export default function AddIntegrationOptionsList({
  onSelectOption
}: AddTopologyOptionsListProps) {
  const { isFeatureDisabled } = useFeatureFlagsContext();

  const isLogsFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.logs),
    [isFeatureDisabled]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        <div className="font-semibold px-2">Add via GitOps</div>
        <div className="flex flex-wrap">
          {Array.from(integrations)
            .filter((value) => value.category === "Add Via GitOps")
            .map((item: IntegrationOption) => {
              return (
                <CardButton
                  key={item.name}
                  text={item.name}
                  icon={item.icon}
                  onClick={() => onSelectOption(item)}
                />
              );
            })}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="font-semibold px-2">Add Directly</div>
        <div className="flex flex-wrap">
          {Array.from(integrations)
            .filter((value) => value.category === "Add Directly")
            .filter(
              (value) => value.name !== "Log Backends" || !isLogsFeatureDisabled
            )
            .map((item) => {
              return (
                <CardButton
                  key={item.name}
                  text={item.name}
                  icon={item.icon}
                  onClick={() => onSelectOption(item)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
