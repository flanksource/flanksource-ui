import { SchemaResourceWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { DataTable, PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { PaginationState, Updater } from "@tanstack/react-table";
import { useMemo } from "react";
import { integrationsTableColumns } from "./Table/IntegrationsTableColumns";

type IntegrationsListProps = {
  data: SchemaResourceWithJobStatus[];
  onRowClick: (row: SchemaResourceWithJobStatus) => void;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  setPageState?: (state: Updater<PaginationState>) => void;
};

export default function IntegrationsList({
  data,
  onRowClick,
  pageCount,
  pageIndex,
  pageSize,
  isLoading = false,
  setPageState = () => {}
}: IntegrationsListProps) {
  const pagination = useMemo(() => {
    return {
      setPagination: (state) => {
        setPageState(state);
      },
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    } satisfies PaginationOptions;
  }, [setPageState, pageIndex, pageSize, pageCount, isLoading]);

  return (
    <DataTable
      data={data}
      handleRowClick={(row) => onRowClick(row.original)}
      columns={integrationsTableColumns}
      pagination={pagination}
      isLoading={isLoading}
      groupBy={["integration_type"]}
      expandAllRows
    />
  );
}
