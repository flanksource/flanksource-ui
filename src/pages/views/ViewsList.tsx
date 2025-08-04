import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import clsx from "clsx";
import { MRT_ColumnDef } from "mantine-react-table";
import { View } from "@flanksource-ui/api/services/views";

type ViewsListProps = {
  data: View[];
  isLoading?: boolean;
  onRowClick?: (data: View) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const NameCell = ({ row, renderedCellValue: getValue }: MRTCellProps<View>) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="text-sm font-medium">{getValue}</div>
    </div>
  );
};

const columns: MRT_ColumnDef<View>[] = [
  {
    header: "Name",
    accessorKey: "name",
    Cell: NameCell,
    minSize: 150,
    enableResizing: true
  },
  {
    header: "Namespace",
    accessorKey: "namespace",
    maxSize: 100,
    enableResizing: true
  },
  {
    header: "Source",
    accessorKey: "source",
    maxSize: 100,
    enableResizing: true
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    Cell: MRTAvatarCell,
    maxSize: 100
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 100
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 100
  }
];

export function ViewsList({
  data,
  isLoading,
  className,
  onRowClick = () => {},
  ...rest
}: ViewsListProps) {
  return (
    <div className={clsx(className)} {...rest}>
      <MRTDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => onRowClick(row)}
        enableServerSideSorting
      />
    </div>
  );
}
