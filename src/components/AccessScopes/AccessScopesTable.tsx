import { AccessScopeDisplay } from "@flanksource-ui/api/types/accessScopes";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

const accessScopesTableColumns: MRT_ColumnDef<AccessScopeDisplay>[] = [
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
    header: "Subject",
    id: "subject",
    size: 100,
    Cell: ({ row }) => {
      const { person, team } = row.original;
      if (person) {
        return <span>{person.email}</span>;
      }
      if (team) {
        return <span>{team.name}</span>;
      }
      return <span className="text-gray-400">-</span>;
    }
  },
  {
    header: "Resources",
    id: "resources",
    size: 150,
    Cell: ({ row }) => {
      const { resources } = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {resources.map((resource) => (
            <Badge key={resource} text={resource} color="gray" />
          ))}
        </div>
      );
    }
  },
  {
    header: "Scopes",
    id: "scopes",
    size: 80,
    Cell: ({ row }) => {
      const { scopes } = row.original;
      return (
        <span className="text-sm text-gray-600">
          {scopes.length} {scopes.length === 1 ? "scope" : "scopes"}
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

type AccessScopesTableProps = {
  data: AccessScopeDisplay[];
  isLoading: boolean;
  handleRowClick?: (row: AccessScopeDisplay) => void;
};

export default function AccessScopesTable({
  data,
  isLoading,
  handleRowClick = () => {}
}: AccessScopesTableProps) {
  return (
    <MRTDataTable
      columns={accessScopesTableColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={handleRowClick}
    />
  );
}
