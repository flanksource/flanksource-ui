import { useConfigAccessGroupedByConfigQuery } from "@flanksource-ui/api/query-hooks/useConfigAccessGroupedQuery";
import { ConfigAccessSummaryByConfig } from "@flanksource-ui/api/types/configs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import {
  CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX,
  useCatalogAccessUrlState
} from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback } from "react";
import {
  GroupedByCatalogIdentityCell,
  GroupedByCatalogLastSignedInCell,
  GroupedByCatalogLatestGrantCell
} from "./cells";

const groupedByCatalogColumns: MRT_ColumnDef<ConfigAccessSummaryByConfig>[] = [
  {
    header: "Catalog",
    accessorKey: "config_name",
    Cell: GroupedByCatalogIdentityCell,
    size: 300
  },
  {
    header: "Users",
    accessorKey: "distinct_users",
    size: 100,
    Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>
  },
  {
    header: "Roles",
    accessorKey: "distinct_roles",
    size: 100,
    Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>
  },
  {
    header: "Last Signed In",
    accessorKey: "last_signed_in_at",
    sortingFn: "datetime",
    size: 160,
    Cell: GroupedByCatalogLastSignedInCell
  },
  {
    header: "Latest Grant",
    accessorKey: "latest_grant",
    sortingFn: "datetime",
    size: 160,
    Cell: GroupedByCatalogLatestGrantCell
  }
];

export function ConfigAccessGroupedByCatalogTable() {
  const {
    actions: { drillDownByConfigId }
  } = useCatalogAccessUrlState();

  const { pageSize } = useReactTablePaginationState({
    paramPrefix: CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX,
    defaultPageSize: 50
  });

  const { data, isLoading, isRefetching, error } =
    useConfigAccessGroupedByConfigQuery();

  const rows = data?.data ?? [];
  const totalRecords = data?.totalEntries ?? 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleRowClick = useCallback(
    (row: ConfigAccessSummaryByConfig) => {
      drillDownByConfigId(row.config_id);
    },
    [drillDownByConfigId]
  );

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : ((error as Record<string, string>)?.message ??
          "Something went wrong");

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <MRTDataTable
      columns={groupedByCatalogColumns}
      data={rows}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      totalRowCount={totalRecords}
      manualPageCount={totalPages}
      disableHiding
      defaultPageSize={pageSize}
      onRowClick={handleRowClick}
      urlParamPrefix={CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX}
    />
  );
}
