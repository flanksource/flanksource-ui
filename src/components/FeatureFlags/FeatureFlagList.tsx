import { FeatureFlag } from "@flanksource-ui/services/permissions/permissionsService";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { DataTable } from "../DataTable";

type FeatureFlagsListProps = {
  data: FeatureFlag[];
  isLoading?: boolean;
  onRowClick?: (data: FeatureFlag) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<FeatureFlag, any>) => (
  <Age from={getValue()} />
);

const AvatarCell = ({ getValue }: CellContext<FeatureFlag, any>) => {
  return <Avatar user={getValue()} circular />;
};

const columns: ColumnDef<FeatureFlag>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Description",
    accessorKey: "description"
  },
  {
    header: "Value",
    accessorKey: "value"
  },
  {
    header: "Source",
    accessorKey: "source"
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
          onRowClick?.(row.original);
        }}
      />
    </div>
  );
}
