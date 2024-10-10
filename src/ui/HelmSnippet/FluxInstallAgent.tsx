import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { TemplateContextData } from "./HelmInstallationSnippets";

// This a  Handlebars template for the HelmRelease to install the agent and the
// kubernetes agent if the user has enabled it.
const fluxTemplate = `{{#if createNamespace}}
apiVersion: v1
kind: Namespace
metadata:
  name:  {{ namespace }}
---
{{/if}}
{{#if createRepository}}
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: {{ repoName }}
  namespace: {{ namespace }}
spec:
  interval: 5m0s
  url: https://flanksource.github.io/charts
---
{{/if}}
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: {{{ chart }}}
  namespace: {{ namespace }}
spec:
  chart:
    spec:
      chart: {{{ chart }}}
      sourceRef:
        kind: HelmRepository
        name: {{{ repoName }}}
        namespace: {{{ namespace }}}
      interval: 5m0s
  values:
{{#each values}}
    {{{ this.key }}}: {{{ this.value }}}
{{/each}}

{{#if kubeValues}}
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control-kubernetes
  namespace: mission-control-agent
spec:
  chart:
    spec:
      chart: mission-control-kubernetes
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control-agent
  values:
  {{#if valueFile }}
{{ valueFile }}
  {{/if}}
  {{#each  kubeValues}} 
    {{{ this.key }}}: {{{ this.value }}}
  {{/each}}
{{/if}}
  `;

const template = Handlebars.compile(fluxTemplate);

type Props = {
  data: TemplateContextData;
};

export default function FluxInstallAgent({ data }: Props) {
  const yaml = useMemo(() => {
    console.log({ data });
    return template(
      {
        ...data,
        valueFile: data?.valueFile
          ? // Indent the valueFile content
            data?.valueFile?.replace(/^/gm, "    ")
          : undefined
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
