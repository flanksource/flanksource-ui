import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import YAML from "yaml";
import { IntegrationOption } from "../AddIntegrationOptionsList";
import FluxAddIntegrationCommand from "./FluxAddIntegrationCommand";
import HelmCLIAddIntegrationCommand from "./HelmCLIAddIntegrationCommand";

export type HelmChartValues = {
  apiVersion: string;
  name: string;
  description: string;
  type: string;
  version: string;
  appVersion: string;
};

type Props = {
  selectedOption: IntegrationOption;
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
      if (!selectedOption.chart) {
        return {} as HelmChartValues;
      }

      const response = await fetch(selectedOption.chart);
      const data = await response.text();
      return YAML.parse(data) as HelmChartValues;
    },
    enabled:
      !!selectedOption &&
      selectedOption.name !== "Custom Topology" &&
      selectedOption.name !== "Catalog Scraper"
  });

  if (isLoadingSpec || !helmChartValues) {
    return (
      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto">
      <Tabs
        activeTab={activeSpecTab}
        onSelectTab={(v) => setActiveSpecTab(v as any)}
      >
        <Tab
          label="Flux"
          value="Flux"
          className="flex flex-col gap-2 h-auto p-2"
        >
          <FluxAddIntegrationCommand
            formValues={formValues}
            helmChartValues={helmChartValues}
          />
        </Tab>

        <Tab
          className="flex flex-col gap-2 h-auto p-2"
          label="Helm CLI"
          value="Helm CLI"
        >
          <HelmCLIAddIntegrationCommand
            formValues={formValues}
            chartValues={helmChartValues}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
