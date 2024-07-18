import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { ColumnDef, Row, SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { configListColumns } from "./ConfigListColumn";

export interface Props {
  data: ConfigItem[];
  isLoading: boolean;
  columnsToHide?: string[];
  groupBy?: string;
  expandAllRows?: boolean;
}

export default function ConfigsTable({
  data,
  isLoading,
  columnsToHide = ["type"],
  groupBy,
  expandAllRows = false
}: Props) {
  const [queryParams, setSearchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc"
  });

  const navigate = useNavigate();

  const groupByUserInput = queryParams.get("groupBy") ?? undefined;

  const groupByColumns = useMemo(() => {
    if (!groupByUserInput) {
      return groupBy ? [groupBy] : [];
    }
    return groupByUserInput
      .split(",")
      .map((item) => item.replace("__tag", "").trim());
  }, [groupBy, groupByUserInput]);

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

  const hiddenColumns = [
    "deleted_at",
    "changed",
    // we want to hide the columns that are in the groupBy, we don't want to
    // show, but the name column will contain the groupBy details
    ...groupByColumns,
    ...columnsToHide
  ];

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

  const configListWithTagsIncluded = useMemo(() => {
    const tagsGroupBy = groupByColumns.filter(
      (item) => !item.endsWith("__tag")
    );
    if (tagsGroupBy.length === 0) {
      return data;
    }
    return data.map((config) => ({
      ...config,
      ...tagsGroupBy.reduce(
        (acc, tag) => {
          const tags = config.tags ?? {};
          acc[tag.replace("__tag", "")] = tags[tag.replace("__tag", "")];
          return acc;
        },
        {} as Record<string, string>
      )
    }));
  }, [data, groupByColumns]);

  const handleRowClick = useCallback(
    (row?: { original?: { id: string } }) => {
      const id = row?.original?.id;
      if (id) {
        navigate(`/catalog/${id}`);
      }
    },
    [navigate]
  );

  const virtualColumns = useMemo(() => {
    const virtualColumn = groupByColumns.map((column) => {
      const columnKey = column.replace("__tag", "");
      return {
        header: columnKey.toLocaleUpperCase(),
        id: columnKey,
        enableHiding: true,
        getGroupingValue: (row) => {
          return row.tags?.[columnKey];
        },
        cell: ({ row }) => {
          return row.original.tags?.[columnKey];
        }
      } satisfies ColumnDef<ConfigItem, any>;
    });
    return [...virtualColumn, ...configListColumns];
  }, [groupByColumns]);

  return (
    <DataTable
      stickyHead
      isVirtualized
      columns={virtualColumns}
      data={configListWithTagsIncluded}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      groupBy={groupByColumns}
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
