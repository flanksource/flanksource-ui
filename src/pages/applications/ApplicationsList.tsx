import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import clsx from "clsx";
import { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { Application } from "./ApplicationsPage";

type ApplicationsListProps = {
  data: Application[];
  isLoading?: boolean;
  onRowClick?: (data: Application) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const NameCell = ({
  row,
  renderedCellValue: getValue
}: MRTCellProps<Application>) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="text-sm font-medium">{getValue}</div>
    </div>
  );
};

const AuditReportCell = ({ row }: MRTCellProps<Application>) => {
  const application = row.original;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/applications/${application.namespace}/${application.name}`);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center space-x-1 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800"
    >
      <span>View</span>
    </button>
  );
};

const columns: MRT_ColumnDef<Application>[] = [
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
  },
  {
    header: "Action",
    accessorKey: "href",
    Cell: AuditReportCell,
    maxSize: 120,
    enableSorting: false
  }
];

export function ApplicationsList({
  data,
  isLoading,
  className,
  onRowClick = () => {},
  ...rest
}: ApplicationsListProps) {
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
