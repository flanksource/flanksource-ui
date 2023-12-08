import { useContext, useMemo } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import { AuthContext } from "../../../context";
import { AgentFormValues } from "../Add/AddAgentForm";
import CodeBlock from "../../CodeBlock/CodeBlock";

type Props = {
  generatedAgent: GeneratedAgent;
  agentFormValues?: AgentFormValues;
};

export default function CLIInstallAgent({
  generatedAgent,
  agentFormValues
}: Props) {
  const { backendUrl } = useContext(AuthContext);

  const kubeOptions = agentFormValues?.kubernetes;

  const kubeOptionsString = useMemo(() => {
    if (!kubeOptions) {
      return "";
    }
    return `\
--set scrapers.kubernetes.clusterName="${agentFormValues?.name}" \
--set scrapers.kubernetes.interval="${kubeOptions.interval ?? "30m"}" \
${
  kubeOptions.exclusions?.length > 0
    ? `--set "scrapers.kubernetes.exclusions={${kubeOptions.exclusions?.join(
        ","
      )}}"`
    : ""
}`;
  }, [agentFormValues?.name, kubeOptions]);

  return (
    <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
      <p>Copy the following command to install agent</p>
      <CodeBlock
        code={`helm repo add flanksource https://flanksource.github.io/charts

helm repo update

helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \
--set upstream.createSecret=true \
--set upstream.host=${backendUrl} \
--set upstream.username=${generatedAgent.username} \
--set upstream.password=${generatedAgent.access_token}

helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \
--set upstream.createSecret=true \
--set upstream.host=${backendUrl} \
--set upstream.username=${generatedAgent.username} \
--set upstream.password=${generatedAgent.access_token}
${kubeOptionsString}
`}
      />
    </div>
  );
}
