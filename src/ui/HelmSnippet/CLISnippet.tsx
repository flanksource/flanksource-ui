import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import Handlebars from "handlebars";
import { useMemo } from "react";
import { ChartData } from "./HelmInstallationSnippets";

// This a  Handlebars template for the Helm command to install the agent and the
// kubernetes agent if the user has enabled it.
const helmCommand = `{{#each charts}}
{{#if this.valueFile }}
cat > values.yaml << EOF
{{ this.valueFile }}
EOF

{{/if}}
{{#if this.createRepo }}
helm repo add {{{ this.repoName }}} {{{ this.chartUrl }}}
{{/if}}
{{#if this.updateHelmRepo }}
helm repo update
{{/if}}

helm install {{{ this.chart }}} {{{ this.repoName }}}/{{{ this.chart }}} -n "{{{ this.namespace }}}" \\
  {{#each this.values}}
  --set {{{ @key }}}={{{ this }}} {{#unless @last}} \\ \n{{/unless}}{{/each}}{{#if this.createNamespace }} \\
  --create-namespace {{#if this.valueFile }} \\ {{/if}}
{{/if}} {{#if this.valueFile }} \\
  --set-file values.yaml {{#if this.args}} \\ {{/if}}
{{/if }} {{#if this.args}} \\
  {{#each this.args}}
    {{ this }} {{#unless @last}} \\ {{/unless}}
  {{/each}}
{{/if}} {{#if this.wait }} \\
  --wait
{{/if}}

{{/each}}
`;

const template = Handlebars.compile(helmCommand);

type Props = {
  data: ChartData[];
};

// @ts-ignore
export function flattenObj(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (typeof obj[key] == "object") {
      flattenObj(obj[key], propName, res);
    } else {
      // @ts-ignore
      res[propName] = obj[key];
    }
  }
  return res;
}

export default function CLIInstallAgent({ data }: Props) {
  const helmCommandTemplate = useMemo(() => {
    let ctx = {
      charts: data.map((chart) => {
        return {
          ...chart,
          chartUrl: chart.chartUrl ?? "https://flanksource.github.io/charts",
          // @ts-ignore
          values: flattenObj(chart.values)
        };
      })
    };
    return template(ctx);
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-2">
      <p>Copy the following command to install the chart</p>
      <CodeBlock code={helmCommandTemplate} />
    </div>
  );
}
