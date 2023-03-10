import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { User } from "../../api/services/users";
import { relativeDateTime } from "../../utils/date";
import { DataTable } from "../DataTable";

type UserListProps = {
  data: any[];
  isLoading?: boolean;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<User, any>) =>
  relativeDateTime(getValue<string>());

const columns: ColumnDef<User>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Email",
    accessorKey: "email",
    aggregatedCell: ""
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime",
    aggregatedCell: ""
  },
  {
    header: "State",
    accessorKey: "state",
    aggregatedCell: ""
  }
];

export function UserList({
  data,
  isLoading,
  className,
  ...rest
}: UserListProps) {
  return (
    <div className={clsx(className)} {...rest}>
      <DataTable
        stickyHead
        columns={columns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
        preferencesKey="user-list"
        savePreferences={false}
      />
    </div>
  );
}
