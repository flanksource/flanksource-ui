import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

const scopesTableColumns: MRT_ColumnDef<ScopeDisplay>[] = [
  {
    header: "Name",
    id: "name",
    size: 100,
    Cell: ({ row }) => {
      const { name, namespace } = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{name}</span>
          {namespace && <Badge text={namespace} color="gray" />}
        </div>
      );
    }
  },
  {
    header: "Targets",
    id: "targets",
    size: 80,
    Cell: ({ row }) => {
      const { targets } = row.original;
      return (
        <span className="text-sm text-gray-600">
          {targets.length} {targets.length === 1 ? "target" : "targets"}
        </span>
      );
    }
  },
  {
    header: "Description",
    id: "description",
    size: 200,
    accessorFn: (row) => row.description
  },
  {
    header: "Created",
    id: "created",
    size: 40,
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    header: "Updated",
    id: "updated",
    size: 40,
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  },
  {
    header: "Created By",
    id: "createdBy",
    size: 40,
    Cell: ({ row }) => {
      const createdBy = row.original.created_by;
      const source = row.original.source;

      if (source?.toLowerCase() === "KubernetesCRD".toLowerCase()) {
        const id = row.original.id;
        return <CRDSource source={source} id={id} showMinimal />;
      }

      return <Avatar user={createdBy} />;
    }
  }
];

type ScopesTableProps = {
  data: ScopeDisplay[];
  isLoading: boolean;
  handleRowClick?: (row: ScopeDisplay) => void;
};

export default function ScopesTable({
  data,
  isLoading,
  handleRowClick = () => {}
}: ScopesTableProps) {
  return (
    <MRTDataTable
      columns={scopesTableColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={handleRowClick}
    />
  );
}
