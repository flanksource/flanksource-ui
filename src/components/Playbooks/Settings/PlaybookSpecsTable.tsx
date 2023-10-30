import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Avatar } from "../../Avatar";
import { DataTable } from "../../DataTable";
import { PlaybookSpec } from "../../../api/types/playbooks";
import { User } from "../../../api/types/users";
import { DateCell } from "../../../ui/table";

const playbookSpecsTableColumns: ColumnDef<PlaybookSpec>[] = [
  {
    header: "Name",
    accessorKey: "name",
    id: "name",
    size: 150
  },
  {
    header: "Source",
    accessorKey: "source",
    id: "source",
    size: 150
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: ({ getValue }: CellContext<PlaybookSpec, any>) => {
      const user = getValue<User>();
      return <Avatar user={user} circular />;
    }
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: DateCell,
    sortingFn: "datetime"
  }
];

type Props = {
  data: PlaybookSpec[];
  isLoading?: boolean;
  onRowClick?: (data: PlaybookSpec) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function PlaybookSpecsTable({
  data,
  isLoading,
  className,
  onRowClick,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-hidden" {...rest}>
      <DataTable
        stickyHead
        columns={playbookSpecsTableColumns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        preferencesKey="connections-list"
        savePreferences={false}
        handleRowClick={(row) => onRowClick?.(row.original)}
      />
    </div>
  );
}
