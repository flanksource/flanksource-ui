import { GeneratedAgent } from "@flanksource-ui/api/services/agents";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { AgentFormValues } from "../Add/AddAgentForm";
import { useAgentsBaseURL } from "./useAgentsBaseURL";

const helmCommand = `helm repo add flanksource https://flanksource.github.io/charts

helm repo update

helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \\
  --set upstream.createSecret=true \\
  --set upstream.host={{baseUrl}} \\
  --set upstream.username=token \\
  --set upstream.password={{generatedAgent.access_token}} \\
  --set upstream.agentName={{agentFormValues.name}} \\
  --create-namespace

{{#if kubeOptions}}
helm install mc-agent-kubernetes flanksource/mission-control-kubernetes -n "mission-control-agent"  \\
  --set scraper.clusterName="{{agentFormValues.name}}" \\
  --set scraper.interval="{{kubeOptions.interval}}"
{{/if}}
`;

const template = Handlebars.compile(helmCommand);

type Props = {
  generatedAgent: GeneratedAgent;
  agentFormValues?: AgentFormValues;
};

export default function CLIInstallAgent({
  generatedAgent,
  agentFormValues
}: Props) {
  const kubeOptions = agentFormValues?.kubernetes;

  const baseUrl = useAgentsBaseURL();

  const helmCommandTemplate = useMemo(() => {
    return template(
      {
        generatedAgent,
        baseUrl,
        agentFormValues,
        kubeOptions: kubeOptions
          ? {
              interval: kubeOptions?.interval,
              exclusions: `{${kubeOptions?.exclusions?.join(",")}}`
            }
          : undefined
      },
      {}
    );
  }, [agentFormValues, baseUrl, generatedAgent, kubeOptions]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-2">
      <p>Copy the following command to install agent</p>
      <CodeBlock code={helmCommandTemplate} />
    </div>
  );
}
