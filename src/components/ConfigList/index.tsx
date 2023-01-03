import { Row, SortingState } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../";
import { ConfigItem } from "../../api/services/configs";
import { configListColumns } from "./ConfigListColumn";

export interface Props {
  data: ConfigItem[];
  handleRowClick: (row?: any) => void;
  isLoading: boolean;
}

export default function ConfigList({ data, handleRowClick, isLoading }: Props) {
  const [queryParams] = useSearchParams({
    sortBy: "config_type",
    sortOrder: "asc",
    groupBy: "config_type"
  });

  const groupByField = queryParams.get("groupBy") || "config_type";
  const sortField = queryParams.get("sortBy");

  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const [sortBy, setSortBy] = useState<SortingState>(() => {
    return sortField
      ? [
          {
            id: sortField,
            desc: isSortOrderDesc
          },
          {
            id: "name",
            desc: isSortOrderDesc
          }
        ]
      : [];
  });

  const setHiddenColumns = useCallback(() => {
    if (groupByField !== "changed" && groupByField !== "tags") {
      return ["changed", "allTags"];
    } else if (groupByField === "tags") {
      return ["changed"];
    }
    return [];
  }, [groupByField]);

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
      hiddenColumns={setHiddenColumns()}
      className="max-w-full overflow-x-auto"
      tableSortByState={sortBy}
      onTableSortByChanged={(newSortBy) => {
        const sortByValue =
          typeof newSortBy === "function" ? newSortBy(sortBy) : newSortBy;
        if (sortByValue.length > 0) {
          const { id, desc } = sortByValue[0];
          if (id === "config_type") {
            setSortBy([
              {
                id: "config_type",
                desc: desc
              },
              {
                id: "name",
                desc: desc
              }
            ]);
          } else {
            setSortBy(sortByValue);
          }
        }
      }}
      determineRowClassNamesCallback={determineRowClassNames}
    />
  );
}
