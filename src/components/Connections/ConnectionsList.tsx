import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { Icon } from "../../ui/Icons/Icon";
import { Connection } from "./ConnectionFormModal";

type ConnectionListProps = {
  data: Connection[];
  isLoading?: boolean;
  onRowClick?: (data: Connection) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const NameCell = ({ row, getValue }: CellContext<Connection, any>) => {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <Icon name={row.original.type} className="w-6 h-auto" />
      <div>{getValue()}</div>
    </div>
  );
};

const AvatarCell = ({ getValue }: CellContext<Connection, any>) => {
  return <Avatar user={getValue()} circular />;
};

const columns: ColumnDef<Connection>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: NameCell,
    minSize: 150,
    enableResizing: true
  },
  {
    header: "Namespace",
    accessorKey: "namespace",
    maxSize: 75,
    enableResizing: true
  },

  {
    header: "Type",
    accessorKey: "type",
    maxSize: 75
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: AvatarCell,
    maxSize: 50
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime",
    maxSize: 50
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    cell: DateCell,
    sortingFn: "datetime",
    maxSize: 50
  }
];

export function ConnectionList({
  data,
  isLoading,
  className,
  onRowClick,
  ...rest
}: ConnectionListProps) {
  return (
    <div className={clsx(className)} {...rest}>
      <DataTable
        stickyHead
        columns={columns}
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
