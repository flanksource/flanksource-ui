import { Icon } from "@flanksource-ui/components/Icon";
import { LogsIcon } from "@flanksource-ui/components/Icons/LogsIcon";
import { SearchInListIcon } from "@flanksource-ui/components/Icons/SearchInListIcon";
import { TopologyIcon } from "@flanksource-ui/components/Icons/TopologyIcon";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { features } from "@flanksource-ui/services/permissions/features";
import { useMemo } from "react";
import { TupleToUnion } from "type-fest";

export const createIntegrationOption = [
  "AWS",
  "Azure",
  "Prometheus",
  "Flux",
  "Kubernetes",
  "Mission Control",
  "Log Backends",
  "Custom Topology",
  "Catalog Scraper"
] as const;

export type CreateIntegrationOption = TupleToUnion<
  typeof createIntegrationOption
>;

type CreateIntegrationOptionMap = {
  name: CreateIntegrationOption;
  icon: React.ReactNode;
  category: "Add Via GitOps" | "Add Directly";
};

export const options = new Map<
  CreateIntegrationOption,
  CreateIntegrationOptionMap
>([
  [
    "AWS",
    {
      category: "Add Via GitOps",
      icon: <Icon key="aws-icon" name="aws" />,
      name: "AWS"
    }
  ],
  [
    "Azure",
    {
      category: "Add Via GitOps",
      icon: <Icon key="azure-icon" name="azure" />,
      name: "Azure"
    }
  ],
  [
    "Prometheus",
    {
      category: "Add Via GitOps",
      icon: <Icon key="prometheus-icon" name="prometheus" />,
      name: "Prometheus"
    }
  ],
  [
    "Flux",
    {
      category: "Add Via GitOps",
      icon: <Icon key="flux-icon" name="flux" />,
      name: "Flux"
    }
  ],
  [
    "Kubernetes",
    {
      category: "Add Via GitOps",
      icon: <Icon key="kubernetes-icon" name="kubernetes" />,
      name: "Kubernetes"
    }
  ],
  [
    "Mission Control",
    {
      category: "Add Via GitOps",
      icon: <Icon key="mission-control-icon" name="mission-control" />,
      name: "Mission Control"
    }
  ],
  [
    "Custom Topology",
    {
      category: "Add Directly",
      icon: <TopologyIcon className="h-5 w-5" key="topology-icon" />,
      name: "Custom Topology"
    }
  ],
  [
    "Catalog Scraper",
    {
      category: "Add Directly",
      icon: <SearchInListIcon className="h-5 w-5" key="catalog-icon" />,
      name: "Catalog Scraper"
    }
  ],
  [
    "Log Backends",
    {
      category: "Add Directly",
      icon: <LogsIcon className="h-5 w-5" key="logs-icon" />,
      name: "Log Backends"
    }
  ]
]);

export const IntegrationsOptionToIconMap = new Map<
  CreateIntegrationOption,
  React.ReactNode
>([
  ["AWS", <Icon key="aws-icon" name="aws" />],
  ["Azure", <Icon key="azure-icon" name="azure" />],
  ["Prometheus", <Icon key="prometheus-icon" name="prometheus" />],
  ["Flux", <Icon key="flux-icon" name="flux" />],
  ["Kubernetes", <Icon key="kubernetes-icon" name="kubernetes" />],
  [
    "Mission Control",
    <Icon key="mission-control-icon" name="mission-control" />
  ],
  ["Custom Topology", <TopologyIcon className="h-5 w-5" key="topology-icon" />],
  [
    "Catalog Scraper",
    <SearchInListIcon className="h-5 w-5" key="catalog-icon" />
  ],
  ["Log Backends", <LogsIcon className="h-5 w-5" key="logs-icon" />]
]);

type AddTopologyOptionsListProps = {
  onSelectOption: (options: CreateIntegrationOption) => void;
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
          {Array.from(options)
            .filter(([key, value]) => value.category === "Add Via GitOps")
            .map(([, item]) => {
              return (
                <div className="flex flex-col w-1/4 p-2" key={item.name}>
                  <div
                    role="button"
                    className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                    onClick={(e) => {
                      onSelectOption(item.name);
                    }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      {IntegrationsOptionToIconMap.get(item.name)}
                    </div>
                    <div>{item.name}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="font-semibold px-2">Add Directly</div>
        <div className="flex flex-wrap">
          {Array.from(options)
            .filter(([key, value]) => value.category === "Add Directly")
            .filter(
              ([key, value]) =>
                value.name !== "Log Backends" || !isLogsFeatureDisabled
            )
            .map(([, item]) => {
              return (
                <div className="flex flex-col w-1/4 p-2" key={item.name}>
                  <div
                    role="button"
                    className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                    onClick={(e) => {
                      onSelectOption(item.name);
                    }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      {IntegrationsOptionToIconMap.get(item.name)}
                    </div>
                    <div>{item.name}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
