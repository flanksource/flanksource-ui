import { ConfigItem } from "@flanksource-ui/api/types/configs";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mrtConfigListColumns } from "./MRTConfigListColumn";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

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

  const relationshipsColumns = useMemo(() => {
    return mrtConfigListColumns.map((column) => {
      if (column.accessorKey === "name") {
        return {
          ...column,
          AggregatedCell: ({ row }: any) => {
            const count = row.subRows?.length;
            return (
              <div
                className="flex flex-row items-center gap-1"
                style={{
                  marginLeft: row.depth * 20
                }}
              >
                <ConfigsTypeIcon config={{ type: row.groupingValue }} showLabel>
                  <Badge text={count} />
                </ConfigsTypeIcon>
              </div>
            );
          }
        };
      }
      return column;
    });
  }, []);

  return (
    <MRTDataTable
      columns={relationshipsColumns}
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
