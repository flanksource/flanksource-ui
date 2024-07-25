import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import YAML from "yaml";
import { CreateIntegrationOption } from "../AddIntegrationOptionsList";
import FluxAddIntegrationCommand from "./FluxAddIntegrationCommand";
import HelmCLIAddIntegrationCommand from "./HelmCLIAddIntegrationCommand";

export function WarningBox() {
  return (
    <div
      className="relative rounded border border-yellow-200 bg-yellow-100 px-4 py-3 text-yellow-700"
      role="alert"
    >
      <span className="block sm:inline">
        You will need to have Kubernetes chart installed in flux to use this
        option.
      </span>
    </div>
  );
}

export const selectedOptionChartsDetails = new Map<
  CreateIntegrationOption,
  {
    chart: string;
    schemaURL?: string;
  }
>([
  [
    "Flux",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/flux/Chart.yaml",

      schemaURL:
        "https://github.com/flanksource/mission-control-registry/raw/main/charts/flux/values.schema.json"
    }
  ],
  [
    "Kubernetes",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/kubernetes/Chart.yaml",
      schemaURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/kubernetes/values.schema.json"
    }
  ],
  [
    "Prometheus",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/prometheus/Chart.yaml",
      schemaURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/prometheus/values.schema.json"
    }
  ],
  [
    "Mission Control",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/mission-control/Chart.yaml",
      schemaURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/mission-control/values.schema.json"
    }
  ],
  [
    "AWS",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/aws/Chart.yaml",
      schemaURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/aws/values.schema.json"
    }
  ],
  [
    "Azure",
    {
      chart:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/azure/Chart.yaml",
      schemaURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/azure/values.schema.json"
    }
  ]
]);

export type HelmChartValues = {
  apiVersion: string;
  name: string;
  description: string;
  type: string;
  version: string;
  appVersion: string;
};

type Props = {
  selectedOption: CreateIntegrationOption;
  formValues: Record<string, any>;
};

export default function RegistryInstallationInstructions({
  selectedOption,
  formValues
}: Props) {
  const [activeSpecTab, setActiveSpecTab] = useState<"Helm CLI" | "Flux">(
    "Flux"
  );

  const { data: helmChartValues, isLoading: isLoadingSpec } = useQuery({
    queryKey: ["Github", "mission-control-registry", "values", selectedOption],
    queryFn: async () => {
      const opt = selectedOptionChartsDetails.get(selectedOption!);
      const response = await fetch(opt?.chart!);
      const data = await response.text();
      return YAML.parse(data) as HelmChartValues;
    },
    enabled:
      !!selectedOption &&
      selectedOption !== "Custom Topology" &&
      selectedOption !== "Catalog Scraper"
  });

  if (isLoadingSpec || !helmChartValues) {
    return (
      <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="flex h-auto flex-col">
      <Tabs
        activeTab={activeSpecTab}
        onSelectTab={(v) => setActiveSpecTab(v as any)}
      >
        <Tab
          label="Flux"
          value="Flux"
          className="flex h-auto flex-col gap-2 p-2"
        >
          <FluxAddIntegrationCommand
            formValues={formValues}
            helmChartValues={helmChartValues}
          />
          <WarningBox />
        </Tab>

        <Tab
          className="flex h-auto flex-col gap-2 p-2"
          label="Helm CLI"
          value="Helm CLI"
        >
          <HelmCLIAddIntegrationCommand
            formValues={formValues}
            chartValues={helmChartValues}
          />
          <WarningBox />
        </Tab>
      </Tabs>
    </div>
  );
}
