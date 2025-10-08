import { AccessScopeDisplay } from "@flanksource-ui/api/types/accessScopes";
import {
  CellContext,
  ColumnDef,
  createColumnHelper
} from "@tanstack/react-table";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Menu } from "@headlessui/react";
import { FaEllipsisV, FaPencilAlt, FaTrash } from "react-icons/fa";

const columnHelper = createColumnHelper<AccessScopeDisplay>();

// Subject column - show person email or team name with badge
function SubjectCell({ row }: CellContext<AccessScopeDisplay, unknown>) {
  const { person, team } = row.original;
  if (person) {
    return (
      <div className="flex items-center gap-2">
        <span>{person.email}</span>
        <Badge text="Person" color="blue" />
      </div>
    );
  }
  if (team) {
    return (
      <div className="flex items-center gap-2">
        <span>{team.name}</span>
        <Badge text="Team" color="yellow" />
      </div>
    );
  }
  return <span className="text-gray-400">-</span>;
}

// Resources column - show pills for each resource type
function ResourcesCell({ row }: CellContext<AccessScopeDisplay, unknown>) {
  const { resources } = row.original;
  return (
    <div className="flex flex-wrap gap-1">
      {resources.map((resource) => (
        <Badge key={resource} text={resource} color="gray" />
      ))}
    </div>
  );
}

// Scopes summary - show count
function ScopesSummaryCell({ row }: CellContext<AccessScopeDisplay, unknown>) {
  const { scopes } = row.original;
  return (
    <span className="text-sm text-gray-600">
      {scopes.length} {scopes.length === 1 ? "scope" : "scopes"}
    </span>
  );
}

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ getValue }) => getValue()
  }),
  columnHelper.display({
    id: "subject",
    header: "Subject",
    cell: SubjectCell
  }),
  columnHelper.accessor("resources", {
    header: "Resources",
    cell: ResourcesCell
  }),
  columnHelper.accessor("scopes", {
    header: "Scopes",
    cell: ScopesSummaryCell
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ getValue }) => getValue() || "-"
  }),
  columnHelper.accessor("source", {
    header: "Source",
    cell: ({ getValue }) => (
      <Badge
        text={getValue()}
        color={getValue() === "UI" ? "blue" : "yellow"}
      />
    )
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
  })
];

type AccessScopesTableProps = {
  data: AccessScopeDisplay[];
  isLoading?: boolean;
  onEdit: (accessScope: AccessScopeDisplay) => void;
  onDelete?: (id: string) => void;
};

// Create columns function to have access to onEdit and onDelete
function createTableColumns(
  onEdit: (accessScope: AccessScopeDisplay) => void,
  onDelete?: (id: string) => void
): ColumnDef<AccessScopeDisplay>[] {
  return [
    ...(columns as ColumnDef<AccessScopeDisplay>[]),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const canEdit = row.original.source === "UI";
        return (
          <Menu as="div" className="relative">
            <Menu.Button
              className="rounded p-2 hover:bg-gray-100"
              aria-label="Access scope actions"
            >
              <FaEllipsisV />
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? "bg-gray-100" : ""} group flex w-full items-center px-4 py-2 text-sm`}
                    onClick={() => onEdit(row.original)}
                  >
                    <FaPencilAlt className="mr-2" />
                    {canEdit ? "Edit" : "View"}
                  </button>
                )}
              </Menu.Item>
              {canEdit && onDelete && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? "bg-gray-100" : ""} group flex w-full items-center px-4 py-2 text-sm text-red-600`}
                      onClick={() => onDelete(row.original.id)}
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              )}
            </Menu.Items>
          </Menu>
        );
      }
    })
  ];
}

export default function AccessScopesTable({
  data,
  isLoading,
  onEdit,
  onDelete
}: AccessScopesTableProps) {
  const tableColumns = createTableColumns(onEdit, onDelete);
  return (
    <DataTable
      columns={tableColumns}
      data={data}
      isLoading={isLoading}
      tableStyle={{ borderSpacing: "0" }}
    />
  );
}
