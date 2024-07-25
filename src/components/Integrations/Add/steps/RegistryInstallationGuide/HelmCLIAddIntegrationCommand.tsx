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

const helmInstallationCommandTemplate = `helm repo add flanksource https://flanksource.github.io/charts

helm repo update

helm install flanksource/{{ chartName }} -n "{{namespace}}" \\
{{#each flags}}
  --set {{key}}="{{value}}" \\
{{/each}}
  --create-namespace
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

  console.log(chartValues);

  const helmInstallationCommand = template({
    name: formValues.name,
    namespace: formValues.namespace,
    interval: formValues.interval,
    chartName: chartValues.name,
    version: chartValues?.version,
    flags
  });

  return (
    <CodeBlock
      className="flex flex-1 flex-col gap-2 rounded-lg bg-white p-4 pl-6 text-left text-sm text-black"
      code={helmInstallationCommand}
    />
  );
}
