import { useConfigAccessGroupedByConfigQuery } from "@flanksource-ui/api/query-hooks/useConfigAccessGroupedQuery";
import { ConfigAccessSummaryByConfig } from "@flanksource-ui/api/types/configs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toTriStateIncludeParamValue } from "../utils";
import {
  GroupedByCatalogIdentityCell,
  GroupedByCatalogLastSignedInCell,
  GroupedByCatalogLatestGrantCell
} from "./cells";

const pageSize = 50;

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isRefetching, error } =
    useConfigAccessGroupedByConfigQuery();

  const rows = data?.data ?? [];
  const totalRecords = data?.totalEntries ?? 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleRowClick = useCallback(
    (row: ConfigAccessSummaryByConfig) => {
      const params = new URLSearchParams();
      const configType = searchParams.get("configType");

      if (configType) {
        params.set("configType", configType);
      }

      params.set("groupBy", "none");
      params.set("config_id", toTriStateIncludeParamValue(row.config_id));
      navigate(`/catalog/access?${params.toString()}`);
    },
    [navigate, searchParams]
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
      defaultSorting={[{ id: "access_count", desc: true }]}
      defaultPageSize={pageSize}
      onRowClick={handleRowClick}
    />
  );
}
