import { GeneratedAgent } from "../../../api/services/agents";
import { JSONViewer } from "../../JSONViewer";
import { AgentFormValues } from "../Add/AddAgentForm";

type Props = {
  generatedAgent: GeneratedAgent;
  agentFormValues?: AgentFormValues;
};

export default function FluxInstallAgent({
  generatedAgent,
  agentFormValues
}: Props) {
  const baseUrl = window.location.origin;

  const kubeOptions = agentFormValues?.kubernetes;

  const yaml = `apiVersion: v1
kind: Namespace
metadata:
  name:  mission-control
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: flanksource
  namespace: mission-control
spec:
  interval: 5m0s
  url: https://flanksource.github.io/charts
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control
  namespace: mission-control
spec:
  chart:
    spec:
      chart: mission-control-agent
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control
      interval: 1m
  values:
    upstream:
      createSecret: true
      host:  ${baseUrl}
      username: ${generatedAgent.username}
      password: ${generatedAgent.access_token}
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control-kubernetes
  namespace: mission-control
spec:
  chart:
    spec:
      chart: mission-control-kubernetes
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control
  values:
    clusterName: ${agentFormValues?.name}
    interval: ${kubeOptions?.interval}
  `;

  return (
    <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
      <JSONViewer code={yaml} format="yaml" showLineNo />
    </div>
  );
}
