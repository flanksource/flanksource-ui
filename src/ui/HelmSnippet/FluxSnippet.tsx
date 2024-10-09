import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { ChartData } from "./HelmInstallationSnippets";

// This a  Handlebars template for the HelmRelease to install the agent and the
// kubernetes agent if the user has enabled it.
const fluxTemplate = `{{#each charts }}
{{#if this.createNamespace}}
apiVersion: v1
kind: Namespace
metadata:
  name:  {{ this.namespace }}
---
{{/if}}
{{#if this.createRepo}}
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: {{ this.repoName }}
  namespace: {{ this.namespace }}
spec:
  interval: 5m0s
  url: {{{ this.chartUrl }}}
---
{{/if}}
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: {{{ this.chart }}}
  namespace: {{ this.namespace }}
spec:
  chart:
    spec:
      chart: {{{ this.chart }}}
      sourceRef:
        kind: HelmRepository
        name: {{{ this.repoName }}}
        namespace: {{{ this.namespace }}}
      interval: 5m0s
  values:
  {{#if this.valueFile }}
{{ this.valueFile }}
  {{/if}}
{{#each this.values}}
    {{{ this.key }}}: {{{ this.value }}}
{{/each}}
---
{{/each}}`;

const template = Handlebars.compile(fluxTemplate);

type Props = {
  data: ChartData[];
};

export default function FluxSnippet({ data }: Props) {
  const yaml = useMemo(() => {
    return template(
      {
        charts: data.map((data) => ({
          ...data,
          chartUrl: data?.chartUrl ?? "https://flanksource.github.io/charts",
          valueFile: data?.valueFile
            ? // Indent the valueFile content
              data?.valueFile?.replace(/^/gm, "    ")
            : undefined
        }))
      },
      {}
    );
  }, [data]);

  return (
    <div className="flex max-h-[30rem] flex-1 flex-col gap-4 overflow-y-auto rounded-md border border-gray-200 p-2 px-4">
      <JSONViewer code={yaml} format="yaml" showLineNo />
    </div>
  );
}
