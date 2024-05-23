import { useHideDeletedConfigs } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import useGroupBySearchParam from "@flanksource-ui/components/Configs/ConfigSummary/utils/useGroupBySearchParam";
import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfigSummaryRequest, getConfigsSummary } from "../services/configs";
import { ConfigSummary } from "../types/configs";

export function useConfigSummaryQuery({
  enabled = true
}: UseQueryOptions<ConfigSummary[]> = {}) {
  const [searchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "type"
  });
  const hideDeletedConfigs = useHideDeletedConfigs();
  const labels = searchParams.get("labels") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const health = searchParams.get("health") ?? undefined;

  const groupBy = useGroupBySearchParam();

  const filterSummaryByLabel = useMemo(() => {
    if (labels) {
      return labels.split(",").reduce((acc, label) => {
        const [key, value] = label.split("__:__");
        return { ...acc, [key]: value };
      }, {});
    }
    return undefined;
  }, [labels]);

  const req: ConfigSummaryRequest = {
    groupBy,
    deleted: hideDeletedConfigs,
    filter: filterSummaryByLabel,
    health: health ? tristateOutputToQueryParamValue(health) : undefined,
    status: status ? tristateOutputToQueryParamValue(status) : undefined,
    changes: {
      since: "30d"
    },
    analysis: {
      since: "30d"
    },
    cost: "30d"
  };

  return useQuery({
    queryKey: ["configs", "configSummary", req],
    queryFn: () => getConfigsSummary(req),
    enabled
  });
}
