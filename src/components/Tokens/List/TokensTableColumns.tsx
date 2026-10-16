import { MRT_ColumnDef } from "mantine-react-table";
import { Token } from "../../../api/services/tokens";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";

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
          {bindings.map((binding) =>
            binding.ready ? (
              <span
                key={binding.id}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
              >
                {binding.role}
              </span>
            ) : (
              <TooltipProvider key={binding.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help rounded bg-orange-50 px-1.5 py-0.5 text-xs text-orange-700 line-through">
                      {binding.role}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <div className="font-semibold">
                      Not in effect
                      {binding.error_reason ? `: ${binding.error_reason}` : ""}
                    </div>
                    {binding.error && <div>{binding.error}</div>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          )}
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
