import { useMemo } from "react";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";

export function useConfigChangesArbitraryFilters(paramPrefix?: string) {
  const [params] = usePrefixedSearchParams(paramPrefix, false);

  const configId = params.get("id") ?? undefined;
  const changeSummary = params.get("summary") ?? undefined;
  const source = params.get("source") ?? undefined;
  const createdBy = params.get("created_by") ?? undefined;
  const externalCreatedBy = params.get("external_created_by") ?? undefined;

  return useMemo(() => {
    const filter = new Map<string, string>();
    if (configId) {
      filter.set("id", configId);
    }
    if (changeSummary) {
      filter.set("summary", changeSummary);
    }
    if (source) {
      filter.set("source", source);
    }
    if (createdBy) {
      filter.set("created_by", createdBy);
    }
    if (externalCreatedBy) {
      filter.set("external_created_by", externalCreatedBy);
    }
    return Object.fromEntries(filter);
  }, [changeSummary, configId, createdBy, externalCreatedBy, source]);
}
