import Handlebars from "handlebars";
import { useMemo } from "react";
import { GeneratedAgent } from "../../../api/services/agents";
import CodeBlock from "../../../ui/CodeBlock/CodeBlock";
import { AgentFormValues } from "../Add/AddAgentForm";

const helmCommand = `helm repo add flanksource https://flanksource.github.io/charts

helm repo update

helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \\
  --set upstream.createSecret=true \\
  --set upstream.host={{baseUrl}} \\
  --set upstream.username=token \\
  --set upstream.password={{generatedAgent.access_token}} \\
  --create-namespace

{{#if kubeOptions}}
helm install mc-agent-kubernetes flanksource/mission-control-kubernetes -n "mission-control-agent"  \\
  --set scraper.name="{{agentFormValues.name}}" \\
  --set scraper.interval="{{kubeOptions.interval}}" \\
  {{#if kubeOptions.exclusions}}
  --set scraper.exclusions.name={{kubeOptions.exclusions}}
  {{/if}}
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
  const baseUrl = window.location.origin;

  const kubeOptions = agentFormValues?.kubernetes;

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
    <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
      <p>Copy the following command to install agent</p>
      <CodeBlock code={helmCommandTemplate} />
    </div>
  );
}
