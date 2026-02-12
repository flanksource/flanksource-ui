import React, { useEffect, useMemo, useState } from "react";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { ChangesUIFilters } from "./ChangesUIFilters";
import type { ChangesUIFilters as ChangesUIFiltersType } from "../../audit-report/types";
import { translateChangesFilters } from "../utils/filterTranslation";

interface ChangesUISectionProps {
  filters: ChangesUIFiltersType;
  paramPrefix?: string;
}

/**
 * Builds URL search params from translated filter values
 */
function buildSearchParamsFromFilters(
  filters: ChangesUIFiltersType
): URLSearchParams {
  const params = new URLSearchParams();
  const translated = translateChangesFilters(filters);

  if (translated.configTypes) {
    params.set("configTypes", translated.configTypes);
  }
  if (translated.changeType) {
    params.set("changeType", translated.changeType);
  }
  if (translated.severity) {
    params.set("severity", translated.severity);
  }
  if (translated.from) {
    params.set("from", translated.from);
  }
  if (translated.to) {
    params.set("to", translated.to);
  }
  if (translated.tags) {
    params.set("tags", translated.tags);
  }
  if (translated.source) {
    params.set("source", translated.source);
  }
  if (translated.summary) {
    params.set("summary", translated.summary);
  }
  if (translated.createdBy) {
    params.set("external_created_by", translated.createdBy);
  }

  return params;
}

const ChangesUISection: React.FC<ChangesUISectionProps> = ({
  filters,
  paramPrefix
}) => {
  const { pageSize } = useReactTablePaginationState({ paramPrefix });
  const [, setSearchParams] = usePrefixedSearchParams(paramPrefix, false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Build preset params from filters (translated to internal format)
  const presetParams = useMemo(
    () => buildSearchParamsFromFilters(filters),
    [filters]
  );

  // On mount, merge preset filters with existing params (preset takes precedence)
  useEffect(() => {
    if (!isInitialized) {
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
      setIsInitialized(true);
    }
  }, [isInitialized, presetParams, setSearchParams]);

  // Fetch changes data
  const { data, isLoading, error, isRefetching } = useGetAllConfigsChangesQuery(
    {
      keepPreviousData: true,
      paramPrefix
    }
  );

  const changes = useMemo(() => {
    if (!data?.changes) return [];
    return data.changes.map((change) => ({
      ...change,
      config: {
        id: change.config_id!,
        type: change.type!,
        name: change.name!,
        deleted_at: change.deleted_at
      }
    }));
  }, [data]);

  const totalChanges = data?.total ?? 0;
  const totalChangesPages = Math.ceil(totalChanges / pageSize);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          {typeof error === "string" ? error : "Failed to load changes"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ChangesUIFilters paramsToReset={["page"]} paramPrefix={paramPrefix} />
      <ConfigChangeTable
        data={changes}
        isLoading={isLoading || isRefetching || !isInitialized}
        totalRecords={totalChanges}
        numberOfPages={totalChangesPages}
        paramPrefix={paramPrefix}
      />
    </div>
  );
};

export default ChangesUISection;
