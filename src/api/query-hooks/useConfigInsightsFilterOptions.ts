import {
  ConfigInsightsFilterOptions,
  getConfigInsightsFilterOptions
} from "@flanksource-ui/api/services/configs";
import { useQuery } from "@tanstack/react-query";

const emptyOptions: ConfigInsightsFilterOptions = {
  types: [],
  analyzers: [],
  sources: [],
  config_types: [],
  catalogs: []
};

/**
 * Fetches all filter options for the insights table in a single RPC call.
 * When configId is supplied, options are scoped to that config's analysis rows.
 */
export function useConfigInsightsFilterOptions(configId?: string) {
  return useQuery({
    queryKey: ["config_analysis_filter_options", configId ?? null],
    queryFn: () => getConfigInsightsFilterOptions(configId),
    select: (data) => data ?? emptyOptions
  });
}
