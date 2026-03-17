import { ConfigAccessSummary } from "@flanksource-ui/api/types/configs";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import {
  FlatAccessTypeCell,
  FlatConfigCell,
  FlatLastSignedInCell,
  FlatOptionalDateCell,
  FlatRoleCell,
  FlatTypeCell,
  FlatUserCell
} from "./cells";

type ConfigAccessFlatTableProps = {
  data: ConfigAccessSummary[];
  isLoading?: boolean;
  isRefetching?: boolean;
  totalRecords: number;
};

const pageSize = 50;

const primaryColumnWidth = 220;

const flatColumns: MRT_ColumnDef<ConfigAccessSummary>[] = [
  {
    header: "Catalog",
    accessorKey: "config_name",
    Cell: FlatConfigCell,
    size: primaryColumnWidth
  },
  {
    header: "User",
    accessorKey: "user",
    Cell: FlatUserCell,
    size: primaryColumnWidth
  },
  {
    header: "Role",
    accessorKey: "role",
    Cell: FlatRoleCell,
    size: primaryColumnWidth
  },
  {
    header: "Type",
    accessorKey: "user_type",
    Cell: FlatTypeCell,
    size: 90
  },
  {
    header: "Access",
    accessorKey: "access",
    Cell: FlatAccessTypeCell,
    size: 90
  },
  {
    header: "Last Signed In",
    accessorKey: "last_signed_in_at",
    Cell: FlatLastSignedInCell,
    sortingFn: "datetime",
    size: 120
  },
  {
    header: "Last Reviewed",
    accessorKey: "last_reviewed_at",
    Cell: FlatOptionalDateCell,
    sortingFn: "datetime",
    size: 120
  },
  {
    header: "Granted",
    accessorKey: "created_at",
    Cell: FlatOptionalDateCell,
    sortingFn: "datetime",
    size: 110
  }
];

export function ConfigAccessFlatTable({
  data,
  isLoading = false,
  isRefetching = false,
  totalRecords
}: ConfigAccessFlatTableProps) {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <MRTDataTable
      columns={flatColumns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      totalRowCount={totalRecords}
      manualPageCount={totalPages}
      disableHiding
      defaultSorting={[{ id: "created_at", desc: true }]}
      defaultPageSize={pageSize}
    />
  );
}
