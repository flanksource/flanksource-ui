import { Topology } from "@flanksource-ui/api/types/topology";
import { useMemo } from "react";
import {
  StatusInfo,
  StatusLine,
  StatusLineProps
} from "../StatusLine/StatusLine";

type HealthSummaryProps = {
  component: Topology;
  iconSize?: "2xs" | "2xsi" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  viewType?: "individual_level" | "children_level";
} & React.HTMLProps<HTMLDivElement>;

function getStatuses(summary?: Topology["summary"], url?: string) {
  if (!summary) {
    return [];
  }
  const statuses: StatusInfo[] = [];
  if (summary.healthy && summary.healthy > 0) {
    statuses.push({
      url: url ? `${url}?status=healthy` : "",
      label: summary.healthy.toString(),
      color: "green"
    });
  }
  if (summary.unhealthy && summary.unhealthy > 0) {
    statuses.push({
      url: url ? `${url}?status=unhealthy` : "",
      label: summary.unhealthy.toString(),
      color: "red"
    });
  }
  if (summary.warning && summary.warning > 0) {
    statuses.push({
      url: url ? `${url}?status=warning` : "",
      label: summary.warning.toString(),
      color: "orange"
    });
  }
  if (summary.unknown && summary.unknown > 0) {
    statuses.push({
      url: url ? `${url}?status=unknown` : "",
      label: summary.unknown.toString(),
      color: "gray"
    });
  }
  return statuses;
}

export function HealthSummary({
  component,
  iconSize = "sm",
  viewType = "individual_level",
  ...rest
}: HealthSummaryProps) {
  const statusLineInfo = useMemo(() => {
    const data: StatusLineProps = {
      icon: "",
      label: "",
      url: "",
      statuses: []
    };
    const childrenSummary = {
      healthy: 0,
      unhealthy: 0,
      warning: 0
    };
    component.components?.forEach((component) => {
      childrenSummary.healthy += component.summary?.checks?.healthy || 0;
      childrenSummary.unhealthy += component.summary?.checks?.unhealthy || 0;
      childrenSummary.warning += component.summary?.checks?.warning || 0;
    });
    const noSummary = !(
      childrenSummary.healthy ||
      childrenSummary.unhealthy ||
      childrenSummary.warning
    );
    if (viewType === "individual_level") {
      data.icon = component.icon;
      data.label = component.name;
      data.url = `/topology/${component.id}`;
      data.statuses = getStatuses(
        component?.summary,
        `/topology/${component.id}`
      );
    } else {
      data.label = `Health Summary: ${noSummary ? "NA" : ""}`;
      data.statuses = getStatuses(childrenSummary);
    }
    return data;
  }, [viewType, component]);

  return <StatusLine {...statusLineInfo} {...rest} />;
}
