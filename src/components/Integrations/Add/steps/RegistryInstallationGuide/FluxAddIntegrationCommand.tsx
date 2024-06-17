import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { stringify } from "yaml";
import { HelmChartValues } from "./RegistryInstallationInstructions";

const fluxInstallationTemplate = `
{{#if createNamespace}}apiVersion: v1
kind: Namespace
metadata:
  name:  {{ namespace }}
---{{/if}}
{{#if createRepository}}apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: flanksource
  namespace: {{ namespace }}
spec:
  interval: 5m0s
  url: https://flanksource.github.io/charts
---{{/if}}
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
        name: "mission-control-" + formValues.name?.toLowerCase(),
        namespace: formValues.namespace
      },
      spec: {
        chart: {
          spec: {
            chart: helmChartValues.name,
            sourceRef: {
              kind: "HelmRepository",
              name: "flanksource"
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
    createNamespace: formValues.createNamespace,
    createRepository: formValues.createRepository,
    chartContent
  }).trim();

  return (
    <div className="flex flex-col flex-1  max-h-[calc(30vh)] border border-gray-200 rounded-md p-2 px-4 gap-4 overflow-y-auto">
      <JSONViewer code={fluxYaml} format="yaml" showLineNo />
    </div>
  );
}
