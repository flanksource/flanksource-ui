import { MRT_ColumnDef } from "mantine-react-table";
import { Token } from "../../../api/services/tokens";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";

export const tokensTableColumns: MRT_ColumnDef<Token>[] = [
  {
    header: "Name",
    accessorKey: "name",
    size: 200,
    enableSorting: true
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
    Cell: (props) => {
      const expiresAt = props.row.original.expires_at;
      return expiresAt ? (
        <MRTDateCell {...props} />
      ) : expiresAt === null ? (
        "Never"
      ) : (
        "Not provided"
      );
    },
    sortingFn: "datetime",
    maxSize: 50
  }
];
