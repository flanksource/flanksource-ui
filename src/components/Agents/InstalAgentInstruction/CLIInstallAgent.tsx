import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { TemplateContextData } from "./InstallAgentModal";

// This a  Handlebars template for the Helm command to install the agent and the
// kubernetes agent if the user has enabled it.
const helmCommand = `helm repo add {{ chart }} {{ repoName }}/{{ chart }}

helm repo update

helm install mc-agent flanksource/mission-control-agent -n "{{{ namespace }}}" \\
  {{#each values}}
  --set {{{ this }}} \\
  {{/each}}
  --create-namespace

{{#if kubeValues }}
helm install mc-agent-kubernetes flanksource/mission-control-kubernetes -n "{{{ namespace }}}"  \\
  {{#each kubeValues}}
  --set {{{ this }}} \\
  {{/each}}
{{/if}}
`;

const template = Handlebars.compile(helmCommand);

type Props = {
  data: TemplateContextData;
};

export default function CLIInstallAgent({ data }: Props) {
  const helmCommandTemplate = useMemo(() => {
    return template(data, {});
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-2">
      <p>Copy the following command to install agent</p>
      <CodeBlock code={helmCommandTemplate} />
    </div>
  );
}
