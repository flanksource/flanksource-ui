import { useHideDeletedConfigs } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import { configTypesFavorites } from "@flanksource-ui/components/Configs/ConfigSummary/ConfigSummaryTypeFavorite";
import useGroupBySearchParam from "@flanksource-ui/components/Configs/ConfigSummary/utils/useGroupBySearchParam";
import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfigSummaryRequest, getConfigsSummary } from "../services/configs";
import { ConfigSummary } from "../types/configs";

export function useLabelFiltersFromParams() {
  const [searchParams] = useSearchParams();
  const labels = searchParams.get("labels") ?? undefined;

  return useMemo(() => {
    if (labels) {
      return labels.split(",").reduce((acc, label) => {
        const [filterValue, operand] = label.split(":");
        const [key, value] = filterValue.split("____");
        const symbol = parseInt(operand) === -1 ? "!" : "";
        return { ...acc, [key]: `${symbol}${value}` };
      }, {});
    }
    return undefined;
  }, [labels]);
}

export function useConfigSummaryQuery({
  enabled = true
}: UseQueryOptions<ConfigSummary[]> = {}) {
  const [searchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "config_class,type"
  });
  const hideDeletedConfigs = useHideDeletedConfigs();
  const status = searchParams.get("status") ?? undefined;
  const health = searchParams.get("health") ?? undefined;

  const [favorites] = useAtom(configTypesFavorites);

  const groupBy = useGroupBySearchParam();

  const filterSummaryByLabel = useLabelFiltersFromParams();

  const req: ConfigSummaryRequest = {
    // group by config_class is always done on the frontend
    groupBy: groupBy?.filter((g) => g !== "config_class") || undefined,
    deleted: !hideDeletedConfigs,
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
    enabled,
    select: (data) =>
      data.map((summary) => ({
        ...summary,
        config_class: summary.type.split("::")[0],
        // we need to add the isFavorite property to the summary, so we can sort
        // by it in the UI
        isFavorite: favorites[summary.type]
      }))
  });
}
