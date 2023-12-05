import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { DataTable } from "../DataTable";
import { Avatar } from "../Avatar";
import { Connection } from "./ConnectionFormModal";
import { Icon } from "../Icon";
import { DateCell } from "../../ui/table";

type ConnectionListProps = {
  data: Connection[];
  isLoading?: boolean;
  onRowClick?: (data: Connection) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const NameCell = ({ row, getValue }: CellContext<Connection, any>) => {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <Icon name={row.original.type} />
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
    cell: NameCell
  },
  {
    header: "Namespace",
    accessorKey: "namespace"
  },
  {
    header: "Type",
    accessorKey: "type"
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: AvatarCell
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
