import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import clsx from "clsx";
import { MRT_ColumnDef } from "mantine-react-table";
import { Icon } from "../../ui/Icons/Icon";
import { Connection } from "./ConnectionFormModal";
import { CopyConnectionURLButton } from "./CopyConnectionURLButton";

type ConnectionListProps = {
  data: Connection[];
  isLoading?: boolean;
  onRowClick?: (data: Connection) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const NameCell = ({
  row,
  renderedCellValue: getValue
}: MRTCellProps<Connection>) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <Icon name={row.original.type} className="h-auto w-6" />
      <div>{getValue}</div>
      <CopyConnectionURLButton
        namespace={row.original.namespace}
        name={row.original.name}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const columns: MRT_ColumnDef<Connection>[] = [
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
    Cell: MRTAvatarCell,
    maxSize: 50
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 50
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 50
  }
];

export function ConnectionList({
  data,
  isLoading,
  className,
  onRowClick = () => {},
  ...rest
}: ConnectionListProps) {
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
