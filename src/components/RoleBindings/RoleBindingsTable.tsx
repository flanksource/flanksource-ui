import {
  RoleBindingDisplay,
  RoleBindingSubjects,
  roleBindingResourceSubjectKinds
} from "@flanksource-ui/api/types/roleBindings";
import { RbacObjectStatus } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

function plural(count: number, word: string) {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

// A short label per kind of subject, with obsolete subjects explicitly marked.
export function summarizeSubjects(subjects: RoleBindingSubjects = {}) {
  const labels: string[] = [];
  const people = subjects.people ?? [];
  if (people.includes("*")) {
    labels.push("all human users");
  } else if (people.length === 1) {
    labels.push(people[0]);
  } else if (people.length > 1) {
    labels.push(plural(people.length, "person").replace("persons", "people"));
  }
  (subjects.teams ?? []).forEach((team) => labels.push(`team ${team}`));
  (subjects.roles ?? []).forEach((role) => labels.push(`unsupported: ${role}`));
  (subjects.oidc ?? []).forEach((subject) =>
    labels.push(`${subject.provider} users`)
  );
  roleBindingResourceSubjectKinds.forEach((kind) => {
    const count = subjects[kind]?.length ?? 0;
    if (count > 0) {
      labels.push(`${count} ${kind}`);
    }
  });
  return labels;
}

const roleBindingsTableColumns: MRT_ColumnDef<RoleBindingDisplay>[] = [
  {
    header: "Name",
    id: "name",
    size: 100,
    accessorFn: (row) => row.name,
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
    header: "Role",
    id: "role",
    size: 80,
    accessorFn: (row) => row.role,
    Cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.role}</span>
        {row.original.deny && (
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
            Deny
          </span>
        )}
      </div>
    )
  },
  {
    header: "Subjects",
    id: "subjects",
    size: 150,
    accessorFn: (row) => summarizeSubjects(row.subjects).join(", "),
    sortingFn: "text",
    Cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {summarizeSubjects(row.original.subjects).map((label) => (
          <span
            key={label}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
          >
            {label}
          </span>
        ))}
      </div>
    )
  },
  {
    header: "Constraint",
    id: "constraint",
    size: 80,
    accessorFn: ({ constraint }) =>
      [constraint?.resource?.scopeRef, constraint?.target?.scopeRef]
        .filter(Boolean)
        .join(", "),
    sortingFn: "text",
    Cell: ({ row }) => {
      const { resource, target } = row.original.constraint ?? {};
      if (!resource && !target) {
        return <span className="text-sm text-gray-500">None</span>;
      }
      return (
        <div className="flex flex-col text-xs text-gray-700">
          {resource && <span>resource: {resource.scopeRef}</span>}
          {target && <span>target: {target.scopeRef}</span>}
        </div>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    size: 60,
    // Sorts objects that are in effect before those that aren't
    accessorFn: (row) => (row.error ? "Not in effect" : "Active"),
    Cell: ({ row }) => <RbacObjectStatus {...row.original} />
  },
  {
    header: "Created",
    id: "created",
    size: 40,
    accessorFn: (row) => row.created_at,
    sortingFn: "datetime",
    Cell: MRTDateCell
  },
  {
    header: "Updated",
    id: "updated",
    size: 40,
    accessorFn: (row) => row.updated_at,
    sortingFn: "datetime",
    Cell: MRTDateCell
  },
  {
    header: "Created By",
    id: "createdBy",
    size: 40,
    accessorFn: (row) =>
      row.source !== "UI" ? row.source : row.created_by?.name,
    sortingFn: "text",
    Cell: ({ row }) => {
      const { created_by, source, id } = row.original;
      if (source !== "UI") {
        return <CRDSource source={source} id={id} showMinimal />;
      }
      return <Avatar user={created_by} />;
    }
  }
];

type RoleBindingsTableProps = {
  data: RoleBindingDisplay[];
  isLoading: boolean;
  handleRowClick?: (row: RoleBindingDisplay) => void;
};

export default function RoleBindingsTable({
  data,
  isLoading,
  handleRowClick = () => {}
}: RoleBindingsTableProps) {
  return (
    <MRTDataTable
      columns={roleBindingsTableColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={handleRowClick}
    />
  );
}
