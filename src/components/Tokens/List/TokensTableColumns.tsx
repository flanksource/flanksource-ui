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
    header: "Role Bindings",
    id: "role_bindings",
    size: 200,
    enableSorting: false,
    Cell: ({ row }) => {
      const bindings = row.original.role_bindings ?? [];
      if (bindings.length === 0) {
        return <span className="text-sm text-orange-700">None</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {bindings.map((binding) => (
            <span
              key={binding.id}
              title={binding.ready ? undefined : "Not in effect"}
              className={`rounded px-1.5 py-0.5 text-xs ${
                binding.ready
                  ? "bg-gray-100 text-gray-700"
                  : "bg-orange-50 text-orange-700 line-through"
              }`}
            >
              {binding.role}
            </span>
          ))}
        </div>
      );
    }
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
