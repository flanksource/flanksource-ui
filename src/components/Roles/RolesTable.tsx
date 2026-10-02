import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { RbacObjectStatus } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

const rolesTableColumns: MRT_ColumnDef<RoleDisplay>[] = [
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
    header: "Rules",
    id: "rules",
    size: 150,
    Cell: ({ row }) => {
      const rules = row.original.rules ?? [];
      const actions = Array.from(new Set(rules.map((rule) => rule.action)));
      const hasDeny = rules.some((rule) => rule.deny);
      return (
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((action) => (
            <span
              key={action}
              className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700"
            >
              {action}
            </span>
          ))}
          {hasDeny && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
              deny
            </span>
          )}
        </div>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    size: 60,
    Cell: ({ row }) => <RbacObjectStatus {...row.original} />
  },
  {
    header: "Description",
    id: "description",
    size: 150,
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
      const { created_by, source, id } = row.original;
      if (source !== "UI") {
        return <CRDSource source={source} id={id} showMinimal />;
      }
      return <Avatar user={created_by} />;
    }
  }
];

type RolesTableProps = {
  data: RoleDisplay[];
  isLoading: boolean;
  handleRowClick?: (row: RoleDisplay) => void;
};

export default function RolesTable({
  data,
  isLoading,
  handleRowClick = () => {}
}: RolesTableProps) {
  return (
    <MRTDataTable
      columns={rolesTableColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={handleRowClick}
    />
  );
}
