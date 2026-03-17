import { ConfigAccessGroupBy } from "@flanksource-ui/api/types/configs";

export const paramsToReset = ["pageIndex"];

export function toTriStateIncludeParamValue(value: string) {
  return `${value.replaceAll(",", "||||").replaceAll(":", "____")}:1`;
}

export function hasConfigAccessDrillDownFilter(params: URLSearchParams) {
  return params.has("config_id") || params.has("user") || params.has("role");
}

export function resolveConfigAccessGroupBy(
  params: URLSearchParams
): ConfigAccessGroupBy | null {
  const rawGroupBy = params.get("groupBy");
  const hasDrillDownFilter = hasConfigAccessDrillDownFilter(params);

  if (rawGroupBy === "user" || rawGroupBy === "config") {
    return rawGroupBy;
  }

  if (rawGroupBy === "none" || hasDrillDownFilter) {
    return null;
  }

  return "config";
}
