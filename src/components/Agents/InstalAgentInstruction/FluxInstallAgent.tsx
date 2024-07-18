import { GeneratedAgent } from "@flanksource-ui/api/services/agents";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { AgentFormValues } from "../Add/AddAgentForm";
import { useAgentsBaseURL } from "./useAgentsBaseURL";

const fluxTemplate = `apiVersion: v1
kind: Namespace
metadata:
  name:  mission-control-agent
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
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control
  namespace: mission-control-agent
spec:
  chart:
    spec:
      chart: mission-control-agent
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control-agent
      interval: 1m
  values:
    upstream:
      createSecret: true
      host:  {{baseUrl}}
      username: token
      agentName: {{agentFormValues.name}}
      password: {{generatedAgent.access_token}}
{{#if kubeOptions}}
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
    clusterName: "{{agentFormValues.name}}"
    interval: "{{kubeOptions.interval}}"
{{/if}}
  `;

const template = Handlebars.compile(fluxTemplate);

type Props = {
  generatedAgent: GeneratedAgent;
  agentFormValues?: AgentFormValues;
};

export default function FluxInstallAgent({
  generatedAgent,
  agentFormValues
}: Props) {
  const kubeOptions = agentFormValues?.kubernetes;

  const baseUrl = useAgentsBaseURL();

  const yaml = useMemo(() => {
    return template(
      {
        generatedAgent,
        baseUrl,
        agentFormValues,
        kubeOptions: kubeOptions
          ? {
              interval: kubeOptions?.interval,
              exclusions: kubeOptions?.exclusions
            }
          : undefined
      },
      {}
    );
  }, [agentFormValues, baseUrl, generatedAgent, kubeOptions]);

  return (
    <div className="flex max-h-[30rem] flex-1 flex-col gap-4 overflow-y-auto rounded-md border border-gray-200 p-2 px-4">
      <JSONViewer code={yaml} format="yaml" showLineNo />
    </div>
  );
}
