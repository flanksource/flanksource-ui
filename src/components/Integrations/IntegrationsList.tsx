import { SchemaResourceWithJobStatus } from "@flanksource-ui/api/schemaResources";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { integrationsTableColumns } from "./Table/IntegrationsTableColumns";

type IntegrationsListProps = {
  data: SchemaResourceWithJobStatus[];
  onRowClick: (row: SchemaResourceWithJobStatus) => void;
  isLoading?: boolean;
  pageCount?: number;
};

export default function IntegrationsList({
  data,
  onRowClick,
  isLoading = false,
  pageCount
}: IntegrationsListProps) {
  return (
    <MRTDataTable
      data={data}
      onRowClick={onRowClick}
      columns={integrationsTableColumns}
      isLoading={isLoading}
      manualPageCount={pageCount}
    />
  );
}
