import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { Row, SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { configListColumns } from "./ConfigListColumn";

export interface Props {
  data: ConfigItem[];
  isLoading: boolean;
  columnsToHide?: string[];
  groupBy?: string[];
  expandAllRows?: boolean;
}

export default function ConfigsRelationshipsTable({
  data,
  isLoading,
  columnsToHide = ["type"],
  groupBy = [],
  expandAllRows = false
}: Props) {
  const [queryParams, setSearchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc"
  });

  const navigate = useNavigate();

  const sortField = queryParams.get("sortBy") ?? "type";

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
      if (field && order && field !== "type" && order !== "asc") {
        queryParams.set("sortBy", field);
        queryParams.set("sortOrder", order);
      } else {
        queryParams.delete("sortBy");
        queryParams.delete("sortOrder");
      }
      setSearchParams(queryParams);
      const sortByValue =
        typeof newSortBy === "function" ? newSortBy(sortBy) : newSortBy;
      if (sortByValue.length > 0) {
        setSortBy(determineSortColumnOrder(sortByValue));
      }
    },
    [determineSortColumnOrder, queryParams, setSearchParams, sortBy]
  );

  const hiddenColumns = ["deleted_at", "changed", ...columnsToHide];

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

  const handleRowClick = useCallback(
    (row?: { original?: { id: string } }) => {
      const id = row?.original?.id;
      if (id) {
        navigate(`/catalog/${id}`);
      }
    },
    [navigate]
  );

  return (
    <DataTable
      stickyHead
      isVirtualized
      columns={configListColumns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      groupBy={groupBy}
      hiddenColumns={hiddenColumns}
      className="max-w-full table-auto table-fixed"
      tableSortByState={sortBy}
      enableServerSideSorting
      onTableSortByChanged={updateSortBy}
      determineRowClassNamesCallback={determineRowClassNames}
      preferencesKey="config-list"
      virtualizedRowEstimatedHeight={37}
      overScan={20}
      expandAllRows={expandAllRows}
    />
  );
}
