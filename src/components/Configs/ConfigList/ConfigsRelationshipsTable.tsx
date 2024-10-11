import { ConfigItem } from "@flanksource-ui/api/types/configs";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { mrtConfigListColumns } from "./MRTConfigListColumn";

export interface Props {
  data: ConfigItem[];
  isLoading: boolean;
  columnsToHide?: string[];
  groupBy?: string[];
  expandAllRows?: boolean;
  totalEntries?: number;
  pageCount?: number;
}

export default function ConfigsRelationshipsTable({
  data,
  isLoading,
  columnsToHide = ["type"],
  groupBy = [],
  expandAllRows = false,
  totalEntries,
  pageCount
}: Props) {
  const navigate = useNavigate();

  const hiddenColumns = ["deleted_at", "changed", ...columnsToHide];

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
      columns={mrtConfigListColumns}
      data={data}
      onRowClick={handleRowClick}
      isLoading={isLoading}
      groupBy={groupBy}
      hiddenColumns={hiddenColumns}
      expandAllRows={expandAllRows}
      totalRowCount={totalEntries}
      manualPageCount={pageCount}
      enableGrouping
      disableHiding
    />
  );
}
