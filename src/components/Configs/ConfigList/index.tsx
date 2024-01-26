import { Row, SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../..";
import { ConfigItem } from "../../../api/types/configs";
import { configListColumns } from "./ConfigListColumn";

export interface Props {
  data: ConfigItem[];
  handleRowClick: (row: Row<ConfigItem>) => void;
  isLoading: boolean;
  columnsToHide?: string[];
}

export default function ConfigList({
  data,
  handleRowClick,
  isLoading,
  columnsToHide = ["type"]
}: Props) {
  const [queryParams, setSearchParams] = useSearchParams({
    sortBy: "name",
    sortOrder: "asc",
    groupBy: "no_grouping"
  });

  const groupByField = queryParams.get("groupBy") ?? "no_grouping";
  const sortField = queryParams.get("sortBy");

  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const determineSortColumnOrder = useCallback(
    (sortState: SortingState): SortingState => {
      const sortStateWithoutDeletedAt = sortState.filter(
        (sort) => sort.id !== "deleted_at"
      );
      return [{ id: "deleted_at", desc: false }, ...sortStateWithoutDeletedAt];
    },
    []
  );

  const [sortBy, setSortBy] = useState<SortingState>(() => {
    return sortField
      ? determineSortColumnOrder([
          {
            id: sortField,
            desc: isSortOrderDesc
          },
          ...(sortField !== "name"
            ? [
                {
                  id: "name",
                  desc: isSortOrderDesc
                }
              ]
            : [])
        ])
      : determineSortColumnOrder([]);
  });

  const updateSortBy = useCallback(
    (newSortBy: Updater<SortingState>) => {
      const getSortBy = Array.isArray(newSortBy)
        ? newSortBy
        : newSortBy(sortBy);
      // remove deleted_at from sort state, we don't want it to be save to the
      // URL for the purpose of sorting
      const sortStateWithoutDeleteAt = getSortBy.filter(
        (state) => state.id !== "deleted_at"
      );
      const { id: field, desc } = sortStateWithoutDeleteAt[0] ?? {};
      const order = desc ? "desc" : "asc";
      if (field && order) {
        queryParams.set("sortBy", field);
        queryParams.set("sortOrder", order);
      } else {
        queryParams.delete("sortBy");
        queryParams.delete("sortOrder");
      }
      setSearchParams(queryParams, { replace: true });
      const sortByValue =
        typeof newSortBy === "function" ? newSortBy(sortBy) : newSortBy;
      if (sortByValue.length > 0) {
        setSortBy(determineSortColumnOrder(sortByValue));
      }
    },
    [determineSortColumnOrder, queryParams, setSearchParams, sortBy]
  );

  // we want to update sort settings when groupBy changes
  useEffect(() => {
    updateSortBy(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupByField]);

  const hiddenColumns = useMemo(() => {
    const alwaysHiddenColumns = ["deleted_at", ...columnsToHide];
    if (groupByField !== "changed" && groupByField !== "tags") {
      return [...alwaysHiddenColumns, "changed", "allTags"];
    } else if (groupByField === "tags") {
      return [...alwaysHiddenColumns, "changed"];
    }
    return [];
  }, [groupByField, columnsToHide]);

  const determineRowClassNames = useCallback((row: Row<ConfigItem>) => {
    if (row.getIsGrouped()) {
      // check if the whole group is deleted
      const allDeleted = row.getLeafRows().every((row) => {
        if (row.original.deleted_at) {
          return true;
        }
        return false;
      });

      if (allDeleted) {
        return "text-gray-500";
      }
    } else {
      if (row.original.deleted_at) {
        return "text-gray-500";
      }
    }
    return "";
  }, []);

  return (
    <DataTable
      stickyHead
      isVirtualized
      columns={configListColumns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      groupBy={
        !groupByField || groupByField === "no_grouping"
          ? undefined
          : [groupByField]
      }
      hiddenColumns={hiddenColumns}
      className="max-w-full table-auto table-fixed"
      tableSortByState={sortBy}
      onTableSortByChanged={updateSortBy}
      determineRowClassNamesCallback={determineRowClassNames}
      preferencesKey="config-list"
      savePreferences
      virtualizedRowEstimatedHeight={37}
      overScan={20}
    />
  );
}
