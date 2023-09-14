import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { User } from "../../api/services/users";
import { relativeDateTime } from "../../utils/date";
import { DataTable } from "../DataTable";
import { Avatar } from "../Avatar";
import { Property } from "../../services/permissions/permissionsService";

type FeatureFlagsListProps = {
  data: any[];
  isLoading?: boolean;
  onRowClick?: (data: Property) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<User, any>) =>
  relativeDateTime(getValue<string>());

const AvatarCell = ({ getValue }: CellContext<User, any>) => {
  return <Avatar user={getValue()} circular />;
};

const columns: ColumnDef<User>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Value",
    accessorKey: "value"
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

export function FeatureFlagsList({
  data,
  isLoading,
  className,
  onRowClick,
  ...rest
}: FeatureFlagsListProps) {
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
        handleRowClick={(row) => {
          onRowClick?.(row.original as unknown as Property);
        }}
      />
    </div>
  );
}
