import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { useMemo } from "react";
import { ChartData } from "./HelmInstallationSnippets";
import { stringify } from "yaml";
function generateFluxManifests(charts: ChartData[]) {
  const manifests = charts.flatMap((chart) => {
    const documents = [];

    if (chart.createNamespace) {
      documents.push({
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: chart.namespace
        }
      });
    }

    if (chart.createRepo) {
      documents.push({
        apiVersion: "source.toolkit.fluxcd.io/v1",
        kind: "HelmRepository",
        metadata: {
          name: chart.repoName,
          namespace: chart.namespace
        },
        spec: {
          interval: "5m",
          url: chart.chartUrl
        }
      });
    }

    documents.push({
      apiVersion: "helm.toolkit.fluxcd.io/v2",
      kind: "HelmRelease",
      metadata: {
        name: chart.chart,
        namespace: chart.namespace
      },
      spec: {
        interval: "5m",
        timeout: "10m",
        chart: {
          spec: {
            chart: chart.chart,
            sourceRef: {
              kind: "HelmRepository",
              name: chart.repoName,
              namespace: chart.namespace
            },
            interval: "5m0s"
          }
        },
        values: chart.values
      }
    });

    return documents;
  });

  return manifests.map((doc) => stringify(doc)).join("\n---\n");
}

type Props = {
  data: ChartData[];
};

export default function FluxSnippet({ data }: Props) {
  const yaml = useMemo(() => {
    return generateFluxManifests(
      data.map((data) => ({
        ...data,
        chartUrl: data?.chartUrl ?? "https://flanksource.github.io/charts",
        valueFile: data?.valueFile
          ? // Indent the valueFile content
            data?.valueFile?.replace(/^/gm, "    ")
          : undefined
      }))
    );
  }, [data]);
  return (
    <div className="flex max-h-[30rem] flex-1 flex-col gap-4 overflow-y-auto rounded-md border border-gray-200 p-2 px-4">
      <JSONViewer code={yaml} format="yaml" showLineNo />
    </div>
  );
}
