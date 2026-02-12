import React, { useEffect, useMemo, useState } from "react";
import ConfigsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsTable";
import { useAllConfigsQuery } from "@flanksource-ui/api/query-hooks/useAllConfigsQuery";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { ConfigsUIFilters } from "./ConfigsUIFilters";
import type { ConfigsUIFilters as ConfigsUIFiltersType } from "../../audit-report/types";
import { translateConfigsFilters } from "../utils/filterTranslation";

interface ConfigsUISectionProps {
  filters: ConfigsUIFiltersType;
  paramPrefix?: string;
}

/**
 * Builds URL search params from translated filter values
 */
function buildSearchParamsFromFilters(
  filters: ConfigsUIFiltersType
): URLSearchParams {
  const params = new URLSearchParams();
  const translated = translateConfigsFilters(filters);

  if (translated.search) {
    params.set("search", translated.search);
  }
  if (translated.configType) {
    params.set("configType", translated.configType);
  }
  if (translated.labels) {
    params.set("labels", translated.labels);
  }
  if (translated.status) {
    params.set("status", translated.status);
  }
  if (translated.health) {
    params.set("health", translated.health);
  }

  return params;
}

const ConfigsUISection: React.FC<ConfigsUISectionProps> = ({
  filters,
  paramPrefix
}) => {
  const { pageSize } = useReactTablePaginationState({ paramPrefix });
  const [searchParams, setSearchParams] = usePrefixedSearchParams(
    paramPrefix,
    false
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Build preset params from filters (translated to internal format)
  const presetParams = useMemo(
    () => buildSearchParamsFromFilters(filters),
    [filters]
  );

  // Seed preset filters first, then mark initialized once URL state reflects them.
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const presetsApplied = Array.from(presetParams.entries()).every(
      ([key, value]) => searchParams.get(key) === value
    );

    if (presetsApplied) {
      setIsInitialized(true);
      return;
    }

    setSearchParams(
      (currentParams) => {
        const mergedParams = new URLSearchParams(currentParams);

        // Apply preset filters (they override any existing values)
        presetParams.forEach((value, key) => {
          mergedParams.set(key, value);
        });

        return mergedParams;
      },
      { replace: true }
    );
  }, [isInitialized, presetParams, searchParams, setSearchParams]);

  // Fetch configs data
  const { data: allConfigs, isLoading } = useAllConfigsQuery({
    cacheTime: 0,
    paramPrefix
  });

  const totalEntries = allConfigs?.totalEntries ?? 0;
  const pageCount = Math.ceil(totalEntries / pageSize);

  return (
    <div className="flex flex-col gap-2">
      {isInitialized && <ConfigsUIFilters paramPrefix={paramPrefix} />}
      <ConfigsTable
        data={allConfigs?.data ?? []}
        isLoading={isLoading || !isInitialized}
        totalRecords={totalEntries}
        pageCount={pageCount}
        expandAllRows
        paramPrefix={paramPrefix}
      />
    </div>
  );
};

export default ConfigsUISection;
