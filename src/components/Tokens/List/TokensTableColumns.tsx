import { MRT_ColumnDef } from "mantine-react-table";
import { Token } from "../../../api/services/tokens";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";

export const tokensTableColumns: MRT_ColumnDef<Token>[] = [
  {
    header: "Name",
    accessorKey: "name",
    size: 200,
    enableSorting: true
  },
  {
    header: "Created By",
    accessorKey: "person",
    Cell: MRTAvatarCell,
    maxSize: 50
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 50
  },
  {
    header: "Expires At",
    accessorKey: "expires_at",
    Cell: ({ row, column }) => {
      const expiresAt = row.original.expires_at;
      return expiresAt ? <MRTDateCell row={row} column={column} /> : "Never";
    },
    sortingFn: "datetime",
    maxSize: 50
  }
];
