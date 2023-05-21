import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { DataTable } from "../DataTable";
import { Avatar } from "../Avatar";
import { Connection } from "./ConnectionForm";
import { DateCell } from "../ConfigViewer/columns";

type ConnectionListProps = {
  data: Connection[];
  isLoading?: boolean;
  onRowClick?: (data: Connection) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const AvatarCell = ({ getValue }: CellContext<Connection, any>) => {
  return <Avatar user={getValue()} circular />;
};

const columns: ColumnDef<Connection>[] = [
  {
    header: "Type",
    accessorKey: "type"
  },
  {
    header: "Name",
    accessorKey: "name"
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
        style={{ maxHeight: "calc(100vh - 12rem)" }}
        preferencesKey="connections-list"
        savePreferences={false}
        handleRowClick={(row) => onRowClick?.(row.original)}
      />
    </div>
  );
}
