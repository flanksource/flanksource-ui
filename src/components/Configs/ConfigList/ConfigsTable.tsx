import { ConfigItem } from "@flanksource-ui/api/types/configs";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { mrtConfigListColumns } from "./MRTConfigListColumn";

export interface Props {
  data: ConfigItem[];
  isLoading: boolean;
  columnsToHide?: string[];
  groupBy?: string;
  expandAllRows?: boolean;
  totalRecords?: number;
  pageCount?: number;
  paramPrefix?: string;
}

export default function ConfigsTable({
  data,
  isLoading,
  columnsToHide = ["type"],
  groupBy,
  expandAllRows = false,
  totalRecords,
  pageCount,
  paramPrefix
}: Props) {
  const [queryParams] = usePrefixedSearchParams(paramPrefix, false);
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

  const hiddenColumns = [
    "deleted_at",
    "changed",
    // we want to hide the columns that are in the groupBy, we don't want to
    // show, but the name column will contain the groupBy details
    ...groupByColumns,
    ...columnsToHide
  ];

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

  const virtualColumns = useMemo(() => {
    const virtualColumn: MRT_ColumnDef<ConfigItem>[] = groupByColumns.map(
      (column) => {
        const columnKey = column.replace("__tag", "");
        return {
          header: columnKey.toLocaleUpperCase(),
          id: columnKey,
          enableHiding: true,
          getGroupingValue: (row) => {
            return row.tags?.[columnKey];
          },
          enableColumnActions: false,
          Cell: ({ row }) => {
            return row.original.tags?.[columnKey];
          }
        };
      }
    );
    return [...virtualColumn, ...mrtConfigListColumns(paramPrefix)];
  }, [groupByColumns, paramPrefix]);

  const handleRowClick = useCallback(
    (row?: ConfigItem) => {
      const id = row?.id;
      if (id) {
        navigate(`/catalog/${id}`);
      }
    },
    [navigate]
  );

  return (
    <MRTDataTable
      columns={virtualColumns}
      data={configListWithTagsIncluded}
      isLoading={isLoading}
      groupBy={groupByColumns}
      hiddenColumns={hiddenColumns}
      expandAllRows={expandAllRows}
      enableServerSidePagination
      enableServerSideSorting
      totalRowCount={totalRecords}
      manualPageCount={pageCount}
      enableGrouping
      onRowClick={handleRowClick}
      urlParamPrefix={paramPrefix}
    />
  );
}
