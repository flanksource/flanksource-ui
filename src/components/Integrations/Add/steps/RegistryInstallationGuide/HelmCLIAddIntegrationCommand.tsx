import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import Handlebars from "handlebars";
import { HelmChartValues } from "./RegistryInstallationInstructions";

export function yamlObjectToCliFlags(
  yamlObject: Record<string, any>,
  prefix = ""
): {
  key: string;
  value: string;
}[] {
  const prefixWithDot = prefix ? `${prefix}.` : "";
  const flags = Object.entries(yamlObject ?? {}).map(([key, value]) => {
    if (Array.isArray(value)) {
      return yamlObjectToCliFlags(value, `${prefixWithDot}${key}`);
    }
    if (typeof value === "object") {
      return yamlObjectToCliFlags(value, `${prefixWithDot}${key}`);
    }
    return {
      key: `${prefixWithDot}${key}`,
      value
    };
  });
  return flags.flat();
}

const helmInstallationCommandTemplate = `
{{#if createRepository }}helm repo add flanksource https://flanksource.github.io/charts
helm repo update{{/if}}

helm install mission-control-{{name}} flanksource/{{ chartName }}  \\
  -n "{{namespace}}" \\
{{#each flags}}
  --set {{key}}="{{value}}" \\
{{/each}}
{{#if createNamespace}}  --create-namespace{{/if}}
`;

const template = Handlebars.compile(helmInstallationCommandTemplate);

type Props = {
  formValues: Record<string, any>;
  chartValues: HelmChartValues;
};

export default function HelmCLIAddIntegrationCommand({
  chartValues,
  formValues
}: Props) {
  const flags = yamlObjectToCliFlags(formValues.chartValues);

  const helmInstallationCommand = template({
    name: formValues.name.toLowerCase(),
    createNamespace: formValues.createNamespace,
    createRepository: formValues.createRepository,
    namespace: formValues.namespace,
    interval: formValues.interval,
    chartName: chartValues.name,
    version: chartValues?.version,
    flags
  }).trim();

  return (
    <CodeBlock
      className="flex flex-col flex-1 text-sm text-left gap-2 bg-white text-black rounded-lg p-4 pl-6"
      code={helmInstallationCommand}
    />
  );
}
