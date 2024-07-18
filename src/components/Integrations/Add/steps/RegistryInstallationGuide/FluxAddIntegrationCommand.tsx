import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { stringify } from "yaml";
import { HelmChartValues } from "./RegistryInstallationInstructions";

const fluxInstallationTemplate = `apiVersion: v1
kind: Namespace
metadata:
  name:  {{ namespace }}
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: flanksource
  namespace: mission-control-agent
spec:
  interval: 5m0s
  url: https://flanksource.github.io/charts
---
{{ chartContent }}
`;

const template = Handlebars.compile(fluxInstallationTemplate, {
  noEscape: true
});

type Props = {
  formValues: Record<string, any>;
  helmChartValues: HelmChartValues;
};

export default function FluxAddIntegrationCommand({
  formValues,
  helmChartValues
}: Props) {
  const chartContent = useMemo(() => {
    const obj = {
      apiVersion: "helm.toolkit.fluxcd.io/v2beta1",
      kind: "HelmRelease",
      metadata: {
        name: "mission-control",
        namespace: formValues.namespace
      },
      spec: {
        chart: {
          spec: {
            chart: helmChartValues.name,
            sourceRef: {
              kind: "HelmRepository",
              name: "flanksource",
              namespace: "mission-control"
            },
            interval: "1m"
          },
          values: {
            ...formValues.chartValues
          }
        }
      }
    };
    return stringify(obj, {
      keepUndefined: true
    });
  }, [formValues, helmChartValues]);

  const fluxYaml = template({
    namespace: formValues.namespace,
    chartContent
  });

  return (
    <div className="flex max-h-[30rem] flex-1 flex-col gap-4 overflow-y-auto rounded-md border border-gray-200 p-2 px-4">
      <JSONViewer code={fluxYaml} format="yaml" showLineNo />
    </div>
  );
}
